import React from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../Context/auth";
const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <>
      <Layout>
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu/>
            </div>
            {/* As this is the contect part of the dashboard, by default we can show the user's details
            for this we need to import useAuth */}
            <div className="col-md-9">
              <div className="card w-75 p-3">
                <h3>Admin Name : {auth?.user?.name}</h3>
                <h3>Admin Email : {auth?.user?.email}</h3>
                <h3>Admin Phone : {auth?.user?.phone}</h3>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AdminDashboard;
