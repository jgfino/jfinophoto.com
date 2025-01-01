import type { Config } from "tailwindcss";
import Forms from "@tailwindcss/forms";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        fade: "fadeIn .5s ease-in-out",
      },
    },
  },
  safelist: [{
    pattern: /grid-cols-./,
  }],
  plugins: [Forms],
} satisfies Config;
