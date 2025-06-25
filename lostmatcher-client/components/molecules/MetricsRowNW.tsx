import React from "react";
import { View } from "react-native";
import { cn } from "@/lib/utils";
import MetricCardNW from "@/components/atoms/MetricCardNW";

interface MetricsRowProps {
	className?: string;
}

const MetricsRowNW = ({ className }: MetricsRowProps) => {
	return (
		<View className={cn("flex-row gap-2", className)}>
			<MetricCardNW title="Total Claimed" value="3" />
			<MetricCardNW title="Approved Claims" value="2" />
		</View>
	);
};

export default MetricsRowNW;
