# =========================================================================
# ÉTAPE 1: BUILDER - Compilation de l'application Angular avec Node.js 20
# =========================================================================
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# =========================================================================
# ÉTAPE 2: RUNTIME - Servir les fichiers statiques avec Nginx
# =========================================================================
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/templates/default.conf.template

COPY --from=builder /usr/src/app/dist/atlasdd-app /usr/share/nginx/html
