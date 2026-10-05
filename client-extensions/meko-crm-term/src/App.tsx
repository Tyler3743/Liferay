import React from 'react';
import TermManagement from './pages/TermManagement.tsx';
import { Header } from '../../common/components/Header.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-app-bg">
      <Header activePath="/web/guest/term" />

      <main>
        <TermManagement />
      </main>
    </div>
  );
};

export default App;
