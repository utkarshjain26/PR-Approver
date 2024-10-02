import { useState,useEffect,useContext } from "react";
import { UserContext } from "../../UserContext";
import PullRequest from "../components/PullRequest";
import { ApiQueries } from "../../api/query";
import { Box, Typography } from "@mui/material";

const ApprovedRequest = () => {
    const [posts,setPosts]=useState([]);

    const {data:postData, isFetched:isPostDataFetched, isLoading:isPostDataLoading}=ApiQueries.useGetRequests();

    useEffect(()=>{
        if(postData && isPostDataFetched){
            setPosts(postData);
        }
    },[postData])

    const approvedRequests=posts.filter(post=>(post.status==='Approved'));
  return (
    <div className="pull-body">
    {approvedRequests.length === 0 && (
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
        {approvedRequests.length>0 && approvedRequests.map(post=>(
            <PullRequest {...post} />
        ))} 
    </div>
  )
}

export default ApprovedRequest;