# syntax=docker/dockerfile:1

# ------------------------------------------------------------
# Base
# ------------------------------------------------------------

FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app


# ------------------------------------------------------------
# Dependencies
# ------------------------------------------------------------

FROM base AS dependencies

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile


# ------------------------------------------------------------
# Build
# ------------------------------------------------------------

FROM base AS build

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN pnpm build


# ------------------------------------------------------------
# Production
# ------------------------------------------------------------

FROM node:22-alpine AS production

ENV NODE_ENV="production"
ENV HOST="0.0.0.0"
ENV PORT="3000"

WORKDIR /app

RUN addgroup --system --gid 1001 okaeri \
    && adduser --system --uid 1001 --ingroup okaeri okaeri

COPY --from=dependencies --chown=okaeri:okaeri /app/node_modules ./node_modules
COPY --from=build --chown=okaeri:okaeri /app/.output ./.output
COPY --from=build --chown=okaeri:okaeri /app/package.json ./package.json

COPY --from=build --chown=okaeri:okaeri /app/scripts/migrate.mjs ./scripts/migrate.mjs
COPY --from=build --chown=okaeri:okaeri \
    /app/src/domo/server/db/migrations \
    ./src/domo/server/db/migrations

RUN mkdir -p /app/data \
    && chown -R okaeri:okaeri /app/data

USER okaeri

EXPOSE 3000

CMD ["npm", "start"]