import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from 'react-hot-toast';
import axios from "axios";
import { useNavigate, useLocation} from "react-router-dom";
import '../../styles/auth.css';
import { useAuth } from "../../Context/auth.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This is how you use .env variables in vite react
      const str = `${import.meta.env.VITE_REACT_APP_API}/api/v1/auth/login`;
      // console.log(str);
      const response = await axios.post(str, {
        email,
        password
      });
      if (response && response.data.success) {
        toast.success(response.data.message);
        setAuth({
          ...auth,
          user : response.data.user,
          token : response.data.token
        })
        localStorage.setItem('auth', JSON.stringify(response.data));
        navigate(location.state || "/");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log("Error in Login", err);
      toast.error("Something went wrong");
    }
  };
  return (
    <>
      <Layout title="Register">
        <div className="form-container">
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="EmailHelp"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="d-flex flex-column gap-3">
              <button type="submit" className="btn btn-primary" onClick={() => {navigate('/forgot-password')}}>
                Forgot Password
              </button>
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default Login;
