FROM denoland/deno:1.10.3

# USER root

# RUN  apt-get update \
#      && apt-get install -y wget gnupg ca-certificates procps libxss1 \
#      && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#      && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
#      && apt-get update \
#      # We install Chrome to get all the OS level dependencies, but Chrome itself
#      # is not actually used as it's packaged in the node puppeteer library.
#      # Alternatively, we could could include the entire dep list ourselves
#      # (https://github.com/puppeteer/puppeteer/blob/master/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix)
#      # but that seems too easy to get out of date.
#      && apt-get install -y google-chrome-stable \
#      && rm -rf /var/lib/apt/lists/* 

USER deno

# The port that your application listens to.
EXPOSE 1993

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally cache deps.ts will download and compile _all_ external files used in main.ts.
COPY deno/deps.ts .
RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
ADD deno .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts

CMD ["run", "--allow-net", "--allow-read", "--allow-env" "main.ts"]