import React from 'react';
import { Link } from "react-router-dom";

const Card = ({ icon, title, description, highlight }) => (
  <div className="bg-neutral-950 p-7 rounded-2xl border border-neutral-800 flex flex-col gap-6 shadow-xl transition-all hover:border-neutral-700">
    {icon}
    <div className="flex flex-col gap-2">
      <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
      <p className="text-xs text-neutral-400 leading-relaxed">{description}</p>
      {highlight && (
        <span className="w-fit mt-1 bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded-md font-mono text-[10px]">
          {highlight}
        </span>
      )}
    </div>
  </div>
);

export const WhatOffers = () => {
  return (
    <section id="offers" className="pt-40 pb-28 max-w-7xl mx-auto px-6 relative z-10">
      
      {/* Heading Group */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-b from-emerald-200 via-green-300 to-emerald-500 bg-clip-text text-transparent">
          What Texify actually offers
        </h2>
        <p className="text-base text-neutral-400 leading-relaxed">
          A zero-friction workspace engineered to help you manage professional history, build technical formatting configurations, and generate beautifully typeset profiles.
        </p>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          icon={<div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl w-fit text-xl shadow-inner">📄</div>}
          title="Jake's Resume Templates" 
          description="Utilize the tech industry's gold standard layout style with precise automatic alignment, spacing, and font weight hierarchies." 
        />
        <Card 
          icon={<div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl w-fit text-xl shadow-inner">🛡️</div>}
          title="Institutional Security" 
          description="Access is entirely locked to official campus credentials to maintain profile integrity and verify legitimate user validation." 
          highlight="@students.iiests.ac.in"
        />
        <Card 
          icon={<div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl w-fit text-xl shadow-inner">⚙️</div>}
          title="Instant PDF Compilation" 
          description="Skip long loading ques. Compile clean source documents locally in seconds using our automated live compiler script pipeline." 
        />
        <Card 
          icon={<div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl w-fit text-xl shadow-inner">📁</div>}
          title="Persistent Dashboard" 
          description="Save updates, track changes, or clone existing iterations instantly using an integrated relational cloud database structure." 
        />
      </div>

      {/* Final Count & Button */}
      <div className="text-center mt-16 space-y-6">
        <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
          Built with a focus on professional presentation, institutional authenticity and streamlined resume generation.
        </p>
        <div className="pt-2">
          <Link to="/auth" className="px-8 py-3 bg-white text-sm font-semibold text-neutral-950 rounded-full hover:bg-neutral-200 transition shadow-lg">
            Get Started
          </Link>
        </div>
      </div>

    </section>
  );
};