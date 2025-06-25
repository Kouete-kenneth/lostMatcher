import React, { useState } from "react";
import { View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import LabelNW from "@/components/atoms/LabelNW";

const ReportFoundScreen = () => {
	const router = useRouter();
	const [formData, setFormData] = useState({
		itemName: "",
		description: "",
		category: "",
		foundLocation: "",
		dateFound: "",
		contactInfo: "",
		currentLocation: "",
	});

	const handleSubmit = () => {
		// Validate form
		if (
			!formData.itemName ||
			!formData.description ||
			!formData.foundLocation
		) {
			Alert.alert("Error", "Please fill in all required fields");
			return;
		}

		// TODO: Submit to API
		console.log("Report Found:", formData);
		Alert.alert("Success", "Found item reported successfully!", [
			{ text: "OK", onPress: () => router.back() },
		]);
	};

	const updateField = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	return (
		<ScreenTemplateNW
			title="Report Found Item"
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
					placeholder="Detailed description of the found item..."
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

			{/* Found Location */}
			<View className="mb-6">
				<LabelNW
					variant="body"
					weight="medium"
					className="text-charcoal-700 mb-2">
					Found Location *
				</LabelNW>
				<TextInput
					className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-charcoal-800"
					placeholder="Where did you find this item?"
					value={formData.foundLocation}
					onChangeText={(text) => updateField("foundLocation", text)}
				/>
			</View>

			{/* Date Found */}
			<View className="mb-6">
				<LabelNW
					variant="body"
					weight="medium"
					className="text-charcoal-700 mb-2">
					Date Found
				</LabelNW>
				<TextInput
					className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-charcoal-800"
					placeholder="YYYY-MM-DD"
					value={formData.dateFound}
					onChangeText={(text) => updateField("dateFound", text)}
				/>
			</View>

			{/* Current Location */}
			<View className="mb-6">
				<LabelNW
					variant="body"
					weight="medium"
					className="text-charcoal-700 mb-2">
					Current Location
				</LabelNW>
				<TextInput
					className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-charcoal-800"
					placeholder="Where is the item now?"
					value={formData.currentLocation}
					onChangeText={(text) =>
						updateField("currentLocation", text)
					}
				/>
			</View>

			{/* Contact Info */}
			<View className="mb-8">
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

			{/* Submit Button */}
			<TouchableOpacity
				onPress={handleSubmit}
				className="bg-gray-600 py-4 rounded-lg items-center"
				style={{ backgroundColor: "#6B7280" }}>
				<LabelNW
					variant="body"
					weight="semibold"
					className="text-white text-base">
					Report Found Item
				</LabelNW>
			</TouchableOpacity>
		</ScreenTemplateNW>
	);
};

export default ReportFoundScreen;
