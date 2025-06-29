import { useState } from "react";
import {
	View,
	Text,
	Linking,
	TextInput,
	TouchableWithoutFeedback,
	Alert,
	TouchableOpacity,
	StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenTemplateNW } from "@/components";
import ButtonNW from "@/components/atoms/ButtonNW";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const FAQS = [
	{
		question: "How do I report a lost item?",
		answer: "Go to the Lost tab and fill out the form with your item's details.",
	},
	{
		question: "How do I claim a found item?",
		answer: "Browse found items and click 'Claim' on the item you believe is yours.",
	},
	{
		question: "How do I contact support?",
		answer: "You can email us directly at lostmatcher.project@gmail.com or use the form above.",
	},
	{
		question: "How long does it take to process a claim?",
		answer: "Claims are typically reviewed within 24-48 hours.",
	},
];

export default function SupportScreen() {
	const [message, setMessage] = useState("");
	const [sending, setSending] = useState(false);
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const router = useRouter();

	const handleSendMail = async () => {
		if (!message.trim()) {
			Alert.alert(
				"Message required",
				"Please enter your message before sending."
			);
			return;
		}
		setSending(true);
		try {
			const mailto = `mailto:lostmatcher.project@gmail.com?subject=Support%20Request&body=${encodeURIComponent(
				message
			)}`;
			await Linking.openURL(mailto);
			setMessage("");
		} catch {
			Alert.alert("Error", "Could not open mail client.");
		} finally {
			setSending(false);
		}
	};

	const renderFAQ = ({ item, index }: any) => {
		const isOpen = openIndex === index;
		return (
			<View
				style={[
					styles.faqContainer,
					isOpen ? styles.faqContainerOpen : null,
				]}>
				<TouchableOpacity
					onPress={() => setOpenIndex(isOpen ? null : index)}
					activeOpacity={0.85}
					accessibilityRole="button"
					accessibilityLabel={`FAQ: ${item.question}`}
					style={styles.faqHeader}>
					<Text style={styles.faqQuestion}>
						{item.question}
					</Text>
					<MaterialCommunityIcons
						name={isOpen ? "chevron-up" : "chevron-down"}
						size={28}
						color={isOpen ? "#2563eb" : "#64748b"}
					/>
				</TouchableOpacity>
				{isOpen && (
					<View style={styles.faqAnswerContainer}>
						<Text style={styles.faqAnswer}>
							{item.answer}
						</Text>
					</View>
				)}
			</View>
		);
	};

	return (
		<ScreenTemplateNW
			title="Support"
			showBackButton={true}
			onBackPress={() => router.back()}
			scrollable={true}
			contentClassName="">
			<View style={styles.screen}>
				{/* Contact Card */}
				<View style={styles.contactCard}>
					<MaterialCommunityIcons
						name="email-outline"
						size={32}
						color="#2563eb"
						style={styles.contactIcon}
					/>
					<Text style={styles.contactTitle}>
						Contact Support
					</Text>
					<Text style={styles.contactSubtitle}>
						We’re here to help! Email us directly at
					</Text>
					<TouchableWithoutFeedback
						onPress={() =>
							Linking.openURL(
								"mailto:lostmatcher.project@gmail.com"
							)
						}>
						<View style={styles.emailRow}>
							<MaterialCommunityIcons
								name="email"
								size={18}
								color="#2563eb"
							/>
							<Text style={styles.emailText}>
								lostmatcher.project@gmail.com
							</Text>
						</View>
					</TouchableWithoutFeedback>
					<TextInput
						style={styles.textInput}
						placeholder="Type your message..."
						value={message}
						onChangeText={setMessage}
						multiline
						numberOfLines={4}
						editable={!sending}
					/>
					<ButtonNW
						title={sending ? "Sending..." : "Send Email"}
						onPress={handleSendMail}
						disabled={sending}
						variant="primary"
						size="large"
						style={styles.button}
					/>
				</View>

				{/* Divider */}
				<View style={styles.divider} />

				{/* FAQ Section */}
				<Text style={styles.faqTitle}>
					Frequently Asked Questions
				</Text>
				{FAQS.map((item, index) => (
					<View key={index}>{renderFAQ({ item, index })}</View>
				))}
			</View>
		</ScreenTemplateNW>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: "#f9fafb",
		paddingHorizontal: 8,
		paddingVertical: 24,
	},
	contactCard: {
		backgroundColor: "#fff",
		borderRadius: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 2,
		padding: 24,
		marginBottom: 32,
		alignItems: "center",
	},
	contactIcon: {
		marginBottom: 8,
	},
	contactTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#111827",
		marginBottom: 4,
		textAlign: "center",
	},
	contactSubtitle: {
		fontSize: 16,
		color: "#374151",
		marginBottom: 12,
		textAlign: "center",
	},
	emailRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
	},
	emailText: {
		color: "#2563eb",
		textDecorationLine: "underline",
		marginLeft: 4,
		fontSize: 16,
	},
	textInput: {
		backgroundColor: "#f9fafb",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e5e7eb",
		padding: 16,
		marginBottom: 12,
		fontSize: 16,
		width: "100%",
	},
	button: {
		width: "100%",
	},
	divider: {
		height: 2,
		backgroundColor: "#e5e7eb",
		borderRadius: 999,
		marginBottom: 24,
	},
	faqTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#111827",
		marginBottom: 16,
		textAlign: "center",
	},
	faqContainer: {
		marginBottom: 16,
		borderRadius: 16,
		backgroundColor: "#f9fafb",
		borderWidth: 1,
		borderColor: "#e5e7eb",
	},
	faqContainerOpen: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 2,
	},
	faqHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 16,
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		minHeight: 56,
	},
	faqQuestion: {
		fontWeight: "600",
		color: "#111827",
		fontSize: 17,
		flex: 1,
	},
	faqAnswerContainer: {
		paddingHorizontal: 20,
		paddingBottom: 16,
		paddingTop: 8,
		backgroundColor: "#fff",
		borderBottomLeftRadius: 16,
		borderBottomRightRadius: 16,
	},
	faqAnswer: {
		color: "#374151",
		fontSize: 16,
		lineHeight: 22,
	},
});
