import { cn } from "@/lib/utils";
import React from "react";
import { TextInput, TextInputProps } from "react-native";

interface InputProps extends Omit<TextInputProps, "style"> {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
	secureTextEntry?: boolean;
	multiline?: boolean;
	error?: boolean;
	className?: string;
	style?: object;
}

export default function Input({
	value,
	onChangeText,
	placeholder,
	secureTextEntry = false,
	multiline = false,
	error = false,
	className,
	style,
	...rest
}: InputProps) {
	const baseClasses =
		"border rounded-lg px-3 py-2.5 text-base min-h-[44px] text-gray-900";

	const stateClasses = {
		default: "border-gray-300 bg-white",
		error: "border-red-500 bg-red-50",
		multiline: "min-h-[88px] align-top",
		disabled: "opacity-60 bg-gray-100",
	};

	const inputClassName = cn(
		baseClasses,
		error ? stateClasses.error : stateClasses.default,
		multiline && stateClasses.multiline,
		!rest.editable && stateClasses.disabled,
		className
	);

	return (
		<TextInput
			className={inputClassName}
			style={style}
			value={value}
			onChangeText={onChangeText}
			placeholder={placeholder}
			placeholderTextColor="#9CA3AF"
			secureTextEntry={secureTextEntry}
			multiline={multiline}
			textAlignVertical={multiline ? "top" : "center"}
			{...rest}
		/>
	);
}
