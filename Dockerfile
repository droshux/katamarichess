FROM oven/bun:1 AS base
WORKDIR /usr/src/app


COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile # --production

COPY . .

ENV NODE_ENV=production
RUN bun run build
RUN bun install http-server


USER bun
EXPOSE 8080
CMD [ "bunx", "http-server", "dist/" ]
