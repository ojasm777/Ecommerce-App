import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/auth.jsx";
import moment from "moment";
import { Select } from "antd";
const { Option } = Select;

const AdminOrders = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "deliverd",
    "cancel",
  ]);
  const [changeStatus, setChangeStatus] = useState("");
  const [auth, setAuth] = useAuth();
  const [orders, setOrders] = useState([]);
  const endPoint = `${import.meta.env.VITE_REACT_APP_API}/api/v1`;
  // getting orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${endPoint}/auth/all-orders`);
      setOrders(data);
    } catch (error) {
      console.log("Error in getting all the orders : ", error);
      toast.error("Error in getting all the orders");
    }
  };
  // To get in initial time
  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleChange = async (value, orderId) => {
    try {
        const {data} = await axios.put(`${endPoint}/auth/order-status/${orderId}`, {status: value});
        getOrders();
    } catch(error) {
        console.log(error);
    }
  }
  return (
    <>
      <Layout title="All Orders Data">
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu />
            </div>
            <div className="col-md-9">
              <h1 className="text-center">All Orders</h1>
              <div>
                {orders?.map((o, i) => {
                  return (
                    <>
                      <div className="border shadow">
                        {/* <table className="table">
                          <thead>
                            <tr>
                              <td scope="col">#</td>
                              <td scope="col">Status</td>
                              <td scope="col">Buyer</td>
                              <td scope="col">Date</td>
                              <td scope="col">Payment</td>
                              <td scope="col">Quantity</td>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <th>{i + 1}</th>
                              <th>{o?.status}</th>
                              <th>{o?.buyer?.name}</th>
                              <th>{moment(o?.createdAt).fromNow()}</th>
                              <th>
                                {o?.payment.success ? "Success" : "Failed"}
                              </th>
                              <th>{o?.products?.length}</th>
                            </tr>
                          </tbody>
                        </table> */}
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Status</th>
                              <th scope="col">Buyer</th>
                              <th scope="col"> date</th>
                              <th scope="col">Payment</th>
                              <th scope="col">Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{i + 1}</td>
                              <td>
                                <Select
                                  variant={false}
                                  onChange={(value) => handleChange(value, o._id)}
                                  defaultValue={o.status}
                                >
                                    {status.map((s, i) => (
                                        <Option key={i} value={s}>
                                            {s}
                                        </Option>
                                    ))}
                                </Select>
                              </td>
                              <td>{o?.buyer?.name}</td>
                              <td>{moment(o?.createAt).fromNow()}</td>
                              {
                                <td>
                                  {o?.payment?.success ? "Success" : "Failed"}
                                </td>
                              }
                              <td>{o?.products?.length}</td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="container">
                          {o?.products?.map((curr, i) => (
                            <div className="row p-3 mb-2 card flex flex-row">
                              <div className="col-md-4">
                                <img
                                  src={`${
                                    import.meta.env.VITE_REACT_APP_API
                                  }/api/v1/product/product-photo/${curr._id}`}
                                  className="card-img-top"
                                  alt={curr.name}
                                />
                              </div>
                              <div className="col-md-4">
                                <p>{curr.name}</p>
                                <p>{curr.description.substring(0, 30)}</p>
                                <p>Price : {curr.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AdminOrders;
