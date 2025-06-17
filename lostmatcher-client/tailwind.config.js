/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        primary:'#7454F4',
        secondary:'#FFFF99',
        tertiary:'#5b3dcc',
        text:'#000000',
        bgsecondary:'#f2f2f2',
        black:'#000000',
        white:'#ffffff'
      },
      fontFamily:{
        Poppins:["Poppins","sans-serif"],
        Roboto:["Roboto","sans-serif"],
        rRoboto:["Roboto-Reguler","sans-serif"],
        tRoboto:["Roboto-Thin","sans-serif"],
        mRoboto:["Roboto-Medium","sans-serif"],
        rRougeScript:["RougeScript-Regular","sans-serif"]
      }
    },
  },
  plugins: [],
}

