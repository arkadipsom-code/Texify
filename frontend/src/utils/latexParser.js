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
 * PERFECT ARCHITECTURAL PARSER
 * Aligned 100% identically with the provided Overleaf Jake Gutierrez template source.
 * Keeps exact vertical spacing and section gaps preserved.
 * @param {Object} resumeData - The unified application state object
 * @returns {string} Fully generated, exact-layout LaTeX source code
 */
export function parseResumeToLaTeX(resumeData) {
  const { personal, education, experience, projects, skills, achievements } =
    resumeData;

  // --- HEADER SECTION PARSING ---
  let personalSection = `\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(personal.name?.trim())}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(personal.phone?.trim())}`;

  if (personal.email) {
    personalSection += ` $|$ \\href{mailto:${personal.email.trim()}}{\\underline{${escapeLatex(personal.email.trim())}}}`;
  }
  if (personal.linkedin) {
    const cleanLink = personal.linkedin
      .replace(/^(https?:\/\/)?(www\.)?/, "")
      .trim();
    personalSection += ` $|$ \\href{https://${cleanLink}}{\\underline{${escapeLatex(cleanLink)}}}`;
  }
  if (personal.github) {
    const cleanGit = personal.github
      .replace(/^(https?:\/\/)?(www\.)?/, "")
      .trim();
    personalSection += ` $|$ \\href{https://${cleanGit}}{\\underline{${escapeLatex(cleanGit)}}}`;
  }
  personalSection += `\n\\end{center}\n`;

  // --- EDUCATION SECTION PARSING ---
  let educationSection = "";
  if (education && education.length > 0) {
    educationSection += `\\section{Education}\n  \\resumeSubHeadingListStart\n`;
    education.forEach((edu) => {
      // Safe dynamic optional chaining to protect inputs from crashing if undefined
      const inst = edu.institute ? edu.institute.trim() : "";
      const yr = edu.year ? edu.year.trim() : "";
      const deg = edu.degree ? edu.degree.trim() : "";
      const gpa = edu.cgpa && edu.cgpa.trim() ? `CGPA: ${edu.cgpa.trim()}` : "";

      educationSection += `    \\resumeSubheading
      {${escapeLatex(inst)}}{${escapeLatex(yr)}}
      {${escapeLatex(deg)}}{${escapeLatex(gpa)}}\n`;
    });
    educationSection += `  \\resumeSubHeadingListEnd\n`;
  }

  // --- EXPERIENCE SECTION PARSING ---
  let experienceSection = "";
  if (experience && experience.length > 0) {
    experienceSection += `\\section{Experience}\n  \\resumeSubHeadingListStart\n`;
    experience.forEach((exp) => {
      const role = exp.role ? exp.role.trim() : "";
      const dur = exp.duration ? exp.duration.trim() : "";
      const comp = exp.company ? exp.company.trim() : "";

      experienceSection += `    \\resumeSubheading
      {${escapeLatex(role)}}{${escapeLatex(dur)}}
      {${escapeLatex(comp)}}{}\n`;

      if (exp.bullets) {
        experienceSection += `      \\resumeItemListStart\n`;
        exp.bullets
          .split("\n")
          .filter((line) => line.trim())
          .forEach((bullet) => {
            experienceSection += `        \\resumeItem{${escapeLatex(bullet.trim())}}\n`;
          });
        experienceSection += `      \\resumeItemListEnd\n`;
      }
    });
    experienceSection += `  \\resumeSubHeadingListEnd\n`;
  }

  // --- PROJECTS SECTION PARSING ---
  let projectsSection = "";
  if (projects && projects.length > 0) {
    projectsSection += `\\section{Projects}\n    \\resumeSubHeadingListStart\n`;
    projects.forEach((proj) => {
      const title = proj.title ? proj.title.trim() : "";
      const stack = proj.techStack ? proj.techStack.trim() : "";
      const timeline = proj.timeline ? proj.timeline.trim() : "";

      const leftHeader = `\\textbf{${escapeLatex(title)}}${stack ? ` $|$ \\emph{${escapeLatex(stack)}}` : ""}`;
      projectsSection += `      \\resumeProjectHeading
          {${leftHeader}}{${escapeLatex(timeline)}}\n`;

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
    projectsSection += `    \\resumeSubHeadingListEnd\n`;
  }

  // --- TECHNICAL SKILLS SECTION PARSING ---
  let skillsSection = "";
  if (
    skills &&
    (skills.languages || skills.libraries || skills.tools || skills.domain)
  ) {
    skillsSection += `\\section{Technical Skills}\n \\begin{itemize}[leftmargin=0.15in, label={}]\n    \\small{\\item{\n`;
    if (skills.languages)
      skillsSection += `     \\textbf{Languages}{: ${escapeLatex(skills.languages.trim())}} \\\\\n`;
    if (skills.libraries)
      skillsSection += `     \\textbf{Frameworks and Libraries}{: ${escapeLatex(skills.libraries.trim())}} \\\\\n`;
    if (skills.tools)
      skillsSection += `     \\textbf{Tools and Platforms}{: ${escapeLatex(skills.tools.trim())}} \\\\\n`;
    if (skills.domain)
      skillsSection += `     \\textbf{Domain Knowledge}{: ${escapeLatex(skills.domain.trim())}} \\\\\n`;

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

  // --- EXACT UNTOUCHED JAKE GUTIERREZ OVERLEAF BOILERPLATE ---
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
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

${personalSection}
${educationSection}
${experienceSection}
${projectsSection}
${skillsSection}
${achievementsSection}

\\end{document}`;
}
