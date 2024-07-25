import React from "react";
import Layout from "../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="row contactus" style={{ margin: "30px" }}>
        <div className="col-md-6 ">
          <img
            src="../../public/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <p>Lorem ipsum dolor sit amet consectetur.</p>
          <p>Neque dolorum fuga repellendus distinctio voluptate.</p>
          <p>Aliquid quod dolore cumque in odio?</p>
          <p>Expedita minus atque ea! Illum, corporis!</p>
          <p>Magnam, odio. Itaque, iste? Nobis, ratione.</p>
          <p>Necessitatibus aperiam aliquid numquam minima eos!</p>
          <p>Vero officiis reprehenderit animi non illum.</p>
          <p>Possimus atque reprehenderit consequatur commodi cupiditate.</p>
          <p>Numquam laudantium a rerum nisi cum.</p>
          <p>Error at dolorem iusto assumenda molestiae.</p> 
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
