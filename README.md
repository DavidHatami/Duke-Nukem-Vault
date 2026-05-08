# THE VAULT — Duke Nukem Audio Site

A complete Duke Nukem audio toolkit. Browser-based. No install. **285 voice clips**, a **voice forge** that builds custom phrases from Duke's actual recordings, a **Hell Yeah punch button**, and a **public API** for use in other projects.

![Static](https://img.shields.io/badge/type-Static_site-141414?style=for-the-badge)
![No build](https://img.shields.io/badge/build-None-f4b400?style=for-the-badge)
![Style](https://img.shields.io/badge/aesthetic-Duke_Nukem-c1272d?style=for-the-badge)
![Pages](https://img.shields.io/badge/pages-5-e63946?style=for-the-badge)

---

## What's in here

| Page | What it does | File |
|------|--------------|------|
| **HOME** | Landing page, top catchphrases, random picks, links to everything | `index.html` |
| **LIBRARY** | Full 285-clip browser with search, filter, tags, embed, bulk download | `vault.html` |
| **VOICE FORGE** | Type text → Duke says it (using his actual clips). Export as WAV | `forge.html` |
| **PUNCH** | Hell Yeah button. Catharsis with combo counter and screen shake | `punch.html` |
| **API** | Manifest schema, fetch examples, deep-link URL params | `api.html` |

```
Duke-Nukem-Vault/
├── index.html          # Home / landing page
├── vault.html          # The library browser
├── forge.html          # Voice Forge — text-to-Duke
├── punch.html          # Hell Yeah punch button
├── api.html            # API documentation
├── manifest.json       # All clip metadata
├── netlify.toml        # Netlify config (redirects, headers, caching)
├── README.md           # This file
├── assets/
│   ├── duke.css        # Shared styling, nav, theme
│   └── nav.js          # Shared navigation injector
└── audio/
    ├── catchphrase/    # 31 — "Come get some", "Hail to the king"
    ├── combat/         # 50 — kicks, kills, threats
    ├── damage/         # 12 — pain grunts, death sounds
    ├── french/         # 16 — French-language voice lines
    ├── general/        # 98 — uncategorized, mixed content
    ├── greeting/       # 41 — entrances, openers
    ├── idle/           #  3 — humming, breathing
    ├── mockery/        #  9 — taunts, insults
    ├── music/          #  6 — themes, riffs
    ├── reference/      #  6 — pop culture nods
    └── sexual/         # 13 — strip club, "shake it baby"
```

**285 audio files. ~10 MB. All MP3. Filenames normalized to lowercase kebab-case.**

---

## Quick start

```bash
git clone https://github.com/DavidHatami/Duke-Nukem-Vault.git
cd Duke-Nukem-Vault
```

**Open locally:** Double-click `index.html`. For Chrome strict file:// rules, run `python3 -m http.server 8000` and visit `http://localhost:8000`.

**Deploy to Netlify:** Connect this repo in Netlify. The `netlify.toml` handles everything. Live in 30 seconds.

---

## VOICE FORGE — what it actually does

The honest version: this is **not AI voice cloning**. It's intelligent reuse of Duke's actual recorded clips.

### Four modes

**1. Find Match** — type a phrase, the forge searches all 285 transcripts for clips that match. Real Duke voice. Best for finding existing lines or close variants.

**2. Stitch Words** — type any text, the forge breaks it into words, finds the shortest clip containing each word, concatenates them into a single audio output. Words missing from the corpus get a brief placeholder. Export the result as WAV.

**3. Sequence Builder** — manually arrange clips into custom phrases. Click clips to add. Drag to reorder. Play. Export as WAV.

**4. Synth Only** — browser speech synthesis tuned for low pitch and slower rate. NOT Duke's voice — it's the OS male voice. Useful as a quick fallback for words that don't exist in the corpus.

### Why no real voice cloning?

True voice cloning (type any text → Duke says it in his actual voice) requires either:
- A neural model running server-side (gigabytes, not browser-feasible)
- A paid API like ElevenLabs (separate integration, costs money per character)

If you want that later, layer ElevenLabs on top of this site by adding a Netlify Function that takes text + your API key and returns the audio.

---

## API — using the vault from other projects

See [`api.html`](api.html) for the full docs. Quick version:

```javascript
const VAULT = 'https://your-vault.netlify.app';
const data = await fetch(`${VAULT}/manifest.json`).then(r => r.json());

// Random catchphrase on a button click
const catchphrases = data.clips.filter(c => c.category === 'catchphrase');
button.addEventListener('click', () => {
  const clip = catchphrases[Math.floor(Math.random() * catchphrases.length)];
  new Audio(`${VAULT}/${clip.path}`).play();
});
```

### Direct hotlink

```html
<audio src="https://your-vault.netlify.app/audio/catchphrase/come-get-some.mp3" controls></audio>
```

CORS is wide open on `/audio/*` and `/manifest.json` per `netlify.toml`. Pull from anywhere.

### Deep-link URL params

| Parameter | Effect |
|-----------|--------|
| `?clip=clip_001` | Open vault, auto-play that clip |
| `?category=combat` | Filter to a category |
| `?source=Atomic+Soundboard` | Filter to a source |
| `?search=come+get+some` | Pre-fill search |

Combine: `?category=catchphrase&search=king`

### Pretty redirects (Netlify only)

The `netlify.toml` adds these clean URLs once deployed:

| URL | Page |
|-----|------|
| `/library` | `vault.html` |
| `/forge` | `forge.html` |
| `/punch` | `punch.html` |
| `/api` | `api.html` |

---

## What persists across sessions

| Item | Storage | Survives refresh? |
|------|---------|-------------------|
| 285 pre-loaded clips | Repo files | Always |
| Renamed clip titles | `localStorage` | Yes (per device) |
| Custom tags | `localStorage` | Yes (per device) |
| Voice Forge sequences | Session memory | No — rebuild required |
| Drag-dropped session files | Browser blob URLs | No |

---

## Browser support

- ✅ Chrome / Edge — works on HTTPS deploy, may need flag for file:// access
- ✅ Firefox — works on both file:// and HTTPS without flags
- ✅ Safari (desktop and iOS) — works on both
- ⚠️ Voice Forge requires Web Audio API (all modern browsers, IE11 not supported)
- ⚠️ Speech synthesis quality varies by OS — Safari/macOS has the best male voices

---

## Sources

- [Myinstants.com](https://www.myinstants.com) — 44 clips
- [Soundboard.com — Atomic](https://www.soundboard.com/sb/maxalo) — 167 clips
- [Soundboard.com — Ultimate](https://www.soundboard.com/sb/solrosin) — 58 clips
- [Soundboard.com — Jamie's](https://www.soundboard.com/sb/xXJamieXx) — 16 clips

---

## Credits & rights

Duke Nukem is a registered trademark of **Take-Two Interactive** (acquired Gearbox Software March 2024). Voice performances by **Jon St. John** since *Duke Nukem 3D* (1996). Original score by **Lee Jackson** and **Bobby Prince**.

This repository is a personal fan archive for **non-commercial use only**. If a rights-holder objects, files will be removed on request.

---

## Roadmap

- ElevenLabs integration for true text-to-Duke AI voice (Netlify Function with API key)
- Backend version with Supabase Storage + Postgres for shared tags across users
- Public sharable Voice Forge sequences via URL hash
- Browser extension that injects Duke clips into other web pages
