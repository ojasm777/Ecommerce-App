import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";

// rest import after backend
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";

// after we create all the categories in the backend we come her and create a way to show all
// categories in the frontend

const CreateCategory = () => {
  const endPoint = `${import.meta.env.VITE_REACT_APP_API}/api/v1/category`;
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  // handle delete
  const handleDelete = async (pId) => {
    try {
      const {data} = await axios.delete(`${endPoint}/delete-category/${pId}`);
      if (data?.success) {
        toast.success(`Deleted the category`);
        getAllCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error in handleDelte : ", error);
      toast.error("Error in handleDelte");
    }
  };

  // handle update submit
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // console.log(e);
      // Now we need to add update api in this, so that whenever we hit submit the name gets updated
      const { data } = await axios.put(
        `${endPoint}/update-category/${selected._id}`,
        { name: updatedName }
      );
      // console.log(selected._id);
      if (data?.success) {
        // toast.success(`Name updated to ${updatedName}`);
        toast.success(`Name updated to ${updatedName}`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error in handleUpdate : ", error);
      toast.error("Error in handleUpdate");
    }
  };
  // handle Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${endPoint}/create-category`, {
        name,
      });
      if (data?.success) {
        toast.success(`${name} is created`);
        // console.log(e.value);
        setName("");
        getAllCategories();
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log("Error in submitting the form : ", error);
      toast.error("Something went wrong in submitting the form");
    }
  };

  // get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${endPoint}/get-category`);
      // console.log(data?.category);
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log("Error in getting all categories in jsx : ", error);
      toast.error("Something went wrong in getting categories");
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <>
      <Layout title="Dashbaord - Create Category">
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu />
            </div>
            <div className="col-md-9">
              <div className="card w-75 p-3">
                <h1>Categories</h1>
                <div className="p3 w-50">
                  <CategoryForm
                    handleSubmit={handleSubmit}
                    value={name}
                    setValue={setName}
                  />
                </div>
                <div className="w-75">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories?.map((c) => (
                        <>
                          <tr>
                            <td key={c._id}>{c.name}</td>
                            <td>
                              <button
                                className="btn btn-primary ms-2"
                                onClick={() => {
                                  setVisible(true);
                                  setUpdatedName(c.name);
                                  setSelected(c);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger ms-2"
                                onClick={() => {
                                  handleDelete(c._id);
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <Modal
                onCancel={() => setVisible(false)}
                footer={null}
                open={visible}
              >
                <CategoryForm
                  value={updatedName}
                  setValue={setUpdatedName}
                  handleSubmit={handleUpdate}
                />
              </Modal>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default CreateCategory;
