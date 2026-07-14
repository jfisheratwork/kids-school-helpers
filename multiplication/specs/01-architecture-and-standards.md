# 01 - Architecture and Standards (Multiplication Module)

## System Architecture
* **Deployment Target:** GitHub Pages via GitHub Actions (Main repo).
* **Architecture:** Single Page Application (SPA), fully client-side. No backend server. Application must function as a standalone module within the larger multi-application repository.
* **Permitted Technologies:** HTML5, CSS3, Vanilla ES6+ JavaScript.
* **Styling:** Tailwind CSS via CDN.

## Repository and Directory Structure
* **Application Isolation:** The Multiplication SPA resides in a dedicated subdirectory (`/multiplication/`).
* **Asset Management:** Application-specific assets (scripts, stylesheets) must be localized within the application's subdirectory.

## User Interface Standards
* **Design Language:** Minimalist, high contrast, sans-serif typography.
* **Flow Separation:** The standard multi-digit/decimal multiplication flow is visually and logically separated from the fraction multiplication flow.
* **State Changes:** CSS transitions and vanilla JS class toggling for UI state.
