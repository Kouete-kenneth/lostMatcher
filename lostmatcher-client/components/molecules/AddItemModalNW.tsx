import React from "react";
import { View, Modal, TouchableOpacity, Pressable } from "react-native";
import { cn } from "@/lib/utils";
import LabelNW from "@/components/atoms/LabelNW";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface AddItemModalProps {
	isVisible: boolean;
	onClose: () => void;
	onRegisterItem: () => void;
	onReportLost: () => void;
	onReportFound: () => void;
	className?: string;
}

const AddItemModalNW = ({
	isVisible,
	onClose,
	onRegisterItem,
	onReportLost,
	onReportFound,
	className,
}: AddItemModalProps) => {
	const modalButtons = [
		{
			title: "Register an Item",
			icon: "package-variant-closed",
			color: "#0A48AE",
			onPress: onRegisterItem,
		},
		{
			title: "Report Lost",
			icon: "alert-circle",
			color: "#3B82F6",
			onPress: onReportLost,
		},
		{
			title: "Report Found",
			icon: "check-circle",
			color: "#6B7280",
			onPress: onReportFound,
		},
		{
			title: "Close",
			icon: "close",
			color: "#EF4444",
			onPress: onClose,
		},
	];

	return (
		<Modal
			transparent={true}
			visible={isVisible}
			animationType="slide"
			onRequestClose={onClose}>
			{/* Backdrop */}
			<Pressable
				className="flex-1 bg-black/50 justify-end"
				onPress={onClose}>
				{/* Modal Content */}
				<Pressable onPress={() => {}}>
					<View
						className={cn(
							"bg-white rounded-t-3xl px-6 py-8 min-h-[300px]",
							"shadow-2xl",
							className
						)}>
						{/* Header */}
						<View className="items-center mb-8">
							<View className="w-12 h-1 bg-gray-300 rounded-full mb-6" />
							<LabelNW
								variant="headline"
								weight="semibold"
								className="text-charcoal-800 text-xl">
								Quick Actions
							</LabelNW>
						</View>

						{/* Action Buttons */}
						<View className="gap-3">
							{modalButtons.map((button, index) => (
								<TouchableOpacity
									key={index}
									onPress={button.onPress}
									className="flex-row items-center py-3 px-4 rounded-lg"
									style={{ backgroundColor: button.color }}>
									<View className="w-8 h-8 rounded-full items-center justify-center mr-3 bg-white/20">
										<MaterialCommunityIcons
											name={button.icon as any}
											size={18}
											color="white"
										/>
									</View>
									<LabelNW
										variant="body"
										weight="medium"
										className="text-white text-sm flex-1">
										{button.title}
									</LabelNW>
									<MaterialCommunityIcons
										name="chevron-right"
										size={16}
										color="white"
									/>
								</TouchableOpacity>
							))}
						</View>
					</View>
				</Pressable>
			</Pressable>
		</Modal>
	);
};

export default AddItemModalNW;
