import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { cn } from "@/lib/utils";

interface FormFieldProps extends TextInputProps {
	label: string;
	error?: string;
	hint?: string;
	required?: boolean;
	containerClassName?: string;
	labelClassName?: string;
	inputClassName?: string;
}

export default function FormFieldNW({
	label,
	error,
	hint,
	required = false,
	containerClassName,
	labelClassName,
	inputClassName,
	...textInputProps
}: FormFieldProps) {
	return (
		<View className={cn("w-full", containerClassName)}>
			<Text
				className={cn(
					"text-sm font-medium text-gray-700 mb-2",
					labelClassName
				)}>
				{label}
				{required && <Text className="text-red-500 ml-1">*</Text>}
			</Text>

			<TextInput
				className={cn(
					"border border-gray-300 rounded-lg px-3 py-3 text-base bg-white",
					error && "border-red-500 bg-red-50",
					"focus:border-primary-500",
					inputClassName
				)}
				placeholderTextColor="#9CA3AF"
				{...textInputProps}
			/>

			{error && (
				<Text className="text-sm text-red-600 mt-1">{error}</Text>
			)}

			{hint && !error && (
				<Text className="text-sm text-gray-500 mt-1">{hint}</Text>
			)}
		</View>
	);
}
