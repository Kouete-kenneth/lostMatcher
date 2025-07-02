import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import AuthHeaderNW from "@/components/atoms/AuthHeaderNW";
import ButtonNW from "@/components/atoms/ButtonNW";
import { api } from "@/lib/api";
import { logError } from "@/lib/errorUtils";

const VerifyEmailScreen = () => {
	const router = useRouter();
	const { refreshUser } = useAuth();
	const params = useLocalSearchParams();
	const userEmail = params.email as string;

	const [verificationCode, setVerificationCode] = useState("");
	const [email, setEmail] = useState(userEmail || "");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	// Format code as user types (add spaces for readability)
	const handleCodeChange = (text: string) => {
		// Remove any non-digit characters
		const digitsOnly = text.replace(/\D/g, "");
		// Limit to 6 digits
		const limited = digitsOnly.slice(0, 6);
		setVerificationCode(limited);
		setError("");
	};

	const handleVerify = async () => {
		if (!email.trim()) {
			setError("Please enter your email address");
			return;
		}

		if (!verificationCode.trim() || verificationCode.length !== 6) {
			setError("Please enter the 6-digit verification code");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			await api.verifyEmail({
				email: email.trim(),
				code: verificationCode.trim(),
			});

			// Refresh user data to get updated verification status
			await refreshUser();

			Alert.alert(
				"Email Verified Successfully!",
				"Your email has been verified. You can now access all features.",
				[
					{
						text: "Continue",
						onPress: () => router.replace("/(tabs)"),
					},
				]
			);
		} catch (error: any) {
			logError("Email verification failed", error);
			setError(
				error.message ||
					"Verification failed. Please check your code and try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleResend = async () => {
		if (!email.trim()) {
			setError("Please enter your email address");
			return;
		}

		try {
			setIsLoading(true);
			setError("");
			await api.sendVerificationCode({ email: email.trim() });
			Alert.alert(
				"Verification Code Sent",
				"Please check your inbox for a new 6-digit verification code."
			);
		} catch (error: any) {
			logError("Failed to resend verification code", error);
			Alert.alert(
				"Error",
				error.message ||
					"Failed to send verification code. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<View className="flex-1 bg-white">
			<AuthHeaderNW title="Verify Your Email" />
			<View className="flex-1 px-6 pt-8">
				<Text className="text-center text-lg font-semibold mb-4">
					Enter the 6-digit code sent to your email
				</Text>

				<Text className="text-sm text-gray-600 text-center mb-6">
					We&apos;ve sent a verification code to your email address.
					Enter it below to verify your account.
				</Text>

				{/* Email input */}
				{!userEmail && (
					<TextInput
						style={{
							borderWidth: 1,
							borderColor: error ? "#EF4444" : "#D1D5DB",
							borderRadius: 8,
							paddingHorizontal: 16,
							paddingVertical: 12,
							fontSize: 16,
							backgroundColor: "#FAFAFA",
							marginBottom: 16,
						}}
						placeholder="Enter your email address"
						placeholderTextColor="#9CA3AF"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
					/>
				)}

				{/* 6-digit code input */}
				<View className="mb-4">
					<Text className="text-sm font-medium text-gray-700 mb-2">
						Verification Code
					</Text>
					<TextInput
						style={{
							borderWidth: 1,
							borderColor: error ? "#EF4444" : "#D1D5DB",
							borderRadius: 8,
							paddingHorizontal: 16,
							paddingVertical: 12,
							fontSize: 24,
							backgroundColor: "#FAFAFA",
							textAlign: "center",
							letterSpacing: 8,
							fontFamily: "monospace",
						}}
						placeholder="000000"
						placeholderTextColor="#9CA3AF"
						value={verificationCode}
						onChangeText={handleCodeChange}
						keyboardType="numeric"
						maxLength={6}
						autoCapitalize="none"
						autoCorrect={false}
					/>
				</View>

				{error ? (
					<Text className="text-red-500 text-center mb-2">
						{error}
					</Text>
				) : null}

				<ButtonNW
					title={isLoading ? "Verifying..." : "Verify Email"}
					onPress={handleVerify}
					variant="primary"
					size="large"
					className="w-full mt-4"
					disabled={
						isLoading ||
						!verificationCode.trim() ||
						verificationCode.length !== 6
					}
				/>

				<TouchableOpacity
					onPress={handleResend}
					className="mt-6 items-center"
					disabled={isLoading}>
					<Text className="text-blue-600 font-medium">
						{isLoading ? "Sending..." : "Resend Verification Code"}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default VerifyEmailScreen;
