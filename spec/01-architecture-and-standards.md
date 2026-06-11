# 01 - Architecture and Standards

## System Architecture
* **Deployment Target:** GitHub Pages via GitHub Actions.
* **Target Repository:** `https://github.com/jfisheratwork/kids-school-helpers.git`.
* **Architecture:** Single Page Application (SPA), fully client-side. No backend server. Application must function as a standalone module within a larger multi-application repository.
* **Permitted Technologies:** HTML5, CSS3, Vanilla ES6+ JavaScript. Complex UI frameworks (e.g., React, Vue, Angular) are strictly prohibited. Lightweight utility libraries are permitted provided build artifacts remain static files.
* **Styling:** Utility-first CSS framework (e.g., Tailwind CSS) to enforce responsive design components without introducing complex JavaScript dependencies.

## Repository and Directory Structure
* **Root Integration:** The repository root must contain a primary `index.html` acting as a centralized navigational hub linking to all hosted applications.
* **Application Isolation:** The Pre-Algebra SPA must reside in a dedicated subdirectory (e.g., `/pre-algebra-solver/`).
* **Asset Management:** Application-specific assets (scripts, stylesheets) must be localized within the application's subdirectory to prevent namespace collisions and dependency conflicts with future applications.

## User Interface Standards
* **Design Language:** Minimalist, high contrast, sans-serif typography.
* **State Changes:** Utilize CSS transitions for elements moving from the Active Input Container to the History Container. State must be managed via Vanilla JavaScript event listeners and class toggling.
* **Responsiveness:** Layout must reflow linearly for mobile viewports, shifting the Hint System Container below the Active Input Container.
