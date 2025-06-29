import React from "react";
import { View, Text } from "react-native";

interface ItemHeaderProps {
	title: string;
	type: "lost" | "found";
}

export default function ItemHeaderNW({ title, type }: ItemHeaderProps) {
	const bgColor = type === "lost" ? "bg-red-50" : "bg-green-50";
	const textColor = type === "lost" ? "text-red-700" : "text-green-700";

	return (
		<View className={`${bgColor} rounded-lg p-3 mb-4`}>
			<Text
				className={`text-center font-semibold ${textColor} text-base`}>
				{title}
			</Text>
		</View>
	);
}
