build:
	docker build -t kingsley .

deploy-frontend:
	npm run build
	gcloud config set account mtbosworth@gmail.com
	gsutil rsync -R dist gs://kingsley-frontend
	gcloud config set account mbosworth@gridrival.com

export:
	mongoexport --collection=memory --db=kingsley --out=memory.json