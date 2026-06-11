# Developer Onboarding

Welcome to the Kids School Helpers repository! 

## Local Environment Setup

This project consists of purely static HTML, CSS, and Vanilla JavaScript files. We utilize external libraries via CDNs, meaning **no build steps or package managers (like Node or npm) are required**.

To run the project locally, you can simply open the `index.html` files directly in your web browser, or use a basic local web server of your choice (like Python's `http.server`) to serve the directory.

## GitHub Actions & Pages Setup

The repository is configured to deploy automatically to GitHub Pages. If you are setting this up for the first time or on a fork, follow these steps:

1. Navigate to your repository on GitHub.
2. Go to **Settings** -> **Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Our workflow is defined in `.github/workflows/deploy.yml`. Once you push to the `main` branch, the action will automatically package the repository and deploy it.
