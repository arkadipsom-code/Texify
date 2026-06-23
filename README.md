# Texify 📄🚀

An automated resume-building platform engineered to bridge the gap between premium LaTeX formatting and effortless user experience. Built exclusively for the students of **IIEST Shibpur**, Texify eliminates the overhead of syntax debugging, allowing applicants to focus purely on engineering impactful content.

🔗 **Live Application:** [texify-nine.vercel.app](https://texify-nine.vercel.app/)

---

## 💡 The Problem & The Solution

**The Bottleneck:** LaTeX generates flawless, recruiter-ready, ATS-friendly templates. However, during high-pressure placement and internship seasons, students waste critical hours debugging alignment bugs, unclosed brackets, and package dependencies in Overleaf.

**The Solution:** Texify abstracts the compilation layer completely. It provides a intuitive, reactive form-based frontend and handles raw LaTeX compilation on the server, serving a polished, production-ready PDF instantly.

---

## 🛠️ System Architecture & Tech Stack

The application splits computational workloads across a decoupled client-server architecture:

### 1. Frontend Architecture (Vercel)
* **Framework:** React.js
* **State Management:** Highly structured, nested object states designed to map complex, multi-layered data (Education, Experience, Key Metrics, and Skills).
* **Reactive Canvas:** A dual-pane layout that computes and updates changes to the underlying data structure in real time.
* **Custom Event Interceptors:** Engineered text areas that listen for the `Enter` key event. Upon interception, the cursor buffer dynamically writes formatting prefixes, spawning a new, structured bullet point automatically.

### 2. Authentication & Gateways
* **Provider:** Google OAuth 2.0
* **Domain Guardrails:** Formulated with restricted G-Suite routing rules. The application runs strict regex checks at the authentication gateway, restricting application lifecycle access exclusively to valid `@students.iiest.ac.in` domain credentials.

### 3. Backend Compilation Engine (Render)
* **Runtime:** Node.js / Express
* **Compiler Pipeline:** Processes structured client JSON payloads, dynamically interpolates data points into pre-configured LaTeX structures, triggers an underlying system CLI compilation loop, and streams the finished binary file blob back to the client.

---

## 🚀 Key Features

* 🔒 **Campus Restricted Security:** Enforced institutional access protecting resource infrastructure.
* ⚡ **Real-Time Preview canvas:** Visually track layout distributions dynamically as you type.
* ✍️ **Smart UX Text Inputs:** Auto-bullet injection on linebreaks inside project and role descriptions.
* 📑 **One-Click Compilation:** Instant download streams containing standard, high-quality, ATS-optimized resumes.

---

## ⚠️ Known Operational Constraints & Troubleshooting

### 1. Cold Start Latency (Free Tier Compute)
The backend service is currently hosted on **Render's Free Tier Instance**. If the system has been idle, the container enters a sleep cycle. 
* **Symptom:** The platform hangs or fails to fetch inputs on the first request.
* **Fix:** Please allow **30–60 seconds** for the initial spin-up cycle to wake the server container. Subsequent processing instances compile instantly.

### 2. Browser Blob Blockers (Pop-ups)
The engine utilizes client-side file-writing logic that triggers an immediate browser window prompt containing the compiled file stream.
* **Symptom:** Clicking "Download" completes the server request, but no PDF is saved to disk.
* **Fix:** Manually toggle and enable **"Allow Pop-ups"** for `texify-nine.vercel.app` inside your browser security setting menu.

---

## 💻 Local Installation & Setup

To clone and run this project locally, ensure you have Node.js and a working LaTeX distribution (`texlive` or `miktex`) installed on your machine.

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
### Backend Setup
```bash
cd backend
npm install
npm run start
```
## License
This project is built and maintained for internal utility and educational implementation at IIEST Shibpur.

## Author
Arkadip Som
