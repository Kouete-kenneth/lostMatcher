# Authentication Flow Documentation

## Overview

This document describes the comprehensive authentication flow implemented in the LostMatcher app, including state management, navigation logic, and UI components.

## Flow Logic

### 1. App Initialization

-   **Entry Point**: Welcome Screen (`WelcomeScreenNW`)
-   **State Check**: The app checks both onboarding completion and authentication status
-   **Loading State**: Shows professional loading screen while initializing

### 2. User Journey Decision Tree

```
Welcome Screen
├── User clicks "Get Started"
│   ├── Has completed onboarding?
│   │   ├── YES
│   │   │   ├── Is authenticated?
│   │   │   │   ├── YES → Navigate to Home Screen /(tabs)
│   │   │   │   └── NO → Navigate to Login Screen
│   │   │   └── Check registration status (future enhancement)
│   │   └── NO → Navigate to Onboarding Screen
│   └── Show professional welcome UI with tagline
```

### 3. Authentication Screens

#### Login Screen (`/login`)

-   **Header**: Custom `AuthHeaderNW` with primary color
-   **Logo**: App logo prominently displayed
-   **Form Fields**:
    -   Email (with validation)
    -   Password (with validation)
-   **Features**:
    -   Forgot Password functionality
    -   Real-time validation
    -   Error handling with user-friendly messages
    -   Loading states
-   **Navigation**: "Don't have an account? Sign Up" link

#### Sign Up Screen (`/signup`)

-   **Header**: Custom `AuthHeaderNW` with primary color
-   **Logo**: App logo prominently displayed
-   **Form Fields**:
    -   Full Name
    -   Email (with validation)
    -   Password (with validation)
    -   Confirm Password (with matching validation)
-   **Features**:
    -   Comprehensive validation
    -   Error handling
    -   Loading states
-   **Navigation**: "Already have an account? Sign In" link

## State Management

### AuthContext (`contexts/AuthContext.tsx`)

Provides comprehensive authentication state management:

#### State Properties

-   `user`: Current user object (null if not authenticated)
-   `isAuthenticated`: Boolean indicating auth status
-   `isLoading`: Loading state for auth operations
-   `isRegistered`: Registration status

#### Methods

-   `login(email, password)`: Authenticates user
-   `register(email, password, name)`: Creates new account
-   `logout()`: Clears authentication state
-   `checkRegistration(email)`: Checks if user is registered
-   `forgotPassword(email)`: Initiates password reset
-   `refreshUser()`: Updates user data

#### Persistence

-   Uses `AsyncStorage` for persistent authentication
-   Stores authentication token and user data
-   Automatically restores session on app restart

## UI Components

### Custom Headers

-   **AuthHeaderNW**: Professional header for auth screens
    -   Primary color background
    -   App title and security subtitle
    -   Consistent branding

### Form Components

-   **Professional Styling**: Bordered input fields with focus states
-   **Validation**: Real-time validation with error messages
-   **Loading States**: Disabled states during operations
-   **Accessibility**: Proper keyboard types and autocomplete

### Error Handling

-   **User-Friendly Messages**: Clear, actionable error messages
-   **Visual Feedback**: Red borders for invalid fields
-   **Alert System**: Native alerts for critical errors

## Security Considerations

### Current Implementation (Development)

-   Mock API calls for development
-   Basic validation patterns
-   Secure storage using AsyncStorage

### Production Ready Features

-   Password complexity requirements
-   Email validation
-   Secure token storage
-   Automatic session refresh
-   Logout on token expiry

## Navigation Integration

### Stack Configuration

-   All auth screens use `headerShown: false`
-   Custom headers provide consistent UI
-   Proper navigation flow between screens

### Deep Linking Ready

-   Screens are properly registered in navigation stack
-   Can handle direct navigation to auth screens
-   Preserves navigation history

## Future Enhancements

### API Integration

-   Replace mock functions with actual API calls
-   Implement proper error handling for network issues
-   Add refresh token logic

### Advanced Features

-   Biometric authentication
-   Social login (Google, Apple, Facebook)
-   Multi-factor authentication
-   Account verification via email/SMS

### User Experience

-   Remember me functionality
-   Auto-fill suggestions
-   Progressive authentication

## Usage Examples

### Checking Authentication Status

```tsx
import { useAuth } from "@/contexts/AuthContext";

const MyComponent = () => {
	const { isAuthenticated, user, isLoading } = useAuth();

	if (isLoading) return <LoadingScreen />;

	return (
		<View>
			{isAuthenticated ? (
				<Text>Welcome, {user?.name}!</Text>
			) : (
				<Text>Please sign in</Text>
			)}
		</View>
	);
};
```

### Implementing Login

```tsx
import { useAuth } from "@/contexts/AuthContext";

const LoginComponent = () => {
	const { login } = useAuth();

	const handleLogin = async (email: string, password: string) => {
		const result = await login(email, password);
		if (result.success) {
			// Navigate to home
		} else {
			// Show error
			Alert.alert("Error", result.error);
		}
	};
};
```

## Testing

### Test Credentials (Development)

-   Email: `test@example.com`
-   Password: `password`

### Test Scenarios

1. **First Time User**: Welcome → Onboarding → Login → Home
2. **Returning User (Not Authenticated)**: Welcome → Login → Home
3. **Returning User (Authenticated)**: Welcome → Home
4. **Registration Flow**: Welcome → Sign Up → Home
5. **Error Handling**: Invalid credentials, network errors, validation errors

## Files Created/Modified

### New Files

-   `contexts/AuthContext.tsx` - Authentication state management
-   `components/atoms/AuthHeaderNW.tsx` - Custom auth header component
-   `components/atoms/LoadingScreen.tsx` - Loading state component
-   `screens/LoginScreen.tsx` - Login screen implementation
-   `screens/SignUpScreen.tsx` - Sign up screen implementation
-   `app/login.tsx` - Login route
-   `app/signup.tsx` - Sign up route

### Modified Files

-   `app/_layout.tsx` - Added AuthProvider and new routes
-   `screens/WelcomeScreenNW.tsx` - Updated with auth flow logic
-   `contexts/index.ts` - Added auth context exports

This implementation provides a robust, professional authentication system that's ready for production with minimal API integration work.
