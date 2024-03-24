const { productOrder } = require("../model/productOrder.model");
const { productOrderDetail } = require("../model/productOrderDetail.model");
const { cartItem } = require("../model/cartItem.model");
const { generateOrderNumber } = require("../services/helper");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// find order details
exports.findProductOrder = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const foundOrder = await productOrder.findOne({ orderId });

    if (!foundOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Product order not found" });
    }

    return res.status(200).json({ success: true, data: foundOrder });
  } catch (error) {
    console.error("Error finding product order:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error finding product order" });
  }
};

exports.checkoutSession = async (req, res, next) => {
  const { products, shippingCost, hst, baseURL } = req.body;
  const orderDetails = req.body.productOrder;
  let productOrderId = null;

  const lineItems = products.map((product) => ({
    price_data: {
      currency: "cad",
      product_data: {
        name: product.name,
        images: [product.image],
      },
      unit_amount: Math.round(product.price * 100),
    },
    quantity: product.quantity,
  }));

  // Add shipping cost and HST as line items
  lineItems.push(
    {
      price_data: {
        currency: "cad",
        product_data: {
          name: "Shipping Cost",
        },
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1, // Assuming one unit of shipping
    },
    {
      price_data: {
        currency: "cad",
        product_data: {
          name: "HST",
        },
        unit_amount: Math.round(hst * 100),
      },
      quantity: 1, // Assuming one unit of HST
    }
  );

  try {
    // First add the product order into the database
    const productOrderData = {
      orderId: generateOrderNumber,
      paymentStatus: "paid",
      orderedThrough: orderDetails.orderedThrough,
      orderedUserDetails: orderDetails.orderedUserDetails,
      total: orderDetails.total,
      subTotal: orderDetails.subTotal,
      shippingCharge: orderDetails.shippingCharge,
      hstCharge: orderDetails.hstCharge,
      customerName: orderDetails.customerName,
      customerContact: orderDetails.customerContact,
      customerAddress: orderDetails.customerAddress,
      userId: orderDetails.userId,
    };

    const productOrderResult = await productOrder.create(productOrderData);
    productOrderId = productOrderResult._id;

    const orderDetailsData = products.map((product) => {
      const subTotal = Math.round(product.price * product.quantity * 100) / 100; // Calculate sub total
      const hstCharge = Math.round(subTotal * 0.13 * 100) / 100; // Calculate HST charge
      const total = parseFloat(subTotal) + hstCharge; // Calculate total amount

      return {
        productName: product.name,
        productImage: product.image,
        slug: product.slug,
        categoryName: product.category,
        price: product.price,
        quantity: product.quantity,
        subTotal: subTotal,
        total: total,
        hstCharge: hstCharge,
        productId: product.id,
        orderId: productOrderId,
      };
    });

    await productOrderDetail.create(orderDetailsData);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      billing_address_collection: "auto",
      success_url: baseURL + "/payment-success/" + productOrderData.orderId,
      cancel_url: baseURL + "/payment-fail",
      locale: "en", // Set locale to English
    });

    // empty the cart items if orderedThrough cart_items
    if (
      orderDetails.orderedThrough == "cart_items" &&
      orderDetails.userId != ""
    )
      await cartItem.deleteMany({ userId: orderDetails.userId });

    return res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);

    // If an error occurs, delete any data that was added
    try {
      await productOrder.deleteOne({ _id: productOrderId });
      await productOrderDetail.deleteMany({ orderId: productOrderId });
    } catch (deleteError) {
      console.error("Error deleting added data:", deleteError);
    }

    return res.status(500).json({ error: error });
  }
};
