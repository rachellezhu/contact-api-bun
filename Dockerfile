FROM oven/bun:latest AS base
RUN apt-get update && apt-get install -y openssl

# Dev stage
FROM base AS dev
WORKDIR /app
COPY bun.lock package.json ./
COPY prisma ./prisma

FROM dev AS test
WORKDIR /app
RUN bun install \
    bunx prisma generate \
    bunx prisma migrate dev --name init
ENV NODE_ENV=development
ENV DATABASE_URL=mysql://root:examplepassword@contact-api-bun-db:3306/contact_api
COPY . .
RUN bun test

# Prod stage
FROM dev AS prod
WORKDIR /app
RUN bun install \
    bunx prisma generate \
    bunx prisma migrate dev --name init
COPY . .
RUN bun build --compile --minify --sourcemap ./src --outfile contact-api-bun

FROM prod AS runner
ENV NODE_ENV=production
ARG BUILD_APP_PORT=3000
ENV APP_PORT=${BUILD_APP_PORT}
EXPOSE ${APP_PORT}
WORKDIR /app
COPY --from=prod /app/contact-api-bun .
ENTRYPOINT [ "./contact-api-bun" ]
# FROM oven/bun:latest AS prod-deps
# WORKDIR /app
# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=bun.lock,target=bun.lock \
#     --mount=type=cache,target=/tmp/cache \
#     bun install --production --frozen-lockfile --verbose

# FROM oven/bun:latest as dev-deps
# WORKDIR /app
# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=bun.lock,target=bun.lock \
#     --mount=type=cache,target=/tmp/cache \
#     bun install


# COPY . .

# RUN bunx prisma generate

# ENV DATABASE_URL=mysql://root:examplepassword@contact-api-bun-db:3306/contact_api

# RUN bun build src/index.ts --compile --outfile contact-api

# EXPOSE 3000

# CMD ["./contact-api"]
