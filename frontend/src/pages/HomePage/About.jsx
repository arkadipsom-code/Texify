// src/components/HomePage/About.jsx
import React from 'react';

export const About = () => {
  return (
    <section id="about" className="pt-70 pb-40 max-w-5xl mx-auto px-6 relative z-10 space-y-12 scroll-mt-28">
      
      <div className="space-y-3">
        <h2 className="old-standard text-5xl md:text-6xl text-white tracking-tight">About Texify</h2>
      </div>

      <div className="prose prose-invert prose-neutral max-w-none prose-p:text-lg md:prose-p:text-xl prose-p:leading-loose prose-p:text-neutral-300 prose-p:mb-8">
        <p>
          Texify is a modern resume making platform built exclusively for students of IIEST Shibpur. Designed with a focus       on professional presentation and institutional authenticity, the platform helps students create clean,      ATS-friendly resumes through a streamlined and structured experience.
        </p>
  
        <p>
          Access to Texify is restricted to verified institutional email accounts ending in <code>@students.iiests.ac.in</code>, ensuring a secure and trusted environment tailored specifically for the IIEST student     community.
        </p>

        <p>
          Texify is designed to reduce the friction between academic achievement and professional   presentation, allowing students to focus more on opportunities and less on formatting   complexities.
        </p> 
      </div>
    </section>
  );
};