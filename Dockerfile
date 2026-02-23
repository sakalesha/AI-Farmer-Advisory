# Build Stage for Frontend
FROM node:20-slim AS build
WORKDIR /app
COPY client/package*.json ./client/
RUN npm install --prefix client
COPY client/ ./client/
RUN npm run build --prefix client

# Final Stage: Unified Node + Python Environment
FROM node:20-slim
WORKDIR /app

# Install Python and essential build tools
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Copy Root dependencies and install Node.js modules
COPY package*.json ./
RUN npm install

# Copy Python requirements and install
COPY requirements.txt ./
# We use a venv to avoid system package conflicts
RUN python3 -m venv /app/venv
ENV PATH="/app/venv/bin:$PATH"
RUN pip install --no-cache-dir -r requirements.txt

# Copy built frontend from Stage 1
COPY --from=build /app/client/dist ./dist

# Copy API and models
COPY api/ ./api/

# Copy entrypoint script
COPY start.sh ./
RUN chmod +x start.sh

# Expose Node.js port
EXPOSE 5000

# Start services
CMD ["./start.sh"]
