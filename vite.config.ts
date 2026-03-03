import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  // Use relative asset URLs so the built site works when hosted from a subfolder
  // (or opened directly as static files) without rendering as plain unstyled HTML.
  base: "./",
  plugins: [react(), tailwindcss()],
})
