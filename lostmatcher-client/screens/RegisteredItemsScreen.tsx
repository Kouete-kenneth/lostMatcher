import React from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import RegisteredItemsListNW from "@/components/molecules/RegisteredItemsListNW";

const mockItems = [
    {
        id: "1",
        name: "Wallet",
        description: "Black leather wallet",
        imageUri: "https://example.com/wallet.jpg",
    },
    {
        id: "2",
        name: "Keys",
        description: "Bunch of house keys",
        imageUri: "https://example.com/keys.jpg",
    },
];

const RegisteredItemsScreen = () => {
    const router = useRouter();

    const handleAddNewItem = () => {
        // Navigate to register item flow or show a modal
        router.push("/register-item");
    };

    const handleSearchItem = (itemId: string) => {
        Alert.alert("Search", `Searching for item with ID: ${itemId}`);
        // Implement search logic or navigation here
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <ScreenTemplateNW
            title="Registered Items"
            showBackButton={true}
            onBackPress={handleCancel}
            keyboardAvoiding={true}
            contentClassName="px-0 py-0 bg-gray-50"
        >
            <RegisteredItemsListNW
                items={mockItems}
                onAddNewItem={handleAddNewItem}
                onSearchItem={handleSearchItem}
            />
        </ScreenTemplateNW>
    );
};

export default RegisteredItemsScreen;
