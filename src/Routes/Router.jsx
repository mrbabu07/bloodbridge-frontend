// src/Routes/Router.jsx
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import AuthLayout from "../Layout/AuthLayout";
import ErrorPage from "../Pages/ErrorPage";
import Home from "../Pages/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import DonationRequest from "../Pages/Donate/DonationRequest";
import SearchRequest from "../Pages/SearchPage/SearchRequest";
import PaymentSuccess from "../Pages/PaymentSuccess/PaymentSuccess";
import PaymentFailed from "../Pages/PaymentFailed/PaymentFailed";
import DonationRequestDetails from "../Pages/Donate/DonationRequestDetails";
import Funding from "../Pages/Funding/Funding";

// Dashboard
import DashboardLayout from "../Dashboard/DashboardLayout";
import MainDashboard from "../Dashboard/MainDashboard";
import AddRequest from "../Dashboard/AddProduct/AddRequest";
import MyRequest from "../Dashboard/MyRequest/MyRequest";

import PrivateRoute from "./PrivateRoute";
import AllUsers from "../Dashboard/AllUsers/AllUsers";
import Profile from "../Dashboard/Profile/Profile";
import FundingPage from "../Pages/Funding/FundingPage";
import EditRequest from "../Dashboard/EditRequest/EditRequest";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "donation-request", element: <DonationRequest /> },
      { path: "search", element: <SearchRequest /> },
      { path: "payment-success", element: <PaymentSuccess /> },
      { path: "payment-failed", element: <PaymentFailed /> },
      {
        path: "donation-request/:id",
        element: (
          <PrivateRoute>
            <DonationRequestDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "funding",
        element: (
          <PrivateRoute>
            <Funding />
          </PrivateRoute>
        ),
      },
     
    ],
  },
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <MainDashboard /> },
      { path: "add-request", element: <AddRequest /> },
      { path: "my-request", element: <MyRequest /> },
      { path: "donation-request", element: <DonationRequest /> },
      { path: "all-users", element: <AllUsers /> },
      { path: "funding", element: <Funding /> },
      { path: "profile", element: <Profile /> },
      { path: "edit-request/:id", element: <EditRequest /> },
       {
        path: "funding-page",
        element: (
          <PrivateRoute>
            <FundingPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
