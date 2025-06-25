import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { IconButton, Label } from "../atoms";
import { SearchBar } from "../molecules";

interface HeaderProps {
	title: string;
	subtitle?: string;
	showBack?: boolean;
	onBackPress?: () => void;
	showSearch?: boolean;
	searchValue?: string;
	onSearchChange?: (text: string) => void;
	onSearch?: () => void;
	rightActions?: React.ReactNode;
	style?: ViewStyle;
}

export default function Header({
	title,
	subtitle,
	showBack = false,
	onBackPress,
	showSearch = false,
	searchValue = "",
	onSearchChange,
	onSearch,
	rightActions,
	style,
}: HeaderProps) {
	return (
		<View style={[styles.container, style]}>
			<View style={styles.topRow}>
				<View style={styles.leftSection}>
					{showBack && onBackPress && (
						<IconButton
							name="arrow-back"
							size={24}
							onPress={onBackPress}
							style={styles.backButton}
						/>
					)}

					<View style={styles.titleContainer}>
						<Label variant="headline" weight="bold">
							{title}
						</Label>
						{subtitle && (
							<Label variant="caption" color="secondary">
								{subtitle}
							</Label>
						)}
					</View>
				</View>

				{rightActions && (
					<View style={styles.rightSection}>{rightActions}</View>
				)}
			</View>

			{showSearch && onSearchChange && onSearch && (
				<View style={styles.searchContainer}>
					<SearchBar
						value={searchValue}
						onChangeText={onSearchChange}
						onSearch={onSearch}
						placeholder="Search items..."
					/>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		paddingTop: 16, // Reduced since SafeAreaView handles status bar
		paddingHorizontal: 16,
		paddingBottom: 16,
		borderBottomWidth: 1,
		borderBottomColor: "#E0E0E0",
	},
	topRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	leftSection: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	backButton: {
		marginRight: 8,
	},
	titleContainer: {
		flex: 1,
	},
	rightSection: {
		flexDirection: "row",
		alignItems: "center",
	},
	searchContainer: {
		marginTop: 16,
	},
});
