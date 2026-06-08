// src/components/common/Footer.jsx
import React from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-neutral-950 border-t border-neutral-800 mt-20">
      <div className="max-w-7xl mx-auto px-10 py-8 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
        
       {/* Left Side: Project Attribution */}
<p className="flex items-center gap-1.5 flex-wrap">
  <span>&copy; {currentYear} Texify. An</span>
  <a 
    href="https://arkadipsom-portfolio.vercel.app/"
    target="_blank" 
    rel="noopener noreferrer" 
    className="bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white px-2.5 py-0.5 rounded-full border border-neutral-800 hover:border-neutral-700 transition-all duration-200 text-xs font-medium cursor-pointer shadow-sm tracking-wide"
    title="View Arkadip's Portfolio"
  >
    Arkadip Som
  </a>
  <span>Project.</span>
</p>
        
        {/* Right Side: Professional Social Links (Zero Dependencies) */}
        <div className="flex items-center gap-6">
          
          {/* GitHub Link */}
          <a 
            href="https://github.com/arkadipsom-code" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 hover:text-white transition-colors group"
            title="GitHub"
          >
            <svg 
              className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span className="text-xs font-medium">GitHub</span>
          </a>

          {/* LinkedIn Link */}
          <a 
            href="https://linkedin.com/in/arkadip-som" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 hover:text-white transition-colors group"
            title="LinkedIn"
          >
            <svg 
              className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" 
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            <span className="text-xs font-medium">LinkedIn</span>
          </a>

          {/* Twitter / X Link */}
          <a 
            href="https://twitter.com/arkadip_som" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 hover:text-white transition-colors group"
            title="X (formerly Twitter)"
          >
            <svg
              className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors"
              viewBox="0 0 1200 1227"
              fill="currentColor"
            >
              <path d="M714.163 519.284L1160.89 0H1055.67L667.137 451.887L356.275 0H0L468.492 681.821L0 1226.37H105.245L515.213 749.767L843.725 1226.37H1200L714.137 519.284H714.163ZM568.604 688.996L521.405 621.455L145.224 83.211H307.354L610.956 517.554L658.155 585.095L1055.72 1153.17H893.592L568.604 688.996Z" />
            </svg>
            <span className="text-xs font-medium">X</span>
          </a>

        </div>
      </div>
    </footer>
  );
};