#!/usr/bin/env make

#.PHONY: build_frontend
#build_frontend:
#	$(MAKE) -C Frontend build

.PHONY: build_backend
build_backend:
	$(MAKE) -C Backend build

.PHONY: build
#build: build_frontend build_backend
build: build_backend  

.PHONY: test
test:
	$(MAKE) -C Backend test

.PHONY: deploy_backend
deploy_backend:
	$(MAKE) -C Backend deploy

#.PHONY: deploy_frontend
#deploy_frontend:
#	$(MAKE) -C Frontend deploy

.PHONY: release
#release: build_frontend build_backend deploy_backend deploy_frontend
release: build_backend deploy_backend

.PHONY: clean
clean: 
	$(MAKE) -C Backend clean
#	$(MAKE) -C Frontend clean

.PHONY: swagger
swagger:
	cd Docs/Swagger && npm run build && npm run start
