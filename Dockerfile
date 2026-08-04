# Debian rather than Alpine: sharp runs on musl, but the prebuilt glibc binaries
# are the better-tested path and the size saving is not worth the risk here.
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# `prepare` runs `husky install`, which throws without a .git directory — and
# .dockerignore deliberately keeps .git out of the build context. Dropping the
# script is more honest than relying on `git` being absent from the slim image.
# node:22-bookworm-slim ships npm 10.9.8, but package-lock.json is written by
# npm 11 and npm 10 refuses it ("Missing: esbuild@0.28.1 from lock file").
# Pinning the same major keeps `npm ci` validating the exact committed tree
# instead of silently falling back to a looser install.
RUN npm install -g npm@11.17.0

COPY package.json package-lock.json ./
RUN npm pkg delete scripts.prepare && npm ci

COPY . .

# The build writes four gitignored artefacts into public/: search-index.json
# (pre-build), feed.xml and tags/*/feed.xml (side effects of getStaticProps),
# sitemap.xml (post-build). This is why the runner below copies public/ from
# this stage and never from the build context.
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder --chown=node:node /app/package.json /app/package-lock.json ./
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/next.config.js ./
COPY --from=builder --chown=node:node /app/data ./data
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder --chown=node:node /app/public ./public

# next/image optimises on demand and writes under .next/cache at runtime, so the
# app must own that tree — hence the --chown above rather than running as root.
USER node

EXPOSE 3000
CMD ["npm", "run", "serve"]
