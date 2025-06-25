import React from "react";
import { View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeaderNW from "@/components/molecules/ScreenHeaderNW";
import { cn } from "@/lib/utils";

interface ScreenTemplateProps {
	title: string;
	showBackButton?: boolean;
	onBackPress?: () => void;
	children: React.ReactNode;
	scrollable?: boolean;
	contentClassName?: string;
	headerClassName?: string;
}

const ScreenTemplateNW = ({
	title,
	showBackButton = true,
	onBackPress,
	children,
	scrollable = true,
	contentClassName,
	headerClassName,
}: ScreenTemplateProps) => {
	const ContentContainer = scrollable ? ScrollView : View;

	return (
		<SafeAreaView
			className="flex-1 bg-primary-500"
			edges={["left", "right"]}>
			{/* Header */}
			<ScreenHeaderNW
				title={title}
				showBackButton={showBackButton}
				onBackPress={onBackPress}
				className={headerClassName}
			/>

			{/* Content */}
			<ContentContainer
				className={cn("flex-1 bg-gray-50", contentClassName)}
				{...(scrollable && {
					contentContainerStyle: {
						paddingHorizontal: 16,
						paddingVertical: 24,
					},
				})}
				{...(!scrollable && {
					style: {
						paddingHorizontal: 16,
						paddingVertical: 24,
					},
				})}>
				{children}
			</ContentContainer>
		</SafeAreaView>
	);
};

export default ScreenTemplateNW;
