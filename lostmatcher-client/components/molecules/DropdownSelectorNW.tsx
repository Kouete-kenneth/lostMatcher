import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface DropdownOption {
	value: string;
	label: string;
	description?: string;
	icon?: string;
}

interface DropdownSelectorProps {
	label: string;
	value: string;
	options: DropdownOption[];
	placeholder: string;
	onSelect: (value: string) => void;
	isOpen: boolean;
	onToggle: () => void;
	allowCustom?: boolean;
	customPlaceholder?: string;
	renderIcon?: (
		option: DropdownOption,
		size?: number,
		color?: string
	) => React.ReactNode;
	renderIndicator?: (option: DropdownOption) => React.ReactNode;
	required?: boolean;
}

export default function DropdownSelectorNW({
	label,
	value,
	options,
	placeholder,
	onSelect,
	isOpen,
	onToggle,
	allowCustom = false,
	customPlaceholder = "Enter custom value",
	renderIcon,
	renderIndicator,
	required = false,
}: DropdownSelectorProps) {
	const [customValue, setCustomValue] = useState("");

	const selectedOption = options.find((opt) => opt.value === value);
	const isCustomValue = value && !selectedOption;

	const handleCustomSubmit = () => {
		if (customValue.trim()) {
			onSelect(customValue.trim());
			setCustomValue("");
			onToggle(); // Close dropdown
		}
	};

	return (
		<View className="mb-4">
			<Text className="text-sm font-medium text-gray-700 mb-2">
				{label} {required && "*"}
			</Text>

			{/* Main selector button */}
			<TouchableOpacity
				className={`border rounded-lg p-3 bg-white ${
					value ? "border-gray-100" : "border-gray-100"
				} ${isOpen ? "border-blue-500" : ""}`}
				onPress={onToggle}>
				<View className="flex-row items-center justify-between">
					<View className="flex-row items-center flex-1">
						{value ? (
							<>
								{renderIcon &&
									selectedOption &&
									renderIcon(selectedOption, 20, "#374151")}
								{renderIcon && isCustomValue && (
									<Ionicons
										name="create-outline"
										size={20}
										color="#374151"
										style={{ marginRight: 12 }}
									/>
								)}
								<Text className="text-base font-medium text-gray-900">
									{selectedOption?.label || value}
								</Text>
							</>
						) : (
							<Text className="text-base text-gray-500">
								{placeholder}
							</Text>
						)}
					</View>
					<Ionicons
						name={isOpen ? "chevron-up" : "chevron-down"}
						size={18}
						color="#6B7280"
					/>
				</View>
			</TouchableOpacity>

			{/* Dropdown options */}
			{isOpen && (
				<View className="mt-1 border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
					{options.map((option, index) => (
						<TouchableOpacity
							key={option.value}
							className={`flex-row items-center p-3 ${
								index !== options.length - 1
									? "border-b border-gray-100"
									: ""
							} ${value === option.value ? "bg-blue-50" : ""}`}
							onPress={() => {
								onSelect(option.value);
								onToggle(); // Close dropdown
							}}>
							{/* Icon */}
							{renderIcon && (
								<View className="mr-3 w-6 items-center">
									{renderIcon(option, 18, "#4B5563")}
								</View>
							)}

							{/* Label and description */}
							<View className="flex-1">
								<Text
									className={`text-base ${
										value === option.value
											? "text-blue-700 font-medium"
											: "text-gray-700"
									}`}>
									{option.label}
								</Text>
								{option.description && (
									<Text className="text-sm text-gray-600">
										{option.description}
									</Text>
								)}
							</View>

							{/* Custom indicator */}
							{renderIndicator && renderIndicator(option)}

							{/* Selected checkmark */}
							{value === option.value && (
								<Ionicons
									name="checkmark"
									size={18}
									color="#3B82F6"
								/>
							)}
						</TouchableOpacity>
					))}

					{/* Custom value input */}
					{allowCustom && (
						<View className="border-t border-gray-100 p-3">
							<Text className="text-sm font-medium text-gray-700 mb-2">
								Custom {label.toLowerCase()}:
							</Text>
							<View className="flex-row items-center">
								<TextInput
									className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
									placeholder={customPlaceholder}
									value={customValue}
									onChangeText={setCustomValue}
									onSubmitEditing={handleCustomSubmit}
									returnKeyType="done"
								/>
								<TouchableOpacity
									className={`ml-2 px-4 py-2 rounded-lg ${
										customValue.trim()
											? "bg-blue-600"
											: "bg-gray-300"
									}`}
									disabled={!customValue.trim()}
									onPress={handleCustomSubmit}>
									<Text
										className={`text-sm font-medium ${
											customValue.trim()
												? "text-white"
												: "text-gray-500"
										}`}>
										Save
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					)}
				</View>
			)}
		</View>
	);
}
