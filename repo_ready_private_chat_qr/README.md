# Private Chat (Broadcast) — Ready for GitHub + Vercel

Polished, no-login chat using **Supabase Realtime broadcast**. Create a room, copy/share a link, or show a **QR code** to join on phones.

---

## 🚀 One‑Click Deploy (after you upload to your GitHub repo)

**Deploy to Vercel**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Charkieeez/private-chat)

> The button clones your GitHub repo **Charkieeez/private-chat** and deploys it.  
> Just make sure you’ve created that repo and uploaded these files (see below).

---

## 📦 Set up your GitHub repo (once)

1. Go to https://github.com/new → create **Charkieeez/private-chat** (public or private).  
2. Upload **all files** from this folder into the repo root (drag & drop in GitHub works).  
3. Now click the **Deploy to Vercel** button above — approve/authorize — done.

Your app will be live at a URL like:
```
https://private-chat-<random>.vercel.app
```
Share an invite link like:
```
https://private-chat-<random>.vercel.app/?room=<uuid-here>
```

---

## 🧪 Local test (optional)
```bash
# Windows
py -m http.server 3000
# macOS/Linux
python3 -m http.server 3000
```
Open http://localhost:3000

---

## ⚙️ Supabase config (already baked in)

This build includes your Supabase **URL + anon key** in `config.js` so friends need no setup.

- URL: `https://oimwhyojqxtqlcrazgag.supabase.co`
- anon key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pbXdoeW9qcXh0cWxjcmF6Z2FnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMjgyOTEsImV4cCI6MjA2NDgwNDI5MX0.cFP9Pz2oUjbtnDOcDhL_T-rjJp8IQqZqHT8rnImKmAc`

> Keys in client code are public by design. Rotate later if needed.

---

## 📝 What’s inside

- `index.html` — polished landing + chat
- `styles.css` — modern dark UI
- `app.js` — broadcast chat + **QR invite modal**
- `config.js` — Supabase config (pre-filled)
- `vercel.json` — static config for Vercel
- `README.md` — this file

---

## 🔐 Heads‑up

- Broadcast only: **no persistence**; anyone with the link can join.  
- For real privacy + history, upgrade later to **Auth + RLS + messages table**.
