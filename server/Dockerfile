# Use official Node.js LTS image
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy entire src folder (which includes config if it's inside src)
COPY src ./src

RUN npm run build || (echo "❌ TypeScript build failed!" && exit 1)

EXPOSE 3000

CMD ["node", "dist/server.js"]
