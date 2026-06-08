const db = require("../config/db");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// Fetch high-level resume listings for the dashboard grid view
const getUserResumes = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await db.query(
      "SELECT * FROM resumes WHERE user_id = $1 ORDER BY updated_at DESC",
      [userId],
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve resumes." });
  }
};

// Retrieve a detailed resume document structure with sub-tables remapped to frontend state keys
const getResumeById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const resumeResult = await db.query(
      "SELECT * FROM resumes WHERE id = $1 AND user_id = $2",
      [id, userId],
    );

    if (resumeResult.rows.length === 0) {
      return res.status(404).json({ error: "Resume not found." });
    }

    const resume = resumeResult.rows[0];

    // Parallel extraction of child relations
    const [eduRes, expRes, projRes, skillRes, achRes] = await Promise.all([
      db.query("SELECT * FROM education WHERE resume_id = $1", [id]),
      db.query("SELECT * FROM experience WHERE resume_id = $1", [id]),
      db.query("SELECT * FROM projects WHERE resume_id = $1", [id]),
      db.query("SELECT * FROM skills WHERE resume_id = $1", [id]),
      db.query("SELECT * FROM achievements WHERE resume_id = $1", [id]),
    ]);

    // Format payload properties to resolve naming mismatches between wizard data states and schema columns
    const structuredResume = {
      id: resume.id,
      resume_name: resume.resume_name,
      personal: {
        name: resume.name || "",
        phone: resume.phone || "",
        email: resume.email || "",
        linkedin: resume.linkedin || "",
        github: resume.github || "",
      },
      education: eduRes.rows,
      experience: expRes.rows.map((exp) => ({
        role: exp.role || "",
        company: exp.company || "",
        duration: exp.duration || "",
        bullets: exp.description || "",
      })),
      projects: projRes.rows.map((proj) => ({
        title: proj.title || "",
        techStack: proj.technologies || "",
        timeline: proj.year || "",
        live_url: proj.live_url || "",
        repo_url: proj.repo_url || "",
        bullets: proj.description || "",
      })),
      skills: skillRes.rows[0] || {
        languages: "",
        libraries: "",
        tools: "",
        platforms: "",
        domain: "",
      },
      achievements: achRes.rows[0]?.content || "",
    };

    res.status(200).json(structuredResume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve the resume profile." });
  }
};

// Handle incoming new document tree structures inside a strict transactional write lock
const createResume = async (req, res) => {
  const userId = req.user.id;
  const {
    resume_name,
    personal,
    education,
    experience,
    projects,
    skills,
    achievements,
  } = req.body;

  try {
    if (!resume_name) {
      return res.status(400).json({ error: "Resume name is required." });
    }

    await db.query("BEGIN");

    // Root metadata entry
    const insertResumeQuery = `
      INSERT INTO resumes (user_id, resume_name, name, phone, email, linkedin, github)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id;
    `;
    const resumeValues = [
      userId,
      resume_name,
      personal?.name || null,
      personal?.phone || null,
      personal?.email || null,
      personal?.linkedin || null,
      personal?.github || null,
    ];

    const resumeResult = await db.query(insertResumeQuery, resumeValues);
    const resumeId = resumeResult.rows[0].id;

    // Relational entries processing
    if (education && Array.isArray(education)) {
      for (const edu of education) {
        await db.query(
          "INSERT INTO education (resume_id, institute, year, degree, cgpa) VALUES ($1, $2, $3, $4, $5)",
          [resumeId, edu.institute, edu.year, edu.degree, edu.cgpa],
        );
      }
    }

    if (experience && Array.isArray(experience)) {
      for (const exp of experience) {
        await db.query(
          "INSERT INTO experience (resume_id, company, duration, role, description) VALUES ($1, $2, $3, $4, $5)",
          [
            resumeId,
            exp.company,
            exp.duration,
            exp.role,
            exp.bullets || exp.description || null,
          ],
        );
      }
    }

    if (projects && Array.isArray(projects)) {
      for (const proj of projects) {
        await db.query(
          "INSERT INTO projects (resume_id, title, year, technologies, live_url, repo_url, description) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [
            resumeId,
            proj.title,
            proj.timeline || proj.year || null,
            proj.techStack || proj.technologies || null,
            proj.live_url,
            proj.repo_url,
            proj.bullets || proj.description || null,
          ],
        );
      }
    }

    if (skills) {
      await db.query(
        "INSERT INTO skills (resume_id, languages, libraries, tools, platforms, domain) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          resumeId,
          skills.languages,
          skills.libraries,
          skills.tools,
          skills.platforms,
          skills.domain,
        ],
      );
    }

    if (achievements) {
      const contentText =
        typeof achievements === "object" ? achievements.content : achievements;
      await db.query(
        "INSERT INTO achievements (resume_id, content) VALUES ($1, $2)",
        [resumeId, contentText || null],
      );
    }

    await db.query("COMMIT");
    res.status(201).json({
      message: "Resume profile created successfully!",
      resume: { id: resumeId },
    });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to create resume profile." });
  }
};

// Update records via clean array re-insertions to match dynamic form edits smoothly
const updateResume = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const {
    resume_name,
    personal,
    education,
    experience,
    projects,
    skills,
    achievements,
  } = req.body;

  try {
    const checkResult = await db.query(
      "SELECT id FROM resumes WHERE id = $1 AND user_id = $2",
      [id, userId],
    );

    if (checkResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Resume not found or unauthorized." });
    }

    await db.query("BEGIN");

    const updateResumeQuery = `
      UPDATE resumes 
      SET resume_name = $1, name = $2, phone = $3, email = $4, linkedin = $5, github = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 AND user_id = $8;
    `;
    await db.query(updateResumeQuery, [
      resume_name,
      personal?.name || null,
      personal?.phone || null,
      personal?.email || null,
      personal?.linkedin || null,
      personal?.github || null,
      id,
      userId,
    ]);

    // Resync child dependencies using data wiping strategy
    await db.query("DELETE FROM education WHERE resume_id = $1", [id]);
    if (education && Array.isArray(education)) {
      for (const edu of education) {
        await db.query(
          "INSERT INTO education (resume_id, institute, year, degree, cgpa) VALUES ($1, $2, $3, $4, $5)",
          [id, edu.institute, edu.year, edu.degree, edu.cgpa],
        );
      }
    }

    await db.query("DELETE FROM experience WHERE resume_id = $1", [id]);
    if (experience && Array.isArray(experience)) {
      for (const exp of experience) {
        await db.query(
          "INSERT INTO experience (resume_id, company, duration, role, description) VALUES ($1, $2, $3, $4, $5)",
          [
            id,
            exp.company,
            exp.duration,
            exp.role,
            exp.bullets || exp.description || null,
          ],
        );
      }
    }

    await db.query("DELETE FROM projects WHERE resume_id = $1", [id]);
    if (projects && Array.isArray(projects)) {
      for (const proj of projects) {
        await db.query(
          "INSERT INTO projects (resume_id, title, year, technologies, live_url, repo_url, description) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [
            id,
            proj.title,
            proj.timeline || proj.year || null,
            proj.techStack || proj.technologies || null,
            proj.live_url,
            proj.repo_url,
            proj.bullets || proj.description || null,
          ],
        );
      }
    }

    await db.query("DELETE FROM skills WHERE resume_id = $1", [id]);
    if (skills) {
      await db.query(
        "INSERT INTO skills (resume_id, languages, libraries, tools, platforms, domain) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          id,
          skills.languages,
          skills.libraries,
          skills.tools,
          skills.platforms,
          skills.domain,
        ],
      );
    }

    await db.query("DELETE FROM achievements WHERE resume_id = $1", [id]);
    if (achievements) {
      const contentText =
        typeof achievements === "object" ? achievements.content : achievements;
      await db.query(
        "INSERT INTO achievements (resume_id, content) VALUES ($1, $2)",
        [id, contentText || null],
      );
    }

    await db.query("COMMIT");
    res.status(200).json({ message: "Resume updated successfully!" });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to update resume." });
  }
};

// Permanent cascading document removal routine
const deleteResume = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const checkResult = await db.query(
      "SELECT id FROM resumes WHERE id = $1 AND user_id = $2",
      [id, userId],
    );

    if (checkResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Resume not found or unauthorized." });
    }

    await db.query("BEGIN");

    // Delete isolated records manually to ensure consistent reference clearing
    await db.query("DELETE FROM education WHERE resume_id = $1", [id]);
    await db.query("DELETE FROM experience WHERE resume_id = $1", [id]);
    await db.query("DELETE FROM projects WHERE resume_id = $1", [id]);
    await db.query("DELETE FROM skills WHERE resume_id = $1", [id]);
    await db.query("DELETE FROM achievements WHERE resume_id = $1", [id]);
    await db.query("DELETE FROM resumes WHERE id = $1 AND user_id = $2", [
      id,
      userId,
    ]);

    await db.query("COMMIT");
    res.status(200).json({ message: "Resume completely deleted." });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Failed to delete resume." });
  }
};

// Binary local pdflatex runtime execution and compilation stream
const compileLatex = (req, res) => {
  const { latexCode } = req.body;

  if (!latexCode) {
    return res.status(400).json({ error: "No LaTeX code provided." });
  }

  const uniqueId = `resume_${Date.now()}`;

  // SAFE ROUTING: Uses OS-level /tmp for cloud production Linux, falls back to your local temp folder for Windows development
  const outputDir =
    process.env.NODE_ENV === "production"
      ? "/tmp"
      : path.join(__dirname, "../temp");
  const texFilePath = path.join(outputDir, `${uniqueId}.tex`);
  const pdfFilePath = path.join(outputDir, `${uniqueId}.pdf`);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(texFilePath, latexCode, "utf8");

  // OPTIMIZED: Changed interaction mode to batchmode for production safety.
  // If there's a minor typo in a user's inputs, batchmode spits out whatever it can compile without locking the server.
  const command = `pdflatex -interaction=batchmode -output-directory="${outputDir}" "${texFilePath}"`;

  exec(command, (error, stdout, stderr) => {
    if (!fs.existsSync(pdfFilePath)) {
      console.error(
        "LaTeX Compilation Failed! Diagnostic Log Output:",
        stderr || stdout,
      );
      cleanupFiles(uniqueId, outputDir);
      return res
        .status(500)
        .json({
          error:
            "LaTeX compilation failed. Please verify equation formatting syntax.",
        });
    }

    res.sendFile(pdfFilePath, {}, () => {
      cleanupFiles(uniqueId, outputDir);
    });
  });
};

// Helper function to remove compilation metadata artifacts from disk storage
const cleanupFiles = (filePrefix, dir) => {
  const extensions = [".tex", ".pdf", ".log", ".aux", ".out"];
  extensions.forEach((ext) => {
    const filePath = path.join(dir, `${filePrefix}${ext}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
};

module.exports = {
  getUserResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  compileLatex,
};
