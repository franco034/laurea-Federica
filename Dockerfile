FROM node:20-alpine

WORKDIR /app

# Installa solo le dipendenze
COPY package*.json ./
RUN npm install --omit=dev

# Copia i sorgenti del progetto
COPY . .

# Assicura le cartelle dati e caricamenti
RUN mkdir -p uploads data

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", "server.js"]
