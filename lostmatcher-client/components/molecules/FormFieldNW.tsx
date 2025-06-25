import { cn } from "@/lib/utils";
import React from "react";
import { View } from "react-native";
import InputNW from "../atoms/InputNW";
import LabelNW from "../atoms/LabelNW";

interface FormFieldProps {
	label: string;
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	required?: boolean;
	error?: string;
	secureTextEntry?: boolean;
	multiline?: boolean;
	keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	className?: string;
}

export default function FormField({
	label,
	value,
	onChangeText,
	placeholder,
	required = false,
	error,
	secureTextEntry = false,
	multiline = false,
	keyboardType = "default",
	autoCapitalize = "sentences",
	className,
}: FormFieldProps) {
	const containerClassName = cn("mb-4", className);

	return (
		<View className={containerClassName}>
			<View className="flex-row mb-1.5">
				<LabelNW variant="body" weight="medium">
					{label}
				</LabelNW>
				{required && (
					<LabelNW variant="body" color="error">
						{" *"}
					</LabelNW>
				)}
			</View>

			<InputNW
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				secureTextEntry={secureTextEntry}
				multiline={multiline}
				keyboardType={keyboardType}
				autoCapitalize={autoCapitalize}
				error={!!error}
				className={error ? "border-red-500" : ""}
			/>

			{error && (
				<LabelNW variant="caption" color="error" className="mt-1">
					{error}
				</LabelNW>
			)}
		</View>
	);
}
