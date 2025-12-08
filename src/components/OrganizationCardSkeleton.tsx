import styles from './OrganizationCardSkeleton.module.css';

export default function OrganizationCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={`${styles.imageWrapper} ${styles.shimmer}`} />
      <div className={styles.content}>
        <div className={`${styles.title} ${styles.shimmer}`} />
        <div className={`${styles.description} ${styles.shimmer}`} />
        <div className={`${styles.descriptionShort} ${styles.shimmer}`} />

        <div className={styles.tags}>
          <div className={`${styles.tag} ${styles.shimmer}`} />
          <div className={`${styles.tag} ${styles.shimmer}`} />
          <div className={`${styles.tag} ${styles.shimmer}`} />
        </div>

        <div className={styles.footer}>
          <div className={`${styles.button} ${styles.shimmer}`} />
        </div>
      </div>
    </div>
  );
}
