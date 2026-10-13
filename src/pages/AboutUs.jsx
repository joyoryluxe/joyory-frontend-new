import React, { useEffect, useRef, useState } from "react";
import "../styles/AboutUs.css";
import { useNavigate, Link } from "react-router-dom";
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
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import aboutWhyImg from "../assets/about-why.png";
import SEOMeta from "../components/common/SEOMeta";

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

  const featureCards = [
    {
      icon: <Sparkles size={28} />,
      title: "Smart Beauty Quiz",
      text: "Decode your skin concerns and goals through an intelligent questionnaire for custom advice.",
      link: "/foryoulanding",
      actionText: "Take Quiz",
    },
    {
      icon: <ScanFace size={28} />,
      title: "Foundation Shade Finder",
      text: "Scan and detect your exact undertone and shade matches in real-time using our AI camera tool.",
      link: "/shadefinder",
      actionText: "Find Shade",
    },
    {
      icon: <Wand2 size={28} />,
      title: "AI Virtual Try-On",
      text: "Instantly test lipstick shades, eye palettes, and blush overlays with a virtual mirror.",
      link: "/Mainvirtualtryon",
      actionText: "Launch Try-On",
    },
    {
      icon: <BadgeCheck size={28} />,
      title: "Ingredient Compatibility",
      text: "Analyze ingredients side-by-side to ensure compatibility and verify safety ratings.",
      link: "/ingredient-compatibility",
      actionText: "Scan Actives",
    },
    {
      icon: <ShoppingBag size={28} />,
      title: "Skincare Routine Builder",
      text: "Build tailored day-and-night skincare regimens based on skin compatibility profiles.",
      link: "/routines",
      actionText: "Build Routine",
    },
    {
      icon: <HeartHandshake size={28} />,
      title: "AI Beauty Concierge",
      text: "Chat 24/7 with our trained beauty assistant for instant routine and product suggestions.",
      link: "/Chatbot",
      actionText: "Chat Now",
    },
  ];

  const brandPills = [
    { name: "LAKMÉ", slug: "lakme" },
    { name: "MARS", slug: "mars" },
    { name: "MAYBELLINE", slug: "maybelline" },
    { name: "SWISS BEAUTY", slug: "swiss-beauty" },
    { name: "PLUM", slug: "plum" },
    { name: "JOYORY ORIGINALS", path: "/products" },
  ];

  return (
    <>
      <SEOMeta type="aboutus" />
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
                onClick={() => navigate("/products")}
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
          <div className="story-left">
            <div className={`story-left-content ${storyVisible ? "anim-fade-right" : ""}`}>
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
          </div>

          <div
            className={`story-right ${storyVisible ? "anim-fade-left" : ""
              }`}
          >
            {featureCards.map((item, index) => (
              <Link
                to={item.link}
                className="story-card"
                key={index}
                aria-label={`Explore ${item.title}`}
              >
                <div className="icon-wrapper">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span className="story-card-link">
                  {item.actionText} <ArrowRight size={14} className="story-card-arrow" />
                </span>
              </Link>
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
                {[...brandPills, ...brandPills].map((brand, i) => (
                  <Link
                    to={brand.path || `/brand/${brand.slug}`}
                    className="brand-pill"
                    key={i}
                    aria-label={`Shop ${brand.name} collection`}
                  >
                    <Sparkles size={14} className="brand-pill-icon" /> {brand.name}
                  </Link>
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
              <Link to="/products" className="why-box" aria-label="Explore authentic products">
                <BadgeCheck size={24} />
                <div>
                  <h4>Authentic Products</h4>
                  <p>
                    100% genuine and trusted beauty products sourced directly
                    from brands.
                  </p>
                </div>
              </Link>

              <Link to="/topcategories" className="why-box" aria-label="Explore curated collections">
                <ShoppingBag size={24} />
                <div>
                  <h4>Curated Collections</h4>
                  <p>
                    Only the best products selected meticulously for your beauty
                    journey.
                  </p>
                </div>
              </Link>

              <Link to="/ai-beauty-lab" className="why-box" aria-label="Explore beauty and technology">
                <Wand2 size={24} />
                <div>
                  <h4>Beauty + Technology</h4>
                  <p>
                    Smart shopping tools designed specifically to improve
                    customer experience.
                  </p>
                </div>
              </Link>
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
              onClick={() => navigate("/products")}
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
