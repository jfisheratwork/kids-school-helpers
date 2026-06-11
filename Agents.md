# Agent Guidelines

These rules dictate how AI agents interact with the repository.

## External Libraries
When including external libraries (e.g., via CDN), agents MUST adhere to the following rules:
1. **Explicit Versioning**: Always use an explicit, fixed version number. Do not use `@latest` or unversioned links.
2. **Release Notes Comment**: Every external library inclusion must be accompanied by a code-level comment containing the URL to the release notes or changelog for that specific version.
3. **Session Start Updates**: At the start of a new session, agents should check if updated versions of included libraries are available. A library version may only be updated if it has been publicly released for **at least 5 days** (to avoid absorbing zero-day bugs or immediate post-release regressions).
