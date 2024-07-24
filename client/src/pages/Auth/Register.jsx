import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from 'react-hot-toast';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../styles/auth.css';
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [answer, setAnswer] = useState("");
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  // console.log(JSON.stringify(import.meta.env.VITE_REACT_APP_API));
  // console.log(`${import.meta.env.VITE_REACT_APP_API}/api/v1/auth/register`);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This is how you use .env variables in vite react
      const str = `${import.meta.env.VITE_REACT_APP_API}/api/v1/auth/register`;
      console.log(str);
      const response = await axios.post(str, {
        name,
        email,
        phone,
        address,
        answer,
        password,
      });
      if (response && response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.log("Error in Registeration", err);
      toast.error("Something went wrong");
    }
  };
  return (
    <>
      <Layout title="Register">
        <div className="form-container">
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">

              <input
                type="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                id="exampleInputName1"
                aria-describedby="NameHelp"
                placeholder="Enter your full Name"
                required
              />
            </div>
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
                type="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-control"
                id="exampleInputPhone1"
                aria-describedby="PhoneHelp"
                placeholder="Enter your Phone number"
                required
              />
            </div>
            <div className="mb-3">

              <input
                type="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control"
                id="exampleInputAddress1"
                aria-describedby="AddressHelp"
                placeholder="Enter your address"
                required
              />
            </div>
            <div className="mb-3">

              <input
                type="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="form-control"
                id="exampleInputAnswer1"
                placeholder="What is your favorite sports"
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
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default Register;
