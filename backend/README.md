


All endpoints return JSON. Use JWT in `Authorization: Bearer <jwt>` header or as a cookie for authenticated routes.

---
## Register
**POST /users/register**

Create a new user. Requires:
- `fullname.firstname` (min 3 chars)
201 Created
```
{
  "token": "<jwt>",
  "user": { "_id": "...", "fullname": { ... }, "email": "...", "socketId": null }
}
```
**Errors:** 400 (validation), 409 (email exists), 500 (server)

---

**POST /users/login**

Authenticate with `email` and `password`.

**Success:**
200 OK
```
{
  "token": "<jwt>",
  "user": { "_id": "...", "fullname": { ... }, "email": "...", "socketId": null }
}
```
**Errors:** 400 (validation), 401 (invalid credentials), 500 (server)

---

## Get Profile
**GET /users/profile**
Returns authenticated user's profile.

**Success:**
```
{
  "user": { "_id": "...", "fullname": { ... }, "email": "...", "socketId": null }
}
```
**Errors:** 401 (invalid/missing token), 500 (server)

---

## Logout
**GET /users/logout**

Logs out user, blacklists token for 24 hours.

**Success:**
```
{
  "message": "Logged out successfully"
}
```
**Errors:** 401 (invalid/missing token), 500 (server)

---


---

# Captain API (Quick Reference)

All endpoints return JSON. Use JWT in `Authorization: Bearer <jwt>` header for authentication (role: captain).
---

Register a new captain. Requires:
- `fullname.firstname` (min 3 chars)
- `email` (unique, valid email)
- `password` (min 6 chars)
- `vehicle.color`, `vehicle.plate` (unique), `vehicle.capacity` (1-10), `vehicle.type` (car, bike, auto)

**Success:**
201 Created
```
{
  "captain": { "_id": "...", "fullName": { ... }, "email": "...", ... },
  "token": "<jwt>"
}
```
**Errors:** 400 (validation), 409 (email exists), 500 (server)

---

**Notes:**
- Passwords are always hashed and never returned.
- Vehicle plate numbers must be unique.
- Use the returned JWT for all protected captain endpoints.