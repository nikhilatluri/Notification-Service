# Notification Service

Handles notifications for the Hospital Management System. Shows notifications as alerts/logs (no actual SMS/email integration).

## Features
- **Notification Types**: APPOINTMENT_CONFIRMATION, APPOINTMENT_REMINDER, CANCELLATION, BILL_GENERATED, PAYMENT_RECEIVED, APPOINTMENT_RESCHEDULED
- **Simulated Delivery**: Logs notifications as alerts
- **Status Tracking**: SENT, READ
- **Patient-specific**: Filter by patient

## Tech Stack
Node.js 18, Express, PostgreSQL, Winston, Swagger

## Quick Start
```bash
npm install
cp .env.example .env
npm start
```

## API Endpoints
- `POST /v1/notifications` - Send notification
- `GET /v1/notifications` - Get notifications (with filters)
- `PUT /v1/notifications/:id/read` - Mark as read

## Database Schema
```sql
CREATE TABLE notifications (
  notification_id SERIAL PRIMARY KEY,
  patient_id INTEGER,
  type VARCHAR(50),
  message TEXT,
  metadata JSONB,
  status VARCHAR(20) DEFAULT 'SENT',
  read_at TIMESTAMP,
  created_at TIMESTAMP
);
```

## Notification Types
- APPOINTMENT_CONFIRMATION
- APPOINTMENT_REMINDER
- CANCELLATION
- BILL_GENERATED
- PAYMENT_RECEIVED
- APPOINTMENT_RESCHEDULED

## Example Request
```json
POST /v1/notifications
{
  "patient_id": 1,
  "type": "APPOINTMENT_CONFIRMATION",
  "message": "Your appointment is confirmed",
  "metadata": {
    "appointmentId": 123,
    "date": "2024-12-25",
    "time": "10:00"
  }
}
```

## License
MIT
