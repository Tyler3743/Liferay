import React, { useState } from 'react';
import type { KanbanCardType } from '../types/kanban.ts';
import { X, BookOpen, Search, Check } from 'lucide-react';

interface ClassSelectModalProps {
  card: KanbanCardType | null;
  classes: any[];
  onClose: () => void;
  onSelect: (cardId: string, classInfo: any) => void;
}

export const ClassSelectModal: React.FC<ClassSelectModalProps> = ({ 
  card, 
  classes, 
  onClose, 
  onSelect 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!card) return null;

  const filtered = classes.filter(c => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const name = (c.className || '').toLowerCase();
    const code = (c.classID || c.classCode || '').toLowerCase();
    const room = (c.classRoom || '').toLowerCase();
    return name.includes(term) || code.includes(term) || room.includes(term);
  });

  const handleChooseClass = (cls: any) => {
    const feeFormatted = cls.classStandardFee 
      ? `${Number(cls.classStandardFee).toLocaleString('vi-VN')} đ` 
      : (cls.fee || (cls.classFee ? `${Number(cls.classFee).toLocaleString('vi-VN')} đ` : '5.000.000 đ'));

    const classInfo = {
      id: String(cls.id),
      code: cls.classID || cls.classCode || `LOP-${cls.id}`,
      name: cls.className || 'Lớp chuyên đề',
      schedule: cls.classSchedule || 'Tối 2-4-6 (19h-21h)',
      fee: feeFormatted,
      room: cls.classRoom || 'Lab 201'
    };
    onSelect(card.id, classInfo);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
      style={{ zIndex: 999999 }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 border border-gray-200 flex flex-col max-h-[88vh] relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Danh sách lớp học đang tuyển sinh ({classes.length} lớp)</span>
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Chọn lớp học để tư vấn và tạo Deal cho khách hàng <b>{card.name}</b> ({card.phone})
            </p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thanh tìm kiếm lớp học */}
        <div className="my-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên lớp, mã lớp, phòng học..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50/50 focus:bg-white"
            />
          </div>
        </div>

        {/* Bảng danh sách lớp */}
        <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg shadow-inner">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-100 text-gray-800 font-bold sticky top-0 border-b border-gray-200">
              <tr>
                <th className="py-3 px-3">Mã lớp</th>
                <th className="py-3 px-3">Tên lớp học</th>
                <th className="py-3 px-3">Lịch học</th>
                <th className="py-3 px-3">Phòng học</th>
                <th className="py-3 px-3">Khai giảng</th>
                <th className="py-3 px-3 text-center">Sĩ số</th>
                <th className="py-3 px-3">Học phí</th>
                <th className="py-3 px-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    Không tìm thấy lớp học nào phù hợp với từ khóa
                  </td>
                </tr>
              ) : (
                filtered.map((cls) => {
                  const isSelected = card.selectedClass?.id === String(cls.id);
                  const feeFormatted = cls.classStandardFee 
                    ? `${Number(cls.classStandardFee).toLocaleString('vi-VN')} đ` 
                    : (cls.fee || (cls.classFee ? `${Number(cls.classFee).toLocaleString('vi-VN')} đ` : '5.000.000 đ'));
                  const code = cls.classID || cls.classCode || `LOP-${cls.id}`;
                  const startDate = cls.classStartDate ? new Date(cls.classStartDate).toLocaleDateString('vi-VN') : 'Sắp mở';
                  const studentsCount = `${cls.classCurrentStudents || 0}/${cls.classMaxStudents || 30}`;

                  return (
                    <tr 
                      key={cls.id} 
                      className={`hover:bg-blue-50/60 transition ${isSelected ? 'bg-emerald-50/70 font-medium' : ''}`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-gray-700">{code}</td>
                      <td className="py-3 px-3 font-bold text-gray-900">{cls.className}</td>
                      <td className="py-3 px-3 text-gray-600">{cls.classSchedule || 'Tối 2-4-6'}</td>
                      <td className="py-3 px-3 text-gray-600">{cls.classRoom || 'Lab 201'}</td>
                      <td className="py-3 px-3 text-gray-600">{startDate}</td>
                      <td className="py-3 px-3 text-center">
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono font-medium">
                          {studentsCount}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-600 text-sm">{feeFormatted}</td>
                      <td className="py-3 px-3 text-center">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded font-bold text-xs">
                            <Check className="w-3.5 h-3.5" /> Đang chọn
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleChooseClass(cls)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold text-xs transition cursor-pointer shadow-xs"
                          >
                            Chọn lớp này
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
