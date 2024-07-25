import React, {PropTyp} from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import '../../index.css';
import "./index.css";
import {Helmet} from 'react-helmet';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children, title = "Ecommerce App", description = "Ecommerce", keyword = "Ecommerce, shop, online shopping", author = "Ojas Malhotra" }) => {
  return (
    <div>
      <Helmet>
          <meta charSet="utf-8" />
          <meta name = "description" content={description}/>
          <meta name = "keyword" content={keyword}/>
          <meta name = "author" content={author}/>
          <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "73.5vh" }}>
        <Toaster/>
        {children}
        </main>
      <Footer />
    </div>
  );
};

export default Layout;
