import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import AuthHeaderNW from "@/components/atoms/AuthHeaderNW";
import ButtonNW from "@/components/atoms/ButtonNW";
import LogoNW from "@/components/atoms/LogoNW";

const LoginScreen = () => {
	const router = useRouter();
	const { login, isLoading } = useAuth();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errors, setErrors] = useState({
		email: "",
		password: "",
	});

	const validateForm = () => {
		const newErrors = { email: "", password: "" };
		let isValid = true;

		if (!formData.email) {
			newErrors.email = "Email is required";
			isValid = false;
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Please enter a valid email";
			isValid = false;
		}

		if (!formData.password) {
			newErrors.password = "Password is required";
			isValid = false;
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleLogin = async () => {
		if (!validateForm()) return;

		const result = await login(formData.email, formData.password);

		if (result.success) {
			router.replace("/(tabs)"); // Navigate to home
		} else {
			// Check if error is related to email verification
			if (
				result.error?.includes("verify your email") ||
				result.error?.includes("email address before logging")
			) {
				Alert.alert(
					"Email Verification Required",
					"Please verify your email address before logging in. Would you like to go to the verification screen?",
					[
						{
							text: "Cancel",
							style: "cancel",
						},
						{
							text: "Verify Email",
							onPress: () =>
								router.push(
									`/verify-email?email=${encodeURIComponent(
										formData.email
									)}`
								),
						},
					]
				);
			} else {
				Alert.alert(
					"Login Failed",
					result.error || "Please check your credentials"
				);
			}
		}
	};

	const handleSignUp = () => {
		router.push("/signup");
	};

	return (
		<View className="flex-1 bg-white">
			{/* Custom Header */}
			<AuthHeaderNW title="Sign In" />

			{/* Main Content */}
			<View className="flex-1 px-6 pt-8">
				{/* Logo */}
				<View className="items-center mb-8">
					<LogoNW size="sm" showText={true} />
				</View>

				{/* Login Form */}
				<View className="space-y-6">
					{/* Email Field */}
					<View className="mb-4">
						<TextInput
							style={{
								borderWidth: 1,
								borderColor: errors.email
									? "#EF4444"
									: "#D1D5DB",
								borderRadius: 8,
								paddingHorizontal: 16,
								paddingVertical: 12,
								fontSize: 16,
								backgroundColor: "#FAFAFA",
							}}
							placeholder="Enter your email"
							placeholderTextColor="#9CA3AF"
							value={formData.email}
							onChangeText={(text) => {
								setFormData((prev) => ({
									...prev,
									email: text,
								}));
								if (errors.email)
									setErrors((prev) => ({
										...prev,
										email: "",
									}));
							}}
							keyboardType="email-address"
							autoCapitalize="none"
							autoCorrect={false}
						/>
						{errors.email ? (
							<Text className="text-red-500 text-sm mt-1">
								{errors.email}
							</Text>
						) : null}
					</View>

					{/* Password Field */}
					<View>
						<TextInput
							style={{
								borderWidth: 1,
								borderColor: errors.password
									? "#EF4444"
									: "#D1D5DB",
								borderRadius: 8,
								paddingHorizontal: 16,
								paddingVertical: 12,
								fontSize: 16,
								backgroundColor: "#FAFAFA",
							}}
							placeholder="Enter your password"
							placeholderTextColor="#9CA3AF"
							value={formData.password}
							onChangeText={(text) => {
								setFormData((prev) => ({
									...prev,
									password: text,
								}));
								if (errors.password)
									setErrors((prev) => ({
										...prev,
										password: "",
									}));
							}}
							secureTextEntry
							autoCapitalize="none"
							autoCorrect={false}
						/>
						{errors.password ? (
							<Text className="text-red-500 text-sm mt-1">
								{errors.password}
							</Text>
						) : null}
					</View>

					{/* Forgot Password */}
					<TouchableOpacity
						onPress={() => router.push("/forgot-password")}
						className="self-end">
						<Text className="text-blue-600 font-medium">
							Forgot Password?
						</Text>
					</TouchableOpacity>

					{/* Login Button */}
					<ButtonNW
						title={isLoading ? "Signing In..." : "Sign In"}
						onPress={handleLogin}
						variant="primary"
						size="large"
						className="w-full mt-6"
						disabled={isLoading}
					/>
				</View>

				{/* Bottom Section */}
				<View className="flex-1 justify-end pb-8">
					<TouchableOpacity
						onPress={handleSignUp}
						className="items-center">
						<Text className="text-gray-600">
							Don&apos;t have an account?{" "}
							<Text className="text-blue-600 font-semibold">
								Sign Up
							</Text>
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default LoginScreen;
