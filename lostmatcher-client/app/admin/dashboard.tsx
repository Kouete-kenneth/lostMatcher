import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";

const stats = [
	{
		icon: "account-group-outline" as const,
		title: "Total Users",
		value: 30,
		color: "#2563EB",
		link: "/admin/users",
	},
	{
		icon: "cube-outline" as const,
		title: "Total Items",
		value: 50,
		color: "#F59E42",
		link: "/admin/items",
	},
	{
		icon: "check-decagram" as const,
		title: "Pending Approvals",
		value: 10,
		color: "#10B981",
		link: "/admin/approvals",
	},
	{
		icon: "file-document-edit-outline" as const,
		title: "FAQ Entries",
		value: 12,
		color: "#6366F1",
		link: "/admin/faq",
	},
	{
		icon: "message-reply" as const,
		title: "Support Requests",
		value: 5,
		color: "#F43F5E",
		link: "/admin/support",
	},
	{
		icon: "star-circle-outline" as const,
		title: "User Feedback",
		value: 23,
		color: "#FBBF24",
		link: "/admin/feedback",
	},
];

	// Dummy recent activity data
	const activities = [
		{
			icon: "account-plus",
			color: "#2563EB",
			user: "Hamadou Diallo",
			action: "registered",
			time: "2m ago",
		},
		{
			icon: "cube",
			color: "#F59E42",
			user: "Black Backpack",
			action: "reported as lost",
			time: "5m ago",
		},
		{
			icon: "message-reply",
			color: "#F43F5E",
			user: "peter parker",
			action: "sent a support request",
			time: "10m ago",
		},
		{
			icon: "file-document-edit-outline",
			color: "#6366F1",
			user: "How to claim an item?",
			action: "FAQ updated",
			time: "20m ago",
		},
		{
			icon: "check-decagram",
			color: "#10B981",
			user: "#123",
			action: "approved by admin",
			time: "30m ago",
		},
	];

export default function AdminDashboardScreen() {
	const router = useRouter();
	return (
		<ScrollView
			className="flex-1 bg-white"
			contentContainerStyle={{ padding: 16 }}>
			<View className="flex-row flex-wrap justify-between mb-8">
				{stats.map((stat) => (
					<TouchableOpacity
						key={stat.title}
						onPress={() =>
							stat.link && router.push(stat.link as any)
						}
						activeOpacity={stat.link ? 0.7 : 1}
						className={twMerge(
							"bg-white rounded-lg shadow p-2 flex-row items-center mb-4",
							"w-[48%]",
							stat.link ? "" : "border-0"
						)}
						style={{
							borderWidth: stat.link ? 1 : 0,
							borderColor: stat.link ? stat.color : undefined,
						}}>
						<View
							className="items-center justify-center mr-4"
							style={{
								width: 48,
								height: 48,
								borderRadius: 24,
								backgroundColor: stat.color + "22",
							}}>
							<MaterialCommunityIcons
								name={stat.icon}
								size={28}
								color={stat.color}
							/>
						</View>
						<View className="flex-1">
							<Text
								className="text-[26px] font-bold text-[#111]"
								numberOfLines={1}
								adjustsFontSizeToFit>
								{stat.value}
							</Text>
							<Text
								className="text-[15px] text-[#555] font-medium mt-1"
								numberOfLines={2}
								adjustsFontSizeToFit>
								{stat.title}
							</Text>
						</View>
						{stat.link && (
							<MaterialCommunityIcons
								name="chevron-right"
								size={22}
								color={stat.color}
							/>
						)}
					</TouchableOpacity>
				))}
			</View>

			<View className="mb-8">
				<Text className="text-[17px] font-semibold text-[#222] mb-2">
					Recent Activity
				</Text>
				<View className="bg-gray-100 rounded-xl px-0 py-2 divide-y divide-gray-200">
					{activities.map((activity, idx) => (
						<View
							key={idx}
							className="flex-row items-center px-4 py-3 bg-transparent">
							<View className="w-9 h-9 rounded-full bg-white shadow items-center justify-center mr-3">
								<MaterialCommunityIcons
									name={activity.icon as any}
									size={20}
									color={activity.color}
								/>
							</View>
							<View style={{ flex: 1 }}>
								<Text
									className="text-[15px] text-[#222]"
									numberOfLines={2}>
									{activity.action === "FAQ updated" ? (
										<>
											FAQ updated:{" "}
											<Text className="font-bold">
												{activity.user}
											</Text>
										</>
									) : activity.action ===
									  "reported as lost" ? (
										<>
											New item reported:{" "}
											<Text className="font-bold">
												{activity.user}
											</Text>
										</>
									) : activity.action ===
									  "approved by admin" ? (
										<>
											Item{" "}
											<Text className="font-bold">
												{activity.user}
											</Text>{" "}
											approved by admin
										</>
									) : (
										<>
											<Text className="font-bold">
												{activity.user}
											</Text>{" "}
											{activity.action}
										</>
									)}
								</Text>
							</View>
							<Text className="text-xs text-gray-400 ml-2 min-w-[48px] text-right">
								{activity.time}
							</Text>
						</View>
					))}
				</View>
			</View>

			<View>
				<Text className="text-[17px] font-semibold text-[#222] mb-2">
					System Health
				</Text>
				<View className="flex-row items-center">
					<MaterialCommunityIcons
						name="check-circle"
						size={20}
						color="#10B981"
					/>
					<Text className="text-[#059669] font-medium ml-1.5">
						All systems operational
					</Text>
				</View>
			</View>
		</ScrollView>
	);
}
