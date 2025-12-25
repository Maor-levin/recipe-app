FROM node:20-alpine

WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start dev server (accessible from host)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
