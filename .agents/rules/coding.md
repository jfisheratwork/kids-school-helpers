---
trigger: always_on
description: Always-on general coding principles for Kids School Helpers covering Vanilla ES6+ best practices, security, YAGNI hygiene, and quality assurance.
---

# General Coding Principles

These principles apply universally across the **Kids School Helpers** repository and must be followed at all times.

## 1. Zero-Build-Step Vanilla ES6+ Best Practices

- Keep the application a pure client-side static web app using modern Vanilla ES6+ modules (`import`/`export`), standard HTML5, Tailwind CSS (`3.4.4`), and KaTeX (`0.16.10`). Do not introduce bundlers, transpilers, or runtime frameworks.
- Prefer native browser APIs (e.g., View Transitions API, CSS Grid/Flexbox, `URLSearchParams`, `<dialog>`) over third-party polyfills when widely supported.
- Strive for clean, readable, and self-documenting code.
- **No Magic Numbers:** Never embed unexplained numeric literals directly in generators, layout math, or animation timings. Extract them into semantically named constants.
- **Code Hygiene & YAGNI:** Before finishing a task, remove unrequested helper functions, speculative abstractions, and dead code from touched files.

## 2. Quality Assurance & Tooling

- After modifying source code, run `node -c <file.js>` for instant syntax checks, and run `make lint`, `make lint-rules`, and `make pre-commit` before presenting multi-file work to the user.
- Run targeted unit tests (`node test/unit-tests.js`) for math logic changes, and run `make test` (`node test/run-headless.js`) when completing major features or before final sign-off.
- Write unit tests alongside new math models, parsers, and problem generators.

## 3. Security & Safe DOM Handling

- Never use `eval()`, `new Function()`, or unsanitized `innerHTML` with user-supplied input. Prefer `textContent`, DOM node construction (`document.createElement`), or centralized KaTeX rendering via [`shared/js/renderer.js`](../../shared/js/renderer.js).
- Validate and sanitize all external and user inputs (custom math problems, fraction strings, query parameters) at system boundaries and surface errors cleanly.
- Never hardcode secrets, tokens, or credentials in repository files.

## 4. Code Review & Documentation Hygiene

- Perform a self-review of `git diff` before committing.
- Keep all Markdown links in committed `.md` files project-relative (never `file:///`, `/Users/`, or `/home/`).
- Leave clear, descriptive commit messages and PR descriptions with the required Gemini attribution footer.

## 5. Fail-Fast Error Handling

- Never use empty `catch` blocks or return silent dummy fallback values (`null`, `[]`, `{}`) in math generators, parsers, or solver engines unless explicitly required by the active spec.
- Surface invalid inputs or unexpected state transitions explicitly so bugs are caught during testing rather than masked in the UI.

## 6. The Documentation Linking Rule

- **CRITICAL:** The first time a pinned external library (e.g., KaTeX, Tailwind CSS) or a modern Web API (e.g., View Transitions API, `SpeechSynthesis`) is introduced in a file, place a code comment directly above it linking to its official release notes or MDN/W3C specification documentation.
- Keep CDN inclusions pinned to explicit fixed versions as listed in [`AGENTS.md`](../../AGENTS.md) §6.
