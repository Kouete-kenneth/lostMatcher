import { cn } from "@/lib/utils";
import React from "react";
import { Image, View } from "react-native";
import LabelNW from "./LabelNW";

interface LogoProps {
	size?: "sm" | "md" | "lg";
	showText?: boolean;
	className?: string;
}

const sizeClasses = {
	sm: { width: 80, height: 80 },
	md: { width: 120, height: 120 },
	lg: { width: 160, height: 160 },
};

export default function Logo({
	size = "sm",
	showText = false,
	className,
}: LogoProps) {
	return (
		<View
			className={cn(className)}
			style={{
				alignItems: "center",
				justifyContent: "center",
				paddingVertical: 16,
				paddingHorizontal: 8,
			}}>
			<View
				style={[
					{
						backgroundColor: "transparent",
						borderRadius: 24,
						alignItems: "center",
						justifyContent: "center",
						marginBottom: showText ? 0 : 0,
					},
					sizeClasses[size],
				]}>
				<Image
					source={require("@/assets/images/logo_no_textbg.png")}
					style={{
						width: sizeClasses[size].width,
						height: sizeClasses[size].height,
						resizeMode: "contain",
					}}
				/>
			</View>
			{showText && (
				<LabelNW
					variant="subheading"
					weight="bold"
					className="text-text-secondary dark:text-primary-100 tracking-wide"
					style={{ textAlign: "center" }}>
					LostMatcher
				</LabelNW>
			)}
		</View>
	);
}
