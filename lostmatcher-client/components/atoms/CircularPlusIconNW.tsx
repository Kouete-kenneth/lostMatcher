import React from "react";
import { View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface CircularPlusIconProps {
	size?: number;
	color?: string;
	focused?: boolean;
	isHomeActive?: boolean;
}

const CircularPlusIconNW = ({
	size = 40,
	color = "#6B7280", // Default inactive color
	focused = false,
	isHomeActive = false,
}: CircularPlusIconProps) => {
	// Determine the icon color based on the current state
	let iconColor: string;

	if (isHomeActive) {
		// When Home tab is selected, always show yellow regardless of focus state
		iconColor = "#FACC15";
	} else {
		// Use normal tab behavior - focused state determines color
		iconColor = focused ? color : "#9CA3AF";
	}

	return (
		<View
			className="rounded-full items-center justify-center"
			style={{
				width: size,
				height: size,
				backgroundColor: "transparent",
				borderWidth: 2,
				borderColor: iconColor,
				marginTop: 4,
			}}>
			<MaterialCommunityIcons
				name="plus"
				size={size * 0.6}
				color={iconColor}
			/>
		</View>
	);
};

export default CircularPlusIconNW;
