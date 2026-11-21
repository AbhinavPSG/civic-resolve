import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "tn-saffron": "#FF9933",
        "tn-green": "#138808",
        "tn-navy": "#000080",
        "ccmc-blue": "#1a3a6b",
        "ccmc-gold": "#c8a000",
      },
    },
  },
  plugins: [],
};
export default config;
