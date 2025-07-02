import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, ApiError } from "../lib/api";
import { extractErrorMessage, logError } from "../lib/errorUtils";

// Types
export interface User {
	id: string;
	email: string;
	name?: string;
	avatar?: string;
	onboardingComplete?: boolean;
	// Add more user fields as needed
}

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	isRegistered: boolean;
}

export interface AuthContextType extends AuthState {
	login: (
		email: string,
		password: string
	) => Promise<{ success: boolean; error?: string }>;
	register: (
		email: string,
		password: string,
		name?: string
	) => Promise<{ success: boolean; error?: string }>;
	logout: () => Promise<void>;
	checkRegistration: (
		email: string
	) => Promise<{ isRegistered: boolean; error?: string }>;
	forgotPassword: (
		email: string
	) => Promise<{ success: boolean; error?: string }>;
	refreshUser: () => Promise<void>;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [state, setState] = useState<AuthState>({
		user: null,
		isAuthenticated: false,
		isLoading: true,
		isRegistered: false,
	});

	// Initialize auth state on app start
	useEffect(() => {
		initializeAuth();
	}, []);

	const initializeAuth = async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			if (token) {
				try {
					const user = await api.getMe();
					setState((prev) => ({
						...prev,
						user,
						isAuthenticated: true,
						isRegistered: true,
						isLoading: false,
					}));
					await AsyncStorage.setItem(
						"auth_user",
						JSON.stringify(user)
					);
				} catch {
					setState((prev) => ({ ...prev, isLoading: false }));
				}
			} else {
				setState((prev) => ({ ...prev, isLoading: false }));
			}
		} catch (error) {
			logError("Auth initialization error", error);
			setState((prev) => ({ ...prev, isLoading: false }));
		}
	};

	const login = async (
		email: string,
		password: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			setState((prev) => ({ ...prev, isLoading: true }));
			const { user, tokens } = await api.login({ email, password });
			await AsyncStorage.setItem("token", tokens.access.token);
			await AsyncStorage.setItem("auth_user", JSON.stringify(user));
			setState((prev) => ({
				...prev,
				user,
				isAuthenticated: true,
				isRegistered: true,
				isLoading: false,
			}));
			return { success: true };
		} catch (error: any) {
			setState((prev) => ({ ...prev, isLoading: false }));

			// Use utility function to extract clean error message
			const errorMessage = extractErrorMessage(error);

			// Safe logging
			logError("Login failed", error);

			return {
				success: false,
				error: errorMessage,
			};
		}
	};

	const register = async (
		email: string,
		password: string,
		name?: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			setState((prev) => ({ ...prev, isLoading: true }));
			const { user, tokens } = await api.register({
				email,
				password,
				name,
			});
			await AsyncStorage.setItem("token", tokens.access.token);
			await AsyncStorage.setItem("auth_user", JSON.stringify(user));
			setState((prev) => ({
				...prev,
				user,
				isAuthenticated: true,
				isRegistered: true,
				isLoading: false,
			}));
			console.log("User registered successfully:", user);
			return { success: true };
		} catch (error: any) {
			setState((prev) => ({ ...prev, isLoading: false }));

			// Use utility function to extract clean error message
			const errorMessage = extractErrorMessage(error);

			// Safe logging
			logError("Registration failed", error);

			return {
				success: false,
				error: errorMessage,
			};
		}
	};

	const logout = async () => {
		try {
			setState((prev) => ({ ...prev, isLoading: true }));
			await api.logout();
			await AsyncStorage.removeItem("auth_user");
			setState({
				user: null,
				isAuthenticated: false,
				isLoading: false,
				isRegistered: false,
			});
		} catch (error) {
			logError("Logout error", error);
			setState((prev) => ({ ...prev, isLoading: false }));
		}
	};

	const checkRegistration = async (
		email: string
	): Promise<{ isRegistered: boolean; error?: string }> => {
		// Not needed with new API, always return false (registration handled by backend)
		return { isRegistered: false };
	};

	const forgotPassword = async (
		email: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			await api.forgotPassword({ email });
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error:
					error instanceof ApiError ? error.message : "Reset failed",
			};
		}
	};

	const refreshUser = async () => {
		try {
			const user = await api.getMe();
			setState((prev) => ({ ...prev, user }));
			await AsyncStorage.setItem("auth_user", JSON.stringify(user));
		} catch (error) {
			logError("Refresh user error", error);
		}
	};

	const value: AuthContextType = {
		...state,
		login,
		register,
		logout,
		checkRegistration,
		forgotPassword,
		refreshUser,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

// Hook
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
