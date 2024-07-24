import React, { useState, useEffect, useRef } from "react";
import "./styles.css";
import { NavLink, Link } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const CategoryDropdown = ({ categories }) => {
  const [enabled, setEnabled] = useState(false);

  const currRef = useRef();
  const handleClick = () => {
    setEnabled(!enabled);
  };

  useEffect(() => {
    const handler = (event) => {
      if (currRef.current && !currRef.current.contains(event.target)) {
        setEnabled(false);
      }
    };
    document.addEventListener("click", handler);
    return () => {
      document.removeEventListener("cilck", handler);
    };
  }, [currRef]);
  return (
    <>
      <div ref={currRef}>
        <Link className="navbar flex main nav-item" onClick={handleClick}>
          Category
          {enabled ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
        </Link>
        <div className="parent">
          {enabled && (
            <div>
              <div className="flex flex-col dropdown">
                <ul>
                  <li><Link to={`../categories`}>All Categories</Link></li>

                  {categories?.map((c) => (
                    <li key={c._id}>
                      <Link to={`../category/${c.slug}`}>{c.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryDropdown;
