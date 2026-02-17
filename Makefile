.PHONY: build clean run up

help:
	@echo "Available commands:"
	@echo "  make build      - Build the Docker image"
	@echo "  make up         - Run the container, starts the virtual browser"
	@echo "  make run        - Starts the autocomplete agent"

DOCKER_COMPOSE = docker-compose

build:
	$(DOCKER_COMPOSE) build --no-cache

clean:
	$(DOCKER_COMPOSE) down -v --rmi all

run:
	$(DOCKER_COMPOSE) exec app npx -y tsx src/_internal/run.ts

up:
	docker compose up -d
	@echo "-------------------------------------------------------"
	@echo "View the browser here: http://localhost:6080"
	@echo "Use 'make run' to start the autocomplete agent"
	@echo "-------------------------------------------------------"
