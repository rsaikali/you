.PHONY: up down logs open build deploy push record

up:
	docker compose up -d
	bash scripts/provision.sh

build:
	docker compose -f docker-compose.yml build

deploy:
	git pull origin main
	docker compose -f docker-compose.yml up -d umami-db umami
	docker compose -f docker-compose.yml build caddy
	docker compose -f docker-compose.yml up -d --no-deps caddy
	bash scripts/provision.sh

push:
	@test -n "$(PI)" || (echo "Usage: make push PI=192.168.x.x [USER=pi]" && exit 1)
	bash scripts/push.sh $(PI) $(or $(USER),pi)

down:
	docker compose down

logs:
	docker compose logs -f

record:
	node scripts/record-demo.js

