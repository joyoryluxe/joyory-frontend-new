import React, { useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { UserContext } from "../context/UserContext";
import "../styles/AiBeautyLab.css";
import beautyLabHeroImg from "../assets/beauty_lab_hero.png";

// Assets
import virtualTryOnImg from "../assets/Virtual-tryon-new.png";
import shadeFinderImg from "../assets/Shadefinder.png";
import ingredientCheckerImg from "../assets/Ingredient.png";
import skincareImg from "../assets/Routine-Builder.png";
import beautyConciergeImg from "../assets/AI-Beauty-Concierge.png";
import beautyQuizImg from "../assets/Smart-Beauty-Quiz.png";
import formulationsImg from "../assets/Formulations.png";

const AiBeautyLab = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
      }
    }
  }, [location]);

  useEffect(() => {
    // Scroll Reveal Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleLaunchChatbot = () => {
    document.getElementById("beauty-concierge-fab")?.click();
  };

  const handleQuizClick = () => {
    if (!user || user.guest) {
      navigate("/login", { state: { from: "/foryoulanding" } });
    } else {
      navigate("/foryoulanding");
    }
  };

  const tools = [
    {
      title: "AI Skin Diagnosis",
      description: "Upload a selfie or capture a photo in real-time. Our AI evaluates skin tone, undertones, hydration levels, and targets concerns to build a customized product list.",
      image: scannerImg,
      cta: "Scan Skin Now",
      action: () => navigate("/skin-diagnosis"),
      badge: "AI Derm"
    },
    {
      title: "AI Virtual Try-On",
      description: "Instantly test lipstick, blush, and eyeshadow shades in real-time. Experience hyper-realistic color matching directly from your camera.",
      image: virtualTryOnImg,
      cta: "Launch Try-On",
      action: () => navigate("/Mainvirtualtryon"),
      badge: "VTO Support"
    },
    {
      title: "Foundation Shade Finder",
      description: "Never buy the wrong shade again. Let our advanced analysis tool detect your exact undertone and matching foundations.",
      image: shadeFinderImg,
      cta: "Find Your Shade",
      action: () => navigate("/shadefinder"),
      badge: "Tone Scanner"
    },
    {
      title: "Skincare Routine Builder",
      description: "Answer key skin concerns to design a structured AM/PM regimen. Watch your customized skincare planner optimize your daily hydration.",
      image: skincareImg,
      cta: "Build Routine",
      action: () => navigate("/routines"),
      badge: "Routine AI"
    },
    {
      title: "Ingredient Compatibility",
      description: "Audit ingredients from any product. Cross-check actives like Retinol and Vitamin C for sensitivity, allergen alerts, and maximum efficacy.",
      image: ingredientCheckerImg,
      cta: "Scan Ingredients",
      action: () => navigate("/ingredient-compatibility"),
      badge: "Lab Check"
    },
    {
      title: "AI Beauty Concierge",
      description: "Chat live with our beauty agent. Ask questions about product benefits, ingredient definitions, or step-by-step guides at any time.",
      image: beautyConciergeImg,
      cta: "Start Chatting",
      action: handleLaunchChatbot,
      badge: "Live Advisor"
    },
    {
      title: "Smart Beauty Quiz",
      description: "Unlock customized recommendations. Take a 2-minute personalized quiz mapping your skin concerns to direct Joyory collections.",
      image: beautyQuizImg,
      cta: "Take the Quiz",
      action: handleQuizClick,
      badge: "Quiz Portal"
    }
  ];

  return (
    <div className="ai-beauty-lab-page">
      <Header />

      {/* Hero Section */}
      <section className="lab-hero mt-lg-5" style={{ backgroundImage: `url(${beautyLabHeroImg})` }}>
        <div className="lab-hero-overlay"></div>
        <div className="lab-hero-content text-center text-lg-start container">
          <span className="lab-hero-tag">Science Behind Every Glow</span>
          <h1 className="lab-hero-title page-title-main-name">
            Revolutionizing Beauty <br />
            <span>With Intelligent Science</span>
          </h1>
          <p className="lab-hero-subtitle">
            Experience technology meets skincare. Powerful ingredients, backed by science to bring out your best skin every day.
          </p>
          <a href="#lab-grid" className="btn-lab-primary">
            EXPLORE LAB TOOLS &gt;
          </a>
        </div>
      </section>

      {/* Main Grid Section */}
      <section id="lab-grid" className="lab-grid-section container py-5">
        <div className="section-header text-center mb-4 mb-lg-5 reveal-on-scroll">
          <span className="lab-section-tag">Interactive Tools</span>
          <h2 className="section-title page-title-main-name">Our Core AI USPs</h2>
          <div className="section-title-divider"></div>
        </div>

        <div className="tools-grid">
          {tools.map((tool, idx) => (
            <div key={idx} id={tool.title.toLowerCase().replace(/\s+/g, "-")} className="tool-card reveal-on-scroll">
              <div className="tool-card-image">
                <img src={tool.image} alt={tool.title} />
                <span className="tool-card-badge">{tool.badge}</span>
              </div>
              <div className="tool-card-content">
                <h3 className="tool-card-title page-title-main-name">{tool.title}</h3>
                <p className="tool-card-desc">{tool.description}</p>
                <button className="btn-tool-cta" onClick={tool.action}>
                  {tool.cta} <span className="arrow-icon">&rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* "Why We Are Different" Section */}
      <section className="lab-compare-section py-5">
        <div className="container">
          <div className="section-header text-center mb-5 reveal-on-scroll">
            <span className="lab-section-tag">The Joyory Standard</span>
            <h2 className="section-title page-title-main-name">How We Differ From Regular E-Commerce</h2>
            <div className="section-title-divider"></div>
          </div>

          <div className="compare-grid reveal-on-scroll">
            <div className="compare-column regular-column">
              <h3>Traditional Shopping</h3>
              <ul>
                <li>
                  <span className="icon-fail">&#10006;</span> Guessing if a foundation shade will match under studio lights.
                </li>
                <li>
                  <span className="icon-fail">&#10006;</span> Purchasing active serums blindly, risking skin barrier irritation.
                </li>
                <li>
                  <span className="icon-fail">&#10006;</span> Buying random products that clash or cancel each other out.
                </li>
                <li>
                  <span className="icon-fail">&#10006;</span> Generic listings based on trending items instead of skin type compatibility.
                </li>
              </ul>
            </div>

            <div className="compare-column joyory-column">
              <div className="joyory-glow"></div>
              <h3>Joyory AI Beauty Features</h3>
              <ul>
                <li>
                  <span className="icon-success">&#10004;</span> Live color matching via device camera with AI Try-On.
                </li>
                <li>
                  <span className="icon-success">&#10004;</span> Scientific routine building mapping morning and evening layers safely.
                </li>
                <li>
                  <span className="icon-success">&#10004;</span> Instant sensitivity screening checks for conflicting active ingredients.
                </li>
                <li>
                  <span className="icon-success">&#10004;</span> Personalized store experience sorting catalogs by skin goals.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Database Banners */}
      <section className="lab-trust-section py-5 reveal-on-scroll">
        <div className="container">
          <div className="trust-banner d-flex flex-column flex-lg-row align-items-center">
            <div className="trust-banner-info">
              <span className="trust-tag">SCIENCE BACKED</span>
              <h2 className="page-title-main-name">Formulations & Science You Can Trust</h2>
              <p>
                Our AI Beauty Lab references a curated, clinically checked library of active ingredients, allergens, and comedogenic ratings. We align our analysis with dermatological research guidelines to ensure your skin health always comes first.
              </p>
              <div className="trust-stats">
                <div className="stat-item">
                  <span className="stat-number">10k+</span>
                  <span className="stat-label">Analyzed Ingredients</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">100%</span>
                  <span className="stat-label">Skin Tone Inclusive</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">AI Concierge Support</span>
                </div>
              </div>
            </div>
            <div className="trust-banner-visual">
              <img src={formulationsImg} alt="Dermatology Science" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AiBeautyLab;
