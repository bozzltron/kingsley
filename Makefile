run:
	docker-compose down
	docker compose up

build:
	docker build -t kingsley .

deploy-frontend:
	npm run build
	gcloud config set account mtbosworth@gmail.com
	gsutil web set -m index.html gs://www.mydigitalassistant.ai
	gsutil rsync -R dist gs://www.mydigitalassistant.ai
	gcloud config set account mbosworth@gridrival.com

deno:
	deno cache deno/deps.ts
	deno run --allow-net --allow-env deno/main.ts

export:
	mongoexport --collection=memory --db=kingsley --out=memory.json

