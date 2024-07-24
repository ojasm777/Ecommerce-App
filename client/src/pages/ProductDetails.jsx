import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const endPoint = `${import.meta.env.VITE_REACT_APP_API}/api/v1`;
  const [relatedProduct, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (params?.slug) getProducts();
  }, [params?.slug]);

  // get products
  const getProducts = async () => {
    try {
      const { data } = await axios.get(
        `${endPoint}/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProducts(data?.product?._id, data?.product?.category?._id);
    } catch (error) {
      console.log("Error in getting the details of this product : ", error);
    }
  };
  // get similar products
  const getSimilarProducts = async (pid, cid) => {
    try {
      const { data } = await axios(
        `${endPoint}/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log("Error in getting similar products : ", error);
    }
  };
  return (
    <Layout>
      <div className="row contianer mt-2">
        <div className="col-md-5">
          <img
            src={`${
              import.meta.env.VITE_REACT_APP_API
            }/api/v1/product/product-photo/${product._id}`}
            className="card-img-top text-center"
            alt={product.name}
          />
        </div>
        <div className="col-md-7">
          <h2 className="text-center">Product Details</h2>
          <h4>Name : {product.name}</h4>
          <h4>Descreption : {product.descreption}</h4>
          <h4>Price : {product.price}</h4>
          <h4>Category : {product?.category?.name}</h4>
          <button className="btn btn-secondary mt-3">Add to Cart</button>
        </div>
      </div>
      <hr />
      <div className="row container">
        <h6>Similar Products</h6>
        {relatedProduct?.length < 1 && <p className="text-center">No Similar Products Found</p>}
        <div className="d-flex flex-wrap">
          {relatedProduct?.map((curr) => (
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
                  <h5 className="card-title">{curr.name}</h5>
                  <p className="card-text">
                    {curr.descreption.substring(0, 30)}...
                  </p>
                  <p className="card-text">${curr.price}</p>
                  <button className="btn btn-secondary ms-2">
                    Add to Cart
                  </button>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
