import React, { useState } from 'react';
import './style.css'; // Nhúng file CSS (nếu có custom CSS)

export default function Landing() {
    // 1. State lưu trữ dữ liệu Form
    const [formData, setFormData] = useState({
        leadName: '',
        leadEmail: '',
        leadPhone: '',
        courseId: '',
        expectedResult: '',
        leadBirthday: '',
        freeTime: '',
        leadNote: ''
    });

    // State quản lý UI
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [popup, setPopup] = useState({ show: false, icon: '', title: '', desc: '' });

    // 2. Hàm xử lý thay đổi input
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Xóa lỗi khi người dùng bắt đầu nhập lại
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // 3. Hàm Validate dữ liệu
    const validateForm = () => {
        let newErrors: { [key: string]: string } = {};
        let isValid = true;

        if (!formData.leadName.trim()) {
            newErrors.leadName = 'Họ tên không được để trống';
            isValid = false;
        }

        // Validate Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.leadEmail || !emailRegex.test(formData.leadEmail)) {
            newErrors.leadEmail = 'Email không hợp lệ';
            isValid = false;
        }

        // Validate Số điện thoại (Định dạng VN cơ bản: 10 số bắt đầu bằng 0)
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!formData.leadPhone || !phoneRegex.test(formData.leadPhone)) {
            newErrors.leadPhone = 'Số điện thoại không hợp lệ';
            isValid = false;
        }

        if (!formData.courseId) {
            newErrors.courseId = 'Vui lòng chọn khóa học';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // 4. Hàm xử lý Gửi Form (Mock Data)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Nếu validate lỗi thì dừng lại
        if (!validateForm()) return;

        setIsLoading(true);

        // Chuẩn bị Mock Data (đúng định dạng JSON)
        const payload = {
            leadName: formData.leadName,
            leadPhone: formData.leadPhone,
            leadEmail: formData.leadEmail,
            courseId: formData.courseId,
            leadBirthday: formData.leadBirthday ? new Date(formData.leadBirthday).toISOString() : null,
            leadSource: 'Form',
            note: `Kỳ vọng: ${formData.expectedResult}. Giờ rảnh: ${formData.freeTime}. Ghi chú: ${formData.leadNote}`
        };

        console.log("Mock API Payload (Dữ liệu gửi đi):", JSON.stringify(payload, null, 2));

        // Giả lập gọi API mất 1.5s
        setTimeout(() => {
            setIsLoading(false);
            // Hiển thị Popup thành công
            setPopup({
                show: true,
                icon: '✅',
                title: 'Thành Công!',
                desc: 'Thông tin của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ sớm nhất!'
            });

            // Reset form nếu muốn
            // setFormData({ ... });
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#eaf3e6] font-['Inter']">
            {/* Header */}
            <header className="bg-white py-4 px-8 flex justify-between items-center shadow-sm">
                <div className="text-2xl font-bold tracking-tight">
                    <span className="text-[#1a365d]">Meko</span><span className="text-[#e53e3e]">CRM</span>
                </div>
                <nav className="hidden md:flex space-x-8 font-medium text-gray-700">
                    <a href="#" className="hover:text-red-700">Trang chủ</a>
                    <a href="#" className="hover:text-red-700">Các khóa học & kỳ thi</a>
                    <a href="#" className="hover:text-red-700">Về MekoCRM</a>
                </nav>
            </header>

            {/* Main Form */}
            <main className="flex-grow flex items-center justify-center p-6">
                <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
                    <h1 className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2 mb-6">
                        Form đăng ký khóa học
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="text-sm font-semibold text-gray-900 mb-1 display-block">Họ và tên <span className="text-red-500">*</span></label>
                            <input type="text" name="leadName" value={formData.leadName} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-red-800" placeholder="Nhập họ tên đầy đủ" />
                            {errors.leadName && <span className="text-red-500 text-xs mt-1">{errors.leadName}</span>}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-900 mb-1 display-block">Email <span className="text-red-500">*</span></label>
                            <input type="email" name="leadEmail" value={formData.leadEmail} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-red-800" placeholder="Nhập email hợp lệ" />
                            {errors.leadEmail && <span className="text-red-500 text-xs mt-1">{errors.leadEmail}</span>}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-900 mb-1 display-block">Số điện thoại <span className="text-red-500">*</span></label>
                            <input type="tel" name="leadPhone" value={formData.leadPhone} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-red-800" placeholder="Nhập số điện thoại" />
                            {errors.leadPhone && <span className="text-red-500 text-xs mt-1">{errors.leadPhone}</span>}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-900 mb-1 display-block">Môn học quan tâm <span className="text-red-500">*</span></label>
                            <select name="courseId" value={formData.courseId} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-red-800">
                                <option value="">Chọn môn học</option>
                                <option value="C01">Khóa học Liferay Cơ bản</option>
                                <option value="C02">Khóa học ReactJS Nâng cao</option>
                            </select>
                            {errors.courseId && <span className="text-red-500 text-xs mt-1">{errors.courseId}</span>}
                        </div>

                        {/* Các trường phụ */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-900 mb-1 display-block">Ngày sinh</label>
                                <input type="date" name="leadBirthday" value={formData.leadBirthday} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-red-800" />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-900 mb-1 display-block">Khung giờ rảnh</label>
                                <input type="text" name="freeTime" value={formData.freeTime} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-red-800" placeholder="Tối T7, CN" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-900 mb-1 display-block">Kỳ vọng kết quả</label>
                            <input type="text" name="expectedResult" value={formData.expectedResult} onChange={handleChange} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-red-800" placeholder="Điểm mục tiêu..." />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-gray-900 mb-1 display-block">Ghi chú thêm</label>
                            <textarea name="leadNote" value={formData.leadNote} onChange={handleChange} rows={2} className="border border-gray-300 rounded-md p-2 w-full outline-none focus:border-red-800" placeholder="Ghi chú khác..."></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full text-white font-bold py-3 rounded-lg text-center transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#921c24] hover:bg-[#7a151e]'}`}
                        >
                            {isLoading ? 'Đang xử lý...' : 'Đăng ký ngay'}
                        </button>
                    </form>
                </div>
            </main>

            {/* Popup Notification */}
            {popup.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full text-center">
                        <div className="text-4xl mb-4">{popup.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{popup.title}</h3>
                        <p className="text-gray-600 mb-6 text-sm">{popup.desc}</p>
                        <button
                            onClick={() => setPopup({ ...popup, show: false })}
                            className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 w-full"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
