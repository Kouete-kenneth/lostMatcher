import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import AuthHeaderNW from "@/components/atoms/AuthHeaderNW";
import ButtonNW from "@/components/atoms/ButtonNW";
import LogoNW from "@/components/atoms/LogoNW";
import { logError } from "@/lib/errorUtils";

const SignUpScreen = () => {
	const router = useRouter();
	const { register, isLoading } = useAuth();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const validateForm = () => {
		const newErrors = {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		};
		let isValid = true;

		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
			isValid = false;
		}

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

		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
			isValid = false;
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	};

	const handleSignUp = async () => {
		if (!validateForm()) return;

		const result = await register(
			formData.email,
			formData.password,
			formData.name
		);

		if (result.success) {
			router.replace(
				`/verify-email?email=${encodeURIComponent(formData.email)}`
			); // Go to email verification screen with email parameter
		} else {
			Alert.alert(
				"Registration Failed",
				result.error || "Please try again"
			);
			// Safe logging without exposing stack traces
			logError("Registration failed", result.error || "Unknown error");
		}
	};

	const handleSignIn = () => {
		router.push("/login");
	};

	return (
		<View className="flex-1 bg-white">
			{/* Custom Header */}
			<AuthHeaderNW title="Sign Up" />

			{/* Main Content */}
			<View className="flex-1 px-6 pt-8">
				{/* Logo */}
				<View className="items-center mb-8">
					<LogoNW size="sm" showText={true} />
				</View>

				{/* Sign Up Form */}
				<View className="space-y-6">
					{/* Name Field */}
					<View className="mb-4">
						<TextInput
							style={{
								borderWidth: 1,
								borderColor: errors.name
									? "#EF4444"
									: "#D1D5DB",
								borderRadius: 8,
								paddingHorizontal: 16,
								paddingVertical: 12,
								fontSize: 16,
								backgroundColor: "#FAFAFA",
							}}
							placeholder="Enter your full name"
							placeholderTextColor="#9CA3AF"
							value={formData.name}
							onChangeText={(text) => {
								setFormData((prev) => ({
									...prev,
									name: text,
								}));
								if (errors.name)
									setErrors((prev) => ({
										...prev,
										name: "",
									}));
							}}
							autoCapitalize="words"
							autoCorrect={false}
						/>
						{errors.name ? (
							<Text className="text-red-500 text-sm mt-1">
								{errors.name}
							</Text>
						) : null}
					</View>

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
					<View className="mb-4">
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
							placeholder="Create a password"
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

					{/* Confirm Password Field */}
					<View className="mb-4">
						<TextInput
							style={{
								borderWidth: 1,
								borderColor: errors.confirmPassword
									? "#EF4444"
									: "#D1D5DB",
								borderRadius: 8,
								paddingHorizontal: 16,
								paddingVertical: 12,
								fontSize: 16,
								backgroundColor: "#FAFAFA",
							}}
							placeholder="Confirm your password"
							placeholderTextColor="#9CA3AF"
							value={formData.confirmPassword}
							onChangeText={(text) => {
								setFormData((prev) => ({
									...prev,
									confirmPassword: text,
								}));
								if (errors.confirmPassword)
									setErrors((prev) => ({
										...prev,
										confirmPassword: "",
									}));
							}}
							secureTextEntry
							autoCapitalize="none"
							autoCorrect={false}
						/>
						{errors.confirmPassword ? (
							<Text className="text-red-500 text-sm mt-1">
								{errors.confirmPassword}
							</Text>
						) : null}
					</View>

					{/* Sign Up Button */}
					<ButtonNW
						title={isLoading ? "Creating Account..." : "Sign Up"}
						onPress={handleSignUp}
						variant="primary"
						size="large"
						className="w-full mt-6"
						disabled={isLoading}
					/>
				</View>

				{/* Bottom Section */}
				<View className="flex-1 justify-end pb-8">
					<TouchableOpacity
						onPress={handleSignIn}
						className="items-center">
						<Text className="text-gray-600">
							Already have an account?{" "}
							<Text className="text-blue-600 font-semibold">
								Sign In
							</Text>
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default SignUpScreen;
