# Stage 0: Install the base dependencies
FROM node:20.11.1-alpine3.18@sha256:876514790dabd49fae7d9c4dfbba027954bd91d8e7d36da76334466533bc6b0c AS dependencies

# Use /app as the working directory
WORKDIR /app 

# Copy package.json, package-lock.json 
COPY package* .
# Install the dependencies
RUN npm ci

######################################################

# Stage 1: Use the dependencies to build the site
FROM node:20.11.1-alpine3.18@sha256:876514790dabd49fae7d9c4dfbba027954bd91d8e7d36da76334466533bc6b0c AS builder

# Use /app as the working directory
WORKDIR /app 

# Copy cached dependencies from previous stage so we don't have to download
COPY --from=dependencies /app /app
# Copy source code into the image
COPY . .
# Build the site to dist/
RUN npm run build

######################################################

FROM nginx:stable-alpine3.17@sha256:da6de168bfdfc800a432708eb2951c86b0f860aab547523a248f2ccd3b4ee4b6 AS deploy

# Create the labels with image metadata
LABEL maintainer="Arina Kolodeznikova" \
      description="Testing UI for fragments microservice."

# Put our dist/ into /usr/share/nginx/html/ and host static files
COPY --from=builder app/dist /usr/share/nginx/html/

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --fail localhost:80 || exit 1