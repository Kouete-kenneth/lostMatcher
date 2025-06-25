/**
 * Color system based on the Lost Matcher design guidelines
 * Using the custom palette: Primary Blue, Charcoal, Slate, White, Soft Yellow, Green, Red
 */

// Primary color palette - exact values from design guidelines
const primaryBlue = "#2563EB"; // Primary Blue
const charcoal = "#374151"; // Charcoal (text)
const slate = "#64748B"; // Slate (secondary text)
const white = "#FFFFFF"; // White (background)
const softYellow = "#FEF3C7"; // Soft Yellow (accents)
const green = "#10B981"; // Green (success)
const red = "#EF4444"; // Red (error)

// Additional shades for better theming
const lightGray = "#F1F5F9";
const darkGray = "#1F2937";

export const Colors = {
	light: {
		text: charcoal,
		background: white,
		tint: primaryBlue,
		icon: slate,
		tabIconDefault: slate,
		tabIconSelected: primaryBlue,
		// Additional colors for the design system
		primary: primaryBlue,
		secondary: charcoal,
		accent: softYellow,
		success: green,
		error: red,
		surface: lightGray,
		border: slate,
	},
	dark: {
		text: white,
		background: darkGray,
		tint: primaryBlue,
		icon: slate,
		tabIconDefault: slate,
		tabIconSelected: primaryBlue,
		// Additional colors for the design system
		primary: primaryBlue,
		secondary: white,
		accent: softYellow,
		success: green,
		error: red,
		surface: charcoal,
		border: slate,
	},
};
