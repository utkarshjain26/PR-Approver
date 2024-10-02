import { Button, ButtonGroup } from "@mui/material";
import { Link } from "react-router-dom";
import { useUserStore } from "../../store/UserStore";
import { useEffect } from "react";
import io from "socket.io-client";
import Header from "../../shared/Header";
// import {
//   connectSocket,
//   disconnectSocket,
//   getSocket,
// } from "../../services/SocketService";

const HomeLogin = () => {
  const user = useUserStore((state) => state.user);
  const authToken = useUserStore((state) => state.authToken);
  // const socket = useUserStore((state) => state.socket);

  
  // const connectSocket = useUserStore((state) => state.connectSocket);
  // const disconnectSocket = useUserStore((state) => state.disconnectSocket);

  // useEffect(()=>{
  //   connectSocket(authToken);
  //   return ()=>{
  //     disconnectSocket();
  //   }
  // },[authToken])


  // useEffect(() => {
  //   const socket = getSocket();
  //   socket?.on("connect", () => {
  //     console.log("Connected to server");
  //   });

  //   socket?.on("disconnect", () => {
  //     console.log("Disconnected from server");
  //   });

    
  // }, []);

  // useEffect(() => {
  //   const socket = getSocket();
  //   socket?.on("eventName", (msg) => {
  //     console.log(msg);
  //     console.log("yes this message is from server");
  //   });
  // }, []);

  return (
    <div className="home-body">
      <h1 className="home-heading">Current Requests</h1>
      <div className="home-show-btn">
        <ButtonGroup variant="contained" aria-label="Basic button group">
          <Link to="/pull-request">
            <Button
              variant="contained"
              color="primary"
              sx={{
                padding: "10px 30px",
                textTransform: "none",
                fontSize: "18px",
              }}
            >
              Pending
            </Button>
          </Link>
          <Link to="/pull-request-approved">
            <Button
              variant="contained"
              color="primary"
              sx={{
                padding: "10px 30px",
                textTransform: "none",
                fontSize: "18px",
              }}
            >
              Approved
            </Button>
          </Link>
          <Link to="/pull-request-rejected">
            <Button
              variant="contained"
              color="primary"
              sx={{
                padding: "10px 30px",
                textTransform: "none",
                fontSize: "18px",
              }}
            >
              Rejected
            </Button>
          </Link>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default HomeLogin;
