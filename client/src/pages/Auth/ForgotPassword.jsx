import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import "./style.css";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This is how you use .env variables in vite react
      const str = `${
        import.meta.env.VITE_REACT_APP_API
      }/api/v1/auth/forgot-password`;
      console.log(str);
      const response = await axios.post(str, {
        email,
        answer,
        newPassword,
      });
      if (response && response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
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
      <Layout title="Forgot-Password Ecommerce App">
        <div className="form-container">
          <h1>Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              {/* <label htmlFor="question-answer">
                Email
              </label> */}
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
              {/* <label htmlFor="question-answer">
                What fictional character do you wish was your best friend?
              </label> */}
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="form-control"
                id="exampleInputAnswer1"
                placeholder="Enter your favorite sports"
                required
              />
            </div>

            <div className="mb-3">
              {/* <label htmlFor="question-answer">
                New Password
              </label> */}
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control"
                id="exampleInputNewPassword1"
                placeholder="Enter your New Password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Reset Password
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default ForgotPassword;
