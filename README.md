# TinyLink – URL Shortener & Management Platform

TinyLink is a modern URL shortening web application similar to bit.ly. It allows users to create custom short links, track click statistics, and manage links through a clean, responsive dashboard.

---

## 🚀 Live Demo
- https://tinylk.netlify.app/

---

## 🛠 Tech Stack

**Frontend**
- React.js
- CSS Modules
- Framer Motion

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)

**Hosting**
- Netlify (Frontend)
- Render (Backend)

---

## ✨ Features

### Core Features
- Create short links with optional custom codes (6–8 alphanumeric characters)
- URL validation before saving
- Global uniqueness check for custom codes (returns 409 if duplicate)
- HTTP 302 redirect for valid short links
- Click tracking (total clicks + last clicked time)
- Delete links (returns 404 after deletion)

### Dashboard (/)
- View all short links in a table
- Add and delete links
- Search and filter by code or target URL
- Copy short links to clipboard
- Responsive layout for mobile and desktop

### Stats Page (/code/:code)
- View detailed statistics for a single short link

### Health Check (/healthz)
```json
{
  "ok": true,
  "version": "1.0"
}
```

---

## 📦 Installation & Setup

### 1. Clone the repository
  #### Frontend
  ```bash
  git clone https://github.com/SriHariJagan/TinyLink-Frontend
  cd TinyLink
  ```
  ### Backend
    ```bash
  git https://github.com/SriHariJagan/TinyLink-Backend
  cd TinyLink
  ```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file in the `server` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
BASE_URL=http://localhost:3000
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/links | Create a short link (409 if code exists) |
| GET | /api/links | List all links |
| GET | /api/links/:code | Get stats for a link |
| DELETE | /api/links/:code | Delete a link |
| GET | /healthz | Health check endpoint |

---


## 🧪 Testing & Validation

- Stable routes for automated testing
- Proper HTTP status codes
- Inline form validation
- Loading, success, and error states

---


## 👤 Author

**Sri Hari Jagan**  
Frontend / Full-Stack Developer  

