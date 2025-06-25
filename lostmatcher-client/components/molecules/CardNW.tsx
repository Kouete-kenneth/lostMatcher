import { cn } from "@/lib/utils";
import React from "react";
import { View } from "react-native";
import ButtonNW from "../atoms/ButtonNW";
import IconButtonNW from "../atoms/IconButtonNW";
import LabelNW from "../atoms/LabelNW";

interface CardProps {
	title: string;
	subtitle?: string;
	onPress?: () => void;
	onMenuPress?: () => void;
	children?: React.ReactNode;
	className?: string;
}

export default function Card({
	title,
	subtitle,
	onPress,
	onMenuPress,
	children,
	className,
}: CardProps) {
	const containerClassName = cn(
		"bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100",
		className
	);

	return (
		<View className={containerClassName}>
			<View className="flex-row justify-between items-start mb-2">
				<View className="flex-1 pr-2">
					<LabelNW variant="subheading" weight="semibold">
						{title}
					</LabelNW>
					{subtitle && (
						<LabelNW variant="caption" color="secondary">
							{subtitle}
						</LabelNW>
					)}
				</View>

				{onMenuPress && (
					<IconButtonNW
						name="ellipsis-vertical"
						size={20}
						onPress={onMenuPress}
						variant="default"
					/>
				)}
			</View>

			{children && <View className="my-3">{children}</View>}

			{onPress && (
				<View className="mt-3 pt-3 border-t border-gray-100">
					<ButtonNW
						title="View Details"
						onPress={onPress}
						variant="outline"
						size="small"
					/>
				</View>
			)}
		</View>
	);
}
