import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom vault colors for specific components
        "vault-dark": "hsl(285, 10%, 34%)",    // #5d4e60 - for hero section
        "vault-medium": "hsl(291.72, 14.87%, 61.76%)",  // #a88fac
        "vault-light": "hsl(291.43, 14.29%, 80.78%)",   // #d3c7d5

        // Original theme colors
        border: "hsl(240, 5.9%, 90%)",  // Ensure border-border is defined
        ring: "hsl(240, 10%, 3.9%)",    // Ensure outline-ring/50 is recognized
        background: "hsl(0, 0%, 100%)",
        foreground: "hsl(240, 10%, 3.9%)",
        card: "hsl(0, 0%, 100%)",
        "card-foreground": "hsl(240, 10%, 3.9%)",
        popover: "hsl(0, 0%, 100%)",
        "popover-foreground": "hsl(240, 10%, 3.9%)",
        primary: "hsl(285, 10%, 34%)",  // Using vault-dark for hero section
        "primary-foreground": "hsl(0, 0%, 98%)",
        secondary: "hsl(240, 4.8%, 95.9%)",  // Restored to original
        "secondary-foreground": "hsl(240, 5.9%, 10%)",
        muted: "hsl(240, 4.8%, 95.9%)",
        "muted-foreground": "hsl(240, 3.8%, 46.1%)",
        accent: "hsl(240, 4.8%, 95.9%)",
        "accent-foreground": "hsl(240, 5.9%, 10%)",
        destructive: "hsl(0, 84.2%, 60.2%)",
        "destructive-foreground": "hsl(0, 0%, 98%)",
        input: "hsl(240, 5.9%, 90%)",  // Restored to original
        chart1: "hsl(12, 76%, 61%)",
        chart2: "hsl(173, 58%, 39%)",
        chart3: "hsl(197, 37%, 24%)",
        chart4: "hsl(43, 74%, 66%)",
        chart5: "hsl(27, 87%, 67%)",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
