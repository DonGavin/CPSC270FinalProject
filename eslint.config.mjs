import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactNativePlugin from "eslint-plugin-react-native";
import importPlugin from "eslint-plugin-import";
import jestPlugin from "eslint-plugin-jest";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  // Base configuration for all files
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "react": reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-native": reactNativePlugin,
      "import": importPlugin,
      "jest": jestPlugin,
      "prettier": prettierPlugin,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {},
        node: {
          extensions: [".ios.js", ".android.js", ".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      // React & React Native
      "react/prop-types": "off", // Not needed with TypeScript
      "react/react-in-jsx-scope": "off", // Not needed with newer React
      "react-native/no-unused-styles": "error",
      "react-native/no-inline-styles": "warn", // Warning instead of error during development
      "react-native/no-color-literals": "warn",
      "react-native/no-raw-text": ["warn", { skip: ["Text"] }],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      
      // Mobile & Web cross-platform compatibility
      "react-native/no-single-element-style-arrays": "warn", 
      "react-native/split-platform-components": "warn", // Warn but don't error for platform-specific components

      // TypeScript
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-vars": ["error", { 
        argsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],
      "@typescript-eslint/no-var-requires": "off", // Allow require for assets in Expo

      // Import organization
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: "{react,react-native,expo,expo-*}",
              group: "external",
              position: "before",
            },
            {
              pattern: "@react-*/**",
              group: "external",
              position: "before",
            },
            {
              pattern: "{assets,@}/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "*.{png,jpg,jpeg,gif,svg}",
              group: "object",
              patternOptions: { matchBase: true },
              position: "after",
            },
          ],
        },
      ],
      "import/no-duplicates": "error",
      
      // Expo & general considerations
      "no-console": ["warn", { allow: ["warn", "error", "info"] }], // Allow console.info for debug
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      
      // Comments
      "spaced-comment": ["warn", "always"],
      "capitalized-comments": ["warn", "always", { 
        ignorePattern: "pragma|ignored", 
        ignoreInlineComments: true 
      }],
    },
  },
  
  // Test files
  {
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      "import/no-extraneous-dependencies": "off",
    },
  },
  
  // Interactive components specific rules
  {
    files: ["**/Home.tsx"],
    rules: {
      "react-native/no-inline-styles": "off", // Allow inline styles for interactive components
      "@typescript-eslint/no-non-null-assertion": "off", // For DnD references
    },
  },
  
  // Expo specific overrides
  {
    files: ["App.tsx", "**/navigation/**/*.tsx"],
    rules: {
      "import/order": ["error", {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "pathGroups": [
          {
            "pattern": "expo",
            "group": "external",
            "position": "before"
          },
          {
            "pattern": "expo-*",
            "group": "external",
            "position": "before"
          }
        ],
        "pathGroupsExcludedImportTypes": ["react", "react-native"],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true
        }
      }],
    },
  },
  
  // Platform-specific files
  {
    files: ["**/*.{ios,android}.{js,jsx,ts,tsx}"],
    rules: {
      "react-native/split-platform-components": "off",
    },
  },
]);