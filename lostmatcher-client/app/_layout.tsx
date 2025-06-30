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
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import { View } from "react-native";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import OnboardingHeaderNW from "../components/atoms/OnboardingHeaderNW";

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
						<Stack.Screen
							name="claim-screen"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="report-found"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="report-lost"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="register-item"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="lost-items"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="found-items"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="registered-items"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="search-results"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="my-claims"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="my-recovered"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="notifications"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="support"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="profile"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="admin"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="onboarding"
							options={{
								headerShown: false,
								header: () => <OnboardingHeaderNW />, // Use the custom header component
							}}
						/>
						<Stack.Screen
							name="login"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="signup"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="verify-email"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="forgot-password"
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
			<AuthProvider>
				<NotificationProvider>
					<RootLayoutNav />
				</NotificationProvider>
			</AuthProvider>
		</SafeAreaProvider>
	);
}

export const unstable_settings = {
	rsc: {
		dynamic: "force-static",
	},
};
