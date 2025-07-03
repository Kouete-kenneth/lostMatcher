# LostMatcher API Endpoints Documentation

## Authentication & User

-   `POST /auth/register` — Register a new user
-   `POST /auth/login` — Login
-   `POST /auth/forgot-password` — Request password reset
-   `POST /auth/reset-password` — Reset password
-   `POST /auth/verify-email` — Verify email
-   `GET /users/:id` — Get user profile
-   `PUT /users/:id` — Update user profile

---

## Item Registration (User-owned Items)

### Register Item

-   `POST /items`
    -   **Auth required**: Yes
    -   **Body (multipart/form-data):**
        -   `file`: image file (required)
        -   `itemDetails[name]`: string (required)
        -   `itemDetails[description]`: string (required)
        -   `itemDetails[category]`: string (required)
        -   `attributes`: object (optional)
    -   **Response:**
        -   201 Created, returns item object

### Get All Items

-   `GET /items`
    -   **Auth required**: No
    -   **Response:** Array of item objects

### Get Item by ID

-   `GET /items/:id`
    -   **Auth required**: No
    -   **Response:** Item object

### Update Item

-   `PUT /items/:id`
    -   **Auth required**: Yes
    -   **Body:** Partial item fields
    -   **Response:** Updated item object

### Delete Item

-   `DELETE /items/:id`
    -   **Auth required**: Yes
    -   **Response:** `{ message: 'Item deleted' }`

---

## Found Item Reports

### Report Found Item

-   `POST /found`
    -   **Auth required**: Yes
    -   **Body (multipart/form-data):**
        -   `file`: image file (required)
        -   `itemDetails[name]`: string (required)
        -   `itemDetails[description]`: string (required)
        -   `itemDetails[category]`: string (required)
        -   `attributes`: object (optional)
        -   `foundDate`: ISO string (required)
        -   `foundLocation`: string (required)
    -   **Response:**
        -   201 Created, returns found report object

### Get All Found Reports

-   `GET /found`
    -   **Auth required**: No
    -   **Response:** Array of found report objects

### Get Found Report by ID

-   `GET /found/:id`
    -   **Auth required**: No
    -   **Response:** Found report object

### Update Found Report

-   `PUT /found/:id`
    -   **Auth required**: Yes
    -   **Body:** Partial found report fields
    -   **Response:** Updated found report object

### Delete Found Report

-   `DELETE /found/:id`
    -   **Auth required**: Yes
    -   **Response:** `{ message: 'Found report deleted' }`

---

## Lost Item Reports

### Report Lost Item

-   `POST /lost`
    -   **Auth required**: Yes
    -   **Body (multipart/form-data):**
        -   `file`: image file (required)
        -   `itemDetails[name]`: string (required)
        -   `itemDetails[description]`: string (required)
        -   `itemDetails[category]`: string (required)
        -   `attributes`: object (optional)
        -   `lostDate`: ISO string (required)
        -   `lostLocation`: string (required)
    -   **Response:**
        -   201 Created, returns lost report object

### Get All Lost Reports

-   `GET /lost`
    -   **Auth required**: No
    -   **Response:** Array of lost report objects

### Get Lost Report by ID

-   `GET /lost/:id`
    -   **Auth required**: No
    -   **Response:** Lost report object

### Update Lost Report

-   `PUT /lost/:id`
    -   **Auth required**: Yes
    -   **Body:** Partial lost report fields
    -   **Response:** Updated lost report object

### Delete Lost Report

-   `DELETE /lost/:id`
    -   **Auth required**: Yes
    -   **Response:** `{ message: 'Lost report deleted' }`

---

## Notes

-   All image uploads must use `multipart/form-data` with the field name `file`.
-   All endpoints return JSON.
-   Auth endpoints require JWT in `Authorization: Bearer <token>` header.
-   All item/report objects include image URL(s) as returned from Supabase.
