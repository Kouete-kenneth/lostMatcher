import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types
export interface User {
	id: string;
	email: string;
	name?: string;
	avatar?: string;
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

// Storage keys
const STORAGE_KEYS = {
	TOKEN: "auth_token",
	USER: "auth_user",
	REGISTRATION_STATUS: "registration_status",
};

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
			const [token, userData] = await Promise.all([
				AsyncStorage.getItem(STORAGE_KEYS.TOKEN),
				AsyncStorage.getItem(STORAGE_KEYS.USER),
			]);

			if (token && userData) {
				const user = JSON.parse(userData);
				setState((prev) => ({
					...prev,
					user,
					isAuthenticated: true,
					isRegistered: true,
					isLoading: false,
				}));
			} else {
				setState((prev) => ({
					...prev,
					isLoading: false,
				}));
			}
		} catch (error) {
			console.error("Auth initialization error:", error);
			setState((prev) => ({
				...prev,
				isLoading: false,
			}));
		}
	};

	const login = async (
		email: string,
		password: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			setState((prev) => ({ ...prev, isLoading: true }));

			// TODO: Replace with actual API call
			const mockApiCall = new Promise<{ token: string; user: User }>(
				(resolve, reject) => {
					setTimeout(() => {
						if (
							email === "test@example.com" &&
							password === "password"
						) {
							resolve({
								token: "mock_token_123",
								user: { id: "1", email, name: "Test User" },
							});
						} else {
							reject(new Error("Invalid credentials"));
						}
					}, 1000);
				}
			);

			const { token, user } = await mockApiCall;

			// Store auth data
			await Promise.all([
				AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
				AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
			]);

			setState((prev) => ({
				...prev,
				user,
				isAuthenticated: true,
				isRegistered: true,
				isLoading: false,
			}));

			return { success: true };
		} catch (error) {
			setState((prev) => ({ ...prev, isLoading: false }));
			return {
				success: false,
				error: error instanceof Error ? error.message : "Login failed",
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

			// TODO: Replace with actual API call
			const mockApiCall = new Promise<{ token: string; user: User }>(
				(resolve, reject) => {
					setTimeout(() => {
						if (email && password) {
							resolve({
								token: "mock_token_456",
								user: {
									id: "2",
									email,
									name: name || "New User",
								},
							});
						} else {
							reject(new Error("Registration failed"));
						}
					}, 1000);
				}
			);

			const { token, user } = await mockApiCall;

			// Store auth data
			await Promise.all([
				AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token),
				AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
			]);

			setState((prev) => ({
				...prev,
				user,
				isAuthenticated: true,
				isRegistered: true,
				isLoading: false,
			}));

			return { success: true };
		} catch (error) {
			setState((prev) => ({ ...prev, isLoading: false }));
			return {
				success: false,
				error:
					error instanceof Error
						? error.message
						: "Registration failed",
			};
		}
	};

	const logout = async () => {
		try {
			setState((prev) => ({ ...prev, isLoading: true }));

			// Clear stored data
			await Promise.all([
				AsyncStorage.removeItem(STORAGE_KEYS.TOKEN),
				AsyncStorage.removeItem(STORAGE_KEYS.USER),
			]);

			setState({
				user: null,
				isAuthenticated: false,
				isLoading: false,
				isRegistered: false,
			});
		} catch (error) {
			console.error("Logout error:", error);
			setState((prev) => ({ ...prev, isLoading: false }));
		}
	};

	const checkRegistration = async (
		email: string
	): Promise<{ isRegistered: boolean; error?: string }> => {
		try {
			// TODO: Replace with actual API call
			const mockApiCall = new Promise<{ isRegistered: boolean }>(
				(resolve) => {
					setTimeout(() => {
						// Mock logic: consider user registered if email contains "@"
						resolve({ isRegistered: email.includes("@") });
					}, 500);
				}
			);

			const { isRegistered } = await mockApiCall;
			return { isRegistered };
		} catch (error) {
			return {
				isRegistered: false,
				error: error instanceof Error ? error.message : "Check failed",
			};
		}
	};

	const forgotPassword = async (
		email: string
	): Promise<{ success: boolean; error?: string }> => {
		try {
			// TODO: Replace with actual API call
			const mockApiCall = new Promise<void>((resolve, reject) => {
				setTimeout(() => {
					if (email.includes("@")) {
						resolve();
					} else {
						reject(new Error("Invalid email"));
					}
				}, 1000);
			});

			await mockApiCall;
			return { success: true };
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Reset failed",
			};
		}
	};

	const refreshUser = async () => {
		try {
			const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
			if (!token) return;

			// TODO: Replace with actual API call to refresh user data
			// const user = await fetchUserProfile(token);
			// setState(prev => ({ ...prev, user }));
		} catch (error) {
			console.error("Refresh user error:", error);
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
