import MyRecoveredScreen from "@/screens/MyRecoveredScreen";
export default function Screen(props: any) {
	// Remove the default Expo Router header
	return <MyRecoveredScreen {...props} />;
}
