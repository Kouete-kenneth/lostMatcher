import { cn } from "@/lib/utils";
import React from "react";
import { View } from "react-native";
import ButtonNW from "../atoms/ButtonNW";
import InputNW from "../atoms/InputNW";

interface SearchBarProps {
	value: string;
	onChangeText: (text: string) => void;
	onSearch: () => void;
	placeholder?: string;
	searchButtonTitle?: string;
	className?: string;
}

export default function SearchBar({
	value,
	onChangeText,
	onSearch,
	placeholder = "Search...",
	searchButtonTitle = "Search",
	className,
}: SearchBarProps) {
	const containerClassName = cn("flex-row items-center gap-2", className);

	return (
		<View className={containerClassName}>
			<View className="flex-1">
				<InputNW
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					className="mb-0"
				/>
			</View>
			<ButtonNW
				title={searchButtonTitle}
				onPress={onSearch}
				size="medium"
				variant="primary"
				className="px-5"
			/>
		</View>
	);
}
