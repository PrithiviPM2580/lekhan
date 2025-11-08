# Base Image
FROM node:20-alpine AS base

WORKDIR /app

#Install pnpm globally 
RUN npm install -g pnpm

# Copy Dependencies (for caching)
COPY /pnpm-lock.yaml package.json ./

# Dependencies Layer
FROM base AS build
COPY . .
RUN pnpm run build

# Runtime Layer
FROM node:20-alpine AS runner
WORKDIR /app

# Copy only necessary build output
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Environment Setup
ENV NODE_ENV=production
EXPOSE 3000