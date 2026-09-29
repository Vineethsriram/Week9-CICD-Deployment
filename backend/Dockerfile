FROM node:20-alpine

# Patch OS packages (fixes OpenSSL findings)
RUN apk upgrade --no-cache

WORKDIR /app

# Reproducible, production-only dependency install
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# npm is only needed to install; remove it from the final image
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# Run as non-root user
RUN mkdir -p /app/data && chown -R node:node /app
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000',()=>process.exit(0)).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
