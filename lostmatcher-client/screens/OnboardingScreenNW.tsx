import React, { useState } from "react";
import { useRouter } from "expo-router";
import { onboardingSteps } from "@/constants/onboardingData";
import OnboardingSlideNW from "@/components/templates/OnboardingSlideNW";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAuth } from "@/contexts/AuthContext";

export default function OnboardingScreenNW() {
	const [currentStep, setCurrentStep] = useState(1);
	const router = useRouter();
	const { markOnboardingComplete } = useOnboarding();
	const { isAuthenticated } = useAuth();

	const handleNext = () => {
		if (currentStep < onboardingSteps.length) {
			setCurrentStep(currentStep + 1);
		} else {
			handleFinish();
		}
	};

	const handleSkip = () => handleFinish();

	const handleFinish = async () => {
		await markOnboardingComplete();
		if (isAuthenticated) {
			router.replace("/(tabs)"); // Go to home if logged in
		} else {
			router.replace("/login"); // Go to login if not logged in
		}
	};

	const step = onboardingSteps[currentStep - 1];

	return (
		<OnboardingSlideNW
			title={step.title}
			description={step.description}
			illustration={step.illustration}
			currentStep={currentStep}
			totalSteps={onboardingSteps.length}
			onNext={handleNext}
			onSkip={handleSkip}
			isLast={currentStep === onboardingSteps.length}
		/>
	);
}
