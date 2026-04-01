# 🚀 SocialFlow AI

AI-powered social media automation platform for scheduling posts, generating content, and managing multi-platform workflows with a modern SaaS dashboard.

---

## ✨ Features

* 🔐 **Authentication System**

  * Secure login/signup with JWT
  * User profile with avatar

* 🔗 **Multi-Platform Integration**

  * Twitter/X & LinkedIn support
  * Scalable structure for Instagram (coming soon)

* 📝 **Post Management**

  * Create, edit, delete posts
  * Multi-platform publishing
  * Media upload & preview

* 🤖 **AI Content Generator**

  * Generate captions, hashtags, hooks
  * Tone selection (professional, viral, casual)

* ⏳ **Smart Scheduler**

  * Queue-based scheduling (Celery + Redis)
  * Timezone support
  * Auto retry on failure

* ⚡ **Automation Workflows**

  * Rule-based posting system
  * Recurring posts & auto-posting

* 📅 **Content Calendar**

  * Drag & drop scheduling
  * Monthly view

* 📊 **Analytics Dashboard**

  * Engagement tracking (likes, reach, etc.)
  * Visual charts & performance insights

* 🔔 **Notifications**

  * Post success/failure alerts

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Framer Motion

### Backend

* FastAPI (Python)
* SQLAlchemy

### Database

* MySQL

### Queue System

* Celery + Redis

### AI Integration

* OpenAI API

---

## 📁 Project Structure

```
social-automation-platform/
├── client/        # React frontend
├── server/        # FastAPI backend
├── shared/        # shared utilities
├── infra/         # docker/nginx configs
├── docs/          # documentation
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/sakshampandey380/SocialFow_AI.git
cd socialflow-ai
```

---

### 2. Backend Setup

```
cd server
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

### 3. Frontend Setup

```
cd client
npm install
npm run dev
```

---

### 4. Environment Variables

Create `.env` file in root:

```
DATABASE_URL=your_mysql_url
JWT_SECRET=your_secret
OPENAI_API_KEY=your_key
REDIS_URL=your_redis_url
```

---

## 🚀 Future Improvements

* Instagram API integration
* Advanced analytics with AI insights
* Team collaboration features
* Mobile responsive optimization

---

## 💡 Inspiration

Built as a modern SaaS-style automation tool similar to Buffer & Hootsuite, enhanced with AI capabilities.

---

## 👨‍💻 Author

**Saksham Pandey**

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!
