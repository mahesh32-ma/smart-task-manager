# 🚀 Smart Task Manager

A full-stack user-based to-do application with JWT authentication, MongoDB persistence, and a premium dark glassmorphic UI.

![Tech Stack](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen) ![JWT](https://img.shields.io/badge/Auth-JWT-blue)

## ✨ Features

- **User Authentication** — Signup & Login with JWT tokens and bcrypt password hashing
- **Task Management** — Full CRUD (Create, Read, Update, Delete) for tasks
- **User Isolation** — Each user can only see their own tasks
- **Status Tracking** — Toggle tasks between pending and completed
- **Timestamps** — Relative time display (e.g., "2h ago")
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark Glassmorphic UI** — Premium design with animations and gradients
- **Toast Notifications** — Success/error feedback for all actions
- **Input Validation** — Client-side and server-side validation

## 📁 Folder Structure

```
full stack/
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── middleware/auth.js    # JWT auth middleware
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── Task.js           # Task schema
│   ├── routes/
│   │   ├── auth.js           # Signup/Login endpoints
│   │   └── tasks.js          # Task CRUD endpoints
│   ├── .env                  # Environment variables
│   ├── server.js             # Express entry point
│   └── package.json
├── frontend/
│   ├── css/style.css         # Complete design system
│   ├── js/
│   │   ├── api.js            # API fetch wrapper
│   │   ├── auth.js           # Auth page logic
│   │   └── dashboard.js      # Dashboard logic
│   ├── index.html            # Login page
│   ├── signup.html           # Signup page
│   └── dashboard.html        # Task dashboard
└── README.md
```

## 🛠 Prerequisites

- [Node.js](https://nodejs.org/) v16+
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)

## ⚙️ Setup Instructions

### 1. Clone & Install Backend

```bash
cd "full stack/backend"
npm install
```

### 2. Configure MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free cluster
2. Create a database user with a password
3. Whitelist your IP address (or use `0.0.0.0/0` for dev)
4. Get your connection string from **Connect > Drivers**
5. Edit `backend/.env` and replace the `MONGO_URI` placeholder:

```env
PORT=5000
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/smart-task-manager?retryWrites=true&w=majority
JWT_SECRET=change_this_to_a_random_secret_string
```

### 3. Start Backend

```bash
cd backend
npm run dev
```

The API will be running at `http://localhost:5000`

### 4. Open Frontend

Simply open `frontend/index.html` in your browser, or use a local server:

```bash
# Using Python
cd frontend
python -m http.server 3000

# Or using VS Code Live Server extension
```

## 🔗 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/tasks` | Get all user tasks | Yes |
| POST | `/api/tasks` | Create a task | Yes |
| PUT | `/api/tasks/:id` | Update a task | Yes |
| DELETE | `/api/tasks/:id` | Delete a task | Yes |

## 🚀 Deployment

### Backend (Render)
1. Push backend code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add environment variables (`MONGO_URI`, `JWT_SECRET`)

### Frontend (Netlify/Vercel)
1. Push frontend folder to GitHub
2. Deploy on [Netlify](https://netlify.com) or [Vercel](https://vercel.com)
3. Update `API_BASE` in `frontend/js/api.js` to your Render backend URL

## 📝 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: express-validator
