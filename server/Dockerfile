FROM node:20-alpine
WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --silent

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 4000

ENV NODE_ENV=production

CMD ["node", "dist/src/index.js"]
