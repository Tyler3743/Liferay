import React, { useState } from 'react';

interface HeaderProps {
  activePath?: string;
}

export const Header: React.FC<HeaderProps> = ({ activePath }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isActive = (path: string) => activePath === path;
  
  // Also check if any child of "Quản lý đào tạo" is active to highlight the parent
  const isDaoTaoActive = ['/web/guest/courses', '/web/guest/class', '/web/guest/term'].includes(activePath || '');

  return (
    <header className="bg-white border-b border-gray-200 px-8 flex items-center justify-between shadow-sm relative z-50">
      <div className="flex items-center gap-16 lg:gap-32">
        <div className="text-3xl font-extrabold py-4">
          <span className="text-brand-secondary">Meko</span><span className="text-brand-primary">CRM</span>
        </div>

        <nav className="flex items-center h-full">
          <a 
            href="/web/guest/kanban" 
            className={`px-6 lg:px-12 py-4 text-base h-full flex items-center ${isActive('/web/guest/kanban') ? 'font-bold text-brand-primary border-b-2 border-brand-primary' : 'font-medium text-gray-500 hover:text-gray-900'}`}
          >
            Phễu tuyển sinh
          </a>

          {/* Dropdown for Quản lý đào tạo */}
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <span 
              className={`px-6 lg:px-12 py-4 text-base h-full flex items-center cursor-pointer ${isDaoTaoActive ? 'font-bold text-brand-primary border-b-2 border-brand-primary' : 'font-medium text-gray-500 hover:text-gray-900'}`}
            >
              Quản lý đào tạo
            </span>
            
            {isHovered && (
              <div className="absolute top-full left-0 bg-white border border-gray-200 shadow-lg rounded-b-md w-56 py-2">
                <a 
                  href="/web/guest/courses" 
                  className={`block px-4 py-3 text-sm hover:bg-gray-50 ${isActive('/web/guest/courses') ? 'text-brand-primary font-bold bg-brand-primary/5' : 'text-gray-700'}`}
                >
                  Quản lý khóa học
                </a>
                <a 
                  href="/web/guest/class" 
                  className={`block px-4 py-3 text-sm hover:bg-gray-50 ${isActive('/web/guest/class') ? 'text-brand-primary font-bold bg-brand-primary/5' : 'text-gray-700'}`}
                >
                  Quản lý lớp học
                </a>
                <a 
                  href="/web/guest/term" 
                  className={`block px-4 py-3 text-sm hover:bg-gray-50 ${isActive('/web/guest/term') ? 'text-brand-primary font-bold bg-brand-primary/5' : 'text-gray-700'}`}
                >
                  Quản lý kỳ học
                </a>
              </div>
            )}
          </div>

          <a 
            href="/web/guest/profile" 
            className={`px-6 lg:px-12 py-4 text-base h-full flex items-center ${isActive('/web/guest/profile') ? 'font-bold text-brand-primary border-b-2 border-brand-primary' : 'font-medium text-gray-500 hover:text-gray-900'}`}
          >
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
  );
};
