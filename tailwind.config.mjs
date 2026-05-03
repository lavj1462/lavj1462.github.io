/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  corePlugins: {
    preflight: false, // DS handles all base/reset styles
  },
  theme: {
    extend: {
      fontFamily: {
        sans:  ['"Inter"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['"Newsreader"', '"Times New Roman"', 'Georgia', 'serif'],
        hand:  ['"Caveat"', '"Bradley Hand"', 'cursive'],
        mono:  ['"JetBrains Mono"', '"SF Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        paper:     '#FBF6F4',
        'paper-2': '#F5EAEF',
        'paper-3': '#EBDDE8',
        ink:       '#2A1F2D',
        'ink-soft':'#4A3A4D',
        'ink-mute':'#7E6F82',
        'ink-faint':'#BFB1C2',
        pink:      '#FFAFCC',
        'pink-soft':'#FFC8DD',
        lavender:  '#CDB4DB',
        ice:       '#BDE0FE',
        sky:       '#A2D2FF',
      },
    },
  },
  plugins: [],
};
