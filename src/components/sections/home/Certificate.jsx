// Certificate.jsx
import React from 'react';
import "../../../styles/Certificate.css";
import checkmark from "../../../assets/checkmark.svg";
import containertruck from "../../../assets/container-truck.svg";
import beautify from "../../../assets/beautify.svg";
import returns from "../../../assets/return.svg";


import "../../../App.css";

const Certificate = () => {
  return (
    <div className='container-fluid ms-xl-5 ms-0 mx-1 mx-md-0 ps-xl-0 ps-md-5 ps-3'>
      <div className="row m-0 p-0">

        <div className="col-lg-3 col-6 mt-lg-3 mt-4">
          <div className="item p-0 ms-lg-0">
            <div className="icon"><img src={checkmark} className='me-auto d-block' width={"40px"} alt="Image-Not-Found" /></div>
            <div className="title mt-lg-3 mt-3 title-main text-start fs-6">100% Authentic</div>
            <div className="mt-2 subtitle-Certificate text-start">All our products are directly sourced from brands</div>
          </div>
        </div>


        <div className="col-lg-3 col-6 mt-lg-3 mt-4">

          <div className="item p-0 ms-lg-0">
            <div className="icon"><img src={containertruck} className='me-auto d-block' width={"40px"} alt="Image-Not-Found" /></div>
            <div className="title mt-lg-3 mt-3 title-main text-start fs-6">Free Shipping</div>
            <div className="mt-2 subtitle-Certificate text-start">On all orders above ₹299</div>
          </div>
        </div>

        <div className="col-lg-3 col-6 mt-lg-3 mt-4">

          <div className="item p-0 ms-lg-0 ms-3">
            <div className="icon"><img src={beautify} className='me-auto d-block' width={"40px"} alt="Image-Not-Found" /></div>
            <div className="title mt-lg-3 mt-3 title-main text-start fs-6">Certified Beauty Advisors</div>
            <div className="mt-2 subtitle-Certificate text-start">Get expert consultations</div>
          </div>
        </div>

        <div className="col-lg-3 col-6 mt-lg-3 mt-4">

          <div className="item p-0 ms-lg-0">
            <div className="icon"><img src={returns} className='me-auto d-block' width={"40px"} alt="Image-Not-Found" /></div>
            <div className="title mt-lg-3 mt-3 title-main text-start fs-6">Easy Returns</div>
            <div className="mt-2 subtitle-Certificate text-start">Hassle-free pick-ups and refunds</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Certificate;