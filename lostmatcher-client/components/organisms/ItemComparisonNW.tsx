import React from "react";
import { View } from "react-native";
import ItemHeaderNW from "../atoms/ItemHeaderNW";
import ItemDetailsNW from "../molecules/ItemDetailsNW";

interface ItemData {
	name: string;
	description: string;
	category: string;
	dateLost?: string;
	dateFound?: string;
	location: string;
	image: string;
	attributes: Record<string, string>;
	owner?: { name: string; town?: string };
	finder?: { name: string; town?: string };
}

interface ItemComparisonProps {
	lostItem: ItemData;
	foundItem: ItemData;
}

export default function ItemComparisonNW({
	lostItem,
	foundItem,
}: ItemComparisonProps) {
	return (
		<View className="p-4">
			<View className="flex-row gap-4">
				{/* Lost Item */}
				<View className="flex-1">
					<ItemHeaderNW title="Lost Item" type="lost" />
					<ItemDetailsNW item={lostItem} type="lost" />
				</View>

				{/* Found Item */}
				<View className="flex-1">
					<ItemHeaderNW title="Found Item" type="found" />
					<ItemDetailsNW item={foundItem} type="found" />
				</View>
			</View>
		</View>
	);
}
