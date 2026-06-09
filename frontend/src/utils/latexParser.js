/**
 * Utility to escape raw text characters that crash the LaTeX compiler engine
 */
const escapeLatex = (text) => {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/([&%$#_{}])/g, "\\$1")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/~/g, "\\textasciitilde{}");
};

/**
 * Main parser function mapping FormWizard state to Jake's Template format
 * @param {Object} resumeData - The unified application state object
 * @returns {string} Fully generated, layout-safe LaTeX code
 */
export function generateResumeLatex(resumeData) {
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
    // Strips protocol prefixes cleanly for clean visual presentation anchors
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
      // Combines CGPA metrics and Timeline layout properties clean onto row 1 right side
      const rightHeaderInfo = `${edu.cgpa ? `CGPA: ${edu.cgpa} ` : ""}${edu.year ? `| ${edu.year}` : ""}`;
      educationSection += `    \\resumeSubheadingCustom
      {${escapeLatex(edu.institute)}}
      {${escapeLatex(edu.degree)}}
      {${escapeLatex(rightHeaderInfo)}}\n`;
    });
    educationSection += `  \\resumeSubHeadingListEnd\n`;
  }

  // --- EXPERIENCE SECTION PARSING ---
  let experienceSection = "";
  if (experience && experience.length > 0) {
    experienceSection += `\\section{Experience}\n  \\resumeSubHeadingListStart\n`;
    experience.forEach((exp) => {
      experienceSection += `    \\resumeExperienceHeading
      {${escapeLatex(exp.role)}}
      {${escapeLatex(exp.company)}}
      {${escapeLatex(exp.duration)}}\n`;

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
      // Maps title and technologies cleanly to look identical to Jake's format
      const leftHeader = `\\textbf{${escapeLatex(proj.title)}}${proj.techStack ? ` $|$ \\emph{${escapeLatex(proj.techStack)}}` : ""}`;
      projectsSection += `      \\resumeProjectHeading
          {${leftHeader}}{${escapeLatex(proj.timeline)}}\n`;

      if (proj.bullets) {
        projectsSection += `          \\resumeItemListStart\n`;
        proj.bullets
          .split("\n")
          .filter((line) => line.trim())
          .forEach((bullet) => {
            projectsSection += `            \\resumeItem{${escapeLatex(bullet.trim())}}\n`;
          });
        projectsSection += `          \\resumeItemListEnd\n`;
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

    // Clean trailing backslashes cleanly to prevent parser hiccups
    skillsSection = skillsSection.trim().replace(/\\\\$/, "");
    skillsSection += `\n    }}\n \\end{itemize}\n`;
  }

  // --- ACHIEVEMENTS SECTION PARSING ---
  let achievementsSection = "";
  if (achievements && achievements.trim()) {
    achievementsSection += `\\section{Achievements \\& Standings}\n \\begin{itemize}[leftmargin=0.15in, label={}]\n    \\small{\\item{\n`;
    achievements
      .split("\n")
      .filter((line) => line.trim())
      .forEach((line) => {
        achievementsSection += `     \\textbullet{} ${escapeLatex(line.trim())} \\\\\n`;
      });
    achievementsSection = achievementsSection.trim().replace(/\\\\$/, "");
    achievementsSection += `\n    }}\n \\end{itemize}\n`;
  }

  // --- COMPOSING BOILERPLATE PREAMBLE WITH DYNAMIC SEGMENTS ---
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
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheadingCustom}[3]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #3 \\\\
      \\textit{\\small#2} & \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeExperienceHeading}[3]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} @ \\textbf{#2} & #3 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\nocommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

${personalSection}
${educationSection}
${experienceSection}
${projectsSection}
${skillsSection}
${achievementsSection}

\\end{document}`;
}
