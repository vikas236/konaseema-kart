import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: [
      "4f2d-2401-4900-882e-cb51-554b-56f1-1523-543b.ngrok-free.app", // Add your ngrok domain here
    ],
  },
});
