import React from "react";
import { View, Text } from "react-native";
import { cn } from "@/lib/utils";

interface MetricCardProps {
	title: string;
	value: string | number;
	className?: string;
}

const MetricCardNW = ({ title, value, className }: MetricCardProps) => {
	return (
		<View
			className={cn(
				"flex-1 border border-gray-200 rounded-md p-3 bg-white",
				className
			)}>
			<Text className="text-gray-500 text-sm mb-1">{title}</Text>
			<Text className="text-black text-xl font-medium">{value}</Text>
		</View>
	);
};

export default MetricCardNW;
