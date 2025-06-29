import React from "react";
import { View, TouchableOpacity, Text, ScrollView } from "react-native";

interface NotificationFiltersNWProps {
	activeFilter: "all" | "unread" | "match" | "claim" | "system";
	onFilterChange: (
		filter: "all" | "unread" | "match" | "claim" | "system"
	) => void;
	counts: {
		all: number;
		unread: number;
		match: number;
		claim: number;
		system: number;
	};
}

export default function NotificationFiltersNW({
	activeFilter,
	onFilterChange,
	counts,
}: NotificationFiltersNWProps) {
	const filters = [
		{ key: "all" as const, label: "All", count: counts.all },
		{ key: "unread" as const, label: "Unread", count: counts.unread },
		{ key: "match" as const, label: "Matches", count: counts.match },
		{ key: "claim" as const, label: "Claims", count: counts.claim },
		{ key: "system" as const, label: "System", count: counts.system },
	];

	return (
		<View className="bg-white border-b border-gray-200">
			<ScrollView
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: 16,
					paddingVertical: 8,
				}}
				className="flex-row">
				{filters.map((filter, index) => (
					<TouchableOpacity
						key={filter.key}
						onPress={() => onFilterChange(filter.key)}
						className={`${
							index < filters.length - 1 ? "mr-3" : ""
						} py-2 px-3 rounded-full border ${
							activeFilter === filter.key
								? "bg-primary-500 border-primary-500"
								: "bg-white border-gray-300"
						}`}>
						<View className="flex-row items-center">
							<Text
								className={`text-sm font-medium whitespace-nowrap ${
									activeFilter === filter.key
										? "text-white"
										: "text-gray-700"
								}`}>
								{filter.label}
							</Text>
							{filter.count > 0 && (
								<View
									className={`ml-1 px-1.5 py-0.5 rounded-full ${
										activeFilter === filter.key
											? "bg-white"
											: "bg-gray-100"
									}`}>
									<Text
										className={`text-xs font-medium ${
											activeFilter === filter.key
												? "text-primary-500"
												: "text-gray-600"
										}`}>
										{filter.count}
									</Text>
								</View>
							)}
						</View>
					</TouchableOpacity>
				))}
			</ScrollView>
		</View>
	);
}
