FROM python:3
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/
RUN sudo apt-get update && sudo apt-get install -y alsa-base alsa-utils
RUN pip install virtualenv && virtualenv /usr/src/.venv && \
   /usr/src/.venv/bin/pip install -Ur requirements.txt

COPY . /usr/src/app/
ENTRYPOINT /usr/src/app/run.sh
