import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function useCategory() {
  const [categories, setCategories] = useState([]);
  const endPoint = `${import.meta.env.VITE_REACT_APP_API}/api/v1`;
  // get categories
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
  return categories;
}
