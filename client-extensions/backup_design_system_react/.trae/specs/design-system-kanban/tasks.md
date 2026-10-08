# Hàng đợi triển khai: Design System Tương tác Meko CRM Kanban

Ánh xạ từ `spec.md`. Mỗi nhiệm vụ có TR (Test Requirements) kèm theo.

---

## Task 1: Tạo DesignSystemContext + Provider và các Token mặc định

- **Ưu tiên**: `high`
- **AC cha**: AC1, AC2
- **Mô tả**: Tạo thư mục `src/design-system/` chứa `DesignSystemContext.tsx`, `tokens.ts`, `index.ts`.
  - `tokens.ts` định nghĩa object `defaultTokens` với tất cả 20+ token (FR1) khớp giá trị trong `MEKO_CRM_DESIGN_SYSTEM.html` (primary `#DC2626`, secondary `#1A365D`, radius sm=5, md=10, lg=4, xl=6 px, font Inter, spacing 1x, colors component...)
  - Context cung cấp `tokens`, `setToken(key, value)`, `setComponentStyle(compType, key, value)`, `componentStyles`
  - `DesignSystemProvider` dùng `useEffect` đồng bộ tokens lên `document.documentElement.style.setProperty('--xxx', value)` (tên biến CSS 100% khớp file HTML)
  - Tạo hook `useDesignSystem()`
- **Files touch**: `meko-crm-kanban/src/design-system/` (tạo mới), `meko-crm-kanban/src/main.tsx` (wrap App bằng Provider)
- **TR (rule)**: Trong browser console, `document.documentElement.style.getPropertyValue('--primary-500') === '#DC2626'` sau khi app boot
- **TR (rule)**: Trong browser console, `document.documentElement.style.getPropertyValue('--radius-md') === '10px'`
- **TR (rule)**: Import `useDesignSystem` trong App.tsx và gọi thì `tokens.baseFontFamily` trả về `"'Inter', sans-serif"`

---

## Task 2: Xây dựng DesignSystemPanel (Controller chung) + Toggle chế độ thiết kế

- **Ưu tiên**: `high`
- **AC cha**: AC2, AC5
- **Mô tả**: Tạo component `DesignSystemPanel.tsx` trong `src/design-system/`
  - Toggle "⚙️ Thiết kế" trên header toolbar (gắn vào `KanbanBoard.tsx` hiện tại, bên phải Search)
  - Panel floating right:
    - Tab 🌍 Theme Chung: select `baseFontFamily` (Inter/Roboto/Plus Jakarta/Open/Montserrat/Lato/Poppins/Noto/Arial/Tahoma), range `baseFontSize` (12-22px), range `spacingScale` (0.5-2x), color `primary500`, `secondary`, `success`, `warning`, `error`
    - Tab 🎨 Component Màu: color `compBg`, `compBorder`, `compTextMain`, `compTextSub`, `compBtnRed`, `compBtnBlue`, `compBtnPurple`, `compTagBlueBg/Text`, `compTagWarnBg/Text`
    - Tab 📐 Kích thước: number `cardWidth`, `colWidth`, `drawerWidth`, `modalPadding`; number `radiusSm/Md/Lg/Xl` (px)
    - Tab 👁️ Xem Tokens: render `<table>` tất cả tokens (global + component) key/value, cho phép bôi đậm copy
  - Tất cả thay đổi gọi `setToken()` từ context → live preview
- **Files touch**: `DesignSystemPanel.tsx` (mới), `KanbanBoard.tsx` (thêm button toggle + render panel nếu `editMode=true`)
- **TR (rule)**: Open app → click ⚙️ Thiết kế → panel hiện ra; đổi màu primary → trong < 1s màu thanh toolbar button và các thành phần dùng primary thay đổi
- **TR (rule)**: Tab 👁️ Xem Tokens hiển thị tối thiểu 20 hàng (đầy đủ các token từ FR1)
- **TR (rubric)**: Layout panel rõ ràng, tabs hoạt động (0-2): `2`=đầy đủ 4 tab, responsive; `1`=thiếu 1 tab hoặc styling tệ; `0`=không render

---

## Task 3: Hệ thống Edit Wrapper + ComponentDetailModal (Modal chỉnh sửa component chi tiết)

- **Ưu tiên**: `high`
- **AC cha**: AC3, AC4
- **Mô tả**: 
  - Tạo `EditableWrapper.tsx`: nhận children + `componentType` (enum: `KANBAN_CARD`, `KANBAN_COL`, `DRAWER`, `ASSIGN_MODAL`, `CLASS_MODAL`, `DEAL_MODAL`, `COMPLETE_MODAL`, `LEADS_TABLE`); khi `editMode=true` hiện outline, icon ✏️ góc phải-trên; click ✏️ open `ComponentDetailModal`
  - Tạo `ComponentDetailModal.tsx`: tabs:
    - **Typography**: inputs per field (font size, weight, color) — tùy theo comp type
    - **Màu sắc**: background, border, các màu nút primary/secondary/danger
    - **Bo góc & Kích thước**: radius, padding, width/height (nếu liên quan)
    - **Icon**: render `<IconPicker>` (search/select các icon từ lucide-react như trong FR4 list)
  - Lưu các style theo key `componentType` vào context `componentStyles`
  - Helper hook `useComponentStyle(compType, field, fallback)` để đọc style ưu tiên component-level rồi tới global token
- **Files touch**: `EditableWrapper.tsx`, `ComponentDetailModal.tsx`, `IconPicker.tsx` (mới), cập nhật context
- **TR (rule)**: Bật chế độ thiết kế → hover `KanbanCard` → thấy outline + ✏️ → click ✏️ → mở modal có 4 tabs
- **TR (rule)**: Trong modal KanbanCard, đổi icon nút "Phân công" từ UserCheck → UserPlus → close modal → icon trên card thay đổi tức thì
- **TR (rule)**: Modal đóng bấm X hoặc backdrop work

---

## Task 4: Refactor KanbanCard & KanbanColumn dùng token + bọc EditableWrapper

- **Ưu tiên**: `high`
- **AC cha**: AC3, AC6
- **Mô tả**: 
  - Bọc phần JSX trả về của `KanbanCard.tsx` bằng `<EditableWrapper componentType="KANBAN_CARD">`
  - Bọc JSX của `KanbanColumn.tsx` bằng `<EditableWrapper componentType="KANBAN_COL">`
  - Thay các giá trị hard-coded:
    - Font, màu: dùng `style={{...}}` đọc từ `useComponentStyle('KANBAN_CARD', ...)` → override inline lên Tailwind (để style edit-mode ăn ngay)
    - Bo góc (rounded-xl, rounded-md) đọc token `radiusMd`, `radiusLg`
    - Màu nền card (bg-white) đọc `compBg`; màu viền (border-gray-150) đọc `compBorder`
    - Màu 3 nút (Phân công/Chọn lớp/Tạo Deal) lấy từ `compBtnRed`, `compBtnBlue`, `compBtnPurple` (inline style)
    - Icon hiển thị trên nút: đọc từ `componentStyles` (nếu có) thay vì import cứng 1 icon
  - Tương tự cho Column: màu header bar, nền cột, độ rộng cột (CSS variable --col-width)
- **Files touch**: `KanbanCard.tsx`, `KanbanColumn.tsx`
- **TR (rule)**: Bật edit mode, chỉnh màu nền card từ Design Panel → tất cả card đổi màu nền ngay (không reload)
- **TR (rule)**: kéo thả card giữa các cột vẫn hoạt động (dnd unaffected)
- **TR (rule)**: Nút "Phân công" trên card click vẫn mở AssignModal hoặc gọi callback đúng

---

## Task 5: Refactor CardDetailDrawer + 4 Modals (Assign/Class/Deal/Complete) dùng token + EditableWrapper

- **Ưu tiên**: `medium`
- **AC cha**: AC3, AC6
- **Mô tả**: 
  - Bọc wrapper bên trong Drawer/Modal JSX (vì Drawer là overlay, wrapper phải vào root div overlay)
  - CardDetailDrawer: đọc token màu 3 section (xanh/tím/đỏ), màu các nút submit, icon section header (có thể đổi)
  - AssignModal: màu background info card (purple-50), màu nút xác nhận (`compBtnPurple`), radius
  - ClassSelectModal: màu bảng `thead` (gray-100 → token), màu nút "Chọn lớp này" (`compBtnBlue`)
  - DealModal: gradient header đỏ (từ primary500)
  - CompleteStudentModal: gradient header xanh lá (từ success color token)
- **Files touch**: `CardDetailDrawer.tsx`, `AssignModal.tsx`, `ClassSelectModal.tsx`, `DealModal.tsx`, `CompleteStudentModal.tsx`
- **TR (rule)**: Mở AssignModal, vào chế độ edit, đổi màu nút Xác nhận → màu thay đổi
- **TR (rule)**: Mở Drawer → section Phân công (màu tím nền) đọc từ componentStyle hoặc token; click nút "Phân công cho Sale ngay" vẫn hoạt động

---

## Task 6: Refactor Bảng Leads (Dạng Bảng) trong KanbanBoard dùng token + bọc EditableWrapper

- **Ưu tiên**: `medium`
- **AC cha**: AC3, AC6
- **Mô tả**: 
  - Bọc khối `<table>` (leads view) bằng `<EditableWrapper componentType="LEADS_TABLE">`
  - Đọc token: `thead` bg color, row padding, border color, text color; bo góc bảng dùng `radiusLg`
- **Files touch**: `KanbanBoard.tsx` (phần `activeView === 'leads'`)
- **TR (rule)**: Chuyển sang "Dạng Bảng" → bảng hiển thị; bật edit mode → hover bảng thấy outline → mở modal chỉnh sửa
- **TR (rule)**: Click nút "Chi tiết" trên bảng vẫn mở Drawer

---

## Task 7: Kiểm tra lỗi TypeScript, Build, Smoke Test

- **Ưu tiên**: `high`
- **AC cha**: AC6
- **Mô tả**: 
  - Chạy `cd meko-crm-kanban ; npm run build` và kiểm tra 0 error TypeScript
  - Dev test các luồng chính: kéo thả, click từng nút, toggle edit mode, đổi 3-4 token xem ảnh hưởng
- **Files touch**: (chạy lệnh, sửa lỗi phát sinh nếu có)
- **TR (rule)**: `npm run build` exit code 0; không có file .ts/.tsx nào báo error trong terminal
- **TR (rubric)**: Khả năng duyệt UI không lỗi console (0-2): `2`=chrome dev console 0 error; `1`=warn được phép, 1-2 error không ảnh hưởng; `0`=lỗi render trắng hoặc lỗi JS chết chức năng
