import { Link, Outlet } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { useUserStore } from "../store/UserStore";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Badge,
  Box,
  Button,
  IconButton,
  Snackbar,
  Tooltip,
} from "@mui/material";
import NotificationPage from "./NotificationPage";
import { ApiMutations, ApiQueries } from "../api/query";
import Footer from "./Footer";
import {
  disconnectSocket,
  initiateSocketConnection,
  subscribeToNotifications,
} from "../services/SocketService";
import CloseIcon from "@mui/icons-material/Close";
import toast, { Toaster } from "react-hot-toast";
import ArticleIcon from '@mui/icons-material/Article';


const Header = () => {
  const navigate = useNavigate();

  // const [selectedValue, setSelectedValue] = React.useState(emails[1]);
  const [newNotificationCount, setNewNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    // setSelectedValue(value);
  };

  const userInfo = useUserStore((state) => state.user);
  const authToken = useUserStore((state) => state.authToken);

  const logout = useUserStore((state) => state.logout);
  const handleLogout = () => {
    disconnectSocket();
    logout();
    navigate("/");
  };

  const {
    data: newNotifications,
    isFetched: isNewNotificationsFetched,
    isLoading: isNewNotificationsLoading,
  } = ApiQueries.useGetNewNotification({ id: userInfo?.userId });

  useEffect(() => {
    if (newNotifications && isNewNotificationsFetched) {
      setNewNotificationCount(newNotifications.length);
    }
  }, [newNotifications]);

  useEffect(() => {
    if (userInfo) {
      initiateSocketConnection("http://localhost:4000", userInfo?.userId);

      subscribeToNotifications((notification) => {
        setNotifications((prev) => [...prev, notification]);
      });

      return () => {
        disconnectSocket(); 
      };
    }
  }, [userInfo]);

  useEffect(() => {
    // setOpen(true);
    if (notifications.length>0) {
      notifications.forEach((notification) =>
        toast.success(`${notification}`, {
          position: "top-center",
          duration: 6000,
          style: {
            border: "1px solid grey",
            padding: "1rem 1rem",
            color: "white",
            backgroundColor: "#101217",
            width: "30rem",
            height: "auto",
          },
        })
      );

      const count=newNotificationCount;
      setNewNotificationCount(count+(notifications.length))
      setNotifications([]);
    }
    
  }, [notifications,newNotificationCount]);


  console.log("object", notifications);

  const username = userInfo?.userName;
  return (
    <div>
      <header>
        <nav
          className="nav-bar navbar navbar-expand-lg bg-body-tertiary"
          style={{ width: "100%" }}
        >
          <div className="container-fluid">
            <div className="logo">
              <Link to="/" style={{ textDecoration: "none", color: "#d5d5d5" }}>
                PR Approver
              </Link>
            </div>

            {username && (
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                      Hi,{" "}
                      {username.charAt(0).toUpperCase() +
                        username.slice(1).toLowerCase()}
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/requests"
                      style={{ textDecoration: "none", color: "#d5d5d5" }}
                    >
                    <Tooltip title="All Requests">
                        <ArticleIcon />
                      </Tooltip>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/newPullRequest"
                      style={{ textDecoration: "none", color: "#d5d5d5" }}
                    >
                      <Tooltip title="Create Pull Request">
                        <AddBoxIcon />
                      </Tooltip>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Box onClick={(e)=>{
                      setNewNotificationCount(0);
                      navigate('/notifications')
                    }}>
                      <Tooltip title="Notifications">
                        <Badge
                          badgeContent={newNotificationCount}
                          color="primary"
                        >
                          <NotificationsIcon
                            sx={{
                              textDecoration: "none",
                              color: "#d5d5d5",
                              cursor: "pointer",
                            }}
                            onClick={handleClickOpen}
                          />
                        </Badge>
                      </Tooltip>
                    </Box>
                  </li>
                  <li className="nav-item">
                    <a
                      href="#"
                      onClick={handleLogout}
                      style={{ textDecoration: "none", color: "#d5d5d5" }}
                    >
                      <Tooltip title="Logout">
                        <LogoutIcon />
                      </Tooltip>
                    </a>
                  </li>
                </ul>
              </div>
            )}

            {!username && (
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link
                      to="/login"
                      style={{ textDecoration: "none", color: "#d5d5d5" }}
                    >
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/register"
                      style={{ textDecoration: "none", color: "#d5d5d5" }}
                    >
                      Register
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </nav>
      </header>
      <Outlet />
      <Footer />
    </div>
  );
};

export default Header;

// <div className="collapse navbar-collapse" id="navbarSupportedContent">
//                 <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//                 <li className="nav-item">
//                     <Link to='/post' className="nav-link active" aria-current="page">Hi, {username.charAt(0).toUpperCase() +username.slice(1).toLowerCase()}</Link>
//                 </li>
//                 <li className="nav-item">
//                     <Link to='/newPost' className="nav-link" aria-current="page">Create New Post</Link>
//                 </li>
//                 <li className="nav-item">
//                     <a onClick={logout} className="nav-link" >Logout</a>
//                 </li>

//                 </ul>
//             </div>
