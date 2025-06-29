import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import DropdownSelectorNW from "@/components/molecules/DropdownSelectorNW";
import FormFieldNW from "@/components/atoms/FormFieldNW";
import ButtonNW from "@/components/atoms/ButtonNW";

const FEEDBACK_TYPES = [
	{ value: "bug", label: "Bug" },
	{ value: "feature", label: "Feature Request" },
	{ value: "improvement", label: "Improvement" },
	{ value: "other", label: "Other" },
];

type FeedbackForm = { type: string; message: string; email: string };
type FeedbackErrors = { type?: string; message?: string };
const initialForm: FeedbackForm = { type: "", message: "", email: "" };

export default function FeedbackFormOrganism({
	onSuccess,
}: {
	onSuccess: () => void;
}) {
	const [form, setForm] = useState<FeedbackForm>(initialForm);
	const [errors, setErrors] = useState<FeedbackErrors>({});
	const [submitting, setSubmitting] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const handleChange = (field: keyof FeedbackForm, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	const validate = (): FeedbackErrors => {
		const newErrors: FeedbackErrors = {};
		if (!form.type) newErrors.type = "Please select a type.";
		if (!form.message.trim()) newErrors.message = "Message required.";
		return newErrors;
	};

	const handleSubmit = async () => {
		const newErrors = validate();
		if (Object.keys(newErrors).length) {
			setErrors(newErrors);
			return;
		}
		setSubmitting(true);
		try {
			// TODO: Replace with your backend API call
			await new Promise((res) => setTimeout(res, 400));
			onSuccess();
		} catch {
			Alert.alert("Error", "Could not send feedback. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<View className="w-full max-w-md bg-white rounded-2xl shadow p-6">
			<Text className="text-xl font-bold text-gray-900 mb-6 text-center">
				Send us your feedback
			</Text>
			<View className="mb-5">
				<DropdownSelectorNW
					label="Type"
					value={form.type}
					options={FEEDBACK_TYPES}
					placeholder="Select type"
					onSelect={(v) => handleChange("type", v)}
					isOpen={dropdownOpen}
					onToggle={() => setDropdownOpen((o) => !o)}
				/>
				{errors.type ? (
					<Text className="text-xs text-red-500 mt-1">
						{errors.type}
					</Text>
				) : null}
			</View>
			<View className="mb-5">
				<FormFieldNW
					label="Message"
					value={form.message}
					onChangeText={(v) => handleChange("message", v)}
					placeholder="Type your feedback..."
					multiline
					numberOfLines={4}
				/>
				{errors.message ? (
					<Text className="text-xs text-red-500 mt-1">
						{errors.message}
					</Text>
				) : null}
			</View>
			<View className="mb-8">
				<FormFieldNW
					label="Email (optional)"
					value={form.email}
					onChangeText={(v) => handleChange("email", v)}
					placeholder="you@email.com"
					keyboardType="email-address"
					autoCapitalize="none"
				/>
			</View>
			<ButtonNW
				title={submitting ? "Submitting..." : "Submit Feedback"}
				onPress={handleSubmit}
				disabled={submitting}
				variant="primary"
				size="large"
				className="w-full"
			/>
		</View>
	);
}
