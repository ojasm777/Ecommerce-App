import axios from "axios";
import Layout from "../components/Layout/Layout";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/categoryProductStyles.css";

const CategoryProduct = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState();
  const navigate = useNavigate();
  const params = useParams();
  const endPoint = `${import.meta.env.VITE_REACT_APP_API}/api/v1`;
  useEffect(() => {
    if(params?.slug) getProductByCat();
  }, [params?.slug]);
  const getProductByCat = async () => {
    try {
      const { data } = await axios.get(
        `${endPoint}/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {}
  };
  return (
    <Layout>
      <div className="container mt-3 category">
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">{products?.length} results found</h6>
        <div className="d-flex flex-wrap">
        {products?.map((curr) => (
            <>
              <div className="card m-2" key={curr._id} >
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
                    {curr.description.substring(0, 30)}...
                  </p>
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${curr.slug}`)}
                  >
                    More Details
                  </button>
                  {/* <button className="btn btn-secondary ms-2">
                    Add to Cart
                  </button> */}
                </div>
              </div>
            </>
          ))}
          </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
