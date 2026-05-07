# Hacker News Scraper – MERN Stack Application

A full-stack MERN application that scrapes the top stories from Hacker News, stores them in MongoDB, and allows authenticated users to bookmark stories.

Built using MongoDB, Express.js, React.js, and Node.js.

---

## Features

### Web Scraper
- Scrapes top 10 stories from Hacker News
- Extracts:
  - Title
  - URL
  - Points
  - Author
  - Posted Time
- Stores data in MongoDB
- Automatically runs on server startup
- Can be triggered manually using API

### Authentication
- User Registration
- User Login
- JWT-based authentication
- Protected routes

### Stories
- Fetch all stories
- Fetch single story
- Bookmark / Unbookmark stories
- Stories sorted by points in descending order

### Frontend
- Responsive UI using React
- Authentication state management using Context API
- Protected Bookmarks Page
- Persistent login state

---

# Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- Context API

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Scraping
- Axios
- Cheerio

---

# Folder Structure

```bash
project-root/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scraper/
│   ├── utils/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.js
│   └── .env
│
└── README.md
