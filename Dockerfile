# ---- Stage 1: build the Angular frontend into static files ----
FROM node:24-alpine AS frontend-build

WORKDIR /frontend

# Install deps first so this layer is cached unless package*.json changes
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ .
RUN npm run build

# ---- Stage 2: Python/FastAPI runtime (same base + port as before) ----
FROM python:3.8-slim-bullseye

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir gunicorn -r requirements.txt

# Only the backend paths actually needed at runtime -- no frontend source,
# no node_modules, ever end up in this image.
COPY main.py .
COPY src ./src
COPY artifacts ./artifacts

# Built Angular app, served by FastAPI's StaticFiles mount in main.py
COPY --from=frontend-build /frontend/dist/frontend/browser ./static

# Production-ready entry point binding to all interfaces on port 5000
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:5000", "main:app"]
