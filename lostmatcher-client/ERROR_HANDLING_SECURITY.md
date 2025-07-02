# Error Handling Security Guidelines

This document outlines the secure error handling practices implemented in the LostMatcher mobile application to prevent sensitive information from being exposed to users and attackers.

## Key Principles

### 1. Never Expose Stack Traces

-   Stack traces contain sensitive information about the application structure
-   They can reveal file paths, function names, and internal logic
-   All error handling has been sanitized to remove stack traces

### 2. Clean Error Messages Only

-   Only user-friendly error messages are displayed in the UI
-   Technical error details are filtered out before reaching the frontend
-   Fallback messages are provided when specific errors cannot be safely shown

### 3. Secure Logging

-   Production logs only contain sanitized error messages
-   Full error objects are never sent to the mobile device
-   Debug information is kept on the server side only

## Implementation

### Error Utilities (`lib/errorUtils.ts`)

-   `extractErrorMessage()`: Safely extracts user-friendly messages from error objects
-   `createSafeError()`: Creates clean error objects without sensitive data
-   `logError()`: Safe logging that prevents stack trace exposure
-   `getUserFriendlyMessage()`: Ensures messages are appropriate for users

### API Client (`lib/api.ts`)

-   Uses axios interceptors to catch and sanitize all API errors
-   Extracts clean error messages from nested backend responses
-   Never forwards raw error objects to the frontend
-   Custom `ApiError` class contains only safe information

### Authentication Context (`contexts/AuthContext.tsx`)

-   All authentication errors are sanitized before display
-   Login/registration failures show clean messages only
-   No debug information is exposed in production

### Screen Components

-   Error handling in UI components uses safe logging
-   Alert messages are user-friendly and non-technical
-   No stack traces or debug info in user-facing errors

## Error Message Categories

### Safe Messages (Shown to Users)

-   "Invalid email or password"
-   "Email already exists"
-   "Please check your internet connection"
-   "Registration failed. Please try again."

### Unsafe Messages (Filtered Out)

-   Stack traces with "at " patterns
-   Error objects like "[object Object]"
-   Technical terms like "TypeError", "ReferenceError"
-   File paths and function names
-   Database connection errors

## Testing Error Handling

To verify secure error handling:

1. **Network Errors**: Disconnect internet and test API calls
2. **Server Errors**: Test with invalid API endpoints
3. **Validation Errors**: Submit invalid form data
4. **Authentication Errors**: Test with wrong credentials

In all cases, users should only see friendly messages, never technical details.

## Monitoring and Debugging

-   Server-side logs contain full error details for debugging
-   Client-side logs use `logError()` utility for safe logging
-   Production monitoring should alert on error patterns without exposing sensitive data

## Best Practices

1. **Always use error utilities** instead of raw console.error()
2. **Test error scenarios** to ensure no stack traces leak through
3. **Provide fallback messages** for unexpected errors
4. **Keep error messages simple** and actionable for users
5. **Log server-side** for detailed debugging information

## Code Examples

### ❌ Insecure Error Handling

```typescript
catch (error) {
  console.error("API Error:", error); // Exposes full error object
  Alert.alert("Error", error.message); // Might show stack traces
}
```

### ✅ Secure Error Handling

```typescript
catch (error) {
  const message = extractErrorMessage(error);
  logError("API request failed", error);
  Alert.alert("Error", getUserFriendlyMessage(error));
}
```

This approach ensures that the mobile application maintains security best practices while providing a good user experience.
