import { useEffect, useRef } from 'react';
import '../css/AboutusHero.css';
import aboutus from "../assets/about-us.jpg";
import imagess from "../assets/imagess.png";
import images from "../assets/images.png";
import owner from "../assets/owner.png";

const AboutusHero = () => {
  return (
    <>
      <div className="container-fluid mt-xl-5 pt-xl-5">

        <div className="row">
          <div className="col-lg-6">
            <img
              src={aboutus}
              alt="About Us"
              className="img-fluid ps-xl-5 mt-lg-5 mt-5 pt-lg-0 pt-4"
            />
          </div>



          <div className="col-lg-6 d-flex mt-xl-4 mt-5">
            <div className='d-flex align-items-center'>
              <div className=''>
                <h1 className='about-us-heading page-title-main-name'>Welcome to Joyory</h1>

                <p className='about-us-content page-title-main-name'>JOYORY Luxe is a curated online beauty destination designed for the modern consumer who values quality, authenticity, and effortless elegance. Bringing together a refined selection of skincare, makeup, and beauty essentials, we aim to simplify the way you discover and shop for beauty.</p>

                <p className='about-us-content page-title-main-name'>In a space filled with endless options, JOYORY Luxe focuses on thoughtful curation. Every product is carefully chosen to meet high standards of performance, trust, and relevance. From everyday must-haves to luxury beauty finds, we ensure that each addition serves a purpose.</p>
                <p className='about-us-content page-title-main-name'>Our platform is built to offer a seamless and personalized beauty shopping experience — helping you explore products that truly work for you, without the noise.</p>

              </div>
            </div>
          </div>



        </div>
      </div>




      <section className="about-section">
        <div className="container">
          <h2 className="about-us-title page-title-main-name">
            Why can't beauty feel luxurious and joyful without
            the heavy price tag?
          </h2>

          <div className="story-cards">


            <div className='mt-4 ms-auto me-auto'>
              {/* First Card */}
              <img
                src={owner} className='img-fluid ms-auto me-auto  d-lg-none d-md-block'
                alt="Founder Chhavi Talati"
              />
            </div>


            <div className="story-card">
              <div className="card-image d-lg-flex d-md-none d-none">
                <img
                  src={imagess} className=''
                  alt="Founder Chhavi Talati"
                />
              </div>
              <div className="card-content">
                <p className="story-text">
                  Our founder, Chhavi Talati, believed beauty should be a feeling — not a chore.
                </p>
                <p className="story-text">
                  With this belief, Joyory was born — curated with care and created to celebrate real individuality.
                </p>
                <p className="story-text">
                  We didn't start with big budgets, just a vision and a passion to make beauty feel intimate yet extraordinary.
                </p>
              </div>
            </div>

            {/* Second Card */}


            <div className='mt-4 ms-auto me-auto'>
              {/* First Card */}
              <img
                src={owner} className='img-fluid ms-auto me-auto  d-lg-none d-md-block'
                alt="Founder Chhavi Talati"
              />
            </div>
            <div className="story-card">
              <div className="card-image d-lg-flex d-md-none d-none">
                <img
                  src={images} className=''
                  alt="Joyory Team"
                />
              </div>
              <div className="card-content">
                <p className="story-text">
                  As collaborators joined our mission, Joyory evolved from a dream into a movement.
                </p>
                <p className="story-text">
                  Together, we built a brand that celebrates inclusivity, diversity, and beauty for every shade and story.
                </p>
                <p className="story-text">
                  Today, Joyory is a growing family driven by passion and purpose.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



    </>

  );
};

export default AboutusHero;











