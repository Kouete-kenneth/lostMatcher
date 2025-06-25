import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../organisms";

interface BaseLayoutProps {
	title: string;
	subtitle?: string;
	showBack?: boolean;
	onBackPress?: () => void;
	showSearch?: boolean;
	searchValue?: string;
	onSearchChange?: (text: string) => void;
	onSearch?: () => void;
	rightActions?: React.ReactNode;
	children: React.ReactNode;
	style?: ViewStyle;
}

export default function BaseLayout({
	title,
	subtitle,
	showBack = false,
	onBackPress,
	showSearch = false,
	searchValue = "",
	onSearchChange,
	onSearch,
	rightActions,
	children,
	style,
}: BaseLayoutProps) {
	return (
		<SafeAreaView
			style={[styles.container, style]}
			edges={["top", "left", "right", "bottom"]}>
			<Header
				title={title}
				subtitle={subtitle}
				showBack={showBack}
				onBackPress={onBackPress}
				showSearch={showSearch}
				searchValue={searchValue}
				onSearchChange={onSearchChange}
				onSearch={onSearch}
				rightActions={rightActions}
			/>

			<View style={styles.content}>{children}</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F5F5",
	},
	content: {
		flex: 1,
	},
});
