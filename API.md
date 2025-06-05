# Campus Events Hub API Documentation

## Authentication Endpoints

### Register User
- **URL:** `/api/auth/register`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response:** JWT token and user data

### Login
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:** JWT token and user data

## Events Endpoints

### Get All Events
- **URL:** `/api/events`
- **Method:** `GET`
- **Query Parameters:**
  - `category` (optional): Filter by category
  - `status` (optional): Filter by status
- **Auth Required:** No

### Create Event
- **URL:** `/api/events`
- **Method:** `POST`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "date": "YYYY-MM-DD",
    "time": "HH:mm:ss",
    "location": "string",
    "category": "academic|social|sports|cultural",
    "maxAttendees": "number",
    "image": "string (optional)"
  }
  ```

### Get Event by ID
- **URL:** `/api/events/:id`
- **Method:** `GET`
- **Auth Required:** No

### Update Event
- **URL:** `/api/events/:id`
- **Method:** `PUT`
- **Auth Required:** Yes (must be organizer)
- **Body:** Same as Create Event

### Delete Event
- **URL:** `/api/events/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes (must be organizer or admin)

### Register for Event
- **URL:** `/api/events/:id/register`
- **Method:** `POST`
- **Auth Required:** Yes

### Unregister from Event
- **URL:** `/api/events/:id/unregister`
- **Method:** `POST`
- **Auth Required:** Yes

## Comments Endpoints

### Get Event Comments
- **URL:** `/api/comments/:eventId`
- **Method:** `GET`
- **Auth Required:** No

### Add Comment
- **URL:** `/api/comments/:eventId`
- **Method:** `POST`
- **Auth Required:** Yes
- **Body:**
  ```json
  {
    "content": "string"
  }
  ```

## Response Formats

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

## Authentication

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Rate Limiting

- 100 requests per minute per IP for public endpoints
- 300 requests per minute per user for authenticated endpoints 