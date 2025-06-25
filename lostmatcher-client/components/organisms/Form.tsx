import React from "react";
import { ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { Button, Label } from "../atoms";
import { FormField } from "../molecules";

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

interface FormProps {
	title?: string;
	fields: FormFieldConfig[];
	data: FormData;
	errors?: { [key: string]: string };
	onFieldChange: (key: string, value: string) => void;
	onSubmit: () => void;
	submitButtonTitle?: string;
	isLoading?: boolean;
	style?: ViewStyle;
}

export default function Form({
	title,
	fields,
	data,
	errors = {},
	onFieldChange,
	onSubmit,
	submitButtonTitle = "Submit",
	isLoading = false,
	style,
}: FormProps) {
	return (
		<ScrollView style={[styles.container, style]}>
			{title && (
				<View style={styles.titleContainer}>
					<Label variant="headline" weight="semibold">
						{title}
					</Label>
				</View>
			)}

			<View style={styles.fieldsContainer}>
				{fields.map((field) => (
					<FormField
						key={field.key}
						label={field.label}
						value={data[field.key] || ""}
						onChangeText={(value) =>
							onFieldChange(field.key, value)
						}
						placeholder={field.placeholder}
						required={field.required}
						error={errors[field.key]}
						secureTextEntry={field.secureTextEntry}
						multiline={field.multiline}
						keyboardType={field.keyboardType}
						autoCapitalize={field.autoCapitalize}
					/>
				))}
			</View>

			<View style={styles.submitContainer}>
				<Button
					title={isLoading ? "Loading..." : submitButtonTitle}
					onPress={onSubmit}
					disabled={isLoading}
					variant="primary"
					size="large"
				/>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	titleContainer: {
		marginBottom: 24,
		alignItems: "center",
	},
	fieldsContainer: {
		marginBottom: 24,
	},
	submitContainer: {
		marginBottom: 32,
	},
});
