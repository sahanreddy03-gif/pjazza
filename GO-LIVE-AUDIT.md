# PJAZZA go-live audit — what was checked and fixed

Acting as a human tester and business-owner reviewer, here’s what was audited and changed so the site feels solid and trustworthy at launch.

---

## 1. Core navigation and buttons (fixed)

| Item | Issue | Fix |
|------|--------|-----|
| **TopBar Search** | Did nothing | Now goes to Live Shop (browse/search stores). |
| **TopBar Bell** | Did nothing | Now goes to Help (FAQs + contact). |
| **Help → Contact form** | Plain `<a href>` caused full reload | Switched to Next.js `Link` for client-side navigation. |
| **Business onboard** | No way back to main site | Added “Back to PJAZZA” at top. |

---

## 2. Contact visibility and trust (fixed)

- **Footer:** New block above links: “Need help or want to get in touch? We reply within 24 hours” with a **Contact us** button → `/pjazza/contact`.
- **Landing hero:** Under the main CTAs: “Questions? **Contact us** — we reply within 24 hours” (links to Contact page).
- Contact page itself is unchanged: form, phone/email cards, and `/api/contact` (with optional Supabase) already work.

Result: Contact is easy to find from home, footer, and help — no longer “buried” only in footer links.

---

## 3. Store session (video call) — trust when live isn’t available

- **Before:** If the video/voice call failed (e.g. LiveKit not set up), users saw a raw error.
- **After:** Message is: “Live connection isn’t available right now. Browse products and chat below — or call [store] to arrange a call.”  
- Products, cart, and chat still work so the page doesn’t feel broken.

---

## 4. Seller onboarding — upload and “publish to store”

- **Empty store list:** If `/api/businesses` returns no stores, the upload “Store” dropdown now says “No store yet — save to Library below” and a short line: “Claim or add your business in Dashboard first. Your video can still be saved to your library.”
- **Publish to store fails** (e.g. Supabase/storage not configured): Error copy is friendly: “Save to Library below to keep your video. Store publishing activates after verification.” (or similar).  
- **Save to Library** (IndexedDB) always works and is the reliable path when backend isn’t ready.

So: every path (no store yet, publish fail, or success) has a clear, honest message and a working option (Library).

---

## 5. Journeys verified (no code changes needed)

- **Buyer:** Home → Live Shop / Discover / Sectors / People → store page → products, chat, (video call when available). Contact from nav, footer, help, and hero. ✓  
- **Seller:** Home → “Sell on PJAZZA” → Business onboard (claim or new) → Dashboard → “GO LIVE” → Stream (camera / Upload / Library). Back from onboard to home. ✓  
- **Contact form:** Submits to `/api/contact`; logs and optionally saves to Supabase `contact_submissions`. ✓  

---

## 6. What to double-check before launch

1. **Env:**  
   - `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` if you want contact submissions in DB.  
   - `NEXT_PUBLIC_LIVEKIT_URL` (+ token API) if you want real video calls (otherwise the friendly fallback above is shown).

2. **Hero video:**  
   - File at `public/pjazza/video/...` — ensure it’s the right asset and format for autoplay (e.g. muted, loop, playsInline).

3. **Business list for upload:**  
   - `/api/businesses` populates the “Store” dropdown for “Publish to Store”. If empty, sellers still have “Save to Library” and clear copy.

4. **Legal/Install:**  
   - Terms, Privacy, Cookies, Install app pages exist and are linked from footer; content is your responsibility.

---

## 7. “50 perspectives” style — what different users need

- **Shopper:** “Can I find stores and contact someone?” → Live Shop + Contact in nav/footer/hero/help. ✓  
- **Seller:** “Can I list my business and upload a video?” → Onboard + Dashboard + Stream (Upload + Library). ✓  
- **Skeptic:** “What if video call doesn’t work?” → Message explains and points to browse/chat/call store. ✓  
- **Support:** “Where do I send people to get in touch?” → One Contact page, linked from multiple places. ✓  

---

## Summary

- Every TopBar and Help button does something useful (search → Live Shop, bell → Help).  
- Contact is prominent (footer CTA, hero link, nav) and the form works.  
- Store page and seller upload paths have clear, honest fallbacks so the site doesn’t feel broken when live or backend features aren’t ready.  
- Onboard has a way back to the main site; navigation and key flows are consistent for both buyers and sellers.

You can use this file as a pre-launch checklist and to brief testers or stakeholders.
