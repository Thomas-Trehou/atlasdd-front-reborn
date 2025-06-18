# =========================================================================
# ÉTAPE 1: BUILDER - Compilation de l'application Angular avec Node.js 20
# =========================================================================
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
# On force le build en mode production pour s'assurer que les bons fichiers sont générés.
RUN npm run build -- --configuration production

# =========================================================================
# ÉTAPE 2: RUNTIME - Servir les fichiers statiques avec Nginx
# =========================================================================
FROM nginx:stable-alpine

# On copie notre fichier de configuration Nginx, qui est maintenant un template.
COPY nginx.conf /etc/nginx/templates/default.conf.template

# On copie LE CONTENU du dossier 'browser' directement dans la racine de Nginx.
# C'est la correction clé pour que Nginx trouve le bon index.html.
COPY --from=builder /usr/src/app/dist/atlasdd-app/browser/ /usr/share/nginx/html/

# ÉTAPE DE DÉBOGAGE : On liste le contenu du dossier pour vérifier que la copie a fonctionné.
# Vous verrez le résultat de cette commande dans les logs de build sur Heroku.
RUN ls -laR /usr/share/nginx/html/
