# ---- Stage 1: Base image ----
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy rest of the code
COPY . .

# Expose API port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
