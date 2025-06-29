import LostItemsScreen from "@/screens/LostItemsScreen";
export default function Screen(props: any) {
	// Remove the default Expo Router header
	return <LostItemsScreen {...props} />;
}

export const options = { headerShown: false };
