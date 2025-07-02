# API Endpoints for LostMatcher Client

## Authentication

-   `POST /auth/register` — Register user
-   `POST /auth/login` — Login
-   `POST /auth/forgot-password` — Request password reset
-   `POST /auth/reset-password` — Reset password
-   `POST /auth/verify-email` — Verify email

## User

-   `GET /users/:id` — Get user profile
-   `PUT /users/:id` — Update user profile

## Items

-   `POST /items` — Register item (multipart/form-data, image upload)
-   `GET /items` — List all items
-   `GET /items/:id` — Get item by ID
-   `PUT /items/:id` — Update item
-   `DELETE /items/:id` — Delete item

## Found Reports

-   `POST /found` — Report found item (multipart/form-data, image upload)
-   `GET /found` — List all found reports
-   `GET /found/:id` — Get found report by ID
-   `PUT /found/:id` — Update found report
-   `DELETE /found/:id` — Delete found report

## Lost Reports

-   `POST /lost` — Report lost item (multipart/form-data, image upload)
-   `GET /lost` — List all lost reports
-   `GET /lost/:id` — Get lost report by ID
-   `PUT /lost/:id` — Update lost report
-   `DELETE /lost/:id` — Delete lost report

---

**All endpoints return JSON. Auth endpoints require JWT in `Authorization: Bearer <token>` header.**

See backend documentation for request/response payload details.
