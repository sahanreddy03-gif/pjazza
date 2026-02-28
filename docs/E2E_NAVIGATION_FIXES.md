# E2E Navigation Fixes

End-to-end flow audit and fixes for dead ends and broken entry/exit points.

---

## Fixes Applied

### 1. Root Fork (Consumer/Business)
- **Before:** Root `/` redirected straight to `/pjazza` — consumer routes were unreachable
- **After:** Root shows splash with two CTAs:
  - "I'm a customer" → `/discover` (consumer browse)
  - "I'm a business" → `/pjazza` (business landing)
- Matches SCOPING: "Splash screen with Consumer/Business fork | First interaction. Determines UI mode."

### 2. Shop Page (Consumer)
- **Before:** "Coming soon" — dead end
- **After:** "Browse Live Shop" button → `/pjazza/live-shop`

### 3. Services Page (Consumer)
- **Before:** "Coming soon" — dead end
- **After:** "Browse Services" button → `/discover/services`

### 4. TopBar Search
- **Before:** Search icon → `/pjazza/live-shop`
- **After:** Search icon → `/search` (actual search page)

### 5. Footer Legal Hub
- **Before:** Footer linked to Terms, Privacy, Cookies only — `/pjazza/legal` orphaned
- **After:** Added "Legal" link → `/pjazza/legal` (hub for Terms, Privacy, Cookies)

### 6. Legal Pages (Terms, Privacy, Cookies, Legal Index)
- **Before:** Back button only — dead end if arrived via direct URL
- **After:** Added "Home" link → `/pjazza/discover` on all legal pages

### 7. Consumer Header
- **Before:** Logo only
- **After:** Logo + "For businesses" link → `/pjazza` (business landing)

---

## Flow Summary

| Entry | Flow |
|-------|------|
| `/` | Fork: Customer → `/discover` \| Business → `/pjazza` |
| `/discover` | Consumer home: SearchBar, CategoryGrid, Live Now, Crowd Intelligence |
| `/pjazza` | Business landing: Shop Live → live-shop, Sell → onboard |
| `/pjazza/discover` | PJAZZA discover: TopBar, BottomNav, Live, Sectors, etc. |
| `/search` | Search results: categories, businesses, products, streams |
| `/biz/[slug]` | Business detail: booking, live link, etc. |
| Legal pages | Back + Home → discover |
| Shop/Services | Browse links → live-shop / discover/services |

---

## Verification Checklist

- [ ] Root `/` shows fork; "I'm a customer" → `/discover`; "I'm a business" → `/pjazza`
- [ ] Consumer discover: SearchBar submit → `/search?q=...`
- [ ] Consumer: Shop tab → Browse Live Shop → `/pjazza/live-shop`
- [ ] Consumer: Services tab → Browse Services → `/discover/services`
- [ ] PJAZZA TopBar Search → `/search`
- [ ] Footer Legal → `/pjazza/legal`; Terms/Privacy/Cookies have Home link
- [ ] Consumer header "For businesses" → `/pjazza`
- [ ] Error page "Go home" → `/` (fork)
