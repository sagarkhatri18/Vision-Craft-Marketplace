// import Dashboard from "./views/Dashboard";
// import Category from "./views/Category";
// import TableList from "views/TableList.js";
// import Typography from "views/Typography.js";
// import Icons from "views/Icons.js";
// import Maps from "views/Maps.js";
// import Notifications from "views/Notifications.js";
// import Upgrade from "views/Upgrade.js";

import {lazy} from "react";

const Dashboard = lazy(() => import("./views/Dashboard"));
const Category = lazy(() => import("./views/Category"));

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    element: Dashboard,
    layout: "/user"
  },
  {
    path: "/category",
    name: "Category",
    icon: "nc-icon nc-notes",
    element: Category,
    layout: "/user"
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
