import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";

// After backend
import axios from "axios";
import toast from "react-hot-toast";
import { Select } from "antd";
import {useNavigate, useParams} from "react-router-dom";
const { Option } = Select;

const UpdateProduct = () => {
    const navigate = useNavigate();
    const params = useParams(); // taaki hum urls ko get kar paaye
    const endPoint = `${import.meta.env.VITE_REACT_APP_API}/api/v1`;
    // multiple states needed
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [photo, setPhoto] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [shipping, setShipping] = useState("");
    const [id, setId] = useState("");


    // get single product
    const getSingleProduct = async () => {
        try {
            const {data} = await axios.get(`${endPoint}/product/get-product/${params.slug}`);
            setCategory(data.product.category._id);
            setName(data.product.name);
            setId(data.product._id);
            setDescription(data.product.description);
            setPrice(data.product.price);
            setQuantity(data.product.quantity);

        } catch (error) {
            console.log("Error in getting single product : ", error);
            toast.error("Error in getting single product");
        }
    }

    useEffect(() => {
        getSingleProduct();
        // eslint-disable-next-line
    }, []);
    // get all categories
    const getAllCategories = async () => {
      try {
        const { data } = await axios.get(`${endPoint}/category/get-category`);
        if (data?.success) {
          setCategories(data?.category);
        } else {
          toast.error(data?.message);
        }
      } catch (error) {
        console.log("Error in getAllCategories : ", error);
        toast.error("Error in getAllCategories");
      }
    };

    useEffect(() => {
      getAllCategories();
    }, []);

    // UPDATE PRODUCT submit
    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        // We get formData in browser by default
        const productData = new FormData();
        productData.append("name", name);
        productData.append("description", description);
        productData.append("price", price);
        productData.append("quantity",quantity);
        photo && productData.append("photo", photo);
        productData.append("category", category);
        const { data } = await axios.put(`${endPoint}/product/update-product/${id}`, productData);
        if(data?.success){
          toast.success("Product Updated successfully");
          navigate('/dashboard/admin/products');
        } else {
          toast.error(data?.messaage);
        }
      } catch (error) {
        console.log("Error in updating product : ", error);
        toast.error("Error in updating product");
      }
    };

    // handle delete
    const handleDelete = async (e) => {
      e.preventDefault();
      try {
        let answer = window.prompt("Are you sure you want to delete this product? ");
        if(answer in ["no", "No", 0]) return;
        const {data} = await axios.delete(`${endPoint}/product/delete-product/${id}`);
        if(data?.success){
          toast.success("Product deleted successfully");
          navigate('/dashboard/admin/products');
        } else {
          toast.error("Error in updating the product");
        }
      } catch (error) {
        console.log("Error in deleting product : ", error);
        toast.error("Error in deleting product");
      }
    }
    return (
        <>
      <Layout title="Dashboard - Update Product">
        <div className="container-fluid m-3 p-3">
          <div className="row">
            <div className="col-md-3">
              <AdminMenu />
            </div>
            <div className="col-md-9">
              <div className="card w-75 p-3">
                <h1>Update Product</h1>
                <div className="m-1">
                  <Select
                    variant={false}
                    placeholder={"Select a category"}
                    size="large"
                    showSearch
                    className="form-select mb-3"
                    onChange={(value) => {
                      setCategory(value);
                    }}
                    value={category}
                    >
                    {categories?.map((c) => (
                      <Option key={c._id} value={c._id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                  <div className="mb-3">
                    <label className="btn btn-outline-secondary col-md-12">
                      {photo ? photo.name : "Upload Photo"}
                      <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={(e) => setPhoto(e.target.files[0])}
                        hidden
                      />
                    </label>
                  </div>
                  <div className="mb-3">
                    {photo ? (
                      <div className="text-center">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt="product-photo"
                          height={"200px"}
                          className="img img-responsive"
                        />
                      </div>
                    ) : (
                      <div className="text-center">
                        <img
                          src={`${import.meta.env.VITE_REACT_APP_API}/api/v1/product/product-photo/${id}`}
                          alt="product-photo"
                          height={"200px"}
                          className="img img-responsive"
                        />
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      value={name}
                      placeholder="Write a Name"
                      className="form-control"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      type="text"
                      value={description}
                      placeholder="Write description of the product"
                      className="form-control"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      value={price}
                      placeholder="Enter the price of the product"
                      className="form-control"
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      value={quantity}
                      placeholder="Enter the quantity of the product"
                      className="form-control"
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <Select
                      variant={false}
                      placeholder="Select shipping"
                      size="large"
                      showSearch
                      className="form-select mb-3"
                      onChange={(value) => setShipping(value)}
                      value={ shipping ? "Yes" : "No"}
                    >
                      <Option value={"0"}>No</Option>
                      <Option value={"1"}>Yes</Option>
                    </Select>
                  </div>
                  <div className="mb-3 flex gap-3">
                    <button className="btn btn-primary" onClick={handleUpdate}>
                      UPDATE PRODUCT
                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>
                      DELETE PRODUCT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default UpdateProduct
