import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

const ONBOARDING_KEY = "hasCompletedOnboarding";

export function useOnboarding() {
	const { isAuthenticated, user, refreshUser } = useAuth();
	const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<
		boolean | null
	>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		checkOnboardingStatus();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated, user]);

	const checkOnboardingStatus = async () => {
		setIsLoading(true);
		try {
			if (isAuthenticated && user) {
				setHasCompletedOnboarding(!!user.onboardingComplete);
			} else {
				const value = await AsyncStorage.getItem(ONBOARDING_KEY);
				setHasCompletedOnboarding(value === "true");
			}
		} catch {
			setHasCompletedOnboarding(false);
		} finally {
			setIsLoading(false);
		}
	};

	const markOnboardingComplete = async () => {
		try {
			if (isAuthenticated) {
				await api.updateMe({ onboardingComplete: true });
				await refreshUser();
			} else {
				await AsyncStorage.setItem(ONBOARDING_KEY, "true");
			}
			setHasCompletedOnboarding(true);
		} catch {}
	};

	const resetOnboarding = async () => {
		try {
			await AsyncStorage.removeItem(ONBOARDING_KEY);
			setHasCompletedOnboarding(false);
		} catch {}
	};

	return {
		hasCompletedOnboarding,
		isLoading,
		markOnboardingComplete,
		resetOnboarding,
	};
}
