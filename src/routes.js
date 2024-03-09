import React from "react";
const TableList = React.lazy(() => import("views/TableList"));
const Typography = React.lazy(() => import("views/Typography"));
const Icons = React.lazy(() => import("views/Icons"));
const Maps = React.lazy(() => import("views/Maps"));
const Notifications = React.lazy(() => import("views/Notifications"));

const Dashboard = React.lazy(() => import("./views/pages/dashboard/Dashboard"));
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
const AddProduct = React.lazy(() => import("./views/pages/product/Create"));
const User = React.lazy(() => import("./views/pages/user/User"));
const AddUser = React.lazy(() => import("./views/pages/user/Create"));
const UpdateUser = React.lazy(() => import("./views/pages/user/Update"));

const All = ["customer", "admin", "all"];
const Admin = ["admin"];
const Customer = ["customer"];
const AdminCustomer = ["admin", "customer"]

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
    path: "/table",
    name: "Table List",
    sidebar: true,
    icon: "nc-icon nc-notes",
    element: TableList,
    access: All,
  },
  {
    path: "/typography",
    name: "Typography",
    sidebar: true,
    icon: "nc-icon nc-paper-2",
    element: Typography,
    access: All,
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-atom",
    sidebar: true,
    element: Icons,
    access: All,
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "nc-icon nc-pin-3",
    sidebar: true,
    element: Maps,
    access: All,
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    sidebar: true,
    element: Notifications,
    access: All,
  },
];

export default routes;
