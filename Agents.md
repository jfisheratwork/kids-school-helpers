# Agent Guidelines

These rules dictate how AI agents interact with the repository.

## External Libraries
When including external libraries (e.g., via CDN), agents MUST adhere to the following rules:
1. **Explicit Versioning**: Always use an explicit, fixed version number. Do not use `@latest` or unversioned links.
2. **Release Notes Comment**: Every external library inclusion must be accompanied by a code-level comment containing the URL to the release notes or changelog for that specific version.
3. **Session Start Updates**: At the start of a new session, agents should check if updated versions of included libraries are available. A library version may only be updated if it has been publicly released for **at least 5 days** (to avoid absorbing zero-day bugs or immediate post-release regressions).

## Token Efficiency & Workflow Management
To optimize AI context window size and maintain high performance, agents MUST follow these workflow rules:

1. **Modular File Structure**: Prefer smaller, focused files over monolithic files. When adding significant new functionality, break it out into a new module or component file rather than appending thousands of lines to `index.html` or a single JavaScript file.
2. **Targeted Test Execution**: Do NOT run the full test suite (especially headless browser tests or Puppeteer) after every minor tweak. Only run integration tests when a major logic feature is complete, at the very end of a workflow, or when explicitly requested by the user. Rely on manual verification or targeted unit tests for small changes.
3. **Encourage Batched Requests**: If the user begins making many small, rapid-fire iterative requests (e.g., minor CSS tweaks one by one), the agent MUST politely encourage the user to batch their requests into a larger body of work. The agent should suggest creating or updating a formal `implementation_plan.md` or spec file so that multiple changes can be processed in a single, token-efficient pass.
