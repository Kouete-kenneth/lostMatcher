# Email Service Configuration Guide

## Current Issue

The email service is failing to initialize because of SMTP configuration. This is **not blocking** the core functionality - in-app and real-time notifications will still work.

## Quick Fix Options

### Option 1: Disable Email Service (Recommended for Development)

Simply don't set the SMTP environment variables. The system will gracefully skip email notifications and continue with in-app and real-time notifications.

### Option 2: Configure Gmail SMTP (For Production)

#### Step 1: Enable 2-Factor Authentication

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification

#### Step 2: Generate App Password

1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and your device
3. Copy the generated 16-character password

#### Step 3: Update Environment Variables

Add these to your `.env` file:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
```

### Option 3: Use Alternative SMTP Provider

#### For SendGrid:

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_FROM_EMAIL=your-verified-sender@yourdomain.com
```

#### For Mailgun:

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USERNAME=your-mailgun-username
SMTP_PASSWORD=your-mailgun-password
SMTP_FROM_EMAIL=your-verified-sender@yourdomain.com
```

## Testing Email Service

After configuring, restart the server and you should see:

```
[INFO] Match notification email service initialized successfully
```

## Current System Status

✅ **Working Services:**

-   User matching threshold control
-   In-app notifications (stored in database)
-   Real-time WebSocket notifications
-   Periodic search (6-hour schedule)
-   All API endpoints

⚠️ **Email Service:** Currently disabled due to SMTP configuration

The system is fully functional without email - users will still receive instant notifications via WebSocket and can view match history in the app.
