// src/Routes/router.jsx
import { createBrowserRouter } from "react-router-dom"; // make sure it's react-router-dom
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Home from "../Pages/Home";
import AuthLayout from "../Layout/AuthLayout";
import ErrorPage from "../Pages/ErrorPage"; // create this
import DashboardLayout from "../Dashboard/DashboardLayout";
import MainDashboard from "../Dashboard/MainDashboard";

import ManageProduct from "../Dashboard/ManageProduct/ManageProduct";
import AddRequest from "../Dashboard/AddProduct/AddRequest";
import AllUsers from "../Dashboard/AllUsers/AllUsers";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    errorElement: <ErrorPage />, // handle errors & 404
    children: [
      {
        index: true, // this means path="/" for the home page
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: 'dashboard',
    element:(<PrivateRoute> <DashboardLayout ></DashboardLayout></PrivateRoute>),
    children: [
      {
        path: '/dashboard',
        element: <MainDashboard />
      },
      {
        path: 'add-request',
        element: <AddRequest />
      },
      {
        path: 'manage-product',
        element: <ManageProduct />
      },
      {
        path: 'all-users',
        element: <AllUsers/>
      }
    ]
  }
]);

export default router;
