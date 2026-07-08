import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import "../styles/PageNotFound.css";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <section className="pnf">
        <div className="pnf__wrap">
          <div className="pnf__card">
            {/* <p className="pnf__code">404</p> */}
            <h1 className="pnf__title">Looks like beauty took a wrong turn</h1>
            <p className="pnf__subtitle">
              We can’t seem to find the page you’re looking for. Explore our collections instead.
            </p>

            <div className="pnf__actions">
              <button
                className="pnf__btn pnf__btn--primary"
                onClick={() => navigate("/")}
              >
                Shop Now
              </button>

            </div>

            <div className="pnf__links" aria-label="Popular links">
              <button className="pnf__link" onClick={() => navigate("/virtualtryon")}>
                Virtual Try-On
              </button>
              <button className="pnf__link" onClick={() => navigate("/foryoulanding")}>
                For You
              </button>
              <button className="pnf__link" onClick={() => navigate("/shadefinder")}>
                Shade Finder
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default PageNotFound;


