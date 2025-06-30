import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import AuthHeaderNW from "@/components/atoms/AuthHeaderNW";
import ButtonNW from "@/components/atoms/ButtonNW";

const VerifyEmailScreen = () => {
	const router = useRouter();
	const [code, setCode] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleVerify = async () => {
		setIsLoading(true);
		setError("");
		// TODO: Replace with real API call
		setTimeout(() => {
			if (code === "123456") {
				router.replace("/(tabs)"); // Go to home after verification
			} else {
				setError("Invalid verification code");
			}
			setIsLoading(false);
		}, 1000);
	};

	const handleResend = () => {
		// TODO: Implement resend logic
		Alert.alert("Verification Email Sent", "Please check your inbox.");
	};

	return (
		<View className="flex-1 bg-white">
			<AuthHeaderNW title="Verify Your Email" />
			<View className="flex-1 px-6 pt-8">
				<Text className="text-center text-lg font-semibold mb-4">
					Enter the 6-digit code sent to your email
				</Text>
				<TextInput
					style={{
						borderWidth: 1,
						borderColor: error ? "#EF4444" : "#D1D5DB",
						borderRadius: 8,
						paddingHorizontal: 16,
						paddingVertical: 12,
						fontSize: 20,
						letterSpacing: 8,
						textAlign: "center",
						backgroundColor: "#FAFAFA",
						marginBottom: 8,
					}}
					placeholder="------"
					placeholderTextColor="#9CA3AF"
					value={code}
					onChangeText={setCode}
					keyboardType="number-pad"
					maxLength={6}
					autoCapitalize="none"
				/>
				{error ? (
					<Text className="text-red-500 text-center mb-2">
						{error}
					</Text>
				) : null}
				<ButtonNW
					title={isLoading ? "Verifying..." : "Verify"}
					onPress={handleVerify}
					variant="primary"
					size="large"
					className="w-full mt-4"
					disabled={isLoading}
				/>
				<TouchableOpacity
					onPress={handleResend}
					className="mt-6 items-center">
					<Text className="text-blue-600 font-medium">
						Resend Code
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default VerifyEmailScreen;
