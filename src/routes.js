import React from "react";

const Dashboard = React.lazy(() => import("./views/pages/dashboard/Dashboard"));
const CartItems = React.lazy(() => import("./views/pages/dashboard/CartItems"));
const Search = React.lazy(() => import("./views/pages/dashboard/Search"));
const ChangePassword = React.lazy(() =>
  import("./views/pages/login/ChangePassword")
);
const MyProfile = React.lazy(() =>
  import("./views/pages/user/MyProfile")
);
const Category = React.lazy(() => import("./views/pages/category/Category"));
const AddCategory = React.lazy(() => import("./views/pages/category/Create"));
const UpdateCategory = React.lazy(() =>
  import("./views/pages/category/Update")
);
const Product = React.lazy(() => import("./views/pages/product/Product"));
const MyProduct = React.lazy(() => import("./views/pages/product/MyProduct"));
const ProductDetail = React.lazy(() =>
  import("./views/pages/product/ProductDetail")
);
const ProductImageUpload = React.lazy(() =>
  import("./views/pages/product/ProductImage")
);
const AddProduct = React.lazy(() => import("./views/pages/product/Create"));
const UpdateProduct = React.lazy(() => import("./views/pages/product/Update"));
const User = React.lazy(() => import("./views/pages/user/User"));
const AddUser = React.lazy(() => import("./views/pages/user/Create"));
const UpdateUser = React.lazy(() => import("./views/pages/user/Update"));

// payment
const PaymentSuccess = React.lazy(() => import("./views/pages/payment/Success"));
const PaymentFail = React.lazy(() => import("./views/pages/payment/Fail"));

const All = ["customer", "admin", "all"];
const Admin = ["admin"];
const Customer = ["customer"];
const AdminCustomer = ["admin", "customer"];

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    sidebar: true,
    icon: "nc-icon nc-settings-gear-64",
    element: Dashboard,
    access: All,
  },
  {
    path: "/category",
    name: "Category",
    sidebar: true,
    icon: "nc-icon nc-notes",
    element: Category,
    access: Admin,
  },
  {
    path: "/category/create",
    name: "Add Category",
    sidebar: false,
    icon: "nc-icon nc-notes",
    element: AddCategory,
    access: Admin,
  },
  {
    path: "/category/update/:id",
    name: "Update Category",
    sidebar: false,
    icon: "nc-icon nc-notes",
    element: UpdateCategory,
    access: Admin,
  },
  {
    path: "/users",
    name: "User",
    sidebar: true,
    icon: "nc-icon nc-single-02",
    element: User,
    access: Admin,
  },
  {
    path: "/user/create",
    name: "Add New User",
    sidebar: false,
    icon: "nc-icon nc-notes",
    element: AddUser,
    access: Admin,
  },
  {
    path: "/user/update/:id",
    name: "Update User",
    sidebar: false,
    icon: "nc-icon nc-notes",
    element: UpdateUser,
    access: Admin,
  },
  {
    path: "/product",
    name: "Products",
    sidebar: true,
    icon: "nc-icon nc-album-2",
    element: Product,
    access: Admin,
  },
  {
    path: "/product/create",
    name: "Add Product",
    sidebar: false,
    icon: "nc-icon nc-notes",
    element: AddProduct,
    access: AdminCustomer,
  },
  {
    path: "/product/update/:id",
    name: "Update Product",
    sidebar: false,
    icon: "nc-icon nc-notes",
    element: UpdateProduct,
    access: AdminCustomer,
  },
  {
    path: "/product/my",
    name: "My Products",
    sidebar: true,
    icon: "nc-icon nc-notes",
    element: MyProduct,
    access: Customer,
  },
  {
    path: "/product/:id",
    name: "Product Detail",
    sidebar: false,
    icon: "nc-icon nc-notes",
    element: ProductDetail,
    access: All,
  },
  {
    path: "/product/image/:id",
    name: "Product Image",
    sidebar: false,
    icon: "nc-icon nc-notes",
    element: ProductImageUpload,
    access: AdminCustomer,
  },
  {
    path: "/product/search",
    name: "Product Search",
    sidebar: true,
    icon: "nc-icon nc-zoom-split",
    element: Search,
    access: All,
  },
  {
    path: "/cart-items",
    name: "Add To Cart",
    sidebar: false,
    icon: "nc-icon nc-notes",
    element: CartItems,
    access: Customer,
  },
  {
    path: "/change-password",
    name: "Change Password",
    sidebar: false,
    icon: "nc-icon nc-notes",
    element: ChangePassword,
    access: Customer,
  },
  {
    path: "/my-profile",
    name: "My Profile",
    sidebar: false,
    icon: "nc-icon nc-notes",
    element: MyProfile,
    access: Customer,
  },
  {
    path: "/payment-success/:orderId",
    name: "Payment Success",
    sidebar: false,
    icon: "nc-icon nc-notes",
    element: PaymentSuccess,
    access: Customer,
  },
  {
    path: "/payment-fail",
    name: "Payment Fail",
    sidebar: false,
    icon: "nc-icon nc-notes",
    element: PaymentFail,
    access: Customer,
  },
];

export default routes;
