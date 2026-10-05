import React from 'react';
import { KanbanBoard } from './components/KanbanBoard.tsx';
import { Header } from '../../common/components/Header.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-app-bg font-sans bg-gray-50">
      <Header activePath="/web/guest/kanban" />

      <main>
        <KanbanBoard />
      </main>
    </div>
  );
};

export default App;
