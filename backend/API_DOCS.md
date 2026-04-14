# Medorte API Documentation

## Auth Routes (`/api/auth`)
- `POST /register`: Register a new Patient, Doctor, or Admin.
- `POST /login`: Authenticate user and get JWT token.
- `GET /profile`: Get the profile of the current logged-in user.

## Patient Routes (`/api/patients`)
- `GET /doctors`: Search verified doctors (optional query: `?specialization=XYZ`).
- `POST /appointments`: Book a new appointment (`doctorId`, `date`, `timeSlot`, `reason`).
- `GET /appointments`: Get all appointments for the logged-in patient.
- `GET /records`: Get all medical records associated with the logged-in patient.

## Doctor Routes (`/api/doctors`)
- `GET /appointments`: Get all appointments assigned to the logged-in doctor.
- `PUT /appointments/:id`: Update appointment status (`status`).
- `POST /prescriptions`: Create a new prescription (`patientId`, `appointmentId`, `medicines`, `notes`).

## Admin Routes (`/api/admin`)
- `GET /stats`: Get dashboard analytics.
- `GET /users`: List all users.
- `GET /doctors/unverified`: List all doctors pending verification.
- `PUT /doctors/:id/verify`: Approve or Reject a doctor (`status`).

## Messaging (`/api/messages`)
- `GET /:userId`: Retrieve chat history with a specific user.

## File Uploads (`/api/upload`)
- `POST /`: Upload a file under `uploads/` directory.

---
**WebSockets (Socket.io)**
- Event `join`: Join private room using User ID.
- Event `sendMessage`: Send a chat msg: `{ sender, receiver, text }`
- Event `receiveMessage`: Emitted when a message is received.
