import React, { useState, useEffect } from 'react';
import { Course } from '../models/Course';
import { CourseCard } from '../components/courses/CourseCard';

export const CoursePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Giả lập gọi API và khởi tạo các đối tượng OOP (Instances)
    const mockData = [
      new Course({ id: '1', code: 'IELTS-65', name: 'IELTS Intensive 6.5+', type: 'IELTS 6.5+', subtitle: 'Master Class', fee: 15000000, schedule: 'Sáng T7 - CN (08h00 - 11h00)', teacher: 'Cô Thu Trang', duration: '36 buổi', status: 'ACTIVE', openClasses: 4, isFull: false, color: 'blue' }),
      new Course({ id: '2', code: 'GT-CB', name: 'Giao tiếp Cơ bản', type: 'GIAO TIẾP', subtitle: '', fee: 4500000, schedule: 'Sáng T7 - CN (08h00 - 11h00)', teacher: 'Cô Thu Anh', duration: '24 buổi', status: 'ACTIVE', openClasses: 2, isFull: true, color: 'yellow' }),
      new Course({ id: '3', code: 'TOEIC-700', name: 'Luyện thi TOEIC 700+', type: 'TOEIC 700+', subtitle: '', fee: 6000000, schedule: 'Sáng T7 - CN (08h00 - 11h00)', teacher: 'Cô Ngọc Trang', duration: '20 buổi', status: 'UPCOMING', openClasses: 1, isFull: false, color: 'green' }),
      new Course({ id: '4', code: 'IELTS-FAST', name: 'IELTS Cấp tốc K11', type: 'IELTS Cấp tốc', subtitle: '', fee: 8000000, schedule: 'Sáng T7 - CN (08h00 - 11h00)', teacher: 'Cô Huyền Trang', duration: '20 buổi', status: 'CLOSED', openClasses: 0, isFull: false, color: 'gray' }),
    ];
    setCourses(mockData);
  }, []);

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Danh sách Khóa học</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-wrap gap-4 items-end mb-8">
        <div className="flex-1 min-w-[250px] max-w-[400px]">
          <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Tìm kiếm khóa học</label>
          <input 
            type="text" 
            placeholder="Nhập tên khóa học, mã khóa..." 
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
          />
        </div>
        <div className="w-[200px]">
          <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase">Trạng thái</label>
          <select className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white">
            <option>Tất cả trạng thái</option>
          </select>
        </div>
        <div className="ml-auto">
          <button className="bg-brand-primary text-white px-5 py-2 rounded-md font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-1 shadow-sm">
            <span>+</span> Tạo khóa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};
