# HindLight Media - Website

Redesigned single-page site for HindLight Media, a northwest Georgia video and multimedia production team.

**Live preview:** https://credwine.github.io/hindlight-media/

## Stack

Single-file static HTML + CSS + vanilla JS. No build step, no dependencies. Deploys anywhere that serves static files (currently GitHub Pages).

## Structure

```
index.html      The whole site (styles and scripts inline)
404.html        Custom not-found page
sitemap.xml     Single-URL sitemap
robots.txt
assets/img/     Photos, logos (optimized WebP + original archive)
assets/video/   All video content, self-hosted (originals pulled from the old Squarespace site)
```

## Notes for domain cutover (hindlightmedia.com)

When this replaces the live Squarespace site, update the absolute URLs in `index.html`, `sitemap.xml`, and `robots.txt`:

- `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`, and the JSON-LD `url` / `@id` / `image` / `logo` fields
- `sitemap.xml` `<loc>`
- `robots.txt` Sitemap line

Search and replace `https://credwine.github.io/hindlight-media/` with `https://hindlightmedia.com/`.

## Asset provenance

All photos, videos, copy, testimonials, team bios, and pricing were pulled from the client's original hindlightmedia.com (Squarespace) on July 1, 2026. See `assets/img/MANIFEST.md` and `assets/video/MANIFEST.md`. Two Vimeo videos that could not be downloaded are embedded by ID instead (talking-head reel 2, Selfie to Sales example).

Optimized derivatives generated for the redesign:

- `assets/video/hero.mp4` - homepage-video-1 re-encoded to 720p, muted, for the hero loop
- `assets/img/hero-poster.jpg` - hero poster frame (also the Open Graph image)
- `assets/img/hindlight-logo.webp` / `hindlight-logo-sm.webp` - resized from HindLight_Logo.png
- `assets/img/book-cover.webp` - resized from BookCover_GreatAtMakingVideo.png
