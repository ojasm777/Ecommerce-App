import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import UserMenu from "../../components/Layout/UserMenu.jsx";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../Context/auth.jsx";
import moment from "moment";

const Orders = () => {
  const [auth, setAuth] = useAuth();
  const [orders, setOrders] = useState([]);
  const endPoint = `${import.meta.env.VITE_REACT_APP_API}/api/v1`;
  // getting orders
  const getOrders = async () => {
    try {
      const { data } = await axios.get(`${endPoint}/auth/orders`);
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
  return (
    <>
      <Layout>
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <UserMenu />
            </div>
            <div className="col-md-9">
              <div className="card w-75 p-3">
                <h3 className="text-center">All Orders</h3>
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
                              <td>{o?.status}</td>
                              <td>{o?.buyer?.name}</td>
                              <td>{moment(o?.createAt).fromNow()}</td>
                              {<td>
                                {o?.payment?.success ? "Success" : "Failed"}
                              </td> }
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
                                <p>{curr.descreption.substring(0, 30)}</p>
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

export default Orders;

// import React, { useState, useEffect } from "react";
// import UserMenu from "../../components/Layout/UserMenu";
// import Layout from "./../../components/Layout/Layout";
// import axios from "axios";
// import { useAuth } from "../../Context/auth";
// import moment from "moment";

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [auth, setAuth] = useAuth();
//   const endPoint = `${import.meta.env.VITE_REACT_APP_API}/api/v1/auth/orders`;

//   const getOrders = async () => {
//     try {
//       const { data } = await axios.get(endPoint);
//       setOrders(data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (auth?.token) getOrders();
//   }, [auth?.token]);
//   return (
//     <Layout title={"Your Orders"}>
//       <div className="container-flui p-3 m-3 dashboard">
//         <div className="row">
//           <div className="col-md-3">
//             <UserMenu />
//           </div>
//           <div className="col-md-9">
//             <h1 className="text-center">All Orders</h1>
//             {orders?.map((o, i) => {
//               return (
//                 <div className="border shadow">
//                   <table className="table">
//                     <thead>
//                       <tr>
//                         <th scope="col">#</th>
//                         <th scope="col">Status</th>
//                         <th scope="col">Buyer</th>
//                         <th scope="col"> date</th>
//                         <th scope="col">Payment</th>
//                         <th scope="col">Quantity</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       <tr>
//                         <td>{i + 1}</td>
//                         <td>{o?.status}</td>
//                         <td>{o?.buyer?.name}</td>
//                         <td>{moment(o?.createAt).fromNow()}</td>
//                         <td>{o?.payment.success ? "Success" : "Failed"}</td>
//                         <td>{o?.products?.length}</td>
//                       </tr>
//                     </tbody>
//                   </table>
//                   <div className="container">
//                     {o?.products?.map((p, i) => (
//                       <div className="row mb-2 p-3 card flex-row" key={p._id}>
//                         <div className="col-md-4">
//                           <img
//                             src={`/api/v1/product/product-photo/${p._id}`}
//                             className="card-img-top"
//                             alt={p.name}
//                             width="100px"
//                             height={"100px"}
//                           />
//                         </div>
//                         <div className="col-md-8">
//                           <p>{p.name}</p>
//                           <p>{p.description.substring(0, 30)}</p>
//                           <p>Price : {p.price}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Orders;
