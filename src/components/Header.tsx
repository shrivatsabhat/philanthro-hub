'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchStore } from '@/store/useSearchStore';
import styles from './Header.module.css';

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const { searchQuery, setSearchQuery } = useSearchStore();

  useEffect(() => {
    const mainSearch = document.getElementById('main-search-filter');

    if (!mainSearch) {
      const handleScroll = () => {
        if (window.scrollY > 100) {
          setShowSearch(true);
        } else {
          setShowSearch(false);
        }
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowSearch(false);
        } else {
          if (window.scrollY > 100) {
            setShowSearch(true);
          }
        }
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '-80px 0px 0px 0px'
      }
    );

    observer.observe(mainSearch);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <header className={`${styles.header} glass`}>
      <Link href="/" className={styles.logo}>
        Philanthro<span>Hub</span>
      </Link>

      <div className={`${styles.searchWrapper} ${showSearch ? styles.visible : ''}`}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input
          type="text"
          placeholder="Search organizations..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>
          Discover
        </Link>
        <Link href="/about" className={styles.navLink}>
          About
        </Link>
        <Link href="/submit" className={styles.cta}>
          For Nonprofits
        </Link>
      </nav>
    </header>
  );
}
