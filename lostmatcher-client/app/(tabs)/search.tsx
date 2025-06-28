import React, { useState, useCallback } from "react";
import SearchTemplateNW from "@/components/templates/SearchTemplateNW";
import SearchOrgNW from "@/components/organisms/SearchOrgNW";
import { useRouter } from "expo-router";

// Mock data for registered items
const mockRegisteredItems = [
	{
		id: "1",
		name: "iPhone 13 Pro",
		description: "Blue iPhone with cracked screen protector",
		imageUri: undefined,
	},
	{
		id: "2",
		name: "Black Backpack",
		description: "Nike backpack with laptop compartment",
		imageUri: undefined,
	},
	{
		id: "3",
		name: "Silver Watch",
		description: "Apple Watch Series 8 with sport band",
		imageUri: undefined,
	},
	{
		id: "4",
		name: "Red Umbrella",
		description: "Compact umbrella with wooden handle",
		imageUri: undefined,
	},
];

const SearchTabScreen = () => {
	const router = useRouter();
	const [title, setTitle] = useState("Search");
	const [onBackPress, setOnBackPress] = useState<() => void>(
		() => () => router.back()
	);

	const handleTitleChange = useCallback((newTitle: string) => {
		setTitle(newTitle);
	}, []);

	const handleBackPressChange = useCallback((handler: () => void) => {
		setOnBackPress(() => handler);
	}, []);

	return (
		<SearchTemplateNW
			title={title}
			showBackButton={true}
			onBackPress={onBackPress}
			scrollable={false}>
			<SearchOrgNW
				registeredItems={mockRegisteredItems}
				onTitleChange={handleTitleChange}
				onBackPressChange={handleBackPressChange}
			/>
		</SearchTemplateNW>
	);
};

export default SearchTabScreen;
