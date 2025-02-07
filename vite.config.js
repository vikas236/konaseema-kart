import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "668f-2401-4900-882e-e6a6-b014-5e0d-6cb6-6614.ngrok-free.app",
    ],
  },
});
