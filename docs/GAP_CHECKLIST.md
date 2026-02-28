# PJAZZA — Gap Checklist & What's Missing

Audit vs BUILD_PHASES + SCOPING Definition of Done. Domain: **www.maltaverse.live**.

---

## ✅ Phases 0–11 — DONE (code complete)

All build phases 0–11 are implemented in code. Features are built.

---

## ⏳ Phase 11.5 — Deployment & Testing (IN PROGRESS)

| Task | Status | Notes |
|------|--------|-------|
| Build succeeds | ✅ | `npm run build` passes |
| vercel.json | ✅ | Added |
| run_015_to_020.sql | ✅ | Single file for migrations 015–020 |
| **Supabase: Run migrations** | ⬜ | Open SQL Editor → paste `run_015_to_020.sql` → Run |
| **Supabase: Auth URLs** | ✅ | You set Site URL + Redirect URLs for www.maltaverse.live |
| Supabase: Redirect URLs wildcard | ⬜ | Ensure `https://www.maltaverse.live/**` (not just `/`) |
| **Vercel: Connect repo** | ⬜ | Import Git → Vercel |
| **Vercel: Env vars** | ⬜ | Add all from .env.example |
| **Vercel: Deploy** | ⬜ | Trigger deploy |
| **Vercel: Custom domain** | ⬜ | Add www.maltaverse.live |
| Test: /api/health | ⬜ | 200, db reachable |
| Test: /discover | ⬜ | Businesses load |
| Test: /search?q=restaurant | ⬜ | Results |
| Test: Auth sign-in | ⬜ | Redirect works |

---

## ⬜ Phase 12 / V1 Definition of Done — GAPS

### Infrastructure
| Item | Status | Notes |
|------|--------|-------|
| PWA deployed | ⬜ | Deploy to Vercel at www.maltaverse.live |
| Supabase production schema | ⬜ | Run migrations 015–020 (and 001–014 if not done) |
| Stripe Connect live | ⬜ | Switch from test to live mode when ready |
| LiveKit streaming | ⬜ | Verify room creation + stream works |
| SSL, domain, DNS | ⬜ | Vercel handles SSL; point www.maltaverse.live to Vercel |

### Env / Config
| Item | Status | Notes |
|------|--------|-------|
| **NEXT_PUBLIC_SITE_URL** | ⬜ | Set to `https://www.maltaverse.live` in Vercel (and .env.local for prod) |

### Legal (code exists, verify content)
| Item | Status | Notes |
|------|--------|-------|
| Privacy Policy | ✅ | `/pjazza/legal/privacy` |
| Terms of Service | ✅ | `/pjazza/legal/terms` |
| Cookies | ✅ | `/pjazza/legal/cookies` |

### Business Operations (manual / post-launch)
| Item | Status | Notes |
|------|--------|-------|
| 50 businesses listed | ⬜ | Seed/onboard manually |
| 10 businesses have streamed | ⬜ | Post-launch |
| 5 transactions through Stripe | ⬜ | Post-launch |
| PJAZZA commission on ≥3 txns | ⬜ | Post-launch |

### E2E Verification (manual testing)
| Flow | Status | Notes |
|------|--------|-------|
| Consumer: browse → book table → escrow | ⬜ | Manual E2E |
| Consumer: browse product → buy → photo verify → approve | ⬜ | Manual E2E |
| Consumer: video-call shop → buy | ⬜ | Manual E2E |
| Business: sign up → go live → receive booking | ⬜ | Manual E2E |
| Crowd intelligence for ≥10 businesses | ⬜ | Run POST /api/admin/set-crowd to seed |
| Search returns results | ✅ | Built; verify after deploy |

---

## Action List (priority order)

1. **Run migrations** — Supabase SQL Editor → paste `supabase/migrations/run_015_to_020.sql` → Run
2. **Supabase Auth** — Redirect URLs: use `https://www.maltaverse.live/**` and `http://localhost:3000/**`
3. **Vercel** — Connect repo, add env vars, deploy, add domain www.maltaverse.live
4. **Env** — Set `NEXT_PUBLIC_SITE_URL=https://www.maltaverse.live` in Vercel
5. **Test** — Visit https://www.maltaverse.live/api/health, /discover, /search, sign-in
6. **Crowd data** — POST /api/admin/set-crowd?secret=... with `{ all: true, crowd_pct: 50 }`

---

## Summary: What's Missing

- **Supabase:** Run run_015_to_020.sql; verify Redirect URLs use `/**`
- **Vercel:** Connect, env vars, deploy, domain
- **NEXT_PUBLIC_SITE_URL:** Set to https://www.maltaverse.live
- **Testing:** E2E on deployed site
- **Post-launch:** 50 businesses, 10 streams, 5 transactions (operational)
