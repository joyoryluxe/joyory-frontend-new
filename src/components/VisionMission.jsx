// src/components/VisionMission.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/VisionMission.css";
import Eye from "../../assets/eye.png";
import Mission from "../../assets/Mission.png";

const VisionMission = () => {
  return (
    <section className="mission-vision-section page-title-main-name">
      <div className="mission-vision-container">

        {/* Mission */}
        <div className="mission-box">
          <h2>Mission</h2>
          <p>
            To become a trusted and leading online beauty platform that redefines how people discover, experience, and shop for beauty — by combining curation, convenience, and confidence in every choice.
          </p>
        </div>

        {/* Vision */}
        <div className="mission-box">
          <h2>Vision ?</h2>
          <p>
            To provide a carefully curated range of authentic skincare and makeup products that cater to diverse beauty needs, while delivering a seamless and enjoyable shopping experience.
          </p>
          
            <p>
            To empower customers with the right choices through simplicity, quality, and thoughtful recommendations — making beauty more accessible, reliable, and personal.
          </p>
        </div>

      </div>
    </section>
  );
};

export default VisionMission;