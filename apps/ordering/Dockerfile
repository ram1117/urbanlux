# syntax=docker/dockerfile:1

ARG NODE_VERSION=21.3.0
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app
FROM base as deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=bind,source=tsconfig.json,target=tsconfig.json \
    --mount=type=bind,source=nest-cli.json,target=nest-cli.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --ignore-scripts

FROM deps as build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=bind,source=tsconfig.json,target=tsconfig.json \
    --mount=type=bind,source=nest-cli.json,target=nest-cli.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build ordering

FROM base as final
ENV NODE_ENV production
COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/. ./.
EXPOSE 3003
CMD ["node","dist/apps/ordering/main"]
