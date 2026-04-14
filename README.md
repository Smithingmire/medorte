# Medorte Health System

A modern, production-ready, full-stack healthcare application for managing appointments, real-time doctor-patient chats, and medical records. 

## Tech Stack
**Frontend**: React, Vite, Tailwind CSS, Zustand, Socket.io-client, React Router
**Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io, JWT, Multer

## Folder Structure
- `/frontend`: Client application
- `/backend`: Server API and WebSockets

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Backend Setup
```bash
cd backend
npm install
```

Duplicate `.env.example` to `.env` and fill in your MongoDB URI and JWT secrets.

Start the backend server:
```bash
node server.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npx tailwindcss init -p # if not configured automatically
```

Start the React dev server:
```bash
npm run dev
```

### Default Ports
- Backend API runs on `http://localhost:5000`
- Frontend React App runs on `http://localhost:5173`

### Features Implemented
- **RBAC**: Admin, Patient, Doctor roles.
- **Search & Filter**: Find doctors by specialization or name.
- **Booking**: Calendar appointment system.
- **Real-time Chat**: Socket.io seamless messaging.
- **File Management**: Local file uploads for prescriptions and certificates.
- **Responsive UI**: Tailwind UI crafted for all devices.
