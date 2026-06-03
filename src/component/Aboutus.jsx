// import React, { useEffect, useRef, useState } from "react";
// import "./AboutUs.css";
// import { useNavigate } from 'react-router-dom';

// import {
//   Sparkles,
//   BadgeCheck,
//   ScanFace,
//   Wand2,
//   HeartHandshake,
//   ShoppingBag,
//   ArrowRight,
//   ChevronRight
// } from "lucide-react";
// import Header from "./Header";
// import Footer from "./Footer";

// function useInView(threshold = 0.1) {
//   const ref = useRef(null);
//   const [visible, setVisible] = useState(false);
//   useEffect(() => {
//     const obs = new IntersectionObserver(
//       ([e]) => { if (e.isIntersecting) setVisible(true); },
//       { threshold }
//     );
//     if (ref.current) obs.observe(ref.current);
//     return () => obs.disconnect();
//   }, []);
//   return [ref, visible];
// }

// const AboutUs = () => {
//   const navigate = useNavigate();
//   const [heroRef, heroVisible] = useInView(0.1);
//   const [storyRef, storyVisible] = useInView(0.1);
//   const [missionRef, missionVisible] = useInView(0.1);
//   const [brandsRef, brandsVisible] = useInView(0.1);
//   const [whyRef, whyVisible] = useInView(0.1);
//   const [ctaRef, ctaVisible] = useInView(0.1);

//   const scrollToStory = () => {
//     storyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   };

//   return (
//     <>
//       <Header />
//       <div className="about-page">
//         {/* HERO SECTION */}
//         <section className="about-hero" ref={heroRef}>
//           <div className="about-hero-bg"></div>
//           <div className={`about-hero-content ${heroVisible ? "anim-fade-up" : ""}`}>
//             <span className="about-tag">
//               <Sparkles size={14} className="tag-icon" /> BEAUTY • TECH • PERSONALIZATION
//             </span>

//             <h1>
//               Beauty that understands <br />
//               <span className="text-gradient">you.</span>
//             </h1>

//             <p>
//               JOYORY is a modern beauty and cosmetics destination built for the
//               new generation of shoppers — where technology, personalization, and
//               trusted beauty come together in one seamless experience.
//             </p>

//             <div className="hero-buttons">
//               <button className="primary-btn" onClick={() => navigate('/')}>
//                 Explore Products <ArrowRight size={18} />
//               </button>
//               <button className="outline-btn" onClick={scrollToStory}>Our Story</button>            </div>
//           </div>
//         </section>

//         {/* STORY SECTION */}
//         <section className="story-section" ref={storyRef}>
//           <div className={`story-left ${storyVisible ? "anim-fade-right" : ""}`}>
//             <span className="small-title">OUR STORY</span>

//             <h2>
//               Started in 2025 with one simple vision — make beauty shopping more
//               personal, easier, and smarter.
//             </h2>

//             <p>
//               In a world filled with endless products and confusing choices,
//               JOYORY was created to help people discover what truly works for
//               them.
//             </p>

//             <p>
//               We are building more than just another beauty marketplace. Our goal
//               is to combine curated beauty products, intelligent technology, and
//               customer-first experiences that simplify everyday beauty shopping.
//             </p>

//             <p>
//               From skincare and makeup essentials to emerging beauty brands,
//               JOYORY brings together trusted products designed for every skin
//               tone, preference, and personality.
//             </p>
//           </div>

//           <div className={`story-right ${storyVisible ? "anim-fade-left" : ""}`}>
//             <div className="story-card" style={{ animationDelay: "0.1s" }}>
//               <div className="icon-wrapper"><Sparkles size={28} /></div>
//               <h3>Curated Beauty</h3>
//               <p>Carefully selected products from trusted and trending beauty brands.</p>
//             </div>

//             <div className="story-card" style={{ animationDelay: "0.2s" }}>
//               <div className="icon-wrapper"><ScanFace size={28} /></div>
//               <h3>Virtual Try-On</h3>
//               <p>Experience products digitally before purchasing with smart beauty technology.</p>
//             </div>

//             <div className="story-card" style={{ animationDelay: "0.3s" }}>
//               <div className="icon-wrapper"><Wand2 size={28} /></div>
//               <h3>Shade Finder</h3>
//               <p>Find your perfect makeup shades tailored to your unique skin tone.</p>
//             </div>

//             <div className="story-card" style={{ animationDelay: "0.4s" }}>
//               <div className="icon-wrapper"><HeartHandshake size={28} /></div>
//               <h3>Beauty Quiz</h3>
//               <p>Personalized recommendations based on your beauty goals and preferences.</p>
//             </div>
//           </div>
//         </section>

//         {/* MISSION & VISION */}
//         <section className="mission-section" ref={missionRef}>
//           <div className={`mission-card mission-dark ${missionVisible ? "anim-fade-up" : ""}`}>
//             <div className="mission-content">
//               <span>OUR MISSION</span>
//               <h2>To simplify beauty shopping through personalization, technology, and trust.</h2>
//               <p>We aim to create a beauty ecosystem where customers can discover the right products confidently without confusion or overwhelming choices.</p>
//             </div>
//             <div className="mission-bg-element"></div>
//           </div>

//           <div className={`mission-card mission-light ${missionVisible ? "anim-fade-up" : ""}`} style={{ animationDelay: "0.2s" }}>
//             <div className="mission-content">
//               <span>OUR VISION</span>
//               <h2>To become India’s most loved beauty-tech platform for the next generation.</h2>
//               <p>By combining smart tools like Virtual Try-On, Shade Finder, and AI-powered recommendations, we want to redefine how people discover and experience beauty online.</p>
//             </div>
//             <div className="mission-bg-element-2"></div>
//           </div>
//         </section>

//         {/* BRANDS */}
//         <section className="brands-section" ref={brandsRef}>
//           <div className={`${brandsVisible ? "anim-fade-up" : ""}`}>
//             <span className="small-title center">OUR BRANDS</span>
//             <h2>Bringing together trusted beauty brands and our upcoming JOYORY Originals.</h2>
//             <p>We currently offer products from multiple beauty and cosmetics brands including skincare, makeup, bath & body, and everyday beauty essentials.</p>

//             <div className="brand-marquee-container">
//               <div className="brand-marquee">
//                 {/* Double the brands for infinite scroll effect */}
//                 {["LAKMÉ", "MARS", "MAYBELLINE", "SWISS BEAUTY", "PLUM", "JOYORY ORIGINALS", "LAKMÉ", "MARS", "MAYBELLINE", "SWISS BEAUTY", "PLUM", "JOYORY ORIGINALS"].map((brand, i) => (
//                   <div className="brand-pill" key={i}>
//                     <Sparkles size={14} className="brand-pill-icon" /> {brand}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* WHY CHOOSE */}
//         <section className="why-section" ref={whyRef}>
//           <div className={`why-left ${whyVisible ? "anim-fade-right" : ""}`}>
//             <span className="small-title">WHY JOYORY</span>
//             <h2>Beauty shopping should feel effortless, exciting, and personal.</h2>
//             <p>Unlike traditional marketplaces, JOYORY focuses on understanding customer needs first — helping users choose smarter through personalized experiences and beauty-focused innovation.</p>
//             <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop" alt="Beauty Products" className="why-image" />
//           </div>

//           <div className={`why-right ${whyVisible ? "anim-fade-left" : ""}`}>
//             <div className="why-box">
//               <div className="why-icon-container">
//                 <BadgeCheck size={24} />
//               </div>
//               <div className="why-box-content">
//                 <h4>Authentic Products</h4>
//                 <p>100% genuine and trusted beauty products sourced directly from brands.</p>
//               </div>
//             </div>

//             <div className="why-box">
//               <div className="why-icon-container">
//                 <ShoppingBag size={24} />
//               </div>
//               <div className="why-box-content">
//                 <h4>Curated Collections</h4>
//                 <p>Only the best products selected meticulously for your beauty journey.</p>
//               </div>
//             </div>

//             <div className="why-box">
//               <div className="why-icon-container">
//                 <Wand2 size={24} />
//               </div>
//               <div className="why-box-content">
//                 <h4>Beauty + Technology</h4>
//                 <p>Smart shopping tools designed specifically to improve customer experience.</p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* CTA */}
//         <section className="about-cta" ref={ctaRef}>
//           <div className={`cta-content ${ctaVisible ? "anim-zoom-in" : ""}`}>
//             <h2>Welcome to the future of beauty shopping.</h2>
//             <p>Discover products made for you — powered by personalization, technology, and beauty expertise.</p>
//             <button className="cta-btn" onClick={() => navigate('/')}>Start Exploring <ChevronRight size={20} /></button>
//           </div>

//           {/* Decorative elements */}
//           <div className="cta-glow-1"></div>
//           <div className="cta-glow-2"></div>
//         </section>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default AboutUs;









import React, { useEffect, useRef, useState } from "react";
import "./AboutUs.css";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  BadgeCheck,
  ScanFace,
  Wand2,
  HeartHandshake,
  ShoppingBag,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";
import aboutWhyImg from "../assets/about-why.png";

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold }
    );

    if (ref.current) obs.observe(ref.current);

    return () => obs.disconnect();
  }, []);

  return [ref, visible];
}

const AboutUs = () => {
  const navigate = useNavigate();

  const [heroRef, heroVisible] = useInView(0.1);
  const [storyRef, storyVisible] = useInView(0.1);
  const [missionRef, missionVisible] = useInView(0.1);
  const [brandsRef, brandsVisible] = useInView(0.1);
  const [whyRef, whyVisible] = useInView(0.1);
  const [ctaRef, ctaVisible] = useInView(0.1);

  const scrollToStory = () => {
    storyRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <Header />

      <div className="about-page">
        {/* HERO */}
        <section className="about-hero" ref={heroRef}>
          <div className="hero-overlay"></div>

          <div
            className={`about-hero-content ${heroVisible ? "anim-fade-up" : ""
              }`}
          >
            <span className="about-tag">
              <Sparkles size={14} />
              BEAUTY • TECH • PERSONALIZATION
            </span>

            <h1>
              Beauty that understands you.
            </h1>

            <p>
              JOYORY is a modern beauty and cosmetics destination built for the
              new generation of shoppers — where technology, personalization,
              and trusted beauty come together in one seamless experience.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={() => navigate("/")}
              >
                Explore Products <ArrowRight size={18} />
              </button>

              <button
                className="outline-btn"
                onClick={scrollToStory}
              >
                Our Story
              </button>
            </div>
          </div>
        </section>

        {/* STORY */}
        <section className="story-section" ref={storyRef}>
          <div
            className={`story-left ${storyVisible ? "anim-fade-right" : ""
              }`}
          >
            <span className="small-title">OUR STORY</span>

            <h2>
              Started in 2025 with one simple vision — make beauty shopping
              more personal, easier, and smarter.
            </h2>

            <p>
              In a world filled with endless products and confusing choices,
              JOYORY was created to help people discover what truly works for
              them.
            </p>

            <p>
              We are building more than just another beauty marketplace. Our
              goal is to combine curated beauty products, intelligent
              technology, and customer-first experiences that simplify everyday
              beauty shopping.
            </p>

            <p>
              From skincare and makeup essentials to emerging beauty brands,
              JOYORY brings together trusted products designed for every skin
              tone, preference, and personality.
            </p>
          </div>

          <div
            className={`story-right ${storyVisible ? "anim-fade-left" : ""
              }`}
          >
            {[
              {
                icon: <Sparkles size={28} />,
                title: "Curated Beauty",
                text: "Carefully selected products from trusted and trending beauty brands.",
              },
              {
                icon: <ScanFace size={28} />,
                title: "Virtual Try-On",
                text: "Experience products digitally before purchasing with smart beauty technology.",
              },
              {
                icon: <Wand2 size={28} />,
                title: "Shade Finder",
                text: "Find your perfect makeup shades tailored to your unique skin tone.",
              },
              {
                icon: <HeartHandshake size={28} />,
                title: "Beauty Quiz",
                text: "Personalized recommendations based on your beauty goals and preferences.",
              },
            ].map((item, index) => (
              <div className="story-card" key={index}>
                <div className="icon-wrapper">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* MISSION */}
        <section className="mission-section" ref={missionRef}>
          <div
            className={`mission-card ${missionVisible ? "anim-fade-up" : ""
              }`}
          >
            <span>OUR MISSION</span>

            <h2>
              To simplify beauty shopping through personalization, technology,
              and trust.
            </h2>

            <p>
              We aim to create a beauty ecosystem where customers can discover
              the right products confidently without confusion or overwhelming
              choices.
            </p>
          </div>

          <div className="divider-line"></div>

          <div
            className={`mission-card ${missionVisible ? "anim-fade-up" : ""
              }`}
          >
            <span>OUR VISION</span>

            <h2>
              To become India’s most loved beauty-tech platform for the next
              generation.
            </h2>

            <p>
              By combining smart tools like Virtual Try-On, Shade Finder, and
              AI-powered recommendations, we want to redefine how people
              discover and experience beauty online.
            </p>
          </div>
        </section>

        {/* BRANDS */}
        <section className="brands-section" ref={brandsRef}>
          <div className={`${brandsVisible ? "anim-fade-up" : ""}`}>
            <span className="small-title center">OUR BRANDS</span>
            <h2>Bringing together trusted beauty brands and our upcoming JOYORY Originals.</h2>
            <p>We currently offer products from multiple beauty and cosmetics brands including skincare, makeup, bath & body, and everyday beauty essentials.</p>

            <div className="brand-marquee-container">
              <div className="brand-marquee">
                {/* Double the brands for infinite scroll effect */}
                {["LAKMÉ", "MARS", "MAYBELLINE", "SWISS BEAUTY", "PLUM", "JOYORY ORIGINALS", "LAKMÉ", "MARS", "MAYBELLINE", "SWISS BEAUTY", "PLUM", "JOYORY ORIGINALS"].map((brand, i) => (
                  <div className="brand-pill" key={i}>
                    <Sparkles size={14} className="brand-pill-icon" /> {brand}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="why-section" ref={whyRef}>
          <div className="why-left">
            <span className="small-title">WHY JOYORY</span>

            <h2>
              Beauty shopping should feel effortless, exciting, and personal.
            </h2>

            <p>
              Unlike traditional marketplaces, JOYORY focuses on understanding
              customer needs first — helping users choose smarter through
              personalized experiences and beauty-focused innovation.
            </p>

            <div className="why-right">
              <div className="why-box">
                <BadgeCheck size={24} />
                <div>
                  <h4>Authentic Products</h4>
                  <p>
                    100% genuine and trusted beauty products sourced directly
                    from brands.
                  </p>
                </div>
              </div>

              <div className="why-box">
                <ShoppingBag size={24} />
                <div>
                  <h4>Curated Collections</h4>
                  <p>
                    Only the best products selected meticulously for your beauty
                    journey.
                  </p>
                </div>
              </div>

              <div className="why-box">
                <Wand2 size={24} />
                <div>
                  <h4>Beauty + Technology</h4>
                  <p>
                    Smart shopping tools designed specifically to improve
                    customer experience.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="why-image-wrapper">
            <img
              src={aboutWhyImg}
              alt="Beauty"
              className="why-image"
            />
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta" ref={ctaRef}>
          <div
            className={`cta-content ${ctaVisible ? "anim-fade-up" : ""
              }`}
          >
            <h2>Welcome to the future of beauty shopping.</h2>

            <p>
              Discover products made for you — powered by personalization,
              technology, and beauty expertise.
            </p>

            <button
              className="cta-btn"
              onClick={() => navigate("/")}
            >
              Start Exploring <ChevronRight size={20} />
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default AboutUs;