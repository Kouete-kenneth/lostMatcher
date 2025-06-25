import React, { useState } from "react";
import { View, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import LabelNW from "@/components/atoms/LabelNW";

const RegisterItemScreen = () => {
	const router = useRouter();
	const [formData, setFormData] = useState({
		itemName: "",
		description: "",
		category: "",
		location: "",
		dateRegistered: "",
		contactInfo: "",
	});

	const handleSubmit = () => {
		// Validate form
		if (!formData.itemName || !formData.description || !formData.category) {
			Alert.alert("Error", "Please fill in all required fields");
			return;
		}

		// TODO: Submit to API
		console.log("Register Item:", formData);
		Alert.alert("Success", "Item registered successfully!", [
			{ text: "OK", onPress: () => router.back() },
		]);
	};

	const updateField = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};
	return (
		<ScreenTemplateNW
			title="Register an Item"
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
					placeholder="Detailed description of the item..."
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
					Category *
				</LabelNW>
				<TextInput
					className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-charcoal-800"
					placeholder="e.g., Electronics, Clothing, Documents"
					value={formData.category}
					onChangeText={(text) => updateField("category", text)}
				/>
			</View>

			{/* Location */}
			<View className="mb-6">
				<LabelNW
					variant="body"
					weight="medium"
					className="text-charcoal-700 mb-2">
					Current Location
				</LabelNW>
				<TextInput
					className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-charcoal-800"
					placeholder="Where is the item currently located?"
					value={formData.location}
					onChangeText={(text) => updateField("location", text)}
				/>
			</View>

			{/* Date Registered */}
			<View className="mb-6">
				<LabelNW
					variant="body"
					weight="medium"
					className="text-charcoal-700 mb-2">
					Date Registered
				</LabelNW>
				<TextInput
					className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-charcoal-800"
					placeholder="YYYY-MM-DD"
					value={formData.dateRegistered}
					onChangeText={(text) => updateField("dateRegistered", text)}
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
				className="bg-blue-600 py-4 rounded-lg items-center"
				style={{ backgroundColor: "#0A48AE" }}>
				<LabelNW
					variant="body"
					weight="semibold"
					className="text-white text-base">
					Register Item
				</LabelNW>
			</TouchableOpacity>
		</ScreenTemplateNW>
	);
};

export default RegisterItemScreen;
