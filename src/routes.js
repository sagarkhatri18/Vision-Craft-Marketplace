import React from "react";

const Dashboard = React.lazy(() => import("./views/Dashboard"));
const Category = React.lazy(() => import("./views/pages/category/Category"));
const AddCategory = React.lazy(() =>
  import("./views/pages/category/Create")
);
const UpdateCategory = React.lazy(() =>
  import("./views/pages/category/Update")
);

const All = ["customer", "admin"];
const Admin = ["admin"];
const Customer = ["customer"];

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    sidebar: true,
    icon: "nc-icon nc-chart-pie-35",
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
  // {
  //   path: "/table",
  //   name: "Table List",
  //   icon: "nc-icon nc-notes",
  //   component: TableList,
  //   layout: "/admin"
  // },
  // {
  //   path: "/typography",
  //   name: "Typography",
  //   icon: "nc-icon nc-paper-2",
  //   component: Typography,
  //   layout: "/admin"
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "nc-icon nc-atom",
  //   component: Icons,
  //   layout: "/admin"
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "nc-icon nc-pin-3",
  //   component: Maps,
  //   layout: "/admin"
  // },
  // {
  //   path: "/notifications",
  //   name: "Notifications",
  //   icon: "nc-icon nc-bell-55",
  //   component: Notifications,
  //   layout: "/admin"
  // }
];

export default routes;
