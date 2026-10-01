import type { KanbanBoardData } from '../types/kanban.ts';

export const initialKanbanData: KanbanBoardData = {
  columns: [
    {
      id: 'new',
      title: 'MỚI',
      color: 'bg-blue-500',
      count: 5,
      cards: [
        {
          id: 'card-1',
          name: 'Nguyễn Văn A',
          phone: '0901.223.234',
          date: '23/09/2026 16:00',
          courseType: 'IELTS',
          referenceId: '#HS-1001'
        },
        {
          id: 'card-2',
          name: 'Phạm Thu Trang',
          phone: '0911.888.777',
          date: '23/09/2026 16:00',
          courseType: 'TOEIC',
          referenceId: '#HS-1005'
        }
      ]
    },
    {
      id: 'consulting',
      title: 'CHỜ TƯ VẤN',
      color: 'bg-yellow-400',
      count: 3,
      cards: [
        {
          id: 'card-3',
          name: 'Trần Thị Bích',
          phone: '0988.555.567',
          date: 'Giao tiếp CB',
          courseType: '',
          tagText: '⏰ Hẹn gọi: 16:00 (Hôm nay)',
          tagColor: 'bg-orange-100 text-orange-700',
          referenceId: '#HS-1002'
        }
      ]
    },
    {
      id: 'deposit',
      title: 'CHỜ ĐẶT CỌC',
      color: 'bg-orange-500',
      count: 2,
      cards: [
        {
          id: 'card-4',
          name: 'Lê Hoàng Cường',
          phone: '0912.333.890',
          date: '23/09/2026 16:00',
          courseType: 'TOEIC',
          referenceId: '#HS-1003'
        }
      ]
    },
    {
      id: 'completed',
      title: 'HOÀN THÀNH',
      color: 'bg-green-500',
      count: 10,
      cards: [
        {
          id: 'card-5',
          name: 'Ngô Hoàng Cường',
          phone: '0912.333.890',
          date: '23/09/2026 16:00',
          courseType: 'Đã thanh toán (TOEIC)',
          referenceId: '#HS-1004'
        },
        {
          id: 'card-6',
          name: 'Ngô Hoàng Cường',
          phone: '0912.333.890',
          date: '23/09/2026 16:00',
          courseType: 'Đã thanh toán (Toán cao cấp)',
          referenceId: '#HS-1006',
          source: 'Zalo Ads',
          requirement: 'Muốn học lớp tối 2-4-6, tháng sau thi bằng gấp.',
          status: 'CHỜ XẾP LỚP',
          statusColor: 'bg-orange-100 text-orange-700',
          history: [
            {
              id: 'h1',
              date: '22/09/2026 09:30',
              author: 'Hệ thống Kế toán',
              tagText: 'CHỜ XẾP LỚP',
              tagColor: 'bg-orange-100 text-orange-700',
              dotColor: 'bg-orange-500',
              content: 'Học viên đã đóng tiền 5,000,000đ thành công qua Cổng thanh toán. Hệ thống tự động chuyển trạng thái.'
            },
            {
              id: 'h2',
              date: '21/09/2026 15:45',
              author: 'Nguyễn Trọng A (Tư vấn viên)',
              tagText: 'CHỜ ĐẶT CỌC',
              tagColor: 'bg-yellow-100 text-yellow-700',
              dotColor: 'bg-yellow-400',
              content: 'Khách đồng ý chốt lớp. Đã tạo đơn hàng trên phần mềm và gửi mã VietQR qua Zalo. Khách bảo tối về CK.'
            },
            {
              id: 'h3',
              date: '21/09/2026 10:15',
              author: 'Nguyễn Trọng A (Tư vấn viên)',
              tagText: 'CHỜ TƯ VẤN',
              tagColor: 'bg-yellow-100 text-yellow-700',
              dotColor: 'bg-yellow-300',
              content: 'Đã gọi điện tư vấn lộ trình TOEIC 700. Khách muốn suy nghĩ thêm, hẹn 15h chiều nay gọi lại chốt giá.'
            },
            {
              id: 'h4',
              date: '21/09/2026 10:01',
              author: 'Azota',
              tagText: 'TEST',
              tagColor: 'bg-blue-100 text-blue-700',
              dotColor: 'bg-blue-500',
              content: 'Khách hàng làm bài test với số điểm 500 Toeic'
            },
            {
              id: 'h5',
              date: '21/09/2026 10:00',
              author: 'Web Form',
              tagText: 'MỚI',
              tagColor: 'bg-blue-100 text-blue-700',
              dotColor: 'bg-blue-500',
              content: 'Khách hàng điền form đăng ký thành công qua quảng cáo Landing Page tháng 9. Hệ thống tự động phân bổ Lead.'
            }
          ]
        }
      ]
    },
    {
      id: 'cancelled',
      title: 'ĐÃ HỦY',
      color: 'bg-slate-400',
      count: 2,
      cards: [
        {
          id: 'card-7',
          name: 'Lê Hoàng Anh',
          phone: '0912.333.890',
          date: 'Toán cao cấp',
          courseType: '23/09/2026 16:00',
          tagText: 'Lý do: Học phí cao',
          tagColor: 'bg-red-100 text-red-600',
          referenceId: '#HS-1007'
        }
      ]
    }
  ]
};
