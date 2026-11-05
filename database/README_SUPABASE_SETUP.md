# 🚀 HƯỚNG DẪN KHỞI TẠO CƠ SỞ DỮ LIỆU SUPABASE (GIAI ĐOẠN 0)
**Hệ thống Quản trị Doanh nghiệp HaHa Eco Travel ERP**

Tài liệu này hướng dẫn từng bước khởi tạo Dự án Supabase (PostgreSQL) an toàn, miễn phí và kết nối chuẩn hóa theo đúng [Bản Thiết Kế Kiến Trúc](file:///C:/Users/HP/.gemini/antigravity/brain/a8185a15-fb3e-42b6-b462-e715e5ec858d/HAHA_ENTERPRISE_AI_ERP_BLUEPRINT.md).

---

## BƯỚC 1: XUẤT TỆP SAO LƯU GỐC DỰ PHÒNG (BẢO TOÀN DỮ LIỆU 100%)
1. Mở tệp công cụ an toàn:
   👉 **[`database/export_current_data.html`](file:///c:/Users/HP/OneDrive/Tài%20liệu/HAHA_OPERATING_SYSTEM_V1.0/database/export_current_data.html)** trực tiếp bằng trình duyệt bạn thường dùng để đăng nhập hệ thống HaHa Eco Travel (Chrome / Edge / Cốc Cốc).
2. Nhấn nút **"Tải Tệp Sao Lưu JSON Về Máy Tính"**.
3. Lưu tệp `haha_master_backup_baseline_...json` vào một thư mục an toàn trên máy tính.

---

## BƯỚC 2: TẠO DỰ ÁN SUPABASE MỚI (HOÀN TOÀN MIỄN PHÍ)
1. Truy cập trang chủ Supabase: [https://supabase.com](https://supabase.com)
2. Nhấp **"Start your project"** hoặc đăng nhập bằng tài khoản GitHub / Google của bạn.
3. Nhấp **"New Project"**:
   - **Name:** `haha-eco-travel-erp`
   - **Database Password:** Đặt mật khẩu mạnh (và lưu lại cẩn thận).
   - **Region:** Chọn **Singapore (ap-southeast-1)** *(Bắt buộc chọn khu vực này để tốc độ mạng 5G/WiFi tại Việt Nam đạt dưới 50ms)*.
   - **Pricing Plan:** Free tier ($0/tháng).
4. Nhấp **"Create new project"** và chờ 1-2 phút để Supabase chuẩn bị máy chủ PostgreSQL.

---

## BƯỚC 3: NẠP LƯỢC ĐỒ 17 BẢNG DỮ LIỆU & RLS
1. Trong màn hình điều khiển Supabase, chọn mục **"SQL Editor"** ở thanh menu bên trái.
2. Nhấp **"New query"**.
3. Mở tệp mã nguồn:
   👉 **[`database/01_init_supabase_schema.sql`](file:///c:/Users/HP/OneDrive/Tài%20liệu/HAHA_OPERATING_SYSTEM_V1.0/database/01_init_supabase_schema.sql)**
4. Sao chép toàn bộ nội dung trong tệp `01_init_supabase_schema.sql` và dán vào cửa sổ SQL Editor trên Supabase.
5. Nhấp nút **"Run"** (hoặc phím tắt `Ctrl + Enter`).
6. Supabase sẽ thông báo `Success. No rows returned` $\rightarrow$ Toàn bộ 17 bảng, khóa ngoại, chỉ mục, triggers và chính sách bảo mật RLS đã được tạo thành công!

---

## BƯỚC 4: LẤY THÔNG TIN KẾT NỐI (API KEYS)
1. Trong Supabase, chọn biểu tượng bánh răng **Project Settings** (ở góc dưới bên trái).
2. Chọn mục **API**:
   - Sao chép **Project URL** (VD: `https://xyzcompany.supabase.co`).
   - Sao chép **Project API Keys** $\rightarrow$ Khóa **`anon public`**.
3. Gửi lại 2 thông tin này cho tôi khi bạn đã sẵn sàng để chuyển sang **Giai đoạn 1 (Chuyển đổi Backend & Kết nối song song)**.

---

> [!NOTE]
> Khóa `anon public` là khóa an toàn được thiết kế để nhúng ở phía trình duyệt/điện thoại vì hệ thống đã được bảo vệ bởi chính sách **Row Level Security (RLS)** trên từng bảng. Tuyệt đối không chia sẻ khóa `service_role secret`.
