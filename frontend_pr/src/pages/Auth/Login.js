import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../UserContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ApiMutations } from "../../api/query";
import { useUserStore } from "../../store/UserStore";
import { Button } from "@mui/material";

const Login = () => {
  //   const [redirect,setRedirect]=useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setUserInfo } = useContext(UserContext);

  // const login=async (e)=>{
  //     e.preventDefault();
  //     const response= await fetch('http://localhost:4000/login',{
  //     method:'POST',
  //     body:JSON.stringify({username,password}),
  //     headers:{'Content-Type':'application/json'},
  //     credentials:'include'
  // });

  // if(response.ok){
  //     response.json().then(info=>{
  //     setUserInfo(info);
  //     setRedirect(true);
  // })
  // }
  // else{
  //     alert('Wrong credentials');
  // }
  // }

  // if(redirect){
  //     return <Navigate to='/requests' />
  // }
    const navigate=useNavigate();
  const setUser = useUserStore((state) => state.setUser);
  const setAuthToken = useUserStore((state) => state.setAuthToken);

  const user = useUserStore((state) => state.user);
  const authToken = useUserStore((state) => state.authToken);

  const { mutate: getLogin } = ApiMutations.useGetLogin();

  const login = (e) => {
    e.preventDefault();
    const payload = { username: username, password: password };
    getLogin(
      { payload },
      {
        onSuccess: (data) => {
          setUser(data.user);
          setAuthToken(data.token);
            navigate(`/requests`)
        },
      }
    );
  };

  return (
    <div className="login-page">
      <h1 className="login-heading">Sign in to account</h1>
      <div class="login-container">
        <form className="login-form" onSubmit={login}>
          <label htmlFor="exampleInputText" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="exampleInputText"
            aria-describedby="emailHelp"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="exampleInputPassword1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button variant="contained" color="success" sx={{marginTop:'15px'}} className="login-button" type="submit">
            Sign In
          </Button>
        </form>
      </div>
      <div class="signup">
        New to PR Approver?{" "}
        <Link to={"/register"} className="signup-link">
          Create an account
        </Link>
      </div>
    </div>
  );
};

export default Login;
