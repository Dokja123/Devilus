# Utiliser une image Node.js officielle comme base
FROM node:16-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier le fichier package.json et package-lock.json pour installer les dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le reste du projet dans le conteneur
COPY . .

# Exposer le port (si votre bot utilise un port, par exemple pour une interface web)
# Sinon, vous pouvez ignorer cette ligne
EXPOSE 3000

# Définir la commande de démarrage
CMD ["node", "index.js"]