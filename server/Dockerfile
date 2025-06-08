# Use Node.js LTS base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json or yarn.lock
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port your app runs on (adjust if needed)
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/server.js"]
