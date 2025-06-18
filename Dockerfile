# =========================================================================
# ÉTAPE 1: BUILDER - Compilation de l'application Angular avec Node.js 20
# =========================================================================
# On utilise une image Node.js officielle et légère (alpine) correspondant à votre version.
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# =========================================================================
# ÉTAPE 2: RUNTIME - Servir les fichiers statiques avec Nginx
# =========================================================================
# On part d'une image Nginx officielle, très légère et performante pour servir des fichiers statiques.
FROM nginx:stable-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/dist/atlasdd-app /usr/share/nginx/html

EXPOSE 80
