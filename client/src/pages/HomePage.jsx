import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import toast from "react-hot-toast";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/Cart";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/homePage.css";

const HomePage = () => {
  const endPoint = `${import.meta.env.VITE_REACT_APP_API}/api/v1`;
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useCart();

  // get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${endPoint}/category/get-category`);
      console.log(data?.category);
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
    getTotal();
  }, []);

  // get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${endPoint}/product/product-list/${page}`
      );
      setLoading(false);
      if (data?.success) {
        setProducts(data?.products);
      } else {
        toast.error("Error in getting products");
      }
    } catch (error) {
      setLoading(false);
      console.log("Error in getting all products : ", error);
      toast.error("Error in getting all products!");
    }
  };
  useEffect(() => {
    if (!checked.length && !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked?.length || radio?.length) filterProduct();
  }, [checked, radio]);

  // filter by category
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id); // means checking it and adding it to the array
    } else {
      all = all.filter((c) => c !== id); // means unchecking and removing it from the array
    }
    setChecked(all);
  };

  // get filtered products
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(`${endPoint}/product/product-filter`, {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log("Error in filtering product : ", error);
      toast.error("Error in filtering product");
    }
  };

  // get total cont
  const getTotal = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${endPoint}/product/product-count`);
      setLoading(false);
      setTotal(data?.total);
    } catch (error) {
      setLoading(false);
      console.log("Error in getting toatl products", error);
    }
  };

  useEffect(() => {
    if (page == 1) return;
    else loadMore();
  }, [page]);
  const loadMore = async () => {
    try {
      const { data } = await axios.get(
        `${endPoint}/product/product-list/${page}`
      );
      setProducts([...products, ...data.products]);
    } catch (error) {
      console.log("Error in loading more products : ", error);
    }
  };
  return (
    <Layout title={"All Products - Best offers"}>
      {/* Banner Image */}
      <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filter by Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <>
                <Checkbox
                  key={c._id}
                  onChange={(e) => handleFilter(e.target.checked, c._id)}
                >
                  {c.name}
                </Checkbox>
              </>
            ))}
          </div>
          {/* Price Filter */}
          <h4 className="text-center mt-4">Filter by Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => {
                return (
                  <>
                    <div key={p._id}>
                      <Radio value={p.array}>{p.name}</Radio>
                    </div>
                  </>
                );
              })}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap">
            {products?.map((curr) => (
              <>
                <div className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`${
                      import.meta.env.VITE_REACT_APP_API
                    }/api/v1/product/product-photo/${curr._id}`}
                    className="card-img-top"
                    alt={curr.name}
                  />
                  <div className="card-body">
                    <div className="card-name-price">
                      <h5 className="card-title">{curr.name}</h5>
                      <h5 className="card-title card-price">
                        {curr.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </h5>
                    </div>
                    <p className="card-text">
                      {curr.descreption.substring(0, 60)}
                    </p>
                    <div className="card-name-price">
                      <button
                        className="btn btn-primary ms-2"
                        onClick={() => {
                          navigate(`/product/${curr.slug}`);
                        }}
                      >
                        More Details
                      </button>
                      <button
                        className="btn btn-secondary ms-2"
                        onClick={() => {
                          if (!cart?.includes(curr)) {
                            setCart([...cart, curr]);
                            localStorage.setItem(
                              "cart",
                              JSON.stringify([...cart, curr])
                            );
                            toast.success("Item added to cart !");
                          } else {
                            toast.success("Item already in Cart");
                          }
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ))}
          </div>
          <div className="m-2 p-3 text-center">
            {products && products.length < total && (
              <>
                <button
                  className="btn btn-warning"
                  // added after bug
                  hidden={products.length == total}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(page + 1);
                  }}
                >
                  {loading ? "Loading..." : "Load More"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
