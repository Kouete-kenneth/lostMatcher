import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
	SafeAreaProvider,
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { View, Platform } from "react-native";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";

function RootLayoutNav() {
	const colorScheme = useColorScheme();
	const insets = useSafeAreaInsets();

	const statusBarBgColor = colorScheme === "dark" ? "#111827" : "#2563EB";
	const appBgColor = colorScheme === "dark" ? "#111827" : "#ffffff";

	return (
		<View style={{ flex: 1, backgroundColor: statusBarBgColor }}>
			{/* Status Bar Background - Only visible behind translucent status bar */}
			<View
				style={{
					height: insets.top,
					backgroundColor: statusBarBgColor,
				}}
			/>

			{/* Main App Content */}
			<View style={{ flex: 1, backgroundColor: appBgColor }}>
				<ThemeProvider
					value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
					<Stack>
						<Stack.Screen
							name="index"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="(tabs)"
							options={{ headerShown: false }}
						/>
						<Stack.Screen name="+not-found" />
					</Stack>
				</ThemeProvider>
			</View>

			{/* Status Bar Component */}
			<StatusBar
				style={colorScheme === "dark" ? "light" : "light"}
				// Don't set backgroundColor - it's handled by the view above
			/>
		</View>
	);
}

export default function RootLayout() {
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	if (!loaded) {
		return null;
	}

	return (
		<SafeAreaProvider>
			<RootLayoutNav />
		</SafeAreaProvider>
	);
}

export const unstable_settings = {
	rsc: {
		dynamic: "force-static",
	},
};
