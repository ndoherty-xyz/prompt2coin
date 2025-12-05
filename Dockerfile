# Fetching the minified node image on apline linux
FROM node:22-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Declaring env
ENV NODE_ENV=production

# Next.js on railway doesn't include .env at build time, need to copy some env vars
ARG NEXT_PUBLIC_ZORA_API_KEY
ENV NEXT_PUBLIC_ZORA_API_KEY $NEXT_PUBLIC_ZORA_API_KEY
ARG NEXT_PUBLIC_BASE_RPC_URL
ENV NEXT_PUBLIC_BASE_RPC_URL $NEXT_PUBLIC_BASE_RPC_URL
ARG NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
ENV NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID $NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
ARG RAILWAY_BUCKET_ENDPOINT
ENV RAILWAY_BUCKET_ENDPOINT $RAILWAY_BUCKET_ENDPOINT
ARG RAILWAY_BUCKET_REGION
ENV RAILWAY_BUCKET_REGION $RAILWAY_BUCKET_REGION
ARG RAILWAY_BUCKET_NAME
ENV RAILWAY_BUCKET_NAME $RAILWAY_BUCKET_NAME
ARG RAILWAY_BUCKET_ACCESS_KEY_ID
ENV RAILWAY_BUCKET_ACCESS_KEY_ID $RAILWAY_BUCKET_ACCESS_KEY_ID
ARG RAILWAY_BUCKET_SECRET_ACCESS_KEY
ENV RAILWAY_BUCKET_SECRET_ACCESS_KEY $RAILWAY_BUCKET_SECRET_ACCESS_KEY
ARG PUBLIC_BUCKET_PROXY_URL
ENV PUBLIC_BUCKET_PROXY_URL $PUBLIC_BUCKET_PROXY_URL

# Setting up the work directory
WORKDIR /app

# Copy the package.json, and yarn.lock files
COPY . .

# Installing dependencies
RUN pnpm install --production=false

# Add sharp from alpine image for nextjs image optimization
RUN pnpm add sharp --production=false

# Add server external packages (issue linked in next config)
RUN pnpm install pino@7.11.0 thread-stream@0.15.2 --save-exact

# Build the web app
RUN pnpm build

# Set port provided by railway
ARG PORT

# Expose the port 
EXPOSE $PORT

CMD ["sh", "-c", "sleep 3 && pnpm start"]