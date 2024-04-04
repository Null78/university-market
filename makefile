default: app-shell

# Variables
DOCKER_COMPOSE_V1_EXIT_CODE=$(shell docker-compose >/dev/null 2>&1; echo $$?)

# Targets
app-shell:
	docker exec -it app sh

up:
	$(call compose,up,-d)

migrate:
	docker exec -it app npx prisma migrate dev

generate:
	docker exec -it app npx prisma generate

reset-db:
	docker exec -it app npx prisma db push --force-reset

studio:
	docker exec -it app npx prisma studio

up-rebuild:
	$(call compose,up,-d --build)

up-recreate:
	$(call compose,up,-d --force-recreate)

down:
	$(call compose,down)

stop:
	$(call compose,stop)

app-logs:
	$(call compose,logs,-f app)

install:
	docker exec -it app npm install

clean:
	rm -rf ./node_modules
	rm -rf ./.next

# Functions
define colorecho
      @tput setaf $2
      @echo $1
      @tput sgr0
endef

define compose
	if [ "$(DOCKER_COMPOSE_V1_EXIT_CODE)" = "0" ]; then\
		docker-compose $1 $2 $3;\
	else\
		docker compose $1 $2 $3;\
	fi
endef
