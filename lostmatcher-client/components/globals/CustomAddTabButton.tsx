import React from "react";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";

interface CustomAddTabButtonProps extends BottomTabBarButtonProps {
	onCustomPress?: () => void;
}

export function CustomAddTabButton({
	onCustomPress,
	...props
}: CustomAddTabButtonProps) {
	return (
		<PlatformPressable
			{...props}
			onPressIn={(ev) => {
				if (process.env.EXPO_OS === "ios") {
					// Add a soft haptic feedback when pressing down on the tabs.
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				}
				props.onPressIn?.(ev);
			}}
			onPress={(ev) => {
				// Always call our custom press handler first
				onCustomPress?.();

				// Then call the original onPress if it exists
				props.onPress?.(ev);
			}}
		/>
	);
}
