build:
	docker build -t kingsley .

deploy-frontend:
	npm run build
	gsutil rsync -R dist gs://kingsley-frontend

export:
	mongoexport --collection=memory --db=kingsley --out=memory.json