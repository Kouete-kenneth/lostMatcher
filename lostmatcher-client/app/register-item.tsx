import RegisterItemScreen from "@/screens/RegisterItemScreen";

export default function Screen(props: any) {
	// Remove the default Expo Router header
	return <RegisterItemScreen {...props} />;
}

export const options = { headerShown: false };
