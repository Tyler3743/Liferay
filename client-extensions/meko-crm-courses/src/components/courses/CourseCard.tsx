import React from 'react';
import { Course } from '../../models/Course';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const getHeaderStyle = () => {
    switch (course.color) {
      case 'blue': return 'bg-course-ielts text-white';
      case 'yellow': return 'bg-course-giao-tiep text-white';
      case 'green': return 'bg-course-toeic text-white';
      case 'gray': return 'bg-course-cap-toc text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusStyle = () => {
    switch (course.status) {
      case 'ACTIVE': return 'bg-orange-100 text-orange-600';
      case 'UPCOMING': return 'bg-blue-100 text-blue-600';
      case 'CLOSED': return 'bg-gray-100 text-gray-500';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getProgressBarStyle = () => {
    if (course.status === 'CLOSED') return 'bg-gray-200';
    if (course.isFull) return 'bg-emerald-500';
    return 'bg-blue-600';
  };

  const getProgressStatusText = () => {
    if (course.status === 'CLOSED') return 'Đã đóng';
    if (course.status === 'UPCOMING') return 'Kế hoạch';
    if (course.isFull) return 'Kín chỗ';
    return 'Có lớp trống';
  };
  
  const getProgressStatusTextColor = () => {
    if (course.status === 'CLOSED') return 'text-gray-400';
    if (course.status === 'UPCOMING') return 'text-emerald-600';
    if (course.isFull) return 'text-emerald-600';
    return 'text-red-500';
  };

  const isClosed = course.status === 'CLOSED';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full ${isClosed ? 'opacity-60' : ''}`}>
      {/* Header */}
      <div className={`h-36 ${getHeaderStyle()} flex flex-col items-center justify-center p-4 relative`}>
        {course.type === 'IELTS 6.5+' && (
          <div className="absolute right-4 bottom-4 w-3 h-3 bg-red-500 rounded-full"></div>
        )}
        {course.type === 'IELTS Cấp tốc' && (
          <div className="w-12 h-12 rounded-full bg-white/20 mb-2"></div>
        )}
        {course.type === 'TOEIC 700+' && (
          <div className="bg-black/10 px-4 py-2 rounded-md font-bold text-2xl">
            {course.type}
          </div>
        )}
        
        {course.type !== 'TOEIC 700+' && (
          <h2 className="font-bold text-3xl text-center leading-tight drop-shadow-sm">{course.type}</h2>
        )}
        
        {course.subtitle && (
          <p className="text-sm mt-1 font-medium">{course.subtitle}</p>
        )}
      </div>
      
      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-4 gap-2">
          <h3 className="font-bold text-gray-900 text-[15px]">{course.name}</h3>
          <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase whitespace-nowrap ${getStatusStyle()}`}>
            {course.getStatusLabel()}
          </span>
        </div>
        
        <div className="space-y-1.5 mb-6 text-[13px]">
          <p className="text-gray-500 flex items-center">
            <span className="w-4 h-4 rounded-full bg-gray-200 mr-2 flex-shrink-0"></span>
            Mã khóa: <span className="font-bold text-gray-900 ml-1">{course.code}</span>
          </p>
          <p className="text-gray-500 flex items-center">
            <span className="w-4 h-4 rounded-full bg-gray-200 mr-2 flex-shrink-0"></span>
            Lịch: {course.schedule}
          </p>
          <p className="text-gray-500 flex items-center">
            <span className="w-4 h-4 rounded-full bg-gray-200 mr-2 flex-shrink-0"></span>
            GV: <span className="font-bold text-gray-900 ml-1">{course.teacher}</span>
          </p>
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-between text-[12px] font-bold mb-1.5">
            <span className="text-gray-900">Lớp đang mở: {course.openClasses} lớp</span>
            <span className={getProgressStatusTextColor()}>{getProgressStatusText()}</span>
          </div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div 
              className={`h-full ${getProgressBarStyle()}`} 
              style={{ width: isClosed ? '0%' : (course.isFull ? '100%' : '50%') }}
            ></div>
          </div>
          
          <button className={`w-full py-2.5 rounded-lg text-sm font-bold text-center border-t border-gray-50 pt-4 mt-2 ${isClosed ? 'text-gray-400' : 'text-blue-600 hover:text-blue-700'}`}>
            {isClosed ? 'Xem lại dữ liệu khóa' : 'Quản lý khóa học này'}
          </button>
        </div>
      </div>
    </div>
  );
};
