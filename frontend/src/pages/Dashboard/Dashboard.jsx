import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userEmail = typeof user === 'string' ? user : user?.email || "";
  const defaultDisplayName = userEmail ? userEmail.split('@')[0] : "Academic Scholar";
  const finalDisplayName = user?.name || defaultDisplayName;

  // Fetch saved resume documents cleanly using the secure cookie-enabled api layer
  useEffect(() => {
    const loadUserResumes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Clean service call with zero manual Authorization header overrides
        const responseData = await api.resumes.getAll();

        // Data Guard: Extract the array properly if backend wraps it inside an envelope
        const finalizedArray = Array.isArray(responseData) 
          ? responseData 
          : (responseData?.resumes || responseData?.data || []);

        setResumes(finalizedArray);
      } catch (err) {
        console.error("Dashboard engine data-sync error:", err);
        setError("Failed to load your resumes. Please verify server status or connection flags.");
      } finally {
        setLoading(false);
      }
    };

    loadUserResumes();
  }, []);

  const handleCreateNew = () => {
    navigate('/builder');
  };

  const handleDeleteResume = async (id, e) => {
    e.stopPropagation(); 
    if (!window.confirm("Are you sure you want to permanently delete this resume draft?")) return;

    try {
      // 🍪 Leverages our secure, parameter-free cookie delete pipeline
      await api.resumes.delete(id);
      setResumes(prev => prev.filter(item => item.id !== id && item._id !== id));
    } catch (err) {
      alert("Could not remove the document node. Try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 selection:bg-neutral-800">
      
      {/* HEADER ROW */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-neutral-900 pb-8 mb-12 pt-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to Texify, <span className="text-neutral-400">{finalDisplayName}</span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1">Manage your professional LaTeX formatted resumes here.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-md"
          >
            <Plus className="w-4 h-4" /> Create New Resume
          </button>
        </div>
      </div>

      {/* CORE CONTENT GRID */}
      <div className="max-w-7xl mx-auto pb-16">
        <h2 className="text-base font-semibold text-neutral-400 mb-6 tracking-wide">Your Resumes</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-neutral-600" />
            <p className="text-xs text-neutral-500">Querying localized cloud storage templates...</p>
          </div>
        ) : error ? (
          <div className="bg-neutral-950 border border-neutral-900 text-red-400/90 text-xs p-4 rounded-xl flex items-center gap-3 max-w-2xl mx-auto shadow-inner">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        ) : resumes.length === 0 ? (
          <div className="border border-dashed border-neutral-900 rounded-3xl p-16 text-center max-w-xl mx-auto mt-4 flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-neutral-950 border border-neutral-900 rounded-2xl flex items-center justify-center text-neutral-600 text-lg">🗄️</div>
            <div>
              <p className="text-sm font-semibold text-neutral-300">No layout sheets generated yet</p>
              <p className="text-xs text-neutral-500 mt-1">Create your primary workspace record to get compiling.</p>
            </div>
            <button
              onClick={handleCreateNew}
              className="bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 px-4 py-2 rounded-xl text-xs font-semibold transition mt-2"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id || resume._id}
                onClick={() => navigate(`/builder/${resume.id || resume._id}`)}
                className="bg-neutral-950 border border-neutral-900 hover:border-neutral-700 rounded-2xl p-5 transition cursor-pointer group flex flex-col justify-between h-40 shadow-xl"
              >
                <div className="flex items-start justify-between w-full gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-neutral-900 group-hover:bg-neutral-900 rounded-xl flex items-center justify-center border border-neutral-800 transition">
                      <FileText className="w-4 h-4 text-neutral-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-neutral-200 group-hover:text-white truncate max-w-[160px]">
                        {resume.resume_name || 'Untitled Template'}
                      </h3>
                      <p className="text-[10px] text-neutral-500 mt-0.5">
                        Last edited:{" "}
                        {resume.updated_at ? new Date(resume.updated_at).toLocaleDateString('en-GB') : 'Recent Draft'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDeleteResume(resume.id || resume._id, e)}
                    className="p-1.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-neutral-900 transition"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[11px] text-neutral-500 border-t border-neutral-900 pt-3 flex items-center justify-between">
                  <span>Created: {resume.created_at ? new Date(resume.created_at).toLocaleDateString('en-GB') : 'Recent Draft'}</span>
                  <span className="text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold">Open Editor →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}