import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { MobileNav } from './components/Layout/MobileNav';
import { PasswordGenerator } from './components/PasswordGenerator/PasswordGenerator';
import { ApiKeyGenerator } from './components/ApiKeyGenerator/ApiKeyGenerator';
import { Settings } from './components/Settings/Settings';
import { AccountPage } from './components/Auth/AccountPage';
import { AuthSectionOne } from './components/ui/auth-section-1';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';

const PAGES = {
  password: PasswordGenerator,
  apikey: ApiKeyGenerator,
  settings: Settings,
  account: AccountPage,
};

export default function App() {
  const { dark, toggle } = useTheme();
  const [page, setPage] = useState('password');
  const { user, loading } = useAuth();

  if (page === 'account' && !user) {
    if (loading) return <div className="min-h-screen bg-surface" />;
    return <AuthSectionOne onBack={() => setPage('password')} />;
  }

  const PageComponent = PAGES[page];

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar active={page} onNavigate={setPage} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header dark={dark} onToggleTheme={toggle} />
        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-7 max-w-5xl w-full mx-auto">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <PageComponent dark={dark} onToggleTheme={toggle} />
          </motion.div>
        </main>
      </div>

      <MobileNav active={page} onNavigate={setPage} />
    </div>
  );
}
