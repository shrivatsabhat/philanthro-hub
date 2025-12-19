'use client';

import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import styles from './submit.module.css';
import { useCreateOrganization } from '@/hooks/useOrganizations';
import FieldError from '@/components/FieldError';

const organizationSchema = z.object({
  name: z.string().min(3, 'Organization name is required and must be at least 3 characters'),
  website: z.string().url('Please enter a valid website URL (starting with http:// or https://)'),
  country: z.string().min(1, 'Please select a country of operation'),
  category: z.string().min(1, 'Please select a primary category'),
  otherCategory: z.string(),
  description: z.string().min(20, 'Please provide a description of at least 20 characters'),
  compliance: z.object({
    fcra: z.boolean(),
    taxExempt: z.boolean(),
    annualReports: z.boolean(),
    other: z.boolean(),
    otherDescription: z.string(),
  }).superRefine((data, ctx) => {
    if (!data.fcra && !data.taxExempt && !data.annualReports && !data.other) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select at least one verification document to proceed",
        path: ["root"]
      });
    }
    if (data.other && (!data.otherDescription || data.otherDescription.length < 3)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify the name of the document",
        path: ["otherDescription"]
      });
    }
  }),
  contactEmail: z.string().email('Please enter a valid email address'),
}).superRefine((data, ctx) => {
  if (data.category === 'Other' && (!data.otherCategory || data.otherCategory.length < 3)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please specify your category",
      path: ["otherCategory"]
    });
  }
});

const STEPS = [
  { id: 1, title: 'Basic Info' },
  { id: 2, title: 'Mission & Details' },
  { id: 3, title: 'Compliance' },
  { id: 4, title: 'Contact' },
];

export default function SubmitPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const createOrganization = useCreateOrganization();

  const form = useForm({
    defaultValues: {
      name: '',
      website: '',
      country: '',
      category: '',
      otherCategory: '',
      description: '',
      compliance: {
        fcra: false,
        taxExempt: false,
        annualReports: false,
        other: false,
        otherDescription: '',
      },
      contactEmail: '',
    },
    // @ts-ignore
    validatorAdapter: zodValidator(),
    validators: {
      onChange: organizationSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const category = value.category === 'Other' ? value.otherCategory : value.category;

        await createOrganization.mutateAsync({
          name: value.name,
          website: value.website,
          country: value.country,
          category: category,
          description: value.description,
          tags: [category, 'Pending Verification'],
          image: 'https://images.unsplash.com/photo-1501770118606-b1d640526693?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          verified: false,
        });

        setIsSubmitted(true);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Failed to submit organization:', error);
        // Handle error (e.g., show toast)
      }
    },
  });

  const nextStep = async () => {
    // In a real app, we'd validate the current step fields here
    // For now, we just move forward
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  if (isSubmitted) {
    return (
      <>
        <Header />
        <main className={styles.container}>
          <div className={styles.formCard} style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: '#ECFDF5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem',
              color: '#059669'
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className={styles.stepTitle} style={{ marginBottom: '1rem' }}>Application Submitted!</h2>
            <p className={styles.subtitle}>
              Thank you for applying to join PhilanthroHub. Our team will review your documentation and get back to you at <strong>{form.getFieldValue('contactEmail')}</strong> within 3-5 business days.
            </p>
            <button
              className={styles.submitButton}
              style={{ marginTop: '2rem', width: 'auto', display: 'inline-flex' }}
              onClick={() => window.location.href = '/'}
            >
              Return to Home
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>List Your Foundation</h1>
          <p className={styles.subtitle}>
            PhilanthroHub is a directory for verified non-profits. We list websites and contact details to help foundations get discovered. Submit your organization to be included.
          </p>
        </div>

        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
          <div className={styles.steps}>
            {STEPS.map(step => (
              <span
                key={step.id}
                className={`${styles.stepIndicator} ${currentStep >= step.id ? styles.active : ''}`}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.formCard}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            {currentStep === 1 && (
              <div className="step-content">
                <h2 className={styles.stepTitle}>Basic Information</h2>
                <form.Field
                  name="name"
                  children={(field) => (
                    <div className={styles.formGroup}>
                      <label htmlFor={field.name} className={styles.label}>Organization Name</label>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={() => field.handleBlur()}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={styles.input}
                        placeholder="e.g. Global Relief Foundation"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                />

                <form.Field
                  name="website"
                  children={(field) => (
                    <div className={styles.formGroup}>
                      <label htmlFor={field.name} className={styles.label}>Website URL</label>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={() => field.handleBlur()}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={styles.input}
                        placeholder="https://example.org"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                />

                <form.Field
                  name="country"
                  children={(field) => (
                    <div className={styles.formGroup}>
                      <label htmlFor={field.name} className={styles.label}>Country of Operation</label>
                      <select
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={() => field.handleBlur()}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={styles.select}
                      >
                        <option value="">Select a country</option>
                        <option value="Global">Global</option>
                        <option value="India">India</option>
                        <option value="USA">USA</option>
                        <option value="UK">UK</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Other">Other</option>
                      </select>
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                />

                <form.Field
                  name="category"
                  children={(field) => (
                    <div className={styles.formGroup}>
                      <label htmlFor={field.name} className={styles.label}>Primary Category</label>
                      <select
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={() => field.handleBlur()}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={styles.select}
                      >
                        <option value="">Select a category</option>
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Environment">Environment</option>
                        <option value="Animal Welfare">Animal Welfare</option>
                        <option value="Human Rights">Human Rights</option>
                        <option value="Disaster Relief">Disaster Relief</option>
                        <option value="Other">Other</option>
                      </select>
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                />

                <form.Subscribe
                  selector={(state) => state.values.category}
                  children={(category) => (
                    category === 'Other' ? (
                      <form.Field
                        name="otherCategory"
                        children={(field) => (
                          <div className={styles.formGroup}>
                            <label htmlFor={field.name} className={styles.label}>Specify Category</label>
                            <input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={() => field.handleBlur()}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.input}
                              placeholder="e.g. Arts & Culture"
                            />
                            <FieldError errors={field.state.meta.errors} />
                          </div>
                        )}
                      />
                    ) : null
                  )}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content">
                <h2 className={styles.stepTitle}>Mission & Impact</h2>
                <form.Field
                  name="description"
                  children={(field) => (
                    <div className={styles.formGroup}>
                      <label htmlFor={field.name} className={styles.label}>Mission Statement & Description</label>
                      <textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={() => field.handleBlur()}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={styles.textarea}
                        placeholder="Tell us about your organization's mission, key programs, and the impact you create..."
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-content">
                <h2 className={styles.stepTitle}>Verification Documents</h2>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                  Select the documents you can provide for verification.
                </p>

                <form.Field
                  name="compliance.fcra"
                  children={(field) => (
                    <div className={styles.checkboxGroup}>
                      <input
                        type="checkbox"
                        id="fcra"
                        checked={field.state.value}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        className={styles.checkbox}
                      />
                      <div>
                        <label htmlFor="fcra" className={styles.checkboxLabel}>
                          FCRA Registration
                        </label>
                        <span className={styles.checkboxDescription}>
                          Foreign Contribution Regulation Act registration for international funding.
                        </span>
                      </div>
                    </div>
                  )}
                />

                <form.Field
                  name="compliance.taxExempt"
                  children={(field) => (
                    <div className={styles.checkboxGroup}>
                      <input
                        type="checkbox"
                        id="taxExempt"
                        checked={field.state.value}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        className={styles.checkbox}
                      />
                      <div>
                        <label htmlFor="taxExempt" className={styles.checkboxLabel}>
                          80G / 12A Certificates
                        </label>
                        <span className={styles.checkboxDescription}>
                          Tax exemption certificates for Indian donors.
                        </span>
                      </div>
                    </div>
                  )}
                />

                <form.Field
                  name="compliance.annualReports"
                  children={(field) => (
                    <div className={styles.checkboxGroup}>
                      <input
                        type="checkbox"
                        id="annualReports"
                        checked={field.state.value}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        className={styles.checkbox}
                      />
                      <div>
                        <label htmlFor="annualReports" className={styles.checkboxLabel}>
                          Audited Annual Reports
                        </label>
                        <span className={styles.checkboxDescription}>
                          Reports from the last 3 financial years.
                        </span>
                      </div>
                    </div>
                  )}
                />

                <form.Field
                  name="compliance.other"
                  children={(field) => (
                    <div className={styles.checkboxGroup}>
                      <input
                        type="checkbox"
                        id="other"
                        checked={field.state.value}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        className={styles.checkbox}
                      />
                      <div>
                        <label htmlFor="other" className={styles.checkboxLabel}>
                          Other
                        </label>
                        <span className={styles.checkboxDescription}>
                          Any other relevant compliance or registration documents.
                        </span>
                      </div>
                    </div>
                  )}
                />

                <form.Subscribe
                  selector={(state) => state.values.compliance.other}
                  children={(otherSelected) => (
                    otherSelected ? (
                      <form.Field
                        name="compliance.otherDescription"
                        children={(field) => (
                          <div className={styles.formGroup} style={{ marginLeft: '2rem', marginTop: '-0.5rem' }}>
                            <label htmlFor={field.name} className={styles.label} style={{ fontSize: '0.9rem' }}>Specify Document Name</label>
                            <input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={() => field.handleBlur()}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.input}
                              placeholder="e.g. State Registration Certificate"
                            />
                            <FieldError errors={field.state.meta.errors} />
                          </div>
                        )}
                      />
                    ) : null
                  )}
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="step-content">
                <h2 className={styles.stepTitle}>Final Details</h2>
                <form.Field
                  name="contactEmail"
                  children={(field) => (
                    <div className={styles.formGroup}>
                      <label htmlFor={field.name} className={styles.label}>Contact Email</label>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={() => field.handleBlur()}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={styles.input}
                        placeholder="contact@organization.org"
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </div>
                  )}
                />

                <div style={{ padding: '1.5rem', background: '#F3F4F6', borderRadius: '0.5rem', marginTop: '2rem' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>Review your application</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    By clicking submit, you confirm that all provided information is accurate and you are an authorized representative of the organization.
                  </p>
                </div>
              </div>
            )}

            <div className={styles.buttonGroup}>
              {currentStep > 1 ? (
                <button type="button" onClick={prevStep} className={styles.backButton}>
                  Back
                </button>
              ) : (
                <div></div> // Spacer
              )}

              {currentStep < STEPS.length ? (
                <button type="button" onClick={nextStep} className={styles.nextButton}>
                  Next Step
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              ) : (
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <button type="submit" className={styles.submitButton} disabled={!canSubmit || isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  )}
                />
              )}
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
