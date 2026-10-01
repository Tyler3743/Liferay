import React from 'react';
import { PortalHeader } from './components/PortalHeader';
import { PortalCard } from './components/PortalCard';
import { APPS_DATA } from './config/apps';
import { DESIGN_TOKENS } from './config/design';

const App: React.FC = () => {
  return (
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-8 font-sans`}>
      <div className={`${DESIGN_TOKENS.layout.container} ${DESIGN_TOKENS.colors.surface} ${DESIGN_TOKENS.layout.padding} ${DESIGN_TOKENS.layout.borderRadius} ${DESIGN_TOKENS.layout.shadow}`}>
        <PortalHeader 
          title="Meko CRM Hub" 
          subtitle="Cổng điều hướng trung tâm các phân hệ quản lý hệ thống" 
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {APPS_DATA.map((app) => (
            <PortalCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
