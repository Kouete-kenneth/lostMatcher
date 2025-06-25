import ButtonNW from "@/components/atoms/ButtonNW";
import IconButtonNW from "@/components/atoms/IconButtonNW";
import LabelNW from "@/components/atoms/LabelNW";
import CardNW from "@/components/molecules/CardNW";
import FormFieldNW from "@/components/molecules/FormFieldNW";
import SearchBarNW from "@/components/molecules/SearchBarNW";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

export default function NativeWindDemo() {
	const [searchValue, setSearchValue] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	return (
		<SafeAreaView className="flex-1 bg-background">
			<ScrollView className="flex-1 p-4">
				<View className="mb-6">
					<LabelNW
						variant="headline"
						weight="bold"
						className="mb-2 text-text-primary">
						Lost Matcher Design System
					</LabelNW>{" "}
					<LabelNW color="secondary" className="text-text-secondary">
						Showcasing the custom color palette and NativeWind
						components
					</LabelNW>
				</View>
				{/* Color Palette Section */}
				<View className="mb-6">
					<LabelNW
						variant="subheading"
						weight="semibold"
						className="mb-3 text-text-primary">
						Color Palette
					</LabelNW>
					<View className="flex-row flex-wrap gap-2 mb-4">
						<View className="bg-primary-500 p-3 rounded-lg min-w-[100px]">
							<LabelNW weight="medium" className="text-white">
								Primary Blue
							</LabelNW>
							<LabelNW variant="caption" className="text-white">
								#2563EB
							</LabelNW>
						</View>
						<View className="bg-charcoal-700 p-3 rounded-lg min-w-[100px]">
							<LabelNW weight="medium" className="text-white">
								Charcoal
							</LabelNW>
							<LabelNW variant="caption" className="text-white">
								#374151
							</LabelNW>
						</View>
						<View className="bg-slate-500 p-3 rounded-lg min-w-[100px]">
							<LabelNW weight="medium" className="text-white">
								Slate
							</LabelNW>
							<LabelNW variant="caption" className="text-white">
								#64748B
							</LabelNW>
						</View>
					</View>
					<View className="flex-row flex-wrap gap-2 mb-4">
						<View className="bg-accent-100 p-3 rounded-lg min-w-[100px] border border-accent-200">
							<LabelNW
								weight="medium"
								className="text-charcoal-700">
								Soft Yellow
							</LabelNW>
							<LabelNW
								variant="caption"
								className="text-charcoal-700">
								#FEF3C7
							</LabelNW>
						</View>
						<View className="bg-success-500 p-3 rounded-lg min-w-[100px]">
							<LabelNW weight="medium" className="text-white">
								Success
							</LabelNW>
							<LabelNW variant="caption" className="text-white">
								#10B981
							</LabelNW>
						</View>
						<View className="bg-error-500 p-3 rounded-lg min-w-[100px]">
							<LabelNW weight="medium" className="text-white">
								Error
							</LabelNW>
							<LabelNW variant="caption" className="text-white">
								#EF4444
							</LabelNW>
						</View>
					</View>
				</View>
				{/* Buttons Section */}
				<View className="mb-6">
					<LabelNW
						variant="subheading"
						weight="semibold"
						className="mb-3">
						Buttons
					</LabelNW>
					<View className="gap-3">
						<ButtonNW
							title="Primary Button"
							onPress={() => alert("Primary pressed!")}
							variant="primary"
						/>
						<ButtonNW
							title="Secondary Button"
							onPress={() => alert("Secondary pressed!")}
							variant="secondary"
						/>
						<ButtonNW
							title="Outline Button"
							onPress={() => alert("Outline pressed!")}
							variant="outline"
						/>
						<View className="flex-row gap-2">
							<ButtonNW
								title="Small"
								onPress={() => {}}
								size="small"
								className="flex-1"
							/>
							<ButtonNW
								title="Medium"
								onPress={() => {}}
								size="medium"
								className="flex-1"
							/>
							<ButtonNW
								title="Large"
								onPress={() => {}}
								size="large"
								className="flex-1"
							/>
						</View>
					</View>
				</View>
				{/* Icon Buttons */}
				<View className="mb-6">
					<LabelNW
						variant="subheading"
						weight="semibold"
						className="mb-3">
						Icon Buttons
					</LabelNW>
					<View className="flex-row gap-2">
						<IconButtonNW
							name="heart"
							onPress={() => {}}
							variant="filled"
						/>
						<IconButtonNW
							name="star"
							onPress={() => {}}
							variant="outline"
						/>
						<IconButtonNW
							name="share"
							onPress={() => {}}
							variant="default"
						/>
					</View>
				</View>
				{/* Search Bar */}
				<View className="mb-6">
					<LabelNW
						variant="subheading"
						weight="semibold"
						className="mb-3">
						Search Bar
					</LabelNW>
					<SearchBarNW
						value={searchValue}
						onChangeText={setSearchValue}
						onSearch={() => alert(`Searching: ${searchValue}`)}
						placeholder="Search for lost items..."
					/>
				</View>
				{/* Form Fields */}
				<View className="mb-6">
					<LabelNW
						variant="subheading"
						weight="semibold"
						className="mb-3">
						Form Fields
					</LabelNW>
					<FormFieldNW
						label="Email Address"
						value={email}
						onChangeText={setEmail}
						placeholder="Enter your email"
						keyboardType="email-address"
						autoCapitalize="none"
						required
					/>
					<FormFieldNW
						label="Password"
						value={password}
						onChangeText={setPassword}
						placeholder="Enter your password"
						secureTextEntry
						required
						error={
							password.length > 0 && password.length < 6
								? "Password must be at least 6 characters"
								: undefined
						}
					/>
				</View>
				{/* Cards */}
				<View className="mb-6">
					<LabelNW
						variant="subheading"
						weight="semibold"
						className="mb-3">
						Cards
					</LabelNW>
					<CardNW
						title="Lost iPhone 14 Pro"
						subtitle="Lost at Central Park"
						onPress={() => alert("Card pressed!")}
						onMenuPress={() => alert("Menu pressed!")}>
						<LabelNW className="text-gray-600">
							📍 Central Park, NYC
						</LabelNW>
						<LabelNW variant="caption" color="secondary">
							December 15, 2024
						</LabelNW>
						<View className="mt-2 px-2 py-1 bg-orange-100 rounded-full self-start">
							<LabelNW
								variant="caption"
								className="text-orange-700 font-medium">
								🔍 Looking
							</LabelNW>
						</View>
					</CardNW>

					<CardNW
						title="Found Wallet"
						subtitle="Brown leather wallet"
						onPress={() => alert("Card pressed!")}>
						<LabelNW className="text-gray-600">
							📍 Coffee Shop on Main St
						</LabelNW>
						<View className="mt-2 px-2 py-1 bg-green-100 rounded-full self-start">
							<LabelNW
								variant="caption"
								className="text-green-700 font-medium">
								✅ Found
							</LabelNW>
						</View>
					</CardNW>
				</View>
				{/* Typography */}
				<View className="mb-6">
					<LabelNW
						variant="subheading"
						weight="semibold"
						className="mb-3">
						Typography
					</LabelNW>
					<View className="gap-2">
						<LabelNW variant="headline" weight="bold">
							Headline Text
						</LabelNW>
						<LabelNW variant="subheading" weight="semibold">
							Subheading Text
						</LabelNW>
						<LabelNW variant="body">
							Body text for regular content
						</LabelNW>
						<LabelNW variant="caption" color="secondary">
							Caption text for secondary information
						</LabelNW>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}
