.PHONY: help
.DEFAULT_GOAL := help

help: ## Display callable targets.
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | sort | \
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

require-%:
	@command -v $(@:require-%=%) > /dev/null || { echo "$(@:require-%=%) not found in path"; exit 1; }

install: ## Install node packages
	@echo "--> Installing node packages"
	@npm install

lint: ## Lint code.
	@echo "--> Running eslint"
	@npm run lint
	@echo "--> Formatting code"
	@npm run prettier

run: ## Runserver.
	@echo "--> Running the local server"
	@npm run dev

prepare: ## Install husky
	@echo "--> Installing husky"
	@npm run prepare
