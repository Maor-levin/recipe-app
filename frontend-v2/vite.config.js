import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: import.meta.env.VITE_ALLOWED_HOSTS?.split(',') || [],
    watch: {
      usePolling: true,
    },
  },
});
