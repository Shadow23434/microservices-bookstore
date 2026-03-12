/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#b05d44",
                "primary-dark": "#8c4a35",
                "background-light": "#fdf8f5",
                "background-dark": "#1a1614",
                "warm-gray": "#5C524D",
                "secondary": "#fdf8f1",
                "accent": "#6d3a2a",
                "neutral-cream": "#f5efe6",
                "border-cream": "#e8dfd1",
            },
            fontFamily: {
                "display": ["Public Sans", "sans-serif"],
                "serif": ["Playfair Display", "serif"],
                "newsreader": ["Newsreader", "serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries')
    ],
}
