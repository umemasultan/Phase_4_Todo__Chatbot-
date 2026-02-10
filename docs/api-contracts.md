# Todo Chatbot API Documentation

## Base URL

- **Local Development**: `http://localhost:3000`
- **Minikube**: `http://todo-chatbot.local/api`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "data": { ... },
  "error": "Error message (if success is false)"
}
```

---

## Authentication Endpoints

### Register New User

**POST** `/api/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Validation:**
- Email must be valid format
- Password must be at least 8 characters

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Validation failed or email already registered
- `500 Internal Server Error`: Server error

---

### Login

**POST** `/api/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Validation failed

---

### Get Current User

**GET** `/api/auth/me`

Get authenticated user information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2026-02-10T12:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: User not found

---

## Todo Endpoints

All todo endpoints require authentication.

### List Todos

**GET** `/api/todos`

Get all todos for the authenticated user.

**Query Parameters:**
- `status` (optional): Filter by status (`PENDING` or `COMPLETED`)
- `dueBefore` (optional): Filter todos due before this date (ISO 8601 format)
- `priority` (optional): Filter by priority (`LOW`, `MEDIUM`, or `HIGH`)

**Example:**
```
GET /api/todos?status=PENDING&priority=HIGH
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "status": "PENDING",
      "dueDate": "2026-02-11T10:00:00.000Z",
      "priority": "MEDIUM",
      "createdAt": "2026-02-10T12:00:00.000Z",
      "updatedAt": "2026-02-10T12:00:00.000Z"
    }
  ]
}
```

---

### Create Todo

**POST** `/api/todos`

Create a new todo.

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "dueDate": "2026-02-11T10:00:00.000Z",
  "priority": "MEDIUM"
}
```

**Validation:**
- `title` (required): 1-200 characters
- `description` (optional): Max 1000 characters
- `dueDate` (optional): ISO 8601 datetime string
- `priority` (optional): `LOW`, `MEDIUM`, or `HIGH` (default: `MEDIUM`)

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "status": "PENDING",
    "dueDate": "2026-02-11T10:00:00.000Z",
    "priority": "MEDIUM",
    "createdAt": "2026-02-10T12:00:00.000Z",
    "updatedAt": "2026-02-10T12:00:00.000Z"
  }
}
```

---

### Update Todo

**PATCH** `/api/todos/:id`

Update an existing todo.

**URL Parameters:**
- `id`: Todo UUID

**Request Body (all fields optional):**
```json
{
  "title": "Buy groceries and cook dinner",
  "description": "Updated description",
  "status": "COMPLETED",
  "dueDate": "2026-02-12T10:00:00.000Z",
  "priority": "HIGH"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "title": "Buy groceries and cook dinner",
    "description": "Updated description",
    "status": "COMPLETED",
    "dueDate": "2026-02-12T10:00:00.000Z",
    "priority": "HIGH",
    "createdAt": "2026-02-10T12:00:00.000Z",
    "updatedAt": "2026-02-10T13:00:00.000Z"
  }
}
```

**Error Responses:**
- `404 Not Found`: Todo not found or access denied

---

### Delete Todo

**DELETE** `/api/todos/:id`

Delete a todo.

**URL Parameters:**
- `id`: Todo UUID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

**Error Responses:**
- `404 Not Found`: Todo not found or access denied

---

## Chat Endpoints

All chat endpoints require authentication.

### Send Chat Message

**POST** `/api/chat/message`

Send a message to the AI assistant and get a response with todo actions.

**Request Body:**
```json
{
  "message": "add buy groceries tomorrow with high priority"
}
```

**Validation:**
- `message` (required): 1-2000 characters

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reply": "I've added 'buy groceries' to your todos with high priority, due tomorrow.",
    "intent": "CREATE",
    "actionResult": {
      "id": "uuid",
      "title": "buy groceries",
      "status": "PENDING",
      "dueDate": "2026-02-11T00:00:00.000Z",
      "priority": "HIGH",
      "createdAt": "2026-02-10T12:00:00.000Z",
      "updatedAt": "2026-02-10T12:00:00.000Z"
    },
    "todos": [
      // Updated list of all user's todos
    ]
  }
}
```

**Intent Types:**
- `CREATE`: Create a new todo
- `UPDATE`: Update an existing todo
- `DELETE`: Delete a todo
- `QUERY`: Query/filter todos
- `CHAT`: General conversation (no action)

**Example Messages:**
- "add buy milk tomorrow"
- "mark groceries as done"
- "show me my high priority tasks"
- "delete the first todo"
- "what's due today?"

---

### Get Chat History

**GET** `/api/chat/history`

Retrieve chat message history.

**Query Parameters:**
- `limit` (optional): Number of messages to retrieve (default: 50)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "role": "USER",
      "content": "add buy groceries tomorrow",
      "createdAt": "2026-02-10T12:00:00.000Z"
    },
    {
      "id": "uuid",
      "userId": "uuid",
      "role": "ASSISTANT",
      "content": "I've added 'buy groceries' to your todos, due tomorrow.",
      "createdAt": "2026-02-10T12:00:01.000Z"
    }
  ]
}
```

---

## Health Check Endpoints

### Liveness Probe

**GET** `/api/health/liveness`

Check if the application is running.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-02-10T12:00:00.000Z"
}
```

---

### Readiness Probe

**GET** `/api/health/readiness`

Check if the application is ready to serve traffic.

**Response (200 OK):**
```json
{
  "status": "ready",
  "checks": {
    "database": true,
    "claudeApi": true
  },
  "timestamp": "2026-02-10T12:00:00.000Z"
}
```

**Response (503 Service Unavailable):**
```json
{
  "status": "not ready",
  "checks": {
    "database": false,
    "claudeApi": true
  },
  "timestamp": "2026-02-10T12:00:00.000Z"
}
```

---

### Metrics

**GET** `/api/health/metrics`

Get application metrics.

**Response (200 OK):**
```json
{
  "uptime": 3600,
  "memory": {
    "rss": 123456789,
    "heapTotal": 98765432,
    "heapUsed": 87654321,
    "external": 1234567
  },
  "timestamp": "2026-02-10T12:00:00.000Z"
}
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (valid token but insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

## Rate Limiting

Currently, no rate limiting is implemented. For production deployment, consider adding rate limiting middleware.

---

## CORS

CORS is enabled for all origins in development. For production, configure specific allowed origins in the backend configuration.
