const { ProductImage } = require("../model/productImage.model");
const { Product } = require("../model/product.model");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const {
  productImageUploadPath,
  productImageUploadPathThumbnail,
} = require("../services/helper");

const fileUploadPath = `public/${productImageUploadPath}`;
const thumbnailUploadPath = `public/${productImageUploadPathThumbnail}`;

// Create the directory if it does not exist
if (!fs.existsSync(fileUploadPath)) {
  fs.mkdirSync(fileUploadPath, {
    recursive: true,
  });
}

if (!fs.existsSync(thumbnailUploadPath)) {
  fs.mkdirSync(thumbnailUploadPath, {
    recursive: true,
  });
}

// multer disk storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, fileUploadPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const fileSize = "5";
const maxSize = parseInt(fileSize) * 1024 * 1024;

// set upload options of multer
const upload = multer({
  storage: storage,
  // to filter the incoming file requests
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(
      path.extname(file.originalname).toLocaleLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
      return cb(null, true);
    } else {
      return cb("Only limited file extensions are allowed", false);
    }
  },
  limits: {
    fileSize: maxSize,
  },
}).single("image");

// upload product image one by one
exports.uploadImage = async (req, res, next) => {
  // works on uploading the file
  await upload(req, res, (err) => {
    if (err) {
      return res.status(400).send({
        success: false,
        message: `Something went wrong!`,
      });
    } else {
      if (req.file === undefined) {
        // check if the file exits
        return res.status(400).send({
          success: false,
          message: `Please select the file first`,
        });
      } else {
        sharp(`${fileUploadPath}/${req.file.filename}`)
          .resize(100, 100)
          .toFile(
            `${thumbnailUploadPath}/${req.file.filename}`,
            (err, resizeImage) => {
              if (err) {
                console.log(err);
              } else {
                console.log(resizeImage);
              }
            }
          );

        // upload image to the database
        const formData = {
          image: req.file.filename,
          mimeType: req.file.mimetype,
          fileSize: req.file.size,
          filePath: productImageUploadPath,
          addedBy: req.body.addedBy,
          productId: req.body.productId,
        };

        // check if any image exists before
        findIfAnyImageExists(req.body.productId)
          .then((exists) => {
            formData.isMain = !exists; // Set isMain to true if no image exists, otherwise false

            return ProductImage.create(formData);
          })
          .then(async (product) => {
            if (product.isMain) {
              // Update product data if the uploaded image is set as the main image
              await Product.findOneAndUpdate(
                { _id: req.body.productId },
                { image: product.image, filePath: product.filePath }
              );
            }

            return res.status(200).json({
              success: true,
              message: "Product Image has been successfully uploaded",
              data: product,
            });
          })
          .catch((err) => {
            console.error("Error uploading image:", err);
            return res.status(500).send({
              success: false,
              message: "Failed to upload the image",
            });
          });
      }
    }
  });
};

const findIfAnyImageExists = async (productId) => {
  try {
    const existingImages = await ProductImage.find({ productId });
    return existingImages.length > 0;
  } catch (error) {
    console.error("Error finding existing images:", error);
    return false;
  }
};

// fetch all images of product
exports.loadProductImages = async (req, res, next) => {
  console.log(findIfAnyImageExists(req.params.productId));
  try {
    const images = await ProductImage.find({
      productId: req.params.productId,
    })
      .populate("productId")
      .sort({
        createdAt: "descending",
      });
    return res.status(200).json(images);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Failed to load the images",
    });
  }
};

// delete product image from id
exports.deleteImage = async (req, res) => {
  const id = req.params.id;

  try {
    await ProductImage.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Product Image has been successfully deleted",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to delete the selected product image",
    });
  }
};

// update main image
exports.updateMainImage = async (req, res, next) => {
  const _id = req.params.id;
  const reqParam = req.body;

  try {
    // Update all images for the product to set isMain to false
    await ProductImage.updateMany(
      { productId: reqParam.productId },
      { isMain: false }
    );

    // Find the image with the given _id and update isMain to true
    const image = await ProductImage.findOneAndUpdate(
      { _id: _id },
      { isMain: true }
    );

    // Find the product and update its image and filePath
    const product = await Product.findOneAndUpdate(
      { _id: reqParam.productId },
      { image: image.image, filePath: image.filePath }
    );

    return res.status(200).json({
      success: true,
      message: "Image has been successfully updated",
      data: image,
    });
  } catch (err) {
    console.error("Error updating image:", err);
    return res.status(500).send({
      success: false,
      message: "Failed to update the selected image",
    });
  }
};
