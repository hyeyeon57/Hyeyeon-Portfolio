import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        'container': '1540px',
      },
      spacing: {
        'container-x': '190px',
      },
      colors: {
        // Navigation Theme - Dark Mode
        dark: {
          bg: "#242424",
          surface: "#1E1E1E",
          footer: "#0F0F0F",
          border: "#2A2A2A",
        },
        // Point Color - Yellow (Navigation Theme)
        point: {
          yellow: "#FFD700",
          'yellow-light': "#FFE55C",
          'yellow-dark': "#FFC700",
        },
        // Brand Colors from Figma (유지)
        brand: {
          main: "#6100FF",
          sub1: "#39C3B6",
          sub2: "#F59917",
        },
        // Dark Mode Text Colors
        text: {
          primary: "#FFFFFF",
          secondary: "#B0B0B0",
          tertiary: "#808080",
          disabled: "#505050",
        },
        line: {
          light: "#2A2A2A",
          medium: "#3A3A3A",
          dark: "#4A4A4A",
        },
        bg: {
          light: "#1E1E1E",
          medium: "#2A2A2A",
        },
        status: {
          danger: "#DC0000",
          success: "#04B014",
          warning: "#FFD700",
        },
        // System Color Palette from Figma
        system: {
          cyan: {
            900: "#275f63",
            800: "#38818d",
            700: "#4295a5",
            600: "#4caabe",
            500: "#54bad1",
            400: "#5fc4d7",
            300: "#73cede",
            200: "#96dce8",
            100: "#beeaf1",
            50: "#e4f6f9",
          },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "navigation-gradient": "linear-gradient(135deg, #FFD700 0%, #FFC700 100%)",
        "dark-gradient": "linear-gradient(180deg, #121212 0%, #0F0F0F 100%)",
      },
      boxShadow: {
        'glow-yellow': '0 0 20px rgba(255, 215, 0, 0.3)',
        'glow-yellow-lg': '0 0 40px rgba(255, 215, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
export default config;
