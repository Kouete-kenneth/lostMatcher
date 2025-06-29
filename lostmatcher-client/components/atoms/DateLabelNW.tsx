import React from "react";
import { Text } from "react-native";

interface DateLabelProps {
	date: string;
}

export default function DateLabelNW({ date }: DateLabelProps) {
	const formatDate = (dateString: string) => {
		const dateObj = new Date(dateString);
		return dateObj.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<Text className="text-xs text-gray-500 mb-1">{formatDate(date)}</Text>
	);
}
