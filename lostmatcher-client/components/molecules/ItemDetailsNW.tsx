import React from "react";
import { View, Text, Image } from "react-native";

interface ItemDetailsProps {
	item: {
		name: string;
		description: string;
		category: string;
		dateLost?: string;
		dateFound?: string;
		location: string;
		image: string;
		attributes: Record<string, string>;
		owner?: { name: string; town?: string };
		finder?: { name: string; town?: string };
	};
	type: "lost" | "found";
}

export default function ItemDetailsNW({ item, type }: ItemDetailsProps) {
	return (
		<View className="flex-1">
			{/* Image Section */}
			<View className="mb-4">
				<Image
					source={{ uri: item.image }}
					className="w-full rounded-lg bg-gray-200"
					style={{ aspectRatio: 3 / 2 }}
					resizeMode="cover"
				/>
			</View>

			{/* Item Info Section */}
			<View className="mb-4">
				<Text className="text-sm font-semibold text-gray-700 mb-2">
					{item.name}
				</Text>
				<Text className="text-sm text-gray-600 mb-2 leading-5">
					{item.description}
				</Text>
				<Text className="text-sm text-gray-500">
					Category: {item.category}
				</Text>
			</View>

			{/* Date & Location Section */}
			<View className="mb-4">
				<Text className="text-sm font-semibold text-gray-700 mb-2">
					{type === "lost" ? "Lost Details" : "Found Details"}
				</Text>
				<Text className="text-sm text-gray-500 mb-1">
					Date:{" "}
					{new Date(
						type === "lost" ? item.dateLost! : item.dateFound!
					).toLocaleDateString()}
				</Text>
				<Text className="text-sm text-gray-500">
					Location: {item.location}
				</Text>
			</View>

			{/* Attributes Section */}
			<View className="mb-4">
				<Text className="text-sm font-semibold text-gray-700 mb-2">
					Attributes
				</Text>
				<View className="space-y-1">
					{Object.entries(item.attributes).map(([key, value]) => (
						<View
							key={key}
							className="flex-row justify-self-start items-start py-0.5">
							<Text className="text-sm text-gray-600 capitalize">
								{key}:
							</Text>
							<Text className="text-sm text-gray-600 flex-1 text-start ml-1">
								{value}
							</Text>
						</View>
					))}
				</View>
			</View>

			{/* Owner Section */}
			<View className="mb-4">
				<Text className="text-sm font-semibold text-gray-700 mb-2">
					personal details
				</Text>
				{type === "lost" && item.owner ? (
					<>
						<Text className="text-sm font-medium text-gray-600 mb-1">
							{item.owner.name}
						</Text>
						{item.owner.town && (
							<Text className="text-sm text-gray-600">
								Town: {item.owner.town}
							</Text>
						)}
					</>
				) : item.finder && (
					<>
						<Text className="text-sm font-medium text-gray-600 mb-1">
							{item.finder.name}
						</Text>
						{item.finder.town && (
							<Text className="text-sm text-gray-600">
								Town: {item.finder.town}
							</Text>
						)}
					</>
				) }
			</View>
		</View>
	);
}
