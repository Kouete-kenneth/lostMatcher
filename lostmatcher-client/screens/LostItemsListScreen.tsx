import React, { useCallback, useState } from "react";
import { View } from "react-native";
// import { router } from 'expo-router';
import { IconButtonNW, LabelNW } from "@/components";
import { ListLayout } from "@/components/templates";

// Mock data - in a real app, this would come from your state management or API
const mockLostItems = [
	{
		id: "1",
		title: "Lost iPhone 14 Pro",
		subtitle: "Lost at Central Park on Dec 15",
		location: "Central Park, NYC",
		date: "2024-12-15",
		status: "active",
	},
	{
		id: "2",
		title: "Missing Keys",
		subtitle: "House and car keys with blue keychain",
		location: "Downtown Mall",
		date: "2024-12-14",
		status: "active",
	},
	{
		id: "3",
		title: "Lost Wallet",
		subtitle: "Brown leather wallet with ID cards",
		location: "Coffee Shop on Main St",
		date: "2024-12-13",
		status: "found",
	},
];

const LostItemsListScreen: React.FC = () => {
	const [searchValue, setSearchValue] = useState("");
	const [refreshing, setRefreshing] = useState(false);
	const [filteredItems, setFilteredItems] = useState(mockLostItems);

	const handleSearch = useCallback(() => {
		if (!searchValue.trim()) {
			setFilteredItems(mockLostItems);
			return;
		}

		const filtered = mockLostItems.filter(
			(item) =>
				item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
				item.subtitle
					.toLowerCase()
					.includes(searchValue.toLowerCase()) ||
				item.location.toLowerCase().includes(searchValue.toLowerCase())
		);
		setFilteredItems(filtered);
	}, [searchValue]);

	const handleRefresh = useCallback(async () => {
		setRefreshing(true);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setFilteredItems(mockLostItems);
		setRefreshing(false);
	}, []);
	const handleItemPress = useCallback((item: any) => {
		// Navigate to item details screen
		console.log("Navigate to item details:", item.id);
		// router.push(`/lost-items/${item.id}` as any);
	}, []);

	const handleItemMenuPress = useCallback((item: any) => {
		// Show context menu for item actions
		console.log("Menu pressed for item:", item.id);
	}, []);

	const handleAddNew = useCallback(() => {
		// Navigate to create new lost item screen
		console.log("Navigate to create new item");
		// router.push('/lost-items/create' as any);
	}, []);
	const renderRightActions = () => (
		<IconButtonNW
			name="add"
			size={24}
			onPress={handleAddNew}
			variant="filled"
		/>
	);
	const renderCustomContent = useCallback((item: any) => {
		const locationText = `📍 ${item.location}`;
		const dateText = new Date(item.date).toLocaleDateString();
		const statusText = item.status === "found" ? "✅ Found" : "🔍 Looking";

		return (
			<>
				<LabelNW className="text-sm text-charcoal-600 mt-1">
					{locationText}
				</LabelNW>
				<LabelNW className="text-xs text-charcoal-500 mt-0.5">
					{dateText}
				</LabelNW>
				<View
					className="mt-2 px-2 py-1 rounded-xl self-start"
					style={{
						backgroundColor:
							item.status === "found" ? "#E8F5E8" : "#FFF3E0",
					}}>
					<LabelNW
						className="text-xs font-medium"
						style={{
							color:
								item.status === "found" ? "#2E7D32" : "#F57C00",
						}}>
						{statusText}
					</LabelNW>
				</View>
			</>
		);
	}, []);

	return (
		<ListLayout
			title="Lost Items"
			subtitle="Help find lost items in your community"
			showSearch={true}
			searchValue={searchValue}
			onSearchChange={setSearchValue}
			onSearch={handleSearch}
			rightActions={renderRightActions()}
			data={filteredItems}
			emptyMessage="No lost items found. Try adjusting your search."
			onItemPress={handleItemPress}
			onItemMenuPress={handleItemMenuPress}
			renderCustomContent={renderCustomContent}
			refreshing={refreshing}
			onRefresh={handleRefresh}
		/>
	);
};

export default LostItemsListScreen;
