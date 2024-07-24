import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import { useSearch } from "../Context/Search";

const Search = () => {
  const [values, setValues] = useSearch();
  console.log(values);
  return (
    <Layout title="Search Results">
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {values?.results.length < 1
              ? "No Products found"
              : `Found ${values?.results.length}`}
          </h6>
          <div className="d-flex flex-wrap mt-4">
            {values?.results.map((curr) => (
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
                    <button className="btn btn-primary ms-2">
                      More Details
                    </button>
                    <button className="btn btn-secondary ms-2">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
