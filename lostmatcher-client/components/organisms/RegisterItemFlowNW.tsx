import React, { useState } from "react";
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Alert,
	Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

// Import atomic and molecular components
import FormFieldNW from "@/components/atoms/FormFieldNW";
import ButtonNW from "@/components/atoms/ButtonNW";
import DropdownSelectorNW, {
	DropdownOption,
} from "@/components/molecules/DropdownSelectorNW";

interface RegisterItemFlowProps {
	onComplete: (data: any) => void;
	onCancel: () => void;
}

interface FormData {
	image: string | null;
	name: string;
	category: string;
	description: string;
	currentLocation: string;
	dateRegistered: Date;
	contactInfo: string;
	color: string;
	size: string;
	material: string;
	serialNumber: string;
	value: string;
}

const STEPS = [
	{ number: 1, name: "Image" },
	{ number: 2, name: "Details" },
	{ number: 3, name: "Registration" },
	{ number: 4, name: "Attributes" },
];

const SIZES = [
	{ value: "small", label: "Small", description: "Fits in palm of hand" },
	{ value: "medium", label: "Medium", description: "Fits in one hand" },
	{ value: "big", label: "Big", description: "Requires two hands" },
];

const MATERIALS = ["Plastic", "Metal", "Glass", "Wood", "Cloth"];

const COLORS = [
	"Black",
	"White",
	"Red",
	"Blue",
	"Green",
	"Yellow",
	"Orange",
	"Purple",
	"Pink",
	"Brown",
	"Gray",
];

// Dropdown options for the DropdownSelectorNW molecule
const CATEGORY_OPTIONS: DropdownOption[] = [
	{ value: "Document", label: "Document", icon: "document-text" },
	{ value: "Bag", label: "Bag", icon: "bag" },
	{ value: "Keys", label: "Keys", icon: "key" },
	{ value: "Electronics", label: "Electronics", icon: "phone-portrait" },
	{ value: "Jewelry", label: "Jewelry", icon: "diamond" },
	{ value: "Clothing", label: "Clothing", icon: "shirt" },
	{ value: "Book", label: "Book", icon: "book" },
	{ value: "Other", label: "Other", icon: "apps" },
];

const COLOR_OPTIONS: DropdownOption[] = COLORS.map((color) => ({
	value: color,
	label: color,
}));

const SIZE_OPTIONS: DropdownOption[] = SIZES.map((size) => ({
	value: size.value,
	label: size.label,
	description: size.description,
}));

const MATERIAL_OPTIONS: DropdownOption[] = MATERIALS.map((material) => ({
	value: material,
	label: material,
}));

export default function RegisterItemFlowNW({
	onComplete,
	onCancel,
}: RegisterItemFlowProps) {
	const [currentStep, setCurrentStep] = useState(1);
	const [expandedSection, setExpandedSection] = useState<number | null>(null);
	const [showDatePicker, setShowDatePicker] = useState(false);

	// Centralized dropdown state
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);

	const [formData, setFormData] = useState<FormData>({
		image: null,
		name: "",
		category: "",
		description: "",
		currentLocation: "",
		dateRegistered: new Date(),
		contactInfo: "",
		color: "",
		size: "",
		material: "",
		serialNumber: "",
		value: "",
	});

	// Update form data
	const updateFormData = (field: keyof FormData, value: any) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	// Reset form data to initial state
	const resetFormData = () => {
		setFormData({
			image: null,
			name: "",
			category: "",
			description: "",
			currentLocation: "",
			dateRegistered: new Date(),
			contactInfo: "",
			color: "",
			size: "",
			material: "",
			serialNumber: "",
			value: "",
		});
		setCurrentStep(1);
		setExpandedSection(null);
		closeAllDropdowns();
	};

	// Dropdown handlers
	const toggleDropdown = (dropdownId: string) => {
		setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
	};

	const closeAllDropdowns = () => {
		setOpenDropdown(null);
	};

	// Icon renderer for category dropdown
	const renderCategoryIcon = (
		option: DropdownOption,
		size = 20,
		color = "#374151"
	) => {
		return (
			<Ionicons
				name={option.icon as any}
				size={size}
				color={color}
				style={{ marginRight: 12 }}
			/>
		);
	};

	// Color indicator renderer for color dropdown
	const renderColorIndicator = (option: DropdownOption) => {
		const colorMap: { [key: string]: string } = {
			white: "#FFFFFF",
			black: "#000000",
			red: "#EF4444",
			blue: "#3B82F6",
			green: "#10B981",
			yellow: "#F59E0B",
			orange: "#F97316",
			purple: "#8B5CF6",
			pink: "#EC4899",
			brown: "#A3A3A3",
			gray: "#6B7280",
		};

		return (
			<View className="mr-3 w-6 items-center">
				<View
					className="w-4 h-4 rounded-full border border-gray-300"
					style={{
						backgroundColor:
							colorMap[option.value.toLowerCase()] || "#9CA3AF",
					}}
				/>
			</View>
		);
	};

	// Image picker functions
	const takePhoto = async () => {
		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 0.8,
		});

		if (!result.canceled && result.assets[0]) {
			updateFormData("image", result.assets[0].uri);
			handleNext();
		}
	};

	const selectFromGallery = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [4, 3],
			quality: 0.8,
		});

		if (!result.canceled && result.assets[0]) {
			updateFormData("image", result.assets[0].uri);
			handleNext();
		}
	};

	// Navigation functions
	const handleNext = () => {
		if (currentStep < 4) {
			const nextStep = currentStep + 1;
			setCurrentStep(nextStep);
			// Auto-expand the corresponding section
			if (nextStep === 2) setExpandedSection(1); // Details
			else if (nextStep === 3) setExpandedSection(2); // Registration
			else if (nextStep === 4) setExpandedSection(3); // Attributes
		}
	};

	const toggleSection = (sectionIndex: number) => {
		const wasExpanded = expandedSection === sectionIndex;
		setExpandedSection(wasExpanded ? null : sectionIndex);

		// Close all dropdowns when switching sections
		closeAllDropdowns();

		// Navigate to corresponding step when section is opened
		if (!wasExpanded) {
			if (sectionIndex === 1) setCurrentStep(2);
			else if (sectionIndex === 2) setCurrentStep(3);
			else if (sectionIndex === 3) setCurrentStep(4);
		}
	};

	// Validation functions for each step
	const isStep1Complete = () => {
		return !!formData.image;
	};

	const isStep2Complete = () => {
		return !!(formData.name && formData.category && formData.description);
	};

	const isStep3Complete = () => {
		return !!(formData.currentLocation && formData.contactInfo);
	};

	const isStep4Complete = () => {
		// Step 4 is complete if at least one optional attribute is filled
		return !!(
			formData.color ||
			formData.size ||
			formData.material ||
			formData.serialNumber ||
			formData.value
		);
	};

	const isStepComplete = (stepNumber: number) => {
		switch (stepNumber) {
			case 1:
				return isStep1Complete();
			case 2:
				return isStep2Complete();
			case 3:
				return isStep3Complete();
			case 4:
				return isStep4Complete();
			default:
				return false;
		}
	};

	// Validation
	const canProceed = () => {
		return (
			formData.image &&
			formData.name &&
			formData.category &&
			formData.description &&
			formData.currentLocation &&
			formData.contactInfo
		);
	};

	const handleSubmit = () => {
		if (canProceed()) {
			onComplete(formData);
			// Reset form after successful submission
			resetFormData();
		} else {
			Alert.alert(
				"Error",
				"Please complete steps 1-3 before submitting."
			);
		}
	};

	// Render step indicator
	const renderStepIndicator = () => (
		<View className="px-4 py-6">
			<View className="flex-row justify-between items-start relative">
				{/* Connecting lines */}
				<View
					className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0"
					style={{
						marginLeft: "12.5%", // Adjust to center between circles
						marginRight: "12.5%",
					}}
				/>

				{STEPS.map((step, index) => {
					const isCompleted = isStepComplete(step.number);
					const isCurrent = currentStep === step.number;
					const canNavigateTo =
						step.number <= currentStep || isCompleted;

					return (
						<TouchableOpacity
							key={step.number}
							className="items-center flex-1 relative z-10"
							onPress={() => {
								// Allow navigation to completed steps or current step
								if (canNavigateTo) {
									setCurrentStep(step.number);
									// Collapse any expanded sections when navigating
									setExpandedSection(null);
								}
							}}
							disabled={!canNavigateTo}>
							<View
								className={`w-8 h-8 rounded-full items-center justify-center mb-3 ${
									isCompleted
										? "bg-green-500"
										: isCurrent
										? "bg-blue-500"
										: canNavigateTo
										? "bg-gray-300"
										: "bg-gray-200"
								}`}>
								{isCompleted ? (
									<Ionicons
										name="checkmark"
										size={16}
										color="white"
									/>
								) : (
									<Text
										className={`text-xs font-semibold ${
											isCurrent
												? "text-white"
												: canNavigateTo
												? "text-gray-600"
												: "text-gray-400"
										}`}>
										{step.number}
									</Text>
								)}
							</View>
							<Text
								className={`text-xs text-center leading-tight ${
									isCompleted
										? "text-green-700 font-bold"
										: isCurrent
										? "text-blue-700 font-bold"
										: canNavigateTo
										? "text-gray-600 font-medium"
										: "text-gray-400 font-normal"
								}`}>
								{step.name}
							</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);

	// Render action sections
	const renderActionSections = () => {
		const sections = [
			{
				title: "Details",
				description: "Item name, category, description",
				fields: ["name", "category", "description"],
			},
			{
				title: "Registration",
				description: "Location, date, contact information",
				fields: ["currentLocation", "dateRegistered", "contactInfo"],
			},
			{
				title: "Optional Attributes",
				description: "Colour, size, material, serial, value",
				fields: ["color", "size", "material", "serialNumber", "value"],
			},
		];

		return (
			<View className="px-4">
				{sections.map((section, index) => {
					const sectionIndex = index + 1;
					const stepNumber = sectionIndex + 1; // Convert to actual step number (2, 3, 4)
					const isExpanded = expandedSection === sectionIndex;
					const isCurrentStep = currentStep === stepNumber;
					const isCompleted = isStepComplete(stepNumber);

					return (
						<TouchableOpacity
							key={sectionIndex}
							className={`mb-2 px-3 py-2 rounded-lg border relative ${
								isCompleted
									? "bg-green-50 border-green-200"
									: isExpanded || isCurrentStep
									? "bg-blue-50 border-blue-200"
									: "bg-white border-gray-200"
							}`}
							onPress={() => toggleSection(sectionIndex)}>
							<View className="flex-row items-start justify-between">
								<View className="flex-1 pr-3">
									<View className="flex-row items-center">
										<Text
											className={`text-lg font-semibold ${
												isCompleted
													? "text-green-700"
													: isExpanded ||
													  isCurrentStep
													? "text-blue-600"
													: "text-gray-900"
											}`}>
											{section.title}
										</Text>
										{isCompleted && (
											<View className="ml-2">
												<Ionicons
													name="checkmark-circle"
													size={18}
													color="#10B981"
												/>
											</View>
										)}
									</View>
									<Text className="text-sm text-gray-600 leading-relaxed">
										{section.description}
									</Text>
								</View>
								<View className="absolute top-2 right-3">
									<Ionicons
										name={
											isExpanded
												? "chevron-up"
												: "chevron-down"
										}
										size={20}
										color={
											isCompleted
												? "#10B981"
												: isExpanded || isCurrentStep
												? "#3B82F6"
												: "#6B7280"
										}
									/>
								</View>
							</View>
						</TouchableOpacity>
					);
				})}
			</View>
		);
	};

	// Render step content
	const renderStepContent = () => {
		if (currentStep === 1) {
			return (
				<View className="px-4 pb-6">
					<View className="mb-4">
						<Text className="text-sm text-gray-600 text-center">
							A photo is required to register your item for future
							identification
						</Text>
					</View>

					{!formData.image ? (
						<View className="flex-row gap-3">
							<TouchableOpacity
								className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-6 items-center"
								onPress={takePhoto}>
								<Ionicons
									name="camera"
									size={32}
									color="#6B7280"
								/>
								<Text className="text-sm font-medium text-gray-700 mt-2 text-center">
									Take Picture
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-6 items-center"
								onPress={selectFromGallery}>
								<Ionicons
									name="images"
									size={32}
									color="#6B7280"
								/>
								<Text className="text-sm font-medium text-gray-700 mt-2 text-center">
									Select from Gallery
								</Text>
							</TouchableOpacity>
						</View>
					) : (
						<View className="bg-gray-100 rounded-lg p-4 items-center">
							<Image
								source={{ uri: formData.image }}
								className="w-64 h-48 rounded-lg mb-4"
								resizeMode="cover"
							/>
							<Text className="text-sm text-green-700 text-center mb-3">
								✓ Photo added! This will help with item
								identification
							</Text>
							<View className="flex-row justify-center gap-6">
								<TouchableOpacity
									onPress={takePhoto}
									className="bg-blue-500 px-4 py-2 rounded-lg flex-row items-center">
									<Ionicons
										name="camera"
										size={16}
										color="white"
									/>
									<Text className="text-white font-medium ml-2">
										Retake
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={selectFromGallery}
									className="bg-gray-500 px-4 py-2 rounded-lg flex-row items-center">
									<Ionicons
										name="images"
										size={16}
										color="white"
									/>
									<Text className="text-white font-medium ml-2">
										Change
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}

					<ButtonNW
						title="Next"
						onPress={handleNext}
						disabled={!formData.image}
						className="mt-6"
					/>
				</View>
			);
		}

		// For steps 2-4, show form fields based on expanded section
		if (expandedSection === 1) {
			return (
				<>
					{renderDetailsForm()}
					<View className="mx-4 mb-6">
						<ButtonNW
							title="Next"
							onPress={handleNext}
							disabled={!isStep2Complete()}
							className=""
						/>
					</View>
				</>
			);
		} else if (expandedSection === 2) {
			return (
				<>
					{renderRegistrationForm()}
					<View className="mx-4 mb-6">
						<ButtonNW
							title="Next"
							onPress={handleNext}
							disabled={!isStep3Complete()}
							className=""
						/>
					</View>
				</>
			);
		} else if (expandedSection === 3) {
			return (
				<>
					{renderAttributesForm()}
					<View className="mx-4 mb-6">
						<ButtonNW
							title="Register Item"
							onPress={handleSubmit}
							disabled={!canProceed()}
							className=""
						/>
					</View>
				</>
			);
		}

		return null;
	};

	// Render form sections
	const renderDetailsForm = () => (
		<View className="mx-4 mb-6 rounded-lg border border-gray-200">
			<View className="px-4 py-6">
				<FormFieldNW
					label="Item Name *"
					value={formData.name}
					onChangeText={(text) => updateFormData("name", text)}
					placeholder="Enter item name"
					className="mb-4"
				/>

				<DropdownSelectorNW
					label="Category"
					value={formData.category}
					options={CATEGORY_OPTIONS}
					placeholder="Choose category"
					onSelect={(value) => updateFormData("category", value)}
					isOpen={openDropdown === "category"}
					onToggle={() => toggleDropdown("category")}
					allowCustom={formData.category === "Other"}
					customPlaceholder="Enter custom category"
					renderIcon={renderCategoryIcon}
					required
				/>

				<FormFieldNW
					label="Description *"
					value={formData.description}
					onChangeText={(text) => updateFormData("description", text)}
					placeholder="Describe the item"
					multiline
					numberOfLines={3}
					className="mb-4"
				/>
			</View>
		</View>
	);

	const renderRegistrationForm = () => (
		<View className="mx-4 mb-6 rounded-lg border border-gray-200">
			<View className="px-4 py-6">
				<FormFieldNW
					label="Current Location *"
					value={formData.currentLocation}
					onChangeText={(text) =>
						updateFormData("currentLocation", text)
					}
					placeholder="Where is the item currently located?"
					className="mb-4"
				/>

				<View className="mb-4">
					<Text className="text-sm font-medium text-gray-700 mb-2">
						Date Registered
					</Text>
					<TouchableOpacity
						className="border border-gray-100 rounded-lg p-3 bg-white flex-row items-center"
						onPress={() => setShowDatePicker(true)}>
						<Ionicons
							name="calendar"
							size={20}
							color="#6B7280"
							className="mr-3"
						/>
						<Text className="text-gray-900 flex-1">
							{formData.dateRegistered.toLocaleDateString()}
						</Text>
					</TouchableOpacity>
				</View>

				<FormFieldNW
					label="Contact Information *"
					value={formData.contactInfo}
					onChangeText={(text) => updateFormData("contactInfo", text)}
					placeholder="Email or phone number"
					className="mb-4"
				/>

				{showDatePicker && (
					<DateTimePicker
						value={formData.dateRegistered}
						mode="date"
						display="default"
						onChange={(event, selectedDate) => {
							setShowDatePicker(false);
							if (selectedDate) {
								updateFormData("dateRegistered", selectedDate);
							}
						}}
					/>
				)}
			</View>
		</View>
	);

	const renderAttributesForm = () => (
		<View className="mx-4 mb-6 rounded-lg border border-gray-200">
			<View className="px-4 py-6">
				<DropdownSelectorNW
					label="Color"
					value={formData.color}
					options={COLOR_OPTIONS}
					placeholder="Choose color"
					onSelect={(value) => updateFormData("color", value)}
					isOpen={openDropdown === "color"}
					onToggle={() => toggleDropdown("color")}
					allowCustom
					customPlaceholder="Enter custom color"
					renderIndicator={renderColorIndicator}
				/>

				<DropdownSelectorNW
					label="Size"
					value={formData.size}
					options={SIZE_OPTIONS}
					placeholder="Choose size"
					onSelect={(value) => updateFormData("size", value)}
					isOpen={openDropdown === "size"}
					onToggle={() => toggleDropdown("size")}
					allowCustom
					customPlaceholder="Enter custom size"
				/>

				<DropdownSelectorNW
					label="Material"
					value={formData.material}
					options={MATERIAL_OPTIONS}
					placeholder="Choose material"
					onSelect={(value) => updateFormData("material", value)}
					isOpen={openDropdown === "material"}
					onToggle={() => toggleDropdown("material")}
					allowCustom
					customPlaceholder="Enter custom material"
				/>

				<FormFieldNW
					label="Serial Number"
					value={formData.serialNumber}
					onChangeText={(text) =>
						updateFormData("serialNumber", text)
					}
					placeholder="Enter serial number (if applicable)"
					className="mb-4"
				/>

				<FormFieldNW
					label="Estimated Value"
					value={formData.value}
					onChangeText={(text) => updateFormData("value", text)}
					placeholder="Enter estimated value"
					className="mb-4"
					keyboardType="numeric"
				/>
			</View>
		</View>
	);

	return (
		<ScrollView className="flex-1 bg-white">
			{renderStepIndicator()}
			{currentStep > 1 && renderActionSections()}

			{/* Professional separator between action sections and form content */}
			{expandedSection && (
				<View className="mx-4 mt-4 mb-2">
					<View className="h-px bg-gray-200" />
				</View>
			)}

			{renderStepContent()}
		</ScrollView>
	);
}
