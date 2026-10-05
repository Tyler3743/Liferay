export interface AppFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string;
  colorScheme: 'blue' | 'pink' | 'green' | 'orange';
}

export const APPS_DATA: AppFeature[] = [
  {
    id: 'form',
    title: 'Đăng Ký Học Viên',
    description: 'Form dành cho khách hàng đăng ký và thu thập thông tin (Landing Page)',
    icon: '📝',
    url: '/web/guest/meko-crm-form',
    colorScheme: 'blue',
  },
  {
    id: 'courses',
    title: 'Quản Lý Khóa Học',
    description: 'Thiết lập danh mục, chương trình và cấu trúc các khóa học',
    icon: '📚',
    url: '/web/guest/meko-crm-courses',
    colorScheme: 'pink',
  },
  {
    id: 'class',
    title: 'Quản Lý Lớp Học',
    description: 'Tổ chức lớp học, xếp lịch, phân công giáo viên và theo dõi sĩ số',
    icon: '🏫',
    url: '/web/guest/meko-crm-class',
    colorScheme: 'green',
  },
  {
    id: 'term',
    title: 'Quản Lý Kỳ Học',
    description: 'Thiết lập thời gian, đợt khai giảng và kỳ học trong năm',
    icon: '🗓️',
    url: '/web/guest/meko-crm-term',
    colorScheme: 'orange',
  },
];
