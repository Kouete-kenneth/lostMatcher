# Email Notifications, Periodic Search & Real-Time Notifications Implementation Summary

## Overview

This document outlines the comprehensive implementation of user-controlled matching thresholds, email notifications, periodic search functionality, and real-time notifications for the Lost Matcher application.

## 🎯 User Matching Threshold Control

### User Model Updates

-   ✅ **matchingThreshold field**: Already exists in user model (0-100 scale)
-   ✅ **Default value**: 70% threshold
-   ✅ **periodicSearchEnabled field**: Added for user control
-   ✅ **notificationPreferences**: Controls email and in-app notifications

### Implementation Details

-   Users can control their matching sensitivity from 0-100%
-   The matching service converts user threshold (0-100) to algorithm scale (0-1)
-   Individual user thresholds are applied during matching processes
-   Settings can be updated via the periodic search API endpoints

## 📧 Email Notification System

### Features Implemented

-   ✅ **SMTP Configuration**: Uses nodemailer with Gmail/custom SMTP
-   ✅ **HTML Email Templates**: Rich email format with match details
-   ✅ **User Preference Respect**: Checks `notificationPreferences.matchAlerts`
-   ✅ **Match Details**: Includes similarity scores, report types, and match counts
-   ✅ **Error Handling**: Graceful fallbacks if email sending fails

### Email Content Includes

-   Number of matches found
-   Similarity scores (converted to percentages)
-   Report type (lost/found)
-   Direct links to view matches
-   Professional branding and formatting

## 🔄 Periodic Search System

### Core Features

-   ✅ **Cron Job Scheduling**: Runs every 6 hours by default (customizable)
-   ✅ **User-Specific Control**: Users can enable/disable periodic search
-   ✅ **Automatic Re-matching**: Re-runs matching for all active reports
-   ✅ **Service Management**: Start/stop/status monitoring
-   ✅ **Manual Triggers**: Users can trigger searches manually

### API Endpoints

```
GET    /api-v1/periodic-search/status           # Get user's settings
PUT    /api-v1/periodic-search/settings         # Update user settings
POST   /api-v1/periodic-search/trigger          # Manual trigger for user
POST   /api-v1/periodic-search/trigger/:type/:id # Trigger for specific report
GET    /api-v1/periodic-search/stats            # Service statistics
```

### How It Works

1. **Scheduled Execution**: Runs every 6 hours automatically
2. **User Filtering**: Only processes users with `periodicSearchEnabled: true`
3. **Report Re-matching**: Re-runs matching for all active lost/found reports
4. **Automatic Notifications**: Sends notifications for new matches found
5. **Error Resilience**: Continues processing even if individual searches fail

## ⚡ Real-Time Notification System

### WebSocket Implementation

-   ✅ **Socket.IO Integration**: Real-time bidirectional communication
-   ✅ **User Authentication**: JWT-based socket authentication
-   ✅ **Personal Rooms**: Users join individual rooms for targeted notifications
-   ✅ **Connection Management**: Handles connect/disconnect/reconnect scenarios
-   ✅ **Health Monitoring**: Ping/pong for connection health

### Real-Time Features

-   **Instant Match Alerts**: Immediate notifications when matches are found
-   **Connection Status**: Track online/offline users
-   **Message Types**: Support for various notification types
-   **Data Payload**: Rich notification data with match details

### Socket Events

```javascript
// Client connects and authenticates
socket.emit('authenticate', jwtToken);

// Server confirms authentication
socket.on('authenticated', (data) => { ... });

// Receive real-time notifications
socket.on('notification', (notification) => { ... });

// Connection health
socket.emit('ping');
socket.on('pong');
```

## 🔗 Integrated Workflow

### When a Report is Created

1. **Feature Extraction**: Extract image features using robust matching service
2. **Automatic Matching**: Find potential matches using user's threshold
3. **Match Storage**: Save top 3 matches to Match collection
4. **Multi-Channel Notifications**:
    - 📧 Email notification (if enabled)
    - 📱 In-app notification
    - ⚡ Real-time WebSocket notification

### Periodic Search Process

1. **Scheduled Trigger**: Every 6 hours (or manual trigger)
2. **User Selection**: Find users with periodic search enabled
3. **Re-matching**: Re-run matching for all active reports
4. **New Match Detection**: Compare with previously saved matches
5. **Notification Sending**: Send notifications for new matches only

### Notification Preference Hierarchy

-   Users can disable `matchAlerts` to stop email notifications
-   In-app notifications are always created (for user review later)
-   Real-time notifications respect user's online status
-   Periodic search can be individually controlled

## 🛠️ Technical Implementation

### Services Created/Updated

#### MatchNotificationService

-   **Fixed**: `createTransport` typo in nodemailer
-   **Enhanced**: Integrated real-time notifications
-   **Features**: Email, in-app, and WebSocket notifications

#### PeriodicSearchService

-   **New Service**: Handles scheduled and manual searches
-   **Cron Integration**: Uses node-cron for scheduling
-   **User Management**: Processes users with periodic search enabled
-   **Error Handling**: Robust error handling and logging

#### RealTimeNotificationService

-   **New Service**: WebSocket/Socket.IO management
-   **Authentication**: JWT-based socket authentication
-   **Room Management**: Personal rooms for targeted messaging
-   **Health Monitoring**: Connection status and health checks

#### MatchingService Updates

-   **User Thresholds**: Integrated user-specific matching thresholds
-   **Notification Integration**: Automatically sends notifications after matching
-   **Found Report Matching**: Added threshold logic and notifications for found reports

### Controllers & Routes

-   **PeriodicSearchController**: Manage periodic search settings and triggers
-   **PeriodicSearch Routes**: RESTful API for periodic search management
-   **Route Integration**: Added to main routes index

### Database Updates

-   **User Model**: Enhanced with periodic search and threshold fields
-   **Match Collection**: Stores top matches for comparison in periodic searches
-   **Notification Preferences**: Control email and notification delivery

## 🚀 Getting Started

### Environment Variables Required

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# JWT for socket authentication
JWT_SECRET=your-jwt-secret

# Client URL for CORS
CLIENT_URL=http://localhost:3000
```

### Package Dependencies Added

```json
{
	"dependencies": {
		"node-cron": "^3.0.3",
		"socket.io": "^4.8.1",
		"express": "^4.21.2"
	},
	"devDependencies": {
		"@types/node-cron": "^3.0.11"
	}
}
```

### Service Initialization

The services are automatically initialized in `server.ts`:

-   **Real-time Service**: Initialized with HTTP server
-   **Email Service**: Initialized with SMTP configuration
-   **Periodic Search**: Started with default 6-hour schedule

## 📝 API Usage Examples

### Update User Settings

```bash
# Enable periodic search with custom threshold
curl -X PUT http://localhost:3001/api-v1/periodic-search/settings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "periodicSearchEnabled": true,
    "matchingThreshold": 75
  }'
```

### Trigger Manual Search

```bash
# Trigger search for current user
curl -X POST http://localhost:3001/api-v1/periodic-search/trigger \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### WebSocket Connection (Frontend)

```javascript
import io from "socket.io-client";

const socket = io("http://localhost:3001");

// Authenticate
socket.emit("authenticate", localStorage.getItem("jwtToken"));

// Listen for match notifications
socket.on("notification", (notification) => {
	if (notification.type === "match_found") {
		showMatchAlert(notification);
	}
});
```

## 🔍 Testing

### REST Files Available

-   `rest/periodicSearch.rest`: Test periodic search endpoints
-   `rest/matchRecords.rest`: Test match management
-   `rest/manualMatching.rest`: Test manual matching triggers

### Testing Scenarios

1. **Create Reports**: Test automatic matching and notifications
2. **Update Thresholds**: Verify threshold changes affect matching
3. **Periodic Search**: Enable and trigger manual searches
4. **Real-time**: Connect via WebSocket and test notifications
5. **Email Delivery**: Verify email notifications are sent

## 🎯 Key Benefits

1. **User Control**: Users can customize their matching experience
2. **Multi-Channel Notifications**: Email, in-app, and real-time alerts
3. **Automatic Discovery**: Periodic searches find new matches over time
4. **Real-Time Experience**: Instant notifications for immediate action
5. **Scalable Architecture**: Services can be independently scaled
6. **Robust Error Handling**: System continues working despite individual failures

## 🔮 Future Enhancements

-   **Notification History**: Track and display notification history
-   **Smart Scheduling**: Dynamic periodic search intervals based on activity
-   **Push Notifications**: Mobile push notification integration
-   **Advanced Filters**: Location-based and category-specific matching
-   **Machine Learning**: Improved matching algorithms based on user feedback
