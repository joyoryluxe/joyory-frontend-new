import React from "react";
import "../../../../styles/Certificate.css";
import checkmark from "../../../../assets/checkmark.svg";
import containertruck from "../../../../assets/container-truck.svg";
import beautify from "../../../../assets/beautify.svg";
import returns from "../../../../assets/return.svg";
import "../../../../App.css";
import TrustBadgeItem from "./TrustBadgeItem";

const CERTIFICATE_BADGES = [
  {
    id: "authentic",
    icon: checkmark,
    title: "100% Authentic",
    subtitle: "All our products are directly sourced from brands",
  },
  {
    id: "shipping",
    icon: containertruck,
    title: "Free Shipping",
    subtitle: "On all orders above ₹499",
  },
  {
    id: "advisors",
    icon: beautify,
    title: "Certified Beauty Advisors",
    subtitle: "Get expert consultations",
  },
  {
    id: "returns",
    icon: returns,
    title: "Easy Returns",
    subtitle: "Hassle-free pick-ups and refunds",
  },
];

const Certificate = () => {
  return (
    <div className="container-fluid px-lg-5 px-3 my-4">
      <div className="row justify-content-center m-0 p-0">
        {CERTIFICATE_BADGES.map((badge) => (
          <TrustBadgeItem
            key={badge.id}
            icon={badge.icon}
            title={badge.title}
            subtitle={badge.subtitle}
          />
        ))}
      </div>
    </div>
  );
};

export default Certificate;
