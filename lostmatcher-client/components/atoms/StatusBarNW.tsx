import { cn } from "@/lib/utils";
import React from "react";
import { View } from "react-native";
import LabelNW from "./LabelNW";

interface StatusBarProps {
    time?: string;
    className?: string;
}

export default function StatusBar({
    time = "9:41",
    className,
}: StatusBarProps) {
    return (
        <View
            className={cn(
                "flex-row items-center justify-between px-4 pt-5 pb-3 bg-[#2563EB]",
                className
            )}>
            
        </View>
    );
}
