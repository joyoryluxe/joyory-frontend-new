import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})









// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import obfuscator from 'vite-plugin-javascript-obfuscator'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     // This scrambles your JavaScript so attackers cannot read your logic or find endpoints
//     obfuscator({
//       options: {
//         compact: true,
//         controlFlowFlattening: true,
//         controlFlowFlatteningThreshold: 0.75,
//         deadCodeInjection: true,
//         deadCodeInjectionThreshold: 0.4,
//         debugProtection: true, // Prevents people from using console/debugger
//         debugProtectionInterval: 2000,
//         disableConsoleOutput: true, // Blocks all console.log
//         identifierNamesGenerator: 'hexadecimal',
//         log: false,
//         renameGlobals: false,
//         rotateStringArray: true,
//         selfDefending: true,
//         stringArray: true,
//         stringArrayThreshold: 0.75,
//         unicodeEscapeSequence: true, // Turns strings into Unicode like \x68\x74
//       },
//     }),
//   ],
//   build: {
//     // This section renames your files to random names
//     // so attackers can't find "main.jsx" or "App.jsx"
//     rollupOptions: {
//       output: {
//         entryFileNames: `assets/core-[hash].js`,
//         chunkFileNames: `assets/module-[hash].js`,
//         assetFileNames: `assets/style-[hash].[ext]`,
//         manualChunks(id) {
//           if (id.includes('node_modules')) {
//             return 'vendor'; // Keeps library code separate
//           }
//         },
//       },
//     },
//     minify: 'terser', // High-level minification
//     terserOptions: {
//       compress: {
//         drop_console: true, // Removes all console.logs
//         drop_debugger: true, // Removes debugger statements
//       },
//     },
//   },
// })







// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       "/api": {
//         target: "https://beauty.joyory.com",
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });
