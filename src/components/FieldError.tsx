import styles from '@/app/submit/submit.module.css';

interface FieldErrorProps {
  errors: any[];
}

export default function FieldError({ errors }: FieldErrorProps) {
  if (!errors || errors.length === 0) return null;

  return (
    <div className={styles.error}>
      {errors.map((e: any) => e?.message || (typeof e === 'string' ? e : JSON.stringify(e))).join(', ')}
    </div>
  );
}
