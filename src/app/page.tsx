'use client';

import { useOrganizations } from '@/hooks/useOrganizations';
import Header from '@/components/Header';
import OrganizationCard from '@/components/OrganizationCard';
import OrganizationCardSkeleton from '@/components/OrganizationCardSkeleton';
import SearchFilter from '@/components/SearchFilter';
import { useSearchStore } from '@/store/useSearchStore';
import { Organization } from '@/domain/types';
import styles from './page.module.css';

export default function Home() {
  const {
    searchQuery,
    selectedCategories,
    setSearchQuery,
    setSelectedCategories,
    toggleCategory
  } = useSearchStore();

  const { data: organizations = [], isLoading, isError } = useOrganizations();

  const categories = Array.from(new Set(organizations.map((org) => org.category))).sort();

  const filteredOrganizations = organizations.filter((org) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      org.name.toLowerCase().includes(query) ||
      org.category.toLowerCase().includes(query) ||
      org.tags.some(tag => tag.toLowerCase().includes(query))
    );
    const matchesCategory = selectedCategories.length > 0
      ? selectedCategories.includes(org.category)
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className="container">
          <section className={styles.hero}>
            <h1 className={styles.title}>
              Make a Difference with Trusted Organizations
            </h1>
            <p className={styles.subtitle}>
              Discover government-approved charities and nonprofits aligned with your values.
              Your guide to impactful giving starts here.
            </p>

            <SearchFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              toggleCategory={toggleCategory}
              categories={categories}
            />
          </section>

          <section className={styles.grid}>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <OrganizationCardSkeleton key={index} />
              ))
            ) : isError ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'red' }}>
                <p>Failed to load organizations. Please try again later.</p>
              </div>
            ) : filteredOrganizations.length > 0 ? (
              filteredOrganizations.map((org) => (
                <OrganizationCard key={org.id} organization={org} />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                <h3>No organizations found matching "{searchQuery}"</h3>
                <p>Try adjusting your search terms.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
