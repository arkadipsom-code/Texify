const escapeLatex = (text) => {
  if (!text) return "";
  return text
    .toString()
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/\|/g, "\\textbar{}");
};

const renderBulletItems = (item) => {
  const rawDesc =
    item.bullets ||
    item.description ||
    item.desc ||
    item.points ||
    item.details ||
    "";
  let lines = Array.isArray(rawDesc)
    ? rawDesc
    : typeof rawDesc === "string"
      ? rawDesc.split(/\\n|\n/)
      : [];

  return lines
    .filter((line) => line && line.toString().trim())
    .map((line) => {
      // This regex cleans up any existing "-" or "•" to prevent double-bullet issues
      const cleanLine = line
        .toString()
        .trim()
        .replace(/^[-•]\s*/, "");
      return `    \\resumeItem{${escapeLatex(cleanLine)}}`;
    })
    .join("\n");
};

export function parseResumeToLaTeX(data) {
  if (!data) return "";
  const p = data.personal || {};
  const s = data.skills || {};
  const uppercaseName = (p.name || "YOUR NAME").toString().toUpperCase();

  return `\\documentclass[letterpaper,11pt]{article}
\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.0in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}
\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\newcommand{\\resumeItem}[1]{\\item #1}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}}

\\newcommand{\\resumeProjectHeading}[2]{
    \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(uppercaseName)}} \\\\ \\vspace{1pt}
    \\small ${p.phone ? `${escapeLatex(p.phone)} $|$ ` : ""}${p.email ? `\\href{mailto:${p.email}}{\\underline{${escapeLatex(p.email)}}} $|$ ` : ""}${p.linkedin ? `\\underline{${escapeLatex(p.linkedin)}} $|$ ` : ""}${p.github ? `\\underline{${escapeLatex(p.github)}}` : ""}
\\end{center}

\\section{Education}
\\resumeSubHeadingListStart
${(data.education || []).map((edu) => `  \\resumeSubheading{${escapeLatex(edu.institute)}}{${escapeLatex(edu.year)}}{${escapeLatex(edu.degree)}}{${escapeLatex(edu.cgpa ? "CGPA: " + edu.cgpa : "")}}`).join("\n")}
\\resumeSubHeadingListEnd

\\section{Experience}
\\resumeSubHeadingListStart
${(data.experience || []).map((exp) => `  \\resumeSubheading{${escapeLatex(exp.role)}}{${escapeLatex(exp.duration)}}{${escapeLatex(exp.company)}}{}\n  \\resumeItemListStart\n${renderBulletItems(exp)}\n  \\resumeItemListEnd`).join("\n")}
\\resumeSubHeadingListEnd

\\section{Projects}
\\resumeSubHeadingListStart
${(data.projects || []).map((proj) => `  \\resumeProjectHeading{\\textbf{${escapeLatex(proj.title)}} $|$ \\emph{${escapeLatex(proj.techStack)}}}{${escapeLatex(proj.timeline)}}\n  \\resumeItemListStart\n${renderBulletItems(proj)}\n  \\resumeItemListEnd`).join("\n")}
\\resumeSubHeadingListEnd

\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
      ${s.languages ? `\\textbf{Languages}{: ${escapeLatex(s.languages)}} \\\\` : ""}
      ${s.libraries ? `\\textbf{Frameworks \\& Libraries}{: ${escapeLatex(s.libraries)}} \\\\` : ""}
      ${s.tools ? `\\textbf{Tools \\& Systems}{: ${escapeLatex(s.tools)}}` : ""}
      ${s.domain ? `\\textbf{Domain Specialization}{: ${escapeLatex(s.domain)}}` : ""}
    }}
\\end{itemize}

${data.achievements ? `\\section{Awards \\& Achievements}\n\\resumeItemListStart\n${renderBulletItems({ bullets: data.achievements })}\n\\resumeItemListEnd` : ""}

\\end{document}`;
}
