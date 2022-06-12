build:
	docker build -t kingsley .

run-mac:
	docker run -i --device /dev/snd:/dev/snd kingsley
	
run-linux:
	docker run -i --device /dev/snd:/dev/snd kingsley

export:
	mongoexport --collection=memory --db=kingsley --out=memory.json