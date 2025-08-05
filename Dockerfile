# Multi-stage build to minimize final image size
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runtime

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S youtrack -u 1001

# Set working directory
WORKDIR /app

# Copy built application and dependencies from builder stage
COPY --from=builder --chown=youtrack:nodejs /app/build ./build
COPY --from=builder --chown=youtrack:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=youtrack:nodejs /app/package.json ./

# Switch to non-root user
USER youtrack

# Expose port (if needed for health checks)
EXPOSE 3000

# Set entrypoint
ENTRYPOINT ["node", "build/index.js"] 