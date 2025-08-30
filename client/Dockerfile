# ---- Build stage ----
    FROM node:20-alpine AS build
    WORKDIR /app
    
    # Avoid root-owned node_modules when running locally with bind mounts
    ENV CI=true
    
    # Install deps first (better layer caching)
    COPY package.json package-lock.json* ./
    RUN npm ci
    
    # Build the app
    COPY . .
    # If your Vite app needs an API base path, set it at build time, e.g.:
    #   docker build --build-arg VITE_API_URL=/api -t your-image .
    ARG VITE_API_URL
    ENV VITE_API_URL=${VITE_API_URL}
    RUN npm run build
    
    # ---- Runtime stage (Nginx) ----
    FROM nginx:1.25-alpine AS runtime
    # Install curl so Compose healthcheck works
    RUN apk add --no-cache curl
    
    # Copy our SPA nginx config (handles history API fallback)
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    # Copy static build
    COPY --from=build /app/dist /usr/share/nginx/html
    
    EXPOSE 80
    STOPSIGNAL SIGQUIT
    
    CMD ["nginx", "-g", "daemon off;"]
    