# Supabase Auth URL Configuration

Complete guide for configuring Auth URLs in Supabase.

---

## 1. Where to configure

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. In the left sidebar: **Authentication** → **URL Configuration**
4. Set **Site URL** and **Redirect URLs**

---

## 2. Site URL

Use your primary app URL:

| Environment | Site URL |
|-------------|----------|
| Production  | `https://maltaverse.live` |
| Or Vercel   | `https://your-project-name.vercel.app` |
| Local dev   | `http://localhost:3000` |

**Pick one** — typically production. For local testing, you can temporarily change it or use Redirect URLs.

---

## 3. Redirect URLs (add all of these)

Supabase redirects here after: email confirmation, magic links, OAuth (Google/Apple), password reset.

### Production (maltaverse.live)
```
https://maltaverse.live/
https://maltaverse.live/**
https://maltaverse.live/pjazza/agent
https://maltaverse.live/pjazza/agent/**
https://maltaverse.live/pjazza/business/**
https://maltaverse.live/biz/**
https://maltaverse.live/profile
https://maltaverse.live/discover
https://maltaverse.live/search
```

### Vercel (if not using custom domain yet)
```
https://your-project-name.vercel.app/
https://your-project-name.vercel.app/**
https://your-project-name.vercel.app/pjazza/agent
https://your-project-name.vercel.app/pjazza/agent/**
```

### Preview deployments (optional — allows all Vercel preview URLs)
```
https://*.vercel.app/**
```

### Local development
```
http://localhost:3000/
http://localhost:3000/**
http://localhost:3000/pjazza/agent
http://localhost:3000/pjazza/agent/**
```

---

## 4. Paths used by the app

| Path | Purpose |
|------|---------|
| `/pjazza/agent` | Sign-in / sign-up page (auth portal) |
| `/pjazza/agent?redirect=...` | Auth page with post-login redirect |
| `/pjazza/business/dashboard` | Business dashboard (protected) |
| `/pjazza/business/products` | Products page (protected) |
| `/pjazza/business/settings` | Settings page (protected) |
| `/pjazza/business/subscription` | Subscription page (protected) |
| `/pjazza/business/onboard` | Business onboarding (public) |
| `/biz/[slug]` | Business detail page (consumer) |
| `/profile` | User profile (consumer) |
| `/discover` | Discover page (consumer) |
| `/search` | Search page (consumer) |

---

## 5. Step-by-step in Supabase

1. **Site URL**
   - In the **Site URL** field, enter: `https://maltaverse.live`
   - (Or `https://your-project.vercel.app` if using Vercel default domain)
   - Click **Save**

2. **Redirect URLs**
   - In **Redirect URLs**, add each URL on a new line (or use the UI to add)
   - Minimum for production:
     ```
     https://maltaverse.live/**
     http://localhost:3000/**
     ```
   - `**` = all paths under that base are allowed
   - Click **Save**

3. **Optional — Auth providers**
   - If using Google/Apple OAuth: **Authentication** → **Providers** → enable and add OAuth callback URLs
   - Supabase will use your Redirect URLs for callbacks

4. **Optional — Email templates**
   - **Authentication** → **Email Templates**
   - Confirm **Redirect URL** placeholders use `{{ .ConfirmationURL }}` etc. (default is fine)
   - Confirmation link will redirect to your **Site URL** or a URL in **Redirect URLs**

---

## 6. Quick copy-paste list

**Production + local (minimal):**
```
https://maltaverse.live/**
http://localhost:3000/**
```

**Production + Vercel + local (full):**
```
https://maltaverse.live/**
https://your-project-name.vercel.app/**
http://localhost:3000/**
```

**With preview deployments:**
```
https://maltaverse.live/**
https://*.vercel.app/**
http://localhost:3000/**
```

---

## 7. Verify

1. Visit `https://maltaverse.live/pjazza/agent`
2. Sign in or sign up
3. You should land on `/pjazza/business/dashboard` (or the `redirect` param value)
4. If you see "Invalid redirect URL" — add that URL to Redirect URLs
