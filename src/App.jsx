import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CustomCursor } from './components/CustomCursor';
import { Header } from './components/Header';

const navigationItems = [
  // { label: 'Участники', href: '#participants', page: 'participants' },
  // { label: 'Клипы', href: '#clips', page: 'clips' },
  { label: 'Правила', href: '#rules', page: 'rules' },
];

// Таймер
// Целевая дата: 12 июня 2026, 20:00 МСК (UTC+3)
const TARGET_DATE_MS = new Date('2026-06-12T20:00:00+03:00').getTime();

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState(TARGET_DATE_MS - Date.now());

  useEffect(() => {
    // Если время уже вышло, незачем запускать интервал
    if (timeLeft <= 0) return;

    const intervalId = setInterval(() => {
      const remaining = TARGET_DATE_MS - Date.now();
      setTimeLeft(remaining <= 0 ? 0 : remaining);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return useMemo(() => {
    if (timeLeft <= 0) {
      return { expired: true, string: 'Лига стартовала!' };
    }

    const seconds = Math.floor((timeLeft / 1000) % 60);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));

    // Форматируем с ведущими нулями для красоты (01:05:09 вместо 1:5:9)
    const pad = (num) => String(num).padStart(2, '0');

    let string = '';
    if (days > 0) string += `${days}день `;
    string += `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    return { expired: false, string };
  }, [timeLeft]);
}

const SCENE_TRANSITION_MS = 650;
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000').replace(/\/$/, '');
const INTRO_STEPS = [
  {
    title: 'Заявка',
    text: 'Подай заявку на сайте Path Of Exile',
  },
  {
    title: 'Поддержи любимого стримера',
    text: 'Поддержи любимого стримера',
  },
];

const CLIPS = [
  {
    id: 'clip-1',
    author: 'VoidRunner',
    title: 'Первый жирный дроп на старте лиги без права на ошибку',
    slug: 'AuspiciousVainSrirachaResidentSleeper',
    previewImage: '/media/void-ritual-hero.png',
  },
  {
    id: 'clip-2',
    author: 'AtlasKeep',
    title: 'Пачка чудом доживает до босса и все равно забирает килл',
    slug: 'SlickSuspiciousPigHassaanChop',
    previewImage: '/media/hero-back-layer.png',
  },
  {
    id: 'clip-3',
    author: 'HexBloom',
    title: 'Тот самый момент когда карта внезапно превращается в мясорубку',
    slug: 'DifficultArbitraryWitchTebowing',
    previewImage: '/media/hero-figure-layer.png',
  },
  {
    id: 'clip-4',
    author: 'AshenMap',
    title: 'Лут, паника и последний флакон ровно в нужную секунду',
    slug: 'SpicyWimpyPancakeTakeNRG',
    previewImage: '/media/hero-smoke-layer.png',
  },
];

const RULE_SECTIONS = [
  {
    id: 'format',
    title: 'Формат лиги',
    items: [
      'Это закрытая внутренняя лига, где каждый участник играет своим персонажем, но общий прогресс воспринимается как командный результат.',
      'Главная цель сезона не просто качаться поодиночке, а совместно закрывать достижения, двигать ладдер и открывать новые игровые цели.',
      'В личном кабинете игрок отмечает выполненные достижения, следит за своими бросками в мини-игре и обновляет профильные ссылки.',
    ],
  },
  {
    id: 'points',
    title: 'Система баллов',
    items: [
      'Каждое достижение имеет собственную ценность в баллах. Чем сложнее или важнее цель для прогресса лиги, тем больше очков она приносит.',
      'Общий счет игрока складывается из базовых баллов за выполненные достижения и дополнительных бонусов, если они были получены через игровые механики.',
      'Ладдер сортирует участников по сумме баллов. Если счет совпадает, выше оказывается тот, кто выполнил больше достижений.',
    ],
  },
  {
    id: 'achievements',
    title: 'Достижения',
    items: [
      'Список достижений разбит по категориям: старт, карты, экономика, боссы и лига. Это помогает быстро понимать, где у команды проседает темп.',
      'Игрок может фильтровать, искать и отмечать выполненные достижения в личном кабинете, а также видеть, сколько еще целей остается открытыми.',
      'В будущем сюда можно добавить подтверждение достижений через офицеров, скриншоты, ссылки на клипы или журнал прогресса по датам.',
    ],
  },
  {
    id: 'board-game',
    title: 'Игра на 100 клеток',
    items: [
      'За каждое выполненное достижение игрок получает один бросок кубика. Броски копятся и тратятся в отдельной вкладке личного кабинета.',
      'Игрок двигается по полю на 100 клеток. На части клеток есть штрафы: попав на них, участник откатывается назад на указанное количество шагов.',
      'История бросков сохраняется и используется не только в кабинете, но и в popup игрока в ладдере, чтобы можно было посмотреть, как он двигался по полю.',
    ],
  },
  {
    id: 'slot-bonus',
    title: 'Автомат и бонусы',
    items: [
      'Во вкладке автомата игрок может получить дополнительную выдачу задач с множителем награды. Это отдельная механика поверх обычных достижений.',
      'Одинарная выдача дает умеренный бонус, а более рискованные наборы из нескольких задач дают усиленный множитель к очкам.',
      'Если активная выдача еще не закрыта, новую получить нельзя. Это удерживает баланс и не дает бесконечно искать только самые удобные задачи.',
    ],
  },
  {
    id: 'ladder',
    title: 'Что видно в ладдере',
    items: [
      'В таблице отображаются ник игрока, количество выполненных достижений, текущая клетка в настольной игре и общий счет.',
      'По клику на игрока открывается popup с двумя разделами: список выполненных достижений и история его ходов в игре.',
      'Такой формат дает быстрый обзор по рейтингу и позволяет без переходов в кабинет понять, за счет чего человек держится в топе.',
    ],
  },
];

const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛋ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛝ', 'ᛟ', 'ᛞ'];

function buildInitialRunes(target) {
  return target
    .split('')
    .map((char, index) => {
      if (char === ' ') {
        return ' ';
      }

      return RUNES[(index + Math.floor(Math.random() * RUNES.length)) % RUNES.length];
    })
    .join('');
}

function buildScrambledText(target, progress) {
  const revealCount = Math.floor(progress * target.length);

  return target
    .split('')
    .map((char, index) => {
      if (char === ' ') {
        return ' ';
      }

      if (index < revealCount) {
        return char;
      }

      return RUNES[Math.floor(Math.random() * RUNES.length)];
    })
    .join('');
}

function useRuneScramble(target, options = {}) {
  const { delay = 0, duration = 900, tick = 40 } = options;
  const [text, setText] = useState(() => buildInitialRunes(target));
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let intervalId;
    let timeoutId;
    const startedAt = Date.now() + delay;

    setIsDone(false);
    setText(buildInitialRunes(target));

    timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        const elapsed = Date.now() - startedAt;
        const progress = Math.min(elapsed / duration, 1);

        if (progress >= 1) {
          setText(target);
          setIsDone(true);
          window.clearInterval(intervalId);
          return;
        }

        setText(buildScrambledText(target, progress));
      }, tick);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [delay, duration, target, tick]);

  return { text, isDone };
}

async function apiRequest(path, options = {}) {
  const requestOptions = {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers ?? {}),
    },
  };
  const response = await fetch(`${API_BASE_URL}${path}`, requestOptions);
  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const detail = typeof payload === 'object' && payload?.detail
      ? payload.detail
      : 'Не удалось выполнить запрос.';
    throw new Error(detail);
  }

  return payload;
}

function mergeUserList(users, nextUser) {
  const hasUser = users.some((user) => user.id === nextUser.id);

  if (hasUser) {
    return users.map((user) => (user.id === nextUser.id ? normalizeUser(nextUser) : normalizeUser(user)));
  }

  return [...users.map((user) => normalizeUser(user)), normalizeUser(nextUser)];
}

function normalizeUser(user) {
  return {
    ...user,
    completedTaskIds: Array.isArray(user.completedTaskIds) ? user.completedTaskIds : [],
    profileLinks: {
      twitch: user.profileLinks?.twitch ?? '',
      poeNinja: user.profileLinks?.poeNinja ?? '',
      poeProfile: user.profileLinks?.poeProfile ?? '',
    },
  };
}

function getTotalScore(user) {
  const normalizedUser = normalizeUser(user);
  return Number.isFinite(Number(normalizedUser.totalPoints))
    ? Number(normalizedUser.totalPoints)
    : normalizedUser.completedTaskIds.length;
}

function formatPoints(points) {
  return Number.isInteger(points) ? String(points) : points.toFixed(1);
}

function buildParticipantLinks(profileLinks) {
  return [
    { key: 'twitch', label: 'Twitch', href: profileLinks?.twitch ?? '' },
    { key: 'poeNinja', label: 'PoE Ninja', href: profileLinks?.poeNinja ?? '' },
    { key: 'poeProfile', label: 'PoE Profile', href: profileLinks?.poeProfile ?? '' },
  ].filter((link) => link.href);
}

function extractTwitchChannel(twitchUrl) {
  if (!twitchUrl) {
    return '';
  }

  try {
    const normalizedUrl = twitchUrl.startsWith('http') ? twitchUrl : `https://${twitchUrl}`;
    const parsedUrl = new URL(normalizedUrl);
    const segments = parsedUrl.pathname.split('/').filter(Boolean);

    if (!segments.length) {
      return '';
    }

    if (segments[0] === 'videos' || segments[0] === 'directory' || segments[0] === 'settings') {
      return '';
    }

    return segments[0].toLowerCase();
  } catch {
    return '';
  }
}

function getInitialView() {
  const hash = window.location.hash.replace('#', '');
  return navigationItems.some((item) => item.page === hash) ? hash : 'home';
}

function buildClipEmbedUrl(slug) {
  return `https://clips.twitch.tv/embed?clip=${slug}&parent=${window.location.hostname || 'localhost'}`;
}

export default function App() {
  const shellRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const [activeView, setActiveView] = useState('home');
  const [transitionTarget, setTransitionTarget] = useState(null);
  const [introStep, setIntroStep] = useState(0);
  const [authUsers, setAuthUsers] = useState([]);
  const [activeClip, setActiveClip] = useState(null);
  const [twitchStatuses, setTwitchStatuses] = useState({});
  const titleTop = useRuneScramble('Not for All', {
    delay: 100,
    duration: 950,
    tick: 64,
  });

  const titleBottom = useRuneScramble('League', {
    delay: 420,
    duration: 1100,
    tick: 64,
  });

  const countdown = useCountdown(); 

  const titleComplete = titleTop.isDone && titleBottom.isDone;
  const subtitleClassName = useMemo(
    () => `hero-subtitle${titleComplete ? ' hero-subtitle--visible' : ''}`,
    [titleComplete],
  );

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) {
      return undefined;
    }

    const node = shellRef.current;

    if (!node) {
      return undefined;
    }

    const updateParallax = (clientX, clientY) => {
      const x = (clientX / window.innerWidth - 0.5) * 2;
      const y = (clientY / window.innerHeight - 0.5) * 2;

      node.style.setProperty('--parallax-x', x.toFixed(4));
      node.style.setProperty('--parallax-y', y.toFixed(4));
    };

    const handleMove = (event) => {
      updateParallax(event.clientX, event.clientY);
    };

    const handleLeave = () => {
      node.style.setProperty('--parallax-x', '0');
      node.style.setProperty('--parallax-y', '0');
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveView(getInitialView());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => () => {
    window.clearTimeout(transitionTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (!activeClip) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveClip(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeClip]);

  useEffect(() => {
    let isCancelled = false;

    const loadBootstrapData = async () => {
      try {
        const [ladderResponse, meResponse] = await Promise.all([
          apiRequest('/ladder').catch(() => []),
          apiRequest('/me').catch(() => null),
        ]);

        if (isCancelled) {
          return;
        }

        const nextUsers = Array.isArray(ladderResponse) ? ladderResponse.map(normalizeUser) : [];
        setAuthUsers(meResponse ? mergeUserList(nextUsers, normalizeUser(meResponse)) : nextUsers);
      } catch {
        if (!isCancelled) {
          setAuthUsers([]);
        }
      }
    };

    loadBootstrapData();

    return () => {
      isCancelled = true;
    };
  }, []);

  const startSceneTransition = (nextView) => {
    if (nextView === activeView || transitionTarget) {
      return;
    }

    setTransitionTarget(nextView);
    window.clearTimeout(transitionTimeoutRef.current);

    transitionTimeoutRef.current = window.setTimeout(() => {
      setActiveView(nextView);
      setTransitionTarget(null);
    }, SCENE_TRANSITION_MS);
  };

  useEffect(() => {
    if (activeView !== 'intro') {
      setIntroStep(0);
    }
  }, [activeView]);

  const handleNavigationClick = (event, item) => {
    if (!item.page) {
      return;
    }

    event.preventDefault();
    startSceneTransition(item.page);
  };

  const handleBrandClick = (event) => {
    if (activeView === 'home' && !transitionTarget) {
      return;
    }

    event.preventDefault();
    startSceneTransition('home');
  };

  const handleJoinClick = (event) => {
    event.preventDefault();
    startSceneTransition('intro');
  };

  const handleIntroNext = () => {
    if (introStep < INTRO_STEPS.length - 1) {
      setIntroStep((current) => current + 1);
      return;
    }

    startSceneTransition('participants');
  };

  const shellClassName = useMemo(() => {
    const classes = ['app-shell', `app-shell--view-${activeView}`];
    const isInnerView = activeView !== 'home';

    if (isInnerView) {
      classes.push('app-shell--inner-view');
    }

    if (transitionTarget && activeView === 'home' && transitionTarget !== 'home') {
      classes.push('app-shell--transitioning', 'app-shell--transitioning-to-inner');
    }

    if (transitionTarget === 'home' && activeView !== 'home') {
      classes.push('app-shell--transitioning', 'app-shell--transitioning-to-home');
    }

    return classes.join(' ');
  }, [activeView, transitionTarget]);

  const showHeroPage = activeView === 'home';
  const showIntroPage = activeView === 'intro';
  const showParticipantsPage = activeView === 'participants';
  const showClipsPage = activeView === 'clips';
  const showRulesPage = activeView === 'rules';

  const participantEntries = useMemo(() => authUsers
    .map((user) => {
      const normalizedUser = normalizeUser(user);

      return {
        ...normalizedUser,
        score: getTotalScore(normalizedUser),
        completedCount: normalizedUser.completedTaskIds.length,
        links: buildParticipantLinks(normalizedUser.profileLinks),
        twitchChannel: extractTwitchChannel(normalizedUser.profileLinks?.twitch),
      };
    })
    .sort((left, right) => left.nickname.localeCompare(right.nickname, 'ru')), [authUsers]);

  useEffect(() => {
    if (activeView !== 'participants') {
      return undefined;
    }

    const channels = [...new Set(
      participantEntries
        .map((user) => user.twitchChannel)
        .filter(Boolean),
    )];

    if (!channels.length) {
      setTwitchStatuses({});
      return undefined;
    }

    let isCancelled = false;

    const loadStatuses = async () => {
      const nextStatuses = {};

      await Promise.all(channels.map(async (channel) => {
        try {
          const response = await fetch(`https://decapi.me/twitch/uptime/${encodeURIComponent(channel)}`);
          const text = (await response.text()).trim().toLowerCase();
          const isOnline = response.ok
            && text
            && text !== `${channel} is offline`
            && text !== 'offline'
            && !text.includes('could not resolve channel');

          nextStatuses[channel] = {
            state: isOnline ? 'online' : 'offline',
          };
        } catch {
          nextStatuses[channel] = {
            state: 'unknown',
          };
        }
      }));

      if (!isCancelled) {
        setTwitchStatuses(nextStatuses);
      }
    };

    loadStatuses();
    const intervalId = window.setInterval(loadStatuses, 60000);

    return () => {
      isCancelled = true;
      window.clearInterval(intervalId);
    };
  }, [activeView, participantEntries]);

  const renderHome = () => (
    <section className="hero-content">
      <div className="hero-mark">
        <span className="hero-mark__top">Path of Exile II</span>
        <span className="hero-mark__bottom">Private League</span>
      </div>

      <div className="hero-copy">
        <h1>
          <span
            className="hero-title__top hero-title__scramble"
            data-final-text="Not for All"
          >
            <span className="hero-title__ghost" aria-hidden="true">
              Not for All
            </span>
            <span className="hero-title__live">{titleTop.text}</span>
          </span>
          <span
            className="hero-title__bottom hero-title__scramble"
            data-final-text="League"
          >
            <span className="hero-title__ghost" aria-hidden="true">
              League
            </span>
            <span className="hero-title__live">{titleBottom.text}</span>
          </span>
        </h1>
        <p className={subtitleClassName}>
          <span>12.06.26</span>
          <span className="hero-countdown" style={{ marginLeft: '1rem', fontVariantNumeric: 'tabular-nums', textTransform: 'lowercase' }}>
            {countdown.string}
          </span>
        </p>
      </div>

      {/* <a className="hero-cta" href="#join" onClick={handleJoinClick}>
        <span className="hero-cta__label">Вступить</span>
      </a> */}
      <a className="hero-cta" href="#join">
        <span className="hero-cta__label">Вступить</span>
      </a>
    </section>
  );

  const renderIntro = () => {
    const currentStep = INTRO_STEPS[introStep];

    return (
      <section className="ladder-page intro-page">
        <div className="intro-page__card">
          <span className="ladder-page__eyebrow">
            {String(introStep + 1).padStart(2, '0')} / {String(INTRO_STEPS.length).padStart(2, '0')}
          </span>
          <h1>{currentStep.title}</h1>
          <p>{currentStep.text}</p>

          <div className="intro-page__actions">
            <button type="button" className="hero-cta intro-page__cta" onClick={handleIntroNext}>
              <span className="hero-cta__label">Далее</span>
            </button>
          </div>
        </div>
      </section>
    );
  };

  const renderParticipants = () => (
    <section className="participants-page">
      <div className="participants-page__head">
        <span className="ladder-page__eyebrow">Участники</span>
        <h1>Круг призванных</h1>
        <p>Здесь отображаются все зарегистрированные аккаунты. В рамках этой страницы аккаунт и есть участник лиги.</p>
      </div>

      <div className="participants-grid">
        {participantEntries.length ? (
          participantEntries.map((user) => (
            <article
              key={user.id}
              className={`participant-card${twitchStatuses[user.twitchChannel]?.state === 'online' ? ' participant-card--online' : ''}`}
            >
              <div className="participant-card__head">
                {twitchStatuses[user.twitchChannel]?.state === 'online' ? (
                  <span className="participant-card__live">Онлайн на Twitch</span>
                ) : null}
                <h2>{user.nickname}</h2>
              </div>

              <dl className="participant-card__stats">
                <div>
                  <dt>Задач выполнено</dt>
                  <dd>{user.completedCount}</dd>
                </div>
                <div>
                  <dt>Баллы</dt>
                  <dd>{formatPoints(user.score)}</dd>
                </div>
              </dl>

              {user.links.length ? (
                <div className="participant-card__links">
                  {user.links.map((link) => (
                    <a key={link.key} href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ))}
                </div>
              ) : (
                <span className="participant-card__empty">Пока без добавленных ссылок профиля.</span>
              )}
            </article>
          ))
        ) : (
          <article className="participant-card participant-card--empty">
            <h2>Пока пусто</h2>
            <p>Как только кто-то зарегистрирует аккаунт через страницу входа, он сразу появится здесь как участник.</p>
          </article>
        )}
      </div>
    </section>
  );

  const renderClips = () => (
    <section className="clips-page">
      <div className="clips-page__head">
        <span className="ladder-page__eyebrow">Клипы</span>
        <h1>Моменты лиги</h1>
        <p>Пока здесь моковые карточки, но дальше этот раздел можно будет наполнять клипами с Twitch от всех участников, у кого привязана ссылка.</p>
      </div>

      <div className="clips-grid">
        {CLIPS.map((clip) => (
          <button
            key={clip.id}
            type="button"
            className="clip-card"
            onClick={() => setActiveClip(clip)}
          >
            <div className="clip-card__preview">
              <img src={clip.previewImage} alt={clip.title} />
              <span className="clip-card__play">Смотреть</span>
            </div>

            <div className="clip-card__body">
              <span className="clip-card__author">{clip.author}</span>
              <h2 title={clip.title}>{clip.title}</h2>
            </div>
          </button>
        ))}
      </div>

      {activeClip ? (
        <div
          className="clip-modal"
          role="presentation"
          onClick={() => setActiveClip(null)}
        >
          <div
            className="clip-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clip-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="clip-modal__close"
              onClick={() => setActiveClip(null)}
              aria-label="Закрыть просмотр клипа"
            >
              Закрыть
            </button>

            <div className="clip-modal__meta">
              <span>{activeClip.author}</span>
              <h2 id="clip-modal-title">{activeClip.title}</h2>
            </div>

            <div className="clip-modal__frame">
              <iframe
                src={buildClipEmbedUrl(activeClip.slug)}
                title={activeClip.title}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );

  const renderRules = () => (
    <section className="ladder-page rules-page">
      <span className="ladder-page__eyebrow">Правила</span>
      <h1>Кодекс круга</h1>
      <p>Это временное демо-наполнение, чтобы посмотреть, как на странице будут выглядеть реальные правила, договоренности и внутренние регламенты лиги.</p>

      <div className="rules-grid">
        {RULE_SECTIONS.map((section, index) => (
          <article key={section.id} className="rules-card">
            <div className="rules-card__head">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h2>{section.title}</h2>
            </div>

            <div className="rules-card__list">
              {section.items.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const buildPage = () => {
    if (showHeroPage) {
      return renderHome();
    }

    if (showIntroPage) {
      return renderIntro();
    }

    if (showParticipantsPage) {
      return renderParticipants();
    }

    if (showClipsPage) {
      return renderClips();
    }

    if (showRulesPage) {
      return renderRules();
    }

    return null;
  };

  return (
    <div className={shellClassName} ref={shellRef}>
      <CustomCursor />
      <div className="hero-bg hero-bg--back" aria-hidden="true" />
      <div className="hero-bg hero-bg--figure" aria-hidden="true" />
      <div className="hero-bg hero-bg--front" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-circle hero-circle--outer" aria-hidden="true" />
      <div className="hero-orbit hero-orbit--outer" aria-hidden="true">
        <span className="hero-orbit__rune hero-orbit__rune--primary">ᛟ</span>
        <span className="hero-orbit__rune hero-orbit__rune--secondary">ᚱ</span>
        <span className="hero-orbit__rune hero-orbit__rune--tertiary">ᛞ</span>
        <span className="hero-orbit__rune hero-orbit__rune--quaternary">ᚨ</span>
        <span className="hero-orbit__rune hero-orbit__rune--quinary">ᛉ</span>
      </div>
      <div className="hero-circle hero-circle--inner" aria-hidden="true" />
      <div className="hero-axis" aria-hidden="true" />

      <Header
        activeView={activeView}
        brand="Not For All League"
        navigationItems={navigationItems}
        onBrandClick={handleBrandClick}
        onNavigationClick={handleNavigationClick}
      />

      <main className="hero-stage">
        {buildPage()}
      </main>
    </div>
  );
}
