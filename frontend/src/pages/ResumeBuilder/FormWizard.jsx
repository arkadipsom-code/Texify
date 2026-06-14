import React from 'react';

export function FormWizard({ activeStep, resumeData, setResumeData }) {
  
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setResumeData(prev => ({
      ...prev,
      personal: { ...prev.personal, [name]: value }
    }));
  };

  return (
    <div className="w-full text-left">
      {/* STEP 1: PERSONAL DETAILS */}
      {activeStep === 1 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Personal Profile Details</h2>
            <p className="text-xs text-neutral-500 mb-4">Provide your contact info and primary developer platform links.</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-neutral-400 mb-1.5">Full Name</label>
              <input 
                type="text" name="name" value={resumeData.personal.name} onChange={handlePersonalChange}
                placeholder="Your Name" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-700 transition"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-neutral-400 mb-1.5">Primary Email Address</label>
              <input 
                type="email" name="email" value={resumeData.personal.email} onChange={handlePersonalChange}
                placeholder="you@example.com" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-700 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-neutral-400 mb-1.5">Contact Mobile</label>
                <input type="text" name="phone" value={resumeData.personal.phone} onChange={handlePersonalChange} placeholder="+91 XXX XXX XXXX" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-700" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-neutral-400 mb-1.5">LinkedIn Profile Link</label>
                <input type="url" name="linkedin" value={resumeData.personal.linkedin} onChange={handlePersonalChange} placeholder="linkedin.com/in/yourprofile" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-700" />
              </div>
            </div>

            {/* CODING HUB PROFILES */}
            <div className="border-t border-neutral-900 pt-4 mt-2">
              <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-3">Coding Profiles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-neutral-400 mb-1.5">GitHub URL</label>
                  <input type="url" name="github" value={resumeData.personal.github} onChange={handlePersonalChange} placeholder="github.com/yourprofile" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-700" />
                </div>
                {/* <div className="flex flex-col">
                  <label className="text-[11px] font-semibold text-neutral-400 mb-1.5">LeetCode URL</label>
                  <input type="url" name="leetcode" value={resumeData.personal.leetcode} onChange={handlePersonalChange} placeholder="leetcode.com/yourprofile" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-neutral-700" />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: EDUCATION INFO */}
{activeStep === 2 && (
  <div>
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-lg font-bold text-white mb-0.5">Education Info</h2>
        <p className="text-xs text-neutral-500">Academic profiles and timelines.</p>
      </div>
      <button
        type="button"
        
        onClick={() => setResumeData(prev => ({ ...prev, education: [...prev.education, { institute: '', degree: '', cgpa: '', score_type: 'CGPA', year: '' }] }))}
        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 transition"
      >
        + Add Education
      </button>
    </div>
    
    {resumeData.education.length === 0 ? (
      <div className="text-center py-12 border border-dashed border-neutral-800 rounded-2xl text-neutral-500 text-xs">No entries. Click "+ Add Education" to populate academics.</div>
    ) : (
      <div className="space-y-6 max-h-[360px] overflow-y-auto pr-1">
        {resumeData.education.map((edu, idx) => (
          <div key={idx} className="relative p-5 bg-neutral-950 border border-neutral-850 rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
              <span className="text-xs font-bold text-neutral-400">Education Entry #{idx + 1}</span>
              <button type="button" onClick={() => setResumeData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }))} className="text-xs text-rose-500 hover:text-rose-400 transition font-medium">Remove</button>
            </div>
            
            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-neutral-400 mb-1.5">Institute / University</label>
              <input type="text" value={edu.institute} onChange={(e) => { const u = [...resumeData.education]; u[idx].institute = e.target.value; setResumeData(p => ({ ...p, education: u })); }} placeholder="e.g. IIEST Shibpur" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-neutral-400 mb-1.5">Degree / Course</label>
                <input type="text" value={edu.degree} onChange={(e) => { const u = [...resumeData.education]; u[idx].degree = e.target.value; setResumeData(p => ({ ...p, education: u })); }} placeholder="B.Tech in Civil Engineering" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none" />
              </div>

              {/* ADDITION/MODIFICATION: Replaced simple input with an inline selector + text input layout */}
              <div className="flex flex-col">
                <label className="text-[11px] font-semibold text-neutral-400 mb-1.5">Grading System & Score</label>
                <div className="flex gap-2">
                  <select 
                    value={edu.score_type || 'CGPA'} 
                    onChange={(e) => { 
                      const u = [...resumeData.education]; 
                      u[idx].score_type = e.target.value; 
                      setResumeData(p => ({ ...p, education: u })); 
                    }}
                    className="h-11 px-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="CGPA">CGPA</option>
                    <option value="Percentage">Percentage</option>
                  </select>
                  
                  <input 
                    type="text" 
                    value={edu.score} 
                    onChange={(e) => { const u = [...resumeData.education]; u[idx].score = e.target.value; setResumeData(p => ({ ...p, education: u })); }} 
                    placeholder={edu.score_type === 'Percentage' ? "e.g. XX.X (Please don't include %)" : "e.g. X.XX"} 
                    className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none" 
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[11px] font-semibold text-neutral-400 mb-1.5">Timeline Duration</label>
              <input type="text" value={edu.year} onChange={(e) => { const u = [...resumeData.education]; u[idx].year = e.target.value; setResumeData(p => ({ ...p, education: u })); }} placeholder="e.g. Aug 2024 - Present" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none" />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}

      {/* STEP 3: WORK EXPERIENCE */}
      {activeStep === 3 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white mb-0.5">Work Experience</h2>
              <p className="text-xs text-neutral-500">Detail your professional roles and responsibilities.</p>
            </div>
            <button
              type="button"
              onClick={() => setResumeData(prev => ({ ...prev, experience: [...prev.experience, { role: '', company: '', duration: '', bullets: '' }] }))}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 transition"
            >
              + Add Work
            </button>
          </div>
          
          {resumeData.experience.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-neutral-800 rounded-2xl text-neutral-500 text-xs">No entries. Click "+ Add Work" to log professional histories.</div>
          ) : (
            <div className="space-y-6 max-h-[360px] overflow-y-auto pr-1">
              {resumeData.experience.map((exp, idx) => (
                <div key={idx} className="relative p-5 bg-neutral-950 border border-neutral-850 rounded-2xl space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                    <span className="text-xs font-bold text-neutral-400">Experience Job Line #{idx + 1}</span>
                    <button type="button" onClick={() => setResumeData(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }))} className="text-xs text-rose-500 hover:text-rose-400 transition font-medium">Remove</button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-neutral-400 mb-1.5">Role / Job Title</label>
                      <input type="text" value={exp.role} onChange={(e) => { const u = [...resumeData.experience]; u[idx].role = e.target.value; setResumeData(p => ({ ...p, experience: u })); }} placeholder="SWE Intern" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-neutral-400 mb-1.5">Company Entity</label>
                      <input type="text" value={exp.company} onChange={(e) => { const u = [...resumeData.experience]; u[idx].company = e.target.value; setResumeData(p => ({ ...p, experience: u })); }} placeholder="e.g., Google, Microsoft" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-neutral-400 mb-1.5">Timeline Duration</label>
                      <input type="text" value={exp.duration} onChange={(e) => { const u = [...resumeData.experience]; u[idx].duration = e.target.value; setResumeData(p => ({ ...p, experience: u })); }} placeholder="Jan 2026 - Apr 2026" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none" />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[11px] font-semibold text-neutral-400 mb-1.5">Responsibilities / Key Items (One item per line)</label>
                    <textarea rows="4" value={exp.bullets} onChange={(e) => { const u = [...resumeData.experience]; u[idx].bullets = e.target.value; setResumeData(p => ({ ...p, experience: u })); }} placeholder="Developed and maintained web applications using React and Node.js&#10;Collaborated with cross-functional teams to deliver high-quality software solutions" className="w-full px-4 py-2.5 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-600 resize-none focus:outline-none" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 4: TECHNICAL PROJECTS */}
      {activeStep === 4 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white mb-0.5">Technical Projects</h2>
              <p className="text-xs text-neutral-500">List your key technical projects with tech stack and timelines.</p>
            </div>
            <button
              type="button"
              onClick={() => setResumeData(prev => ({ ...prev, projects: [...prev.projects, { title: '', techStack: '', timeline: '', bullets: '' }] }))}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800 transition"
            >
              + Add Project
            </button>
          </div>
          
          {resumeData.projects.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-neutral-800 rounded-2xl text-neutral-500 text-xs">No projects added yet. Click "+ Add Project" to begin.</div>
          ) : (
            <div className="space-y-6 max-h-[360px] overflow-y-auto pr-1">
              {resumeData.projects.map((proj, idx) => (
                <div key={idx} className="relative p-5 bg-neutral-950 border border-neutral-850 rounded-2xl space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                    <span className="text-xs font-bold text-neutral-400">Project Module #{idx + 1}</span>
                    <button type="button" onClick={() => setResumeData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== idx) }))} className="text-xs text-rose-500 hover:text-rose-400 transition font-medium">Remove</button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-neutral-400 mb-1.5">Project Title</label>
                      <input type="text" value={proj.title} onChange={(e) => { const u = [...resumeData.projects]; u[idx].title = e.target.value; setResumeData(p => ({ ...p, projects: u })); }} placeholder="Texify - LaTeX Resume Builder" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-neutral-400 mb-1.5">Tech Stack</label>
                      <input type="text" value={proj.techStack} onChange={(e) => { const u = [...resumeData.projects]; u[idx].techStack = e.target.value; setResumeData(p => ({ ...p, projects: u })); }} placeholder="React, Node.js, Express, PostgreSQL" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[11px] font-semibold text-neutral-400 mb-1.5">Completion Year</label>
                      <input type="text" value={proj.timeline} onChange={(e) => { const u = [...resumeData.projects]; u[idx].timeline = e.target.value; setResumeData(p => ({ ...p, projects: u })); }} placeholder="2026" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-600 focus:outline-none" />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[11px] font-semibold text-neutral-400 mb-1.5">Core Contributions (One point per line)</label>
                    <textarea rows="4" value={proj.bullets} onChange={(e) => { const u = [...resumeData.projects]; u[idx].bullets = e.target.value; setResumeData(p => ({ ...p, projects: u })); }} placeholder="Developed a responsive web application using React &#10;Implemented RESTful APIs with Node.js and Express&#10;Designed and maintained a PostgreSQL database schema" className="w-full px-4 py-2.5 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-600 resize-none focus:outline-none" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STEP 5: TECHNICAL SKILLS SUMMARY */}
      {activeStep === 5 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Technical Skills Summary</h2>
            <p className="text-xs text-neutral-500 mb-4">Categorize your technical proficiencies.</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-neutral-400 mb-1.5">Languages</label>
              <input type="text" value={resumeData.skills.languages} onChange={(e) => setResumeData(p => ({ ...p, skills: { ...p.skills, languages: e.target.value } }))} placeholder="Python, C, C++" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-neutral-400 mb-1.5">Frameworks & Libraries</label>
              <input type="text" value={resumeData.skills.libraries} onChange={(e) => setResumeData(p => ({ ...p, skills: { ...p.skills, libraries: e.target.value } }))} placeholder="NumPy, Pandas, Scikit-Learn, PyTorch" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-neutral-400 mb-1.5">Tools & Systems</label>
              <input type="text" value={resumeData.skills.tools} onChange={(e) => setResumeData(p => ({ ...p, skills: { ...p.skills, tools: e.target.value } }))} placeholder="Git, VS Code, Jupyter Notebook" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none" />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-neutral-400 mb-1.5">Domain Core Specializations</label>
              <input type="text" value={resumeData.skills.domain} onChange={(e) => setResumeData(p => ({ ...p, skills: { ...p.skills, domain: e.target.value } }))} placeholder="Civil Engineering: AutoCAD" className="w-full h-11 px-4 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: HONORS AND STANDINGS */}
      {activeStep === 6 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Achievements & Standing</h2>
            <p className="text-xs text-neutral-500 mb-4">List competitive honors or academic standings.</p>
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-neutral-400 mb-1.5">Key Honors (One milestone statement per line)</label>
            <textarea 
              rows="8" value={resumeData.achievements} 
              onChange={(e) => setResumeData(prev => ({ ...prev, achievements: e.target.value }))}
              placeholder="Secured Department Rank...&#10;Achieved competitive placement metrics..." 
              className="w-full px-4 py-3 text-left rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 placeholder-neutral-600 resize-none focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}