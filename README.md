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

The form has an "What are you enquiring about?" select (`#f-enquiry-type`: General Website Enquiry / Free Homepage Demo / First 5 Launch Offer), included in every Formspree submission. Any element with the `.js-claim-launch` class (announcement bar, dedicated launch section) sets this select to the launch offer, pre-fills the message textarea (only if it's still empty — a visitor's own typed text is never overwritten), shows a "Launch Offer Selected" badge above the form, highlights the form border in green, and swaps the submit button label to "Claim My Launch Space". Manually choosing the option from the dropdown does exactly the same thing. Normal enquiries are completely unaffected.

## Launch offer

A limited introductory offer (first 5 businesses: £0 website setup, £29/month for hosting and ongoing support) appears in four places, all wired to the form behaviour above:

- A dismissible announcement bar at the top of the page (`#announcementBar`) — the dismissal is remembered for the current browser session only (`sessionStorage`), not permanently
- A small badge + supporting line near the hero CTA, linking to the dedicated section
- A dedicated `#launch` section (in the nav) before the normal pricing section — pricing itself is unchanged
- A launch-specific WhatsApp link with its own pre-filled message, using the same Nexora WhatsApp number as the rest of the site

## Deployment note

Review this recovered/redesigned copy locally before replacing any existing live deployment with it.
