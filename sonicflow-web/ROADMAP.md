# SonicFlow Development Roadmap

## Phase 1: Authentication & Core APIs ✅ COMPLETE

### Done ✅
- [x] Project setup with Next.js + TypeScript + Tailwind
- [x] Type definitions (types/index.ts)
- [x] Landing page (main dashboard)
- [x] Auth choice page
- [x] Project structure

### Next: Authentication APIs 🚧
```bash
# Create these API routes
src/app/api/auth/apple/route.ts
src/app/api/auth/youtube/route.ts
src/app/api/auth/amazon/route.ts

# Required for:
- OAuth flow
- Token exchange
- User authentication
- Library sync
```

## Phase 2: Core Music Library APIs ⏳ NEXT

### 1. Single Song Fetching
```typescript
GET /api/songs/sync

// Sync songs from connected services
- Apple Music sync
- YouTube Music sync
- Amazon Music sync
```

### 2. Song Retrieval by Source
```typescript
GET /api/songs/seed?type=[apple|youtube|amazon]

// Returns songs by source for seeding
- Random songs from selected service
- Search functionality
```

### 3. Song Retrieval
```typescript
GET /api/songs?provider=apple

// Get songs by provider
- Search by metadata
- Pagination
```

### 4. User Preferences
```typescript
GET /api/preferences
POST /api/preferences/
PUT /api/preferences/

// Management of user AI preferences
- Style selection
- Mood settings
```

## Phase 3: UI Components to Build ⏳

### Component: MusicCard
```typescript
src/components/MusicCard.tsx
props: song: Song
- Cover image
- Song metadata
- Play button
- Add to favorites
```

### Component: Player
```typescript
src/components/Player.tsx
- Play/pause controls
- Progress bar
- Volume control
- Current song display
```

### Component: Library
```typescript
src/components/Library.tsx
- Sidebar navigation
- Track list
- Filter options
```

### Component: Visualizer
```typescript
src/components/Visualizer.tsx
- Canvas-based audio visualization
- Wave form display
- Multiple animation modes
```

## Phase 4: AI Integration ⏳

### Component: AIPreferencesForm
```typescript
src/components/AIPreferencesForm.tsx
// AI Preference Engine UI
- Style selection (Chill, Energetic, Mixed)
- Mood selector (Focused, Relaxed, Party, Motivated)
- Genre preferences
- Weekly prompt selection
```

### Feature: Playlist Generation
```typescript
src/app/api/ai/generate/route.ts

// AI playlist generation
POST /api/ai/generate
{
  "prompt": "Create a focused work playlist",
  "preferenceId": "user-pref-id"
}

Response:
{
  "playlist": GeneratedPlaylist
}
```

## Implementation Priority

1. **Start Here**: Complete Phase 1 authentication APIs
2. **Then**: Core music library API endpoints
3. **Next**: Build interactive UI components
4. **Finally**: Add AI-powered playlist generation

# Dependencies to Add
```bash
npm install lucide-react
npm install --save-dev @types/lucide-react
npm install @stripe/stripe-js
```