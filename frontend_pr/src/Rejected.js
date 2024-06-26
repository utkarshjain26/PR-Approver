import { useState,useEffect,useContext } from "react";
import { UserContext } from "./UserContext";
import Format from "./Format";

const Rejected = () => {
    const [posts,setPosts]=useState([]);
    const {userInfo,setRefresh,sock}=useContext(UserContext);
    const [flag,setFlag]=useState(false);

    const getPost=()=>fetch('http://localhost:4000/pull-request',{
        method:'GET',
        credentials:'include',
    }).then(response=>{
        response.json().then(post=>{
        setPosts(post);
        setRefresh(true);
        })
    });

    useEffect(()=>{
        getPost();
    },[posts])

  return (
    <div className="pull-body">
        
        
        {posts.length>0 && posts.filter(post=>(post.status==='Rejected')).map(post=>(
            <Format {...post} />
        ))} 
        
    </div>
  )
}

export default Rejected