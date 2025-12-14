# Users API — Register Endpoint

**Endpoint:** POST /users/register

**Description:** Creates a new user account and returns an authentication token (JWT) and the created user.

**Request Headers:**
- `Content-Type: application/json`

**Request Body (JSON):**
```
{
  "fullname": {
    "firstname": "string (min 3, required)",
    "lastname": "string (min 3, optional)"
  },
  "email": "string (valid email, required)",
  "password": "string (min 6, required)"
}
```

**Validation rules:**
- `email` must be a valid email (express-validator `isEmail`).
- `fullname.firstname` required and minimum length 3.
- `password` minimum length 6.
- `lastname` is optional but if provided should be minimum length 3 (validated by model schema).

**Responses / Status Codes:**
- `201 Created` — Success: returns:
  ```json
  {
    "token": "<jwt>",
    "user": {
      "_id": "64a1f7e1c2b8a1234567890a",
      "fullname": {
        "firstname": "Jane",
        "lastname": "Doe"
      },
      "email": "jane@example.com",
      "socketId": null
    }
  }
  ```
- `400 Bad Request` — Validation failed: returns:
  ```json
  {
    "errors": [
      {
        "msg": "Invalid Email",
        "param": "email",
        "location": "body"
      },
      {
        "msg": "must be of minimum 3 chracter",
        "param": "fullname.firstname",
        "location": "body"
      }
    ]
  }
  ```
- `500 Internal Server Error` — Unexpected server error.

Example 500 response:

```json
{ "error": "Internal Server Error" }
```

**Example cURL:**

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{"fullname":{"firstname":"Jane","lastname":"Doe"},"email":"jane@example.com","password":"secret123"}'
```

**Note:** The controller function is named `registorUser` (typo), but the exposed route is `POST /users/register`.
Password hashes are not included in responses and `token` is a JWT.

