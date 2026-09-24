import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Chatty",
        short_name: "Chatty",
        description: "A real-time messaging application",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/auth.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
