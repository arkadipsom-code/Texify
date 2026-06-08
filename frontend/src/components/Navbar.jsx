// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";
import { FileText, LogOut } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Custom handler to handle smooth top scrolling or standard route behavior
  const handleLogoClick = (e, targetPath) => {
    if (location.pathname === targetPath) {
      // If user is already on the target page, stop navigation and smooth scroll up
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth' 
      });
    }
  };

  // --- SAFE FALLBACK CALCULATIONS ---
  const userEmail = typeof user === 'string' ? user : user?.email || "";
  const defaultDisplayName = userEmail ? userEmail.split('@')[0] : "IIEST Student";
  const finalDisplayName = user?.name || defaultDisplayName;
  const avatarInitial = finalDisplayName ? finalDisplayName.charAt(0).toUpperCase() : "U";

  // Determine target path dynamically based on authentication state
  const logoTargetPath = user ? "/dashboard" : "/";

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left Side: Logo/Title */}
        {/*  Integrated our scroll top validation handler here */}
        <Link 
          to={logoTargetPath} 
          onClick={(e) => handleLogoClick(e, logoTargetPath)}
          className="flex items-center gap-2 text-white hover:opacity-90 transition"
        >
          <FileText className="w-8 h-8 text-white" />
          <span className="old-standard text-3xl tracking-tight">Texify</span>
        </Link>

        {/* Right Side: Flex Container matching baseline alignments */}
        <div className="flex items-center gap-8">
          
          {/* Public Navigation Links: Only visible when logged out */}
          {!user && (
            <div className="flex items-center gap-6">
              <a
                href="#about"
                className="text-sm font-medium text-neutral-400 hover:text-white transition"
              >
                About
              </a>
              <a
                href="#offers"
                className="text-sm font-medium text-neutral-400 hover:text-white transition"
              >
                What We Offer
              </a>
            </div>
          )}

          {/* Conditional Profile/Auth Interface */}
          {user ? (
            <div className="flex items-center gap-4 border-l border-neutral-800 pl-6 h-8">
              
              {/* Profile Details Container */}
              <div className="flex flex-col text-right justify-center">
                <span className="text-sm font-semibold text-neutral-200 leading-none mb-1 truncate max-w-[150px]">
                  {finalDisplayName}
                </span>
                <span className="text-xs text-neutral-500 max-w-[180px] truncate leading-none">
                  {userEmail}
                </span>
              </div>

              {/* Minimal Avatar Circle */}
              <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-sm font-bold text-neutral-200 shadow-inner uppercase">
                {avatarInitial}
              </div>

              {/* Logout Action Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white rounded-xl transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/auth" 
              className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-full hover:bg-neutral-200 transition shadow"
            >
              Login / Sign Up
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};