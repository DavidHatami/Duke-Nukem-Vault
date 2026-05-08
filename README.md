# THE VAULT — Duke Nukem Audio Repository

A standalone, browser-based audio repository pre-loaded with **285 Duke Nukem voice clips and sound effects**, organized by category, fully searchable, and ready to drop into any other project.

![Static](https://img.shields.io/badge/type-Static_site-141414?style=for-the-badge)
![No build](https://img.shields.io/badge/build-None-f4b400?style=for-the-badge)
![Style](https://img.shields.io/badge/aesthetic-Duke_Nukem-c1272d?style=for-the-badge)

---

## Quick start

```bash
git clone https://github.com/DavidHatami/Duke-Nukem-Vault.git
cd Duke-Nukem-Vault
```

Then either:

- **Open locally:** Double-click `vault.html`. Most browsers work directly. If clips don't auto-load (Chrome with strict file:// rules), run `python3 -m http.server 8000` in the folder and visit `http://localhost:8000/vault.html`.
- **Deploy to Netlify:** Connect this repo in Netlify's dashboard. The included `netlify.toml` handles everything. Live URL in 30 seconds.

---

## Structure

```
Duke-Nukem-Vault/
├── vault.html          # The player app
├── manifest.json       # Clip metadata (categories, tags, paths, transcripts)
├── netlify.toml        # Netlify deployment config
├── README.md           # This file
├── .gitignore
└── audio/
    ├── catchphrase/    # 31 clips — "Come get some", "Hail to the king", etc.
    ├── combat/         # 50 clips — kicks, kills, threats
    ├── damage/         # 12 clips — taking hits, death sounds
    ├── french/         # 16 clips — French-language voice lines
    ├── general/        # 98 clips — uncategorized, mixed content
    ├── greeting/       # 41 clips — entrances, openers
    ├── idle/           #  3 clips — humming, breathing
    ├── mockery/        #  9 clips — taunts, insults
    ├── music/          #  6 clips — themes, riffs
    ├── reference/      #  6 clips — pop culture nods
    └── sexual/         # 13 clips — strip club, "shake it baby"
```

**Filenames are normalized:** lowercase kebab-case, descriptive (e.g., `come-get-some.mp3`, not `duke-nukem-3d-come-get-some-22.mp3`). Duplicates across collections get a suffix (`come-get-some-2.mp3`).

---

## What the vault does

### Search and filter

- Search box matches title, transcript, slug, source, category, and tags
- Category buttons (catchphrase, combat, etc.)
- Source buttons (which soundboard the clip came from)
- Audio/video type toggle

### Playback

- Click **▶ PLAY** on any card
- **SPACE** pauses/resumes
- **←** / **→** previous/next clip in the current filtered view
- **ESC** closes the player
- Auto-advance to next clip when one finishes

### Tagging

- Click **+ tag** on any clip to add a custom tag (`favorite`, `for-podcast`, `episode-3`, whatever)
- Tags persist via `localStorage`
- Click an existing tag to remove it
- **⬇ Export Tags** dumps your tag library as JSON

### Bulk operations

- Checkbox on each card to select clips
- Selection bar at top: download all selected at once
- "Download Category" button on each category section
- "Select All" within a category

### Embed in other projects

- **&lt;/&gt;** button on each card opens an embed dialog with:
  - **Direct URL** to the MP3 file
  - **HTML snippet** — `<audio>` tag ready to paste
  - **JavaScript snippet** — `new Audio(url).play()` for event-driven use
  - **Vault deep link** — opens the vault filtered to that clip

### Drop new files

- Drag-drop additional MP3/MP4 files into the red zone at top
- Session-only (no server, files don't persist) but useful for one-off needs

---

## API — using the vault from other projects

The vault is data-driven. Other projects can consume `manifest.json` directly.

### Manifest schema

```json
{
  "version": 1,
  "name": "Duke Nukem Audio Vault",
  "total": 285,
  "categories": ["catchphrase", "combat", "damage", "french", ...],
  "sources": ["Atomic Soundboard", "Ultimate Soundboard", ...],
  "clips": [
    {
      "id": "clip_001",
      "slug": "come-get-some",
      "title": "Come get some",
      "transcript": "Come get some",
      "category": "catchphrase",
      "source": "Atomic Soundboard",
      "source_key": "soundboard_atomic",
      "path": "audio/catchphrase/come-get-some.mp3",
      "filename": "come-get-some.mp3",
      "type": "audio",
      "size": 23436,
      "format": "mp3"
    }
  ]
}
```

### Use in another web project

```javascript
// Once deployed to Netlify, replace with your vault URL:
const VAULT = 'https://your-vault.netlify.app';

const data = await fetch(`${VAULT}/manifest.json`).then(r => r.json());

// Random catchphrase on button click
const catchphrases = data.clips.filter(c => c.category === 'catchphrase');
button.addEventListener('click', () => {
  const clip = catchphrases[Math.floor(Math.random() * catchphrases.length)];
  new Audio(`${VAULT}/${clip.path}`).play();
});
```

### Deep-link URL parameters

The vault accepts URL params for direct linking from other apps:

| Parameter | Effect |
|-----------|--------|
| `?clip=clip_001` | Open vault, auto-play that clip |
| `?category=combat` | Open vault, filter to combat category |
| `?source=Atomic+Soundboard` | Open vault, filter to that source |
| `?search=come+get+some` | Open vault with search pre-filled |

Combine: `?category=catchphrase&search=king`

### CORS and direct-embed

When deployed on Netlify, the audio files are served with proper CORS headers and aggressive caching (set in `netlify.toml`). Other web projects can hotlink the MP3s directly:

```html
<audio src="https://your-vault.netlify.app/audio/catchphrase/come-get-some.mp3" controls></audio>
```

---

## Categories explained

| Category | Examples | Count |
|----------|----------|-------|
| `catchphrase` | "Come get some", "Hail to the king, baby", "Balls of steel" | 31 |
| `combat` | "I'm gonna kick your ass", "Rip 'em a new one", "Die you SOB" | 50 |
| `damage` | Pain grunts, death sounds, "Damn that was annoying" | 12 |
| `french` | French-language voice lines (community-recorded) | 16 |
| `general` | Uncategorized — first place to look for unique clips | 98 |
| `greeting` | "I love the smell of sewers", "All aboard", entry lines | 41 |
| `idle` | Humming, breathing, "Egh", filler sounds | 3 |
| `mockery` | "That's gotta hurt", "Damn you're ugly" | 9 |
| `music` | Theme variations, Grabbag riffs | 6 |
| `reference` | "It's clobberin' time", Indiana Jones nod, etc. | 6 |
| `sexual` | "Shake it baby", strip club content | 13 |

The categorization is heuristic — based on filename keywords. You can refine via the tag system inside the vault.

---

## What persists across sessions

| Item | Storage | Survives refresh? |
|------|---------|-------------------|
| 285 pre-loaded clips | Repo files | Always |
| Renamed titles | `localStorage` (per device, per browser) | Yes |
| User-added tags | `localStorage` (per device, per browser) | Yes |
| Drag-dropped session files | Browser memory (blob URLs) | No — re-drop required |

---

## Browser support

- ✅ Chrome / Edge (Chromium) — perfect when served via HTTP/HTTPS, may need flag for file:// access
- ✅ Firefox — works on both file:// and HTTPS without flags
- ✅ Safari (desktop and iOS) — works on both
- ⚠️ Older mobile browsers — untested; modern WebKit/Blink/Gecko recommended

---

## Sources

The 285 clips were collected from publicly accessible soundboard sites that have hosted Duke Nukem voice samples for 15+ years:

- [Myinstants.com](https://www.myinstants.com)
- [Soundboard.com — Atomic Duke Nukem](https://www.soundboard.com/sb/maxalo)
- [Soundboard.com — Ultimate Duke Nukem](https://www.soundboard.com/sb/solrosin)
- [Soundboard.com — Jamie's board](https://www.soundboard.com/sb/xXJamieXx)

---

## Credits & rights

Duke Nukem is a registered trademark of **Take-Two Interactive** (which acquired Gearbox Software in March 2024). Voice performances by **Jon St. John** since *Duke Nukem 3D* (1996). Original score by **Lee Jackson** and **Bobby Prince**.

This repository is a personal fan archive for non-commercial use. If a rights-holder objects, files will be removed on request.

---

## Roadmap (potential next phases)

- Backend version with **Supabase Storage + Postgres** for shared tags across users and devices
- User accounts via **Supabase Auth**
- Public sharable playlists
- WebRTC-based "Duke Says" multiplayer game using the clip library
- Browser extension that injects Duke clips into other web pages
