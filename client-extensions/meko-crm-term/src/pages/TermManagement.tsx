import React, { useState, useEffect } from 'react';
import type { Term } from '../models/Term.ts';
import { getTerms } from '../services/TermService.ts';
import TermForm from '../components/TermForm.tsx';

const TermManagement: React.FC = () => {
    const [terms, setTerms] = useState<Term[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const fetchTerms = () => {
        getTerms().then(setTerms);
    };

    useEffect(() => {
        fetchTerms();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ONGOING': return 'bg-green-100 text-green-700';
            case 'UPCOMING': return 'bg-yellow-100 text-yellow-700';
            case 'FINISHED': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'ONGOING': return 'ĐANG DIỄN RA';
            case 'UPCOMING': return 'ĐANG CHIÊU SINH';
            case 'FINISHED': return 'ĐÃ KẾT THÚC';
            default: return status;
        }
    };

    const getProgressBarColor = (status: string) => {
        switch (status) {
            case 'ONGOING': return 'bg-green-600';
            case 'UPCOMING': return 'bg-gray-300';
            case 'FINISHED': return 'bg-gray-400';
            default: return 'bg-gray-300';
        }
    };

    const getProgressTextColor = (status: string) => {
        switch (status) {
            case 'ONGOING': return 'text-green-600';
            case 'UPCOMING': return 'text-orange-500';
            case 'FINISHED': return 'text-gray-400';
            default: return 'text-gray-500';
        }
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-1">Quản lý Đào tạo / Học kỳ</div>
                    <h1 className="text-2xl font-bold text-gray-900">Danh sách Học kỳ</h1>
                </div>

                {/* Filters & Actions */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end mb-6">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">TÌM KIẾM HỌC KỲ</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </span>
                            <input type="text" className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full pl-10 p-2.5 outline-none" placeholder="Nhập tên, mã học kỳ..." />
                        </div>
                    </div>
                    <div className="w-48">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">TRẠNG THÁI</label>
                        <select className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 outline-none appearance-none">
                            <option>Tất cả trạng thái</option>
                            <option>Đang diễn ra</option>
                            <option>Sắp khai giảng</option>
                            <option>Đã kết thúc</option>
                        </select>
                    </div>
                    <div className="w-48">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">NĂM HỌC</label>
                        <select className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 outline-none appearance-none">
                            <option>Năm 2026</option>
                            <option>Năm 2025</option>
                        </select>
                    </div>
                    <div className="ml-auto">
                        <button onClick={() => setIsFormOpen(true)} className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-colors shadow-sm shadow-red-200">
                            + Tạo học kỳ
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">TÊN HỌC KỲ</th>
                                    <th className="px-6 py-4 font-semibold">THỜI GIAN & TIẾN ĐỘ</th>
                                    <th className="px-6 py-4 font-semibold">THỐNG KÊ TỔNG QUAN</th>
                                    <th className="px-6 py-4 font-semibold text-center">TRẠNG THÁI</th>
                                    <th className="px-6 py-4 font-semibold text-center">THAO TÁC</th>
                                </tr>
                            </thead>
                            <tbody>
                                {terms.map((term, index) => (
                                    <tr key={term.id} className={`bg-white border-b border-gray-50 hover:bg-gray-50 transition-colors ${index === terms.length - 1 ? 'border-b-0' : ''}`}>
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-gray-900 text-base mb-1">{term.name}</div>
                                            <div className="text-gray-500 mb-1">Mã: {term.code}</div>
                                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded border border-gray-200">{term.type}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-gray-900 mb-2">{term.startDate} - {term.endDate}</div>
                                            <div className="w-48 bg-gray-200 rounded-full h-1.5 mb-1.5">
                                                <div className={`${getProgressBarColor(term.status)} h-1.5 rounded-full`} style={{ width: `${term.progressPercentage}%` }}></div>
                                            </div>
                                            <div className={`text-xs font-medium ${getProgressTextColor(term.status)}`}>{term.progressText}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center text-gray-600 mb-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                                                <span className="font-medium mr-1">{term.courseCount}</span> Khóa học
                                            </div>
                                            <div className="flex items-center text-gray-500">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2"></span>
                                                <span className="font-medium mr-1">{term.classCount}</span> Lớp {term.classDesc && `(${term.classDesc})`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`${getStatusColor(term.status)} text-xs font-bold px-3 py-1 rounded-full flex items-center justify-center w-max mx-auto`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${term.status === 'ONGOING' ? 'bg-green-600' : (term.status === 'UPCOMING' ? 'bg-yellow-500' : 'bg-gray-500')}`}></span>
                                                {getStatusText(term.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button className="text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-4 py-2 text-center transition-colors">
                                                {term.status === 'FINISHED' ? 'Xem' : 'Quản lý'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            {/* Modal Form */}
            {isFormOpen && <TermForm onClose={() => setIsFormOpen(false)} onSuccess={fetchTerms} />}
        </div>
    );
};

export default TermManagement;
