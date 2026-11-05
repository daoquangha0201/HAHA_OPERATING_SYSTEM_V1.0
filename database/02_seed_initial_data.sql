-- ==============================================================================
-- HAHA ECO TRAVEL OPERATING SYSTEM - SEED INITIAL DATA (GIAI ĐOẠN 0 -> 1)
-- Dữ liệu hạt giống chuẩn hóa từ HAHA OPERATING SYSTEM V1.0
-- ==============================================================================

-- 1. NẠP TÀI KHOẢN NGƯỜI DÙNG (app_users)
INSERT INTO app_users (username, full_name, role, role_title, email, phone, is_active) VALUES
('ceo', 'Đỗ Thành Đạt', 'CEO', 'Giám đốc Điều hành', 'ceo@hahatravel.vn', '0988112233', TRUE),
('sale01', 'Nguyễn Văn An', 'SALE', 'Leader Kinh doanh', 'an.nguyen@hahatravel.vn', '0901234567', TRUE),
('sale02', 'Trần Thị Ngọc', 'SALE', 'Chuyên viên Kinh doanh', 'ngoc.tran@hahatravel.vn', '0902345678', TRUE),
('dieuhanh', 'Trần Đức Huy', 'OPS', 'Điều hành Tour', 'ops@hahatravel.vn', '0903456789', TRUE),
('ketoan', 'Lê Thị Mai', 'KE_TOAN', 'Kế toán trưởng', 'finance@hahatravel.vn', '0904567890', TRUE),
('ctv_hoangyen', 'Hoàng Yến (Travel Blogger)', 'CTV', 'Cộng tác viên', 'hoangyen@gmail.com', '0911223344', TRUE),
('ctv_minhtuan', 'Minh Tuấn (Admin Camping)', 'CTV', 'Cộng tác viên', 'minhtuan@gmail.com', '0988776655', TRUE),
('cattien_ecolodge', 'Khách sạn Sinh Thái Nam Cát Tiên', 'SUPPLIER', 'Đối tác Khách sạn 4★', 'cattien@ecolodge.vn', '02513668899', TRUE),
('saigon_green_trans', 'Nhà Xe Du Lịch Xanh Sài Gòn', 'SUPPLIER', 'Đối tác Vận chuyển 5★', 'greentrans@saigon.vn', '02838991122', TRUE)
ON CONFLICT (username) DO NOTHING;

-- 2. NẠP MẠNG LƯỚI CTV (ctvs)
INSERT INTO ctvs (id, name, phone, email, bank_name, bank_account, tax_code, id_card, location, assigned_sale_id, status) VALUES
('CTV-001', 'Hoàng Yến (Travel Blogger)', '0911223344', 'hoangyen@gmail.com', 'Techcombank', '1903456789', '8012345678', '079198001234', 'TP. Hồ Chí Minh', 'sale01', 'ACTIVE'),
('CTV-002', 'Minh Tuấn (Admin Camping)', '0988776655', 'minhtuan@gmail.com', 'Vietcombank', '0071001234567', '8012345679', '079198005678', 'TP. Đà Lạt', 'sale01', 'ACTIVE'),
('CTV-003', 'Thảo Vy (Cộng đồng Chữa Lành)', '0909112233', 'thaovy@gmail.com', 'MBBank', '0909112233', '8012345680', '079199001122', 'TP. Hồ Chí Minh', 'sale02', 'ACTIVE'),
('CTV-004', 'Lê Tuấn Hưng (Phượt Thủ)', '0933445566', 'tuanhung@gmail.com', 'ACB', '234567890', '8012345681', '079195003344', 'TP. Hà Nội', 'sale02', 'ACTIVE'),
('CTV-005', 'Đặng Thu Thảo (Reviewer Du Lịch)', '0977889900', 'thuthao@gmail.com', 'VPBank', '156789012', '8012345682', '079196007788', 'TP. Cần Thơ', 'sale01', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- 3. NẠP NGÂN HÀNG TOUR & HOA HỒNG GỐC (tours)
INSERT INTO tours (id, code, name, keyword, duration, price, estimated_cost, max_pax, commission_method, commission_rate, commission_fixed, condition, status) VALUES
('TOUR-01', 'CAT-TIEN-2N1D', 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ', 'Cát Tiên', '2N1Đ', 2400000, 1550000, 25, 'PERCENT_REVENUE', 7.0, 0, 'Khách thanh toán đủ 100% & khởi hành tour thành công', 'selling'),
('TOUR-02', 'DA-LAT-3N2D', 'Tour Chữa Lành & Cắm Trại Đà Lạt 3N2Đ', 'Đà Lạt', '3N2Đ', 3250000, 2100000, 20, 'FIXED_PER_PAX', 0, 300000, 'Tính trên số lượng khách thực tế đi tour đủ điều kiện', 'selling'),
('TOUR-03', 'MIEN-TAY-2N1D', 'Tour Sinh Thái Miền Tây Sông Nước Bến Tre - Cần Thơ 2N1Đ', 'Miền Tây', '2N1Đ', 1950000, 1250000, 30, 'FIXED_PER_PAX', 0, 200000, 'Áp dụng cho mọi đoàn khách từ 1 khách trở lên', 'selling'),
('TOUR-04', 'TAY-BAC-4N3D', 'Tour Khám Phá Tây Bắc - Mùa Lúa Chín Mù Cang Chải 4N3Đ', 'Tây Bắc', '4N3Đ', 4650000, 3100000, 25, 'PERCENT_PROFIT', 15.0, 0, '15% trên Lợi nhuận gộp thực tế sau khi quyết toán xong tour', 'selling'),
('TOUR-05', 'MANG-DEN-3N2D', 'Tour Khám Phá Đại Ngàn & Rừng Thông Măng Đen 3N2Đ', 'Măng Đen', '3N2Đ', 2850000, 1850000, 20, 'PERCENT_REVENUE', 6.0, 0, '6% trên tổng doanh thu tour đã thanh toán', 'selling')
ON CONFLICT (id) DO NOTHING;

-- 4. NẠP KHÁCH HÀNG CRM (customers)
INSERT INTO customers (id, name, phone, email, customer_type, company_name, company_tax_code, ctv_id, assigned_sale_id, source, retention_status, next_care_date) VALUES
('KH-001', 'Nguyễn Thị Mai Linh', '0908123456', 'mailinh@gmail.com', 'DOAN', 'Nhóm bạn Mai Linh', NULL, 'CTV-001', 'sale01', 'CTV Giới thiệu', 'COMPLETED', CURRENT_DATE + INTERVAL '30 days'),
('KH-002', 'Trần Bảo Nam', '0912345678', 'baonam@gmail.com', 'LE', NULL, NULL, NULL, 'sale01', 'TikTok HaHa Eco', 'NORMAL', CURRENT_DATE + INTERVAL '7 days'),
('KH-003', 'Lê Hoàng Phúc', '0987654321', 'hoangphuc@gmail.com', 'DOAN', 'Gia đình Hoàng Phúc', NULL, 'CTV-002', 'sale02', 'CTV Giới thiệu', 'NORMAL', CURRENT_DATE + INTERVAL '14 days'),
('KH-004', 'Phạm Thúy Hằng', '0933221100', 'thuyhang@fpt.com', 'DOANH_NGHIEP', 'Công Ty Cổ Phần Công Nghệ FPT Software', '0101248141', 'CTV-001', 'sale01', 'CTV Giới thiệu', 'DUE_TODAY', CURRENT_DATE),
('KH-005', 'Vũ Tuấn Kiệt', '0977112233', 'tuankiet@greenfeed.vn', 'DOANH_NGHIEP', 'Công Ty TNHH GreenFeed Việt Nam', '0303123456', 'CTV-003', 'sale02', 'Doanh nghiệp B2B', 'OVERDUE', CURRENT_DATE - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- 5. NẠP NHÀ CUNG CẤP DỊCH VỤ (suppliers)
INSERT INTO suppliers (id, name, service_type, phone, email, contact_person, bank_account, bank_name, address, rating) VALUES
('NCC-001', 'Khách sạn Sinh Thái Nam Cát Tiên (Ecolodge)', 'HOTEL', '02513668899', 'cattien@ecolodge.vn', 'Anh Nam (Quản lý)', '1234567890', 'Vietcombank', 'Xã Nam Cát Tiên, Huyện Tân Phú, Đồng Nai', 4.8),
('NCC-002', 'Nhà Xe Du Lịch Xanh Sài Gòn (Green Trans)', 'TRANSPORT', '02838991122', 'greentrans@saigon.vn', 'Bác Tài Hùng', '9876543210', 'Techcombank', 'Quận 1, TP. Hồ Chí Minh', 5.0),
('NCC-003', 'Nhà Hàng Cơm Quê Sinh Thái Bến Tre', 'RESTAURANT', '02753889900', 'comque@bentre.vn', 'Chị Út Ba', '5566778899', 'Agribank', 'Châu Thành, Bến Tre', 4.7),
('NCC-004', 'Homestay Rừng & Suối Đà Lạt (Glamping)', 'HOTEL', '02633887766', 'dalat@glamping.vn', 'Tuấn Anh', '3344556677', 'MBBank', 'Tuyền Lâm, TP. Đà Lạt', 4.9)
ON CONFLICT (id) DO NOTHING;

-- 6. NẠP ĐƠN TOUR MẪU (bookings)
INSERT INTO bookings (id, code, customer_id, tour_id, ctv_id, sale_id, pax_count, total_amount, paid_amount, actual_cost, departure_date, return_date, status) VALUES
('DH-201', 'DH-201', 'KH-001', 'TOUR-01', 'CTV-001', 'sale01', 4, 9600000, 9600000, 6200000, '2026-10-15', '2026-10-16', 'HOAN_THANH'),
('DH-203', 'DH-203', 'KH-003', 'TOUR-03', 'CTV-002', 'sale02', 4, 7800000, 4000000, 5000000, '2026-11-20', '2026-11-21', 'DA_COC'),
('DH-204', 'DH-204', 'KH-004', 'TOUR-04', 'CTV-001', 'sale01', 12, 55800000, 20000000, 37200000, '2026-11-28', '2026-12-01', 'DA_COC')
ON CONFLICT (id) DO NOTHING;

-- 7. NẠP HOA HỒNG CTV (commissions)
INSERT INTO commissions (id, booking_id, ctv_id, policy_applied, gross_amount, pit_tax_amount, net_amount, status, paid_at) VALUES
('HH-001', 'DH-201', 'CTV-001', '7% Doanh thu (Tour Cát Tiên 2N1Đ)', 672000, 0, 672000, 'DA_CHI_TRA', '2026-10-18 10:30:00+07')
ON CONFLICT (id) DO NOTHING;

-- 8. NẠP PHIẾU THU SỔ QUỸ (payments)
INSERT INTO payments (id, booking_id, type, category, amount, payment_method, bank_ref, created_by, approved_by) VALUES
('PT-001', 'DH-201', 'RECEIPT', 'Thu tiền cọc khách hàng 100%', 9600000, 'TRANSFER', 'VCB-98712345', 'sale01', 'ketoan'),
('PT-002', 'DH-203', 'RECEIPT', 'Thu cọc 50% tour Miền Tây', 4000000, 'TRANSFER', 'TCB-56789123', 'sale02', 'ketoan'),
('PT-003', 'DH-204', 'RECEIPT', 'Thu cọc đoàn FPT Tây Bắc', 20000000, 'TRANSFER', 'MB-12345678', 'sale01', 'ketoan')
ON CONFLICT (id) DO NOTHING;

-- 9. NẠP HÓA ĐƠN GTGT DU LỊCH TT 219 (invoices)
INSERT INTO invoices (id, booking_id, invoice_no, serial, customer_name, customer_tax_code, total_package_revenue, deductible_outside_cost, taxable_vat_amount, vat_rate, vat_amount, grand_total, cqt_code, signed_by, status) VALUES
('INV-001', 'DH-201', '00000001', '1C26TAA', 'Nguyễn Thị Mai Linh', '0317899888', 9600000, 6200000, 3400000, 10, 340000, 9940000, '00-26-1C26TAA-00000001-A1B2C3', 'CÔNG TY TNHH HAHA ECO TRAVEL', 'CQT_ISSUED')
ON CONFLICT (id) DO NOTHING;
