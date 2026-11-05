-- ==============================================================================
-- HAHA ECO TRAVEL OPERATING SYSTEM - SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- Phiên bản: 2.0 (Chuẩn Doanh nghiệp Lữ hành & Tuân thủ Luật Thuế Việt Nam)
-- Thiết kế: 17 Bảng dữ liệu chuẩn 3NF, Khóa ngoại ACID, Triggers, RLS, Realtime
-- ==============================================================================

-- 1. BẬT CÁC EXTENSION CẦN THIẾT
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. HÀM DÙNG CHUNG: CẬP NHẬT THỜI GIAN TỰ ĐỘNG (updated_at)
-- ==============================================================================
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. BẢNG 1: NGƯỜI DÙNG HỆ THỐNG & PHÂN QUYỀN (app_users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS app_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('CEO', 'SALE', 'OPS', 'KE_TOAN', 'CTV', 'SUPPLIER')),
    role_title VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_app_users_updated_at
BEFORE UPDATE ON app_users
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ==============================================================================
-- 4. BẢNG 2: MẠNG LƯỚI ĐỐI TÁC CỘNG TÁC VIÊN (ctvs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS ctvs (
    id VARCHAR(20) PRIMARY KEY, -- 'CTV-001'
    user_id UUID REFERENCES app_users(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    bank_name VARCHAR(50),
    bank_account VARCHAR(30),
    tax_code VARCHAR(20),
    id_card VARCHAR(20),
    location VARCHAR(100),
    assigned_sale_id VARCHAR(50),
    rating VARCHAR(20) DEFAULT 'GOOD' CHECK (rating IN ('EXCELLENT', 'GOOD', 'LOW', 'DORMANT', 'TERMINATED')),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DORMANT', 'TERMINATED')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_ctvs_updated_at
BEFORE UPDATE ON ctvs
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ==============================================================================
-- 5. BẢNG 3: QUẢN LÝ KHÁCH HÀNG CRM & BẢO MẬT DLP (customers)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(20) PRIMARY KEY, -- 'KH-001'
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    customer_type VARCHAR(20) NOT NULL CHECK (customer_type IN ('DOAN', 'DOANH_NGHIEP', 'LE')),
    company_name VARCHAR(150),
    company_tax_code VARCHAR(20),
    address TEXT,
    ctv_id VARCHAR(20) REFERENCES ctvs(id) ON DELETE SET NULL,
    assigned_sale_id VARCHAR(50),
    source VARCHAR(50) DEFAULT 'DIRECT',
    retention_status VARCHAR(20) DEFAULT 'NORMAL',
    next_care_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_type ON customers(customer_type);
CREATE INDEX IF NOT EXISTS idx_customers_sale ON customers(assigned_sale_id);
CREATE INDEX IF NOT EXISTS idx_customers_ctv ON customers(ctv_id);

CREATE TRIGGER trg_customers_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ==============================================================================
-- 6. BẢNG 4: NGÂN HÀNG SẢN PHẨM TOUR & HOA HỒNG GỐC (tours)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tours (
    id VARCHAR(20) PRIMARY KEY, -- 'TOUR-01'
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    keyword VARCHAR(50),
    duration VARCHAR(20) NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    estimated_cost NUMERIC(12, 2) NOT NULL CHECK (estimated_cost >= 0),
    max_pax INT DEFAULT 30 CHECK (max_pax > 0),
    commission_method VARCHAR(30) NOT NULL CHECK (commission_method IN ('PERCENT_REVENUE', 'FIXED_PER_PAX', 'PERCENT_PROFIT')),
    commission_rate NUMERIC(5, 2) DEFAULT 0,
    commission_fixed NUMERIC(12, 2) DEFAULT 0,
    condition TEXT,
    formula_text TEXT,
    itinerary_json JSONB,
    status VARCHAR(20) DEFAULT 'selling' CHECK (status IN ('selling', 'paused', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_tours_updated_at
BEFORE UPDATE ON tours
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ==============================================================================
-- 7. BẢNG 5: BÁO GIÁ TOUR CHIẾT TÍNH (quotations)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS quotations (
    id VARCHAR(30) PRIMARY KEY, -- 'BG-101'
    customer_id VARCHAR(20) REFERENCES customers(id) ON DELETE RESTRICT,
    tour_id VARCHAR(20) REFERENCES tours(id) ON DELETE RESTRICT,
    sale_id VARCHAR(50),
    ctv_id VARCHAR(20) REFERENCES ctvs(id) ON DELETE SET NULL,
    pax_count INT NOT NULL CHECK (pax_count > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    estimated_cost NUMERIC(12, 2) DEFAULT 0,
    departure_date DATE,
    valid_until DATE,
    custom_services JSONB,
    status VARCHAR(20) DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'CONFIRMED', 'CONVERTED', 'REJECTED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_quotations_updated_at
BEFORE UPDATE ON quotations
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ==============================================================================
-- 8. BẢNG 6: ĐƠN TOUR CHÍNH THỨC (bookings)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(30) PRIMARY KEY, -- 'DH-201'
    code VARCHAR(30) UNIQUE NOT NULL,
    quotation_id VARCHAR(30) REFERENCES quotations(id) ON DELETE SET NULL,
    customer_id VARCHAR(20) REFERENCES customers(id) ON DELETE RESTRICT NOT NULL,
    tour_id VARCHAR(20) REFERENCES tours(id) ON DELETE RESTRICT NOT NULL,
    ctv_id VARCHAR(20) REFERENCES ctvs(id) ON DELETE SET NULL,
    sale_id VARCHAR(50),
    pax_count INT NOT NULL CHECK (pax_count > 0),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    paid_amount NUMERIC(12, 2) DEFAULT 0 CHECK (paid_amount >= 0),
    actual_cost NUMERIC(12, 2) DEFAULT 0,
    departure_date DATE NOT NULL,
    return_date DATE,
    tour_guide_name VARCHAR(100),
    tour_guide_phone VARCHAR(20),
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    vehicle_plate VARCHAR(20),
    special_requests TEXT,
    status VARCHAR(30) DEFAULT 'CHO_COC' CHECK (status IN ('CHO_COC', 'DA_COC', 'DANG_CHAY', 'HOAN_THANH', 'DA_HUY')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings(code);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_departure ON bookings(departure_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

CREATE TRIGGER trg_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ==============================================================================
-- 9. BẢNG 7: DANH SÁCH HÀNH KHÁCH THEO ĐOÀN (booking_passengers)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS booking_passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id VARCHAR(30) REFERENCES bookings(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Nam', 'Nữ', 'Khác')),
    birth_year INT,
    id_card VARCHAR(20),
    phone VARCHAR(20),
    room_preference VARCHAR(50),
    dietary_notes TEXT, -- Ăn chay, dị ứng hải sản...
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_passengers_booking ON booking_passengers(booking_id);

-- ==============================================================================
-- 10. BẢNG 8: DANH BẠ NHÀ CUNG CẤP DỊCH VỤ (suppliers)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS suppliers (
    id VARCHAR(20) PRIMARY KEY, -- 'NCC-01'
    name VARCHAR(150) NOT NULL,
    service_type VARCHAR(30) NOT NULL CHECK (service_type IN ('HOTEL', 'TRANSPORT', 'RESTAURANT', 'GUIDE', 'TICKET', 'OTHER')),
    phone VARCHAR(20),
    email VARCHAR(100),
    contact_person VARCHAR(100),
    bank_account VARCHAR(30),
    bank_name VARCHAR(50),
    address TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_suppliers_updated_at
BEFORE UPDATE ON suppliers
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ==============================================================================
-- 11. BẢNG 9: LỆNH ĐẶT DỊCH VỤ NCC & VOUCHER (supplier_bookings)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS supplier_bookings (
    id VARCHAR(30) PRIMARY KEY, -- 'SB-001'
    booking_id VARCHAR(30) REFERENCES bookings(id) ON DELETE CASCADE,
    supplier_id VARCHAR(20) REFERENCES suppliers(id) ON DELETE RESTRICT,
    service_details TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    voucher_code VARCHAR(50),
    issued_date DATE DEFAULT CURRENT_DATE,
    confirmed_at TIMESTAMPTZ,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'PAID', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_supplier_bookings_updated_at
BEFORE UPDATE ON supplier_bookings
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ==============================================================================
-- 12. BẢNG 10: SỔ QUỸ THU CHI (payments)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(30) PRIMARY KEY, -- 'PT-001'
    booking_id VARCHAR(30) REFERENCES bookings(id) ON DELETE SET NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('RECEIPT', 'EXPENSE')), -- Thu / Chi
    category VARCHAR(50) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(20) DEFAULT 'TRANSFER' CHECK (payment_method IN ('TRANSFER', 'CASH', 'CARD')),
    bank_ref VARCHAR(100),
    created_by VARCHAR(50) NOT NULL,
    approved_by VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_type ON payments(type);

-- Tự động cập nhật paid_amount trên bảng bookings khi có phiếu thu mới
CREATE OR REPLACE FUNCTION update_booking_paid_amount()
RETURNS TRIGGER AS $$
BEGIN
    IF (NEW.booking_id IS NOT NULL AND NEW.type = 'RECEIPT') THEN
        UPDATE bookings
        SET paid_amount = (
            SELECT COALESCE(SUM(amount), 0)
            FROM payments
            WHERE booking_id = NEW.booking_id AND type = 'RECEIPT'
        )
        WHERE id = NEW.booking_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_paid_amount
AFTER INSERT OR UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_booking_paid_amount();

-- ==============================================================================
-- 13. BẢNG 11: ĐỐI SOÁT & HOA HỒNG CTV (commissions)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS commissions (
    id VARCHAR(30) PRIMARY KEY, -- 'HH-001'
    booking_id VARCHAR(30) REFERENCES bookings(id) ON DELETE CASCADE UNIQUE,
    ctv_id VARCHAR(20) REFERENCES ctvs(id) ON DELETE RESTRICT NOT NULL,
    policy_applied TEXT NOT NULL,
    gross_amount NUMERIC(12, 2) NOT NULL CHECK (gross_amount >= 0),
    pit_tax_amount NUMERIC(12, 2) DEFAULT 0 CHECK (pit_tax_amount >= 0),
    net_amount NUMERIC(12, 2) NOT NULL CHECK (net_amount >= 0),
    status VARCHAR(30) DEFAULT 'CHO_DUYET' CHECK (status IN ('CHO_DUYET', 'DA_DUYET', 'DA_CHI_TRA', 'DA_HUY')),
    approved_by VARCHAR(50),
    paid_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER trg_commissions_updated_at
BEFORE UPDATE ON commissions
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();

-- ==============================================================================
-- 14. BẢNG 12: HÓA ĐƠN ĐIỆN TỬ GTGT DU LỊCH (invoices - TT 219 & NĐ 123)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS invoices (
    id VARCHAR(30) PRIMARY KEY,
    booking_id VARCHAR(30) REFERENCES bookings(id) ON DELETE SET NULL,
    invoice_no VARCHAR(20) NOT NULL,
    serial VARCHAR(10) DEFAULT '1C26TAA',
    issue_date DATE DEFAULT CURRENT_DATE,
    customer_name VARCHAR(150) NOT NULL,
    customer_tax_code VARCHAR(20),
    customer_address TEXT,
    customer_email VARCHAR(100),
    service_name TEXT NOT NULL,
    total_package_revenue NUMERIC(12, 2) NOT NULL CHECK (total_package_revenue >= 0),
    deductible_outside_cost NUMERIC(12, 2) NOT NULL CHECK (deductible_outside_cost >= 0),
    taxable_vat_amount NUMERIC(12, 2) NOT NULL CHECK (taxable_vat_amount >= 0),
    vat_rate NUMERIC(5, 2) DEFAULT 10,
    vat_amount NUMERIC(12, 2) NOT NULL CHECK (vat_amount >= 0),
    grand_total NUMERIC(12, 2) NOT NULL CHECK (grand_total >= 0),
    cqt_code VARCHAR(100),
    signed_by VARCHAR(100),
    signed_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'CQT_ISSUED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 15. BẢNG 13: CHỨNG TỪ KHẤU TRỪ THUẾ TNCN CTV (tax_receipts - TT 111)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS tax_receipts (
    id VARCHAR(30) PRIMARY KEY,
    commission_id VARCHAR(30) REFERENCES commissions(id) ON DELETE SET NULL,
    receipt_no VARCHAR(20) NOT NULL,
    serial VARCHAR(10) DEFAULT '1C26TCN',
    issue_date DATE DEFAULT CURRENT_DATE,
    ctv_name VARCHAR(100) NOT NULL,
    ctv_tax_code VARCHAR(20) NOT NULL,
    ctv_address TEXT,
    income_type VARCHAR(150) DEFAULT 'Thù lao, hoa hồng môi giới du lịch sinh thái',
    gross_income NUMERIC(12, 2) NOT NULL CHECK (gross_income >= 0),
    tax_rate NUMERIC(5, 2) DEFAULT 10,
    withheld_tax_amount NUMERIC(12, 2) NOT NULL CHECK (withheld_tax_amount >= 0),
    net_paid_amount NUMERIC(12, 2) NOT NULL CHECK (net_paid_amount >= 0),
    cqt_verification_code VARCHAR(100),
    signed_by VARCHAR(100),
    signed_at TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'CQT_ISSUED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 16. BẢNG 14: SỔ NHẬT KÝ CHUNG KẾ TOÁN (journal_entries - TT 200/133)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS journal_entries (
    id VARCHAR(30) PRIMARY KEY,
    voucher_no VARCHAR(30) NOT NULL,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    debit_account VARCHAR(10) NOT NULL,
    credit_account VARCHAR(10) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    booking_id VARCHAR(30) REFERENCES bookings(id) ON DELETE SET NULL,
    counterparty VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 17. BẢNG 15: NHẬT KÝ KIỂM TOÁN HỆ THỐNG & AN NINH (audit_logs)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id VARCHAR(50) NOT NULL,
    actor_name VARCHAR(100) NOT NULL,
    actor_role VARCHAR(20) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    target_resource VARCHAR(100),
    description TEXT NOT NULL,
    ip_address VARCHAR(50),
    device_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_logs(action_type);

-- ==============================================================================
-- 18. BẢNG 16: TIN NHẮN HỖ TRỢ CTV & KINH DOANH (ctv_support_messages)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS ctv_support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ctv_id VARCHAR(20) REFERENCES ctvs(id) ON DELETE CASCADE,
    sale_id VARCHAR(50),
    sender_type VARCHAR(10) CHECK (sender_type IN ('CTV', 'SALE')),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 19. BẢNG 17: THÔNG BÁO NỘI BỘ (notifications)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id UUID REFERENCES app_users(id) ON DELETE CASCADE,
    recipient_role VARCHAR(20),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_role ON notifications(recipient_role, is_read);

-- ==============================================================================
-- 20. BẬT SUPABASE REALTIME CHO CÁC BẢNG TRỌNG YẾU (ĐỒNG BỘ 5G/WIFI)
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
ALTER PUBLICATION supabase_realtime ADD TABLE customers;
ALTER PUBLICATION supabase_realtime ADD TABLE commissions;
ALTER PUBLICATION supabase_realtime ADD TABLE supplier_bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ==============================================================================
-- 21. BẢO MẬT CẤP HÀNG ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ctv_support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy 1: Giám đốc (CEO) có quyền xem và xử lý toàn bộ bảng
CREATE POLICY ceo_full_access_customers ON customers FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'CEO');
CREATE POLICY ceo_full_access_bookings ON bookings FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'CEO');
CREATE POLICY ceo_full_access_payments ON payments FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'CEO');
CREATE POLICY ceo_full_access_commissions ON commissions FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'CEO');
CREATE POLICY ceo_full_access_suppliers ON suppliers FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'CEO');

-- Policy 2: Nhân viên Kinh doanh (SALE) chỉ thấy khách và báo giá của mình
CREATE POLICY sale_view_assigned_customers ON customers FOR SELECT TO authenticated
USING (
    auth.jwt() ->> 'role' = 'SALE' AND assigned_sale_id = (SELECT username FROM app_users WHERE auth_user_id = auth.uid())
);

-- Policy 3: Điều hành (OPS) chỉ xem lịch trình, danh sách đoàn và lệnh NCC
CREATE POLICY ops_view_bookings ON bookings FOR SELECT TO authenticated USING (auth.jwt() ->> 'role' = 'OPS');
CREATE POLICY ops_view_passengers ON booking_passengers FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'OPS');
CREATE POLICY ops_manage_supplier_bookings ON supplier_bookings FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'OPS');

-- Policy 4: Kế toán (KE_TOAN) toàn quyền thu chi, hóa đơn, thuế và đối soát hoa hồng
CREATE POLICY ketoan_manage_payments ON payments FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'KE_TOAN');
CREATE POLICY ketoan_manage_commissions ON commissions FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'KE_TOAN');
CREATE POLICY ketoan_manage_invoices ON invoices FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'KE_TOAN');
CREATE POLICY ketoan_manage_tax_receipts ON tax_receipts FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'KE_TOAN');
CREATE POLICY ketoan_manage_journal ON journal_entries FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'KE_TOAN');

-- Policy 5: CTV chỉ xem được hoa hồng và booking do mình giới thiệu
CREATE POLICY ctv_view_own_commissions ON commissions FOR SELECT TO authenticated
USING (
    auth.jwt() ->> 'role' = 'CTV' AND ctv_id = (SELECT id FROM ctvs WHERE user_id = (SELECT id FROM app_users WHERE auth_user_id = auth.uid()))
);
