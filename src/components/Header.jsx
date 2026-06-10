import React from 'react';

export function Header({ activeView, brand, navigationItems, onBrandClick, onNavigationClick }) {
  return (
    <header className="site-header">
      <div className="site-header__block">
        <a className="site-header__brand" href="#home" onClick={onBrandClick}>
          {brand}
        </a>
        <span className="site-header__meta">Public edition</span>
      </div>

      <nav className="site-header__nav" aria-label="Основная навигация">
        {navigationItems.map((item) => (
          <a
            key={item.page}
            href={`#${item.page}`}
            className={item.page === activeView ? 'is-active' : undefined}
            onClick={(event) => onNavigationClick?.(event, item)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
