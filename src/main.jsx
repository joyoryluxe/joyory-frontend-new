import React from 'react';
import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";

import './index.css'
import App from './App.jsx'

import axios from "axios";

// 🔄 Backend Redirect (automatically handles dev vs production)
const PROD_BACKEND = "https://beauty.joyory.com";
const getTargetBackend = () => {
  if (import.meta.env.PROD) return PROD_BACKEND;
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (!envUrl) return PROD_BACKEND;
  if (typeof window !== "undefined" && window.location?.hostname && window.location.hostname !== "localhost") {
    return envUrl.replace("localhost", window.location.hostname).replace("127.0.0.1", window.location.hostname);
  }
  return envUrl;
};
const TARGET_BACKEND = getTargetBackend();

if (TARGET_BACKEND !== PROD_BACKEND) {
  // Redirect Axios calls
  axios.interceptors.request.use((config) => {
    if (config.url && config.url.includes(PROD_BACKEND)) {
      config.url = config.url.replace(PROD_BACKEND, TARGET_BACKEND);
    }
    return config;
  });

  // Redirect fetch() calls
  const originalFetch = window.fetch;
  window.fetch = (input, init) => {
    if (typeof input === "string" && input.includes(PROD_BACKEND)) {
      input = input.replace(PROD_BACKEND, TARGET_BACKEND);
    }
    return originalFetch(input, init);
  };
}

// Global trigger for nextOrderDiscountMessage popup bubble
window.showDiscountPopup = (message, targetEl) => {
  if (!message || !targetEl) return;
  window.dispatchEvent(new CustomEvent('show-discount-popup', { detail: { message, targetEl } }));
};
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Header from './components/common/Header.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactGA from "react-ga4";
// import { injectData } from './utils/injectData'




import "@fontsource/dm-sans";           // Regular
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";



import "@fontsource/montserrat";
import "@fontsource/montserrat/500.css"; // Thin
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";




import "@fontsource/playfair-display";
import "@fontsource/playfair-display/700.css";


// injectData();



ReactGA.initialize("G-C088200GWY");

ReactGA.send({ hitType: "pageview", page: window.location.pathname });



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    {/* <Header /> */}
  </React.StrictMode>
);
