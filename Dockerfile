FROM oven/bun:1 AS base
WORKDIR /usr/src/app

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production
COPY . .


# run the app
USER bun
EXPOSE 3000/tcp
EXPOSE 8400
ENTRYPOINT [ "bun", "run", "serer.ts" ]


# docker build --pull -t bun-hello-world .
# docker run -d -p 3000:3000 bun-hello-world