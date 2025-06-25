import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { cn } from "@/lib/utils";

interface RegisteredItemProps {
	id: string;
	name: string;
	description: string;
	imageUri?: string;
	onSearchPress: (id: string) => void;
	className?: string;
}

const RegisteredItemNW = ({
	id,
	name,
	description,
	imageUri,
	onSearchPress,
	className,
}: RegisteredItemProps) => {
	return (
		<View
			className={cn(
				"flex-row items-center py-4 border-b border-gray-100",
				className
			)}>
			{/* Item Image */}
			<View className="w-16 h-16 bg-gray-200 rounded-md mr-3 overflow-hidden">
				{imageUri ? (
					<Image
						source={{ uri: imageUri }}
						className="w-full h-full"
						resizeMode="cover"
					/>
				) : (
					<View className="flex-1 items-center justify-center">
						<MaterialCommunityIcons
							name="image-outline"
							size={24}
							color="#9CA3AF"
						/>
					</View>
				)}
			</View>

			{/* Item Details */}
			<View className="flex-1 mr-3">
				<Text className="text-charcoal-800 text-base font-semibold mb-1">
					{name}
				</Text>
				<Text className="text-gray-500 text-sm" numberOfLines={1}>
					{description}
				</Text>
			</View>

			{/* Search Button */}
			<TouchableOpacity
				onPress={() => onSearchPress(id)}
				className="w-10 h-10 bg-blue-50 rounded-md items-center justify-center">
				<MaterialCommunityIcons
					name="magnify"
					size={20}
					color="#3B82F6"
				/>
			</TouchableOpacity>
		</View>
	);
};

export default RegisteredItemNW;
