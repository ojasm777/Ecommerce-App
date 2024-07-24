import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useCart } from "../Context/Cart";
import { useAuth } from "../Context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/cartStyles.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState(""); // api ke saath milta hai
  const [instance, setInstance] = useState(""); // brainTree ki api se milta hai
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const endPoint = `${import.meta.env.VITE_REACT_APP_API}/api/v1`;
  // total
  const totalPrice = () => {
    try {
      let sum = 0;
      cart?.map((item) => {
        sum = sum + item.price;
      });
      return sum.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log("Error in calculating total : ", error);
    }
  };
  // remove item from the cart
  const removeCartItem = (id) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === id);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", myCart);
    } catch (error) {
      console.log("Error in removing item from cart : ", error);
    }
  };

  // get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get(`${endPoint}/product/braintree/token`);
      setClientToken(data?.clientToken); // client token api se milta hai
    } catch (error) {
      console.log("Error in getting token : ", error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]); // login hai tabhi access karo

  // payment button handle
  const handlePayment = async (e) => {
    // e.preventDefault();
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post(
        `${endPoint}/product/braintree/payments`,
        {
          nonce,
          cart,
        }
      );
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment successfull");
    } catch (error) {
      console.log("Error in making payment : ", error);
      toast.error("Error in making payment");
      setLoading(false);
    }
  };

  return (
    <Layout title="Cart Page">
      <div className="container cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth.user
                ? "Hello User"
                : `Hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length > 0
                ? `You have ${cart?.length} ${
                    cart?.length == 1 ? "Item" : "Items"
                  } in your cart ${
                    auth?.token ? " " : "Please Login to checkout"
                  } `
                : "Your Cart is empty"}
            </h4>
          </div>
        </div>
        <div className="row">
          <div className="col-md-7 p-0 m-0">
            {cart?.map((curr) => (
              <div key={curr._id} className="row card flex flex-row">
                <div className="col-md-4">
                  <img
                    src={`${
                      import.meta.env.VITE_REACT_APP_API
                    }/api/v1/product/product-photo/${curr._id}`}
                    className="card-img-top"
                    alt={curr.name}
                    width="100%"
                    height={"130px"}
                  />
                </div>
                <div className="col-md-4">
                  <p>{curr.name}</p>
                  <p>{curr.descreption.substring(0, 30)}</p>
                  <p>Price : {curr.price}</p>
                </div>
                <div className="col-md-4 cart-remove-btn">
                  <button
                    className="btn btn-danger"
                    onClick={() => removeCartItem(curr._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-5 cart-summary text-center">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {totalPrice()}</h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3"></div>
                <h4>Current Address</h4>
                <h5>{auth?.user?.address}</h5>
                <button
                  className="btn btn-outline-warning"
                  onClick={() => {
                    navigate(`/dashboard/user/profile`);
                  }}
                >
                  Update Address
                </button>
              </>
            ) : (
              <>
                <div className="mb3">
                  {auth?.token ? (
                    <>
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => {
                          navigate(`/dashboard/user/profile`);
                        }}
                      >
                        Update Address
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => {
                          navigate(`/login`, { state: "/cart" });
                        }}
                      >
                        Please Login to Checkout
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
            <div className="mt-2">
              {!clientToken || !cart?.length ? (
                ""
              ) : (
                <>
                  <DropIn
                    options={{
                      authorization: clientToken,
                      paypal: {
                        flow: "vault",
                      },
                    }}
                    onInstance={(instance) => setInstance(instance)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handlePayment}
                    disabled={loading || !instance || !auth?.user?.address}
                  >
                    {loading ? "Processing" : "Make Payment"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
