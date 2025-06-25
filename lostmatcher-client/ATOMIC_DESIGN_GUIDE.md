# Atomic Design Implementation Guide

## 🧬 Overview

This project implements **Atomic Design** methodology by Brad Frost, organizing components into a hierarchy that promotes reusability, consistency, and maintainability.

## 📁 Component Structure

```
components/
├── atoms/          # Basic building blocks
├── molecules/      # Groups of atoms
├── organisms/      # Groups of molecules
├── templates/      # Page-level layouts
└── index.ts        # Centralized exports
```

## 🔬 Component Hierarchy

### 1. **Atoms** (`/components/atoms/`)

_The basic building blocks of our design system_

-   **Button** - Configurable button with variants (primary, secondary, outline)
-   **Input** - Text input with theming and validation states
-   **Label** - Typography component with different variants and colors
-   **IconButton** - Pressable icon with different styles

**Usage:**

```tsx
import { Button, Input, Label } from "@/components/atoms";

<Button title="Save" onPress={handleSave} variant="primary" size="large" />;
```

### 2. **Molecules** (`/components/molecules/`)

_Combinations of atoms that function together_

-   **SearchBar** - Input + Button for search functionality
-   **FormField** - Label + Input + Error handling
-   **Card** - Container with title, content, and actions

**Usage:**

```tsx
import { SearchBar, FormField } from "@/components/molecules";

<FormField
	label="Email"
	value={email}
	onChangeText={setEmail}
	required={true}
	error={errors.email}
/>;
```

### 3. **Organisms** (`/components/organisms/`)

_Complex components made of molecules and atoms_

-   **Header** - Navigation header with title, back button, search, actions
-   **Form** - Complete form with validation and submission
-   **ListView** - Scrollable list with refresh, empty states, and custom content

**Usage:**

```tsx
import { Header, ListView } from "@/components/organisms";

<ListView
	data={items}
	onItemPress={handleItemPress}
	refreshing={refreshing}
	onRefresh={handleRefresh}
/>;
```

### 4. **Templates** (`/components/templates/`)

_Page-level layouts that define structure without content_

-   **BaseLayout** - Common page structure with header and content area
-   **ListLayout** - Layout for list-based screens
-   **FormLayout** - Layout for form-based screens

**Usage:**

```tsx
import { ListLayout } from "@/components/templates";

<ListLayout
	title="Lost Items"
	showSearch={true}
	data={items}
	onItemPress={handleItemPress}
/>;
```

### 5. **Screens** (`/screens/`)

_Complete pages that use templates with real data (equivalent to "Pages" in web)_

-   **LostItemsListScreen** - Shows list of lost items with search
-   **CreateLostItemScreen** - Form to create new lost item

## 🎯 Benefits of This Architecture

### ✅ **Reusability**

-   Components can be reused across different screens
-   Consistent UI patterns throughout the app

### ✅ **Maintainability**

-   Changes to atoms automatically propagate up
-   Clear separation of concerns
-   Easy to test individual components

### ✅ **Scalability**

-   New features built from existing components
-   Design system grows systematically

### ✅ **Consistency**

-   Unified theming and styling
-   Predictable component behavior

## 🚀 Development Workflow

### Adding New Features

1. **Start with Atoms** - Create/use basic building blocks
2. **Compose Molecules** - Combine atoms for specific functionality
3. **Build Organisms** - Create complex sections
4. **Design Templates** - Define page layouts
5. **Create Screens** - Add business logic and real data

### Example: Adding a "Filter" Feature

```tsx
// 1. Atom (if needed)
<Button title="Filter" variant="outline" />

// 2. Molecule
<FilterBar
  filters={filters}
  onFilterChange={setFilters}
  onApply={applyFilters}
/>

// 3. Organism (update existing Header)
<Header
  title="Items"
  showFilter={true}
  onFilterPress={showFilterModal}
/>

// 4. Template (update existing ListLayout)
<ListLayout
  title="Items"
  showFilter={true}
  filterComponent={<FilterBar />}
/>

// 5. Screen (update with filter logic)
const [filters, setFilters] = useState({});
// ... filter logic
```

## 📱 Screen Implementation Pattern

**Screens** in React Native apps are equivalent to **Pages** in web development. They:

-   Use templates for consistent layout
-   Manage business logic and state
-   Handle navigation and routing
-   Connect to APIs and data sources
-   Implement user interactions

### Example Screen Structure:

```tsx
// screens/ExampleScreen.tsx
import React, { useState, useCallback } from "react";
import { SomeLayout } from "@/components/templates";

export default function ExampleScreen() {
	// 1. State management
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	// 2. Business logic
	const handleAction = useCallback(() => {
		// API calls, navigation, etc.
	}, []);

	// 3. Render with template
	return (
		<SomeLayout
			title="Example"
			data={data}
			onAction={handleAction}
			loading={loading}
		/>
	);
}
```

## 🎨 Theming Integration

All components support theming through the `useThemeColor` hook:

```tsx
// Automatic theme switching
const textColor = useThemeColor({}, "text");
const backgroundColor = useThemeColor({}, "background");

// Custom theme colors
const buttonColor = useThemeColor(
	{ light: "#007AFF", dark: "#0A84FF" },
	"tint"
);
```

## 🧪 Testing Strategy

-   **Atoms**: Unit tests for individual components
-   **Molecules**: Integration tests for component combinations
-   **Organisms**: Behavior tests for complex interactions
-   **Templates**: Layout and structure tests
-   **Screens**: E2E tests for complete user flows

## 📈 Migration Strategy

To gradually migrate existing code to Atomic Design:

1. **Identify Reusable Components** - Extract common UI patterns
2. **Create Atoms First** - Build foundational components
3. **Refactor Screens Gradually** - Replace hardcoded UI with atomic components
4. **Update New Features** - Use atomic components for all new development

## 🔗 Related Files

-   `/components/index.ts` - Main component exports
-   `/hooks/useThemeColor.ts` - Theming utilities
-   `/constants/Colors.ts` - Color definitions
-   `/screens/` - Screen implementations

---

_This architecture provides a solid foundation for building scalable, maintainable React Native applications with consistent UI patterns and excellent developer experience._
