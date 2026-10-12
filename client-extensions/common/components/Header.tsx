import React, { useState, useEffect } from 'react';

interface HeaderProps {
  activePath?: string;
}

export const Header: React.FC<HeaderProps> = ({ activePath }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [userInfo, setUserInfo] = useState<{ isSignedIn: boolean; name: string; email: string }>({
    isSignedIn: false,
    name: '',
    email: ''
  });

  useEffect(() => {
    // 1. Kiểm tra nhanh qua ThemeDisplay runtime
    const win = window as any;
    const td = win.themeDisplay || win.Liferay?.ThemeDisplay;
    const isSigned = typeof td?.isSignedIn === 'function' ? td.isSignedIn() : Boolean(td?.isSignedIn);
    const uName = typeof td?.getUserName === 'function' ? td.getUserName() : '';
    const uEmail = typeof td?.getUserEmailAddress === 'function' ? td.getUserEmailAddress() : '';

    if (isSigned || (uEmail && !uEmail.includes('guest'))) {
      setUserInfo({
        isSignedIn: true,
        name: uName || uEmail,
        email: uEmail
      });
    }

    // 2. Đồng bộ chuẩn qua API Liferay Core
    const fetchUser = async () => {
      try {
        const csrf = win.Liferay?.authToken || '';
        const headers: HeadersInit = {};
        if (csrf) headers['x-csrf-token'] = csrf;

        const res = await fetch('/api/jsonws/user/get-current-user', {
          credentials: 'include',
          headers
        });
        if (res.ok) {
          const user = await res.json();
          if (!user.defaultUser) {
            const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.screenName || user.emailAddress;
            setUserInfo({
              isSignedIn: true,
              name: name,
              email: user.emailAddress || ''
            });
          }
        }
      } catch (e) {
        console.warn('Header fetch user error:', e);
      }
    };

    fetchUser();
  }, []);

  const isActive = (path: string) => activePath === path;
  
  // Also check if any child of "Quản lý đào tạo" is active to highlight the parent
  const isDaoTaoActive = ['/web/guest/courses', '/web/guest/class', '/web/guest/term'].includes(activePath || '');

  const userInitial = userInfo.name ? userInfo.name.charAt(0).toUpperCase() : (userInfo.email ? userInfo.email.charAt(0).toUpperCase() : 'U');

  return (
    <header className="bg-white border-b border-gray-200 px-8 flex items-center justify-between shadow-sm relative z-50">
      <div className="flex items-center gap-16 lg:gap-32">
        <a href="/kanban" className="text-3xl font-extrabold py-4 hover:opacity-90 transition-opacity">
          <span className="text-brand-secondary">Meko</span><span className="text-brand-primary">CRM</span>
        </a>

        <nav className="flex items-center h-full">
          <a 
            href="/kanban" 
            className={`px-6 lg:px-12 py-4 text-base h-full flex items-center ${activePath === '/kanban' || activePath === '/web/guest/kanban' || isActive('/kanban') || isActive('/web/guest/kanban') ? 'font-bold text-brand-primary border-b-2 border-brand-primary' : 'font-medium text-gray-500 hover:text-gray-900'}`}
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

      <div className="flex items-center gap-3">
        {userInfo.isSignedIn ? (
          <div className="flex items-center gap-2.5">
            <div 
              className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm"
              title={userInfo.name || userInfo.email}
            >
              {userInitial}
            </div>
            <a 
              href="/c/portal/logout" 
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              title="Đăng xuất"
            >
              Đăng xuất
            </a>
          </div>
        ) : (
          <a
            href={`/c/portal/login?redirect=${encodeURIComponent(window.location.pathname)}`}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
          >
            Đăng nhập
          </a>
        )}
      </div>
    </header>
  );
};
