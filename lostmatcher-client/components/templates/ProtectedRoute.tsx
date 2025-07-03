import React, { useEffect, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

/**
 * A component that protects routes requiring authentication.
 * Redirects to login if user is not authenticated.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { isAuthenticated, isLoading } = useAuth();
	const segments = useSegments();
	const router = useRouter();

	// Helper function to check if current route is an auth route
	const isAuthRoute = useCallback(() => {
		const authRoutes = [
			"login",
			"signup",
			"onboarding",
			"forgot-password",
			"verify-email",
		];
		return segments.some((segment) => authRoutes.includes(segment));
	}, [segments]);

	useEffect(() => {
		// Skip protection for auth-related routes
		const inAuthGroup = isAuthRoute();

		if (!isLoading) {
			// If not authenticated and not in auth group, redirect to login
			if (!isAuthenticated && !inAuthGroup) {
				console.log("User not authenticated, redirecting to login");
				router.replace("/login");
			}
		}
	}, [isAuthenticated, isLoading, router, isAuthRoute]);

	if (isLoading) {
		// Show loading indicator while checking authentication
		return (
			<View className="flex-1 justify-center items-center bg-white">
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	// For auth routes, always render children
	// For protected routes, only render when authenticated
	const inAuthGroup = isAuthRoute();

	if (inAuthGroup || isAuthenticated) {
		return <>{children}</>;
	}

	// This is just a safety net; the useEffect should redirect before we get here
	return (
		<View className="flex-1 justify-center items-center bg-white">
			<ActivityIndicator size="large" color="#0000ff" />
		</View>
	);
};

export default ProtectedRoute;
