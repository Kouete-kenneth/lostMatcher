import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { HapticTab } from "@/components/globals/HapticTab";
import { CustomAddTabButton } from "@/components/globals/CustomAddTabButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import CircularPlusIconNW from "@/components/atoms/CircularPlusIconNW";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { addTabEvents, ADD_TAB_PRESSED } from "@/lib/addTabEvents";

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={({ route }) => ({
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: "absolute",
					},
					default: {},
				}),
			})}>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => (
						<IconSymbol size={28} name="house.fill" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: "Search",
					tabBarIcon: ({ color }) => (
						<IconSymbol
							size={28}
							name="magnifyingglass"
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="add"
				options={({ navigation }) => ({
					title: "",
					tabBarButton: (props) => (
						<CustomAddTabButton
							{...props}
							onCustomPress={() => {
								// Emit event that add tab was pressed
								addTabEvents.emit(ADD_TAB_PRESSED);
							}}
						/>
					),
					tabBarIcon: ({ focused, color }) => {
						// Check if home tab is active by looking at navigation state
						const state = navigation.getState();
						const currentRoute = state.routes[state.index];
						const isHomeActive = currentRoute?.name === "index";

						return (
							<CircularPlusIconNW
								size={42}
								color={color}
								focused={focused}
								isHomeActive={isHomeActive}
							/>
						);
					},
					tabBarLabelStyle: { display: "none" },
				})}
			/>
			<Tabs.Screen
				name="matches"
				options={{
					title: "Matches",
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="check-circle"
							size={28}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="feedback"
				options={{
					title: "Feedback",
					tabBarIcon: ({ color }) => (
						<MaterialCommunityIcons
							name="message-reply"
							size={28}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
