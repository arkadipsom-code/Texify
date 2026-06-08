import React from 'react';
import { FileText } from 'lucide-react';

export function LivePreview({ data }) {
  const { personal, education, experience, projects, skills, achievements } = data;

  return (
    <div className="w-full h-full flex flex-col justify-between select-text">
      
      {/* PERSISTENT SUB-HEADER STATUS BAR */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4 select-none">
        <div className="flex items-center gap-2 text-neutral-400 text-xs font-semibold">
          <FileText className="w-4 h-4 text-neutral-400" />
          <span>Interactive Document Sync Mode</span>
        </div>
      </div>

      {/* DOCUMENT PREVIEW CANVAS SHEET */}
      <div className="flex-1 flex flex-col justify-between font-serif text-neutral-950 text-xs text-left">
        <div>
          {/* HEADER IDENTITY LAYOUT */}
          <div className="text-center space-y-1 mb-4">
            <h1 className="text-xl font-bold uppercase tracking-wide text-black min-h-[28px]">
              {personal.name || "YOUR FULL NAME"}
            </h1>
            <div className="text-[10px] text-neutral-700 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 font-sans font-medium">
              {personal.phone && <span>{personal.phone}</span>}
              {personal.email && (
                <>
                  <span className="text-neutral-300">|</span>
                  <span className="underline">{personal.email}</span>
                </>
              )}
              {personal.linkedin && (
                <>
                  <span className="text-neutral-300">|</span>
                  <span className="text-blue-800 underline">{personal.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </>
              )}
              {personal.github && (
                <>
                  <span className="text-neutral-300">|</span>
                  <span className="underline">{personal.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </>
              )}
              {personal.leetcode && (
                <>
                  <span className="text-neutral-300">|</span>
                  <span className="underline">{personal.leetcode.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </>
              )}
            </div>
          </div>

          {/* SECTION: EDUCATION */}
          {education && education.length > 0 && (
            <div className="mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 font-sans">Education</h2>
              <div className="space-y-2">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex flex-col gap-0.5">
                    <div className="flex items-start justify-between font-bold text-neutral-900">
                      <span>{edu.institute || "Institution Name Placeholder"}</span>
                      <span className="font-normal text-neutral-700 font-sans text-[10px] shrink-0 ml-4">{edu.year || "Timeline"}</span>
                    </div>
                    <div className="flex items-start justify-between text-neutral-700 text-[11px] italic">
                      <span>{edu.degree || "Degree Specialization"}</span>
                      {edu.cgpa && <span className="font-sans font-medium text-[10px] not-italic text-black">CGPA: {edu.cgpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: EXPERIENCE */}
          {experience && experience.length > 0 && (
            <div className="mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 font-sans">Experience</h2>
              <div className="space-y-3">
                {experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-start justify-between font-bold text-neutral-900">
                      <span>{exp.role || "Designation / Role"}</span>
                      <span className="font-normal text-neutral-700 font-sans text-[10px] shrink-0 ml-4">{exp.duration || "Duration Timeline"}</span>
                    </div>
                    <div className="text-neutral-800 italic text-[11px] -mt-0.5">{exp.company || "Company / Organization"}</div>
                    {exp.bullets && (
                      <ul className="list-disc pl-4 text-[11px] space-y-0.5 text-neutral-900 leading-tight">
                        {exp.bullets.split('\n').map((line, bIdx) => line.trim() && <li key={bIdx} className="pl-0.5">{line.trim()}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: PROJECTS */}
          {projects && projects.length > 0 && (
            <div className="mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 font-sans">Projects</h2>
              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-start justify-between font-bold text-neutral-900">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span>{proj.title || "Project Specification Title"}</span>
                        {proj.techStack && (
                          <span className="font-sans font-normal text-[10px] text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded-md">
                            {proj.techStack}
                          </span>
                        )}
                      </div>
                      <span className="font-normal text-neutral-700 font-sans text-[10px] shrink-0 ml-4">{proj.timeline || "Timeline"}</span>
                    </div>
                    {proj.bullets && (
                      <ul className="list-disc pl-4 text-[11px] space-y-0.5 text-neutral-900 leading-tight">
                        {proj.bullets.split('\n').map((line, bIdx) => line.trim() && <li key={bIdx} className="pl-0.5">{line.trim()}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: SKILLS */}
          {(skills.languages || skills.libraries || skills.tools || skills.domain) && (
            <div className="mb-4">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 font-sans">Technical Skills</h2>
              <div className="space-y-1 text-[11px] text-neutral-950">
                {skills.languages && <div><strong className="font-sans font-semibold text-[10.5px]">Languages:</strong> {skills.languages}</div>}
                {skills.libraries && <div><strong className="font-sans font-semibold text-[10.5px]">Libraries & Frameworks:</strong> {skills.libraries}</div>}
                {skills.tools && <div><strong className="font-sans font-semibold text-[10.5px]">Developer Tools:</strong> {skills.tools}</div>}
                {skills.domain && <div><strong className="font-sans font-semibold text-[10.5px]">Domain Knowledge:</strong> {skills.domain}</div>}
              </div>
            </div>
          )}

          {/* SECTION: ACHIEVEMENTS */}
          {/* {achievements && (
            <div className="mb-2">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 font-sans">Awards & Achievements</h2>
              <ul className="list-disc pl-4 text-[11px] space-y-0.5 text-neutral-900 leading-tight">
                {achievements.split('\n').map((line, bIdx) => line.trim() && <li key={bIdx} className="pl-0.5">{line.trim()}</li>)}
              </ul>
            </div>
          )} */}
          {typeof achievements === 'string' && achievements.trim() && (
          <div className="mb-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-1.5 font-sans">
              Awards & Achievements
            </h2>
            <ul className="list-disc pl-4 text-[11px] space-y-0.5 text-neutral-900 leading-tight">
              {achievements.split('\n').map((line, bIdx) => 
                line.trim() && <li key={bIdx} className="pl-0.5">{line.trim()}</li>
              )}
            </ul>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}