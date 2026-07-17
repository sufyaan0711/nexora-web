# Nexora Web

This is the recovered Nexora Web static website — the same site currently deployed on Netlify, restored into this repository from its backup archive. No design, content, pricing, branding or layout has been changed as part of this recovery.

## Running locally

This is a plain static HTML/CSS/JS site — no build step, framework or package manager is required. Serve the folder with any static file server, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/index.html` in a browser.

Any other static server (e.g. `npx serve`, VS Code Live Server) works equally well.

## Main files and asset folders

- `index.html` — page markup
- `styles.css` — all styling
- `script.js` — mobile nav, scroll effects, form validation/submit
- `images/` — Spice Grill demo screenshots used in the hero and portfolio sections
- `uploads/` — asset library from the site builder
- `_ds/` — design-system metadata from the site builder tooling

## Deployment note

The existing Netlify deployment should **not** be replaced or redeployed with this recovered copy until it has been reviewed and confirmed to match the live site.
