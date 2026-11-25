.PHONY: help start serve stop status test test-unit test-e2e lint check-syntax lint-rules check-repo format format-check check repchecks pre-commit pre-push install-hooks

help:
	@echo "Available commands:"
	@echo "  make start         - Start local web server in foreground on http://localhost:3000"
	@echo "  make serve         - Start local web server in background on http://localhost:3000"
	@echo "  make stop          - Stop background web server"
	@echo "  make status        - Check whether background web server is running"
	@echo "  make test-unit     - Run fast unit test suite (node test/unit-tests.js)"
	@echo "  make test-e2e      - Run headless Chrome integration suite (node test/run-headless.js)"
	@echo "  make test          - Run unit tests followed by headless E2E tests"
	@echo "  make check-syntax  - Run node -c syntax check on all non-lib JavaScript files"
	@echo "  make lint-rules    - Run CI-aware ast-grep structural rules scan"
	@echo "  make lint          - Run check-syntax, lint-rules, and optional ESLint"
	@echo "  make check-repo    - Run Markdown links, .agents/spec safety, and HTML CDN checks"
	@echo "  make format        - Format code and docs with Prettier (if installed)"
	@echo "  make format-check  - Check formatting with Prettier (if installed)"
	@echo "  make check         - Run full fast gate: lint, check-repo, format-check, test-unit"
	@echo "  make repchecks     - Alias for make check"
	@echo "  make pre-commit    - Execute staged pre-commit validation gates"
	@echo "  make pre-push      - Execute unit and headless E2E pre-push gates"
	@echo "  make install-hooks - Configure git core.hooksPath to .githooks/ and mark executable"

start:
	node server.js

serve:
	@if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then \
		echo "Server is already running on http://localhost:3000 (PID: $$(lsof -ti:3000))"; \
	else \
		nohup node server.js > server.log 2>&1 & echo $$! > .server.pid; \
		sleep 0.5; \
		echo "Server started in background on http://localhost:3000 (PID: $$(cat .server.pid), log: server.log)"; \
	fi

stop:
	@if [ -f .server.pid ] && kill -0 $$(cat .server.pid) 2>/dev/null; then \
		kill $$(cat .server.pid) 2>/dev/null && rm -f .server.pid && echo "Server stopped."; \
	elif lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then \
		kill $$(lsof -ti:3000) 2>/dev/null && rm -f .server.pid && echo "Server stopped on port 3000."; \
	else \
		rm -f .server.pid; \
		echo "No running server found on port 3000."; \
	fi

status:
	@if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then \
		echo "Server is RUNNING on http://localhost:3000 (PID: $$(lsof -ti:3000))"; \
	else \
		echo "Server is NOT running."; \
	fi

test-unit:
	node test/unit-tests.js

test-e2e:
	node test/run-headless.js

test: test-unit test-e2e

check-syntax:
	@echo "Checking JavaScript syntax..."
	find . -name "*.js" -not -path "*/node_modules/*" -not -path "*/lib/*" -exec node -c {} +
	@echo "✔ All JavaScript files syntax valid."

lint-rules:
	node scripts/lint-rules.js

lint: check-syntax lint-rules
	@if command -v eslint >/dev/null 2>&1; then \
		eslint . ; \
	elif [ -f node_modules/.bin/eslint ]; then \
		./node_modules/.bin/eslint . ; \
	else \
		echo "ℹ ESLint not installed locally; syntax + ast-grep checks passed."; \
	fi

check-repo:
	node scripts/check-repo.js

format:
	@if command -v prettier >/dev/null 2>&1; then \
		prettier --write . ; \
	elif [ -f node_modules/.bin/prettier ]; then \
		./node_modules/.bin/prettier --write . ; \
	else \
		echo "ℹ Prettier not installed locally; skipping format."; \
	fi

format-check:
	@if command -v prettier >/dev/null 2>&1; then \
		prettier --check . ; \
	elif [ -f node_modules/.bin/prettier ]; then \
		./node_modules/.bin/prettier --check . ; \
	else \
		echo "ℹ Prettier not installed locally; skipping format-check."; \
	fi

check: lint check-repo format-check test-unit
	@echo "✅ All deterministic checks passed!"

repchecks: check

pre-commit:
	.githooks/pre-commit

pre-push:
	.githooks/pre-push

install-hooks:
	git config core.hooksPath .githooks
	chmod +x .githooks/pre-commit .githooks/pre-push
	@echo "✔ Git hooks configured via .githooks/"
