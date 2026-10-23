/* Editable portfolio data. Keep real credits and unique IDs.
   SFX: add files to assets/audio/sfx/ and fill in src; empty src = pending slot.
   Music: use url for SoundCloud, or src for assets/audio/music/your-track.mp3.
   Showreel: local paths such as assets/video/showreel.mp4 are also supported.
   When replacing the reel, update showreelLabel and set showreelDuration to null
   unless you have verified the new duration. Current durations were verified
   from the real players, not estimated. */
window.PORTFOLIO = {
  "showreelUrl": "https://youtu.be/1CR6B8WtWFo",
  "contacts": {
    "email": "mailto:ixsperax1338@gmail.com",
    "soundcloud": "https://soundcloud.com/purpose-music-818276909",
    "itch": "https://purposey.itch.io/",
    "discord": "purposey",
    "legacyDiscord": "https://discord.com/"
  },
  "sfx": [
    {
      "id": "sniper-rifle",
      "title": "Sniper Rifle",
      "category": {
        "en": "Combat / Gun",
        "ru": "Бой / Оружие"
      },
      "src": "assets/audio/sfx/sniper_shot.wav"
    },
    {
      "id": "phantom",
      "title": "Phantom",
      "category": {
        "en": "Ability / Invisibility",
        "ru": "Способность / Невидимость"
      },
      "src": "assets/audio/sfx/phantom.mp3"
    },
    {
      "id": "old-gate",
      "title": "Rusty Gate",
      "category": {
        "en": "Environment / Mechanism",
        "ru": "Окружение / Механизм"
      },
      "src": "assets/audio/sfx/gate.wav"
    },
    {
      "id": "siren",
      "title": "Siren",
      "category": {
        "en": "Environment / Warning",
        "ru": "Окружение / Предупреждение"
      },
      "src": "assets/audio/sfx/siren.wav"
    },
    {
      "id": "despair",
      "title": "Despair",
      "category": {
        "en": "Horror / Atmosphere",
        "ru": "Ужас / Атмосфера"
      },
      "src": "assets/audio/sfx/despair (mastered).mp3"
    }
  ],
  "projects": [
    {
      "id": "cyber-maiden",
      "title": "The Cyber Maiden",
      "image": "assets/images/cyber-maiden.png",
      "width": 315,
      "height": 250,
      "pixelArt": true,
      "color": "#102c37",
      "url": "https://eclipsense.itch.io/the-cyber-maiden",
      "platform": "itch.io",
      "role": "composerSound",
      "type": "jam",
      "listen": "cyber-combat",
      "description": {
        "en": "Combat and boss music, plus game sound effects.",
        "ru": "Музыка для боя и босса, а также игровые звуковые эффекты."
      }
    },
    {
      "id": "anothers-destiny",
      "title": "Another's Destiny",
      "image": "assets/images/another's-destiny.png",
      "width": 315,
      "height": 250,
      "pixelArt": true,
      "color": "#302333",
      "url": "https://eclipsense.itch.io/anothers-destiny",
      "platform": "itch.io",
      "role": "composerSound",
      "type": "jam",
      "description": {
        "en": "Original music and sound design for the game.",
        "ru": "Оригинальная музыка и саунд-дизайн игры."
      }
    },
    {
      "id": "steel-sense",
      "title": "Steel Sense",
      "image": "assets/images/steel-sense.png",
      "width": 315,
      "height": 250,
      "color": "#260a10",
      "url": "https://eclipsense.itch.io/steel-sense",
      "platform": "itch.io",
      "role": "composerSound",
      "type": "jam",
      "description": {
        "en": "Music and in-game sound effects.",
        "ru": "Музыка и игровые звуковые эффекты."
      }
    },
    {
      "id": "global-flood",
      "title": "Global Flood",
      "image": "assets/images/global-flood.png",
      "width": 315,
      "height": 250,
      "pixelArt": true,
      "color": "#072a3d",
      "url": "https://eclipsense.itch.io/global-flood",
      "platform": "itch.io",
      "role": "composerSound",
      "type": "jam",
      "description": {
        "en": "Original music and game sound design.",
        "ru": "Оригинальная музыка и игровой саунд-дизайн."
      }
    },
    {
      "id": "original-sin",
      "title": "Original Sin",
      "image": "assets/images/original-sin.png",
      "width": 1180,
      "height": 562,
      "color": "#10110f",
      "url": "https://platform.sibgamejam.com/games/tidesofjuice/originalsin",
      "platform": "Siberian Game Jam",
      "role": "composerSound",
      "type": "jam",
      "listen": "original-sin-boss",
      "description": {
        "en": "Original music, including the boss theme, and sound design.",
        "ru": "Оригинальная музыка, включая тему босса, и саунд-дизайн."
      }
    },
    {
      "id": "fractured-red",
      "title": "FRACTURED RED",
      "image": "assets/images/photo_2026-10-14_20-34-37.jpg",
      "url": "https://store.steampowered.com/app/3870260",
      "platform": "Steam",
      "role": "composer",
      "type": "inDevelopment",
      "description": {
        "en": "Music for a visual novel in development. The public demo does not include my soundtrack yet.",
        "ru": "Музыка для визуальной новеллы в разработке. В публичной демоверсии моего саундтрека пока нет."
      }
    }
  ],
  "tracks": [
    {
      "id": "cyber-boss",
      "title": "The Cyber Maiden Boss Theme",
      "duration": 135.465,
      "category": {
        "en": "THE CYBER MAIDEN / BOSS THEME",
        "ru": "THE CYBER MAIDEN / ТЕМА БОССА"
      },
      "url": "https://soundcloud.com/purpose-music-818276909/the-cyber-maiden-boss-theme"
    },
    {
      "id": "cyber-combat",
      "title": "The Cyber Maiden Combat Theme",
      "duration": 104.692,
      "category": {
        "en": "THE CYBER MAIDEN / COMBAT",
        "ru": "THE CYBER MAIDEN / БОЙ"
      },
      "url": "https://soundcloud.com/purpose-music-818276909/the-cyber-maiden-combat-theme"
    },
    {
      "id": "original-sin-boss",
      "title": "Original Sin Boss Theme",
      "duration": 191.001,
      "category": {
        "en": "ORIGINAL SIN / BOSS THEME",
        "ru": "ORIGINAL SIN / ТЕМА БОССА"
      },
      "url": "https://soundcloud.com/purpose-music-818276909/original-sin-boss-theme"
    },
    {
      "id": "anothers-destiny-cutscene",
      "title": "Another's Destiny Cutscene Theme",
      "duration": 41.241,
      "category": {
        "en": "ANOTHER'S DESTINY / CUTSCENE",
        "ru": "ANOTHER'S DESTINY / КАТСЦЕНА"
      },
      "url": "https://soundcloud.com/purpose-music-818276909/anothers-destiny-cutscene-ost"
    }
  ],
  "about": {
    "en": [
      "I'm a musician and game audio designer. I've been making music for around eight years and working on games for several of them.",
      "I write music, work on arrangements and play guitar, bass and drums. Alongside music, I make sound effects for games — the projects here include both.",
      "My background is in IT and programming. That also got me interested in how music and sound work inside a game, beyond the finished audio file."
    ],
    "ru": [
      "Я музыкант и гейм-аудиодизайнер. Занимаюсь музыкой около восьми лет, несколько из них работаю над играми.",
      "Пишу музыку, работаю над аранжировками, играю на гитаре, басу и барабанах. Параллельно делаю звуковые эффекты для игр — в проектах здесь есть и музыка, и саунд-дизайн.",
      "У меня есть опыт в IT и программировании. Отсюда и интерес к тому, как музыка и звук работают внутри игры, а не только в готовом аудиофайле."
    ]
  },
  "text": {
    "en": {
      "showreel": "Showreel",
      "samplePending": "PENDING",
      "skip": "Skip to content",
      "soundDesign": "Sound design",
      "games": "Games",
      "music": "Music",
      "about": "About",
      "contact": "Contact",
      "menu": "Menu",
      "close": "Close",
      "navigation": "Main navigation",
      "language": "Language",
      "home": "Vyacheslav Sinitsyn — home",
      "available": "AVAILABLE FOR PAID WORK",
      "firstName": "Vyacheslav",
      "lastName": "Sinitsyn",
      "name": "Vyacheslav Sinitsyn",
      "disciplines": "Original Music / Sound Design / Interactive Audio",
      "heroDescription": "I create sound effects, music and interactive audio for games.",
      "instruments": "GUITAR / BASS / DRUMS",
      "portraitAlt": "Vyacheslav Sinitsyn playing guitar on stage",
      "reelTitle": "GAME AUDIO REEL",
      "watchReel": "WATCH THE REEL",
      "reelUnavailable": "The reel is not available here yet.",
      "samplesPending": "Pending clips are sample slots with temporary names. Audio has not been added yet.",
      "selectedGames": "Selected games",
      "composerSound": "Composer / Sound Designer",
      "composer": "Composer",
      "jam": "SIBERIAN GAME JAM",
      "inDevelopment": "IN DEVELOPMENT",
      "playGame": "PLAY GAME",
      "steam": "VIEW ON STEAM",
      "listen": "LISTEN",
      "projectArt": "Project artwork:",
      "loadPlayer": "[ LISTEN ]",
      "closePlayer": "[ CLOSE ]",
      "openSoundcloud": "SoundCloud",
      "soundcloudPlayer": "SoundCloud player",
      "playerFallback": "If the player is unavailable, use the SoundCloud link.",
      "play": "PLAY",
      "pause": "PAUSE",
      "seek": "Seek",
      "loading": "Loading audio…",
      "audioError": "This clip couldn't load. Please try again later.",
      "playing": "Playing",
      "finished": "Finished",
      "of": "of",
      "retry": "RETRY",
      "aboutQuote": "Music and sound design are both part of my work with games.",
      "skills": "Skills",
      "soundDesignCaps": "SOUND DESIGN",
      "musicCaps": "MUSIC",
      "technicalCaps": "TOOLS & IMPLEMENTATION",
      "soundSkills": "Sound design and audio editing\nSound synthesis and processing\nSeamless loops\nInteractive and atmospheric audio",
      "musicSkills": "Composition and arrangement\nGenre-spanning music and adaptive scoring\nLive instruments and vocal recording",
      "technicalSkills": "Music production in FL Studio\nAudio implementation in Unity and UE\nFMOD\nGit and basic programming",
      "tools": "FL STUDIO / UNITY / FMOD",
      "contactTitle": "LET'S TALK.",
      "emailLabel": "EMAIL",
      "copyUsername": "Copy username",
      "discordCopied": "Copied!",
      "discordCopyFailed": "Select and copy the username manually.",
      "backTop": "BACK TO TOP",
      "pageTitle": "Vyacheslav Sinitsyn — Composer & Sound Designer",
      "pageDescription": "I create sound effects, music and interactive audio for games. Game audio portfolio of Vyacheslav Sinitsyn. Available for paid work.",
      "archiveLabel": "PERSONAL AUDIO ARCHIVE",
      "statusLabel": "STATUS",
      "reelPoster": "GAME\nAUDIO.",
      "reelContents": "MUSIC / SOUND DESIGN",
      "reelNote": "Selected music and sound design from game projects.",
      "recordingLabel": "RECORDING",
      "contextLabel": "CONTEXT",
      "timeLabel": "TIME",
      "assetLibrary": "INDIVIDUAL ASSETS",
      "studioNotes": "STUDIO NOTES"
    },
    "ru": {
      "showreel": "Шоурил",
      "samplePending": "ОЖИДАНИЕ",
      "skip": "Перейти к содержимому",
      "soundDesign": "Саунд-дизайн",
      "games": "Игры",
      "music": "Музыка",
      "about": "Обо мне",
      "contact": "Контакты",
      "menu": "Меню",
      "close": "Закрыть",
      "navigation": "Основная навигация",
      "language": "Язык",
      "home": "Вячеслав Синицын — на главную",
      "available": "ДОСТУПЕН ДЛЯ ОПЛАЧИВАЕМОЙ РАБОТЫ",
      "firstName": "Вячеслав",
      "lastName": "Синицын",
      "name": "Вячеслав Синицын",
      "disciplines": "Оригинальная музыка / Саунд-дизайн / Интерактивное аудио",
      "heroDescription": "Создаю звуковые эффекты, музыку и интерактивное аудио для игр.",
      "instruments": "ГИТАРА / БАС / БАРАБАНЫ",
      "portraitAlt": "Вячеслав Синицын играет на гитаре на сцене",
      "reelTitle": "ШОУРИЛ ИГРОВОГО АУДИО",
      "watchReel": "СМОТРЕТЬ ШОУРИЛ",
      "reelUnavailable": "Шоурил пока не опубликован.",
      "samplesPending": "Ожидающие клипы — заготовки с временными названиями. Аудио пока не добавлено.",
      "selectedGames": "Избранные игры",
      "composerSound": "Композитор / Саунд-дизайнер",
      "composer": "Композитор",
      "jam": "SIBERIAN GAME JAM",
      "inDevelopment": "В РАЗРАБОТКЕ",
      "playGame": "ИГРАТЬ",
      "steam": "ОТКРЫТЬ В STEAM",
      "listen": "СЛУШАТЬ",
      "projectArt": "Обложка проекта:",
      "loadPlayer": "[ СЛУШАТЬ ]",
      "closePlayer": "[ ЗАКРЫТЬ ]",
      "openSoundcloud": "SoundCloud",
      "soundcloudPlayer": "Плеер SoundCloud",
      "playerFallback": "Если плеер недоступен, откройте ссылку на SoundCloud.",
      "play": "ПУСК",
      "pause": "ПАУЗА",
      "seek": "Позиция",
      "loading": "Загрузка аудио…",
      "audioError": "Не удалось загрузить клип. Попробуйте позже.",
      "playing": "Играет",
      "finished": "Завершено",
      "of": "из",
      "retry": "ПОВТОР",
      "aboutQuote": "Музыка и саунд-дизайн — две части моей работы с играми.",
      "skills": "Навыки",
      "soundDesignCaps": "САУНД-ДИЗАЙН",
      "musicCaps": "МУЗЫКА",
      "technicalCaps": "ИНСТРУМЕНТЫ И ИНТЕГРАЦИЯ",
      "soundSkills": "Создание звуковых эффектов\nРабота с атмосферой и эмбиентом\nИнтерактивное аудио",
      "musicSkills": "Композиция и аранжировка\nАдаптивное скоринг и жанровая музыка\nЗапись гитары, баса и вокала",
      "technicalSkills": "Создание музыки в FL Studio\nРабота со звуком в Unity и FMOD\nUnreal Engine\nGit и основы программирования",
      "tools": "FL STUDIO / UNITY / FMOD",
      "contactTitle": "ДАВАЙТЕ ОБСУДИМ.",
      "emailLabel": "ПОЧТА",
      "copyUsername": "Копировать ник",
      "discordCopied": "Скопировано!",
      "discordCopyFailed": "Выделите и скопируйте ник вручную.",
      "backTop": "НАВЕРХ",
      "pageTitle": "Вячеслав Синицын — Composer & Sound Designer",
      "pageDescription": "Создаю звуковые эффекты, музыку и интерактивное аудио для игр. Портфолио Вячеслава Синицына. Доступен для оплачиваемой работы.",
      "archiveLabel": "ЛИЧНЫЙ АУДИОАРХИВ",
      "statusLabel": "СТАТУС",
      "reelPoster": "ИГРОВОЕ\nАУДИО.",
      "reelContents": "МУЗЫКА / САУНД-ДИЗАЙН",
      "reelNote": "Музыка и саунд-дизайн из игровых проектов.",
      "recordingLabel": "ЗАПИСЬ",
      "contextLabel": "КОНТЕКСТ",
      "timeLabel": "ВРЕМЯ",
      "assetLibrary": "ОТДЕЛЬНЫЕ АССЕТЫ",
      "studioNotes": "СТУДИЙНЫЕ ЗАМЕТКИ"
    }
  },
  "showreelLabel": "SHOWREEL_2026",
  "showreelDuration": 110.041
};
