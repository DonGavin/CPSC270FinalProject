export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {
      useESM: true,
      tsconfig: {
        jsx: "react-jsx"
      }
    }],
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transformIgnorePatterns: [
    "/node_modules/(?!(react-dnd|react-dnd-html5-backend|@testing-library/jest-dom)/)"
  ],
  moduleNameMapper: {
    "^react-dnd$": "react-dnd/dist/core/index.js",
    "^react-dnd-html5-backend$": "react-dnd-html5-backend/dist/index.js",
  },
};