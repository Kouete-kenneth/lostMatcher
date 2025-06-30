import React from "react";
import { View } from "react-native";

export default function OnboardingStepIndicatorNW({
	total,
	current,
}: {
	total: number;
	current: number;
}) {
	return (
		<View
			style={{
				flexDirection: "row",
				justifyContent: "center",
				marginVertical: 12,
			}}>
			{Array.from({ length: total }).map((_, idx) => (
				<View
					key={idx}
					style={{
						width: 8,
						height: 8,
						borderRadius: 4,
						marginHorizontal: 4,
						backgroundColor:
							idx + 1 === current ? "#2563EB" : "#D1D5DB",
					}}
				/>
			))}
		</View>
	);
}
