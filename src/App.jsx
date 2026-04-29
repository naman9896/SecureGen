import { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { MobileNav } from './components/Layout/MobileNav';
import { PasswordGenerator } from './components/PasswordGenerator/PasswordGenerator';
import { ApiKeyGenerator } from './components/ApiKeyGenerator/ApiKeyGenerator';
import { Settings } from './components/Settings/Settings';
import { useTheme } from './hooks/useTheme';

const PAGES = {
  password: PasswordGenerator,
  apikey: ApiKeyGenerator,
  settings: Settings,
};

export default function App() {
  const { dark, toggle } = useTheme();
  const [page, setPage] = useState('password');

  const PageComponent = PAGES[page];

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar active={page} onNavigate={setPage} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header dark={dark} onToggleTheme={toggle} />
        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-7 max-w-5xl w-full mx-auto">
          <PageComponent dark={dark} onToggleTheme={toggle} />
        </main>
      </div>

      <MobileNav active={page} onNavigate={setPage} />
    </div>
  );
}
