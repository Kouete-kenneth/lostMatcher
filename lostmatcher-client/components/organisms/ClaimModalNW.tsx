import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ClaimModalProps {
	visible: boolean;
	claimMessage: string;
	onClaimMessageChange: (text: string) => void;
	onClose: () => void;
	onSubmit: () => void;
}

export default function ClaimModalNW({
	visible,
	claimMessage,
	onClaimMessageChange,
	onClose,
	onSubmit,
}: ClaimModalProps) {
	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="pageSheet">
			<View className="flex-1 bg-white">
				{/* Modal Header */}
				<View className="bg-primary-500 px-4 py-4 flex-row items-center justify-between">
					<TouchableOpacity onPress={onClose}>
						<Ionicons name="close" size={24} color="white" />
					</TouchableOpacity>
					<Text className="text-white text-lg font-semibold">
						Claim Item
					</Text>
					<TouchableOpacity onPress={onSubmit}>
						<Text className="text-white text-base font-medium">
							Submit
						</Text>
					</TouchableOpacity>
				</View>

				{/* Modal Content */}
				<View className="flex-1 p-4">
					<Text className="text-lg font-semibold mb-2">
						Send a message to admin
					</Text>
					<Text className="text-gray-600 mb-4">
						Please provide any additional information that might
						help verify your ownership of this item.
					</Text>
					<TextInput
						className="border border-gray-300 rounded-lg p-3 h-32 text-base"
						placeholder="Describe any unique features, where you lost it, when you lost it, etc."
						multiline
						textAlignVertical="top"
						value={claimMessage}
						onChangeText={onClaimMessageChange}
					/>
				</View>
			</View>
		</Modal>
	);
}
