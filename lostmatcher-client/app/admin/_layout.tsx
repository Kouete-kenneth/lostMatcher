import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function AdminHeader({ title }: { title: string }) {
	const insets = useSafeAreaInsets();
	return (
		<View
			style={{
				backgroundColor: Colors.light.primary,
				paddingTop: insets.top,
				height: 44 + insets.top, // Reduced height further
				justifyContent: "center",
				alignItems: "center",
				borderBottomWidth: 1,
				borderBottomColor: "#e5e7eb",
			}}>
			<Text style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>
				{title}
			</Text>
		</View>
	);
}

export default function AdminTabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.light.primary,
				header: ({ route }) => {
					let title = "";
					switch (route.name) {
						case "dashboard":
							title = "Dashboard";
							break;
						case "approvals":
							title = "Approvals";
							break;
						case "users":
							title = "Users";
							break;
						case "items":
							title = "Items";
							break;
						default:
							title = "";
					}
					return <AdminHeader title={title} />;
				},
				tabBarStyle: { backgroundColor: Colors.light.background },
				tabBarLabelStyle: { fontWeight: "600" },
			}}>
			<Tabs.Screen
				name="dashboard"
				options={{
					title: "Dashboard",
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="view-dashboard-outline"
							size={22}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="approvals"
				options={{
					title: "Approvals",
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="check-decagram"
							size={22}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="users"
				options={{
					title: "Users",
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="account-group-outline"
							size={22}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="items"
				options={{
					title: "Items",
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="cube-outline"
							size={22}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
