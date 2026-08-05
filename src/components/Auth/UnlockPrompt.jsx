import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../Common/Button';

export function UnlockPrompt() {
  const { unlock, unlockError } = useAuth();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    await unlock(password);
    setSubmitting(false);
    setPassword('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-3 rounded-xl border border-outline-variant/40 bg-surface-base px-5 py-8 text-center"
    >
      <Lock size={20} className="text-on-surface-variant" />
      <p className="text-sm text-on-surface-variant max-w-xs">
        Your saved history is encrypted. Enter your account password to unlock it on this device.
      </p>
      {unlockError && <p className="text-sm text-error">{unlockError}</p>}
      <div className="flex w-full max-w-xs gap-2">
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="flex-1 h-10 rounded-lg border border-outline-variant/50 bg-surface-high px-3 text-sm text-on-surface outline-none focus:border-primary-container"
        />
        <Button type="submit" variant="primary" disabled={submitting || !password} className="h-10 px-4">
          {submitting ? '…' : 'Unlock'}
        </Button>
      </div>
    </form>
  );
}
