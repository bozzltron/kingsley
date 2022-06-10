FROM node:16
RUN apt-get update && apt-get install chromium -y
WORKDIR /usr/src/app
CMD ["npm", "start"]