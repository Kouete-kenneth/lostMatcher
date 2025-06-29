import React from "react";
import { Text } from "react-native";

interface TimeStampNWProps {
	timestamp: string;
	className?: string;
}

export default function TimeStampNW({
	timestamp,
	className = "",
}: TimeStampNWProps) {
	const formatTimeAgo = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInMs = now.getTime() - date.getTime();
		const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

		if (diffInMinutes < 1) {
			return "Just now";
		} else if (diffInMinutes < 60) {
			return `${diffInMinutes}m ago`;
		} else if (diffInHours < 24) {
			return `${diffInHours}h ago`;
		} else if (diffInDays < 7) {
			return `${diffInDays}d ago`;
		} else {
			return date.toLocaleDateString();
		}
	};

	return (
		<Text className={`text-xs text-gray-500 ${className}`}>
			{formatTimeAgo(timestamp)}
		</Text>
	);
}
