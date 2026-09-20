# Purpose Music portfolio

A static, bilingual portfolio for Vyacheslav Sinitsyn. Plain HTML, CSS and JavaScript; no build, framework, runtime dependencies, backend or API keys.

## Preview

Run `python -m http.server 4173` in this folder and visit `http://localhost:4173`. Opening `index.html` directly can display the site, but YouTube embeds require an HTTP(S) page: `file://` does not send the HTTP Referer required by YouTube and can cause error 153. The iframe explicitly uses `strict-origin-when-cross-origin`. Browser extensions or privacy settings that strip Referer can also prevent playback.

## Edit content

All editable content is in **`portfolio-data.js`**:

| Content | Location |
| --- | --- |
| About paragraphs | `about.en` and `about.ru` |
| Future showreel | `showreelUrl` |
| Projects and their images, roles, descriptions and destinations | `projects` |
| SoundCloud tracks | `tracks` |
| Email and social URLs | `contacts` |
| Interface text in both languages | `text.en` and `text.ru` |

Add projects or tracks by copying an existing object. Project names, track titles and brands remain untranslated. Roles and status use keys from `text`. Project descriptions need `en` and `ru` values. If a project has no image, a deliberate typographic cover is shown. If it has no URL, no inactive or invented destination is displayed.

Set `showreelUrl` to a YouTube watch, share, shorts or embed URL to enable a click-to-load video. Direct HTTP(S) `.mp4`/`.webm` files use native controls; other video URLs open their original page. An empty value shows the intentional coming-soon panel. Nothing autoplays.

SoundCloud uses compact, visible official widgets, loaded when the visitor chooses **Load player**, then played using SoundCloud's controls. This avoids API keys, hidden-player tricks and audio downloads. Native controls provide play/pause, seeking and platform attribution. `single_active=true` prevents simultaneous SoundCloud players. The site's surrounding interface is bilingual; the embedded service controls its own UI language. Direct SoundCloud links remain available if a service or network blocks embedding.

English is the first-visit default. The switch stores `portfolio-language` in localStorage. If storage is disabled, switching still works for the current page. Switching language preserves a loaded player.

## Content audit and remaining input

- Original `index.html` is preserved in `docs/original-index.html`; all original source images are untouched.
- Five game URLs, email, SoundCloud profile and itch.io profile were preserved exactly.
- The original files named FRACTURED RED and credited the composer, but contained **no Steam URL or artwork**. Add its confirmed Steam destination to the last project's `url`. Its text warns that the public demo may not yet include the music.
- The old Discord link was just `https://discord.com/`. It is preserved as `contacts.legacyDiscord`, but not presented as a personal contact. Set `contacts.discord` to a real profile/invite URL to display it.
- Although the brief mentioned two tracks, the existing SoundCloud profile returned **three** public tracks. Their exact titles and URLs were retrieved through the official widget and all three are listed.
- The source supplied roles and biography context. No clients, awards, paid-experience claims or implementation credits were invented. Edit the About text as desired.
- Descriptions for [The Cyber Maiden](https://eclipsense.itch.io/the-cyber-maiden), [Another's Destiny](https://eclipsense.itch.io/anothers-destiny), [Steel Sense](https://eclipsense.itch.io/steel-sense), and [Global Flood](https://eclipsense.itch.io/global-flood) were checked against their linked game pages. Original Sin's destination could not be inspected through the research tool, so its description remains generic and its original URL is retained.
- Player parameters follow the [official SoundCloud widget documentation](https://developers.soundcloud.com/docs/api/html5-widget).

## Static deployment

The deployable files are `index.html`, `style.css`, `script.js`, `portfolio-data.js`, `assets/`, and the original `.jpg` portrait in the root. They can be served directly by Cloudflare Pages or any static host. No compilation or environment variables are required. Exclude `docs/` from a manual upload; it contains the old site and development checks.

Once the production domain is known, add its absolute canonical URL and `og:url` to `index.html`. An absolute social preview image URL can also be added then. No placeholder domain is shipped.

## Verification

`docs/check-browser.cjs` checks both languages at 1440, 1024, 768, 390 and 320 pixels, images, anchors, external-link attributes, translation coverage, storage persistence/failure, mobile navigation and absence of autoplay. `docs/check-audio.cjs` verifies real SoundCloud play/pause, playback progress and seeking in headless Edge at mobile width. `docs/check-config.cjs` verifies future YouTube, direct video and external video-page configurations with intercepted external requests. These are development tools, not site dependencies; they use Playwright from `%TEMP%/portfolio-browser-check/node_modules`.

To run them on Windows with Edge and Python installed:

```powershell
npm install --prefix "$env:TEMP\portfolio-browser-check" --no-save --package-lock=false playwright
python -m http.server 4173 --bind 127.0.0.1
# In a second terminal:
node docs/check-browser.cjs
node docs/check-audio.cjs
node docs/check-config.cjs
```

Screenshots are saved outside the project, in `%TEMP%/portfolio-browser-check/screenshots`.
