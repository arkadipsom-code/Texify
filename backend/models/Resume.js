const db = require("../config/db");

const initDatabase = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    resume_name VARCHAR(255) NOT NULL, 
    name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    linkedin TEXT,
    github TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    resume_id INT REFERENCES resumes(id) ON DELETE CASCADE,
    institute TEXT,
    year VARCHAR(100),
    degree TEXT,
    score VARCHAR(50),      
    score_type VARCHAR(20)
);


CREATE TABLE IF NOT EXISTS experience (
    id SERIAL PRIMARY KEY,
    resume_id INT REFERENCES resumes(id) ON DELETE CASCADE,
    company TEXT,
    duration VARCHAR(100),
    role TEXT,
    description TEXT
);


CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    resume_id INT REFERENCES resumes(id) ON DELETE CASCADE,
    title TEXT,
    year VARCHAR(100),
    technologies TEXT,
    live_url TEXT,
    repo_url TEXT,
    description TEXT
);


CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    resume_id INT REFERENCES resumes(id) ON DELETE CASCADE UNIQUE,
    languages TEXT,
    libraries TEXT,
    tools TEXT,
    platforms TEXT,
    domain TEXT
);

CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    resume_id INT REFERENCES resumes(id) ON DELETE CASCADE UNIQUE,
    content TEXT
);
`;

  try {
    await db.query(queryText);
    console.log("Database tables verified successfully!");
  } catch (err) {
    console.error("Error initializing database tables:", err);
  }
};

module.exports = { initDatabase };
