# HindLight Media - Website

**Current state (main): a faithful, self-hosted clone of the client's live hindlightmedia.com (Squarespace).** This is the agreed baseline; improvements iterate from here.

**Live preview:** https://credwine.github.io/hindlight-media/

A full light-theme multi-page redesign also exists on the `redesign-light` branch (orange/white design system, individual solution pages, SEO layer) - anything from it can be cherry-picked into the clone as improvements.

## How the clone works

- All 11 pages mirrored from hindlightmedia.com on July 1, 2026 (index, talking-head-reels, selfie-to-sales, brand-videos, swoop-service, pitchreels, why-video, meet-the-team, our-work, contact, privacy-policy).
- Squarespace CSS/JS bundles and images localized under `ss/` (no dependency on the client keeping Squarespace).
- Internal links rewritten to extensionless relative slugs - identical URLs to the original site, works on GitHub Pages and at domain cutover.
- Squarespace-hosted videos replaced with self-hosted files from `assets/video/` (the original SS players are hidden via CSS, their markup kept intact so the Squarespace bootstrap JS doesn't crash):
  - Hero background: "Homepage Loop February 2024" = `hero.mp4` (720p encode of homepage-video-2)
  - Recent Work: `heart-reel.mp4` (homepage-video-1) + `recent-work-2.mp4` (homepage-video-3)
  - PitchReels promo, all 5 Swoop samples: matched by duration to the archive

## Known gaps (client action needed)

- **SwoopLoop.mov** (20.9s background loop on /swoop-service) could not be recovered - Squarespace signs its video URLs. The section shows its fallback image. Client should re-export from their files.
- **Two Vimeo embeds are dead on the live site too** (talking-head reel 2 = vimeo 1058453718, Selfie to Sales example = vimeo 1191590390; both 404 on Vimeo). Client should re-export or make them public again.
- Page meta (canonicals, OG) still points at hindlightmedia.com - correct for a staging clone; revisit at cutover.

## Asset archive

`assets/img/` and `assets/video/` hold the full media archive pulled from the original site (see MANIFEST.md files). Gotcha: `HindLight_Logo.png` is MISLABELED (stock photo); the real wordmark is `HLM_logo_2020.png`.
