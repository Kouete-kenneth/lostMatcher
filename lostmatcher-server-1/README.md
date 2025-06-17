### Step 1: Install TypeScript

First, you need to install TypeScript and the necessary type definitions. You can do this using npm:

```bash
npm install --save-dev typescript @types/node
```

### Step 2: Initialize TypeScript Configuration

Next, you need to create a `tsconfig.json` file, which will contain the configuration for TypeScript. You can create this file manually or use the TypeScript CLI to generate it:

```bash
npx tsc --init
```

This will create a `tsconfig.json` file with default settings. You may want to customize it according to your needs. Here’s a basic example:

```json
{
  "compilerOptions": {
    "target": "es6", // Specify ECMAScript target version
    "module": "commonjs", // Specify module code generation
    "strict": true, // Enable all strict type-checking options
    "esModuleInterop": true, // Enables emit interoperability between CommonJS and ES Modules
    "skipLibCheck": true, // Skip type checking of declaration files
    "forceConsistentCasingInFileNames": true // Disallow inconsistently-cased references to the same file
  },
  "include": ["src/**/*"], // Specify the files to include
  "exclude": ["node_modules", "**/*.spec.ts"] // Specify files to exclude
}
```

### Step 3: Rename Files

Rename your JavaScript files from `.js` to `.ts`. If you have any JSX files, rename them from `.jsx` to `.tsx`.

### Step 4: Fix Type Errors

After renaming the files, you will likely encounter type errors. TypeScript is stricter than JavaScript, so you will need to address these errors. Here are some common tasks:

1. **Add Type Annotations**: Start adding type annotations to your variables, function parameters, and return types.

   ```typescript
   function add(a: number, b: number): number {
       return a + b;
   }
   ```

2. **Use Interfaces and Types**: Define interfaces or types for complex objects.

   ```typescript
   interface User {
       id: number;
       name: string;
   }

   const user: User = {
       id: 1,
       name: "John Doe"
   };
   ```

3. **Handle Third-Party Libraries**: If you are using third-party libraries, you may need to install their type definitions. For example, for Express:

   ```bash
   npm install --save-dev @types/express
   ```

### Step 5: Update Build and Run Scripts

Update your `package.json` scripts to compile TypeScript before running your application. You can add a script like this:

```json
"scripts": {
    "build": "tsc",
    "start": "node dist/index.js", // Adjust the path as necessary
    "dev": "ts-node src/index.ts" // For development, if you want to run TypeScript directly
}
```

### Step 6: Compile and Run

Now you can compile your TypeScript code:

```bash
npm run build
```

And then run your application:

```bash
npm start
```

### Step 7: Gradually Improve Types

As you become more comfortable with TypeScript, you can gradually improve the type safety of your application by adding more specific types, using generics, and leveraging TypeScript's advanced features.

### Additional Tips

- **Use ESLint**: Consider setting up ESLint with TypeScript support to maintain code quality.
- **Use Prettier**: Integrate Prettier for consistent code formatting.
- **Documentation**: Refer to the [TypeScript documentation](https://www.typescriptlang.org/docs/) for more advanced features and best practices.

By following these steps, you should be able to successfully convert your Node.js application from JavaScript to TypeScript. Good luck!