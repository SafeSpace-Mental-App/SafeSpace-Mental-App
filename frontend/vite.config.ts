import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "SafeSpace",
        short_name: "SafeSpace",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "https://res.cloudinary.com/dwkptw91p/image/upload/v1762751270/db75f766881c144da2bc8df536438aea0ee3a02a_bk42f3.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "https://res.cloudinary.com/dwkptw91p/image/upload/v1762751270/db75f766881c144da2bc8df536438aea0ee3a02a_bk42f3.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
});
