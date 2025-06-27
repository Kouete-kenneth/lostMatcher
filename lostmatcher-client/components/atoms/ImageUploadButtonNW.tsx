import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

interface ImageUploadButtonProps {
	imageUri?: string;
	onPress: () => void;
	className?: string;
	label?: string;
	error?: string;
}

export default function ImageUploadButtonNW({
	imageUri,
	onPress,
	className,
	label = "Add Photo",
	error,
}: ImageUploadButtonProps) {
	return (
		<View className={cn("w-full", className)}>
			{label && (
				<Text className="text-sm font-medium text-gray-700 mb-2">
					{label}
				</Text>
			)}

			<TouchableOpacity
				onPress={onPress}
				className={cn(
					"border-2 border-dashed rounded-xl p-6 items-center justify-center min-h-[160px]",
					error
						? "border-red-300 bg-red-50"
						: imageUri
						? "border-primary-300 bg-primary-50"
						: "border-gray-300 bg-gray-50"
				)}>
				{imageUri ? (
					<View className="w-full h-32 relative">
						<Image
							source={{ uri: imageUri }}
							className="w-full h-full rounded-lg"
							resizeMode="cover"
						/>
						<View className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
							<Ionicons name="pencil" size={16} color="#6B7280" />
						</View>
					</View>
				) : (
					<View className="items-center">
						<View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mb-3">
							<Ionicons name="camera" size={24} color="#3B82F6" />
						</View>
						<Text className="text-base font-medium text-gray-900 mb-1">
							{label}
						</Text>
						<Text className="text-sm text-gray-500 text-center">
							Tap to select from gallery or take a photo
						</Text>
					</View>
				)}
			</TouchableOpacity>

			{error && (
				<Text className="text-sm text-red-600 mt-1">{error}</Text>
			)}
		</View>
	);
}
