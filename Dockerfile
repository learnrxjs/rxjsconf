FROM node:18-alpine as builder
LABEL maintainer="Sam Bulatov<mephistorine@gmail.com>"

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm i -g pnpm

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . ./

RUN SUPABASE_URL=$(echo $SUPABASE_URL) SUPABASE_KEY=$(echo $SUPABASE_KEY) pnpm run build

FROM nginx:alpine

COPY ./misc/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./misc/ssl /etc/nginx/certificates

COPY --from=builder /app/dist /usr/share/nginx/html
