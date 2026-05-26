import React from 'react';
import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";

import './index.css'
import App from './App.jsx'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Header from './component/Header.jsx';

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
