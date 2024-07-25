import React, {useState, useEffect} from 'react'
import AdminMenu from '../../components/Layout/AdminMenu';
import Layout from '../../components/Layout/Layout';
import axios from 'axios'; // as we need to send network request
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
// import '../../components/Layout/index.css'

const Products = () => {
  const endPoint = `${import.meta.env.VITE_REACT_APP_API}/api/v1/product`;
  console.log(endPoint);
  const [products, setProducts] = useState([]);
  const [photo, setPhoto] = useState("");
  // get all products
  const getAllProducts = async () => {
    try {
      const {data} = await axios.get(`${endPoint}/get-product`);
      console.log(data.products);
      if(data?.success) {
        setProducts(data?.products);
      } else {
        toast.error("Error in getting products");
      }
    } catch (error) {
      console.log("Error in getting all products : ", error);
      toast.error("Error in getting all the products")
    }
  }
  // getAllProducts();

  // lifeCycle method
  useEffect(() => {
    getAllProducts();
  }, [])
  return (
    <Layout>
    <div className="container-fluid m-3 p-3">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu/>
        </div>
        <div className="col-md-9">
          <div className="card p-3">
            <h1>Products</h1>
            <div className="d-flex flex-wrap">
            {products?.map((curr) => (
              <>
              <Link key={curr._id} to={`/dashboard/admin/product/${curr.slug}`} className='product-link'>
                  <div className="card m-2" style={{width: '18rem'}}>
                    <img src={`${import.meta.env.VITE_REACT_APP_API}/api/v1/product/product-photo/${curr._id}`} className="card-img-top" alt={curr.name} />
                    <div className="card-body" style={{textDecoration : "NONE"}}>
                      <h5 className="card-title">{curr.name}</h5>
                      <p className="card-text">{curr.description}</p>
                    </div>
                  </div>
              </Link>
              </>
            ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
  )
}

export default Products