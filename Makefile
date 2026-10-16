.PHONY: help start test lint check-syntax lint-rules pre-commit install-hooks

help:
	@echo "Available commands:"
	@echo "  make start         - Start local web server on http://localhost:3000"
	@echo "  make test          - Run headless browser integration test suite"
	@echo "  make lint          - Run JavaScript syntax check and ESLint"
	@echo "  make lint-rules    - Scan codebase using ast-grep structural rules"
	@echo "  make pre-commit    - Execute staged pre-commit validation gates"
	@echo "  make install-hooks - Configure git to use repository pre-commit hooks"

start:
	node server.js

test:
	node test/run-headless.js

lint: check-syntax
	@if command -v eslint >/dev/null 2>&1; then \
		eslint . ; \
	elif [ -f node_modules/.bin/eslint ]; then \
		./node_modules/.bin/eslint . ; \
	else \
		echo "ESLint not installed locally. Syntax check passed."; \
	fi

check-syntax:
	@echo "Checking JavaScript syntax..."
	find . -name "*.js" -not -path "*/node_modules/*" -not -path "*/lib/*" -exec node -c {} +
	@echo "✔ All JavaScript files syntax valid."

lint-rules:
	@echo "Scanning with ast-grep..."
	ast-grep scan --globs '!**/lib/**'

pre-commit:
	.githooks/pre-commit

install-hooks:
	git config core.hooksPath .githooks
	chmod +x .githooks/pre-commit
	@echo "✔ Git hooks configured via .githooks/"
