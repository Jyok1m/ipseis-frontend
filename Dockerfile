# ---------------------------------------------------------------------------
# Next.js 16 / Node 24 — build multi-stage, sortie `standalone`.
# Image finale : runtime seul (server.js + node_modules tracés + public),
# sans devDependencies, sans sources TS, sans cache npm.
# ---------------------------------------------------------------------------

FROM node:24-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- deps : couche cachée tant que package.json / package-lock.json ne bougent pas
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder
FROM base AS builder

# Active `output: "standalone"` dans next.config.mjs (ignoré hors Docker,
# pour ne pas changer le comportement du build Vercel).
ENV DOCKER_BUILD=1

# NEXT_PUBLIC_* : inlinées dans le bundle au build, elles doivent être connues
# ici. Ne restent que celles qui alimentent des pages prérendues (SEO, drapeau
# catalogue) — BACKEND_URL est passée au runtime, cf. le bloc `environment` du
# compose, ce qui rend l'image identique entre dev et prod.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_CATALOGUE_PDF_ENABLED=false
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_PUBLIC_CATALOGUE_PDF_ENABLED=${NEXT_PUBLIC_CATALOGUE_PDF_ENABLED}

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- runner
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

# `public/` est lu au runtime par src/lib/publicResources.ts (statSync sur
# public/pdf) : il doit être présent à côté de server.js, pas seulement tracé.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# On sonde /maintenance : seule route qui répond 200 dans les deux modes
# (MAINTENANCE_MODE=true fait répondre 503 à tout le reste via src/proxy.ts).
HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3000/maintenance >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
