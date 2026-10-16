# Developer Onboarding

Welcome to the Kids School Helpers repository! 

## Local Environment Setup

This project consists of purely static HTML, CSS, and Vanilla JavaScript files. We utilize external libraries via CDNs, meaning **no build steps or external package managers (like npm) are required**.

To run and test the project locally, we provide a zero-dependency local web server.

### Starting the Local Server

You only need **Node.js** installed on your system (no npm packages required).

1. Open your terminal in the repository root directory.
2. Run the server:
   ```bash
   node server.js
   ```
3. Open your browser and navigate to the URL printed in the terminal (typically `http://localhost:3000`).

## Running the Unit Test Suite

We have a client-side unit test suite located in the `/test` directory. It verifies all Fraction arithmetic, expression parsing, and Equation Generator steps.

To run the test suite:
1. Ensure the local development server is running (`node server.js` or `make start`).
2. Navigate to **[http://localhost:3000/test/](http://localhost:3000/test/)** in your browser, or run headless tests via `make test`.
3. The dashboard will automatically execute the tests and render pass/fail reports with execution times.

## Code Quality & Pre-Commit Hooks

We enforce lightweight, sub-second code quality checks with zero heavy dependencies:

1. **Install Git Hooks:**
   ```bash
   make install-hooks
   ```
2. **Check JavaScript Syntax:**
   ```bash
   make lint
   ```
3. **Scan AST Structural Rules (`ast-grep`):**
   ```bash
   make lint-rules
   ```
4. **Run Pre-Commit Gates Manually:**
   ```bash
   make pre-commit
   ```

## GitHub Actions & Pages Setup

The repository is configured to deploy automatically to GitHub Pages. If you are setting this up for the first time or on a fork, follow these steps:

1. Navigate to your repository on GitHub.
2. Go to **Settings** -> **Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Our workflow is defined in `.github/workflows/deploy.yml`. Once you push to the `main` branch, the action will automatically package the repository and deploy it.
