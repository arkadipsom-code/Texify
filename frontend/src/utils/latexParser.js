/**
 * Helper utility to safely escape raw user text inputs so they don't crash LaTeX.
 */
const escapeLatex = (text) => {
  if (!text) return "";
  return (
    text
      .toString()
      // 1. Escape backslashes first safely so we don't transform subsequent overrides
      .replace(/\\/g, "\\textbackslash{}")
      // 2. Safely escape core syntax control characters
      .replace(/&/g, "\\&")
      .replace(/%/g, "\\%")
      .replace(/\$/g, "\\$")
      .replace(/#/g, "\\#")
      .replace(/_/g, "\\_")
      .replace(/{/g, "\\{")
      .replace(/}/g, "\\}")
      // 3. Handle structural typography marks
      .replace(/~/g, "\\textasciitilde{}")
      .replace(/\^/g, "\\textasciicircum{}")
      .replace(/\|/g, "\\textbar{}")
  );
};

/**
 * Robust extraction utility designed to catch and parse description fields,
 * supporting both newline-separated strings and pre-formatted arrays.
 */
const renderBulletItems = (item) => {
  if (!item) return "";

  const rawDesc =
    item.bullets ||
    item.description ||
    item.desc ||
    item.points ||
    item.details ||
    "";

  let lines = [];
  if (Array.isArray(rawDesc)) {
    lines = rawDesc;
  } else if (typeof rawDesc === "string") {
    lines = rawDesc.split(/\\n|\n/);
  }

  let latexChunk = "";
  lines.forEach((line) => {
    if (line && line.toString().trim()) {
      latexChunk += `    \\resumeItem{${escapeLatex(line.toString().trim())}}\n`;
    }
  });
  return latexChunk;
};

/**
 * Converts dynamic JSON state into a beautifully typeset "Jake's Resume" LaTeX Document.
 * Fully aligned with your specific location-free Form Wizard inputs.
 */
export function parseResumeToLaTeX(data) {
  if (!data) return "";

  const p = data.personal || {};

  // Transform name to strict UPPERCASE directly before parsing
  const rawName = p.name || "YOUR NAME";
  const uppercaseName = rawName.toString().toUpperCase();

  // Use this pattern for the entire string:
  let latex = `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Margins setup
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.0in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Section formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\begin{document}

%=== HEADER SECTION ===
\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(uppercaseName)}} \\\\ \\vspace{1pt}
    \\small 
    ${p.phone ? `${escapeLatex(p.phone)} $|$ ` : ""}
    ${p.email ? `\\href{mailto:${p.email}}{\\underline{${escapeLatex(p.email)}}} $|$ ` : ""}
    ${p.linkedin ? `\\href{${p.linkedin}}{\\underline{linkedin.com/in/${escapeLatex(p.linkedin.split("/in/")[1] || "linkedin")}}}` : ""}
    ${p.github ? ` $|$ \\href{${p.github}}{\\underline{github.com/${escapeLatex(p.github.split("/").pop() || "github")}}}` : ""}
\\end{center}
`;

  // === EDUCATION SECTION ===
  if (data.education && data.education.length > 0) {
    latex += `\n\\section{Education}\n\\resumeSubHeadingListStart\n`;
    data.education.forEach((edu) => {
      const schoolName = edu.institute || "Institution";
      const schoolYear = edu.year || "";
      const degreeText = edu.degree || "";
      const gradeVal = edu.cgpa || "";
      const degreeAndGrade = gradeVal
        ? `${degreeText} (CGPA: ${gradeVal})`
        : degreeText;

      latex += `  \\resumeEduheading
    {${escapeLatex(schoolName)}}{${escapeLatex(schoolYear)}}
    {${escapeLatex(degreeAndGrade)}}\n`;
    });
    latex += `\\resumeSubHeadingListEnd\n`;
  }

  // === EXPERIENCE SECTION ===
  if (data.experience && data.experience.length > 0) {
    latex += `\n\\section{Experience}\n\\resumeSubHeadingListStart\n`;
    data.experience.forEach((exp) => {
      const companyName = exp.company || "";
      const expDuration = exp.duration || "";
      const expRole = exp.role || "";

      latex += `  \\resumeExpheading
    {${escapeLatex(expRole)}}{${escapeLatex(expDuration)}}
    {${escapeLatex(companyName)}}\n`;

      const bullets = renderBulletItems(exp);
      if (bullets) {
        latex += `  \\resumeItemListStart\n${bullets}  \\resumeItemListEnd\n`;
      }
    });
    latex += `\\resumeSubHeadingListEnd\n`;
  }

  // === PROJECTS SECTION ===
  if (data.projects && data.projects.length > 0) {
    latex += `\n\\section{Projects}\n\\resumeSubHeadingListStart\n`;

    data.projects.forEach((proj) => {
      const titleStr = proj.title || "Project Title";
      const yearStr = proj.timeline || "";
      const techStr = proj.techStack || "";

      const headingContent =
        `\\textbf{${escapeLatex(titleStr)}}` +
        (techStr ? ` $|$ \\emph{${escapeLatex(techStr)}}` : "");
      latex += `  \\resumeProjectHeading
    {${headingContent}}{${escapeLatex(yearStr)}}\n`;

      const bullets = renderBulletItems(proj);
      if (bullets) {
        latex += `  \\resumeItemListStart\n${bullets}  \\resumeItemListEnd\n`;
      }
    });

    latex += `\\resumeSubHeadingListEnd\n`;
  }

  // === TECHNICAL SKILLS ===
  if (data.skills) {
    const s = data.skills;
    const hasSkills = s.languages || s.libraries || s.tools || s.domain;

    if (hasSkills) {
      latex += `\n\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
      ${s.languages ? `\\textbf{Languages}{: ${escapeLatex(s.languages)}} \\\\` : ""}
      ${s.libraries ? `\\textbf{Frameworks \\& Libraries}{: ${escapeLatex(s.libraries)}} \\\\` : ""}
      ${s.tools ? `\\textbf{Tools \\& Systems}{: ${escapeLatex(s.tools)}} \\\\` : ""}
      ${s.domain ? `\\textbf{Domain Specializations}{: ${escapeLatex(s.domain)}}` : ""}
    }}
\\end{itemize}\n`;
    }
  }

  // === AWARDS AND ACHIEVEMENTS ===
  if (data.achievements && data.achievements.toString().trim()) {
    latex += `\n\\section{Awards \\& Achievements}\n\\resumeItemListStart\n`;
    latex += renderBulletItems({ bullets: data.achievements });
    latex += `\\resumeItemListEnd\n`;
  }

  latex += `\n\\end{document}`;
  return latex;
}
