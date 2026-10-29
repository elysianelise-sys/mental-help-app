import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/layout/AppHeader';
import { Icon } from '../../components/ui/Icon';
import type { IconName } from '../../components/ui/Icon';
import { useDragScroll } from '../../hooks/useDragScroll';
import { read, write } from '../../data/storage';
import content from '../../data/mock/content.json';
import { THERAPIST_PHOTO } from '../../data/therapists';
import styles from './ExplorePage.module.css';

type ExploreItem = (typeof content)[number] & { themes: string[] };
const items = content as ExploreItem[];
const themes = ['Calm Mind', 'Sleep Rituals', 'Anxiety Relief', 'Self Compassion'];
const SAVED_KEY = 'mh.saved.v1';
const THEME_ICON: Record<string, IconName> = {
  'Calm Mind': 'tagMeditation',
  'Sleep Rituals': 'moon',
  'Anxiety Relief': 'tagNature',
  'Self Compassion': 'tagHealth',
};
const initials = (name: string) =>
  name
    .replace(/^Dr\.?\s+/i, '')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function ExplorePage() {
  const navigate = useNavigate();
  const [activeTheme, setActiveTheme] = useState('Calm Mind');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<string[]>(() => read<string[]>(SAVED_KEY, []));
  const [toast, setToast] = useState('');
  const [showAllThemes, setShowAllThemes] = useState(false);
  const pillsDrag = useDragScroll<HTMLDivElement>();

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    // While searching, look across every theme; otherwise show the selected theme.
    return items.filter((item) =>
      normalized
        ? [item.title, item.therapist, ...item.themes].some((value) =>
            value.toLocaleLowerCase().includes(normalized),
          )
        : item.themes.includes(activeTheme),
    );
  }, [activeTheme, query]);

  const toggleSaved = (id: string) => {
    const next = saved.includes(id) ? saved.filter((savedId) => savedId !== id) : [...saved, id];
    if (write(SAVED_KEY, next)) {
      setSaved(next);
      setToast(next.includes(id) ? 'Saved' : 'Removed from saved');
    }
  };

  const expandSearch = () => {
    setSearchOpen(true);
    window.setTimeout(() => document.getElementById('explore-search')?.focus(), 0);
  };
  const collapseSearch = () => {
    setSearchOpen(false);
    setQuery('');
  };
  const searchProps = {
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') collapseSearch();
    },
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.currentTarget.value;
      setQuery(value);
      if (!value) setSearchOpen(false);
    },
  };

  const featured = filtered[0];
  const more = filtered.slice(1);

  return (
    <>
      <AppHeader title="Explore" back />
      <main className={styles.page}>
        <div className={styles.toolsRow}>
          {searchOpen ? (
            <label className={styles.searchExpanded}>
              <Icon name="search" size={18} />
              <input
                id="explore-search"
                type="search"
                aria-label="Search content"
                placeholder="Search"
                value={query}
                {...searchProps}
              />
              <button type="button" aria-label="Close search" onClick={collapseSearch}>
                <Icon name="close" size={16} />
              </button>
            </label>
          ) : (
            <button className={styles.searchPill} onClick={expandSearch}>
              <Icon name="search" size={16} /> SEARCH
            </button>
          )}
        </div>

        <h2 className={styles.title}>Mental Help</h2>
        <p className={styles.subtitle}>Improve your mental health.</p>

        {featured && (
          <section className={styles.featuredStack} aria-label="Featured therapist content">
            <div className={`${styles.underSheet} ${styles.underBack}`} />
            <div className={`${styles.underSheet} ${styles.underFront}`} />
            <article className={styles.featuredCard}>
              <div className={styles.featuredTop}>
                <div className={styles.therapistLine}>
                  {THERAPIST_PHOTO[featured.therapist] ? (
                    <img
                      className={styles.portrait}
                      src={THERAPIST_PHOTO[featured.therapist]}
                      alt={featured.therapist}
                    />
                  ) : (
                    <span className={styles.portraitInitials} aria-hidden="true">
                      {initials(featured.therapist)}
                    </span>
                  )}
                  <div className={styles.therapistText}>
                    <span className={styles.therapistName}>{featured.therapist}</span>
                    <span className={styles.therapistRole}>{featured.role}</span>
                  </div>
                  <Icon name="verifiedBadge" size={18} className={styles.verified} />
                </div>
                <button
                  className={styles.moreButton}
                  aria-label="Card options"
                  onClick={() => setToast('This is coming soon.')}
                >
                  <Icon name="more" size={20} />
                </button>
              </div>
              <h3>{featured.title}</h3>
              <p className={styles.description}>{featured.description}</p>
              <div className={styles.metadata}>
                <span>
                  <Icon name="clock" size={15} />
                  {featured.duration}
                </span>
                {featured.users && (
                  <span>
                    <Icon name="users" size={15} />
                    {featured.users}
                  </span>
                )}
              </div>
              <div className={styles.cardActions}>
                <button
                  className={styles.saveButton}
                  onClick={() => toggleSaved(featured.id)}
                  aria-label={
                    saved.includes(featured.id) ? 'Remove from saved sessions' : 'Save this session'
                  }
                  aria-pressed={saved.includes(featured.id)}
                >
                  <Icon
                    name="star"
                    size={18}
                    className={saved.includes(featured.id) ? styles.savedStar : ''}
                  />
                </button>
                <button
                  className={styles.beginButton}
                  aria-label="Begin session"
                  onClick={() => navigate(`/calm?track=${featured.id}`)}
                >
                  <Icon name="plus" size={22} />
                </button>
              </div>
            </article>
          </section>
        )}

        <section className={styles.recommendations}>
          <div className={styles.sectionHeading}>
            <h2>Recommended Themes</h2>
            <button
              type="button"
              aria-expanded={showAllThemes}
              onClick={() => setShowAllThemes((open) => !open)}
            >
              {showAllThemes ? 'Show less' : 'View all'}
            </button>
          </div>
          <div
            className={`${styles.themePills} ${showAllThemes ? styles.themePillsExpanded : ''}`}
            role="group"
            aria-label="Filter by theme"
            {...pillsDrag.props}
          >
            {themes.map((theme) => (
              <button
                key={theme}
                className={`${styles.themePill} ${activeTheme === theme ? styles.themeSelected : ''}`}
                aria-pressed={activeTheme === theme}
                onClick={() => setActiveTheme(theme)}
              >
                {theme}
              </button>
            ))}
          </div>

          {more.map((item) => (
            <article key={item.id} className={styles.miniCard}>
              <span className={styles.moon}>
                <Icon name={THEME_ICON[item.themes[0]] ?? 'moon'} size={19} />
              </span>
              <div className={styles.miniCopy}>
                <h3>{item.title}</h3>
                <p>
                  {item.therapist} · {item.duration}
                </p>
              </div>
              <button
                aria-label={`Open ${item.title}`}
                onClick={() => navigate(`/calm?track=${item.id}`)}
              >
                <Icon name="arrowRight" size={20} />
              </button>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className={styles.emptyState} role="status">
              {query.trim()
                ? `No matches for "${query.trim()}".`
                : 'Nothing here yet. Try another theme.'}
            </div>
          )}
        </section>
      </main>
      {toast && (
        <div className={styles.toast} role="status">
          {toast}
        </div>
      )}
    </>
  );
}
