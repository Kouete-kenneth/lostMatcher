import React, { useState } from "react";
import { View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import LabelNW from "@/components/atoms/LabelNW";

const ReportLostScreen = () => {
	const router = useRouter();
	const [formData, setFormData] = useState({
		itemName: "",
		description: "",
		category: "",
		lastSeenLocation: "",
		dateLost: "",
		contactInfo: "",
		reward: "",
	});

	const handleSubmit = () => {
		// Validate form
		if (
			!formData.itemName ||
			!formData.description ||
			!formData.lastSeenLocation
		) {
			Alert.alert("Error", "Please fill in all required fields");
			return;
		}

		// TODO: Submit to API
		console.log("Report Lost:", formData);
		Alert.alert("Success", "Lost item reported successfully!", [
			{ text: "OK", onPress: () => router.back() },
		]);
	};

	const updateField = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<ScreenTemplateNW
			title="Report Lost Item"
			showBackButton={true}
			onBackPress={() => router.back()}>
			{/* Item Name */}
			<View className="mb-6">
				<LabelNW
					variant="body"
					weight="medium"
					className="text-charcoal-700 mb-2">
					Item Name *
				</LabelNW>
				<TextInput
					className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-charcoal-800"
					placeholder="e.g., iPhone 13, Blue Backpack"
					value={formData.itemName}
					onChangeText={(text) => updateField("itemName", text)}
				/>
			</View>

			{/* Description */}
			<View className="mb-6">
				<LabelNW
					variant="body"
					weight="medium"
					className="text-charcoal-700 mb-2">
					Description *
				</LabelNW>
				<TextInput
					className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-charcoal-800 h-24"
					placeholder="Detailed description of the lost item..."
					value={formData.description}
					onChangeText={(text) => updateField("description", text)}
					multiline
					textAlignVertical="top"
				/>
			</View>

			{/* Category */}
			<View className="mb-6">
				<LabelNW
					variant="body"
					weight="medium"
					className="text-charcoal-700 mb-2">
					Category
				</LabelNW>
				<TextInput
					className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-charcoal-800"
					placeholder="e.g., Electronics, Clothing, Documents"
					value={formData.category}
					onChangeText={(text) => updateField("category", text)}
				/>
			</View>

			{/* Last Seen Location */}
			<View className="mb-6">
				<LabelNW
					variant="body"
					weight="medium"
					className="text-charcoal-700 mb-2">
					Last Seen Location *
				</LabelNW>
				<TextInput
					className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-charcoal-800"
					placeholder="Where did you last see this item?"
					value={formData.lastSeenLocation}
					onChangeText={(text) =>
						updateField("lastSeenLocation", text)
					}
				/>
			</View>

			{/* Date Lost */}
			<View className="mb-6">
				<LabelNW
					variant="body"
					weight="medium"
					className="text-charcoal-700 mb-2">
					Date Lost
				</LabelNW>
				<TextInput
					className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-charcoal-800"
					placeholder="YYYY-MM-DD"
					value={formData.dateLost}
					onChangeText={(text) => updateField("dateLost", text)}
				/>
			</View>

			{/* Contact Info */}
			<View className="mb-6">
				<LabelNW
					variant="body"
					weight="medium"
					className="text-charcoal-700 mb-2">
					Contact Information
				</LabelNW>
				<TextInput
					className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-charcoal-800"
					placeholder="Email or phone number"
					value={formData.contactInfo}
					onChangeText={(text) => updateField("contactInfo", text)}
				/>
			</View>

			{/* Reward */}
			<View className="mb-8">
				<LabelNW
					variant="body"
					weight="medium"
					className="text-charcoal-700 mb-2">
					Reward (Optional)
				</LabelNW>
				<TextInput
					className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-charcoal-800"
					placeholder="Reward amount if any"
					value={formData.reward}
					onChangeText={(text) => updateField("reward", text)}
				/>
			</View>

			{/* Submit Button */}
			<TouchableOpacity
				onPress={handleSubmit}
				className="bg-blue-500 py-4 rounded-lg items-center"
				style={{ backgroundColor: "#3B82F6" }}>
				<LabelNW
					variant="body"
					weight="semibold"
					className="text-white text-base">
					Report Lost Item
				</LabelNW>
			</TouchableOpacity>
		</ScreenTemplateNW>
	);
};

export default ReportLostScreen;
