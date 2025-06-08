# Use Node.js LTS base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Show files to verify src/ and tsconfig.json exist
RUN echo "Verifying build context..." && \
    ls -la && \
    ls -la src && \
    cat tsconfig.json

# Build TypeScript code (with fail-fast if build fails)
RUN npm run build || (echo "❌ TypeScript build failed!" && exit 1)

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/server.js"]
