module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0052cc",
        medicalBlue: "#0077b6",
        accent: "#0ead69",
        stageNormal: "#1cbe25",
        stageEarly: "#ffba08",
        stageModerate: "#f48c06",
        stageAdvanced: "#d00000",
      },
    },
  },
  plugins: [],
};
