import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { cn } from "@/lib/utils";

interface DateTimePickerFieldProps {
	label: string;
	value: Date;
	onChange: (date: Date) => void;
	mode: "date" | "time";
	error?: string;
	placeholder?: string;
	containerClassName?: string;
}

export default function DateTimePickerFieldNW({
	label,
	value,
	onChange,
	mode,
	error,
	placeholder,
	containerClassName,
}: DateTimePickerFieldProps) {
	const [showPicker, setShowPicker] = useState(false);

	const formatDate = (date: Date) => {
		if (mode === "date") {
			return date.toLocaleDateString();
		} else {
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		}
	};

	const handleChange = (event: any, selectedDate?: Date) => {
		setShowPicker(Platform.OS === "ios");
		if (selectedDate) {
			onChange(selectedDate);
		}
	};

	const getIcon = () => {
		return mode === "date" ? "calendar" : "time";
	};

	return (
		<View className={cn("w-full", containerClassName)}>
			<Text className="text-sm font-medium text-gray-700 mb-2">
				{label}
			</Text>

			<TouchableOpacity
				onPress={() => setShowPicker(true)}
				className={cn(
					"border border-gray-300 rounded-lg px-3 py-3 flex-row items-center justify-between bg-white",
					error && "border-red-500 bg-red-50"
				)}>
				<Text
					className={cn(
						"text-base",
						value ? "text-gray-900" : "text-gray-500"
					)}>
					{value ? formatDate(value) : placeholder}
				</Text>
				<Ionicons
					name={getIcon()}
					size={20}
					color={error ? "#EF4444" : "#6B7280"}
				/>
			</TouchableOpacity>

			{error && (
				<Text className="text-sm text-red-600 mt-1">{error}</Text>
			)}

			{showPicker && (
				<DateTimePicker
					value={value}
					mode={mode}
					is24Hour={true}
					display="default"
					onChange={handleChange}
				/>
			)}
		</View>
	);
}
