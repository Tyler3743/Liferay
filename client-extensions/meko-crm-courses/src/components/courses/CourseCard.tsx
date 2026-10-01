import React from 'react';
import { Course } from '../../models/Course';
import { CourseCardHeader } from './CourseCardHeader';
import { CourseCardBody } from './CourseCardBody';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const isClosed = course.status === 'CLOSED';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full ${isClosed ? 'opacity-60' : ''}`}>
      <CourseCardHeader course={course} />
      <CourseCardBody course={course} />
    </div>
  );
};
