import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ledger: {
          paper: "#F7F5F0",
          paperDim: "#EFEBE2",
          ink: "#1C1B19",
          inkSoft: "#5A564C",
          line: "#D8D2C2",
          gain: "#1F6E4A",
          loss: "#A8412E",
          accent: "#B08D2B",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      boxShadow: {
        card: "0 1px 0 0 #D8D2C2",
      },
    },
  },
  plugins: [],
};

export default config;
