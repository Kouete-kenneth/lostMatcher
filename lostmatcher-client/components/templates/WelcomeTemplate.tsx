import WelcomeContentNW from "@/components/organisms/WelcomeContentNW";
import { cn } from "@/lib/utils";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, StyleSheet } from "react-native";

interface WelcomeTemplateProps {
    onGetStarted: () => void;
    className?: string;
}

export default function WelcomeTemplate({
    onGetStarted,
    className,
}: WelcomeTemplateProps) {
    return (
        <SafeAreaView
            style={styles.safeArea}
            className={cn("bg-white dark:bg-charcoal-900", className)}
            edges={["top", "left", "right", "bottom"]}
        >
            <View style={styles.container}>
                <WelcomeContentNW onGetStarted={onGetStarted} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 24,
    },
});
