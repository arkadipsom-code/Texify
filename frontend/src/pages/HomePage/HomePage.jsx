// src/pages/HomePage/HomePage.jsx
import React from "react";
import { Hero } from "./Hero";
import { About } from "./About";
import { WhatOffers } from "./WhatOffers";

export function HomePage() {


  useEffect(() => {
    const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000";
    
    // Fire-and-forget background ping to wake up the Render container early
    fetch(`${API_ROOT}/api/health`).catch(() => {});
  }, []);

  return (
    <>
      <Hero />
      <div id="about"><About /></div>
      <div id="offers"><WhatOffers /></div>
    </>
  );
}