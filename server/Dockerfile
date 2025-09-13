# ---- Base build/runtime image ----
    FROM node:20-alpine AS base
    WORKDIR /happyhourspot
    
    # Install curl for healthcheck inside the container
    RUN apk add --no-cache curl
    
    # ---- Dependencies layer (cached) ----
    FROM base AS deps
    COPY package.json package-lock.json* ./
    # Install production deps; if you compile TS, do full install here and build later
    RUN npm ci --omit=dev
    
    # ---- Build layer (optional for TS / transpile) ----
    # If your server is plain JS, you can skip building and copy src directly in the final stage.
    # For TypeScript, uncomment below and ensure you have a build script.
    # FROM base AS build
    # COPY package.json package-lock.json* tsconfig.json ./
    # RUN npm ci
    # COPY ./src ./src
    # RUN npm run build  # outputs to /app/dist (for example)
    
    # ---- Final runtime ----
    FROM base AS runtime
    ENV NODE_ENV=development
    USER node
    # Copy only node_modules from deps
    COPY --from=deps /happyhourspot/node_modules /happyhourspot/node_modules
    
    # Copy app source (for JS). For TS builds, copy compiled /app/dist instead.
    COPY --chown=node:node . .
    
    # If your server reads .env at runtime, mount it via compose; don’t bake secrets into the image.
    # EXPOSE the app port
    EXPOSE 5000
    
    # Health endpoint (match compose: /health)
    # Your app should serve GET /health -> 200 OK
    CMD ["node", "src/index.js"]
    