import React from "react";
import { View } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface MagnifierMinusIconProps {
	size?: number;
	color?: string;
}

const MagnifierMinusIconNW = ({
	size = 20,
	color = "white",
}: MagnifierMinusIconProps) => {
	return (
		<View
			className="relative items-center justify-center"
			style={{ width: size, height: size }}>
			{/* Base Magnifier Icon */}
			<MaterialIcons name="search" size={size} color={color} />

			{/* Minus Icon Overlay - positioned in the center of the magnifier lens */}
			<View
				className="absolute"
				style={{
					top: size * 0.15,
					left: size * 0.15,
					width: size * 0.5,
					height: size * 0.5,
					justifyContent: "center",
					alignItems: "center",
				}}>
				<MaterialIcons name="remove" size={size * 0.35} color={color} />
			</View>
		</View>
	);
};

export default MagnifierMinusIconNW;
