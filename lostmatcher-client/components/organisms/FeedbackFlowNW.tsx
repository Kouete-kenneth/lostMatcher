import React, { useState } from "react";
import { View, Text } from "react-native";
import DropdownSelectorNW from "@/components/molecules/DropdownSelectorNW";
import FormFieldNW from "@/components/atoms/FormFieldNW";
import ButtonNW from "@/components/atoms/ButtonNW";

interface FeedbackFlowProps {
	onSubmit: (data: FeedbackData) => void;
}

interface FeedbackData {
	type: string;
	message: string;
	email: string;
}

const FEEDBACK_TYPES = [
	{ value: "bug", label: "Bug" },
	{ value: "feature", label: "Feature Request" },
	{ value: "improvement", label: "Improvement" },
	{ value: "other", label: "Other" },
];

const FeedbackFlowNW = ({ onSubmit }: FeedbackFlowProps) => {
	const [form, setForm] = useState<FeedbackData>({
		type: "",
		message: "",
		email: "",
	});
	const [errors, setErrors] = useState<{ [k: string]: string }>({});
	const [submitting, setSubmitting] = useState(false);

	const handleChange = (field: keyof FeedbackData, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: "" }));
	};

	const validate = () => {
		const newErrors: { [k: string]: string } = {};
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
		await new Promise((res) => setTimeout(res, 300));
		onSubmit(form);
		setSubmitting(false);
	};

	return (
		<View className="w-full max-w-md mx-auto py-8 px-4">
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
					isOpen={false}
					onToggle={() => {}}
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
};

export default FeedbackFlowNW;
