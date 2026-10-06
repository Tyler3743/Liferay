chạy ở thư mục client-extensions/crm-app/src
npm install react react-dom (Cài đặt React)
npm install --save-dev typescript @types/react @types/react-dom (Cài đặt TypeScript và các định nghĩa kiểu cho React)
mở giao diện: npm run dev (Landing.tsx)
giao diện Form đăng ký tư vấn/tuyển sinh:
. Xử lý Validation phía client (check format số điện thoại, định dạng email hợp lệ).
. Làm hiệu ứng tương tác UX (trạng thái loading khi ấn gửi, thông báo popup thành công / thất bại).
. Gắn dữ liệu mẫu (Mock data) gửi thử theo đúng định dạng JSON đã thống nhất (chưa có API thật, chạy test trước).

------------------

.\gradlew build


scp client-extensions/*/dist/*.zip ubuntu@192.168.1.250:/home/ubuntu/



ssh ubuntu@192.168.1.250

sudo cp /home/ubuntu/*.zip /opt/app/liferay-portal/deploy/ && sudo chown ubuntu:ubuntu /opt/app/liferay-portal/deploy/*.zip


