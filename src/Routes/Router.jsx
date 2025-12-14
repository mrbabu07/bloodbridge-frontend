// src/Routes/router.jsx
import { createBrowserRouter } from "react-router-dom"; // make sure it's react-router-dom
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Home from "../Pages/Home";
import AuthLayout from "../Layout/AuthLayout";
import ErrorPage from "../Pages/ErrorPage"; // create this
import DashboardLayout from "../Dashboard/DashboardLayout";
import MainDashboard from "../Dashboard/MainDashboard";
import AddRequest from "../Dashboard/AddProduct/AddRequest";
import AllUsers from "../Dashboard/AllUsers/AllUsers";
import PrivateRoute from "./PrivateRoute";
import MyRequest from "../Dashboard/MyRequest/MyRequest";
import DonationRequest from "../Pages/Donate/DonationRequest";
import DonationRequestDetails from "../Pages/Donate/DonationRequestDetails";
import Funding from "../Pages/Funding/Funding";

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
      {
        path: "donation-request",
        element: <DonationRequest />,
      },
      {
        path: "/donation-request/:id",
        element: (
          <PrivateRoute>
            <DonationRequestDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/funding",
        element: (
          <PrivateRoute>
            <Funding></Funding>
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        {" "}
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <MainDashboard />,
      },
      {
        path: "add-request",
        element: <AddRequest />,
      },
      {
        path: "my-request",
        element: <MyRequest />,
      },
      {
        path: "all-users",
        element: <AllUsers />,
      },
    ],
  },
]);

export default router;
