import Link from 'next/link';
import Header from '@/components/Header';
import styles from './about.module.css';

export default function About() {
  return (
    <>
      <Header />
      <main className={styles.container}>
        <section className={styles.hero}>
          <h1 className={styles.title}>About PhilanthroHub</h1>
          <p className={styles.mission}>
            Connecting verified philanthropic organizations with communities worldwide.
            Making charity transparent, accessible, and impactful.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.content}>
            PhilanthroHub was born from a simple yet powerful idea: to bridge the gap between
            donors and trustworthy organizations. We believe that transparency is the key to
            effective philanthropy. By curating a list of government-approved and verified
            nonprofits, we ensure that your contributions make a real difference.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Legal & Global Compliance</h2>
          <p className={styles.content}>
            We take trust seriously. All organizations listed on PhilanthroHub are vetted
            against strict legal and operational standards, with a special focus on Indian
            regulations.
          </p>

          <div className={styles.complianceGrid}>
            <div className={styles.complianceCard}>
              <h4>FCRA Compliant</h4>
              <p className={styles.content} style={{ fontSize: '0.9rem' }}>
                Verified for Foreign Contribution Regulation Act compliance for international donations.
              </p>
            </div>
            <div className={styles.complianceCard}>
              <h4>80G & 12A Certified</h4>
              <p className={styles.content} style={{ fontSize: '0.9rem' }}>
                Tax-exemption certificates verified for Indian donors.
              </p>
            </div>
            <div className={styles.complianceCard}>
              <h4>Global Standards</h4>
              <p className={styles.content} style={{ fontSize: '0.9rem' }}>
                Aligned with international transparency guidelines and reporting standards.
              </p>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#FEF2F2', borderRadius: '0.5rem', border: '1px solid #FECACA' }}>
            <h4 style={{ color: '#991B1B', marginBottom: '0.5rem', fontSize: '1rem' }}>Disclaimer</h4>
            <p className={styles.content} style={{ fontSize: '0.9rem', color: '#7F1D1D' }}>
              PhilanthroHub is a discovery platform and directory. We do not directly provide legal services,
              financial auditing, or compliance verification. The legal certifications (such as FCRA, 80G, 12A)
              and statuses mentioned are held and maintained by the respective organizations listed on our platform.
              We act solely as an aggregator to help you find these resources. Please verify all details directly
              on the organization's official website before making any contributions.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How to List Your Organization</h2>
          <p className={styles.content} style={{ marginBottom: '1.5rem' }}>
            Are you a verified nonprofit looking to reach a wider audience?
            Join our network of trusted changemakers.
          </p>

          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4>Submit Documentation</h4>
              <p className={styles.content}>Provide your registration details, annual reports, and tax compliance certificates.</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4>Verification Process</h4>
              <p className={styles.content}>Our legal team reviews your documents against government databases.</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4>Go Live</h4>
              <p className={styles.content}>Once approved, your profile goes live, connecting you with donors worldwide.</p>
            </div>
          </div>

          <div style={{ marginTop: '3rem', textAlign: 'center' }}>
            <Link href="/submit" className={styles.ctaButton}>
              Apply Now
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
