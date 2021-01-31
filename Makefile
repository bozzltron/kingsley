build:
	docker build -t kingsley .

run:
	docker run -i --device /dev/snd:/dev/snd kingsley