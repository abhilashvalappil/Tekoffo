// // import js from '@eslint/js';
// // import tseslint from 'typescript-eslint';

// // export default [
// //   js.configs.recommended,
// //   ...tseslint.configs.recommended,
// //   {
// //     files: ['**/*.ts'],
// //     languageOptions: {
// //       parserOptions: {
// //         project: './tsconfig.json',
// //       },
// //     },
// //     rules: {
// //       // You can adjust these to your preferences
// //       '@typescript-eslint/explicit-function-return-type': 'off',
// //       '@typescript-eslint/no-explicit-any': 'warn',
// //       '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
// //       'no-console': 'off', // allow console logs in backend
// //       'prettier/prettier': 'error',
// //     },
// //   },
// // ];

// import js from '@eslint/js';
// import tseslint from 'typescript-eslint';
// import prettierPlugin from 'eslint-plugin-prettier';

// export default [
//   js.configs.recommended,
//   ...tseslint.configs.recommended,
//   {
//     files: ['**/*.ts'],
//     languageOptions: {
//       parserOptions: {
//         project: './tsconfig.json',
//       },
//     },
//     plugins: {
//       prettier: prettierPlugin, // ✅ register the plugin here
//     },
//     rules: {
//       '@typescript-eslint/explicit-function-return-type': 'off',
//       '@typescript-eslint/no-explicit-any': 'warn',
//       '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
//       'no-console': 'off',
//       'prettier/prettier': 'error', // ✅ this works only if the plugin is registered above
//     },
//   },
// ];

// eslintconfig.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
];

