import React from 'react';
import { KanbanBoard } from './components/KanbanBoard.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-app-bg font-sans bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-16 lg:gap-32">
          <div className="text-3xl font-extrabold py-4">
            <span className="text-brand-secondary">Meko</span><span className="text-brand-primary">CRM</span>
          </div>

          <nav className="flex items-center h-full">
            <a href="#" className="px-6 lg:px-12 py-4 text-base font-bold text-red-600 border-b-2 border-red-600 h-full flex items-center">
              Phễu tuyển sinh
            </a>
            <a href="#" className="px-6 lg:px-12 py-4 text-base font-medium text-gray-500 hover:text-gray-900 h-full flex items-center">
              Quản lý lớp học
            </a>
            <a href="#" className="px-6 lg:px-12 py-4 text-base font-medium text-gray-500 hover:text-gray-900 h-full flex items-center">
              Quản lý hồ sơ
            </a>
          </nav>
        </div>

        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 font-medium text-sm">
            T
          </div>
        </div>
      </header>

      <main>
        <KanbanBoard />
      </main>
    </div>
  );
};

export default App;
