(() => {
  "use strict";
  const data = window.PORTFOLIO;
  const $ = (selector) => document.querySelector(selector);
  let language = "en";
  try { if (localStorage.getItem("portfolio-language") === "ru") language = "ru"; } catch { /* Storage may be disabled. */ }
  const t = (key) => data.text[language][key] ?? data.text.en[key] ?? key;
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const translated = (tag, className, key) => {
    const node = element(tag, className, t(key));
    node.dataset.i18n = key;
    return node;
  };
  const externalLink = (url, className, text) => {
    const link = element("a", className, text);
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  };

  function renderProjects() {
    const cards = data.projects.map((project, index) => {
      const card = element("article", "project-card");
      const art = project.url ? externalLink(project.url, "project-art") : element("div", "project-art fractured-cover");
      if (project.image) {
        const img = element("img", project.image.includes("original-sin") ? "" : "pixel-art");
        img.src = project.image;
        img.alt = `${t("projectArt")} ${project.title}`;
        img.loading = "lazy";
        img.decoding = "async";
        img.width = project.image.includes("original-sin") ? 1180 : 315;
        img.height = project.image.includes("original-sin") ? 562 : 250;
        art.append(img);
      } else {
        art.classList.add("fractured-cover");
        const title = element("strong");
        project.title.split(" ").forEach(word => title.append(element("span", "", word)));
        art.append(title);
        if (project.url) art.setAttribute("aria-label", project.title);
        else art.setAttribute("aria-hidden", "true");
      }
      art.append(element("span", "project-number", String(index + 1).padStart(2, "0")));
      const bottom = element("div", "project-bottom");
      bottom.append(element("span", "project-role", t(project.role)));
      if (project.url) {
        const label = project.platform === "Steam" ? t("steam") : t("play");
        const link = externalLink(project.url, "project-button", `${label} ↗`);
        link.setAttribute("aria-label", `${label}: ${project.title}`);
        bottom.append(link);
      } else bottom.append(element("span", "project-pending", t("inDevelopment")));
      card.append(art, element("p", "project-meta", t(project.type)), element("h3", "", project.title), element("p", "project-description", project.description[language]), bottom);
      return card;
    });
    $("#projects").replaceChildren(...cards);
    $("#biography").replaceChildren(...data.about[language].map(copy => element("p", "", copy)));
  }

  function setupTracks() {
    const tracks = data.tracks.length ? data.tracks : [{ url: data.contacts.soundcloud }];
    tracks.forEach((track, index) => {
      const row = element("article", "track");
      const heading = element("div", "track-heading");
      const title = element("h3", "track-title");
      title.append(element("span", "track-index", String(index + 1).padStart(2, "0")));
      title.append(track.title ? element("span", "", track.title) : translated("span", "", "profileTracks"));
      const load = translated("button", "load-player", "loadPlayer");
      load.type = "button";
      heading.append(title, load);
      const note = translated("p", "track-note", "playerNote");
      const link = externalLink(track.url, "track-link");
      link.append(translated("span", "", "openSoundcloud"), document.createTextNode(" ↗"));
      row.append(heading, note, link);
      load.addEventListener("click", () => {
        const frame = element("iframe", "player-frame");
        const params = new URLSearchParams({url: track.url, color: "#bc7845", auto_play: "false", hide_related: "true", show_comments: "false", show_user: "true", show_reposts: "false", show_artwork: "false", visual: "false", single_active: "true"});
        frame.src = `https://w.soundcloud.com/player/?${params}`;
        frame.title = `${t("soundcloudPlayer")}${track.title ? `: ${track.title}` : ""}`;
        frame.dataset.playerTitle = track.title || "";
        frame.allow = "autoplay";
        row.insertBefore(frame, link);
        note.dataset.i18n = "playerFallback";
        note.textContent = t("playerFallback");
        // Keep the official controls visible: play, pause, seek and track selection.
        // Loading the frame does not start playback. No API keys or hidden audio player.
        load.remove();
        frame.addEventListener("load", () => frame.focus(), { once: true });
      }, { once: true });
      $("#tracks").append(row);
    });
  }

  function setupShowreel() {
    if (!data.showreelUrl) return;
    let url;
    try { url = new URL(data.showreelUrl); } catch { return; }
    if (!["https:", "http:"].includes(url.protocol)) return;
    const host = url.hostname.replace(/^www\./, "");
    let videoId = "";
    if (host === "youtu.be") videoId = url.pathname.slice(1);
    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      videoId = url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] || "";
    }
    const youtube = /^[\w-]{11}$/.test(videoId);
    const direct = /\.(mp4|webm)$/i.test(url.pathname);
    const panel = $("#showreel-content");
    const content = element("div", "reel-label");
    const button = youtube || direct ? translated("button", "button primary", "loadVideo") : externalLink(url.href, "button primary");
    if (button.tagName === "A") button.append(translated("span", "", "watchReel"));
    else button.type = "button";
    content.append(button);
    panel.replaceChildren(content);
    const fallback = externalLink(url.href, "reel-link");
    fallback.append(translated("span", "", "videoError"));
    panel.after(fallback);
    if (!(youtube || direct)) return;
    button.addEventListener("click", () => {
      const media = element(youtube ? "iframe" : "video");
      if (youtube) {
        // YouTube requires an HTTP Referer; preview over HTTP(S), not file://.
        media.referrerPolicy = "strict-origin-when-cross-origin";
        media.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0`;
        media.title = t("showreelTitle");
        media.allow = "fullscreen; picture-in-picture; encrypted-media";
        media.allowFullscreen = true;
      } else {
        media.src = url.href;
        media.controls = true;
        media.preload = "metadata";
        media.playsInline = true;
        media.setAttribute("aria-label", t("showreelTitle"));
      }
      panel.classList.add("has-video");
      panel.replaceChildren(media);
      media.focus();
    }, { once: true });
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
  matchMedia("(max-width: 650px)").addEventListener("change", () => setMenu(false));

  function applyLanguage(next, persist = false) {
    language = next;
    document.documentElement.lang = language;
    document.title = t("pageTitle");
    document.querySelectorAll("[data-i18n]").forEach(node => { node.textContent = t(node.dataset.i18n); });
    document.querySelectorAll("[data-lang]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.lang === language)));
    document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').forEach(meta => { meta.content = t("pageDescription"); });
    document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach(meta => { meta.content = t("pageTitle"); });
    $('meta[property="og:locale"]').content = language === "ru" ? "ru_RU" : "en_US";
    nav.setAttribute("aria-label", t("navigation"));
    $(".language").setAttribute("aria-label", t("language"));
    $(".brand").setAttribute("aria-label", t("home"));
    $(".contact-arrow").setAttribute("aria-label", t("emailLabel"));
    $("#portrait").alt = t("portraitAlt");
    document.querySelectorAll(".player-frame").forEach(frame => { frame.title = `${t("soundcloudPlayer")}${frame.dataset.playerTitle ? `: ${frame.dataset.playerTitle}` : ""}`; });
    const video = $("#showreel-content iframe, #showreel-content video");
    if (video) { video.title = t("showreelTitle"); video.setAttribute("aria-label", t("showreelTitle")); }
    renderProjects();
    if (persist) { try { localStorage.setItem("portfolio-language", language); } catch { /* Still works for this visit. */ } }
  }
  document.querySelectorAll("[data-lang]").forEach(button => button.addEventListener("click", () => applyLanguage(button.dataset.lang, true)));
  document.querySelectorAll("[data-contact]").forEach(link => { link.href = data.contacts[link.dataset.contact]; });
  $(".email-link").textContent = data.contacts.email.replace(/^mailto:/, "");
  if (data.contacts.discord) { $("#discord-link").href = data.contacts.discord; $("#discord-link").hidden = false; }
  $("#year").textContent = new Date().getFullYear();

  // Decorative signal lines; staggered CSS motion is not tied to audio playback.
  const lines = $("#signal-lines");
  for (let row = 0; row < 32; row++) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const points = [];
    for (let x = 25; x <= 415; x += 3) {
      const envelope = Math.sin((x - 25) / 390 * Math.PI) ** 1.6;
      const y = 95 + row * 5 + Math.sin(x / 43 + row * .105) * 50 * envelope + Math.sin(x / 22 - row * .08) * 24 * envelope;
      points.push(`${x === 25 ? "M" : "L"}${x},${y.toFixed(2)}`);
    }
    path.setAttribute("d", points.join(" "));
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "url(#signal-color)");
    path.setAttribute("stroke-width", ".85");
    path.setAttribute("opacity", ".75");
    path.style.animationDelay = `${-row * .18}s`;
    lines.append(path);
  }
  const signalArt = $(".signal-art");
  let signalVisible = true;
  const updateSignalMotion = () => signalArt.classList.toggle("is-paused", !signalVisible || document.hidden);
  const signalObserver = new IntersectionObserver(([entry]) => {
    signalVisible = entry.isIntersecting;
    updateSignalMotion();
  });
  signalObserver.observe(signalArt);
  document.addEventListener("visibilitychange", updateSignalMotion);
  updateSignalMotion();
  for (let i = 0; i < 115; i++) {
    const bar = element("i");
    bar.style.height = `${15 + Math.abs(Math.sin(i * .41) * Math.cos(i * .13)) * 115}px`;
    $(".reel-wave").append(bar);
  }
  setupTracks();
  setupShowreel();
  applyLanguage(language);
})();
