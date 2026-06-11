// src/pages/HomePage/HomePage.jsx
import React from "react";
import { Hero } from "./Hero";
import { About } from "./About";
import { WhatOffers } from "./WhatOffers";

export function HomePage() {
  return (
    <>
      <Hero />
      <div id="about"><About /></div>
      <div id="offers"><WhatOffers /></div>
    </>
  );
}