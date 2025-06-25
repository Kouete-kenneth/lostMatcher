# LostMatcher Client - Code Structure Documentation

## 📁 Project Overview

**LostMatcher** is a React Native mobile application built with Expo Router that helps users report and find lost items in their community. The app follows **Atomic Design principles** for component architecture and uses modern React Native development practices.

### 🏗️ Tech Stack

-   **Framework**: React Native (v0.79.4) with Expo (v53.0.12)
-   **Routing**: Expo Router (v5.1.0) with file-based routing
-   **Navigation**: React Navigation (v7.x)
-   **Styling**: StyleSheet API with theme support
-   **TypeScript**: Full type safety throughout the app
-   **Architecture**: Atomic Design pattern

---

## 📂 Complete Directory Structure

```
lostmatcher-client/
├── 📱 app/                          # Expo Router - App screens and navigation
│   ├── _layout.tsx                  # Root layout with theme and navigation setup
│   ├── +not-found.tsx              # 404 error screen
│   └── (tabs)/                     # Tab-based navigation group
│       ├── _layout.tsx             # Tab layout configuration
│       ├── index.tsx               # Home tab (Lost Items List)
│       └── explore.tsx             # Explore tab (Create Lost Item Form)
│
├── 🧩 components/                   # Atomic Design Component Library
│   ├── index.ts                    # Main component exports
│   │
│   ├── atoms/                      # Basic building blocks
│   │   ├── index.ts               # Atom exports
│   │   ├── Button.tsx             # Configurable button component
│   │   ├── Input.tsx              # Text input with theming
│   │   ├── Label.tsx              # Typography component
│   │   └── IconButton.tsx         # Pressable icon button
│   │
│   ├── molecules/                  # Component combinations
│   │   ├── index.ts               # Molecule exports
│   │   ├── SearchBar.tsx          # Input + Button search component
│   │   ├── FormField.tsx          # Label + Input + Error handling
│   │   └── Card.tsx               # Content container with actions
│   │
│   ├── organisms/                  # Complex component sections
│   │   ├── index.ts               # Organism exports
│   │   ├── Header.tsx             # Navigation header with search
│   │   ├── Form.tsx               # Complete form with validation
│   │   └── ListView.tsx           # Scrollable list with refresh
│   │
│   ├── templates/                  # Page-level layouts
│   │   ├── index.ts               # Template exports
│   │   ├── BaseLayout.tsx         # Common page structure
│   │   ├── ListLayout.tsx         # Layout for list-based screens
│   │   └── FormLayout.tsx         # Layout for form-based screens
│   │
│   ├── globals/                    # Legacy Themed Components (Expo default)
│   │   ├── Collapsible.tsx        # Collapsible content container
│   │   ├── ExternalLink.tsx       # External link component
│   │   ├── HapticTab.tsx          # Tab with haptic feedback
│   │   ├── HelloWave.tsx          # Animated wave component
│   │   ├── ParallaxScrollView.tsx # Parallax scroll container
│   │   ├── ThemedText.tsx         # Text with theme support
│   │   └── ThemedView.tsx         # View with theme support
│   │
│   └── ui/                        # Platform-specific UI components
│       ├── IconSymbol.tsx         # Cross-platform icon component
│       ├── IconSymbol.ios.tsx     # iOS-specific icon implementation
│       ├── ParallaxScrollView.tsx # Parallax scroll view
│       ├── TabBarBackground.tsx   # Tab bar background component
│       └── TabBarBackground.ios.tsx # iOS-specific tab background
│
├── 📱 screens/                     # Complete screen implementations (Pages)
│   ├── index.ts                   # Screen exports
│   ├── LostItemsListScreen.tsx    # List screen with search and actions
│   └── CreateLostItemScreen.tsx   # Form screen with validation
│
├── 🎣 hooks/                       # Custom React hooks
│   ├── useColorScheme.ts          # Color scheme detection (mobile)
│   ├── useColorScheme.web.ts      # Color scheme detection (web)
│   └── useThemeColor.ts           # Theme color management
│
├── 🎨 constants/                   # App constants and configuration
│   └── Colors.ts                  # Color palette and theme definitions
│
├── 🖼️ assets/                      # Static assets
│   ├── fonts/                     # Custom fonts
│   │   └── SpaceMono-Regular.ttf  # Monospace font
│   └── images/                    # App images and icons
│       ├── icon.png               # App icon
│       ├── adaptive-icon.png      # Android adaptive icon
│       ├── favicon.png            # Web favicon
│       ├── splash-icon.png        # Splash screen icon
│       └── react-logo*.png        # React logo assets
│
├── 🛠️ scripts/                     # Build and utility scripts
│   └── reset-project.js           # Project reset script
│
├── ⚙️ Configuration Files
│   ├── app.json                   # Expo app configuration
│   ├── package.json               # Dependencies and scripts
│   ├── tsconfig.json              # TypeScript configuration
│   ├── eslint.config.js           # ESLint configuration
│   ├── expo-env.d.ts              # Expo TypeScript definitions
│   └── README.md                  # Project documentation
│
└── 📖 Documentation
    └── ATOMIC_DESIGN_GUIDE.md     # Atomic Design implementation guide
```

---

## 🎯 Key Files and Their Purpose

### 📱 **App Structure (Expo Router)**

#### `app/_layout.tsx` - Root Layout

```tsx
// Main app configuration
- Theme provider setup (light/dark mode)
- Font loading (SpaceMono)
- Navigation stack configuration
- Status bar configuration
```

#### `app/(tabs)/_layout.tsx` - Tab Navigation

```tsx
// Tab bar configuration
- Tab icons and colors
- Haptic feedback integration
- Platform-specific styling (iOS blur effect)
- Tab screen definitions
```

#### `app/(tabs)/index.tsx` - Home Screen

```tsx
// Main screen showing lost items list
- Imports LostItemsListScreen
- Acts as entry point for the list functionality
```

#### `app/(tabs)/explore.tsx` - Create Item Screen

```tsx
// Screen for creating new lost item reports
- Imports CreateLostItemScreen
- Form-based interface for item creation
```

---

### 🧩 **Component Architecture (Atomic Design)**

#### **Atoms** - Basic Building Blocks

-   **`Button.tsx`**: Configurable button with variants (primary, secondary, outline) and sizes
-   **`Input.tsx`**: Text input with theming, validation states, and keyboard types
-   **`Label.tsx`**: Typography component with variants, weights, and colors
-   **`IconButton.tsx`**: Pressable icon with different styles and haptic feedback

#### **Molecules** - Component Combinations

-   **`SearchBar.tsx`**: Combines Input + Button for search functionality
-   **`FormField.tsx`**: Combines Label + Input + Error message display
-   **`Card.tsx`**: Content container with title, subtitle, actions, and menu options

#### **Organisms** - Complex Sections

-   **`Header.tsx`**: Navigation header with title, back button, search, and custom actions
-   **`Form.tsx`**: Complete form with field validation, submission, and loading states
-   **`ListView.tsx`**: Scrollable list with pull-to-refresh, empty states, and custom content

#### **Templates** - Page Layouts

-   **`BaseLayout.tsx`**: Common page structure with header and content area
-   **`ListLayout.tsx`**: Specialized layout for list-based screens
-   **`FormLayout.tsx`**: Specialized layout for form-based screens

---

### 📱 **Screens (Complete Pages)**

#### `LostItemsListScreen.tsx` - Main List Screen

```tsx
Features:
- Search functionality with real-time filtering
- Pull-to-refresh capability
- Item interaction (press, menu actions)
- Mock data with realistic lost item information
- Navigation to create new items
- Empty state handling
```

#### `CreateLostItemScreen.tsx` - Form Screen

```tsx
Features:
- Multi-field form with validation
- Required field enforcement
- Email format validation
- Loading states during submission
- Form reset after successful submission
- Error handling and display
```

---

### 🎨 **Theming and Styling**

#### `constants/Colors.ts` - Color System

```tsx
// Defines color palette for light and dark themes
- Primary colors (tint, background, text)
- Tab navigation colors
- Platform-specific color variations
```

#### `hooks/useThemeColor.ts` - Theme Management

```tsx
// Custom hook for theme-aware color selection
- Automatic light/dark mode detection
- Fallback color support
- Component-level color overrides
```

---

### 🛠️ **Development Tools**

#### `scripts/reset-project.js` - Project Reset

```javascript
// Utility script to reset project to blank state
- Moves existing app structure to app-example
- Creates fresh app directory
- Interactive prompts for user choices
```

#### **Configuration Files**

-   **`app.json`**: Expo configuration (app name, icons, splash screen, plugins)
-   **`package.json`**: Dependencies, scripts, and project metadata
-   **`tsconfig.json`**: TypeScript compiler options and path mapping
-   **`eslint.config.js`**: Code linting rules and formatting

---

## 🔄 **Component Relationships and Data Flow**

### **Hierarchical Structure**

```
Screen (Business Logic + Data)
  ↓
Template (Layout Structure)
  ↓
Organism (Complex Sections)
  ↓
Molecule (Component Groups)
  ↓
Atom (Basic Elements)
```

### **Example: LostItemsListScreen Flow**

```tsx
LostItemsListScreen
├── State Management (search, data, loading)
├── Business Logic (filtering, navigation)
└── ListLayout Template
    ├── BaseLayout (header + content structure)
    │   ├── Header Organism
    │   │   ├── IconButton Atoms
    │   │   ├── Label Atoms
    │   │   └── SearchBar Molecule
    │   │       ├── Input Atom
    │   │       └── Button Atom
    │   └── Content Area
    └── ListView Organism
        └── Card Molecules
            ├── Label Atoms
            └── IconButton Atoms
```

---

## 🚀 **Development Workflow**

### **Adding New Features**

1. **Start with Atoms**: Create or use existing basic components
2. **Build Molecules**: Combine atoms for specific functionality
3. **Create Organisms**: Build complex sections
4. **Design Templates**: Define page layouts
5. **Implement Screens**: Add business logic and real data

### **File Naming Conventions**

-   **Components**: PascalCase (e.g., `SearchBar.tsx`)
-   **Screens**: PascalCase with "Screen" suffix (e.g., `LostItemsListScreen.tsx`)
-   **Hooks**: camelCase with "use" prefix (e.g., `useThemeColor.ts`)
-   **Constants**: PascalCase (e.g., `Colors.ts`)
-   **Index files**: Always `index.ts` for consistent exports

### **Import Patterns**

```tsx
// Atomic components
import { Button, Input, Label } from "@/components/atoms";

// Template components
import { ListLayout } from "@/components/templates";

// Complete screens
import { LostItemsListScreen } from "@/screens";

// Hooks and utilities
import { useThemeColor } from "@/hooks/useThemeColor";
```

---

## 📱 **Navigation and Routing**

### **Expo Router Structure**

```
/(tabs)/           # Tab-based navigation group
  ├── index        # Home tab - Lost Items List
  └── explore      # Second tab - Create Lost Item
```

### **Navigation Features**

-   File-based routing with Expo Router
-   Tab navigation with haptic feedback
-   Theme-aware tab colors
-   Platform-specific tab bar styling (iOS blur effect)
-   Type-safe routing with TypeScript

---

## 🧪 **Testing and Quality**

### **Code Quality Tools**

-   **ESLint**: Code linting and formatting
-   **TypeScript**: Type safety and IntelliSense
-   **Expo CLI**: Development and build tools

### **Recommended Testing Strategy**

-   **Atoms**: Unit tests for individual components
-   **Molecules**: Integration tests for component combinations
-   **Organisms**: Behavior tests for complex interactions
-   **Templates**: Layout and structure tests
-   **Screens**: End-to-end tests for complete user flows

---

## 🔧 **Configuration and Setup**

### **Path Mapping (tsconfig.json)**

```json
{
	"baseUrl": ".",
	"paths": {
		"@/*": ["./*"]
	}
}
```

### **Key Dependencies**

-   **expo-router**: File-based navigation
-   **@react-navigation**: Navigation libraries
-   **expo-haptics**: Haptic feedback
-   **expo-image**: Optimized image component
-   **react-native-reanimated**: Animations
-   **@expo/vector-icons**: Icon library

---

This documentation provides a complete overview of your LostMatcher client codebase, showing how Atomic Design principles are implemented alongside modern React Native and Expo development practices. The structure promotes scalability, maintainability, and consistent user experience across the application.
