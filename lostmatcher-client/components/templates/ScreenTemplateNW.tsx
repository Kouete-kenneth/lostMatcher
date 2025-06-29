import React from "react";
import {
	View,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";
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
	keyboardAvoiding?: boolean;
}

const ScreenTemplateNW = ({
	title,
	showBackButton = true,
	onBackPress,
	children,
	scrollable = true,
	contentClassName,
	headerClassName,
	keyboardAvoiding = false,
}: ScreenTemplateProps) => {
	const ContentContainer = scrollable ? ScrollView : View;

	const renderContent = () => {
		if (keyboardAvoiding) {
			if (Platform.OS === "android") {
				// For Android, use a simpler approach with just ScrollView and extra padding
				return (
					<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<View style={{ flex: 1 }}>
							<ContentContainer
								className={cn(
									"flex-1 bg-gray-50",
									contentClassName
								)}
								{...(scrollable && {
									contentContainerStyle: {
										paddingHorizontal: 16,
										paddingVertical: 24,
										paddingBottom: 400, // Very large bottom padding for Android
										flexGrow: 1,
									},
									keyboardShouldPersistTaps: "handled",
									showsVerticalScrollIndicator: false,
									nestedScrollEnabled: true,
									scrollEventThrottle: 16,
									keyboardDismissMode: "interactive",
								})}
								{...(!scrollable && {
									style: {
										paddingHorizontal: 16,
										paddingVertical: 24,
										flex: 1,
									},
								})}>
								{children}
							</ContentContainer>
						</View>
					</TouchableWithoutFeedback>
				);
			} else {
				// For iOS, use KeyboardAvoidingView
				return (
					<KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior="padding"
						keyboardVerticalOffset={64}
						enabled>
						<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
							<ContentContainer
								className={cn(
									"flex-1 bg-gray-50",
									contentClassName
								)}
								{...(scrollable && {
									contentContainerStyle: {
										paddingHorizontal: 16,
										paddingVertical: 24,
										paddingBottom: 200, // Extra padding for iOS
										flexGrow: 1,
									},
									keyboardShouldPersistTaps: "handled",
									showsVerticalScrollIndicator: false,
									automaticallyAdjustKeyboardInsets: true,
									scrollEventThrottle: 16,
								})}
								{...(!scrollable && {
									style: {
										paddingHorizontal: 16,
										paddingVertical: 24,
										flex: 1,
									},
								})}>
								{children}
							</ContentContainer>
						</TouchableWithoutFeedback>
					</KeyboardAvoidingView>
				);
			}
		}

		return (
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
		);
	};
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
			{renderContent()}
		</SafeAreaView>
	);
};

export default ScreenTemplateNW;
