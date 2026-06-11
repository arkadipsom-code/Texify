// src/pages/HomePage/HomePage.jsx
import React, {useEffect} from "react";
import { Hero } from "./Hero";
import { About } from "./About";
import { WhatOffers } from "./WhatOffers";

export function HomePage() {
  useEffect(() => {
    // We wrap this securely so that even if the URL environment variable is missing, it doesn't crash the UI
    const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000";
    
    fetch(`${API_ROOT}/api/health`).catch((err) => {
      console.log("Pre-warm ping status: Server is initializing.");
    });
  }, []);
  
  return (
    <>
      <Hero />
      <div id="about"><About /></div>
      <div id="offers"><WhatOffers /></div>
    </>
  );
}