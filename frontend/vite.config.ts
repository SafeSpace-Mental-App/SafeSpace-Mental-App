// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This bypasses CORS completely during development
      "/api": {
        target: "https://safe-place-sigma.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
