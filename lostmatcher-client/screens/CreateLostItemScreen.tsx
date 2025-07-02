import React, { useCallback, useState } from "react";
// import { router } from 'expo-router';
import { IconButtonNW } from "@/components";
import { FormLayout } from "@/components/templates";

const formFields = [
	{
		key: "title",
		label: "Item Title",
		placeholder: "What did you lose?",
		required: true,
	},
	{
		key: "description",
		label: "Description",
		placeholder: "Describe the lost item in detail...",
		multiline: true,
		required: true,
	},
	{
		key: "location",
		label: "Last Known Location",
		placeholder: "Where did you last see it?",
		required: true,
	},
	{
		key: "contactEmail",
		label: "Contact Email",
		placeholder: "your.email@example.com",
		keyboardType: "email-address" as const,
		autoCapitalize: "none" as const,
		required: true,
	},
	{
		key: "contactPhone",
		label: "Contact Phone (Optional)",
		placeholder: "+1 (555) 123-4567",
		keyboardType: "phone-pad" as const,
	},
	{
		key: "reward",
		label: "Reward Amount (Optional)",
		placeholder: "$50",
		keyboardType: "numeric" as const,
	},
];

const CreateLostItemScreen: React.FC = () => {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		location: "",
		contactEmail: "",
		contactPhone: "",
		reward: "",
	});

	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [isLoading, setIsLoading] = useState(false);

	const handleFieldChange = useCallback(
		(key: string, value: string) => {
			setFormData((prev) => ({ ...prev, [key]: value }));
			// Clear error when user starts typing
			if (errors[key]) {
				setErrors((prev) => ({ ...prev, [key]: "" }));
			}
		},
		[errors]
	);

	const validateForm = useCallback(() => {
		const newErrors: { [key: string]: string } = {}; // Check required fields
		const requiredFields = formFields.filter((field) => field.required);
		requiredFields.forEach((field) => {
			const value = formData[field.key as keyof typeof formData];
			if (!value?.trim()) {
				newErrors[field.key] = `${field.label} is required`;
			}
		});

		// Validate email format
		if (
			formData.contactEmail &&
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)
		) {
			newErrors.contactEmail = "Please enter a valid email address";
		}

		// Validate title length
		if (formData.title && formData.title.length < 3) {
			newErrors.title = "Title must be at least 3 characters long";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	}, [formData]);

	const handleSubmit = useCallback(async () => {
		if (!validateForm()) {
			return;
		}

		setIsLoading(true);

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000));

			console.log("Lost item created:", formData);

			// Reset form
			setFormData({
				title: "",
				description: "",
				location: "",
				contactEmail: "",
				contactPhone: "",
				reward: "",
			});

			// Show success message or navigate back
			alert("Lost item posted successfully!");
			// router.back();
		} catch (error) {
			console.warn(
				"Error creating lost item (message only):",
				error instanceof Error ? error.message : "Unknown error"
			);
			alert("Failed to post lost item. Please try again.");
		} finally {
			setIsLoading(false);
		}
	}, [formData, validateForm]);

	const handleBack = useCallback(() => {
		// router.back();
		console.log("Navigate back");
	}, []);

	const renderRightActions = () => (
		<IconButtonNW
			name="help-circle-outline"
			size={24}
			onPress={() =>
				alert(
					"Fill out this form to report a lost item. Include as much detail as possible to help others identify and return your item."
				)
			}
		/>
	);

	return (
		<FormLayout
			title="Report Lost Item"
			subtitle="Help us help you find your lost item"
			showBack={true}
			onBackPress={handleBack}
			rightActions={renderRightActions()}
			formTitle="Item Details"
			fields={formFields}
			data={formData}
			errors={errors}
			onFieldChange={handleFieldChange}
			onSubmit={handleSubmit}
			submitButtonTitle="Post Lost Item"
			isLoading={isLoading}
		/>
	);
};

export default CreateLostItemScreen;
