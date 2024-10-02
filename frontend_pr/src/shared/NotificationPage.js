import {
  Box,
  Dialog,
  Divider,
  Grid,
  ListItemIcon,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ApiMutations, ApiQueries } from "../api/query";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { formatDistanceToNow } from "date-fns";
import { TimeAgo } from "../services/TimeFormat";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useUserStore } from "../store/UserStore";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate=useNavigate();
  const userInfo = useUserStore((state) => state.user);

  const {
    data: notificationData,
    isFetched: isNotificationDataFetched,
    isLoading: isNotificationDataLoading,
  } = ApiQueries.useGetNotifications();

  const {mutate:updateNotificationStatus}=ApiMutations.useUpdateNotificationStatus();
  useEffect(() => {
    if (notificationData && isNotificationDataFetched) {
      setNotifications(notificationData);
      console.log(notificationData);
    }
  }, [notificationData]);

  const { mutate: updateLastCheckTime } = ApiMutations.useUpdateLastCheckTime();

  useEffect(() => {
    if (userInfo) {
      const payload = {
        lastCheckTime: Date.now(),
      };

      updateLastCheckTime(
        { id: userInfo.userId, payload },
        {
          onSuccess: () => {
            console.log("Last time updated in user");
          },
        }
      );
    }
  }, [userInfo]);

  const handleReadStatus=(id,requestId)=>{
    updateNotificationStatus({id},{
      onSuccess:()=>{
        navigate(`/pull-request/${requestId}`)
      },
      onError:()=>{
        alert(`Unable to open notification. Try again!`)
      }
    })
  }
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#161b22",
        height: "90vh",
        overflowY: "scroll",
      }}
    >
      <List sx={{ py: 2, px: 2, width: "40rem" }}>
        {notifications &&
          notifications.map((notification) => (
            <>
              <Link onClick={()=>handleReadStatus(notification._id,notification.requestId)} style={{ textDecoration: "none" }}>
                <Box
                  sx={{
                    width: "100%",
                    border: "3px solid #30363d",
                    padding: "1rem 1rem",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    backgroundColor:notification.readStatus?"":"#303030",
                    "&:hover": {
                      backgroundColor: "#1f1f1f", // Change background color on hover
                    },
                  }}
                >
                  <Grid container alignItems="center">
                    {!notification.readStatus && (
                      <Grid item xs={0.5}>
                        <FiberManualRecordIcon
                          sx={{ color: "#107ae1", fontSize: "10px" }}
                        />
                      </Grid>
                    )}

                    <Grid item xs={notification.readStatus ? 11.5 : 11}>
                      <Typography sx={{ color: "white" }}>
                        {notification.message}
                      </Typography>
                    </Grid>
                    <Grid item xs={0.5}>
                      <Typography sx={{ fontSize: "12px", color: "white" }}>
                        {TimeAgo(notification.createdAt)}
                      </Typography>
                    </Grid>

                  </Grid>
                </Box>
                <Divider color="black" />
              </Link>
            </>
          ))}
      </List>
    </Box>
  );
};

export default NotificationPage;
