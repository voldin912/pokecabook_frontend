module.exports = {
  plugins: [
    require('postcss-flexbugs-fixes'),
    require('tailwindcss'),
    require('autoprefixer'),
    require('postcss-preset-env')({
      stage: 3, // Optional: Define the stage for CSS feature support
      features: {
        'custom-properties': false, // Optional: Disable specific features if not needed
      },
    }),
  ],
};
