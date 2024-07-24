import React from "react";
import { NavLink, Link, Router, Route, Routes } from "react-router-dom";
import { MdShoppingCart } from "react-icons/md";
import { useAuth } from "../../Context/auth";
import toast from "react-hot-toast";
// import "./style.css";
import Dropdown from "../Dropdown";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { Dropdown as BootstrapDropdown } from "react-bootstrap";
import CategoryDropdown from "../CategoryDropdown";
import { useCart } from "../../Context/Cart";
import { Badge } from "antd";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const handleLogOut = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link to="/" className="navbar-brand">
          {" "}
          <MdShoppingCart></MdShoppingCart> Ecommerce App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            <SearchInput />
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <CategoryDropdown categories={categories} />
            </li>

            {/* <li className="nav-item">
              <NavLink to="/category" className="nav-link">
                Category
              </NavLink>
            </li> */}
            <li className="nav-item">
              <Badge count={cart?.length} showZero> 
                <NavLink to="/cart" className="nav-link">
                  Cart
                </NavLink>
              </Badge>
            </li>
            {!auth?.user ? (
              <>
                <li className="nav-item">
                  <NavLink to="/register" className="nav-link">
                    Register
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Dropdown
                  link={`/dashboard/${
                    auth?.user?.role === 1 ? "admin" : "user"
                  }`}
                  user={auth?.user?.name}
                  handleLogOut={handleLogOut}
                />
              </li>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
