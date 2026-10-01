import React from 'react';
import { Course } from '../../models/Course';

interface CourseCardHeaderProps {
  course: Course;
}

export const CourseCardHeader: React.FC<CourseCardHeaderProps> = ({ course }) => {
  const getHeaderStyle = () => {
    switch (course.color) {
      case 'blue': return 'bg-course-ielts text-white';
      case 'yellow': return 'bg-course-giao-tiep text-white';
      case 'green': return 'bg-course-toeic text-white';
      case 'gray': return 'bg-course-cap-toc text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
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
  );
};
