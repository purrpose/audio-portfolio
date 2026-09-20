/* Editable content. Keep both en and ru text when updating the portfolio.
   Original content is archived in docs/original-index.html. No build is required. */
window.PORTFOLIO = {
  // Paste a YouTube watch/share/embed URL, a direct .mp4/.webm URL, or a video page URL here.
  showreelUrl: "https://youtu.be/1CR6B8WtWFo",
  contacts: {
    email: "mailto:ixsperax1338@gmail.com",
    soundcloud: "https://soundcloud.com/purpose-music-818276909",
    itch: "https://purposey.itch.io/",
    discord: "purposey", // Add an actual profile or invite URL; the old file only linked to the homepage.
    legacyDiscord: "https://discord.com/"
  },
  // ABOUT: edit these paragraphs in both languages.
  about: {
    en: ["I'm Vyacheslav, a composer and sound designer with a love for games and the stories they tell.", "My work moves between electronic, cinematic and guitar-driven music. Game jams have given me a place to turn those ideas into music and sound for real, playable worlds.", "With a background in IT, I'm also drawn to the technical side of audio: how a sound responds to a player, and how music becomes part of the experience."],
    ru: ["Я Вячеслав — композитор и саунд-дизайнер. Люблю игры и истории, которые они рассказывают.", "Работаю с электронной, кинематографичной и гитарной музыкой. На геймджемах превращаю эти идеи в музыку и звук для настоящих игровых миров.", "Благодаря опыту в IT мне интересна и техническая сторона аудио: как звук реагирует на действия игрока и как музыка становится частью игрового опыта."]
  },
  // PROJECTS: add another object here. Use image: "" for a typographic cover.
  // Roles come from the old index.html; summaries use each game's linked page.
  projects: [
    { title: "The Cyber Maiden", image: "assets/images/cyber-maiden.png", url: "https://eclipsense.itch.io/the-cyber-maiden", platform: "itch.io", role: "composerSound", type: "jam", description: {en: "A dark fairy tale reimagined as a cybernetic action game.", ru: "Мрачная сказка, переосмысленная как экшен с киберимплантами."} },
    { title: "Another's Destiny", image: "assets/images/another's-destiny.png", url: "https://eclipsense.itch.io/anothers-destiny", platform: "itch.io", role: "composerSound", type: "jam", description: {en: "A fantasy adventure seen through the eyes of a young bard.", ru: "Фэнтезийное приключение глазами юного барда."} },
    { title: "Steel Sense", image: "assets/images/steel-sense.png", url: "https://eclipsense.itch.io/steel-sense", platform: "itch.io", role: "composerSound", type: "jam", description: {en: "Fight in darkness, listening for the moment to parry.", ru: "Сражения в темноте: услышать замах и вовремя отразить удар."} },
    { title: "Global Flood", image: "assets/images/global-flood.png", url: "https://eclipsense.itch.io/global-flood", platform: "itch.io", role: "composerSound", type: "jam", description: {en: "A solitary descent into an alien ocean in search of humanity's survival.", ru: "Одиночное погружение в чужой океан в поисках спасения человечества."} },
    { title: "Original Sin", image: "assets/images/original-sin.png", url: "https://platform.sibgamejam.com/games/tidesofjuice/originalsin", platform: "Siberian Game Jam", role: "composerSound", type: "jam", description: {en: "A Siberian Game Jam project with original music and sound design.", ru: "Проект Siberian Game Jam с оригинальной музыкой и саунд-дизайном."} },
    { title: "FRACTURED RED", image: "", url: "https://store.steampowered.com/app/3870260", /* Add the verified Steam URL here; none existed in the original files. */ platform: "Steam", role: "composer", type: "inDevelopment", description: {en: "Music in development for a visual novel. The public demo does not include my soundtrack yet.", ru: "Музыка для визуальной новеллы. В публичной демоверсии моего саундтрека пока нет."} }
  ],
  // TRACKS: recovered from the existing profile through the official SoundCloud widget.
  // Add { title: "Track title", url: "https://soundcloud.com/.../track" } for each track.
  // If empty, the existing profile loads in an official multi-track player.
  tracks: [
    { title: "Original Sin Boss Theme", url: "https://soundcloud.com/purpose-music-818276909/original-sin-boss-theme" },
    { title: "The Cyber Maiden Boss Theme", url: "https://soundcloud.com/purpose-music-818276909/the-cyber-maiden-boss-theme" },
    { title: "The Cyber Maiden Combat Theme", url: "https://soundcloud.com/purpose-music-818276909/the-cyber-maiden-combat-theme" }
  ],
  text: {
    en: {
      skip: "Skip to content", work: "Work", showreel: "Showreel", music: "Music", about: "About", contact: "Contact", menu: "Menu", close: "Close", navigation: "Main navigation", language: "Language", home: "Purpose Music — home",
      name: "Vyacheslav Sinitsyn", available: "Open for work & collaboration", composer: "Composer", soundDesigner: "Sound Designer", implementation: "Audio Implementation", heroDescription: "Music that sets the scene. Sound that makes it feel alive. I create audio for games and the worlds inside them.", viewProjects: "Explore projects", listen: "Listen to music", heroFoot: "Independent games. Original sound.", genres: "ELECTRONIC / AMBIENT / CINEMATIC",
      inFocus: "01 / IN FOCUS", showreelTitle: "Game Audio Showreel", showreelIntro: "A closer listen to music, sound and interaction.", comingSoon: "Showreel coming soon", reelNote: "In the meantime, explore the games and music below.", watchReel: "Watch the showreel", loadVideo: "Load video", videoError: "Video unavailable? Open the original video.",
      selectedWork: "02 / SELECTED WORK", gamesProjects: "Small teams. Distinct worlds.", workIntro: "Original music and sound design for independent games.", composerSound: "Composer & Sound Designer", jam: "Siberian Game Jam", inDevelopment: "In development", play: "Play", steam: "View on Steam", projectArt: "Project artwork:",
      pressPlay: "03 / PRESS PLAY", selectedMusic: "Selected music", musicIntro: "Electronic textures, quiet atmospheres and cinematic moments. A few things to get lost in.", onSoundcloud: "More on SoundCloud", profileTracks: "Purpose Music / Tracks", loadPlayer: "Load player", playerNote: "Listen here with the SoundCloud player.", playerFallback: "If the player cannot load, listen on SoundCloud.", soundcloudPlayer: "SoundCloud audio player", openSoundcloud: "Open on SoundCloud",
      behindSound: "04 / BEHIND THE SOUND", aboutTitle: "A musician's ear.\nA curiosity for games.", musicSkills: "Electronic · Ambient · Cinematic\nGuitar, bass & vocal recording", soundImplementation: "Sound & implementation", soundSkills: "SFX · UI audio · Atmospheres\nFL Studio · Unity · FMOD", portraitAlt: "Vyacheslav Sinitsyn playing guitar on stage",
      letsTalk: "05 / LET'S TALK", contactTitle: "Have a world in mind?\nLet's give it a sound.", contactIntro: "Open for freelance work and project collaboration.", emailLabel: "Email Vyacheslav", footerNote: "Music & sound for interactive worlds.", backTop: "Back to top",
      pageTitle: "Vyacheslav Sinitsyn · Game Audio & Music", pageDescription: "Music, sound design and interactive audio for games. Explore the work of Vyacheslav Sinitsyn (Purpose Music). Open for freelance work and collaboration."
    },
    ru: {
      skip: "Перейти к содержимому", work: "Проекты", showreel: "Шоурил", music: "Музыка", about: "Обо мне", contact: "Контакты", menu: "Меню", close: "Закрыть", navigation: "Основная навигация", language: "Язык", home: "Purpose Music — на главную",
      name: "Вячеслав Синицын", available: "Открыт к работе и сотрудничеству", composer: "Композитор", soundDesigner: "Саунд-дизайнер", implementation: "Интеграция аудио", heroDescription: "Музыка задаёт настроение. Звук оживляет мир. Я создаю аудио для игр и историй внутри них.", viewProjects: "Смотреть проекты", listen: "Слушать музыку", heroFoot: "Независимые игры. Оригинальный звук.", genres: "ЭЛЕКТРОНИКА / ЭМБИЕНТ / КИНОМУЗЫКА",
      inFocus: "01 / В ФОКУСЕ", showreelTitle: "Шоурил игрового аудио", showreelIntro: "Музыка, звук и взаимодействие — в одном видео.", comingSoon: "Шоурил скоро появится", reelNote: "А пока можно познакомиться с играми и музыкой ниже.", watchReel: "Смотреть шоурил", loadVideo: "Загрузить видео", videoError: "Видео недоступно? Открыть оригинал.",
      selectedWork: "02 / ИЗБРАННЫЕ ПРОЕКТЫ", gamesProjects: "Небольшие команды. Разные миры.", workIntro: "Оригинальная музыка и саунд-дизайн для независимых игр.", composerSound: "Композитор и саунд-дизайнер", jam: "Siberian Game Jam", inDevelopment: "В разработке", play: "Играть", steam: "Открыть в Steam", projectArt: "Обложка проекта:",
      pressPlay: "03 / ПОСЛУШАТЬ", selectedMusic: "Избранная музыка", musicIntro: "Электронные текстуры, спокойная атмосфера и кинематографичные моменты. Музыка, в которую можно погрузиться.", onSoundcloud: "Больше на SoundCloud", profileTracks: "Purpose Music / Треки", loadPlayer: "Загрузить плеер", playerNote: "Слушайте прямо здесь в плеере SoundCloud.", playerFallback: "Если плеер не загружается, слушайте на SoundCloud.", soundcloudPlayer: "Аудиоплеер SoundCloud", openSoundcloud: "Открыть на SoundCloud",
      behindSound: "04 / ЗА ЗВУКОМ", aboutTitle: "Слух музыканта.\nИнтерес к играм.", musicSkills: "Электроника · Эмбиент · Киномузыка\nЗапись гитары и баса", soundImplementation: "Звук и интеграция", soundSkills: "SFX · Звуки интерфейса · Атмосферы\nFL Studio · Unity · FMOD", portraitAlt: "Вячеслав Синицын играет на гитаре на сцене",
      letsTalk: "05 / НА СВЯЗИ", contactTitle: "Придумываете мир?\nДавайте найдём его звук.", contactIntro: "Открыт к фрилансу и совместной работе над проектами.", emailLabel: "Написать Вячеславу", footerNote: "Музыка и звук для интерактивных миров.", backTop: "Наверх",
      pageTitle: "Вячеслав Синицын · Музыка и звук для игр", pageDescription: "Музыка, саунд-дизайн и интерактивное аудио для игр. Портфолио Вячеслава Синицына (Purpose Music). Открыт к фрилансу и сотрудничеству."
    }
  }
};
