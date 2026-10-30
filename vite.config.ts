import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// A API libera CORS apenas para http://localhost:5173,
// por isso a porta é fixa: se estiver ocupada, o Vite avisa em vez de trocar de porta.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, strictPort: true },
});
