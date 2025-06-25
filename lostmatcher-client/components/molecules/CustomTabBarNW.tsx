import React from "react";
import { View } from "react-native";
import { cn } from "@/lib/utils";
import TabItemNW from "@/components/atoms/TabItemNW";

interface CustomTabBarProps {
	activeTab: number;
	onTabPress: (index: number) => void;
	className?: string;
}

const CustomTabBarNW = ({
	activeTab,
	onTabPress,
	className,
}: CustomTabBarProps) => {
	const tabs = [
		{ icon: "🏠", label: "Home" },
		{ icon: "🔍", label: "Search" },
		{ icon: "📋", label: "Claims" },
		{ icon: "💬", label: "Feedback" },
	];

	return (
		<View
			className={cn(
				"flex-row bg-white border-t border-gray-200 pt-2 pb-6",
				className
			)}>
			{tabs.map((tab, index) => (
				<TabItemNW
					key={index}
					icon={tab.icon}
					label={tab.label}
					isActive={activeTab === index}
					onPress={() => onTabPress(index)}
				/>
			))}
		</View>
	);
};

export default CustomTabBarNW;
