import React from 'react';
import { ConsultationForm } from '../components/forms/ConsultationForm';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-page font-sans">
      {/* Header */}
      <header className="bg-white py-4 px-8 flex justify-between items-center shadow-sm">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-brand-secondary">Meko</span><span className="text-brand-primary">CRM</span>
        </div>
        <nav className="hidden md:flex space-x-8 font-medium text-gray-700">
          <a href="#" className="hover:text-brand-primary transition-colors">Trang chủ</a>
          <a href="#" className="hover:text-brand-primary transition-colors">Các khóa học & kỳ thi</a>
          <a href="#" className="hover:text-brand-primary transition-colors">Về MekoCRM</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <ConsultationForm />
      </main>
    </div>
  );
};
