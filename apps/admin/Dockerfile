# syntax=docker/dockerfile:1

ARG NODE_VERSION=21.3.0
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app
FROM base as deps
RUN npm install -g pnpm
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=tsconfig.json,target=tsconfig.json \
    --mount=type=bind,source=nest-cli.json,target=nest-cli.json \
    --mount=type=cache,target=/root/.pnpm \
    pnpm install --ignore-scripts

FROM deps as build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=tsconfig.json,target=tsconfig.json \
    --mount=type=bind,source=nest-cli.json,target=nest-cli.json \
    --mount=type=cache,target=/root/.npm \
    pnpm install --ignore-scripts
COPY . .
RUN pnpm run build admin

FROM base as final
ENV NODE_ENV production
COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/. ./.
EXPOSE 3002
CMD ["node","dist/apps/admin/main"]
