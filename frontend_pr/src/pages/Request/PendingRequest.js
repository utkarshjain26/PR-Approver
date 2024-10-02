import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PullRequest from "../components/PullRequest";
import Notification from "../../shared/Notification";
import { ApiQueries } from "../../api/query";
import { useUserStore } from "../../store/UserStore";
import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const { io } = require("socket.io-client");
const socket = io("http://localhost:4000");

const PendingRequest = () => {
  const [posts, setPosts] = useState([]);
  const [flag, setFlag] = useState(false);
  const [open, setOpen] = useState(false);
  // const [notification, setNotification] = useState([]);

  const user = useUserStore((state) => state.user);
  const authToken = useUserStore((state) => state.authToken);
  // const notification = useUserStore((state) => state.notification);

  // const setNotification = useUserStore((state) => state.setNotification);

  // useEffect(() => {
  //   socket.on(`parallel${user.userId}`, (message) => {
  //     setNotification(message);
  //   });
  // }, [socket]);

  // console.log("notification array", notification);

  // useEffect(() => {
  //   socket.on(`sequential${user.userId}`, (message) => {
  //     setNotification(message);
  //   });
  // }, [socket]);

  const {
    data: requestData,
    isFetched: isRequestDataFetched,
    isLoading: isRequestDataLoading,
  } = ApiQueries.useGetRequests();
  //   const handleClose = () => setPopupOpen(false);

  useEffect(() => {
    if (requestData && isRequestDataFetched) {
      setPosts(requestData);
    }
  }, [requestData]);

  

  const pendingPosts = posts.filter((post) => post.status === "Pending");

  return (
    <div className="pull-body">
      {pendingPosts.length === 0 && (
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "80vh",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            component="h4"
            sx={{ color: "#d5d5d5", fontWeight: "600" }}
          >
            Nothing to Display!
          </Typography>
        </Box>
      )}
      {pendingPosts.length > 0 &&
        pendingPosts.map((post) => <PullRequest {...post} />)}
    </div>
  );
};

export default PendingRequest;
