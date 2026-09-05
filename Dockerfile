FROM node:22-bookworm-slim AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --no-audit --legacy-peer-deps
COPY frontend/ ./

ENV VITE_API_URL=

ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=${VITE_CLERK_PUBLISHABLE_KEY}
RUN npm run build

FROM node:22-bookworm-slim AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --no-audit --legacy-peer-deps
COPY backend/ ./
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY backend/package*.json ./
RUN npm install --no-audit --omit=dev --no-fund && npm cache clean --force

COPY --from=backend-build /app/dist ./dist  
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 3001
USER node

CMD ["node", "dist/index.js"]