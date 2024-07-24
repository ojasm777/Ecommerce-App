import React, { useState, useEffect, useRef } from "react";
import "./Layout/style.css";
// import "./Layout/index.css";
import { NavLink } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function Dropdown({ user, handleLogOut, link }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownref = useRef();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handler = (event) => {
        if(dropdownref.current && !dropdownref.current.contains(event.target)){
            setIsOpen(false);
        }
    }
    document.addEventListener("click", handler);
    return () => {
        document.removeEventListener("cilck", handler);
    }
  }, [dropdownref]);

  return (
    // <div className="dropdown nav-item">
    <div ref={dropdownref}>
      <NavLink
        style={{ border: "none" }}
        onClick={toggleDropdown}
        className="navbar flex dropdownToggle nav-item"
      >
        {user.toUpperCase()}
        {isOpen ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
      </NavLink>
      {isOpen && (
        <div>
          <div className="flex flex-col dropDownProfile">
            <ul className="flex flex-col this">
              <li>
                <NavLink
                  // to={`/dashboard/${ auth?.user?.role === 1 ? "admin" : "user"}`}
                  to = {link}
                  // className="dropdown-item"
                  onClick={toggleDropdown}
                >
                  Dashboard
                </NavLink>
              </li>
              {/* <li>
                <NavLink
                  to="/about"
                  className="dropdown-item"
                  onClick={toggleDropdown}
                >
                  About
                </NavLink>
              </li> */}
              <li>
                <NavLink
                  to="/login"
                  // className="dropdown-item"
                  onClick={handleLogOut}
                >
                  Log Out
                </NavLink>
              </li>
              {/* <li>
                <NavLink
                  to="/contact"
                  className="dropdown-item"
                  onClick={toggleDropdown}
                >
                  Contact
                </NavLink>
              </li> */}
            </ul>
          </div>
        </div>
      )}
    </div>
    // </div>
  );
}

export default Dropdown;
