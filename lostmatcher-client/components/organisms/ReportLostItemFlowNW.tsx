import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

// Import atomic components
import StepIndicatorNW from "@/components/atoms/StepIndicatorNW";
import ImageUploadButtonNW from "@/components/atoms/ImageUploadButtonNW";
import FormFieldNW from "@/components/atoms/FormFieldNW";
import CategoryButtonNW from "@/components/atoms/CategoryButtonNW";
import DateTimePickerFieldNW from "@/components/atoms/DateTimePickerFieldNW";
import ButtonNW from "@/components/atoms/ButtonNW";

interface ReportLostItemFlowProps {
	onComplete: (data: any) => void;
	onCancel: () => void;
}

interface CustomField {
	key: string;
	value: string;
}

interface FormData {
	image: string | null;
	name: string;
	category: string;
	location: string;
	date: Date;
	time: Date;
	color: string;
	size: string;
	material: string;
	customFields: CustomField[];
}

const CATEGORIES = [
	"Electronics",
	"Jewelry",
	"Clothing",
	"Bags",
	"Books",
	"Keys",
	"Sports",
	"Toys",
	"Documents",
	"Other",
];

const STEPS = [
	"Upload Photo",
	"Item Details",
	"General Info",
	"Optional Attributes",
];

export default function ReportLostItemFlowNW({
	onComplete,
	onCancel,
}: ReportLostItemFlowProps) {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<FormData>({
		image: null,
		name: "",
		category: "",
		location: "",
		date: new Date(),
		time: new Date(),
		color: "",
		size: "",
		material: "",
		customFields: [],
	});
	const [errors, setErrors] = useState<Record<string, string>>({});

	// Update form data
	const updateFormData = (field: keyof FormData, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: "" }));
		}
	};

	// Image picker
	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled && result.assets[0]) {
			updateFormData("image", result.assets[0].uri);
		}
	};

	// Validation functions
	const validateStep = (step: number): boolean => {
		const newErrors: Record<string, string> = {};

		switch (step) {
			case 0: // Upload Photo
				if (!formData.image) {
					newErrors.image = "Please select an image";
				}
				break;
			case 1: // Item Details
				if (!formData.name.trim()) {
					newErrors.name = "Item name is required";
				}
				if (!formData.category) {
					newErrors.category = "Please select a category";
				}
				break;
			case 2: // General Info
				if (!formData.location.trim()) {
					newErrors.location = "Location is required";
				}
				break;
			case 3: // Optional Attributes
				// No required fields in this step
				break;
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Navigation functions
	const goToNextStep = () => {
		if (validateStep(currentStep)) {
			if (currentStep < STEPS.length - 1) {
				setCurrentStep(currentStep + 1);
			} else {
				handleSubmit();
			}
		}
	};

	const goToPreviousStep = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	// Submit function
	const handleSubmit = () => {
		Alert.alert(
			"Report Lost Item",
			"Are you sure you want to submit this lost item report?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Submit",
					onPress: () => onComplete(formData),
				},
			]
		);
	};

	// Custom field management
	const addCustomField = () => {
		const newField: CustomField = { key: "", value: "" };
		updateFormData("customFields", [...formData.customFields, newField]);
	};

	const updateCustomField = (
		index: number,
		field: "key" | "value",
		value: string
	) => {
		const updatedFields = formData.customFields.map((item, i) =>
			i === index ? { ...item, [field]: value } : item
		);
		updateFormData("customFields", updatedFields);
	};

	const removeCustomField = (index: number) => {
		const updatedFields = formData.customFields.filter(
			(_, i) => i !== index
		);
		updateFormData("customFields", updatedFields);
	};

	// Render step content
	const renderStepContent = () => {
		switch (currentStep) {
			case 0: // Upload Photo
				return (
					<View className="flex-1 px-4">
						<Text className="text-2xl font-bold text-gray-900 mb-2">
							Add a Photo
						</Text>
						<Text className="text-gray-600 mb-6">
							Upload a clear photo of the item you lost. This will
							help others identify it.
						</Text>
						<ImageUploadButtonNW
							imageUri={formData.image || undefined}
							onPress={pickImage}
							error={errors.image}
							label="Item Photo"
						/>
					</View>
				);

			case 1: // Item Details
				return (
					<View className="flex-1 px-4">
						<Text className="text-2xl font-bold text-gray-900 mb-2">
							Item Details
						</Text>
						<Text className="text-gray-600 mb-6">
							Provide basic information about the item.
						</Text>

						<FormFieldNW
							label="Item Name"
							value={formData.name}
							onChangeText={(text) =>
								updateFormData("name", text)
							}
							placeholder="e.g., iPhone 14, Black Wallet"
							error={errors.name}
							required
							containerClassName="mb-4"
						/>

						<Text className="text-sm font-medium text-gray-700 mb-3">
							Category <Text className="text-red-500">*</Text>
						</Text>
						<View className="flex-row flex-wrap gap-2 mb-4">
							{CATEGORIES.map((category) => (
								<CategoryButtonNW
									key={category}
									title={category}
									isSelected={formData.category === category}
									onPress={() =>
										updateFormData("category", category)
									}
									className="mb-2"
								/>
							))}
						</View>
						{errors.category && (
							<Text className="text-sm text-red-600 mb-4">
								{errors.category}
							</Text>
						)}
					</View>
				);

			case 2: // General Info
				return (
					<View className="flex-1 px-4">
						<Text className="text-2xl font-bold text-gray-900 mb-2">
							When & Where
						</Text>
						<Text className="text-gray-600 mb-6">
							Tell us when and where you lost this item.
						</Text>

						<FormFieldNW
							label="Location"
							value={formData.location}
							onChangeText={(text) =>
								updateFormData("location", text)
							}
							placeholder="e.g., Central Park, Coffee Shop on Main St"
							error={errors.location}
							required
							containerClassName="mb-4"
						/>

						<DateTimePickerFieldNW
							label="Date Lost"
							value={formData.date}
							onChange={(date) => updateFormData("date", date)}
							mode="date"
							placeholder="Select date"
							containerClassName="mb-4"
						/>

						<DateTimePickerFieldNW
							label="Time Lost (approximate)"
							value={formData.time}
							onChange={(time) => updateFormData("time", time)}
							mode="time"
							placeholder="Select time"
						/>
					</View>
				);

			case 3: // Optional Attributes
				return (
					<View className="flex-1 px-4">
						<Text className="text-2xl font-bold text-gray-900 mb-2">
							Additional Details
						</Text>
						<Text className="text-gray-600 mb-6">
							Add any additional details that might help identify
							your item.
						</Text>

						<FormFieldNW
							label="Color"
							value={formData.color}
							onChangeText={(text) =>
								updateFormData("color", text)
							}
							placeholder="e.g., Black, Blue, Red"
							containerClassName="mb-4"
						/>

						<FormFieldNW
							label="Size"
							value={formData.size}
							onChangeText={(text) =>
								updateFormData("size", text)
							}
							placeholder="e.g., Large, Medium, 6 inches"
							containerClassName="mb-4"
						/>

						<FormFieldNW
							label="Material"
							value={formData.material}
							onChangeText={(text) =>
								updateFormData("material", text)
							}
							placeholder="e.g., Leather, Metal, Plastic"
							containerClassName="mb-6"
						/>

						{/* Custom Fields */}
						<View className="mb-4">
							<View className="flex-row items-center justify-between mb-3">
								<Text className="text-sm font-medium text-gray-700">
									Custom Attributes
								</Text>
								<TouchableOpacity
									onPress={addCustomField}
									className="flex-row items-center">
									<Ionicons
										name="add"
										size={20}
										color="#3B82F6"
									/>
									<Text className="text-primary-500 font-medium ml-1">
										Add Field
									</Text>
								</TouchableOpacity>
							</View>

							{formData.customFields.map((field, index) => (
								<View
									key={index}
									className="flex-row items-center mb-3">
									<View className="flex-1 mr-2">
										<FormFieldNW
											label=""
											value={field.key}
											onChangeText={(text) =>
												updateCustomField(
													index,
													"key",
													text
												)
											}
											placeholder="Attribute name"
										/>
									</View>
									<View className="flex-1 mr-2">
										<FormFieldNW
											label=""
											value={field.value}
											onChangeText={(text) =>
												updateCustomField(
													index,
													"value",
													text
												)
											}
											placeholder="Value"
										/>
									</View>
									<TouchableOpacity
										onPress={() => removeCustomField(index)}
										className="p-2">
										<Ionicons
											name="trash"
											size={20}
											color="#EF4444"
										/>
									</TouchableOpacity>
								</View>
							))}
						</View>
					</View>
				);

			default:
				return null;
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* Header */}
			<View className="flex-row items-center justify-between px-4 py-2 border-b border-gray-200">
				<TouchableOpacity onPress={onCancel}>
					<Ionicons name="close" size={24} color="#374151" />
				</TouchableOpacity>
				<Text className="text-lg font-semibold text-gray-900">
					Report Lost Item
				</Text>
				<View style={{ width: 24 }} />
			</View>

			{/* Step Indicator */}
			<StepIndicatorNW
				currentStep={currentStep}
				totalSteps={STEPS.length}
				steps={STEPS}
			/>

			{/* Content */}
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				{renderStepContent()}
			</ScrollView>

			{/* Navigation Buttons */}
			<View className="px-4 py-4 border-t border-gray-200">
				<View className="flex-row gap-3">
					{currentStep > 0 && (
						<ButtonNW
							title="Back"
							onPress={goToPreviousStep}
							variant="outline"
							className="flex-1"
						/>
					)}
					<ButtonNW
						title={
							currentStep === STEPS.length - 1 ? "Submit" : "Next"
						}
						onPress={goToNextStep}
						variant="primary"
						className="flex-1"
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}
