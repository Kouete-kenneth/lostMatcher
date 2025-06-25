import React from "react";
import { ViewStyle } from "react-native";
import { ListView } from "../organisms";
import BaseLayout from "./BaseLayout";

interface ListItem {
	id: string;
	title: string;
	subtitle?: string;
	[key: string]: any;
}

interface ListLayoutProps {
	title: string;
	subtitle?: string;
	showBack?: boolean;
	onBackPress?: () => void;
	showSearch?: boolean;
	searchValue?: string;
	onSearchChange?: (text: string) => void;
	onSearch?: () => void;
	rightActions?: React.ReactNode;

	// List specific props
	data: ListItem[];
	emptyMessage?: string;
	onItemPress?: (item: ListItem) => void;
	onItemMenuPress?: (item: ListItem) => void;
	renderCustomContent?: (item: ListItem) => React.ReactNode;
	refreshing?: boolean;
	onRefresh?: () => void;

	style?: ViewStyle;
}

export default function ListLayout({
	title,
	subtitle,
	showBack = false,
	onBackPress,
	showSearch = false,
	searchValue = "",
	onSearchChange,
	onSearch,
	rightActions,
	data,
	emptyMessage,
	onItemPress,
	onItemMenuPress,
	renderCustomContent,
	refreshing = false,
	onRefresh,
	style,
}: ListLayoutProps) {
	return (
		<BaseLayout
			title={title}
			subtitle={subtitle}
			showBack={showBack}
			onBackPress={onBackPress}
			showSearch={showSearch}
			searchValue={searchValue}
			onSearchChange={onSearchChange}
			onSearch={onSearch}
			rightActions={rightActions}
			style={style}>
			{" "}
			<ListView
				data={data}
				emptyMessage={emptyMessage}
				onItemPress={onItemPress}
				onItemMenuPress={onItemMenuPress}
				renderCustomContent={renderCustomContent}
				refreshing={refreshing}
				onRefresh={onRefresh}
			/>
		</BaseLayout>
	);
}
