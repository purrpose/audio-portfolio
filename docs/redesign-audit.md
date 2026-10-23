# Studio archive redesign — 2026-10-17

Latest music update: Cyber Maiden Boss → Cyber Maiden Combat → Original Sin Boss → Another's Destiny Cutscene Theme. The fourth track uses the owner's supplied SoundCloud URL; live playback, pause and seeking passed, with a verified duration of 41.241 seconds. The original three destinations remain unchanged.

## Inspection and content preservation

Inspected the current HTML, CSS, JavaScript/data, development checks, archived page, favicon, all five project images and the original stage photograph before implementation. No local audio/video, framework, build manifest, CI or Cloudflare deployment configuration was present. The existing audio folders contained only `.gitkeep`.

Captured the original six project names/roles/destinations, three music destinations, contacts, reel URL and image SHA-256 hashes in `source-inventory.json`. The post-redesign content check confirms that these are unchanged. The P mark is retained as a vector, recolored to the site's single accent. FRACTURED RED still uses a text cover and correctly states that the public demo does not include the soundtrack.

## Design and implementation

- Studio archive styling: Courier New throughout, dark charcoal, warm text and document rules. Decorative numbering has been removed from navigation, sections, recordings, SFX and projects. Yellow accents now identify section headings, recordings, actions, project roles and contact links.
- Name-led opening spread with short description, status, direct email and listening index. The original photograph now appears beside the biography.
- Exact content order: hero → showreel → music → SFX → games → about → capabilities → contact.
- Large reel with a typographic slate, real verified duration, click-to-load playback and an external link. Relative MP4/WebM paths now work as well as external URLs.
- Music is a recording ledger with title, context, real duration and listening control. Mobile metadata wraps below the title without an empty numbering gutter.
- SFX is a separate asset register with categories and five explicitly pending sample slots. Internal IDs remain in data only. No missing audio requests, fake durations or fabricated sound files. Supplying `src` activates the custom player.
- About now gives music, arrangement and instruments space alongside game sound design. Capabilities use short factual descriptions instead of exhaustive genre/effect lists; the tool list is limited to FL Studio, Unity and FMOD.
- Games use alternating artwork/metadata spreads with short factual contribution notes. All original images retain their colors and are displayed uncropped.
- Compact capabilities, factual technical scope and direct contacts. No contact form or invented Discord profile link.
- English/Russian content, optional localStorage, visible keyboard focus, skip link, reduced-motion handling and one media owner across all players.
- Replaced the old CSS completely and removed unused UI/data fields, IBM Plex assets/download helper and obsolete archived HTML. No new frontend dependency or font download remains.

## Completed checks

- All 13 original HTTP(S) destinations returned 200, either directly or via browser navigation after transport resets. Titles matched the expected reel, recordings, games and profiles. Email URI syntax is valid; Discord username `purposey` is preserved. No contact messages were sent.
- English and Russian at 1920, 1440, 1280, 1024, 901, 900, 820, 768, 601, 600, 430, 390, 360 and 320 px: no horizontal overflow, broken images, missing anchors or translation keys.
- Confirmed section order, all five disabled placeholders, real project descriptions, Courier New and zero font requests. Inspected desktop/mobile screenshots of hero, reel, music, SFX, games and about.
- Keyboard skip link, mobile menu, Escape, clipboard, language persistence, blocked storage and reduced motion passed. Layout/interaction tests produced no JavaScript exceptions or console errors.
- Real HTMLMediaElement decoding of in-memory test WAV: metadata/duration, play/pause, keyboard seeking, progress, ended/replay, fast switching, language changes, unavailable-file recovery and coordination with local music/external embeds passed.
- Nine reel configurations passed: YouTube watch/share/embed, absolute MP4/WebM, relative MP4/WebM, external page and empty configuration. No video loads before interaction.
- Live SoundCloud playback passed for all three recordings: play, pause, advancing position and seeking to 10 seconds. Verified durations remain 191.001, 135.465 and 104.692 seconds. Live YouTube passed playback, pause and resume with duration 110.041 seconds and readyState 4. No failed media requests were reported.
- JavaScript syntax and Git whitespace checks passed. Primary text, secondary text and accent use high-contrast pairs; enabled control borders remain distinguishable from the page surface.
- All original project URLs, roles, contacts and image hashes match the pre-redesign inventory. The requested excluded platform name is absent from project text files.

The layout tests intercept third-party frames; live playback is checked separately with `check-live-media.cjs`. Test-only WAV bytes are never written to published assets. No Lighthouse score is claimed.

## Media and hosting

Real individual SFX files are still needed. Suggested names and the full editing procedure are in README; files go in `assets/audio/sfx/`. Optional local music goes in `assets/audio/music/`, optional local reel in `assets/video/showreel.mp4` or `.webm`, and new game artwork in `assets/images/`.

The site remains buildless static HTML/CSS/JS with relative asset paths, compatible with the existing static Cloudflare hosting arrangement. No deployment configuration was changed. The account's dashboard settings and a production deployment cannot be verified from this checkout; no publication was attempted.
