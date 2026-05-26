// src/components/FoundationShadeFinder.jsx
import React from "react";
import Shadefinder from "../assets/Sd.png";
import step1 from "../assets/step1.webp";
import step2 from "../assets/step2.webp";
import step3 from "../assets/step3.webp";
import step4 from "../assets/step4.png";
import step5 from "../assets/step5.png";
import step6 from "../assets/step6.png";
import Rightarrow from "../assets/Rightarrow.svg";
import "../css/shadefinder.css";
import Header from "./Header";
import Footer from "./Footer";
import { Link } from "react-router-dom";


const FoundationShadeFinder = () => {
  return (
    <>
      <Header />

      <section className="overflow">
        <div className="col-lg-12 mb-4 mb-md-0">
          <img
            src={Shadefinder}
            alt="Foundation Shade Finder"
            className="img-fluid"
          />
        </div>




        <div className="container-lg">

          <div className="row">
            <h3 className="mt-lg-5 pt-lg-3 page-title-main-name fw-normal">How it Works</h3>


            <div className="col-6 col-lg-4 mt-4">
              <div className="">
                <img
                  src={step1}
                  alt="Foundation Shade Finder"
                  className="img-fluid"
                />

                <h4 className="page-title-main-name mt-3 fw-normal fs-5">Step 1</h4>
                <h3 className="page-title-main-name mt-1 fw-normal sub-title-shadefinder">Not Sure which shade is right for you?</h3>
              </div>
            </div>


            <div className="col-6 col-lg-4 mt-4">
              <div className="">
                <img
                  src={step2}
                  alt="Foundation Shade Finder"
                  className="img-fluid"
                />

                <h4 className="page-title-main-name mt-3 fw-normal fs-5">Step 2</h4>
                <h3 className="page-title-main-name mt-1 fw-normal sub-title-shadefinder">Not Sure which shade is right for you?</h3>
              </div>
            </div>


            <div className="col-6 col-lg-4 mt-4">
              <div className="">
                <img
                  src={step3}
                  alt="Foundation Shade Finder"
                  className="img-fluid"
                />

                <h4 className="page-title-main-name mt-3 fw-normal fs-5">Step 3</h4>
                <h3 className="page-title-main-name mt-1 fw-normal sub-title-shadefinder">Not Sure which shade is right for you?</h3>
              </div>
            </div>

            <div className="col-6 col-lg-4 mt-4">
              <div className="">
                <img
                  src={step4}
                  alt="Foundation Shade Finder"
                  className="img-fluid"
                />

                <h4 className="page-title-main-name mt-3 fw-normal fs-5">Step 4</h4>
                <h3 className="page-title-main-name mt-1 fw-normal sub-title-shadefinder">Not Sure which shade is right for you?</h3>
              </div>
            </div>


            <div className="col-6 col-lg-4 mt-4">
              <div className="">
                <img
                  src={step5}
                  alt="Foundation Shade Finder"
                  className="img-fluid"
                />

                <h4 className="page-title-main-name mt-3 fw-normal fs-5">Step 5</h4>
                <h3 className="page-title-main-name mt-1 fw-normal sub-title-shadefinder">Not Sure which shade is right for you?</h3>
              </div>
            </div>


            <div className="col-6 col-lg-4 mt-4">
              <div className="">
                <img
                  src={step6}
                  alt="Foundation Shade Finder"
                  className="img-fluid"
                />

                <h4 className="page-title-main-name mt-3 fw-normal fs-5">Step 6</h4>
                <h3 className="page-title-main-name mt-1 fw-normal sub-title-shadefinder">Not Sure which shade is right for you?</h3>
              </div>
            </div>



            
              <Link className="leftsgobtn-main w-100" to="/shadefinder">
                <button className="ledtsgobutton page-title-main-name">Let’s Go <img src={Rightarrow} className="right-arrow-image" alt="Arrow Right" /></button>
              </Link>



          </div>

        </div>







      </section>


      <Footer />

    </>
  );
};

export default FoundationShadeFinder;
