FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy tsconfig.json and source code
COPY tsconfig.json ./
COPY src ./src
COPY config ./config

# Build TypeScript code
RUN npm run build || (echo "❌ TypeScript build failed!" && exit 1)

EXPOSE 3000

CMD ["npm", "start"]
