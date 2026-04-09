import { useTheme, type Theme } from '@/hooks/useTheme';

const themeIcons: Record<Theme, string> = {
  galgame: '🎮',
  cyber: '⚡',
  minimal: '◐',
};

const themeLabels: Record<Theme, string> = {
  galgame: '视觉小说',
  cyber: '赛博朋克',
  minimal: '极简',
};

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      title={`当前主题: ${themeLabels[theme]} (点击切换)`}
      aria-label={`切换主题，当前: ${themeLabels[theme]}`}
    >
      {themeIcons[theme]}
    </button>
  );
}

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 p-2 bg-[var(--color-bg-secondary)] border-2 border-[var(--color-text-primary)]">
      {(Object.keys(themeIcons) as Theme[]).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTheme(t)}
          className={`px-3 py-2 text-sm transition-all ${
            theme === t
              ? 'bg-[var(--color-accent-primary)] text-white'
              : 'hover:bg-[var(--color-bg-primary)]'
          }`}
        >
          {themeIcons[t]} {themeLabels[t]}
        </button>
      ))}
    </div>
  );
}
