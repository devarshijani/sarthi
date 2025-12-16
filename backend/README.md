Users API — Register User
Endpoint

POST /users/register

Description

Creates a new user account. On successful registration, the API returns a JSON Web Token (JWT) for authentication along with the newly created user details.

Passwords are securely hashed and are never returned in responses.

Email addresses must be unique.

Request Headers
Header	Value
Content-Type	application/json
Request Body
{
  "fullname": {
    "firstname": "string",
    "lastname": "string"
  },
  "email": "string",
  "password": "string"
}

Field Validation Rules
fullname
Field	Required	Constraints
firstname	Yes	Minimum 3 characters
lastname	No	Minimum 3 characters (if provided)
email

Required

Must be a valid email format

Must be unique

password

Required

Minimum 6 characters

Stored as a hashed value

Responses
✅ 201 Created — Successful Registration
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

❌ 400 Bad Request — Validation Errors

Returned when request data fails validation.

{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email",
      "location": "body"
    },
    {
      "msg": "must be of minimum 3 character",
      "param": "fullname.firstname",
      "location": "body"
    }
  ]
}

❌ 409 Conflict — User Already Exists

Returned when the email is already registered.

{
  "message": "User already exists with this email"
}

❌ 500 Internal Server Error

Returned for unexpected server-side failures.

{
  "error": "Internal Server Error"
}

Example cURL Request
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane@example.com",
    "password": "secret123"
  }'

Notes

The controller function is named registorUser (typo preserved for compatibility).

Password hashes are never included in API responses.

The returned JWT should be sent in future requests via the Authorization header:

Authorization: Bearer <jwt>

---

Users API — Login User
Endpoint

POST /users/login

Description

Authenticates a user using `email` and `password`. On success returns a JWT and the authenticated user's details (password is never returned).

Request Headers
Header	Value
Content-Type	application/json

Request Body
{
  "email": "string",
  "password": "string"
}

Field Validation Rules
Field	Required	Constraints
email	Yes	Must be valid email format
password	Yes	Minimum 6 characters

Responses
✅ 200 OK — Successful Authentication
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

❌ 400 Bad Request — Validation Errors

{
  "errors": [
    { "msg": "Invalid Email", "param": "email", "location": "body" }
  ]
}

❌ 401 Unauthorized — Invalid Credentials

{
  "message": "Invalid email or password"
}

❌ 500 Internal Server Error

{
  "error": "Internal Server Error"
}

Example cURL Request
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com","password":"secret123"}'

Notes
- The controller fetches `password` explicitly for verification but it is not included in API responses.
- Use the returned JWT in the `Authorization: Bearer <jwt>` header for authenticated requests.

---

Users API — Get User Profile
Endpoint

GET /users/profile

Description

Retrieves the authenticated user's profile information. Requires a valid JWT token for authentication.

Request Headers
Header	Value
Authorization	Bearer <jwt>

Responses
✅ 200 OK — Profile Retrieved Successfully
{
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

❌ 401 Unauthorized — Invalid or Missing Token

Returned when the JWT token is missing or invalid.

{
  "message": "Invalid token."
}

❌ 500 Internal Server Error

Returned for unexpected server-side failures.

{
  "error": "Internal Server Error"
}

Example cURL Request
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <jwt>"

Notes

- Token can be provided in the `Authorization` header or as a cookie.
- Only authenticated users can access this endpoint.
- Password is never included in the response.

---

Users API — Logout User
Endpoint

GET /users/logout

Description

Logs out the authenticated user by clearing the authentication token and blacklisting it to prevent further use. Tokens are automatically removed from the blacklist after 24 hours.

Request Headers
Header	Value
Authorization	Bearer <jwt>

Responses
✅ 200 OK — Logged Out Successfully
{
  "message": "Logged out successfully"
}

❌ 401 Unauthorized — Invalid or Missing Token

Returned when the JWT token is missing or invalid.

{
  "message": "Invalid token."
}

❌ 500 Internal Server Error

Returned for unexpected server-side failures.

{
  "error": "Internal Server Error"
}

Example cURL Request
curl -X GET http://localhost:3000/users/logout \
  -H "Authorization: Bearer <jwt>"

Notes

- The token is immediately blacklisted and cannot be used for further requests.
- Blacklisted tokens are automatically purged from the database after 24 hours.
- Token can be provided in the `Authorization` header or as a cookie.
- Only authenticated users can access this endpoint.