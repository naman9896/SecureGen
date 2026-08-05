import { GrainGradient } from '@paper-design/shaders-react';
import { useState } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Checkbox } from '../Common/Checkbox';
import { Button } from '../Common/Button';

export function AuthSectionOne({ onAuthenticated, onBack }) {
  const { signUp, signIn, signInWithProvider, configured } = useAuth();
  const [mode, setMode] = useState('signup');
  const [fields, setFields] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmationSent, setConfirmationSent] = useState(false);

  const update = (key, value) => setFields(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && !agreedToTerms) {
      setError('Please accept the Terms and Privacy Policy to continue.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUp(fields);
        setConfirmationSent(true);
      } else {
        await signIn(fields);
        onAuthenticated?.();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProvider = async provider => {
    setError('');
    try {
      await signInWithProvider(provider);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="min-h-screen bg-surface p-3 text-on-surface antialiased [font-synthesis:none]">
      <div className="grid min-h-[calc(100vh-1.5rem)] gap-6 lg:grid-cols-[0.94fr_1.06fr]">
        <div className="flex min-h-[760px] items-start rounded-md border border-outline-variant/40 bg-surface-base px-6 py-12 sm:px-10 lg:min-h-0 lg:px-14 lg:py-28 xl:px-20">
          <div className="mx-auto w-full max-w-[590px]">
            <div className="mb-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-primary-container" />
                <span className="text-sm font-bold tracking-tight">SecureGen</span>
              </div>
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  Back to app
                </button>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl lg:text-[42px] lg:leading-[1.05] xl:text-[50px]">
                {mode === 'signup' ? 'Create an account' : 'Welcome back'}
              </h1>
              <p className="mt-3 text-lg leading-snug text-on-surface-variant sm:text-xl lg:text-2xl xl:text-3xl">
                Your credentials, generated and kept locally
              </p>
            </div>

            {!configured && (
              <p className="mt-6 rounded-lg border border-tertiary/30 bg-tertiary/10 px-4 py-3 text-sm text-tertiary">
                Sign-in isn't connected to a backend yet. Add your Supabase project URL and anon key to
                <code className="mx-1 rounded bg-surface-high px-1.5 py-0.5 text-[13px]">.env</code>
                to enable this form.
              </p>
            )}

            {confirmationSent ? (
              <div className="mt-10 space-y-3 rounded-lg border border-secondary/30 bg-secondary/10 px-5 py-4 text-secondary">
                <p className="font-medium">Check your inbox</p>
                <p className="text-sm text-on-surface-variant">
                  We sent a confirmation link to <span className="text-on-surface">{fields.email}</span>. Verify
                  your email to finish creating your account.
                </p>
              </div>
            ) : (
              <>
                <div className="mt-12 grid gap-5 sm:grid-cols-2">
                  <SocialButton icon={<GoogleIcon />} label="Google" onClick={() => handleProvider('google')} />
                  <SocialButton icon={<AppleIcon />} label="Apple" onClick={() => handleProvider('apple')} />
                </div>

                <div className="my-10 text-center text-xl font-medium text-on-surface-variant">or</div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                  {mode === 'signup' && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <FieldBox
                        label="First Name"
                        value={fields.firstName}
                        onChange={v => update('firstName', v)}
                      />
                      <FieldBox
                        label="Last Name"
                        value={fields.lastName}
                        onChange={v => update('lastName', v)}
                      />
                    </div>
                  )}

                  <FieldBox
                    label="Email"
                    type="email"
                    value={fields.email}
                    onChange={v => update('email', v)}
                  />
                  <FieldBox
                    label="Password"
                    type="password"
                    value={fields.password}
                    onChange={v => update('password', v)}
                  />

                  {mode === 'signup' && (
                    <div className="pt-2">
                      <Checkbox
                        checked={agreedToTerms}
                        onChange={setAgreedToTerms}
                        label={
                          <>
                            I agree to the{' '}
                            <a href="#" className="font-medium text-on-surface-variant underline underline-offset-2">
                              Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="font-medium text-on-surface-variant underline underline-offset-2">
                              Privacy Policy
                            </a>
                          </>
                        }
                      />
                    </div>
                  )}

                  {error && <p className="text-sm text-error">{error}</p>}

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitting}
                    className="mt-4 h-12 w-full text-xl"
                  >
                    {submitting ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
                  </Button>
                </form>

                <p className="mt-8 text-center text-sm text-on-surface-variant">
                  {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setMode(m => (m === 'signup' ? 'signin' : 'signup'));
                    }}
                    className="font-medium text-primary hover:underline cursor-pointer"
                  >
                    {mode === 'signup' ? 'Sign in' : 'Create one'}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>

        <div className="relative flex min-h-[720px] overflow-hidden rounded-md bg-surface-lowest p-8 text-on-surface sm:p-12 lg:min-h-0">
          <GrainGradient
            speed={1}
            scale={1}
            rotation={0}
            offsetX={0}
            offsetY={0}
            softness={0.5}
            intensity={0.5}
            noise={0.25}
            shape="corners"
            frame={2854.5}
            colors={['#adc6ff', '#4edea3', '#4b8eff', '#adc6ff']}
            colorBack="#00000000"
            className="absolute inset-0 bg-surface-lowest"
          />

          <div className="relative z-10 flex h-full w-full flex-col justify-between">
            <h2 className="max-w-[620px] pt-0 text-5xl font-medium tracking-[-0.05em] text-on-surface sm:text-6xl lg:pt-16 lg:text-[64px] lg:leading-[0.98] xl:text-[70px]">
              Generate secure,
              <br />
              never leave the browser
            </h2>
            <p className="mb-0 max-w-md text-lg text-on-surface-variant xl:mb-32 xl:text-xl">
              An account only syncs your preferences — every password and API key is still generated
              locally with the Web Crypto API. We never see, store, or transmit what you generate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 items-center justify-center gap-2 rounded-[10px] border border-outline-variant/50 bg-surface-high px-3 text-sm leading-none text-on-surface transition-colors hover:bg-surface-highest cursor-pointer xl:text-[17px]"
    >
      <span className="shrink-0">{icon}</span>
      <span className="whitespace-nowrap">Continue with {label}</span>
    </button>
  );
}

function FieldBox({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <span className="label-caps mb-2 block text-[10px]">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        required
        className="h-12 w-full rounded-[10px] border border-outline-variant/50 bg-surface-high px-4 text-base text-on-surface outline-none transition-colors focus:border-primary-container xl:text-lg"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
        fill="#EB4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 12.54c-.03-3.02 2.47-4.47 2.58-4.54-1.41-2.06-3.6-2.34-4.38-2.37-1.86-.19-3.64 1.1-4.58 1.1-.95 0-2.42-1.07-3.98-1.04-2.05.03-3.94 1.19-4.99 3.02-2.13 3.69-.54 9.16 1.53 12.15 1.01 1.46 2.22 3.1 3.81 3.04 1.53-.06 2.11-.99 3.96-.99s2.37.99 3.99.96c1.65-.03 2.69-1.49 3.69-2.96 1.16-1.69 1.64-3.33 1.66-3.41-.04-.02-3.2-1.23-3.24-4.87ZM14.03 3.66c.84-1.02 1.41-2.43 1.25-3.84-1.21.05-2.68.81-3.55 1.83-.78.9-1.46 2.34-1.28 3.72 1.35.1 2.73-.69 3.58-1.71Z" />
    </svg>
  );
}
