import { LeadRequest } from '../models/LeadRequest';

export const FormService = {
  // Service chịu trách nhiệm gọi API, tách biệt khỏi UI Component
  submitLead: async (lead: LeadRequest): Promise<{ success: boolean; message: string }> => {
    
    // Đóng gói JSON thông qua phương thức OOP
    const payload = lead.toJSON();
    console.log("Mock API Payload (Dữ liệu JSON gửi đi):", JSON.stringify(payload, null, 2));

    // Giả lập delay mạng 1.5s
    return new Promise((resolve) => {
      setTimeout(() => {
        // Giả lập logic kiểm tra trùng lặp (Mock Deduplication)
        // Nếu người dùng nhập email là "test@gmail.com" hoặc SĐT chứa số "999" thì báo lỗi trùng lặp
        if (payload.leadEmail === 'test@gmail.com' || payload.leadPhone.includes('999')) {
          resolve({ 
            success: false, 
            message: 'Email hoặc Số điện thoại này đã được đăng ký trước đó. Vui lòng sử dụng thông tin khác!' 
          });
        } else {
          resolve({ 
            success: true, 
            message: 'Thông tin của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ sớm nhất!' 
          });
        }
      }, 1500);
    });
  }
};
