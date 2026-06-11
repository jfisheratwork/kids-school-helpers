.PHONY: start test

start:
	node server.js

test:
	node test/run-headless.js
