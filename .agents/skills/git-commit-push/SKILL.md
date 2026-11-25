---
name: git-commit-push
description: >-
  Executes Kids School Helpers git commit and push workflows with staged pre-commit gates
  (syntax checks, ast-grep rules, secret hygiene, unit tests), mandatory Google Gemini attribution footer,
  and explicit user approval before git push.
  Activate whenever the user asks to commit, push, or save changes to version control.
---

# Git Commit & Push Workflow Skill

This skill governs all commit and push operations in **Kids School Helpers**. It ensures every commit passes repository quality gates, carries the required attribution footer, and respects the external-command approval policy in [`AGENTS.md`](../../../AGENTS.md) §1 and §2.

---

## 1. Pre-Staging Inspection

1. Inspect workspace state before staging:
   ```bash
   git status
   git diff --stat
   ```
2. Verify no untracked personal or session files (`local_only/`, `my_sessions/`, `UserWalkthrough.md`) are staged.
3. Update the active session summary in `my_sessions/YYYY-MM-DD-Session-{n}/session_summary.md` if applicable per [`AGENTS.md`](../../../AGENTS.md) §3.

---

## 2. Quality & Pre-Commit Verification Gates

Stage the intended files, then run the repository validation gates before committing:

```bash
node test/unit-tests.js
make lint
make lint-rules
make pre-commit
```

- **Zero Failures Required**: If any syntax check (`node -c`), `ast-grep` rule, merge-conflict check, secret scan, or unit test fails, fix the issue, re-stage, and re-run the gates.
- **Never Bypass Hooks**: Never use `git commit --no-verify` (`-n`) or `git push --no-verify`.
- For major UI or multi-module features, confirm zero console errors on `http://localhost:3000` and run `make test` (`node test/run-headless.js`) before committing.

---

## 3. Commit Message Format & Attribution

Formulate a clear Conventional Commits message:

1. **Header**: `<type>(<scope>): <concise summary>` (under 72 characters; e.g., `feat(fractions): ...`, `fix(division): ...`, `docs(governance): ...`).
2. **Body**: Concise bullet points summarizing what changed and why.
3. **Mandatory Attribution Footer** ([`AGENTS.md`](../../../AGENTS.md) §2):
   ```text
   > Written with the assistance of Google Gemini
   ```

Example commit command:

```bash
git commit -m "docs(governance): upgrade AGENTS.md and add .agents ecosystem

- Add governance rules for YAGNI, fail-fast error handling, and vertical slices
- Add math-auditor and ui-auditor personas plus native workspace rules and skills

> Written with the assistance of Google Gemini"
```

---

## 4. Explicit User Approval Before `git push`

Per [`AGENTS.md`](../../../AGENTS.md) §1 (**External Command Approval Required**):

- **NEVER** execute `git push` (or create a pull request) without explicit user review and approval.
- After `git commit` succeeds locally, propose the exact `git push` command (e.g., `git push origin <branch>`), summarize the commit(s) to be pushed, and wait for explicit user confirmation before executing it.
