# NativeWind Configuration Fix

## Issue

The error "Tailwind CSS has not been configured with the NativeWind preset" indicates that Metro/NativeWind cannot find or properly load the Tailwind configuration.

## Steps to Fix

### 1. Clear Cache and Reinstall

```bash
# Clear all caches
rm -rf node_modules
rm package-lock.json
npm cache clean --force

# Reinstall dependencies
npm install

# Clear Expo cache
npx expo install --fix
```

### 2. Verify NativeWind Installation

```bash
# Check if nativewind is properly installed
npm ls nativewind

# If missing, reinstall
npm install nativewind@^4.1.23
npm install --save-dev tailwindcss@3.4.14
```

### 3. Alternative Metro Configuration

If the issue persists, try this alternative metro.config.js:

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, {
	// Add this for better dependency resolution
	transformer: {
		unstable_allowRequireContext: true,
	},
});

// Add SVG support
config.transformer = {
	...config.transformer,
	babelTransformerPath: require.resolve("react-native-svg-transformer"),
	unstable_allowRequireContext: true,
};

config.resolver = {
	...config.resolver,
	assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
	sourceExts: [...config.resolver.sourceExts, "svg"],
};

module.exports = withNativeWind(config, {
	input: "./global.css",
	configPath: "./tailwind.config.js",
});
```

### 4. Simplified Tailwind Config

Try this minimal tailwind.config.js:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./components/**/*.{js,jsx,ts,tsx}",
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {},
	},
	plugins: [],
};
```

### 5. Check File Structure

Ensure these files exist:

-   ✅ tailwind.config.js (not .ts)
-   ✅ global.css with @tailwind directives
-   ✅ nativewind-env.d.ts
-   ✅ app/\_layout.tsx imports '../global.css'

### 6. Try Manual Start

```bash
# Clear Expo cache
npx expo install --fix

# Start with cache clearing
npx expo start --clear

# Or try web first
npx expo start --web
```

## Common Causes

1. **Wrong config file**: Using .ts instead of .js
2. **Cache issues**: Metro cache conflicts
3. **Import path**: Wrong path to global.css
4. **Version mismatch**: NativeWind/Tailwind version conflicts

## Quick Test

Create a simple component to test if NativeWind works:

```tsx
// Test component
import { View, Text } from "react-native";

export default function TestComponent() {
	return (
		<View className="flex-1 bg-blue-500 justify-center items-center">
			<Text className="text-white text-xl">NativeWind Works!</Text>
		</View>
	);
}
```

Try these steps in order and let me know which one resolves the issue!
