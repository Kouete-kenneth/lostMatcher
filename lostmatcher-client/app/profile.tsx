import React, { useState, useRef, useEffect } from "react";
import {
	View,
	Text,
	Switch,
	Platform,
	TouchableOpacity,
	Modal,
	TextInput,
} from "react-native";
import Slider from "@react-native-community/slider";
import ScreenTemplateNW from "@/components/templates/ScreenTemplateNW";
import { cn } from "@/lib/utils";
import AvatarNW from "@/components/atoms/AvatarNW";
import { Colors } from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ProfileScreen = () => {
	// Settings state
	const [textThreshold, setTextThreshold] = useState(0.7);
	const [imageThreshold, setImageThreshold] = useState(0.7);
	const [periodicSearch, setPeriodicSearch] = useState(true);
	const [notifyOnMatch, setNotifyOnMatch] = useState(true);

	// Placeholder user info (replace with real data after login integration)
	const [userName, setUserName] = useState("Alice Taylor");
	const [userEmail, setUserEmail] = useState("alice.taylor@email.com");
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [editName, setEditName] = useState(userName);
	const [editEmail, setEditEmail] = useState(userEmail);
	const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const handleEditProfile = () => {
		if (!isMounted.current) return;
		setEditName(userName);
		setEditEmail(userEmail);
		setEditModalVisible(true);
	};

	const handleSaveProfile = () => {
		if (!isMounted.current) return;
		setUserName(editName);
		setUserEmail(editEmail);
		setEditModalVisible(false);
	};

	const pickAvatar = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: "images",
			allowsEditing: true,
			aspect: [1, 1],
			quality: 0.7,
		});
		if (!result.canceled && result.assets && result.assets.length > 0) {
			setAvatarUrl(result.assets[0].uri);
		}
	};

	return (
		<ScreenTemplateNW title="Profile & Settings" showBackButton={true}>
			{/* User Info Section */}
			<View className="flex-col items-center mb-6 mt-2">
				<View
					className="relative mb-3"
					style={{ width: 128, height: 128 }}>
					<TouchableOpacity
						onPress={pickAvatar}
						activeOpacity={0.8}
						style={{ width: 128, height: 128 }}>
						<AvatarNW
							size="lg"
							initials={userName
								.split(" ")
								.map((n) => n[0])
								.join("")
								.toUpperCase()}
							imageUrl={avatarUrl || undefined}
							className="border-4 border-primary-500 w-[128px] h-[128px]"
						/>
						<View
							style={{
								position: "absolute",
								bottom: 8,
								right: 8,
								backgroundColor: Colors.light.primary,
								borderRadius: 999,
								padding: 6,
								borderWidth: 2,
								borderColor: Colors.light.background,
								zIndex: 2,
							}}>
							<MaterialCommunityIcons
								name="camera"
								size={24}
								color={Colors.light.background}
							/>
						</View>
					</TouchableOpacity>
				</View>
				<View className="flex-row items-center w-full justify-center gap-4">
					<View className="flex-1 min-w-0">
						<Text
							className="text-xl font-bold"
							style={{ color: Colors.light.text }}
							numberOfLines={1}
							ellipsizeMode="tail">
							{userName}
						</Text>
						<Text
							className="text-base"
							style={{ color: Colors.light.icon }}
							numberOfLines={1}
							ellipsizeMode="tail">
							{userEmail}
						</Text>
					</View>
					<TouchableOpacity
						className="ml-2"
						style={{
							padding: 10,
							borderRadius: 999,
							backgroundColor: Colors.light.surface,
							alignItems: "center",
							justifyContent: "center",
						}}
						activeOpacity={0.8}
						onPress={handleEditProfile}
						accessibilityLabel="Edit profile">
						<MaterialCommunityIcons
							name="pencil"
							size={22}
							color={Colors.light.primary}
						/>
					</TouchableOpacity>
				</View>
			</View>

			{/* Edit Profile Modal */}
			<Modal
				visible={editModalVisible}
				animationType="slide"
				transparent
				onRequestClose={() => setEditModalVisible(false)}>
				<View className="flex-1 justify-center items-center bg-black/30">
					<View className="bg-white rounded-2xl p-6 w-11/12 max-w-md shadow-lg">
						<Text className="text-lg font-bold mb-4 text-primary-500">
							Edit Profile
						</Text>
						<Text className="text-xs text-gray-500 mb-1">Name</Text>
						<TextInput
							value={editName}
							onChangeText={setEditName}
							className="border border-gray-200 rounded px-3 py-2 mb-3 text-base"
							placeholder="Your Name"
							style={{ color: Colors.light.text }}
						/>
						<Text className="text-xs text-gray-500 mb-1">
							Email
						</Text>
						<TextInput
							value={editEmail}
							onChangeText={setEditEmail}
							className="border border-gray-200 rounded px-3 py-2 mb-4 text-base"
							placeholder="Your Email"
							keyboardType="email-address"
							style={{ color: Colors.light.text }}
						/>
						<View className="flex-row justify-end">
							<TouchableOpacity
								className="mr-2 px-4 py-2"
								style={{
									backgroundColor: Colors.light.surface,
									borderRadius: 6,
								}}
								onPress={() => setEditModalVisible(false)}>
								<Text className="text-gray-700 font-medium">
									Cancel
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								className="px-4 py-2"
								style={{
									backgroundColor: Colors.light.primary,
									borderRadius: 6,
								}}
								onPress={handleSaveProfile}>
								<Text className="text-white font-medium">
									Save
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>

			{/* Settings Section */}
			<Text
				className="text-lg font-semibold mb-2 mt-2"
				style={{ color: Colors.light.text }}>
				Matching Thresholds
			</Text>
			<View className="bg-white rounded-2xl shadow p-6 mb-6">
				<View className="mb-4">
					<Text
						className="text-base mb-1"
						style={{ color: Colors.light.icon }}>
						Text Match Threshold:{" "}
						<Text
							className="font-bold"
							style={{ color: Colors.light.primary }}>
							{(textThreshold * 100).toFixed(0)}%
						</Text>
					</Text>
					<Slider
						style={{ width: "100%", height: 40 }}
						minimumValue={0.5}
						maximumValue={1}
						step={0.01}
						value={textThreshold}
						onValueChange={setTextThreshold}
						minimumTrackTintColor={Colors.light.primary}
						maximumTrackTintColor={Colors.light.surface}
						thumbTintColor={
							Platform.OS === "android"
								? Colors.light.primary
								: undefined
						}
					/>
				</View>
				<View>
					<Text
						className="text-base mb-1"
						style={{ color: Colors.light.icon }}>
						Image Match Threshold:{" "}
						<Text
							className="font-bold"
							style={{ color: Colors.light.primary }}>
							{(imageThreshold * 100).toFixed(0)}%
						</Text>
					</Text>
					<Slider
						style={{ width: "100%", height: 40 }}
						minimumValue={0.5}
						maximumValue={1}
						step={0.01}
						value={imageThreshold}
						onValueChange={setImageThreshold}
						minimumTrackTintColor={Colors.light.accent}
						maximumTrackTintColor={Colors.light.surface}
						thumbTintColor={
							Platform.OS === "android"
								? Colors.light.accent
								: undefined
						}
					/>
				</View>
			</View>
			<Text
				className="text-lg font-semibold mb-2"
				style={{ color: Colors.light.text }}>
				Preferences
			</Text>
			<View className="bg-white rounded-2xl shadow p-6 mb-6">
				<View className="flex-row items-center justify-between mb-4">
					<Text
						className="text-base"
						style={{ color: Colors.light.icon }}>
						Periodic Search on Lost Items
					</Text>
					<Switch
						value={periodicSearch}
						onValueChange={setPeriodicSearch}
						trackColor={{
							false: Colors.light.surface,
							true: Colors.light.primary,
						}}
						thumbColor={
							periodicSearch
								? Colors.light.primary
								: Colors.light.surface
						}
					/>
				</View>
				<View className="flex-row items-center justify-between">
					<Text
						className="text-base"
						style={{ color: Colors.light.icon }}>
						Notify on Potential Match
					</Text>
					<Switch
						value={notifyOnMatch}
						onValueChange={setNotifyOnMatch}
						trackColor={{
							false: Colors.light.surface,
							true: Colors.light.accent,
						}}
						thumbColor={
							notifyOnMatch
								? Colors.light.accent
								: Colors.light.surface
						}
					/>
				</View>
			</View>
			<View className="items-center mt-8">
				<Text className="text-xs" style={{ color: Colors.light.icon }}>
					LostMatcher v1.0
				</Text>
			</View>
		</ScreenTemplateNW>
	);
};

export default ProfileScreen;
