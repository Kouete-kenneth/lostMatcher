import React from "react";
import { ViewStyle } from "react-native";
import { Form } from "../organisms";
import BaseLayout from "./BaseLayout";

interface FormData {
	[key: string]: string;
}

interface FormFieldConfig {
	key: string;
	label: string;
	placeholder?: string;
	required?: boolean;
	secureTextEntry?: boolean;
	multiline?: boolean;
	keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

interface FormLayoutProps {
	title: string;
	subtitle?: string;
	showBack?: boolean;
	onBackPress?: () => void;
	rightActions?: React.ReactNode;

	// Form specific props
	formTitle?: string;
	fields: FormFieldConfig[];
	data: FormData;
	errors?: { [key: string]: string };
	onFieldChange: (key: string, value: string) => void;
	onSubmit: () => void;
	submitButtonTitle?: string;
	isLoading?: boolean;

	style?: ViewStyle;
}

export default function FormLayout({
	title,
	subtitle,
	showBack = false,
	onBackPress,
	rightActions,
	formTitle,
	fields,
	data,
	errors,
	onFieldChange,
	onSubmit,
	submitButtonTitle,
	isLoading = false,
	style,
}: FormLayoutProps) {
	return (
		<BaseLayout
			title={title}
			subtitle={subtitle}
			showBack={showBack}
			onBackPress={onBackPress}
			rightActions={rightActions}
			style={style}>
			<Form
				title={formTitle}
				fields={fields}
				data={data}
				errors={errors}
				onFieldChange={onFieldChange}
				onSubmit={onSubmit}
				submitButtonTitle={submitButtonTitle}
				isLoading={isLoading}
			/>
		</BaseLayout>
	);
}
