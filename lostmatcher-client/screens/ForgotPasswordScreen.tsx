import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import AuthHeaderNW from "@/components/atoms/AuthHeaderNW";
import ButtonNW from "@/components/atoms/ButtonNW";

const ForgotPasswordScreen = () => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [sent, setSent] = useState(false);

	const handleSend = async () => {
		setError("");
		if (!email) {
			setError("Email is required");
			return;
		}
		if (!/\S+@\S+\.\S+/.test(email)) {
			setError("Please enter a valid email");
			return;
		}
		setIsLoading(true);
		// TODO: Replace with real API call
		setTimeout(() => {
			setIsLoading(false);
			setSent(true);
		}, 1200);
	};

	const handleBackToLogin = () => {
		router.replace("/login");
	};

	return (
		<View className="flex-1 bg-white">
			<AuthHeaderNW title="Reset Password" />
			<View className="flex-1 px-6 pt-8">
				{sent ? (
					<>
						<Text className="text-center text-lg font-semibold mb-4">
							Check your email for a password reset link.
						</Text>
						<ButtonNW
							title="Back to Login"
							onPress={handleBackToLogin}
							variant="primary"
							size="large"
							className="w-full mt-4"
						/>
					</>
				) : (
					<>
						<Text className="text-center text-lg font-semibold mb-4">
							Enter your email to receive a password reset link
						</Text>
						<TextInput
							style={{
								borderWidth: 1,
								borderColor: error ? "#EF4444" : "#D1D5DB",
								borderRadius: 8,
								paddingHorizontal: 16,
								paddingVertical: 12,
								fontSize: 16,
								backgroundColor: "#FAFAFA",
								marginBottom: 8,
							}}
							placeholder="Enter your email"
							placeholderTextColor="#9CA3AF"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
						/>
						{error ? (
							<Text className="text-red-500 text-center mb-2">
								{error}
							</Text>
						) : null}
						<ButtonNW
							title={isLoading ? "Sending..." : "Send Reset Link"}
							onPress={handleSend}
							variant="primary"
							size="large"
							className="w-full mt-4"
							disabled={isLoading}
						/>
						<TouchableOpacity
							onPress={handleBackToLogin}
							className="mt-6 items-center">
							<Text className="text-blue-600 font-medium">
								Back to Login
							</Text>
						</TouchableOpacity>
					</>
				)}
			</View>
		</View>
	);
};

export default ForgotPasswordScreen;
