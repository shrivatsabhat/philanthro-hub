import { useState, useRef, useEffect } from 'react';
import styles from './SearchFilter.module.css';

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  toggleCategory: (category: string) => void;
  categories: string[];
}

export default function SearchFilter({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  toggleCategory,
  categories,
}: SearchFilterProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setIsDropdownOpen(false);
    setCategorySearch('');
  };

  const filteredCategories = categories.filter(category =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className={styles.wrapper} id="main-search-filter">
      <div className={styles.searchContainer}>
        <div className={styles.inputWrapper}>
          <svg
            className={styles.searchIcon}
            width="20"
            height="20"
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
          {searchQuery && (
            <button
              className={styles.clearSearchButton}
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>

        <div className={styles.actions}>
          {(searchQuery || selectedCategories.length > 0) && (
            <button
              className={styles.resetButton}
              onClick={handleReset}
              title="Reset all filters"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </button>
          )}

          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              className={`${styles.filterButton} ${selectedCategories.length > 0 ? styles.active : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              <span>Filter {selectedCategories.length > 0 && `(${selectedCategories.length})`}</span>
            </button>

            <div className={`${styles.dropdown} ${isDropdownOpen ? styles.open : ''}`}>
              <div className={styles.dropdownHeader}>
                <div className={styles.dropdownTitleRow}>
                  <span className={styles.dropdownTitle}>Filter by Category</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {selectedCategories.length > 0 && (
                      <button
                        className={styles.clearIconButton}
                        onClick={() => setSelectedCategories([])}
                        title="Clear all filters"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </button>
                    )}
                    <button
                      className={styles.mobileCloseBtn}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Search categories..."
                  className={styles.dropdownSearch}
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className={styles.categoryList}>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <div
                      key={category}
                      className={`${styles.categoryItem} ${selectedCategories.includes(category) ? styles.selected : ''}`}
                      onClick={() => toggleCategory(category)}
                    >
                      <svg
                        className={styles.checkIcon}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      {category}
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                    No categories found
                  </div>
                )}
              </div>
            </div>
            {isDropdownOpen && <div className={styles.mobileOverlay} onClick={() => setIsDropdownOpen(false)} />}
          </div>
        </div>
      </div>

      {selectedCategories.length > 0 && (
        <div className={styles.activeFilters}>
          {selectedCategories.map(category => (
            <div key={category} className={styles.filterChip}>
              {category}
              <span
                className={styles.removeChip}
                onClick={() => toggleCategory(category)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
