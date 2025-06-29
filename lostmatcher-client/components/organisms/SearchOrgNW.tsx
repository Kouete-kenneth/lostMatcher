import React, { useState } from "react";
import { useRouter } from "expo-router";
import SearchActionsNW from "@/components/molecules/SearchActionsNW";
import RegisteredItemsListNW from "@/components/molecules/RegisteredItemsListNW";

interface RegisteredItem {
	id: string;
	name: string;
	description: string;
	imageUri?: string;
}

interface SearchOrgNWProps {
	registeredItems: RegisteredItem[];
	onTitleChange: (title: string) => void;
	onBackPressChange: (handler: () => void) => void;
}

const SearchOrgNW = ({
	registeredItems,
	onTitleChange,
	onBackPressChange,
}: SearchOrgNWProps) => {
	const router = useRouter();
	const [showRegisteredItems, setShowRegisteredItems] = useState(false);

	const handleRegisteredItems = () => {
		setShowRegisteredItems(true);
	};

	const handleAddNewItem = () => {
		if (showRegisteredItems) {
			// From Registered Items view - go to Add tab with Register item flow
			console.log("Navigate to Add tab with registerItem action");
			router.push({
				pathname: "/(tabs)/add",
				params: { action: "registerItem" },
			});
		} else {
			// From Search view - go to Add tab to show the modal
			console.log("Navigate to Add tab with reportLost action");
			router.push({
				pathname: "/(tabs)/add",
				params: { action: "reportLost" },
			});
		}
	};

	const handleSearchItem = (itemId: string) => {
		console.log("Search for item:", itemId);
		// TODO: Navigate to search results for this item
	};

	const handleBackToSearch = React.useCallback(() => {
		setShowRegisteredItems(false);
	}, []);

	// Update title and back handler when showRegisteredItems changes
	React.useEffect(() => {
		if (showRegisteredItems) {
			onTitleChange("Registered Items");
			onBackPressChange(handleBackToSearch);
		} else {
			onTitleChange("Search");
			onBackPressChange(() => router.back());
		}
	}, [
		showRegisteredItems,
		onTitleChange,
		onBackPressChange,
		router,
		handleBackToSearch,
	]);

	if (!showRegisteredItems) {
		return (
			<SearchActionsNW
				onRegisteredItems={handleRegisteredItems}
				onAddNewItem={handleAddNewItem}
			/>
		);
	}

	return (
		<RegisteredItemsListNW
			items={registeredItems}
			onAddNewItem={handleAddNewItem}
			onSearchItem={handleSearchItem}
		/>
	);
};

export default SearchOrgNW;
