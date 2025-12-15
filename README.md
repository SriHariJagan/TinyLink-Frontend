# TinyLink – URL Shortener & Management Platform

TinyLink is a modern URL shortening web application similar to bit.ly. It allows users to create custom short links, track click statistics, and manage links through a clean, responsive dashboard.

---

## 🚀 Live Demo
- Frontend: https://YOUR-NETLIFY-URL.netlify.app  
- Backend API: https://YOUR-RENDER-URL.onrender.com  

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
```bash
git clone https://github.com/YOUR_USERNAME/TinyLink.git
cd TinyLink
```

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 3. Frontend Setup
```bash
cd client
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

## 📁 Project Structure

```
TinyLink/
├── client/        # React frontend
├── server/        # Node.js backend
├── README.md
```

---

## 🧪 Testing & Validation

- Stable routes for automated testing
- Proper HTTP status codes
- Inline form validation
- Loading, success, and error states

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author

**Sri Hari Jagan**  
Frontend / Full-Stack Developer  

