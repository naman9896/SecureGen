import { LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../Common/Button';

export function AccountPage() {
  const { user, signOut } = useAuth();
  const firstName = user?.user_metadata?.first_name;
  const lastName = user?.user_metadata?.last_name;
  const displayName = [firstName, lastName].filter(Boolean).join(' ') || user?.email;

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      <div>
        <h1 className="text-2xl font-bold text-on-surface tracking-tight">Account</h1>
        <p className="text-sm text-on-surface-variant mt-1">Manage your SecureGen account.</p>
      </div>

      <div className="bg-surface-base rounded-xl border border-outline-variant/40 p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
            <User size={22} className="text-primary-container" />
          </div>
          <div className="overflow-hidden">
            <p className="text-base font-semibold text-on-surface truncate">{displayName}</p>
            <p className="text-sm text-on-surface-variant truncate">{user?.email}</p>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-outline-variant/30">
          <Button variant="ghost" onClick={signOut} className="gap-2">
            <LogOut size={15} />
            Sign out
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/5 border border-secondary/15">
        <ShieldCheck size={16} className="text-secondary shrink-0" />
        <p className="text-xs text-on-surface-variant">
          Your account only stores your sign-in details. Every password and API key is still generated
          entirely in your browser and is never sent to a server.
        </p>
      </div>
    </div>
  );
}
