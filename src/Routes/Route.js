import { createBrowserRouter } from "react-router-dom";
import LoginForm from "../Component/Login";
import Main from "../Layout/Main";
import SignUpForm from "../Component/Signup";
import HomePage from "../Pages/Homepage/Homepage";
import CheckInPage from "../Pages/Checkin/Checkin";
import Profile from "../Component/Profile";
import AdminDashboard from "../Pages/AdminDashboard/AdminDashboard";
import TodaysReport from "../Pages/AdminDashboard/TodaysReport";
import ViewReport from "../Pages/AdminDashboard/ViewReport";
import HolidayManagement from "../Pages/AdminDashboard/HolidayManagement";
import LeaveRequestPage from "../Pages/LeaveRequestPage";
import HistoryPage from "../Pages/HistoryPage";
import ApplicationsPage from "../Pages/AdminDashboard/ApplicationsPage";
import UserDashboard from "../Pages/UserDashboard";
import UserManagementPage from "../Pages/AdminDashboard/Users";
import DetailedSummary from "../Pages/AdminDashboard/DetailedSummary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <HomePage/>,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/check-in",
        element: <CheckInPage />,
      },
      {
        path: "/attendance",
        element: <CheckInPage />,
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/signup",
        element: <SignUpForm/>,
      },
      {
        path: "/profile",
        element: <Profile/>,
      },
      {
        path: "/leave-request",
        element: <LeaveRequestPage/>,
      },
      {
        path: "/leave-history",
        element: <HistoryPage/>,
      },
      {
        path: "/user-dashboard",
        element: <UserDashboard/>,
      },
      {
        path: "/admin",
        element: <TodaysReport/>,
      },
      {
        path: "/admin/monthly-summary",
        element: <AdminDashboard/>,
      },
      {
        path: "/admin/today-report",
        element: <TodaysReport/>,
      },
      {
        path: "/admin/view-report/:userId",
        element: <ViewReport/>,
      },
      {
        path: "/admin/monthly-details",
        element: <DetailedSummary/>,
      },
      {
        path: "/admin/applications",
        element: <ApplicationsPage/>,
      },
      {
        path: "/admin/user",
        element: <UserManagementPage/>,
      },
    ],
  },

]);

export default router;
