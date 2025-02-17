import React from "react";
import { useSearch } from "../../Context/Search";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const endPoint = `${import.meta.env.VITE_REACT_APP_API}/api/v1`;
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${endPoint}/product/search/${values.keyword}`
      );
      // here there was an error I wrote result instead of results, take care of it next time
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log("Error in submitting form search : ", error);
    }
  };
  return (
    <>
      <form className="d-flex" role="search" onSubmit={handleSubmit}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => {
            setValues({ ...values, keyword: e.target.value });
          }}
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>
    </>
  );
};

export default SearchInput;
