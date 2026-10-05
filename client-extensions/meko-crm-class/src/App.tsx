import React from 'react';
import { Header } from '../../common/components/Header.tsx';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-app-bg">
      <Header activePath="/web/guest/class" />

      <main className="p-8">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý lớp học</h1>
        <p className="mt-4 text-gray-600">Giao diện quản lý lớp học đang được xây dựng...</p>
      </main>
    </div>
  );
};

export default App;
