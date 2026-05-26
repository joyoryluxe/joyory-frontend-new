

// import { useEffect, useRef } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import '../css/AboutusHero.css';
// import LipstickTop from "../assets/LipstickTop.png";
// import Lipstick from "../assets/Lipstick.png";


// gsap.registerPlugin(ScrollTrigger);

// function AboutusHero() {
//   const mainRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // 1. Hero Section - Intro Animation
//       gsap.from(".hero-text-line", {
//         opacity: 0,
//         y: 50,
//         stagger: 0.2,
//         ease: "power3.out",
//         duration: 1.5,
//       });

//       // 2. Our Story Section - Main scroll-triggered animations
//       const storyTimeline = gsap.timeline({
//         scrollTrigger: {
//           trigger: ".our-story-section",
//           start: "top top",
//           end: "+=100%",
//           scrub: true,
//           pin: true,
//           anticipatePin: 1,
//         },
//       });

//       // Parallax effect on the background image
//       storyTimeline.fromTo(".our-story-bg",
//         { y: "-10%" },
//         { y: "10%", ease: "none" },
//         0
//       );

//       // Animate the content wrapper to slide in from the bottom
//       storyTimeline.fromTo(".story-content-wrapper",
//         { y: "100vh" },
//         { y: "0", ease: "power2.inOut" },
//         0
//       );

//       // ----------------------------------------------------
//       // NEW CODE for the Lipstick Animation
//       // ----------------------------------------------------
//       const lipstickTimeline = gsap.timeline({
//         scrollTrigger: {
//           trigger: ".our-story-section",
//           start: "center center", // Animation starts when the section is in the center of the viewport
//           end: "bottom top",
//           scrub: true,
//           // markers: true, // Uncomment to visualize the trigger points
//         },
//       });

//       lipstickTimeline.to(".lipstick-top", {
//         y: "-100%", // Moves the top piece up
//         ease: "none",
//       }, 0); // The `0` ensures this animation starts at the same time as the next one

//       lipstickTimeline.to(".lipstick-bottom", {
//         y: "20%",  // Moves the bottom piece down
//         ease: "none",
//       }, 0);
//       // ----------------------------------------------------

//       // 3. Founder's Note Section - Simple reveal animation
//       gsap.from(".founder-note", {
//         y: 50,
//         opacity: 0,
//         duration: 1,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: ".founder-note",
//           start: "top 80%",
//           toggleActions: "play none none reverse",
//         }
//       });

//     }, mainRef);

//     return () => ctx.revert();
//   }, []);






//   return (
//     <div ref={mainRef}>
//       {/* <section className="section hero-section">
//         <div className="hero-product-image">
//           <img src="https://via.placeholder.com/500x350.png?text=Product" alt="Product" />
//         </div>
//         <div className="hero-text-container">
//           <h1 className="hero-text-line">PEARL</h1>
//           <h1 className="hero-text-line">EXTRACT</h1>
//           <h1 className="hero-text-line">COSMETIC</h1>
//         </div>
//       </section> */}

//       <section className="section our-story-section">
//         <div className="our-story-bg"></div>
//         <div className="story-content-wrapper">
//           <div className="story-content">
//             <h2>Our Story</h2>
//             {/* <p>
//               Your beauty, your joy, your story. We believe that true luxury is about more than just products—it’s about defining your story and refining beauty on your terms. You were made to stand out.
//             </p> */}
//           </div>
//           <div className="story-image">
//             {/* The images must be absolutely positioned within a relative container */}
//             {/* <img src="{Abouthero}" className='lipstick-top' alt="Lipstick Top" /> */}

//             <img src={LipstickTop} className='lipstick-top img-fluid' alt="Lipstick Top" />
//             <img src={Lipstick} className="ipstick-bottom img-fluid" style={{ marginLeft: "30px", marginTop:"0" }} alt="Lipstick Bottom"/>


//             {/* <img src="https://via.placeholder.com/300x500.png?text=Lipstick+Bottom" className='lipstick-bottom' alt="Lipstick Bottom" /> */}
//           </div>
//         </div>
//       </section>

//       <section className="section placeholder-section">
//         <div className="founder-note">
//           <p className="quote-mark">“</p>
//           <p className="founder-quote">
//             Luxury is not just about what you wear, but how you feel. It's an experience we create for you, every day.
//           </p>
//           <p className="quote-mark">”</p>
//           <p className="founder-name">- The Founder</p>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default AboutusHero;














// import { useEffect, useRef } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import '../css/AboutusHero.css';
// import LipstickTop from "../assets/LipstickTop.png";
// import Lipstick from "../assets/Lipstick.png";


// gsap.registerPlugin(ScrollTrigger);

// function AboutusHero() {
//   const mainRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // 1. Hero Section - Intro Animation
//       gsap.from(".hero-text-line", {
//         opacity: 0,
//         y: 50,
//         stagger: 0.2,
//         ease: "power3.out",
//         duration: 1.5,
//       });

//       // 2. Our Story Section - Main scroll-triggered animations
//       const storyTimeline = gsap.timeline({
//         scrollTrigger: {
//           trigger: ".our-story-section",
//           start: "top top",
//           end: "+=100%",
//           scrub: true,
//           pin: true,
//           anticipatePin: 1,
//         },
//       });

//       // Parallax effect on the background image
//       storyTimeline.fromTo(".our-story-bg",
//         { y: "-10%" },
//         { y: "10%", ease: "none" },
//         0
//       );

//       // Animate the content wrapper to slide in from the bottom
//       storyTimeline.fromTo(".story-content-wrapper",
//         { y: "100vh" },
//         { y: "0", ease: "power2.inOut" },
//         0
//       );

//       // ----------------------------------------------------
//       // NEW CODE for the Lipstick Animation
//       // ----------------------------------------------------
//       const lipstickTimeline = gsap.timeline({
//         scrollTrigger: {
//           trigger: ".our-story-section",
//           start: "center center", // Animation starts when the section is in the center of the viewport
//           end: "bottom top",
//           scrub: true,
//           // markers: true, // Uncomment to visualize the trigger points
//         },
//       });

//       lipstickTimeline.to(".lipstick-top", {
//         y: "-100%", // Moves the top piece up
//         ease: "none",
//       }, 0); // The `0` ensures this animation starts at the same time as the next one

//       lipstickTimeline.to(".lipstick-bottom", {
//         y: "20%",  // Moves the bottom piece down
//         ease: "none",
//       }, 0);
//       // ----------------------------------------------------

//       // 3. Founder's Note Section - Simple reveal animation
//       gsap.from(".founder-note", {
//         y: 50,
//         opacity: 0,
//         duration: 1,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: ".founder-note",
//           start: "top 80%",
//           toggleActions: "play none none reverse",
//         }
//       });

//       gsap.to(".main-heading", {
//         y: "-5%",      // move up 5%
//         opacity: 0,    // fade out
//         ease: "none",
//         scrollTrigger: {
//           trigger: ".lipstick-top",  // element that triggers animation
//           start: "top 2%",           // when animation starts
//           end: "top 7%",             // when animation ends
//           scrub: true,               // smooth scrubbing
//         }
//       });


//     }, mainRef);

//     return () => ctx.revert();
//   }, []);






//   return (
//     <div ref={mainRef}>
//       {/* <section className="section hero-section">
//         <div className="hero-product-image">
//           <img src="https://via.placeholder.com/500x350.png?text=Product" alt="Product" />
//         </div>
//         <div className="hero-text-container">
//           <h1 className="hero-text-line">PEARL</h1>
//           <h1 className="hero-text-line">EXTRACT</h1>
//           <h1 className="hero-text-line">COSMETIC</h1>
//         </div>
//       </section> */}

//       <section className="section our-story-section">
//         <div className="our-story-bg"></div>
//         <div className="story-content-wrapper">
//           <div className="story-content">
//             <h2 className='main-heading'>Our Story</h2>
//             {/* <p>
//               Your beauty, your joy, your story. We believe that true luxury is about more than just products—it’s about defining your story and refining beauty on your terms. You were made to stand out.
//             </p> */}
//           </div>
//           <div className="story-image">
//             {/* The images must be absolutely positioned within a relative container */}
//             {/* <img src="{Abouthero}" className='lipstick-top' alt="Lipstick Top" /> */}

//             <img src={LipstickTop} className='lipstick-top img-fluid' alt="Lipstick Top" />
//             <img src={Lipstick} className="ipstick-bottom img-fluid" style={{ marginLeft: "30px", marginTop: "-15px" }} alt="Lipstick Bottom" />


//             {/* <img src="https://via.placeholder.com/300x500.png?text=Lipstick+Bottom" className='lipstick-bottom' alt="Lipstick Bottom" /> */}
//           </div>
//         </div>
//       </section>

//       <section className="section placeholder-section">
//         <div className="founder-note">
//           <p className="quote-mark">“</p>
//           <p className="founder-quote">
//             Luxury is not just about what you wear, but how you feel. It's an experience we create for you, every day.
//           </p>
//           <p className="quote-mark">”</p>
//           <p className="founder-name">- The Founder</p>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default AboutusHero;















// import { useEffect, useRef } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import '../css/AboutusHero.css';
// import LipstickTop from "../assets/LipstickTop.png";
// import Lipstick from "../assets/Lipstick.png";
// import { easeInOut } from 'framer-motion';

// gsap.registerPlugin(ScrollTrigger);

// function AboutusHero() {
//   const mainRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {
//       // 1. Hero Section - Intro Animation
//       gsap.from(".hero-text-line", {
//         opacity: 0,
//         y: 50,
//         stagger: 0.2,
//         ease: "power3.out",
//         duration: 1.5,
//       });

//       // 2. Our Story Section - Main scroll-triggered animations
//       const storyTimeline = gsap.timeline({
//         scrollTrigger: {
//           trigger: ".our-story-section",
//           start: "top top",
//           end: "+=100%",
//           scrub: true,
//           pin: true,
//           anticipatePin: 1,
//         },
//       });

//       // Parallax effect on the background image
//       storyTimeline.fromTo(".our-story-bg",
//         { y: "-10%" },
//         { y: "10%", ease: "none" },
//         0
//       );

//       // Animate the content wrapper to slide in from the bottom
//       storyTimeline.fromTo(".story-content-wrapper",
//         { y: "100vh" },
//         { y: "0", ease: "power2.inOut" },
//         0
//       );

//       // 3. Lipstick Animations
//       const lipstickTimeline = gsap.timeline({
//         scrollTrigger: {
//           trigger: ".our-story-section",
//           start: "center center",
//           end: "bottom top",
//           scrub: true,
//         },
//       });

//       lipstickTimeline.to(".lipstick-top", { y: "-100%", ease: "none" }, 0);
//       lipstickTimeline.to(".ipstick-bottom", { y: "20%", ease: "none" }, 0);

//       // 4. Founder's Note Section Animation
//       gsap.from(".founder-note", {
//         y: 50,
//         opacity: 0,
//         duration: 1,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: ".founder-note",
//           start: "top 80%",
//           toggleActions: "play none none reverse",
//         }
//       });

//       // 5. Responsive Scroll-trigger for Main Heading (mobile only)
//       ScrollTrigger.matchMedia({
//         "(max-width: 768px)": () => {
//           gsap.to(".main-heading", {
//             y: "-5%",
//             opacity: 0,
//             ease: "easeInOut",
//             scrollTrigger: {
//               trigger: ".lipstick-top",
//               start: "top 20%",
//               end: "top 7%",
//               scrub: true,
//             }
//           });
//         },
//         "(min-width: 769px)": () => {
//           gsap.to(".main-heading", {
//             y: "-5%",      // move up 5%
//             opacity: 0,    // fade out
//             ease: "easeInOut",
//             scrollTrigger: {
//               trigger: ".lipstick-top",  // element that triggers animation
//               start: "top 25%",           // when animation starts
//               end: "top 7%",             // when animation ends
//               scrub: true,               // smooth scrubbing
//             }
//           });

//         }
//       });





















//       //  const ctx = gsap.context(() => {
//       // Move the top lipstick on scroll
//       gsap.to(".lipstick-top", {
//         y: "0%", // move up
//         ease: "none",
//         scrollTrigger: {
//           trigger: ".our-story-section",
//           start: "top bottom",
//           end: "top top",
//           scrub: true,
//         },
//       });

//       // Show/hide the secondary lipstick image
//       const showHideTimeline = gsap.timeline({
//         scrollTrigger: {
//           trigger: ".our-story-section",
//           start: "top 80%", // adjust as needed
//           end: "top 50%",
//           scrub: true,
//           onEnter: () => gsap.set(".lipstick-show-hide", { display: "block" }),
//           onLeaveBack: () => gsap.set(".lipstick-show-hide", { display: "none" }),
//         },
//       });

//       showHideTimeline.fromTo(
//         ".lipstick-show-hide",
//         { opacity: 0 },
//         { opacity: 1, duration: 1, ease: "power1.inOut" }
//       );


//     }, mainRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={mainRef}>
//       <section className="section our-story-section">
//         <div className="our-story-bg"></div>
//         <div className="story-content-wrapper">
//           <div className="story-content">
//             <h2 className='main-heading'>Our Story</h2>
//           </div>
//           {/* <div className="story-image">
//             <img src={LipstickTop} className='lipstick-top img-fluid' style={{ zIndex: "2" }} alt="Lipstick Top" />

//              <img src={LipstickTop} className='lipstick-show-hide img-fluid d-none' style={{ zIndex: "2" }} alt="Lipstick Top" />

//             <img src={Lipstick} className="ipstick-bottom img-fluid" style={{ marginLeft: "30px", marginTop: "-15px", zIndex: "-2" }} alt="Lipstick Bottom" />
//           </div> */}



//           <div className="story-image">
//             <img src={LipstickTop} className='lipstick-top img-fluid' style={{ zIndex: "2" }} alt="Lipstick Top" />

//              <img src={LipstickTop} className='lipstick-show-hide img-fluid' style={{ zIndex: "2" }} alt="Lipstick Top" />

//             <img src={Lipstick} className="ipstick-bottom img-fluid" style={{ marginLeft: "30px", marginTop: "-15px", zIndex: "-2" }} alt="Lipstick Bottom" />
//           </div>




//         </div>
//       </section>

//       <section className="section placeholder-section">
//         <div className="founder-note">
//           <p className="quote-mark">“</p>
//           <p className="founder-quote">
//             Luxury is not just about what you wear, but how you feel. It's an experience we create for you, every day.
//           </p>
//           <p className="quote-mark">”</p>
//           <p className="founder-name">- The Founder</p>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default AboutusHero;





















// import { useEffect, useRef } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import '../css/AboutusHero.css';
// import LipstickTop from "../assets/LipstickTop.png";
// import Lipstick from "../assets/Lipstick.png";

// gsap.registerPlugin(ScrollTrigger);

// function AboutusHero() {
//   const mainRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {

//       // 1. Hero Section - Intro Animation
//       gsap.from(".hero-text-line", {
//         opacity: 0,
//         y: 50,
//         stagger: 0.2,
//         ease: "power3.out",
//         duration: 1.5,
//       });

//       // 2. Our Story Section - Scroll-triggered animations
//       const storyTimeline = gsap.timeline({
//         scrollTrigger: {
//           trigger: ".our-story-section",
//           start: "top top",
//           end: "+=100%",
//           scrub: true,
//           pin: true,
//         },
//       });

//       // Parallax background
//       storyTimeline.fromTo(".our-story-bg", { y: "-10%" }, { y: "10%", ease: "none" }, 0);

//       // Content wrapper slide in
//       storyTimeline.fromTo(".story-content-wrapper", { y: "100vh" }, { y: "0", ease: "power2.inOut" }, 0);

//       // Lipstick top and bottom animations
//       storyTimeline.to(".lipstick-top", { y: "-100%", ease: "none" }, 0);
//       storyTimeline.to(".ipstick-bottom", { y: "20%", ease: "none" }, 0);

//       // 3. Secondary lipstick fade in/out
//       gsap.fromTo(".lipstick-show-hide",
//         { autoAlpha: 0 },
//         {
//           autoAlpha: 1,
//           scrollTrigger: {
//             trigger: ".our-story-section",
//             start: "top 80%",
//             end: "top 50%",
//             scrub: true,
//           },
//         }
//       );

//       // 4. Main heading scroll animation
//       ScrollTrigger.matchMedia({
//         "(max-width: 768px)": () => {
//           gsap.to(".main-heading", {
//             y: "-5%",
//             opacity: 0,
//             ease: "power1.out",
//             scrollTrigger: {
//               trigger: ".lipstick-top",
//               start: "top 20%",
//               end: "top 7%",
//               scrub: true,
//             }
//           });
//         },
//         "(min-width: 769px)": () => {
//           gsap.to(".main-heading", {
//             y: "-5%",
//             opacity: 0,
//             ease: "power1.out",
//             scrollTrigger: {
//               trigger: ".lipstick-top",
//               start: "top 25%",
//               end: "top 7%",
//               scrub: true,
//             }
//           });
//         }
//       });

//       // 5. Founder's Note animation
//       gsap.from(".lipstick-top", {
//         y: 50,
//         opacity: 1,
//         duration: 1,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: ".lipstick-show-hide",
//           start: "top 80%",
//           toggleActions: "play none none reverse",
//         }
//       });

//     }, mainRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={mainRef}>
//       <section className="section our-story-section">
//         <div className="our-story-bg"></div>
//         <div className="story-content-wrapper">
//           <div className="story-content">
//             <h2 className='main-heading'>Our Story</h2>
//           </div>

//           <div className="story-image">
//             <img src={LipstickTop} className='lipstick-top img-fluid' style={{ zIndex: "2" }} alt="Lipstick Top" />
//             <img src={LipstickTop} className='lipstick-show-hide img-fluid' style={{ zIndex: "2" }} alt="Lipstick Top" />
//             <img src={Lipstick} className="ipstick-bottom img-fluid" style={{ marginLeft: "30px", marginTop: "-15px", zIndex: "-2" }} alt="Lipstick Bottom" />
//           </div>
//         </div>
//       </section>

//       <section className="section placeholder-section">
//         <div className="founder-note">
//           <p className="quote-mark">“</p>
//           <p className="founder-quote">
//             Luxury is not just about what you wear, but how you feel. It's an experience we create for you, every day.
//           </p>
//           <p className="quote-mark">”</p>
//           <p className="founder-name">- The Founder</p>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default AboutusHero;





















// import { useEffect, useRef } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import '../css/AboutusHero.css';
// import LipstickTop from "../assets/LipstickTop.png";
// import Lipstick from "../assets/Lipstick.png";

// gsap.registerPlugin(ScrollTrigger);

// function AboutusHero() {
//   const mainRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {

//       // 1. Hero Section - Intro Animation
//       gsap.from(".hero-text-line", {
//         opacity: 0,
//         y: 50,
//         stagger: 0.2,
//         ease: "power3.out",
//         duration: 1.5,
//       });

//       // 2. Our Story Section - Scroll-triggered animations
//       const storyTimeline = gsap.timeline({
//         scrollTrigger: {
//           trigger: ".our-story-section",
//           start: "top top",
//           end: "+=100%",
//           scrub: true,
//           pin: true,
//         },
//       });

//       // Parallax background
//       storyTimeline.fromTo(".our-story-bg", { y: "-10%" }, { y: "10%", ease: "none" }, 0);

//       // Content wrapper slide in
//       storyTimeline.fromTo(".story-content-wrapper", { y: "100vh" }, { y: "0", ease: "power2.inOut" }, 0);


//       ScrollTrigger.matchMedia({
//         "(max-width: 768px)": () => {
//           // Mobile timeline
//           const mobileTimeline = gsap.timeline({
//             scrollTrigger: {
//               trigger: ".our-story-section",
//               start: "top center",
//               end: "bottom top",
//               scrub: true,
//             },
//           });

//           // Move lipsticks for mobile only
//           mobileTimeline.to(".lipstick-top", { y: "-80%", ease: "none" }, 0);
//           mobileTimeline.to(".ipstick-bottom", { y: "80%", ease: "none" }, 0);

//           // Mobile main heading scroll animation
//           gsap.to(".main-heading", {
//             y: "-5%",
//             opacity: 0,
//             ease: "power1.out",
//             scrollTrigger: {
//               trigger: ".lipstick-top",
//               start: "top 10%",
//               end: "top 7%",
//               scrub: true,
//             }
//           });
//         },

//         "(min-width: 769px)": () => {
//           // Desktop timeline
//           const desktopTimeline = gsap.timeline({
//             scrollTrigger: {
//               trigger: ".our-story-section",
//               start: "top center",
//               end: "bottom top",
//               scrub: true,
//             },
//           });

//           // Move lipsticks for desktop
//           desktopTimeline.to(".lipstick-top", { y: "-100%", ease: "none" }, 0);
//           desktopTimeline.to(".ipstick-bottom", { y: "55%", ease: "none" }, 0);

//           // Desktop main heading scroll animation
//           gsap.to(".main-heading", {
//             y: "-5%",
//             opacity: 0,
//             ease: "power1.out",
//             scrollTrigger: {
//               trigger: ".lipstick-top",
//               start: "top 25%",
//               end: "top 7%",
//               scrub: true,
//             }
//           });
//         }
//       });


//       // 3. Secondary lipstick fade in/out
//       gsap.fromTo(".lipstick-show-hide",
//         { autoAlpha: 0 },
//         {
//           autoAlpha: 1,
//           scrollTrigger: {
//             trigger: ".our-story-section",
//             start: "top 80%",
//             end: "top 50%",
//             scrub: true,
//           },
//         }
//       );


//     }, mainRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={mainRef}>
//       <section className="section our-story-section">
//         <div className="our-story-bg"></div>
//         <div className="story-content-wrapper">
//           <div className="story-content">
//             <h2 className='main-heading'>Our Story</h2>
//           </div>

//           <div className="story-image">
//             <img src={LipstickTop} className='lipstick-top img-fluid' style={{ zIndex: "2", marginTop: "20%" }} alt="Lipstick Top" />
//             <img src={LipstickTop} className='lipstick-show-hide img-fluid' style={{ zIndex: "2" }} alt="Lipstick Top" />
//             <img src={Lipstick} className="ipstick-bottom img-fluid" style={{ marginLeft: "30px", marginTop: "-60px", zIndex: "-2" }} alt="Lipstick Bottom" />
//           </div>
//         </div>
//       </section>

//       <section className="section placeholder-section placeholder-sectionsss">
//         <div className="founder-note">
//           {/* <p className="quote-mark">“</p> */}
//           <p className="founder-quote">
//             Joyory Luxe is about more than products—it’s about owning your story and redefining beauty on your terms. You were made to stand out.
//           </p>
//           {/* <p className="quote-mark">”</p> */}
//           {/* <p className="founder-name">- The Founder</p> */}
//            <div className="story-imagess">
//             <img src={LipstickTop} className='lipstick-topss img-fluid' style={{ zIndex: "2", marginTop: "20%" }} alt="Lipstick Top" />
//             {/* <img src={LipstickTop} className='lipstick-show-hide img-fluid' style={{ zIndex: "2" }} alt="Lipstick Top" /> */}
//             <img src={Lipstick} className="ipstick-bottomss img-fluid" style={{ marginLeft: "30px",}} alt="Lipstick Bottom" />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default AboutusHero;































// import { useEffect, useRef } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import '../css/AboutusHero.css';
// import LipstickTop from "../assets/LipstickTop.png";
// import Lipstick from "../assets/Lipstick.png";

// gsap.registerPlugin(ScrollTrigger);

// function AboutusHero() {
//   const mainRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {

//       // 1. Hero Section - Intro Animation
//       gsap.from(".hero-text-line", {
//         opacity: 0,
//         y: 50,
//         stagger: 0.2,
//         ease: "power3.out",
//         duration: 1.5,
//       });

//       // 2. Our Story Section - Scroll-triggered animations (Vertical Split - Kept original)
//       const storyTimeline = gsap.timeline({
//         scrollTrigger: {
//           trigger: ".our-story-section",
//           start: "top top",
//           end: "+=100%",
//           scrub: true,
//           pin: true,
//         },
//       });

//       // Parallax background
//       storyTimeline.fromTo(".our-story-bg", { y: "-10%" }, { y: "10%", ease: "none" }, 0);

//       // Content wrapper slide in
//       storyTimeline.fromTo(".story-content-wrapper", { y: "100vh" }, { y: "0", ease: "power2.inOut" }, 0);


//       ScrollTrigger.matchMedia({
//         "(max-width: 768px)": () => {
//           // Mobile timeline (Vertical Split - Kept original)
//           const mobileTimeline = gsap.timeline({
//             scrollTrigger: {
//               trigger: ".our-story-section",
//               start: "top center",
//               end: "bottom top",
//               scrub: true,
//             },
//           });

//           mobileTimeline.to(".lipstick-top", { y: "-80%", ease: "none" }, 0);
//           mobileTimeline.to(".ipstick-bottom", { y: "80%", ease: "none" }, 0);

//           // ... other mobile animations ...
//         },

//         "(min-width: 769px)": () => {
//           // Desktop timeline (Vertical Split - Kept original)
//           const desktopTimeline = gsap.timeline({
//             scrollTrigger: {
//               trigger: ".our-story-section",
//               start: "top center",
//               end: "bottom top",
//               scrub: true,
//             },
//           });

//           desktopTimeline.to(".lipstick-top", { y: "-100%", ease: "none" }, 0);
//           desktopTimeline.to(".ipstick-bottom", { y: "55%", ease: "none" }, 0);

//           // ... other desktop animations ...
//         }
//       });

//       // 3. Secondary lipstick fade in/out (Kept original)
//       gsap.fromTo(".lipstick-show-hide",
//         { autoAlpha: 0 },
//         {
//           autoAlpha: 1,
//           scrollTrigger: {
//             trigger: ".our-story-section",
//             start: "top 80%",
//             end: "top 50%",
//             scrub: true,
//           },
//         }
//       );

//       // 💥 NEW: Cross Split Animation for the 'placeholder-section'
//       const crossSplitTimeline = gsap.timeline({
//         scrollTrigger: {
//           trigger: ".placeholder-sectionsss", // Using the class on the section
//           start: "top center", // Start animation when the top of the section hits the center of the viewport
//           end: "bottom top",   // End animation when the bottom of the section leaves the top
//           scrub: true,         // Smoothly scrub the animation on scroll
//         },
//       });

//       // Move top lipstick: up and left (cross split)
//       crossSplitTimeline.to(".lipstick-topss", {
//         y: "-150%",
//         x: "-100%",
//         rotation: -10, // Slight rotation for effect
//         ease: "none"
//       }, 0);

//       // Move bottom lipstick: down and right (cross split)
//       crossSplitTimeline.to(".ipstick-bottomss", {
//         y: "150%",
//         x: "100%",
//         rotation: 10, // Slight rotation for effect
//         ease: "none"
//       }, 0);

//       // Reveal text: Fade in the text as the lipsticks split
//       gsap.from(".founder-quote", {
//         opacity: 0,
//         y: 50,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: ".placeholder-sectionsss",
//           start: "center center", // Start fading in when section is centered
//           end: "bottom 80%",
//           scrub: 0.5,
//         }
//       });


//     }, mainRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={mainRef}>
//       <section className="section our-story-section">
//         <div className="our-story-bg"></div>
//         <div className="story-content-wrapper">
//           <div className="story-content">
//             <h2 className='main-heading'>Our Story</h2>
//           </div>

//           <div className="story-image">
//             <img src={LipstickTop} className='lipstick-top img-fluid' style={{ zIndex: "2", marginTop: "20%" }} alt="Lipstick Top" />
//             <img src={LipstickTop} className='lipstick-show-hide img-fluid' style={{ zIndex: "2" }} alt="Lipstick Top" />
//             <img src={Lipstick} className="ipstick-bottom img-fluid" style={{ marginLeft: "30px", marginTop: "-60px", zIndex: "-2" }} alt="Lipstick Bottom" />
//           </div>
//         </div>
//       </section>

//       <section className="section placeholder-section placeholder-sectionsss">
//         <div className="founder-note">

//           {/* The text that is revealed as the lipsticks cross-split */}
//           <p className="founder-quote">
//             Joyory Luxe is about more than products—it’s about owning your story and redefining beauty on your terms. You were made to stand out.
//           </p>

//           {/* The elements for the cross-split animation */}
//           <div className="story-imagess">
//             <img src={LipstickTop} className='lipstick-topss img-fluid' style={{ zIndex: "2", marginTop: "20%" }} alt="Lipstick Top" />
//             <img src={Lipstick} className="ipstick-bottomss img-fluid" style={{ marginLeft: "30px", }} alt="Lipstick Bottom" />
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default AboutusHero;
























// import { useEffect, useRef } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import '../css/AboutusHero.css';
// import LipstickTop from "../assets/LipstickTop.png";
// import Lipstick from "../assets/Lipstick.png";

// gsap.registerPlugin(ScrollTrigger);

// function AboutusHero() {
//   const mainRef = useRef(null);

//   useEffect(() => {
//     const ctx = gsap.context(() => {

//       // 1. Hero Section - Intro Animation (IDENTICAL)
//       gsap.from(".hero-text-line", {
//         opacity: 0,
//         y: 50,
//         stagger: 0.2,
//         ease: "power3.out",
//         duration: 1.5,
//       });

//       // 2. Our Story Section - Scroll-triggered animations (IDENTICAL)
//       const storyTimeline = gsap.timeline({
//         scrollTrigger: {
//           trigger: ".our-story-section",
//           start: "top top",
//           end: "+=100%",
//           scrub: true,
//           pin: true,
//         },
//       });

//       // Parallax background (IDENTICAL)
//       storyTimeline.fromTo(".our-story-bg", { y: "-10%" }, { y: "10%", ease: "none" }, 0);
//       storyTimeline.fromTo(".story-content-wrapper", { y: "100vh" }, { y: "0", ease: "power2.inOut" }, 0);

//       ScrollTrigger.matchMedia({
//         "(max-width: 768px)": () => {
//           // Mobile timeline (IDENTICAL)
//           const mobileTimeline = gsap.timeline({
//             scrollTrigger: {
//               trigger: ".our-story-section",
//               start: "top center",
//               end: "bottom top",
//               scrub: true,
//             },
//           });

//           mobileTimeline.to(".lipstick-top", { y: "-80%", ease: "none" }, 0);
//           mobileTimeline.to(".ipstick-bottom", { y: "80%", ease: "none" }, 0);
//         },

//         "(min-width: 769px)": () => {
//           // Desktop timeline (IDENTICAL)
//           const desktopTimeline = gsap.timeline({
//             scrollTrigger: {
//               trigger: ".our-story-section",
//               start: "top center",
//               end: "bottom top",
//               scrub: true,
//             },
//           });

//           desktopTimeline.to(".lipstick-top", { y: "-100%", ease: "none" }, 0);
//           desktopTimeline.to(".ipstick-bottom", { y: "55%", ease: "none" }, 0);
//         }
//       });

//       // 3. Secondary lipstick fade in/out (IDENTICAL)
//       gsap.fromTo(".lipstick-show-hide",
//         { autoAlpha: 0 },
//         {
//           autoAlpha: 1,
//           scrollTrigger: {
//             trigger: ".our-story-section",
//             start: "top 80%",
//             end: "top 50%",
//             scrub: true,
//           },
//         }
//       );

//       // 💥 4. Cross Split Animation (IDENTICAL)
//       const crossSplitTimeline = gsap.timeline({
//         scrollTrigger: {
//           trigger: ".placeholder-sectionsss",
//           start: "top Left",
//           end: "bottom top",
//           scrub: true,
//         },
//       });

//       crossSplitTimeline.to(".lipstick-topss", {
//         y: "150%",
//         x: "-100%",
//         rotation: -10,
//         ease: "none"
//       }, 0);

//       crossSplitTimeline.to(".ipstick-bottomss", {
//         y: "100%",
//         x: "-150%",
//         rotation: 10,
//         ease: "none",
//         zIndex:"9"
//       }, 0);

//       gsap.from(".founder-quote", {
//         opacity: 0,
//         y: 50,
//         ease: "power2.out",
//         scrollTrigger: {
//           trigger: ".placeholder-sectionsss",
//           start: "center center",
//           end: "bottom 80%",
//           scrub: 0.5,
//         }
//       });

//     }, mainRef);

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={mainRef}>
//       {/* ✅ SECTION 1 - IDENTICAL to your our-story-section + VIDEO */}
//       <section className="section our-story-section">
//         <div className="our-story-bg"></div>
//         <div className="story-content-wrapper">
//           <div className="story-content">
//             <h2 className='main-heading'>Our Video Story</h2>
//           </div>

//           {/* ✅ YOUR VIDEO BEHIND LIPSTICKS - IDENTICAL positioning */}
//           <div className="story-image">
//             {/* VIDEO - zIndex 1 (BEHIND lipsticks) */}
//             <video 
//               className="hero-video"
//               style={{ 
//                 position: 'absolute', 
//                 top: '50%', 
//                 left: '50%', 
//                 transform: 'translate(-50%, -50%)',
//                 width: '85%', 
//                 height: '85%', 
//                 objectFit: 'cover',
//                 zIndex: 1,
//                 borderRadius: '20px'
//               }}
//               autoPlay muted loop playsInline
//             >
//               <source src="/videos/WhatsApp-Video-2025-09-25-at-4.24.15-PM11.mp4" type="video/mp4" />
//             </video>

//             {/* IDENTICAL LIPSTICK ELEMENTS */}
//             <img src={LipstickTop} className='lipstick-top img-fluid' style={{ zIndex: "2", marginTop: "20%" }} alt="Lipstick Top" />
//             <img src={LipstickTop} className='lipstick-show-hide img-fluid' style={{ zIndex: "2" }} alt="Lipstick Top" />
//             <img src={Lipstick} className="ipstick-bottom img-fluid" style={{ marginLeft: "30px", marginTop: "-60px", zIndex: "-2" }} alt="Lipstick Bottom" />
//           </div>
//         </div>
//       </section>

//       {/* ✅ SECTION 2 - IDENTICAL to your placeholder-sectionsss + VIDEO */}
//       <section className="section placeholder-section placeholder-sectionsss">
//         <div className="founder-note">
//           <p className="founder-quote">
//             Our video captures the essence of beauty in motion. Watch how every shade comes to life.
//           </p>

//           {/* VIDEO BEHIND CROSS-SPLIT LIPSTICKS */}
//           <div className="story-imagess">

//             {/* IDENTICAL CROSS-SPLIT LIPSTICKS */}
//             <img src={LipstickTop} className='lipstick-topss img-fluid' style={{ zIndex: "2", marginTop: "20%" }} alt="Lipstick Top" />
//             {/* <img src={Lipstick} className="ipstick-bottomss img-fluid" style={{ marginLeft: "450px" , zIndex:'-2' }} alt="Lipstick Bottom" /> */}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default AboutusHero;













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











