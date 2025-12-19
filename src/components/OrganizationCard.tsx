import Image from 'next/image';
import Link from 'next/link';
import { Organization } from '@/domain/types';
import styles from './OrganizationCard.module.css';

interface OrganizationCardProps {
  organization: Organization;
}

export default function OrganizationCard({ organization }: OrganizationCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={organization.image}
          alt={organization.name}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className={styles.categoryBadge}>{organization.category}</div>
        {organization.country && (
          <div className={styles.countryBadge}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            {organization.country}
          </div>
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{organization.name}</h3>
        <p className={styles.description}>{organization.description}</p>
        <div className={styles.tags}>
          {organization.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
        <div className={styles.footer}>
          <Link
            href={organization.website}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.button}
          >
            Visit Website
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
