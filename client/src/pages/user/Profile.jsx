import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../Context/auth";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  // context
  const [auth, setAuth] = useAuth();
  // state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // get User data
  useEffect(() => {
    const {name, phone, address, email} = auth?.user;
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
  }, [auth?.user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // This is how you use .env variables in vite react
      const str = `${import.meta.env.VITE_REACT_APP_API}/api/v1/auth/profile`;
      const {data} = await axios.put(str, {
        name,
        email,
        password,
        phone,
        address,
      });
      if(data?.success){
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem('auth');
        // JSON.parse is used to convert a string to a JS object
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem('auth', JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      } else {
        toast.error(data?.error);
      }
    } catch (err) {
      console.log("Error in Registeration", err);
      toast.error("Something went wrong");
    }
  };
  return (
    <>
      <Layout title="Your Profile">
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <UserMenu />
            </div>
            <div className="col-md-9">
              <div className="card w-75 p-3">
                <h3>Profile</h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    {/* <label style={{marginLeft : "3.5px", fontWeight : "500", fontSize : "18px"}}>Name</label> */}
                    <input
                      type="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                      id="exampleInputName1"
                      aria-describedby="NameHelp"
                      placeholder="Enter your full Name"
                      />
                  </div>
                  <div className="mb-3">
                    {/* <label style={{marginLeft : "3.5px", fontWeight : "500", fontSize : "18px"}}>Email</label> */}
                    <input
                      type="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="EmailHelp"
                      placeholder="Enter your email"
                      disabled
                      />
                  </div>
                  <div className="mb-3">
                    {/* <label style={{marginLeft : "3.5px", fontWeight : "500", fontSize : "18px"}}>Phone</label> */}
                    <input
                      type="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-control"
                      id="exampleInputPhone1"
                      aria-describedby="PhoneHelp"
                      placeholder="Enter your Phone number"
                      />
                  </div>
                  <div className="mb-3">
                    {/* <label style={{marginLeft : "3.5px", fontWeight : "500", fontSize : "18px"}}>Address</label> */}
                    <input
                      type="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="form-control"
                      id="exampleInputAddress1"
                      aria-describedby="AddressHelp"
                      placeholder="Enter your address"
                      />
                  </div>
                  <div className="mb-3">
                    {/* <label style={{marginLeft : "3.5px", fontWeight : "500", fontSize : "18px"}}>Password</label> */}
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      id="exampleInputPassword1"
                      placeholder="Enter your password"
                      />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    UPDATE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Profile; 