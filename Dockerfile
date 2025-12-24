# Development Dockerfile for MeghOS Portfolio
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Start development server with host binding for Docker (no auto-open browser)
CMD ["pnpm", "dev", "--host", "0.0.0.0", "--open", "false"]
