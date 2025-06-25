import { LabelNW } from "@/components/atoms";
import { Link, Stack } from "expo-router";
import { View } from "react-native";

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: "Oops!" }} />
			<View className="flex-1 items-center justify-center p-5">
				<LabelNW className="text-charcoal-700 mb-4">
					This screen does not exist.
				</LabelNW>
				<Link href="/" className="mt-4 py-4">
					<LabelNW className="text-primary-500 underline">
						Go to home screen!
					</LabelNW>
				</Link>
			</View>
		</>
	);
}
