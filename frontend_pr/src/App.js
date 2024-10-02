import {
  createBrowserRouter,
  Route,
  Routes,
  useHistory,
} from "react-router-dom";
import { UserContextProvider } from "./UserContext";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import ApprovedRequest from "./pages/Request/ApprovedRequest";
import RejectedRequests from "./pages/Request/RejectedRequest";
import PendingRequest from "./pages/Request/PendingRequest";
import ViewRequest from "./pages/Request/ViewRequest";
import CreateRequest from "./pages/Request/CreateRequest";
import EditRequest from "./pages/Request/EditRequest";
import Footer from "./shared/Footer";
import Header from "./shared/Header";
import HomeLogin from "./pages/Home/HomeLogin";
import NotificationPage from "./shared/NotificationPage";
import { useUserStore } from "./store/UserStore";

// const userInfo = useUserStore((state) => state.user);

const AppRouter = createBrowserRouter([
  {
    path: "/",
    element: <Header />,
    children: [
      {
        path:"",
        element:<Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <SignUp />,
      },
      {
        path: "requests",
        element: <HomeLogin />,
      },
      {
        path: "pull-request",
        element: <PendingRequest />,
      },
      {
        path: "pull-request-approved",
        element: <ApprovedRequest />,
      },
      {
        path: "pull-request-rejected",
        element: <RejectedRequests />,
      },
      {
        path: "pull-request/:id",
        element: <ViewRequest />,
      },
      {
        path: "edit-pull-request/:id",
        element: <RejectedRequests />,
      },
      {
        path: "newPullRequest",
        element: <CreateRequest />,
      },
      {
        path: "notifications",
        element: <NotificationPage />,
      },
    ],
  },
]);

export default AppRouter;
