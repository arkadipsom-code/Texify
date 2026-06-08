import React from 'react';
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section id="hero" className="pt-35 pb-28 max-w-7xl mx-auto px-6 relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Text Content (Left) */}
        <div className="flex flex-col gap-8">
          <h1 className="old-standard text-5xl lg:text-6xl font-serif text-white tracking-tight leading-none">
            Professional Resumes, Precisely Built.
          </h1>
          <p className="text-base text-neutral-400 leading-relaxed max-w-2xl">
            Stop fighting broken Overleaf templates and missing braces. This platform eliminates the steep LaTeX learning curve by turning your simple data inputs into pristine, professionally typeset resumes. Enter your details, click compile, and get a flawless, industry-standard PDF instantly.
          </p>
          
          <div className="flex items-center gap-4 pt-2">
            <Link to="/auth" className="px-8 py-3 bg-white text-base font-semibold text-neutral-950 rounded-full hover:bg-neutral-200 transition shadow-lg">
              Generate My Resume
            </Link>
          </div>

          <p className="text-sm text-neutral-400 pt-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-neutral-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            Built exclusively for the IIEST student community.
          </p>
        </div>

        {/* Concept 1: The Active LaTeX Parser Visualization (Right) */}
        <div className="relative w-full border border-neutral-800/80 bg-neutral-950 rounded-2xl p-5 shadow-2xl overflow-hidden min-h-[360px] flex flex-col justify-between">
          
          {/* Top Window Bar */}
          <div className="flex items-center justify-between border-b border-neutral-900 pb-3 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-800"></span>
              <span className="text-xs font-mono text-neutral-600 ml-2">texify-compiler-engine v1.0.0</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-mono text-emerald-500/90 tracking-wider uppercase font-bold">Parser Live</span>
            </div>
          </div>

          {/* Code Translation View Grid */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-stretch h-full flex-grow">
            
            {/* Left Box: Form Fields Inputs */}
            <div className="md:col-span-5 bg-neutral-900/40 border border-neutral-900 rounded-xl p-3.5 font-mono text-[11px] flex flex-col justify-center space-y-2.5">
              <div className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px] mb-1">User Input Fields</div>
              <div className="p-2 rounded border border-neutral-800 bg-neutral-950/60">
                <span className="text-neutral-500">name:</span> <span className="text-neutral-200">"Arkadip Som"</span>
              </div>
              <div className="p-2 rounded border border-neutral-800 bg-neutral-950/60">
                <span className="text-neutral-500">degree:</span> <span className="text-neutral-200">"B.Tech, Civil Eng."</span>
              </div>
              <div className="p-2 rounded border border-neutral-800 bg-neutral-950/60">
                <span className="text-neutral-500">project:</span> <span className="text-neutral-200">"Texify - Resume Builder"</span>
              </div>
            </div>

            {/* Middle Pipeline Arrow indicator */}
            <div className="md:col-span-1 flex md:flex-col items-center justify-center gap-2 py-2 md:py-0 text-neutral-700">
              <div className="hidden md:block h-8 border-l border-dashed border-neutral-800"></div>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-neutral-500 animate-lateral-pulse rotate-90 md:rotate-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
              <div className="hidden md:block h-8 border-l border-dashed border-neutral-800"></div>
            </div>

            {/* Right Box: Compiled LaTeX Syntax Output */}
            <div className="md:col-span-5 bg-neutral-900/20 border border-neutral-900 rounded-xl p-3.5 font-mono text-[11px] text-neutral-400 flex flex-col justify-center space-y-1.5 overflow-hidden relative">
              <div className="text-neutral-500 font-semibold uppercase tracking-wider text-[10px] mb-1">Generated LaTeX Markup</div>
              <div className="leading-relaxed whitespace-nowrap">
                <span className="text-emerald-500">\documentclass</span><span className="text-neutral-500">{"{"}</span>resume<span className="text-neutral-500">{"}"}</span>
              </div>
              <div className="leading-relaxed whitespace-nowrap">
                <span className="text-emerald-500">\begin</span><span className="text-neutral-500">{"{"}</span>document<span className="text-neutral-500">{"}"}</span>
              </div>
              <div className="leading-relaxed pl-3 whitespace-nowrap">
                <span className="text-amber-500">\name</span><span className="text-neutral-500">{"{"}</span>Arkadip Som<span className="text-neutral-500">{"}"}</span>
              </div>
              <div className="leading-relaxed pl-3 whitespace-nowrap">
                <span className="text-purple-400 font-semibold">\section</span><span className="text-neutral-500">{"{"}</span>Education<span className="text-neutral-500">{"}"}</span>
              </div>
              <div className="leading-relaxed pl-3 whitespace-nowrap text-neutral-500">
                \item \textbf{"{"}IIEST Shibpur{"}"}
              </div>
              <div className="leading-relaxed whitespace-nowrap">
                <span className="text-emerald-500">\end</span><span className="text-neutral-500">{"{"}</span>document<span className="text-neutral-500">{"}"}</span>
              </div>
              
              {/* Highlight Overlay Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/40 via-transparent to-transparent pointer-events-none"></div>
            </div>

          </div>

          {/* Bottom Processing Footer Bar */}
          <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-[10px] font-mono text-neutral-500">
            <span>Encoding: UTF-8</span>
            <span className="text-neutral-400">Status: Ready to Render PDF</span>
          </div>

        </div>

      </div>
    </section>
  );
};