import React from "react";
import { ScrollView, Text } from "react-native";
import { Colors } from "@/constants/Colors";

export default function AdminUsersScreen() {
	return (
		<ScrollView className="flex-1 bg-white p-6">
			<Text
				className="text-2xl font-bold mb-4"
				style={{ color: Colors.light.primary }}>
				Users
			</Text>
			<Text className="text-base text-gray-700 mb-2">
				Manage users, roles, and permissions here.
			</Text>
			{/* User management list would go here */}
		</ScrollView>
	);
}
