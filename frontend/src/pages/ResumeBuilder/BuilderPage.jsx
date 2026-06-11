import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, User, GraduationCap, Briefcase, FolderGit, Cpu, Trophy, Save, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { parseResumeToLaTeX } from '../../utils/latexParser';
import { FormWizard } from './FormWizard';
import { LivePreview } from './LivePreview';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export function BuilderPage() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const { user } = useAuth(); 
  
  const [activeStep, setActiveStep] = useState(1); 
  const [pageLoading, setPageLoading] = useState(id ? true : false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [compileLoading, setCompileLoading] = useState(false);
  
  const [resumeData, setResumeData] = useState({
    resume_name: 'My New Resume',
    personal: { name: user?.name || '', email: user?.email || '', phone: '', linkedin: '', github: '', leetcode: '' },
    education: [],
    experience: [],
    projects: [],
    skills: { languages: '', libraries: '', tools: '', platforms: '', domain: '' },
    achievements: ''
  });

  useEffect(() => {
    if (!id) {
      setPageLoading(false);
      return;
    }
    const fetchExistingResume = async () => {
      try {
        setPageLoading(true);
        const data = await api.resumes.getOne(id); 
        if (data) {
          setResumeData({
            resume_name: data.resume_name || 'Untitled Resume',
            personal: {
              name: data.personal?.name || data.name || user?.name || '',
              email: data.personal?.email || data.email || user?.email || '',
              phone: data.personal?.phone || data.phone || '',
              linkedin: data.personal?.linkedin || data.linkedin || '',
              github: data.personal?.github || data.github || '',
              leetcode: data.personal?.leetcode || data.leetcode || ''
            },
            education: data.education || [],
            experience: data.experience || [],
            projects: data.projects || [],
            skills: data.skills || { languages: '', libraries: '', tools: '', platforms: '', domain: '' },
            achievements: data.achievements || ''
          });
        }
      } catch (err) {
        console.error("Error hydatrating resume:", err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchExistingResume();
  }, [id, user]);

  const handleSaveToDatabase = async () => {
    setSaveLoading(true);
    try {
      const payload = {
        resume_name: resumeData.resume_name,
        personal: resumeData.personal,
        education: resumeData.education,
        experience: resumeData.experience,
        projects: resumeData.projects,
        skills: resumeData.skills,
        achievements: resumeData.achievements
      };
      if (id) {
        await api.resumes.update(id, payload);
      } else {
        const newRecord = await api.resumes.create(payload);
        const targetId = newRecord?.resume?.id || newRecord?.id;
        if (targetId) navigate(`/builder/${targetId}`, { replace: true });
      }
      return true;
    } catch (err) {
      console.error("Database save failed:", err);
      alert("Could not save configuration data flags.");
      return false;
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCompileLatex = async () => {
    setCompileLoading(true);
    try {
      await handleSaveToDatabase();
      const rawLatexString = parseResumeToLaTeX(resumeData);
      
      const API_ROOT = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      // ✅ FIX: Read 'texify_token' instead of 'token' from both storage pools
      const token = localStorage.getItem("texify_token") || sessionStorage.getItem("texify_token");
      
      const response = await fetch(`${API_ROOT}/api/resumes/compile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Passes the clean production token string
        },
        body: JSON.stringify({ latexCode: rawLatexString }),
      });
      
      if (!response.ok) throw new Error();
      const pdfBlob = await response.blob();
      const viewUrl = window.URL.createObjectURL(pdfBlob);
      window.open(viewUrl, '_blank');
    } catch (error) {
      alert("LaTeX compilation dropped. Check fields for syntax limits.");
    } finally {
      setCompileLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-black text-white flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-neutral-700" />
      </div>
    );
  }

  const steps = [
    { id: 1, icon: User },
    { id: 2, icon: GraduationCap },
    { id: 3, icon: Briefcase },
    { id: 4, icon: FolderGit },
    { id: 5, icon: Cpu },
    { id: 6, icon: Trophy },
  ];

return (
    /* MODIFIED: Adjusted tracking heights to handle responsive flow and stop forced stretching */
    <div className="min-h-[calc(100vh-64px)] bg-black text-white p-6 md:p-8 flex flex-col lg:flex-row items-start gap-8 w-full max-w-[1800px] mx-auto">
      
      {/* LEFT INPUT PANEL */}
      <div className="w-full lg:w-[45%] flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <input 
            type="text" 
            value={resumeData.resume_name}
            onChange={(e) => setResumeData(p => ({ ...p, resume_name: e.target.value }))}
            className="bg-transparent border-b border-neutral-900 focus:border-neutral-700 outline-none text-xs text-neutral-400 font-semibold text-right px-1 max-w-[180px]"
          />
        </div>

        {/* Wizard Steps Bar */}
        <div className="flex items-center bg-neutral-950/60 border border-neutral-900/80 rounded-2xl p-1.5 gap-1 justify-between">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-2.5 rounded-xl transition flex-1 flex items-center justify-center ${
                  activeStep === step.id ? 'bg-white text-black font-semibold' : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                <IconComponent className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        {/* Input Card Container Layout */}
        <div className="bg-neutral-950/40 border border-neutral-900 rounded-3xl p-6 flex flex-col justify-between min-h-[550px] shadow-2xl">
          <FormWizard activeStep={activeStep} resumeData={resumeData} setResumeData={setResumeData} />

          <div className="flex items-center justify-between border-t border-neutral-900 pt-4 mt-6">
            <button
              disabled={activeStep === 1}
              onClick={() => setActiveStep(p => Math.max(p - 1, 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-800 text-xs text-neutral-400 hover:text-white disabled:opacity-20 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToDatabase}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 hover:text-white font-medium transition"
              >
                <Save className="w-3.5 h-3.5" /> {saveLoading ? "Saving..." : "Save Draft"}
              </button>

              {activeStep < 6 ? (
                <button
                  onClick={() => setActiveStep(p => Math.min(p + 1, 6))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold transition"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  disabled={compileLoading}
                  onClick={handleCompileLatex}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-neutral-100 hover:bg-white text-black text-xs font-bold transition"
                >
                  {compileLoading ? "Compiling..." : "Compile PDF"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT LIVE PREVIEW SHEET PANEL */}
      {/* MODIFIED: Changed max-h dynamically and added standard inline Tailwind scrollbar controls */}
      <div className="w-full lg:w-[55%] bg-neutral-900/20 text-black rounded-3xl p-6 border border-neutral-900 shadow-2xl lg:sticky lg:top-8 max-h-[calc(100vh-120px)] flex flex-col">
        <div className="bg-white rounded-2xl p-8 flex-1 overflow-y-auto max-h-[calc(100vh-170px)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <LivePreview data={resumeData} />
        </div>
      </div>

    </div>
  );
}