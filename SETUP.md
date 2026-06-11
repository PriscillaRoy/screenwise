# Screenwise Frontend — Session 9 File Drop

## Files to copy into your repo

```
screenwise/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  ← replace existing
│   │   ├── page.tsx                    ← replace existing (Browse page)
│   │   ├── search/
│   │   │   └── page.tsx                ← new
│   │   ├── movie/
│   │   │   └── [id]/
│   │   │       └── page.tsx            ← new
│   │   ├── login/
│   │   │   └── page.tsx                ← new
│   │   └── profile/
│   │       └── page.tsx                ← new
│   ├── components/
│   │   ├── NavBar.tsx                  ← replace existing
│   │   ├── MovieCard.tsx               ← new
│   │   ├── MovieGrid.tsx               ← new
│   │   ├── SearchBar.tsx               ← new
│   │   └── AuthForm.tsx                ← new
│   ├── lib/
│   │   ├── types.ts                    ← already done (update SimilarResponse)
│   │   └── api.ts                      ← already done
│   └── context/
│       └── AuthContext.tsx             ← already done
```

## Shell commands to set up directories

```bash
cd screenwise
mkdir -p src/app/search
mkdir -p src/app/movie/\[id\]
mkdir -p src/app/login
mkdir -p src/app/profile
mkdir -p src/components
```

## After copying all files

```bash
npm run dev
```

## Test checklist

- [ ] localhost:3000 — Browse page loads, hero + genre filters visible
- [ ] localhost:3000/search — SearchBar visible, try "psychological thriller"
- [ ] localhost:3000/login — AuthForm renders, signin works
- [ ] localhost:3000/profile — redirects to /login if not signed in
- [ ] Click a movie card → goes to /movie/[id] → similar movies load
- [ ] Sign in → username shows in NavBar → profile accessible

## Known limitations (Phase 2)

- Browse page uses semantic search as a proxy (no GET /movies endpoint yet)
  → Add GET /movies?genre=... to backend for proper browsing
- Profile ratings/history are placeholders
  → Wire up POST /ratings and GET /ratings when ready
- Movie detail page shows title only (no description/poster)
  → Add GET /movies/{id} to backend to fetch full movie data
