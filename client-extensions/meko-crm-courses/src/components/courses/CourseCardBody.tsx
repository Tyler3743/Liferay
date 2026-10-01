import React from 'react';
import { Course } from '../../models/Course';

interface CourseCardBodyProps {
  course: Course;
}

export const CourseCardBody: React.FC<CourseCardBodyProps> = ({ course }) => {
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
  );
};
