(() => {
  "use strict";
  const data = window.PORTFOLIO;
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  let language = "en";
  try { if (localStorage.getItem("portfolio-language") === "ru") language = "ru"; } catch { /* Optional storage. */ }
  const t = key => data.text[language][key] ?? data.text.en[key] ?? key;
  const localized = value => typeof value === "string" ? value : value?.[language] ?? value?.en ?? "";
  const languageUpdates = [];
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const translated = (tag, className, key) => {
    const node = el(tag, className, t(key));
    node.dataset.i18n = key;
    return node;
  };
  function link(url, className, label) {
    const node = el("a", className, label);
    node.href = url;
    if (/^https?:/i.test(url)) { node.target = "_blank"; node.rel = "noopener noreferrer"; }
    return node;
  }
  const time = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}` : "—:——";

  // One media owner across local files, the reel and visible SoundCloud embeds.
  // Removing an inactive embed also stops its audio without a third-party API.
  const localPlayers = [];
  let mediaOwner = null;
  let externalPlayer = null;
  function claimMedia(owner) {
    mediaOwner = owner;
    localPlayers.forEach(player => { if (player !== owner) player.pause(); });
    if (externalPlayer && externalPlayer !== owner) {
      const previous = externalPlayer;
      externalPlayer = null;
      previous.dispose();
    }
  }

  function createAudioPlayer(item, index) {
    const row = el("article", "sample");
    row.dataset.sample = item.id || String(index);
    const title = el("h3", "sample-title", item.title);
    const category = el("p", "sample-category", localized(item.category));
    const details = el("div", "sample-details");
    details.append(title, category);
    const toggle = el("button", "sample-toggle");
    toggle.type = "button";
    toggle.setAttribute("aria-pressed", "false");
    const transport = el("div", "sample-transport");
    const progress = el("input", "sample-progress");
    progress.type = "range";
    progress.min = "0"; progress.max = "0"; progress.step = "0.01"; progress.value = "0";
    progress.disabled = true;
    const clock = el("span", "sample-time", "0:00 / —:——");
    clock.setAttribute("aria-hidden", "true");
    const status = el("p", "sample-status");
    status.setAttribute("role", "status");
    transport.append(progress, clock);
    row.append(details, toggle, transport, status);
    // Empty slots stay visible without creating an audio element or a request.
    if (!item.src?.trim()) {
      row.classList.add("is-pending");
      toggle.disabled = true;
      clock.textContent = "—:——";
      const refreshPending = () => {
        toggle.textContent = t("samplePending");
        toggle.setAttribute("aria-label", `${item.title}: ${t("samplePending")}`);
        progress.setAttribute("aria-label", `${t("seek")}: ${item.title}`);
        category.textContent = localized(item.category);
      };
      languageUpdates.push(refreshPending);
      refreshPending();
      return row;
    }
    const audio = el("audio");
    audio.preload = "metadata";
    audio.src = item.src;
    audio.hidden = true;
    row.append(audio);
    let desired = false;
    let failed = false;
    let statusKey = "";
    let request = 0;
    let loadTimer;
    const player = {
      pause() {
        desired = false;
        request++;
        clearTimeout(loadTimer);
        audio.pause();
        if (!failed) statusKey = "";
        refresh();
      }
    };
    localPlayers.push(player);
    function refresh() {
      const playing = !audio.paused && !audio.ended;
      const key = playing || desired ? "pause" : failed ? "retry" : "play";
      toggle.textContent = t(key);
      toggle.setAttribute("aria-label", `${t(key)}: ${item.title}`);
      toggle.setAttribute("aria-pressed", String(playing || desired));
      row.classList.toggle("is-playing", playing);
      row.classList.toggle("has-error", failed);
      status.textContent = statusKey ? t(statusKey) : "";
      category.textContent = localized(item.category);
      const duration = audio.duration;
      const current = audio.currentTime || 0;
      const known = Number.isFinite(duration) && duration > 0 && !failed;
      progress.disabled = !known;
      progress.max = known ? String(duration) : "0";
      progress.value = known ? String(current) : "0";
      progress.style.setProperty("--progress", known ? `${current / duration * 100}%` : "0%");
      progress.setAttribute("aria-label", `${t("seek")}: ${item.title}`);
      progress.setAttribute("aria-valuetext", `${time(current)} ${t("of")} ${time(duration)}`);
      clock.textContent = `${time(current)} / ${time(duration)}`;
    }
    function fail() {
      desired = false;
      failed = true;
      request++;
      clearTimeout(loadTimer);
      audio.pause();
      statusKey = "audioError";
      refresh();
    }
    toggle.addEventListener("click", async () => {
      if (desired || !audio.paused) { player.pause(); return; }
      claimMedia(player);
      desired = true;
      const attempt = ++request;
      if (failed) { failed = false; audio.load(); }
      if (audio.ended) audio.currentTime = 0;
      statusKey = "loading";
      refresh();
      loadTimer = setTimeout(() => { if (attempt === request && desired) fail(); }, 15000);
      try {
        await audio.play();
        if (attempt !== request || mediaOwner !== player || !desired) return;
        clearTimeout(loadTimer);
        statusKey = "";
        refresh();
      } catch (error) {
        if (attempt === request && error.name !== "AbortError") fail();
      }
    });
    audio.addEventListener("play", () => {
      if (mediaOwner !== player || !desired) { audio.pause(); return; }
      refresh();
      $("#audio-announcement").textContent = `${t("playing")}: ${item.title}`;
    });
    audio.addEventListener("playing", () => { clearTimeout(loadTimer); statusKey = ""; refresh(); });
    audio.addEventListener("pause", refresh);
    audio.addEventListener("ended", () => {
      desired = false;
      statusKey = "";
      clearTimeout(loadTimer);
      refresh();
      $("#audio-announcement").textContent = `${t("finished")}: ${item.title}`;
    });
    audio.addEventListener("error", fail);
    audio.addEventListener("loadedmetadata", refresh);
    audio.addEventListener("durationchange", refresh);
    audio.addEventListener("timeupdate", refresh);
    progress.addEventListener("input", () => { if (!progress.disabled) { audio.currentTime = Number(progress.value); refresh(); } });
    languageUpdates.push(refresh);
    refresh();
    return row;
  }

  function setupSamples() {
    const samples = data.sfx || [];
    $("#samples-empty").hidden = samples.length > 0;
    $("#samples-pending-note").hidden = !samples.some(item => !item.src?.trim());
    $("#samples").append(...samples.map((item, index) => createAudioPlayer(item, index)));
  }

  function setupProjects() {
    data.projects.forEach(project => {
      const article = el("article", "project");
      article.id = `project-${project.id}`;
      if (project.color) article.style.setProperty("--project-bg", project.color);
      const art = project.url ? link(project.url, "project-art") : el("div", "project-art");
      if (project.image) {
        const img = el("img", project.pixelArt ? "pixel-art" : "");
        img.src = project.image;
        img.width = project.width || 315; img.height = project.height || 250;
        img.loading = "lazy"; img.decoding = "async";
        languageUpdates.push(() => { img.alt = `${t("projectArt")} ${project.title}`; });
        art.append(img);
      } else {
        art.classList.add("typographic-cover");
        art.append(el("strong", "", project.title));
        art.setAttribute("aria-label", project.title);
      }
      const meta = el("div", "project-meta");
      meta.append(translated("span", "", project.type));
      const info = el("div", "project-info");
      info.append(el("h3", "", project.title), translated("p", "project-role", project.role));
      if (project.description) {
        const description = el("p", "project-description");
        languageUpdates.push(() => { description.textContent = localized(project.description); });
        info.append(description);
      }
      const actions = el("div", "project-actions");
      if (project.url) {
        const action = link(project.url, "");
        const key = project.platform === "Steam" ? "steam" : "playGame";
        action.append(translated("span", "", key));
        languageUpdates.push(() => action.setAttribute("aria-label", `${t(key)}: ${project.title}`));
        actions.append(action);
      }
      if (project.listen && data.tracks.some(track => track.id === project.listen)) {
        const action = link(`#track-${project.listen}`, "");
        action.append(translated("span", "", "listen"));
        actions.append(action);
      }
      info.append(meta, actions);
      article.append(art, info);
      $("#projects").append(article);
    });
  }

  function setupTracks() {
    data.tracks.forEach((track, index) => {
      if (track.src) {
        const row = createAudioPlayer(track, index);
        row.id = `track-${track.id}`;
        if (track.url) row.append(link(track.url, "track-link", "SoundCloud"));
        $("#tracks").append(row);
        return;
      }
      if (!track.url) return;
      const row = el("article", "track");
      row.id = `track-${track.id}`;
      const heading = el("div", "track-heading");
      const category = el("p", "track-category");
      const title = el("h3", "track-title", track.title);
      languageUpdates.push(() => { category.textContent = localized(track.category); });
      const button = translated("button", "load-player", "loadPlayer");
      button.type = "button";
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", `player-${track.id}`);
      heading.append(title, category, el("span", "track-duration", time(track.duration)), button);
      const mount = el("div", "player-mount");
      mount.id = `player-${track.id}`;
      const fallback = translated("p", "player-fallback", "playerFallback");
      fallback.hidden = true;
      const original = link(track.url, "track-link");
      original.append(translated("span", "", "openSoundcloud"));
      row.append(heading, mount, fallback, original);
      let frame;
      const owner = {
        dispose() {
          mount.replaceChildren();
          frame = null;
          button.dataset.i18n = "loadPlayer";
          button.textContent = t("loadPlayer");
          button.setAttribute("aria-expanded", "false");
          fallback.hidden = true;
          updateLabel();
        }
      };
      const updateLabel = () => {
        button.setAttribute("aria-label", `${t(frame ? "closePlayer" : "loadPlayer")}: ${track.title}`);
        if (frame) frame.title = `${t("soundcloudPlayer")}: ${track.title}`;
      };
      languageUpdates.push(updateLabel);
      button.addEventListener("click", () => {
        if (frame) {
          owner.dispose(); externalPlayer = null; mediaOwner = null;
          return;
        }
        claimMedia(owner);
        externalPlayer = owner;
        frame = el("iframe", "player-frame");
        const params = new URLSearchParams({ url: track.url, color: "#647022", auto_play: "false", hide_related: "true", show_comments: "false", show_user: "true", show_reposts: "false", show_artwork: "false", visual: "false", single_active: "true" });
        frame.src = `https://w.soundcloud.com/player/?${params}`;
        frame.allow = "autoplay";
        frame.referrerPolicy = "strict-origin-when-cross-origin";
        button.dataset.i18n = "closePlayer";
        button.textContent = t("closePlayer");
        button.setAttribute("aria-expanded", "true");
        fallback.hidden = false;
        updateLabel();
        mount.append(frame);
      });
      $("#tracks").append(row);
    });
  }

  function setupShowreel() {
    const stage = $("#showreel-content");
    let url;
    try { if (data.showreelUrl?.trim()) url = new URL(data.showreelUrl, document.baseURI); } catch { /* Missing or invalid reel. */ }
    if (!url || !["https:", "http:"].includes(url.protocol)) {
      stage.append(translated("p", "reel-caption", "reelUnavailable"));
      return;
    }
    const duration = $("#reel-duration");
    duration.hidden = !Number.isFinite(data.showreelDuration);
    if (!duration.hidden) duration.textContent = time(data.showreelDuration);
    const host = url.hostname.replace(/^www\./, "");
    let id = host === "youtu.be" ? url.pathname.slice(1) : "";
    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) id = url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] || "";
    const youtube = /^[\w-]{11}$/.test(id);
    const direct = /\.(mp4|webm)$/i.test(url.pathname);
    const owner = { dispose: reset };
    let media;
    function reset() {
      media = null;
      const button = youtube || direct ? el("button", "reel-placeholder") : link(url.href, "reel-placeholder");
      if (button.tagName === "BUTTON") button.type = "button";
      const slate = el("span", "reel-slate");
      slate.append(el("span", "", data.showreelLabel || "SHOWREEL"), el("span", "", "[ VIDEO ]"));
      const action = el("span", "reel-play");
      action.append(translated("span", "", "watchReel"));
      button.append(slate, translated("span", "reel-poster-title", "reelPoster"), action);
      stage.replaceChildren(button);
      if (youtube || direct) button.addEventListener("click", () => {
        claimMedia(owner);
        externalPlayer = owner;
        media = el(youtube ? "iframe" : "video");
        if (youtube) {
          media.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
          media.allow = "autoplay; fullscreen; picture-in-picture; encrypted-media";
          media.allowFullscreen = true;
          media.referrerPolicy = "strict-origin-when-cross-origin";
        } else {
          media.src = url.href;
          media.controls = true;
          media.preload = "metadata";
          media.playsInline = true;
        }
        media.title = t("reelTitle");
        media.setAttribute("aria-label", t("reelTitle"));
        stage.replaceChildren(media);
        media.focus();
        if (direct) media.play().catch(() => { /* Native play control remains available. */ });
      });
    }
    languageUpdates.push(() => {
      if (media) { media.title = t("reelTitle"); media.setAttribute("aria-label", t("reelTitle")); }
    });
    reset();
  }

  const menu = $(".menu-button");
  const nav = $("#navigation");
  function setMenu(open) {
    menu.setAttribute("aria-expanded", String(open));
    menu.dataset.i18n = open ? "close" : "menu";
    menu.textContent = t(menu.dataset.i18n);
    nav.classList.toggle("is-open", open);
  }
  menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", event => { if (event.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") { setMenu(false); menu.focus(); }
  });
  document.addEventListener("click", event => { if (!event.target.closest(".header")) setMenu(false); });
  document.addEventListener("focusin", event => { if (!event.target.closest(".header")) setMenu(false); });
  matchMedia("(max-width: 900px)").addEventListener("change", () => setMenu(false));

  function applyLanguage(next, persist = false) {
    language = next;
    document.documentElement.lang = language;
    document.title = t("pageTitle");
    $$("[data-i18n]").forEach(node => { node.textContent = t(node.dataset.i18n); });
    $$("[data-lang]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.lang === language)));
    $$('meta[name="description"], meta[property="og:description"]').forEach(meta => { meta.content = t("pageDescription"); });
    $('meta[property="og:title"]').content = t("pageTitle");
    $('meta[property="og:locale"]').content = language === "ru" ? "ru_RU" : "en_US";
    nav.setAttribute("aria-label", t("navigation"));
    $(".language").setAttribute("aria-label", t("language"));
    $(".brand").setAttribute("aria-label", t("home"));
    $("#portrait").alt = t("portraitAlt");
    $("#biography").replaceChildren(...data.about[language].map(copy => el("p", "", copy)));
    languageUpdates.forEach(update => update());
    if (persist) { try { localStorage.setItem("portfolio-language", language); } catch { /* Still works for this visit. */ } }
  }
  $$("[data-lang]").forEach(button => button.addEventListener("click", () => applyLanguage(button.dataset.lang, true)));
  $$("[data-contact]").forEach(node => { node.href = data.contacts[node.dataset.contact]; });
  $$('[data-contact="email"]').forEach(node => { node.textContent = data.contacts.email.replace(/^mailto:/, ""); });
  const username = data.contacts.discord?.trim();
  $("#discord-contact").hidden = !username;
  if (username) {
    $("#discord-username").textContent = username;
    const button = $("#discord-copy");
    const status = $("#discord-status");
    let resetTimer;
    button.addEventListener("click", async () => {
      clearTimeout(resetTimer);
      let copied = false;
      try { await navigator.clipboard.writeText(username); copied = true; } catch {
        const field = el("textarea", "sr-only");
        field.value = username;
        document.body.append(field);
        field.select();
        try { copied = document.execCommand("copy"); } catch { /* Manual copy stays possible. */ }
        field.remove();
        button.focus({ preventScroll: true });
      }
      status.dataset.i18n = copied ? "discordCopied" : "discordCopyFailed";
      status.textContent = t(status.dataset.i18n);
      resetTimer = setTimeout(() => { status.textContent = ""; delete status.dataset.i18n; }, 4000);
    });
  }
  $("#year").textContent = new Date().getFullYear();
  setupSamples();
  setupProjects();
  setupTracks();
  setupShowreel();
  applyLanguage(language);
})();
