import React from "react";
import {
	FlatList,
	ListRenderItem,
	StyleSheet,
	View,
	ViewStyle,
} from "react-native";
import { LabelNW } from "../atoms";
import { CardNW } from "../molecules";

interface ListItem {
	id: string;
	title: string;
	subtitle?: string;
	[key: string]: any;
}

interface ListViewProps {
	data: ListItem[];
	title?: string;
	emptyMessage?: string;
	onItemPress?: (item: ListItem) => void;
	onItemMenuPress?: (item: ListItem) => void;
	renderCustomContent?: (item: ListItem) => React.ReactNode;
	refreshing?: boolean;
	onRefresh?: () => void;
	style?: ViewStyle;
}

export default function ListView({
	data,
	title,
	emptyMessage = "No items found",
	onItemPress,
	onItemMenuPress,
	renderCustomContent,
	refreshing = false,
	onRefresh,
	style,
}: ListViewProps) {
	const renderItem: ListRenderItem<ListItem> = ({ item }) => (
		<CardNW
			title={item.title}
			subtitle={item.subtitle}
			onPress={onItemPress ? () => onItemPress(item) : undefined}
			onMenuPress={
				onItemMenuPress ? () => onItemMenuPress(item) : undefined
			}>
			{renderCustomContent && renderCustomContent(item)}
		</CardNW>
	);
	const renderEmpty = () => (
		<View style={styles.emptyContainer}>
			<LabelNW variant="body" color="secondary" align="center">
				{emptyMessage}
			</LabelNW>
		</View>
	);

	const renderHeader = () => {
		if (!title) return null;

		return (
			<View style={styles.headerContainer}>
				<LabelNW variant="headline" weight="semibold">
					{title}
				</LabelNW>
			</View>
		);
	};

	return (
		<FlatList
			style={[styles.container, style]}
			data={data}
			renderItem={renderItem}
			keyExtractor={(item) => item.id}
			ListHeaderComponent={renderHeader}
			ListEmptyComponent={renderEmpty}
			refreshing={refreshing}
			onRefresh={onRefresh}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={styles.contentContainer}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	contentContainer: {
		padding: 16,
		flexGrow: 1,
	},
	headerContainer: {
		marginBottom: 16,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 32,
	},
});
