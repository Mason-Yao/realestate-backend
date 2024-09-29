#!/usr/bin/env make
#CDK = "./node_modules/.bin/cdk"
CDK = "cdk"

# CI variables
ifeq ($(CRM_ENV), 'prod')
else
export CRM_DEV_USER = $(shell whoami)
endif

export AWS_ACCOUNT_ID = $(shell aws sts get-caller-identity --query "Account" --output text)

.PHONY: init
init: 
	@$(CDK) bootstrap aws://${AWS_ACCOUNT_ID}/ap-southeast-2

.PHONY: build
build: 
	@npm install
	@npm run build

.PHONY: test
test: 
# Doesn't work, will try later TODO:
#	@echo "Install test required libs"
#	@sudo apt-get update
#	@sudo apt-get install libssl-dev
#	@sudo apt install openssl
#	@echo "Running unit testing ..."
#	@npm run test:mock
	@echo "Running integration testing ..."
	@npm run test:integration

.PHONY: diff
diff:
	@$(CDK) diff --exclusively

.PHONY: deploy
deploy: build
	@$(CDK) deploy --exclusively --require-approval never

.PHONY: destroy
destroy: build 
	$(CDK) destroy --force --exclusively

.PHONY: clean
clean: 
	rm -rf ./node_modules
	rm -rf ./build

.PHONY: lint_fix
lint_fix:
	@npm run lint:fix