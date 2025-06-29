import FoundItemsScreen from "@/screens/FoundItemsScreen";
export default function Screen(props: any) {
	// Remove the default Expo Router header
	return <FoundItemsScreen {...props} />;
}

export const options = { headerShown: false };
