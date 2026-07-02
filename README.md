# HindLight Media - Website

Multi-page redesign for HindLight Media, a northwest Georgia video and multimedia production team. Light "fire on paper" theme built from the brand wordmark (flame #FF3D00, amber #FF8F00, gold #FFD54F on warm white).

**Live preview:** https://credwine.github.io/hindlight-media/

## Stack

Static HTML + one shared stylesheet + one shared script. No build step, no dependencies.

```
index.html               Home (football hero video)
solutions.html           Impact Solutions overview
talking-head-reels.html  Solution 01 (original site slug preserved)
selfie-to-sales.html     Solution 02 (original slug)
brand-videos.html        Solution 03 (original slug)
swoop-service.html       Solution 04 (original slug)
pitchreels.html          Solution 05 (original slug)
our-work.html            Video portfolio / screening room
services.html            Full service menu
why-video.html           Stats and ROI case (original slug)
meet-the-team.html       Team + testimonials (original slug)
contact.html             Contact (original slug)
404.html                 Custom not-found page
assets/css/styles.css    Design system (all tokens in :root)
assets/js/site.js        Nav, dropdown, reveals, counters, playhead
```

Internal links are extensionless ("swoop-service", not "swoop-service.html") - GitHub Pages resolves them, and they exactly match the client's original Squarespace slugs, so nothing 301s at domain cutover.

## Notes for domain cutover (hindlightmedia.com)

Search and replace `https://credwine.github.io/hindlight-media/` with `https://hindlightmedia.com/` across all .html files, sitemap.xml, and robots.txt (canonicals, OG tags, JSON-LD, breadcrumbs).

## Asset provenance

All photos, videos, copy, testimonials, team bios, and pricing come from the client's original hindlightmedia.com (Squarespace), archived July 1, 2026. See `assets/img/MANIFEST.md` and `assets/video/MANIFEST.md`.

Gotcha: `assets/img/HindLight_Logo.png` is MISLABELED (a stock desk photo). The real wordmark is `HLM_logo_2020.png`; the site serves `hindlight-logo.webp` derivatives of it.

Optimized derivatives:
- `assets/video/hero.mp4` - homepage-video-2 (football entrance) re-encoded 720p, muted
- `assets/img/hero-poster.jpg` - hero poster frame (also the OG image)
- `assets/img/hindlight-logo.webp` / `hindlight-logo-sm.webp` - from HLM_logo_2020.png
- `assets/img/book-cover.webp` - from BookCover_GreatAtMakingVideo.png
- `assets/img/poster-*.jpg` - poster frames for the wide players
