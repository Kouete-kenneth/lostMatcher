import React from "react";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";

interface SearchTemplateNWProps {
	title: string;
	showBackButton: boolean;
	onBackPress: () => void;
	scrollable: boolean;
	children: React.ReactNode;
}

const SearchTemplateNW = ({
	title,
	showBackButton,
	onBackPress,
	scrollable,
	children,
}: SearchTemplateNWProps) => {
	return (
		<ScreenTemplateNW
			title={title}
			showBackButton={showBackButton}
			onBackPress={onBackPress}
			contentClassName="px-0 py-0"
			scrollable={scrollable}>
			{children}
		</ScreenTemplateNW>
	);
};

export default SearchTemplateNW;
