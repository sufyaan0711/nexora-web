# Nexora Web

Nexora Web's marketing site — a premium, static HTML/CSS/JS agency website. It showcases two live client projects (Ember House, Bobby's Hair Salon), presents Nexora's services and pricing, and drives visitors to request a free homepage demo.

## Running locally

This is a plain static HTML/CSS/JS site — no build step, framework or package manager is required. Serve the folder with any static file server, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html` in a browser.

Any other static server (e.g. `npx serve`, VS Code Live Server) works equally well.

## Main files and asset folders

- `index.html` — page markup
- `styles.css` — all styling (design tokens live at the top of the file)
- `script.js` — mobile navigation overlay, scroll effects, portfolio video playback, FAQ accordion, form validation/submit
- `favicon.svg` — browser tab icon
- `assets/portfolio/ember-house/` — flagship project: `hero.mp4`, `desktop.png`, `mobile.png`
- `assets/portfolio/bobbys/` — second project: `hero.mp4`, `desktop.png`, `mobile.png`, `logo.png`
- `uploads/`, `_ds/` — legacy asset library / design-system metadata from earlier site-builder tooling (not referenced by the live page)

## Portfolio videos

Both showcase videos are actual screen recordings of the real live sites (Ember House and Bobby's Hair Salon), so no separate UI needs to be recreated over them — they already show the real nav, headline and buttons. They:

- autoplay muted, loop, and play inline (no controls, no audio)
- use a poster image as an instant-loading fallback if autoplay is blocked
- pause automatically when scrolled well out of view and resume when back in view (`IntersectionObserver` in `script.js`)

## Form integration

The homepage demo request form submits to Formspree (`https://formspree.io/f/xaqzkkor`), not Netlify Forms — this means it is host-agnostic and will keep working unchanged regardless of where the site is deployed (Netlify, Vercel, etc).

## Deployment note

Review this recovered/redesigned copy locally before replacing any existing live deployment with it.
