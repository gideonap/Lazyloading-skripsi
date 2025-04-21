module.exports = {
  apps: [
    {
      name: "my-vite-app",
      script: "npm",
      args: "run dev",
      watch: true,
      env: {
        NODE_ENV: "development",
        VITE_PORT: 7000, // Set the VITE_PORT environment variable
      },
    },
    {
      name: "vite-app",
      script: "serve",
      env: {
        PM2_SERVE_PATH: "./dist", // Path to the dist folder
        PM2_SERVE_PORT: 3000,      // Port to serve on
        PM2_SERVE_SPA: true,       // If you're serving a Single Page Application
        NODE_ENV: "production",     // Set the environment as production
        VITE_PORT: 3000,           // Set the VITE_PORT environment variable
      },
    },
  ],
};
