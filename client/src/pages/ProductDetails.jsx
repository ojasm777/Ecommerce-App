import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/productDetailsStyles.css";
import { useCart } from "../Context/Cart";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const [cart, setCart] = useCart();
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
      <div className="row contianer product-details">
        <div className="col-md-6">
          <img
            src={`${
              import.meta.env.VITE_REACT_APP_API
            }/api/v1/product/product-photo/${product._id}`}
            className="card-img-top text-center"
            alt={product.name}
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Product Details</h1>
          <hr />
          <h6>Name : {product.name}</h6>
          <h6>Description : {product.description}</h6>
          <h6>
            Price :
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h6>
          <h6>Category : {product?.category?.name}</h6>
          <button
            class="btn btn-secondary ms-1"
            onClick={() => {
              if (!cart?.includes(product)) {
                setCart([...cart, product]);
                localStorage.setItem("cart", JSON.stringify([...cart, product]));
                toast.success("Item added to cart !");
              } else {
                toast.success("Item already in Cart");
              }
            }}
          >
            ADD TO CART
          </button>
        </div>
      </div>
      <hr />
      <div className="row container similar-products">
        <h4>Similar Products ➡️</h4>
        {relatedProduct?.length < 1 && (
          <p className="text-center">No Similar Products Found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProduct?.map((curr) => (
            <>
              <div className="card m-2" key={curr} >
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

export default ProductDetails;
