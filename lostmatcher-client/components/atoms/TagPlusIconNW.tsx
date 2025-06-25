import React from "react";
import { View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface TagPlusIconProps {
	size?: number;
	color?: string;
}

const TagPlusIconNW = ({ size = 20, color = "white" }: TagPlusIconProps) => {
	return (
		<View
			className="relative items-center justify-center"
			style={{ width: size + 6, height: size + 6 }}>
			{/* Base Tag Icon */}
			<MaterialCommunityIcons
				name="tag-outline"
				size={size}
				color={color}
			/>

			{/* Plus Icon Overlay - positioned to intersect with the tag */}
			<View
				className="absolute bg-white rounded-full"
				style={{
					bottom: 2,
					left: 2,
					width: size * 0.5,
					height: size * 0.5,
					justifyContent: "center",
					alignItems: "center",
				}}>
				<MaterialCommunityIcons
					name="plus"
					size={size * 0.35}
					color="#22c55e" // green-500 color
				/>
			</View>
		</View>
	);
};

export default TagPlusIconNW;
