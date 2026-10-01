export interface CourseOption {
    value: string;
    label: string;
}

export interface ConsultationFormConfig {
    title: string;
    labels: { leadName: string; leadEmail: string; leadPhone: string; courseId: string; leadBirthday: string; freeTime: string; expectedResult: string; leadNote: string; };
    placeholders: { leadName: string; leadEmail: string; leadPhone: string; courseId: string; freeTime: string; expectedResult: string; leadNote: string; };
    validationMessages: { leadNameRequired: string; leadEmailInvalid: string; leadPhoneInvalid: string; courseIdRequired: string; };
    buttonTexts: { submit: string; loading: string; };
    modalMessages: { successTitle: string; errorTitle: string; defaultErrorDesc: string; };
    courseOptions: CourseOption[];
}

// Cấu hình mặc định (Sau này có thể gọi API đè lên biến này)
export const defaultFormConfig: ConsultationFormConfig = {
    title: 'Form đăng ký khóa học',
    labels: {
        leadName: 'Họ và tên', leadEmail: 'Email', leadPhone: 'Số điện thoại', courseId: 'Môn học',
        leadBirthday: 'Ngày sinh', freeTime: 'Khung giờ rảnh', expectedResult: 'Kết quả mong muốn', leadNote: 'Ghi chú thêm'
    },
    placeholders: {
        leadName: 'Nhập họ tên', leadEmail: 'Nhập email', leadPhone: 'Nhập số điện thoại', courseId: 'Chọn môn học',
        freeTime: 'VD: Tối T7, CN', expectedResult: 'Nhập kết quả mong muốn đạt được...', leadNote: 'Nhập các ghi chú khác (nếu có)...'
    },
    validationMessages: {
        leadNameRequired: 'Họ tên không được để trống', leadEmailInvalid: 'Email không hợp lệ',
        leadPhoneInvalid: 'Số điện thoại không hợp lệ', courseIdRequired: 'Vui lòng chọn khóa học'
    },
    buttonTexts: { submit: 'Đăng ký ngay', loading: 'Đang xử lý...' },
    modalMessages: {
        successTitle: 'Thành Công!', errorTitle: 'Đăng ký thất bại!',
        defaultErrorDesc: 'Số điện thoại hoặc Email này đã tồn tại trong hệ thống. Vui lòng kiểm tra lại!'
    },
    courseOptions: [
        { value: 'C01', label: 'Khóa học Liferay Cơ bản' },
        { value: 'C02', label: 'Khóa học ReactJS Nâng cao' }
    ]
};