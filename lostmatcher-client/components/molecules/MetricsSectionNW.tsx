import React from "react";
import { View } from "react-native";
import { cn } from "@/lib/utils";
import MetricCardNW from "@/components/atoms/MetricCardNW";

interface MetricsSectionProps {
	className?: string;
}

const MetricsSectionNW = ({ className }: MetricsSectionProps) => {
	return (
		<View className={cn("px-3 mb-6", className)}>
			{/* First Row */}
			<View className="flex-row gap-2 mb-2">
				<MetricCardNW title="Total Claimed" value="3" />
				<MetricCardNW title="Approved Claims" value="2" />
			</View>

			{/* Second Row */}
			<View className="flex-row gap-2">
				<MetricCardNW title="Recovered Items" value="1" />
				<MetricCardNW title="Lost Reports" value="5" />
			</View>
		</View>
	);
};

export default MetricsSectionNW;
