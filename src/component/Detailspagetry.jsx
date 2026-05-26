import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaMagic } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";

import Img1 from "../assets/virtualmakeuptryon.png"; // Replace with your image
import Img2 from "../assets/Foundationshadefinder.png"; // Replace with your image
import Img3 from "../assets/Skincare.png"; // Replace with your image

export default function Virtualtryon() {
  const features = [
    {
      id: 1,
      title: "Virtual Makeup Try on",
      desc: "Explore 100+ stunning shades with our virtual try-on. From bold lips to radiant cheeks and smoky eyes—your perfect look is just a click away.",
      img: Img1,
    },
    {
      id: 2,
      title: "Foundation Shade Finder",
      desc: "Discover luxury tailored to your skin. Our smart shade-matching experience finds the perfect product for your tone and undertone—because flawless should feel effortless.",
      img: Img2,
    },
    {
      id: 3,
      title: "Skincare Diagnostics",
      desc: "Analyze your skin from anywhere, anytime—right inside the Joyory Magic Room. Discover personalized makeup shades or reinvent your look with our playful, powerful virtual try-on experience.",
      img: Img3,
    },
  ];

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">
          Joyory Magic Room <FaMagic className="ms-2 text-info" />
        </h2>
        <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
          "Welcome to Joyory Magic Room—where beauty meets imagination. Try on
          virtual makeup, find your flawless foundation, and reveal your skin’s
          secrets with our enchanting tools."
        </p>
      </div>

      {/* Features */}
      <div className="row g-5">
        {features.map((item, index) => (
          <div
            key={item.id}
            className={`d-flex flex-column flex-md-row align-items-center ${
              index % 2 !== 0 ? "flex-md-row-reverse" : ""
            }`}
          >
            {/* Image */}
            <div className="col-md-6 text-center mb-3 mb-md-0">
              <img
                src={item.img}
                alt={item.title}
                className="img-fluid rounded"
                style={{ maxHeight: "280px", objectFit: "cover" }}
              />
            </div>

            {/* Text */}
            <div className="col-md-6 px-4">
              <h5 className="fw-bold">{item.title}</h5>
              <p className="text-muted">{item.desc}</p>
              <button className="btn btn-primary d-flex align-items-center gap-2 px-4">
                <FiCamera />
                Try-On
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
