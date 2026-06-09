/**
 * Advanced sanitizer to completely safeguard the LaTeX engine from layout breaks
 * Handling control characters, symbols, unicode smart-quotes, and dashes.
 */
const escapeLatex = (text) => {
  if (!text) return "";
  return (
    text
      // 1. Handle standard copy-pasted smart quotes and uncommon unicode dashes
      .replace(/[\u2018\u2019]/g, "'") // Smart single quotes -> regular single quote
      .replace(/[\u201C\u201D]/g, '"') // Smart double quotes -> regular double quote
      .replace(/[\u2013\u2014]/g, "-") // En-dash and em-dash -> regular hyphen

      // 2. Escape fundamental LaTeX structural characters
      .replace(/\\/g, "\\textbackslash{}")
      .replace(/([&%$#_{}])/g, "\\$1")
      .replace(/\^/g, "\\textasciicircum{}")
      .replace(/~/g, "\\textasciitilde{}")

      // 3. Clean up common problematic characters in web copy-pasting
      .replace(/`/g, "'")
  );
};

/**
 * RESTORED PARSER: Keeps your exact original layout macros intact
 * while seamlessly forcing round bullets.
 */
export function parseResumeToLaTeX(resumeData) {
  const { personal, education, experience, projects, skills, achievements } =
    resumeData;

  // --- HEADER SECTION PARSING ---
  let personalSection = `\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(personal.name)}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(personal.phone)}`;

  if (personal.email) {
    personalSection += ` $|$ \\href{mailto:${personal.email}}{\\underline{${escapeLatex(personal.email)}}}`;
  }
  if (personal.linkedin) {
    const cleanLink = personal.linkedin.replace(/^(https?:\/\/)?(www\.)?/, "");
    personalSection += ` $|$ \\href{https://${cleanLink}}{\\underline{${escapeLatex(cleanLink)}}}`;
  }
  if (personal.github) {
    const cleanGit = personal.github.replace(/^(https?:\/\/)?(www\.)?/, "");
    personalSection += ` $|$ \\href{https://${cleanGit}}{\\underline{${escapeLatex(cleanGit)}}}`;
  }
  personalSection += `\n\\end{center}\n`;

  // --- EDUCATION SECTION PARSING ---
  let educationSection = "";
  if (education && education.length > 0) {
    educationSection += `\\section{Education}\n  \\resumeSubHeadingListStart\n`;
    education.forEach((edu) => {
      educationSection += `    \\resumeSubheading
      {${escapeLatex(edu.institute)}}{${escapeLatex(edu.year || "")}}
      {${escapeLatex(edu.degree)}}{${edu.cgpa ? `CGPA: ${edu.cgpa}` : ""}}\n`;
    });
    educationSection += `  \\resumeSubHeadingListEnd\n`;
  }

  // --- EXPERIENCE SECTION PARSING ---
  let experienceSection = "";
  if (experience && experience.length > 0) {
    experienceSection += `\\section{Experience}\n  \\resumeSubHeadingListStart\n`;
    experience.forEach((exp) => {
      // Restored your exact original 2-line heading macro format
      experienceSection += `    \\resumeSubheading
      {${escapeLatex(exp.role)}}{${escapeLatex(exp.duration)}}
      {${escapeLatex(exp.company)}}{}\n`;

      if (exp.bullets) {
        experienceSection += `    \\resumeItemListStart\n`;
        exp.bullets
          .split("\n")
          .filter((line) => line.trim())
          .forEach((bullet) => {
            experienceSection += `      \\resumeItem{${escapeLatex(bullet.trim())}}\n`;
          });
        experienceSection += `    \\resumeItemListEnd\n`;
      }
    });
    experienceSection += `  \\resumeSubHeadingListEnd\n`;
  }

  // --- PROJECTS SECTION PARSING ---
  let projectsSection = "";
  if (projects && projects.length > 0) {
    projectsSection += `\\section{Projects}\n  \\resumeSubHeadingListStart\n`;
    projects.forEach((proj) => {
      // Restored your exact original heading format
      const leftHeader = `\\textbf{${escapeLatex(proj.title)}}${proj.techStack ? ` $|$ \\emph{${escapeLatex(proj.techStack)}}` : ""}`;
      projectsSection += `    \\resumeProjectHeading
      {${leftHeader}}{${escapeLatex(proj.timeline)}}\n`;

      if (proj.bullets) {
        projectsSection += `    \\resumeItemListStart\n`;
        proj.bullets
          .split("\n")
          .filter((line) => line.trim())
          .forEach((bullet) => {
            projectsSection += `      \\resumeItem{${escapeLatex(bullet.trim())}}\n`;
          });
        projectsSection += `    \\resumeItemListEnd\n`;
      }
    });
    projectsSection += `  \\resumeSubHeadingListEnd\n`;
  }

  // --- TECHNICAL SKILLS SECTION PARSING ---
  let skillsSection = "";
  if (
    skills &&
    (skills.languages || skills.libraries || skills.tools || skills.domain)
  ) {
    skillsSection += `\\section{Technical Skills}\n \\begin{itemize}[leftmargin=0.15in, label={}]\n    \\small{\\item{\n`;
    if (skills.languages)
      skillsSection += `     \\textbf{Languages}{: ${escapeLatex(skills.languages)}} \\\\\n`;
    if (skills.libraries)
      skillsSection += `     \\textbf{Frameworks \\& Libraries}{: ${escapeLatex(skills.libraries)}} \\\\\n`;
    if (skills.tools)
      skillsSection += `     \\textbf{Tools \\& Systems}{: ${escapeLatex(skills.tools)}} \\\\\n`;
    if (skills.domain)
      skillsSection += `     \\textbf{Domain Specializations}{: ${escapeLatex(skills.domain)}} \\\\\n`;

    skillsSection = skillsSection.trim().replace(/\\\\$/, "");
    skillsSection += `\n    }}\n \\end{itemize}\n`;
  }

  // --- ACHIEVEMENTS SECTION PARSING ---
  let achievementsSection = "";
  if (achievements && achievements.trim()) {
    achievementsSection += `\\section{Awards \\& Achievements}\n \\begin{itemize}[leftmargin=0.15in, label={}]\n    \\small{\\item{\n`;
    achievements
      .split("\n")
      .filter((line) => line.trim())
      .forEach((line) => {
        achievementsSection += `     \\textbullet{} ${escapeLatex(line.trim())} \\\\\n`;
      });
    achievementsSection = achievementsSection.trim().replace(/\\\\$/, "");
    achievementsSection += `\n    }}\n \\end{itemize}\n`;
  }

  // --- PRECISE ORIGINAL PREAMBLE BOILERPLATE WITH OVERRIDES ---
  return `\\documentclass[letterpaper,11pt]{article}
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
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titrule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small#4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

% --- THE ONLY OVERRIDE NEEDED ---
% This forces LaTeX to use standard round bullets for second-level nested items 
% without altering any layouts, margins, macros, or headings.
\\renewcommand{\\labelitemii}{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\begin{document}

${personalSection}
${educationSection}
${experienceSection}
${projectsSection}
${skillsSection}
${achievementsSection}

\\end{document}`;
}
