# Thông số kỹ thuật: Design System Tương tác cho Meko CRM Kanban

## Vấn đề

Hiện tại, các component trong `meko-crm-kanban` (giao diện Kanban, Bảng, Modal, Drawer, v.v.) đang dùng các style hard-coded qua Tailwind classes và giá trị inline. Người dùng không thể:

- Chỉnh sửa kiểu chữ, màu sắc, bo góc, kích thước trên từng component một cách trực tiếp
- Có một giao diện quản lý design system thống nhất cho toàn bộ app
- Tùy chỉnh icon, modal chi tiết, modal tuyển sinh, modal chọn lớp
- Xuất ra bộ design system sau khi tùy chỉnh

## Người dùng & Mục tiêu

- **Người dùng**: Quản lý hệ thống / Thiết kế viên muốn tùy chỉnh giao diện CRM trước khi triển khai
- **Mục tiêu 1**: Mỗi component trong meko-crm-kanban (KanbanCard, KanbanColumn, Drawer, Modal Phân công, Modal Chọn lớp, Modal Deal, Modal Hoàn thành, Bảng Leads) đều có thể được bấm vào để mở một **Bảng chỉnh sửa chi tiết** (Design Panel)
- **Mục tiêu 2**: Cung cấp **Design System Controller** (panel cố định) để chỉnh sửa theme chung: typography, màu chủ đạo, bo góc, spacing, kích thước input/button, kích thước card (chiều dài/rộng)
- **Mục tiêu 3**: Cho phép chỉnh sửa icon hiển thị (chọn từ thư viện lucide-react hiện có) trên các nút hành động và section
- **Mục tiêu 4**: Sau khi chỉnh sửa xong, có thể xem các giá trị đã được áp dụng tức thì (live preview), và có cơ chế ghi lại bộ theme tokens để tạo thành "bộ design system"

## Không phải mục tiêu (Non-Goals)

- Không thay đổi logic nghiệp vụ của Kanban (kéo thả, API call, phân công)
- Không build chức năng export design tokens ra file JSON/CSS (chỉ yêu cầu ghi lại state trong context và hiển thị)
- Không thay đổi data model / API layer

## Yêu cầu chức năng (Functional Requirements)

### FR1: Design System Context (Nền tảng chung)

- Tạo `DesignSystemContext` quản lý state theme tokens toàn cục, đồng bộ với CSS variables qua `:root`
- Tokens bao gồm (tham chiếu `MEKO_CRM_DESIGN_SYSTEM.html`):
  - Typography: `baseFontFamily`, `baseFontSize`, `h1Size`, `h2Size`, `bodySize`, `spacingScale`
  - Màu sắc Global: `primary500`, `primary600`, `secondary`, `success`, `warning`, `error`
  - Màu sắc Component: `compBg`, `compBorder`, `compTextMain`, `compTextSub`, `compBtnRed`, `compBtnBlue`, `compBtnPurple`, `compTagBlueBg`, `compTagBlueText`, `compTagWarnBg`, `compTagWarnText`
  - Bo góc: `radiusSm`, `radiusMd`, `radiusLg`, `radiusXl`
  - Kích thước component: `cardWidth`, `colWidth`, `drawerWidth`, `modalPadding`

### FR2: Design System Controller (Panel điều khiển chung)

- Tạo component `DesignSystemPanel` dạng floating/collapsible sidebar cố định bên phải màn hình
- Tabs:
  - **🌍 Theme Chung**: Typography (font family, sizes, spacing), màu brand + semantic, bo góc (4 cấp)
  - **📐 Kích thước**: Chiều rộng cột, card, drawer, padding modal
  - **🎨 Component Màu**: Nền card, viền, chữ chính/phụ, màu 3 nút (đỏ/xanh/tím), màu tag (xanh/vàng)
  - **👁️ Xem Tokens**: Hiển thị tất cả token hiện tại dạng bảng key/value (bộ design system hiện hành)
- Tất cả input trong Controller thay đổi → cập nhật Context → cập nhật CSS variables → live preview toàn app

### FR3: Mở Design Panel từ mọi Component (Click để chỉnh sửa từng thành phần)

- Khi user hover vào một component có thể chỉnh sửa → hiện outline xanh highlight + icon ✏️ góc trên-phải
- Click ✏️ hoặc click chuột phải → mở `ComponentDetailModal` (modal chi tiết chỉnh sửa thành phần đó)
- Các component được bật chế độ này:
  1. **KanbanCard** → chỉnh sửa: font tiêu đề, màu nền, màu viền, bo góc, kích thước px px, màu 2 nút, icon nút Phân công/Chọn lớp/Tạo Deal/Chi tiết
  2. **KanbanColumn** → chỉnh sửa: màu thanh tiêu đề, màu nền cột, bo góc cột, chiều rộng cột, font tiêu đề cột
  3. **CardDetailDrawer** → chỉnh sửa: font header, màu section (xanh/tím/đỏ), padding các section, icon các section, màu các nút bấm
  4. **AssignModal** → chỉnh sửa: màu header, màu bg info card, màu dropdown, màu nút xác nhận (tím), icon
  5. **ClassSelectModal** → chỉnh sửa: màu bảng header, màu hàng hover, màu nút chọn, icon, bo góc bảng
  6. **DealModal** → chỉnh sửa: gradient header đỏ, màu bg info, màu input, màu nút submit, icon
  7. **CompleteStudentModal** → chỉnh sửa: gradient header xanh, màu bg info lớp, màu input, màu nút xác nhận, icon
  8. **Bảng Leads (trong KanbanBoard)** → chỉnh sửa: màu header bảng, màu hàng, padding cell, font, bo góc

### FR4: Component Detail Modal (Chỉnh sửa chi tiết từng component)

- Modal có tabs tùy theo loại component, tối thiểu:
  - **Typography**: Font size, font weight, line height, màu chữ các phần (tiêu đề, phụ, label)
  - **Màu sắc**: Nền, viền, màu nút (primary/secondary/danger)
  - **Bo góc & Kích thước**: Radius các cấp, padding, margin, width/height (nếu có)
  - **Icon**: Dropdown chọn icon từ lucide-react (các icon hiện dùng: UserCheck, BookOpen, DollarSign, Phone, Calendar, Mail, MapPin, Tag, ShieldCheck, Clock, Search, Check, X, CheckCircle, GraduationCap, User, Trash2, CheckCircle2, Kanban, Users, ShieldAlert)
- Apply style ngay (inline style override hoặc class động) + lưu vào Context theo key component type

### FR5: Tuỳ chỉnh icon thay thế

- Với mọi vị trí có icon (trên nút, section header, info item), trong Component Detail Modal có dropdown chọn icon thay thế
- Danh sách icon lấy từ lucide-react, cho filter/search nhanh

### FR6: Áp dụng Style vào từng Component hiện có

- Refactor 8 component trên để đọc style từ DesignSystemContext, ưu tiên component-level style rồi mới đến global tokens
- Không làm mất chức năng hiện tại (vẫn drag-drop được, vẫn click mở modal được)

## Yêu cầu phi chức năng (Non-Functional Requirements)

- **NFR1 (Hiệu suất)**: Context thay đổi không gây re-render toàn cây; dùng memo/selector khi cần thiết
- **NFR2 (Tương thích ngược)**: App vẫn hoạt động nếu không can thiệp gì (mặc định tokens khớp với giá trị hiện tại của app)
- **NFR3 (Tắt/bật chế độ chỉnh sửa)**: Có toggle "Chế độ Thiết kế" trên thanh toolbar; tắt thì ẩn toàn bộ ✏️ highlight và Design Panel (giữ theme vừa cài)
- **NFR4 (Tham chiếu file HTML)**: Tên token và giá trị mặc định 100% khớp với `MEKO_CRM_DESIGN_SYSTEM.html` đã cung cấp

## Ràng buộc & Phụ thuộc

- Dùng `lucide-react` (đã có trong `package.json`) cho toàn bộ icon
- Dùng Tailwind CSS v4 (đã có) cho layout; tokens cụ thể dùng CSS variables + inline style
- Không thêm thư viện UI mới (ví dụ shadcn, antd)
- Tất cả code trong thư mục `meko-crm-kanban/src/`

## Giả định & Câu hỏi mở

- Giả định: "Chỉnh sửa icon" nghĩa là đổi icon hiển thị tương đương (VD: 📞 Phone → 📱 Smartphone), không đổi nghĩa hành động
- Giả định: Bộ design system được "tạo ra" tức là panel **👁️ Xem Tokens** hiển thị đầy đủ key-value, người dùng có thể copy paste
- Câu hỏi mở (đã tự trả lời theo hướng dễ nhất): Kích hoạt edit mode = button trên toolbar; Không cần lưu vào localStorage

## Tiêu chí chấp nhận (Acceptance Criteria)

### Rule AC1: DesignSystemContext được tạo và ghi CSS variables vào :root

- **Quy tắc**: Khi app khởi chạy, `document.documentElement.style.getPropertyValue('--primary-500')` trả về `#DC2626` (hoặc giá trị user đã set)
- **Quy tắc**: Tất cả 20+ token ở FR1 đều có CSS variable tương ứng khớp tên trong file HTML

### Rule AC2: DesignSystemPanel hiển thị và hoạt động live preview

- **Quy tắc**: Có button "⚙️ Thiết kế" trên toolbar của KanbanBoard, click mở panel bên phải
- **Quy tắc**: Thay đổi input "Màu Chủ Đạo" (primary color) → màu các nút Phân công, badge trạng thái liên quan thay đổi tức thì trong < 300ms
- **Quy tắc**: Thay đổi slider "Cỡ Chữ Gốc" → kích thước chữ toàn bộ app thay đổi tức thì

### Rubric AC3: Khả năng click chỉnh sửa từng component (điểm 0-2)

- **Thang điểm (2)**: Hover lên KanbanCard, KanbanColumn, AssignModal, ClassSelectModal, DealModal, CompleteStudentModal, Drawer, Bảng Leads đều thấy outline + ✏️ icon; click mở modal đúng loại; có tabs Typography/Màu/Icon/Kích thước
- **Thang điểm (1)**: Có thể chỉnh sửa được nửa số component; modal thiếu tabs
- **Thang điểm (0)**: Không có chế độ click chỉnh sửa, hoặc không mở được modal

### Rule AC4: Modal chi tiết chỉnh sửa được icon

- **Quy tắc**: Từ ComponentDetailModal của KanbanCard, tab "Icon" cho phép đổi icon nút "Phân công" từ UserCheck sang một icon khác (VD: UserPlus); thay đổi hiển thị ngay trên tất cả các KanbanCard

### Rule AC5: Panel xem tokens (bộ design system)

- **Quy tắc**: Tab "👁️ Xem Tokens" trong DesignSystemPanel hiển thị một bảng gồm tất cả các token từ FR1 với giá trị hiện tại, người dùng có thể copy được

### Rule AC6: Không phá vỡ chức năng cũ

- **Quy tắc**: kéo-thả thẻ vẫn hoạt động; click Phân công/Chọn lớp/Tạo Deal vẫn mở modal đúng; dạng Bảng (leads) vẫn render; Drawer vẫn mở
- **Quy tắc**: Chạy `npm run build` trong `meko-crm-kanban` không báo lỗi TypeScript
