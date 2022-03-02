module.exports = {
  mode: "jit",
  content: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
    "./plugins/**/*.{js,ts}"
  ],
  safelist: [
    {
      pattern: /bg-(.*)-(.*)/,
      variants: ['hover', 'focus']
    },
    {
      pattern: /border-(.*)-(.*)/
    }
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};