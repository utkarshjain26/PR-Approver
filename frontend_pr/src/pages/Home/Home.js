import React from "react";
import { Box, Button, Divider, Drawer, Typography } from "@mui/material";
const Home = () => {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <Box sx={{ width: "100%", height: "90vh", backgroundColor: "#24292e" }}>
      <Box
        sx={{
          height: "90%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h2" component="h2" color="white">
          Welcome to
        </Typography>
        <Typography variant="h1" component="h1" color="white">
          PR Approver
        </Typography>
        <Button
          disableElevation
          onClick={toggleDrawer(true)}
          variant="contained"
          sx={{
            padding: "10px 30px",
            marginTop: "2rem",
            borderRadius: "20px",
            backgroundColor: "#238636",
          }}
        >
          Open Drawer
        </Button>
      </Box>
      <Drawer anchor="bottom" open={open} onClose={toggleDrawer(false)}>
        <Box
          sx={{ height: 500, backgroundColor: "#24292e" }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" component="h4" color="white">
              About the Application
            </Typography>
            <Divider color="white" />
            <Box sx={{ padding: " 2rem 8rem", color: "#d5d5d5" }}>
              <Typography>
                <Typography variant="body1" component="h1" fontSize={"18px"}>
                  Our application provides user pull request system, that allows
                  you to create, edit, and send pull requests with ease. You can
                  choose between two modes:
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body1" component="p">
                      <strong>Parallel Approval:</strong> The pull request is
                      sent to all designated approvers simultaneously with real
                      time notificaitons. Each approver can independently add
                      comment, approve, or reject the request.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" component="p">
                      <strong>Sequential Approval:</strong> In this mode, the
                      request is sent to one approver at a time. Once the first
                      approver takes action (approve or reject), the request
                      moves to the next approver only if it gets approved. If
                      rejected at any stage, the pull request is considered
                      rejected overall.
                    </Typography>
                  </li>
                </ul>
              </Typography>
              <Typography>
                <Typography
                  variant="body1"
                  component="h1"
                  fontSize={"18px"}
                  mt={3}
                >
                  Our application features a dynamic notification system that
                  ensures you stay updated whether you're online or offline.
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body1" component="p">
                      <strong>Real-Time Alerts:</strong> While you're online,
                      you'll recieve real time notifications for any new request
                      directly on your screen.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body1" component="p">
                      <strong>Offline Notifications:</strong> If you're offline,
                      no need to worry! Once you're back online, all your missed
                      notifications will automatically appear in your
                      notification tab, ensuring you never miss important
                      updates.
                    </Typography>
                  </li>
                </ul>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Home;
