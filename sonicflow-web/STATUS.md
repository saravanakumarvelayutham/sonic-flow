# SonicFlow Project Status (March 1, 2026)

## Current Snapshot
SonicFlow is now in a **working MVP state** with clean code quality checks and running Docker services.

- ✅ `npm run lint` passes with no warnings/errors
- ✅ `npm run build` passes
- ✅ Docker stack runs successfully (`sonicflow-web` + `postgres`)
- ✅ Host port mapping is conflict-safe by default:
	- Web: `3110 -> 3000`
	- Postgres: `5433 -> 5432`
- ✅ Provider UI now uses **Amazon Music, Apple Music, YouTube Music** (Spotify removed from user-facing flows)

## Completed Work

### Platform and Quality
- Next.js 16 + React 19 + TypeScript + Tailwind CSS configured and building
- Lint/type issues cleaned up across app routes, API routes, and components
- React purity/effect issues fixed (no impure calls during render)

### Core Product Areas
- Landing page and navigation complete
- Auth selection and onboarding flows implemented
- Library pages (`/library`, `/library/add`) implemented
- AI playlist generation UI page implemented (`/ai/generate`)

### API Surface Implemented
- Auth routes for Apple, YouTube, Amazon callback/logout/refresh flows
- Song routes:
	- `/api/songs`
	- `/api/songs/[id]`
	- `/api/songs/seed`
	- `/api/songs/sync`
	- `/api/songs/recommend`
- User preferences route:
	- `/api/user/preferences`

### DevOps / Runtime
- Docker compose updated to avoid host-port conflicts
- Production container runtime fixed (removed bind-mount conflict that caused `next: not found`)
- Services verified reachable on `http://localhost:3110`

## What’s Remaining

### 1) Real Provider Integrations (High Priority)
- Replace simulated/provider-placeholder behavior with fully validated OAuth flows end-to-end
- Confirm provider-specific token exchange/refresh behavior against real credentials
- Add robust handling for provider API rate limits, token failures, and partial sync failures

### 2) Persistent Data Layer (High Priority)
- Move song library and preference storage from cookie/in-memory patterns to PostgreSQL
- Add migrations/schema for users, sessions, providers, songs, playlists, preferences
- Add repository/service layer for DB access

### 3) Production-Grade Auth & Session Security (High Priority)
- Tighten cookie/session strategy (secure, expiration, rotation, invalidation)
- Remove any remaining dev-oriented fallback logic
- Add server-side validation around user/session ownership for all routes

### 4) AI Backend Integration (Medium Priority)
- Replace mock recommendation/playlist generation with real model-backed API integration
- Persist generated playlists and generation metadata
- Add guardrails and request validation for prompt inputs

### 5) Testing & CI (Medium Priority)
- Add automated test coverage (unit + route integration + smoke)
- Add CI pipeline for lint, typecheck, build, and tests on every PR

### 6) Documentation Refresh (Medium Priority)
- Update `README.md` with current runtime ports (`3110`, `5433`), Docker workflow, and env vars
- Document required provider env vars and local setup steps
- Align `ROADMAP.md` with implemented features

## Recommended Next Milestone
**Milestone: “Production-ready data + auth backend”**

Scope:
1. PostgreSQL-backed persistence for songs/sessions/preferences
2. Hardened OAuth session management
3. Real provider sync validation for Amazon/Apple/YouTube

Expected outcome: move from MVP demo behavior to a stable multi-user backend foundation.