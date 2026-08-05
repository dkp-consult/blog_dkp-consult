# Debian rather than Alpine: sharp runs on musl, but the prebuilt glibc binaries
# are the better-tested path and the size saving is not worth the risk here.
FROM node:22-bookworm-slim AS builder
WORKDIR /app

# node:22-bookworm-slim ships npm 10.9.8, but package-lock.json is written by
# npm 11 and npm 10 refuses it ("Missing: esbuild@0.28.1 from lock file").
# Pinning the same major keeps `npm ci` validating the exact committed tree
# instead of silently falling back to a looser install.
RUN npm install -g npm@11.17.0

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# The build writes four gitignored artefacts into public/: search-index.json
# (pre-build), feed.xml and tags/*/feed.xml (side effects of getStaticProps),
# sitemap.xml (post-build). This is why the runner below copies public/ from
# this stage and never from the build context.
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Standalone emits a server with only the traced dependencies, but it copies
# neither public/ nor .next/static — both have to be brought in by hand.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# next/image optimises on demand and writes under .next/cache at runtime, so the
# directory must exist and belong to the app rather than to root. This is also
# the mount point for the persistent cache volume.
RUN mkdir -p .next/cache && chown -R node:node .next
USER node

# server.js binds to the HOSTNAME env var; without it the container would only
# listen on localhost and be unreachable from outside.
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
