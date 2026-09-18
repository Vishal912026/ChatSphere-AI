# ChatSphere AI 🤖

A full-stack ChatGPT-style AI chat application built with the MERN stack and Google's Gemini API. Features secure authentication, real-time conversations, voice input, and a fully responsive dark/light theme.

🔗 **Live Demo:** [https://chatsphere-ai-frontend.onrender.com](https://chatsphere-ai-frontend.onrender.com)

> ⚠️ Note: Hosted on Render's free tier — the backend may take 30–50 seconds to wake up on first load if inactive.

---

## ✨ Features

- **User Authentication** — Secure signup/login with JWT-based auth and per-user data isolation
- **Real-time AI Chat** — Powered by Google Gemini API, with markdown & table rendering support
- **Chat History** — Persistent threads with create/switch/delete functionality
- **Voice Input** — Speak-to-type using the Web Speech API, with Hindi/English toggle
- **Dark & Light Theme** — Fully theme-aware UI with persistent user preference
- **Responsive Design** — Clean, ChatGPT-inspired interface

## 🛠️ Tech Stack

**Frontend:** React (Vite), React Router, React Markdown, Web Speech API  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose)  
**AI:** Google Gemini API  
**Auth:** JWT, bcrypt  
**Deployment:** Render (Web Service + Static Site)

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key ([Get one here](https://aistudio.google.com))

### Installation

1. Clone the repo
```bash
git clone https://github.com/Vishal912026/ChatSphere-AI.git
cd ChatSphere-AI
```

2. Setup Backend
```bash
cd Backend
npm install
```
Create a `.env` file in `Backend/`:
