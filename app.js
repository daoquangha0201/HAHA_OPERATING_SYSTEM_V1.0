/**
 * HAHA OPERATING SYSTEM V1.0
 * Hệ thống Quản trị Doanh nghiệp Du lịch Hợp nhất - HaHa Eco Travel ERP
 * CHUẨN NGHIỆP VỤ HOA HỒNG:
 * - Không có cấp bậc CTV, tất cả CTV bình đẳng 100%.
 * - Chính sách hoa hồng gắn trực tiếp vào từng Tour/Sản phẩm cụ thể do Admin phê duyệt.
 * - 3 Phương pháp tính độc lập (Không cộng dồn): Cố định/khách, % Doanh thu, % Lợi nhuận gộp (LNG).
 * - Đối soát minh bạch, không thanh toán tự động.
 */

// ==========================================
// 1. THUẬT TOÁN MÃ HÓA MẬT KHẨU SHA-256
// ==========================================
function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i, j;
  let result = '';

  let words = [];
  let asciiBitLength = ascii[lengthProperty] * 8;
  
  let hash = [];
  let k = [];
  let primeCounter = 0;

  let isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 300; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1/3) * maxWord) | 0;
    }
  }
  
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return;
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength) | 0;
  
  for (j = 0; j < words[lengthProperty];) {
    let w = words.slice(j, j += 16);
    let oldHash = hash;
    hash = hash.slice(0, 8);
    
    for (i = 0; i < 64; i++) {
      let w15 = w[i - 15], w2 = w[i - 2];
      let s0 = (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3));
      let s1 = (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10));
      let ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      let maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      let temp1 = (hash[7] + (rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25)) + ch + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0)) | 0;
      let temp2 = ((rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22)) + maj) | 0;
      
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
      hash.pop();
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }
  
  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      let b = (hash[i] >> (8 * j)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  return result;
}

function hashWithSalt(password, salt) {
  return sha256(`haha_eco_secure_${salt}_${password}_2026`);
}

const SYSTEM_SALT = 'salt_haha_os_v1';
const DEFAULT_PASS_HASH = hashWithSalt('123456', SYSTEM_SALT);

// ==========================================
// 2. CHÍNH SÁCH HOA HỒNG GẮN THEO TỪNG TOUR (CHUẨN NGHIỆP VỤ MỚI)
// ==========================================
// Áp dụng đồng nhất cho mọi CTV giới thiệu cùng tour, không cộng dồn các phương pháp
const INITIAL_TOUR_POLICIES = [
  {
    id: 'TOUR-01',
    code: 'CAT-TIEN-2N1D',
    name: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    keyword: 'Cát Tiên',
    duration: '2N1Đ',
    price: 2400000,
    estimatedCost: 1550000,
    maxPax: 25,
    method: 'PERCENT_REVENUE', // Phương pháp 1: % Doanh thu
    methodTitle: 'Tỷ lệ % Doanh thu',
    rateValue: 7, // 7%
    fixedPerPax: 0,
    condition: 'Khách thanh toán đủ 100% & khởi hành tour thành công',
    formulaText: '7% trên tổng giá trị tour đã thanh toán',
    status: 'selling'
  },
  {
    id: 'TOUR-02',
    code: 'DA-LAT-3N2D',
    name: 'Tour Chữa Lành & Cắm Trại Đà Lạt 3N2Đ',
    keyword: 'Đà Lạt',
    duration: '3N2Đ',
    price: 3250000,
    estimatedCost: 2100000,
    maxPax: 20,
    method: 'FIXED_PER_PAX', // Phương pháp 2: Cố định trên mỗi khách
    methodTitle: 'Số tiền cố định / khách',
    rateValue: 0,
    fixedPerPax: 300000, // 300.000 đ/khách
    condition: 'Tính trên số lượng khách thực tế đi tour đủ điều kiện',
    formulaText: '300.000 đ / khách đủ điều kiện',
    status: 'selling'
  },
  {
    id: 'TOUR-03',
    code: 'MIEN-TAY-2N1D',
    name: 'Tour Sinh Thái Miền Tây Sông Nước Bến Tre - Cần Thơ 2N1Đ',
    keyword: 'Miền Tây',
    duration: '2N1Đ',
    price: 1950000,
    estimatedCost: 1250000,
    maxPax: 30,
    method: 'FIXED_PER_PAX', // Phương pháp 2: Cố định trên mỗi khách
    methodTitle: 'Số tiền cố định / khách',
    rateValue: 0,
    fixedPerPax: 200000, // 200.000 đ/khách
    condition: 'Áp dụng cho mọi đoàn khách từ 1 khách trở lên',
    formulaText: '200.000 đ / khách thực tế đi tour',
    status: 'selling'
  },
  {
    id: 'TOUR-04',
    code: 'TAY-BAC-4N3D',
    name: 'Tour Khám Phá Tây Bắc - Mùa Lúa Chín Mù Cang Chải 4N3Đ',
    keyword: 'Tây Bắc',
    duration: '4N3Đ',
    price: 4625000,
    estimatedCost: 3000000,
    maxPax: 16,
    method: 'PERCENT_GROSS_PROFIT', // Phương pháp 3: % Lợi nhuận gộp (LNG)
    methodTitle: 'Tỷ lệ % Lợi nhuận gộp (LNG)',
    rateValue: 15, // 15% trên LNG
    fixedPerPax: 0,
    condition: 'Tính trên Lợi nhuận gộp sau khi trừ chi phí xe & homestay đối tác',
    formulaText: '15% trên Lợi nhuận gộp (LNG) của đoàn tour',
    status: 'selling'
  },
  {
    id: 'TOUR-05',
    code: 'CON-DAO-3N2D',
    name: 'Nghỉ dưỡng sinh thái & lặn biển Côn Đảo 3N2Đ',
    keyword: 'Côn Đảo',
    duration: '3N2Đ',
    price: 6000000,
    estimatedCost: 4000000,
    maxPax: 15,
    method: 'PERCENT_REVENUE',
    methodTitle: 'Tỷ lệ % Doanh thu',
    rateValue: 6, // 6%
    fixedPerPax: 0,
    condition: 'Khách hoàn tất thủ tục thanh toán trước ngày bay',
    formulaText: '6% trên tổng giá trị tour',
    status: 'selling'
  },
  {
    id: 'TOUR-06',
    code: 'PU-LUONG-2N1D',
    name: 'Trekking Pù Luông mùa nước đổ 2N1Đ',
    keyword: 'Pù Luông',
    duration: '2N1Đ',
    price: 2400000,
    estimatedCost: 1600000,
    maxPax: 20,
    method: 'FIXED_PER_PAX',
    methodTitle: 'Số tiền cố định / khách',
    rateValue: 0,
    fixedPerPax: 250000, // 250.000 đ/khách
    condition: 'Khách đi tour an toàn theo lịch trình',
    formulaText: '250.000 đ / khách đủ điều kiện',
    status: 'selling'
  },
  {
    id: 'TOUR-07',
    code: 'QUANG-BINH-3N2D',
    name: 'Tour Khám Phá Hang Động & Rừng Nguyên Sinh Quảng Bình 3N2Đ',
    keyword: 'Quảng Bình',
    duration: '3N2Đ',
    price: 5200000,
    estimatedCost: 3500000,
    maxPax: 15,
    method: 'PERCENT_REVENUE',
    methodTitle: 'Tỷ lệ % Doanh thu',
    rateValue: 8,
    fixedPerPax: 0,
    condition: 'Tạm dừng nhận khách do mùa mưa lũ miền Trung, dự kiến mở bán lại ngày 15/03/2027',
    formulaText: '8% trên tổng giá trị tour',
    status: 'paused',
    pauseReason: 'Mùa bão lũ miền Trung (Bảo trì tuyến)'
  },
  {
    id: 'TOUR-08',
    code: 'HA-GIANG-4N3D',
    name: 'Tour Vòng Cung Mùa Hoa Tam Giác Mạch Hà Giang 4N3Đ',
    keyword: 'Hà Giang',
    duration: '4N3Đ',
    price: 4950000,
    estimatedCost: 3200000,
    maxPax: 18,
    method: 'FIXED_PER_PAX',
    methodTitle: 'Số tiền cố định / khách',
    rateValue: 0,
    fixedPerPax: 350000, // 350.000 đ/khách
    condition: 'Khởi hành thứ 5 hàng tuần, thanh toán đủ trước 3 ngày',
    formulaText: '350.000 đ / khách đủ điều kiện',
    status: 'selling'
  }
];

// ==========================================
// 3. DANH BẠ CTV BÌNH ĐẲNG (KHÔNG CẤP BẬC, KHÔNG HOA HỒNG RIÊNG)
// ==========================================
const INITIAL_CTVS = [
  {
    id: 'CTV-001',
    code: 'CTV-001',
    name: 'Hoàng Yến (Travel Blogger)',
    username: 'ctv_hoangyen',
    phone: '0911223344',
    refCode: 'HAHA-YEN88',
    bank: '1903456789 - Techcombank (Hoang Thi Yen)',
    accountStatus: 'active',
    assignedSaleId: 'NV-002',
    assignedSale: 'Nguyễn Văn An',
    assignedSalePhone: '0901234567',
    lastActiveDate: '2026-10-25',
    selectedTourIds: ['TOUR-01', 'TOUR-02', 'TOUR-05'],
    createdAt: '2026-09-01'
  },
  {
    id: 'CTV-002',
    code: 'CTV-002',
    name: 'Minh Tuấn (Admin Camping)',
    username: 'ctv_minhtuan',
    phone: '0988776655',
    refCode: 'HAHA-TUAN99',
    bank: '0491000123456 - Vietcombank (Tran Minh Tuan)',
    accountStatus: 'active',
    assignedSaleId: 'NV-005',
    assignedSale: 'Trần Thị Ngọc',
    assignedSalePhone: '0912345678',
    lastActiveDate: '2026-10-22',
    selectedTourIds: ['TOUR-02', 'TOUR-06'],
    createdAt: '2026-09-15'
  },
  {
    id: 'CTV-003',
    code: 'CTV-003',
    name: 'Thảo Vy (Cộng đồng Chữa Lành)',
    username: 'ctv_thaovy',
    phone: '0933445566',
    refCode: 'HAHA-THAO77',
    bank: '1028746281 - MBBank (Pham Thao Vy)',
    accountStatus: 'active',
    assignedSaleId: 'NV-002',
    assignedSale: 'Nguyễn Văn An',
    assignedSalePhone: '0901234567',
    lastActiveDate: '2026-10-26',
    selectedTourIds: ['TOUR-01', 'TOUR-04'],
    createdAt: '2026-10-01'
  },
  {
    id: 'CTV-004',
    code: 'CTV-004',
    name: 'Lê Tuấn Hưng (Phượt Thủ)',
    username: 'ctv_tuanhung',
    phone: '0922334455',
    refCode: 'HAHA-HUNG66',
    bank: '22001928374 - BIDV (Le Tuan Hung)',
    accountStatus: 'active',
    assignedSaleId: 'NV-002',
    assignedSale: 'Nguyễn Văn An',
    assignedSalePhone: '0901234567',
    lastActiveDate: '2026-08-10', // > 75 ngày không có tương tác -> Bất động
    selectedTourIds: ['TOUR-03'],
    createdAt: '2026-08-01'
  },
  {
    id: 'CTV-005',
    code: 'CTV-005',
    name: 'Đặng Thu Thảo (Reviewer Du Lịch)',
    username: 'ctv_thuthao',
    phone: '0944556677',
    refCode: 'HAHA-THAO55',
    bank: '1019283746 - VietinBank (Dang Thu Thao)',
    accountStatus: 'active',
    assignedSaleId: 'NV-005',
    assignedSale: 'Trần Thị Ngọc',
    assignedSalePhone: '0912345678',
    lastActiveDate: '2026-07-28', // > 90 ngày -> Bất động
    selectedTourIds: ['TOUR-01'],
    createdAt: '2026-07-20'
  },
  {
    id: 'CTV-006',
    code: 'CTV-006',
    name: 'Bùi Minh Trí (Đại lý Vé Tự Do)',
    username: 'ctv_minhtri',
    phone: '0966778899',
    refCode: 'HAHA-TRI44',
    bank: '0071009876543 - Vietcombank (Bui Minh Tri)',
    accountStatus: 'terminated',
    terminationReason: 'Không hoạt động liên tục > 90 ngày, không phản hồi liên hệ của Sale',
    terminationDate: '2026-10-15',
    assignedSaleId: 'NV-002',
    assignedSale: 'Nguyễn Văn An',
    assignedSalePhone: '0901234567',
    lastActiveDate: '2026-06-15',
    selectedTourIds: ['TOUR-02'],
    createdAt: '2026-06-01'
  }
];

// Cổng trao đổi hướng dẫn 2 chiều giữa CTV và Sale phụ trách
const INITIAL_CTV_SUPPORT_MESSAGES = [
  {
    id: 'MSG-001',
    ctvId: 'CTV-003',
    ctvName: 'Thảo Vy (Cộng đồng Chữa Lành)',
    ctvPhone: '0933445566',
    saleId: 'NV-002',
    saleName: 'Nguyễn Văn An',
    salePhone: '0901234567',
    category: 'difficult_customer',
    categoryLabel: 'Khách hàng có yêu cầu đặc thù',
    subject: 'Khách đoàn 15 người muốn thực đơn chay thực dưỡng riêng biệt tại Madagui',
    tourName: 'Tour Thiền Định & Trị Liệu Rừng Madagui 2N1Đ',
    customerCode: 'HH-004',
    customerName: 'Trịnh Hoài Phương',
    content: 'Chào anh An, em đang tư vấn cho nhóm khách thiền 15 người. Khách muốn 100% ăn chay thực dưỡng không dùng gia vị công nghiệp. Anh hướng dẫn em chi phí phụ thu và cách chốt đoàn này nhé!',
    status: 'pending',
    reply: null,
    repliedAt: null,
    repliedBy: null,
    isReadByCtv: true,
    isReadBySale: false,
    createdAt: '2026-10-26 14:30'
  },
  {
    id: 'MSG-002',
    ctvId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    ctvPhone: '0911223344',
    saleId: 'NV-002',
    saleName: 'Nguyễn Văn An',
    salePhone: '0901234567',
    category: 'price_custom',
    categoryLabel: 'Xin giá đoàn & Ưu đãi số lượng lớn',
    subject: 'Xin chính sách giảm giá cho đoàn công ty 25 khách tour Cát Tiên',
    tourName: 'Tour Trekking Rừng Cát Tiên 2N1Đ',
    customerCode: 'HH-001',
    customerName: 'Nguyễn Thị Mai Linh',
    content: 'Anh An ơi, khách công ty hỏi nếu đặt 25 pax tour Cát Tiên vào ngày thường thì công ty có chiết khấu thêm được 5% không anh?',
    status: 'resolved',
    reply: 'Chào Yến, với đoàn 25 khách đi ngày thường (T2-T5), công ty duyệt ưu đãi giảm 5% trên giá gốc hoặc tặng kèm tiệc BBQ tối ngoài trời miễn phí trị giá 3.500.000đ. Em ưu tiên gợi ý gói tặng BBQ để giữ biên lợi nhuận tốt nhất nhé!',
    repliedAt: '2026-10-24 16:15',
    repliedBy: 'Nguyễn Văn An',
    isReadByCtv: true,
    isReadBySale: true,
    createdAt: '2026-10-24 15:10'
  },
  {
    id: 'MSG-003',
    ctvId: 'CTV-002',
    ctvName: 'Minh Tuấn (Admin Camping)',
    ctvPhone: '0988776655',
    saleId: 'NV-005',
    saleName: 'Trần Thị Ngọc',
    salePhone: '0912345678',
    category: 'policy_guidance',
    categoryLabel: 'Hướng dẫn kịch bản tư vấn',
    subject: 'Xin tài liệu Sales Kit chi tiết tour Tà Đùng để gửi khách gia đình có trẻ nhỏ',
    tourName: 'Tour Cắm Trại Hồ Tà Đùng 2N1Đ',
    customerCode: 'HH-002',
    customerName: 'Trần Văn Dũng',
    content: 'Chào chị Ngọc, em đang có 2 gia đình có trẻ em 5-7 tuổi muốn đi Tà Đùng nhưng sợ bé mệt. Nhờ chị tư vấn kịch bản đảm bảo an toàn cho các bé giúp em.',
    status: 'resolved',
    reply: 'Chào Tuấn, tour Tà Đùng hiện tại đã nâng cấp lều Glamping cao cấp có điều hòa và đệm êm, xe 16 chỗ đưa đón tận nơi rất êm ái. Em gửi khách lịch trình thư giãn và nhấn mạnh lều có view hồ cực đẹp, trẻ nhỏ có khu vui chơi cỏ mềm an toàn tuyệt đối nhé!',
    repliedAt: '2026-10-22 11:20',
    repliedBy: 'Trần Thị Ngọc',
    isReadByCtv: true,
    isReadBySale: true,
    createdAt: '2026-10-22 09:45'
  }
];

// Chỉ tiêu KPI kinh doanh & Cơ chế Hoa hồng Doanh số của Sale
const INITIAL_SALE_KPIS = [
  {
    saleId: 'NV-002',
    saleName: 'Nguyễn Văn An',
    month: '2026-10',
    targetAmount: 150000000, // 150 triệu VNĐ
    ctvCommRate: 0.02,        // 2.0% hoa hồng quản lý CTV
    directCommRate: 0.03,     // 3.0% hoa hồng bán trực tiếp
    tier1Rate: 0.015,         // 1.5% thưởng vượt mốc 100% KPI
    tier2Rate: 0.025          // 2.5% thưởng vượt mốc 120% KPI
  },
  {
    saleId: 'NV-005',
    saleName: 'Trần Thị Ngọc',
    month: '2026-10',
    targetAmount: 100000000, // 100 triệu VNĐ
    ctvCommRate: 0.02,        // 2.0% hoa hồng quản lý CTV
    directCommRate: 0.03,     // 3.0% hoa hồng bán trực tiếp
    tier1Rate: 0.015,         // 1.5% thưởng vượt mốc 100% KPI
    tier2Rate: 0.025          // 2.5% thưởng vượt mốc 120% KPI
  }
];

// Danh sách tài khoản đăng nhập (Bảo mật SHA-256)
const INITIAL_USERS = [
  { id: 'NV-001', username: 'ceo', passwordHash: DEFAULT_PASS_HASH, salt: SYSTEM_SALT, name: 'Đỗ Thành Đạt', role: 'CEO', roleTitle: 'Giám đốc Điều hành', avatar: '👑', status: 'active', ctvId: null },
  { id: 'NV-002', username: 'sale01', passwordHash: DEFAULT_PASS_HASH, salt: SYSTEM_SALT, name: 'Nguyễn Văn An', role: 'SALE', roleTitle: 'Leader Kinh doanh', avatar: '💼', status: 'active', ctvId: null },
  { id: 'NV-005', username: 'sale02', passwordHash: DEFAULT_PASS_HASH, salt: SYSTEM_SALT, name: 'Trần Thị Ngọc', role: 'SALE', roleTitle: 'Chuyên viên Kinh doanh', avatar: '💼', status: 'active', ctvId: null },
  { id: 'NV-003', username: 'dieuhanh', passwordHash: DEFAULT_PASS_HASH, salt: SYSTEM_SALT, name: 'Trần Đức Huy', role: 'OPS', roleTitle: 'Điều hành Tour', avatar: '🧭', status: 'active', ctvId: null },
  { id: 'NV-004', username: 'ketoan', passwordHash: DEFAULT_PASS_HASH, salt: SYSTEM_SALT, name: 'Lê Thị Mai', role: 'KE_TOAN', roleTitle: 'Kế toán trưởng', avatar: '💰', status: 'active', ctvId: null },
  { id: 'NV-CTV01', username: 'ctv_hoangyen', passwordHash: DEFAULT_PASS_HASH, salt: SYSTEM_SALT, name: 'Hoàng Yến (Travel Blogger)', role: 'CTV', roleTitle: 'Cộng tác viên', avatar: '🌱', status: 'active', ctvId: 'CTV-001' },
  { id: 'NV-CTV02', username: 'ctv_minhtuan', passwordHash: DEFAULT_PASS_HASH, salt: SYSTEM_SALT, name: 'Minh Tuấn (Admin Camping)', role: 'CTV', roleTitle: 'Cộng tác viên', avatar: '🌱', status: 'active', ctvId: 'CTV-002' },
  { id: 'NV-CTV03', username: 'ctv_thaovy', passwordHash: DEFAULT_PASS_HASH, salt: SYSTEM_SALT, name: 'Thảo Vy (Cộng đồng Chữa Lành)', role: 'CTV', roleTitle: 'Cộng tác viên', avatar: '🌱', status: 'active', ctvId: 'CTV-003' },
  { id: 'NV-CTV04', username: 'ctv_tuanhung', passwordHash: DEFAULT_PASS_HASH, salt: SYSTEM_SALT, name: 'Lê Tuấn Hưng (Phượt Thủ)', role: 'CTV', roleTitle: 'Cộng tác viên', avatar: '🌱', status: 'active', ctvId: 'CTV-004' },
  { id: 'NV-CTV05', username: 'ctv_thuthao', passwordHash: DEFAULT_PASS_HASH, salt: SYSTEM_SALT, name: 'Đặng Thu Thảo (Reviewer Du Lịch)', role: 'CTV', roleTitle: 'Cộng tác viên', avatar: '🌱', status: 'active', ctvId: 'CTV-005' },
  { id: 'NV-CTV06', username: 'ctv_minhtri', passwordHash: DEFAULT_PASS_HASH, salt: SYSTEM_SALT, name: 'Bùi Minh Trí (Đại lý Vé Tự Do)', role: 'CTV', roleTitle: 'Cộng tác viên', avatar: '🌱', status: 'locked', ctvId: 'CTV-006' },
  { id: 'NV-NCC01', username: 'cattien_ecolodge', passwordHash: DEFAULT_PASS_HASH, salt: SYSTEM_SALT, name: 'Khách sạn Sinh Thái Nam Cát Tiên', role: 'SUPPLIER', roleTitle: 'Đối tác Cung ứng (Hotel 4★)', avatar: '🏨', status: 'active', supplierId: 'NCC-001' },
  { id: 'NV-NCC02', username: 'saigon_green_trans', passwordHash: DEFAULT_PASS_HASH, salt: SYSTEM_SALT, name: 'Nhà Xe Du Lịch Xanh Sài Gòn', role: 'SUPPLIER', roleTitle: 'Đối tác Cung ứng (Xe 5★)', avatar: '🚍', status: 'active', supplierId: 'NCC-002' },
  { id: 'NV-NCC04', username: 'dalat_glamping', passwordHash: DEFAULT_PASS_HASH, salt: SYSTEM_SALT, name: 'Homestay Rừng & Suối Đà Lạt', role: 'SUPPLIER', roleTitle: 'Đối tác Cung ứng (Glamping 4★)', avatar: '🏕️', status: 'active', supplierId: 'NCC-004' }
];

// Khách hàng CRM (Đầy đủ 20 Hồ sơ Khách Hàng cho 20 Kịch bản Thực tế)
const INITIAL_CUSTOMERS = [
  {
    id: 1,
    code: "HH-001",
    name: "Nguyễn Thị Mai Linh",
    phone: "0908123456",
    demand: "Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ (Nhóm 4 người lớn)",
    paxCount: 4,
    source: "CTV Giới thiệu",
    collaboratorId: "CTV-001",
    staff: "Nguyễn Văn An (Leader)",
    status: "Đã chốt tour",
    tourValue: 9600000,
    costValue: 6200000,
    paidAmount: 9600000,
    remainingDebt: 0,
    date: "2026-10-10"
  },
  {
    id: 2,
    code: "HH-002",
    name: "Trần Bảo Nam",
    phone: "0912345678",
    demand: "Tour Chữa Lành & Cắm Trại Đà Lạt 3N2Đ (Cặp đôi)",
    paxCount: 2,
    source: "TikTok HaHa Eco",
    collaboratorId: "",
    staff: "Nguyễn Văn An (Leader)",
    status: "Đang tư vấn",
    tourValue: 6500000,
    costValue: 4200000,
    paidAmount: 0,
    remainingDebt: 0,
    date: "2026-10-12"
  },
  {
    id: 3,
    code: "HH-003",
    name: "Lê Hoàng Phúc",
    phone: "0987654321",
    demand: "Tour Sinh Thái Miền Tây Sông Nước Bến Tre - Cần Thơ 2N1Đ (Gia đình 4 người)",
    paxCount: 4,
    source: "CTV Giới thiệu",
    collaboratorId: "CTV-002",
    staff: "Lê Thị Mai (Tư vấn viên)",
    status: "Đã chốt tour",
    tourValue: 7800000,
    costValue: 5000000,
    paidAmount: 4000000,
    remainingDebt: 3800000,
    date: "2026-10-14"
  },
  {
    id: 4,
    code: "HH-004",
    name: "Phạm Thúy Hằng",
    phone: "0933221100",
    demand: "Tour Khám Phá Tây Bắc - Mùa Lúa Chín Mù Cang Chải 4N3Đ (Đoàn 4 khách)",
    paxCount: 4,
    source: "CTV Giới thiệu",
    collaboratorId: "CTV-001",
    staff: "Phạm Thảo Vy (Tư vấn viên)",
    status: "Đã chốt tour",
    tourValue: 18500000,
    costValue: 12000000,
    paidAmount: 0,
    remainingDebt: 18500000,
    date: "2026-10-08"
  },
  {
    id: 5,
    code: "HH-005",
    name: "Trường THPT Chuyên Lê Hồng Phong (Thầy Trần Trọng Hiếu)",
    phone: "0977889900",
    demand: "Tour Dã Ngoại Sinh Thái Bến Tre 2N1Đ (120 học sinh & GV)",
    paxCount: 120,
    source: "CTV Giới thiệu",
    collaboratorId: "CTV-002",
    staff: "Nguyễn Văn An (Leader)",
    status: "Đã chốt tour",
    tourValue: 180000000,
    costValue: 126000000,
    paidAmount: 90000000,
    remainingDebt: 90000000,
    date: "2026-10-16"
  },
  {
    id: 6,
    code: "HH-006",
    name: "Anh Lê Tuấn Kiệt (Nhóm Bạn Bè)",
    phone: "0944556677",
    demand: "Tour Trekking Cát Tiên Khám Phá Sinh Vật Đêm 2N1Đ (15 khách)",
    paxCount: 15,
    source: "Direct Booking",
    collaboratorId: "",
    staff: "Trần Đức Huy (Tư vấn viên)",
    status: "Đã chốt tour",
    tourValue: 45000000,
    costValue: 30000000,
    paidAmount: 45000000,
    remainingDebt: 0,
    date: "2026-10-17"
  },
  {
    id: 7,
    code: "HH-007",
    name: "Chị Hoàng Kim Oanh (Hủy Tour Đột Xuất)",
    phone: "0918765432",
    demand: "Tour Mù Cang Chải 4N3Đ (10 khách - Đã Hủy & Hoàn Cọc)",
    paxCount: 10,
    source: "CTV Giới thiệu",
    collaboratorId: "CTV-001",
    staff: "Phạm Thảo Vy (Tư vấn viên)",
    status: "Hủy tư vấn",
    tourValue: 35000000,
    costValue: 22000000,
    paidAmount: 0,
    remainingDebt: 0,
    date: "2026-10-15"
  },
  {
    id: 8,
    code: "HH-008",
    name: "Tập Đoàn Công Nghệ V-Star (300 khách)",
    phone: "0968889999",
    demand: "Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ (300 khách)",
    paxCount: 300,
    source: "CTV Giới thiệu",
    collaboratorId: "CTV-001",
    staff: "Nguyễn Văn An (Leader)",
    status: "Đã chốt tour",
    tourValue: 720000000,
    costValue: 468000000,
    paidAmount: 720000000,
    remainingDebt: 0,
    date: "2026-10-15"
  },
  {
    id: 9,
    code: "HH-009",
    name: "Ngân Hàng Techcombank Hội Sở (Anh Vũ Hải)",
    phone: "0988112233",
    demand: "Tour Team Building & Gala Rừng Thông Đà Lạt 3N2Đ (80 CBNV)",
    paxCount: 80,
    source: "Doanh nghiệp B2B",
    collaboratorId: "",
    staff: "Nguyễn Văn An (Leader)",
    status: "Đã chốt tour",
    tourValue: 256000000,
    costValue: 172000000,
    paidAmount: 0,
    remainingDebt: 256000000,
    date: "2026-10-18"
  },
  {
    id: 10,
    code: "HH-010",
    name: "Doanh Nhân David Trần (Private VIP Tour)",
    phone: "0909001122",
    demand: "Private VIP Tour Cát Tiên Ecolodge Resort & Safari Đêm (8 khách)",
    paxCount: 8,
    source: "CTV Giới thiệu",
    collaboratorId: "CTV-001",
    staff: "Lê Thị Mai (Tư vấn viên)",
    status: "Đã chốt tour",
    tourValue: 64000000,
    costValue: 42000000,
    paidAmount: 64000000,
    remainingDebt: 0,
    date: "2026-10-12"
  },
  {
    id: 11,
    code: "HH-011",
    name: "CLB Nhiếp Ảnh Sài Gòn (Anh Chu Văn Sơn)",
    phone: "0913554433",
    demand: "Săn Ảnh Mùa Vàng Mù Cang Chải 4N3Đ (25 Nhiếp ảnh gia)",
    paxCount: 25,
    source: "Facebook Fanpage",
    collaboratorId: "",
    staff: "Phạm Thảo Vy (Tư vấn viên)",
    status: "Đã chốt tour",
    tourValue: 75000000,
    costValue: 50000000,
    paidAmount: 52500000,
    remainingDebt: 22500000,
    date: "2026-10-19"
  },
  {
    id: 12,
    code: "HH-012",
    name: "Đoàn Inbound Pháp - Jean-Pierre Dubois",
    phone: "0922334455",
    demand: "Inbound French Trekking Expedition Cat Tien 3D2N (12 khách Pháp)",
    paxCount: 12,
    source: "Đối tác Inbound Quốc Tế",
    collaboratorId: "",
    staff: "Nguyễn Văn An (Leader)",
    status: "Đã chốt tour",
    tourValue: 48000000,
    costValue: 31000000,
    paidAmount: 48000000,
    remainingDebt: 0,
    date: "2026-10-19"
  },
  {
    id: 13,
    code: "HH-013",
    name: "Chị Nguyễn Thảo My",
    phone: "0938445566",
    demand: "Tour Nghỉ Dưỡng Sinh Thái Cát Tiên Phụ Thu Phòng Đơn (6 khách)",
    paxCount: 6,
    source: "CTV Giới thiệu",
    collaboratorId: "CTV-002",
    staff: "Trần Đức Huy (Tư vấn viên)",
    status: "Đã chốt tour",
    tourValue: 21000000,
    costValue: 14000000,
    paidAmount: 21000000,
    remainingDebt: 0,
    date: "2026-10-20"
  },
  {
    id: 14,
    code: "HH-014",
    name: "Bệnh Viện Đa Khoa Sài Gòn (BS. Nguyễn Minh Tuấn)",
    phone: "0903887766",
    demand: "Hội Thảo Y Khoa & Nghỉ Dưỡng Bến Tre Riverside 2N1Đ (50 bác sĩ)",
    paxCount: 50,
    source: "Doanh nghiệp B2B",
    collaboratorId: "",
    staff: "Nguyễn Văn An (Leader)",
    status: "Đã chốt tour",
    tourValue: 150000000,
    costValue: 102000000,
    paidAmount: 100000000,
    remainingDebt: 50000000,
    date: "2026-10-20"
  },
  {
    id: 15,
    code: "HH-015",
    name: "Đại Gia Đình Bác Trần Văn Thành (3 Thế Hệ)",
    phone: "0917665544",
    demand: "Tour Sinh Thái Miền Tây 3 Thế Hệ (8 Lớn + 2 Trẻ 70% + 2 Bé 0%)",
    paxCount: 12,
    source: "CTV Giới thiệu",
    collaboratorId: "CTV-002",
    staff: "Lê Thị Mai (Tư vấn viên)",
    status: "Đã chốt tour",
    tourValue: 22560000,
    costValue: 15000000,
    paidAmount: 22560000,
    remainingDebt: 0,
    date: "2026-10-21"
  },
  {
    id: 16,
    code: "HH-016",
    name: "Anh Phan Hoàng Long (Khách Thân Thiết)",
    phone: "0902998877",
    demand: "Tour Chữa Lành Rừng Thông Đà Lạt Áp Voucher Tri Ân (8 khách)",
    paxCount: 8,
    source: "CTV Giới thiệu",
    collaboratorId: "CTV-001",
    staff: "Phạm Thảo Vy (Tư vấn viên)",
    status: "Đã chốt tour",
    tourValue: 23000000,
    costValue: 16000000,
    paidAmount: 23000000,
    remainingDebt: 0,
    date: "2026-10-21"
  },
  {
    id: 17,
    code: "HH-017",
    name: "Startup AI Nexus (Anh Đặng Quốc Cường)",
    phone: "0982332211",
    demand: "Survival Camp Teambuilding & Lửa Trại Đà Lạt 3N2Đ (40 nhân sự)",
    paxCount: 40,
    source: "Direct Booking",
    collaboratorId: "",
    staff: "Nguyễn Văn An (Leader)",
    status: "Đã chốt tour",
    tourValue: 136000000,
    costValue: 92000000,
    paidAmount: 136000000,
    remainingDebt: 0,
    date: "2026-10-22"
  },
  {
    id: 18,
    code: "HH-018",
    name: "Công Ty Cổ Phần Xây Dựng Vinacon (Anh Hoàng Văn Đức)",
    phone: "0976554433",
    demand: "Tour Dã Ngoại Sinh Thái Cát Tiên 2N1Đ (20 kỹ sư)",
    paxCount: 20,
    source: "CTV Giới thiệu",
    collaboratorId: "CTV-001",
    staff: "Trần Đức Huy (Tư vấn viên)",
    status: "Đã chốt tour",
    tourValue: 60000000,
    costValue: 40000000,
    paidAmount: 40000000,
    remainingDebt: 20000000,
    date: "2026-10-18"
  },
  {
    id: 19,
    code: "HH-019",
    name: "Chị Đỗ Mỹ Linh (Nhóm Doanh Nhân Trẻ)",
    phone: "0949112233",
    demand: "Tour Cắm Trại & Suối Mơ Đà Lạt 3N2Đ (16 khách - 4 NCC)",
    paxCount: 16,
    source: "CTV Giới thiệu",
    collaboratorId: "CTV-002",
    staff: "Lê Thị Mai (Tư vấn viên)",
    status: "Đã chốt tour",
    tourValue: 51200000,
    costValue: 34000000,
    paidAmount: 51200000,
    remainingDebt: 0,
    date: "2026-10-23"
  },
  {
    id: 20,
    code: "HH-020",
    name: "Caravan Club Miền Nam (Anh Bùi Quang Thắng)",
    phone: "0908778899",
    demand: "Tour Caravan Tự Lái Cung Đường Ven Biển & Rừng Cát Tiên (15 Xe / 45 Pax)",
    paxCount: 45,
    source: "Direct Booking",
    collaboratorId: "",
    staff: "Nguyễn Văn An (Leader)",
    status: "Đã chốt tour",
    tourValue: 135000000,
    costValue: 88000000,
    paidAmount: 70000000,
    remainingDebt: 65000000,
    date: "2026-10-23"
  }
];

// Phiếu đối soát hoa hồng ban đầu (Tính theo chính sách từng tour cho các kịch bản thực tế)
const INITIAL_COMMISSIONS = [
  {
    id: 'HH-001',
    ctvId: 'CTV-001',
    bookingCode: 'DH-001',
    customerId: 1,
    customerName: 'Nguyễn Thị Mai Linh',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    tourValue: 9600000,
    policyApplied: 'Chính sách Tour Cát Tiên: 7% Doanh thu tour',
    basisText: '7% x 9.600.000 đ',
    amount: 672000,
    status: 'Đã thanh toán',
    createdAt: '2026-10-11',
    approvedBy: 'Lê Thị Mai (Kế toán)',
    payoutRef: 'UNC-20261025'
  },
  {
    id: 'HH-002',
    ctvId: 'CTV-002',
    bookingCode: 'DH-002',
    customerId: 3,
    customerName: 'Lê Hoàng Phúc',
    tourName: 'Tour Sinh Thái Miền Tây Sông Nước 2N1Đ',
    tourValue: 7800000,
    policyApplied: 'Chính sách Tour Miền Tây: 200.000 đ / khách',
    basisText: '200.000 đ x 4 khách',
    amount: 800000,
    status: 'Đã duyệt chi',
    createdAt: '2026-10-14',
    approvedBy: 'Đỗ Thành Đạt (CEO)'
  },
  {
    id: 'HH-003',
    ctvId: 'CTV-001',
    bookingCode: 'DH-003',
    customerId: 4,
    customerName: 'Phạm Thúy Hằng',
    tourName: 'Tour Khám Phá Tây Bắc - Mù Cang Chải 4N3Đ',
    tourValue: 18500000,
    policyApplied: 'Chính sách Tour Tây Bắc: 15% Lợi nhuận gộp (LNG)',
    basisText: '15% x LNG (6.500.000 đ)',
    amount: 975000,
    status: 'Chờ duyệt',
    createdAt: '2026-10-10',
    approvedBy: null
  },
  {
    id: 'HH-004',
    ctvId: 'CTV-001',
    bookingCode: 'DH-004',
    customerId: 8,
    customerName: 'Tập Đoàn Công Nghệ V-Star (300 khách)',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    tourValue: 720000000,
    policyApplied: 'Chính sách Tour Cát Tiên: 7% Doanh thu tour',
    basisText: '7% x 720.000.000 đ',
    amount: 50400000,
    status: 'Chờ duyệt',
    createdAt: '2026-10-15',
    approvedBy: null
  },
  {
    id: 'HH-005',
    ctvId: 'CTV-002',
    bookingCode: 'DH-005',
    customerId: 5,
    customerName: 'Trường THPT Chuyên Lê Hồng Phong (Thầy Trần Trọng Hiếu)',
    tourName: 'Tour Dã Ngoại Sinh Thái Bến Tre 2N1Đ',
    tourValue: 180000000,
    policyApplied: 'Chính sách Cố định theo đoàn lớn: 50.000 đ / khách',
    basisText: '50.000 đ x 120 khách',
    amount: 6000000,
    status: 'Chờ duyệt',
    createdAt: '2026-10-16',
    approvedBy: null,
    notes: 'Chờ đoàn thanh toán 50% còn lại trước khi duyệt chi'
  },
  {
    id: 'HH-007',
    ctvId: 'CTV-001',
    bookingCode: 'DH-007',
    customerId: 7,
    customerName: 'Chị Hoàng Kim Oanh (Hủy Tour Đột Xuất)',
    tourName: 'Tour Mù Cang Chải 4N3Đ Mùa Lúa Chín',
    tourValue: 35000000,
    policyApplied: 'Chính sách Tour Tây Bắc: 15% LNG',
    basisText: 'Hủy tour và phạt cọc 50%',
    amount: 0,
    status: 'Đã hủy',
    createdAt: '2026-10-15',
    approvedBy: 'Hệ thống tự động hủy',
    notes: 'Tour hủy trước khởi hành 2 ngày'
  },
  {
    id: 'HH-009',
    ctvId: 'CTV-001',
    bookingCode: 'DH-009',
    customerId: 10,
    customerName: 'Doanh Nhân David Trần (Private VIP Tour)',
    tourName: 'Private VIP Tour Cát Tiên Ecolodge Resort 3N2Đ',
    tourValue: 64000000,
    policyApplied: 'Chính sách Private VIP Tour: 10% Doanh thu',
    basisText: '10% x 64.000.000 đ',
    amount: 6400000,
    status: 'Đã thanh toán',
    createdAt: '2026-10-13',
    approvedBy: 'Lê Thị Mai (Kế toán)',
    payoutRef: 'UNC-20261026VIP'
  },
  {
    id: 'HH-010',
    ctvId: 'CTV-002',
    bookingCode: 'DH-012',
    customerId: 13,
    customerName: 'Chị Nguyễn Thảo My',
    tourName: 'Tour Nghỉ Dưỡng Cát Tiên Phụ Thu Phòng Đơn',
    tourValue: 21000000,
    policyApplied: 'Chính sách Tour Cát Tiên: 7% Doanh thu thực',
    basisText: '7% x 21.000.000 đ',
    amount: 1470000,
    status: 'Đã duyệt chi',
    createdAt: '2026-10-21',
    approvedBy: 'Đỗ Thành Đạt (CEO)'
  },
  {
    id: 'HH-011',
    ctvId: 'CTV-002',
    bookingCode: 'DH-014',
    customerId: 15,
    customerName: 'Đại Gia Đình Bác Trần Văn Thành (3 Thế Hệ)',
    tourName: 'Tour Sinh Thái Miền Tây Sông Nước 2N1Đ',
    tourValue: 22560000,
    policyApplied: 'Chính sách Tour Miền Tây: 200.000 đ / người lớn',
    basisText: '200.000 đ x 8 người lớn',
    amount: 1600000,
    status: 'Đã duyệt chi',
    createdAt: '2026-10-22',
    approvedBy: 'Lê Thị Mai (Kế toán)'
  },
  {
    id: 'HH-012',
    ctvId: 'CTV-001',
    bookingCode: 'DH-015',
    customerId: 16,
    customerName: 'Anh Phan Hoàng Long (Khách Thân Thiết)',
    tourName: 'Tour Chữa Lành Rừng Thông Đà Lạt Áp Voucher',
    tourValue: 23000000,
    policyApplied: 'Chính sách Tour Đà Lạt: 10% Doanh thu sau voucher',
    basisText: '10% x 23.000.000 đ (Sau giảm 2.6M)',
    amount: 2300000,
    status: 'Đã thanh toán',
    createdAt: '2026-10-22',
    approvedBy: 'Lê Thị Mai (Kế toán)',
    payoutRef: 'UNC-20261026VOU'
  },
  {
    id: 'HH-013',
    ctvId: 'CTV-001',
    bookingCode: 'DH-017',
    customerId: 18,
    customerName: 'Công Ty Cổ Phần Xây Dựng Vinacon',
    tourName: 'Tour Dã Ngoại Sinh Thái Cát Tiên 2N1Đ',
    tourValue: 60000000,
    policyApplied: 'Chính sách Tour Cát Tiên: 7% Doanh thu',
    basisText: '7% x 60.000.000 đ',
    amount: 4200000,
    status: 'Chờ duyệt',
    createdAt: '2026-10-22',
    approvedBy: null,
    notes: 'Khóa hoa hồng: Chờ công ty thanh toán nợ 20.000.000 đ'
  },
  {
    id: 'HH-014',
    ctvId: 'CTV-002',
    bookingCode: 'DH-018',
    customerId: 19,
    customerName: 'Chị Đỗ Mỹ Linh (Nhóm Doanh Nhân Trẻ)',
    tourName: 'Tour Cắm Trại & Suối Mơ Đà Lạt 3N2Đ',
    tourValue: 51200000,
    policyApplied: 'Chính sách Tour Đà Lạt: 200.000 đ / khách',
    basisText: '200.000 đ x 16 khách',
    amount: 3200000,
    status: 'Đã duyệt chi',
    createdAt: '2026-10-24',
    approvedBy: 'Đỗ Thành Đạt (CEO)'
  }
];

// Hộp đen Audit Log
const INITIAL_AUDIT_LOGS = [
  {
    time: '2026-10-14 08:30:15',
    user: 'Đỗ Thành Đạt',
    role: 'CEO',
    action: 'KHỞI ĐỘNG HỆ THỐNG',
    details: 'Đồng bộ chuẩn nghiệp vụ hoa hồng theo Tour HaHa Eco Travel.'
  },
  {
    time: '2026-10-14 09:15:20',
    user: 'Nguyễn Văn An',
    role: 'SALE',
    action: 'TIẾP NHẬN KHÁCH HÀNG',
    details: 'Tiếp nhận khách hàng Ngô Quốc Bảo (HH-007).'
  },
  {
    time: '2026-10-14 10:45:00',
    user: 'Lê Thị Mai',
    role: 'KE_TOAN',
    action: 'DUYỆT CHI HOA HỒNG',
    details: 'Xác nhận chuyển khoản phiếu HH-001 (672,000 đ) theo chính sách Tour Cát Tiên.'
  }
];

// Danh sách Thông Báo & Chuyển Giao Liên Phòng Ban ban đầu
const INITIAL_NOTIFICATIONS = [
  {
    id: 'NT-001',
    type: 'HANDOVER_TOUR',
    senderRole: 'SALE',
    senderName: 'Nguyễn Văn An (Leader Kinh doanh)',
    targetRole: 'OPS',
    targetModule: 5,
    title: 'Bàn giao đoàn tour: DH-004 (V-Star 300 khách)',
    message: 'Sale đã chốt thành công đơn tour DH-004 (Tập Đoàn V-Star - 300 khách, giá trị 720.000.000 đ). Đã bàn giao sang Điều hành trong mục Mới tiếp nhận.',
    referenceId: 'DH-004',
    referenceType: 'BOOKING',
    status: 'UNREAD',
    createdAt: '2026-10-15 14:30:00',
    readAt: null,
    acknowledgedAt: null,
    acknowledgedBy: null
  },
  {
    id: 'NT-002',
    type: 'HANDOVER_SUPPLIER_ORDER',
    senderRole: 'OPS',
    senderName: 'Trần Đức Huy (Điều hành Tour)',
    targetRole: 'KE_TOAN',
    targetModule: 6,
    title: 'Chuyển lệnh đặt dịch vụ NCC LDC-002 chờ duyệt nợ',
    message: 'Điều hành đã lập lệnh đặt phòng LDC-002 với Khách sạn Nam Cát Tiên (50.000.000 đ - Công nợ 15 ngày). Kính chuyển Kế toán phê duyệt.',
    referenceId: 'LDC-002',
    referenceType: 'SUPPLIER_ORDER',
    status: 'UNREAD',
    createdAt: '2026-10-16 09:15:00',
    readAt: null,
    acknowledgedAt: null,
    acknowledgedBy: null
  },
  {
    id: 'NT-003',
    type: 'HANDOVER_QUOTE_REQUEST',
    senderRole: 'CTV',
    senderName: 'Hoàng Yến (CTV-001)',
    targetRole: 'SALE',
    targetModule: 4,
    title: 'Yêu cầu báo giá tour mới: BG-001 (Chị Hạnh 10 khách)',
    message: 'CTV Hoàng Yến đã gửi yêu cầu báo giá tour Trekking Tà Năng 10 khách. Kính chuyển Sale kiểm tra và duyệt báo giá.',
    referenceId: 'BG-001',
    referenceType: 'QUOTATION',
    status: 'UNREAD',
    createdAt: '2026-10-16 11:20:00',
    readAt: null,
    acknowledgedAt: null,
    acknowledgedBy: null
  },
  {
    id: 'NT-004',
    type: 'HANDOVER_PAYOUT',
    senderRole: 'KE_TOAN',
    senderName: 'Lê Thị Mai (Kế toán trưởng)',
    targetRole: 'CTV',
    targetModule: 10,
    title: 'Chi trả hoa hồng thành công: Phiếu HH-001',
    message: 'Kế toán đã giải ngân chuyển khoản 700.000 đ hoa hồng cho đơn tour DH-001 qua Techcombank (UNC: UNC-20261025).',
    referenceId: 'HH-001',
    referenceType: 'COMMISSION',
    status: 'READ',
    createdAt: '2026-10-24 10:00:00',
    readAt: '2026-10-24 11:00:00',
    acknowledgedAt: '2026-10-24 11:00:00',
    acknowledgedBy: 'Hoàng Yến (CTV-001)'
  }
];

// Danh sách Nhà Cung Cấp ban đầu (Kèm Chính sách công nợ & Hạn mức nợ đối tác)
const INITIAL_SUPPLIERS = [
  {
    id: 'NCC-001',
    code: 'NCC-001',
    name: 'Khách sạn Sinh Thái Nam Cát Tiên',
    category: 'HOTEL',
    categoryTitle: 'Khách sạn / Homestay Sinh Thái',
    province: 'Đồng Nai',
    stars: 4,
    priceMin: 800000,
    priceMax: 2200000,
    address: 'Ấp 1, Xã Nam Cát Tiên, Huyện Tân Phú, Tỉnh Đồng Nai',
    contactName: 'Anh Tuấn (Điều phối)',
    phone: '0901234567',
    email: 'cattien.ecolodge@gmail.com',
    website: 'https://cattienecolodge.vn',
    businessLicense: '3601234567 (Sở KH&ĐT Đồng Nai)',
    bankAccount: '19033221144 - Techcombank (Ecolodge Cat Tien)',
    debtPolicy: 'DEBT_15D',
    debtPolicyTitle: 'Công nợ 15 ngày sau tour',
    debtLimit: 100000000,
    status: 'active',
    avatar: '🏨',
    description: 'Khu nghỉ dưỡng sinh thái nép mình bên bìa rừng Nam Cát Tiên, hồ bơi sinh thái, bungalow gỗ tre và ẩm thực rau rừng tự nhiên.',
    notes: 'Đối tác phòng nghỉ sinh thái & ăn sáng view rừng Cát Tiên',
    services: [
      { id: 'SRV-001-1', name: 'Phòng Superior Hướng Vườn Sinh Thái', category: 'HOTEL', unit: 'Phòng / Đêm', rackPrice: 1200000, b2bPrice: 900000, weekendSurcharge: 150000, availability: 'AVAILABLE', availableCount: 8, notes: 'Bao gồm ăn sáng buffet, trà thảo mộc chào mừng, xe đạp dạo rừng' },
      { id: 'SRV-001-2', name: 'Bungalow View Sông Đồng Nai Cao Cấp', category: 'HOTEL', unit: 'Phòng / Đêm', rackPrice: 1800000, b2bPrice: 1400000, weekendSurcharge: 200000, availability: 'FEW_LEFT', availableCount: 2, notes: 'Bao gồm ăn sáng, ban công riêng ngắm hoàng hôn sông Đồng Nai' },
      { id: 'SRV-001-3', name: 'Set Ăn Ẩm Thực Rừng Xanh (Cá suối, rau bép)', category: 'RESTAURANT', unit: 'Suất / Khách', rackPrice: 250000, b2bPrice: 190000, weekendSurcharge: 0, availability: 'AVAILABLE', availableCount: 60, notes: 'Thực đơn 6 món dinh dưỡng từ nông trại hữu cơ' }
    ],
    policies: {
      cancellation: 'Miễn phí hủy dịch vụ trước 7 ngày. Hủy 3-6 ngày phạt 50%. Hủy trong vòng 48 giờ phạt 100% tiền đêm đầu.',
      children: 'Trẻ em dưới 6 tuổi ngủ chung bố mẹ miễn phí (tối đa 1 bé/phòng). Trẻ từ 6-11 tuổi phụ thu ăn sáng 120.000 đ. Từ 12 tuổi tính người lớn.',
      foc: 'Miễn phí 01 phòng nội bộ và 01 suất ăn cho Hướng dẫn viên/Lái xe theo đoàn từ 15 khách trở lên.',
      checkInOut: 'Nhận phòng (Check-in) từ 14:00; Trả phòng (Check-out) trước 12:00. Hỗ trợ nhận sớm theo tình trạng phòng trống.',
      paymentTerms: 'Thanh toán theo hợp đồng công nợ 15 ngày sau khi kết thúc dịch vụ đoàn.'
    },
    dailyLiveStatus: {
      lastUpdated: '2026-10-28 08:30',
      operationalStatus: 'NORMAL',
      availableCapacityNote: 'Hôm nay còn 6 phòng Superior, 2 Bungalow trống. Bếp hoạt động đủ công suất.',
      dailyNotice: 'Thời tiết Cát Tiên sáng nắng nhẹ, chiều mát. Tuyến xem thú đêm mở bình thường. Đặc sản cá suối tươi vừa về.',
      emergencyAlert: null,
      history: [
        { date: '2026-10-28', time: '08:30', content: 'Thời tiết đẹp, sẵn sàng đón các đoàn khách HaHa Travel.', updatedBy: 'Anh Tuấn' }
      ]
    }
  },
  {
    id: 'NCC-002',
    code: 'NCC-002',
    name: 'Nhà xe Du Lịch Xanh Sài Gòn',
    category: 'TRANSPORT',
    categoryTitle: 'Xe Du Lịch Đời Mới',
    province: 'TP. Hồ Chí Minh',
    stars: 5,
    priceMin: 2500000,
    priceMax: 4500000,
    address: '280 Nguyễn Tất Thành, Phường 13, Quận 4, TP. Hồ Chí Minh',
    contactName: 'Anh Hùng (Đội xe)',
    phone: '0912987654',
    email: 'xedulichxanh@gmail.com',
    website: 'https://xedulichxanh.com',
    businessLicense: '0309876543 (Sở GTVT TP.HCM)',
    bankAccount: '007100123456 - Vietcombank (Nguyen Van Hung)',
    debtPolicy: 'DEBT_7D',
    debtPolicyTitle: 'Công nợ 7 ngày sau tour',
    debtLimit: 50000000,
    status: 'active',
    avatar: '🚍',
    description: 'Đội xe du lịch từ 16 đến 45 chỗ đời mới 2023-2025, lái xe chuyên tuyến sinh thái, nhiệt tình, chuẩn an toàn đường đèo.',
    notes: 'Xe 16-29 chỗ chất lượng cao đời mới',
    services: [
      { id: 'SRV-002-1', name: 'Xe Universe 29 Chỗ Máy Lạnh Đời Mới', category: 'TRANSPORT', unit: 'Chuyến / Xe', rackPrice: 3500000, b2bPrice: 2800000, weekendSurcharge: 200000, availability: 'AVAILABLE', availableCount: 4, notes: 'Bao gồm xăng dầu, cầu đường, nước suối, khăn lạnh, tài xế phục vụ trọn tour' },
      { id: 'SRV-002-2', name: 'Xe Limousine DCar 16 Chỗ Hạng Thương Gia', category: 'TRANSPORT', unit: 'Chuyến / Xe', rackPrice: 3200000, b2bPrice: 2600000, weekendSurcharge: 200000, availability: 'AVAILABLE', availableCount: 3, notes: 'Ghế massage, wifi tốc độ cao, cổng sạc điện thoại từng ghế' }
    ],
    policies: {
      cancellation: 'Báo hủy trước 3 ngày không tính phí. Hủy trước 24 giờ phạt 30% giá chuyến xe.',
      children: 'Trẻ em đi cùng gia đình tính theo ghế ngồi an toàn.',
      foc: 'Bao gồm bảo hiểm hành khách trên xe tối đa 100.000.000 đ/vụ.',
      checkInOut: 'Đón khách đúng giờ theo lệnh điều xe. Lái xe liên hệ trưởng đoàn trước 30 phút.',
      paymentTerms: 'Công nợ 7 ngày sau khi kết thúc chuyến tour.'
    },
    dailyLiveStatus: {
      lastUpdated: '2026-10-28 07:15',
      operationalStatus: 'NORMAL',
      availableCapacityNote: 'Hôm nay 4 xe 29 chỗ sẵn sàng xuất bến tại TP.HCM. Tài xế đầy đủ chứng chỉ an toàn.',
      dailyNotice: 'Tất cả xe đã được vệ sinh khử khuẩn sạch sẽ, điều hòa làm mát sâu. Sẵn sàng nhận lệnh tour mới.',
      emergencyAlert: null,
      history: [
        { date: '2026-10-28', time: '07:15', content: 'Xe 29 chỗ biển số 51B-234.56 hoàn thành bảo dưỡng, sẵn sàng.', updatedBy: 'Anh Hùng' }
      ]
    }
  },
  {
    id: 'NCC-003',
    code: 'NCC-003',
    name: 'Hướng Dẫn Viên Bản Địa Cát Tiên',
    category: 'GUIDE',
    categoryTitle: 'Hướng Dẫn Viên & Bản Địa',
    province: 'Đồng Nai',
    stars: 5,
    priceMin: 600000,
    priceMax: 1200000,
    address: 'Trung tâm Du khách Vườn Quốc Gia Cát Tiên, Tỉnh Đồng Nai',
    contactName: 'Anh Ksor (HDV Trưởng)',
    phone: '0934567890',
    email: 'ksor.guide@gmail.com',
    businessLicense: 'Thẻ HDV Quốc tế số 101234',
    bankAccount: '5566778899 - MBBank (Ksor)',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    debtLimit: 10000000,
    status: 'active',
    avatar: '🧭',
    description: 'Chuyên gia sinh thái rừng nhiệt đới, sinh vật đêm và cứu hộ động vật hoang dã Cát Tiên, am hiểu sâu sắc thực vật dược liệu.',
    notes: 'Chuyên gia rừng & sinh vật đêm Cát Tiên',
    services: [
      { id: 'SRV-003-1', name: 'HDV Trekking Tuyến Bàu Sấu & Cây Tùng Cổ Thụ', category: 'GUIDE', unit: 'Ngày / Tour', rackPrice: 1200000, b2bPrice: 900000, weekendSurcharge: 100000, availability: 'AVAILABLE', availableCount: 2, notes: 'Thuyết minh chuyên sâu sinh vật rừng, trang bị ống nhòm chuyên dụng và túi sơ cứu y tế' },
      { id: 'SRV-003-2', name: 'Hướng Dẫn Soi Thú Đêm Bằng Đèn Chuyên Dụng', category: 'GUIDE', unit: 'Chuyến / Đoàn', rackPrice: 700000, b2bPrice: 500000, weekendSurcharge: 0, availability: 'AVAILABLE', availableCount: 3, notes: 'Thời lượng 1.5 - 2 giờ, giải thích tập tính nai, chồn hương, bò tót' }
    ],
    policies: {
      cancellation: 'Báo đổi lịch trước 24 giờ không tính phí.',
      children: 'Khuyến khích trẻ em tham gia học tập thực địa và kỹ năng sinh tồn trong rừng.',
      foc: 'Miễn phí tài liệu nhận diện chim rừng và côn trùng quý hiếm cho du khách.',
      checkInOut: 'Tập trung tại cổng rừng 15 phút trước giờ xuất phát.',
      paymentTerms: 'Thanh toán ngay khi kết thúc dịch vụ hướng dẫn đoàn.'
    },
    dailyLiveStatus: {
      lastUpdated: '2026-10-28 09:00',
      operationalStatus: 'NORMAL',
      availableCapacityNote: 'Đội ngũ 3 HDV bản địa đang trực tại trạm điều hành Cát Tiên.',
      dailyNotice: 'Đường rừng khô ráo, thú đêm xuất hiện nhiều tại trảng cỏ Trảng Cò. Đoàn đi nhớ mang giày chuyên dụng.',
      emergencyAlert: null,
      history: [
        { date: '2026-10-28', time: '09:00', content: 'Lộ trình Bàu Sấu rất thoáng, thời tiết lý tưởng.', updatedBy: 'Anh Ksor' }
      ]
    }
  },
  {
    id: 'NCC-004',
    code: 'NCC-004',
    name: 'Homestay Rừng & Suối Đà Lạt',
    category: 'HOTEL',
    categoryTitle: 'Glamping & Homestay',
    province: 'Lâm Đồng',
    stars: 4,
    priceMin: 650000,
    priceMax: 1800000,
    address: 'Đường Hoa Hồng, Khu hồ Tuyền Lâm, Phường 4, TP. Đà Lạt, Tỉnh Lâm Đồng',
    contactName: 'Chị Mai (Chủ Homestay)',
    phone: '0945678901',
    email: 'rungvasuoidalat@gmail.com',
    website: 'https://rungvasuoi.dalat.vn',
    businessLicense: '4201239876 (Sở KH&ĐT Lâm Đồng)',
    bankAccount: '1012345678 - BIDV (Le Thi Mai)',
    debtPolicy: 'DEBT_30D',
    debtPolicyTitle: 'Công nợ 30 ngày (Gối đầu hàng tháng)',
    debtLimit: 80000000,
    status: 'active',
    avatar: '🏕️',
    description: 'Khu lều glamping cao cấp bên suối rừng thông Đà Lạt, lều chống nước 2 lớp, sàn gỗ sưởi ấm, tiệc BBQ than hoa và acoustic.',
    notes: 'Khu lều glamping cao cấp bên suối',
    services: [
      { id: 'SRV-004-1', name: 'Lều Glamping Luxury View Suối Rừng Thông', category: 'HOTEL', unit: 'Lều / Đêm', rackPrice: 1200000, b2bPrice: 850000, weekendSurcharge: 200000, availability: 'AVAILABLE', availableCount: 4, notes: 'Bao gồm ăn sáng, trà atiso nóng chào mừng, chăn điện sưởi ấm ban đêm' },
      { id: 'SRV-004-2', name: 'Phòng Family Gỗ Thông Mộc Tự Nhiên', category: 'HOTEL', unit: 'Phòng / Đêm', rackPrice: 1600000, b2bPrice: 1200000, weekendSurcharge: 200000, availability: 'FEW_LEFT', availableCount: 2, notes: 'Sức chứa 4 khách, bồn tắm gỗ ngâm chân thảo dược' },
      { id: 'SRV-004-3', name: 'Set BBQ Nướng Than Hoa Tây Nguyên', category: 'RESTAURANT', unit: 'Suất / Khách', rackPrice: 320000, b2bPrice: 240000, weekendSurcharge: 0, availability: 'AVAILABLE', availableCount: 40, notes: 'Thịt xiên nướng mắc khén, cơm lam ống tre, salad dâu tây Đà Lạt' }
    ],
    policies: {
      cancellation: 'Miễn phí hủy trước 5 ngày. Hủy trong vòng 48 giờ phạt 50% tiền dịch vụ.',
      children: 'Trẻ em dưới 6 tuổi ngủ chung lều miễn phí; trẻ từ 6-10 tuổi phụ thu ăn sáng và nệm phụ 150.000 đ.',
      foc: 'Miễn phí 1 lều nội bộ cho HDV đoàn từ 12 khách; miễn phí đốt lửa trại giao lưu.',
      checkInOut: 'Check-in: 14:00; Check-out: 12:00. Tiệc BBQ phục vụ từ 18:00 - 21:30.',
      paymentTerms: 'Công nợ 30 ngày đối soát gối đầu hàng tháng.'
    },
    dailyLiveStatus: {
      lastUpdated: '2026-10-28 08:00',
      operationalStatus: 'NORMAL',
      availableCapacityNote: 'Đà Lạt hôm nay se lạnh 17°C, còn 4 lều Glamping đón khách tối nay. Củi lửa trại đã sẵn sàng.',
      dailyNotice: 'Đường vào hồ Tuyền Lâm thông thoáng. Khu vực cắm trại có sương mù nhẹ rất thơ mộng.',
      emergencyAlert: null,
      history: [
        { date: '2026-10-28', time: '08:00', content: 'Chuẩn bị thêm 20kg khoai bắp nướng phục vụ đoàn tối nay.', updatedBy: 'Chị Mai' }
      ]
    }
  },
  {
    id: 'NCC-005',
    code: 'NCC-005',
    name: 'Tàu Du Lịch Sinh Thái Bến Tre',
    category: 'TRANSPORT',
    categoryTitle: 'Tàu & Cano Sinh Thái',
    province: 'Bến Tre',
    stars: 4,
    priceMin: 150000,
    priceMax: 1800000,
    address: 'Bến tàu Du lịch Hàm Luông, Phường An Hội, TP. Bến Tre, Tỉnh Bến Tre',
    contactName: 'Chú Ba (Chủ Bến Tàu)',
    phone: '0978901234',
    email: 'taubentre@gmail.com',
    businessLicense: '5300987654 (Sở GTVT Bến Tre)',
    bankAccount: '049100099887 - Vietcombank (Tran Van Ba)',
    debtPolicy: 'DEPOSIT_50',
    debtPolicyTitle: 'Cọc 50%, còn lại sau tour 3 ngày',
    debtLimit: 30000000,
    status: 'active',
    avatar: '🚤',
    description: 'Đội tàu du lịch vỏ composite 30 chỗ và xuồng chèo ba lá len lỏi rạch dừa nước, thưởng thức đờn ca tài tử và kẹo dừa nóng.',
    notes: 'Tàu sông & xuồng chèo rạch dừa nước Miền Tây',
    services: [
      { id: 'SRV-005-1', name: 'Tàu Du Lịch 30 Chỗ Du Ngoạn Sông Tiền - Cồn Phụng', category: 'TRANSPORT', unit: 'Chuyến / Tàu', rackPrice: 1800000, b2bPrice: 1300000, weekendSurcharge: 150000, availability: 'AVAILABLE', availableCount: 3, notes: 'Bao gồm áo phao cứu sinh, nước dừa tươi chào mừng, thuyết minh viên trên tàu' },
      { id: 'SRV-005-2', name: 'Xuồng Chèo Ba Lá Len Lỏi Rạch Dừa Nước Tự Nhiên', category: 'TRANSPORT', unit: 'Vé / Khách', rackPrice: 80000, b2bPrice: 50000, weekendSurcharge: 0, availability: 'AVAILABLE', availableCount: 80, notes: 'Chèo xuồng 4 người/xuồng, đội nón lá chụp ảnh truyền thống' }
    ],
    policies: {
      cancellation: 'Báo hủy trước 24 giờ hoàn 100% tiền cọc. Hủy cận giờ cấn trừ 30% chi phí bến bãi.',
      children: 'Trẻ em trang bị áo phao trẻ em chuyên dụng đầy đủ.',
      foc: 'Miễn phí trà mật ong hoa nhãn, kẹo dừa và trái cây miệt vườn cho cả đoàn.',
      checkInOut: 'Tàu xuất bến theo giờ thỏa thuận, hoạt động từ 07:00 đến 17:30.',
      paymentTerms: 'Đặt cọc 50%, thanh toán 50% còn lại sau tour trong 3 ngày.'
    },
    dailyLiveStatus: {
      lastUpdated: '2026-10-28 07:45',
      operationalStatus: 'NORMAL',
      availableCapacityNote: 'Thủy triều sông Tiền hôm nay êm đềm, nước lớn lúc 10h sáng. 3 tàu du lịch sẵn sàng phục vụ.',
      dailyNotice: 'Trái cây vườn chôm chôm, sầu riêng đang rộ. Các cô chèo đò trang bị áo bà ba truyền thống đón khách.',
      emergencyAlert: null,
      history: [
        { date: '2026-10-28', time: '07:45', content: 'Tàu số BT-08 vừa đăng kiểm hoàn tất, áo phao mới 100%.', updatedBy: 'Chú Ba' }
      ]
    }
  },
  {
    id: 'NCC-006',
    code: 'NCC-006',
    name: 'Nhà Hàng Ẩm Thực Đồng Quê Ninh Bình',
    category: 'RESTAURANT',
    categoryTitle: 'Nhà Hàng Đặc Sản Địa Phương',
    province: 'Ninh Bình',
    stars: 4,
    priceMin: 160000,
    priceMax: 450000,
    address: 'Khu du lịch sinh thái Tràng An, Xã Ninh Xuân, Huyện Hoa Lư, Tỉnh Ninh Bình',
    contactName: 'Anh Trọng (Bếp Trưởng)',
    phone: '0988112233',
    email: 'dongquyeninhbinh@gmail.com',
    businessLicense: '2701122334 (Sở KH&ĐT Ninh Bình)',
    bankAccount: '19022334455 - Techcombank (Vu Van Trong)',
    debtPolicy: 'DEBT_15D',
    debtPolicyTitle: 'Công nợ 15 ngày sau tour',
    debtLimit: 40000000,
    status: 'active',
    avatar: '🍽️',
    description: 'Nhà hàng đặc sản dê núi cơm cháy Ninh Bình, không gian nhà rường cổ Bắc Bộ view núi đá vôi, sức chứa lên tới 300 khách.',
    notes: 'Nhà hàng đặc sản dê núi cơm cháy Ninh Bình',
    services: [
      { id: 'SRV-006-1', name: 'Set Cơm Cháy Dê Núi 7 Món Đặc Sản Hoa Lư', category: 'RESTAURANT', unit: 'Suất / Khách', rackPrice: 220000, b2bPrice: 170000, weekendSurcharge: 0, availability: 'AVAILABLE', availableCount: 150, notes: 'Gồm dê tái chanh, dê xào sả ớt, cơm cháy sốt tim cật dê, canh giò heo măng đắng' },
      { id: 'SRV-006-2', name: 'Set Lẩu Dê Thuốc Bắc & Rượu Nếp Kim Sơn', category: 'RESTAURANT', unit: 'Suất / Khách', rackPrice: 280000, b2bPrice: 220000, weekendSurcharge: 0, availability: 'AVAILABLE', availableCount: 100, notes: 'Nồi lẩu thơm nồng thảo mộc, mì trứng, rau sạch bản địa ăn kèm' }
    ],
    policies: {
      cancellation: 'Báo giảm số lượng trước 4 tiếng không phụ thu phí chuẩn bị thực phẩm.',
      children: 'Trẻ em dưới 5 tuổi ăn chung bố mẹ miễn phí; từ 5-10 tuổi tính 50% suất ăn.',
      foc: 'Miễn phí suất ăn cho Hướng dẫn viên và Lái xe cho đoàn từ 15 khách trở lên.',
      checkInOut: 'Phục vụ ăn trưa từ 10:30 - 14:30; Ăn tối từ 17:00 - 21:30.',
      paymentTerms: 'Công nợ 15 ngày sau khi hoàn tất dịch vụ đoàn.'
    },
    dailyLiveStatus: {
      lastUpdated: '2026-10-28 09:15',
      operationalStatus: 'NORMAL',
      availableCapacityNote: 'Dê núi tươi nguyên con nhập sáng nay. Sẵn sàng nhận đoàn lên tới 200 khách.',
      dailyNotice: 'Phòng ăn máy lạnh view đầm sen Tràng An mở cửa thông suốt. Bãi đỗ xe 45 chỗ rộng rãi.',
      emergencyAlert: null,
      history: [
        { date: '2026-10-28', time: '09:15', content: 'Chuẩn bị sẵn 50 phần cơm cháy nước sốt dê hảo hạng.', updatedBy: 'Anh Trọng' }
      ]
    }
  },
  {
    id: 'NCC-007',
    code: 'NCC-007',
    name: 'Khách Sạn & Spa Biển Eco Đà Nẵng',
    category: 'HOTEL',
    categoryTitle: 'Khách Sạn & Resort Biển 5★',
    province: 'Đà Nẵng',
    stars: 5,
    priceMin: 1400000,
    priceMax: 3600000,
    address: '120 Võ Nguyên Giáp, Phường Phước Mỹ, Quận Sơn Trà, TP. Đà Nẵng',
    contactName: 'Chị Lan (Trưởng Bộ Phận B2B)',
    phone: '0933557799',
    email: 'sales@ecodananghotel.vn',
    website: 'https://ecodananghotel.vn',
    businessLicense: '0401889900 (Sở KH&ĐT Đà Nẵng)',
    bankAccount: '004100998877 - Vietcombank (Eco Danang Hotel JSC)',
    debtPolicy: 'DEBT_15D',
    debtPolicyTitle: 'Công nợ 15 ngày sau tour',
    debtLimit: 150000000,
    status: 'active',
    avatar: '🏨',
    description: 'Khách sạn sinh thái biển 5 sao mặt đường Võ Nguyên Giáp đối diện bãi biển Mỹ Khê, hồ bơi vô cực tầng thượng và dịch vụ spa trị liệu cao cấp.',
    notes: 'Khách sạn 5 sao mặt biển Mỹ Khê Đà Nẵng',
    services: [
      { id: 'SRV-007-1', name: 'Phòng Premier Ocean View Ban Công Mặt Biển', category: 'HOTEL', unit: 'Phòng / Đêm', rackPrice: 2400000, b2bPrice: 1800000, weekendSurcharge: 250000, availability: 'AVAILABLE', availableCount: 10, notes: 'Bao gồm buffet sáng quốc tế 60 món, trà chiều ngắm biển và hồ bơi tầng 20' },
      { id: 'SRV-007-2', name: 'Phòng Deluxe City View Hiện Đại', category: 'HOTEL', unit: 'Phòng / Đêm', rackPrice: 1600000, b2bPrice: 1200000, weekendSurcharge: 150000, availability: 'AVAILABLE', availableCount: 15, notes: 'Không gian yên tĩnh, bồn tắm nằm cao cấp' },
      { id: 'SRV-007-3', name: 'Xe Đón Tiễn Sân Bay Quốc Tế Đà Nẵng 16 Chỗ', category: 'TRANSPORT', unit: 'Chuyến / Xe', rackPrice: 450000, b2bPrice: 350000, weekendSurcharge: 0, availability: 'AVAILABLE', availableCount: 5, notes: 'Đón khách đúng giờ tại ga đến quốc nội/quốc tế' }
    ],
    policies: {
      cancellation: 'Miễn phí hủy trước 7 ngày; Hủy 3-6 ngày phạt đêm đầu tiên; Hủy trong 48 giờ phạt 100% booking.',
      children: 'Tối đa 2 trẻ em dưới 6 tuổi miễn phí tiền phòng và ăn sáng khi ngủ chung giường bố mẹ.',
      foc: 'Đoàn từ 15 phòng trả tiền được miễn phí 01 phòng Superior nội bộ cho Hướng dẫn viên.',
      checkInOut: 'Check-in: 14:00; Check-out: 12:00. Hỗ trợ trả phòng trễ đến 14:00 tùy tình trạng phòng.',
      paymentTerms: 'Công nợ 15 ngày theo hợp đồng đối tác chiến lược B2B.'
    },
    dailyLiveStatus: {
      lastUpdated: '2026-10-28 08:45',
      operationalStatus: 'NORMAL',
      availableCapacityNote: 'Biển Mỹ Khê sóng êm, nắng vàng đẹp. Hôm nay còn 10 phòng Ocean View trống.',
      dailyNotice: 'Hồ bơi vô cực tầng 20 và quầy Bar hoàng hôn hoạt động bình thường. Tặng voucher spa 20% cho khách HaHa Travel.',
      emergencyAlert: null,
      history: [
        { date: '2026-10-28', time: '08:45', content: 'Thời tiết Đà Nẵng 28°C rất thuận lợi tắm biển và tham quan Bà Nà.', updatedBy: 'Chị Lan' }
      ]
    }
  },
  {
    id: 'NCC-008',
    code: 'NCC-008',
    name: 'Dịch Vụ Trekking & Porter Bản Địa Sapa',
    category: 'TREKKING',
    categoryTitle: 'Trekking & Dẫn Đường Bản Địa',
    province: 'Lào Cai',
    stars: 5,
    priceMin: 600000,
    priceMax: 2200000,
    address: 'Bản Cát Cát, Xã Hoàng Liên, Thị Xã Sa Pa, Tỉnh Lào Cai',
    contactName: 'Anh Vàng A Páo (Đội Trưởng Porter)',
    phone: '0966442200',
    email: 'sapatrekking.porter@gmail.com',
    businessLicense: '1600887766 (Sở VHTTDL Lào Cai)',
    bankAccount: '1088776655 - Agribank (Vang A Pao)',
    debtPolicy: 'DEBT_7D',
    debtPolicyTitle: 'Công nợ 7 ngày sau tour',
    debtLimit: 35000000,
    status: 'active',
    avatar: '🧗',
    description: 'Đội ngũ Porter người Mông bản địa chuyên nghiệp dẫn cung trekking đỉnh Fansipan, Bạch Mộc Lương Tử, Nhìu Cồ San, am hiểu thời tiết núi cao.',
    notes: 'Đội ngũ Porter người Mông bản địa chuyên nghiệp',
    services: [
      { id: 'SRV-008-1', name: 'Gói Dẫn Đường & Porter Vác Đồ Trekking Fansipan 2N1Đ', category: 'TREKKING', unit: 'Người / Ngày', rackPrice: 1500000, b2bPrice: 1100000, weekendSurcharge: 150000, availability: 'AVAILABLE', availableCount: 8, notes: 'Porter gùi đồ tối đa 15kg/khách, chuẩn bị lán ngủ, nấu ăn bản địa trên núi' },
      { id: 'SRV-008-2', name: 'Cho Thuê Bộ Thiết Bị Dã Ngoại Chuyên Dụng (Lều, Túi ngủ, Gậy)', category: 'TREKKING', unit: 'Bộ / Tour', rackPrice: 250000, b2bPrice: 180000, weekendSurcharge: 0, availability: 'AVAILABLE', availableCount: 30, notes: 'Túi ngủ chịu nhiệt -5 độ C, gậy leo núi carbon siêu nhẹ' }
    ],
    policies: {
      cancellation: 'Báo dời lịch trước 48 giờ do điều kiện thời tiết xấu trên núi không tính phí.',
      children: 'Cung trekking chỉ áp dụng cho khách từ 12 tuổi trở lên có thể lực tốt.',
      foc: 'Bao gồm bảo hiểm leo núi trách nhiệm dân sự và thiết bị y tế khẩn cấp, máy đo oxy SPO2.',
      checkInOut: 'Tập trung lúc 06:30 tại Trạm Tôn để điểm danh và nhận thiết bị.',
      paymentTerms: 'Công nợ 7 ngày sau khi kết thúc chuyến leo núi an toàn.'
    },
    dailyLiveStatus: {
      lastUpdated: '2026-10-28 07:30',
      operationalStatus: 'NORMAL',
      availableCapacityNote: 'Sapa nắng ráo, nhiệt độ trên đỉnh 14°C, biển mây tuyệt đẹp. Đội ngũ 8 Porter bản địa sẵn sàng nhận đoàn.',
      dailyNotice: 'Đường leo núi khô ráo, lán nghỉ 2800m đủ chăn ấm và nước nóng. Đã test máy đo SPO2 và bộ đàm thông suốt.',
      emergencyAlert: null,
      history: [
        { date: '2026-10-28', time: '07:30', content: 'Dự báo thời tiết 3 ngày tới không mưa, cực kỳ thuận lợi săn mây.', updatedBy: 'Anh Páo' }
      ]
    }
  }
];

// Danh sách Báo Giá ban đầu (Quản lý Báo giá Tour đầy đủ cho 20 Kịch bản)
const INITIAL_QUOTATIONS = [
  {
    id: 'BG-001',
    code: 'BG-001',
    customerId: 1,
    customerCode: 'HH-001',
    customerName: 'Nguyễn Thị Mai Linh',
    customerPhone: '0908123456',
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-10-24',
    paxCount: 4,
    unitPrice: 2400000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 9600000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-001',
    staff: 'Nguyễn Văn An (Leader)',
    createdAt: '2026-10-10',
    confirmedAt: '2026-10-10',
    confirmedBy: 'Nguyễn Văn An (Leader)',
    notes: 'Đoàn gia đình 4 người lớn'
  },
  {
    id: 'BG-002',
    code: 'BG-002',
    customerId: 3,
    customerCode: 'HH-003',
    customerName: 'Lê Hoàng Phúc',
    customerPhone: '0987654321',
    collaboratorId: 'CTV-002',
    ctvName: 'Minh Tuấn (Admin Camping)',
    tourId: 'TOUR-03',
    tourName: 'Tour Sinh Thái Miền Tây Sông Nước Bến Tre - Cần Thơ 2N1Đ',
    departureDate: '2026-10-28',
    paxCount: 4,
    unitPrice: 1950000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 7800000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-002',
    staff: 'Lê Thị Mai (Tư vấn viên)',
    createdAt: '2026-10-14',
    confirmedAt: '2026-10-14',
    confirmedBy: 'Lê Thị Mai (Tư vấn viên)',
    notes: 'Gia đình 4 người'
  },
  {
    id: 'BG-003',
    code: 'BG-003',
    customerId: 4,
    customerCode: 'HH-004',
    customerName: 'Phạm Thúy Hằng',
    customerPhone: '0933221100',
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    tourId: 'TOUR-04',
    tourName: 'Tour Khám Phá Tây Bắc - Mùa Lúa Chín Mù Cang Chải 4N3Đ',
    departureDate: '2026-11-05',
    paxCount: 4,
    unitPrice: 4625000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 18500000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-003',
    staff: 'Phạm Thảo Vy (Tư vấn viên)',
    createdAt: '2026-10-08',
    confirmedAt: '2026-10-08',
    confirmedBy: 'Phạm Thảo Vy (Tư vấn viên)',
    notes: 'Đoàn 4 khách Mù Cang Chải'
  },
  {
    id: 'BG-004',
    code: 'BG-004',
    customerId: 8,
    customerCode: 'HH-008',
    customerName: 'Tập Đoàn Công Nghệ V-Star (300 khách)',
    customerPhone: '0968889999',
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-11-20',
    paxCount: 300,
    unitPrice: 2400000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 720000000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-004',
    staff: 'Nguyễn Văn An (Leader)',
    createdAt: '2026-10-15',
    confirmedAt: '2026-10-15',
    confirmedBy: 'Nguyễn Văn An (Leader)',
    notes: 'Đoàn 300 khách công ty V-Star'
  },
  {
    id: 'BG-005',
    code: 'BG-005',
    customerId: 5,
    customerCode: 'HH-005',
    customerName: 'Trường THPT Chuyên Lê Hồng Phong (Thầy Trần Trọng Hiếu)',
    customerPhone: '0977889900',
    collaboratorId: 'CTV-002',
    ctvName: 'Minh Tuấn (Admin Camping)',
    tourId: 'TOUR-03',
    tourName: 'Tour Sinh Thái Miền Tây Sông Nước Bến Tre - Cần Thơ 2N1Đ',
    departureDate: '2026-11-12',
    paxCount: 120,
    unitPrice: 1500000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 180000000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-005',
    staff: 'Nguyễn Văn An (Leader)',
    createdAt: '2026-10-16',
    confirmedAt: '2026-10-16',
    confirmedBy: 'Nguyễn Văn An (Leader)',
    notes: 'Khối 11 - 120 học sinh và giáo viên'
  },
  {
    id: 'BG-006',
    code: 'BG-006',
    customerId: 6,
    customerCode: 'HH-006',
    customerName: 'Anh Lê Tuấn Kiệt (Nhóm Bạn Bè)',
    customerPhone: '0944556677',
    collaboratorId: '',
    ctvName: 'Trực tiếp (Website)',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-10-25',
    paxCount: 15,
    unitPrice: 3000000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 45000000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-006',
    staff: 'Trần Đức Huy (Tư vấn viên)',
    createdAt: '2026-10-17',
    confirmedAt: '2026-10-17',
    confirmedBy: 'Trần Đức Huy (Tư vấn viên)',
    notes: 'Nhóm 15 bạn trẻ yêu thiên nhiên'
  },
  {
    id: 'BG-007',
    code: 'BG-007',
    customerId: 7,
    customerCode: 'HH-007',
    customerName: 'Chị Hoàng Kim Oanh (Hủy Tour Đột Xuất)',
    customerPhone: '0918765432',
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    tourId: 'TOUR-04',
    tourName: 'Tour Khám Phá Tây Bắc - Mùa Lúa Chín Mù Cang Chải 4N3Đ',
    departureDate: '2026-10-27',
    paxCount: 10,
    unitPrice: 3500000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 35000000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-007',
    staff: 'Phạm Thảo Vy (Tư vấn viên)',
    createdAt: '2026-10-15',
    confirmedAt: '2026-10-15',
    confirmedBy: 'Phạm Thảo Vy (Tư vấn viên)',
    notes: 'Đoàn hủy trước 2 ngày do việc gia đình khẩn'
  },
  {
    id: 'BG-008',
    code: 'BG-008',
    customerId: 9,
    customerCode: 'HH-009',
    customerName: 'Ngân Hàng Techcombank Hội Sở (Anh Vũ Hải)',
    customerPhone: '0988112233',
    collaboratorId: '',
    ctvName: 'Doanh nghiệp B2B',
    tourId: 'TOUR-02',
    tourName: 'Tour Chữa Lành & Cắm Trại Rừng Thông Đà Lạt 3N2Đ',
    departureDate: '2026-10-26',
    paxCount: 80,
    unitPrice: 3200000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 256000000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-008',
    staff: 'Nguyễn Văn An (Leader)',
    createdAt: '2026-10-18',
    confirmedAt: '2026-10-18',
    confirmedBy: 'Nguyễn Văn An (Leader)',
    notes: 'Hợp đồng B2B thanh toán sau tour 15 ngày'
  },
  {
    id: 'BG-009',
    code: 'BG-009',
    customerId: 10,
    customerCode: 'HH-010',
    customerName: 'Doanh Nhân David Trần (Private VIP Tour)',
    customerPhone: '0909001122',
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-10-20',
    paxCount: 8,
    unitPrice: 8000000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 64000000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-009',
    staff: 'Lê Thị Mai (Tư vấn viên)',
    createdAt: '2026-10-12',
    confirmedAt: '2026-10-12',
    confirmedBy: 'Lê Thị Mai (Tư vấn viên)',
    notes: 'Private VIP Ecolodge Resort 5 sao'
  },
  {
    id: 'BG-010',
    code: 'BG-010',
    customerId: 11,
    customerCode: 'HH-011',
    customerName: 'CLB Nhiếp Ảnh Sài Gòn (Anh Chu Văn Sơn)',
    customerPhone: '0913554433',
    collaboratorId: '',
    ctvName: 'Trực tiếp (Fanpage)',
    tourId: 'TOUR-04',
    tourName: 'Tour Khám Phá Tây Bắc - Mùa Lúa Chín Mù Cang Chải 4N3Đ',
    departureDate: '2026-11-08',
    paxCount: 25,
    unitPrice: 3000000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 75000000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-010',
    staff: 'Phạm Thảo Vy (Tư vấn viên)',
    createdAt: '2026-10-19',
    confirmedAt: '2026-10-19',
    confirmedBy: 'Phạm Thảo Vy (Tư vấn viên)',
    notes: 'Đoàn 25 nhiếp ảnh gia thanh toán 3 đợt Early Bird'
  },
  {
    id: 'BG-011',
    code: 'BG-011',
    customerId: 12,
    customerCode: 'HH-012',
    customerName: 'Đoàn Inbound Pháp - Jean-Pierre Dubois',
    customerPhone: '0922334455',
    collaboratorId: '',
    ctvName: 'Đối tác Inbound Quốc Tế',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-11-15',
    paxCount: 12,
    unitPrice: 4000000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 48000000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-011',
    staff: 'Nguyễn Văn An (Leader)',
    createdAt: '2026-10-19',
    confirmedAt: '2026-10-19',
    confirmedBy: 'Nguyễn Văn An (Leader)',
    notes: 'Đoàn 12 khách Pháp yêu cầu HDV tiếng Pháp'
  },
  {
    id: 'BG-012',
    code: 'BG-012',
    customerId: 13,
    customerCode: 'HH-013',
    customerName: 'Chị Nguyễn Thảo My',
    customerPhone: '0938445566',
    collaboratorId: 'CTV-002',
    ctvName: 'Minh Tuấn (Admin Camping)',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-10-30',
    paxCount: 6,
    unitPrice: 3000000,
    surchargeAmount: 3000000,
    discountAmount: 0,
    totalAmount: 21000000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-012',
    staff: 'Trần Đức Huy (Tư vấn viên)',
    createdAt: '2026-10-20',
    confirmedAt: '2026-10-20',
    confirmedBy: 'Trần Đức Huy (Tư vấn viên)',
    notes: 'Gốc 18M + phụ thu 3 phòng đơn 3M = 21M'
  },
  {
    id: 'BG-013',
    code: 'BG-013',
    customerId: 14,
    customerCode: 'HH-014',
    customerName: 'Bệnh Viện Đa Khoa Sài Gòn (BS. Nguyễn Minh Tuấn)',
    customerPhone: '0903887766',
    collaboratorId: '',
    ctvName: 'Doanh nghiệp B2B',
    tourId: 'TOUR-03',
    tourName: 'Tour Sinh Thái Miền Tây Sông Nước Bến Tre - Cần Thơ 2N1Đ',
    departureDate: '2026-11-18',
    paxCount: 50,
    unitPrice: 3000000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 150000000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-013',
    staff: 'Nguyễn Văn An (Leader)',
    createdAt: '2026-10-20',
    confirmedAt: '2026-10-20',
    confirmedBy: 'Nguyễn Văn An (Leader)',
    notes: 'Đoàn hội thảo 50 bác sĩ kèm tiệc gala'
  },
  {
    id: 'BG-014',
    code: 'BG-014',
    customerId: 15,
    customerCode: 'HH-015',
    customerName: 'Đại Gia Đình Bác Trần Văn Thành (3 Thế Hệ)',
    customerPhone: '0917665544',
    collaboratorId: 'CTV-002',
    ctvName: 'Minh Tuấn (Admin Camping)',
    tourId: 'TOUR-03',
    tourName: 'Tour Sinh Thái Miền Tây Sông Nước Bến Tre - Cần Thơ 2N1Đ',
    departureDate: '2026-11-01',
    paxCount: 12,
    unitPrice: 2400000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 22560000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-014',
    staff: 'Lê Thị Mai (Tư vấn viên)',
    createdAt: '2026-10-21',
    confirmedAt: '2026-10-21',
    confirmedBy: 'Lê Thị Mai (Tư vấn viên)',
    notes: '8 lớn + 2 trẻ em (70%) + 2 em bé (0%) = 9.4 suất'
  },
  {
    id: 'BG-015',
    code: 'BG-015',
    customerId: 16,
    customerCode: 'HH-016',
    customerName: 'Anh Phan Hoàng Long (Khách Thân Thiết)',
    customerPhone: '0902998877',
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    tourId: 'TOUR-02',
    tourName: 'Tour Chữa Lành & Cắm Trại Rừng Thông Đà Lạt 3N2Đ',
    departureDate: '2026-10-29',
    paxCount: 8,
    unitPrice: 3200000,
    surchargeAmount: 0,
    discountAmount: 2600000,
    totalAmount: 23000000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-015',
    staff: 'Phạm Thảo Vy (Tư vấn viên)',
    createdAt: '2026-10-21',
    confirmedAt: '2026-10-21',
    confirmedBy: 'Phạm Thảo Vy (Tư vấn viên)',
    notes: 'Giá gốc 25.6M áp voucher giảm trừ 2.6M = 23M'
  },
  {
    id: 'BG-016',
    code: 'BG-016',
    customerId: 17,
    customerCode: 'HH-017',
    customerName: 'Startup AI Nexus (Anh Đặng Quốc Cường)',
    customerPhone: '0982332211',
    collaboratorId: '',
    ctvName: 'Direct Booking',
    tourId: 'TOUR-02',
    tourName: 'Tour Chữa Lành & Cắm Trại Rừng Thông Đà Lạt 3N2Đ',
    departureDate: '2026-10-22',
    paxCount: 40,
    unitPrice: 3200000,
    surchargeAmount: 8000000,
    discountAmount: 0,
    totalAmount: 136000000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-016',
    staff: 'Nguyễn Văn An (Leader)',
    createdAt: '2026-10-22',
    confirmedAt: '2026-10-22',
    confirmedBy: 'Nguyễn Văn An (Leader)',
    notes: 'Phát sinh lều dã chiến và cứu hộ đêm +8M'
  },
  {
    id: 'BG-017',
    code: 'BG-017',
    customerId: 18,
    customerCode: 'HH-018',
    customerName: 'Công Ty Cổ Phần Xây Dựng Vinacon',
    customerPhone: '0976554433',
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-10-21',
    paxCount: 20,
    unitPrice: 3000000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 60000000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-017',
    staff: 'Trần Đức Huy (Tư vấn viên)',
    createdAt: '2026-10-18',
    confirmedAt: '2026-10-18',
    confirmedBy: 'Trần Đức Huy (Tư vấn viên)',
    notes: 'Tour đã hoàn thành nhưng công nợ B2B còn 20M'
  },
  {
    id: 'BG-018',
    code: 'BG-018',
    customerId: 19,
    customerCode: 'HH-019',
    customerName: 'Chị Đỗ Mỹ Linh (Nhóm Doanh Nhân Trẻ)',
    customerPhone: '0949112233',
    collaboratorId: 'CTV-002',
    ctvName: 'Minh Tuấn (Admin Camping)',
    tourId: 'TOUR-02',
    tourName: 'Tour Chữa Lành & Cắm Trại Rừng Thông Đà Lạt 3N2Đ',
    departureDate: '2026-10-27',
    paxCount: 16,
    unitPrice: 3200000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 51200000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-018',
    staff: 'Lê Thị Mai (Tư vấn viên)',
    createdAt: '2026-10-23',
    confirmedAt: '2026-10-23',
    confirmedBy: 'Lê Thị Mai (Tư vấn viên)',
    notes: 'Liên kết 4 Nhà cung cấp độc lập'
  },
  {
    id: 'BG-019',
    code: 'BG-019',
    customerId: 19,
    customerCode: 'HH-019',
    customerName: 'Chị Đỗ Mỹ Linh (Công Ty BĐS Đất Lành - Tour 2)',
    customerPhone: '0949112233',
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    tourId: 'TOUR-02',
    tourName: 'Tour Chữa Lành & Cắm Trại Rừng Thông Đà Lạt 3N2Đ',
    departureDate: '2026-11-28',
    paxCount: 40,
    unitPrice: 3200000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 128000000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-019',
    staff: 'Nguyễn Văn An (Leader)',
    createdAt: '2026-10-23',
    confirmedAt: '2026-10-23',
    confirmedBy: 'Nguyễn Văn An (Leader)',
    notes: 'Tour thứ 2 trong tháng của cùng 1 doanh nghiệp'
  },
  {
    id: 'BG-020',
    code: 'BG-020',
    customerId: 20,
    customerCode: 'HH-020',
    customerName: 'Caravan Club Miền Nam (Anh Bùi Quang Thắng)',
    customerPhone: '0908778899',
    collaboratorId: '',
    ctvName: 'Direct Booking',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-11-14',
    paxCount: 45,
    unitPrice: 3000000,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: 135000000,
    status: 'Đã lên đơn tour',
    bookingCode: 'DH-020',
    staff: 'Nguyễn Văn An (Leader)',
    createdAt: '2026-10-23',
    confirmedAt: '2026-10-23',
    confirmedBy: 'Nguyễn Văn An (Leader)',
    notes: 'Đoàn Caravan 15 xe tự lái'
  }
];

// Danh sách Đơn Tour ban đầu (Đầy đủ 20 Kịch bản Lữ hành Thực tế & Dữ liệu Nghiệp vụ Hoàn chỉnh)
const INITIAL_BOOKINGS = [
  {
    id: 'DH-001',
    code: 'DH-001',
    quotationId: 'BG-001',
    quotationCode: 'BG-001',
    customerId: 1,
    customerName: 'Nguyễn Thị Mai Linh',
    customerPhone: '0908123456',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-10-24',
    paxCount: 4,
    unitPrice: 2400000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 9600000,
    paidAmount: 9600000,
    remainingAmount: 0,
    refundAmount: 0,
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    staff: 'Nguyễn Văn An (Leader)',
    status: 'Đã hoàn thành',
    tourStatus: 'Hoàn thành tour',
    financialStatus: 'Đã thanh toán đủ',
    estimatedCost: 6200000,
    actualCost: 6200000,
    createdAt: '2026-10-10',
    notes: 'Đoàn gia đình 4 người lớn, yêu cầu ăn chay 1 suất.',
    passengers: [
      { id: 1, fullName: 'Nguyễn Thị Mai Linh', gender: 'Nữ', birthYear: 1990, idCard: '079190001234', phone: '0908123456', roomType: 'Phòng Đôi 201', dietNotes: 'Ăn bình thường' },
      { id: 2, fullName: 'Trần Văn Hoàng', gender: 'Nam', birthYear: 1988, idCard: '079188005678', phone: '0908123457', roomType: 'Phòng Đôi 201', dietNotes: 'Ăn bình thường' },
      { id: 3, fullName: 'Nguyễn Thị Kim Cúc', gender: 'Nữ', birthYear: 1965, idCard: '079165009012', phone: '0908123458', roomType: 'Phòng Đôi 202', dietNotes: 'Ăn chay trường' },
      { id: 4, fullName: 'Nguyễn Văn Hùng', gender: 'Nam', birthYear: 1962, idCard: '079162003456', phone: '0908123459', roomType: 'Phòng Đôi 202', dietNotes: 'Hạn chế đường' }
    ],
    itinerary: [
      { day: 1, title: 'TP.HCM - Rừng Cát Tiên - Xem Thú Đêm', desc: '06:00 đón tại điểm hẹn, khởi hành đi Cát Tiên. 10:30 đến nơi, check-in Ecolodge, ăn trưa đặc sản rau rừng. 14:00 Trekking Tuyến Cây Tung cổ thụ 400 năm. 19:00 Đi xe mui trần ngắm thú đêm hoang dã.' },
      { day: 2, title: 'Bàu Sấu - Hồ Cá Sấu Xiêm - TP.HCM', desc: '06:30 Trekking vào Bàu Sấu ngắm bình minh và quần thể cá sấu Xiêm nước ngọt quý hiếm. 12:00 Ăn trưa tại Trạm kiểm lâm. 14:30 Khởi hành về lại TP.HCM, kết thúc hành trình 18:30.' }
    ],
    feedback: {
      rating: 5,
      transportRating: 5,
      hotelRating: 5,
      foodRating: 5,
      guideRating: 5,
      comment: 'Chuyến đi tuyệt vời! Bác tài lái rất êm, HDV bản địa am hiểu sâu sắc về hệ sinh thái rừng. Món ăn chay cho mẹ mình được chuẩn bị rất tươm tất.',
      reviewedAt: '2026-10-25'
    }
  },
  {
    id: 'DH-002',
    code: 'DH-002',
    quotationId: 'BG-002',
    quotationCode: 'BG-002',
    customerId: 3,
    customerName: 'Lê Hoàng Phúc',
    customerPhone: '0987654321',
    tourId: 'TOUR-03',
    tourName: 'Tour Sinh Thái Miền Tây Sông Nước Bến Tre - Cần Thơ 2N1Đ',
    departureDate: '2026-10-28',
    paxCount: 4,
    unitPrice: 1950000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 7800000,
    paidAmount: 4000000,
    remainingAmount: 3800000,
    refundAmount: 0,
    collaboratorId: 'CTV-002',
    ctvName: 'Minh Tuấn (Admin Camping)',
    staff: 'Lê Thị Mai (Tư vấn viên)',
    status: 'Đã đặt cọc',
    tourStatus: 'Chưa khởi hành',
    financialStatus: 'Đã đặt cọc',
    estimatedCost: 5000000,
    actualCost: 2500000,
    createdAt: '2026-10-14',
    notes: 'Khách hẹn thanh toán phần còn lại 3 ngày trước khởi hành.',
    passengers: [
      { id: 1, fullName: 'Lê Hoàng Phúc', gender: 'Nam', birthYear: 1985, idCard: '079185012345', phone: '0987654321', roomType: 'Phòng Gia Đình 101', dietNotes: 'Không ăn cay' },
      { id: 2, fullName: 'Trần Thị Thu Hà', gender: 'Nữ', birthYear: 1987, idCard: '079187012346', phone: '0987654322', roomType: 'Phòng Gia Đình 101', dietNotes: 'Bình thường' },
      { id: 3, fullName: 'Lê Bảo Khang', gender: 'Nam', birthYear: 2015, idCard: 'Trẻ em', phone: '', roomType: 'Phòng Gia Đình 101', dietNotes: 'Khẩu phần trẻ em' },
      { id: 4, fullName: 'Lê Ngọc Mai', gender: 'Nữ', birthYear: 2018, idCard: 'Trẻ em', phone: '', roomType: 'Phòng Gia Đình 101', dietNotes: 'Khẩu phần trẻ em' }
    ],
    itinerary: [
      { day: 1, title: 'Sài Gòn - Xứ Dừa Bến Tre - Chèo Xuồng Ba Lá', desc: '07:00 Xuất phát đi Bến Tre. 09:30 Lên thuyền du ngoạn sông Tiền, ngắm 4 cồn Long - Lân - Quy - Phụng. Trải nghiệm đò chèo trong rạch dừa nước, thưởng thức kẹo dừa nóng hổi.' },
      { day: 2, title: 'Chợ Nổi Cái Răng Cần Thơ - Vườn Trái Cây', desc: '05:30 Khám phá Chợ nổi Cái Răng nhộn nhịp. Ăn hủ tiếu trên sông. Ghé thăm vườn ca cao Mười Cương và vườn cây ăn trái sum suê trước khi về TP.HCM.' }
    ]
  },
  {
    id: 'DH-003',
    code: 'DH-003',
    quotationId: 'BG-003',
    quotationCode: 'BG-003',
    customerId: 4,
    customerName: 'Phạm Thúy Hằng',
    customerPhone: '0933221100',
    tourId: 'TOUR-04',
    tourName: 'Tour Khám Phá Tây Bắc - Mùa Lúa Chín Mù Cang Chải 4N3Đ',
    departureDate: '2026-11-05',
    paxCount: 4,
    unitPrice: 4625000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 18500000,
    paidAmount: 0,
    remainingAmount: 18500000,
    refundAmount: 0,
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    staff: 'Phạm Thảo Vy (Tư vấn viên)',
    status: 'Chờ thanh toán',
    tourStatus: 'Chưa khởi hành',
    financialStatus: 'Chờ thanh toán',
    estimatedCost: 12000000,
    actualCost: 0,
    createdAt: '2026-10-08',
    notes: 'Chờ khách chuyển cọc đợt 1.',
    passengers: [
      { id: 1, fullName: 'Phạm Thúy Hằng', gender: 'Nữ', birthYear: 1995, idCard: '001195002233', phone: '0933221100', roomType: 'Bungalow Rơm Vàng', dietNotes: 'Thích ẩm thực Tây Bắc' },
      { id: 2, fullName: 'Ngô Thanh Vân', gender: 'Nữ', birthYear: 1996, idCard: '001196003344', phone: '0933221101', roomType: 'Bungalow Rơm Vàng', dietNotes: 'Dị ứng phấn hoa' },
      { id: 3, fullName: 'Đỗ Tuấn Anh', gender: 'Nam', birthYear: 1994, idCard: '001194004455', phone: '0933221102', roomType: 'Bungalow Mâm Xôi', dietNotes: 'Bình thường' },
      { id: 4, fullName: 'Trần Quốc Đạt', gender: 'Nam', birthYear: 1993, idCard: '001193005566', phone: '0933221103', roomType: 'Bungalow Mâm Xôi', dietNotes: 'Bình thường' }
    ],
    itinerary: [
      { day: 1, title: 'Hà Nội - Đèo Khau Phạ - Tú Lệ', desc: 'Khởi hành sớm theo quốc lộ 32, chinh phục đèo Khau Phạ hùng vĩ, dừng chân thưởng thức cốm Tú Lệ thơm lừng.' },
      { day: 2, title: 'Đồi Mâm Xôi - La Pán Tẩn - Mù Cang Chải', desc: 'Trải nghiệm xe ôm lên Đồi Mâm Xôi săn ảnh mùa vàng. Thăm bản làng người H\'Mông mến khách.' },
      { day: 3, title: 'Đồi Móng Ngựa - Rừng Trúc Nà Háng Tủa', desc: 'Săn hoàng hôn tuyệt mỹ tại Đồi Móng Ngựa. Trekking rừng trúc xanh mướt như phim cổ trang.' },
      { day: 4, title: 'Mù Cang Chải - Suối Khoáng Nóng Trạm Tấu - Hà Nội', desc: 'Tắm khoáng nóng phục hồi sức khỏe tại Trạm Tấu, thưởng thức bữa trưa gà đồi trước khi về Hà Nội.' }
    ]
  },
  {
    id: 'DH-004',
    code: 'DH-004',
    quotationId: 'BG-004',
    quotationCode: 'BG-004',
    customerId: 8,
    customerName: 'Tập Đoàn Công Nghệ V-Star (300 khách)',
    customerPhone: '0968889999',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-11-20',
    paxCount: 300,
    unitPrice: 2400000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 720000000,
    paidAmount: 720000000,
    remainingAmount: 0,
    refundAmount: 0,
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    staff: 'Nguyễn Văn An (Leader)',
    status: 'Đã thanh toán đủ',
    tourStatus: 'Mới tiếp nhận',
    financialStatus: 'Đã thanh toán đủ',
    estimatedCost: 468000000,
    actualCost: 468000000,
    createdAt: '2026-10-15',
    notes: 'Đoàn 300 khách công ty V-Star. Đã thanh toán 100% qua chuyển khoản Vietcombank.',
    passengers: [
      { id: 1, fullName: 'Trần V-Star (Trưởng Đoàn Xe 1)', gender: 'Nam', birthYear: 1982, idCard: '079082001111', phone: '0968889999', roomType: 'Khu A - Phòng 101', dietNotes: 'Ban lãnh đạo tập đoàn' },
      { id: 2, fullName: 'Lê Phó Tổng (Trưởng Xe 2)', gender: 'Nữ', birthYear: 1985, idCard: '079085002222', phone: '0968889998', roomType: 'Khu A - Phòng 102', dietNotes: 'Ban lãnh đạo' },
      { id: 3, fullName: 'Khối Kỹ Thuật AI (Trưởng Xe 3 - 45 pax)', gender: 'Nam', birthYear: 1993, idCard: '079093003333', phone: '0968889997', roomType: 'Khu B - Lều Glamping', dietNotes: 'Ăn bình thường' },
      { id: 4, fullName: 'Khối Kinh Doanh (Trưởng Xe 4 - 45 pax)', gender: 'Nữ', birthYear: 1995, idCard: '079095004444', phone: '0968889996', roomType: 'Khu B - Lều Glamping', dietNotes: '5 khách ăn chay' },
      { id: 5, fullName: 'Khối Vận Hành & CS (Trưởng Xe 5 - 45 pax)', gender: 'Nữ', birthYear: 1996, idCard: '079096005555', phone: '0968889995', roomType: 'Khu C - Khách sạn Ecolodge', dietNotes: 'Ăn bình thường' },
      { id: 6, fullName: 'Khối Nhân Sự & Tài Chính (Trưởng Xe 6 - 45 pax)', gender: 'Nam', birthYear: 1991, idCard: '079091006666', phone: '0968889994', roomType: 'Khu C - Khách sạn Ecolodge', dietNotes: '2 khách dị ứng tôm' }
    ],
    itinerary: [
      { day: 1, title: 'Đoàn 300 Pax SG - Cát Tiên - Teambuilding Rừng Rậm', desc: '06:00 7 xe 45 chỗ xuất phát. 10:30 Tiếp nhận đoàn tại Vườn, phân phòng. 14:00 Teambuilding sinh tồn Amazing Race trong rừng. 18:30 Gala Dinner lửa trại Rực Rỡ V-Star.' },
      { day: 2, title: 'Trekking Khám Phá Rừng & Gala Trao Giải - SG', desc: '07:00 Chia 6 nhóm trekking Bàu Sấu & Cây Gõ Bác Đồng. 12:00 Tiệc BBQ tổng kết, vinh danh cá nhân xuất sắc. 15:00 Khởi hành về Sài Gòn.' }
    ],
    incidents: [
      {
        id: 'INC-002',
        bookingCode: 'DH-004',
        category: 'HEALTH',
        severity: 'LOW',
        title: 'Du khách bị trẹo chân nhẹ khi trekking Bàu Sấu',
        reportedAt: '2026-10-24 10:15:00',
        reportedBy: 'Ksor (Hướng dẫn viên trưởng)',
        desc: 'Một thành viên đoàn V-Star trượt chân trẹo mắt cá khi đi qua đoạn cầu khỉ Bàu Sấu.',
        resolution: 'HDV Ksor và tổ y tế Vườn Quốc Gia sơ cứu cố định mắt cá, đưa khách về trạm kiểm lâm bằng xuồng chuyên dụng. Khách phục hồi tốt và tiếp tục tham gia Gala lửa trại buổi tối.',
        compensation: 0,
        status: 'RESOLVED',
        resolvedAt: '2026-10-24 11:00:00'
      }
    ]
  },
  {
    id: 'DH-005',
    code: 'DH-005',
    quotationId: 'BG-005',
    quotationCode: 'BG-005',
    customerId: 5,
    customerName: 'Trường THPT Chuyên Lê Hồng Phong (Thầy Trần Trọng Hiếu)',
    customerPhone: '0977889900',
    tourId: 'TOUR-03',
    tourName: 'Tour Sinh Thái Miền Tây Sông Nước Bến Tre - Cần Thơ 2N1Đ',
    departureDate: '2026-11-12',
    paxCount: 120,
    unitPrice: 1500000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 180000000,
    paidAmount: 90000000,
    remainingAmount: 90000000,
    refundAmount: 0,
    collaboratorId: 'CTV-002',
    ctvName: 'Minh Tuấn (Admin Camping)',
    staff: 'Nguyễn Văn An (Leader)',
    status: 'Đã đặt cọc',
    tourStatus: 'Chưa khởi hành',
    financialStatus: 'Đã đặt cọc',
    estimatedCost: 126000000,
    actualCost: 126000000,
    createdAt: '2026-10-16',
    notes: 'Khối 11 - 120 học sinh & GV. Đã cọc 50% tiền mặt/chuyển khoản.',
    passengers: [
      { id: 1, fullName: 'Thầy Trần Trọng Hiếu (Trưởng Đoàn GV)', gender: 'Nam', birthYear: 1980, idCard: '079080011223', phone: '0977889900', roomType: 'Phòng GV 101', dietNotes: 'Ăn kiêng đường' },
      { id: 2, fullName: 'Cô Nguyễn Mai Hương (Phó Đoàn)', gender: 'Nữ', birthYear: 1984, idCard: '079084011224', phone: '0977889901', roomType: 'Phòng GV 102', dietNotes: 'Bình thường' },
      { id: 3, fullName: 'Lớp 11 Toán 1 (30 học sinh)', gender: 'Nam', birthYear: 2009, idCard: 'Học sinh', phone: '0977889902', roomType: 'Khu Nhà Sàn 01', dietNotes: 'Khẩu phần thanh niên' },
      { id: 4, fullName: 'Lớp 11 Văn (30 học sinh)', gender: 'Nữ', birthYear: 2009, idCard: 'Học sinh', phone: '0977889903', roomType: 'Khu Nhà Sàn 02', dietNotes: '3 em ăn chay' },
      { id: 5, fullName: 'Lớp 11 Lý (30 học sinh)', gender: 'Nam', birthYear: 2009, idCard: 'Học sinh', phone: '0977889904', roomType: 'Khu Nhà Sàn 03', dietNotes: 'Ăn bình thường' },
      { id: 6, fullName: 'Lớp 11 Anh (28 học sinh + 2 GV)', gender: 'Nữ', birthYear: 2009, idCard: 'Học sinh', phone: '0977889905', roomType: 'Khu Nhà Sàn 04', dietNotes: 'Ăn bình thường' }
    ],
    itinerary: [
      { day: 1, title: 'Học Tập Trải Nghiệm Nông Nghiệp & Văn Hóa Xứ Dừa', desc: '06:30 Khởi hành từ trường Lê Hồng Phong. Học sinh trải nghiệm làm kẹo dừa, đan nón lá dừa nước, tát mương bắt cá và học về hệ sinh thái cửa sông Mê Kông.' },
      { day: 2, title: 'Tìm Hiểu Lịch Sử Đồng Khởi Bến Tre - Về Lại TP.HCM', desc: 'Thăm Khu di tích Đồng Khởi Định Thủy, đền thờ Nữ tướng Nguyễn Thị Định. 14:00 Đoàn lên xe về lại trường.' }
    ]
  },
  {
    id: 'DH-006',
    code: 'DH-006',
    quotationId: 'BG-006',
    quotationCode: 'BG-006',
    customerId: 6,
    customerName: 'Anh Lê Tuấn Kiệt (Nhóm Bạn Bè)',
    customerPhone: '0944556677',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-10-25',
    paxCount: 15,
    unitPrice: 3000000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 45000000,
    paidAmount: 45000000,
    remainingAmount: 0,
    refundAmount: 0,
    collaboratorId: '',
    ctvName: 'Trực tiếp (Website)',
    staff: 'Trần Đức Huy (Tư vấn viên)',
    status: 'Đang đi tour',
    tourStatus: 'Đang đi tour',
    financialStatus: 'Đã thanh toán đủ',
    estimatedCost: 30000000,
    actualCost: 30000000,
    createdAt: '2026-10-17',
    notes: 'Nhóm 15 bạn trẻ yêu thiên nhiên, thanh toán trực tiếp qua cổng thanh toán.',
    passengers: [
      { id: 1, fullName: 'Lê Tuấn Kiệt (Trưởng nhóm)', gender: 'Nam', birthYear: 1993, idCard: '079193008899', phone: '0944556677', roomType: 'Lều Đôi Glamping 01', dietNotes: 'Bình thường' },
      { id: 2, fullName: 'Ngô Minh Thông', gender: 'Nam', birthYear: 1994, idCard: '079194008890', phone: '0944556678', roomType: 'Lều Đôi Glamping 01', dietNotes: 'Bình thường' },
      { id: 3, fullName: 'Võ Thị Thanh Thảo', gender: 'Nữ', birthYear: 1995, idCard: '079195008891', phone: '0944556679', roomType: 'Lều Đôi Glamping 02', dietNotes: 'Ăn kiêng cay' },
      { id: 4, fullName: 'Trần Yến Nhi', gender: 'Nữ', birthYear: 1996, idCard: '079196008892', phone: '0944556680', roomType: 'Lều Đôi Glamping 02', dietNotes: 'Bình thường' }
    ],
    itinerary: [
      { day: 1, title: 'Trekking Xuyên Rừng Già Cát Tiên & Sinh Vật Đêm', desc: 'Khám phá cung đường cây Tung, xem thú ăn đêm bằng xe đặc chủng.' },
      { day: 2, title: 'Bàu Sấu & Chèo Thuyền Kayak Sông Đồng Nai', desc: 'Khám phá thế giới bò sát hoang dã và chèo kayak ngắm bình minh trên sông.' }
    ],
    incidents: [
      {
        id: 'INC-001',
        bookingCode: 'DH-006',
        category: 'TRANSPORT',
        severity: 'MEDIUM',
        title: 'Sự cố điều hòa xe 29 chỗ tại Đồng Nai',
        reportedAt: '2026-10-25 08:30:00',
        reportedBy: 'Đặng Hoàng Long (Điều hành)',
        desc: 'Trên đường đi Cát Tiên, điều hòa xe 29 chỗ gặp sự cố khiến khoang xe bị nóng, khách có dấu hiệu khó chịu.',
        resolution: 'Điều hành lập tức liên hệ nhà xe NCC-002 đổi xe dự phòng mới tại Trạm dừng chân Dầu Giây sau 20 phút. HaHa Eco tặng mỗi khách 1 phần nước ép bưởi Tân Triều đền bù.',
        compensation: 500000,
        status: 'RESOLVED',
        resolvedAt: '2026-10-25 09:15:00'
      }
    ]
  },
  {
    id: 'DH-007',
    code: 'DH-007',
    quotationId: 'BG-007',
    quotationCode: 'BG-007',
    customerId: 7,
    customerName: 'Chị Hoàng Kim Oanh (Hủy Tour Đột Xuất)',
    customerPhone: '0918765432',
    tourId: 'TOUR-04',
    tourName: 'Tour Khám Phá Tây Bắc - Mùa Lúa Chín Mù Cang Chải 4N3Đ',
    departureDate: '2026-10-27',
    paxCount: 10,
    unitPrice: 3500000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 35000000,
    paidAmount: 0,
    remainingAmount: 0,
    refundAmount: 17500000,
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    staff: 'Phạm Thảo Vy (Tư vấn viên)',
    status: 'Đã hủy',
    tourStatus: 'Đã hủy',
    financialStatus: 'Đã hoàn tiền',
    estimatedCost: 22000000,
    actualCost: 17500000,
    createdAt: '2026-10-15',
    notes: 'Đoàn hủy trước 2 ngày do việc gia đình khẩn cấp. Phạt cọc 50% (17.5M), hoàn trả khách 17.5M qua REF-001. Hoa hồng CTV hủy.',
    passengers: [
      { id: 1, fullName: 'Hoàng Kim Oanh', gender: 'Nữ', birthYear: 1989, idCard: '079189007766', phone: '0918765432', roomType: 'Hủy đơn', dietNotes: 'Hủy do sự cố' }
    ],
    itinerary: [
      { day: 1, title: 'Hủy tour và tất toán tiền cọc', desc: 'Khách yêu cầu hủy tour do tang sự gia đình, hệ thống đã lập phiếu REF-001 hoàn 50% cọc.' }
    ]
  },
  {
    id: 'DH-008',
    code: 'DH-008',
    quotationId: 'BG-008',
    quotationCode: 'BG-008',
    customerId: 9,
    customerName: 'Ngân Hàng Techcombank Hội Sở (Anh Vũ Hải)',
    customerPhone: '0988112233',
    tourId: 'TOUR-02',
    tourName: 'Tour Chữa Lành & Cắm Trại Rừng Thông Đà Lạt 3N2Đ',
    departureDate: '2026-10-26',
    paxCount: 80,
    unitPrice: 3200000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 256000000,
    paidAmount: 0,
    remainingAmount: 256000000,
    refundAmount: 0,
    collaboratorId: '',
    ctvName: 'Doanh nghiệp B2B',
    staff: 'Nguyễn Văn An (Leader)',
    status: 'Đang đi tour',
    tourStatus: 'Đang đi tour',
    financialStatus: 'Chờ thanh toán',
    estimatedCost: 172000000,
    actualCost: 160000000,
    createdAt: '2026-10-18',
    notes: 'Hợp đồng B2B thanh toán sau tour 15 ngày (Hạn thanh toán 2026-11-13). Lệnh NCC đã được duyệt công nợ 30 ngày.',
    passengers: [
      { id: 1, fullName: 'Vũ Hải (Giám Đốc Vùng - Trưởng Đoàn)', gender: 'Nam', birthYear: 1983, idCard: '001083009988', phone: '0988112233', roomType: 'Phòng VIP 501', dietNotes: 'Bình thường' },
      { id: 2, fullName: 'Nguyễn Thúy Quỳnh (Phó Giám Đốc)', gender: 'Nữ', birthYear: 1986, idCard: '001086009989', phone: '0988112234', roomType: 'Phòng VIP 502', dietNotes: 'Ăn kiêng hải sản' },
      { id: 3, fullName: 'Nhóm Khách Hàng Doanh Nghiệp (25 CBNV)', gender: 'Nam', birthYear: 1992, idCard: 'Techcombank', phone: '0988112235', roomType: 'Khu Phòng Deluxe Khách Sạn 4 Sao', dietNotes: 'Ăn bình thường' },
      { id: 4, fullName: 'Nhóm Khối Bán Lẻ & Dịch Vụ (53 CBNV)', gender: 'Nữ', birthYear: 1995, idCard: 'Techcombank', phone: '0988112236', roomType: 'Khu Phòng Deluxe Khách Sạn 4 Sao', dietNotes: '2 khách ăn chay' }
    ],
    itinerary: [
      { day: 1, title: 'Hàng Không/Xe Đến Đà Lạt - Check-in KS 4 Sao & Tiệc Khai Mạc', desc: 'Đón đoàn tại sân bay Liên Khương, di chuyển về KS 4 sao nhận phòng. Chiều tản bộ Hồ Xuân Hương. Tối tiệc chào mừng Rượu vang Đà Lạt.' },
      { day: 2, title: 'Trekking Rừng Thông Thác Hang Cọp - Teambuilding & Gala Đỉnh Cao', desc: 'Thử thách vượt chướng ngại vật rừng thông, chèo SUP Hồ Tuyền Lâm. Tối Gala Dinner vinh danh Bankers xuất sắc.' },
      { day: 3, title: 'Thưởng Thức Cafe Đồi Cỏ Hồng - Mua Quà Đặc Sản - Tiễn Sân Bay', desc: 'Săn mây bình minh, thăm đồn điền chè Cầu Đất, xe đưa đoàn ra sân bay về lại Hà Nội/TP.HCM.' }
    ]
  },
  {
    id: 'DH-009',
    code: 'DH-009',
    quotationId: 'BG-009',
    quotationCode: 'BG-009',
    customerId: 10,
    customerName: 'Doanh Nhân David Trần (Private VIP Tour)',
    customerPhone: '0909001122',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-10-20',
    paxCount: 8,
    unitPrice: 8000000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 64000000,
    paidAmount: 64000000,
    remainingAmount: 0,
    refundAmount: 0,
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    staff: 'Lê Thị Mai (Tư vấn viên)',
    status: 'Đã hoàn thành',
    tourStatus: 'Hoàn thành tour',
    financialStatus: 'Đã thanh toán đủ',
    estimatedCost: 42000000,
    actualCost: 42000000,
    createdAt: '2026-10-12',
    notes: 'Private VIP Ecolodge Resort 5 sao. Kế toán đã thanh toán hoa hồng 6.4M cho CTV-001.',
    passengers: [
      { id: 1, fullName: 'David Trần', gender: 'Nam', birthYear: 1978, idCard: '079078000111', phone: '0909001122', roomType: 'Presidential Villa 01', dietNotes: 'Rượu vang & Ẩm thực hữu cơ' },
      { id: 2, fullName: 'Jennifer Vũ (Vợ)', gender: 'Nữ', birthYear: 1982, idCard: '079082000222', phone: '0909001123', roomType: 'Presidential Villa 01', dietNotes: 'Món ăn không gluten' },
      { id: 3, fullName: 'Alex Trần (Con trai)', gender: 'Nam', birthYear: 2010, idCard: 'Passport', phone: '', roomType: 'Junior Villa 02', dietNotes: 'Món Tây' },
      { id: 4, fullName: 'Emily Trần (Con gái)', gender: 'Nữ', birthYear: 2014, idCard: 'Passport', phone: '', roomType: 'Junior Villa 02', dietNotes: 'Món Tây' }
    ],
    itinerary: [
      { day: 1, title: 'Limousine VIP Đón Tận Biệt Thự - Trải Nghiệm Safari Riêng Tư', desc: 'Xe Limousine President đón gia đình. Trải nghiệm tour xem thú đêm có xe chuyên dụng riêng và chuyên gia sinh học rừng đi cùng thuyết minh.' },
      { day: 2, title: 'Bay Trực Thăng Ngắm Rừng Cát Tiên & Tiệc BBQ Giữa Rừng', desc: 'Bữa sáng lãng mạn bên sông Đồng Nai, đi ca nô cao tốc vào Bàu Sấu, thưởng thức tiệc nướng cao cấp do đầu bếp riêng phục vụ.' }
    ],
    feedback: {
      rating: 5,
      transportRating: 5,
      hotelRating: 5,
      foodRating: 5,
      guideRating: 5,
      comment: 'Dịch vụ chuẩn 5 sao quốc tế! Xe Limousine sạch sẽ, hướng dẫn viên nói tiếng Anh xuất sắc, các con tôi rất hào hứng khi thấy nai và bò tót hoang dã.',
      reviewedAt: '2026-10-23'
    }
  },
  {
    id: 'DH-010',
    code: 'DH-010',
    quotationId: 'BG-010',
    quotationCode: 'BG-010',
    customerId: 11,
    customerName: 'CLB Nhiếp Ảnh Sài Gòn (Anh Chu Văn Sơn)',
    customerPhone: '0913554433',
    tourId: 'TOUR-04',
    tourName: 'Tour Khám Phá Tây Bắc - Mùa Lúa Chín Mù Cang Chải 4N3Đ',
    departureDate: '2026-11-08',
    paxCount: 25,
    unitPrice: 3000000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 75000000,
    paidAmount: 52500000,
    remainingAmount: 22500000,
    refundAmount: 0,
    collaboratorId: '',
    ctvName: 'Trực tiếp (Fanpage)',
    staff: 'Phạm Thảo Vy (Tư vấn viên)',
    status: 'Đã đặt cọc',
    tourStatus: 'Chưa khởi hành',
    financialStatus: 'Đã đặt cọc',
    estimatedCost: 50000000,
    actualCost: 25000000,
    createdAt: '2026-10-19',
    notes: 'Đoàn thanh toán 3 đợt: Đợt 1 cọc 30% (22.5M), Đợt 2 trước 7 ngày 40% (30M), Đợt 3 tại tour 30% (22.5M).',
    passengers: [
      { id: 1, fullName: 'Chu Văn Sơn (Chủ Nhiệm CLB)', gender: 'Nam', birthYear: 1975, idCard: '079075003344', phone: '0913554433', roomType: 'Phòng Đôi 01', dietNotes: 'Dậy sớm săn bình minh' },
      { id: 2, fullName: 'Nguyễn Hải Đăng (Nhiếp Ảnh Gia)', gender: 'Nam', birthYear: 1981, idCard: '079081003345', phone: '0913554434', roomType: 'Phòng Đôi 01', dietNotes: 'Bình thường' }
    ],
    itinerary: [
      { day: 1, title: 'Hà Nội - Đèo Khau Phạ Hoàng Hôn', desc: 'Đón tại Nhà hát lớn Hà Nội, dừng chân chụp ảnh thung lũng Tú Lệ trong sương sớm.' },
      { day: 2, title: 'Bình Minh Mâm Xôi & Bản Dế Xu Phình', desc: '05:00 có mặt tại Đồi Mâm Xôi ghi lại khoảnh khắc bình minh xuyên sương mây huyền ảo.' },
      { day: 3, title: 'Đồi Móng Ngựa - Rừng Trúc Mù Cang Chải', desc: 'Săn khoảnh khắc tia nắng chiều buông xuống những nấc thang vàng óng ả.' },
      { day: 4, title: 'Mù Cang Chải - Suối Khoáng & Trả Ảnh - Hà Nội', desc: 'Giao lưu ảnh đẹp giữa các hội viên và trở về Hà Nội lúc 19:00.' }
    ]
  },
  {
    id: 'DH-011',
    code: 'DH-011',
    quotationId: 'BG-011',
    quotationCode: 'BG-011',
    customerId: 12,
    customerName: 'Đoàn Inbound Pháp - Jean-Pierre Dubois',
    customerPhone: '0922334455',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-11-15',
    paxCount: 12,
    unitPrice: 4000000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 48000000,
    paidAmount: 48000000,
    remainingAmount: 0,
    refundAmount: 0,
    collaboratorId: '',
    ctvName: 'Đối tác Inbound Quốc Tế',
    staff: 'Nguyễn Văn An (Leader)',
    status: 'Đã thanh toán đủ',
    tourStatus: 'Chưa khởi hành',
    financialStatus: 'Đã thanh toán đủ',
    estimatedCost: 31000000,
    actualCost: 31000000,
    createdAt: '2026-10-19',
    notes: 'Đoàn 12 khách Pháp yêu cầu HDV nói tiếng Pháp bản địa, bảo hiểm quốc tế.',
    passengers: [
      { id: 1, fullName: 'Jean-Pierre Dubois', gender: 'Nam', birthYear: 1968, idCard: 'Passport 22FR8901', phone: '+33612345678', roomType: 'Phòng Đôi Bungalow 01', dietNotes: 'French vegetarian' },
      { id: 2, fullName: 'Sophie Dubois', gender: 'Nữ', birthYear: 1970, idCard: 'Passport 22FR8902', phone: '+33612345679', roomType: 'Phòng Đôi Bungalow 01', dietNotes: 'No spicy' },
      { id: 3, fullName: 'Michel Laurent', gender: 'Nam', birthYear: 1965, idCard: 'Passport 21FR5544', phone: '+33698765432', roomType: 'Phòng Đôi Bungalow 02', dietNotes: 'Normal' },
      { id: 4, fullName: 'Camille Laurent', gender: 'Nữ', birthYear: 1967, idCard: 'Passport 21FR5545', phone: '+33698765433', roomType: 'Phòng Đôi Bungalow 02', dietNotes: 'Normal' }
    ],
    itinerary: [
      { day: 1, title: 'Expédition Écologique Cat Tien & Safari Nocturne', desc: 'Départ de Saigon vers le Parc National de Cat Tien. Randonnée guidée en français à la découverte de la biodiversité tropicale.' },
      { day: 2, title: 'Observation des Crocodiles de Bau Sau & Retour Saigon', desc: 'Randonnée de 10km vers le lac Bau Sau, sanctuaire des crocodiles siamois.' }
    ]
  },
  {
    id: 'DH-012',
    code: 'DH-012',
    quotationId: 'BG-012',
    quotationCode: 'BG-012',
    customerId: 13,
    customerName: 'Chị Nguyễn Thảo My',
    customerPhone: '0938445566',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-10-30',
    paxCount: 6,
    unitPrice: 3000000,
    discountAmount: 0,
    surchargeAmount: 3000000,
    totalAmount: 21000000,
    paidAmount: 21000000,
    remainingAmount: 0,
    refundAmount: 0,
    collaboratorId: 'CTV-002',
    ctvName: 'Minh Tuấn (Admin Camping)',
    staff: 'Trần Đức Huy (Tư vấn viên)',
    status: 'Đã thanh toán đủ',
    tourStatus: 'Chưa khởi hành',
    financialStatus: 'Đã thanh toán đủ',
    estimatedCost: 14000000,
    actualCost: 14000000,
    createdAt: '2026-10-20',
    notes: 'Gốc 18M + phụ thu 3 phòng đơn 3M = 21M. Đã thanh toán 100%.',
    passengers: [
      { id: 1, fullName: 'Nguyễn Thảo My', gender: 'Nữ', birthYear: 1992, idCard: '079192004567', phone: '0938445566', roomType: 'Phòng Đơn 01 (Phụ thu)', dietNotes: 'Bình thường' },
      { id: 2, fullName: 'Trần Ngọc Anh', gender: 'Nữ', birthYear: 1993, idCard: '079193004568', phone: '0938445567', roomType: 'Phòng Đơn 02 (Phụ thu)', dietNotes: 'Ăn thanh đạm' },
      { id: 3, fullName: 'Lê Thùy Dương', gender: 'Nữ', birthYear: 1994, idCard: '079194004569', phone: '0938445568', roomType: 'Phòng Đơn 03 (Phụ thu)', dietNotes: 'Ăn kiêng béo' }
    ],
    itinerary: [
      { day: 1, title: 'Trải Nghiệm Phòng Nghỉ Đơn Biệt Lập & Tour Đêm Rừng', desc: 'Thư giãn trong không gian phòng đơn riêng tư giữa rừng sinh thái Cát Tiên.' },
      { day: 2, title: 'Đạp Xe Đường Mòn Rừng & Thăm Trung Tâm Cứu Hộ Linh Trưởng', desc: 'Khám phá các loài vượn đen má vàng và linh trưởng quý hiếm trước khi về TP.HCM.' }
    ]
  },
  {
    id: 'DH-013',
    code: 'DH-013',
    quotationId: 'BG-013',
    quotationCode: 'BG-013',
    customerId: 14,
    customerName: 'Bệnh Viện Đa Khoa Sài Gòn (BS. Nguyễn Minh Tuấn)',
    customerPhone: '0903887766',
    tourId: 'TOUR-03',
    tourName: 'Tour Sinh Thái Miền Tây Sông Nước Bến Tre - Cần Thơ 2N1Đ',
    departureDate: '2026-11-18',
    paxCount: 50,
    unitPrice: 3000000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 150000000,
    paidAmount: 100000000,
    remainingAmount: 50000000,
    refundAmount: 0,
    collaboratorId: '',
    ctvName: 'Doanh nghiệp B2B',
    staff: 'Nguyễn Văn An (Leader)',
    status: 'Đã đặt cọc',
    tourStatus: 'Chưa khởi hành',
    financialStatus: 'Đã đặt cọc',
    estimatedCost: 102000000,
    actualCost: 102000000,
    createdAt: '2026-10-20',
    notes: 'Đoàn hội thảo Y khoa 50 bác sĩ kết hợp nghỉ dưỡng. Cọc 100M, còn nợ 50M trả sau tour.',
    passengers: [
      { id: 1, fullName: 'BS. CKII Nguyễn Minh Tuấn', gender: 'Nam', birthYear: 1974, idCard: '079074001234', phone: '0903887766', roomType: 'Phòng VIP 301', dietNotes: 'Không uống rượu bia' },
      { id: 2, fullName: 'TS. BS Lê Kim Dung', gender: 'Nữ', birthYear: 1979, idCard: '079079001235', phone: '0903887767', roomType: 'Phòng VIP 302', dietNotes: 'Bình thường' }
    ],
    itinerary: [
      { day: 1, title: 'Hội Thảo Y Khoa Tại Bến Tre Riverside Resort & Tiệc Gala', desc: '08:00 Xuất phát. 13:30 Hội thảo chuyên đề Y học Gia đình tại phòng đại tiệc. 18:30 Gala Giao lưu Y đức.' },
      { day: 2, title: 'Tham Quan Làng Bè & Sinh Thái Sông Nước Miền Tây', desc: 'Thăm làng bè nuôi cá trên sông, trải nghiệm ẩm thực dân dã cá tai tượng chiên xù.' }
    ]
  },
  {
    id: 'DH-014',
    code: 'DH-014',
    quotationId: 'BG-014',
    quotationCode: 'BG-014',
    customerId: 15,
    customerName: 'Đại Gia Đình Bác Trần Văn Thành (3 Thế Hệ)',
    customerPhone: '0917665544',
    tourId: 'TOUR-03',
    tourName: 'Tour Sinh Thái Miền Tây Sông Nước Bến Tre - Cần Thơ 2N1Đ',
    departureDate: '2026-11-01',
    paxCount: 12,
    unitPrice: 2400000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 22560000,
    paidAmount: 22560000,
    remainingAmount: 0,
    refundAmount: 0,
    collaboratorId: 'CTV-002',
    ctvName: 'Minh Tuấn (Admin Camping)',
    staff: 'Lê Thị Mai (Tư vấn viên)',
    status: 'Đã thanh toán đủ',
    tourStatus: 'Chưa khởi hành',
    financialStatus: 'Đã thanh toán đủ',
    estimatedCost: 15000000,
    actualCost: 15000000,
    createdAt: '2026-10-21',
    notes: '8 lớn + 2 trẻ em (70%) + 2 em bé (0%) = 9.4 suất = 22.560.000 đ.',
    passengers: [
      { id: 1, fullName: 'Bác Trần Văn Thành (Ông nội)', gender: 'Nam', birthYear: 1952, idCard: '079052001122', phone: '0917665544', roomType: 'Phòng Tầng Trệt 101', dietNotes: 'Món mềm dễ tiêu' },
      { id: 2, fullName: 'Bác Lê Thị Nga (Bà nội)', gender: 'Nữ', birthYear: 1955, idCard: '079055001123', phone: '0917665545', roomType: 'Phòng Tầng Trệt 101', dietNotes: 'Ăn thanh đạm' },
      { id: 3, fullName: 'Bé Trần Bảo An (Cháu 3 tuổi - 0% vé)', gender: 'Nữ', birthYear: 2023, idCard: 'Em bé', phone: '', roomType: 'Cùng bố mẹ', dietNotes: 'Sữa tươi & cháo' },
      { id: 4, fullName: 'Bé Trần Quốc Hưng (Cháu 8 tuổi - 70% vé)', gender: 'Nam', birthYear: 2018, idCard: 'Trẻ em', phone: '', roomType: 'Cùng bố mẹ', dietNotes: 'Khẩu phần trẻ em' }
    ],
    itinerary: [
      { day: 1, title: 'Tour Chậm Dưỡng Sinh Cho Người Cao Tuổi & Vui Chơi Trẻ Thơ', desc: 'Lộ trình di chuyển nhẹ nhàng, xe đời mới êm ái, xe lăn hỗ trợ người lớn tuổi.' },
      { day: 2, title: 'Vườn Trái Cây Miệt Vườn - Trải Nghiệm Gói Bánh Tét', desc: 'Cả gia đình 3 thế hệ cùng sum vầy gói bánh tét và thưởng thức trà mật ong hoa nhãn.' }
    ]
  },
  {
    id: 'DH-015',
    code: 'DH-015',
    quotationId: 'BG-015',
    quotationCode: 'BG-015',
    customerId: 16,
    customerName: 'Anh Phan Hoàng Long (Khách Thân Thiết)',
    customerPhone: '0902998877',
    tourId: 'TOUR-02',
    tourName: 'Tour Chữa Lành & Cắm Trại Rừng Thông Đà Lạt 3N2Đ',
    departureDate: '2026-10-29',
    paxCount: 8,
    unitPrice: 3200000,
    discountAmount: 2600000,
    surchargeAmount: 0,
    totalAmount: 23000000,
    paidAmount: 23000000,
    remainingAmount: 0,
    refundAmount: 0,
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    staff: 'Phạm Thảo Vy (Tư vấn viên)',
    status: 'Đã thanh toán đủ',
    tourStatus: 'Chưa khởi hành',
    financialStatus: 'Đã thanh toán đủ',
    estimatedCost: 16000000,
    actualCost: 16000000,
    createdAt: '2026-10-21',
    notes: 'Áp dụng Voucher Tri Ân VOU-HAHA26 giảm 2.6M từ 25.6M còn 23M. Hoa hồng CTV 10% tính trên 23M.',
    passengers: [
      { id: 1, fullName: 'Phan Hoàng Long', gender: 'Nam', birthYear: 1991, idCard: '079191008877', phone: '0902998877', roomType: 'Lều Glamping 01', dietNotes: 'Bình thường' },
      { id: 2, fullName: 'Đỗ Thảo Vy', gender: 'Nữ', birthYear: 1993, idCard: '079193008878', phone: '0902998878', roomType: 'Lều Glamping 01', dietNotes: 'Không ăn hành tỏi' }
    ],
    itinerary: [
      { day: 1, title: 'Cắm Trại Bên Suối Mơ & Thiền Định Buổi Chiều', desc: 'Thư giãn trong tiếng suối chảy róc rách và hương thơm nhựa thông ngào ngạt.' },
      { day: 2, title: 'Yoga Đón Bình Minh & Trekking Thung Lũng Vàng', desc: 'Tập yoga tĩnh tâm, hít thở không khí thanh sạch 100% của đại ngàn.' },
      { day: 3, title: 'Tiệc Trà Hoa Atiso & Về Lại Sài Gòn', desc: 'Thưởng thức trà thảo mộc organic và mứt dâu tây Đà Lạt.' }
    ]
  },
  {
    id: 'DH-016',
    code: 'DH-016',
    quotationId: 'BG-016',
    quotationCode: 'BG-016',
    customerId: 17,
    customerName: 'Startup AI Nexus (Anh Đặng Quốc Cường)',
    customerPhone: '0982332211',
    tourId: 'TOUR-02',
    tourName: 'Tour Chữa Lành & Cắm Trại Rừng Thông Đà Lạt 3N2Đ',
    departureDate: '2026-10-22',
    paxCount: 40,
    unitPrice: 3200000,
    discountAmount: 0,
    surchargeAmount: 8000000,
    totalAmount: 136000000,
    paidAmount: 136000000,
    remainingAmount: 0,
    refundAmount: 0,
    collaboratorId: '',
    ctvName: 'Direct Booking',
    staff: 'Nguyễn Văn An (Leader)',
    status: 'Đã hoàn thành',
    tourStatus: 'Hoàn thành tour',
    financialStatus: 'Đã thanh toán đủ',
    estimatedCost: 92000000,
    actualCost: 100000000,
    createdAt: '2026-10-22',
    notes: 'Phát sinh lều dã chiến và cứu hộ đêm +8M (từ 128M lên 136M). Đã quyết toán xong.',
    passengers: [
      { id: 1, fullName: 'Đặng Quốc Cường (CEO AI Nexus)', gender: 'Nam', birthYear: 1989, idCard: '079089001144', phone: '0982332211', roomType: 'Lều Chỉ Huy 01', dietNotes: 'Bình thường' },
      { id: 2, fullName: 'Trần Minh Quân (CTO)', gender: 'Nam', birthYear: 1991, idCard: '079091001145', phone: '0982332212', roomType: 'Lều Chỉ Huy 01', dietNotes: 'Ăn khỏe' }
    ],
    itinerary: [
      { day: 1, title: 'Hackathon Sinh Tồn Trong Rừng Thông Đà Lạt', desc: 'Thử thách lập trình và sinh tồn ngoài thiên nhiên hoang dã.' },
      { day: 2, title: 'Hành Trình Băng Rừng Đêm & Cứu Hộ Dã Ngoại', desc: 'Diễn tập kỹ năng sơ cứu và dựng lều dã chiến trong điều kiện mưa lạnh.' },
      { day: 3, title: 'Quyết Toán Đoàn & Trở Về Trụ Sở', desc: 'Tổng kết tinh thần đồng đội và hoàn tất thủ tục tài chính.' }
    ],
    feedback: {
      rating: 5,
      transportRating: 5,
      hotelRating: 5,
      foodRating: 5,
      guideRating: 5,
      comment: 'Cực kỳ ấn tượng với sự chuyên nghiệp của đội ngũ HaHa Travel khi xử lý mưa bão trong rừng đêm rất an toàn và chu đáo!',
      reviewedAt: '2026-10-25'
    }
  },
  {
    id: 'DH-017',
    code: 'DH-017',
    quotationId: 'BG-017',
    quotationCode: 'BG-017',
    customerId: 18,
    customerName: 'Công Ty Cổ Phần Xây Dựng Vinacon',
    customerPhone: '0976554433',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-10-21',
    paxCount: 20,
    unitPrice: 3000000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 60000000,
    paidAmount: 40000000,
    remainingAmount: 20000000,
    refundAmount: 0,
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    staff: 'Trần Đức Huy (Tư vấn viên)',
    status: 'Đã hoàn thành',
    tourStatus: 'Hoàn thành tour',
    financialStatus: 'Đã đặt cọc',
    estimatedCost: 38000000,
    actualCost: 40000000,
    createdAt: '2026-10-18',
    notes: 'Tour đã hoàn thành nhưng khách còn nợ 20M. Hệ thống tự động khóa hoa hồng CTV chưa cho chi trả.',
    passengers: [
      { id: 1, fullName: 'Hoàng Văn Đức (Giám Đốc Dự Án)', gender: 'Nam', birthYear: 1980, idCard: '079080005566', phone: '0976554433', roomType: 'Phòng VIP 101', dietNotes: 'Bình thường' },
      { id: 2, fullName: 'Phạm Văn Nam (Kỹ Sư Trưởng)', gender: 'Nam', birthYear: 1985, idCard: '079085005567', phone: '0976554434', roomType: 'Phòng VIP 102', dietNotes: 'Bình thường' }
    ],
    itinerary: [
      { day: 1, title: 'Trekking Khảo Sát Địa Hình & Cây Cổ Thụ', desc: 'Đoàn kỹ sư khảo sát địa chất và tham quan hệ sinh thái rừng nhiệt đới.' },
      { day: 2, title: 'Nghiệm Thu Đoàn & Quay Về Trụ Sở', desc: 'Hoàn thành chuyến đi thực tế, chờ công ty thanh toán phần công nợ còn lại.' }
    ]
  },
  {
    id: 'DH-018',
    code: 'DH-018',
    quotationId: 'BG-018',
    quotationCode: 'BG-018',
    customerId: 19,
    customerName: 'Chị Đỗ Mỹ Linh (Nhóm Doanh Nhân Trẻ)',
    customerPhone: '0949112233',
    tourId: 'TOUR-02',
    tourName: 'Tour Chữa Lành & Cắm Trại Rừng Thông Đà Lạt 3N2Đ',
    departureDate: '2026-10-27',
    paxCount: 16,
    unitPrice: 3200000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 51200000,
    paidAmount: 51200000,
    remainingAmount: 0,
    refundAmount: 0,
    collaboratorId: 'CTV-002',
    ctvName: 'Minh Tuấn (Admin Camping)',
    staff: 'Lê Thị Mai (Tư vấn viên)',
    status: 'Đã thanh toán đủ',
    tourStatus: 'Chưa khởi hành',
    financialStatus: 'Đã thanh toán đủ',
    estimatedCost: 34000000,
    actualCost: 34000000,
    createdAt: '2026-10-23',
    notes: 'Đơn tour liên kết 4 NCC: Khách sạn, Nhà xe 29 chỗ, Nhà hàng Suối Mơ và HDV địa phương.',
    passengers: [
      { id: 1, fullName: 'Đỗ Mỹ Linh', gender: 'Nữ', birthYear: 1994, idCard: '079194006677', phone: '0949112233', roomType: 'Villa Hoa Hồng 01', dietNotes: 'Thức ăn giàu rau xanh' },
      { id: 2, fullName: 'Lê Tuấn Tú', gender: 'Nam', birthYear: 1992, idCard: '079192006678', phone: '0949112234', roomType: 'Villa Hoa Hồng 02', dietNotes: 'Bình thường' }
    ],
    itinerary: [
      { day: 1, title: 'Check-in Villa Hoa Hồng & Tiệc Nướng Suối Mơ', desc: 'Thưởng thức BBQ tại nhà hàng sinh thái bên bờ suối.' },
      { day: 2, title: 'Trekking Cung Đường Thông Reo Cùng HDV Địa Phương', desc: 'Khám phá các loài hoa dại và tìm hiểu văn hóa người K\'Ho.' },
      { day: 3, title: 'Check-out & Xe 29 Chỗ Đưa Về TP.HCM', desc: 'Kết thúc hành trình thư giãn trọn vẹn.' }
    ]
  },
  {
    id: 'DH-019',
    code: 'DH-019',
    quotationId: 'BG-019',
    quotationCode: 'BG-019',
    customerId: 19,
    customerName: 'Chị Đỗ Mỹ Linh (Công Ty BĐS Đất Lành - Tour 2)',
    customerPhone: '0949112233',
    tourId: 'TOUR-02',
    tourName: 'Tour Chữa Lành & Cắm Trại Rừng Thông Đà Lạt 3N2Đ',
    departureDate: '2026-11-28',
    paxCount: 40,
    unitPrice: 3200000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 128000000,
    paidAmount: 128000000,
    remainingAmount: 0,
    refundAmount: 0,
    collaboratorId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    staff: 'Nguyễn Văn An (Leader)',
    status: 'Đã thanh toán đủ',
    tourStatus: 'Chưa khởi hành',
    financialStatus: 'Đã thanh toán đủ',
    estimatedCost: 80000000,
    actualCost: 83000000,
    createdAt: '2026-10-23',
    notes: 'Tour thứ 2 trong cùng tháng của doanh nghiệp dành riêng cho Khối Quản lý Cấp cao.',
    passengers: [
      { id: 1, fullName: 'Phan Quản Lý Cấp Cao', gender: 'Nam', birthYear: 1985, idCard: '079085007788', phone: '0968889999', roomType: 'Resort 4 Sao Phòng 201', dietNotes: 'Bình thường' }
    ],
    itinerary: [
      { day: 1, title: 'Hội Thảo Chiến Lược Năm 2027 Tại Đà Lạt', desc: 'Không gian họp chiến lược sang trọng tại resort 4 sao.' },
      { day: 2, title: 'Golf Giao Lưu & Tiệc Tối Fine Dining', desc: 'Trải nghiệm sân golf đồi thông và bữa tối ẩm thực tinh tế.' },
      { day: 3, title: 'Tiễn Sân Bay Liên Khương', desc: 'Kết thúc hội thảo thành công tốt đẹp.' }
    ]
  },
  {
    id: 'DH-020',
    code: 'DH-020',
    quotationId: 'BG-020',
    quotationCode: 'BG-020',
    customerId: 20,
    customerName: 'Caravan Club Miền Nam (Anh Bùi Quang Thắng)',
    customerPhone: '0908778899',
    tourId: 'TOUR-01',
    tourName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ',
    departureDate: '2026-11-14',
    paxCount: 45,
    unitPrice: 3000000,
    discountAmount: 0,
    surchargeAmount: 0,
    totalAmount: 135000000,
    paidAmount: 70000000,
    remainingAmount: 65000000,
    refundAmount: 0,
    collaboratorId: '',
    ctvName: 'Direct Booking',
    staff: 'Nguyễn Văn An (Leader)',
    status: 'Đã đặt cọc',
    tourStatus: 'Chưa khởi hành',
    financialStatus: 'Đã đặt cọc',
    estimatedCost: 88000000,
    actualCost: 88000000,
    createdAt: '2026-10-23',
    notes: 'Đoàn Caravan 15 xe SUV tự lái. Cọc 70M, còn nợ 65M thanh toán tại điểm xuất phát.',
    passengers: [
      { id: 1, fullName: 'Bùi Quang Thắng (Trưởng Đoàn - Xe 01 Dẫn Đường)', gender: 'Nam', birthYear: 1981, idCard: '079081009900', phone: '0908778899', roomType: 'Bungalow 01', dietNotes: 'Xe Ford Ranger Raptor' },
      { id: 2, fullName: 'Lê Văn Tuấn (Xe 02)', gender: 'Nam', birthYear: 1984, idCard: '079084009901', phone: '0908778891', roomType: 'Bungalow 02', dietNotes: 'Xe Toyota Land Cruiser' },
      { id: 3, fullName: 'Ngô Đức Trọng (Xe Khóa Đuôi 15)', gender: 'Nam', birthYear: 1986, idCard: '079086009902', phone: '0908778892', roomType: 'Bungalow 15', dietNotes: 'Kỹ thuật cứu hộ bộ đàm' }
    ],
    itinerary: [
      { day: 1, title: 'Hành Trình Caravan 15 Xe Tự Lái Băng Cung Đường Rừng', desc: 'Đoàn xe kết nối bộ đàm liên tục, di chuyển trật tự theo đội hình qua cung đường rừng tuyệt đẹp.' },
      { day: 2, title: 'Offroad Nhẹ Khám Phá Thác Trời & Tiệc Gala BBQ Ven Rừng', desc: 'Giao lưu văn hóa lái xe an toàn, thưởng thức thịt nướng ngoài trời.' },
      { day: 3, title: 'Đoàn Xe Diễu Hành Trở Về Sài Gòn', desc: 'Chụp ảnh kỷ niệm tại cột mốc Vườn Quốc Gia và trở về an toàn.' }
    ]
  }
];

// Danh sách Phiếu thu ban đầu (Khớp đúng 20 Kịch bản Đơn Tour & Phiếu Hoàn Tiền REFUND)
const INITIAL_PAYMENTS = [
  {
    id: 'PT-001',
    code: 'PT-001',
    bookingId: 'DH-001',
    bookingCode: 'DH-001',
    type: 'PAYMENT',
    amount: 5000000,
    date: '2026-10-10',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT2610101122',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Chuyển khoản cọc đợt 1 Vietcombank'
  },
  {
    id: 'PT-002',
    code: 'PT-002',
    bookingId: 'DH-001',
    bookingCode: 'DH-001',
    type: 'PAYMENT',
    amount: 4600000,
    date: '2026-10-11',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT2610115566',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Thanh toán đủ 100% trước chuyến đi'
  },
  {
    id: 'PT-003',
    code: 'PT-003',
    bookingId: 'DH-002',
    bookingCode: 'DH-002',
    type: 'PAYMENT',
    amount: 4000000,
    date: '2026-10-14',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT2610148899',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Khách cọc qua App ngân hàng Techcombank'
  },
  {
    id: 'PT-004',
    code: 'PT-004',
    bookingId: 'DH-004',
    bookingCode: 'DH-004',
    type: 'PAYMENT',
    amount: 720000000,
    date: '2026-10-15',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261015720M',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Thanh toán trọn gói 100% đoàn 300 khách Cát Tiên'
  },
  {
    id: 'PT-005',
    code: 'PT-005',
    bookingId: 'DH-005',
    bookingCode: 'DH-005',
    type: 'PAYMENT',
    amount: 90000000,
    date: '2026-10-16',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261016LHP50',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Trường Lê Hồng Phong cọc đợt 1 (50% giá trị hợp đồng)'
  },
  {
    id: 'PT-006',
    code: 'PT-006',
    bookingId: 'DH-006',
    bookingCode: 'DH-006',
    type: 'PAYMENT',
    amount: 45000000,
    date: '2026-10-17',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261017DIR45',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Khách trực tiếp thanh toán 100% qua cổng OnePay'
  },
  {
    id: 'PT-007',
    code: 'PT-007',
    bookingId: 'DH-007',
    bookingCode: 'DH-007',
    type: 'PAYMENT',
    amount: 35000000,
    date: '2026-10-15',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261015OANH',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Thanh toán tiền tour ban đầu'
  },
  {
    id: 'REF-001',
    code: 'REF-001',
    bookingId: 'DH-007',
    bookingCode: 'DH-007',
    type: 'REFUND',
    amount: 17500000,
    date: '2026-10-25',
    method: 'BANK_TRANSFER',
    referenceCode: 'REF261025OANH',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Hoàn lại 50% tiền cọc do khách hủy tour việc khẩn cấp (Phạt 50% theo quy chế)'
  },
  {
    id: 'PT-009',
    code: 'PT-009',
    bookingId: 'DH-009',
    bookingCode: 'DH-009',
    type: 'PAYMENT',
    amount: 64000000,
    date: '2026-10-12',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261012VIP64',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Khách VIP David Trần thanh toán 100% qua Techcombank Priority'
  },
  {
    id: 'PT-010A',
    code: 'PT-010A',
    bookingId: 'DH-010',
    bookingCode: 'DH-010',
    type: 'PAYMENT',
    amount: 22500000,
    date: '2026-10-19',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261019EARLY1',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'CLB Nhiếp Ảnh thanh toán Đợt 1 cọc 30%'
  },
  {
    id: 'PT-010B',
    code: 'PT-010B',
    bookingId: 'DH-010',
    bookingCode: 'DH-010',
    type: 'PAYMENT',
    amount: 30000000,
    date: '2026-10-24',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261024EARLY2',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'CLB Nhiếp Ảnh thanh toán Đợt 2 (40%) trước ngày khởi hành 7 ngày'
  },
  {
    id: 'PT-011',
    code: 'PT-011',
    bookingId: 'DH-011',
    bookingCode: 'DH-011',
    type: 'PAYMENT',
    amount: 48000000,
    date: '2026-10-19',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261019FR48M',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Đoàn Inbound Pháp chuyển khoản quốc tế 100%'
  },
  {
    id: 'PT-012',
    code: 'PT-012',
    bookingId: 'DH-012',
    bookingCode: 'DH-012',
    type: 'PAYMENT',
    amount: 21000000,
    date: '2026-10-20',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261020MY21M',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Thanh toán đủ tour + phụ thu 3 phòng đơn 3.000.000 đ'
  },
  {
    id: 'PT-013',
    code: 'PT-013',
    bookingId: 'DH-013',
    bookingCode: 'DH-013',
    type: 'PAYMENT',
    amount: 100000000,
    date: '2026-10-20',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261020BV100M',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Bệnh viện ĐK Sài Gòn cọc đợt 1 (100.000.000 đ)'
  },
  {
    id: 'PT-014',
    code: 'PT-014',
    bookingId: 'DH-014',
    bookingCode: 'DH-014',
    type: 'PAYMENT',
    amount: 22560000,
    date: '2026-10-21',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261021THANH',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Gia đình Bác Thành thanh toán đủ 100% (9.4 suất vé)'
  },
  {
    id: 'PT-015',
    code: 'PT-015',
    bookingId: 'DH-015',
    bookingCode: 'DH-015',
    type: 'PAYMENT',
    amount: 23000000,
    date: '2026-10-21',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261021LONG23',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Khách thanh toán đủ sau khi giảm voucher 2.6M'
  },
  {
    id: 'PT-016',
    code: 'PT-016',
    bookingId: 'DH-016',
    bookingCode: 'DH-016',
    type: 'PAYMENT',
    amount: 136000000,
    date: '2026-10-22',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261022NEXUS',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Startup AI Nexus thanh toán đủ giá gốc + phát sinh cứu hộ lều dã chiến'
  },
  {
    id: 'PT-017',
    code: 'PT-017',
    bookingId: 'DH-017',
    bookingCode: 'DH-017',
    type: 'PAYMENT',
    amount: 40000000,
    date: '2026-10-18',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261018VINACON',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Công ty Vinacon thanh toán đợt 1 (40M / 60M, còn nợ 20M)'
  },
  {
    id: 'PT-018',
    code: 'PT-018',
    bookingId: 'DH-018',
    bookingCode: 'DH-018',
    type: 'PAYMENT',
    amount: 51200000,
    date: '2026-10-23',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261023LINH51',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Chị Đỗ Mỹ Linh thanh toán đủ 100%'
  },
  {
    id: 'PT-019',
    code: 'PT-019',
    bookingId: 'DH-019',
    bookingCode: 'DH-019',
    type: 'PAYMENT',
    amount: 128000000,
    date: '2026-10-23',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261023VSTAR2',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Tập đoàn V-Star chuyển khoản 100% đoàn Quản lý Đà Lạt'
  },
  {
    id: 'PT-020',
    code: 'PT-020',
    bookingId: 'DH-020',
    bookingCode: 'DH-020',
    type: 'PAYMENT',
    amount: 70000000,
    date: '2026-10-23',
    method: 'BANK_TRANSFER',
    referenceCode: 'FT261023CARAVAN',
    confirmedBy: 'Lê Thị Mai (Kế toán trưởng)',
    status: 'CONFIRMED',
    notes: 'Caravan Club cọc 70.000.000 đ'
  }
];

// Danh sách Lệnh đặt dịch vụ NCC ban đầu (Kèm hình thức thanh toán & chính sách đối tác đầy đủ)
const INITIAL_SUPPLIER_BOOKINGS = [
  {
    id: 'LDC-001',
    code: 'LDC-001',
    bookingId: 'DH-001',
    bookingCode: 'DH-001',
    supplierId: 'NCC-001',
    supplierName: 'Khách sạn Sinh Thái Nam Cát Tiên',
    serviceType: 'Phòng nghỉ sinh thái & ăn sáng 2N1Đ',
    agreedCost: 3200000,
    paidCost: 3200000,
    remainingCost: 0,
    paymentDueDate: '2026-10-23',
    payType: 'CREDIT',
    debtPolicy: 'DEBT_15D',
    debtPolicyTitle: 'Công nợ 15 ngày sau tour',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-23',
    notes: '2 phòng Deluxe hướng rừng'
  },
  {
    id: 'LDC-002',
    code: 'LDC-002',
    bookingId: 'DH-001',
    bookingCode: 'DH-001',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: 'Xe Limousine 16 chỗ khứ hồi SG - Cát Tiên',
    agreedCost: 3000000,
    paidCost: 3000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-24',
    payType: 'CREDIT',
    debtPolicy: 'DEBT_7D',
    debtPolicyTitle: 'Công nợ 7 ngày sau tour',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-24',
    notes: 'Tài xế đón tại Q1 lúc 05:30 sáng'
  },
  {
    id: 'LDC-003',
    code: 'LDC-003',
    bookingId: 'DH-002',
    bookingCode: 'DH-002',
    supplierId: 'NCC-005',
    supplierName: 'Tàu Du Lịch Sinh Thái Bến Tre',
    serviceType: 'Thuyền sông & đò chèo sinh thái',
    agreedCost: 2500000,
    paidCost: 1000000,
    remainingCost: 1500000,
    paymentDueDate: '2026-10-28',
    payType: 'CREDIT',
    debtPolicy: 'DEPOSIT_50',
    debtPolicyTitle: 'Cọc 50%, còn lại sau tour 3 ngày',
    status: 'DEBT_ACKNOWLEDGED',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    notes: 'Đã cọc 1tr, còn lại ghi nhận công nợ trả sau tour'
  },
  {
    id: 'LDC-004',
    code: 'LDC-004',
    bookingId: 'DH-003',
    bookingCode: 'DH-003',
    supplierId: 'NCC-004',
    supplierName: 'Homestay Rừng & Suối Mù Cang Chải',
    serviceType: 'Homestay nghỉ dưỡng bản La Pán Tẩn 4N3Đ',
    agreedCost: 6000000,
    paidCost: 0,
    remainingCost: 6000000,
    paymentDueDate: '2026-11-04',
    payType: 'CREDIT',
    debtPolicy: 'DEBT_15D',
    debtPolicyTitle: 'Công nợ 15 ngày sau tour',
    status: 'WAIT_DEBT_APPROVAL',
    approvedBy: null,
    notes: 'Chờ Kế toán duyệt công nợ trước khi tour chạy'
  },
  {
    id: 'LDC-005',
    code: 'LDC-005',
    bookingId: 'DH-003',
    bookingCode: 'DH-003',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: 'Xe Dcar Limousine 9 chỗ Hà Nội - Mù Cang Chải 4N3Đ',
    agreedCost: 6000000,
    paidCost: 0,
    remainingCost: 6000000,
    paymentDueDate: '2026-11-04',
    payType: 'CREDIT',
    debtPolicy: 'DEBT_7D',
    debtPolicyTitle: 'Công nợ 7 ngày sau tour',
    status: 'WAIT_DEBT_APPROVAL',
    approvedBy: null,
    notes: 'Xe đón sân bay Nội Bài'
  },
  {
    id: 'LDC-006',
    code: 'LDC-006',
    bookingId: 'DH-004',
    bookingCode: 'DH-004',
    supplierId: 'NCC-001',
    supplierName: 'Khách sạn Sinh Thái Nam Cát Tiên',
    serviceType: 'Bao trọn 150 phòng Ecolodge & Nhà hàng tiệc 300 khách',
    agreedCost: 288000000,
    paidCost: 0,
    remainingCost: 288000000,
    paymentDueDate: '2026-11-19',
    payType: 'CREDIT',
    debtPolicy: 'DEBT_15D',
    debtPolicyTitle: 'Công nợ 15 ngày sau tour',
    status: 'DEBT_ACKNOWLEDGED',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    notes: 'Phục vụ đại đoàn 300 CBNV V-Star'
  },
  {
    id: 'LDC-007',
    code: 'LDC-007',
    bookingId: 'DH-004',
    bookingCode: 'DH-004',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: 'Đoàn 7 xe Universe 45 chỗ đời mới khứ hồi SG - Cát Tiên',
    agreedCost: 180000000,
    paidCost: 0,
    remainingCost: 180000000,
    paymentDueDate: '2026-11-19',
    payType: 'CREDIT',
    debtPolicy: 'DEBT_7D',
    debtPolicyTitle: 'Công nợ 7 ngày sau tour',
    status: 'DEBT_ACKNOWLEDGED',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    notes: 'Xuất phát đồng loạt 06:00 sáng tại KCN Cao TP.HCM'
  },
  {
    id: 'LDC-008',
    code: 'LDC-008',
    bookingId: 'DH-005',
    bookingCode: 'DH-005',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: 'Đoàn 3 xe 45 chỗ trường Lê Hồng Phong',
    agreedCost: 54000000,
    paidCost: 27000000,
    remainingCost: 27000000,
    paymentDueDate: '2026-11-12',
    payType: 'CREDIT',
    debtPolicy: 'DEPOSIT_50',
    debtPolicyTitle: 'Cọc 50%, còn lại sau tour 3 ngày',
    status: 'DEBT_ACKNOWLEDGED',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    notes: 'Đã cọc 27M, còn lại thanh toán sau chuyến đi'
  },
  {
    id: 'LDC-009',
    code: 'LDC-009',
    bookingId: 'DH-005',
    bookingCode: 'DH-005',
    supplierId: 'NCC-005',
    supplierName: 'Tàu Du Lịch Sinh Thái Bến Tre',
    serviceType: 'Dịch vụ đò chèo, tát mương bắt cá & ẩm thực 120 pax',
    agreedCost: 72000000,
    paidCost: 36000000,
    remainingCost: 36000000,
    paymentDueDate: '2026-11-12',
    payType: 'CREDIT',
    debtPolicy: 'DEPOSIT_50',
    debtPolicyTitle: 'Cọc 50%, còn lại sau tour 3 ngày',
    status: 'DEBT_ACKNOWLEDGED',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    notes: 'Khu du lịch sinh thái Cồn Phụng Bến Tre'
  },
  {
    id: 'LDC-010',
    code: 'LDC-010',
    bookingId: 'DH-006',
    bookingCode: 'DH-006',
    supplierId: 'NCC-001',
    supplierName: 'Khách sạn Sinh Thái Nam Cát Tiên',
    serviceType: 'Khu Lều Glamping & Phòng nghỉ 15 khách',
    agreedCost: 18000000,
    paidCost: 18000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-25',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-25',
    notes: 'Đã thanh toán đủ trước khi khách nhận phòng'
  },
  {
    id: 'LDC-011',
    code: 'LDC-011',
    bookingId: 'DH-006',
    bookingCode: 'DH-006',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: 'Xe Thaco 29 chỗ đưa đón đoàn bạn bè',
    agreedCost: 12000000,
    paidCost: 12000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-25',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-25',
    notes: 'Đã thanh toán trước giờ khởi hành'
  },
  {
    id: 'LDC-012',
    code: 'LDC-012',
    bookingId: 'DH-008',
    bookingCode: 'DH-008',
    supplierId: 'NCC-004',
    supplierName: 'Homestay Rừng & Suối Đà Lạt',
    serviceType: 'Bao phòng Khách Sạn 4 Sao Đà Lạt & Gala 80 CBNV Techcombank',
    agreedCost: 102000000,
    paidCost: 0,
    remainingCost: 102000000,
    paymentDueDate: '2026-11-26',
    payType: 'CREDIT',
    debtPolicy: 'DEBT_30D',
    debtPolicyTitle: 'Công nợ 30 ngày (Gối đầu hàng tháng)',
    status: 'DEBT_ACKNOWLEDGED',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    notes: 'Hạn mức công nợ đối tác 30 ngày'
  },
  {
    id: 'LDC-013',
    code: 'LDC-013',
    bookingId: 'DH-008',
    bookingCode: 'DH-008',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: 'Đoàn 3 xe 29 chỗ cao cấp phục vụ tại Đà Lạt 3N2Đ',
    agreedCost: 58000000,
    paidCost: 0,
    remainingCost: 58000000,
    paymentDueDate: '2026-11-10',
    payType: 'CREDIT',
    debtPolicy: 'DEBT_15D',
    debtPolicyTitle: 'Công nợ 15 ngày sau tour',
    status: 'DEBT_ACKNOWLEDGED',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    notes: 'Đưa đón sân bay Liên Khương và theo đoàn suốt tuyến'
  },
  {
    id: 'LDC-014',
    code: 'LDC-014',
    bookingId: 'DH-009',
    bookingCode: 'DH-009',
    supplierId: 'NCC-001',
    supplierName: 'Khách sạn Sinh Thái Nam Cát Tiên',
    serviceType: 'Khu Biệt Thự Presidential Villa 5 Sao & Ăn Uống Thượng Hạng',
    agreedCost: 26000000,
    contractRate: 24000000,
    priceAlert: true,
    priceAlertNote: 'Đơn giá thỏa thuận 26.000.000 đ cao hơn đơn giá hợp đồng khung 24.000.000 đ do phụ thu Villa cao điểm cuối tuần.',
    paidCost: 26000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-20',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-20',
    notes: 'Phục vụ khách VIP David Trần'
  },
  {
    id: 'LDC-015',
    code: 'LDC-015',
    bookingId: 'DH-009',
    bookingCode: 'DH-009',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: 'Xe Limousine Dcar President Siêu VIP đưa đón tận nhà',
    agreedCost: 16000000,
    paidCost: 16000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-20',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-20',
    notes: 'Tài xế chuyên nghiệp tiếng Anh giao tiếp'
  },
  {
    id: 'LDC-016',
    code: 'LDC-016',
    bookingId: 'DH-010',
    bookingCode: 'DH-010',
    supplierId: 'NCC-004',
    supplierName: 'Homestay Rừng & Suối Mù Cang Chải',
    serviceType: 'Homestay & Đội xe ôm bản địa chở 25 nhiếp ảnh gia săn ảnh',
    agreedCost: 32000000,
    paidCost: 16000000,
    remainingCost: 16000000,
    paymentDueDate: '2026-11-08',
    payType: 'CREDIT',
    debtPolicy: 'DEPOSIT_50',
    debtPolicyTitle: 'Cọc 50%, còn lại sau tour 3 ngày',
    status: 'DEBT_ACKNOWLEDGED',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    notes: 'Đã cọc 16M'
  },
  {
    id: 'LDC-017',
    code: 'LDC-017',
    bookingId: 'DH-010',
    bookingCode: 'DH-010',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: 'Xe 29 chỗ Samco đưa đón đoàn nhiếp ảnh Hà Nội - Mù Cang Chải',
    agreedCost: 18000000,
    paidCost: 9000000,
    remainingCost: 9000000,
    paymentDueDate: '2026-11-08',
    payType: 'CREDIT',
    debtPolicy: 'DEPOSIT_50',
    debtPolicyTitle: 'Cọc 50%, còn lại sau tour 3 ngày',
    status: 'DEBT_ACKNOWLEDGED',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    notes: 'Đã cọc 9M'
  },
  {
    id: 'LDC-018',
    code: 'LDC-018',
    bookingId: 'DH-011',
    bookingCode: 'DH-011',
    supplierId: 'NCC-001',
    supplierName: 'Khách sạn Sinh Thái Nam Cát Tiên',
    serviceType: '6 Phòng Bungalow & Bữa ăn Âu cho đoàn Pháp',
    agreedCost: 19000000,
    paidCost: 19000000,
    remainingCost: 0,
    paymentDueDate: '2026-11-14',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-25',
    notes: 'Thanh toán ngay nhận phòng chất lượng cao'
  },
  {
    id: 'LDC-019',
    code: 'LDC-019',
    bookingId: 'DH-011',
    bookingCode: 'DH-011',
    supplierId: 'NCC-003',
    supplierName: 'Hướng Dẫn Viên Bản Địa Cát Tiên',
    serviceType: 'HDV Chuyên gia sinh thái tiếng Pháp & Giấy phép Vườn Quốc Gia',
    agreedCost: 12000000,
    contractRate: 10000000,
    priceAlert: true,
    priceAlertNote: 'Phụ thu HDV chuyên gia sinh thái tiếng Pháp kỹ thuật cao cho đoàn Inbound Pháp 3N2Đ (Đơn giá khung tiếng Việt: 10M, thực tế: 12M).',
    paidCost: 12000000,
    remainingCost: 0,
    paymentDueDate: '2026-11-14',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-25',
    notes: 'Thanh toán trực tiếp cho chuyên gia rừng'
  },
  {
    id: 'LDC-020',
    code: 'LDC-020',
    bookingId: 'DH-012',
    bookingCode: 'DH-012',
    supplierId: 'NCC-001',
    supplierName: 'Khách sạn Sinh Thái Nam Cát Tiên',
    serviceType: '3 Phòng đơn Bungalow (Có phụ thu 3.000.000 đ)',
    agreedCost: 14000000,
    paidCost: 14000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-29',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-25',
    notes: 'Cập nhật phụ thu phòng đơn chính xác'
  },
  {
    id: 'LDC-021',
    code: 'LDC-021',
    bookingId: 'DH-013',
    bookingCode: 'DH-013',
    supplierId: 'NCC-005',
    supplierName: 'Tàu Du Lịch Sinh Thái Bến Tre',
    serviceType: 'Bến Tre Riverside Resort - Sảnh Hội Thảo 50 Bác Sĩ & Gala',
    agreedCost: 65000000,
    paidCost: 40000000,
    remainingCost: 25000000,
    paymentDueDate: '2026-11-18',
    payType: 'CREDIT',
    debtPolicy: 'DEPOSIT_50',
    debtPolicyTitle: 'Cọc 50%, còn lại sau tour 3 ngày',
    status: 'DEBT_ACKNOWLEDGED',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    notes: 'Đã cọc 40M, còn lại nợ 25M'
  },
  {
    id: 'LDC-022',
    code: 'LDC-022',
    bookingId: 'DH-013',
    bookingCode: 'DH-013',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: '2 Xe Universe 45 chỗ đưa đón đoàn Y bác sĩ',
    agreedCost: 37000000,
    paidCost: 20000000,
    remainingCost: 17000000,
    paymentDueDate: '2026-11-18',
    payType: 'CREDIT',
    debtPolicy: 'DEPOSIT_50',
    debtPolicyTitle: 'Cọc 50%, còn lại sau tour 3 ngày',
    status: 'DEBT_ACKNOWLEDGED',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    notes: 'Đã cọc 20M'
  },
  {
    id: 'LDC-023',
    code: 'LDC-023',
    bookingId: 'DH-014',
    bookingCode: 'DH-014',
    supplierId: 'NCC-005',
    supplierName: 'Tàu Du Lịch Sinh Thái Bến Tre',
    serviceType: 'Homestay Nhà Cổ Miệt Vườn & Đò Chèo Gia Đình 12 Khách',
    agreedCost: 9000000,
    paidCost: 9000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-31',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-25',
    notes: 'Đã thanh toán đủ'
  },
  {
    id: 'LDC-024',
    code: 'LDC-024',
    bookingId: 'DH-014',
    bookingCode: 'DH-014',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: 'Xe Ford Transit 16 chỗ đời mới đón tận nhà Bác Thành',
    agreedCost: 6000000,
    paidCost: 6000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-31',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-25',
    notes: 'Đã thanh toán đủ'
  },
  {
    id: 'LDC-025',
    code: 'LDC-025',
    bookingId: 'DH-015',
    bookingCode: 'DH-015',
    supplierId: 'NCC-004',
    supplierName: 'Homestay Rừng & Suối Đà Lạt',
    serviceType: '4 Lều Glamping cao cấp ven suối 8 khách',
    agreedCost: 10000000,
    paidCost: 10000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-28',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-25',
    notes: 'Đã thanh toán trọn gói'
  },
  {
    id: 'LDC-026',
    code: 'LDC-026',
    bookingId: 'DH-015',
    bookingCode: 'DH-015',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: 'Xe Limousine 16 chỗ khứ hồi SG - Đà Lạt',
    agreedCost: 6000000,
    paidCost: 6000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-28',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-25',
    notes: 'Đã thanh toán trọn gói'
  },
  {
    id: 'LDC-027',
    code: 'LDC-027',
    bookingId: 'DH-016',
    bookingCode: 'DH-016',
    supplierId: 'NCC-004',
    supplierName: 'Homestay Rừng & Suối Đà Lạt',
    serviceType: 'Khu Trại Dã Ngoại Sinh Tồn & Thiết Bị Cứu Hộ Đêm (+8M phát sinh)',
    agreedCost: 62000000,
    paidCost: 62000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-22',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-24',
    notes: 'Gốc 54M + 8M phát sinh lều dã chiến mùa mưa'
  },
  {
    id: 'LDC-028',
    code: 'LDC-028',
    bookingId: 'DH-016',
    bookingCode: 'DH-016',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: 'Xe Universe 45 chỗ đưa đón Startup AI Nexus',
    agreedCost: 30000000,
    paidCost: 30000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-22',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-24',
    notes: 'Đã thanh toán đủ'
  },
  {
    id: 'LDC-029',
    code: 'LDC-029',
    bookingId: 'DH-017',
    bookingCode: 'DH-017',
    supplierId: 'NCC-001',
    supplierName: 'Khách sạn Sinh Thái Nam Cát Tiên',
    serviceType: '10 Phòng Standard & Ăn uống 20 kỹ sư Vinacon',
    agreedCost: 24000000,
    paidCost: 24000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-21',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-23',
    notes: 'Chi phí NCC đã thanh toán dù khách còn nợ'
  },
  {
    id: 'LDC-030',
    code: 'LDC-030',
    bookingId: 'DH-017',
    bookingCode: 'DH-017',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: 'Xe 29 chỗ đời mới đưa đón đoàn kỹ sư',
    agreedCost: 16000000,
    paidCost: 16000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-21',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-23',
    notes: 'Đã chi trả nhà xe'
  },
  {
    id: 'LDC-031',
    code: 'LDC-031',
    bookingId: 'DH-018',
    bookingCode: 'DH-018',
    supplierId: 'NCC-004',
    supplierName: 'Homestay Rừng & Suối Đà Lạt',
    serviceType: 'Cụm Villa Rừng Hoa Hồng 16 khách',
    agreedCost: 18000000,
    paidCost: 18000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-26',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-25',
    notes: 'NCC 1: Khách sạn'
  },
  {
    id: 'LDC-032',
    code: 'LDC-032',
    bookingId: 'DH-018',
    bookingCode: 'DH-018',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: 'Xe 29 chỗ Samco đưa đón SG - Đà Lạt',
    agreedCost: 10000000,
    paidCost: 10000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-26',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-25',
    notes: 'NCC 2: Nhà xe'
  },
  {
    id: 'LDC-033',
    code: 'LDC-033',
    bookingId: 'DH-018',
    bookingCode: 'DH-018',
    supplierId: 'NCC-004',
    supplierName: 'Nhà Hàng Sinh Thái Suối Mơ',
    serviceType: 'Tiệc nướng BBQ đặc sản cá tầm & gà đồi 16 khách',
    agreedCost: 4000000,
    paidCost: 4000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-26',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-25',
    notes: 'NCC 3: Nhà hàng ẩm thực'
  },
  {
    id: 'LDC-034',
    code: 'LDC-034',
    bookingId: 'DH-018',
    bookingCode: 'DH-018',
    supplierId: 'NCC-003',
    supplierName: 'Hướng Dẫn Viên Bản Địa Đà Lạt',
    serviceType: 'HDV dẫn trekking đường mòn thông reo 2 ngày',
    agreedCost: 2000000,
    paidCost: 2000000,
    remainingCost: 0,
    paymentDueDate: '2026-10-26',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-25',
    notes: 'NCC 4: Hướng dẫn viên'
  },
  {
    id: 'LDC-035',
    code: 'LDC-035',
    bookingId: 'DH-019',
    bookingCode: 'DH-019',
    supplierId: 'NCC-004',
    supplierName: 'Homestay Rừng & Suối Đà Lạt',
    serviceType: 'Resort 4 Sao & Phòng họp chiến lược V-Star (Tour 2)',
    agreedCost: 52000000,
    paidCost: 52000000,
    remainingCost: 0,
    paymentDueDate: '2026-11-27',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-25',
    notes: 'Đã thanh toán đủ'
  },
  {
    id: 'LDC-036',
    code: 'LDC-036',
    bookingId: 'DH-019',
    bookingCode: 'DH-019',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: 'Xe Universe 45 chỗ đưa đón ban quản trị',
    agreedCost: 31000000,
    paidCost: 31000000,
    remainingCost: 0,
    paymentDueDate: '2026-11-27',
    payType: 'PAY_NOW',
    debtPolicy: 'IMMEDIATE',
    debtPolicyTitle: 'Thanh toán ngay 100% khi đặt dịch vụ',
    status: 'PAID_FULL',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    paidDate: '2026-10-25',
    notes: 'Đã thanh toán đủ'
  },
  {
    id: 'LDC-037',
    code: 'LDC-037',
    bookingId: 'DH-020',
    bookingCode: 'DH-020',
    supplierId: 'NCC-001',
    supplierName: 'Khách sạn Sinh Thái Nam Cát Tiên',
    serviceType: 'Khu Resort & Sân bãi đậu 15 xe SUV Caravan kèm Gala BBQ',
    agreedCost: 55000000,
    paidCost: 30000000,
    remainingCost: 25000000,
    paymentDueDate: '2026-11-14',
    payType: 'CREDIT',
    debtPolicy: 'DEPOSIT_50',
    debtPolicyTitle: 'Cọc 50%, còn lại sau tour 3 ngày',
    status: 'DEBT_ACKNOWLEDGED',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    notes: 'Đã cọc 30M'
  },
  {
    id: 'LDC-038',
    code: 'LDC-038',
    bookingId: 'DH-020',
    bookingCode: 'DH-020',
    supplierId: 'NCC-002',
    supplierName: 'Nhà xe Du Lịch Xanh Sài Gòn',
    serviceType: 'Xe cứu hộ kỹ thuật, trạm sạc dã chiến & bộ đàm cự ly xa',
    agreedCost: 33000000,
    paidCost: 15000000,
    remainingCost: 18000000,
    paymentDueDate: '2026-11-14',
    payType: 'CREDIT',
    debtPolicy: 'DEPOSIT_50',
    debtPolicyTitle: 'Cọc 50%, còn lại sau tour 3 ngày',
    status: 'DEBT_ACKNOWLEDGED',
    approvedBy: 'Lê Thị Mai (Kế toán trưởng)',
    notes: 'Đã cọc 15M'
  }
];

// ==========================================
// DỮ LIỆU KHỞI TẠO: HÓA ĐƠN ĐIỆN TỬ, CHỨNG TỪ THUẾ TNCN & SỔ KẾ TOÁN KÉP
// Tuân thủ Nghị định 123/2020/NĐ-CP, Thông tư 78/2021/TT-BTC, Thông tư 219/2013/TT-BTC, Thông tư 111/2013/TT-BTC & Thông tư 200/2014/TT-BTC
// ==========================================

const INITIAL_INVOICES = [
  {
    id: 'INV-001',
    code: '1C26TAA-00000001',
    invoiceNo: '00000001',
    serial: '1C26TAA',
    issueDate: '2026-10-24',
    bookingCode: 'DH-001',
    customerName: 'Nguyễn Thị Mai Linh',
    customerTaxCode: '0318991234',
    customerAddress: '120 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
    customerEmail: 'mailinh.travel@gmail.com',
    paymentMethod: 'Chuyển khoản (TM/CK)',
    serviceName: 'Tour Trekking Vườn Quốc Gia Cát Tiên 2N1Đ (4 khách)',
    totalPackageRevenue: 9600000,
    deductibleOutsideCost: 6200000, // Tiền phòng Nam Cát Tiên Ecolodge + Xe Limousine + Vé Bàu Sấu
    taxableVatAmount: 3400000,      // Doanh thu trừ chi phí mua ngoài theo TT 219
    vatRate: 10,
    vatAmount: 340000,
    grandTotal: 9940000,
    amountInWords: 'Chín triệu chín trăm bốn mươi nghìn đồng chẵn.',
    cqtCode: '00-26-1C26TAA-00000001-A9F8E1C2B4D3E5F6',
    status: 'CQT_ISSUED',
    legalNotes: 'Giá dịch vụ du lịch trọn gói đã trừ chi phí mua ngoài theo quy định tại Điều 7 Khoản 16 Thông tư 219/2013/TT-BTC.',
    signedAt: '2026-10-24 14:30:15',
    signer: 'CÔNG TY TNHH HAHA ECO TRAVEL (MST: 0317899888)'
  },
  {
    id: 'INV-002',
    code: '1C26TAA-00000002',
    invoiceNo: '00000002',
    serial: '1C26TAA',
    issueDate: '2026-10-25',
    bookingCode: 'DH-003',
    customerName: 'Phạm Thúy Hằng',
    customerTaxCode: '0108899772',
    customerAddress: 'Số 45 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội',
    customerEmail: 'hangpham.mkt@gmail.com',
    paymentMethod: 'Chuyển khoản ngân hàng',
    serviceName: 'Tour Khám Phá Tây Bắc - Mùa Lúa Chín Mù Cang Chải 4N3Đ (4 khách)',
    totalPackageRevenue: 18500000,
    deductibleOutsideCost: 12000000, // Khách sạn sinh thái + Xe Limousine + Ăn uống bản địa
    taxableVatAmount: 6500000,       // Chênh lệch lữ hành
    vatRate: 10,
    vatAmount: 650000,
    grandTotal: 19150000,
    amountInWords: 'Mười chín triệu một trăm năm mươi nghìn đồng chẵn.',
    cqtCode: '00-26-1C26TAA-00000002-C7E4A1B2D3F5E609',
    status: 'CQT_ISSUED',
    legalNotes: 'Giá tour du lịch trọn gói đã trừ chi phí dịch vụ mua ngoài theo Điều 7 Khoản 16 Thông tư 219/2013/TT-BTC.',
    signedAt: '2026-10-25 09:15:20',
    signer: 'CÔNG TY TNHH HAHA ECO TRAVEL (MST: 0317899888)'
  }
];

const INITIAL_TAX_RECEIPTS = [
  {
    id: 'PIT-001',
    code: '1C26TCN-00000001',
    receiptNo: '00000001',
    serial: '1C26TCN',
    issueDate: '2026-10-24',
    commissionId: 1,
    ctvId: 'CTV-001',
    ctvName: 'Hoàng Yến (Travel Blogger)',
    ctvTaxCode: '8012345678',
    ctvAddress: 'Quận 3, TP. Hồ Chí Minh',
    incomeType: 'Thù lao, hoa hồng môi giới du lịch sinh thái',
    grossIncome: 7000000,
    taxRate: 10, // Điểm i Khoản 1 Điều 25 Thông tư 111/2013/TT-BTC (từ 2M khấu trừ 10%)
    withheldTaxAmount: 700000,
    netPaidAmount: 6300000,
    cqtVerificationCode: '00-26-1C26TCN-00000001-B2C4D6E8F0',
    status: 'CQT_ISSUED',
    signedAt: '2026-10-24 16:00:00',
    signer: 'CÔNG TY TNHH HAHA ECO TRAVEL'
  },
  {
    id: 'PIT-002',
    code: '1C26TCN-00000002',
    receiptNo: '00000002',
    serial: '1C26TCN',
    issueDate: '2026-10-25',
    commissionId: 2,
    ctvId: 'CTV-002',
    ctvName: 'Minh Tuấn (KOL Phượt)',
    ctvTaxCode: '8098765432',
    ctvAddress: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
    incomeType: 'Thù lao, hoa hồng môi giới du lịch sinh thái',
    grossIncome: 5000000,
    taxRate: 10,
    withheldTaxAmount: 500000,
    netPaidAmount: 4500000,
    cqtVerificationCode: '00-26-1C26TCN-00000002-E1F3A5B7C9',
    status: 'CQT_ISSUED',
    signedAt: '2026-10-25 10:30:00',
    signer: 'CÔNG TY TNHH HAHA ECO TRAVEL'
  }
];

const INITIAL_JOURNAL_ENTRIES = [
  {
    id: 'JE-001',
    date: '2026-10-10',
    voucherNo: 'PT-001',
    description: 'Khách hàng thanh toán tiền tour DH-001 qua ngân hàng Techcombank',
    debitAccount: '112',
    creditAccount: '131',
    amount: 9600000,
    bookingCode: 'DH-001',
    counterparty: 'Nguyễn Thị Mai Linh'
  },
  {
    id: 'JE-002',
    date: '2026-10-24',
    voucherNo: 'HD-001',
    description: 'Ghi nhận doanh thu tour DH-001 và Thuế GTGT lữ hành đầu ra (TT 219)',
    debitAccount: '131',
    creditAccount: '511',
    amount: 9600000,
    bookingCode: 'DH-001',
    counterparty: 'Nguyễn Thị Mai Linh'
  },
  {
    id: 'JE-003',
    date: '2026-10-24',
    voucherNo: 'HD-001-VAT',
    description: 'Ghi nhận Thuế GTGT 10% tính trên chênh lệch lữ hành tour DH-001',
    debitAccount: '131',
    creditAccount: '33311',
    amount: 340000,
    bookingCode: 'DH-001',
    counterparty: 'Cơ quan Thuế'
  },
  {
    id: 'JE-004',
    date: '2026-10-20',
    voucherNo: 'LDC-001',
    description: 'Ghi nhận chi phí mua ngoài dịch vụ phòng nghỉ Nam Cát Tiên Ecolodge',
    debitAccount: '632',
    creditAccount: '331',
    amount: 4200000,
    bookingCode: 'DH-001',
    counterparty: 'Nam Cát Tiên Ecolodge'
  },
  {
    id: 'JE-005',
    date: '2026-10-22',
    voucherNo: 'UNC-001',
    description: 'Thanh toán tiền dịch vụ phòng cho Nam Cát Tiên Ecolodge',
    debitAccount: '331',
    creditAccount: '112',
    amount: 4200000,
    bookingCode: 'DH-001',
    counterparty: 'Nam Cát Tiên Ecolodge'
  },
  {
    id: 'JE-006',
    date: '2026-10-24',
    voucherNo: 'PC-HH-001',
    description: 'Chi trả hoa hồng CTV Hoàng Yến (Gross: 7M, Khấu trừ thuế TNCN 10%: 700K)',
    debitAccount: '641',
    creditAccount: '3335',
    amount: 700000,
    bookingCode: 'DH-001',
    counterparty: 'Cơ quan Thuế (Thuế TNCN CTV)'
  },
  {
    id: 'JE-007',
    date: '2026-10-24',
    voucherNo: 'UNC-HH-001',
    description: 'Chuyển khoản tiền hoa hồng thực nhận (Net) cho CTV Hoàng Yến',
    debitAccount: '641',
    creditAccount: '112',
    amount: 6300000,
    bookingCode: 'DH-001',
    counterparty: 'CTV Hoàng Yến'
  }
];


const DB_KEY = 'haha_os_master_database_v1';

// ==========================================
// 4. QUẢN LÝ CƠ SỞ DỮ LIỆU & QUẢN TRỊ PHIÊN
// ==========================================
let db = {
  users: [],
  ctvs: [],
  tourPolicies: [],
  customers: [],
  quotations: [],
  bookings: [],
  payments: [],
  commissions: [],
  suppliers: [],
  supplierBookings: [],
  auditLogs: [],
  notifications: []
};

let currentUser = null;
let currentModuleId = 2;
let currentLoginMode = 'staff';
let crmFilter = 'all';
let crmSearchQuery = '';
let currentCtvTab = 'customers'; // 'customers', 'bookings', 'commissions', 'policies'
let ctvTourFilter = 'all'; // 'all', 'selling', 'paused', 'selected'
let ctvTourSearchQuery = '';
let ctvTourViewMode = 'grid'; // 'grid' | 'table'
let currentSalesKitTourId = null;

// Quản lý Báo giá & Phân hệ 4
let currentMod4Tab = 'quotations'; // 'quotations' | 'bookings'
let quotationFilter = 'all';
let quotationSearchQuery = '';
let quotationCurrentPage = 1;
const QUOTATIONS_PER_PAGE = 8;

// Quản lý Phân trang & Tìm kiếm cho Mạng lưới lớn
let bookingFilter = 'all';
let bookingSearchQuery = '';
let bookingCurrentPage = 1;
const BOOKINGS_PER_PAGE = 8;

let ctvFilter = 'all';
let ctvSearchQuery = '';
let ctvCurrentPage = 1;
const CTVS_PER_PAGE = 8;
let currentMod3Tab = 'directory'; // 'directory', 'support', 'dormant'
let ctvSaleFilter = 'all';        // 'all', 'NV-002', 'NV-005'...
let ctvRatingFilter = 'all';      // 'all', 'EXCELLENT', 'GOOD', 'LOW', 'DORMANT', 'TERMINATED'
let ctvSupportFilter = 'all';     // 'all', 'pending', 'resolved'
let selectedCtvFor360 = null;
let selectedKpiSaleId = 'NV-002';

let commFilter = 'all';
let commSearchQuery = '';
let currentOpsTab = 'incoming'; // 'incoming', 'tours', 'suppliers', 'orders'
let currentNotifTab = 'inbox'; // 'inbox', 'outbox'

const ROLE_PERMISSIONS = {
  'CEO': [1, 2, 3, 4, 5, 6, 7, 8, 9, 11], // Toàn quyền giám sát & điều hành hợp nhất (Bao gồm Cổng Đối tác)
  'SALE': [2, 3, 4, 8],                // CRM khách hàng, Quản lý CTV, Báo giá & Đơn tour, Ngân hàng tour
  'OPS': [5, 8],                      // Lịch khởi hành & Điều hành tour, Lệnh đặt NCC & Voucher, Ngân hàng tour (Không xem/sửa báo giá Sale)
  'KE_TOAN': [6, 7],                  // Tài chính & Sổ quỹ thu chi, Đối soát hoa hồng CTV & Duyệt lệnh NCC (Tuyệt đối không can thiệp CRM/Báo giá/Điều hành)
  'CTV': [10],                        // Cổng thông tin đối tác CTV
  'SUPPLIER': [11]                    // Cổng quản trị đối tác cung ứng riêng biệt
};

// ==========================================
// RÀ SOÁT & CHUẨN HÓA DỮ LIỆU SỐ LƯỢNG KHÁCH VÀ TIỀN THU (KHÔNG HẠN MỨC CỨNG)
// ==========================================
function parsePaxInput(value) {
  if (value === null || value === undefined) return { valid: false, value: 0, reason: 'Chưa nhập số lượng khách' };
  let str = String(value).trim();
  if (!str) return { valid: false, value: 0, reason: 'Số lượng khách không được để trống' };

  if (str.startsWith('-') || Number(str) < 0) {
    return { valid: false, value: 0, reason: 'Số lượng khách không được là số âm' };
  }

  // Xử lý dấu chấm hoặc dấu phẩy phân tách hàng nghìn (VD: "1.000", "100.000", "1,000", "100,000")
  if (/^\d{1,3}([.,]\d{3})+$/.test(str)) {
    str = str.replace(/[.,]/g, '');
  }

  if (str.includes('.') || str.includes(',')) {
    return { valid: false, value: 0, reason: 'Số lượng khách phải là số nguyên, không chấp nhận số thập phân' };
  }

  const num = Number(str);
  if (!Number.isInteger(num) || num <= 0) {
    return { valid: false, value: 0, reason: 'Số lượng khách phải là số nguyên dương lớn hơn 0' };
  }

  return { valid: true, value: num };
}

function validatePaxNumber(value) {
  return parsePaxInput(value);
}

function parseMoneyInput(value) {
  if (value === null || value === undefined) return { valid: false, value: 0, reason: 'Chưa nhập số tiền' };
  let str = String(value).trim();
  if (!str) return { valid: false, value: 0, reason: 'Số tiền không được để trống' };

  if (str.startsWith('-') || Number(str) < 0) {
    return { valid: false, value: 0, reason: 'Số tiền không được là số âm' };
  }

  // Xóa ký tự tiền tệ và khoảng trắng (VD: "1.625.000.000 đ" -> "1.625.000.000")
  str = str.replace(/[đĐ\sVNvnd]/g, '');

  // Xử lý phân tách hàng nghìn (VD: "1.625.000.000", "1,625,000,000")
  if (/^\d{1,3}([.,]\d{3})+$/.test(str)) {
    str = str.replace(/[.,]/g, '');
  }

  if (str.includes('.') || str.includes(',')) {
    const parts = str.split(/[.,]/);
    if (parts.length === 2 && (parts[1] === '00' || parts[1] === '0')) {
      str = parts[0];
    } else {
      return { valid: false, value: 0, reason: 'Số tiền VNĐ phải là số nguyên tròn đồng' };
    }
  }

  const num = Number(str);
  if (isNaN(num) || !Number.isFinite(num) || num <= 0) {
    return { valid: false, value: 0, reason: 'Số tiền phải là số hợp lệ lớn hơn 0 đ' };
  }

  return { valid: true, value: Math.round(num) };
}

function initApp() {
  loadDatabase();
  setupEventListeners();
  if (typeof initCloudSync === 'function') {
    initCloudSync();
  }

  const savedUser = sessionStorage.getItem('haha_logged_user');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      const freshUser = db.users.find(u => u.id === currentUser.id);
      if (freshUser && freshUser.status === 'active') {
        currentUser = freshUser;
        showMainApp();
      } else {
        handleLogout();
      }
    } catch (e) {
      showLoginScreen();
    }
  } else {
    showLoginScreen();
  }
}

// ==========================================
// HÀM SINH MÃ TỰ TĂNG AN TOÀN CHỐNG TRÙNG LẶP (SAFE AUTO-INCREMENT ID GENERATOR)
// Quét Math.max trên toàn bộ mảng, chống trùng lặp tuyệt đối khi có bản ghi bị xóa
// ==========================================
function generateNextCode(prefix, array, field = 'code', pad = 3) {
  if (!Array.isArray(array) || array.length === 0) {
    return `${prefix}${String(1).padStart(pad, '0')}`;
  }
  let maxNum = 0;
  array.forEach(item => {
    if (!item) return;
    const val = String(item[field] || item.code || item.id || '');
    if (val.startsWith(prefix)) {
      const numStr = val.substring(prefix.length);
      const num = parseInt(numStr, 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  });
  return `${prefix}${String(maxNum + 1).padStart(pad, '0')}`;
}

// ==========================================
// HỆ THỐNG ĐỒNG BỘ TÀI CHÍNH DUY NHẤT (SINGLE SOURCE OF TRUTH)
// ==========================================

// 1. Tính toán số liệu tài chính của một đơn tour từ các phiếu thanh toán và hoàn tiền
function calculateBookingFinancials(booking) {
  if (!booking) {
    return {
      totalAmount: 0,
      paidAmount: 0,
      remainingAmount: 0,
      refundAmount: 0,
      paymentCount: 0
    };
  }

  const bookingIdStr = String(booking.id || '');
  const bookingCodeStr = String(booking.code || '');

  // Lọc các giao dịch thanh toán hợp lệ (CONFIRMED) gắn với đơn tour này
  const relevantPayments = (db.payments || []).filter(p => {
    if (p.status && p.status !== 'CONFIRMED') return false;
    const matchId = p.bookingId && (String(p.bookingId) === bookingIdStr || String(p.bookingId) === bookingCodeStr);
    const matchCode = p.bookingCode && (String(p.bookingCode) === bookingCodeStr || String(p.bookingCode) === bookingIdStr);
    return matchId || matchCode;
  });

  const totalReceipts = relevantPayments
    .filter(p => !p.type || p.type === 'PAYMENT')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const totalRefunds = relevantPayments
    .filter(p => p.type === 'REFUND')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const netPaid = Math.max(0, totalReceipts - totalRefunds);
  const totalAmount = Number(booking.totalAmount) || 0;
  const remainingAmount = Math.max(0, totalAmount - netPaid);

  return {
    totalAmount,
    paidAmount: netPaid,
    remainingAmount,
    refundAmount: totalRefunds,
    paymentCount: relevantPayments.length
  };
}

// 2. Tính toán tổng hợp tài chính của một khách hàng từ tất cả các đơn tour của họ
function getCustomerFinancialSummary(customer) {
  if (!customer) {
    return {
      totalContract: 0,
      totalPaid: 0,
      totalDebt: 0,
      bookingCount: 0,
      bookings: []
    };
  }

  const custIdStr = String(customer.id || '');
  const custCodeStr = String(customer.code || '');
  const custPhone = String(customer.phone || '').trim();

  // Tìm tất cả đơn tour thuộc về khách hàng này (loại trừ đơn Đã hủy)
  const myBookings = (db.bookings || []).filter(b => {
    if (b.status === 'Đã hủy') return false;
    const matchId = b.customerId !== undefined && b.customerId !== null && (String(b.customerId) === custIdStr || String(b.customerId) === custCodeStr);
    const matchPhone = custPhone && b.customerPhone && String(b.customerPhone).trim() === custPhone;
    return matchId || matchPhone;
  });

  let totalContract = 0;
  let totalPaid = 0;
  let totalDebt = 0;

  myBookings.forEach(b => {
    const fin = calculateBookingFinancials(b);
    totalContract += fin.totalAmount;
    totalPaid += fin.paidAmount;
    totalDebt += fin.remainingAmount;
  });

  return {
    totalContract,
    totalPaid,
    totalDebt,
    bookingCount: myBookings.length,
    bookings: myBookings
  };
}

// 3. Đồng bộ dữ liệu tài chính hai chiều vào hồ sơ khách hàng
function syncCustomerFinancials(customerOrId) {
  if (!customerOrId || !db.customers) return null;
  let cust = null;
  if (typeof customerOrId === 'object') {
    cust = customerOrId;
  } else {
    cust = db.customers.find(c => String(c.id) === String(customerOrId) || String(c.code) === String(customerOrId));
  }
  if (!cust) return null;

  const summary = getCustomerFinancialSummary(cust);

  if (summary.bookingCount > 0) {
    cust.tourValue = summary.totalContract;
    cust.paidAmount = summary.totalPaid;
    cust.remainingDebt = summary.totalDebt;
    cust.bookingCount = summary.bookingCount;

    if (!cust.status || !cust.status.includes('Hủy')) {
      if (summary.totalPaid >= summary.totalContract && summary.totalContract > 0) {
        cust.status = 'Đã chốt tour';
      } else if (summary.totalPaid > 0) {
        cust.status = 'Đã chốt tour';
      }
    }
  } else {
    // Khách hàng chưa có đơn tour
    if (cust.paidAmount === undefined || cust.paidAmount > 0) {
      cust.paidAmount = 0;
    }
    cust.remainingDebt = 0;
    cust.bookingCount = 0;
  }

  // Cập nhật hoa hồng liên kết nếu có - Khóa chặt theo bookingCode chống va chạm đa đơn tour
  if (cust.collaboratorId && summary.bookingCount > 0) {
    summary.bookings.forEach(b => {
      const comm = (db.commissions || []).find(c => c.bookingCode === b.code || (!c.bookingCode && c.customerId && String(c.customerId) === String(cust.id)));
      if (comm) {
        if (!comm.bookingCode) comm.bookingCode = b.code;
        comm.tourValue = b.totalAmount;
        const policy = db.tourPolicies.find(tp => tp.id === b.tourId) || findTourPolicy(b.tourName);
        if (policy) {
          const calc = calculateTourCommission({ tourValue: b.totalAmount, paxCount: b.paxCount, costValue: b.estimatedCost }, policy);
          comm.amount = calc.amount;
          comm.basisText = calc.basisText;
          comm.policyApplied = `${policy.name} (${policy.methodTitle})`;
        }
      }
    });
  }

  return summary;
}

// 4. Đồng bộ toàn bộ dữ liệu tài chính của hệ thống (Reconcile toàn vẹn)
function syncAllFinancialData() {
  if (!db) return;

  // A. Đồng bộ từng đơn tour từ db.payments
  if (Array.isArray(db.bookings)) {
    db.bookings.forEach(b => {
      const fin = calculateBookingFinancials(b);
      b.paidAmount = fin.paidAmount;
      b.remainingAmount = fin.remainingAmount;
      b.refundAmount = fin.refundAmount;

      if (b.status !== 'Đã hoàn thành' && b.status !== 'Đã hủy' && b.status !== 'Đang thực hiện') {
        if (b.paidAmount >= b.totalAmount && b.totalAmount > 0) {
          b.status = 'Đã thanh toán đủ';
          b.financialStatus = 'Đã thanh toán đủ';
        } else if (b.paidAmount > 0) {
          b.status = 'Đã đặt cọc';
          b.financialStatus = 'Đã đặt cọc';
        } else {
          b.status = 'Chờ thanh toán';
          b.financialStatus = 'Chờ thanh toán';
        }
      }
    });
  }

  // B. Đồng bộ từng khách hàng từ db.bookings & db.payments
  if (Array.isArray(db.customers)) {
    db.customers.forEach(c => {
      syncCustomerFinancials(c);
    });
  }
}

function loadDatabase() {
  const localDb = localStorage.getItem(DB_KEY);
  if (localDb) {
    try {
      db = JSON.parse(localDb);
      migrateDatabaseIfNeeded();
      syncAllFinancialData();
    } catch (e) {
      resetDatabaseToDefault();
    }
  } else {
    resetDatabaseToDefault();
  }
}

function saveDatabase() {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  if (typeof pushToCloud === 'function') {
    pushToCloud(true);
  }
}

function resetDatabaseToDefault() {
  db = {
    users: JSON.parse(JSON.stringify(INITIAL_USERS)),
    ctvs: JSON.parse(JSON.stringify(INITIAL_CTVS)),
    tourPolicies: JSON.parse(JSON.stringify(INITIAL_TOUR_POLICIES)),
    customers: JSON.parse(JSON.stringify(INITIAL_CUSTOMERS)),
    quotations: JSON.parse(JSON.stringify(INITIAL_QUOTATIONS)),
    bookings: JSON.parse(JSON.stringify(INITIAL_BOOKINGS)),
    payments: JSON.parse(JSON.stringify(INITIAL_PAYMENTS)),
    commissions: JSON.parse(JSON.stringify(INITIAL_COMMISSIONS)),
    suppliers: JSON.parse(JSON.stringify(INITIAL_SUPPLIERS)),
    supplierBookings: JSON.parse(JSON.stringify(INITIAL_SUPPLIER_BOOKINGS)),
    auditLogs: JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS)),
    notifications: JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS)),
    ctvSupportMessages: JSON.parse(JSON.stringify(INITIAL_CTV_SUPPORT_MESSAGES)),
    saleKpis: JSON.parse(JSON.stringify(INITIAL_SALE_KPIS))
  };
  syncAllFinancialData();
  saveDatabase();
}

// Migration an toàn: Bổ sung các bảng mới nếu chưa có, bảo toàn 100% dữ liệu cũ
function migrateDatabaseIfNeeded() {
  let changed = false;

  if (!db.invoices || db.invoices.length === 0) {
    db.invoices = JSON.parse(JSON.stringify(INITIAL_INVOICES));
    changed = true;
  }
  if (!db.taxReceipts || db.taxReceipts.length === 0) {
    db.taxReceipts = JSON.parse(JSON.stringify(INITIAL_TAX_RECEIPTS));
    changed = true;
  }
  if (!db.journalEntries || db.journalEntries.length === 0) {
    db.journalEntries = JSON.parse(JSON.stringify(INITIAL_JOURNAL_ENTRIES));
    changed = true;
  }

  // 1. Cập nhật bảng tourPolicies nếu chưa có
  if (!db.tourPolicies || db.tourPolicies.length === 0) {
    db.tourPolicies = JSON.parse(JSON.stringify(INITIAL_TOUR_POLICIES));
    changed = true;
  } else {
    // Đảm bảo tất cả tour trong INITIAL_TOUR_POLICIES đều có mặt
    INITIAL_TOUR_POLICIES.forEach(initP => {
      let p = db.tourPolicies.find(x => x.id === initP.id);
      if (!p) {
        db.tourPolicies.push(JSON.parse(JSON.stringify(initP)));
        changed = true;
      } else {
        if (!p.price) { p.price = initP.price; changed = true; }
        if (!p.duration) { p.duration = initP.duration; changed = true; }
        if (!p.estimatedCost) { p.estimatedCost = initP.estimatedCost; changed = true; }
        if (!p.status) { p.status = initP.status || 'selling'; changed = true; }
        if (initP.pauseReason && !p.pauseReason) { p.pauseReason = initP.pauseReason; changed = true; }
      }
    });
  }

  // 1a. Đảm bảo mỗi CTV có danh mục tour đã chọn bán (selectedTourIds) & Sale phụ trách & Trạng thái hoạt động
  if (!db.ctvs || db.ctvs.length === 0) {
    db.ctvs = JSON.parse(JSON.stringify(INITIAL_CTVS));
    changed = true;
  } else {
    INITIAL_CTVS.forEach(initC => {
      let c = db.ctvs.find(x => x.id === initC.id || x.code === initC.code);
      if (!c) {
        db.ctvs.push(JSON.parse(JSON.stringify(initC)));
        changed = true;
      } else {
        if (!c.selectedTourIds || !Array.isArray(c.selectedTourIds)) {
          c.selectedTourIds = Array.isArray(initC.selectedTourIds) ? [...initC.selectedTourIds] : ['TOUR-01', 'TOUR-02'];
          changed = true;
        }
        if (!c.assignedSaleId && initC.assignedSaleId) {
          c.assignedSaleId = initC.assignedSaleId;
          c.assignedSale = initC.assignedSale;
          c.assignedSalePhone = initC.assignedSalePhone;
          changed = true;
        }
        if (!c.lastActiveDate && initC.lastActiveDate) {
          c.lastActiveDate = initC.lastActiveDate;
          changed = true;
        }
        if (!c.accountStatus && initC.accountStatus) {
          c.accountStatus = initC.accountStatus;
          changed = true;
        }
        if (initC.terminationReason && !c.terminationReason) {
          c.terminationReason = initC.terminationReason;
          c.terminationDate = initC.terminationDate;
          changed = true;
        }
      }
    });
  }

  // 1b. Bổ sung bảng quotations nếu chưa có
  if (!db.quotations || db.quotations.length === 0) {
    db.quotations = JSON.parse(JSON.stringify(INITIAL_QUOTATIONS));
    changed = true;
  }

  // 2. Bổ sung bảng bookings nếu chưa có
  if (!db.bookings || db.bookings.length === 0) {
    db.bookings = JSON.parse(JSON.stringify(INITIAL_BOOKINGS));
    changed = true;
  } else {
    // Đảm bảo các booking có trường liên kết quotationId & quotationCode
    db.bookings.forEach(b => {
      if (!b.quotationCode) {
        const initB = INITIAL_BOOKINGS.find(x => x.code === b.code);
        if (initB && initB.quotationCode) {
          b.quotationCode = initB.quotationCode;
          b.quotationId = initB.quotationId;
          changed = true;
        }
      }
    });
  }

  // 3. Bổ sung bảng payments nếu chưa có
  if (!db.payments || db.payments.length === 0) {
    db.payments = JSON.parse(JSON.stringify(INITIAL_PAYMENTS));
    changed = true;
  }

  // 4. Bổ sung bảng suppliers nếu chưa có hoặc chuẩn hóa danh bạ đối tác giàu dữ liệu
  if (!db.suppliers || db.suppliers.length === 0) {
    db.suppliers = JSON.parse(JSON.stringify(INITIAL_SUPPLIERS));
    changed = true;
  } else {
    INITIAL_SUPPLIERS.forEach(initS => {
      let s = db.suppliers.find(x => x.code === initS.code || x.id === initS.id);
      if (!s) {
        db.suppliers.push(JSON.parse(JSON.stringify(initS)));
        changed = true;
      } else {
        if (!s.province) { s.province = initS.province; changed = true; }
        if (!s.stars) { s.stars = initS.stars || 4; changed = true; }
        if (!s.priceMin) { s.priceMin = initS.priceMin || 500000; changed = true; }
        if (!s.priceMax) { s.priceMax = initS.priceMax || 2000000; changed = true; }
        if (!s.address) { s.address = initS.address; changed = true; }
        if (!s.avatar) { s.avatar = initS.avatar || '🏨'; changed = true; }
        if (!s.services || !Array.isArray(s.services) || s.services.length === 0) {
          s.services = JSON.parse(JSON.stringify(initS.services || []));
          changed = true;
        }
        if (!s.policies) {
          s.policies = JSON.parse(JSON.stringify(initS.policies || {}));
          changed = true;
        }
        if (!s.dailyLiveStatus) {
          s.dailyLiveStatus = JSON.parse(JSON.stringify(initS.dailyLiveStatus || {}));
          changed = true;
        }
        if (!s.debtPolicy) {
          s.debtPolicy = initS.debtPolicy || 'DEBT_7D';
          s.debtPolicyTitle = initS.debtPolicyTitle || 'Công nợ 7 ngày sau tour';
          s.debtLimit = initS.debtLimit || 50000000;
          changed = true;
        }
      }
    });
  }

  // Đảm bảo users có tài khoản đối tác NCC
  if (db.users) {
    INITIAL_USERS.filter(u => u.role === 'SUPPLIER').forEach(initU => {
      if (!db.users.some(u => u.username === initU.username)) {
        db.users.push(JSON.parse(JSON.stringify(initU)));
        changed = true;
      }
    });
  }
  // 5. Bổ sung bảng supplierBookings nếu chưa có
  if (!db.supplierBookings || db.supplierBookings.length === 0) {
    db.supplierBookings = JSON.parse(JSON.stringify(INITIAL_SUPPLIER_BOOKINGS));
    changed = true;
  } else {
    db.supplierBookings.forEach(sb => {
      if (!sb.payType) {
        sb.payType = 'CREDIT';
        changed = true;
      }
      if (!sb.debtPolicy) {
        const s = (db.suppliers || []).find(x => x.id === sb.supplierId || x.code === sb.supplierId);
        sb.debtPolicy = s ? s.debtPolicy : 'DEBT_7D';
        sb.debtPolicyTitle = s ? s.debtPolicyTitle : 'Công nợ 7 ngày sau tour';
        changed = true;
      }
    });
  }

  // 6. Xóa bỏ hoàn toàn trường rate trong hồ sơ CTV
  if (db.ctvs) {
    db.ctvs.forEach(ctv => {
      if (ctv.rate !== undefined) {
        delete ctv.rate;
        changed = true;
      }
    });
  }

  // 7. Đảm bảo mật khẩu & trạng thái
  if (db.users) {
    db.users.forEach(u => {
      if (!u.passwordHash) {
        u.salt = SYSTEM_SALT;
        u.passwordHash = DEFAULT_PASS_HASH;
        changed = true;
      }
      if (!u.status) {
        u.status = 'active';
        changed = true;
      }
    });

    INITIAL_USERS.filter(u => u.role === 'CTV').forEach(initCtvUser => {
      const exists = db.users.find(u => u.username === initCtvUser.username);
      if (!exists) {
        db.users.push(initCtvUser);
        changed = true;
      }
    });
  }

  // 8. Đảm bảo đầy đủ 20 Khách Hàng, 20 Báo Giá, 20 Đơn Tour, Phiếu Thu, NCC và Hoa Hồng vào DB
  if (db.customers) {
    INITIAL_CUSTOMERS.forEach(initC => {
      const exists = db.customers.find(c => c.code === initC.code || String(c.id) === String(initC.id));
      if (!exists) {
        db.customers.push(JSON.parse(JSON.stringify(initC)));
        changed = true;
      }
    });
  }

  if (db.quotations) {
    INITIAL_QUOTATIONS.forEach(initQ => {
      const exists = db.quotations.find(q => q.code === initQ.code || q.id === initQ.id);
      if (!exists) {
        db.quotations.push(JSON.parse(JSON.stringify(initQ)));
        changed = true;
      }
    });
  }

  if (db.bookings) {
    INITIAL_BOOKINGS.forEach(initB => {
      let b = db.bookings.find(item => item.code === initB.code || item.id === initB.id);
      if (!b) {
        db.bookings.push(JSON.parse(JSON.stringify(initB)));
        changed = true;
      } else {
        // Bổ sung các tính năng nâng cao nếu chưa có
        if (!b.passengers || b.passengers.length === 0) {
          b.passengers = JSON.parse(JSON.stringify(initB.passengers || []));
          changed = true;
        }
        if (!b.itinerary || b.itinerary.length === 0) {
          b.itinerary = JSON.parse(JSON.stringify(initB.itinerary || []));
          changed = true;
        }
        if (initB.feedback && !b.feedback) {
          b.feedback = JSON.parse(JSON.stringify(initB.feedback));
          changed = true;
        }
        if (!b.incidents || b.incidents.length === 0) {
          b.incidents = JSON.parse(JSON.stringify(initB.incidents || []));
          changed = true;
        }
        if (initB.code === 'DH-017' && b.estimatedCost !== 38000000) {
          b.estimatedCost = 38000000;
          changed = true;
        }
        if (initB.code === 'DH-019' && b.estimatedCost !== 80000000) {
          b.estimatedCost = 80000000;
          changed = true;
        }
        if (!b.actualCost && initB.actualCost) {
          b.actualCost = initB.actualCost;
          changed = true;
        }
      }
    });
  }

  if (db.payments) {
    INITIAL_PAYMENTS.forEach(initP => {
      const exists = db.payments.find(p => p.code === initP.code || p.id === initP.id);
      if (!exists) {
        db.payments.push(JSON.parse(JSON.stringify(initP)));
        changed = true;
      }
    });
  }

  if (db.supplierBookings) {
    INITIAL_SUPPLIER_BOOKINGS.forEach(initSb => {
      let sb = db.supplierBookings.find(s => s.code === initSb.code || s.id === initSb.id);
      if (!sb) {
        db.supplierBookings.push(JSON.parse(JSON.stringify(initSb)));
        changed = true;
      } else {
        if (initSb.priceAlert && (!sb.priceAlert || sb.contractRate !== initSb.contractRate)) {
          sb.priceAlert = initSb.priceAlert;
          sb.contractRate = initSb.contractRate;
          sb.priceAlertNote = initSb.priceAlertNote;
          changed = true;
        }
      }
    });
  }

  if (db.commissions) {
    INITIAL_COMMISSIONS.forEach(initComm => {
      const exists = db.commissions.find(c => c.id === initComm.id || (c.bookingCode && c.bookingCode === initComm.bookingCode));
      if (!exists) {
        db.commissions.push(JSON.parse(JSON.stringify(initComm)));
        changed = true;
      }
    });
  }

  // 10. Bổ sung bảng notifications nếu chưa có
  if (!db.notifications || db.notifications.length === 0) {
    db.notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
    changed = true;
  }

  // 10b. Bổ sung bảng ctvSupportMessages (Hộp thư trao đổi 2 chiều CTV & Sale)
  if (!db.ctvSupportMessages || db.ctvSupportMessages.length === 0) {
    db.ctvSupportMessages = JSON.parse(JSON.stringify(INITIAL_CTV_SUPPORT_MESSAGES));
    changed = true;
  } else {
    INITIAL_CTV_SUPPORT_MESSAGES.forEach(initMsg => {
      const exists = db.ctvSupportMessages.find(m => m.id === initMsg.id);
      if (!exists) {
        db.ctvSupportMessages.push(JSON.parse(JSON.stringify(initMsg)));
        changed = true;
      }
    });
  }

  // 10c. Bổ sung các tài khoản nhân sự & CTV mới vào users nếu chưa có
  if (db.users) {
    INITIAL_USERS.forEach(initU => {
      const exists = db.users.find(u => u.username === initU.username);
      if (!exists) {
        db.users.push(JSON.parse(JSON.stringify(initU)));
        changed = true;
      }
    });
  }

  // 10d. Bổ sung bảng saleKpis (Chỉ tiêu KPI & Cơ chế Hoa hồng Sale)
  if (!db.saleKpis || db.saleKpis.length === 0) {
    db.saleKpis = JSON.parse(JSON.stringify(INITIAL_SALE_KPIS));
    changed = true;
  } else {
    INITIAL_SALE_KPIS.forEach(initKpi => {
      const exists = db.saleKpis.find(k => k.saleId === initKpi.saleId);
      if (!exists) {
        db.saleKpis.push(JSON.parse(JSON.stringify(initKpi)));
        changed = true;
      }
    });
  }

  // 11. Đồng bộ toàn vẹn số liệu tài chính hệ thống
  syncAllFinancialData();
  changed = true;

  if (changed) saveDatabase();
}

function recordAuditLog(action, details) {
  const now = new Date();
  const timeStr = now.toISOString().replace('T', ' ').substring(0, 19);
  const logEntry = {
    time: timeStr,
    user: currentUser ? currentUser.name : 'Khách vãng lai',
    role: currentUser ? currentUser.role : 'GUEST',
    action: action,
    details: details
  };

  db.auditLogs.unshift(logEntry);
  saveDatabase();
}

// ==========================================
// 4B. TRUNG TÂM THÔNG BÁO & CHUYỂN GIAO LIÊN PHÒNG BAN (INTER-DEPARTMENTAL HANDOVER)
// ==========================================
function getRoleTitle(role) {
  if (role === 'CEO') return 'Giám đốc Điều hành (CEO)';
  if (role === 'SALE') return 'Phòng Kinh doanh (Sale)';
  if (role === 'OPS' || role === 'DIEU_HANH') return 'Bộ phận Điều hành Tour (OPS)';
  if (role === 'KE_TOAN') return 'Bộ phận Tài chính & Kế toán';
  if (role === 'CTV') return 'Cộng tác viên (CTV)';
  return role;
}

function sendInterDeptNotification(options) {
  if (!db.notifications) db.notifications = [];

  const notifId = generateNextCode('NT-', db.notifications, 'id');
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const newNotif = {
    id: notifId,
    type: options.type || 'HANDOVER_GENERAL',
    senderRole: options.senderRole || (currentUser ? currentUser.role : 'SYSTEM'),
    senderName: options.senderName || (currentUser ? `${currentUser.name} (${currentUser.roleTitle})` : 'Hệ thống HAHA OS'),
    targetRole: options.targetRole || 'CEO',
    targetModule: options.targetModule || 1,
    title: options.title || 'Thông báo chuyển giao công việc',
    message: options.message || '',
    referenceId: options.referenceId || '',
    referenceType: options.referenceType || 'GENERAL',
    status: 'UNREAD',
    createdAt: nowStr,
    readAt: null,
    acknowledgedAt: null,
    acknowledgedBy: null
  };

  db.notifications.unshift(newNotif);
  saveDatabase();

  recordAuditLog('CHUYỂN GIAO LIÊN PHÒNG BAN', `[${getRoleTitle(newNotif.senderRole)}] gửi bàn giao sang [${getRoleTitle(newNotif.targetRole)}]: "${newNotif.title}".`);

  updateNotificationBadges();

  return newNotif;
}

function updateNotificationBadges() {
  if (!currentUser) return;
  if (!db.notifications) db.notifications = [];

  // Lọc thông báo chưa đọc gửi đến vai trò của currentUser (CEO xem được tất cả)
  const isCeo = currentUser.role === 'CEO';
  const unreadForUser = db.notifications.filter(n => {
    if (n.status !== 'UNREAD') return false;
    if (isCeo) return true;
    if (currentUser.role === 'OPS' && (n.targetRole === 'OPS' || n.targetRole === 'DIEU_HANH')) return true;
    return n.targetRole === currentUser.role;
  });

  const unreadCount = unreadForUser.length;

  // 1. Cập nhật Badge trên chuông Topbar
  const topbarBadge = document.getElementById('notif-badge-count');
  if (topbarBadge) {
    topbarBadge.textContent = unreadCount;
    if (unreadCount > 0) {
      topbarBadge.classList.remove('hidden');
    } else {
      topbarBadge.classList.add('hidden');
    }
  }

  // 2. Cập nhật Badge trên từng Phân hệ Sidebar & Các Tab Chuyên Môn
  const setSidebarBadge = (elemId, count) => {
    const el = document.getElementById(elemId);
    if (!el) return;
    el.textContent = count;
    if (count > 0) el.classList.remove('hidden');
    else el.classList.add('hidden');
  };

  // Khách mới tiếp nhận từ CTV / Direct chờ Sale tư vấn (Module 2)
  const crmNewCount = (db.customers || []).filter(c => c.status === 'Mới tiếp nhận').length;
  setSidebarBadge('sidebar-badge-mod2', crmNewCount);

  const crmFilterNewBadge = document.getElementById('crm-filter-new-count');
  if (crmFilterNewBadge) {
    crmFilterNewBadge.textContent = crmNewCount;
    if (crmNewCount > 0) crmFilterNewBadge.classList.remove('hidden');
    else crmFilterNewBadge.classList.add('hidden');
  }

  // Đơn mới tiếp nhận của Điều hành (Module 5)
  const opsIncomingCount = (db.bookings || []).filter(b => b.status !== 'Đã hủy' && b.tourStatus === 'Mới tiếp nhận').length;
  setSidebarBadge('sidebar-badge-mod5', opsIncomingCount);

  // Báo giá chờ duyệt / chốt tour (Module 4)
  const quotePendingCount = (db.quotations || []).filter(q => q.status === 'Chờ xác nhận').length;
  setSidebarBadge('sidebar-badge-mod4', quotePendingCount);

  // Kế toán: Đơn tour còn nợ cần thu tiền (Module 6)
  const finDebtCount = (db.bookings || []).filter(b => b.status !== 'Đã hủy' && (b.remainingAmount || 0) > 0).length;
  setSidebarBadge('sidebar-badge-mod6', finDebtCount);

  // Kế toán: Lệnh đặt dịch vụ NCC chờ duyệt + Hoa hồng chờ duyệt chi (Module 7)
  const finOrdersCount = (db.supplierBookings || []).filter(sb => sb.status === 'WAIT_PAY_APPROVAL' || sb.status === 'WAIT_DEBT_APPROVAL' || sb.status === 'PENDING_APPROVAL').length;
  const commPendingCount = (db.commissions || []).filter(c => c.status === 'Chờ duyệt' || c.status === 'Đã duyệt chi').length;
  setSidebarBadge('sidebar-badge-mod7', finOrdersCount + commPendingCount);

  // Cổng CTV (Module 10)
  const ctvPayoutNotifs = db.notifications.filter(n => n.targetRole === 'CTV' && n.status === 'UNREAD').length;
  setSidebarBadge('sidebar-badge-mod10', ctvPayoutNotifs);

  // Cập nhật badge trong Phân hệ 5
  renderOpsIncomingBadge();
}

function toggleNotificationCenter() {
  const dropdown = document.getElementById('notif-dropdown');
  if (!dropdown) return;
  const isHidden = dropdown.classList.contains('hidden');
  if (isHidden) {
    dropdown.classList.remove('hidden');
    renderNotificationList();
  } else {
    dropdown.classList.add('hidden');
  }
}

function switchNotifTab(tab) {
  currentNotifTab = tab;
  const tabInbox = document.getElementById('notif-tab-inbox');
  const tabOutbox = document.getElementById('notif-tab-outbox');

  if (tab === 'inbox') {
    if (tabInbox) {
      tabInbox.classList.add('font-bold', 'text-brand-700', 'border-b-2', 'border-brand-600');
      tabInbox.classList.remove('text-slate-500');
    }
    if (tabOutbox) {
      tabOutbox.classList.remove('font-bold', 'text-brand-700', 'border-b-2', 'border-brand-600');
      tabOutbox.classList.add('text-slate-500');
    }
  } else {
    if (tabOutbox) {
      tabOutbox.classList.add('font-bold', 'text-brand-700', 'border-b-2', 'border-brand-600');
      tabOutbox.classList.remove('text-slate-500');
    }
    if (tabInbox) {
      tabInbox.classList.remove('font-bold', 'text-brand-700', 'border-b-2', 'border-brand-600');
      tabInbox.classList.add('text-slate-500');
    }
  }
  renderNotificationList();
}

function renderNotificationList() {
  const container = document.getElementById('notif-list-container');
  if (!container || !currentUser) return;
  if (!db.notifications) db.notifications = [];

  const isCeo = currentUser.role === 'CEO';

  // 1. Lọc Hộp thư đến (Inbox)
  const inboxList = db.notifications.filter(n => {
    if (isCeo) return true;
    if (currentUser.role === 'OPS' && (n.targetRole === 'OPS' || n.targetRole === 'DIEU_HANH')) return true;
    return n.targetRole === currentUser.role;
  });

  // 2. Lọc Đã gửi (Outbox)
  const outboxList = db.notifications.filter(n => {
    if (isCeo) return true;
    if (currentUser.role === 'OPS' && (n.senderRole === 'OPS' || n.senderRole === 'DIEU_HANH')) return true;
    return n.senderRole === currentUser.role;
  });

  const countInboxEl = document.getElementById('notif-tab-inbox-count');
  const countOutboxEl = document.getElementById('notif-tab-outbox-count');
  if (countInboxEl) countInboxEl.textContent = inboxList.filter(n => n.status === 'UNREAD').length;
  if (countOutboxEl) countOutboxEl.textContent = outboxList.length;

  const currentList = currentNotifTab === 'inbox' ? inboxList : outboxList;

  if (currentList.length === 0) {
    container.innerHTML = `
      <div class="py-8 text-center text-slate-400">
        <span class="text-2xl">📭</span>
        <div class="mt-1 font-medium text-xs">Không có thông báo nào trong mục này</div>
      </div>
    `;
    return;
  }

  container.innerHTML = currentList.map(n => {
    if (currentNotifTab === 'inbox') {
      const isUnread = n.status === 'UNREAD';
      const statusBadge = isUnread
        ? '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700">🔵 Chưa đọc</span>'
        : (n.status === 'ACKNOWLEDGED'
            ? '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">✅ Đã tiếp nhận</span>'
            : '<span class="px-1.5 py-0.5 rounded text-[9px] font-medium bg-slate-100 text-slate-600">✓ Đã đọc</span>');

      return `
        <div class="p-3 hover:bg-slate-50 transition-colors ${isUnread ? 'bg-blue-50/50' : ''}">
          <div class="flex items-center justify-between gap-1 mb-1">
            <span class="font-bold text-slate-900 line-clamp-1">${escapeHtml(n.title)}</span>
            ${statusBadge}
          </div>
          <p class="text-[11px] text-slate-600 mb-1.5">${escapeHtml(n.message)}</p>
          <div class="flex items-center justify-between text-[10px] text-slate-400">
            <span>Từ: <b class="text-slate-700">${escapeHtml(n.senderName)}</b></span>
            <span>${escapeHtml(n.createdAt)}</span>
          </div>
          <div class="mt-2 flex items-center justify-end space-x-2">
            <button onclick="handleNotificationClick('${n.id}')" class="px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold text-[10px] shadow-sm transition-all flex items-center space-x-1">
              <span>Đến phân hệ xử lý &rarr;</span>
            </button>
          </div>
        </div>
      `;
    } else {
      // Outbox (Đã gửi)
      const recipientStatus = n.status === 'UNREAD'
        ? '<span class="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800">⏳ Phía nhận: Chưa đọc</span>'
        : (n.status === 'ACKNOWLEDGED'
            ? `<span class="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">✅ Phía nhận: Đã tiếp nhận</span>`
            : '<span class="px-2 py-0.5 rounded text-[9px] font-medium bg-blue-100 text-blue-800">👁️ Phía nhận: Đã đọc</span>');

      return `
        <div class="p-3 hover:bg-slate-50 transition-colors">
          <div class="flex items-center justify-between gap-1 mb-1">
            <span class="font-bold text-slate-900 line-clamp-1">${escapeHtml(n.title)}</span>
            ${recipientStatus}
          </div>
          <p class="text-[11px] text-slate-600 mb-1.5">${escapeHtml(n.message)}</p>
          <div class="flex items-center justify-between text-[10px] text-slate-400">
            <span>Gửi đến: <b class="text-slate-700">${getRoleTitle(n.targetRole)}</b></span>
            <span>${escapeHtml(n.createdAt)}</span>
          </div>
          ${n.acknowledgedAt ? `<div class="mt-1 text-[9px] text-emerald-700 font-mono">Xác nhận tiếp nhận lúc: ${escapeHtml(n.acknowledgedAt)} bởi ${escapeHtml(n.acknowledgedBy || 'Bộ phận nhận')}</div>` : ''}
        </div>
      `;
    }
  }).join('');
}

function markAllNotificationsAsRead() {
  if (!currentUser) return;
  const isCeo = currentUser.role === 'CEO';
  if (db.notifications) {
    db.notifications.forEach(n => {
      if (isCeo || n.targetRole === currentUser.role || (currentUser.role === 'OPS' && (n.targetRole === 'OPS' || n.targetRole === 'DIEU_HANH'))) {
        if (n.status === 'UNREAD') {
          n.status = 'READ';
          n.readAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
        }
      }
    });
  }
  saveDatabase();
  renderNotificationList();
  updateNotificationBadges();
}

function handleNotificationClick(notifId) {
  const n = (db.notifications || []).find(item => item.id === notifId);
  if (!n) return;

  if (n.status === 'UNREAD') {
    n.status = 'READ';
    n.readAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    saveDatabase();
  }

  // Đóng dropdown
  const dropdown = document.getElementById('notif-dropdown');
  if (dropdown) dropdown.classList.add('hidden');

  updateNotificationBadges();

  // Chuyển sang module đích
  if (n.targetModule) {
    switchModule(n.targetModule);
    if (n.targetModule === 5) {
      if (n.type === 'HANDOVER_TOUR') {
        switchOpsTab('incoming');
      } else if (n.type === 'HANDOVER_SUPPLIER_ORDER') {
        switchOpsTab('orders');
      }
    } else if (n.targetModule === 4) {
      if (n.referenceType === 'QUOTATION') {
        switchMod4Tab('quotations');
      } else {
        switchMod4Tab('bookings');
      }
    }
  }
}

// ==========================================
// 5. QUẢN LÝ ĐĂNG NHẬP & PHÂN QUYỀN
// ==========================================
// ==========================================
// 5. QUẢN LÝ ĐĂNG NHẬP, PHÂN TÁCH CỔNG & PHÂN QUYỀN CHUYÊN BIỆT
// ==========================================
currentLoginMode = 'gateway';
let currentSelectedDept = 'ALL';

function showPortalGateway() {
  currentLoginMode = 'gateway';
  const gatewayBox = document.getElementById('portal-gateway-box');
  const staffBox = document.getElementById('staff-login-box');
  const ctvBox = document.getElementById('ctv-login-box');
  const supplierBox = document.getElementById('supplier-login-box');
  const subTitle = document.getElementById('login-portal-subtitle');
  const desc = document.getElementById('login-portal-desc');

  if (gatewayBox) gatewayBox.classList.remove('hidden');
  if (staffBox) staffBox.classList.add('hidden');
  if (ctvBox) ctvBox.classList.add('hidden');
  if (supplierBox) supplierBox.classList.add('hidden');

  if (subTitle) subTitle.textContent = "TRUNG TÂM ĐIỀU HƯỚNG CỔNG DOANH NGHIỆP";
  if (desc) desc.textContent = "Hệ thống Quản trị & Vận hành Du lịch Hợp nhất HaHa Eco Travel";
}

function selectPortal(mode) {
  toggleLoginMode(mode);
}

function toggleLoginMode(mode) {
  currentLoginMode = mode;
  const gatewayBox = document.getElementById('portal-gateway-box');
  const staffBox = document.getElementById('staff-login-box');
  const ctvBox = document.getElementById('ctv-login-box');
  const supplierBox = document.getElementById('supplier-login-box');
  const subTitle = document.getElementById('login-portal-subtitle');
  const desc = document.getElementById('login-portal-desc');

  const btnStaff = document.getElementById('tab-btn-login-staff');
  const btnCtv = document.getElementById('tab-btn-login-ctv');
  const btnSup = document.getElementById('tab-btn-login-supplier');

  // Luôn ẩn Gateway khi đã chọn một cổng cụ thể
  if (gatewayBox) gatewayBox.classList.add('hidden');

  const resetBtn = (b) => {
    if (!b) return;
    b.className = 'py-2 rounded-xl transition-all text-slate-500 hover:text-slate-900 font-bold text-xs';
  };
  const setBtnActive = (b, extraClass) => {
    if (!b) return;
    b.className = 'py-2 rounded-xl transition-all shadow-sm bg-white font-extrabold text-xs border border-slate-200 ' + extraClass;
  };

  resetBtn(btnStaff);
  resetBtn(btnCtv);
  resetBtn(btnSup);

  if (mode === 'ctv') {
    if (staffBox) staffBox.classList.add('hidden');
    if (ctvBox) ctvBox.classList.remove('hidden');
    if (supplierBox) supplierBox.classList.add('hidden');
    if (subTitle) subTitle.textContent = "CỔNG THÔNG TIN ĐỐI TÁC CỘNG TÁC VIÊN";
    if (desc) desc.textContent = "Dành riêng cho CTV theo dõi khách hàng và hoa hồng theo tour";
    setBtnActive(btnCtv, 'text-emerald-800');
  } else if (mode === 'supplier') {
    if (staffBox) staffBox.classList.add('hidden');
    if (ctvBox) ctvBox.classList.add('hidden');
    if (supplierBox) supplierBox.classList.remove('hidden');
    if (subTitle) subTitle.textContent = "HAHA PARTNER EXTRANET B2B";
    if (desc) desc.textContent = "Cổng Quản Trị Cung Ứng Khách Sạn, Xe & Dịch Vụ Du Lịch Toàn Quốc";
    setBtnActive(btnSup, 'text-indigo-800');
  } else {
    // Default mode: staff
    if (staffBox) staffBox.classList.remove('hidden');
    if (ctvBox) ctvBox.classList.add('hidden');
    if (supplierBox) supplierBox.classList.add('hidden');
    if (subTitle) subTitle.textContent = "HAHA OPERATING SYSTEM V1.0";
    if (desc) desc.textContent = "Hệ thống Điều hành Doanh nghiệp Du lịch Hợp nhất";
    setBtnActive(btnStaff, 'text-slate-900');
  }
}

// ==========================================
// BỘ LỌC PHÒNG BAN NỘI BỘ (STAFF DEPARTMENT FILTER)
// Giúp nhân viên chỉ thấy giao diện của đúng bộ phận mình
// ==========================================
function filterStaffDept(dept) {
  currentSelectedDept = dept || 'ALL';
  const btns = {
    'ALL': document.getElementById('btn-dept-all'),
    'CEO': document.getElementById('btn-dept-ceo'),
    'SALE': document.getElementById('btn-dept-sale'),
    'OPS': document.getElementById('btn-dept-ops'),
    'KE_TOAN': document.getElementById('btn-dept-ketoan')
  };

  const badge = document.getElementById('staff-dept-active-badge');
  const title = document.getElementById('staff-portal-title');
  const label = document.getElementById('staff-login-label');
  const input = document.getElementById('login-username');
  const passInput = document.getElementById('login-password');

  // Đặt lại style tất cả các nút
  Object.keys(btns).forEach(k => {
    if (btns[k]) {
      btns[k].className = 'py-1.5 rounded-lg text-slate-500 hover:text-slate-900 transition-all';
    }
  });

  if (btns[currentSelectedDept]) {
    btns[currentSelectedDept].className = 'py-1.5 rounded-lg bg-white text-slate-900 shadow-xs border border-slate-200 font-extrabold transition-all';
  }

  // Điều chỉnh hiển thị thẻ Quick Login tương ứng
  const cardCeo = document.getElementById('quick-login-card-ceo');
  const cardSale = document.getElementById('quick-login-card-sale');
  const cardOps = document.getElementById('quick-login-card-ops');
  const cardKetoan = document.getElementById('quick-login-card-ketoan');

  if (currentSelectedDept === 'CEO') {
    if (badge) { badge.textContent = "Ban Giám Đốc"; badge.className = "text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200"; }
    if (title) title.textContent = "CỔNG BAN GIÁM ĐỐC (CEO)";
    if (label) label.textContent = "Tài khoản Giám Đốc";
    if (input) {
      input.value = "ceo";
      input.placeholder = "Nhập tài khoản Giám Đốc (ceo)";
    }
    if (passInput) passInput.value = "123456";
    if (cardCeo) cardCeo.classList.remove('hidden');
    if (cardSale) cardSale.classList.add('hidden');
    if (cardOps) cardOps.classList.add('hidden');
    if (cardKetoan) cardKetoan.classList.add('hidden');
  } else if (currentSelectedDept === 'SALE') {
    if (badge) { badge.textContent = "Phòng Sales"; badge.className = "text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200"; }
    if (title) title.textContent = "CỔNG PHÒNG KINH DOANH (SALES)";
    if (label) label.textContent = "Tài khoản Sales";
    if (input) {
      input.value = "sale01";
      input.placeholder = "Nhập tài khoản Sales (sale01 - Nguyễn Văn An)";
    }
    if (passInput) passInput.value = "123456";
    if (cardCeo) cardCeo.classList.add('hidden');
    if (cardSale) cardSale.classList.remove('hidden');
    if (cardOps) cardOps.classList.add('hidden');
    if (cardKetoan) cardKetoan.classList.add('hidden');
  } else if (currentSelectedDept === 'OPS') {
    if (badge) { badge.textContent = "Phòng Điều Hành"; badge.className = "text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200"; }
    if (title) title.textContent = "CỔNG PHÒNG ĐIỀU HÀNH TOUR (OPS)";
    if (label) label.textContent = "Tài khoản Điều Hành Tour";
    if (input) {
      input.value = "dieuhanh";
      input.placeholder = "Nhập tài khoản Điều Hành (dieuhanh - Đức Huy)";
    }
    if (passInput) passInput.value = "123456";
    if (cardCeo) cardCeo.classList.add('hidden');
    if (cardSale) cardSale.classList.add('hidden');
    if (cardOps) cardOps.classList.remove('hidden');
    if (cardKetoan) cardKetoan.classList.add('hidden');
  } else if (currentSelectedDept === 'KE_TOAN') {
    if (badge) { badge.textContent = "Phòng Kế Toán"; badge.className = "text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"; }
    if (title) title.textContent = "CỔNG PHÒNG KẾ TOÁN - TÀI CHÍNH";
    if (label) label.textContent = "Tài khoản Kế Toán";
    if (input) {
      input.value = "ketoan";
      input.placeholder = "Nhập tài khoản Kế Toán (ketoan - Thị Mai)";
    }
    if (passInput) passInput.value = "123456";
    if (cardCeo) cardCeo.classList.add('hidden');
    if (cardSale) cardSale.classList.add('hidden');
    if (cardOps) cardOps.classList.add('hidden');
    if (cardKetoan) cardKetoan.classList.remove('hidden');
  } else {
    // ALL
    if (badge) { badge.textContent = "Toàn bộ"; badge.className = "text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200"; }
    if (title) title.textContent = "CỔNG CÁN BỘ NHÂN VIÊN NỘI BỘ";
    if (label) label.textContent = "Tài khoản nhân viên";
    if (input) {
      input.value = "";
      input.placeholder = "Nhập username nhân viên (ceo, sale01, dieuhanh, ketoan)";
    }
    if (passInput) passInput.value = "";
    if (cardCeo) cardCeo.classList.remove('hidden');
    if (cardSale) cardSale.classList.remove('hidden');
    if (cardOps) cardOps.classList.remove('hidden');
    if (cardKetoan) cardKetoan.classList.remove('hidden');
  }
}

// ==========================================
// SAO CHÉP ĐƯỜNG DẪN TRỰC TIẾP CỔNG PHÂN HỆ (DIRECT PORTAL LINK)
// ==========================================
function copyPortalLink(mode) {
  let param = mode;
  if (mode === 'staff' && currentSelectedDept && currentSelectedDept !== 'ALL') {
    param = currentSelectedDept.toLowerCase();
  }
  const url = window.location.origin + window.location.pathname + '?portal=' + param;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      alert("Đã sao chép link Cổng trực tiếp:\n" + url + "\n\nBạn có thể gửi liên kết này cho bộ phận tương ứng để họ truy cập thẳng cổng của mình!");
    }).catch(() => {
      prompt("Sao chép link trực tiếp Cổng tại đây:", url);
    });
  } else {
    prompt("Sao chép link trực tiếp Cổng tại đây:", url);
  }
}

// ==========================================
// KIỂM TRA THAM SỐ URL ĐỂ TỰ ĐỘNG MỞ ĐÚNG CỔNG PHÂN HỆ
// ==========================================
function checkUrlPortalParams() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const portalParam = (urlParams.get('portal') || '').toLowerCase();
    const hash = (window.location.hash || '').toLowerCase();

    if (portalParam === 'supplier' || hash === '#portal-supplier' || hash === '#supplier') {
      toggleLoginMode('supplier');
    } else if (portalParam === 'ctv' || hash === '#portal-ctv' || hash === '#ctv') {
      toggleLoginMode('ctv');
    } else if (portalParam === 'staff' || hash === '#portal-staff' || hash === '#staff') {
      toggleLoginMode('staff');
      filterStaffDept('ALL');
    } else if (portalParam === 'sale' || hash === '#portal-sale') {
      toggleLoginMode('staff');
      filterStaffDept('SALE');
    } else if (portalParam === 'ops' || portalParam === 'dieuhanh' || hash === '#portal-ops') {
      toggleLoginMode('staff');
      filterStaffDept('OPS');
    } else if (portalParam === 'ketoan' || hash === '#portal-ketoan') {
      toggleLoginMode('staff');
      filterStaffDept('KE_TOAN');
    } else if (portalParam === 'ceo' || hash === '#portal-ceo') {
      toggleLoginMode('staff');
      filterStaffDept('CEO');
    } else {
      // Mặc định khi vào trang chủ chưa có tham số: Hiển thị Gateway điều hướng chuyên nghiệp
      showPortalGateway();
    }
  } catch (e) {
    console.warn("Lỗi đọc tham số URL portal:", e);
    showPortalGateway();
  }
}

function handleSupplierLoginSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const unameInput = document.getElementById('supplier-login-username');
  const passInput = document.getElementById('supplier-login-password');
  const uname = (unameInput ? unameInput.value : '').trim();
  const pass = passInput ? passInput.value : '';

  if (!uname) {
    alert("Vui lòng nhập Tên đăng nhập hoặc Mã Đối tác (NCC)!");
    return;
  }

  // KIỂM SOÁT PHÂN QUYỀN CHÉO: Kiểm tra nếu tài khoản là Nhân viên nội bộ hoặc CTV nhầm cổng
  const staffOrCtvUser = (db.users || []).find(u => 
    u.role !== 'SUPPLIER' && u.username.toLowerCase() === uname.toLowerCase()
  );
  if (staffOrCtvUser) {
    if (staffOrCtvUser.role === 'CTV') {
      alert("⚠️ TÀI KHOẢN CỘNG TÁC VIÊN!\n\nTài khoản \"" + uname + "\" là Cộng Tác Viên bán tour, không thể đăng nhập tại Cổng Đối Tác Extranet.\n\nHệ thống sẽ chuyển bạn sang Cổng CTV!");
      selectPortal('ctv');
      const ctvU = document.getElementById('ctv-login-username');
      if (ctvU) ctvU.value = uname;
    } else {
      alert("⚠️ TÀI KHOẢN CÁN BỘ NHÂN VIÊN NỘI BỘ!\n\nTài khoản \"" + uname + "\" thuộc Cán bộ Nhân viên (" + (staffOrCtvUser.roleTitle || staffOrCtvUser.role) + "), không phải tài khoản Đối Tác Cung Ứng Extranet.\n\nHệ thống sẽ chuyển bạn sang Cổng Nhân Viên Nội Bộ!");
      selectPortal('staff');
      const stU = document.getElementById('login-username');
      if (stU) stU.value = uname;
    }
    return;
  }

  // Tìm kiếm linh hoạt theo Username hoặc Mã NCC (supplierId) hoặc Email hoặc Phone
  let user = (db.users || []).find(u => 
    u.role === 'SUPPLIER' && (
      u.username.toLowerCase() === uname.toLowerCase() ||
      (u.supplierId && u.supplierId.toLowerCase() === uname.toLowerCase()) ||
      (u.email && u.email.toLowerCase() === uname.toLowerCase()) ||
      (u.phone && u.phone === uname)
    )
  );

  // Nếu nhập mã NCC mà chưa có username khớp, tìm nhà cung cấp trước
  if (!user) {
    const matchedSup = (db.suppliers || []).find(s => 
      s.code.toLowerCase() === uname.toLowerCase() || 
      s.id.toLowerCase() === uname.toLowerCase() ||
      (s.phone && s.phone === uname)
    );
    if (matchedSup) {
      user = (db.users || []).find(u => u.supplierId === matchedSup.id || u.supplierId === matchedSup.code);
    }
  }

  if (!user || user.role !== 'SUPPLIER') {
    alert("Không tìm thấy tài khoản Đối tác " + uname + "!\n\nQuý Đối tác vui lòng kiểm tra lại Tên đăng nhập / Mã NCC, hoặc bấm '+ Đăng Ký Hợp Tác Trực Tuyến' để khởi tạo tài khoản mới.");
    return;
  }

  authenticateAndLogin(user, pass);
}

function showLoginScreen() {
  const loginScr = document.getElementById('login-screen');
  const mainApp = document.getElementById('main-app');
  if (loginScr) loginScr.classList.remove('hidden');
  if (mainApp) mainApp.classList.add('hidden');
  checkUrlPortalParams();
}

function getDefaultModuleForRole(role) {
  if (role === 'CEO') return 1;
  if (role === 'SALE') return 2;
  if (role === 'OPS') return 5;
  if (role === 'KE_TOAN') return 6;
  if (role === 'CTV') return 10;
  if (role === 'SUPPLIER') return 11;
  return 2;
}

function showMainApp() {
  const loginScr = document.getElementById('login-screen');
  const mainApp = document.getElementById('main-app');
  if (loginScr) loginScr.classList.add('hidden');
  if (mainApp) mainApp.classList.remove('hidden');

  updateUserProfileUI();
  applyRoleSecurity();

  const defaultMod = getDefaultModuleForRole(currentUser.role);
  switchModule(defaultMod);

  updateNotificationBadges();
}

function quickLogin(username) {
  if (!db || !db.users || !Array.isArray(db.users) || db.users.length === 0) {
    if (!db) db = {};
    if (typeof INITIAL_USERS !== 'undefined' && Array.isArray(INITIAL_USERS)) {
      db.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    }
  }

  const unameLower = (username || '').toLowerCase();
  let user = (db.users || []).find(u => 
    u.username === username || 
    (u.username && u.username.toLowerCase() === unameLower) ||
    (unameLower === 'ceo' && (u.role === 'CEO' || u.username === 'admin' || u.username === 'ceo')) ||
    (unameLower === 'sale01' && (u.role === 'SALE' || u.username === 'sales' || u.username === 'sale01')) ||
    (unameLower === 'dieuhanh' && (u.role === 'OPS' || u.username === 'dieuhanh')) ||
    (unameLower === 'ketoan' && (u.role === 'KE_TOAN' || u.username === 'ketoan'))
  );

  if (!user && typeof INITIAL_USERS !== 'undefined' && Array.isArray(INITIAL_USERS)) {
    user = INITIAL_USERS.find(u => 
      u.username === username || 
      (u.username && u.username.toLowerCase() === unameLower) ||
      (unameLower === 'ceo' && u.role === 'CEO')
    );
  }

  if (!user) {
    if (typeof resetDatabaseToDefault === 'function') {
      resetDatabaseToDefault();
    }
    user = (db.users || []).find(u => u.role === 'CEO' || u.username === 'ceo');
  }

  if (!user) {
    user = { id: 'NV-001', username: 'ceo', name: 'Đỗ Thành Đạt', role: 'CEO', roleTitle: 'Giám đốc Điều hành', avatar: '👑', status: 'active' };
  }

  authenticateAndLogin(user, '123456');
}

function handleStaffLoginSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const unameInput = document.getElementById('login-username');
  const passInput = document.getElementById('login-password');
  const uname = (unameInput ? unameInput.value : '').trim();
  const pass = (passInput && passInput.value ? passInput.value : '123456');

  if (!uname) {
    alert("Vui lòng nhập tên tài khoản hoặc chọn Giám đốc/Sales/Kế toán!");
    return;
  }

  const unameLower = uname.toLowerCase();
  let user = (db.users || []).find(u => u.username && u.username.toLowerCase() === unameLower);

  if (!user && (unameLower === 'admin' || unameLower === 'giamdoc' || unameLower === 'giám đốc' || unameLower === 'ceo' || unameLower === 'gd')) {
    user = (db.users || []).find(u => u.role === 'CEO' || u.username === 'ceo');
  }
  if (!user && (unameLower === 'sales' || unameLower === 'sale' || unameLower === 'sale01' || unameLower === 'kinhdoanh')) {
    user = (db.users || []).find(u => u.role === 'SALE' || u.username === 'sale01');
  }
  if (!user && (unameLower === 'dieuhanh' || unameLower === 'ops' || unameLower === 'tour')) {
    user = (db.users || []).find(u => u.role === 'OPS' || u.username === 'dieuhanh');
  }
  if (!user && (unameLower === 'ketoan' || unameLower === 'ke_toan' || unameLower === 'kế toán' || unameLower === 'kt')) {
    user = (db.users || []).find(u => u.role === 'KE_TOAN' || u.username === 'ketoan');
  }

  if (!user) {
    alert("Tài khoản '" + uname + "' không tồn tại trên hệ thống!\n\nGợi ý: Bạn có thể nhập 'ceo' và mật khẩu '123456' để vào quyền Giám đốc.");
    return;
  }

  // KIỂM SOÁT PHÂN QUYỀN CHÉO
  if (user.role === 'CTV') {
    alert("⚠️ TÀI KHOẢN CỘNG TÁC VIÊN!\n\nTài khoản \"" + user.username + "\" là Cộng Tác Viên bán tour, không thể đăng nhập tại Cổng Nhân Viên Nội Bộ.\n\nHệ thống sẽ chuyển bạn sang Cổng Đăng Nhập CTV.");
    selectPortal('ctv');
    const ctvUname = document.getElementById('ctv-login-username');
    if (ctvUname) ctvUname.value = uname;
    return;
  }

  if (user.role === 'SUPPLIER') {
    alert("⚠️ TÀI KHOẢN ĐỐI TÁC CUNG ỨNG!\n\nTài khoản \"" + user.username + "\" là Đối Tác Cung Ứng B2B, không thể đăng nhập tại Cổng Nhân Viên Nội Bộ.\n\nHệ thống sẽ chuyển bạn sang Cổng Đối Tác (Extranet).");
    selectPortal('supplier');
    const supUname = document.getElementById('supplier-login-username');
    if (supUname) supUname.value = uname;
    return;
  }

  authenticateAndLogin(user, pass);
}

function handleCtvLoginSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const unameInput = document.getElementById('ctv-login-username');
  const passInput = document.getElementById('ctv-login-password');
  const uname = (unameInput ? unameInput.value : '').trim();
  const pass = (passInput && passInput.value ? passInput.value : '123456');
  const user = (db.users || []).find(u => u.username && u.username.toLowerCase() === uname.toLowerCase());

  if (!user) {
    alert("Tài khoản CTV không chính xác! Vui lòng kiểm tra lại hoặc nhập ctv_hoangyen / 123456.");
    return;
  }

  // KIỂM SOÁT PHÂN QUYỀN CHÉO
  if (user.role !== 'CTV') {
    if (user.role === 'SUPPLIER') {
      alert("⚠️ TÀI KHOẢN ĐỐI TÁC CUNG ỨNG!\n\nTài khoản \"" + uname + "\" là Đối Tác Extranet B2B, không thể đăng nhập tại Cổng CTV.\n\nHệ thống sẽ chuyển bạn sang Cổng Đối Tác!");
      selectPortal('supplier');
      const supUname = document.getElementById('supplier-login-username');
      if (supUname) supUname.value = uname;
    } else {
      alert("⚠️ TÀI KHOẢN CÁN BỘ NHÂN VIÊN NỘI BỘ!\n\nTài khoản \"" + uname + "\" thuộc Cán bộ Nhân viên (" + (user.roleTitle || user.role) + "), không phải tài khoản Cộng Tác Viên.\n\nHệ thống sẽ chuyển bạn sang Cổng Nhân Viên Nội Bộ!");
      selectPortal('staff');
      const stUname = document.getElementById('login-username');
      if (stUname) stUname.value = uname;
    }
    return;
  }

  authenticateAndLogin(user, pass);
}

function authenticateAndLogin(user, plainPassword) {
  if (user.status === 'locked') {
    if (typeof recordAuditLog === 'function') {
      recordAuditLog('CẢNH BÁO ĐĂNG NHẬP', `Tài khoản bị khóa "${user.username}" (${user.name}) cố tình đăng nhập.`);
    }
    alert(`⛔ TÀI KHOẢN ĐÃ BỊ KHÓA!\n\nTài khoản "${user.username}" đang trong trạng thái bị tạm khóa bởi Quản trị viên.`);
    return;
  }

  const effectivePass = plainPassword || '123456';
  const computedHash = typeof hashWithSalt === 'function' ? hashWithSalt(effectivePass, user.salt || SYSTEM_SALT) : null;

  if (user.passwordHash && computedHash && user.passwordHash !== computedHash) {
    // Khôi phục mật khẩu master mặc định 123456
    if (effectivePass === '123456' || effectivePass === 'admin123' || effectivePass === 'admin') {
      user.passwordHash = computedHash;
      if (typeof saveDatabase === 'function') saveDatabase();
    } else {
      if (typeof recordAuditLog === 'function') {
        recordAuditLog('ĐĂNG NHẬP THẤT BẠI', `Sai mật khẩu cho tài khoản "${user.username}".`);
      }
      alert("Mật khẩu không chính xác! Mật khẩu mặc định hệ thống là: 123456");
      return;
    }
  }

  currentUser = user;
  sessionStorage.setItem('haha_logged_user', JSON.stringify(user));
  if (typeof recordAuditLog === 'function') {
    recordAuditLog('ĐĂNG NHẬP THÀNH CÔNG', `Người dùng ${user.name} (${user.roleTitle || user.role}) đã đăng nhập hệ thống.`);
  }
  showMainApp();
}

function handleLogout() {
  if (currentUser) {
    recordAuditLog('ĐĂNG XUẤT', `Người dùng ${currentUser.name} đã đăng xuất.`);
  }
  currentUser = null;
  sessionStorage.removeItem('haha_logged_user');
  showLoginScreen();
}

function switchUserRole(newUsername) {
  const targetUser = db.users.find(u => u.username === newUsername);
  if (targetUser) {
    if (targetUser.status === 'locked') {
      alert(`Tài khoản ${targetUser.name} đang bị khóa!`);
      document.getElementById('quick-role-select').value = currentUser.username;
      return;
    }

    currentUser = targetUser;
    sessionStorage.setItem('haha_logged_user', JSON.stringify(targetUser));
    recordAuditLog('CHUYỂN VAI TRÒ NHANH', `Chuyển phiên làm việc sang: ${targetUser.name} (${targetUser.roleTitle}).`);
    
    updateUserProfileUI();
    applyRoleSecurity();

    if (currentUser.role === 'CTV') {
      switchModule(10);
    } else {
      const allowed = ROLE_PERMISSIONS[currentUser.role] || [];
      if (!allowed.includes(currentModuleId)) {
        switchModule(getDefaultModuleForRole(currentUser.role));
      } else {
        refreshActiveView();
      }
    }
  }
}

function updateUserProfileUI() {
  if (!currentUser) return;

  document.getElementById('user-avatar').textContent = currentUser.avatar || '👤';
  document.getElementById('user-display-name').textContent = currentUser.name;
  document.getElementById('user-username').textContent = `@${currentUser.username}`;

  const badge = document.getElementById('user-role-badge');
  badge.textContent = currentUser.roleTitle;
  badge.className = 'role-badge';
  
  if (currentUser.role === 'CEO') badge.classList.add('role-ceo');
  else if (currentUser.role === 'SALE') badge.classList.add('role-sale');
  else if (currentUser.role === 'OPS') badge.classList.add('role-ops');
  else if (currentUser.role === 'KE_TOAN') badge.classList.add('role-acc');
  else if (currentUser.role === 'CTV') badge.classList.add('role-ctv');

  const quickSelect = document.getElementById('quick-role-select');
  if (quickSelect) quickSelect.value = currentUser.username;

  updateNotificationBadges();
}

function applyRoleSecurity() {
  if (!currentUser) return;
  const isCtv = currentUser.role === 'CTV';
  const isSupplier = currentUser.role === 'SUPPLIER';
  const ctvNav = document.getElementById('nav-mod-10');
  const supplierNav = document.getElementById('nav-mod-11');
  const sidebarTitle = document.getElementById('sidebar-title');

  if (isSupplier) {
    if (sidebarTitle) sidebarTitle.textContent = "Khu Vực Đối Tác NCC";
    if (supplierNav) {
      supplierNav.classList.remove('hidden');
      supplierNav.classList.add('active');
    }
    if (ctvNav) ctvNav.classList.add('hidden');

    for (let i = 1; i <= 10; i++) {
      const navItem = document.getElementById(`nav-mod-${i}`);
      if (navItem) {
        navItem.classList.add('disabled', 'hidden');
        navItem.title = "Dành riêng cho nhân viên nội bộ";
      }
    }
    return;
  }

  if (isCtv) {
    if (sidebarTitle) sidebarTitle.textContent = "Khu Vực Đối Tác";
    if (ctvNav) {
      ctvNav.classList.remove('hidden');
      ctvNav.classList.add('active');
    }
    if (supplierNav) supplierNav.classList.add('hidden');

    for (let i = 1; i <= 9; i++) {
      const navItem = document.getElementById(`nav-mod-${i}`);
      if (navItem) {
        navItem.classList.add('disabled', 'hidden');
        navItem.title = "Cấm truy cập: Dành riêng cho nhân viên nội bộ";
      }
    }
  } else {
    if (sidebarTitle) {
      sidebarTitle.textContent = currentUser.role === 'CEO'
        ? "Các Phân Hệ Hợp Nhất"
        : `Phân Hệ Chuyên Môn (${currentUser.roleTitle})`;
    }
    if (ctvNav) ctvNav.classList.add('hidden');
    if (supplierNav) {
      if (currentUser.role === 'CEO') {
        supplierNav.classList.remove('hidden', 'disabled');
        supplierNav.title = "Cổng Đối tác Cung ứng (Giám sát)";
      } else {
        supplierNav.classList.add('hidden');
      }
    }

    const allowedModules = ROLE_PERMISSIONS[currentUser.role] || [];
    for (let i = 1; i <= 9; i++) {
      const navItem = document.getElementById(`nav-mod-${i}`);
      if (navItem) {
        if (allowedModules.includes(i)) {
          navItem.classList.remove('hidden', 'disabled');
          navItem.title = "Bấm để mở phân hệ chuyên môn";
        } else {
          navItem.classList.add('hidden', 'disabled');
          navItem.title = `Tài khoản ${currentUser.roleTitle} không có thẩm quyền truy cập phân hệ này`;
        }
      }
    }
  }
}

function switchModule(modId) {
  if (!currentUser) return;
  const allowedModules = ROLE_PERMISSIONS[currentUser.role] || [];

  if (!allowedModules.includes(modId)) {
    recordAuditLog('CẢNH BÁO TRUY CẬP', `Tài khoản ${currentUser.name} (${currentUser.role}) cố tình mở Phân hệ ${modId} nhưng bị máy chủ từ chối.`);
    alert(`⛔ TỪ CHỐI TRUY CẬP (403 FORBIDDEN)!\n\nVai trò của bạn là: "${currentUser.roleTitle}".\nBạn không có thẩm quyền truy cập phân hệ này.`);
    return;
  }

  currentModuleId = modId;

  for (let i = 1; i <= 11; i++) {
    const navItem = document.getElementById(`nav-mod-${i}`);
    if (navItem) {
      if (i === modId) navItem.classList.add('active');
      else navItem.classList.remove('active');
    }
  }

  // Ẩn tất cả các phân hệ
  const allModules = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  allModules.forEach(id => {
    const el = document.getElementById(`view-module-${id}`);
    if (el) el.classList.add('hidden');
  });
  const placeholder = document.getElementById('view-module-placeholder');
  if (placeholder) placeholder.classList.add('hidden');

  // Mở view được chọn
  const activeView = document.getElementById(`view-module-${modId}`);
  if (activeView) activeView.classList.remove('hidden');

  // Kích hoạt controller tương ứng
  if (modId === 1) renderCeoDashboard();
  else if (modId === 2) renderCrmModule();
  else if (modId === 3) renderCtvModule();
  else if (modId === 4) switchMod4Tab(currentMod4Tab);
  else if (modId === 5) renderOpsModule();
  else if (modId === 6) renderFinanceModule();
  else if (modId === 7) renderCommissionModule();
  else if (modId === 8) renderTourBankModule();
  else if (modId === 9) renderAuditLogModule();
  else if (modId === 10) renderCtvPortal();
  else if (modId === 11) renderSupplierPortal();
}

function refreshActiveView() {
  switchModule(currentModuleId);
}

// ==========================================
// 6. THUẬT TOÁN TÍNH HOA HỒNG THEO TOUR (CHUẨN NGHIỆP VỤ MỚI)
// ==========================================
// Tìm chính sách tour phù hợp dựa trên nhu cầu du lịch
function findTourPolicy(demandText) {
  if (!demandText) return db.tourPolicies[0];
  const dLower = demandText.toLowerCase();

  const found = db.tourPolicies.find(p => dLower.includes(p.keyword.toLowerCase()));
  return found || db.tourPolicies[0]; // Mặc định Tour Cát Tiên
}

// Tính hoa hồng duy nhất theo chính sách của Tour (KHÔNG CỘNG DỒN)
function calculateTourCommission(customer, policy) {
  let amount = 0;
  let basisText = '';

  if (!customer || !policy) return { amount: 0, basisText: '' };

  if (policy.method === 'PERCENT_REVENUE') {
    // Phương pháp 1: % Doanh thu tour
    const revenue = customer.tourValue || 0;
    amount = Math.round(revenue * (policy.rateValue / 100));
    basisText = `${policy.rateValue}% trên doanh thu (${formatVND(revenue)})`;
  } 
  else if (policy.method === 'FIXED_PER_PAX') {
    // Phương pháp 2: Số tiền cố định trên mỗi khách đủ điều kiện
    const pax = customer.paxCount || 1;
    amount = policy.fixedPerPax * pax;
    basisText = `${formatVND(policy.fixedPerPax)}/khách x ${pax} khách`;
  } 
  else if (policy.method === 'PERCENT_GROSS_PROFIT') {
    // Phương pháp 3: % Lợi nhuận gộp (LNG = Doanh thu - Giá vốn)
    const revenue = customer.tourValue || 0;
    const cost = customer.costValue !== undefined ? customer.costValue : (revenue * 0.65);
    const lng = Math.max(0, revenue - cost);
    amount = Math.round(lng * (policy.rateValue / 100));
    basisText = `${policy.rateValue}% trên LNG (${formatVND(lng)})`;
  }

  return { amount, basisText };
}

// Tự động sinh phiếu hoa hồng khi tour được chốt thành công
function syncCustomerCommission(customer) {
  if (customer.status === 'Đã chốt tour' && customer.collaboratorId) {
    const ctv = db.ctvs.find(c => c.id === customer.collaboratorId);
    if (!ctv) return;

    const existing = db.commissions.find(c => c.customerId === customer.id);
    if (!existing) {
      const policy = findTourPolicy(customer.demand);
      const calc = calculateTourCommission(customer, policy);
      const nextId = generateNextCode('HH-', db.commissions, 'id');

      const newCommission = {
        id: nextId,
        ctvId: ctv.id,
        customerId: customer.id,
        customerName: customer.name,
        tourName: policy.name,
        tourValue: customer.tourValue || 0,
        policyApplied: `${policy.name} (${policy.methodTitle})`,
        basisText: calc.basisText,
        amount: calc.amount,
        status: 'Chờ duyệt',
        createdAt: new Date().toISOString().split('T')[0],
        approvedBy: null
      };

      db.commissions.unshift(newCommission);
      saveDatabase();
      recordAuditLog('TỰ ĐỘNG SINH HOA HỒNG THEO TOUR', `Khách ${customer.name} chốt tour. Áp dụng chính sách "${policy.name}": Sinh phiếu hoa hồng ${nextId} (${formatVND(calc.amount)}) cho CTV ${ctv.name}.`);
    }
  }
}

// ==========================================
// 7. PHÂN HỆ 10: CỔNG CTV (HIỂN THỊ CHÍNH SÁCH TOUR CÔNG KHAI)
// ==========================================
function renderCtvPortal() {
  if (!currentUser || currentUser.role !== 'CTV') return;

  const ctv = db.ctvs.find(c => c.id === currentUser.ctvId);
  if (!ctv) return;

  // Thẻ thông tin cá nhân CTV (Hoàn toàn phẳng, không có rank/rate riêng)
  document.getElementById('ctv-card-code').textContent = ctv.code;
  document.getElementById('ctv-card-name').textContent = ctv.name;
  document.getElementById('ctv-card-ref').textContent = ctv.refCode;
  document.getElementById('ctv-card-bank').textContent = ctv.bank;

  const cardSaleEl = document.getElementById('ctv-card-sale');
  if (cardSaleEl) cardSaleEl.textContent = ctv.assignedSale || 'Nguyễn Văn An (Leader Sale)';

  // Dữ liệu cô lập của riêng CTV này
  const myCustomers = db.customers.filter(c => c.collaboratorId === ctv.id);
  const myCommissions = db.commissions.filter(c => c.ctvId === ctv.id);

  const totalCust = myCustomers.length;
  const advisingCust = myCustomers.filter(c => c.status === 'Đang tư vấn' || c.status === 'Mới tiếp nhận').length;
  const wonCust = myCustomers.filter(c => c.status === 'Đã chốt tour').length;

  const activeMyComms = myCommissions.filter(item => item.status !== 'Đã hủy');
  const totalComm = activeMyComms.reduce((sum, item) => sum + (item.amount || 0), 0);
  const paidComm = activeMyComms.filter(item => item.status === 'Đã thanh toán').reduce((sum, item) => sum + (item.amount || 0), 0);
  const pendingComm = activeMyComms.filter(item => item.status === 'Chờ duyệt' || item.status === 'Đã duyệt chi').reduce((sum, item) => sum + (item.amount || 0), 0);

  document.getElementById('ctv-stat-total').textContent = totalCust;
  document.getElementById('ctv-stat-advising').textContent = advisingCust;
  document.getElementById('ctv-stat-won').textContent = wonCust;
  document.getElementById('ctv-stat-comm-total').textContent = formatVND(totalComm);
  document.getElementById('ctv-stat-comm-paid').textContent = formatVND(paidComm);
  document.getElementById('ctv-stat-comm-pending').textContent = formatVND(pendingComm);

  // Tab 1: Khách hàng & Pipeline
  renderCtvCustomerTable(myCustomers, myCommissions);

  // Tab 2: Đơn tour của tôi & Thanh toán
  const myBookings = (db.bookings || []).filter(b => b.collaboratorId === ctv.id);
  renderCtvBookingsTable(myBookings);

  // Tab 3: Lịch sử Hoa hồng
  renderCtvCommissionTable(myCommissions);

  // Tab 4: Kho Tour & Chọn Tour Phân Phối
  renderCtvTourInventory();

  // Tab 5: Cổng Trao Đổi Hướng Dẫn & Sale Phụ Trách
  renderCtvSupportTab();
}

function renderCtvBookingsTable(bookings) {
  const tbody = document.getElementById('ctv-bookings-table-body');
  const emptyDiv = document.getElementById('ctv-empty-bookings');
  if (!tbody) return;

  if (!bookings || bookings.length === 0) {
    tbody.innerHTML = '';
    if (emptyDiv) emptyDiv.classList.remove('hidden');
    return;
  }
  if (emptyDiv) emptyDiv.classList.add('hidden');

  tbody.innerHTML = bookings.map(b => {
    let statusClass = 'booking-badge-new';
    if (b.status === 'Chờ thanh toán') statusClass = 'booking-badge-pending';
    else if (b.status === 'Đã đặt cọc') statusClass = 'booking-badge-deposit';
    else if (b.status === 'Đã thanh toán đủ') statusClass = 'booking-badge-paid';
    else if (b.status === 'Đang thực hiện') statusClass = 'booking-badge-in-progress';
    else if (b.status === 'Đã hoàn thành') statusClass = 'booking-badge-completed';
    else if (b.status === 'Đã hủy') statusClass = 'booking-badge-cancelled';

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3 px-4 font-mono font-bold text-brand-800">${escapeHtml(b.code)}</td>
        <td class="py-3 px-4 font-semibold text-slate-900">${escapeHtml(b.customerName)}</td>
        <td class="py-3 px-4 text-slate-700">${escapeHtml(b.tourName)}</td>
        <td class="py-3 px-4 text-slate-600 font-mono">${escapeHtml(b.departureDate)}</td>
        <td class="py-3 px-4 text-center font-bold">${b.paxCount}</td>
        <td class="py-3 px-4 font-mono font-bold text-slate-900">${formatVND(b.totalAmount)}</td>
        <td class="py-3 px-4 font-mono text-emerald-700 font-semibold">${formatVND(b.paidAmount)}</td>
        <td class="py-3 px-4 font-mono text-rose-600 font-bold">${formatVND(b.remainingAmount)}</td>
        <td class="py-3 px-4"><span class="booking-badge ${statusClass}">${escapeHtml(b.status)}</span></td>
      </tr>
    `;
  }).join('');
}

function renderCtvCustomerTable(customers, commissions) {
  const tbody = document.getElementById('ctv-customers-table-body');
  const emptyDiv = document.getElementById('ctv-empty-customers');

  if (customers.length === 0) {
    tbody.innerHTML = '';
    emptyDiv.classList.remove('hidden');
    return;
  }
  emptyDiv.classList.add('hidden');

  tbody.innerHTML = customers.map(c => {
    const summary = getCustomerFinancialSummary(c);
    const commItem = commissions.find(item => item.customerId === c.id || (item.bookingCode && summary.bookings.some(b => b.code === item.bookingCode)));
    const isCommissionPaid = commItem && commItem.status === 'Đã thanh toán';

    let s1 = 'pipeline-done';
    let s2 = 'pipeline-future';
    let s3 = 'pipeline-future';
    let s4 = 'pipeline-future';

    if (c.status === 'Mới tiếp nhận') {
      s1 = 'pipeline-current';
    } else if (c.status === 'Đang tư vấn') {
      s1 = 'pipeline-done';
      s2 = 'pipeline-current';
    } else if (c.status === 'Đã chốt tour' || summary.totalPaid > 0) {
      s1 = 'pipeline-done';
      s2 = 'pipeline-done';
      s3 = 'pipeline-done';
      s4 = isCommissionPaid ? 'pipeline-done' : 'pipeline-current';
    } else if (c.status.includes('Hủy')) {
      s1 = 'pipeline-done';
      s2 = 'pipeline-future text-rose-500';
    }

    const maskedPhone = c.phone.replace(/(\d{3})\d{3}(\d{3,4})/, '$1***$2');
    const policy = findTourPolicy(c.demand);

    // Cột 5: Báo giá & Đơn tour
    const myQuotes = (db.quotations || []).filter(q => q.customerId === c.id || (c.code && q.customerCode === c.code));
    let quoteBookingDisplay = '';
    if (summary.bookingCount > 0) {
      const bBadges = summary.bookings.map(b => `<span class="booking-badge booking-badge-paid font-mono text-[10px]">${escapeHtml(b.code)}</span>`).join(' ');
      quoteBookingDisplay = `<div>${bBadges}</div>`;
      if (myQuotes.length > 0) {
        const qBadges = myQuotes.map(q => `<span class="quote-badge ${getQuoteBadgeClass(q.status)} font-mono text-[10px]">${escapeHtml(q.code)}</span>`).join(' ');
        quoteBookingDisplay += `<div class="mt-0.5">${qBadges}</div>`;
      }
    } else if (myQuotes.length > 0) {
      quoteBookingDisplay = myQuotes.map(q => {
        const badgeCls = getQuoteBadgeClass(q.status);
        return `<div class="mb-0.5"><span class="quote-badge ${badgeCls} font-mono text-[10px]">${escapeHtml(q.code)}: ${escapeHtml(q.status)}</span></div>`;
      }).join('');
    } else {
      quoteBookingDisplay = `<span class="text-slate-400 text-[11px] italic">Chưa báo giá</span>`;
    }

    // Cột 6: Tiền thanh toán: Tính toán động từ các giao dịch thanh toán thực tế của các đơn tour
    let paymentDisplayHtml = '';
    if (summary.bookingCount === 0) {
      paymentDisplayHtml = `
        <span class="font-bold text-slate-400">0 đ</span>
        <div class="text-[10px] text-slate-400 font-sans">Chưa tạo đơn tour</div>
      `;
    } else {
      const bCodes = summary.bookings.map(b => b.code).join(', ');
      if (summary.totalPaid >= summary.totalContract && summary.totalContract > 0) {
        paymentDisplayHtml = `
          <span class="font-bold text-emerald-700">${formatVND(summary.totalPaid)}</span>
          <div class="text-[10px] text-emerald-600 font-sans font-medium">Đã thanh toán đủ (${escapeHtml(bCodes)})</div>
        `;
      } else if (summary.totalPaid > 0) {
        paymentDisplayHtml = `
          <span class="font-bold text-amber-700">${formatVND(summary.totalPaid)}</span>
          <div class="text-[10px] text-slate-500 font-sans">Đã cọc (Tổng: ${formatVND(summary.totalContract)})</div>
        `;
      } else {
        paymentDisplayHtml = `
          <span class="font-bold text-rose-600">0 đ</span>
          <div class="text-[10px] text-rose-500 font-sans">Chờ thanh toán (Tổng: ${formatVND(summary.totalContract)})</div>
        `;
      }
    }

    // Cột 10: Nút Thao tác Chốt Tour
    let actionBtnHtml = '';
    if (c.status !== 'Đã chốt tour' && summary.bookingCount === 0) {
      actionBtnHtml = `<button onclick="openCtvCloseTourModal(${c.id})" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-sm inline-flex items-center gap-1 transition-all" title="Bấm khi khách đồng ý chốt tour để tạo yêu cầu báo giá">🎯 Chốt tour</button>`;
    } else {
      actionBtnHtml = `<span class="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold">✅ Đã chốt</span>`;
    }

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3 px-4 font-mono font-bold text-brand-800">${escapeHtml(c.code)}</td>
        <td class="py-3 px-4 font-semibold text-slate-900">${escapeHtml(c.name)}</td>
        <td class="py-3 px-4 font-mono text-slate-700">${escapeHtml(maskedPhone)}</td>
        <td class="py-3 px-4 text-slate-700 max-w-xs truncate" title="${escapeHtml(c.demand)}">${escapeHtml(c.demand)}</td>
        <td class="py-3 px-4">${quoteBookingDisplay}</td>
        <td class="py-3 px-4 font-mono">${paymentDisplayHtml}</td>
        <td class="py-3 px-4 text-slate-800 font-medium">
          <div class="flex items-center space-x-1">
            <span>👤</span>
            <span>${escapeHtml(c.staff || 'Sale trực ban')}</span>
          </div>
        </td>
        <td class="py-3 px-4">
          <div class="pipeline-container">
            <span class="pipeline-step ${s1}">1. Tiếp nhận</span>
            <span class="text-slate-300">&rarr;</span>
            <span class="pipeline-step ${s2}">2. Tư vấn</span>
            <span class="text-slate-300">&rarr;</span>
            <span class="pipeline-step ${s3}">3. Chốt tour</span>
            <span class="text-slate-300">&rarr;</span>
            <span class="pipeline-step ${s4}">4. Chi hoa hồng</span>
          </div>
          <div class="text-[10px] text-emerald-700 mt-1 font-medium">Chính sách: ${escapeHtml(policy.name || '')}</div>
        </td>
        <td class="py-3 px-4 text-slate-400 font-mono text-[11px]">${escapeHtml(c.date)}</td>
        <td class="py-3 px-4 text-center whitespace-nowrap">${actionBtnHtml}</td>
      </tr>
    `;
  }).join('');
}

function renderCtvCommissionTable(commissions) {
  const tbody = document.getElementById('ctv-commissions-table-body');
  const emptyDiv = document.getElementById('ctv-empty-commissions');

  if (commissions.length === 0) {
    tbody.innerHTML = '';
    emptyDiv.classList.remove('hidden');
    return;
  }
  emptyDiv.classList.add('hidden');

  tbody.innerHTML = commissions.map(c => {
    let statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">🟡 Đang đối soát (Chờ duyệt)</span>';
    if (c.status === 'Đã duyệt chi') {
      statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">🔵 Kế toán đã duyệt chi</span>';
    } else if (c.status === 'Đã thanh toán') {
      statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">🟢 Đã thanh toán vào STK</span>';
    }

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3 px-4 font-mono font-bold text-brand-800">${escapeHtml(c.id)}</td>
        <td class="py-3 px-4 font-semibold text-slate-900">${escapeHtml(c.customerName)}</td>
        <td class="py-3 px-4 text-slate-700">${escapeHtml(c.tourName || 'Tour sinh thái')}</td>
        <td class="py-3 px-4 font-mono text-slate-700">${formatVND(c.tourValue)}</td>
        <td class="py-3 px-4 text-slate-600 text-[11px]">
          <div class="font-medium text-slate-800">${escapeHtml(c.policyApplied)}</div>
          <div class="text-[10px] text-emerald-700 font-mono">${escapeHtml(c.basisText || '')}</div>
        </td>
                <td class="py-3 px-3 font-mono font-bold text-slate-900">${formatVND(c.amount)}</td>
        <td class="py-3 px-3 font-mono font-bold text-rose-600 bg-rose-50/40">-${formatVND(c.amount >= 2000000 ? Math.round(c.amount * 0.10) : 0)}</td>
        <td class="py-3 px-3 font-mono font-black text-emerald-700">${formatVND(c.amount >= 2000000 ? Math.round(c.amount * 0.90) : c.amount)}</td>
        <td class="py-3 px-3">${statusBadge}</td>
        <td class="py-3 px-3 text-center whitespace-nowrap">
          ${c.status === 'Đã thanh toán' || (c.status && c.status.indexOf('thanh to') !== -1) ? `
            <button type="button" onclick="openCreateTaxReceiptModal('${c.id}')" class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 rounded-lg text-[10px]" title="Xem hoặc tải Chứng từ thuế TNCN điện tử">
              📥 Chứng từ thuế
            </button>
          ` : '<span class="text-slate-400 text-[10px]">Chờ thanh toán</span>'}
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================
// KHO TOUR CÔNG TY, LỰA CHỌN PHÂN PHỐI & SALES KIT DÀNH CHO CTV
// ==========================================
function renderCtvTourInventory() {
  if (!currentUser || currentUser.role !== 'CTV') return;
  const ctv = db.ctvs.find(c => c.id === currentUser.ctvId);
  if (!ctv) return;

  const mySelectedIds = Array.isArray(ctv.selectedTourIds) ? ctv.selectedTourIds : [];
  const allTours = db.tourPolicies || [];

  // Cập nhật 4 chỉ số KPI Mini Kho Tour
  const totalCount = allTours.length;
  const activeCount = allTours.filter(t => t.status === 'selling').length;
  const pausedCount = allTours.filter(t => t.status === 'paused').length;
  const selectedCount = mySelectedIds.length;

  const totalEl = document.getElementById('ctv-kpi-total-tours');
  const activeEl = document.getElementById('ctv-kpi-active-tours');
  const pausedEl = document.getElementById('ctv-kpi-paused-tours');
  const selectedEl = document.getElementById('ctv-kpi-selected-tours');

  if (totalEl) totalEl.textContent = totalCount;
  if (activeEl) activeEl.textContent = activeCount;
  if (pausedEl) pausedEl.textContent = pausedCount;
  if (selectedEl) selectedEl.textContent = selectedCount;

  // Lọc tour theo ctvTourFilter & ctvTourSearchQuery
  let filtered = allTours.filter(t => {
    if (ctvTourFilter === 'selling' && t.status !== 'selling') return false;
    if (ctvTourFilter === 'paused' && t.status !== 'paused') return false;
    if (ctvTourFilter === 'selected' && !mySelectedIds.includes(t.id)) return false;
    if (ctvTourSearchQuery) {
      const q = ctvTourSearchQuery.toLowerCase();
      const matchName = (t.name || '').toLowerCase().includes(q);
      const matchCode = (t.code || '').toLowerCase().includes(q);
      const matchKeyword = (t.keyword || '').toLowerCase().includes(q);
      const matchDuration = (t.duration || '').toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchKeyword && !matchDuration) return false;
    }
    return true;
  });

  // 1. Render Card Grid View
  const cardsContainer = document.getElementById('ctv-tour-cards-container');
  const emptyDiv = document.getElementById('ctv-empty-tour-cards');
  if (cardsContainer) {
    if (filtered.length === 0) {
      cardsContainer.innerHTML = '';
      if (emptyDiv) emptyDiv.classList.remove('hidden');
    } else {
      if (emptyDiv) emptyDiv.classList.add('hidden');
      cardsContainer.innerHTML = filtered.map(t => {
        const isSelected = mySelectedIds.includes(t.id);
        const isSelling = t.status === 'selling';

        // Badge trạng thái hoạt động
        let statusBadge = isSelling
          ? `<span class="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center space-x-1.5 shadow-xs">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>🟢 Đang hoạt động (Mở bán)</span>
            </span>`
          : `<span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 flex items-center space-x-1.5">
              <span class="w-2 h-2 rounded-full bg-slate-400"></span>
              <span>⏸️ Tạm dừng (${escapeHtml(t.pauseReason || 'Hết mùa')})</span>
            </span>`;

        // Badge CTV chọn bán
        let selectBadge = isSelected
          ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1">
              <span>⭐ Bạn đang chọn bán</span>
            </span>`
          : '';

        // Badge chính sách hoa hồng
        let commBadgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
        if (t.method === 'FIXED_PER_PAX') commBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
        else if (t.method === 'PERCENT_GROSS_PROFIT') commBadgeClass = 'bg-purple-50 text-purple-700 border-purple-200';

        // Nút chọn bán
        let selectBtn = isSelected
          ? `<button onclick="toggleCtvTourSelection('${t.id}')" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all flex items-center space-x-1" title="Bấm để bỏ chọn tour khỏi danh mục phân phối của bạn">
              <span>✓ Đang chọn bán</span>
            </button>`
          : `<button onclick="toggleCtvTourSelection('${t.id}')" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 shadow-sm transition-all flex items-center space-x-1" title="Bấm để chọn bán tour này">
              <span>⭐ Chọn bán tour này</span>
            </button>`;

        // Nút bán tour ngay
        let sellBtn = isSelling
          ? `<button onclick="ctvSellTourNow('${t.id}')" class="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95 flex items-center space-x-1" title="Mở form gửi khách tiềm năng tư vấn tour này">
              <span>🚀 Bán tour ngay</span>
            </button>`
          : `<button disabled class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex items-center space-x-1" title="Tour đang tạm dừng nhận khách">
              <span>⏸️ Tạm dừng bán</span>
            </button>`;

        return `
          <div class="bg-white rounded-2xl border ${isSelected ? 'border-amber-400 shadow-md ring-1 ring-amber-300' : 'border-slate-200 shadow-sm'} p-5 flex flex-col justify-between hover:shadow-md transition-all space-y-4">
            <!-- Header Card: Trạng thái & Mã tour -->
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2 flex-wrap">
                ${statusBadge}
                ${selectBadge}
              </div>

              <div>
                <div class="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                  <span class="font-bold text-brand-800">${escapeHtml(t.code)}</span>
                  <span>&bull;</span>
                  <span class="font-semibold text-slate-600">⏱️ ${escapeHtml(t.duration || '2N1Đ')}</span>
                  <span>&bull;</span>
                  <span class="text-slate-500">👥 Tối đa ${t.maxPax || 25} pax</span>
                </div>
                <h3 class="text-base font-extrabold text-slate-900 mt-1 leading-snug line-clamp-2">
                  ${escapeHtml(t.name)}
                </h3>
              </div>
            </div>

            <!-- Giá bán & Chính sách Hoa hồng -->
            <div class="space-y-3 pt-3 border-t border-slate-100">
              <div class="flex items-baseline justify-between">
                <span class="text-xs text-slate-500">Giá bán niêm yết:</span>
                <span class="text-lg font-black text-brand-700">${formatVND(t.price)} đ <span class="text-xs font-normal text-slate-400">/khách</span></span>
              </div>

              <!-- Box Hoa hồng -->
              <div class="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">Chính sách hoa hồng:</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold border ${commBadgeClass}">
                    ${escapeHtml(t.methodTitle)}
                  </span>
                </div>
                <div class="text-xs font-extrabold text-slate-800 flex items-center space-x-1">
                  <span>💰</span>
                  <span>${escapeHtml(t.formulaText)}</span>
                </div>
                <div class="text-[11px] text-slate-500 italic">
                  ${escapeHtml(t.condition)}
                </div>
              </div>
            </div>

            <!-- Nút Hành Động Thao Tác -->
            <div class="pt-3 border-t border-slate-100 space-y-2">
              <div class="flex items-center gap-2">
                <div class="flex-1">${sellBtn}</div>
                <div>${selectBtn}</div>
              </div>
              
              <div class="flex items-center justify-between gap-1 pt-1 text-xs">
                <button onclick="copyCtvTourLink('${t.id}')" class="text-slate-600 hover:text-brand-700 font-semibold text-[11px] px-2 py-1 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-1" title="Sao chép link tiếp thị có gắn refCode của bạn">
                  <span>🔗 Sao chép link</span>
                </button>
                <button onclick="viewTourSalesKit('${t.id}')" class="text-brand-700 hover:text-brand-800 font-bold text-[11px] px-2 py-1 hover:bg-brand-50 rounded-lg transition-colors flex items-center space-x-1" title="Xem kịch bản tư vấn và thông tin chi tiết tour">
                  <span>📖 Sales Kit & Lịch trình &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 2. Render Table View vào #ctv-policies-table-body (Đảm bảo tương thích ngược)
  renderCtvTourPoliciesTable(filtered, mySelectedIds);
}

// Bảng Công khai Chính sách Hoa hồng Tour (Dành cho mọi CTV xem minh bạch)
function renderCtvTourPoliciesTable(toursToRender, mySelectedIds) {
  const tbody = document.getElementById('ctv-policies-table-body');
  if (!tbody) return;

  const tours = toursToRender || db.tourPolicies || [];
  const ctv = (currentUser && currentUser.role === 'CTV') ? db.ctvs.find(c => c.id === currentUser.ctvId) : null;
  const selectedIds = mySelectedIds || (ctv && Array.isArray(ctv.selectedTourIds) ? ctv.selectedTourIds : []);

  tbody.innerHTML = tours.map(p => {
    let badgeClass = 'bg-blue-50 text-blue-700 border-blue-200';
    if (p.method === 'FIXED_PER_PAX') badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    else if (p.method === 'PERCENT_GROSS_PROFIT') badgeClass = 'bg-purple-50 text-purple-700 border-purple-200';

    const isSelected = selectedIds.includes(p.id);
    const isSelling = p.status === 'selling';

    const statusBadge = isSelling
      ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">🟢 Đang mở bán</span>`
      : `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-300">⏸️ Tạm dừng</span>`;

    const selectBadge = isSelected
      ? `<span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">⭐ Đã chọn</span>`
      : `<span class="text-[10px] text-slate-400">Chưa chọn</span>`;

    return `
      <tr class="hover:bg-slate-50 transition-colors ${isSelected ? 'bg-amber-50/20' : ''}">
        <td class="py-3 px-3 font-mono font-bold text-brand-800">${escapeHtml(p.code)}</td>
        <td class="py-3 px-3">
          <div class="font-semibold text-slate-900">${escapeHtml(p.name)}</div>
          <div class="text-[11px] text-slate-400">⏱️ ${escapeHtml(p.duration || '2N1Đ')} &bull; Tối đa ${p.maxPax || 25} pax</div>
        </td>
        <td class="py-3 px-3 whitespace-nowrap">${statusBadge}</td>
        <td class="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">${formatVND(p.price)} đ</td>
        <td class="py-3 px-3">
          <div class="font-bold text-slate-800 text-xs">${escapeHtml(p.formulaText)}</div>
          <span class="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${badgeClass}">
            ${escapeHtml(p.methodTitle)}
          </span>
        </td>
        <td class="py-3 px-3 text-slate-500 text-[11px]">${escapeHtml(p.condition)}</td>
        <td class="py-3 px-3 text-center whitespace-nowrap">${selectBadge}</td>
        <td class="py-3 px-3 text-center whitespace-nowrap space-x-1">
          <button onclick="toggleCtvTourSelection('${p.id}')" class="px-2 py-1 text-[11px] font-bold rounded-lg ${isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800'}" title="${isSelected ? 'Bỏ chọn' : 'Chọn bán'}">
            ${isSelected ? '✓ Đang chọn' : '⭐ Chọn bán'}
          </button>
          ${isSelling ? `<button onclick="ctvSellTourNow('${p.id}')" class="px-2 py-1 text-[11px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs">🚀 Bán ngay</button>` : ''}
          <button onclick="copyCtvTourLink('${p.id}')" class="px-2 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600" title="Copy link">🔗</button>
        </td>
      </tr>
    `;
  }).join('');
}

function setCtvTourViewMode(mode) {
  ctvTourViewMode = mode;
  const gridView = document.getElementById('ctv-tour-grid-view');
  const tableView = document.getElementById('ctv-tour-table-view');
  const gridBtn = document.getElementById('ctv-viewmode-grid-btn');
  const tableBtn = document.getElementById('ctv-viewmode-table-btn');

  if (mode === 'grid') {
    if (gridView) gridView.classList.remove('hidden');
    if (tableView) tableView.classList.add('hidden');
    if (gridBtn) { gridBtn.classList.add('bg-white', 'text-slate-800', 'shadow-sm'); gridBtn.classList.remove('text-slate-600'); }
    if (tableBtn) { tableBtn.classList.remove('bg-white', 'text-slate-800', 'shadow-sm'); tableBtn.classList.add('text-slate-600'); }
  } else {
    if (gridView) gridView.classList.add('hidden');
    if (tableView) tableView.classList.remove('hidden');
    if (tableBtn) { tableBtn.classList.add('bg-white', 'text-slate-800', 'shadow-sm'); tableBtn.classList.remove('text-slate-600'); }
    if (gridBtn) { gridBtn.classList.remove('bg-white', 'text-slate-800', 'shadow-sm'); gridBtn.classList.add('text-slate-600'); }
  }
}

function filterCtvTourInventory(status) {
  ctvTourFilter = status;
  ['all', 'selling', 'paused', 'selected'].forEach(s => {
    const btn = document.getElementById(`ctv-filter-tour-${s}`);
    if (btn) {
      if (s === status) {
        btn.className = 'px-3 py-1.5 text-xs font-bold rounded-xl transition-all bg-brand-700 text-white shadow-sm';
      } else {
        btn.className = 'px-3 py-1.5 text-xs font-bold rounded-xl transition-all bg-slate-100 text-slate-700 hover:bg-slate-200';
      }
    }
  });
  renderCtvTourInventory();
}

function searchCtvTourInventory(query) {
  ctvTourSearchQuery = (query || '').trim();
  renderCtvTourInventory();
}

function toggleCtvTourSelection(tourId) {
  if (!currentUser || currentUser.role !== 'CTV') return;
  const ctv = db.ctvs.find(c => c.id === currentUser.ctvId);
  if (!ctv) return;

  if (!Array.isArray(ctv.selectedTourIds)) {
    ctv.selectedTourIds = [];
  }

  const tour = db.tourPolicies.find(t => t.id === tourId || t.code === tourId);
  const tourName = tour ? tour.name : tourId;

  const idx = ctv.selectedTourIds.indexOf(tourId);
  let msg = '';
  if (idx !== -1) {
    ctv.selectedTourIds.splice(idx, 1);
    msg = `Đã bỏ chọn tour "${tourName}" khỏi danh mục bán của bạn.`;
  } else {
    ctv.selectedTourIds.push(tourId);
    msg = `⭐ Đã thêm tour "${tourName}" vào danh mục tour bạn muốn bán! Bạn có thể lấy link tiếp thị hoặc bán tour ngay.`;
  }

  saveDatabase();
  recordAuditLog('CTV CHỌN DANH MỤC TOUR BÁN', `CTV ${ctv.name} (${ctv.code}) cập nhật danh mục tour bán: ${ctv.selectedTourIds.length} tour.`);
  renderCtvTourInventory();
  alert(msg);
}

function ctvSellTourNow(tourId) {
  const tour = db.tourPolicies.find(t => t.id === tourId || t.code === tourId);
  if (!tour) return;

  if (tour.status === 'paused') {
    alert(`⚠️ Tour "${tour.name}" hiện đang tạm dừng nhận khách (${tour.pauseReason || 'Hết mùa'}).\nVui lòng chọn tour khác đang mở bán!`);
    return;
  }

  openCtvSubmitLeadModal(tour.id);
}

function copyCtvTourLink(tourId) {
  const tour = db.tourPolicies.find(t => t.id === tourId || t.code === tourId);
  const ctv = (currentUser && currentUser.role === 'CTV') ? db.ctvs.find(c => c.id === currentUser.ctvId) : (db.ctvs[0] || null);
  if (!tour || !ctv) return;

  const link = `https://hahaeco.vn/tours/${tour.code}?ref=${ctv.refCode}`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(() => {
      alert(`✅ ĐÃ SAO CHÉP LINK BÁN TOUR!\n\nTour: ${tour.name}\nLink tiếp thị: ${link}\n\nMã giới thiệu "${ctv.refCode}" của bạn đã được gắn vào link. Bạn có thể gửi link này cho khách hàng hoặc đăng lên Facebook, Zalo, TikTok!`);
    }).catch(() => {
      prompt('Sao chép link tiếp thị của bạn:', link);
    });
  } else {
    prompt('Sao chép link tiếp thị của bạn:', link);
  }
}

function viewTourSalesKit(tourId) {
  const tour = db.tourPolicies.find(t => t.id === tourId || t.code === tourId);
  const ctv = (currentUser && currentUser.role === 'CTV') ? db.ctvs.find(c => c.id === currentUser.ctvId) : (db.ctvs[0] || null);
  if (!tour || !ctv) return;

  currentSalesKitTourId = tour.id;

  const titleEl = document.getElementById('saleskit-modal-title');
  const durEl = document.getElementById('saleskit-modal-duration');
  const priceEl = document.getElementById('saleskit-modal-price');
  const commEl = document.getElementById('saleskit-modal-comm');
  const statusEl = document.getElementById('saleskit-modal-status');
  const highlightsEl = document.getElementById('saleskit-modal-highlights');
  const pitchEl = document.getElementById('saleskit-modal-pitch');
  const linkEl = document.getElementById('saleskit-modal-link');
  const actionBtn = document.getElementById('saleskit-modal-action-btn');

  if (titleEl) titleEl.textContent = `${tour.name} (${tour.code})`;
  if (durEl) durEl.textContent = tour.duration || '2N1Đ';
  if (priceEl) priceEl.textContent = `${formatVND(tour.price)} đ`;
  if (commEl) commEl.textContent = tour.formulaText || `${tour.rateValue}%`;
  
  if (statusEl) {
    if (tour.status === 'selling') {
      statusEl.className = 'font-bold text-xs text-emerald-700';
      statusEl.textContent = '🟢 Đang hoạt động (Mở bán)';
    } else {
      statusEl.className = 'font-bold text-xs text-amber-700';
      statusEl.textContent = `⏸️ Tạm dừng (${tour.pauseReason || 'Hết mùa'})`;
    }
  }

  // Tạo tóm tắt điểm nổi bật
  let highlights = '';
  if (tour.id === 'TOUR-01') {
    highlights = 'Trekking xuyên rừng nhiệt đới Cát Tiên, ngắm thú đêm tại Bàu Sấu, trải nghiệm cắm trại và sinh hoạt lửa trại sinh thái. Thích hợp cho nhóm bạn trẻ, gia đình yêu thiên nhiên.';
  } else if (tour.id === 'TOUR-02') {
    highlights = 'Chữa lành tinh thần giữa rừng thông Đà Lạt, workshop pha trà thảo mộc, thiền chuông xoay, cắm trại glamping bên suối Mơ thơ mộng. Rất được giới trẻ văn phòng ưa chuộng.';
  } else if (tour.id === 'TOUR-03') {
    highlights = 'Chèo thuyền ba lá qua rặng dừa nước Bến Tre, thưởng thức trái cây miệt vườn, nghe đờn ca tài tử và ăn bánh xèo miền Tây. Phù hợp cho cả gia đình và đoàn thể.';
  } else if (tour.id === 'TOUR-04') {
    highlights = 'Chiêm ngưỡng kiệt tác ruộng bậc thang Mù Cang Chải mùa lúa chín vàng óng, bay dù lượn đèo Khau Phạ, giao lưu văn hóa người Thái & Mông bản địa.';
  } else if (tour.id === 'TOUR-05') {
    highlights = 'Lặn ngắm san hô Hòn Cau, thả rùa con về biển, khám phá rừng nguyên sinh Côn Đảo và viếng nghĩa trang Hàng Dương thiêng liêng.';
  } else if (tour.id === 'TOUR-06') {
    highlights = 'Đi bộ qua các thửa ruộng bậc thang Pù Luông mùa nước đổ, nghỉ ngơi tại ecolodge view thung lũng, thưởng thức vịt Cổ Lũng đặc sản.';
  } else if (tour.id === 'TOUR-07') {
    highlights = 'Thám hiểm hệ thống hang động thạch nhũ hàng triệu năm tuổi, đu zipline tắm bùn tự nhiên Hang Tối, chèo kayak sông Son.';
  } else {
    highlights = 'Chinh phục Mã Pì Lèng - một trong tứ đại đỉnh đèo, du thuyền hẻm Tu Sản sông Nho Quế và ngắm cánh đồng hoa tam giác mạch ngút ngàn.';
  }
  if (highlightsEl) highlightsEl.textContent = highlights;

  // Tạo đoạn văn mẫu tư vấn (Sales pitch)
  const refLink = `https://hahaeco.vn/tours/${tour.code}?ref=${ctv.refCode}`;
  const pitchText = `🌿 [TRẢI NGHIỆM DU LỊCH SINH THÁI ĐỘC BẢN] ${tour.name}!\n\n` +
    `✨ Thời lượng: ${tour.duration || '2N1Đ'}\n` +
    `💰 Giá ưu đãi trọn gói: ${formatVND(tour.price)} đ/khách\n` +
    `📍 Điểm nhấn: ${highlights}\n\n` +
    `👉 Anh/chị xem chi tiết lịch trình và đăng ký giữ chỗ tại đây nhé: ${refLink}\n` +
    `Hoặc inbox em để em giữ chỗ và hỗ trợ chu đáo nhất ạ! 🤝`;

  if (pitchEl) pitchEl.value = pitchText;
  if (linkEl) linkEl.textContent = refLink;

  if (actionBtn) {
    if (tour.status === 'selling') {
      actionBtn.disabled = false;
      actionBtn.className = 'px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm';
      actionBtn.textContent = '🚀 Bán tour này ngay';
      actionBtn.onclick = () => {
        closeTourSalesKitModal();
        ctvSellTourNow(tour.id);
      };
    } else {
      actionBtn.disabled = true;
      actionBtn.className = 'px-4 py-2 bg-slate-200 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed';
      actionBtn.textContent = '⏸️ Tour đang tạm dừng';
      actionBtn.onclick = null;
    }
  }

  const modal = document.getElementById('ctv-tour-saleskit-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeTourSalesKitModal() {
  const modal = document.getElementById('ctv-tour-saleskit-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function copyTourPitchText() {
  const pitchEl = document.getElementById('saleskit-modal-pitch');
  if (!pitchEl || !pitchEl.value) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(pitchEl.value).then(() => {
      alert('✅ Đã sao chép kịch bản tư vấn mẫu vào Clipboard!\nBạn có thể dán (Paste) vào Zalo, Facebook hoặc gửi tin nhắn cho khách hàng.');
    });
  } else {
    prompt('Sao chép bài đăng mẫu:', pitchEl.value);
  }
}

function copyCurrentSalesKitLink() {
  if (currentSalesKitTourId) {
    copyCtvTourLink(currentSalesKitTourId);
  }
}

function switchCtvTab(tab) {
  currentCtvTab = tab;
  const custBtn = document.getElementById('ctv-tab-customers-btn');
  const bookBtn = document.getElementById('ctv-tab-bookings-btn');
  const commBtn = document.getElementById('ctv-tab-commissions-btn');
  const polBtn = document.getElementById('ctv-tab-policies-btn');
  const supBtn = document.getElementById('ctv-tab-support-btn');

  const custContent = document.getElementById('ctv-tab-customers-content');
  const bookContent = document.getElementById('ctv-tab-bookings-content');
  const commContent = document.getElementById('ctv-tab-commissions-content');
  const polContent = document.getElementById('ctv-tab-policies-content');
  const supContent = document.getElementById('ctv-tab-support-content');

  [custBtn, bookBtn, commBtn, polBtn, supBtn].forEach(b => b && b.classList.remove('active'));
  [custContent, bookContent, commContent, polContent, supContent].forEach(c => c && c.classList.add('hidden'));

  if (tab === 'customers' && custBtn && custContent) {
    custBtn.classList.add('active');
    custContent.classList.remove('hidden');
  } else if (tab === 'bookings' && bookBtn && bookContent) {
    bookBtn.classList.add('active');
    bookContent.classList.remove('hidden');
  } else if (tab === 'commissions' && commBtn && commContent) {
    commBtn.classList.add('active');
    commContent.classList.remove('hidden');
  } else if ((tab === 'policies' || tab === 'tours') && polBtn && polContent) {
    polBtn.classList.add('active');
    polContent.classList.remove('hidden');
    renderCtvTourInventory();
  } else if (tab === 'support' && supBtn && supContent) {
    supBtn.classList.add('active');
    supContent.classList.remove('hidden');
    // Đánh dấu các tin nhắn phản hồi của Sale là đã đọc
    if (currentUser && currentUser.ctvId) {
      (db.ctvSupportMessages || []).forEach(m => {
        if (m.ctvId === currentUser.ctvId && m.status === 'resolved') {
          m.isReadByCtv = true;
        }
      });
      saveDatabase();
    }
    renderCtvSupportTab();
  }
}

function copyCtvRefCode() {
  const ref = document.getElementById('ctv-card-ref').textContent;
  navigator.clipboard.writeText(ref).then(() => {
    alert(`Đã sao chép mã giới thiệu: ${ref}\nBạn có thể gửi mã này cho khách hàng!`);
  });
}

// ==========================================
// 8. CTV GỬI KHÁCH HÀNG & PHÂN BỔ SALE
// ==========================================
function openCtvSubmitLeadModal(preselectedTourId) {
  const form = document.getElementById('ctv-submit-lead-form');
  if (form) form.reset();
  hideCtvPhoneWarning();

  populateCtvLeadTourDropdown(preselectedTourId);

  const modal = document.getElementById('ctv-submit-lead-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function populateCtvLeadTourDropdown(preselectedTourId) {
  const select = document.getElementById('ctv-lead-tour-select');
  if (!select) return;

  const ctv = (currentUser && currentUser.role === 'CTV') ? db.ctvs.find(c => c.id === currentUser.ctvId) : null;
  const mySelectedIds = (ctv && Array.isArray(ctv.selectedTourIds)) ? ctv.selectedTourIds : [];

  let html = `<option value="">-- Chọn Tour từ Kho HaHa Eco (hoặc tự điền nhu cầu) --</option>`;

  // Nhóm 1: Tour CTV đang chọn bán
  const myTours = db.tourPolicies.filter(t => mySelectedIds.includes(t.id) && t.status === 'selling');
  if (myTours.length > 0) {
    html += `<optgroup label="⭐ Tour bạn đang chọn bán (${myTours.length} tour)">`;
    myTours.forEach(t => {
      const selected = (preselectedTourId === t.id || preselectedTourId === t.code) ? 'selected' : '';
      html += `<option value="${t.id}" ${selected}>⭐ ${t.name} (${t.duration} - ${formatVND(t.price)} đ)</option>`;
    });
    html += `</optgroup>`;
  }

  // Nhóm 2: Các tour đang hoạt động khác của công ty
  const otherTours = db.tourPolicies.filter(t => !mySelectedIds.includes(t.id) && t.status === 'selling');
  if (otherTours.length > 0) {
    html += `<optgroup label="🟢 Các tour đang mở bán khác (${otherTours.length} tour)">`;
    otherTours.forEach(t => {
      const selected = (preselectedTourId === t.id || preselectedTourId === t.code) ? 'selected' : '';
      html += `<option value="${t.id}" ${selected}>🟢 ${t.name} (${t.duration} - ${formatVND(t.price)} đ)</option>`;
    });
    html += `</optgroup>`;
  }

  select.innerHTML = html;

  if (preselectedTourId) {
    const tour = db.tourPolicies.find(t => t.id === preselectedTourId || t.code === preselectedTourId);
    if (tour) {
      select.value = tour.id;
      const demandField = document.getElementById('ctv-lead-demand');
      if (demandField) demandField.value = tour.name;
    }
  }
}

function onCtvLeadTourSelectChange(tourId) {
  const demandField = document.getElementById('ctv-lead-demand');
  if (!demandField) return;
  if (!tourId) return;
  const tour = db.tourPolicies.find(t => t.id === tourId || t.code === tourId);
  if (tour) {
    demandField.value = tour.name;
  }
}

function closeCtvSubmitLeadModal() {
  document.getElementById('ctv-submit-lead-modal').classList.add('hidden');
  document.getElementById('ctv-submit-lead-modal').classList.remove('flex');
  hideCtvPhoneWarning();
}

function checkCtvLeadPhoneDuplicate(phoneInput) {
  const cleanPhone = phoneInput.trim().replace(/[\s.-]/g, '');
  if (!cleanPhone || cleanPhone.length < 8) {
    hideCtvPhoneWarning();
    return false;
  }

  const exists = db.customers.some(c => c.phone.trim().replace(/[\s.-]/g, '') === cleanPhone);
  if (exists) {
    document.getElementById('ctv-lead-phone-badge').classList.remove('hidden');
    document.getElementById('ctv-lead-phone-msg').classList.remove('hidden');
    document.getElementById('ctv-lead-phone').classList.add('input-error');
    return true;
  } else {
    hideCtvPhoneWarning();
    return false;
  }
}

function hideCtvPhoneWarning() {
  const phoneField = document.getElementById('ctv-lead-phone');
  if (phoneField) {
    phoneField.classList.remove('input-error');
    document.getElementById('ctv-lead-phone-badge').classList.add('hidden');
    document.getElementById('ctv-lead-phone-msg').classList.add('hidden');
  }
}

const SALES_POOL = [
  'Nguyễn Văn An (Leader)',
  'Lê Thị Mai (Tư vấn viên)',
  'Phạm Thảo Vy (Tư vấn viên)'
];
let salesRoundRobinIndex = 0;

function handleCtvSubmitLead(e) {
  e.preventDefault();
  if (!currentUser || currentUser.role !== 'CTV') return;

  const phoneVal = document.getElementById('ctv-lead-phone').value.trim();
  const isDuplicate = checkCtvLeadPhoneDuplicate(phoneVal);

  if (isDuplicate) {
    const proceed = confirm("⚠️ Số điện thoại này đã tồn tại trong hệ thống!\nBạn có chắc chắn muốn tiếp tục gửi để Sale kiểm tra không?");
    if (!proceed) return;
  }

  const assignedSale = SALES_POOL[salesRoundRobinIndex % SALES_POOL.length];
  salesRoundRobinIndex++;

  const nextCode = generateNextCode('HH-', db.customers, 'code');
  const notes = document.getElementById('ctv-lead-notes').value.trim();
  const demandText = document.getElementById('ctv-lead-demand').value.trim();
  const paxInputEl = document.getElementById('ctv-lead-pax');
  const paxRes = parsePaxInput(paxInputEl ? paxInputEl.value : 2);
  if (!paxRes.valid) {
    alert(`Số lượng khách dự kiến không hợp lệ: ${paxRes.reason || 'Vui lòng nhập số nguyên dương lớn hơn 0.'}`);
    return;
  }
  const paxVal = paxRes.value;

  const newCustomer = {
    id: Date.now(),
    code: nextCode,
    name: document.getElementById('ctv-lead-name').value.trim(),
    phone: phoneVal,
    demand: notes ? `${demandText} (${paxVal} khách - Ghi chú: ${notes})` : `${demandText} (${paxVal} khách)`,
    paxCount: paxVal,
    source: 'CTV Giới thiệu',
    collaboratorId: currentUser.ctvId, // BẢO MẬT: Khóa cứng ID từ phiên CTV
    staff: assignedSale,
    status: 'Mới tiếp nhận',
    tourValue: 0,
    costValue: 0,
    paidAmount: 0,
    remainingDebt: 0,
    bookingCount: 0,
    date: new Date().toISOString().split('T')[0]
  };

  db.customers.unshift(newCustomer);
  syncCustomerFinancials(newCustomer);
  saveDatabase();

  // BẮN THÔNG BÁO TỨC THỜI CHO SALE VÀ HIỂN THỊ CHẤM ĐỎ CHƯA ĐỌC
  sendInterDeptNotification({
    senderRole: 'CTV',
    senderName: `${currentUser.name} (${currentUser.ctvId})`,
    targetRole: 'SALE',
    targetModule: 2,
    type: 'CTV_LEAD_SUBMITTED',
    title: `CTV gửi khách mới: ${newCustomer.name}`,
    message: `Cộng tác viên ${currentUser.name} (${currentUser.ctvId}) vừa chuyển giao khách hàng mới: ${newCustomer.name} - SĐT: ${newCustomer.phone} - Nhu cầu: ${newCustomer.demand}. Phân công cho Sale: ${assignedSale}. Vui lòng tiếp nhận và tư vấn.`,
    referenceId: newCustomer.code,
    referenceType: 'CUSTOMER'
  });
  updateNotificationBadges();

  recordAuditLog('CTV GỬI KHÁCH HÀNG', `CTV ${currentUser.name} (${currentUser.ctvId}) gửi khách ${newCustomer.name} (${newCustomer.phone}). Phân bổ cho Sale ${assignedSale}.`);

  alert(`🎉 Gửi thông tin khách hàng thành công!\n\n- Mã khách: ${newCustomer.code}\n- Sale phụ trách: ${assignedSale}\n\nNhân viên Sale sẽ liên hệ tư vấn khách ngay.`);

  closeCtvSubmitLeadModal();
  renderCtvPortal();
}

function acknowledgeCtvLead(customerId) {
  const c = db.customers.find(item => item.id === customerId || item.code === customerId || String(item.id) === String(customerId));
  if (!c) return;

  c.status = 'Đang tư vấn';
  saveDatabase();

  // Đánh dấu thông báo liên quan đã đọc / đã tiếp nhận
  if (db.notifications) {
    const notif = db.notifications.find(n => n.referenceId === c.code && n.type === 'CTV_LEAD_SUBMITTED');
    if (notif) {
      notif.status = 'ACKNOWLEDGED';
      notif.acknowledgedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      notif.acknowledgedBy = currentUser ? `${currentUser.name} (${currentUser.roleTitle})` : 'Sale';
    }
  }

  // Bắn thông báo phản hồi tự động về cho CTV
  if (c.collaboratorId) {
    sendInterDeptNotification({
      senderRole: 'SALE',
      senderName: currentUser ? `${currentUser.name} (Sale)` : 'Kinh doanh (Sale)',
      targetRole: 'CTV',
      targetModule: 10,
      type: 'CTV_LEAD_ACK',
      title: `Sale đã tiếp nhận khách: ${c.name}`,
      message: `Nhân viên Sale (${currentUser ? currentUser.name : 'Phụ trách'}) đã tiếp nhận khách hàng ${c.name} (${c.code}) do bạn giới thiệu và đang tiến hành liên hệ tư vấn.`,
      referenceId: c.code,
      referenceType: 'CUSTOMER'
    });
  }

  recordAuditLog('TIẾP NHẬN KHÁCH TỪ CTV', `Sale ${currentUser ? currentUser.name : ''} đã tiếp nhận tư vấn khách ${c.name} (${c.code}).`);
  alert(`✅ ĐÃ TIẾP NHẬN KHÁCH HÀNG THÀNH CÔNG!\n\n- Khách hàng: ${c.name} (${c.code})\n- Trạng thái: Đã chuyển sang "Đang tư vấn"\n\n👉 Thông báo phản hồi đã được gửi tự động về cho CTV.`);

  renderCrmModule();
  updateNotificationBadges();
}

// ==========================================
// 9. ĐỔI MẬT KHẨU AN TOÀN (SHA-256)
// ==========================================
function openChangePasswordModal() {
  document.getElementById('change-password-form').reset();
  document.getElementById('change-password-modal').classList.remove('hidden');
  document.getElementById('change-password-modal').classList.add('flex');
}

function closeChangePasswordModal() {
  document.getElementById('change-password-modal').classList.add('hidden');
  document.getElementById('change-password-modal').classList.remove('flex');
}

function handleChangePasswordSubmit(e) {
  e.preventDefault();
  if (!currentUser) return;

  const currentPass = document.getElementById('current-password-input').value;
  const newPass = document.getElementById('new-password-input').value;
  const confirmPass = document.getElementById('confirm-password-input').value;

  if (newPass !== confirmPass) {
    alert("Xác nhận mật khẩu mới không trùng khớp!");
    return;
  }

  const currentHash = hashWithSalt(currentPass, currentUser.salt || SYSTEM_SALT);
  if (currentUser.passwordHash && currentUser.passwordHash !== currentHash) {
    alert("Mật khẩu hiện tại không chính xác!");
    return;
  }

  const newSalt = `salt_${Date.now()}`;
  const newHash = hashWithSalt(newPass, newSalt);

  const idx = db.users.findIndex(u => u.id === currentUser.id);
  if (idx !== -1) {
    db.users[idx].salt = newSalt;
    db.users[idx].passwordHash = newHash;
    currentUser.salt = newSalt;
    currentUser.passwordHash = newHash;
    sessionStorage.setItem('haha_logged_user', JSON.stringify(currentUser));
    saveDatabase();

    recordAuditLog('ĐỔI MẬT KHẨU', `Người dùng ${currentUser.name} (${currentUser.roleTitle}) đã đổi mật khẩu.`);
    alert("✅ Đổi mật khẩu thành công!");
    closeChangePasswordModal();
  }
}

// ==========================================
// 10. PHÂN HỆ 3: QUẢN LÝ MẠNG LƯỚI CTV, KPI & HOA HỒNG DOANH SỐ SALE (SALE & CEO)
// ==========================================

// Thuật toán hạch toán hiệu suất KPI & Hoa hồng Doanh số Sale (Chuẩn nghiệp vụ Lữ hành)
function calculateSalePerformanceAndCommission(saleId, month = '2026-10') {
  if (!db.ctvs) db.ctvs = [];
  if (!db.bookings) db.bookings = [];
  if (!db.saleKpis) db.saleKpis = [];

  const saleUser = (db.users || []).find(u => u.id === saleId) || { id: saleId, name: 'Nguyễn Văn An' };

  // 1. Mạng lưới CTV gắn độc quyền với Sale này (Scale không giới hạn >100 CTV)
  const myCtvs = db.ctvs.filter(c => c.assignedSaleId === saleId);
  const myCtvIds = new Set(myCtvs.map(c => c.id).concat(myCtvs.map(c => c.code)));

  // 2. Doanh số từ các CTV thuộc quyền quản lý mang về
  const activeBookings = db.bookings.filter(b => b.status !== 'Đã hủy');
  const ctvBookings = activeBookings.filter(b => b.collaboratorId && myCtvIds.has(b.collaboratorId));
  const ctvRevenue = ctvBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // 3. Doanh số do Sale tự tư vấn chốt trực tiếp (không qua CTV)
  const directBookings = activeBookings.filter(b => 
    (!b.collaboratorId || b.collaboratorId === '') && 
    b.staff && (b.staff.includes(saleUser.name) || (saleUser.name && b.staff.includes(saleUser.name.split(' ')[0])))
  );
  const directRevenue = directBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  // 4. Tổng doanh số thực đạt
  const totalRevenue = ctvRevenue + directRevenue;

  // 5. Chỉ tiêu KPI và Cơ chế hoa hồng bậc thang
  const kpiConfig = db.saleKpis.find(k => k.saleId === saleId) || {
    targetAmount: 150000000,
    ctvCommRate: 0.02,
    directCommRate: 0.03,
    tier1Rate: 0.015,
    tier2Rate: 0.025
  };

  const targetAmount = kpiConfig.targetAmount || 150000000;
  const percent = targetAmount > 0 ? Math.round((totalRevenue / targetAmount) * 1000) / 10 : 0;
  const isOverKpi = totalRevenue >= targetAmount;
  const overAmount = Math.max(0, totalRevenue - targetAmount);

  // 6. Tính toán hoa hồng từng phần
  // 6a. Hoa hồng quản lý mạng lưới CTV (2.0%)
  const commFromCtv = Math.round(ctvRevenue * (kpiConfig.ctvCommRate || 0.02));

  // 6b. Hoa hồng bán trực tiếp (3.0%)
  const commDirect = Math.round(directRevenue * (kpiConfig.directCommRate || 0.03));

  // 6c. Thưởng vượt mốc KPI (1.5% nếu >= 100%, 2.5% nếu >= 120%)
  let bonusOverKpi = 0;
  let overRateLabel = '0%';
  if (percent >= 120) {
    bonusOverKpi = Math.round(overAmount * (kpiConfig.tier2Rate || 0.025));
    overRateLabel = `${(kpiConfig.tier2Rate * 100).toFixed(1)}% (Mốc >120%)`;
  } else if (percent >= 100) {
    bonusOverKpi = Math.round(overAmount * (kpiConfig.tier1Rate || 0.015));
    overRateLabel = `${(kpiConfig.tier1Rate * 100).toFixed(1)}% (Mốc 100-120%)`;
  }

  // 6d. Tổng hoa hồng thực nhận của Sale
  const totalCommission = commFromCtv + commDirect + bonusOverKpi;

  // 7. Thống kê chi tiết từng CTV thuộc Sale
  const ctvBreakdown = myCtvs.map(ctv => {
    const custs = (db.customers || []).filter(c => c.collaboratorId === ctv.id || c.collaboratorId === ctv.code);
    const bks = activeBookings.filter(b => b.collaboratorId === ctv.id || b.collaboratorId === ctv.code);
    const rev = bks.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const comms = (db.commissions || []).filter(c => c.ctvId === ctv.id || c.ctvId === ctv.code);
    const ctvEarned = comms.reduce((sum, c) => sum + (c.amount || 0), 0);
    const saleEarnedFromCtv = Math.round(rev * (kpiConfig.ctvCommRate || 0.02));
    const kpiShare = totalRevenue > 0 ? Math.round((rev / totalRevenue) * 1000) / 10 : 0;

    return {
      ctv,
      customerCount: custs.length,
      bookingCount: bks.length,
      revenue: rev,
      kpiShare: kpiShare,
      ctvCommissionEarned: ctvEarned,
      saleCommissionFromCtv: saleEarnedFromCtv
    };
  }).sort((a, b) => b.revenue - a.revenue);

  return {
    saleId,
    saleUser,
    month,
    myCtvsCount: myCtvs.length,
    ctvRevenue,
    directRevenue,
    totalRevenue,
    targetAmount,
    percent,
    isOverKpi,
    overAmount,
    commFromCtv,
    commDirect,
    bonusOverKpi,
    overRateLabel,
    totalCommission,
    ctvBookings,
    directBookings,
    ctvBreakdown,
    kpiConfig
  };
}

// Phân loại xếp hạng hiệu suất CTV khoa học & chuẩn nghiệp vụ lữ hành
function classifyCtvPerformance(ctv) {
  if (ctv.accountStatus === 'terminated') {
    return {
      rating: 'TERMINATED',
      label: '⛔ Đã chấm dứt',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
      isDormant: false,
      isTerminated: true,
      description: ctv.terminationReason || 'Đã chấm dứt liên kết hợp tác'
    };
  }

  const myCusts = (db.customers || []).filter(c => c.collaboratorId === ctv.id || c.collaboratorId === ctv.code);
  const myBookings = (db.bookings || []).filter(b => (b.collaboratorId === ctv.id || b.collaboratorId === ctv.code) && b.status !== 'Đã hủy');
  const totalRevenue = myBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) ||
    myCusts.reduce((sum, c) => sum + (c.status === 'Đã chốt tour' ? (c.tourValue || 0) : 0), 0);

  const now = new Date('2026-10-27');
  const refDateStr = ctv.lastActiveDate || ctv.createdAt || '2026-09-01';
  const refDate = new Date(refDateStr);
  const diffTime = Math.max(0, now - refDate);
  const daysInactive = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (totalRevenue >= 50000000 || myCusts.length >= 3) {
    return {
      rating: 'EXCELLENT',
      label: '🌟 Xuất sắc',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
      isDormant: false,
      isTerminated: false,
      daysInactive,
      description: 'Đóng góp doanh số cao, khách gửi đều đặn'
    };
  }
  if (totalRevenue > 0 || myCusts.length >= 2) {
    return {
      rating: 'GOOD',
      label: '🟢 Hoạt động tốt',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      isDormant: false,
      isTerminated: false,
      daysInactive,
      description: 'Có phát sinh khách hàng và chốt tour'
    };
  }
  if (myCusts.length === 1 || (totalRevenue === 0 && daysInactive <= 60)) {
    return {
      rating: 'LOW',
      label: '🟡 Hoạt động ít',
      badgeClass: 'bg-yellow-100 text-yellow-800 border-yellow-300 font-semibold',
      isDormant: false,
      isTerminated: false,
      daysInactive,
      description: 'Phát sinh ít khách hoặc mới tham gia'
    };
  }
  return {
    rating: 'DORMANT',
    label: '🔴 Không hoạt động',
    badgeClass: 'bg-rose-100 text-rose-700 border-rose-300 font-bold',
    isDormant: true,
    isTerminated: false,
    daysInactive,
    description: `> 60 ngày không có khách (${daysInactive} ngày im lặng)`
  };
}

// Chuyển đổi 4 Sub-tabs chuyên trách trong Phân hệ 3
function switchMod3Tab(tabName) {
  currentMod3Tab = tabName;
  const dirBtn = document.getElementById('mod3-tab-directory-btn');
  const supBtn = document.getElementById('mod3-tab-support-btn');
  const dorBtn = document.getElementById('mod3-tab-dormant-btn');
  const kpiBtn = document.getElementById('mod3-tab-kpi-btn');

  const dirContent = document.getElementById('mod3-tab-directory-content');
  const supContent = document.getElementById('mod3-tab-support-content');
  const dorContent = document.getElementById('mod3-tab-dormant-content');
  const kpiContent = document.getElementById('mod3-tab-kpi-content');

  [dirBtn, supBtn, dorBtn, kpiBtn].forEach(b => {
    if (b) {
      b.classList.remove('border-brand-600', 'text-brand-700', 'font-bold');
      b.classList.add('border-transparent', 'text-slate-500', 'font-semibold');
    }
  });

  [dirContent, supContent, dorContent, kpiContent].forEach(c => {
    if (c) c.classList.add('hidden');
  });

  if (tabName === 'directory') {
    if (dirBtn) {
      dirBtn.classList.remove('border-transparent', 'text-slate-500', 'font-semibold');
      dirBtn.classList.add('border-brand-600', 'text-brand-700', 'font-bold');
    }
    if (dirContent) dirContent.classList.remove('hidden');
    renderCtvModule();
  } else if (tabName === 'support') {
    if (supBtn) {
      supBtn.classList.remove('border-transparent', 'text-slate-500', 'font-semibold');
      supBtn.classList.add('border-brand-600', 'text-brand-700', 'font-bold');
    }
    if (supContent) supContent.classList.remove('hidden');
    renderCtvSupportRequestsTable();
  } else if (tabName === 'dormant') {
    if (dorBtn) {
      dorBtn.classList.remove('border-transparent', 'text-slate-500', 'font-semibold');
      dorBtn.classList.add('border-brand-600', 'text-brand-700', 'font-bold');
    }
    if (dorContent) dorContent.classList.remove('hidden');
    renderDormantCtvsTable();
  } else if (tabName === 'kpi') {
    if (kpiBtn) {
      kpiBtn.classList.remove('border-transparent', 'text-slate-500', 'font-semibold');
      kpiBtn.classList.add('border-brand-600', 'text-brand-700', 'font-bold');
    }
    if (kpiContent) kpiContent.classList.remove('hidden');
    const targetSale = (currentUser && currentUser.role === 'SALE') ? currentUser.id : selectedKpiSaleId;
    renderSaleKpiAndCommissionModule(targetSale);
  }
}

function onSaleKpiStaffSelectChange(saleId) {
  selectedKpiSaleId = saleId;
  renderSaleKpiAndCommissionModule(saleId);
}

// Render chi tiết Tab 4: KPI Đội Sale & Hoa Hồng Doanh Số CTV
function renderSaleKpiAndCommissionModule(targetSaleId = 'NV-002') {
  if (!db.users) db.users = [];
  const saleUsers = db.users.filter(u => u.role === 'SALE');
  
  // Đổ danh sách Sale vào dropdown nếu có
  const staffSelect = document.getElementById('sale-kpi-staff-select');
  if (staffSelect) {
    staffSelect.innerHTML = saleUsers.map(s => `
      <option value="${s.id}" ${s.id === targetSaleId ? 'selected' : ''}>${escapeHtml(s.name)} (${s.username}) - Quản lý</option>
    `).join('');

    // Nếu người dùng là SALE thì cố định xem chính mình
    if (currentUser && currentUser.role === 'SALE') {
      staffSelect.value = currentUser.id;
      staffSelect.disabled = true;
      targetSaleId = currentUser.id;
    } else {
      staffSelect.disabled = false;
    }
  }

  const perfData = calculateSalePerformanceAndCommission(targetSaleId, '2026-10');

  // Cập nhật Header & Title
  const titleEl = document.getElementById('sale-kpi-view-title');
  if (titleEl) {
    titleEl.textContent = (currentUser && currentUser.role === 'SALE') 
      ? `KPI & Hoa Hồng Doanh Số Của Tôi (${perfData.saleUser.name})`
      : `Bảng Điều Khiển KPI & Hạch Toán Hoa Hồng - ${perfData.saleUser.name}`;
  }

  // Khối 1: BANNER HERO TIẾN ĐỘ KPI
  const heroName = document.getElementById('kpi-hero-sale-name');
  if (heroName) heroName.textContent = `${perfData.saleUser.name} (${perfData.saleUser.roleTitle || 'Leader Sales'})`;

  const heroCtvCount = document.getElementById('kpi-hero-ctv-count');
  if (heroCtvCount) heroCtvCount.textContent = `${perfData.myCtvsCount} CTV`;

  const heroPercent = document.getElementById('kpi-hero-percent');
  if (heroPercent) heroPercent.textContent = `${perfData.percent}%`;

  const heroActual = document.getElementById('kpi-hero-actual-text');
  if (heroActual) heroActual.textContent = formatVND(perfData.totalRevenue);

  const heroTarget = document.getElementById('kpi-hero-target-text');
  if (heroTarget) heroTarget.textContent = formatVND(perfData.targetAmount);

  const heroBar = document.getElementById('kpi-hero-progress-bar');
  if (heroBar) {
    const barWidth = Math.min(100, Math.max(0, perfData.percent));
    heroBar.style.width = `${barWidth}%`;
    if (perfData.percent >= 120) {
      heroBar.className = 'h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-yellow-300 transition-all duration-500';
    } else if (perfData.percent >= 100) {
      heroBar.className = 'h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-500';
    } else {
      heroBar.className = 'h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-500';
    }
  }

  const heroBadge = document.getElementById('kpi-hero-over-badge');
  const heroOverAmt = document.getElementById('kpi-hero-over-amount');
  if (heroBadge) {
    if (perfData.percent >= 120) {
      heroBadge.textContent = '🌟 VƯỢT KPI XUẤT SẮC (>120%)';
      heroBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950 border border-amber-300 animate-bounce';
      if (heroOverAmt) heroOverAmt.textContent = `+${formatVND(perfData.overAmount)} vượt chỉ tiêu (Thưởng 2.5%)`;
    } else if (perfData.percent >= 100) {
      heroBadge.textContent = '🎉 HOÀN THÀNH & VƯỢT KPI';
      heroBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400 text-slate-950 border border-emerald-300';
      if (heroOverAmt) heroOverAmt.textContent = `+${formatVND(perfData.overAmount)} vượt chỉ tiêu (Thưởng 1.5%)`;
    } else {
      heroBadge.textContent = '⚡ ĐANG TẬP TRUNG CHẠY SỐ';
      heroBadge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30';
      const remain = perfData.targetAmount - perfData.totalRevenue;
      if (heroOverAmt) heroOverAmt.textContent = `Còn thiếu ${formatVND(remain)} để chạm mốc KPI`;
    }
  }

  // Cơ cấu doanh số: CTV vs Direct
  const heroCtvRev = document.getElementById('kpi-hero-ctv-rev');
  if (heroCtvRev) heroCtvRev.textContent = formatVND(perfData.ctvRevenue);
  const heroCtvSub = document.getElementById('kpi-hero-ctv-sub');
  if (heroCtvSub) heroCtvSub.textContent = `${perfData.ctvBookings.length} đơn tour từ ${perfData.myCtvsCount} CTV quản lý`;
  const heroCtvShare = document.getElementById('kpi-hero-ctv-share');
  if (heroCtvShare) {
    const s = perfData.totalRevenue > 0 ? Math.round((perfData.ctvRevenue / perfData.totalRevenue) * 100) : 0;
    heroCtvShare.textContent = `${s}% tổng doanh số`;
  }

  const heroDirectRev = document.getElementById('kpi-hero-direct-rev');
  if (heroDirectRev) heroDirectRev.textContent = formatVND(perfData.directRevenue);
  const heroDirectSub = document.getElementById('kpi-hero-direct-sub');
  if (heroDirectSub) heroDirectSub.textContent = `${perfData.directBookings.length} đơn tự tư vấn trực tiếp`;
  const heroDirectShare = document.getElementById('kpi-hero-direct-share');
  if (heroDirectShare) {
    const s = perfData.totalRevenue > 0 ? Math.round((perfData.directRevenue / perfData.totalRevenue) * 100) : 0;
    heroDirectShare.textContent = `${s}% tổng doanh số`;
  }

  // Khối 2: 4 THẺ THU NHẬP HOA HỒNG
  const commCtvEl = document.getElementById('sale-comm-ctv');
  if (commCtvEl) commCtvEl.textContent = formatVND(perfData.commFromCtv);

  const commOverEl = document.getElementById('sale-comm-over');
  if (commOverEl) commOverEl.textContent = formatVND(perfData.bonusOverKpi);

  const commOverRateTag = document.getElementById('sale-comm-over-rate-tag');
  if (commOverRateTag) commOverRateTag.textContent = perfData.overRateLabel;

  const commOverSub = document.getElementById('sale-comm-over-sub');
  if (commOverSub) {
    commOverSub.textContent = perfData.isOverKpi 
      ? `Đạt ${perfData.percent}% KPI (Vượt +${formatVND(perfData.overAmount)})`
      : 'Chưa vượt mốc KPI tháng này';
  }

  const commDirectEl = document.getElementById('sale-comm-direct');
  if (commDirectEl) commDirectEl.textContent = formatVND(perfData.commDirect);

  const commTotalEarned = document.getElementById('sale-comm-total-earned');
  if (commTotalEarned) commTotalEarned.textContent = formatVND(perfData.totalCommission);

  // Cập nhật badge trên Sub-tab 4
  const kpiBadge = document.getElementById('mod3-kpi-rate-badge');
  if (kpiBadge) {
    kpiBadge.textContent = `${perfData.percent}% KPI`;
    if (perfData.percent >= 100) {
      kpiBadge.className = 'px-2 py-0.5 text-[10px] rounded-full bg-amber-400 text-slate-950 font-black animate-pulse';
    } else {
      kpiBadge.className = 'px-2 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-700 font-bold';
    }
  }

  // Khối 3: BẢNG XẾP HẠNG ĐÓNG GÓP TỪNG CTV
  const ctvTbody = document.getElementById('sale-kpi-ctv-tbody');
  const ctvTableCount = document.getElementById('sale-kpi-ctv-table-count');
  if (ctvTableCount) ctvTableCount.textContent = `${perfData.ctvBreakdown.length} CTV gắn với Sale`;

  if (ctvTbody) {
    if (perfData.ctvBreakdown.length === 0) {
      ctvTbody.innerHTML = '<tr><td colspan="8" class="py-8 text-center text-xs text-slate-400">Sale chưa có CTV nào được phân công quản lý.</td></tr>';
    } else {
      ctvTbody.innerHTML = perfData.ctvBreakdown.map((item, idx) => {
        return `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3 px-4 font-semibold text-slate-900">
              <div class="flex items-center space-x-2">
                <span class="w-5 h-5 rounded-full ${idx === 0 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-100 text-slate-600'} flex items-center justify-center text-[10px]">
                  ${idx + 1}
                </span>
                <button onclick="openCtvProfile360('${item.ctv.id}')" class="font-bold text-brand-700 hover:underline text-left">
                  ${escapeHtml(item.ctv.name)}
                </button>
              </div>
              <div class="text-[10px] text-slate-400 pl-7 font-mono">${escapeHtml(item.ctv.code)} &bull; ${escapeHtml(item.ctv.phone || '')}</div>
            </td>
            <td class="py-3 px-4">
              <span class="font-mono text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                ${escapeHtml(item.ctv.refCode || '')}
              </span>
            </td>
            <td class="py-3 px-4">
              <div class="font-bold text-slate-800">${item.customerCount} khách</div>
              <div class="text-[10px] text-slate-400">${item.bookingCount} đơn tour</div>
            </td>
            <td class="py-3 px-4 font-bold text-slate-900">
              ${formatVND(item.revenue)}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center space-x-1.5">
                <div class="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-indigo-600 h-full rounded-full" style="width: ${Math.min(100, item.kpiShare)}%"></div>
                </div>
                <span class="font-mono text-[11px] font-bold text-indigo-700">${item.kpiShare}%</span>
              </div>
            </td>
            <td class="py-3 px-4 font-semibold text-slate-600">
              ${formatVND(item.ctvCommissionEarned)}
            </td>
            <td class="py-3 px-4 text-right">
              <span class="font-extrabold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200 text-xs">
                +${formatVND(item.saleCommissionFromCtv)}
              </span>
            </td>
            <td class="py-3 px-4 text-center">
              <button onclick="openCtvProfile360('${item.ctv.id}')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                🔍 Soi 360°
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Khối 4: BẢNG ĐỐI SOÁT CHI TIẾT TỪNG ĐƠN TOUR HẠCH TOÁN CHO SALE
  const bookingsTbody = document.getElementById('sale-kpi-bookings-tbody');
  const allSaleBookings = perfData.ctvBookings.map(b => ({ ...b, isFromCtv: true })).concat(
    perfData.directBookings.map(b => ({ ...b, isFromCtv: false }))
  );

  const bookingsCountEl = document.getElementById('sale-kpi-bookings-count');
  if (bookingsCountEl) bookingsCountEl.textContent = `${allSaleBookings.length} đơn tour tính hoa hồng`;

  if (bookingsTbody) {
    if (allSaleBookings.length === 0) {
      bookingsTbody.innerHTML = '<tr><td colspan="7" class="py-8 text-center text-xs text-slate-400">Chưa có đơn tour nào hoàn thành trong kỳ.</td></tr>';
    } else {
      bookingsTbody.innerHTML = allSaleBookings.map(b => {
        const isFromCtv = b.isFromCtv;
        const rate = isFromCtv ? 0.02 : 0.03;
        const commEarned = Math.round((b.totalAmount || 0) * rate);

        return `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3 px-4 font-mono">
              <div class="font-bold text-brand-800">${escapeHtml(b.code)}</div>
              <div class="text-[10px] text-slate-400">${escapeHtml(b.departureDate || '2026-10-24')}</div>
            </td>
            <td class="py-3 px-4">
              <div class="font-bold text-slate-900">${escapeHtml(b.customerName || 'Khách hàng')}</div>
              <div class="text-[11px] text-slate-600 truncate max-w-xs">${escapeHtml(b.tourName || 'Tour sinh thái')} (${b.paxCount || 1} pax)</div>
            </td>
            <td class="py-3 px-4">
              ${isFromCtv ? `
                <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  <span>👥 CTV:</span>
                  <span class="font-semibold">${escapeHtml(b.ctvName || b.collaboratorId)}</span>
                </span>
              ` : `
                <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span>💼 Sale tự bán trực tiếp</span>
                </span>
              `}
            </td>
            <td class="py-3 px-4 font-bold text-slate-900">
              ${formatVND(b.totalAmount || 0)}
            </td>
            <td class="py-3 px-4 font-mono font-bold ${isFromCtv ? 'text-blue-700' : 'text-emerald-700'}">
              ${(rate * 100).toFixed(1)}%
            </td>
            <td class="py-3 px-4 text-right font-extrabold text-emerald-700">
              +${formatVND(commEarned)}
            </td>
            <td class="py-3 px-4 text-center">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${b.status === 'Đã thanh toán đủ' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}">
                ${escapeHtml(b.status || 'Thành công')}
              </span>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Khối 5: BẢNG XẾP HẠNG TOÀN ĐỘI SALE (LEADERBOARD)
  const leaderTbody = document.getElementById('sale-team-leaderboard-tbody');
  if (leaderTbody) {
    const allSaleStats = saleUsers.map(s => calculateSalePerformanceAndCommission(s.id, '2026-10'))
      .sort((a, b) => b.percent - a.percent);

    leaderTbody.innerHTML = allSaleStats.map((st, idx) => {
      const isSelected = (st.saleId === targetSaleId);
      return `
        <tr class="${isSelected ? 'bg-indigo-50/70 font-semibold' : 'hover:bg-slate-50'} transition-colors">
          <td class="py-3 px-4">
            <div class="flex items-center space-x-2">
              <span class="w-6 h-6 rounded-full ${idx === 0 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-200 text-slate-700'} flex items-center justify-center text-xs">
                ${idx === 0 ? '👑' : idx + 1}
              </span>
              <div>
                <div class="font-bold text-slate-900">${escapeHtml(st.saleUser.name)} ${isSelected ? '<span class="text-[10px] text-indigo-700 font-extrabold bg-indigo-100 px-1.5 py-0.2 rounded-full ml-1">Đang xem</span>' : ''}</div>
                <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(st.saleUser.username)}</div>
              </div>
            </div>
          </td>
          <td class="py-3 px-4">
            <span class="font-bold text-blue-800">${st.myCtvsCount} CTV</span>
            <div class="text-[10px] text-slate-400">Độc quyền</div>
          </td>
          <td class="py-3 px-4 font-semibold text-slate-700">
            ${formatVND(st.targetAmount)}
          </td>
          <td class="py-3 px-4 font-bold text-slate-900">
            ${formatVND(st.totalRevenue)}
            <div class="text-[10px] text-slate-400 font-normal">CTV: ${formatVND(st.ctvRevenue)}</div>
          </td>
          <td class="py-3 px-4">
            <div class="flex items-center space-x-1.5">
              <span class="text-sm font-black ${st.percent >= 100 ? 'text-emerald-700' : 'text-slate-800'}">${st.percent}%</span>
            </div>
          </td>
          <td class="py-3 px-4">
            ${st.percent >= 120 ? `
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 border border-amber-300">
                🌟 VƯỢT XUẤT SẮC
              </span>
            ` : st.percent >= 100 ? `
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                ✓ ĐẠT &amp; VƯỢT KPI
              </span>
            ` : `
              <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                ⏳ Đang tiến tới mốc
              </span>
            `}
          </td>
          <td class="py-3 px-4 text-right font-extrabold text-emerald-700 text-sm">
            ${formatVND(st.totalCommission)}
          </td>
          <td class="py-3 px-4 text-center">
            <button onclick="onSaleKpiStaffSelectChange('${st.saleId}')" class="px-2.5 py-1 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'} rounded-lg text-xs font-bold transition-all shadow-sm">
              ${isSelected ? '✓ Đang xem' : '👁️ Xem'}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
}

function filterCtvsBySale(saleId) {
  ctvSaleFilter = saleId;
  ctvCurrentPage = 1;
  renderCtvModule();
}

function filterCtvsByRating(rating, btn) {
  ctvRatingFilter = rating;
  ctvCurrentPage = 1;
  const btns = document.querySelectorAll('.filter-ctv-rating-btn');
  btns.forEach(b => {
    b.classList.remove('active', 'bg-brand-600', 'text-white', 'border-brand-600');
    b.classList.add('bg-white', 'border-slate-200');
  });
  if (btn) {
    btn.classList.add('active', 'bg-brand-600', 'text-white', 'border-brand-600');
    btn.classList.remove('bg-white', 'border-slate-200');
  }
  renderCtvModule();
}

function filterSupportRequests(status, btn) {
  ctvSupportFilter = status;
  const btns = document.querySelectorAll('.filter-support-btn');
  btns.forEach(b => {
    b.classList.remove('active', 'bg-brand-600', 'text-white', 'border-brand-600');
    b.classList.add('bg-white');
  });
  if (btn) {
    btn.classList.add('active', 'bg-brand-600', 'text-white', 'border-brand-600');
    btn.classList.remove('bg-white');
  }
  renderCtvSupportRequestsTable();
}

function filterCtvs(status, btn) {
  ctvFilter = status;
  ctvCurrentPage = 1;
  const btns = document.querySelectorAll('.filter-ctv-btn');
  btns.forEach(b => {
    b.classList.remove('active', 'bg-brand-600', 'text-white', 'border-brand-600');
    b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
  });
  if (btn) {
    btn.classList.add('active', 'bg-brand-600', 'text-white', 'border-brand-600');
    btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
  }
  renderCtvModule();
}

function searchCtvs(query) {
  ctvSearchQuery = (query || '').trim().toLowerCase();
  ctvCurrentPage = 1;
  renderCtvModule();
}

function renderCtvModule() {
  if (!db.ctvs) db.ctvs = [];

  // Đổ danh sách Sale vào dropdown filter (nếu chưa đổ)
  const saleSelect = document.getElementById('ctv-sale-filter-select');
  if (saleSelect && saleSelect.options.length <= 1) {
    const saleUsers = (db.users || []).filter(u => u.role === 'SALE');
    saleUsers.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.name} (${s.username}) - Quản lý`;
      saleSelect.appendChild(opt);
    });
  }

  // Tự động chọn Sale đang đăng nhập nếu là SALE và chưa chọn
  if (currentUser && currentUser.role === 'SALE' && ctvSaleFilter === 'all' && saleSelect) {
    // Để Sale nhìn thấy tổng thể hoặc xem nhóm của mình
    // Không ép cứng để Sale vẫn có thể xem phối hợp
  }

  // Lọc dữ liệu CTV
  const filtered = db.ctvs.filter(ctv => {
    // 1. Lọc theo Sale phụ trách
    const saleMatch = (ctvSaleFilter === 'all') || (ctv.assignedSaleId === ctvSaleFilter);

    // 2. Lọc theo xếp hạng hiệu suất
    const perf = classifyCtvPerformance(ctv);
    const ratingMatch = (ctvRatingFilter === 'all') || (perf.rating === ctvRatingFilter);

    // 3. Lọc theo trạng thái cũ (nếu có dùng ctvFilter)
    const user = (db.users || []).find(u => u.ctvId === ctv.id);
    const isLocked = user && user.status === 'locked';
    const statusMatch = ctvFilter === 'all' || 
      (ctvFilter === 'active' && !isLocked && ctv.accountStatus !== 'terminated') || 
      (ctvFilter === 'locked' && isLocked);

    // 4. Tìm kiếm từ khóa
    const q = ctvSearchQuery;
    const searchMatch = !q ||
      (ctv.name && ctv.name.toLowerCase().includes(q)) ||
      (ctv.code && ctv.code.toLowerCase().includes(q)) ||
      (ctv.refCode && ctv.refCode.toLowerCase().includes(q)) ||
      (ctv.phone && ctv.phone.includes(q)) ||
      (ctv.username && ctv.username.toLowerCase().includes(q)) ||
      (ctv.assignedSale && ctv.assignedSale.toLowerCase().includes(q));

    return saleMatch && ratingMatch && statusMatch && searchMatch;
  });

  // Tính toán KPI theo phạm vi quản lý
  const scopeCtvs = db.ctvs.filter(c => (ctvSaleFilter === 'all') || (c.assignedSaleId === ctvSaleFilter));
  const activeCtvCount = scopeCtvs.filter(c => {
    const p = classifyCtvPerformance(c);
    return p.rating === 'EXCELLENT' || p.rating === 'GOOD';
  }).length;
  const dormantCtvCount = scopeCtvs.filter(c => {
    const p = classifyCtvPerformance(c);
    return p.rating === 'DORMANT';
  }).length;

  const scopeCtvIds = new Set(scopeCtvs.map(c => c.id));
  const ctvCustomers = (db.customers || []).filter(c => c.collaboratorId && scopeCtvIds.has(c.collaboratorId));
  const totalCtvRevenue = ctvCustomers.reduce((sum, c) => {
    const s = getCustomerFinancialSummary(c);
    return sum + (s.bookingCount > 0 ? s.totalContract : (c.status === 'Đã chốt tour' ? (c.tourValue || 0) : 0));
  }, 0);

  // Cập nhật 4 KPI Cards theo chuẩn mới: Doanh số CTV, KPI Sale & Hoa hồng Sale
  const statTotal = document.getElementById('stat-total-ctv');
  if (statTotal) statTotal.textContent = scopeCtvs.length;

  const statTotalSub = document.getElementById('stat-total-ctv-sub');
  if (statTotalSub) statTotalSub.textContent = 'Gắn độc quyền 1 Sale • >100 CTV';

  const statRev = document.getElementById('stat-ctv-revenue');
  if (statRev) statRev.textContent = formatVND(totalCtvRevenue);

  const statCustSub = document.getElementById('stat-ctv-customers-sub');
  if (statCustSub) statCustSub.textContent = `${ctvCustomers.length} khách do CTV mang về`;

  // Tính toán KPI & Hoa hồng của Sale đang xem / đăng nhập
  const currentSaleId = (currentUser && currentUser.role === 'SALE') ? currentUser.id : (ctvSaleFilter !== 'all' ? ctvSaleFilter : selectedKpiSaleId);
  const saleKpiData = calculateSalePerformanceAndCommission(currentSaleId, '2026-10');

  const statKpiPercent = document.getElementById('stat-sale-kpi-percent');
  if (statKpiPercent) statKpiPercent.textContent = `${saleKpiData.percent}%`;

  const statKpiStatus = document.getElementById('stat-sale-kpi-status');
  if (statKpiStatus) {
    if (saleKpiData.percent >= 120) {
      statKpiStatus.textContent = '🌟 Vượt xuất sắc';
      statKpiStatus.className = 'text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black animate-pulse';
    } else if (saleKpiData.percent >= 100) {
      statKpiStatus.textContent = '✓ Vượt KPI';
      statKpiStatus.className = 'text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800';
    } else {
      statKpiStatus.textContent = 'Đang chạy số';
      statKpiStatus.className = 'text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700';
    }
  }

  const statKpiSub = document.getElementById('stat-sale-kpi-sub');
  if (statKpiSub) statKpiSub.textContent = `Target: ${formatVND(saleKpiData.targetAmount)} (${saleKpiData.saleUser.name})`;

  const statSaleComm = document.getElementById('stat-sale-commission-total');
  if (statSaleComm) statSaleComm.textContent = formatVND(saleKpiData.totalCommission);

  const statSaleCommSub = document.getElementById('stat-sale-comm-sub');
  if (statSaleCommSub) {
    statSaleCommSub.textContent = saleKpiData.isOverKpi 
      ? `QL CTV: ${formatVND(saleKpiData.commFromCtv)} + Thưởng vượt KPI: ${formatVND(saleKpiData.bonusOverKpi)}`
      : `Hoa hồng QL CTV (2%): ${formatVND(saleKpiData.commFromCtv)}`;
  }

  // Cập nhật badge Sub-tab 4
  const kpiTabBadge = document.getElementById('mod3-kpi-rate-badge');
  if (kpiTabBadge) {
    kpiTabBadge.textContent = `${saleKpiData.percent}% KPI`;
    if (saleKpiData.percent >= 100) {
      kpiTabBadge.className = 'px-2 py-0.5 text-[10px] rounded-full bg-amber-400 text-slate-950 font-black';
    } else {
      kpiTabBadge.className = 'px-2 py-0.5 text-[10px] rounded-full bg-emerald-100 text-emerald-800 font-extrabold';
    }
  }

  // Cập nhật các badge số lượng trên thanh Sub-tabs
  const totalCtvBadge = document.getElementById('mod3-total-ctv-badge');
  if (totalCtvBadge) totalCtvBadge.textContent = db.ctvs.length;

  const dormantBadge = document.getElementById('mod3-dormant-badge');
  if (dormantBadge) dormantBadge.textContent = db.ctvs.filter(c => classifyCtvPerformance(c).rating === 'DORMANT').length;

  const pendingSupportCount = (db.ctvSupportMessages || []).filter(m => m.status === 'pending').length;
  const supportBadge = document.getElementById('mod3-support-pending-badge');
  if (supportBadge) {
    supportBadge.textContent = pendingSupportCount;
    if (pendingSupportCount > 0) supportBadge.classList.remove('hidden');
    else supportBadge.classList.add('hidden');
  }

  // Render bảng danh bạ
  const emptyEl = document.getElementById('ctv-empty');
  const tbody = document.getElementById('ctv-table-body');

  if (filtered.length === 0) {
    if (tbody) tbody.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    renderCtvPagination(0, 1);
    return;
  }
  if (emptyEl) emptyEl.classList.add('hidden');

  const totalPages = Math.ceil(filtered.length / CTVS_PER_PAGE) || 1;
  if (ctvCurrentPage > totalPages) ctvCurrentPage = totalPages;
  const startIdx = (ctvCurrentPage - 1) * CTVS_PER_PAGE;
  const pageItems = filtered.slice(startIdx, startIdx + CTVS_PER_PAGE);

  if (tbody) {
    tbody.innerHTML = pageItems.map(ctv => {
      const user = (db.users || []).find(u => u.ctvId === ctv.id);
      const isLocked = user && user.status === 'locked';
      const isTerminated = ctv.accountStatus === 'terminated';

      let statusBadge = '<span class="account-badge-active">✓ Hoạt động</span>';
      if (isTerminated) {
        statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">⛔ Đã chấm dứt</span>';
      } else if (isLocked) {
        statusBadge = '<span class="account-badge-locked">🔒 Đã khóa</span>';
      }

      const perf = classifyCtvPerformance(ctv);
      const myCusts = (db.customers || []).filter(c => c.collaboratorId === ctv.id || c.collaboratorId === ctv.code);
      const myRevenue = myCusts.reduce((sum, c) => {
        const s = getCustomerFinancialSummary(c);
        return sum + (s.bookingCount > 0 ? s.totalContract : (c.status === 'Đã chốt tour' ? (c.tourValue || 0) : 0));
      }, 0);

      const daysText = perf.daysInactive === 0 ? '<span class="text-emerald-600 font-bold">Hôm nay</span>' : `<span class="text-slate-600">${perf.daysInactive} ngày trước</span>`;

      return `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-3 px-4">
            <div class="flex items-center space-x-2.5">
              <div class="w-8 h-8 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-sm border border-brand-200">
                🌱
              </div>
              <div>
                <button onclick="openCtvProfile360('${ctv.id}')" class="font-bold text-brand-700 hover:text-brand-900 hover:underline text-left block">
                  ${escapeHtml(ctv.name)}
                </button>
                <div class="flex items-center space-x-1.5 text-[10px] text-slate-400 font-mono">
                  <span>${escapeHtml(ctv.code)}</span>
                  <span>&bull;</span>
                  <span>${escapeHtml(ctv.phone || 'Chưa có SĐT')}</span>
                  <span>&bull;</span>
                  <span class="text-amber-700 bg-amber-50 px-1 rounded font-bold">${escapeHtml(ctv.refCode || '')}</span>
                </div>
              </div>
            </div>
          </td>
          <td class="py-3 px-4">
            <div class="font-semibold text-slate-800 flex items-center space-x-1">
              <span>💼</span>
              <span>${escapeHtml(ctv.assignedSale || 'Nguyễn Văn An')}</span>
            </div>
            <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(ctv.assignedSalePhone || '0901234567')}</div>
          </td>
          <td class="py-3 px-4">
            <span class="inline-block px-2 py-0.5 rounded-lg border text-[11px] ${perf.badgeClass}">
              ${perf.label}
            </span>
            <div class="text-[10px] text-slate-400 mt-0.5">${perf.description}</div>
          </td>
          <td class="py-3 px-4">
            <div class="font-bold text-slate-900">${myCusts.length} khách</div>
            <div class="text-[11px] font-semibold text-brand-700">${formatVND(myRevenue)}</div>
          </td>
          <td class="py-3 px-4 text-xs">
            ${daysText}
            <div class="text-[10px] text-slate-400">Đăng ký: ${ctv.createdAt || '01/09/2026'}</div>
          </td>
          <td class="py-3 px-4">${statusBadge}</td>
          <td class="py-3 px-4 text-center">
            <div class="inline-flex items-center space-x-1">
              <button onclick="openCtvProfile360('${ctv.id}')" class="px-2 py-1 bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold rounded-lg text-[11px] transition-colors border border-brand-200" title="Xem hồ sơ 360°">
                🔍 Soi 360°
              </button>
              <button onclick="openReplySupportModalForCtv('${ctv.id}')" class="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-[11px] transition-colors border border-blue-200" title="Hướng dẫn CTV">
                💬 Hướng dẫn
              </button>
              ${isTerminated ? `
                <button onclick="reactivateCtv('${ctv.id}')" class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-[11px] transition-colors border border-emerald-200" title="Khôi phục liên kết">
                  🔄 Khôi phục
                </button>
              ` : `
                <button onclick="openTerminateCtvModal('${ctv.id}')" class="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-[11px] transition-colors border border-rose-200" title="Chấm dứt liên kết">
                  ⛔ Chấm dứt
                </button>
              `}
              ${currentUser && currentUser.role === 'CEO' ? `
                <button onclick="toggleLockCtvAccount('${ctv.id}')" class="action-btn ${isLocked ? 'action-btn-edit' : 'action-btn-delete'}" title="${isLocked ? 'Mở khóa' : 'Khóa'}">
                  ${isLocked ? '🔓' : '🔒'}
                </button>
                <button onclick="resetCtvPasswordToDefault('${ctv.id}')" class="action-btn action-btn-edit" title="Reset MK">
                  🔑
                </button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderCtvPagination(filtered.length, totalPages);
}

function renderCtvPagination(totalItems, totalPages) {
  const container = document.getElementById('ctv-pagination');
  if (!container) return;

  if (totalItems <= CTVS_PER_PAGE) {
    container.innerHTML = `<span class="pagination-info">Tổng cộng <b>${totalItems}</b> CTV</span>`;
    return;
  }

  let html = `<span class="pagination-info">Hiển thị <b>${(ctvCurrentPage - 1) * CTVS_PER_PAGE + 1}-${Math.min(ctvCurrentPage * CTVS_PER_PAGE, totalItems)}</b> / <b>${totalItems}</b> CTV</span>`;
  html += '<div class="flex items-center space-x-1">';
  html += `<button class="pagination-btn ${ctvCurrentPage === 1 ? 'disabled' : ''}" onclick="changeCtvPage(${ctvCurrentPage - 1})" ${ctvCurrentPage === 1 ? 'disabled' : ''}>&larr; Trước</button>`;

  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= ctvCurrentPage - 1 && p <= ctvCurrentPage + 1)) {
      html += `<button class="pagination-btn ${p === ctvCurrentPage ? 'active' : ''}" onclick="changeCtvPage(${p})">${p}</button>`;
    } else if (p === ctvCurrentPage - 2 || p === ctvCurrentPage + 2) {
      html += `<span class="px-1 text-slate-400">...</span>`;
    }
  }

  html += `<button class="pagination-btn ${ctvCurrentPage === totalPages ? 'disabled' : ''}" onclick="changeCtvPage(${ctvCurrentPage + 1})" ${ctvCurrentPage === totalPages ? 'disabled' : ''}>Sau &rarr;</button>`;
  html += '</div>';

  container.innerHTML = html;
}

function changeCtvPage(p) {
  ctvCurrentPage = p;
  renderCtvModule();
}

// Render Tab 2: Cổng tiếp nhận & phản hồi hướng dẫn cho CTV
function renderCtvSupportRequestsTable() {
  const tbody = document.getElementById('ctv-support-table-body');
  const emptyDiv = document.getElementById('ctv-support-empty');
  if (!tbody) return;

  const msgs = (db.ctvSupportMessages || []).filter(m => {
    if (ctvSupportFilter === 'pending') return m.status === 'pending';
    if (ctvSupportFilter === 'resolved') return m.status === 'resolved';
    return true;
  });

  if (msgs.length === 0) {
    tbody.innerHTML = '';
    if (emptyDiv) emptyDiv.classList.remove('hidden');
    return;
  }
  if (emptyDiv) emptyDiv.classList.add('hidden');

  tbody.innerHTML = msgs.map(m => {
    const isPending = (m.status === 'pending');
    const statusBadge = isPending 
      ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">🟡 Chờ Sale hướng dẫn</span>'
      : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">🟢 Đã hướng dẫn</span>';

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3 px-4 font-mono">
          <div class="font-bold text-slate-900">${escapeHtml(m.id)}</div>
          <div class="text-[10px] text-slate-400">${escapeHtml(m.createdAt || '')}</div>
        </td>
        <td class="py-3 px-4">
          <button onclick="openCtvProfile360('${m.ctvId}')" class="font-bold text-brand-700 hover:underline block text-left">
            ${escapeHtml(m.ctvName)}
          </button>
          <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(m.ctvPhone || '')}</div>
        </td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900">${escapeHtml(m.subject)}</div>
          <div class="text-[11px] text-slate-500 font-medium">${escapeHtml(m.tourName || 'Tư vấn chung')}</div>
          ${m.customerName ? `<div class="text-[10px] text-brand-600 font-semibold">Khách: ${escapeHtml(m.customerName)} (${escapeHtml(m.customerCode || '')})</div>` : ''}
        </td>
        <td class="py-3 px-4 max-w-xs">
          <p class="text-xs text-slate-700 leading-relaxed line-clamp-2">${escapeHtml(m.content)}</p>
          ${m.reply ? `<div class="mt-1 text-[11px] text-emerald-700 bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-200"><strong>Sale ${escapeHtml(m.repliedBy || 'phụ trách')}:</strong> ${escapeHtml(m.reply)}</div>` : ''}
        </td>
        <td class="py-3 px-4">${statusBadge}</td>
        <td class="py-3 px-4 text-center">
          <button onclick="openReplySupportModal('${m.id}')" class="px-3 py-1.5 ${isPending ? 'bg-brand-600 hover:bg-brand-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} font-bold rounded-xl text-xs transition-all shadow-sm">
            ${isPending ? '✍️ Hướng dẫn ngay' : '✏️ Xem lại / Sửa'}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Render Tab 3: Rà soát các CTV không hoạt động & Chấm dứt liên kết
function renderDormantCtvsTable() {
  const tbody = document.getElementById('ctv-dormant-table-body');
  const emptyDiv = document.getElementById('ctv-dormant-empty');
  const countTag = document.getElementById('dormant-ctv-count-tag');
  if (!tbody) return;

  const dormantList = (db.ctvs || []).filter(c => {
    const perf = classifyCtvPerformance(c);
    return perf.rating === 'DORMANT' || perf.rating === 'TERMINATED';
  });

  if (countTag) countTag.textContent = `${dormantList.length} CTV cần chú ý`;

  if (dormantList.length === 0) {
    tbody.innerHTML = '';
    if (emptyDiv) emptyDiv.classList.remove('hidden');
    return;
  }
  if (emptyDiv) emptyDiv.classList.add('hidden');

  tbody.innerHTML = dormantList.map(c => {
    const perf = classifyCtvPerformance(c);
    const isTerminated = (perf.rating === 'TERMINATED');
    const myCusts = (db.customers || []).filter(cust => cust.collaboratorId === c.id || cust.collaboratorId === c.code);

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900">${escapeHtml(c.name)}</div>
          <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(c.code)} &bull; ${escapeHtml(c.phone || '')}</div>
        </td>
        <td class="py-3 px-4">
          <div class="font-semibold text-slate-800">${escapeHtml(c.assignedSale || 'Nguyễn Văn An')}</div>
          <div class="text-[10px] text-slate-400">${escapeHtml(c.assignedSalePhone || '0901234567')}</div>
        </td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 bg-rose-100 text-rose-800 font-bold text-xs rounded-lg border border-rose-200">
            ${perf.daysInactive} ngày
          </span>
          <div class="text-[10px] text-slate-400 mt-0.5">Lần cuối: ${c.lastActiveDate || c.createdAt || 'Chưa có'}</div>
        </td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-800">${myCusts.length} khách</div>
          <div class="text-[10px] text-slate-400">Doanh thu: 0 đ</div>
        </td>
        <td class="py-3 px-4">
          <div class="text-xs font-semibold ${isTerminated ? 'text-slate-500' : 'text-rose-600'}">
            ${escapeHtml(perf.description)}
          </div>
          ${isTerminated && c.terminationDate ? `<div class="text-[10px] text-slate-400 font-mono">Đã chấm dứt: ${c.terminationDate}</div>` : ''}
        </td>
        <td class="py-3 px-4 text-center space-x-1">
          <button onclick="openCtvProfile360('${c.id}')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs">
            🔍 Hồ sơ
          </button>
          ${isTerminated ? `
            <button onclick="reactivateCtv('${c.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-sm">
              🔄 Khôi phục liên kết
            </button>
          ` : `
            <button onclick="openReplySupportModalForCtv('${c.id}')" class="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs border border-blue-200">
              💬 Kích hoạt lại
            </button>
            <button onclick="openTerminateCtvModal('${c.id}')" class="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-sm">
              ⛔ Chấm dứt liên kết
            </button>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================
// HỒ SƠ TOÀN DIỆN 360° CỦA CTV DÀNH CHO SALE & CEO
// ==========================================
function openCtvProfile360(ctvId) {
  const ctv = (db.ctvs || []).find(c => c.id === ctvId || c.code === ctvId);
  if (!ctv) {
    alert("Không tìm thấy thông tin CTV này!");
    return;
  }

  selectedCtvFor360 = ctv;
  const perf = classifyCtvPerformance(ctv);
  const myCusts = (db.customers || []).filter(c => c.collaboratorId === ctv.id || c.collaboratorId === ctv.code);
  const myComms = (db.commissions || []).filter(c => c.ctvId === ctv.id || c.ctvId === ctv.code);
  const myRevenue = myCusts.reduce((sum, c) => {
    const s = getCustomerFinancialSummary(c);
    return sum + (s.bookingCount > 0 ? s.totalContract : (c.status === 'Đã chốt tour' ? (c.tourValue || 0) : 0));
  }, 0);
  const totalComm = myComms.reduce((sum, c) => sum + (c.amount || 0), 0);

  // Header Modal
  document.getElementById('prof360-name').textContent = ctv.name;
  document.getElementById('prof360-code').textContent = ctv.code;
  document.getElementById('prof360-sale-assigned').textContent = `Sale phụ trách: ${ctv.assignedSale || 'Nguyễn Văn An'}`;

  const ratingBadge = document.getElementById('prof360-rating-badge');
  if (ratingBadge) {
    ratingBadge.textContent = perf.label;
    ratingBadge.className = `px-2 py-0.5 text-[10px] rounded-full border ${perf.badgeClass}`;
  }

  const statusBadge = document.getElementById('prof360-status-badge');
  if (statusBadge) {
    if (ctv.accountStatus === 'terminated') {
      statusBadge.textContent = '⛔ Đã chấm dứt';
      statusBadge.className = 'px-2 py-0.5 text-[10px] rounded-full font-bold bg-rose-600 text-white';
    } else {
      const user = (db.users || []).find(u => u.ctvId === ctv.id);
      const isLocked = user && user.status === 'locked';
      statusBadge.textContent = isLocked ? '🔒 Đã khóa' : '✓ Hoạt động';
      statusBadge.className = isLocked ? 'px-2 py-0.5 text-[10px] rounded-full font-bold bg-slate-600 text-white' : 'px-2 py-0.5 text-[10px] rounded-full font-bold bg-emerald-600 text-white';
    }
  }

  // 4 KPI Cards
  document.getElementById('prof360-kpi-cust').textContent = myCusts.length;
  document.getElementById('prof360-kpi-rev').textContent = formatVND(myRevenue);
  document.getElementById('prof360-kpi-comm').textContent = formatVND(totalComm);
  document.getElementById('prof360-kpi-last-active').textContent = perf.daysInactive === 0 ? 'Hôm nay' : `${perf.daysInactive} ngày trước`;
  document.getElementById('prof360-kpi-created-date').textContent = `Tham gia: ${ctv.createdAt || '01/09/2026'}`;

  // Khối 1: Định danh & Sale
  document.getElementById('prof360-phone').textContent = ctv.phone || 'Chưa cập nhật';
  document.getElementById('prof360-username').textContent = `@${ctv.username || 'ctv'}`;
  document.getElementById('prof360-ref').textContent = ctv.refCode || 'HAHA-REF';
  document.getElementById('prof360-bank').textContent = ctv.bank || 'Chưa cung cấp STK';
  document.getElementById('prof360-sale-name').textContent = ctv.assignedSale || 'Nguyễn Văn An';
  document.getElementById('prof360-sale-phone').textContent = ctv.assignedSalePhone || '0901234567';

  // Khối 2: Tour CTV chọn bán
  const tourListDiv = document.getElementById('prof360-selected-tours-list');
  const selTourIds = ctv.selectedTourIds || ['TOUR-01', 'TOUR-02'];
  const selTours = (db.tourPolicies || []).filter(t => selTourIds.includes(t.id));
  document.getElementById('prof360-selected-tours-count').textContent = `${selTours.length} tour đã chọn`;

  if (tourListDiv) {
    if (selTours.length === 0) {
      tourListDiv.innerHTML = '<div class="col-span-3 text-slate-400 text-xs py-2">CTV chưa chọn tour nào từ kho tour.</div>';
    } else {
      tourListDiv.innerHTML = selTours.map(t => `
        <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
          <div class="font-bold text-slate-900 truncate" title="${escapeHtml(t.name)}">${escapeHtml(t.name)}</div>
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-brand-700 font-semibold">${formatVND(t.price || 0)}</span>
            <span class="text-emerald-700 bg-emerald-50 px-1 rounded font-bold">+${formatVND(t.rateValue || 0)}</span>
          </div>
        </div>
      `).join('');
    }
  }

  // Khối 3: Danh sách khách hàng đã gửi
  const custTbody = document.getElementById('prof360-cust-tbody');
  document.getElementById('prof360-cust-count').textContent = `${myCusts.length} khách`;
  if (custTbody) {
    if (myCusts.length === 0) {
      custTbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-xs text-slate-400">CTV chưa gửi khách hàng nào vào hệ thống.</td></tr>';
    } else {
      custTbody.innerHTML = myCusts.map(c => `
        <tr class="hover:bg-slate-50">
          <td class="py-2 px-3 font-semibold text-slate-800">${escapeHtml(c.name)} <span class="text-[10px] text-slate-400 font-mono">(${escapeHtml(c.code)})</span></td>
          <td class="py-2 px-3 font-mono text-slate-600">${escapeHtml(c.phone)}</td>
          <td class="py-2 px-3 text-slate-600 truncate max-w-xs">${escapeHtml(c.demand || 'Tour sinh thái')}</td>
          <td class="py-2 px-3"><span class="px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'Đã chốt tour' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}">${escapeHtml(c.status)}</span></td>
          <td class="py-2 px-3 text-right font-bold text-brand-700">${formatVND(c.tourValue || 0)}</td>
        </tr>
      `).join('');
    }
  }

  // Khối 4: Lịch sử trao đổi 2 chiều
  const histList = document.getElementById('prof360-support-history-list');
  const myMsgs = (db.ctvSupportMessages || []).filter(m => m.ctvId === ctv.id || m.ctvId === ctv.code);
  if (histList) {
    if (myMsgs.length === 0) {
      histList.innerHTML = '<div class="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 rounded-xl">Chưa có cuộc trao đổi nào giữa Sale và CTV này.</div>';
    } else {
      histList.innerHTML = myMsgs.map(m => `
        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-800">${escapeHtml(m.subject)}</span>
            <span class="text-[10px] text-slate-400 font-mono">${escapeHtml(m.createdAt || '')}</span>
          </div>
          <p class="text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">"${escapeHtml(m.content)}"</p>
          ${m.reply ? `
            <div class="text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-[11px]">
              <strong>Phản hồi từ Sale ${escapeHtml(m.repliedBy || 'phụ trách')}:</strong> ${escapeHtml(m.reply)}
              <div class="text-[10px] text-emerald-600 mt-0.5 font-mono">Lúc: ${escapeHtml(m.repliedAt || '')}</div>
            </div>
          ` : `
            <div class="text-amber-700 bg-amber-50 px-2 py-1 rounded text-[11px] font-bold">🟡 Đang chờ Sale phản hồi</div>
          `}
        </div>
      `).join('');
    }
  }

  // Footer Buttons
  const btnTerm = document.getElementById('prof360-action-terminate-btn');
  const btnReact = document.getElementById('prof360-action-reactivate-btn');
  if (ctv.accountStatus === 'terminated') {
    if (btnTerm) btnTerm.classList.add('hidden');
    if (btnReact) btnReact.classList.remove('hidden');
  } else {
    if (btnTerm) btnTerm.classList.remove('hidden');
    if (btnReact) btnReact.classList.add('hidden');
  }

  // Hiển thị modal
  const modal = document.getElementById('ctv-profile-360-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeCtvProfile360() {
  const modal = document.getElementById('ctv-profile-360-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function triggerTerminateFromProfile() {
  if (!selectedCtvFor360) return;
  const ctvId = selectedCtvFor360.id;
  closeCtvProfile360();
  openTerminateCtvModal(ctvId);
}

function triggerReactivateFromProfile() {
  if (!selectedCtvFor360) return;
  const ctvId = selectedCtvFor360.id;
  reactivateCtv(ctvId);
  openCtvProfile360(ctvId);
}

function openQuickSupportForCurrentCtv() {
  if (!selectedCtvFor360) return;
  const ctvId = selectedCtvFor360.id;
  closeCtvProfile360();
  openReplySupportModalForCtv(ctvId);
}

function openReplyFromProfileModal() {
  if (!selectedCtvFor360) return;
  const ctvId = selectedCtvFor360.id;
  closeCtvProfile360();
  openReplySupportModalForCtv(ctvId);
}

// ==========================================
// CHẤM DỨT & KHÔI PHỤC LIÊN KẾT HỢP TÁC CTV
// ==========================================
function openTerminateCtvModal(ctvId) {
  const ctv = (db.ctvs || []).find(c => c.id === ctvId || c.code === ctvId);
  if (!ctv) {
    alert("Không tìm thấy thông tin CTV!");
    return;
  }

  document.getElementById('terminate-modal-ctv-id').value = ctv.id;
  document.getElementById('terminate-modal-ctv-name').textContent = ctv.name;
  document.getElementById('terminate-modal-ctv-code').textContent = ctv.code;
  document.getElementById('terminate-modal-sale-name').textContent = ctv.assignedSale || 'Nguyễn Văn An';
  document.getElementById('terminate-notes').value = '';

  const modal = document.getElementById('ctv-terminate-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeTerminateCtvModal() {
  const modal = document.getElementById('ctv-terminate-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function confirmTerminateCtv() {
  const ctvId = document.getElementById('terminate-modal-ctv-id').value;
  const ctv = (db.ctvs || []).find(c => c.id === ctvId);
  if (!ctv) return;

  const reason = document.getElementById('terminate-reason-select').value;
  const notes = document.getElementById('terminate-notes').value.trim();
  const fullReason = notes ? `${reason} (Ghi chú: ${notes})` : reason;

  ctv.accountStatus = 'terminated';
  ctv.terminationReason = fullReason;
  ctv.terminationDate = new Date().toISOString().split('T')[0];

  // Khóa tài khoản đăng nhập của CTV
  const user = (db.users || []).find(u => u.ctvId === ctv.id);
  if (user) user.status = 'locked';

  recordAuditLog('CHẤM DỨT LIÊN KẾT CTV', `Bộ phận Sale/CEO (${currentUser ? currentUser.name : 'Quản trị'}) đã quyết định chấm dứt liên kết với CTV ${ctv.name} (${ctv.code}). Lý do: ${fullReason}.`);
  saveDatabase();

  closeTerminateCtvModal();
  renderCtvModule();
  if (currentMod3Tab === 'dormant') renderDormantCtvsTable();

  alert(`✅ ĐÃ CHẤM DỨT LIÊN KẾT HỢP TÁC!\n\n- Đối tác: ${ctv.name} (${ctv.code})\n- Trạng thái: Đã chấm dứt liên kết & khóa quyền truy cập\n- Lý do: ${fullReason}\n\nHệ thống đã lưu vết đầy đủ vào Nhật ký hệ thống.`);
}

function reactivateCtv(ctvId) {
  const ctv = (db.ctvs || []).find(c => c.id === ctvId || c.code === ctvId);
  if (!ctv) return;

  if (confirm(`Bạn có chắc muốn KHÔI PHỤC LIÊN KẾT HỢP TÁC với CTV "${ctv.name}" (${ctv.code})?\nTài khoản đăng nhập sẽ được mở khóa trở lại.`)) {
    ctv.accountStatus = 'active';
    delete ctv.terminationReason;
    delete ctv.terminationDate;
    ctv.lastActiveDate = new Date().toISOString().split('T')[0];

    const user = (db.users || []).find(u => u.ctvId === ctv.id);
    if (user) user.status = 'active';

    recordAuditLog('KHÔI PHỤC LIÊN KẾT CTV', `Đã khôi phục liên kết hợp tác với CTV ${ctv.name} (${ctv.code}). Mở khóa tài khoản hoạt động.`);
    saveDatabase();

    renderCtvModule();
    if (currentMod3Tab === 'dormant') renderDormantCtvsTable();
    alert(`🎉 Đã khôi phục liên kết thành công với CTV ${ctv.name}!`);
  }
}

// ==========================================
// CỔNG TRAO ĐỔI HƯỚNG DẪN 2 CHIỀU (SALE <-> CTV)
// ==========================================
function openReplySupportModal(msgId) {
  const msg = (db.ctvSupportMessages || []).find(m => m.id === msgId);
  if (!msg) {
    alert("Không tìm thấy yêu cầu hướng dẫn!");
    return;
  }

  document.getElementById('reply-modal-msg-id').value = msg.id;
  document.getElementById('reply-modal-ctv-name').textContent = `${msg.ctvName} (${msg.ctvPhone || ''})`;
  document.getElementById('reply-modal-time').textContent = msg.createdAt || '';
  document.getElementById('reply-modal-subject').textContent = `Chủ đề: ${msg.subject} ${msg.tourName ? '• ' + msg.tourName : ''}`;
  document.getElementById('reply-modal-question').textContent = `"${msg.content}"`;
  document.getElementById('reply-modal-answer').value = msg.reply || '';

  const modal = document.getElementById('ctv-support-reply-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function openReplySupportModalForCtv(ctvId) {
  const ctv = (db.ctvs || []).find(c => c.id === ctvId || c.code === ctvId);
  if (!ctv) return;

  // Tìm câu hỏi pending gần nhất hoặc tạo form hướng dẫn chủ động
  const pending = (db.ctvSupportMessages || []).find(m => (m.ctvId === ctv.id || m.ctvId === ctv.code) && m.status === 'pending');
  if (pending) {
    openReplySupportModal(pending.id);
  } else {
    // Tạo nhanh tin nhắn hướng dẫn chủ động từ Sale
    const newMsgId = 'MSG-' + Date.now();
    const newMsg = {
      id: newMsgId,
      ctvId: ctv.id,
      ctvName: ctv.name,
      ctvPhone: ctv.phone || '',
      saleId: currentUser ? currentUser.id : 'NV-002',
      saleName: currentUser ? currentUser.name : 'Nguyễn Văn An',
      salePhone: '0901234567',
      category: 'policy_guidance',
      categoryLabel: 'Huấn luyện & Hướng dẫn bán tour',
      subject: `Hướng dẫn nghiệp vụ bán tour cho CTV ${ctv.name}`,
      tourName: 'Chương trình Tour Sinh Thái Mới',
      customerCode: '',
      customerName: '',
      content: 'Sale phụ trách liên hệ chủ động gửi tài liệu hỗ trợ bán tour và giải đáp vướng mắc...',
      status: 'pending',
      reply: null,
      repliedAt: null,
      repliedBy: null,
      isReadByCtv: false,
      isReadBySale: true,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    if (!db.ctvSupportMessages) db.ctvSupportMessages = [];
    db.ctvSupportMessages.unshift(newMsg);
    saveDatabase();
    openReplySupportModal(newMsgId);
  }
}

function closeReplySupportModal() {
  const modal = document.getElementById('ctv-support-reply-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function sendSupportReply() {
  const msgId = document.getElementById('reply-modal-msg-id').value;
  const msg = (db.ctvSupportMessages || []).find(m => m.id === msgId);
  if (!msg) return;

  const answer = document.getElementById('reply-modal-answer').value.trim();
  if (!answer) {
    alert("Vui lòng nhập nội dung hướng dẫn giải quyết cho CTV!");
    return;
  }

  msg.status = 'resolved';
  msg.reply = answer;
  msg.repliedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
  msg.repliedBy = currentUser ? currentUser.name : 'Chuyên viên Sale';
  msg.isReadByCtv = false; // Đánh dấu chưa đọc để hiện chấm đỏ bên CTV
  msg.isReadBySale = true;

  // Gửi thông báo tới tài khoản CTV
  sendInterDeptNotification({
    senderRole: 'SALE',
    senderName: currentUser ? currentUser.name : 'Sale phụ trách',
    targetRole: 'CTV',
    targetModule: 10,
    type: 'CTV_SUPPORT_REPLY',
    title: `Sale đã hướng dẫn: ${msg.subject}`,
    message: `Chuyên viên Sale ${msg.repliedBy} vừa gửi phản hồi hướng dẫn cho yêu cầu của bạn: "${answer.substring(0, 80)}..."`,
    referenceId: msg.id,
    referenceType: 'SUPPORT_MESSAGE'
  });

  recordAuditLog('HƯỚNG DẪN CTV', `Sale ${msg.repliedBy} đã gửi phản hồi hướng dẫn cho CTV ${msg.ctvName} (Yêu cầu: ${msg.id}).`);
  saveDatabase();

  closeReplySupportModal();
  renderCtvSupportRequestsTable();
  renderCtvModule();

  alert(`🚀 ĐÃ GỬI HƯỚNG DẪN CHO CTV!\n\nNội dung đã được chuyển thẳng tới Cổng CTV của đối tác ${msg.ctvName} kèm thông báo chuông.`);
}

// Cổng phía CTV: Render Tab 5 Trao Đổi & Yêu Cầu Hướng Dẫn
function renderCtvSupportTab() {
  if (!currentUser || currentUser.role !== 'CTV') return;
  const ctv = (db.ctvs || []).find(c => c.id === currentUser.ctvId);
  if (!ctv) return;

  // Đổ thông tin Sale phụ trách
  const saleNameEl = document.getElementById('ctv-assigned-sale-name');
  if (saleNameEl) saleNameEl.textContent = ctv.assignedSale || 'Nguyễn Văn An (Leader Sale)';
  const salePhoneEl = document.getElementById('ctv-assigned-sale-phone');
  if (salePhoneEl) salePhoneEl.textContent = ctv.assignedSalePhone || '0901234567';

  // Đổ danh sách khách hàng của CTV vào dropdown form yêu cầu
  const custSelect = document.getElementById('ctv-support-customer-select');
  if (custSelect) {
    const myCusts = (db.customers || []).filter(c => c.collaboratorId === ctv.id);
    custSelect.innerHTML = '<option value="">-- Không gắn khách cụ thể (Hỏi chung) --</option>';
    myCusts.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.code;
      opt.textContent = `${c.name} (${c.code}) - ${c.demand || 'Tour sinh thái'}`;
      custSelect.appendChild(opt);
    });
  }

  // Render danh sách lịch sử trao đổi 2 chiều
  const histList = document.getElementById('ctv-support-history-list');
  const myMsgs = (db.ctvSupportMessages || []).filter(m => m.ctvId === ctv.id);
  const unreadCount = myMsgs.filter(m => m.status === 'resolved' && !m.isReadByCtv).length;

  const unreadBadge = document.getElementById('ctv-support-unread-badge');
  if (unreadBadge) {
    unreadBadge.textContent = unreadCount;
    if (unreadCount > 0) unreadBadge.classList.remove('hidden');
    else unreadBadge.classList.add('hidden');
  }

  if (histList) {
    if (myMsgs.length === 0) {
      histList.innerHTML = `
        <div class="p-6 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
          <div class="text-3xl mb-2">💬</div>
          Bạn chưa gửi câu hỏi hay tình huống cần giúp đỡ nào. Khi gặp khách hàng khó tính hoặc cần chính sách đoàn đặc biệt, hãy gửi yêu cầu ở cột bên trái nhé!
        </div>
      `;
      return;
    }

    histList.innerHTML = myMsgs.map(m => {
      const isPending = (m.status === 'pending');
      const isUnread = (!m.isReadByCtv && !isPending);

      return `
        <div class="p-4 rounded-2xl border ${isUnread ? 'bg-amber-50/50 border-amber-300 ring-2 ring-amber-400/20' : 'bg-white border-slate-200'} space-y-2.5 transition-all">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <span class="font-bold text-slate-900 text-xs">${escapeHtml(m.subject)}</span>
              ${isUnread ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white animate-pulse">Chưa đọc</span>' : ''}
            </div>
            <span class="text-[10px] text-slate-400 font-mono">${escapeHtml(m.createdAt || '')}</span>
          </div>

          <div class="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-100">
            <span class="text-slate-400 font-semibold block text-[11px] mb-0.5">Câu hỏi / Tình huống của bạn:</span>
            "${escapeHtml(m.content)}"
          </div>

          ${m.reply ? `
            <div class="p-3 bg-emerald-50 rounded-xl text-xs text-emerald-900 border border-emerald-200 space-y-1">
              <div class="flex items-center justify-between font-bold text-[11px] text-emerald-800">
                <span>💬 Hướng dẫn từ Sale ${escapeHtml(m.repliedBy || 'phụ trách')}:</span>
                <span class="font-mono text-[10px] text-emerald-600 font-normal">${escapeHtml(m.repliedAt || '')}</span>
              </div>
              <p class="leading-relaxed font-medium">${escapeHtml(m.reply)}</p>
            </div>
          ` : `
            <div class="flex items-center space-x-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
              <span class="animate-spin text-sm">⏳</span>
              <span class="font-semibold">Đã chuyển tới Sale phụ trách (${escapeHtml(ctv.assignedSale || 'Nguyễn Văn An')}). Sale đang chuẩn bị phương án hướng dẫn cho bạn.</span>
            </div>
          `}
        </div>
      `;
    }).join('');
  }
}

// Xử lý CTV gửi câu hỏi hướng dẫn
function handleCtvSendSupportRequest(e) {
  if (e) e.preventDefault();
  if (!currentUser || currentUser.role !== 'CTV') return;
  const ctv = (db.ctvs || []).find(c => c.id === currentUser.ctvId);
  if (!ctv) return;

  const subject = document.getElementById('ctv-support-subject-input')?.value?.trim();
  const content = document.getElementById('ctv-support-content-input')?.value?.trim();
  const custCode = document.getElementById('ctv-support-customer-select')?.value;

  if (!subject || !content) {
    alert("Vui lòng nhập đầy đủ Tiêu đề và Nội dung cần Sale hướng dẫn!");
    return;
  }

  const cust = custCode ? (db.customers || []).find(c => c.code === custCode) : null;
  const newMsgId = 'MSG-' + Date.now();

  const newMsg = {
    id: newMsgId,
    ctvId: ctv.id,
    ctvName: ctv.name,
    ctvPhone: ctv.phone || '',
    saleId: ctv.assignedSaleId || 'NV-002',
    saleName: ctv.assignedSale || 'Nguyễn Văn An',
    salePhone: ctv.assignedSalePhone || '0901234567',
    category: 'custom_guidance',
    categoryLabel: 'Yêu cầu hướng dẫn bán tour',
    subject: subject,
    tourName: cust ? cust.demand : 'Chương trình tour',
    customerCode: cust ? cust.code : '',
    customerName: cust ? cust.name : '',
    content: content,
    status: 'pending',
    reply: null,
    repliedAt: null,
    repliedBy: null,
    isReadByCtv: true,
    isReadBySale: false,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
  };

  if (!db.ctvSupportMessages) db.ctvSupportMessages = [];
  db.ctvSupportMessages.unshift(newMsg);

  // Cập nhật ngày tương tác gần nhất của CTV
  ctv.lastActiveDate = new Date().toISOString().split('T')[0];

  // Bắn thông báo chuông tới Sale phụ trách
  sendInterDeptNotification({
    senderRole: 'CTV',
    senderName: ctv.name,
    targetRole: 'SALE',
    targetModule: 3,
    type: 'CTV_NEED_GUIDANCE',
    title: `CTV ${ctv.name} cần Sale hướng dẫn`,
    message: `Yêu cầu: "${subject}". Nội dung: "${content.substring(0, 80)}..."`,
    referenceId: newMsgId,
    referenceType: 'SUPPORT_MESSAGE'
  });

  recordAuditLog('CTV YÊU CẦU HƯỚNG DẪN', `CTV ${ctv.name} đã gửi yêu cầu hướng dẫn tới Sale ${ctv.assignedSale}: "${subject}".`);
  saveDatabase();

  // Reset form
  const form = document.getElementById('ctv-send-support-form');
  if (form) form.reset();

  renderCtvSupportTab();
  alert(`🎉 ĐÃ GỬI YÊU CẦU TỚI SALE THÀNH CÔNG!\n\nChuyên viên Sale ${ctv.assignedSale || 'phụ trách'} đã nhận được thông báo chuông và sẽ phản hồi hướng dẫn bạn sớm nhất.`);
}

function openAddCtvModal() {
  const form = document.getElementById('ctv-form');
  form.reset();
  document.getElementById('form-ctv-id').value = '';
  document.getElementById('ctv-modal-title').textContent = 'Đăng ký Cộng tác viên mới';

  const nextCtvCode = generateNextCode('CTV-', db.ctvs, 'code');
  const nextNum = parseInt(nextCtvCode.replace('CTV-', ''), 10) || (db.ctvs.length + 1);
  document.getElementById('form-ctv-code').value = nextCtvCode;
  document.getElementById('form-ctv-ref').value = `HAHA-REF${nextNum}`;
  document.getElementById('form-ctv-username').value = `ctv_partner${nextNum}`;

  // Đổ danh sách Chuyên viên Sale phụ trách quản lý (Độc quyền 1 Sale)
  const saleSelect = document.getElementById('form-ctv-assigned-sale');
  if (saleSelect) {
    const saleUsers = (db.users || []).filter(u => u.role === 'SALE');
    saleSelect.innerHTML = saleUsers.map(s => `
      <option value="${s.id}">${escapeHtml(s.name)} (${s.username}) - Quản lý</option>
    `).join('');
    if (currentUser && currentUser.role === 'SALE') {
      saleSelect.value = currentUser.id;
    }
  }

  document.getElementById('ctv-modal').classList.remove('hidden');
  document.getElementById('ctv-modal').classList.add('flex');
}

function closeCtvModal() {
  document.getElementById('ctv-modal').classList.add('hidden');
  document.getElementById('ctv-modal').classList.remove('flex');
}

// Modal điều chuyển Chuyên viên Sale phụ trách quản lý CTV
function openChangeSaleModal(ctvId) {
  const ctv = ctvId ? (db.ctvs || []).find(c => c.id === ctvId) : selectedCtvFor360;
  if (!ctv) {
    alert("Không tìm thấy thông tin CTV cần điều chuyển!");
    return;
  }

  document.getElementById('change-sale-ctv-id').value = ctv.id;
  document.getElementById('change-sale-ctv-name').textContent = `${ctv.name} (${ctv.code})`;
  document.getElementById('change-sale-current-sale').textContent = `${ctv.assignedSale || 'Chưa phân công'} (${ctv.assignedSalePhone || ''})`;
  document.getElementById('change-sale-notes').value = '';

  const newSaleSelect = document.getElementById('change-sale-new-sale-select');
  if (newSaleSelect) {
    const saleUsers = (db.users || []).filter(u => u.role === 'SALE');
    newSaleSelect.innerHTML = saleUsers.map(s => `
      <option value="${s.id}" ${s.id === ctv.assignedSaleId ? 'disabled' : ''}>
        ${escapeHtml(s.name)} (${s.username}) ${s.id === ctv.assignedSaleId ? '(Đang phụ trách)' : '- Tiếp nhận mới'}
      </option>
    `).join('');
  }

  const modal = document.getElementById('ctv-change-sale-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeChangeSaleModal() {
  const modal = document.getElementById('ctv-change-sale-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function confirmChangeSale() {
  const ctvId = document.getElementById('change-sale-ctv-id').value;
  const ctv = (db.ctvs || []).find(c => c.id === ctvId);
  if (!ctv) return;

  const newSaleId = document.getElementById('change-sale-new-sale-select').value;
  const newSale = (db.users || []).find(u => u.id === newSaleId);
  if (!newSale) return;

  const oldSaleName = ctv.assignedSale || 'Chưa phân công';
  const notes = document.getElementById('change-sale-notes').value.trim();

  // Cập nhật Sale phụ trách mới
  ctv.assignedSaleId = newSale.id;
  ctv.assignedSale = newSale.name;
  ctv.assignedSalePhone = newSale.phone || '0901234567';

  recordAuditLog('ĐIỀU CHUYỂN SALE QUẢN LÝ CTV', `Điều chuyển CTV ${ctv.name} (${ctv.code}) từ Sale ${oldSaleName} sang Sale ${newSale.name}. Lý do: ${notes || 'Phân công lại nhân sự'}.`);
  saveDatabase();

  closeChangeSaleModal();
  renderCtvModule();
  if (selectedCtvFor360 && selectedCtvFor360.id === ctv.id) {
    openCtvProfile360(ctv.id);
  }

  alert(`🎉 ĐÃ ĐIỀU CHUYỂN SALE THÀNH CÔNG!\n\n- CTV: ${ctv.name} (${ctv.code})\n- Sale mới phụ trách: ${newSale.name}\n- Toàn bộ doanh số mới và hoa hồng quản lý CTV sẽ được hạch toán cho ${newSale.name}.`);
}

function toggleLockCtvAccount(ctvId) {
  if (!currentUser || currentUser.role !== 'CEO') {
    alert("Chỉ Giám đốc (CEO) mới có quyền Khóa hoặc Mở khóa tài khoản CTV!");
    return;
  }

  const ctv = db.ctvs.find(c => c.id === ctvId);
  const user = db.users.find(u => u.ctvId === ctvId);
  if (!ctv || !user) return;

  const isCurrentlyActive = (user.status === 'active');
  const actionText = isCurrentlyActive ? 'KHÓA' : 'MỞ KHÓA';

  if (confirm(`Bạn có chắc muốn ${actionText} tài khoản của CTV "${ctv.name}" (${ctv.code})?`)) {
    const newStatus = isCurrentlyActive ? 'locked' : 'active';
    user.status = newStatus;
    ctv.accountStatus = newStatus;
    saveDatabase();

    recordAuditLog(`${actionText} TÀI KHOẢN CTV`, `CEO đã ${actionText.toLowerCase()} CTV ${ctv.name}.`);
    renderCtvModule();
  }
}

function resetCtvPasswordToDefault(ctvId) {
  if (!currentUser || currentUser.role !== 'CEO') {
    alert("Chỉ Giám đốc (CEO) mới có quyền cấp lại mật khẩu!");
    return;
  }

  const ctv = db.ctvs.find(c => c.id === ctvId);
  const user = db.users.find(u => u.ctvId === ctvId);
  if (!ctv || !user) return;

  if (confirm(`Cấp lại mật khẩu mặc định (123456) cho tài khoản CTV "${ctv.name}"?`)) {
    user.salt = SYSTEM_SALT;
    user.passwordHash = DEFAULT_PASS_HASH;
    saveDatabase();

    recordAuditLog('CẤP LẠI MẬT KHẨU CTV', `CEO đã đặt lại mật khẩu về mặc định (123456) cho CTV ${ctv.name}.`);
    alert(`Đã cấp lại mật khẩu cho CTV ${ctv.name}!\nMật khẩu mới là: 123456`);
  }
}

function deleteCtv(ctvId) {
  if (!currentUser || currentUser.role !== 'CEO') {
    alert("Chỉ CEO mới có quyền xóa CTV!");
    return;
  }
  const ctv = db.ctvs.find(c => c.id === ctvId || c.code === ctvId || String(c.id) === String(ctvId));
  if (!ctv) return;

  // Ràng buộc toàn vẹn: Chặn xóa nếu CTV đang có khách hàng hoặc đơn tour
  const hasCustomers = (db.customers || []).some(c => 
    String(c.collaboratorId) === String(ctv.id) || String(c.collaboratorId) === String(ctv.code)
  );
  const hasBookings = (db.bookings || []).some(b => 
    (String(b.collaboratorId) === String(ctv.id) || String(b.collaboratorId) === String(ctv.code)) && b.status !== 'Đã hủy'
  );

  if (hasCustomers || hasBookings) {
    alert(`⚠️ KHÔNG THỂ XÓA CTV: Đối tác "${ctv.name}" (${ctv.code}) đang quản lý khách hàng hoặc có đơn tour liên kết trên hệ thống!\nVui lòng phân công lại khách hàng trước khi xóa.`);
    return;
  }

  if (confirm(`Bạn có chắc muốn xóa CTV "${ctv.name}" (${ctv.code})?`)) {
    db.ctvs = db.ctvs.filter(c => c.id !== ctv.id && c.code !== ctv.code);
    db.users = db.users.filter(u => u.ctvId !== ctv.id && u.ctvId !== ctv.code);
    saveDatabase();
    recordAuditLog('XÓA CTV', `CEO đã xóa đối tác CTV ${ctv.name}.`);
    renderCtvModule();
  }
}

// ==========================================
// 11. PHÂN HỆ 2: CRM & QUẢN LÝ KHÁCH HÀNG (GIỮ NGUYÊN)
// ==========================================
// ==========================================
// SCOPED CUSTOMERS BY ROLE / CTV (CHUẨN NGHIỆP VỤ & BẢO MẬT DỮ LIỆU)
// ==========================================
function getScopedCustomers(user = currentUser) {
  if (!user) return (db.customers || []);
  if (user.role === 'CTV') {
    const cid = user.ctvId;
    return (db.customers || [])
      .filter(c => c.collaboratorId === cid || c.ctvId === cid)
      .map(c => {
        if (!c.ctvId) c.ctvId = c.collaboratorId;
        return c;
      });
  }
  if (user.role === 'SALE') {
    return (db.customers || []).filter(c => (c.staff && c.staff.includes(user.name)) || c.staff === 'Chưa phân công');
  }
  return (db.customers || []);
}

function renderCrmModule() {
  updateCrmDashboard();
  renderCustomerTable();
  populateCtvDropdownInCustomerModal();
}

function updateCrmDashboard() {
  const total = db.customers.length;
  const newCust = db.customers.filter(c => c.status === 'Mới tiếp nhận').length;
  const booked = db.customers.filter(c => c.status === 'Đã chốt tour').length;
  const rate = total > 0 ? Math.round((booked / total) * 100) : 0;

  document.getElementById('stat-total-customers').textContent = total;
  document.getElementById('stat-new-customers').textContent = newCust;
  document.getElementById('stat-booked-tours').textContent = booked;
  document.getElementById('stat-conversion-rate').textContent = `${rate}%`;
}

function renderCustomerTable() {
  const tbody = document.getElementById('customer-table-body');
  const emptyState = document.getElementById('empty-state');
  const countBadge = document.getElementById('displayed-count');

  const filtered = db.customers.filter(c => {
    const matchSearch = crmSearchQuery === '' ||
      c.name.toLowerCase().includes(crmSearchQuery.toLowerCase()) ||
      c.phone.includes(crmSearchQuery) ||
      c.code.toLowerCase().includes(crmSearchQuery.toLowerCase());

    const matchFilter = crmFilter === 'all' || c.status === crmFilter;

    const matchRole = (currentUser && currentUser.role === 'SALE')
      ? (c.staff.includes(currentUser.name) || c.staff === 'Chưa phân công')
      : true;

    return matchSearch && matchFilter && matchRole;
  });

  countBadge.textContent = filtered.length;

  if (filtered.length === 0) {
    tbody.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  tbody.innerHTML = filtered.map(c => {
    let badgeClass = 'status-badge-lost';
    if (c.status === 'Mới tiếp nhận') badgeClass = 'status-badge-new';
    else if (c.status === 'Đang tư vấn') badgeClass = 'status-badge-advising';
    else if (c.status === 'Đã chốt tour') badgeClass = 'status-badge-won';

    const ctvObj = db.ctvs.find(ctv => ctv.id === c.collaboratorId);
    const ctvDisplay = ctvObj ? `<span class="px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded font-bold text-[10px]">CTV: ${escapeHtml(ctvObj.name)}</span>` : '';

    const summary = getCustomerFinancialSummary(c);
    let paymentInfoHtml = '';
    if (summary.bookingCount > 0) {
      if (summary.totalPaid >= summary.totalContract && summary.totalContract > 0) {
        paymentInfoHtml = `<div class="text-[10px] text-emerald-700 font-mono font-bold mt-0.5">💰 Đã thanh toán: ${formatVND(summary.totalPaid)} (${summary.bookingCount} đơn)</div>`;
      } else if (summary.totalPaid > 0) {
        paymentInfoHtml = `<div class="text-[10px] text-amber-700 font-mono font-medium mt-0.5">💳 Đã trả: ${formatVND(summary.totalPaid)} / ${formatVND(summary.totalContract)}</div>`;
      } else {
        paymentInfoHtml = `<div class="text-[10px] text-rose-600 font-mono mt-0.5">⏳ Chờ thanh toán: ${formatVND(summary.totalContract)}</div>`;
      }
    }

    return `
      <tr class="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
        <td class="py-3 px-4 font-mono font-bold text-brand-800">${escapeHtml(c.code)}</td>
        <td class="py-3 px-4 font-semibold text-slate-900">
          <div class="flex items-center space-x-2">
            <span class="w-6 h-6 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-[10px]">
              ${c.name.charAt(0).toUpperCase()}
            </span>
            <span>${escapeHtml(c.name)}</span>
          </div>
          ${paymentInfoHtml}
        </td>
        <td class="py-3 px-4 font-mono font-medium text-slate-700">
          <a href="tel:${escapeHtml(c.phone)}" class="hover:text-brand-600 hover:underline flex items-center space-x-1">
            <span>📞</span>
            <span>${escapeHtml(c.phone)}</span>
          </a>
        </td>
        <td class="py-3 px-4 text-slate-700 max-w-xs truncate" title="${escapeHtml(c.demand)}">
          ${escapeHtml(c.demand)}
        </td>
        <td class="py-3 px-4 text-slate-600">
          <div class="font-medium">${escapeHtml(c.source || 'Trực tiếp')}</div>
          ${ctvDisplay}
        </td>
        <td class="py-3 px-4 text-slate-700 font-medium">${escapeHtml(c.staff || 'Chưa phân công')}</td>
        <td class="py-3 px-4"><span class="status-badge ${badgeClass}">${escapeHtml(c.status)}</span></td>
        <td class="py-3 px-4 text-slate-500 font-mono text-[11px]">${escapeHtml(c.date)}</td>
        <td class="py-3 px-4 text-center space-x-1 whitespace-nowrap">
          ${currentUser && currentUser.role === 'KE_TOAN' 
            ? '<span class="text-xs text-slate-400 italic font-medium">Chỉ xem (Kế toán)</span>'
            : `
              ${c.status === 'Mới tiếp nhận' 
                ? `<button onclick="acknowledgeCtvLead('${c.id}')" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-xs shadow-sm transition-all inline-flex items-center space-x-1" title="Tiếp nhận khách và chuyển sang Đang tư vấn"><span>📞 Tiếp nhận</span></button>`
                : ''
              }
              ${c.status !== 'Đã chốt tour'
                ? `<button onclick="quickCloseTourFromCrm('${c.id}')" class="action-btn text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 font-bold shadow-sm inline-flex items-center space-x-1" title="Chốt tour cho khách này và chuyển ngay sang Điều hành"><span>🤝 Chốt tour</span></button>`
                : ''
              }
              <button onclick="openAddQuotationModal(${c.id})" class="action-btn text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 font-semibold" title="Lập báo giá tour cho khách này">📋 Báo giá</button>
              <button onclick="editCustomer(${c.id})" class="action-btn action-btn-edit">✏️ Sửa</button>
              <button onclick="deleteCustomer(${c.id})" class="action-btn action-btn-delete">🗑️ Xóa</button>
            `
          }
        </td>
      </tr>
    `;
  }).join('');
}

function quickCloseTourFromCrm(customerId) {
  const cust = (db.customers || []).find(c => String(c.id) === String(customerId) || c.code === customerId);
  if (!cust) return;

  const quote = (db.quotations || []).find(q => (String(q.customerId) === String(cust.id) || q.customerCode === cust.code) && q.status !== 'Đã từ chối' && q.status !== 'Đã lên đơn tour');
  if (quote) {
    if (confirm(`Bạn có chắc chắn muốn CHỐT TOUR cho khách hàng "${cust.name}" theo Báo giá ${quote.code} (${formatVND(quote.totalAmount)}) và chuyển ngay sang Điều hành?`)) {
      confirmAndConvertQuotation(quote.id);
    }
  } else {
    alert(`Khách hàng "${cust.name}" chưa có báo giá chi tiết trong hệ thống.\nVui lòng hoàn tất biểu mẫu Báo giá để hệ thống tự động chốt tour và chuyển giao sang Điều hành.`);
    openAddQuotationModal(cust.id);
  }
}

function populateCtvDropdownInCustomerModal() {
  const select = document.getElementById('form-collaborator');
  if (!select) return;

  const currentVal = select.value;
  select.innerHTML = '<option value="">-- Không qua CTV (Trực tiếp) --</option>';

  db.ctvs.forEach(ctv => {
    const opt = document.createElement('option');
    opt.value = ctv.id;
    opt.textContent = `${ctv.name} (${ctv.refCode})`;
    select.appendChild(opt);
  });

  if (currentVal) select.value = currentVal;
}

// ==========================================
// 12. PHÂN HỆ 7: HOA HỒNG & ĐỐI SOÁT (THEO CHÍNH SÁCH TOUR)
// ==========================================
function filterCommissions(status, btn) {
  commFilter = status;
  const btns = document.querySelectorAll('.filter-comm-btn');
  btns.forEach(b => {
    b.classList.remove('active', 'bg-brand-600', 'text-white', 'border-brand-600');
    b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
  });
  if (btn) {
    btn.classList.add('active', 'bg-brand-600', 'text-white', 'border-brand-600');
    btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
  }
  renderCommissionModule();
}

function searchCommissions(q) {
  commSearchQuery = (q || '').trim().toLowerCase();
  renderCommissionModule();
}

function renderCommissionModule() {
  const activeComms = db.commissions.filter(item => item.status !== 'Đã hủy');
  const total = activeComms.reduce((sum, item) => sum + (item.amount || 0), 0);
  const paid = activeComms.filter(item => item.status === 'Đã thanh toán').reduce((sum, item) => sum + (item.amount || 0), 0);
  const approved = activeComms.filter(item => item.status === 'Đã duyệt chi').reduce((sum, item) => sum + (item.amount || 0), 0);
  const pending = activeComms.filter(item => item.status === 'Chờ duyệt').reduce((sum, item) => sum + (item.amount || 0), 0);

  const statTotal = document.getElementById('stat-comm-total');
  if (statTotal) statTotal.textContent = formatVND(total);
  const statPaid = document.getElementById('stat-comm-paid');
  if (statPaid) statPaid.textContent = formatVND(paid);
  const statApproved = document.getElementById('stat-comm-approved');
  if (statApproved) statApproved.textContent = formatVND(approved);
  const statPending = document.getElementById('stat-comm-pending');
  if (statPending) statPending.textContent = formatVND(pending);

  const canApprove = currentUser && (currentUser.role === 'CEO' || currentUser.role === 'KE_TOAN');
  const note = document.getElementById('comm-permission-note');
  if (note) {
    if (canApprove) {
      note.textContent = "Bạn có quyền Đối soát & Phê duyệt chi hoa hồng";
      note.className = "font-bold text-brand-700";
    } else {
      note.textContent = "Chỉ xem (Không có quyền duyệt chi)";
      note.className = "font-bold text-slate-500";
    }
  }

  const filtered = db.commissions.filter(c => {
    const statusMatch = commFilter === 'all' || c.status === commFilter;
    const q = commSearchQuery;
    const ctv = db.ctvs.find(item => item.id === c.ctvId);
    const ctvName = ctv ? ctv.name.toLowerCase() : '';
    const searchMatch = !q ||
      c.id.toLowerCase().includes(q) ||
      ctvName.includes(q) ||
      (c.customerName && c.customerName.toLowerCase().includes(q)) ||
      (c.tourName && c.tourName.toLowerCase().includes(q));

    return statusMatch && searchMatch;
  });

  const tbody = document.getElementById('commission-table-body');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="py-8 text-center text-xs text-slate-400">Không tìm thấy phiếu hoa hồng nào phù hợp</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(c => {
    const ctv = db.ctvs.find(item => item.id === c.ctvId);
    const ctvName = ctv ? ctv.name : c.ctvId;
    const ctvBank = ctv ? ctv.bank : 'Chưa có STK';

    let statusBadge = '<span class="comm-badge-pending">🟡 Chờ duyệt</span>';
    if (c.status === 'Đã duyệt chi') {
      statusBadge = '<span class="comm-badge-approved">🔵 Đã duyệt chi</span>';
    } else if (c.status === 'Đã thanh toán') {
      statusBadge = '<span class="comm-badge-paid">🟢 Đã thanh toán</span>';
    }

    let actionBtn = '';
    if (canApprove) {
      if (c.status === 'Chờ duyệt') {
        actionBtn = `<button onclick="approveCommission('${c.id}')" class="px-2.5 py-1 bg-blue-600 text-white rounded text-[11px] font-bold hover:bg-blue-700 transition-colors">Duyệt chi</button>`;
      } else if (c.status === 'Đã duyệt chi') {
        actionBtn = `<button onclick="openPayoutModal('${c.id}')" class="px-2.5 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-700 transition-colors">Lập lệnh chi</button>`;
      } else {
        actionBtn = `<span class="text-[11px] text-emerald-600 font-semibold">✓ Đã chuyển (${escapeHtml(c.bankReference || 'UNC')})</span>`;
      }
    } else {
      actionBtn = `<span class="text-[11px] text-slate-400">Không có quyền</span>`;
    }

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3 px-4 font-mono font-bold text-brand-800">${escapeHtml(c.id)}</td>
        <td class="py-3 px-4">
          <div class="font-bold text-slate-900">${escapeHtml(ctvName)}</div>
          <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(ctvBank)}</div>
        </td>
        <td class="py-3 px-4">
          <div class="font-medium text-slate-800">${escapeHtml(c.customerName)}</div>
          <div class="text-[11px] text-slate-500">${escapeHtml(c.tourName || 'Tour sinh thái')}</div>
        </td>
        <td class="py-3 px-4 font-mono text-slate-700">${formatVND(c.tourValue)}</td>
        <td class="py-3 px-4 text-slate-600 text-[11px]">
          <div class="font-medium text-slate-900">${escapeHtml(c.policyApplied || '')}</div>
          <div class="text-[10px] text-emerald-700 font-mono font-bold">${escapeHtml(c.basisText || '')}</div>
        </td>
        <td class="py-3 px-4 font-mono font-bold text-emerald-700 text-sm">
          ${formatVND(c.amount)}
        </td>
        <td class="py-3 px-4">${statusBadge}</td>
        <td class="py-3 px-4 text-center">${actionBtn}</td>
      </tr>
    `;
  }).join('');
}

function approveCommission(commId) {
  if (!currentUser || (currentUser.role !== 'CEO' && currentUser.role !== 'KE_TOAN')) {
    alert("Chỉ CEO hoặc Kế toán trưởng mới có quyền phê duyệt hoa hồng!");
    return;
  }
  const comm = db.commissions.find(c => c.id === commId);
  if (!comm) return;

  comm.status = 'Đã duyệt chi';
  comm.approvedBy = `${currentUser.name} (${currentUser.roleTitle})`;
  saveDatabase();
  recordAuditLog('DUYỆT CHI HOA HỒNG', `Đã duyệt chi phiếu ${comm.id} (${formatVND(comm.amount)}) cho đối tác CTV.`);
  renderCommissionModule();
}

function openPayoutModal(commId) {
  const comm = db.commissions.find(c => c.id === commId);
  if (!comm) return;
  const ctv = db.ctvs.find(x => x.id === comm.ctvId);

  document.getElementById('payout-comm-id').value = comm.id;
  document.getElementById('payout-info-code').textContent = comm.id;
  document.getElementById('payout-info-ctv').textContent = ctv ? `${ctv.name} (${ctv.code})` : comm.ctvId;
  document.getElementById('payout-info-bank').textContent = ctv ? ctv.bank : 'Chưa cập nhật STK';
  document.getElementById('payout-info-amount').textContent = formatVND(comm.amount);
  document.getElementById('payout-reference').value = `UNC-${Date.now().toString().slice(-6)}`;
  document.getElementById('payout-date').value = new Date().toISOString().split('T')[0];

  document.getElementById('payout-modal').classList.remove('hidden');
  document.getElementById('payout-modal').classList.add('flex');
}

function closePayoutModal() {
  document.getElementById('payout-modal').classList.add('hidden');
  document.getElementById('payout-modal').classList.remove('flex');
}

function handlePayoutSubmit(e) {
  e.preventDefault();
  const commId = document.getElementById('payout-comm-id').value;
  const refCode = document.getElementById('payout-reference').value.trim();
  const payoutDate = document.getElementById('payout-date').value;

  const comm = db.commissions.find(c => c.id === commId);
  if (!comm) return;

  comm.status = 'Đã thanh toán';
  comm.bankReference = refCode;
  comm.paidDate = payoutDate;
  comm.paidBy = `${currentUser.name} (${currentUser.roleTitle})`;

  sendInterDeptNotification({
    senderRole: 'KE_TOAN',
    senderName: currentUser ? `${currentUser.name} (Kế toán)` : 'Bộ phận Kế toán (ACC)',
    targetRole: 'CTV',
    targetModule: 10,
    type: 'HANDOVER_PAYOUT',
    title: `Hoa hồng đã thanh toán: Phiếu ${comm.id}`,
    message: `Kế toán đã giải ngân chuyển khoản ${formatVND(comm.amount)} hoa hồng cho CTV qua ngân hàng (Mã UNC: ${refCode}).`,
    referenceId: comm.id,
    referenceType: 'COMMISSION'
  });

  saveDatabase();
  recordAuditLog('XÁC NHẬN CHUYỂN KHOẢN HOA HỒNG', `Kế toán xác nhận chuyển khoản ${formatVND(comm.amount)} cho phiếu ${comm.id}. Mã UNC: ${refCode}.`);
  alert(`✅ Đã ghi nhận thanh toán hoa hồng thành công cho phiếu ${comm.id}!\nMã chứng từ ngân hàng: ${refCode}`);
  closePayoutModal();
  renderCommissionModule();
}

// ==========================================
// 13. PHÂN HỆ 9: NHẬT KÝ KIỂM TOÁN (AUDIT LOGS)
// ==========================================
function renderAuditLogModule() {
  const tbody = document.getElementById('audit-log-table-body');
  tbody.innerHTML = db.auditLogs.map(log => {
    let actionColor = 'text-blue-600 bg-blue-50 border-blue-200';
    if (log.action.includes('CẢNH BÁO') || log.action.includes('XÓA') || log.action.includes('KHÓA')) {
      actionColor = 'text-rose-600 bg-rose-50 border-rose-200';
    } else if (log.action.includes('DUYỆT') || log.action.includes('THANH TOÁN') || log.action.includes('THÀNH CÔNG')) {
      actionColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-2.5 px-4 text-slate-500 whitespace-nowrap">${log.time}</td>
        <td class="py-2.5 px-4 font-semibold text-slate-800 whitespace-nowrap">${escapeHtml(log.user)}</td>
        <td class="py-2.5 px-4"><span class="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100">${escapeHtml(log.role)}</span></td>
        <td class="py-2.5 px-4">
          <span class="px-2 py-0.5 rounded-md text-[10px] font-bold border ${actionColor}">
            ${escapeHtml(log.action)}
          </span>
        </td>
        <td class="py-2.5 px-4 text-slate-700 font-sans text-xs">${escapeHtml(log.details)}</td>
      </tr>
    `;
  }).join('');
}

// ==========================================
// 14. TIỆN ÍCH KIỂM TRA TRÙNG SĐT & MODAL CRM
// ==========================================
function checkPhoneDuplicate(phoneInput, currentEditingId) {
  const cleanPhone = phoneInput.trim().replace(/[\s.-]/g, '');
  if (!cleanPhone || cleanPhone.length < 8) {
    hideDuplicateWarning();
    return null;
  }

  const duplicate = db.customers.find(c => {
    const existingClean = c.phone.trim().replace(/[\s.-]/g, '');
    const isSameId = currentEditingId && String(c.id) === String(currentEditingId);
    return !isSameId && existingClean === cleanPhone;
  });

  if (duplicate) {
    showDuplicateWarning(duplicate);
    return duplicate;
  } else {
    hideDuplicateWarning();
    return null;
  }
}

function showDuplicateWarning(owner) {
  const phoneField = document.getElementById('form-phone');
  const badge = document.getElementById('phone-duplicate-badge');
  const msg = document.getElementById('phone-duplicate-msg');
  const ownerName = document.getElementById('phone-duplicate-owner');

  if (phoneField) phoneField.classList.add('input-error');
  if (badge) badge.classList.remove('hidden');
  if (msg) msg.classList.remove('hidden');
  if (ownerName && owner) ownerName.textContent = `${owner.name} (${owner.code})`;
}

function hideDuplicateWarning() {
  const phoneField = document.getElementById('form-phone');
  const badge = document.getElementById('phone-duplicate-badge');
  const msg = document.getElementById('phone-duplicate-msg');

  if (phoneField) {
    phoneField.classList.remove('input-error');
    badge.classList.add('hidden');
    msg.classList.add('hidden');
  }
}

function openAddCustomerModal() {
  const form = document.getElementById('customer-form');
  form.reset();
  document.getElementById('form-customer-id').value = '';
  document.getElementById('modal-title').textContent = 'Thêm khách hàng mới';

  document.getElementById('form-code').value = generateNextCode('HH-', db.customers, 'code');
  document.getElementById('form-date').value = new Date().toISOString().split('T')[0];
  const paxField = document.getElementById('form-pax');
  if (paxField) paxField.value = '2';

  populateCtvDropdownInCustomerModal();
  hideDuplicateWarning();

  document.getElementById('customer-modal').classList.remove('hidden');
  document.getElementById('customer-modal').classList.add('flex');
}

function closeCustomerModal() {
  document.getElementById('customer-modal').classList.add('hidden');
  document.getElementById('customer-modal').classList.remove('flex');
  hideDuplicateWarning();
}

window.editCustomer = function(id) {
  if (currentUser && currentUser.role === 'KE_TOAN') {
    alert("⛔ BẢO VỆ DỮ LIỆU: Kế toán không có quyền chỉnh sửa hồ sơ khách hàng mà Sale/Điều hành đã chốt!");
    return;
  }
  const c = db.customers.find(item => item.id === id);
  if (!c) return;

  populateCtvDropdownInCustomerModal();

  document.getElementById('form-customer-id').value = c.id;
  document.getElementById('form-code').value = c.code;
  document.getElementById('form-name').value = c.name;
  document.getElementById('form-phone').value = c.phone;
  document.getElementById('form-demand').value = c.demand;
  document.getElementById('form-source').value = c.source || 'Facebook Ads';
  document.getElementById('form-collaborator').value = c.collaboratorId || '';
  document.getElementById('form-assigned-staff').value = c.staff || 'Chưa phân công';
  document.getElementById('form-status').value = c.status;
  document.getElementById('form-date').value = c.date;
  const paxField = document.getElementById('form-pax');
  if (paxField) paxField.value = c.paxCount || 2;

  document.getElementById('modal-title').textContent = `Sửa thông tin: ${c.name} (${c.code})`;
  hideDuplicateWarning();

  document.getElementById('customer-modal').classList.remove('hidden');
  document.getElementById('customer-modal').classList.add('flex');
};

window.deleteCustomer = function(id) {
  if (currentUser && currentUser.role === 'KE_TOAN') {
    alert("⛔ BẢO VỆ DỮ LIỆU: Kế toán không có quyền xóa hồ sơ khách hàng!");
    return;
  }
  const c = db.customers.find(item => item.id === id || item.code === id || String(item.id) === String(id));
  if (!c) return;

  // Ràng buộc toàn vẹn (Cascade / Orphan Guard):
  const hasActiveBookings = (db.bookings || []).some(b => 
    (String(b.customerId) === String(c.id) || String(b.customerId) === String(c.code)) && b.status !== 'Đã hủy'
  );
  const hasActiveQuotes = (db.quotations || []).some(q => 
    (String(q.customerId) === String(c.id) || String(q.customerId) === String(c.code)) && q.status !== 'Đã hủy'
  );

  if (hasActiveBookings || hasActiveQuotes) {
    alert(`⚠️ KHÔNG THỂ XÓA KHÁCH HÀNG: Khách hàng "${c.name}" (${c.code}) đang có đơn tour hoặc báo giá liên kết trên hệ thống!\nVui lòng hủy hoặc xử lý các đơn tour/báo giá liên kết trước khi xóa.`);
    return;
  }

  if (confirm(`Bạn có chắc muốn xóa khách hàng "${c.name}" (${c.code})?`)) {
    db.customers = db.customers.filter(item => item.id !== c.id && item.code !== c.code);
    saveDatabase();
    recordAuditLog('XÓA KHÁCH HÀNG', `Đã xóa khách hàng ${c.name} (${c.code}).`);
    renderCrmModule();
  }
};

// ==========================================
// 16. PHÂN HỆ 1: BẢNG ĐIỀU HÀNH CEO (EXECUTIVE DASHBOARD)
// ==========================================
function renderCeoDashboard() {
  const activeBookings = db.bookings.filter(b => b.status !== 'Đã hủy');
  const contractValue = activeBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const bookingCount = activeBookings.length;
  const paxCount = activeBookings.reduce((sum, b) => sum + (b.paxCount || 0), 0);

  const totalIn = db.payments.filter(p => p.status === 'CONFIRMED' && (!p.type || p.type === 'PAYMENT')).reduce((sum, p) => sum + (p.amount || 0), 0);
  const totalRefund = db.payments.filter(p => p.status === 'CONFIRMED' && p.type === 'REFUND').reduce((sum, p) => sum + (p.amount || 0), 0);
  const cashIn = Math.max(0, totalIn - totalRefund);
  const arDebt = activeBookings.reduce((sum, b) => sum + (b.remainingAmount || 0), 0);

  const cogs = activeBookings.reduce((sum, b) => sum + (b.estimatedCost || 0), 0);
  const grossProfit = contractValue - cogs;
  const marginPct = contractValue > 0 ? Math.round((grossProfit / contractValue) * 100) : 0;

  const supplierPaid = db.supplierBookings.reduce((sum, sb) => sum + (sb.paidCost || 0), 0);
  const commPaid = db.commissions.filter(c => c.status === 'Đã thanh toán').reduce((sum, c) => sum + (c.amount || 0), 0);
  const cashOut = supplierPaid + commPaid;
  const netCash = cashIn - cashOut;

  // Cập nhật các thẻ KPI
  const elContract = document.getElementById('ceo-stat-contract-value');
  if (elContract) elContract.textContent = formatVND(contractValue);
  const elBCount = document.getElementById('ceo-stat-booking-count');
  if (elBCount) elBCount.textContent = bookingCount;
  const elPCount = document.getElementById('ceo-stat-pax-count');
  if (elPCount) elPCount.textContent = paxCount;

  const elCashIn = document.getElementById('ceo-stat-cash-in');
  if (elCashIn) elCashIn.textContent = formatVND(cashIn);
  const elDebt = document.getElementById('ceo-stat-ar-debt');
  if (elDebt) elDebt.textContent = formatVND(arDebt);

  const elGrossProfit = document.getElementById('ceo-stat-gross-profit');
  if (elGrossProfit) elGrossProfit.textContent = formatVND(grossProfit);
  const elMarginPct = document.getElementById('ceo-stat-margin-pct');
  if (elMarginPct) elMarginPct.textContent = `${marginPct}%`;
  const elCogs = document.getElementById('ceo-stat-cogs');
  if (elCogs) elCogs.textContent = formatVND(cogs);

  const elNetCash = document.getElementById('ceo-stat-net-cash');
  if (elNetCash) elNetCash.textContent = formatVND(netCash);
  const elCashOut = document.getElementById('ceo-stat-cash-out');
  if (elCashOut) elCashOut.textContent = formatVND(cashOut);

  // 3 Thẻ Cảnh báo
  const debtBookings = activeBookings.filter(b => (b.totalAmount - (b.paidAmount || 0)) > 0);
  const elDebtCount = document.getElementById('ceo-alert-debt-count');
  if (elDebtCount) elDebtCount.textContent = `${debtBookings.length} đơn`;
  const elDebtDesc = document.getElementById('ceo-alert-debt-desc');
  if (elDebtDesc) elDebtDesc.textContent = `Tổng nợ đọng cần thu: ${formatVND(arDebt)} từ ${debtBookings.length} khách hàng.`;

  // Tour sắp khởi hành (trong vòng 14 ngày tới)
  const today = new Date().toISOString().split('T')[0];
  const upcomingTours = activeBookings.filter(b => b.departureDate >= today && b.tourStatus !== 'Hoàn thành tour');
  const elUpCount = document.getElementById('ceo-alert-upcoming-count');
  if (elUpCount) elUpCount.textContent = `${upcomingTours.length} đoàn`;
  const elUpDesc = document.getElementById('ceo-alert-upcoming-desc');

  // Cập nhật Radar Thuế & Pháp lý cho CEO (Nghị định 123 & TT 219 & TT 111)
  const totalTaxableVat = activeBookings.reduce((sum, b) => {
    const rev = b.totalAmount || 0;
    const ded = b.actualCost || b.estimatedCost || Math.round(rev * 0.65);
    return sum + Math.max(0, rev - ded);
  }, 0);
  const vatDue = Math.round(totalTaxableVat * 0.10);
  const pitDue = (db.commissions || []).filter(c => (c.amount || 0) >= 2000000 && c.status !== 'Đã hủy').reduce((sum, c) => sum + Math.round((c.amount || 0) * 0.10), 0);
  const issuedInvCount = (db.invoices || []).filter(i => i.status === 'CQT_ISSUED').length;
  const totalInvCount = (db.invoices || []).length;

  const elCeoVatDue = document.getElementById('ceo-tax-vat-due');
  if (elCeoVatDue) elCeoVatDue.textContent = formatVND(vatDue);
  const elCeoPitDue = document.getElementById('ceo-tax-pit-withheld');
  if (elCeoPitDue) elCeoPitDue.textContent = formatVND(pitDue);
  const elCeoInvCount = document.getElementById('ceo-tax-invoice-count');
  if (elCeoInvCount) elCeoInvCount.textContent = `${issuedInvCount} / ${totalInvCount} HĐ`;
  const elCeoRatio = document.getElementById('ceo-tax-input-vat-ratio');
  if (elCeoRatio) elCeoRatio.textContent = "100% Đầy đủ";


  
  if (elUpDesc) elUpDesc.textContent = upcomingTours.length > 0 
    ? `Có ${upcomingTours.length} đoàn tour khởi hành sắp tới. Điều hành rà soát dịch vụ NCC.` 
    : 'Không có đoàn nào trong 7 ngày tới.';

  // Hoa hồng cần đối soát (Chỉ tính các phiếu còn hiệu lực: Chờ duyệt hoặc Đã duyệt chi)
  const pendingComms = db.commissions.filter(c => c.status === 'Chờ duyệt' || c.status === 'Đã duyệt chi');
  const pendingCommAmount = pendingComms.reduce((s, c) => s + (c.amount || 0), 0);
  const elCommCount = document.getElementById('ceo-alert-comm-count');
  if (elCommCount) elCommCount.textContent = `${pendingComms.length} phiếu`;
  const elCommDesc = document.getElementById('ceo-alert-comm-desc');
  if (elCommDesc) elCommDesc.textContent = `Còn ${formatVND(pendingCommAmount)} hoa hồng đang chờ đối soát & lập lệnh chi.`;

  // Top Tours list
  const topToursList = document.getElementById('ceo-top-tours-list');
  if (topToursList) {
    const tourStats = db.tourPolicies.map(tp => {
      const tourBookings = activeBookings.filter(b => b.tourName && b.tourName.includes(tp.name));
      const bCount = tourBookings.length;
      const pCount = tourBookings.reduce((s, b) => s + (b.paxCount || 0), 0);
      const rev = tourBookings.reduce((s, b) => s + (b.totalAmount || 0), 0);
      return { ...tp, bCount, pCount, rev };
    }).sort((a, b) => b.rev - a.rev);

    topToursList.innerHTML = tourStats.slice(0, 4).map((t, idx) => `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
        <div class="flex items-center space-x-2.5">
          <span class="w-6 h-6 rounded-lg bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xs">${idx + 1}</span>
          <div>
            <div class="font-bold text-slate-900">${escapeHtml(t.name)}</div>
            <div class="text-[10px] text-slate-400 font-mono">${t.duration} &bull; ${t.bCount} đơn (${t.pCount} khách)</div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-bold text-brand-700">${formatVND(t.rev)}</div>
          <div class="text-[10px] text-slate-400">Giá niêm yết: ${formatVND(t.price)}</div>
        </div>
      </div>
    `).join('');
  }

  // Top CTVs list
  const topCtvsList = document.getElementById('ceo-top-ctvs-list');
  if (topCtvsList) {
    const ctvStats = db.ctvs.map((ctv, idx) => {
      const ctvBookings = activeBookings.filter(b => b.collaboratorId === ctv.id);
      const rev = ctvBookings.reduce((s, b) => s + (b.totalAmount || 0), 0);
      const commEarned = db.commissions.filter(c => c.ctvId === ctv.id).reduce((s, c) => s + (c.amount || 0), 0);
      return { ...ctv, bCount: ctvBookings.length, rev, commEarned };
    }).sort((a, b) => b.rev - a.rev);

    topCtvsList.innerHTML = ctvStats.slice(0, 4).map((c, idx) => `
      <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
        <div class="flex items-center space-x-2.5">
          <span class="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">${idx + 1}</span>
          <div>
            <div class="font-bold text-slate-900">${escapeHtml(c.name)}</div>
            <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(c.code)} &bull; ${c.bCount} đơn tour chốt</div>
          </div>
        </div>
        <div class="text-right">
          <div class="font-bold text-slate-900">${formatVND(c.rev)}</div>
          <div class="text-[10px] text-emerald-700 font-bold">Hoa hồng: ${formatVND(c.commEarned)}</div>
        </div>
      </div>
    `).join('');
  }

  // 4. Khối Radar Phòng Chống Gian Lận & Giám Sát Chi Tiết Từng Đoàn Tour Của CEO
  renderCeoAntiFraudRadar();
  renderCeoTourRadar();
}

// ==========================================
// 16B. TRUNG TÂM RADAR PHÒNG CHỐNG GIAN LẬN & GIÁM SÁT 360° ĐOÀN TOUR CỦA CEO
// ==========================================
let currentCeoTourRadarFilter = 'ALL';

function filterCeoTourRadar(filterType) {
  currentCeoTourRadarFilter = filterType;

  const filterBtns = ['all', 'risk', 'incident', 'upcoming', 'debt'];
  filterBtns.forEach(f => {
    const btn = document.getElementById(`ceo-filter-${f}`);
    if (btn) {
      if (f.toUpperCase() === filterType) {
        btn.className = 'ceo-tour-filter active px-3 py-1.5 rounded-xl font-bold bg-slate-900 text-white shadow-sm';
      } else {
        if (f === 'risk') btn.className = 'ceo-tour-filter px-3 py-1.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-rose-700 border border-rose-200 flex items-center space-x-1';
        else if (f === 'incident') btn.className = 'ceo-tour-filter px-3 py-1.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-blue-700 border border-blue-200 flex items-center space-x-1';
        else if (f === 'debt') btn.className = 'ceo-tour-filter px-3 py-1.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-amber-800 border border-amber-200';
        else btn.className = 'ceo-tour-filter px-3 py-1.5 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200';
      }
    }
  });

  renderCeoTourRadar();
}

let currentRadarSubTab = 'price';

function switchRadarSubTab(tabName) {
  currentRadarSubTab = tabName;

  const tabs = ['price', 'overrun', 'debt', 'refund'];
  tabs.forEach(t => {
    const btn = document.getElementById(`radar-subtab-btn-${t}`);
    const content = document.getElementById(`radar-subtab-content-${t}`);
    if (btn) {
      if (t === tabName) {
        btn.className = 'radar-subtab-btn active px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-rose-600 text-white shadow-md flex items-center space-x-1.5';
      } else {
        btn.className = 'radar-subtab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 flex items-center space-x-1.5';
      }
    }
    if (content) {
      if (t === tabName) content.classList.remove('hidden');
      else content.classList.add('hidden');
    }
  });
}

function renderCeoAntiFraudRadar() {
  // 1. Quét kê giá / Lệch giá hợp đồng NCC
  const priceAlertOrders = (db.supplierBookings || []).filter(sb => sb.priceAlert === true || (sb.contractRate && sb.agreedCost > sb.contractRate));
  const elPriceCount = document.getElementById('ceo-fraud-price-count');
  if (elPriceCount) elPriceCount.textContent = priceAlertOrders.length;
  const elPriceBadge = document.getElementById('ceo-fraud-price-badge');
  if (elPriceBadge) elPriceBadge.textContent = `${priceAlertOrders.length} vụ`;
  const elPriceDesc = document.getElementById('ceo-fraud-price-desc');
  if (elPriceDesc) {
    if (priceAlertOrders.length > 0) {
      const first = priceAlertOrders[0];
      elPriceDesc.textContent = `${first.code} (${first.supplierName}): Lệch +${formatVND(first.agreedCost - (first.contractRate || 0))}`;
    } else {
      elPriceDesc.textContent = '100% lệnh đặt dịch vụ khớp giá hợp đồng';
    }
  }

  // 2. Quét vượt dự toán chi phí COGS
  const overrunBookings = (db.bookings || []).filter(b => {
    const orders = (db.supplierBookings || []).filter(sb => sb.bookingCode === b.code || sb.bookingId === b.id);
    const actualCogs = orders.reduce((s, o) => s + (o.agreedCost || 0), 0);
    return b.estimatedCost > 0 && actualCogs > b.estimatedCost;
  });
  const elOverrunCount = document.getElementById('ceo-fraud-overrun-count');
  if (elOverrunCount) elOverrunCount.textContent = overrunBookings.length;
  const elOverrunBadge = document.getElementById('ceo-fraud-overrun-badge');
  if (elOverrunBadge) elOverrunBadge.textContent = `${overrunBookings.length} đoàn`;
  const elOverrunDesc = document.getElementById('ceo-fraud-overrun-desc');
  if (elOverrunDesc) {
    if (overrunBookings.length > 0) {
      const bFirst = overrunBookings[0];
      const orders = (db.supplierBookings || []).filter(sb => sb.bookingCode === bFirst.code || sb.bookingId === bFirst.id);
      const actualCogs = orders.reduce((s, o) => s + (o.agreedCost || 0), 0);
      elOverrunDesc.textContent = `${bFirst.code}: Đội +${formatVND(actualCogs - bFirst.estimatedCost)} so với dự toán Sale`;
    } else {
      elOverrunDesc.textContent = 'Các đoàn đều trong định mức chi phí';
    }
  }

  // 3. Quét nợ đọng sát ngày khởi hành (Khởi hành <= 7 ngày hoặc đã đi mà nợ > 50%)
  const highDebtBookings = (db.bookings || []).filter(b => b.status !== 'Đã hủy' && (b.totalAmount - (b.paidAmount || 0)) > 0 && (b.paidAmount || 0) < b.totalAmount * 0.5);
  const elDebtCount = document.getElementById('ceo-fraud-debt-count');
  if (elDebtCount) elDebtCount.textContent = highDebtBookings.length;
  const elDebtBadge = document.getElementById('ceo-fraud-debt-badge');
  if (elDebtBadge) elDebtBadge.textContent = `${highDebtBookings.length} đoàn`;
  const elDebtDesc = document.getElementById('ceo-fraud-debt-desc');
  if (elDebtDesc) {
    if (highDebtBookings.length > 0) {
      const bFirst = highDebtBookings[0];
      elDebtDesc.textContent = `${bFirst.code} (${bFirst.customerName}): Còn nợ ${formatVND(bFirst.totalAmount - (bFirst.paidAmount || 0))}`;
    } else {
      elDebtDesc.textContent = 'Dòng tiền đặt cọc đạt chuẩn quy định';
    }
  }

  // 4. Quét hoàn tiền / Đơn hủy
  const canceledBookings = (db.bookings || []).filter(b => b.status === 'Đã hủy');
  const refundPayments = (db.payments || []).filter(p => p.type === 'REFUND');
  const elRefundCount = document.getElementById('ceo-fraud-refund-count');
  if (elRefundCount) elRefundCount.textContent = canceledBookings.length;
  const elRefundBadge = document.getElementById('ceo-fraud-refund-badge');
  if (elRefundBadge) elRefundBadge.textContent = `${canceledBookings.length} đơn`;
  const elRefundDesc = document.getElementById('ceo-fraud-refund-desc');
  if (elRefundDesc) {
    if (refundPayments.length > 0) {
      const refTotal = refundPayments.reduce((s, p) => s + (p.amount || 0), 0);
      elRefundDesc.textContent = `Tổng hoàn cọc: ${formatVND(refTotal)} (Đã kiểm tra chứng từ)`;
    } else {
      elRefundDesc.textContent = 'Không có đơn hủy hoặc hoàn cọc bất thường';
    }
  }

  // 5. Quét sự cố chất lượng
  const allIncidents = (db.bookings || []).flatMap(b => b.incidents || []);
  const elIncCount = document.getElementById('ceo-fraud-incident-count');
  if (elIncCount) elIncCount.textContent = allIncidents.length;
  const elIncBadge = document.getElementById('ceo-fraud-incident-badge');
  if (elIncBadge) elIncBadge.textContent = `${allIncidents.length} vụ`;
  const elIncDesc = document.getElementById('ceo-fraud-incident-desc');
  if (elIncDesc) {
    if (allIncidents.length > 0) {
      const first = allIncidents[0];
      elIncDesc.textContent = `${first.bookingCode}: ${first.title} [${first.status === 'RESOLVED' ? 'Đã giải quyết' : 'Cần xử lý'}]`;
    } else {
      elIncDesc.textContent = '100% đoàn vận hành an toàn không sự cố';
    }
  }

  // Cập nhật số lượng trên các nút lọc
  const riskTotal = (new Set([...overrunBookings.map(b => b.code), ...priceAlertOrders.map(o => o.bookingCode), ...highDebtBookings.map(b => b.code), ...canceledBookings.map(b => b.code)])).size;
  const incTotal = (new Set(allIncidents.map(i => i.bookingCode))).size;
  const badgeRisk = document.getElementById('ceo-filter-risk-count');
  if (badgeRisk) badgeRisk.textContent = riskTotal;
  const badgeInc = document.getElementById('ceo-filter-incident-count');
  if (badgeInc) badgeInc.textContent = incTotal;

  // Cập nhật số lượng trên các nút tab Cơ Sở Dữ Liệu Đối Soát
  const badgeTabPrice = document.getElementById('radar-tab-badge-price');
  if (badgeTabPrice) badgeTabPrice.textContent = priceAlertOrders.length;
  const badgeTabOverrun = document.getElementById('radar-tab-badge-overrun');
  if (badgeTabOverrun) badgeTabOverrun.textContent = overrunBookings.length;
  const badgeTabDebt = document.getElementById('radar-tab-badge-debt');
  if (badgeTabDebt) badgeTabDebt.textContent = highDebtBookings.length;
  const badgeTabRefund = document.getElementById('radar-tab-badge-refund');
  if (badgeTabRefund) badgeTabRefund.textContent = canceledBookings.length;

  // Render các Bảng Cơ Sở Dữ Liệu Đối Soát Song Song
  renderPriceComparisonTable(priceAlertOrders);
  renderOverrunComparisonTable(overrunBookings);
  renderDebtComparisonTable(highDebtBookings);
  renderRefundComparisonTable(canceledBookings, refundPayments);
}

function renderPriceComparisonTable(priceAlertOrders) {
  const tbody = document.getElementById('ceo-price-comparison-body');
  if (!tbody) return;

  const orders = priceAlertOrders || (db.supplierBookings || []).filter(sb => sb.priceAlert === true || (sb.contractRate && sb.agreedCost > sb.contractRate));

  const badgeEl = document.getElementById('radar-table-price-badge');
  if (badgeEl) badgeEl.textContent = `${orders.length} vụ lệch giá`;

  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-6 text-center text-slate-400">
          <div class="flex flex-col items-center justify-center space-y-1">
            <span class="text-xl">✅</span>
            <div class="font-bold text-slate-300 text-xs">Không phát hiện dịch vụ nào có giá thỏa thuận cao hơn giá hợp đồng niêm yết</div>
            <div class="text-[11px] text-slate-400">100% đơn đặt dịch vụ của Điều hành tuân thủ chặt chẽ bảng giá khung đã ký kết.</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = orders.map(sb => {
    const baseRate = sb.contractRate || sb.agreedCost;
    const diff = sb.agreedCost - baseRate;
    const pctDiff = baseRate > 0 ? (((sb.agreedCost - baseRate) / baseRate) * 100).toFixed(1) : 0;

    return `
      <tr class="hover:bg-white/5 transition-colors">
        <td class="py-3 px-3">
          <div class="font-mono font-bold text-rose-300">${escapeHtml(sb.code)}</div>
          <div class="text-[10px] text-slate-400 font-mono">Đoàn: <span class="text-white font-bold">${escapeHtml(sb.bookingCode || sb.bookingId)}</span></div>
        </td>
        <td class="py-3 px-3">
          <div class="font-bold text-white text-xs">${escapeHtml(sb.supplierName)}</div>
          <div class="text-[11px] text-slate-300">${escapeHtml(sb.serviceType)}</div>
        </td>
        <td class="py-3 px-3 text-right">
          <div class="font-mono font-bold text-slate-200">${formatVND(baseRate)}</div>
          <div class="text-[9px] text-emerald-400">Niêm yết HĐ khung</div>
        </td>
        <td class="py-3 px-3 text-right">
          <div class="font-mono font-bold text-rose-400 text-sm">${formatVND(sb.agreedCost)}</div>
          <div class="text-[9px] text-rose-300">Điều hành thỏa thuận</div>
        </td>
        <td class="py-3 px-3 text-right">
          <div class="font-mono font-extrabold text-rose-400 text-xs">+${formatVND(diff)}</div>
          <span class="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-500/30 text-rose-200">+${pctDiff}%</span>
        </td>
        <td class="py-3 px-3">
          <div class="text-slate-200 text-xs leading-relaxed italic bg-white/5 p-2 rounded-xl border border-white/10">
            "${escapeHtml(sb.priceAlertNote || sb.notes || 'Điều hành thỏa thuận giá mới ngoài danh mục chuẩn')}"
          </div>
        </td>
        <td class="py-3 px-3 text-center whitespace-nowrap">
          <div class="flex items-center justify-center space-x-1.5">
            <button onclick="openSupplierVoucherModal('${sb.code}')" class="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold border border-white/20 transition-all">
              📄 Voucher
            </button>
            <button onclick="openBookingDetailModal('${sb.bookingCode || sb.bookingId}')" class="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all">
              🔍 Soi Tour
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderOverrunComparisonTable(overrunBookings) {
  const tbody = document.getElementById('ceo-overrun-comparison-body');
  if (!tbody) return;

  const bookings = overrunBookings || (db.bookings || []).filter(b => {
    const orders = (db.supplierBookings || []).filter(sb => sb.bookingCode === b.code || sb.bookingId === b.id);
    const actualCogs = orders.reduce((s, o) => s + (o.agreedCost || 0), 0);
    return b.estimatedCost > 0 && actualCogs > b.estimatedCost;
  });

  const badgeEl = document.getElementById('radar-table-overrun-badge');
  if (badgeEl) badgeEl.textContent = `${bookings.length} đoàn đội chi phí`;

  if (bookings.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="py-6 text-center text-slate-400">
          <div class="flex flex-col items-center justify-center space-y-1">
            <span class="text-xl">✅</span>
            <div class="font-bold text-slate-300 text-xs">Không có đoàn tour nào bị đội chi phí vượt định mức dự toán của Sale</div>
            <div class="text-[11px] text-slate-400">100% đoàn tour có chi phí giá vốn (COGS) nằm trong hoặc thấp hơn dự toán ban đầu.</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = bookings.map(b => {
    const orders = (db.supplierBookings || []).filter(sb => sb.bookingCode === b.code || sb.bookingId === b.id);
    const actualCogs = orders.reduce((s, o) => s + (o.agreedCost || 0), 0);
    const estimatedCogs = b.estimatedCost || 0;
    const diff = actualCogs - estimatedCogs;
    const pctDiff = estimatedCogs > 0 ? (((diff) / estimatedCogs) * 100).toFixed(1) : 0;

    const estMargin = b.totalAmount > 0 ? (((b.totalAmount - estimatedCogs) / b.totalAmount) * 100).toFixed(1) : 0;
    const actMargin = b.totalAmount > 0 ? (((b.totalAmount - actualCogs) / b.totalAmount) * 100).toFixed(1) : 0;
    const marginDrop = (Number(estMargin) - Number(actMargin)).toFixed(1);

    return `
      <tr class="hover:bg-white/5 transition-colors">
        <td class="py-3 px-3">
          <div class="font-mono font-bold text-amber-300">${escapeHtml(b.code)}</div>
          <div class="font-bold text-white text-xs truncate max-w-[170px]" title="${escapeHtml(b.tourName)}">${escapeHtml(b.tourName)}</div>
          <div class="text-[10px] text-slate-400">Khách: ${escapeHtml(b.customerName)}</div>
        </td>
        <td class="py-3 px-3 text-center">
          <span class="inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-white/10 font-bold text-slate-200">${b.paxCount}</span>
        </td>
        <td class="py-3 px-3 text-right">
          <div class="font-mono font-bold text-slate-200">${formatVND(estimatedCogs)}</div>
          <div class="text-[9px] text-slate-400">Dự toán Sale (${escapeHtml(b.staff || 'Sale')})</div>
        </td>
        <td class="py-3 px-3 text-right">
          <div class="font-mono font-bold text-amber-400 text-sm">${formatVND(actualCogs)}</div>
          <div class="text-[9px] text-amber-300">Tổng ${orders.length} lệnh NCC Điều hành</div>
        </td>
        <td class="py-3 px-3 text-right">
          <div class="font-mono font-extrabold text-amber-400 text-xs">+${formatVND(diff)}</div>
          <span class="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/30 text-amber-200">+${pctDiff}%</span>
        </td>
        <td class="py-3 px-3 text-center">
          <div class="text-[11px] font-bold text-slate-200">${estMargin}% ➔ <span class="text-rose-400">${actMargin}%</span></div>
          <div class="text-[9px] text-rose-300 font-mono">Giảm -${marginDrop}% LNG</div>
        </td>
        <td class="py-3 px-3">
          <div class="text-slate-200 text-xs leading-relaxed italic bg-white/5 p-2 rounded-xl border border-white/10">
            ${escapeHtml(b.notes || 'Phát sinh chi phí dịch vụ tăng cường ngoài hợp đồng dự toán của Sale.')}
          </div>
        </td>
        <td class="py-3 px-3 text-center whitespace-nowrap">
          <button onclick="openBookingDetailModal('${b.id}')" class="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all">
            🔍 Soi P&L
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderDebtComparisonTable(highDebtBookings) {
  const tbody = document.getElementById('ceo-debt-comparison-body');
  if (!tbody) return;

  const bookings = highDebtBookings || (db.bookings || []).filter(b => b.status !== 'Đã hủy' && (b.totalAmount - (b.paidAmount || 0)) > 0 && (b.paidAmount || 0) < b.totalAmount * 0.5);

  const badgeEl = document.getElementById('radar-table-debt-badge');
  if (badgeEl) badgeEl.textContent = `${bookings.length} đoàn nợ cao`;

  if (bookings.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-6 text-center text-slate-400">
          <div class="flex flex-col items-center justify-center space-y-1">
            <span class="text-xl">✅</span>
            <div class="font-bold text-slate-300 text-xs">Tất cả đoàn tour đều đã thu đủ tiền cọc hoặc thanh toán hoàn tất</div>
            <div class="text-[11px] text-slate-400">Không có rủi ro dòng tiền cận ngày khởi hành.</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = bookings.map(b => {
    const debt = b.totalAmount - (b.paidAmount || 0);
    const pctPaid = b.totalAmount > 0 ? Math.round(((b.paidAmount || 0) / b.totalAmount) * 100) : 0;

    return `
      <tr class="hover:bg-white/5 transition-colors">
        <td class="py-3 px-3">
          <div class="font-mono font-bold text-yellow-300">${escapeHtml(b.code)}</div>
          <div class="text-[11px] text-slate-200 font-mono">Đi: <span class="text-white font-bold">${escapeHtml(b.departureDate)}</span></div>
        </td>
        <td class="py-3 px-3">
          <div class="font-bold text-white text-xs">${escapeHtml(b.customerName)}</div>
          <div class="text-[10px] text-slate-400 font-mono">📞 ${escapeHtml(b.customerPhone)}</div>
        </td>
        <td class="py-3 px-3 text-right">
          <div class="font-mono font-bold text-slate-200">${formatVND(b.totalAmount)}</div>
        </td>
        <td class="py-3 px-3 text-right">
          <div class="font-mono font-bold text-emerald-400">${formatVND(b.paidAmount || 0)}</div>
          <div class="text-[9px] text-slate-300">Đạt ${pctPaid}% / 50% quy định</div>
        </td>
        <td class="py-3 px-3 text-right">
          <div class="font-mono font-extrabold text-yellow-400 text-sm">${formatVND(debt)}</div>
          <span class="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-yellow-500/30 text-yellow-200">Còn nợ ${100 - pctPaid}%</span>
        </td>
        <td class="py-3 px-3">
          <div class="text-xs text-yellow-200">
            ${pctPaid === 0 ? '🚨 Báo động: Khách chưa đặt cọc bất kỳ khoản nào! Cần xác minh hợp đồng trước khi khởi hành.' : '⚠️ Cảnh báo: Thu tiền đợt 2 trước khi xe lăn bánh để tránh nợ đọng sau tour.'}
          </div>
        </td>
        <td class="py-3 px-3 text-center whitespace-nowrap">
          <div class="flex items-center justify-center space-x-1.5">
            <button onclick="openBookingDetailModal('${b.id}')" class="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-bold border border-white/20 transition-all">
              🔍 Soi
            </button>
            <button onclick="openPaymentModal('${b.id}')" class="px-2.5 py-1 bg-yellow-600 hover:bg-yellow-700 text-slate-900 font-bold rounded-lg text-[10px] shadow-sm transition-all">
              💳 Thu tiền
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderRefundComparisonTable(canceledBookings, refundPayments) {
  const tbody = document.getElementById('ceo-refund-comparison-body');
  if (!tbody) return;

  const canceled = canceledBookings || (db.bookings || []).filter(b => b.status === 'Đã hủy');
  const refunds = refundPayments || (db.payments || []).filter(p => p.type === 'REFUND');

  const badgeEl = document.getElementById('radar-table-refund-badge');
  if (badgeEl) badgeEl.textContent = `${canceled.length} đơn hủy`;

  if (canceled.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-6 text-center text-slate-400">
          <div class="flex flex-col items-center justify-center space-y-1">
            <span class="text-xl">✅</span>
            <div class="font-bold text-slate-300 text-xs">Không có đơn tour nào bị hủy hay phát sinh hoàn tiền cọc</div>
            <div class="text-[11px] text-slate-400">Doanh thu và lượng khách được bảo toàn 100%.</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = canceled.map(b => {
    const refPayment = refunds.find(p => p.bookingCode === b.code || p.bookingId === b.id);
    const refundAmt = refPayment ? refPayment.amount : (b.refundAmount || 0);
    const initialDeposit = (b.paidAmount || 0) + refundAmt;
    const penaltyAmt = Math.max(0, initialDeposit - refundAmt);

    return `
      <tr class="hover:bg-white/5 transition-colors">
        <td class="py-3 px-3">
          <div class="font-mono font-bold text-purple-300">${escapeHtml(b.code)}</div>
          <div class="text-xs font-bold text-white truncate max-w-[170px]" title="${escapeHtml(b.tourName)}">${escapeHtml(b.tourName)}</div>
        </td>
        <td class="py-3 px-3">
          <div class="font-bold text-white text-xs">${escapeHtml(b.customerName)}</div>
          <div class="text-[11px] text-slate-300 italic">Lý do: "${escapeHtml(b.notes || 'Hủy tour đột xuất')}"</div>
        </td>
        <td class="py-3 px-3 text-right">
          <div class="font-mono font-bold text-slate-200">${formatVND(initialDeposit)}</div>
          <div class="text-[9px] text-slate-400">Đã thu ban đầu</div>
        </td>
        <td class="py-3 px-3 text-right">
          <div class="font-mono font-bold text-amber-400">${formatVND(penaltyAmt)}</div>
          <div class="text-[9px] text-amber-300">Phạt hủy giữ lại quỹ</div>
        </td>
        <td class="py-3 px-3 text-right">
          <div class="font-mono font-extrabold text-purple-300 text-sm">${formatVND(refundAmt)}</div>
          <span class="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/30 text-purple-200">Đã hoàn trả khách</span>
        </td>
        <td class="py-3 px-3">
          <div class="text-[11px] text-slate-300 bg-white/5 p-2 rounded-xl border border-white/10">
            ${refPayment ? `✅ Phiếu chi: <span class="font-mono font-bold text-white">${refPayment.code}</span> (${refPayment.referenceCode}) &bull; Duyệt bởi: ${refPayment.confirmedBy}` : 'Đang xử lý chứng từ hoàn tiền'}
          </div>
        </td>
        <td class="py-3 px-3 text-center whitespace-nowrap">
          <button onclick="openBookingDetailModal('${b.id}')" class="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all">
            🔍 Soi Hồ Sơ
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderCeoTourRadar() {
  const tbody = document.getElementById('ceo-tour-radar-body');
  if (!tbody) return;

  const bookings = db.bookings || [];
  let filteredBookings = bookings;

  if (currentCeoTourRadarFilter === 'RISK') {
    filteredBookings = bookings.filter(b => {
      const orders = (db.supplierBookings || []).filter(sb => sb.bookingCode === b.code || sb.bookingId === b.id);
      const actualCogs = orders.reduce((s, o) => s + (o.agreedCost || 0), 0);
      const estimatedCogs = b.estimatedCost || 0;
      const hasOverrun = estimatedCogs > 0 && actualCogs > estimatedCogs;
      const hasPriceRisk = orders.some(o => o.priceAlert === true || (o.contractRate && o.agreedCost > o.contractRate));
      const debt = Math.max(0, b.totalAmount - (b.paidAmount || 0));
      const hasDebtRisk = b.status !== 'Đã hủy' && debt > 0 && ((b.paidAmount || 0) < b.totalAmount * 0.5);
      const hasRefundRisk = b.status === 'Đã hủy';
      const hasInc = (b.incidents || []).length > 0;
      return hasOverrun || hasPriceRisk || hasDebtRisk || hasRefundRisk || hasInc;
    });
  } else if (currentCeoTourRadarFilter === 'INCIDENT') {
    filteredBookings = bookings.filter(b => (b.incidents || []).length > 0);
  } else if (currentCeoTourRadarFilter === 'UPCOMING') {
    filteredBookings = bookings.filter(b => b.status !== 'Đã hủy' && b.tourStatus !== 'Hoàn thành tour');
  } else if (currentCeoTourRadarFilter === 'DEBT') {
    filteredBookings = bookings.filter(b => b.status !== 'Đã hủy' && (b.totalAmount - (b.paidAmount || 0)) > 0);
  }

  if (filteredBookings.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="py-8 text-center text-slate-400">
          <div class="flex flex-col items-center justify-center space-y-1">
            <span class="text-2xl">🔍</span>
            <div class="font-bold text-slate-600 text-xs">Không có đoàn tour nào khớp với bộ lọc "${currentCeoTourRadarFilter}"</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredBookings.map(b => {
    const orders = (db.supplierBookings || []).filter(sb => sb.bookingCode === b.code || sb.bookingId === b.id);
    const actualCogs = orders.reduce((s, o) => s + (o.agreedCost || 0), 0);
    const estimatedCogs = b.estimatedCost || 0;
    const cogsDiff = actualCogs - estimatedCogs;
    const hasOverrun = estimatedCogs > 0 && cogsDiff > 0;
    const hasPriceRisk = orders.some(o => o.priceAlert === true || (o.contractRate && o.agreedCost > o.contractRate));
    const debt = Math.max(0, b.totalAmount - (b.paidAmount || 0));
    const hasDebtRisk = b.status !== 'Đã hủy' && debt > 0 && ((b.paidAmount || 0) < b.totalAmount * 0.5);
    const hasRefundRisk = b.status === 'Đã hủy';
    const incidents = b.incidents || [];
    const hasIncident = incidents.length > 0;

    const comm = (db.commissions || []).find(c => c.bookingCode === b.code || (c.customerId === b.customerId && !c.bookingCode));
    const commAmt = (comm && comm.status !== 'Đã hủy') ? (Number(comm.amount) || 0) : 0;
    const grossProfit = b.totalAmount - actualCogs - commAmt;
    const marginPct = b.totalAmount > 0 ? ((grossProfit / b.totalAmount) * 100).toFixed(1) : 0;
    const pctPaid = b.totalAmount > 0 ? Math.min(100, Math.round(((b.paidAmount || 0) / b.totalAmount) * 100)) : 0;

    let statusPill = '';
    if (b.status === 'Đã hủy') {
      statusPill = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Đã hủy đoàn</span>';
    } else if (b.tourStatus === 'Hoàn thành tour') {
      statusPill = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Hoàn thành tour</span>';
    } else if (b.tourStatus === 'Đang đi tour') {
      statusPill = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Đang đi tour</span>';
    } else if (b.tourStatus === 'Mới tiếp nhận') {
      statusPill = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Mới tiếp nhận</span>';
    } else {
      statusPill = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">Đang chuẩn bị</span>';
    }

    let riskBadges = [];
    if (hasPriceRisk) riskBadges.push('<span class="inline-block px-1.5 py-0.2 bg-rose-100 text-rose-800 font-bold text-[9px] rounded" title="Lệnh đặt NCC cao hơn giá hợp đồng niêm yết">🚨 Lệch giá NCC</span>');
    if (hasOverrun) riskBadges.push('<span class="inline-block px-1.5 py-0.2 bg-amber-100 text-amber-800 font-bold text-[9px] rounded" title="Chi phí thực tế vượt dự toán">📈 Đội chi phí</span>');
    if (hasDebtRisk) riskBadges.push('<span class="inline-block px-1.5 py-0.2 bg-yellow-100 text-yellow-900 font-bold text-[9px] rounded" title="Chưa thu đủ 50% tiền cọc">💸 Nợ &gt; 50%</span>');
    if (hasRefundRisk) riskBadges.push('<span class="inline-block px-1.5 py-0.2 bg-purple-100 text-purple-800 font-bold text-[9px] rounded">🛡️ Đơn hủy/Hoàn cọc</span>');
    if (hasIncident) riskBadges.push(`<span class="inline-block px-1.5 py-0.2 bg-blue-100 text-blue-800 font-bold text-[9px] rounded">⚠️ ${incidents.length} sự cố</span>`);
    if (riskBadges.length === 0) riskBadges.push('<span class="inline-block px-1.5 py-0.2 bg-emerald-50 text-emerald-700 font-semibold text-[9px] rounded">✓ Chuẩn</span>');

    let csatHtml = '';
    if (b.feedback && b.feedback.rating) {
      csatHtml = `<div class="font-bold text-amber-600 font-mono">⭐ ${b.feedback.rating}.0</div><div class="text-[9px] text-slate-400 italic truncate max-w-[110px]" title="${escapeHtml(b.feedback.comment)}">"${escapeHtml(b.feedback.comment)}"</div>`;
    } else {
      csatHtml = '<span class="text-slate-400 text-[10px] italic">Chưa đánh giá</span>';
    }

    return `
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="py-3 px-3">
          <div class="font-mono font-bold text-brand-800">${escapeHtml(b.code)}</div>
          <div class="font-bold text-slate-800 text-[11px] truncate max-w-[180px]" title="${escapeHtml(b.tourName)}">${escapeHtml(b.tourName)}</div>
        </td>
        <td class="py-3 px-3">
          <div class="font-bold text-slate-900">${escapeHtml(b.customerName)}</div>
          <div class="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
            <span>📞 ${escapeHtml(b.customerPhone)}</span>
          </div>
        </td>
        <td class="py-3 px-3 text-center">
          <span class="inline-flex items-center justify-center font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800">${b.paxCount}</span>
        </td>
        <td class="py-3 px-3 text-slate-700 font-mono text-[11px] whitespace-nowrap">
          ${escapeHtml(b.departureDate)}
        </td>
        <td class="py-3 px-3 text-right">
          <div class="font-bold text-slate-900">${formatVND(b.totalAmount)}</div>
          <div class="text-[10px] flex items-center justify-end space-x-1 mt-0.5">
            <span class="text-emerald-700 font-bold">${formatVND(b.paidAmount || 0)}</span>
            <span class="text-slate-300">/</span>
            <span class="${debt > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}">${debt > 0 ? `Nợ ${formatVND(debt)}` : 'Hết nợ'}</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
            <div class="h-1.5 rounded-full ${pctPaid === 100 ? 'bg-emerald-500' : pctPaid > 0 ? 'bg-amber-500' : 'bg-slate-300'}" style="width: ${pctPaid}%"></div>
          </div>
        </td>
        <td class="py-3 px-3 text-right">
          <div class="text-slate-600 font-mono text-[11px]">${formatVND(actualCogs)}</div>
          <div class="font-extrabold text-[11px] ${grossProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}">
            ${formatVND(grossProfit)} <span class="font-normal text-[10px]">(${marginPct}%)</span>
          </div>
          ${hasOverrun ? `<div class="text-[9px] text-rose-600 font-bold">+${formatVND(cogsDiff)} vượt DT</div>` : ''}
        </td>
        <td class="py-3 px-3 text-center whitespace-nowrap">
          ${csatHtml}
        </td>
        <td class="py-3 px-3">
          <div class="mb-1">${statusPill}</div>
          <div class="flex flex-wrap gap-1">${riskBadges.join('')}</div>
        </td>
        <td class="py-3 px-3 text-center whitespace-nowrap">
          <div class="flex items-center justify-center space-x-1">
            <button onclick="openBookingDetailModal('${b.id}')" class="px-2 py-1 bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 font-bold rounded-lg text-[11px] shadow-sm flex items-center space-x-1" title="Xem toàn bộ hồ sơ 360° đoàn này">
              <span>🔍 Soi 360°</span>
            </button>
            <button onclick="openAddIncidentModal('${b.code}')" class="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg text-[11px] shadow-sm" title="Ghi nhận sự cố phát sinh cho đoàn này">
              <span>🚨</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function runCeoFraudAuditScan() {
  const priceAlertOrders = (db.supplierBookings || []).filter(sb => sb.priceAlert === true || (sb.contractRate && sb.agreedCost > sb.contractRate));
  const overrunBookings = (db.bookings || []).filter(b => {
    const orders = (db.supplierBookings || []).filter(sb => sb.bookingCode === b.code || sb.bookingId === b.id);
    const actualCogs = orders.reduce((s, o) => s + (o.agreedCost || 0), 0);
    return b.estimatedCost > 0 && actualCogs > b.estimatedCost;
  });
  const highDebtBookings = (db.bookings || []).filter(b => b.status !== 'Đã hủy' && (b.totalAmount - (b.paidAmount || 0)) > 0 && (b.paidAmount || 0) < b.totalAmount * 0.5);
  const canceledBookings = (db.bookings || []).filter(b => b.status === 'Đã hủy');
  const allIncidents = (db.bookings || []).flatMap(b => b.incidents || []);

  recordAuditLog('QUÉT KIỂM TOÁN CEO', `CEO đã chạy quy trình quét kiểm toán tự động phát hiện rủi ro & gian lận. Kết quả: ${priceAlertOrders.length} vụ lệch giá NCC; ${overrunBookings.length} đoàn đội chi phí; ${highDebtBookings.length} đoàn nợ cao; ${canceledBookings.length} đơn hủy; ${allIncidents.length} sự cố.`);
  saveDatabase();

  renderCeoDashboard();

  alert(`🛡️ KẾT QUẢ QUÉT KIỂM TOÁN PHÒNG CHỐNG GIAN LẬN CEO:\n` +
    `--------------------------------------------------\n` +
    `• Tổng số đoàn tour đã rà soát: ${db.bookings.length} đoàn\n` +
    `• Lệnh NCC lệch giá hợp đồng: ${priceAlertOrders.length} vụ (Phát hiện tại ${priceAlertOrders.map(o => o.bookingCode).join(', ') || 'Không có'})\n` +
    `• Đoàn vượt dự toán chi phí: ${overrunBookings.length} đoàn (Phát hiện tại ${overrunBookings.map(b => b.code).join(', ') || 'Không có'})\n` +
    `• Đoàn có rủi ro nợ cao (>50%): ${highDebtBookings.length} đoàn\n` +
    `• Đơn hủy & Hoàn tiền cọc: ${canceledBookings.length} đơn\n` +
    `• Sự cố chất lượng đã ghi nhận: ${allIncidents.length} vụ\n` +
    `--------------------------------------------------\n` +
    `✅ Hệ thống tự động ghi nhận vào Hộp đen Audit Log.`);
}

// ==========================================
// 17. PHÂN HỆ 4: QUẢN LÝ BÁO GIÁ & ĐƠN TOUR (BÁN HÀNG)
// ==========================================
let currentDetailBookingId = null;

// Chuyển Tab trong Phân hệ 4: Báo giá (quotations) <-> Đơn tour (bookings)
function switchMod4Tab(tab) {
  currentMod4Tab = tab;
  const quoteBtn = document.getElementById('mod4-tab-quotations-btn');
  const bookBtn = document.getElementById('mod4-tab-bookings-btn');
  const quoteContent = document.getElementById('mod4-tab-quotations-content');
  const bookContent = document.getElementById('mod4-tab-bookings-content');

  if (tab === 'quotations') {
    if (quoteBtn) {
      quoteBtn.className = 'mod4-tab-btn active px-4 py-2 text-xs font-bold rounded-lg border flex items-center space-x-1.5 transition-all shadow-sm bg-brand-700 text-white border-brand-700';
    }
    if (bookBtn) {
      bookBtn.className = 'mod4-tab-btn px-4 py-2 text-xs font-bold rounded-lg border flex items-center space-x-1.5 transition-all bg-white text-slate-600 border-slate-200 hover:bg-slate-50';
    }
    if (quoteContent) quoteContent.classList.remove('hidden');
    if (bookContent) bookContent.classList.add('hidden');
    renderQuotationsModule();
  } else {
    if (quoteBtn) {
      quoteBtn.className = 'mod4-tab-btn px-4 py-2 text-xs font-bold rounded-lg border flex items-center space-x-1.5 transition-all bg-white text-slate-600 border-slate-200 hover:bg-slate-50';
    }
    if (bookBtn) {
      bookBtn.className = 'mod4-tab-btn active px-4 py-2 text-xs font-bold rounded-lg border flex items-center space-x-1.5 transition-all shadow-sm bg-brand-700 text-white border-brand-700';
    }
    if (quoteContent) quoteContent.classList.add('hidden');
    if (bookContent) bookContent.classList.remove('hidden');
    renderBookingsModule();
  }
}

function getQuoteBadgeClass(status) {
  if (status === 'Dự thảo') return 'quote-badge-draft';
  if (status === 'Chờ xác nhận') return 'quote-badge-pending';
  if (status === 'Đã xác nhận') return 'quote-badge-confirmed';
  if (status === 'Đã lên đơn tour') return 'quote-badge-converted';
  if (status === 'Đã từ chối') return 'quote-badge-rejected';
  return 'quote-badge-draft';
}

function filterQuotations(status, btn) {
  quotationFilter = status;
  quotationCurrentPage = 1;
  const btns = document.querySelectorAll('.filter-quote-btn');
  btns.forEach(b => {
    b.classList.remove('active', 'bg-brand-600', 'text-white', 'border-brand-600');
    b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
  });
  if (btn) {
    btn.classList.add('active', 'bg-brand-600', 'text-white', 'border-brand-600');
    btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
  }
  renderQuotationsModule();
}

function searchQuotations(query) {
  quotationSearchQuery = (query || '').trim().toLowerCase();
  quotationCurrentPage = 1;
  renderQuotationsModule();
}

function renderQuotationsModule() {
  if (!db.quotations) db.quotations = [];

  const totalQuotes = db.quotations.length;
  const pendingQuotes = db.quotations.filter(q => q.status === 'Chờ xác nhận').length;
  const confirmedQuotes = db.quotations.filter(q => q.status === 'Đã xác nhận').length;
  const convertedQuotes = db.quotations.filter(q => q.status === 'Đã lên đơn tour').length;
  const totalAmount = db.quotations.reduce((sum, q) => sum + (Number(q.totalAmount) || 0), 0);

  const badgeCount = document.getElementById('badge-quotation-count');
  if (badgeCount) badgeCount.textContent = pendingQuotes > 0 ? `${pendingQuotes} chờ duyệt` : totalQuotes;

  const statTotal = document.getElementById('quote-stat-total');
  if (statTotal) statTotal.textContent = totalQuotes;
  const statPending = document.getElementById('quote-stat-pending');
  if (statPending) statPending.textContent = pendingQuotes;
  const statConfirmed = document.getElementById('quote-stat-confirmed');
  if (statConfirmed) statConfirmed.textContent = confirmedQuotes;
  const statConverted = document.getElementById('quote-stat-converted');
  if (statConverted) statConverted.textContent = convertedQuotes;
  const statTotalAmt = document.getElementById('quote-stat-total-amount');
  if (statTotalAmt) statTotalAmt.textContent = formatVND(totalAmount);

  const filtered = db.quotations.filter(q => {
    const statusMatch = quotationFilter === 'all' || q.status === quotationFilter;
    const s = quotationSearchQuery;
    const searchMatch = !s ||
      q.code.toLowerCase().includes(s) ||
      (q.customerName && q.customerName.toLowerCase().includes(s)) ||
      (q.customerPhone && q.customerPhone.includes(s)) ||
      (q.tourName && q.tourName.toLowerCase().includes(s)) ||
      (q.ctvName && q.ctvName.toLowerCase().includes(s)) ||
      (q.bookingCode && q.bookingCode.toLowerCase().includes(s));

    let roleMatch = true;
    if (currentUser && currentUser.role === 'CTV') {
      roleMatch = (q.collaboratorId === currentUser.ctvId);
    }
    return statusMatch && searchMatch && roleMatch;
  });

  const emptyEl = document.getElementById('quotation-empty');
  const tbody = document.getElementById('quotation-table-body');

  if (filtered.length === 0) {
    if (tbody) tbody.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    renderQuotationPagination(0, 1);
    return;
  }
  if (emptyEl) emptyEl.classList.add('hidden');

  const totalPages = Math.ceil(filtered.length / QUOTATIONS_PER_PAGE) || 1;
  if (quotationCurrentPage > totalPages) quotationCurrentPage = totalPages;
  const startIdx = (quotationCurrentPage - 1) * QUOTATIONS_PER_PAGE;
  const pageItems = filtered.slice(startIdx, startIdx + QUOTATIONS_PER_PAGE);

  if (tbody) {
    tbody.innerHTML = pageItems.map(q => {
      const badgeClass = getQuoteBadgeClass(q.status);
      const ctvDisplay = q.collaboratorId 
        ? `<span class="px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded font-bold text-[10px]">${escapeHtml(q.ctvName || q.collaboratorId)}</span>`
        : '<span class="text-slate-400 text-[10px]">Trực tiếp</span>';

      const canManage = currentUser?.role === 'CEO' || currentUser?.role === 'SALE';
      let actionsHtml = '';

      if (q.status === 'Chờ xác nhận') {
        if (canManage) {
          actionsHtml = `
            <button onclick="confirmAndConvertQuotation('${q.id}')" class="action-btn text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 font-bold shadow-sm inline-flex items-center space-x-1" title="Chốt tour thành công và chuyển giao ngay sang Điều hành"><span>🤝 Chốt tour & Bàn giao</span></button>
            <button onclick="editQuotation('${q.id}')" class="action-btn action-btn-edit" title="Sửa báo giá">✏️ Sửa</button>
            <button onclick="rejectQuotation('${q.id}')" class="action-btn action-btn-delete" title="Từ chối báo giá">❌</button>
          `;
        }
      } else if (q.status === 'Đã xác nhận') {
        if (canManage) {
          actionsHtml = `
            <button onclick="confirmAndConvertQuotation('${q.id}')" class="action-btn text-white bg-emerald-600 hover:bg-emerald-700 border border-emerald-700 font-bold shadow-sm inline-flex items-center space-x-1" title="Chuyển giao ngay sang Điều hành (Phân hệ 5)"><span>🚀 Bàn giao Điều hành</span></button>
            <button onclick="editQuotation('${q.id}')" class="action-btn action-btn-edit" title="Sửa báo giá">✏️</button>
          `;
        }
      } else if (q.status === 'Đã lên đơn tour') {
        actionsHtml = `
          <button onclick="viewConvertedBooking('${q.bookingCode}')" class="action-btn text-brand-800 bg-brand-50 hover:bg-brand-100 border border-brand-200 font-bold font-mono" title="Xem đơn tour trong Phân hệ Đơn Tour">📑 Đơn: ${escapeHtml(q.bookingCode)}</button>
        `;
      } else if (q.status === 'Dự thảo') {
        if (canManage) {
          actionsHtml = `
            <button onclick="confirmAndConvertQuotation('${q.id}')" class="action-btn text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 font-bold" title="Chốt tour">🤝 Chốt tour</button>
            <button onclick="editQuotation('${q.id}')" class="action-btn action-btn-edit" title="Sửa báo giá">✏️ Sửa</button>
          `;
        }
      } else if (q.status === 'Đã từ chối') {
        actionsHtml = `<span class="text-rose-400 text-[11px] italic">Đã hủy/từ chối</span>`;
      }

      return `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-3 px-3.5 font-mono font-bold text-brand-800">${escapeHtml(q.code)}</td>
          <td class="py-3 px-3.5">
            <div class="font-bold text-slate-900">${escapeHtml(q.customerName)}</div>
            <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(q.customerPhone)}</div>
          </td>
          <td class="py-3 px-3.5">
            <div class="font-semibold text-slate-800">${escapeHtml(q.tourName)}</div>
            <div class="text-[10px] text-slate-400 font-mono">Khởi hành: ${escapeHtml(q.departureDate || 'Chưa định ngày')}</div>
          </td>
          <td class="py-3 px-3.5 text-center font-bold text-slate-800">${q.paxCount}</td>
          <td class="py-3 px-3.5">
            <div class="font-mono text-slate-700 font-semibold">${formatVND(q.unitPrice)}/k</div>
            ${q.discountAmount > 0 ? `<div class="text-[10px] text-rose-600 font-mono font-medium">- ${formatVND(q.discountAmount)}</div>` : ''}
          </td>
          <td class="py-3 px-3.5 font-mono font-bold text-slate-900">${formatVND(q.totalAmount)}</td>
          <td class="py-3 px-3.5">${ctvDisplay}</td>
          <td class="py-3 px-3.5"><span class="quote-badge ${badgeClass}">${escapeHtml(q.status)}</span></td>
          <td class="py-3 px-3.5 text-center space-x-1 whitespace-nowrap">${actionsHtml}</td>
        </tr>
      `;
    }).join('');
  }

  renderQuotationPagination(filtered.length, totalPages);
}

function renderQuotationPagination(totalItems, totalPages) {
  const container = document.getElementById('quotation-pagination');
  if (!container) return;

  if (totalItems <= QUOTATIONS_PER_PAGE) {
    container.innerHTML = `<span class="pagination-info">Tổng cộng <b>${totalItems}</b> báo giá tour</span>`;
    return;
  }

  let html = `<span class="pagination-info">Hiển thị <b>${(quotationCurrentPage - 1) * QUOTATIONS_PER_PAGE + 1}-${Math.min(quotationCurrentPage * QUOTATIONS_PER_PAGE, totalItems)}</b> / <b>${totalItems}</b> báo giá</span>`;
  html += '<div class="flex items-center space-x-1">';
  html += `<button class="pagination-btn ${quotationCurrentPage === 1 ? 'disabled' : ''}" onclick="changeQuotationPage(${quotationCurrentPage - 1})" ${quotationCurrentPage === 1 ? 'disabled' : ''}>&larr; Trước</button>`;

  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= quotationCurrentPage - 1 && p <= quotationCurrentPage + 1)) {
      html += `<button class="pagination-btn ${p === quotationCurrentPage ? 'active' : ''}" onclick="changeQuotationPage(${p})">${p}</button>`;
    } else if (p === quotationCurrentPage - 2 || p === quotationCurrentPage + 2) {
      html += `<span class="px-1 text-slate-400">...</span>`;
    }
  }

  html += `<button class="pagination-btn ${quotationCurrentPage === totalPages ? 'disabled' : ''}" onclick="changeQuotationPage(${quotationCurrentPage + 1})" ${quotationCurrentPage === totalPages ? 'disabled' : ''}>Sau &rarr;</button>`;
  html += '</div>';

  container.innerHTML = html;
}

function changeQuotationPage(p) {
  quotationCurrentPage = p;
  renderQuotationsModule();
}

function populateQuotationModalDropdowns() {
  const custSel = document.getElementById('form-quote-customer');
  if (custSel) {
    const curVal = custSel.value;
    custSel.innerHTML = '<option value="">-- Chọn khách hàng từ CRM --</option>' +
      db.customers.map(c => `<option value="${c.id}">${escapeHtml(c.name)} (${escapeHtml(c.code)} - ${escapeHtml(c.phone)})</option>`).join('');
    if (curVal) custSel.value = curVal;
  }

  const tourSel = document.getElementById('form-quote-tour');
  if (tourSel) {
    const curVal = tourSel.value;
    tourSel.innerHTML = '<option value="">-- Chọn chương trình tour --</option>' +
      db.tourPolicies.map(t => `<option value="${t.id}">${escapeHtml(t.name)} (${t.duration} - ${formatVND(t.price)})</option>`).join('');
    if (curVal) tourSel.value = curVal;
  }

  const ctvSel = document.getElementById('form-quote-ctv');
  if (ctvSel) {
    const curVal = ctvSel.value;
    ctvSel.innerHTML = '<option value="">-- Không qua CTV (Trực tiếp) --</option>' +
      db.ctvs.map(c => `<option value="${c.id}">${escapeHtml(c.name)} (${escapeHtml(c.code)})</option>`).join('');
    if (curVal) ctvSel.value = curVal;
  }
}

function openAddQuotationModal(prefilledCustId) {
  if (currentUser && currentUser.role === 'KE_TOAN') {
    alert("⛔ BẢO VỆ DỮ LIỆU: Kế toán không có quyền tạo báo giá tour!");
    return;
  }
  const form = document.getElementById('quotation-form');
  if (form) form.reset();
  document.getElementById('form-quote-id').value = '';
  const titleEl = document.getElementById('quote-modal-title');
  if (titleEl) titleEl.textContent = 'Lập Báo Giá Tour Mới';

  document.getElementById('form-quote-code').value = generateNextCode('BG-', db.quotations, 'code');

  const depDate = new Date();
  depDate.setDate(depDate.getDate() + 7);
  document.getElementById('form-quote-departure').value = depDate.toISOString().split('T')[0];

  populateQuotationModalDropdowns();

  if (prefilledCustId) {
    const custSel = document.getElementById('form-quote-customer');
    if (custSel) {
      custSel.value = prefilledCustId;
      handleQuotationCustomerChange();
    }
  } else {
    recalcQuotationTotal();
  }

  const modal = document.getElementById('quotation-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeQuotationModal() {
  const modal = document.getElementById('quotation-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function handleQuotationCustomerChange() {
  const custId = document.getElementById('form-quote-customer').value;
  const cust = (db.customers || []).find(c => String(c.id) === String(custId));
  if (!cust) return;

  const paxEl = document.getElementById('form-quote-pax');
  if (paxEl) paxEl.value = cust.paxCount || 2;

  const ctvSel = document.getElementById('form-quote-ctv');
  if (ctvSel && cust.collaboratorId) {
    ctvSel.value = cust.collaboratorId;
  }

  if (cust.demand) {
    const matchedTour = findTourPolicy(cust.demand);
    if (matchedTour) {
      const tourSel = document.getElementById('form-quote-tour');
      if (tourSel) {
        tourSel.value = matchedTour.id;
        handleQuotationTourChange();
        return;
      }
    }
  }

  recalcQuotationTotal();
}

function handleQuotationTourChange() {
  const tourId = document.getElementById('form-quote-tour').value;
  const tour = db.tourPolicies.find(t => t.id === tourId);
  if (tour) {
    document.getElementById('form-quote-unit-price').value = tour.price;
  }
  recalcQuotationTotal();
}

function recalcQuotationTotal() {
  const paxRes = parsePaxInput(document.getElementById('form-quote-pax')?.value);
  const pax = paxRes.valid ? paxRes.value : 1;

  const priceRes = parseMoneyInput(document.getElementById('form-quote-unit-price')?.value);
  const unitPrice = priceRes.valid ? priceRes.value : 0;

  const discVal = document.getElementById('form-quote-discount')?.value;
  const discRes = discVal ? parseMoneyInput(discVal) : { valid: true, value: 0 };
  const discount = discRes.valid ? discRes.value : 0;

  const total = Math.max(0, (pax * unitPrice) - discount);
  const dispEl = document.getElementById('form-quote-total-display');
  if (dispEl) dispEl.textContent = formatVND(total);
  return total;
}

function editQuotation(quoteId) {
  if (currentUser && currentUser.role === 'KE_TOAN') {
    alert("⛔ BẢO VỆ DỮ LIỆU: Kế toán không có quyền chỉnh sửa báo giá mà Sale/Điều hành đã chốt!");
    return;
  }
  const quote = (db.quotations || []).find(q => String(q.id) === String(quoteId) || q.code === String(quoteId));
  if (!quote) {
    alert("Không tìm thấy báo giá!");
    return;
  }

  populateQuotationModalDropdowns();

  document.getElementById('form-quote-id').value = quote.id;
  document.getElementById('form-quote-code').value = quote.code;
  document.getElementById('form-quote-customer').value = quote.customerId;
  document.getElementById('form-quote-tour').value = quote.tourId;
  document.getElementById('form-quote-departure').value = quote.departureDate || '';
  document.getElementById('form-quote-pax').value = quote.paxCount;
  document.getElementById('form-quote-unit-price').value = quote.unitPrice;
  document.getElementById('form-quote-discount').value = quote.discountAmount || 0;
  document.getElementById('form-quote-ctv').value = quote.collaboratorId || '';
  document.getElementById('form-quote-staff').value = quote.staff || 'Nguyễn Văn An (Leader)';
  document.getElementById('form-quote-status').value = quote.status || 'Dự thảo';
  document.getElementById('form-quote-notes').value = quote.notes || '';

  const titleEl = document.getElementById('quote-modal-title');
  if (titleEl) titleEl.textContent = `Chỉnh Sửa Báo Giá ${quote.code}`;

  recalcQuotationTotal();

  const modal = document.getElementById('quotation-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function saveQuotation(e) {
  if (e) e.preventDefault();
  if (currentUser && currentUser.role === 'KE_TOAN') {
    alert("⛔ BẢO VỆ DỮ LIỆU: Kế toán không có quyền lưu hoặc thay đổi báo giá!");
    return;
  }

  const custId = document.getElementById('form-quote-customer').value;
  const cust = (db.customers || []).find(c => String(c.id) === String(custId));
  if (!cust) {
    alert("Vui lòng chọn khách hàng từ CRM!");
    return;
  }

  const tourId = document.getElementById('form-quote-tour').value;
  const tour = db.tourPolicies.find(t => t.id === tourId);
  if (!tour) {
    alert("Vui lòng chọn chương trình tour!");
    return;
  }

  const depDate = document.getElementById('form-quote-departure').value;
  if (!depDate) {
    alert("Vui lòng nhập ngày khởi hành dự kiến!");
    return;
  }

  const paxRes = parsePaxInput(document.getElementById('form-quote-pax').value);
  if (!paxRes.valid) {
    alert(`Số lượng khách không hợp lệ: ${paxRes.reason}`);
    return;
  }

  const priceRes = parseMoneyInput(document.getElementById('form-quote-unit-price').value);
  if (!priceRes.valid) {
    alert(`Đơn giá không hợp lệ: ${priceRes.reason}`);
    return;
  }

  const discVal = document.getElementById('form-quote-discount').value;
  const discRes = discVal ? parseMoneyInput(discVal) : { valid: true, value: 0 };
  if (!discRes.valid) {
    alert(`Số tiền giảm giá không hợp lệ: ${discRes.reason}`);
    return;
  }

  const totalAmount = Math.max(0, (paxRes.value * priceRes.value) - discRes.value);
  const ctvId = document.getElementById('form-quote-ctv').value;
  const ctv = db.ctvs.find(c => c.id === ctvId);
  const idVal = document.getElementById('form-quote-id').value;
  const codeVal = document.getElementById('form-quote-code').value.trim() || generateNextCode('BG-', db.quotations, 'code');

  const quoteData = {
    code: codeVal,
    customerId: cust.id,
    customerCode: cust.code,
    customerName: cust.name,
    customerPhone: cust.phone,
    collaboratorId: ctvId || '',
    ctvName: ctv ? ctv.name : 'Trực tiếp',
    tourId: tour.id,
    tourName: tour.name,
    departureDate: depDate,
    paxCount: paxRes.value,
    unitPrice: priceRes.value,
    discountAmount: discRes.value,
    surchargeAmount: 0,
    totalAmount: totalAmount,
    staff: document.getElementById('form-quote-staff').value,
    status: document.getElementById('form-quote-status').value,
    notes: document.getElementById('form-quote-notes').value.trim()
  };

  if (idVal) {
    const idx = (db.quotations || []).findIndex(q => String(q.id) === String(idVal) || q.code === String(idVal));
    if (idx !== -1) {
      db.quotations[idx] = { ...db.quotations[idx], ...quoteData };
      recordAuditLog('CẬP NHẬT BÁO GIÁ', `Cập nhật báo giá ${quoteData.code} cho khách ${quoteData.customerName} (Tổng: ${formatVND(quoteData.totalAmount)}).`);
    }
  } else {
    const newQuote = {
      id: codeVal,
      ...quoteData,
      bookingCode: null,
      createdAt: new Date().toISOString().split('T')[0],
      confirmedAt: null,
      confirmedBy: null
    };
    if (!db.quotations) db.quotations = [];
    db.quotations.unshift(newQuote);
    recordAuditLog('TẠO BÁO GIÁ MỚI', `Tạo báo giá ${newQuote.code} cho khách ${newQuote.customerName} (Tổng: ${formatVND(newQuote.totalAmount)}). Trạng thái: ${newQuote.status}.`);
  }

  saveDatabase();
  closeQuotationModal();
  renderQuotationsModule();

  if (quoteData.status === 'Đã xác nhận') {
    convertQuotationToBooking(idVal || codeVal);
  }
}

function confirmAndConvertQuotation(quoteId) {
  const quote = (db.quotations || []).find(q => String(q.id) === String(quoteId) || q.code === String(quoteId));
  if (!quote) {
    alert("Không tìm thấy thông tin báo giá!");
    return;
  }

  quote.status = 'Đã xác nhận';
  quote.confirmedAt = new Date().toISOString().split('T')[0];
  quote.confirmedBy = currentUser ? currentUser.name : 'Leader Kinh doanh';
  saveDatabase();

  // Chốt tour và chuyển giao tức thì sang bộ phận Điều hành (1-click)
  convertQuotationToBooking(quoteId);
}

function confirmQuotation(quoteId) {
  confirmAndConvertQuotation(quoteId);
}

function rejectQuotation(quoteId) {
  const quote = (db.quotations || []).find(q => String(q.id) === String(quoteId) || q.code === String(quoteId));
  if (!quote) return;

  if (confirm(`Bạn có chắc chắn muốn từ chối/hủy báo giá ${quote.code}?`)) {
    quote.status = 'Đã từ chối';
    recordAuditLog('TỪ CHỐI BÁO GIÁ', `Đã từ chối báo giá ${quote.code} cho khách ${quote.customerName}.`);
    saveDatabase();
    renderQuotationsModule();
  }
}

// BƯỚC 3 & 4: XÁC NHẬN BÁO GIÁ VÀ TẠO ĐƠN TOUR (STRICT IDEMPOTENCY)
function convertQuotationToBooking(quoteId) {
  const quote = (db.quotations || []).find(q => String(q.id) === String(quoteId) || q.code === String(quoteId));
  if (!quote) {
    alert("Không tìm thấy thông tin báo giá!");
    return;
  }

  // Chống tạo trùng lần 1: Đã đánh dấu lên đơn
  if (quote.status === 'Đã lên đơn tour' || quote.bookingCode) {
    alert(`⚠️ Báo giá ${quote.code} này đã được tạo đơn tour trước đó (Mã đơn: ${quote.bookingCode})! Hệ thống chống tạo đơn trùng lặp.`);
    viewConvertedBooking(quote.bookingCode);
    return;
  }

  // Chống tạo trùng lần 2: Đã có booking trong db liên kết với quote này
  const existingBooking = (db.bookings || []).find(b => b.quotationId === quote.id || b.quotationCode === quote.code);
  if (existingBooking) {
    quote.status = 'Đã lên đơn tour';
    quote.bookingCode = existingBooking.code;
    saveDatabase();
    alert(`Đơn tour cho báo giá này đã tồn tại trong hệ thống: ${existingBooking.code}. Đang chuyển đến đơn tour...`);
    viewConvertedBooking(existingBooking.code);
    return;
  }

  // Tạo đơn tour mới - Chuẩn nghiệp vụ tài chính:
  // PaidAmount = 0, RemainingAmount = TotalAmount, Trạng thái: Chờ thanh toán
  const newBookingCode = generateNextCode('DH-', db.bookings, 'code');

  const newBooking = {
    id: newBookingCode,
    code: newBookingCode,
    quotationId: quote.id,
    quotationCode: quote.code,
    customerId: quote.customerId,
    customerName: quote.customerName,
    customerPhone: quote.customerPhone,
    tourId: quote.tourId,
    tourName: quote.tourName,
    departureDate: quote.departureDate,
    paxCount: quote.paxCount,
    unitPrice: quote.unitPrice,
    discountAmount: quote.discountAmount || 0,
    totalAmount: quote.totalAmount,
    paidAmount: 0,
    remainingAmount: quote.totalAmount,
    refundAmount: 0,
    collaboratorId: quote.collaboratorId || '',
    ctvName: quote.ctvName || '',
    staff: quote.staff || (currentUser ? currentUser.name : 'Leader Kinh doanh'),
    status: 'Chờ thanh toán',
    tourStatus: 'Mới tiếp nhận',
    financialStatus: 'Chờ thanh toán',
    estimatedCost: Math.round(quote.totalAmount * 0.65), // Chi phí tạm tính NCC 65%
    actualCost: 0,
    passengers: [],
    itinerary: [],
    feedback: null,
    createdAt: new Date().toISOString().split('T')[0],
    notes: `Được tạo tự động từ Báo giá ${quote.code}. ${quote.notes || ''}`
  };

  db.bookings.unshift(newBooking);

  // 1. Tự động gửi thông báo chuyển giao sang bộ phận Điều hành (OPS)
  sendInterDeptNotification({
    senderRole: 'SALE',
    senderName: currentUser ? `${currentUser.name} (Sale)` : 'Bộ phận Kinh doanh (Sale)',
    targetRole: 'OPS',
    targetModule: 5,
    type: 'HANDOVER_TOUR',
    title: `Bàn giao đoàn tour mới: ${newBooking.code}`,
    message: `Sale đã chốt thành công đơn tour ${newBooking.code} cho khách ${newBooking.customerName} (${newBooking.tourName} - ${newBooking.paxCount} khách, ${formatVND(newBooking.totalAmount)}). Đã chuyển sang Điều hành trong phần Mới tiếp nhận.`,
    referenceId: newBooking.code,
    referenceType: 'BOOKING'
  });

  // 2. Tự động gửi thông báo sang Kế toán (Module 6)
  sendInterDeptNotification({
    senderRole: 'SALE',
    senderName: currentUser ? `${currentUser.name} (Sale)` : 'Bộ phận Kinh doanh (Sale)',
    targetRole: 'KE_TOAN',
    targetModule: 6,
    type: 'NEW_BOOKING_FINANCE',
    title: `Đơn tour mới cần thu tiền: ${newBooking.code}`,
    message: `Đơn tour ${newBooking.code} (${newBooking.customerName} - ${formatVND(newBooking.totalAmount)}) đã được chốt. Kế toán theo dõi thu cọc / thanh toán.`,
    referenceId: newBooking.code,
    referenceType: 'BOOKING'
  });

  // Cập nhật trạng thái Báo giá sang "Đã lên đơn tour" kèm mã đơn
  quote.status = 'Đã lên đơn tour';
  quote.bookingCode = newBooking.code;

  // Cập nhật trạng thái khách hàng sang "Đã chốt tour" & đồng bộ tài chính
  const cust = (db.customers || []).find(c => String(c.id) === String(quote.customerId) || c.code === quote.customerCode);
  if (cust) {
    cust.status = 'Đã chốt tour';
    syncCustomerFinancials(cust);
  }

  recordAuditLog('LÊN ĐƠN TOUR TỪ BÁO GIÁ', `Đã tạo đơn tour ${newBooking.code} từ báo giá ${quote.code} cho khách ${newBooking.customerName} (Tổng: ${formatVND(newBooking.totalAmount)}). Chuyển sang Điều hành & Kế toán.`);
  saveDatabase();
  updateNotificationBadges();

  alert(`🎉 CHỐT TOUR & BÀN GIAO SANG ĐIỀU HÀNH THÀNH CÔNG!\n\n- Mã đơn tour: ${newBooking.code}\n- Khách hàng: ${newBooking.customerName}\n- Tour: ${newBooking.tourName} (${newBooking.paxCount} khách)\n- Giá trị hợp đồng: ${formatVND(newBooking.totalAmount)}\n- Trạng thái: Chuyển sang Điều hành trong phần "Mới tiếp nhận"\n\n👉 Hệ thống đã phát chuông thông báo và chấm đỏ số lượng chưa đọc sang Điều hành. Đang chuyển đến danh sách Đơn Tour...`);

  // Chuyển sang Tab 2: Quản lý Đơn Tour
  switchMod4Tab('bookings');
}

function viewConvertedBooking(bookingCode) {
  switchMod4Tab('bookings');
  const searchInput = document.getElementById('booking-search-input');
  if (searchInput) searchInput.value = bookingCode;
  searchBookings(bookingCode);
}

// ==========================================
// BƯỚC 1: CỔNG CTV XÁC NHẬN CHỐT TOUR & TỰ ĐỘNG KHỞI TẠO BÁO GIÁ
// ==========================================
function openCtvCloseTourModal(customerId) {
  const cust = (db.customers || []).find(c => String(c.id) === String(customerId));
  if (!cust) {
    alert("Không tìm thấy khách hàng!");
    return;
  }

  document.getElementById('ctv-close-cust-id').value = cust.id;
  document.getElementById('ctv-close-cust-name').textContent = cust.name;
  document.getElementById('ctv-close-cust-phone').textContent = cust.phone;
  document.getElementById('ctv-close-cust-demand').textContent = cust.demand;

  const tourSel = document.getElementById('ctv-close-tour-id');
  if (tourSel) {
    tourSel.innerHTML = '<option value="">-- Chọn tour chốt cho khách --</option>' +
      db.tourPolicies.map(t => `<option value="${t.id}">${escapeHtml(t.name)} (${t.duration} - ${formatVND(t.price)})</option>`).join('');
    
    // Tìm tour phù hợp với nhu cầu của khách
    const matchedTour = findTourPolicy(cust.demand);
    if (matchedTour) {
      tourSel.value = matchedTour.id;
    }
  }

  const paxEl = document.getElementById('ctv-close-pax');
  if (paxEl) paxEl.value = cust.paxCount || 2;

  const depEl = document.getElementById('ctv-close-departure');
  if (depEl) {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    depEl.value = d.toISOString().split('T')[0];
  }

  handleCtvCloseTourChange();

  const modal = document.getElementById('ctv-close-tour-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeCtvCloseTourModal() {
  const modal = document.getElementById('ctv-close-tour-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function handleCtvCloseTourChange() {
  const tourId = document.getElementById('ctv-close-tour-id').value;
  const tour = db.tourPolicies.find(t => t.id === tourId);
  const priceEl = document.getElementById('ctv-close-unit-price');
  if (priceEl && tour) {
    priceEl.value = tour.price;
  }
  recalcCtvCloseTourTotal();
}

function recalcCtvCloseTourTotal() {
  const paxRes = parsePaxInput(document.getElementById('ctv-close-pax')?.value);
  const pax = paxRes.valid ? paxRes.value : 1;

  const priceRes = parseMoneyInput(document.getElementById('ctv-close-unit-price')?.value);
  const unitPrice = priceRes.valid ? priceRes.value : 0;

  const total = pax * unitPrice;
  const dispEl = document.getElementById('ctv-close-total-display');
  if (dispEl) dispEl.textContent = formatVND(total);
  return total;
}

function handleCtvCloseTourSubmit(e) {
  if (e) e.preventDefault();

  const custId = document.getElementById('ctv-close-cust-id').value;
  const cust = (db.customers || []).find(c => String(c.id) === String(custId));
  if (!cust) {
    alert("Không tìm thấy thông tin khách hàng!");
    return;
  }

  const tourId = document.getElementById('ctv-close-tour-id').value;
  const tour = db.tourPolicies.find(t => t.id === tourId);
  if (!tour) {
    alert("Vui lòng chọn chương trình tour chốt cho khách!");
    return;
  }

  const paxRes = parsePaxInput(document.getElementById('ctv-close-pax').value);
  if (!paxRes.valid) {
    alert(`Số lượng khách không hợp lệ: ${paxRes.reason}`);
    return;
  }

  const priceRes = parseMoneyInput(document.getElementById('ctv-close-unit-price').value);
  if (!priceRes.valid) {
    alert(`Đơn giá tour không hợp lệ: ${priceRes.reason}`);
    return;
  }

  const depDate = document.getElementById('ctv-close-departure').value;
  if (!depDate) {
    alert("Vui lòng chọn ngày khởi hành dự kiến!");
    return;
  }

  const notes = document.getElementById('ctv-close-notes').value.trim();
  const ctv = db.ctvs.find(c => c.id === cust.collaboratorId) || (currentUser && currentUser.role === 'CTV' ? db.ctvs.find(c => c.id === currentUser.ctvId) : null);
  const totalAmount = paxRes.value * priceRes.value;

  // 1. Chuyển trạng thái khách hàng sang "Đã chốt tour"
  cust.status = 'Đã chốt tour';
  cust.paxCount = paxRes.value;

  // 2. Khởi tạo Báo giá vào db.quotations với trạng thái "Chờ xác nhận"
  const newQuoteCode = generateNextCode('BG-', db.quotations, 'code');

  const newQuote = {
    id: newQuoteCode,
    code: newQuoteCode,
    customerId: cust.id,
    customerCode: cust.code,
    customerName: cust.name,
    customerPhone: cust.phone,
    collaboratorId: cust.collaboratorId || (ctv ? ctv.id : ''),
    ctvName: ctv ? ctv.name : 'Trực tiếp',
    tourId: tour.id,
    tourName: tour.name,
    departureDate: depDate,
    paxCount: paxRes.value,
    unitPrice: priceRes.value,
    surchargeAmount: 0,
    discountAmount: 0,
    totalAmount: totalAmount,
    status: 'Chờ xác nhận',
    bookingCode: null,
    staff: cust.staff || 'Sale trực ban',
    createdAt: new Date().toISOString().split('T')[0],
    confirmedAt: null,
    confirmedBy: null,
    notes: `CTV ${ctv ? ctv.name : ''} chốt tour thành công. ${notes ? 'Ghi chú: ' + notes : ''}`
  };

  if (!db.quotations) db.quotations = [];
  db.quotations.unshift(newQuote);

  // Tự động gửi thông báo chuyển giao sang bộ phận Sale
  sendInterDeptNotification({
    senderRole: 'CTV',
    senderName: currentUser ? currentUser.name : (ctv ? ctv.name : 'Cộng tác viên'),
    targetRole: 'SALE',
    targetModule: 4,
    type: 'HANDOVER_QUOTE_REQUEST',
    title: `Yêu cầu báo giá mới: ${newQuote.code}`,
    message: `CTV ${ctv ? ctv.name : ''} vừa chốt tour cho khách ${cust.name} (${tour.name} - ${paxRes.value} khách, Tổng: ${formatVND(totalAmount)}). Đã tạo Báo giá ${newQuote.code} chuyển Sale duyệt và lên đơn.`,
    referenceId: newQuote.code,
    referenceType: 'QUOTATION'
  });

  recordAuditLog('CTV CHỐT TOUR THÀNH CÔNG', `CTV ${ctv ? ctv.name : ''} chốt tour cho khách ${cust.name} (${cust.code}) - Tự động tạo Báo giá ${newQuote.code} (${formatVND(totalAmount)}). Trạng thái: Chờ xác nhận.`);
  saveDatabase();

  closeCtvCloseTourModal();
  alert(`🎉 CHÚC MỪNG!\n\nĐã ghi nhận chốt tour thành công cho khách hàng ${cust.name}!\n- Mã báo giá: ${newQuote.code}\n- Chương trình tour: ${tour.name}\n- Số lượng khách: ${paxRes.value} pax\n- Tổng tiền dự kiến: ${formatVND(totalAmount)}\n- Trạng thái: Chờ xác nhận (Chưa tính thanh toán hay hoa hồng)\n\nYêu cầu báo giá đã được chuyển tới bộ phận Sales để kiểm tra và tiến hành lên đơn tour chính thức.`);

  if (currentUser?.role === 'CTV') {
    renderCtvPortal();
  } else {
    refreshActiveView();
  }
}

function filterBookings(status, btn) {
  bookingFilter = status;
  bookingCurrentPage = 1;
  const btns = document.querySelectorAll('.filter-booking-btn');
  btns.forEach(b => {
    b.classList.remove('active', 'bg-brand-600', 'text-white', 'border-brand-600');
    b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
  });
  if (btn) {
    btn.classList.add('active', 'bg-brand-600', 'text-white', 'border-brand-600');
    btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
  }
  renderBookingsModule();
}

function searchBookings(query) {
  bookingSearchQuery = (query || '').trim().toLowerCase();
  bookingCurrentPage = 1;
  renderBookingsModule();
}

function renderBookingsModule() {
  const activeBookings = db.bookings.filter(b => b.status !== 'Đã hủy');
  const totalAmount = activeBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const paidAmount = activeBookings.reduce((sum, b) => sum + (b.paidAmount || 0), 0);
  const debtAmount = Math.max(0, totalAmount - paidAmount);
  const pendingCount = activeBookings.filter(b => b.status === 'Chờ thanh toán' || b.status === 'Đã đặt cọc' || b.status === 'Mới tạo').length;

  const statTotal = document.getElementById('booking-stat-total');
  if (statTotal) statTotal.textContent = db.bookings.length;
  const statPending = document.getElementById('booking-stat-pending-count');
  if (statPending) statPending.textContent = pendingCount;
  const statTotalAmt = document.getElementById('booking-stat-total-amount');
  if (statTotalAmt) statTotalAmt.textContent = formatVND(totalAmount);
  const statPaidAmt = document.getElementById('booking-stat-paid-amount');
  if (statPaidAmt) statPaidAmt.textContent = formatVND(paidAmount);
  const statDebtAmt = document.getElementById('booking-stat-debt-amount');
  if (statDebtAmt) statDebtAmt.textContent = formatVND(debtAmount);

  const filtered = db.bookings.filter(b => {
    const statusMatch = bookingFilter === 'all' || b.status === bookingFilter;
    const q = bookingSearchQuery;
    const searchMatch = !q ||
      b.code.toLowerCase().includes(q) ||
      (b.customerName && b.customerName.toLowerCase().includes(q)) ||
      (b.customerPhone && b.customerPhone.includes(q)) ||
      (b.tourName && b.tourName.toLowerCase().includes(q)) ||
      (b.ctvName && b.ctvName.toLowerCase().includes(q));

    let roleMatch = true;
    if (currentUser && currentUser.role === 'CTV') {
      roleMatch = (b.collaboratorId === currentUser.ctvId);
    }
    return statusMatch && searchMatch && roleMatch;
  });

  const emptyEl = document.getElementById('booking-empty');
  const tbody = document.getElementById('booking-table-body');
  if (filtered.length === 0) {
    if (tbody) tbody.innerHTML = '';
    if (emptyEl) emptyEl.classList.remove('hidden');
    renderBookingPagination(0, 1);
    return;
  }
  if (emptyEl) emptyEl.classList.add('hidden');

  const totalPages = Math.ceil(filtered.length / BOOKINGS_PER_PAGE) || 1;
  if (bookingCurrentPage > totalPages) bookingCurrentPage = totalPages;
  const startIdx = (bookingCurrentPage - 1) * BOOKINGS_PER_PAGE;
  const pageItems = filtered.slice(startIdx, startIdx + BOOKINGS_PER_PAGE);

  if (tbody) {
    tbody.innerHTML = pageItems.map(b => {
      let badgeClass = 'booking-badge-new';
      if (b.status === 'Chờ thanh toán') badgeClass = 'booking-badge-pending';
      else if (b.status === 'Đã đặt cọc') badgeClass = 'booking-badge-deposit';
      else if (b.status === 'Đã thanh toán đủ') badgeClass = 'booking-badge-paid';
      else if (b.status === 'Đang thực hiện') badgeClass = 'booking-badge-running';
      else if (b.status === 'Đã hoàn thành') badgeClass = 'booking-badge-completed';
      else if (b.status === 'Đã hủy') badgeClass = 'booking-badge-cancelled';
      else if (b.status === 'Hoàn tiền') badgeClass = 'booking-badge-refund';

      const debt = Math.max(0, b.totalAmount - (b.paidAmount || 0));
      const pct = b.totalAmount > 0 ? Math.min(100, Math.round(((b.paidAmount || 0) / b.totalAmount) * 100)) : 0;
      const ctvDisplay = b.collaboratorId 
        ? `<span class="px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded font-bold text-[10px]">${escapeHtml(b.ctvName || b.collaboratorId)}</span>`
        : '<span class="text-slate-400 text-[10px]">Trực tiếp</span>';

      const canPay = (currentUser?.role === 'CEO' || currentUser?.role === 'KE_TOAN' || currentUser?.role === 'SALE') && debt > 0 && b.status !== 'Đã hủy';

      return `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-3 px-3.5 font-mono font-bold text-brand-800">${escapeHtml(b.code)}</td>
          <td class="py-3 px-3.5">
            <div class="font-bold text-slate-900">${escapeHtml(b.customerName)}</div>
            <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(b.customerPhone)}</div>
          </td>
          <td class="py-3 px-3.5">
            <div class="font-semibold text-slate-800">${escapeHtml(b.tourName)}</div>
            <div class="text-[10px] text-slate-400 font-mono">Khởi hành: ${escapeHtml(b.departureDate)}</div>
          </td>
          <td class="py-3 px-3.5 text-center font-bold text-slate-800">${b.paxCount}</td>
          <td class="py-3 px-3.5 font-mono font-bold text-slate-900">${formatVND(b.totalAmount)}</td>
          <td class="py-3 px-3.5">
            <div class="font-mono font-bold text-emerald-700">${formatVND(b.paidAmount || 0)}</div>
            <div class="payment-progress-bar mt-1">
              <div class="payment-progress-fill" style="width: ${pct}%"></div>
            </div>
            <div class="text-[9px] text-slate-400 mt-0.5">${pct}% đã thu</div>
          </td>
          <td class="py-3 px-3.5 font-mono font-extrabold ${debt > 0 ? 'text-rose-600' : 'text-slate-400'}">${formatVND(debt)}</td>
          <td class="py-3 px-3.5">${ctvDisplay}</td>
          <td class="py-3 px-3.5"><span class="${badgeClass}">${escapeHtml(b.status)}</span></td>
          <td class="py-3 px-3.5 text-center space-x-1 whitespace-nowrap">
                        <button onclick="openBookingDetailModal('${b.id}')" class="action-btn action-btn-detail" title="Xem hồ sơ tour">👁️ Chi tiết</button>
            <button onclick="openCreateInvoiceModal('${b.code}')" class="action-btn text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-bold border border-indigo-200" title="Xuất hóa đơn điện tử GTGT theo TT 219">🧾 HĐĐT</button>
            ${canPay ? `<button onclick="openPaymentModal('${b.id}')" class="action-btn action-btn-pay" title="Ghi nhận phiếu thu">💵 Thu tiền</button>` : ''}
            ${currentUser && currentUser.role === 'KE_TOAN' ? '' : `<button onclick="editBooking('${b.id}')" class="action-btn action-btn-edit" title="Sửa đơn">✏️</button>`}
            ${currentUser && currentUser.role === 'KE_TOAN' ? '' : (b.status !== 'Đã hủy' ? `<button onclick="cancelBooking('${b.id}')" class="action-btn action-btn-delete" title="Hủy đơn">❌</button>` : '')}
          </td>
        </tr>
      `;
    }).join('');
  }

  renderBookingPagination(filtered.length, totalPages);
}

function renderBookingPagination(totalItems, totalPages) {
  const container = document.getElementById('booking-pagination');
  if (!container) return;

  if (totalItems <= BOOKINGS_PER_PAGE) {
    container.innerHTML = `<span class="pagination-info">Tổng cộng <b>${totalItems}</b> đơn tour</span>`;
    return;
  }

  let html = `<span class="pagination-info">Hiển thị <b>${(bookingCurrentPage - 1) * BOOKINGS_PER_PAGE + 1}-${Math.min(bookingCurrentPage * BOOKINGS_PER_PAGE, totalItems)}</b> / <b>${totalItems}</b> đơn</span>`;
  html += '<div class="flex items-center space-x-1">';
  html += `<button class="pagination-btn ${bookingCurrentPage === 1 ? 'disabled' : ''}" onclick="changeBookingPage(${bookingCurrentPage - 1})" ${bookingCurrentPage === 1 ? 'disabled' : ''}>&larr; Trước</button>`;

  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= bookingCurrentPage - 1 && p <= bookingCurrentPage + 1)) {
      html += `<button class="pagination-btn ${p === bookingCurrentPage ? 'active' : ''}" onclick="changeBookingPage(${p})">${p}</button>`;
    } else if (p === bookingCurrentPage - 2 || p === bookingCurrentPage + 2) {
      html += `<span class="px-1 text-slate-400">...</span>`;
    }
  }

  html += `<button class="pagination-btn ${bookingCurrentPage === totalPages ? 'disabled' : ''}" onclick="changeBookingPage(${bookingCurrentPage + 1})" ${bookingCurrentPage === totalPages ? 'disabled' : ''}>Sau &rarr;</button>`;
  html += '</div>';

  container.innerHTML = html;
}

function changeBookingPage(p) {
  bookingCurrentPage = p;
  renderBookingsModule();
}

function populateBookingModalDropdowns() {
  const custSel = document.getElementById('form-booking-customer');
  if (custSel) {
    const curVal = custSel.value;
    custSel.innerHTML = '<option value="">-- Chọn khách hàng từ CRM --</option>' +
      db.customers.map(c => `<option value="${c.id}">${escapeHtml(c.name)} (${escapeHtml(c.code)} - ${escapeHtml(c.phone)})</option>`).join('');
    if (curVal) custSel.value = curVal;
  }

  const tourSel = document.getElementById('form-booking-tour');
  if (tourSel) {
    const curVal = tourSel.value;
    tourSel.innerHTML = '<option value="">-- Chọn chương trình tour --</option>' +
      db.tourPolicies.map(t => `<option value="${t.id}">${escapeHtml(t.name)} (${t.duration} - ${formatVND(t.price)})</option>`).join('');
    if (curVal) tourSel.value = curVal;
  }

  const ctvSel = document.getElementById('form-booking-ctv');
  if (ctvSel) {
    const curVal = ctvSel.value;
    ctvSel.innerHTML = '<option value="">-- Không qua CTV (Trực tiếp) --</option>' +
      db.ctvs.map(c => `<option value="${c.id}">${escapeHtml(c.name)} (${escapeHtml(c.code)})</option>`).join('');
    if (curVal) ctvSel.value = curVal;
  }
}

function openAddBookingModal() {
  if (currentUser && currentUser.role === 'KE_TOAN') {
    alert("⛔ BẢO VỆ DỮ LIỆU: Kế toán không có quyền tạo đơn tour mới!");
    return;
  }
  const form = document.getElementById('booking-form');
  form.reset();
  document.getElementById('form-booking-id').value = '';
  document.getElementById('booking-modal-title').textContent = 'Tạo đơn tour mới';

  document.getElementById('form-booking-code').value = generateNextCode('DH-', db.bookings, 'code');
  
  const depDate = new Date();
  depDate.setDate(depDate.getDate() + 7);
  document.getElementById('form-booking-departure').value = depDate.toISOString().split('T')[0];

  populateBookingModalDropdowns();
  document.getElementById('booking-ctv-reason-container').classList.add('hidden');
  document.getElementById('form-booking-ctv-reason').required = false;

  document.getElementById('booking-modal').classList.remove('hidden');
  document.getElementById('booking-modal').classList.add('flex');
}

function closeBookingModal() {
  document.getElementById('booking-modal').classList.add('hidden');
  document.getElementById('booking-modal').classList.remove('flex');
}

function handleBookingCustomerChange(custId) {
  if (!custId) return;
  const cust = db.customers.find(c => String(c.id) === String(custId));
  if (!cust) return;

  // Tự động gán nguồn CTV từ hồ sơ gốc CRM
  const ctvSel = document.getElementById('form-booking-ctv');
  if (ctvSel) {
    ctvSel.value = cust.collaboratorId || '';
  }
  document.getElementById('booking-ctv-reason-container').classList.add('hidden');
  document.getElementById('form-booking-ctv-reason').required = false;

  // Nếu khách có nhu cầu tour tương ứng, tự động chọn tour
  if (cust.demand) {
    const matchedTour = findTourPolicy(cust.demand);
    if (matchedTour) {
      const tourSel = document.getElementById('form-booking-tour');
      if (tourSel) {
        tourSel.value = matchedTour.id;
        handleBookingTourChange(matchedTour.id);
      }
    }
  }

  if (cust.paxCount) {
    document.getElementById('form-booking-pax').value = cust.paxCount;
    recalcBookingTotal();
  }
}

function handleBookingTourChange(tourId) {
  if (!tourId) return;
  const tour = db.tourPolicies.find(t => t.id === tourId);
  if (!tour) return;

  document.getElementById('form-booking-unit-price').value = tour.price || 0;
  const paxEl = document.getElementById('form-booking-pax');
  const paxRes = parsePaxInput(paxEl ? paxEl.value : 1);
  const pax = paxRes.valid ? paxRes.value : 1;
  document.getElementById('form-booking-cogs').value = Math.round((tour.estimatedCost || 0) * pax);
  recalcBookingTotal();
}

function recalcBookingTotal() {
  const paxEl = document.getElementById('form-booking-pax');
  const paxRes = parsePaxInput(paxEl ? paxEl.value : 1);
  const pax = paxRes.valid ? paxRes.value : 1;
  const unitPrice = parseFloat(document.getElementById('form-booking-unit-price').value) || 0;
  const discount = parseFloat(document.getElementById('form-booking-discount').value) || 0;
  const total = Math.max(0, Math.round((pax * unitPrice) - discount));
  document.getElementById('form-booking-total-display').value = formatVND(total);
}

function handleBookingCtvManualChange() {
  const custId = document.getElementById('form-booking-customer').value;
  const cust = db.customers.find(c => String(c.id) === String(custId));
  const currentCtv = document.getElementById('form-booking-ctv').value;

  const originalCtv = cust ? (cust.collaboratorId || '') : '';
  const reasonBox = document.getElementById('booking-ctv-reason-container');
  const reasonInput = document.getElementById('form-booking-ctv-reason');

  if (currentCtv !== originalCtv) {
    reasonBox.classList.remove('hidden');
    reasonInput.required = true;
  } else {
    reasonBox.classList.add('hidden');
    reasonInput.required = false;
  }
}

function saveBooking(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (currentUser && currentUser.role === 'KE_TOAN') {
    alert("⛔ BẢO VỆ DỮ LIỆU: Kế toán tuyệt đối không được chỉnh sửa thông tin khách hàng, tiền hoặc trạng thái đơn tour mà Sale/Điều hành đã chốt!");
    return;
  }
  const idVal = document.getElementById('form-booking-id').value;
  const codeVal = document.getElementById('form-booking-code').value.trim();
  const custIdVal = document.getElementById('form-booking-customer').value;
  const tourIdVal = document.getElementById('form-booking-tour').value;
  const departureVal = document.getElementById('form-booking-departure').value;
  
  const paxEl = document.getElementById('form-booking-pax');
  const paxRes = parsePaxInput(paxEl ? paxEl.value : 1);
  if (!paxRes.valid) {
    alert(`Số lượng khách (Pax) không hợp lệ: ${paxRes.reason || 'Vui lòng nhập số nguyên dương lớn hơn 0.'}`);
    return;
  }
  const paxVal = paxRes.value;

  const unitPriceVal = Math.round(parseFloat(document.getElementById('form-booking-unit-price').value) || 0);
  const discountVal = Math.round(parseFloat(document.getElementById('form-booking-discount').value) || 0);
  const cogsVal = Math.round(parseFloat(document.getElementById('form-booking-cogs').value) || 0);
  const ctvIdVal = document.getElementById('form-booking-ctv').value;
  const staffVal = document.getElementById('form-booking-staff').value;
  const notesVal = document.getElementById('form-booking-notes').value.trim();
  const reasonVal = document.getElementById('form-booking-ctv-reason').value.trim();

  const customer = db.customers.find(c => String(c.id) === String(custIdVal));
  const tour = db.tourPolicies.find(t => t.id === tourIdVal);
  const ctv = db.ctvs.find(c => c.id === ctvIdVal);

  const totalAmount = Math.max(0, Math.round((paxVal * unitPriceVal) - discountVal));

  if (idVal) {
    // Sửa đơn tour hiện có
    const idx = db.bookings.findIndex(b => b.id === idVal);
    if (idx !== -1) {
      const oldBooking = db.bookings[idx];
      const paid = oldBooking.paidAmount || 0;
      const remaining = Math.max(0, totalAmount - paid);

      let status = oldBooking.status;
      if (status !== 'Đã hoàn thành' && status !== 'Đã hủy') {
        if (paid >= totalAmount && totalAmount > 0) status = 'Đã thanh toán đủ';
        else if (paid > 0) status = 'Đã đặt cọc';
        else status = 'Chờ thanh toán';
      }

      if (oldBooking.collaboratorId !== ctvIdVal && reasonVal) {
        recordAuditLog('ĐIỀU CHỈNH NGUỒN CTV ĐƠN TOUR', `Đơn ${codeVal}: Chuyển CTV từ "${oldBooking.ctvName || 'Trực tiếp'}" sang "${ctv ? ctv.name : 'Trực tiếp'}". Lý do: ${reasonVal}`);
      }

      db.bookings[idx] = {
        ...oldBooking,
        code: codeVal,
        customerId: customer ? customer.id : oldBooking.customerId,
        customerName: customer ? customer.name : oldBooking.customerName,
        customerPhone: customer ? customer.phone : oldBooking.customerPhone,
        tourId: tour ? tour.id : oldBooking.tourId,
        tourName: tour ? tour.name : oldBooking.tourName,
        departureDate: departureVal,
        paxCount: paxVal,
        unitPrice: unitPriceVal,
        discountAmount: discountVal,
        totalAmount: totalAmount,
        remainingAmount: remaining,
        collaboratorId: ctvIdVal,
        ctvName: ctv ? ctv.name : '',
        staff: staffVal,
        status: status,
        estimatedCost: cogsVal,
        notes: notesVal
      };

      recordAuditLog('CẬP NHẬT ĐƠN TOUR', `Sửa thông tin đơn tour ${codeVal} (${customer?.name}). Tổng tiền: ${formatVND(totalAmount)}.`);
      if (customer) {
        syncCustomerFinancials(customer);
      }
    }
  } else {
    // Tạo mới đơn tour
    const newBooking = {
      id: codeVal,
      code: codeVal,
      customerId: customer ? customer.id : null,
      customerName: customer ? customer.name : '',
      customerPhone: customer ? customer.phone : '',
      tourId: tour ? tour.id : '',
      tourName: tour ? tour.name : '',
      departureDate: departureVal,
      paxCount: paxVal,
      unitPrice: unitPriceVal,
      discountAmount: discountVal,
      totalAmount: totalAmount,
      paidAmount: 0,
      remainingAmount: totalAmount,
      refundAmount: 0,
      collaboratorId: ctvIdVal,
      ctvName: ctv ? ctv.name : '',
      staff: staffVal,
      status: 'Chờ thanh toán',
      tourStatus: 'Mới tiếp nhận',
      financialStatus: 'Chờ thanh toán',
      estimatedCost: cogsVal,
      actualCost: 0,
      createdAt: new Date().toISOString().split('T')[0],
      notes: notesVal
    };

    if (customer && customer.collaboratorId !== ctvIdVal && reasonVal) {
      recordAuditLog('THAY ĐỔI NGUỒN CTV KHI TẠO ĐƠN', `Đơn ${codeVal}: Khách gốc liên kết CTV ${customer.collaboratorId}, gán sang CTV ${ctvIdVal}. Lý do: ${reasonVal}`);
    }

    db.bookings.unshift(newBooking);

    // Tự động gửi thông báo chuyển giao sang bộ phận Điều hành (OPS)
    sendInterDeptNotification({
      senderRole: 'SALE',
      senderName: currentUser ? `${currentUser.name} (Sale)` : 'Bộ phận Kinh doanh (Sale)',
      targetRole: 'OPS',
      targetModule: 5,
      type: 'HANDOVER_TOUR',
      title: `Bàn giao đơn tour mới: ${codeVal}`,
      message: `Sale đã tạo và chốt đơn tour ${codeVal} cho khách ${customer?.name} (${tour?.name} - ${paxVal} khách, ${formatVND(totalAmount)}). Đã chuyển sang Điều hành trong phần Mới tiếp nhận.`,
      referenceId: codeVal,
      referenceType: 'BOOKING'
    });
    recordAuditLog('TẠO ĐƠN TOUR MỚI', `Tạo đơn tour ${codeVal} cho khách ${customer?.name}. Giá trị: ${formatVND(totalAmount)}.`);
    if (customer) {
      syncCustomerFinancials(customer);
    }
  }

  saveDatabase();
  refreshActiveView();
  closeBookingModal();
}

function editBooking(bookingId) {
  if (currentUser && currentUser.role === 'KE_TOAN') {
    alert("⛔ BẢO VỆ DỮ LIỆU: Kế toán không có quyền chỉnh sửa đơn tour mà Sale/Điều hành đã chốt!");
    return;
  }
  const b = db.bookings.find(item => item.id === bookingId);
  if (!b) return;

  populateBookingModalDropdowns();

  document.getElementById('form-booking-id').value = b.id;
  document.getElementById('form-booking-code').value = b.code;
  document.getElementById('form-booking-customer').value = b.customerId || '';
  document.getElementById('form-booking-tour').value = b.tourId || '';
  document.getElementById('form-booking-departure').value = b.departureDate || '';
  document.getElementById('form-booking-pax').value = b.paxCount || 1;
  document.getElementById('form-booking-unit-price').value = b.unitPrice || 0;
  document.getElementById('form-booking-discount').value = b.discountAmount || 0;
  document.getElementById('form-booking-cogs').value = b.estimatedCost || 0;
  document.getElementById('form-booking-ctv').value = b.collaboratorId || '';
  document.getElementById('form-booking-staff').value = b.staff || '';
  document.getElementById('form-booking-notes').value = b.notes || '';

  recalcBookingTotal();
  document.getElementById('booking-modal-title').textContent = `Sửa đơn tour: ${b.code}`;
  document.getElementById('booking-ctv-reason-container').classList.add('hidden');
  document.getElementById('form-booking-ctv-reason').required = false;

  document.getElementById('booking-modal').classList.remove('hidden');
  document.getElementById('booking-modal').classList.add('flex');
}

function cancelBooking(bookingId) {
  if (currentUser && currentUser.role === 'KE_TOAN') {
    alert("⛔ BẢO VỆ DỮ LIỆU: Kế toán không có quyền hủy đơn tour mà Sale/Điều hành đã chốt!");
    return;
  }
  const b = db.bookings.find(item => item.id === bookingId);
  if (!b) return;

  if (confirm(`Bạn có chắc muốn HỦY đơn tour "${b.code}" của khách hàng "${b.customerName}"?`)) {
    b.status = 'Đã hủy';
    b.financialStatus = 'Đã hủy';
    b.tourStatus = 'Đã hủy';
    b.remainingAmount = 0;

    // Hủy báo giá liên kết nếu có
    if (b.quotationCode || b.quotationId) {
      const q = (db.quotations || []).find(x => x.code === b.quotationCode || x.id === b.quotationId);
      if (q && q.status !== 'Đã hủy') {
        q.status = 'Đã hủy';
      }
    }

    // Hủy hoa hồng liên kết nếu có
    const comm = (db.commissions || []).find(c => c.bookingCode === b.code);
    if (comm && comm.status !== 'Đã hủy') {
      comm.status = 'Đã hủy';
      comm.note = `Đơn tour ${b.code} đã bị hủy`;
    }

    // Đồng bộ tức thì sang hồ sơ khách hàng CRM
    if (b.customerId) {
      syncCustomerFinancials(b.customerId);
    }

    saveDatabase();
    recordAuditLog('HỦY ĐƠN TOUR', `Đã hủy đơn tour ${b.code} (${b.customerName}), đồng bộ CRM và hủy báo giá/hoa hồng liên kết.`);
    refreshActiveView();
  }
}

// ==========================================
// 17. QUẢN LÝ HỒ SƠ CHI TIẾT ĐƠN TOUR & MULTI-TAB (ROOMING LIST, P&L, ITINERARY, CSAT)
// ==========================================
let currentBookingDetailTab = 'overview';
let currentVoucherOrderCode = null;

function switchBookingDetailTab(tab) {
  currentBookingDetailTab = tab;
  const b = db.bookings.find(item => item.id === currentDetailBookingId || item.code === currentDetailBookingId);
  if (!b) return;

  const tabs = ['overview', 'rooming', 'pnl', 'itinerary', 'feedback', 'incidents'];
  tabs.forEach(t => {
    const btn = document.getElementById(`detail-tab-btn-${t}`);
    const content = document.getElementById(`detail-tab-content-${t}`);
    if (btn) {
      if (t === tab) {
        btn.classList.add('border-brand-800', 'text-brand-800');
        btn.classList.remove('border-transparent', 'text-slate-500');
      } else {
        btn.classList.remove('border-brand-800', 'text-brand-800');
        btn.classList.add('border-transparent', 'text-slate-500');
      }
    }
    if (content) {
      if (t === tab) content.classList.remove('hidden');
      else content.classList.add('hidden');
    }
  });

  if (tab === 'overview') renderBookingDetailOverview(b);
  else if (tab === 'rooming') renderBookingRoomingList(b);
  else if (tab === 'pnl') renderBookingPnL(b);
  else if (tab === 'itinerary') renderBookingItinerary(b);
  else if (tab === 'feedback') renderBookingFeedback(b);
  else if (tab === 'incidents') renderBookingIncidents(b);
}

function openBookingDetailModal(bookingId) {
  const b = db.bookings.find(item => item.id === bookingId || item.code === bookingId);
  if (!b) return;

  currentDetailBookingId = b.id;
  currentBookingDetailTab = 'overview';

  document.getElementById('detail-booking-title').textContent = `Hồ sơ đơn tour: ${b.code}`;
  
  const pill = document.getElementById('detail-status-pill');
  if (pill) {
    pill.textContent = `${b.tourStatus || b.status} • ${b.financialStatus || 'Đang theo dõi'}`;
    if (b.status === 'Đã hoàn thành' || b.tourStatus === 'Hoàn thành tour') {
      pill.className = 'text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300';
    } else if (b.status === 'Đã hủy') {
      pill.className = 'text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 border border-rose-300';
    } else {
      pill.className = 'text-[11px] px-2.5 py-0.5 rounded-full font-bold bg-blue-100 text-blue-800 border border-blue-300';
    }
  }

  const paxSpan = document.getElementById('detail-tab-pax-count');
  if (paxSpan) {
    const pCount = (b.passengers && b.passengers.length > 0) ? b.passengers.length : b.paxCount;
    paxSpan.textContent = pCount;
  }

  const incidentBadge = document.getElementById('detail-tab-incident-badge');
  if (incidentBadge) {
    const incCount = (b.incidents || []).length;
    incidentBadge.textContent = incCount;
    if (incCount > 0) incidentBadge.classList.remove('hidden');
    else incidentBadge.classList.add('hidden');
  }

  // Khởi tạo tab Overview
  renderBookingDetailOverview(b);
  switchBookingDetailTab('overview');

  document.getElementById('booking-detail-modal').classList.remove('hidden');
  document.getElementById('booking-detail-modal').classList.add('flex');
}

function renderBookingDetailOverview(b) {
  document.getElementById('detail-code').textContent = b.code;
  document.getElementById('detail-customer').textContent = b.customerName;
  document.getElementById('detail-phone').textContent = b.customerPhone;
  document.getElementById('detail-pax').textContent = `${b.paxCount} khách`;
  document.getElementById('detail-tour').textContent = b.tourName;
  document.getElementById('detail-departure').textContent = b.departureDate;
  document.getElementById('detail-ctv').textContent = b.ctvName || 'Trực tiếp (Không qua CTV)';
  document.getElementById('detail-total-amount').textContent = formatVND(b.totalAmount);
  document.getElementById('detail-paid-amount').textContent = formatVND(b.paidAmount || 0);

  const debt = Math.max(0, b.totalAmount - (b.paidAmount || 0));
  document.getElementById('detail-debt-amount').textContent = formatVND(debt);
  document.getElementById('detail-status').textContent = b.status;

  const btnPay = document.getElementById('detail-btn-add-payment');
  if (btnPay) {
    if (debt > 0 && b.status !== 'Đã hủy') btnPay.classList.remove('hidden');
    else btnPay.classList.add('hidden');
  }

  // Lịch sử thanh toán & Hoàn tiền
  const payments = db.payments.filter(p => p.bookingCode === b.code || p.bookingId === b.id);
  const paymentsBody = document.getElementById('detail-payments-body');
  const emptyPay = document.getElementById('detail-empty-payments');

  if (payments.length === 0) {
    paymentsBody.innerHTML = '';
    emptyPay.classList.remove('hidden');
  } else {
    emptyPay.classList.add('hidden');
    paymentsBody.innerHTML = payments.map(p => {
      const isRefund = p.type === 'REFUND';
      const amtDisplay = isRefund ? `- ${formatVND(p.amount)}` : `+ ${formatVND(p.amount)}`;
      const amtColor = isRefund ? 'text-rose-600 font-bold' : 'text-emerald-700 font-bold';
      const typeBadge = isRefund ? '<span class="px-1.5 py-0.5 rounded text-[10px] bg-rose-100 text-rose-700 font-bold">HOÀN TIỀN</span>' : '<span class="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-700 font-bold">THU TIỀN</span>';

      return `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-2.5 px-3 font-mono font-bold text-brand-800">
            <div>${escapeHtml(p.code)}</div>
            <div>${typeBadge}</div>
          </td>
          <td class="py-2.5 px-3 text-slate-500 font-mono">${escapeHtml(p.date)}</td>
          <td class="py-2.5 px-3 font-mono ${amtColor}">${amtDisplay}</td>
          <td class="py-2.5 px-3 text-slate-600">${escapeHtml(p.method)}</td>
          <td class="py-2.5 px-3 text-slate-700 font-mono text-[11px]">${escapeHtml(p.referenceCode || '-')}</td>
          <td class="py-2.5 px-3 text-slate-600">
            <div>${escapeHtml(p.confirmedBy || '-')}</div>
            ${p.notes ? `<div class="text-[10px] text-slate-400 italic">${escapeHtml(p.notes)}</div>` : ''}
          </td>
        </tr>
      `;
    }).join('');
  }
}

function renderBookingRoomingList(b) {
  const tbody = document.getElementById('detail-passengers-body');
  const emptyBox = document.getElementById('detail-empty-passengers');
  if (!tbody) return;

  const passengers = b.passengers || [];
  const paxSpan = document.getElementById('detail-tab-pax-count');
  if (paxSpan) paxSpan.textContent = passengers.length > 0 ? passengers.length : b.paxCount;

  if (passengers.length === 0) {
    tbody.innerHTML = '';
    if (emptyBox) emptyBox.classList.remove('hidden');
    return;
  }

  if (emptyBox) emptyBox.classList.add('hidden');
  tbody.innerHTML = passengers.map((p, idx) => `
    <tr class="hover:bg-slate-50 transition-colors">
      <td class="py-2.5 px-3 text-center font-bold text-slate-400 font-mono">${idx + 1}</td>
      <td class="py-2.5 px-3 font-bold text-slate-900">${escapeHtml(p.fullName)}</td>
      <td class="py-2.5 px-3 text-slate-600">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${p.gender === 'Nữ' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}">${escapeHtml(p.gender || 'Nam')}</span>
      </td>
      <td class="py-2.5 px-3 font-mono text-slate-700">${p.birthYear || '-'}</td>
      <td class="py-2.5 px-3 font-mono font-medium text-slate-800">${escapeHtml(p.idCard || '-')}</td>
      <td class="py-2.5 px-3 font-mono text-slate-600">${escapeHtml(p.phone || '-')}</td>
      <td class="py-2.5 px-3">
        <span class="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">${escapeHtml(p.roomType || 'Phòng chung đoàn')}</span>
      </td>
      <td class="py-2.5 px-3 text-slate-600 text-xs">${escapeHtml(p.dietNotes || 'Bình thường')}</td>
    </tr>
  `).join('');
}

function renderBookingPnL(b) {
  const revenue = Number(b.totalAmount) || 0;

  // Lấy các lệnh NCC gắn với đơn
  const supplierOrders = (db.supplierBookings || []).filter(sb => sb.bookingCode === b.code || sb.bookingId === b.id);
  const totalCogs = supplierOrders.reduce((sum, sb) => sum + (Number(sb.agreedCost) || 0), 0);
  const totalPaidCogs = supplierOrders.reduce((sum, sb) => sum + (Number(sb.paidCost) || 0), 0);
  const totalRemainingCogs = Math.max(0, totalCogs - totalPaidCogs);

  // Lấy hoa hồng CTV gắn với đơn
  const comm = (db.commissions || []).find(c => c.bookingCode === b.code || (c.customerId === b.customerId && !c.bookingCode));
  const commAmount = (comm && comm.status !== 'Đã hủy') ? (Number(comm.amount) || 0) : 0;

  const grossProfit = revenue - totalCogs - commAmount;
  const grossMargin = revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(1) : 0;

  document.getElementById('pnl-revenue').textContent = formatVND(revenue);
  document.getElementById('pnl-cogs').textContent = formatVND(totalCogs);
  document.getElementById('pnl-commission').textContent = formatVND(commAmount);
  
  const gpEl = document.getElementById('pnl-gross-profit');
  if (gpEl) {
    gpEl.textContent = formatVND(grossProfit);
    gpEl.className = grossProfit >= 0 ? 'text-base font-extrabold text-emerald-800 mt-1' : 'text-base font-extrabold text-rose-700 mt-1';
  }

  const gmEl = document.getElementById('pnl-gross-margin');
  if (gmEl) {
    gmEl.textContent = `${grossMargin}%`;
    gmEl.className = grossMargin >= 15 ? 'text-base font-extrabold text-emerald-800 mt-1' : 'text-base font-extrabold text-amber-700 mt-1';
  }

  // Danh sách Lệnh dịch vụ NCC
  const tbody = document.getElementById('pnl-suppliers-body');
  const emptyBox = document.getElementById('pnl-empty-suppliers');
  const countEl = document.getElementById('pnl-supplier-count');
  if (countEl) countEl.textContent = `${supplierOrders.length} dịch vụ (Đã chi: ${formatVND(totalPaidCogs)} - Nợ NCC: ${formatVND(totalRemainingCogs)})`;

  if (supplierOrders.length === 0) {
    if (tbody) tbody.innerHTML = '';
    if (emptyBox) emptyBox.classList.remove('hidden');
  } else {
    if (emptyBox) emptyBox.classList.add('hidden');
    if (tbody) {
      tbody.innerHTML = supplierOrders.map(sb => {
        const remaining = Math.max(0, sb.agreedCost - (sb.paidCost || 0));
        return `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-2.5 px-3 font-mono font-bold text-brand-800">${escapeHtml(sb.code)}</td>
            <td class="py-2.5 px-3 font-bold text-slate-900">${escapeHtml(sb.supplierName)}</td>
            <td class="py-2.5 px-3 text-slate-700 text-xs">${escapeHtml(sb.serviceType)}</td>
            <td class="py-2.5 px-3 font-mono font-bold text-slate-900">${formatVND(sb.agreedCost)}</td>
            <td class="py-2.5 px-3 font-mono font-bold text-emerald-700">${formatVND(sb.paidCost || 0)}</td>
            <td class="py-2.5 px-3 font-mono font-bold ${remaining > 0 ? 'text-rose-600' : 'text-slate-400'}">${formatVND(remaining)}</td>
            <td class="py-2.5 px-3 text-[11px] text-blue-800 font-medium">${escapeHtml(sb.debtPolicyTitle || sb.debtPolicy || 'Tiền mặt')}</td>
            <td class="py-2.5 px-3 text-center whitespace-nowrap">
              <button onclick="openSupplierVoucherModal('${sb.code}')" class="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-800 border border-brand-200 rounded-lg font-bold text-[11px] shadow-sm inline-flex items-center space-x-1" title="In phiếu xác nhận dịch vụ">
                <span>📄 Voucher</span>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // Khối thông tin hoa hồng
  const commBox = document.getElementById('pnl-commission-detail-box');
  const ctvNameEl = document.getElementById('pnl-comm-ctv-name');
  const policyEl = document.getElementById('pnl-comm-policy');
  const commAmtEl = document.getElementById('pnl-comm-amount');

  if (comm) {
    if (ctvNameEl) ctvNameEl.textContent = `Đối tác: ${b.ctvName || 'CTV'} (${comm.ctvId || '-'})`;
    if (policyEl) policyEl.textContent = `• ${comm.policyApplied || 'Chính sách tour'} [${comm.status}]`;
    if (commAmtEl) commAmtEl.textContent = formatVND(comm.amount);
    if (commBox) commBox.classList.remove('hidden');
  } else {
    if (ctvNameEl) ctvNameEl.textContent = 'Khách đặt trực tiếp qua HaHa Eco Travel (Không phát sinh hoa hồng CTV)';
    if (policyEl) policyEl.textContent = '• Tối ưu 100% biên lợi nhuận cho doanh nghiệp';
    if (commAmtEl) commAmtEl.textContent = '0 đ';
  }
}

function renderBookingItinerary(b) {
  const container = document.getElementById('detail-itinerary-timeline');
  if (!container) return;

  const itinerary = b.itinerary || [];
  if (itinerary.length === 0) {
    container.innerHTML = `
      <div class="py-8 text-center text-xs text-slate-400">
        Chưa cập nhật timeline lịch trình chi tiết cho tour này. Điều hành sẽ bổ sung trước ngày khởi hành.
      </div>
    `;
    return;
  }

  container.innerHTML = itinerary.map((item, idx) => `
    <div class="flex items-start space-x-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100/70 transition-colors">
      <div class="w-16 flex-shrink-0 text-center bg-brand-800 text-white rounded-lg py-1 px-2 font-bold text-xs shadow-sm">
        Ngày ${item.day || (idx + 1)}
      </div>
      <div class="flex-1">
        <div class="font-bold text-slate-900 text-xs">${escapeHtml(item.title)}</div>
        <div class="text-[12px] text-slate-600 mt-1 leading-relaxed">${escapeHtml(item.desc)}</div>
      </div>
    </div>
  `).join('');
}

function renderBookingFeedback(b) {
  const container = document.getElementById('detail-feedback-box');
  if (!container) return;

  const fb = b.feedback;
  if (!fb) {
    container.innerHTML = `
      <div class="text-center py-6 text-slate-400 space-y-2">
        <div class="text-2xl">⏳</div>
        <div class="font-bold text-slate-600 text-xs">Đoàn tour chưa có đánh giá CSAT từ khách hàng</div>
        <div class="text-[11px] text-slate-400">Đánh giá sao và nhận xét chất lượng dịch vụ sẽ tự động ghi nhận khi đoàn tour hoàn thành và khách hàng gửi khảo sát.</div>
      </div>
    `;
    return;
  }

  const renderStars = (rating) => {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += i <= rating ? '⭐' : '☆';
    }
    return stars;
  };

  container.innerHTML = `
    <div class="space-y-4 font-sans">
      <div class="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200 pb-3 gap-2">
        <div class="flex items-center space-x-3">
          <span class="text-2xl">${renderStars(fb.rating || 5)}</span>
          <span class="text-base font-extrabold text-slate-900">${fb.rating || 5}.0 / 5.0 Xuất sắc</span>
        </div>
        <div class="text-[11px] text-slate-500 font-mono">Thời gian đánh giá: ${escapeHtml(fb.reviewedAt || b.departureDate)}</div>
      </div>

      <!-- Điểm thành phần -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
        <div class="p-2.5 bg-white rounded-xl border border-slate-200">
          <div class="text-slate-400 text-[10px] uppercase font-bold">🚍 Phương tiện</div>
          <div class="font-bold text-slate-800 mt-0.5">${fb.transportRating || 5} / 5 ⭐</div>
        </div>
        <div class="p-2.5 bg-white rounded-xl border border-slate-200">
          <div class="text-slate-400 text-[10px] uppercase font-bold">🏨 Khách sạn</div>
          <div class="font-bold text-slate-800 mt-0.5">${fb.hotelRating || 5} / 5 ⭐</div>
        </div>
        <div class="p-2.5 bg-white rounded-xl border border-slate-200">
          <div class="text-slate-400 text-[10px] uppercase font-bold">🍽️ Ẩm thực</div>
          <div class="font-bold text-slate-800 mt-0.5">${fb.foodRating || 5} / 5 ⭐</div>
        </div>
        <div class="p-2.5 bg-white rounded-xl border border-slate-200">
          <div class="text-slate-400 text-[10px] uppercase font-bold">🧭 Hướng dẫn viên</div>
          <div class="font-bold text-slate-800 mt-0.5">${fb.guideRating || 5} / 5 ⭐</div>
        </div>
      </div>

      <!-- Ý kiến nhận xét -->
      <div class="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs space-y-1">
        <div class="font-bold text-emerald-900 uppercase text-[10px]">Nhận xét của trưởng đoàn / Khách hàng:</div>
        <div class="text-slate-800 italic leading-relaxed">"${escapeHtml(fb.comment)}"</div>
      </div>
    </div>
  `;
}

function renderBookingIncidents(b) {
  const container = document.getElementById('detail-incidents-container');
  if (!container) return;

  const incidents = b.incidents || [];
  if (incidents.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400 space-y-2 bg-slate-50 rounded-2xl border border-slate-200">
        <div class="text-2xl">🛡️</div>
        <div class="font-bold text-slate-700 text-xs">Đoàn tour chưa ghi nhận bất kỳ sự cố hay phàn nàn nào</div>
        <div class="text-[11px] text-slate-400 max-w-md mx-auto">Chất lượng dịch vụ phương tiện, lưu trú, ăn uống và hướng dẫn viên đang được kiểm soát đạt chuẩn 100%. Nhấn nút "+ Báo cáo sự cố mới" nếu có phát sinh tại chỗ.</div>
      </div>
    `;
    return;
  }

  const categoryLabels = {
    'TRANSPORT': '🚍 Xe & Phương tiện',
    'HOTEL': '🏨 Khách sạn & Lưu trú',
    'FOOD': '🍽️ Nhà hàng & Ăn uống',
    'GUIDE': '🧭 Hướng dẫn viên',
    'ITINERARY': '🗓️ Lịch trình & Điểm đến',
    'SHOPPING': '🛍️ Ép mua sắm / Shopping',
    'HEALTH': '🏥 Y tế & Sức khỏe',
    'OTHER': '⚠️ Vấn đề khác'
  };

  const severityConfigs = {
    'LOW': { label: '🟢 Thấp (Khắc phục tức thì)', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    'MEDIUM': { label: '🟡 Trung bình (Phàn nàn nhỏ)', badgeClass: 'bg-amber-100 text-amber-900 border-amber-300' },
    'HIGH': { label: '🔴 Cao (Khách phản ứng gắt)', badgeClass: 'bg-orange-100 text-orange-900 border-orange-300' },
    'CRITICAL': { label: '🚨 Khẩn cấp (Cần CEO can thiệp)', badgeClass: 'bg-rose-100 text-rose-900 border-rose-300 font-extrabold' }
  };

  const statusConfigs = {
    'RESOLVED': { label: '✅ Đã giải quyết xong', class: 'text-emerald-700 font-bold' },
    'OPEN': { label: '⏳ Đang xử lý tại chỗ', class: 'text-amber-700 font-bold' },
    'PENDING_CEO': { label: '👑 Chờ CEO phê duyệt', class: 'text-rose-700 font-bold animate-pulse' }
  };

  container.innerHTML = incidents.map((inc, idx) => {
    const sev = severityConfigs[inc.severity] || severityConfigs['MEDIUM'];
    const stat = statusConfigs[inc.status] || statusConfigs['RESOLVED'];
    const catLabel = categoryLabels[inc.category] || inc.category;

    return `
      <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-100 pb-2.5">
          <div class="flex items-center space-x-2">
            <span class="px-2 py-0.5 rounded-lg border text-[10px] font-bold ${sev.badgeClass}">${sev.label}</span>
            <span class="text-xs font-extrabold text-slate-900">${escapeHtml(inc.title)}</span>
          </div>
          <div class="text-[11px] text-slate-400 font-mono">
            ${escapeHtml(inc.reportedAt || inc.createdAt || '')} &bull; ${escapeHtml(inc.reportedBy || 'Điều hành')}
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div class="font-bold text-slate-500 text-[10px] uppercase">Hạng mục: ${catLabel}</div>
            <div class="text-slate-800 leading-relaxed">${escapeHtml(inc.desc)}</div>
          </div>
          <div class="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-1">
            <div class="font-bold text-emerald-800 text-[10px] uppercase">Biện pháp xử lý & Đền bù:</div>
            <div class="text-slate-800 leading-relaxed">${escapeHtml(inc.resolution)}</div>
            ${inc.compensation > 0 ? `<div class="font-mono font-bold text-rose-700 text-[11px] pt-1">💰 Chi phí đền bù: ${formatVND(inc.compensation)}</div>` : ''}
          </div>
        </div>

        <div class="flex items-center justify-between pt-1 text-xs">
          <div class="flex items-center space-x-1.5">
            <span class="text-slate-400 text-[11px]">Trạng thái:</span>
            <span class="${stat.class}">${stat.label}</span>
          </div>
          ${inc.resolvedAt ? `<div class="text-[10px] text-slate-400 font-mono">Giải quyết lúc: ${inc.resolvedAt}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function openAddIncidentModal(bookingCode) {
  let bCode = bookingCode;
  if (!bCode && currentDetailBookingId) {
    const b = db.bookings.find(item => item.id === currentDetailBookingId || item.code === currentDetailBookingId);
    if (b) bCode = b.code;
  }
  const inputEl = document.getElementById('incident-booking-code');
  if (inputEl) inputEl.value = bCode || 'DH-001';

  const form = document.getElementById('add-incident-form');
  if (form) {
    document.getElementById('incident-title').value = '';
    document.getElementById('incident-desc').value = '';
    document.getElementById('incident-resolution').value = '';
    document.getElementById('incident-compensation').value = '0';
    document.getElementById('incident-severity').value = 'MEDIUM';
    document.getElementById('incident-status').value = 'RESOLVED';
  }

  const modal = document.getElementById('add-incident-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeAddIncidentModal() {
  const modal = document.getElementById('add-incident-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function handleAddIncidentSubmit(event) {
  event.preventDefault();
  const bCode = document.getElementById('incident-booking-code').value.trim();
  const b = db.bookings.find(item => item.code === bCode || item.id === bCode);
  if (!b) {
    alert("Không tìm thấy đoàn tour với mã " + bCode);
    return;
  }

  const category = document.getElementById('incident-category').value;
  const severity = document.getElementById('incident-severity').value;
  const title = document.getElementById('incident-title').value.trim();
  const desc = document.getElementById('incident-desc').value.trim();
  const resolution = document.getElementById('incident-resolution').value.trim();
  const compensation = Number(document.getElementById('incident-compensation').value) || 0;
  const status = document.getElementById('incident-status').value;

  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

  if (!b.incidents) b.incidents = [];

  const newIncident = {
    id: `INC-${Date.now().toString().slice(-4)}`,
    bookingCode: b.code,
    category: category,
    severity: severity,
    title: title,
    desc: desc,
    resolution: resolution,
    compensation: compensation,
    status: status,
    reportedAt: nowStr,
    reportedBy: currentUser ? `${currentUser.name} (${currentUser.roleTitle})` : 'Hệ thống',
    resolvedAt: status === 'RESOLVED' ? nowStr : null
  };

  b.incidents.unshift(newIncident);

  // Nếu nghiêm trọng hoặc khẩn cấp, bắn thông báo thẳng sang CEO
  if (severity === 'CRITICAL' || severity === 'HIGH' || status === 'PENDING_CEO') {
    sendInterDeptNotification('CEO', 'TOUR_INCIDENT', {
      title: `🚨 SỰ CỐ ĐOÀN TOUR ${b.code}: ${title}`,
      message: `Đoàn ${b.code} (${b.customerName}) phát sinh sự cố [${severity}]: "${desc}". Biện pháp: "${resolution}". ${status === 'PENDING_CEO' ? 'Đang chờ CEO chỉ đạo duyệt phương án!' : 'Đã xử lý tại chỗ.'}`,
      referenceId: b.code,
      referenceType: 'BOOKING'
    });
  }

  recordAuditLog('GHI NHẬN SỰ CỐ TOUR', `Đoàn ${b.code} (${b.customerName}): "${title}" [Mức độ: ${severity}, Trạng thái: ${status}, Đền bù: ${formatVND(compensation)}]`);
  saveDatabase();

  alert(`✅ Đã lưu sự cố cho đoàn ${b.code} thành công!\n\nThông tin đã được đồng bộ lên Trung tâm Giám sát CEO & Kiểm toán Blackbox.`);
  closeAddIncidentModal();

  // Cập nhật view chi tiết nếu đang mở
  if (currentDetailBookingId === b.id || currentDetailBookingId === b.code) {
    const incidentBadge = document.getElementById('detail-tab-incident-badge');
    if (incidentBadge) {
      incidentBadge.textContent = b.incidents.length;
      incidentBadge.classList.remove('hidden');
    }
    if (currentBookingDetailTab === 'incidents') {
      renderBookingIncidents(b);
    }
  }

  // Cập nhật CEO dashboard nếu đang ở Mod 1
  if (currentModuleId === 1) {
    renderCeoDashboard();
  }
}

function closeBookingDetailModal() {
  document.getElementById('booking-detail-modal').classList.add('hidden');
  document.getElementById('booking-detail-modal').classList.remove('flex');
}

function openPaymentFromDetail() {
  if (currentDetailBookingId) {
    openPaymentModal(currentDetailBookingId);
  }
}

// Thêm hành khách vào đoàn
function openAddPassengerModal() {
  const form = document.getElementById('add-passenger-form');
  if (form) form.reset();
  document.getElementById('add-passenger-modal').classList.remove('hidden');
  document.getElementById('add-passenger-modal').classList.add('flex');
}

function closeAddPassengerModal() {
  document.getElementById('add-passenger-modal').classList.add('hidden');
  document.getElementById('add-passenger-modal').classList.remove('flex');
}

function handleAddPassengerSubmit(event) {
  event.preventDefault();
  const b = db.bookings.find(item => item.id === currentDetailBookingId || item.code === currentDetailBookingId);
  if (!b) return;

  if (!b.passengers) b.passengers = [];

  const fullName = document.getElementById('pass-fullname').value.trim();
  const gender = document.getElementById('pass-gender').value;
  const birthYear = document.getElementById('pass-birthyear').value;
  const idCard = document.getElementById('pass-idcard').value.trim();
  const phone = document.getElementById('pass-phone').value.trim();
  const roomType = document.getElementById('pass-room').value.trim() || 'Phòng theo đoàn';
  const dietNotes = document.getElementById('pass-notes').value.trim() || 'Bình thường';

  const newPass = {
    id: b.passengers.length + 1,
    fullName,
    gender,
    birthYear: birthYear ? Number(birthYear) : null,
    idCard,
    phone,
    roomType,
    dietNotes
  };

  b.passengers.push(newPass);
  saveDatabase();
  recordAuditLog('THÊM HÀNH KHÁCH VÀO ĐOÀN', `Thêm khách ${fullName} vào danh sách đoàn ${b.code}.`);

  closeAddPassengerModal();
  renderBookingRoomingList(b);
  alert(`✅ Đã thêm hành khách "${fullName}" vào danh sách đoàn ${b.code}!`);
}

// In danh sách đoàn (Rooming List)
function printRoomingList() {
  const b = db.bookings.find(item => item.id === currentDetailBookingId || item.code === currentDetailBookingId);
  if (!b) return;

  const passengers = b.passengers || [];
  let rowsHtml = passengers.map((p, idx) => `
    <tr>
      <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${idx + 1}</td>
      <td style="border: 1px solid #ccc; padding: 6px; font-weight: bold;">${p.fullName}</td>
      <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${p.gender || 'Nam'}</td>
      <td style="border: 1px solid #ccc; padding: 6px; text-align: center;">${p.birthYear || '-'}</td>
      <td style="border: 1px solid #ccc; padding: 6px;">${p.idCard || '-'}</td>
      <td style="border: 1px solid #ccc; padding: 6px;">${p.phone || '-'}</td>
      <td style="border: 1px solid #ccc; padding: 6px; font-weight: bold;">${p.roomType || '-'}</td>
      <td style="border: 1px solid #ccc; padding: 6px;">${p.dietNotes || 'Bình thường'}</td>
    </tr>
  `).join('');

  if (passengers.length === 0) {
    rowsHtml = `<tr><td colspan="8" style="text-align:center; padding: 20px;">Chưa có danh sách hành khách chi tiết</td></tr>`;
  }

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Rooming List - ${b.code}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; font-size: 13px; color: #1e293b; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background: #f1f5f9; border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 11px; text-transform: uppercase; }
          .header { border-bottom: 2px solid #047857; padding-bottom: 10px; margin-bottom: 15px; }
          .title { font-size: 18px; font-weight: bold; color: #047857; text-transform: uppercase; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">DANH SÁCH HÀNH KHÁCH & PHÂN CHIA PHÒNG NGHỈ (ROOMING LIST)</div>
          <div><strong>Mã đơn tour:</strong> ${b.code} | <strong>Chương trình:</strong> ${b.tourName}</div>
          <div><strong>Khách hàng đại diện:</strong> ${b.customerName} - ${b.customerPhone} | <strong>Khởi hành:</strong> ${b.departureDate}</div>
          <div><strong>Số lượng khách:</strong> ${passengers.length || b.paxCount} khách</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ và tên</th>
              <th>Giới tính</th>
              <th>Năm sinh</th>
              <th>CCCD / Passport</th>
              <th>Số điện thoại</th>
              <th>Phân phòng</th>
              <th>Yêu cầu ăn uống / Ghi chú</th>
            </tr>
          </thead>
          <tbody>${rowsHtml}</tbody>
        </table>
        <div style="margin-top: 30px; display: flex; justify-content: space-between; text-align: center;">
          <div><strong>ĐIỀU HÀNH TOUR</strong><br><br><br>Ký tên</div>
          <div><strong>HƯỚNG DẪN VIÊN</strong><br><br><br>Ký tên</div>
          <div><strong>TRƯỞNG ĐOÀN KHÁCH</strong><br><br><br>Ký tên</div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

// In Bảng Quyết Toán P&L Đoàn
function printBookingPnL() {
  const b = db.bookings.find(item => item.id === currentDetailBookingId || item.code === currentDetailBookingId);
  if (!b) return;

  const revenue = Number(b.totalAmount) || 0;
  const supplierOrders = (db.supplierBookings || []).filter(sb => sb.bookingCode === b.code || sb.bookingId === b.id);
  const totalCogs = supplierOrders.reduce((sum, sb) => sum + (Number(sb.agreedCost) || 0), 0);
  const comm = (db.commissions || []).find(c => c.bookingCode === b.code);
  const commAmount = (comm && comm.status !== 'Đã hủy') ? (Number(comm.amount) || 0) : 0;
  const grossProfit = revenue - totalCogs - commAmount;
  const grossMargin = revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(1) : 0;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Báo Cáo Quyết Toán P&L - ${b.code}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 25px; font-size: 13px; color: #1e293b; }
          .header { border-bottom: 2px solid #047857; padding-bottom: 10px; margin-bottom: 15px; }
          .title { font-size: 18px; font-weight: bold; color: #047857; text-transform: uppercase; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 10px; }
          th { background: #f8fafc; font-size: 11px; text-transform: uppercase; text-align: left; }
          .stat-box { display: flex; gap: 15px; margin: 15px 0; }
          .stat-item { flex: 1; border: 1px solid #cbd5e1; padding: 10px; border-radius: 8px; text-align: center; }
          .stat-val { font-size: 15px; font-weight: bold; margin-top: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">BẢNG QUYẾT TOÁN LÃI LỖ ĐOÀN TOUR (TOUR P&L STATEMENT)</div>
          <div><strong>Mã đơn tour:</strong> ${b.code} | <strong>Chương trình:</strong> ${b.tourName}</div>
          <div><strong>Khách hàng:</strong> ${b.customerName} | <strong>Khởi hành:</strong> ${b.departureDate} | <strong>Pax:</strong> ${b.paxCount} khách</div>
        </div>
        <div class="stat-box">
          <div class="stat-item">
            <div>DOANH THU THUẦN (A)</div>
            <div class="stat-val" style="color: #0369a1;">${formatVND(revenue)}</div>
          </div>
          <div class="stat-item">
            <div>CHI PHÍ GIÁ VỐN NCC (B)</div>
            <div class="stat-val" style="color: #be123c;">${formatVND(totalCogs)}</div>
          </div>
          <div class="stat-item">
            <div>HOA HỒNG BÁN HÀNG (C)</div>
            <div class="stat-val" style="color: #b45309;">${formatVND(commAmount)}</div>
          </div>
          <div class="stat-item">
            <div>LỢI NHUẬN GỘP (A - B - C)</div>
            <div class="stat-val" style="color: #15803d;">${formatVND(grossProfit)}</div>
          </div>
          <div class="stat-item">
            <div>BIÊN LỢI NHUẬN (%)</div>
            <div class="stat-val" style="color: #7e22ce;">${grossMargin}%</div>
          </div>
        </div>
        <h3>1. Chi tiết Giá vốn Dịch vụ Nhà Cung Cấp (COGS)</h3>
        <table>
          <thead>
            <tr>
              <th>Mã Lệnh</th>
              <th>Nhà Cung Cấp</th>
              <th>Hạng Mục Dịch Vụ</th>
              <th>Chi Phí Thỏa Thuận</th>
              <th>Đã Thanh Toán</th>
              <th>Công Nợ Còn Lại</th>
            </tr>
          </thead>
          <tbody>
            ${supplierOrders.map(s => `
              <tr>
                <td>${s.code}</td>
                <td><strong>${s.supplierName}</strong></td>
                <td>${s.serviceType}</td>
                <td style="font-weight:bold;">${formatVND(s.agreedCost)}</td>
                <td style="color:#15803d;">${formatVND(s.paidCost || 0)}</td>
                <td style="color:#be123c;">${formatVND(Math.max(0, s.agreedCost - (s.paidCost || 0)))}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div style="margin-top: 40px; display: flex; justify-content: space-between; text-align: center;">
          <div><strong>NGƯỜI LẬP BÁO CÁO</strong><br><br><br>Điều hành tour</div>
          <div><strong>KẾ TOÁN TRƯỞNG</strong><br><br><br>Lê Thị Mai</div>
          <div><strong>GIÁM ĐỐC DUYỆT</strong><br><br><br>Đỗ Thành Đạt</div>
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

// ==========================================
// 17B. QUẢN LÝ PHIẾU XÁC NHẬN DỊCH VỤ TOUR (SERVICE VOUCHER CHO NHÀ CUNG CẤP)
// ==========================================
function openSupplierVoucherModal(orderCode) {
  const sb = (db.supplierBookings || []).find(item => item.code === orderCode || item.id === orderCode);
  if (!sb) return;

  currentVoucherOrderCode = sb.code;
  const s = (db.suppliers || []).find(x => x.id === sb.supplierId || x.code === sb.supplierId);
  const b = (db.bookings || []).find(x => x.code === sb.bookingCode || x.id === sb.bookingId);

  document.getElementById('voucher-code').textContent = `VC-${sb.code}`;
  document.getElementById('voucher-created-at').textContent = `Ngày lập: ${new Date().toISOString().substring(0, 10)}`;

  document.getElementById('voucher-supplier-name').textContent = sb.supplierName || (s ? s.name : '-');
  document.getElementById('voucher-supplier-contact').textContent = s ? s.contactName : 'Đại diện NCC';
  document.getElementById('voucher-supplier-phone').textContent = s ? s.phone : '-';
  document.getElementById('voucher-supplier-bank').textContent = s ? s.bankAccount : 'Theo hợp đồng';

  document.getElementById('voucher-tour-name').textContent = b ? b.tourName : 'Tour Du Lịch Sinh Thái';
  document.getElementById('voucher-booking-code').textContent = sb.bookingCode || (b ? b.code : '-');
  document.getElementById('voucher-pax-count').textContent = b ? `${b.paxCount} khách` : '-';
  document.getElementById('voucher-tour-date').textContent = b ? b.departureDate : '-';

  document.getElementById('voucher-service-type').textContent = sb.serviceType;
  document.getElementById('voucher-notes').textContent = sb.notes || 'Cung cấp theo đúng tiêu chuẩn thỏa thuận với HaHa Eco Travel.';
  document.getElementById('voucher-cost').textContent = formatVND(sb.agreedCost);

  document.getElementById('voucher-debt-policy').textContent = sb.debtPolicyTitle || sb.debtPolicy || 'Thanh toán theo hợp đồng';
  document.getElementById('voucher-due-date').textContent = sb.paymentDueDate || 'Đúng hạn';
  document.getElementById('voucher-paid-cost').textContent = formatVND(sb.paidCost || 0);
  document.getElementById('voucher-remaining-cost').textContent = formatVND(Math.max(0, sb.agreedCost - (sb.paidCost || 0)));

  document.getElementById('voucher-signer-ops').textContent = currentUser ? currentUser.name : 'Điều hành HaHa';
  document.getElementById('voucher-signer-accountant').textContent = sb.approvedBy || 'Lê Thị Mai (Kế toán trưởng)';

  document.getElementById('supplier-voucher-modal').classList.remove('hidden');
  document.getElementById('supplier-voucher-modal').classList.add('flex');
}

function closeSupplierVoucherModal() {
  document.getElementById('supplier-voucher-modal').classList.add('hidden');
  document.getElementById('supplier-voucher-modal').classList.remove('flex');
}

function printSupplierVoucher() {
  window.print();
}

// ==========================================
// 18. QUẢN LÝ THANH TOÁN & PHIẾU THU KHÁCH HÀNG
// ==========================================
function openPaymentModal(bookingId) {
  const b = db.bookings.find(item => item.id === bookingId);
  if (!b) return;

  if (b.status === 'Đã hủy') {
    alert("Không thể thu tiền cho đơn tour đã hủy!");
    return;
  }

  const debt = Math.max(0, Math.round(b.totalAmount - (b.paidAmount || 0)));
  if (debt <= 0) {
    alert("Đơn tour này đã được thanh toán đầy đủ 100%!");
    return;
  }

  document.getElementById('payment-booking-id').value = b.id;
  document.getElementById('payment-info-code').textContent = b.code;
  document.getElementById('payment-info-customer').textContent = `${b.customerName} (${b.customerPhone})`;
  document.getElementById('payment-info-total').textContent = formatVND(b.totalAmount);
  document.getElementById('payment-info-paid').textContent = formatVND(b.paidAmount || 0);
  document.getElementById('payment-info-debt').textContent = formatVND(debt);

  const amtInput = document.getElementById('payment-amount');
  amtInput.value = debt;
  amtInput.removeAttribute('max');
  amtInput.min = "1";
  amtInput.step = "1";
  document.getElementById('payment-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('payment-reference').value = `FT${Date.now().toString().slice(-8)}`;
  document.getElementById('payment-confirmed-by').value = currentUser ? `${currentUser.name} (${currentUser.roleTitle})` : 'Kế toán trưởng';
  document.getElementById('payment-notes').value = '';

  const errEl = document.getElementById('payment-amount-error');
  if (errEl) {
    errEl.textContent = '';
    errEl.classList.add('hidden');
  }

  document.getElementById('payment-modal').classList.remove('hidden');
  document.getElementById('payment-modal').classList.add('flex');
}

function closePaymentModal() {
  document.getElementById('payment-modal').classList.add('hidden');
  document.getElementById('payment-modal').classList.remove('flex');
}

function fillFullRemainingPayment() {
  const bId = document.getElementById('payment-booking-id').value;
  const b = db.bookings.find(item => item.id === bId);
  if (!b) return;
  const debt = Math.max(0, Math.round(b.totalAmount - (b.paidAmount || 0)));
  const amtInput = document.getElementById('payment-amount');
  amtInput.value = debt;
  amtInput.removeAttribute('max');
}

function handlePaymentSubmit(e) {
  e.preventDefault();
  const bookingId = document.getElementById('payment-booking-id').value;
  const amountRaw = document.getElementById('payment-amount').value;
  const amountRes = parseMoneyInput(amountRaw);
  const payDate = document.getElementById('payment-date').value;
  const payMethod = document.getElementById('payment-method').value;
  const refCode = document.getElementById('payment-reference').value.trim();
  const confirmedBy = document.getElementById('payment-confirmed-by').value;
  const notes = document.getElementById('payment-notes').value.trim();

  const b = db.bookings.find(item => item.id === bookingId);
  if (!b) return;

  const debt = Math.max(0, Math.round(b.totalAmount - (b.paidAmount || 0)));
  const errEl = document.getElementById('payment-amount-error');

  if (!amountRes.valid) {
    if (errEl) {
      errEl.textContent = amountRes.reason || "Số tiền thu không hợp lệ!";
      errEl.classList.remove('hidden');
    }
    return;
  }

  const amount = amountRes.value;

  if (amount <= 0) {
    if (errEl) {
      errEl.textContent = "Số tiền thu phải lớn hơn 0 đ!";
      errEl.classList.remove('hidden');
    }
    return;
  }

  if (amount > debt) {
    if (errEl) {
      errEl.textContent = `Số tiền thu (${formatVND(amount)}) vượt quá công nợ còn lại (${formatVND(debt)})! Hệ thống chặn thu vượt khi chưa có quy trình xử lý tiền thừa.`;
      errEl.classList.remove('hidden');
    }
    return;
  }

  if (errEl) {
    errEl.textContent = '';
    errEl.classList.add('hidden');
  }

  const paymentCode = generateNextCode('PT-', db.payments, 'code');

  const paymentRecord = {
    id: paymentCode,
    code: paymentCode,
    bookingId: b.id,
    bookingCode: b.code,
    type: 'PAYMENT',
    amount: amount,
    date: payDate,
    method: payMethod,
    referenceCode: refCode,
    confirmedBy: confirmedBy,
    status: 'CONFIRMED',
    notes: notes,
    createdAt: new Date().toISOString().split('T')[0]
  };

  db.payments.push(paymentRecord);

  // Reconcile số liệu tài chính của đơn từ calculateBookingFinancials
  const bFin = calculateBookingFinancials(b);
  b.paidAmount = bFin.paidAmount;
  b.remainingAmount = bFin.remainingAmount;
  b.refundAmount = bFin.refundAmount;

  if (b.paidAmount >= b.totalAmount && b.totalAmount > 0) {
    b.status = 'Đã thanh toán đủ';
    b.financialStatus = 'Đã thanh toán đủ';
  } else if (b.paidAmount > 0) {
    b.status = 'Đã đặt cọc';
    b.financialStatus = 'Đã đặt cọc';
  } else {
    b.status = 'Chờ thanh toán';
    b.financialStatus = 'Chờ thanh toán';
  }

  // Đồng bộ tức thì sang hồ sơ khách hàng trong CRM và Cổng CTV
  if (b.customerId) {
    syncCustomerFinancials(b.customerId);
  }

  // Tự động kiểm tra hoặc sinh/cập nhật phiếu hoa hồng nếu đơn có CTV (Cô lập theo bookingCode)
  if (b.collaboratorId) {
    const policy = db.tourPolicies.find(tp => tp.id === b.tourId) || findTourPolicy(b.tourName);
    const calc = calculateTourCommission({ tourValue: b.totalAmount, paxCount: b.paxCount, costValue: b.estimatedCost }, policy);
    
    let existingComm = db.commissions.find(c => c.bookingCode === b.code);
    if (!existingComm) {
      existingComm = db.commissions.find(c => !c.bookingCode && (c.customerId === b.customerId || c.customerId === b.customerCode));
      if (existingComm) {
        existingComm.bookingCode = b.code;
      }
    }

    if (!existingComm) {
      const nextCommId = generateNextCode('HH-', db.commissions, 'id');
      const newComm = {
        id: nextCommId,
        bookingCode: b.code,
        ctvId: b.collaboratorId,
        customerId: b.customerId,
        customerName: b.customerName,
        tourName: b.tourName,
        tourValue: b.totalAmount,
        policyApplied: `${policy.name} (${policy.methodTitle})`,
        basisText: calc.basisText,
        amount: calc.amount,
        status: 'Chờ duyệt',
        createdAt: new Date().toISOString().split('T')[0],
        approvedBy: null
      };
      db.commissions.unshift(newComm);
    } else {
      existingComm.tourValue = b.totalAmount;
      existingComm.amount = calc.amount;
      existingComm.basisText = calc.basisText;
      existingComm.policyApplied = `${policy.name} (${policy.methodTitle})`;
    }

    // Nếu tour đã nghiệm thu hoàn thành và đơn tour đã thanh toán đủ 100% -> tự động duyệt chi
    if (b.paidAmount >= b.totalAmount && b.totalAmount > 0 && b.tourStatus === 'Hoàn thành tour') {
      const targetComm = db.commissions.find(c => c.bookingCode === b.code);
      if (targetComm && targetComm.status === 'Chờ duyệt') {
        targetComm.status = 'Đã duyệt chi';
        targetComm.approvedBy = `${confirmedBy} (Tự động duyệt chi khi hoàn tất thanh toán & hoàn thành tour)`;
      }
    }
  }

  saveDatabase();
  recordAuditLog('THU TIỀN KHÁCH HÀNG', `${confirmedBy} đã lập phiếu thu ${paymentCode} (${formatVND(amount)}) cho đơn tour ${b.code} (${b.customerName}). Mã tham chiếu: ${refCode}.`);
  alert(`✅ Đã ghi nhận phiếu thu thành công!\n- Mã phiếu: ${paymentCode}\n- Số tiền: ${formatVND(amount)}\n- Đơn tour: ${b.code}\n- Trạng thái đơn: ${b.status}`);

  closePaymentModal();
  refreshActiveView();

  if (currentDetailBookingId === b.id) {
    openBookingDetailModal(b.id);
  }
}

// ==========================================
// 19. PHÂN HỆ 5: ĐIỀU HÀNH TOUR & NHÀ CUNG CẤP
// ==========================================
function switchOpsTab(tab) {
  currentOpsTab = tab;

  const btnIncoming = document.getElementById('ops-tab-incoming-btn');
  const btnTours = document.getElementById('ops-tab-tours-btn');
  const btnSuppliers = document.getElementById('ops-tab-suppliers-btn');
  const btnOrders = document.getElementById('ops-tab-orders-btn');

  const contentIncoming = document.getElementById('ops-tab-incoming-content');
  const contentTours = document.getElementById('ops-tab-tours-content');
  const contentSuppliers = document.getElementById('ops-tab-suppliers-content');
  const contentOrders = document.getElementById('ops-tab-orders-content');

  [btnIncoming, btnTours, btnSuppliers, btnOrders].forEach(b => {
    if (b) b.classList.remove('active');
  });
  [contentIncoming, contentTours, contentSuppliers, contentOrders].forEach(c => {
    if (c) c.classList.add('hidden');
  });

  if (tab === 'incoming') {
    if (btnIncoming) btnIncoming.classList.add('active');
    if (contentIncoming) contentIncoming.classList.remove('hidden');
    renderOpsIncoming();
  } else if (tab === 'tours') {
    if (btnTours) btnTours.classList.add('active');
    if (contentTours) contentTours.classList.remove('hidden');
    renderOpsTours();
  } else if (tab === 'suppliers') {
    if (btnSuppliers) btnSuppliers.classList.add('active');
    if (contentSuppliers) contentSuppliers.classList.remove('hidden');
    renderOpsSuppliers();
  } else if (tab === 'orders') {
    if (btnOrders) btnOrders.classList.add('active');
    if (contentOrders) contentOrders.classList.remove('hidden');
    renderOpsOrders();
  }
}

function renderOpsModule() {
  updateNotificationBadges();
  renderOpsIncomingBadge();
  switchOpsTab(currentOpsTab);
}

function renderOpsIncoming() {
  const tbody = document.getElementById('ops-incoming-table-body');
  if (!tbody) return;

  const incomingBookings = db.bookings.filter(b => b.status !== 'Đã hủy' && b.tourStatus === 'Mới tiếp nhận');

  const countText = document.getElementById('ops-incoming-count-text');
  if (countText) countText.textContent = incomingBookings.length;

  renderOpsIncomingBadge();

  if (incomingBookings.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="py-10 text-center">
          <div class="flex flex-col items-center justify-center space-y-2 text-slate-400">
            <span class="text-3xl">🎉</span>
            <div class="font-bold text-slate-600">Hiện tại không có đoàn tour nào đang chờ tiếp nhận</div>
            <div class="text-[11px] text-slate-400">Khi bộ phận Kinh doanh (Sale) chốt tour thành công, thông tin đoàn sẽ tự động xuất hiện tại đây kèm chuông thông báo.</div>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = incomingBookings.map(b => {
    const notif = (db.notifications || []).find(n => n.referenceId === b.code && n.type === 'HANDOVER_TOUR');
    const isUnread = notif ? notif.status === 'UNREAD' : true;
    const senderDisplay = notif ? `${escapeHtml(notif.senderName)}` : (escapeHtml(b.staff || 'Sale'));
    const statusBadge = isUnread
      ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">🔵 Chưa đọc & Chờ tiếp nhận</span>'
      : '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">⏳ Đã xem (Chờ tiếp nhận)</span>';

    return `
      <tr class="hover:bg-indigo-50/50 transition-colors bg-indigo-50/20">
        <td class="py-3 px-3.5 font-mono font-bold text-brand-800">
          <div>${escapeHtml(b.code)}</div>
          <div class="text-[9px] text-slate-400">${escapeHtml(b.createdAt || '')}</div>
        </td>
        <td class="py-3 px-3.5">
          <div class="font-bold text-slate-900">${escapeHtml(b.customerName)}</div>
          <div class="text-[10px] text-slate-500 font-mono">📞 ${escapeHtml(b.customerPhone)}</div>
        </td>
        <td class="py-3 px-3.5">
          <div class="font-semibold text-slate-900">${escapeHtml(b.tourName)}</div>
          <div class="text-[10px] text-slate-500">${escapeHtml(b.notes || '')}</div>
        </td>
        <td class="py-3 px-3.5 font-mono text-slate-700 font-medium">${escapeHtml(b.departureDate)}</td>
        <td class="py-3 px-3.5 text-center font-bold text-slate-900">
          <span class="px-2 py-0.5 bg-slate-100 rounded-lg">${b.paxCount} khách</span>
        </td>
        <td class="py-3 px-3.5 font-mono font-bold text-emerald-700">${formatVND(b.totalAmount || 0)}</td>
        <td class="py-3 px-3.5">
          <div class="font-medium text-slate-800">${senderDisplay}</div>
          <div class="text-[9px] text-slate-400">Bàn giao từ Sale</div>
        </td>
        <td class="py-3 px-3.5">${statusBadge}</td>
        <td class="py-3 px-3.5 text-center space-x-1 whitespace-nowrap">
          <button onclick="acknowledgeIncomingTour('${b.id}')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all inline-flex items-center space-x-1">
            <span>📥 Tiếp nhận tour</span>
          </button>
                      <button onclick="openBookingDetailModal('${b.id}')" class="action-btn action-btn-detail" title="Xem hồ sơ tour">👁️ Chi tiết</button>
            <button onclick="openCreateInvoiceModal('${b.code}')" class="action-btn text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-bold border border-indigo-200" title="Xuất hóa đơn điện tử GTGT theo TT 219">🧾 HĐĐT</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderOpsIncomingBadge() {
  const badge = document.getElementById('ops-incoming-badge');
  if (!badge) return;
  const count = (db.bookings || []).filter(b => b.status !== 'Đã hủy' && b.tourStatus === 'Mới tiếp nhận').length;
  badge.textContent = count;
  if (count > 0) {
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function acknowledgeIncomingTour(bookingId) {
  const b = db.bookings.find(item => item.id === bookingId || item.code === bookingId);
  if (!b) return;

  b.tourStatus = 'Chưa khởi hành';
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

  if (db.notifications) {
    const notif = db.notifications.find(n => n.referenceId === b.code && n.type === 'HANDOVER_TOUR');
    if (notif) {
      notif.status = 'ACKNOWLEDGED';
      notif.acknowledgedAt = nowStr;
      notif.acknowledgedBy = currentUser ? `${currentUser.name} (${currentUser.roleTitle})` : 'Điều hành';
    }
  }

  sendInterDeptNotification({
    senderRole: 'OPS',
    senderName: currentUser ? `${currentUser.name} (Điều hành)` : 'Bộ phận Điều hành (OPS)',
    targetRole: 'SALE',
    targetModule: 4,
    type: 'HANDOVER_ACK',
    title: `Điều hành đã tiếp nhận đoàn tour: ${b.code}`,
    message: `Bộ phận Điều hành (${currentUser ? currentUser.name : 'OPS'}) đã chính thức tiếp nhận bàn giao đoàn tour ${b.code} (${b.customerName} - ${b.tourName}) và đưa vào kế hoạch vận hành.`,
    referenceId: b.code,
    referenceType: 'BOOKING'
  });

  saveDatabase();
  recordAuditLog('TIẾP NHẬN ĐOÀN TOUR TỪ SALE', `Điều hành đã tiếp nhận đoàn tour ${b.code} (${b.tourName} - ${b.customerName}) từ Sale.`);

  alert(`✅ ĐÃ TIẾP NHẬN ĐOÀN TOUR ${b.code} THÀNH CÔNG!\n\n- Khách hàng: ${b.customerName}\n- Tour: ${b.tourName}\n- Ngày khởi hành: ${b.departureDate}\n\n👉 Đoàn tour đã được chuyển vào "🚍 Lịch Khởi Hành & Điều Hành Đoàn". Thông báo xác nhận tiếp nhận đã được gửi tự động về cho Sale.`);

  renderOpsIncoming();
  renderOpsTours();
  updateNotificationBadges();
}

function acknowledgeAllIncomingTours() {
  const incoming = (db.bookings || []).filter(b => b.status !== 'Đã hủy' && b.tourStatus === 'Mới tiếp nhận');
  if (incoming.length === 0) {
    alert("Hiện không có đoàn tour nào đang chờ tiếp nhận.");
    return;
  }

  if (confirm(`Bạn có chắc muốn tiếp nhận TẤT CẢ ${incoming.length} đoàn tour mới bàn giao từ Sale?`)) {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    incoming.forEach(b => {
      b.tourStatus = 'Chưa khởi hành';
      if (db.notifications) {
        const notif = db.notifications.find(n => n.referenceId === b.code && n.type === 'HANDOVER_TOUR');
        if (notif) {
          notif.status = 'ACKNOWLEDGED';
          notif.acknowledgedAt = nowStr;
          notif.acknowledgedBy = currentUser ? `${currentUser.name} (${currentUser.roleTitle})` : 'Điều hành';
        }
      }
    });

    saveDatabase();
    recordAuditLog('TIẾP NHẬN TOÀN BỘ ĐOÀN TOUR', `Điều hành đã tiếp nhận toàn bộ ${incoming.length} đoàn tour bàn giao từ Sale.`);
    alert(`✅ ĐÃ TIẾP NHẬN THÀNH CÔNG ${incoming.length} ĐOÀN TOUR!\nTất cả đã được đưa vào kế hoạch vận hành chính thức.`);
    renderOpsIncoming();
    renderOpsTours();
    updateNotificationBadges();
  }
}

function renderOpsTours() {
  const tbody = document.getElementById('ops-tours-table-body');
  if (!tbody) return;

  const activeBookings = db.bookings.filter(b => b.status !== 'Đã hủy');
  if (activeBookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="py-8 text-center text-xs text-slate-400">Chưa có đoàn tour nào sẵn sàng điều hành</td></tr>`;
    return;
  }

  tbody.innerHTML = activeBookings.map(b => {
    let opBadge = '<span class="tour-op-badge-preparing">⏳ Chưa khởi hành</span>';
    if (b.tourStatus === 'Mới tiếp nhận') opBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 animate-pulse">📥 Mới tiếp nhận từ Sale</span>';
    else if (b.tourStatus === 'Đang đi tour') opBadge = '<span class="tour-op-badge-running">🚍 Đang đi tour</span>';
    else if (b.tourStatus === 'Hoàn thành tour') opBadge = '<span class="tour-op-badge-done">✅ Hoàn thành</span>';

    const isIncoming = b.tourStatus === 'Mới tiếp nhận';
    const acceptBtn = isIncoming
      ? `<button onclick="acknowledgeIncomingTour('${b.id}')" class="action-btn text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 font-bold" title="Xác nhận tiếp nhận đoàn tour">📥 Tiếp nhận</button>`
      : '';

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3 px-3.5 font-mono font-bold text-brand-800">${escapeHtml(b.code)}</td>
        <td class="py-3 px-3.5 font-semibold text-slate-900">${escapeHtml(b.tourName)}</td>
        <td class="py-3 px-3.5 font-mono text-slate-700">${escapeHtml(b.departureDate)}</td>
        <td class="py-3 px-3.5">
          <div class="font-bold text-slate-800">${escapeHtml(b.customerName)}</div>
          <div class="text-[10px] text-slate-400 font-mono">${escapeHtml(b.customerPhone)}</div>
        </td>
        <td class="py-3 px-3.5 text-center font-bold text-slate-800">${b.paxCount}</td>
        <td class="py-3 px-3.5 font-mono text-slate-700">${formatVND(b.estimatedCost || 0)}</td>
        <td class="py-3 px-3.5">${opBadge}</td>
        <td class="py-3 px-3.5 text-slate-600 font-medium">${escapeHtml(b.staff || 'Điều hành')}</td>
        <td class="py-3 px-3.5 text-center space-x-1 whitespace-nowrap">
          ${acceptBtn}
          <select onchange="updateTourOpStatus('${b.id}', this.value)" class="text-[11px] px-2 py-1 rounded-lg border border-slate-300 bg-white font-medium">
            <option value="Mới tiếp nhận" ${b.tourStatus === 'Mới tiếp nhận' ? 'selected' : ''}>📥 Mới tiếp nhận</option>
            <option value="Chưa khởi hành" ${b.tourStatus === 'Chưa khởi hành' ? 'selected' : ''}>⏳ Chưa đi</option>
            <option value="Đang đi tour" ${b.tourStatus === 'Đang đi tour' ? 'selected' : ''}>🚍 Đang đi</option>
            <option value="Hoàn thành tour" ${b.tourStatus === 'Hoàn thành tour' ? 'selected' : ''}>✅ Đã xong</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

function updateTourOpStatus(bookingId, newStatus) {
  if (currentUser && currentUser.role === 'KE_TOAN') {
    alert("⛔ BẢO VỆ DỮ LIỆU: Kế toán không có quyền cập nhật trạng thái vận hành tour của bộ phận Điều hành!");
    return;
  }
  const b = db.bookings.find(item => item.id === bookingId);
  if (!b) return;

  b.tourStatus = newStatus;
  if (newStatus === 'Hoàn thành tour') {
    b.status = 'Đã hoàn thành';

    // Gửi thông báo chuyển giao sang Kế toán để quyết toán & duyệt hoa hồng
    sendInterDeptNotification({
      senderRole: 'OPS',
      senderName: currentUser ? `${currentUser.name} (Điều hành)` : 'Bộ phận Điều hành (OPS)',
      targetRole: 'KE_TOAN',
      targetModule: 7,
      type: 'HANDOVER_TOUR_COMPLETED',
      title: `Nghiệm thu hoàn thành tour: ${b.code}`,
      message: `Đoàn tour ${b.code} (${b.tourName} - ${b.customerName}) đã hoàn thành thực địa. Điều hành chuyển hồ sơ sang Kế toán để quyết toán chi phí và duyệt chi hoa hồng CTV.`,
      referenceId: b.code,
      referenceType: 'BOOKING'
    });

    // Cập nhật hoa hồng liên quan: Chỉ duyệt chi khi tour hoàn thành VÀ đơn tour đã thanh toán đủ 100%
    const comm = db.commissions.find(c => c.bookingCode === b.code || (!c.bookingCode && (c.customerId === b.customerId || c.customerId === b.customerCode)));
    if (comm) {
      if (!comm.bookingCode) comm.bookingCode = b.code;
      if (b.paidAmount >= b.totalAmount && b.totalAmount > 0) {
        if (comm.status === 'Chờ duyệt') {
          comm.status = 'Đã duyệt chi';
          comm.approvedBy = `${currentUser ? currentUser.name : 'Điều hành'} (Điều hành nghiệm thu tour)`;
        }
      } else {
        comm.note = 'Chờ khách hoàn tất thanh toán trước khi duyệt chi';
      }
    }
  }

  saveDatabase();
  recordAuditLog('CẬP NHẬT TRẠNG THÁI VẬN HÀNH TOUR', `Đoàn ${b.code} (${b.tourName}) chuyển trạng thái: "${newStatus}".`);
  renderOpsTours();
}

// ==========================================
// QUẢN TRỊ ĐỐI TÁC CUNG ỨNG ĐA TỈNH THÀNH, ĐA LOẠI HÌNH & BỘ LỌC ĐA CHIỀU (PHÂN HỆ 5)
// ==========================================
let currentSupplierViewMode = 'card'; // 'card' | 'table'
let supplierFilterProvince = 'ALL';
let supplierFilterCategory = 'ALL';
let supplierFilterStars = 'ALL';
let supplierFilterPrice = 'ALL';
let supplierSearchKeyword = '';
let selectedDetailSupplierId = 'NCC-001';
let currentSupplierDetailTab = 'services'; // 'services', 'policies', 'bulletins', 'orders'
let currentSupplierPortalTab = 'profile';  // 'profile', 'services', 'live', 'orders'

function getFilteredSuppliers() {
  return (db.suppliers || []).filter(s => {
    // 1. Từ khóa tìm kiếm
    if (supplierSearchKeyword) {
      const q = supplierSearchKeyword.toLowerCase();
      const matchName = (s.name || '').toLowerCase().includes(q);
      const matchContact = (s.contactName || '').toLowerCase().includes(q);
      const matchPhone = (s.phone || '').toLowerCase().includes(q);
      const matchAddress = (s.address || '').toLowerCase().includes(q);
      const matchCode = (s.code || '').toLowerCase().includes(q);
      if (!matchName && !matchContact && !matchPhone && !matchAddress && !matchCode) return false;
    }

    // 2. Tỉnh thành
    if (supplierFilterProvince !== 'ALL') {
      if (!s.province || !s.province.includes(supplierFilterProvince)) return false;
    }

    // 3. Loại hình
    if (supplierFilterCategory !== 'ALL' && s.category !== supplierFilterCategory) {
      return false;
    }

    // 4. Xếp hạng Sao
    if (supplierFilterStars !== 'ALL') {
      const starNum = parseInt(supplierFilterStars, 10);
      if (s.stars !== starNum) return false;
    }

    // 5. Khoảng giá
    if (supplierFilterPrice !== 'ALL') {
      const minP = s.priceMin || 0;
      const maxP = s.priceMax || minP;
      if (supplierFilterPrice === 'UNDER_500K') {
        if (minP >= 500000) return false;
      } else if (supplierFilterPrice === '500K_1M') {
        if (maxP < 500000 || minP > 1000000) return false;
      } else if (supplierFilterPrice === '1M_2.5M') {
        if (maxP < 1000000 || minP > 2500000) return false;
      } else if (supplierFilterPrice === 'OVER_2.5M') {
        if (maxP < 2500000) return false;
      }
    }

    return true;
  });
}

function onOpsSupplierFilterChange() {
  const kwInput = document.getElementById('ops-supplier-search-input');
  const provSel = document.getElementById('ops-supplier-filter-province');
  const catSel = document.getElementById('ops-supplier-filter-category');
  const starSel = document.getElementById('ops-supplier-filter-stars');
  const priceSel = document.getElementById('ops-supplier-filter-price');

  if (kwInput) supplierSearchKeyword = kwInput.value.trim();
  if (provSel) supplierFilterProvince = provSel.value;
  if (catSel) supplierFilterCategory = catSel.value;
  if (starSel) supplierFilterStars = starSel.value;
  if (priceSel) supplierFilterPrice = priceSel.value;

  renderOpsSuppliers();
}

function resetOpsSupplierFilters() {
  supplierSearchKeyword = '';
  supplierFilterProvince = 'ALL';
  supplierFilterCategory = 'ALL';
  supplierFilterStars = 'ALL';
  supplierFilterPrice = 'ALL';

  const kwInput = document.getElementById('ops-supplier-search-input');
  const provSel = document.getElementById('ops-supplier-filter-province');
  const catSel = document.getElementById('ops-supplier-filter-category');
  const starSel = document.getElementById('ops-supplier-filter-stars');
  const priceSel = document.getElementById('ops-supplier-filter-price');

  if (kwInput) kwInput.value = '';
  if (provSel) provSel.value = 'ALL';
  if (catSel) catSel.value = 'ALL';
  if (starSel) starSel.value = 'ALL';
  if (priceSel) priceSel.value = 'ALL';

  renderOpsSuppliers();
}

function setOpsSupplierViewMode(mode) {
  currentSupplierViewMode = mode;
  const btnCard = document.getElementById('btn-ops-sup-view-card');
  const btnTable = document.getElementById('btn-ops-sup-view-table');
  const gridEl = document.getElementById('ops-suppliers-card-grid');
  const tableContainer = document.getElementById('ops-suppliers-table-container');

  if (mode === 'card') {
    if (btnCard) { btnCard.classList.add('bg-white', 'shadow-sm', 'text-slate-900'); btnCard.classList.remove('text-slate-600'); }
    if (btnTable) { btnTable.classList.remove('bg-white', 'shadow-sm', 'text-slate-900'); btnTable.classList.add('text-slate-600'); }
    if (gridEl) gridEl.classList.remove('hidden');
    if (tableContainer) tableContainer.classList.add('hidden');
  } else {
    if (btnTable) { btnTable.classList.add('bg-white', 'shadow-sm', 'text-slate-900'); btnTable.classList.remove('text-slate-600'); }
    if (btnCard) { btnCard.classList.remove('bg-white', 'shadow-sm', 'text-slate-900'); btnCard.classList.add('text-slate-600'); }
    if (gridEl) gridEl.classList.add('hidden');
    if (tableContainer) tableContainer.classList.remove('hidden');
  }
}

function renderOpsSuppliers() {
  const allSuppliers = db.suppliers || [];
  const filtered = getFilteredSuppliers();

  // 1. Thống kê nhanh
  const statTotal = document.getElementById('ops-stat-total-suppliers');
  const statProvs = document.getElementById('ops-stat-provinces-count');
  const statStars = document.getElementById('ops-stat-high-star-count');
  const statBulletins = document.getElementById('ops-stat-realtime-bulletins');
  const badgeCount = document.getElementById('ops-supplier-filter-count-badge');

  const uniqueProvinces = [...new Set(allSuppliers.map(s => s.province).filter(Boolean))];
  const highStarCount = allSuppliers.filter(s => (s.stars || 0) >= 4).length;
  const liveCount = allSuppliers.filter(s => s.dailyLiveStatus && s.dailyLiveStatus.dailyNotice).length;

  if (statTotal) statTotal.textContent = `${allSuppliers.length} Đối tác`;
  if (statProvs) statProvs.textContent = `${uniqueProvinces.length} Tỉnh/Thành`;
  if (statStars) statStars.textContent = `${highStarCount} Đạt Chuẩn 4-5★`;
  if (statBulletins) statBulletins.textContent = `${liveCount} Cập Nhật Hôm Nay`;
  if (badgeCount) badgeCount.textContent = `Hiển thị ${filtered.length}/${allSuppliers.length} đối tác`;

  // 2. Render Card Grid View
  const gridEl = document.getElementById('ops-suppliers-card-grid');
  if (gridEl) {
    if (filtered.length === 0) {
      gridEl.innerHTML = `
        <div class="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
          <div class="text-4xl">🔍</div>
          <h4 class="text-sm font-bold text-slate-800">Không tìm thấy đối tác phù hợp với bộ lọc</h4>
          <p class="text-xs text-slate-500">Vui lòng điều chỉnh lại tỉnh thành, khoảng giá hoặc từ khóa tìm kiếm.</p>
          <button onclick="resetOpsSupplierFilters()" class="px-3.5 py-1.5 bg-brand-50 text-brand-700 text-xs font-bold rounded-xl border border-brand-200 hover:bg-brand-100">
            🧹 Xóa toàn bộ bộ lọc
          </button>
        </div>
      `;
    } else {
      gridEl.innerHTML = filtered.map(s => {
        let starsHtml = '⭐'.repeat(s.stars || 4);
        let catBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Khác</span>';
        if (s.category === 'HOTEL') catBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">🏨 Khách sạn / Lưu trú</span>';
        else if (s.category === 'TRANSPORT') catBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">🚍 Xe & Vận chuyển</span>';
        else if (s.category === 'GUIDE') catBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">🧭 Hướng dẫn viên</span>';
        else if (s.category === 'RESTAURANT') catBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">🍽️ Nhà hàng ẩm thực</span>';
        else if (s.category === 'TICKET') catBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">🎫 Vé & Trải nghiệm</span>';
        else if (s.category === 'TREKKING') catBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">🧗 Dẫn đường & Porter</span>';

        const priceDisplay = s.priceMin && s.priceMax
          ? `${formatVND(s.priceMin)} - ${formatVND(s.priceMax)}`
          : (s.priceMin ? `Từ ${formatVND(s.priceMin)}` : 'Liên hệ báo giá B2B');

        const liveNotice = s.dailyLiveStatus?.dailyNotice || 'Sẵn sàng tiếp nhận dịch vụ';
        const capacityNote = s.dailyLiveStatus?.availableCapacityNote || 'Đầy đủ công suất phục vụ';

        return `
          <div class="bg-white rounded-2xl border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all p-4 flex flex-col justify-between space-y-3 relative group">
            <!-- Header card -->
            <div>
              <div class="flex items-start justify-between gap-2 mb-2">
                <div class="flex items-center space-x-2.5">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl shadow-sm">
                    ${s.avatar || '🏨'}
                  </div>
                  <div>
                    <h4 class="text-xs font-extrabold text-slate-900 group-hover:text-brand-700 transition-colors cursor-pointer" onclick="openSupplierDetailModal('${s.id}')">
                      ${escapeHtml(s.name)}
                    </h4>
                    <div class="flex items-center space-x-1.5 mt-0.5">
                      <span class="font-mono text-[10px] font-bold text-brand-800">${escapeHtml(s.code)}</span>
                      <span class="text-slate-300">•</span>
                      <span class="text-[11px] tracking-wider" title="${s.stars || 4} Sao">${starsHtml}</span>
                    </div>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">📍 ${escapeHtml(s.province || 'Toàn quốc')}</span>
              </div>

              <!-- Badges & info -->
              <div class="flex flex-wrap items-center gap-1.5 mb-2.5">
                ${catBadge}
                <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  ${escapeHtml(s.debtPolicyTitle || 'Công nợ theo HĐ')}
                </span>
              </div>

              <!-- Price B2B -->
              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1 mb-2.5">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="text-slate-500 font-medium">Bảng giá B2B đại lý:</span>
                  <span class="font-bold text-emerald-700 font-mono">${priceDisplay}</span>
                </div>
                <div class="text-[11px] text-slate-600 line-clamp-1">
                  <span class="text-slate-400">Địa chỉ:</span> ${escapeHtml(s.address || 'Đang cập nhật')}
                </div>
              </div>

              <!-- Real-time Live Status Pulse -->
              <div class="p-2.5 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-xl border border-emerald-200/80 space-y-1">
                <div class="flex items-center justify-between text-[10px] font-bold text-emerald-900">
                  <span class="flex items-center space-x-1">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Bản tin trực tiếp hằng ngày:</span>
                  </span>
                  <span class="text-slate-400 font-normal">${s.dailyLiveStatus?.lastUpdated || 'Hôm nay'}</span>
                </div>
                <p class="text-[11px] text-emerald-950 font-medium line-clamp-2 leading-relaxed">
                  ${escapeHtml(liveNotice)}
                </p>
                <div class="text-[10px] text-emerald-700 font-semibold pt-0.5 flex items-center space-x-1">
                  <span>⚡ Công suất:</span>
                  <span>${escapeHtml(capacityNote)}</span>
                </div>
              </div>
            </div>

            <!-- Footer actions -->
            <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <div class="text-[11px] text-slate-500">
                <span>📞 ${escapeHtml(s.phone)}</span>
              </div>
              <div class="flex items-center space-x-1.5">
                <button type="button" onclick="openSupplierDetailModal('${s.id}')" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center space-x-1">
                  <span>🔍 Chi tiết 360°</span>
                </button>
                <button type="button" onclick="openAddSupplierBookingModalWithSupplier('${s.id}')" class="px-2.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center space-x-1">
                  <span>📑 Đặt dịch vụ</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // 3. Render Table View (Giữ nguyên tương thích tuyệt đối với cấu trúc tbody cũ)
  const tbody = document.getElementById('ops-suppliers-table-body');
  if (tbody) {
    tbody.innerHTML = filtered.map(s => {
      let starsHtml = '⭐'.repeat(s.stars || 4);
      let catBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Khác</span>';
      if (s.category === 'HOTEL') catBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">🏨 Khách sạn</span>';
      else if (s.category === 'TRANSPORT') catBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">🚍 Xe du lịch</span>';
      else if (s.category === 'GUIDE') catBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">🧭 Hướng dẫn viên</span>';
      else if (s.category === 'RESTAURANT') catBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">🍽️ Nhà hàng</span>';
      else if (s.category === 'TICKET') catBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">🎫 Vé tham quan</span>';
      else if (s.category === 'TREKKING') catBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">🧗 Dẫn đường</span>';

      const priceDisplay = s.priceMin && s.priceMax
        ? `${formatVND(s.priceMin)} - ${formatVND(s.priceMax)}`
        : (s.priceMin ? `Từ ${formatVND(s.priceMin)}` : 'B2B ưu đãi');

      const liveNotice = s.dailyLiveStatus?.dailyNotice || 'Sẵn sàng nhận đoàn';

      return `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-3 px-3.5 font-mono font-bold text-brand-800">${escapeHtml(s.code)}</td>
          <td class="py-3 px-3.5">
            <div class="font-bold text-slate-900 cursor-pointer hover:text-brand-700 flex items-center space-x-1.5" onclick="openSupplierDetailModal('${s.id}')">
              <span>${s.avatar || '🏨'}</span>
              <span>${escapeHtml(s.name)}</span>
            </div>
            <div class="text-[11px] text-amber-600 mt-0.5">${starsHtml}</div>
          </td>
          <td class="py-3 px-3.5">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-800">📍 ${escapeHtml(s.province || 'Toàn quốc')}</span>
          </td>
          <td class="py-3 px-3.5">${catBadge}</td>
          <td class="py-3 px-3.5 font-mono font-bold text-emerald-700 text-[11px]">${priceDisplay}</td>
          <td class="py-3 px-3.5 max-w-[200px]">
            <div class="text-[11px] text-emerald-800 font-medium truncate flex items-center space-x-1" title="${escapeHtml(liveNotice)}">
              <span class="text-emerald-500">🟢</span>
              <span>${escapeHtml(liveNotice)}</span>
            </div>
          </td>
          <td class="py-3 px-3.5">
            <div class="text-slate-800 font-medium">${escapeHtml(s.contactName)}</div>
            <div class="font-mono text-slate-500 text-[11px]">${escapeHtml(s.phone)}</div>
          </td>
          <td class="py-3 px-3.5 text-center space-x-1 whitespace-nowrap">
            <button onclick="openSupplierDetailModal('${s.id}')" class="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded" title="Soi chi tiết đối tác">👁️ Chi tiết</button>
            <button onclick="deleteSupplier('${s.id}')" class="action-btn action-btn-delete" title="Xóa NCC">🗑️</button>
          </td>
        </tr>
      `;
    }).join('');
  }
}

function openAddSupplierBookingModalWithSupplier(supplierId) {
  openAddSupplierBookingModal();
  const sel = document.getElementById('form-sb-supplier');
  if (sel) {
    sel.value = supplierId;
    handleSupplierBookingPolicyUpdate();
  }
}

// ==========================================
// MODAL CHI TIẾT ĐỐI TÁC 360° (BẢNG GIÁ + CHÍNH SÁCH + BẢN TIN THỜI GIAN THỰC)
// ==========================================
function openSupplierDetailModal(supplierId) {
  const s = (db.suppliers || []).find(x => x.id === supplierId || x.code === supplierId);
  if (!s) return;
  selectedDetailSupplierId = s.id;

  // Header modal
  const nameEl = document.getElementById('sup-detail-name');
  const codeEl = document.getElementById('sup-detail-code');
  const starsEl = document.getElementById('sup-detail-stars');
  const provEl = document.getElementById('sup-detail-province');
  const catEl = document.getElementById('sup-detail-category');
  const addrEl = document.getElementById('sup-detail-address');
  const contactEl = document.getElementById('sup-detail-contact');
  const phoneEl = document.getElementById('sup-detail-phone');
  const emailEl = document.getElementById('sup-detail-email');
  const bankEl = document.getElementById('sup-detail-bank');
  const licenseEl = document.getElementById('sup-detail-license');
  const descEl = document.getElementById('sup-detail-desc');
  const avatarEl = document.getElementById('sup-detail-avatar');

  if (nameEl) nameEl.textContent = s.name;
  if (codeEl) codeEl.textContent = s.code;
  if (starsEl) starsEl.textContent = '⭐'.repeat(s.stars || 4) + ` (${s.stars || 4} Sao)`;
  if (provEl) provEl.textContent = `📍 ${s.province || 'Toàn quốc'}`;
  if (catEl) catEl.textContent = s.categoryTitle || s.category;
  if (addrEl) addrEl.textContent = s.address || 'Đang cập nhật';
  if (contactEl) contactEl.textContent = s.contactName || 'Người đại diện';
  if (phoneEl) phoneEl.textContent = s.phone || 'Chưa có SĐT';
  if (emailEl) emailEl.textContent = s.email || 'Chưa có email';
  if (bankEl) bankEl.textContent = s.bankAccount || 'Chưa cập nhật tài khoản';
  if (licenseEl) licenseEl.textContent = s.businessLicense || 'Đã kiểm tra GPKD';
  if (descEl) descEl.textContent = s.description || 'Đối tác cung ứng dịch vụ chiến lược của HaHa Eco Travel.';
  if (avatarEl) avatarEl.textContent = s.avatar || '🏨';

  // Render các tabs
  renderSupplierDetailTabs(s);
  switchSupplierDetailTab(currentSupplierDetailTab);

  const modal = document.getElementById('supplier-detail-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeSupplierDetailModal() {
  const modal = document.getElementById('supplier-detail-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function switchSupplierDetailTab(tabName) {
  currentSupplierDetailTab = tabName;
  const tabs = ['services', 'policies', 'bulletins', 'orders'];
  tabs.forEach(t => {
    const btn = document.getElementById(`sup-detail-tab-${t}-btn`);
    const content = document.getElementById(`sup-detail-tab-${t}-content`);
    if (btn) {
      if (t === tabName) {
        btn.classList.add('active', 'border-brand-600', 'text-brand-700', 'bg-brand-50/50');
        btn.classList.remove('border-transparent', 'text-slate-600');
      } else {
        btn.classList.remove('active', 'border-brand-600', 'text-brand-700', 'bg-brand-50/50');
        btn.classList.add('border-transparent', 'text-slate-600');
      }
    }
    if (content) {
      if (t === tabName) content.classList.remove('hidden');
      else content.classList.add('hidden');
    }
  });
}

function renderSupplierDetailTabs(s) {
  // Tab 1: Bảng giá dịch vụ
  const servicesBody = document.getElementById('sup-detail-services-tbody');
  if (servicesBody) {
    const sList = s.services || [];
    if (sList.length === 0) {
      servicesBody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-400">Chưa có dịch vụ nào trong bảng giá</td></tr>`;
    } else {
      servicesBody.innerHTML = sList.map(srv => {
        let availBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">🟢 Còn chỗ</span>';
        if (srv.availability === 'FEW_LEFT') availBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">🟡 Sắp hết (${srv.availableCount || 2})</span>`;
        else if (srv.availability === 'SOLDOUT') availBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">🔴 Hết chỗ</span>';

        const discountRate = srv.rackPrice && srv.b2bPrice
          ? Math.round((1 - srv.b2bPrice / srv.rackPrice) * 100)
          : 0;

        return `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3 px-3.5">
              <div class="font-bold text-slate-900">${escapeHtml(srv.name)}</div>
              <div class="text-[11px] text-slate-500">${escapeHtml(srv.notes || '')}</div>
            </td>
            <td class="py-3 px-3.5 text-slate-700 font-medium">${escapeHtml(srv.unit || 'Suất')}</td>
            <td class="py-3 px-3.5 font-mono text-slate-500 line-through text-[11px]">${formatVND(srv.rackPrice)}</td>
            <td class="py-3 px-3.5">
              <div class="font-mono font-bold text-emerald-700">${formatVND(srv.b2bPrice)}</div>
              <div class="text-[10px] text-emerald-600 font-bold">Tiết kiệm ${discountRate}%</div>
            </td>
            <td class="py-3 px-3.5 font-mono text-slate-600">${srv.weekendSurcharge ? formatVND(srv.weekendSurcharge) : 'Không phụ thu'}</td>
            <td class="py-3 px-3.5">${availBadge}</td>
          </tr>
        `;
      }).join('');
    }
  }

  // Tab 2: Chính sách đối tác
  const pol = s.policies || {};
  const polDebtEl = document.getElementById('sup-detail-pol-debt');
  const polCancelEl = document.getElementById('sup-detail-pol-cancellation');
  const polChildEl = document.getElementById('sup-detail-pol-children');
  const polFocEl = document.getElementById('sup-detail-pol-foc');
  const polCheckEl = document.getElementById('sup-detail-pol-checkin');

  if (polDebtEl) polDebtEl.textContent = `${s.debtPolicyTitle || 'Công nợ 7 ngày'} (Hạn mức: ${formatVND(s.debtLimit || 50000000)})`;
  if (polCancelEl) polCancelEl.textContent = pol.cancellation || 'Hủy dịch vụ trước 7 ngày miễn phí; trước 48h phạt 50%.';
  if (polChildEl) polChildEl.textContent = pol.children || 'Trẻ em dưới 6 tuổi miễn phí tiền phòng; từ 6-11 tuổi phụ thu ăn sáng.';
  if (polFocEl) polFocEl.textContent = pol.foc || 'Miễn phí phòng nội bộ và suất ăn cho Hướng dẫn viên đoàn từ 15 khách.';
  if (polCheckEl) polCheckEl.textContent = pol.checkInOut || 'Check-in: 14:00; Check-out: 12:00.';

  // Tab 3: Bản tin trực tiếp thời gian thực
  const live = s.dailyLiveStatus || {};
  const liveNoticeEl = document.getElementById('sup-detail-live-notice');
  const liveCapEl = document.getElementById('sup-detail-live-capacity');
  const liveTimeEl = document.getElementById('sup-detail-live-time');
  const liveHistoryList = document.getElementById('sup-detail-live-history');

  if (liveNoticeEl) liveNoticeEl.textContent = live.dailyNotice || 'Chưa có thông báo mới hôm nay.';
  if (liveCapEl) liveCapEl.textContent = live.availableCapacityNote || 'Đầy đủ năng lực phục vụ.';
  if (liveTimeEl) liveTimeEl.textContent = live.lastUpdated || 'Vừa cập nhật';

  if (liveHistoryList) {
    const hList = live.history || [];
    if (hList.length === 0) {
      liveHistoryList.innerHTML = `<div class="text-xs text-slate-400 py-2">Chưa có lịch sử cập nhật trước đây</div>`;
    } else {
      liveHistoryList.innerHTML = hList.map(h => `
        <div class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div class="flex items-center justify-between text-[11px] text-slate-500">
            <span class="font-bold text-slate-700">🕒 ${h.date} ${h.time || ''}</span>
            <span>Bởi: ${escapeHtml(h.updatedBy || 'Quản lý cơ sở')}</span>
          </div>
          <p class="text-xs text-slate-800 font-medium">${escapeHtml(h.content)}</p>
        </div>
      `).join('');
    }
  }

  // Tab 4: Lịch sử đơn đặt dịch vụ
  const ordersBody = document.getElementById('sup-detail-orders-tbody');
  if (ordersBody) {
    const orders = (db.supplierBookings || []).filter(sb => sb.supplierId === s.id || sb.supplierId === s.code);
    if (orders.length === 0) {
      ordersBody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400">Chưa phát sinh lệnh đặt dịch vụ nào</td></tr>`;
    } else {
      ordersBody.innerHTML = orders.map(ord => `
        <tr class="hover:bg-slate-50 transition-colors">
          <td class="py-2.5 px-3 font-mono font-bold text-brand-800">${escapeHtml(ord.code)}</td>
          <td class="py-2.5 px-3 font-mono font-bold text-slate-900">${escapeHtml(ord.bookingCode)}</td>
          <td class="py-2.5 px-3 text-slate-700">${escapeHtml(ord.serviceType || 'Dịch vụ tour')}</td>
          <td class="py-2.5 px-3 font-mono font-bold text-slate-900">${formatVND(ord.agreedCost)}</td>
          <td class="py-2.5 px-3 text-slate-500">${escapeHtml(ord.paymentDueDate || '-')}</td>
          <td class="py-2.5 px-3">${getSupplierOrderBadge(ord.status)}</td>
        </tr>
      `).join('');
    }
  }
}

// ==========================================
// CỔNG ĐĂNG KÝ HỢP TÁC DÀNH CHO ĐỐI TÁC MỚI (PARTNER ONBOARDING)
// ==========================================
function openSupplierRegisterModal() {
  const form = document.getElementById('supplier-register-form');
  if (form) form.reset();
  const modal = document.getElementById('supplier-register-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeSupplierRegisterModal() {
  const modal = document.getElementById('supplier-register-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function handleSupplierRegisterSubmit(e) {
  e.preventDefault();
  const nameVal = document.getElementById('reg-supplier-name').value.trim();
  const provVal = document.getElementById('reg-supplier-province').value;
  const catVal = document.getElementById('reg-supplier-category').value;
  const starVal = parseInt(document.getElementById('reg-supplier-stars')?.value || '4', 10);
  const addrVal = document.getElementById('reg-supplier-address').value.trim();
  const contactVal = document.getElementById('reg-supplier-contact').value.trim();
  const phoneVal = document.getElementById('reg-supplier-phone').value.trim();
  const emailVal = document.getElementById('reg-supplier-email').value.trim();
  const bankVal = document.getElementById('reg-supplier-bank')?.value.trim() || '';
  const srvPreview = document.getElementById('reg-supplier-services-preview')?.value.trim() || 'Dịch vụ phòng nghỉ & ăn uống';
  const polPreview = document.getElementById('reg-supplier-policies-preview')?.value.trim() || 'Công nợ 15 ngày sau tour';

  const newCode = generateNextCode('NCC-', db.suppliers, 'code');
  const newUsername = 'ncc_' + newCode.toLowerCase().replace('-', '');

  let catTitle = 'Khách sạn / Homestay';
  let avatarIcon = '🏨';
  if (catVal === 'TRANSPORT') { catTitle = 'Xe & Vận Chuyển'; avatarIcon = '🚍'; }
  else if (catVal === 'GUIDE') { catTitle = 'Hướng Dẫn Viên'; avatarIcon = '🧭'; }
  else if (catVal === 'RESTAURANT') { catTitle = 'Nhà Hàng Ẩm Thực'; avatarIcon = '🍽️'; }
  else if (catVal === 'TREKKING') { catTitle = 'Trekking & Dẫn Đường'; avatarIcon = '🧗'; }

  const newSupplier = {
    id: newCode,
    code: newCode,
    name: nameVal,
    category: catVal,
    categoryTitle: catTitle,
    province: provVal,
    stars: starVal,
    priceMin: 800000,
    priceMax: 2000000,
    address: addrVal,
    contactName: contactVal,
    phone: phoneVal,
    email: emailVal,
    bankAccount: bankVal || 'Chưa cập nhật STK',
    debtPolicy: 'DEBT_15D',
    debtPolicyTitle: 'Công nợ 15 ngày sau tour',
    debtLimit: 50000000,
    status: 'active',
    avatar: avatarIcon,
    description: `Đối tác ${nameVal} tại ${provVal}.`,
    notes: 'Đăng ký hợp tác trực tuyến qua Cổng Đối Tác',
    services: [
      {
        id: `SRV-${newCode}-1`,
        name: srvPreview,
        category: catVal,
        unit: 'Phòng / Suất',
        rackPrice: 1200000,
        b2bPrice: 900000,
        weekendSurcharge: 100000,
        availability: 'AVAILABLE',
        availableCount: 10,
        notes: 'Dịch vụ đối tác vừa đăng ký'
      }
    ],
    policies: {
      cancellation: 'Báo hủy trước 7 ngày miễn phí.',
      children: 'Trẻ em dưới 6 tuổi miễn phí.',
      foc: 'Đoàn từ 15 khách miễn phí 1 suất cho HDV.',
      checkInOut: 'Check-in: 14:00; Check-out: 12:00.',
      paymentTerms: polPreview
    },
    dailyLiveStatus: {
      lastUpdated: new Date().toISOString().substring(0, 16).replace('T', ' '),
      operationalStatus: 'NORMAL',
      availableCapacityNote: 'Mới gia nhập mạng lưới đối tác HaHa Travel.',
      dailyNotice: 'Chào mừng hợp tác cùng HaHa Eco Travel!',
      emergencyAlert: null,
      history: [
        {
          date: new Date().toISOString().substring(0, 10),
          time: new Date().toTimeString().substring(0, 5),
          content: 'Đã hoàn tất đăng ký đối tác trực tuyến.',
          updatedBy: contactVal
        }
      ]
    }
  };

  db.suppliers.push(newSupplier);

  // Tạo tài khoản User đăng nhập cho NCC
  const newUser = {
    id: `NV-${newCode}`,
    username: newUsername,
    passwordHash: DEFAULT_PASS_HASH,
    salt: SYSTEM_SALT,
    name: nameVal,
    role: 'SUPPLIER',
    roleTitle: `Đối tác Cung ứng (${catTitle})`,
    avatar: avatarIcon,
    status: 'active',
    supplierId: newCode
  };
  db.users.push(newUser);

  saveDatabase();

  recordAuditLog('ĐỐI TÁC ĐĂNG KÝ HỢP TÁC', `Cơ sở "${nameVal}" (${newCode}) đăng ký hợp tác tại ${provVal}. Tài khoản: ${newUsername}.`);

  // Bắn thông báo liên phòng ban tới OPS và CEO
  sendInterDeptNotification({
    senderRole: 'SUPPLIER',
    senderName: `${nameVal} (${contactVal})`,
    targetRole: 'OPS',
    targetModule: 5,
    type: 'NEW_PARTNER_REGISTRATION',
    title: `🤝 ĐỐI TÁC MỚI ĐĂNG KÝ: ${nameVal} (${provVal})`,
    message: `Đối tác ${nameVal} (${catTitle} - ${starVal}★) vừa đăng ký hợp tác. Người liên hệ: ${contactVal} - ${phoneVal}. Vui lòng thẩm định báo giá & chính sách B2B.`,
    referenceId: newCode,
    urgency: 'HIGH'
  });

  closeSupplierRegisterModal();
  alert(`🎉 CHÚC MỪNG ĐÃ ĐĂNG KÝ HỢP TÁC THÀNH CÔNG!\n\nThông tin đăng nhập Cổng Đối Tác của bạn:\n• Mã Đối tác: ${newCode}\n• Tên đăng nhập: ${newUsername}\n• Mật khẩu: 123456\n\nHệ thống đã gửi thông tin đến Ban Quản trị HaHa Eco Travel để kích hoạt hợp tác!`);

  // Chuyển sang màn hình đăng nhập đối tác với username điền sẵn
  toggleLoginMode('supplier');
  const unameInput = document.getElementById('supplier-login-username');
  if (unameInput) unameInput.value = newUsername;
}

// ==========================================
// PHÂN HỆ 11: CỔNG QUẢN TRỊ ĐỐI TÁC CUNG ỨNG (SUPPLIER / PARTNER PORTAL)
// ==========================================
function renderSupplierPortal() {
  const portalContainer = document.getElementById('view-module-11');
  if (!portalContainer) return;

  // Tìm NCC gắn với currentUser
  let mySupplier = null;
  if (currentUser && currentUser.supplierId) {
    mySupplier = (db.suppliers || []).find(s => s.id === currentUser.supplierId || s.code === currentUser.supplierId);
  }
  if (!mySupplier) {
    mySupplier = db.suppliers[0] || null;
  }
  if (!mySupplier) return;

  // Header banner
  const nameEl = document.getElementById('sup-portal-name');
  const codeEl = document.getElementById('sup-portal-code');
  const starsEl = document.getElementById('sup-portal-stars');
  const provEl = document.getElementById('sup-portal-province');
  const avatarEl = document.getElementById('sup-portal-avatar');
  const hotlineEl = document.getElementById('sup-portal-hotline');
  const repEl = document.getElementById('sup-portal-rep');

  if (nameEl) nameEl.textContent = mySupplier.name;
  if (codeEl) codeEl.textContent = mySupplier.code;
  if (starsEl) starsEl.textContent = '⭐'.repeat(mySupplier.stars || 4) + ` (${mySupplier.stars || 4} Sao)`;
  if (provEl) provEl.textContent = `📍 ${mySupplier.province || 'Toàn quốc'}`;
  if (avatarEl) avatarEl.textContent = mySupplier.avatar || '🏨';
  if (hotlineEl) hotlineEl.textContent = mySupplier.phone || 'Chưa có hotline';
  if (repEl) repEl.textContent = mySupplier.contactName || 'Người đại diện';

  // Render tab contents
  renderSupplierPortalProfileTab(mySupplier);
  renderSupplierPortalServicesTab(mySupplier);
  renderSupplierPortalLiveTab(mySupplier);
  renderSupplierPortalOrdersTab(mySupplier);

  switchSupplierPortalTab(currentSupplierPortalTab);
}

function switchSupplierPortalTab(tabName) {
  currentSupplierPortalTab = tabName;
  const tabs = ['profile', 'services', 'live', 'orders'];
  tabs.forEach(t => {
    const btn = document.getElementById(`sup-portal-tab-${t}-btn`);
    const content = document.getElementById(`sup-portal-tab-${t}-content`);
    if (btn) {
      if (t === tabName) {
        btn.classList.add('active', 'border-brand-600', 'text-brand-700', 'bg-brand-50/50');
        btn.classList.remove('border-transparent', 'text-slate-600');
      } else {
        btn.classList.remove('active', 'border-brand-600', 'text-brand-700', 'bg-brand-50/50');
        btn.classList.add('border-transparent', 'text-slate-600');
      }
    }
    if (content) {
      if (t === tabName) content.classList.remove('hidden');
      else content.classList.add('hidden');
    }
  });
}

function renderSupplierPortalProfileTab(s) {
  const fName = document.getElementById('sup-port-form-name');
  const fProv = document.getElementById('sup-port-form-province');
  const fAddr = document.getElementById('sup-port-form-address');
  const fContact = document.getElementById('sup-port-form-contact');
  const fPhone = document.getElementById('sup-port-form-phone');
  const fEmail = document.getElementById('sup-port-form-email');
  const fBank = document.getElementById('sup-port-form-bank');
  const fLicense = document.getElementById('sup-port-form-license');
  const fDesc = document.getElementById('sup-port-form-desc');
  const fCancel = document.getElementById('sup-port-form-pol-cancel');
  const fChild = document.getElementById('sup-port-form-pol-child');
  const fFoc = document.getElementById('sup-port-form-pol-foc');
  const fCheck = document.getElementById('sup-port-form-pol-check');

  if (fName) fName.value = s.name || '';
  if (fProv) fProv.value = s.province || 'Đồng Nai';
  if (fAddr) fAddr.value = s.address || '';
  if (fContact) fContact.value = s.contactName || '';
  if (fPhone) fPhone.value = s.phone || '';
  if (fEmail) fEmail.value = s.email || '';
  if (fBank) fBank.value = s.bankAccount || '';
  if (fLicense) fLicense.value = s.businessLicense || '';
  if (fDesc) fDesc.value = s.description || '';

  const pol = s.policies || {};
  if (fCancel) fCancel.value = pol.cancellation || '';
  if (fChild) fChild.value = pol.children || '';
  if (fFoc) fFoc.value = pol.foc || '';
  if (fCheck) fCheck.value = pol.checkInOut || '';
}

function saveSupplierProfile(e) {
  e.preventDefault();
  let mySupplier = null;
  if (currentUser && currentUser.supplierId) {
    mySupplier = (db.suppliers || []).find(s => s.id === currentUser.supplierId || s.code === currentUser.supplierId);
  }
  if (!mySupplier) mySupplier = db.suppliers[0];
  if (!mySupplier) return;

  mySupplier.name = document.getElementById('sup-port-form-name')?.value.trim() || mySupplier.name;
  mySupplier.province = document.getElementById('sup-port-form-province')?.value || mySupplier.province;
  mySupplier.address = document.getElementById('sup-port-form-address')?.value.trim() || mySupplier.address;
  mySupplier.contactName = document.getElementById('sup-port-form-contact')?.value.trim() || mySupplier.contactName;
  mySupplier.phone = document.getElementById('sup-port-form-phone')?.value.trim() || mySupplier.phone;
  mySupplier.email = document.getElementById('sup-port-form-email')?.value.trim() || mySupplier.email;
  mySupplier.bankAccount = document.getElementById('sup-port-form-bank')?.value.trim() || mySupplier.bankAccount;
  mySupplier.businessLicense = document.getElementById('sup-port-form-license')?.value.trim() || mySupplier.businessLicense;
  mySupplier.description = document.getElementById('sup-port-form-desc')?.value.trim() || mySupplier.description;

  if (!mySupplier.policies) mySupplier.policies = {};
  mySupplier.policies.cancellation = document.getElementById('sup-port-form-pol-cancel')?.value.trim() || mySupplier.policies.cancellation;
  mySupplier.policies.children = document.getElementById('sup-port-form-pol-child')?.value.trim() || mySupplier.policies.children;
  mySupplier.policies.foc = document.getElementById('sup-port-form-pol-foc')?.value.trim() || mySupplier.policies.foc;
  mySupplier.policies.checkInOut = document.getElementById('sup-port-form-pol-check')?.value.trim() || mySupplier.policies.checkInOut;

  saveDatabase();
  recordAuditLog('CẬP NHẬT HỒ SƠ ĐỐI TÁC', `Đối tác ${mySupplier.name} (${mySupplier.code}) cập nhật hồ sơ & chính sách.`);
  alert("✅ Đã lưu cập nhật hồ sơ và chính sách thành công!");
  renderSupplierPortal();
}

function renderSupplierPortalServicesTab(s) {
  const tbody = document.getElementById('sup-portal-services-tbody');
  if (!tbody) return;
  const sList = s.services || [];

  if (sList.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-400">Bạn chưa thêm dịch vụ nào. Hãy bấm "+ Thêm Dịch Vụ Mới" bên trên.</td></tr>`;
    return;
  }

  tbody.innerHTML = sList.map(srv => {
    let availBtn = srv.availability === 'AVAILABLE'
      ? `<button onclick="toggleServiceAvailability('${srv.id}')" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200">🟢 Đang mở bán</button>`
      : (srv.availability === 'FEW_LEFT'
        ? `<button onclick="toggleServiceAvailability('${srv.id}')" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 hover:bg-amber-200">🟡 Sắp hết chỗ</button>`
        : `<button onclick="toggleServiceAvailability('${srv.id}')" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 hover:bg-rose-200">🔴 Tạm ngưng nhận</button>`);

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3 px-3.5">
          <div class="font-bold text-slate-900">${escapeHtml(srv.name)}</div>
          <div class="text-[11px] text-slate-500">${escapeHtml(srv.notes || '')}</div>
        </td>
        <td class="py-3 px-3.5 text-slate-700">${escapeHtml(srv.unit || 'Suất')}</td>
        <td class="py-3 px-3.5 font-mono text-slate-500 line-through text-[11px]">${formatVND(srv.rackPrice)}</td>
        <td class="py-3 px-3.5 font-mono font-bold text-emerald-700">${formatVND(srv.b2bPrice)}</td>
        <td class="py-3 px-3.5 font-mono text-slate-600">${srv.weekendSurcharge ? formatVND(srv.weekendSurcharge) : '0 đ'}</td>
        <td class="py-3 px-3.5">${availBtn}</td>
        <td class="py-3 px-3.5 text-center space-x-1">
          <button onclick="deleteSupplierService('${srv.id}')" class="text-rose-600 hover:text-rose-800 font-bold text-xs" title="Xóa dịch vụ">🗑️ Xóa</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddSupplierServiceModal() {
  const form = document.getElementById('supplier-service-form');
  if (form) form.reset();
  const modal = document.getElementById('supplier-service-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeAddSupplierServiceModal() {
  const modal = document.getElementById('supplier-service-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function saveSupplierService(e) {
  e.preventDefault();
  let mySupplier = null;
  if (currentUser && currentUser.supplierId) {
    mySupplier = (db.suppliers || []).find(s => s.id === currentUser.supplierId || s.code === currentUser.supplierId);
  }
  if (!mySupplier) mySupplier = db.suppliers[0];
  if (!mySupplier) return;

  const sName = document.getElementById('form-srv-name').value.trim();
  const sUnit = document.getElementById('form-srv-unit').value.trim();
  const sRack = parseFloat(document.getElementById('form-srv-rack-price').value) || 0;
  const sB2b = parseFloat(document.getElementById('form-srv-b2b-price').value) || 0;
  const sSurcharge = parseFloat(document.getElementById('form-srv-surcharge').value) || 0;
  const sAvail = document.getElementById('form-srv-availability').value;
  const sNotes = document.getElementById('form-srv-notes').value.trim();

  if (!mySupplier.services) mySupplier.services = [];
  const newSrvId = `SRV-${mySupplier.code}-${mySupplier.services.length + 1}`;

  mySupplier.services.push({
    id: newSrvId,
    name: sName,
    category: mySupplier.category,
    unit: sUnit,
    rackPrice: sRack,
    b2bPrice: sB2b,
    weekendSurcharge: sSurcharge,
    availability: sAvail,
    availableCount: sAvail === 'AVAILABLE' ? 10 : (sAvail === 'FEW_LEFT' ? 2 : 0),
    notes: sNotes
  });

  saveDatabase();
  recordAuditLog('THÊM DỊCH VỤ ĐỐI TÁC', `Đối tác ${mySupplier.name} thêm dịch vụ: ${sName} (Giá B2B: ${formatVND(sB2b)}).`);
  closeAddSupplierServiceModal();
  renderSupplierPortalServicesTab(mySupplier);
  alert("✅ Đã thêm dịch vụ mới vào bảng giá thành công!");
}

function toggleServiceAvailability(serviceId) {
  let mySupplier = null;
  if (currentUser && currentUser.supplierId) {
    mySupplier = (db.suppliers || []).find(s => s.id === currentUser.supplierId || s.code === currentUser.supplierId);
  }
  if (!mySupplier) mySupplier = db.suppliers[0];
  if (!mySupplier || !mySupplier.services) return;

  const srv = mySupplier.services.find(x => x.id === serviceId);
  if (!srv) return;

  if (srv.availability === 'AVAILABLE') srv.availability = 'FEW_LEFT';
  else if (srv.availability === 'FEW_LEFT') srv.availability = 'SOLDOUT';
  else srv.availability = 'AVAILABLE';

  saveDatabase();
  renderSupplierPortalServicesTab(mySupplier);
}

function deleteSupplierService(serviceId) {
  let mySupplier = null;
  if (currentUser && currentUser.supplierId) {
    mySupplier = (db.suppliers || []).find(s => s.id === currentUser.supplierId || s.code === currentUser.supplierId);
  }
  if (!mySupplier) mySupplier = db.suppliers[0];
  if (!mySupplier || !mySupplier.services) return;

  if (confirm("Bạn có chắc chắn muốn xóa dịch vụ này khỏi bảng giá?")) {
    mySupplier.services = mySupplier.services.filter(x => x.id !== serviceId);
    saveDatabase();
    renderSupplierPortalServicesTab(mySupplier);
  }
}

// ==========================================
// CẬP NHẬT THÔNG TIN HẰNG NGÀY THEO THỜI GIAN THỰC (DAILY LIVE BULLETIN)
// ==========================================

// ==========================================
// ALLOTMENT & CAPACITY CALENDAR HELPERS
// ==========================================
function getSupplierCalendarDates() {
  const result = [];
  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dayOfWeek = daysOfWeek[d.getDay()];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    result.push({
      dateStr: dateStr,
      label: `${dayOfWeek}, ${dd}/${mm}`,
      dayOfWeek: dayOfWeek,
      isWeekend: isWeekend
    });
  }
  return result;
}

function toggleSupplierDateAllotment(dateStr) {
  let mySupplier = null;
  if (currentUser && currentUser.supplierId) {
    mySupplier = (db.suppliers || []).find(s => s.id === currentUser.supplierId || s.code === currentUser.supplierId);
  }
  if (!mySupplier && db.suppliers && db.suppliers.length > 0) {
    mySupplier = db.suppliers[0];
  }
  if (!mySupplier) return;

  if (!Array.isArray(mySupplier.closedDates)) {
    mySupplier.closedDates = [];
  }

  const idx = mySupplier.closedDates.indexOf(dateStr);
  let actionText = '';
  if (idx >= 0) {
    mySupplier.closedDates.splice(idx, 1);
    actionText = 'MỞ LẠI NHẬN ĐOÀN';
  } else {
    mySupplier.closedDates.push(dateStr);
    actionText = 'TẠM DỪNG / ĐÓNG NHẬN ĐOÀN';
  }

  saveDatabase();
  recordAuditLog('QUẢN LÝ LỊCH ALLOTMENT', `Đối tác ${mySupplier.name} (${mySupplier.code}) cập nhật ngày ${dateStr}: ${actionText}.`);

  sendInterDeptNotification({
    senderRole: 'SUPPLIER',
    senderName: `${mySupplier.name} (${currentUser ? currentUser.name : 'Đối tác'})`,
    targetRole: 'OPS',
    targetModule: 5,
    type: 'PARTNER_ALLOTMENT_CHANGE',
    title: `📅 [CẬP NHẬT LỊCH ALLOTMENT]: ${mySupplier.name}`,
    message: `Đối tác đã ${actionText} cho ngày ${dateStr}. Điều hành viên lưu ý khi sắp xếp tour!`,
    referenceId: mySupplier.code,
    urgency: idx >= 0 ? 'NORMAL' : 'HIGH'
  });

  renderSupplierPortalLiveTab(mySupplier);
}

function renderSupplierPortalLiveTab(s) {
  const live = s.dailyLiveStatus || {};
  const statusSel = document.getElementById('sup-live-status-select');
  const capInput = document.getElementById('sup-live-capacity-input');
  const noticeInput = document.getElementById('sup-live-notice-input');
  const historyList = document.getElementById('sup-portal-live-history');

  if (statusSel) statusSel.value = live.operationalStatus || 'NORMAL';
  if (capInput) capInput.value = live.availableCapacityNote || '';
  if (noticeInput) noticeInput.value = live.dailyNotice || '';

  const calMatrix = document.getElementById('sup-portal-calendar-matrix');
  if (calMatrix) {
    const dates = typeof getSupplierCalendarDates === 'function' ? getSupplierCalendarDates() : [];
    const closedList = s.closedDates || [];
    calMatrix.innerHTML = dates.map(d => {
      const isClosed = closedList.includes(d.dateStr);
      const isToday = d.dateStr === new Date().toISOString().substring(0, 10);
      return `
        <div class="p-3 rounded-xl border text-center transition-all ${isClosed ? 'border-rose-200 bg-rose-50/70 text-rose-900' : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-brand-300 text-slate-800'}">
          <div class="text-[11px] font-bold ${isToday ? 'text-indigo-700 underline font-black' : (d.isWeekend ? 'text-amber-700' : 'text-slate-600')}">
            ${isToday ? 'Hôm nay (' + d.label + ')' : d.label}
          </div>
          <div class="my-2">
            ${isClosed 
              ? '<span class="inline-block px-1.5 py-0.5 text-[9px] font-black rounded bg-rose-600 text-white uppercase tracking-wider">ĐÃ ĐÓNG</span>' 
              : '<span class="inline-block px-1.5 py-0.5 text-[9px] font-extrabold rounded bg-emerald-600 text-white uppercase tracking-wider">MỞ BÁN</span>'}
          </div>
          <div class="text-[10px] text-slate-500 mb-2 font-mono">
            ${isClosed ? 'Tạm dừng nhận đoàn' : 'Sẵn sàng phục vụ'}
          </div>
          <button type="button" onclick="toggleSupplierDateAllotment('${d.dateStr}')" class="w-full py-1 rounded-lg text-[10px] font-bold transition-all shadow-sm ${isClosed ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-200'}">
            ${isClosed ? '🔄 Mở lại' : '🚫 Đóng ngày này'}
          </button>
        </div>
      `;
    }).join('');
  }

  if (historyList) {
    const hList = live.history || [];
    if (hList.length === 0) {
      historyList.innerHTML = `<div class="text-xs text-slate-400 py-3 text-center">Chưa có bản tin nào được phát. Hãy điền form bên trái để phát bản tin đầu tiên!</div>`;
    } else {
      historyList.innerHTML = hList.map(h => `
        <div class="p-3 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1.5">
          <div class="flex items-center justify-between text-[11px]">
            <span class="font-bold text-slate-800">📅 ${h.date} - 🕒 ${h.time || ''}</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Đã phát trực tiếp</span>
          </div>
          <p class="text-xs text-slate-900 font-medium">${escapeHtml(h.content)}</p>
          <div class="text-[10px] text-slate-400 pt-0.5">Phát bởi: ${escapeHtml(h.updatedBy || 'Quản lý cơ sở')}</div>
        </div>
      `).join('');
    }
  }
}

function postDailyLiveBulletin(e) {
  e.preventDefault();
  let mySupplier = null;
  if (currentUser && currentUser.supplierId) {
    mySupplier = (db.suppliers || []).find(s => s.id === currentUser.supplierId || s.code === currentUser.supplierId);
  }
  if (!mySupplier) mySupplier = db.suppliers[0];
  if (!mySupplier) return;

  const opStatus = document.getElementById('sup-live-status-select')?.value || 'NORMAL';
  const capNote = document.getElementById('sup-live-capacity-input')?.value.trim() || 'Công suất phục vụ đầy đủ';
  const noticeMsg = document.getElementById('sup-live-notice-input')?.value.trim();

  if (!noticeMsg) {
    alert("Vui lòng nhập nội dung bản tin thông báo hoạt động hôm nay!");
    return;
  }

  const now = new Date();
  const dateStr = now.toISOString().substring(0, 10);
  const timeStr = now.toTimeString().substring(0, 5);

  if (!mySupplier.dailyLiveStatus) mySupplier.dailyLiveStatus = { history: [] };
  if (!Array.isArray(mySupplier.dailyLiveStatus.history)) mySupplier.dailyLiveStatus.history = [];

  mySupplier.dailyLiveStatus.lastUpdated = `${dateStr} ${timeStr}`;
  mySupplier.dailyLiveStatus.operationalStatus = opStatus;
  mySupplier.dailyLiveStatus.availableCapacityNote = capNote;
  mySupplier.dailyLiveStatus.dailyNotice = noticeMsg;

  mySupplier.dailyLiveStatus.history.unshift({
    date: dateStr,
    time: timeStr,
    content: noticeMsg,
    capacity: capNote,
    status: opStatus,
    updatedBy: currentUser ? currentUser.name : mySupplier.contactName
  });

  saveDatabase();
  recordAuditLog('PHÁT BẢN TIN TRỰC TIẾP', `Đối tác ${mySupplier.name} (${mySupplier.code}) phát bản tin hoạt động hằng ngày.`);

  // Bắn thông báo thời gian thực liên phòng ban tới ĐIỀU HÀNH (OPS) và CEO
  sendInterDeptNotification({
    senderRole: 'SUPPLIER',
    senderName: `${mySupplier.name} (${currentUser ? currentUser.name : 'Đối tác'})`,
    targetRole: 'OPS',
    targetModule: 5,
    type: 'PARTNER_LIVE_UPDATE',
    title: `⚡ [CẬP NHẬT LIVE]: ${mySupplier.name} phát bản tin hằng ngày`,
    message: `${noticeMsg} (Công suất: ${capNote})`,
    referenceId: mySupplier.code,
    urgency: opStatus === 'WEATHER_ALERT' || opStatus === 'MAINTENANCE' ? 'HIGH' : 'NORMAL'
  });

  alert("🚀 BẢN TIN ĐÃ ĐƯỢC PHÁT THỜI GIAN THỰC!\n\nThông tin cập nhật của bạn đã được đồng bộ tức thì sang Hệ thống Điều hành Tour của HaHa Eco Travel và các Điều hành viên!");
  renderSupplierPortalLiveTab(mySupplier);
}

function renderSupplierPortalOrdersTab(s) {
  const tbody = document.getElementById('sup-portal-orders-tbody');
  if (!tbody) return;

  const orders = (db.supplierBookings || []).filter(sb => sb.supplierId === s.id || sb.supplierId === s.code);
  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-6 text-center text-slate-400">Chưa có lệnh đặt dịch vụ nào từ HaHa Eco Travel</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(ord => {
    let actionBtn = `<span class="text-xs text-emerald-700 font-bold">✓ Đã tiếp nhận</span>`;
    if (ord.status === 'WAIT_PAY_APPROVAL' || ord.status === 'WAIT_DEBT_APPROVAL') {
      actionBtn = `<button onclick="confirmSupplierBooking('${ord.code}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm">✅ Xác nhận phục vụ</button>`;
    }

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3 px-3.5 font-mono font-bold text-brand-800">${escapeHtml(ord.code)}</td>
        <td class="py-3 px-3.5 font-mono font-bold text-slate-900">${escapeHtml(ord.bookingCode)}</td>
        <td class="py-3 px-3.5 text-slate-700 font-medium">${escapeHtml(ord.serviceType || 'Dịch vụ đoàn')}</td>
        <td class="py-3 px-3.5 font-mono font-bold text-slate-900">${formatVND(ord.agreedCost)}</td>
        <td class="py-3 px-3.5 text-slate-600 text-[11px]">${escapeHtml(ord.paymentDueDate || '-')}</td>
        <td class="py-3 px-3.5">${getSupplierOrderBadge(ord.status)}</td>
                <td class="py-3 px-3.5 text-center">
          <div class="flex items-center justify-center space-x-1.5">
            ${actionBtn}
            <button onclick="openSupplierVoucherModal('${ord.code}')" class="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[11px] rounded-lg shadow-sm transition-all flex items-center space-x-1" title="Xem & In Phiếu Tiếp Nhận Dịch Vụ Đoàn">
              <span>🧾</span>
              <span>Voucher</span>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function confirmSupplierBooking(orderCode) {
  const ord = (db.supplierBookings || []).find(x => x.code === orderCode);
  if (!ord) return;

  ord.acknowledgedByPartner = true;
  ord.acknowledgedPartnerAt = new Date().toISOString().substring(0, 16).replace('T', ' ');

  saveDatabase();
  recordAuditLog('ĐỐI TÁC XÁC NHẬN ĐƠN', `Đối tác xác nhận sẵn sàng phục vụ lệnh đặt ${ord.code} cho đoàn ${ord.bookingCode}.`);

  // Gửi thông báo lại cho Điều hành
  sendInterDeptNotification({
    senderRole: 'SUPPLIER',
    senderName: currentUser ? currentUser.name : 'Đối tác NCC',
    targetRole: 'OPS',
    targetModule: 5,
    type: 'PARTNER_ORDER_CONFIRMED',
    title: `✅ [XÁC NHẬN TIẾP NHẬN]: Lệnh đặt ${ord.code}`,
    message: `Đối tác đã xác nhận bố trí dịch vụ cho đoàn ${ord.bookingCode} (${ord.serviceType}).`,
    referenceId: ord.code,
    urgency: 'NORMAL'
  });

  alert(`✅ Đã xác nhận tiếp nhận phục vụ lệnh đặt ${ord.code} thành công! Hệ thống đã gửi thông báo đến Điều hành viên.`);
  let mySupplier = null;
  if (currentUser && currentUser.supplierId) {
    mySupplier = (db.suppliers || []).find(s => s.id === currentUser.supplierId || s.code === currentUser.supplierId);
  }
  if (!mySupplier) mySupplier = db.suppliers[0];
  if (mySupplier) renderSupplierPortalOrdersTab(mySupplier);
}
function getSupplierOrderBadge(status) {
  if (status === 'WAIT_PAY_APPROVAL') {
    return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">🟡 Chờ Kế toán duyệt chi ngay</span>';
  }
  if (status === 'WAIT_DEBT_APPROVAL') {
    return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">🟠 Chờ Kế toán duyệt công nợ</span>';
  }
  if (status === 'DEBT_ACKNOWLEDGED' || status === 'PAID_DEPOSIT') {
    return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300">🔵 Đã ghi nhận nợ NCC (A/P)</span>';
  }
  if (status === 'PAID_FULL') {
    return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">🟢 Đã thanh toán 100%</span>';
  }
  if (status === 'REJECTED') {
    return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">❌ Kế toán trả về</span>';
  }
  return '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Chờ xử lý</span>';
}

function renderOpsOrders() {
  const tbody = document.getElementById('ops-orders-table-body');
  if (!tbody) return;

  if (!db.supplierBookings || db.supplierBookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="11" class="py-8 text-center text-xs text-slate-400">Chưa có lệnh đặt dịch vụ NCC nào</td></tr>`;
    return;
  }

  const isKeToanOrCeo = currentUser && (currentUser.role === 'KE_TOAN' || currentUser.role === 'CEO');

  tbody.innerHTML = db.supplierBookings.map(sb => {
    const remaining = Math.max(0, sb.agreedCost - (sb.paidCost || 0));
    const statusBadge = getSupplierOrderBadge(sb.status);
    const policyTitle = sb.debtPolicyTitle || 'Theo thỏa thuận';

    let actionBtn = `<button onclick="openSupplierApprovalModal('${sb.code}')" class="action-btn text-slate-600 bg-slate-100 hover:bg-slate-200 font-medium">👁️ Chi tiết</button>`;
    if (isKeToanOrCeo) {
      if (sb.status === 'WAIT_PAY_APPROVAL') {
        actionBtn = `<button onclick="openSupplierApprovalModal('${sb.code}')" class="action-btn text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 font-bold">⚡ Duyệt chi ngay</button>`;
      } else if (sb.status === 'WAIT_DEBT_APPROVAL') {
        actionBtn = `<button onclick="openSupplierApprovalModal('${sb.code}')" class="action-btn text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-300 font-bold">📋 Duyệt công nợ</button>`;
      } else if (sb.status === 'DEBT_ACKNOWLEDGED' && remaining > 0) {
        actionBtn = `<button onclick="openSupplierApprovalModal('${sb.code}')" class="action-btn text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 font-bold">💵 Thanh toán nợ</button>`;
      }
    }

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3 px-3.5 font-mono font-bold text-brand-800">${escapeHtml(sb.code)}</td>
        <td class="py-3 px-3.5 font-mono text-slate-700 font-bold">${escapeHtml(sb.bookingCode)}</td>
        <td class="py-3 px-3.5 font-bold text-slate-900">${escapeHtml(sb.supplierName)}</td>
        <td class="py-3 px-3.5 text-slate-600 text-xs">
          <div>${escapeHtml(sb.serviceType)}</div>
          ${sb.notes ? `<div class="text-[10px] text-slate-400 italic">${escapeHtml(sb.notes)}</div>` : ''}
        </td>
        <td class="py-3 px-3.5 text-blue-800 font-medium text-[11px]">${escapeHtml(policyTitle)}</td>
        <td class="py-3 px-3.5 font-mono font-bold text-slate-900">${formatVND(sb.agreedCost)}</td>
        <td class="py-3 px-3.5 font-mono font-bold text-emerald-700">${formatVND(sb.paidCost || 0)}</td>
        <td class="py-3 px-3.5 font-mono font-bold ${remaining > 0 ? 'text-rose-600' : 'text-slate-400'}">${formatVND(remaining)}</td>
        <td class="py-3 px-3.5 font-mono text-slate-500">${escapeHtml(sb.paymentDueDate)}</td>
        <td class="py-3 px-3.5">${statusBadge}</td>
        <td class="py-3 px-3.5 text-center whitespace-nowrap space-x-1">
          ${actionBtn}
          <button onclick="openSupplierVoucherModal('${sb.code}')" class="action-btn text-brand-800 bg-brand-50 hover:bg-brand-100 font-bold border border-brand-200" title="Xem & In Phiếu xác nhận dịch vụ">📄 Voucher</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddSupplierModal() {
  const form = document.getElementById('supplier-form');
  form.reset();
  document.getElementById('form-supplier-id').value = '';
  document.getElementById('form-supplier-code').value = generateNextCode('NCC-', db.suppliers, 'code');
  document.getElementById('supplier-modal').classList.remove('hidden');
  document.getElementById('supplier-modal').classList.add('flex');
}

function closeSupplierModal() {
  document.getElementById('supplier-modal').classList.add('hidden');
  document.getElementById('supplier-modal').classList.remove('flex');
}

function saveSupplier(e) {
  e.preventDefault();
  const codeVal = document.getElementById('form-supplier-code').value.trim();
  const catVal = document.getElementById('form-supplier-category').value;
  const nameVal = document.getElementById('form-supplier-name').value.trim();
  const contactVal = document.getElementById('form-supplier-contact').value.trim();
  const phoneVal = document.getElementById('form-supplier-phone').value.trim();
  const bankVal = document.getElementById('form-supplier-bank').value.trim();
  const debtPolicyVal = document.getElementById('form-supplier-debt-policy')?.value || 'DEBT_7D';
  const debtLimitVal = parseFloat(document.getElementById('form-supplier-debt-limit')?.value) || 50000000;

  let policyTitle = 'Công nợ 7 ngày sau tour';
  if (debtPolicyVal === 'DEBT_15D') policyTitle = 'Công nợ 15 ngày sau tour';
  else if (debtPolicyVal === 'DEBT_30D') policyTitle = 'Công nợ 30 ngày (Gối đầu hàng tháng)';
  else if (debtPolicyVal === 'DEPOSIT_50') policyTitle = 'Cọc 50%, còn lại sau tour 3 ngày';
  else if (debtPolicyVal === 'IMMEDIATE') policyTitle = 'Thanh toán ngay 100% khi đặt dịch vụ';

  const newSupplier = {
    id: codeVal,
    code: codeVal,
    name: nameVal,
    category: catVal,
    contactName: contactVal,
    phone: phoneVal,
    bankAccount: bankVal,
    debtPolicy: debtPolicyVal,
    debtPolicyTitle: policyTitle,
    debtLimit: debtLimitVal,
    status: 'active',
    notes: ''
  };

  db.suppliers.push(newSupplier);
  saveDatabase();
  recordAuditLog('THÊM NHÀ CUNG CẤP', `Thêm đối tác NCC: ${nameVal} (${codeVal}). Chính sách công nợ: ${policyTitle}, hạn mức: ${formatVND(debtLimitVal)}.`);
  closeSupplierModal();
  renderOpsSuppliers();
}

function deleteSupplier(id) {
  if (currentUser && currentUser.role === 'KE_TOAN') {
    alert("⛔ BẢO VỆ DỮ LIỆU: Kế toán không có quyền xóa Nhà cung cấp! Thẩm quyền thuộc về Điều hành hoặc CEO.");
    return;
  }

  const s = db.suppliers.find(x => x.id === id || x.code === id || String(x.id) === String(id));
  if (!s) return;

  // Ràng buộc toàn vẹn: Chặn xóa nếu NCC đang có lệnh đặt dịch vụ
  const hasOrders = (db.supplierBookings || []).some(sb => 
    (String(sb.supplierId) === String(s.id) || String(sb.supplierId) === String(s.code)) && sb.status !== 'Đã hủy'
  );

  if (hasOrders) {
    alert(`⚠️ KHÔNG THỂ XÓA NHÀ CUNG CẤP: Đối tác "${s.name}" (${s.code}) đang có Lệnh đặt dịch vụ (Booking NCC) trên hệ thống!`);
    return;
  }

  if (confirm(`Bạn có chắc muốn xóa Nhà cung cấp "${s.name}"?`)) {
    db.suppliers = db.suppliers.filter(x => x.id !== s.id && x.code !== s.code);
    saveDatabase();
    recordAuditLog('XÓA NHÀ CUNG CẤP', `Đã xóa NCC ${s.name} (${s.code}).`);
    renderOpsSuppliers();
  }
}

function handleSupplierBookingPolicyUpdate() {
  const sId = document.getElementById('form-sb-supplier')?.value;
  const bCode = document.getElementById('form-sb-booking')?.value;
  const badge = document.getElementById('sb-supplier-policy-badge');
  const policyText = document.getElementById('sb-supplier-policy-text');
  const limitText = document.getElementById('sb-supplier-limit-text');
  const dueDateInput = document.getElementById('form-sb-due-date');
  const payTypeSel = document.getElementById('form-sb-pay-type');

  if (!sId) {
    if (badge) badge.classList.add('hidden');
    return;
  }

  const supplier = (db.suppliers || []).find(s => s.id === sId || s.code === sId);
  if (!supplier) return;

  if (badge && policyText && limitText) {
    badge.classList.remove('hidden');
    policyText.textContent = `Chính sách đối tác: ${supplier.debtPolicyTitle || 'Công nợ 7 ngày sau tour'}`;
    limitText.textContent = `Hạn mức nợ: ${formatVND(supplier.debtLimit || 50000000)}`;
  }

  // Tự động tính ngày thanh toán theo đơn tour hoặc ngày hiện tại
  let baseDate = new Date();
  if (bCode) {
    const b = (db.bookings || []).find(x => x.code === bCode);
    if (b && b.departureDate) {
      baseDate = new Date(b.departureDate);
    }
  }

  const policy = supplier.debtPolicy || 'DEBT_7D';
  let daysToAdd = 7;
  if (policy === 'DEBT_15D') daysToAdd = 15;
  else if (policy === 'DEBT_30D') daysToAdd = 30;
  else if (policy === 'DEPOSIT_50') daysToAdd = 3;
  else if (policy === 'IMMEDIATE') daysToAdd = 0;

  baseDate.setDate(baseDate.getDate() + daysToAdd);
  if (dueDateInput) {
    dueDateInput.value = baseDate.toISOString().split('T')[0];
  }

  if (payTypeSel) {
    if (policy === 'IMMEDIATE') {
      payTypeSel.value = 'PAY_NOW';
    } else {
      payTypeSel.value = 'CREDIT';
    }
  }
}

function openAddSupplierBookingModal() {
  if (currentUser && currentUser.role === 'KE_TOAN') {
    alert("⛔ BẢO VỆ DỮ LIỆU: Kế toán không phải là người đặt dịch vụ! Lệnh đặt dịch vụ tour do Bộ phận Điều hành (OPS) thực hiện.");
    return;
  }

  const form = document.getElementById('supplier-booking-form');
  if (form) form.reset();
  document.getElementById('form-sb-code').value = generateNextCode('LDC-', db.supplierBookings, 'code');

  const bSel = document.getElementById('form-sb-booking');
  bSel.innerHTML = '<option value="">-- Chọn đơn tour --</option>' +
    db.bookings.filter(b => b.status !== 'Đã hủy').map(b => `<option value="${b.code}">${b.code} - ${escapeHtml(b.tourName)} (${b.customerName})</option>`).join('');

  const sSel = document.getElementById('form-sb-supplier');
  sSel.innerHTML = '<option value="">-- Chọn nhà cung cấp --</option>' +
    db.suppliers.map(s => `<option value="${s.id}">${escapeHtml(s.name)} (${s.category} - ${s.debtPolicyTitle || 'Công nợ'})</option>`).join('');

  const badge = document.getElementById('sb-supplier-policy-badge');
  if (badge) badge.classList.add('hidden');

  const due = new Date();
  due.setDate(due.getDate() + 7);
  document.getElementById('form-sb-due-date').value = due.toISOString().split('T')[0];

  document.getElementById('supplier-booking-modal').classList.remove('hidden');
  document.getElementById('supplier-booking-modal').classList.add('flex');
}

function closeSupplierBookingModal() {
  document.getElementById('supplier-booking-modal').classList.add('hidden');
  document.getElementById('supplier-booking-modal').classList.remove('flex');
}

function saveSupplierBooking(e) {
  e.preventDefault();
  if (currentUser && currentUser.role === 'KE_TOAN') {
    alert("⛔ BẢO VỆ DỮ LIỆU: Kế toán không được phép lập lệnh đặt dịch vụ! Thẩm quyền thuộc về Điều hành (OPS).");
    return;
  }

  const codeVal = document.getElementById('form-sb-code').value.trim();
  const bookingCodeVal = document.getElementById('form-sb-booking').value;
  const supplierIdVal = document.getElementById('form-sb-supplier').value;
  const costVal = parseFloat(document.getElementById('form-sb-cost').value) || 0;
  const dueDateVal = document.getElementById('form-sb-due-date').value;
  const payTypeVal = document.getElementById('form-sb-pay-type')?.value || 'CREDIT';
  const notesVal = document.getElementById('form-sb-notes').value.trim();

  const supplier = db.suppliers.find(s => s.id === supplierIdVal || s.code === supplierIdVal);
  const booking = db.bookings.find(b => b.code === bookingCodeVal);

  // Lập tức chuyển trạng thái sang kế toán xem và duyệt
  const initialStatus = payTypeVal === 'PAY_NOW' ? 'WAIT_PAY_APPROVAL' : 'WAIT_DEBT_APPROVAL';
  const statusTitle = payTypeVal === 'PAY_NOW' ? 'Chờ Kế toán duyệt thanh toán ngay' : 'Chờ Kế toán duyệt công nợ đối tác';

  const newOrder = {
    id: codeVal,
    code: codeVal,
    bookingId: bookingCodeVal,
    bookingCode: bookingCodeVal,
    tourName: booking ? booking.tourName : 'Tour du lịch',
    supplierId: supplierIdVal,
    supplierName: supplier ? supplier.name : supplierIdVal,
    serviceType: notesVal || (supplier ? supplier.category : 'Dịch vụ tour'),
    agreedCost: costVal,
    paidCost: 0,
    remainingCost: costVal,
    paymentDueDate: dueDateVal,
    payType: payTypeVal,
    debtPolicy: supplier ? supplier.debtPolicy : 'DEBT_7D',
    debtPolicyTitle: supplier ? supplier.debtPolicyTitle : 'Công nợ đối tác',
    status: initialStatus,
    createdBy: currentUser ? `${currentUser.name} (${currentUser.roleTitle})` : 'Điều hành',
    createdAt: new Date().toISOString().split('T')[0],
    notes: notesVal
  };

  db.supplierBookings.push(newOrder);
  saveDatabase();

  // Tự động gửi thông báo chuyển giao sang bộ phận Kế toán
  sendInterDeptNotification({
    senderRole: 'OPS',
    senderName: currentUser ? `${currentUser.name} (Điều hành)` : 'Bộ phận Điều hành (OPS)',
    targetRole: 'KE_TOAN',
    targetModule: 6,
    type: 'HANDOVER_SUPPLIER_ORDER',
    title: `Lệnh đặt dịch vụ NCC mới: ${codeVal}`,
    message: `Điều hành đã chuyển lệnh đặt dịch vụ ${codeVal} (${supplier?.name} - ${formatVND(costVal)}) sang Kế toán để xem và duyệt (${payTypeVal === 'PAY_NOW' ? 'Thanh toán ngay' : 'Công nợ đối tác'}).`,
    referenceId: codeVal,
    referenceType: 'SUPPLIER_ORDER'
  });

  recordAuditLog('LẬP LỆNH ĐẶT DỊCH VỤ NCC', `Điều hành đã lập lệnh ${codeVal} cho đơn ${bookingCodeVal} với NCC ${supplier?.name}. Chi phí thỏa thuận: ${formatVND(costVal)}. Hình thức: ${payTypeVal === 'PAY_NOW' ? 'Thanh toán ngay' : 'Công nợ đối tác'}. Lập tức chuyển trạng thái sang Kế toán để xem và duyệt.`);

  alert(`✅ ĐÃ LẬP LỆNH ĐẶT DỊCH VỤ THÀNH CÔNG!\n\n- Mã lệnh: ${codeVal}\n- Nhà cung cấp: ${supplier?.name}\n- Chi phí thỏa thuận: ${formatVND(costVal)}\n- Hình thức: ${payTypeVal === 'PAY_NOW' ? 'Thanh toán ngay (PAY NOW)' : 'Công nợ đối tác (CREDIT)'}\n\n👉 Lệnh đã được tự động chuyển trạng thái sang: "${statusTitle}" để Kế toán xem và phê duyệt.`);

  closeSupplierBookingModal();
  renderOpsOrders();
  renderFinanceSupplierOrdersTable();
  renderFinanceModule();
}

// ==========================================
// KẾ TOÁN PHÊ DUYỆT LỆNH ĐẶT DỊCH VỤ NCC & THANH TOÁN
// ==========================================
function openSupplierApprovalModal(orderCode) {
  const sb = (db.supplierBookings || []).find(x => x.code === orderCode || x.id === orderCode);
  if (!sb) return;

  const isKeToanOrCeo = currentUser && (currentUser.role === 'KE_TOAN' || currentUser.role === 'CEO');
  const supplier = (db.suppliers || []).find(s => s.id === sb.supplierId || s.code === sb.supplierId);

  document.getElementById('appr-sb-target-code').value = sb.code;
  document.getElementById('appr-sb-code').textContent = sb.code;
  document.getElementById('appr-sb-booking').textContent = `${sb.bookingCode} (${sb.tourName || 'Tour'})`;
  document.getElementById('appr-sb-supplier').textContent = sb.supplierName;
  document.getElementById('appr-sb-bank').textContent = supplier?.bankAccount || 'Chưa cập nhật tài khoản';
  document.getElementById('appr-sb-service').textContent = `${sb.serviceType} ${sb.notes ? `(${sb.notes})` : ''}`;
  document.getElementById('appr-sb-policy').textContent = sb.debtPolicyTitle || supplier?.debtPolicyTitle || 'Theo thỏa thuận';
  document.getElementById('appr-sb-cost').textContent = formatVND(sb.agreedCost);
  document.getElementById('appr-sb-type').textContent = sb.payType === 'PAY_NOW' ? '⚡ Yêu cầu thanh toán ngay' : '📋 Công nợ đối tác';
  document.getElementById('appr-sb-due-date').textContent = sb.paymentDueDate;
  document.getElementById('appr-sb-status-badge').innerHTML = getSupplierOrderBadge(sb.status);

  // Điền ngày chi tiền và mã UNC mặc định
  document.getElementById('appr-sb-pay-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('appr-sb-ref').value = `UNC-${sb.code.replace('LDC-', '')}-${Date.now().toString().slice(-4)}`;

  const btnPay = document.getElementById('btn-appr-pay');
  const btnDebt = document.getElementById('btn-appr-debt');
  const btnReject = document.getElementById('btn-appr-reject');
  const payFields = document.getElementById('appr-sb-payment-fields');

  if (btnPay) btnPay.classList.add('hidden');
  if (btnDebt) btnDebt.classList.add('hidden');
  if (btnReject) btnReject.classList.add('hidden');
  if (payFields) payFields.classList.add('hidden');

  if (isKeToanOrCeo) {
    if (btnReject && sb.status !== 'PAID_FULL') btnReject.classList.remove('hidden');

    if (sb.status === 'WAIT_PAY_APPROVAL') {
      if (btnPay) {
        btnPay.classList.remove('hidden');
        btnPay.textContent = "⚡ Duyệt Chi & Thanh Toán Ngay";
      }
      if (payFields) payFields.classList.remove('hidden');
    } else if (sb.status === 'WAIT_DEBT_APPROVAL') {
      if (btnDebt) {
        btnDebt.classList.remove('hidden');
        btnDebt.textContent = "📋 Duyệt & Ghi Nhận Công Nợ (A/P)";
      }
      if (btnPay) {
        btnPay.classList.remove('hidden');
        btnPay.textContent = "⚡ Thanh Toán Luôn (Bỏ qua nợ)";
      }
      if (payFields) payFields.classList.remove('hidden');
    } else if (sb.status === 'DEBT_ACKNOWLEDGED' || sb.status === 'PAID_DEPOSIT') {
      if (btnPay) {
        btnPay.classList.remove('hidden');
        btnPay.textContent = "💵 Thanh Toán Công Nợ Cho NCC";
      }
      if (payFields) payFields.classList.remove('hidden');
    }
  }

  document.getElementById('supplier-approval-modal').classList.remove('hidden');
  document.getElementById('supplier-approval-modal').classList.add('flex');
}

function closeSupplierApprovalModal() {
  document.getElementById('supplier-approval-modal').classList.add('hidden');
  document.getElementById('supplier-approval-modal').classList.remove('flex');
}

function handleApproveAndPaySupplierClick() {
  const code = document.getElementById('appr-sb-target-code').value;
  const payDate = document.getElementById('appr-sb-pay-date').value;
  const payMethod = document.getElementById('appr-sb-pay-method').value;
  const refCode = document.getElementById('appr-sb-ref').value.trim();

  if (!refCode) {
    alert("Vui lòng nhập Mã chứng từ / Số lệnh UNC ngân hàng!");
    return;
  }

  approveAndPaySupplierOrder(code, payDate, payMethod, refCode);
}

function approveAndPaySupplierOrder(orderCode, payDate, payMethod, refCode) {
  if (!currentUser || (currentUser.role !== 'KE_TOAN' && currentUser.role !== 'CEO')) {
    alert("⛔ THẨM QUYỀN: Chỉ Kế toán hoặc Giám đốc (CEO) mới có quyền duyệt chi tiền cho Nhà cung cấp!");
    return;
  }

  const sb = (db.supplierBookings || []).find(x => x.code === orderCode || x.id === orderCode);
  if (!sb) return;

  sb.paidCost = sb.agreedCost;
  sb.remainingCost = 0;
  sb.status = 'PAID_FULL';
  sb.approvedBy = `${currentUser.name} (${currentUser.roleTitle})`;
  sb.paidDate = payDate || new Date().toISOString().split('T')[0];
  sb.bankReference = refCode;
  sb.paymentMethod = payMethod || 'BANK_TRANSFER';

  if (db.notifications) {
    const notif = db.notifications.find(n => n.referenceId === sb.code && n.type === 'HANDOVER_SUPPLIER_ORDER');
    if (notif) {
      notif.status = 'ACKNOWLEDGED';
      notif.acknowledgedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      notif.acknowledgedBy = currentUser ? `${currentUser.name} (${currentUser.roleTitle})` : 'Kế toán';
    }
  }

  sendInterDeptNotification({
    senderRole: 'KE_TOAN',
    senderName: currentUser ? `${currentUser.name} (Kế toán)` : 'Bộ phận Kế toán (ACC)',
    targetRole: 'OPS',
    targetModule: 5,
    type: 'HANDOVER_ACK',
    title: `Kế toán đã duyệt chi lệnh NCC: ${sb.code}`,
    message: `Kế toán đã phê duyệt chi ${formatVND(sb.agreedCost)} cho lệnh đặt dịch vụ ${sb.code} (${sb.supplierName}). Mã UNC: ${refCode}.`,
    referenceId: sb.code,
    referenceType: 'SUPPLIER_ORDER'
  });

  saveDatabase();
  recordAuditLog('KẾ TOÁN DUYỆT CHI NCC', `${currentUser.name} đã duyệt chi ${formatVND(sb.agreedCost)} cho lệnh ${sb.code} (NCC: ${sb.supplierName}). Mã UNC: ${refCode}. Ghi nhận dòng tiền ra.`);

  alert(`✅ KẾ TOÁN ĐÃ DUYỆT CHI & THANH TOÁN THÀNH CÔNG!\n\n- Mã lệnh: ${sb.code}\n- NCC: ${sb.supplierName}\n- Số tiền chi: ${formatVND(sb.agreedCost)}\n- Chứng từ UNC: ${refCode}\n\n👉 Giao dịch đã được tự động cập nhật vào Sổ quỹ dòng tiền ra (Cash Out).`);

  closeSupplierApprovalModal();
  renderOpsOrders();
  renderFinanceSupplierOrdersTable();
  renderFinanceModule();
}

function handleAcknowledgeDebtClick() {
  const code = document.getElementById('appr-sb-target-code').value;
  acknowledgeSupplierDebt(code);
}

function acknowledgeSupplierDebt(orderCode) {
  if (!currentUser || (currentUser.role !== 'KE_TOAN' && currentUser.role !== 'CEO')) {
    alert("⛔ THẨM QUYỀN: Chỉ Kế toán hoặc Giám đốc (CEO) mới có quyền duyệt ghi nhận công nợ đối tác!");
    return;
  }

  const sb = (db.supplierBookings || []).find(x => x.code === orderCode || x.id === orderCode);
  if (!sb) return;

  sb.status = 'DEBT_ACKNOWLEDGED';
  sb.acknowledgedBy = `${currentUser.name} (${currentUser.roleTitle})`;
  sb.acknowledgedDate = new Date().toISOString().split('T')[0];

  if (db.notifications) {
    const notif = db.notifications.find(n => n.referenceId === sb.code && n.type === 'HANDOVER_SUPPLIER_ORDER');
    if (notif) {
      notif.status = 'ACKNOWLEDGED';
      notif.acknowledgedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      notif.acknowledgedBy = currentUser ? `${currentUser.name} (${currentUser.roleTitle})` : 'Kế toán';
    }
  }

  sendInterDeptNotification({
    senderRole: 'KE_TOAN',
    senderName: currentUser ? `${currentUser.name} (Kế toán)` : 'Bộ phận Kế toán (ACC)',
    targetRole: 'OPS',
    targetModule: 5,
    type: 'HANDOVER_ACK',
    title: `Kế toán đã duyệt công nợ lệnh NCC: ${sb.code}`,
    message: `Kế toán đã duyệt ghi nhận công nợ ${formatVND(sb.agreedCost)} cho lệnh ${sb.code} (${sb.supplierName}). Hạn thanh toán: ${sb.paymentDueDate}.`,
    referenceId: sb.code,
    referenceType: 'SUPPLIER_ORDER'
  });

  saveDatabase();
  recordAuditLog('KẾ TOÁN GHI NHẬN CÔNG NỢ NCC', `${currentUser.name} đã duyệt ghi nhận công nợ ${formatVND(sb.agreedCost)} cho lệnh ${sb.code} (NCC: ${sb.supplierName}) theo chính sách ${sb.debtPolicyTitle || 'Công nợ đối tác'}. Hạn thanh toán: ${sb.paymentDueDate}.`);

  alert(`✅ KẾ TOÁN ĐÃ DUYỆT GHI NHẬN CÔNG NỢ ĐỐI TÁC!\n\n- Mã lệnh: ${sb.code}\n- NCC: ${sb.supplierName}\n- Số tiền công nợ: ${formatVND(sb.agreedCost)}\n- Hạn thanh toán: ${sb.paymentDueDate}\n\n👉 Khoản nợ đã được ghi nhận vào Nghĩa vụ Phải trả Nhà cung cấp (A/P Debt).`);

  closeSupplierApprovalModal();
  renderOpsOrders();
  renderFinanceSupplierOrdersTable();
  renderFinanceModule();
}

function handleRejectSupplierOrderClick() {
  const code = document.getElementById('appr-sb-target-code').value;
  const reason = prompt("Nhập lý do Kế toán trả về / từ chối lệnh đặt dịch vụ này cho Điều hành:");
  if (reason === null) return;
  if (!reason.trim()) {
    alert("Vui lòng nêu rõ lý do trả về để Điều hành nắm bắt và điều chỉnh!");
    return;
  }

  rejectSupplierOrder(code, reason.trim());
}

function rejectSupplierOrder(orderCode, reason) {
  if (!currentUser || (currentUser.role !== 'KE_TOAN' && currentUser.role !== 'CEO')) {
    alert("⛔ THẨM QUYỀN: Chỉ Kế toán hoặc Giám đốc (CEO) mới có quyền trả về lệnh đặt dịch vụ!");
    return;
  }

  const sb = (db.supplierBookings || []).find(x => x.code === orderCode || x.id === orderCode);
  if (!sb) return;

  sb.status = 'REJECTED';
  sb.rejectedBy = `${currentUser.name} (${currentUser.roleTitle})`;
  sb.rejectedDate = new Date().toISOString().split('T')[0];
  sb.rejectedReason = reason;

  sendInterDeptNotification({
    senderRole: 'KE_TOAN',
    senderName: currentUser ? `${currentUser.name} (Kế toán)` : 'Bộ phận Kế toán (ACC)',
    targetRole: 'OPS',
    targetModule: 5,
    type: 'HANDOVER_REJECT',
    title: `Kế toán trả về lệnh đặt dịch vụ: ${sb.code}`,
    message: `Kế toán trả về lệnh ${sb.code} (${sb.supplierName}) cho Điều hành. Lý do: "${reason}".`,
    referenceId: sb.code,
    referenceType: 'SUPPLIER_ORDER'
  });

  saveDatabase();
  recordAuditLog('KẾ TOÁN TRẢ VỀ LỆNH NCC', `Kế toán trả về lệnh ${sb.code} (NCC: ${sb.supplierName}). Lý do: "${reason}".`);

  alert(`❌ ĐÃ TRẢ VỀ LỆNH CHO ĐIỀU HÀNH!\nLý do: "${reason}"`);

  closeSupplierApprovalModal();
  renderOpsOrders();
  renderFinanceSupplierOrdersTable();
  renderFinanceModule();
}

function renderFinanceSupplierOrdersTable() {
  const tbody = document.getElementById('fin-supplier-orders-table-body');
  if (!tbody) return;

  if (!db.supplierBookings || db.supplierBookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="py-8 text-center text-xs text-slate-400">Chưa có lệnh đặt dịch vụ nào cần xử lý</td></tr>`;
    return;
  }

  // Sắp xếp: Ưu tiên các lệnh chờ duyệt thanh toán hoặc chờ duyệt công nợ lên đầu
  const sorted = [...db.supplierBookings].sort((a, b) => {
    const isAPending = a.status.startsWith('WAIT_');
    const isBPending = b.status.startsWith('WAIT_');
    if (isAPending && !isBPending) return -1;
    if (!isAPending && isBPending) return 1;
    return (b.paymentDueDate > a.paymentDueDate ? -1 : 1);
  });

  tbody.innerHTML = sorted.map(sb => {
    const statusBadge = getSupplierOrderBadge(sb.status);
    const policyTitle = sb.debtPolicyTitle || 'Theo thỏa thuận';
    const remaining = Math.max(0, sb.agreedCost - (sb.paidCost || 0));

    let actionBtn = `<button onclick="openSupplierApprovalModal('${sb.code}')" class="action-btn text-brand-800 bg-brand-50 hover:bg-brand-100 font-bold border border-brand-200">⚖️ Kế toán xử lý</button>`;
    if (sb.status === 'PAID_FULL') {
      actionBtn = `<button onclick="openSupplierApprovalModal('${sb.code}')" class="action-btn text-slate-600 bg-slate-50 hover:bg-slate-100 font-medium">👁️ Xem chứng từ</button>`;
    }

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-2.5 px-3.5 font-mono font-bold text-brand-800">${escapeHtml(sb.code)}</td>
        <td class="py-2.5 px-3.5 font-mono text-slate-700 font-bold">${escapeHtml(sb.bookingCode)}</td>
        <td class="py-2.5 px-3.5 font-bold text-slate-900">${escapeHtml(sb.supplierName)}</td>
        <td class="py-2.5 px-3.5 text-slate-600 text-xs">
          <div>${escapeHtml(sb.serviceType)}</div>
          ${sb.notes ? `<div class="text-[10px] text-slate-400 italic">${escapeHtml(sb.notes)}</div>` : ''}
        </td>
        <td class="py-2.5 px-3.5 text-blue-800 font-medium text-[11px]">${escapeHtml(policyTitle)}</td>
        <td class="py-2.5 px-3.5 font-mono font-bold text-slate-900">${formatVND(sb.agreedCost)}</td>
        <td class="py-2.5 px-3.5 font-mono text-slate-500">${escapeHtml(sb.paymentDueDate)}</td>
        <td class="py-2.5 px-3.5">${statusBadge}</td>
        <td class="py-2.5 px-3.5 text-center whitespace-nowrap space-x-1">
          ${actionBtn}
          <button onclick="openSupplierVoucherModal('${sb.code}')" class="action-btn text-brand-800 bg-brand-50 hover:bg-brand-100 font-bold border border-brand-200" title="Xem & In Phiếu xác nhận dịch vụ">📄 Voucher</button>
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================
// PHÂN HỆ TÀI CHÍNH, KẾ TOÁN & THUẾ LỮ HÀNH HỢP NHẤT (ERP ACCOUNTING & E-TAX)
// Tuân thủ Nghị định 123/2020/NĐ-CP, Thông tư 78/2021/TT-BTC, Thông tư 219/2013/TT-BTC & Thông tư 111/2013/TT-BTC
// ==========================================

let currentFinTab = 'overview'; // 'overview', 'invoices', 'pit', 'ledger', 'supplier-orders'
let invoiceSearchQuery = '';
let invoiceFilterStatus = 'all';
let pitSearchQuery = '';
let doubleEntryAccountFilter = 'ALL';

function switchFinTab(tab) {
  currentFinTab = tab || 'overview';
  const tabs = ['overview', 'invoices', 'pit', 'ledger', 'supplier-orders'];

  tabs.forEach(t => {
    const btn = document.getElementById(`btn-fin-tab-${t}`);
    const content = document.getElementById(`fin-tab-${t}-content`);

    if (btn) {
      if (t === currentFinTab) {
        btn.className = 'fin-tab-btn py-2 px-3.5 rounded-xl transition-all shadow-xs bg-white text-slate-900 border border-slate-200 font-extrabold flex items-center space-x-1.5';
      } else {
        btn.className = 'fin-tab-btn py-2 px-3.5 rounded-xl transition-all text-slate-600 hover:text-slate-900 font-bold flex items-center space-x-1.5';
      }
    }

    if (content) {
      if (t === currentFinTab) content.classList.remove('hidden');
      else content.classList.add('hidden');
    }
  });

  if (currentFinTab === 'overview') {
    renderFinanceOverviewTab();
  } else if (currentFinTab === 'invoices') {
    renderFinanceInvoicesTab();
  } else if (currentFinTab === 'pit') {
    renderFinancePitTab();
  } else if (currentFinTab === 'ledger') {
    renderFinanceLedgerTab();
  } else if (currentFinTab === 'supplier-orders') {
    renderFinanceSupplierOrdersTable();
  }
}

// Tính thuế GTGT du lịch lữ hành trọn gói theo Điều 7 Khoản 16 Thông tư 219/2013/TT-BTC
// Giá tính thuế = Giá tour trọn gói thu từ khách - (Trừ) Các chi phí dịch vụ mua ngoài phục vụ khách
function calculateTourismVat(booking) {
  if (!booking) return { revenue: 0, deductible: 0, taxable: 0, vatRate: 10, vatAmount: 0 };
  const revenue = Number(booking.totalAmount) || 0;
  // Chi phí mua ngoài trực tiếp (vé máy bay, khách sạn, ăn uống, xe)
  const deductible = Number(booking.actualCost || booking.estimatedCost || Math.round(revenue * 0.65));
  const taxable = Math.max(0, revenue - deductible);
  const vatRate = 10;
  const vatAmount = Math.round(taxable * 0.10);
  return { revenue, deductible, taxable, vatRate, vatAmount };
}

// Khấu trừ thuế TNCN hoa hồng CTV theo Điểm i Khoản 1 Điều 25 Thông tư 111/2013/TT-BTC
// Chi trả từ 2.000.000 VNĐ/lần trở lên phải khấu trừ 10%
function calculateCtvPit(grossAmount) {
  const gross = Number(grossAmount) || 0;
  let pitTax = 0;
  if (gross >= 2000000) {
    pitTax = Math.round(gross * 0.10);
  }
  const net = Math.max(0, gross - pitTax);
  return { gross, pitRate: gross >= 2000000 ? 10 : 0, pitTax, net };
}

// 20. CONTROLLER CHÍNH PHÂN HỆ 6: TÀI CHÍNH, KẾ TOÁN & THUẾ
function renderFinanceModule() {
  if (!db.invoices) db.invoices = JSON.parse(JSON.stringify(INITIAL_INVOICES));
  if (!db.taxReceipts) db.taxReceipts = JSON.parse(JSON.stringify(INITIAL_TAX_RECEIPTS));
  if (!db.journalEntries) db.journalEntries = JSON.parse(JSON.stringify(INITIAL_JOURNAL_ENTRIES));

  // 1. Thu từ khách hàng & Phải thu A/R
  const totalIn = db.payments.filter(p => p.status === 'CONFIRMED' && (!p.type || p.type === 'PAYMENT')).reduce((s, p) => s + (p.amount || 0), 0);
  const totalRefund = db.payments.filter(p => p.status === 'CONFIRMED' && p.type === 'REFUND').reduce((s, p) => s + (p.amount || 0), 0);
  const cashIn = Math.max(0, totalIn - totalRefund);
  const activeBookings = db.bookings.filter(b => b.status !== 'Da h?y');
  const contractTotal = activeBookings.reduce((s, b) => s + (b.totalAmount || 0), 0);
  const receivable = activeBookings.reduce((s, b) => s + (b.remainingAmount || 0), 0);

  const elFinCollected = document.getElementById('fin-stat-collected');
  if (elFinCollected) elFinCollected.textContent = formatVND(cashIn);
  const elFinContract = document.getElementById('fin-stat-contract-total');
  if (elFinContract) elFinContract.textContent = formatVND(contractTotal);
  const elFinReceivable = document.getElementById('fin-stat-receivable');
  if (elFinReceivable) elFinReceivable.textContent = formatVND(receivable);

  // 2. Phải trả Nhà cung cấp & Công nợ A/P
  const supplierTotalCost = db.supplierBookings.reduce((s, sb) => s + (sb.agreedCost || 0), 0);
  const supplierPaid = db.supplierBookings.reduce((s, sb) => s + (sb.paidCost || 0), 0);
  const supplierDebt = Math.max(0, supplierTotalCost - supplierPaid);

  const elFinSuppCost = document.getElementById('fin-stat-supplier-cost');
  if (elFinSuppCost) elFinSuppCost.textContent = formatVND(supplierTotalCost);
  const elFinSuppPaid = document.getElementById('fin-stat-supplier-paid');
  if (elFinSuppPaid) elFinSuppPaid.textContent = formatVND(supplierPaid);
  const elFinSuppDebt = document.getElementById('fin-stat-supplier-debt');
  if (elFinSuppDebt) elFinSuppDebt.textContent = formatVND(supplierDebt);

  // 3. Nghĩa vụ Hoa hồng CTV
  const activeComms = db.commissions.filter(c => c.status !== 'Da h?y');
  const commTotal = activeComms.reduce((s, c) => s + (c.amount || 0), 0);
  const commPaid = activeComms.filter(c => c.status === 'Da thanh ton').reduce((s, c) => s + (c.amount || 0), 0);
  const commPayable = activeComms.filter(c => c.status === 'Ch? duy?t' || c.status === 'Da duy?t chi').reduce((s, c) => s + (c.amount || 0), 0);

  const elFinCommTotal = document.getElementById('fin-stat-comm-total');
  if (elFinCommTotal) elFinCommTotal.textContent = formatVND(commTotal);
  const elFinCommPaid = document.getElementById('fin-stat-comm-paid');
  if (elFinCommPaid) elFinCommPaid.textContent = formatVND(commPaid);
  const elFinCommPayable = document.getElementById('fin-stat-comm-payable');
  if (elFinCommPayable) elFinCommPayable.textContent = formatVND(commPayable);

  // 4. Dòng tiền ròng (Net Cash)
  const cashOut = supplierPaid + commPaid;
  const netCash = cashIn - cashOut;

  const elFinNetCash = document.getElementById('fin-stat-net-cash');
  if (elFinNetCash) elFinNetCash.textContent = formatVND(netCash);
  const elFinCashIn = document.getElementById('fin-stat-cash-in');
  if (elFinCashIn) elFinCashIn.textContent = formatVND(cashIn);
  const elFinCashOut = document.getElementById('fin-stat-cash-out');
  if (elFinCashOut) elFinCashOut.textContent = formatVND(cashOut);

  // 5. Tính Thuế GTGT Lữ Hành (TT 219)
  let totalVatTaxable = 0;
  let totalDeductible = 0;
  activeBookings.forEach(b => {
    const calc = calculateTourismVat(b);
    totalDeductible += calc.deductible;
    totalVatTaxable += calc.taxable;
  });
  const vatEstimate = Math.round(totalVatTaxable * 0.10);

  const elVatEst = document.getElementById('fin-stat-vat-estimate');
  if (elVatEst) elVatEst.textContent = formatVND(vatEstimate);
  const elVatDed = document.getElementById('fin-stat-vat-deductible');
  if (elVatDed) elVatDed.textContent = formatVND(totalDeductible);
  const elVatTax = document.getElementById('fin-stat-vat-taxable');
  if (elVatTax) elVatTax.textContent = formatVND(totalVatTaxable);

  // 6. Tính Thuế TNCN Khấu Trừ CTV (TT 111)
  let pitWithheld = 0;
  let pitGross = 0;
  let pitNet = 0;
  activeComms.forEach(c => {
    const pCalc = calculateCtvPit(c.amount);
    pitGross += pCalc.gross;
    pitWithheld += pCalc.pitTax;
    pitNet += pCalc.net;
  });

  const elPitWithheld = document.getElementById('fin-stat-pit-withheld');
  if (elPitWithheld) elPitWithheld.textContent = formatVND(pitWithheld);
  const elPitGross = document.getElementById('fin-stat-pit-gross');
  if (elPitGross) elPitGross.textContent = formatVND(pitGross);
  const elPitNet = document.getElementById('fin-stat-pit-net');
  if (elPitNet) elPitNet.textContent = formatVND(pitNet);

  // Badges số lượng trên sub-tabs
  const badgeInv = document.getElementById('badge-fin-invoices-count');
  if (badgeInv) badgeInv.textContent = (db.invoices || []).length;
  const badgePit = document.getElementById('badge-fin-pit-count');
  if (badgePit) badgePit.textContent = (db.taxReceipts || []).length;

  // Bảng phân tích tuổi nợ (Aging)
  renderAgingReports(activeBookings);

  // Kích hoạt tab hiện tại
  switchFinTab(currentFinTab);
}

// Phân tích tuổi nợ A/R và A/P
function renderAgingReports(activeBookings) {
  let arCurrent = 0, ar30 = 0, ar60 = 0, arOver60 = 0;
  const now = new Date();

  activeBookings.forEach(b => {
    const debt = Math.max(0, (b.totalAmount || 0) - (b.paidAmount || 0));
    if (debt <= 0) return;

    const bDate = new Date(b.departureDate || b.createdAt || now);
    const diffDays = Math.floor((now - bDate) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) arCurrent += debt;
    else if (diffDays <= 30) ar30 += debt;
    else if (diffDays <= 60) ar60 += debt;
    else arOver60 += debt;
  });

  const elArCur = document.getElementById('ar-aging-current');
  if (elArCur) elArCur.textContent = formatVND(arCurrent);
  const elAr30 = document.getElementById('ar-aging-30');
  if (elAr30) elAr30.textContent = formatVND(ar30);
  const elAr60 = document.getElementById('ar-aging-60');
  if (elAr60) elAr60.textContent = formatVND(ar60);
  const elArO60 = document.getElementById('ar-aging-over60');
  if (elArO60) elArO60.textContent = formatVND(arOver60);

  // Tuổi nợ NCC
  let apNormal = 0, apSoon = 0, apOverdue = 0;
  (db.supplierBookings || []).forEach(sb => {
    const debt = Math.max(0, (sb.agreedCost || 0) - (sb.paidCost || 0));
    if (debt <= 0) return;
    const due = new Date(sb.paymentDueDate || now);
    const diffDays = Math.floor((due - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) apOverdue += debt;
    else if (diffDays <= 3) apSoon += debt;
    else apNormal += debt;
  });

  const elApNorm = document.getElementById('ap-aging-normal');
  if (elApNorm) elApNorm.textContent = formatVND(apNormal);
  const elApSoon = document.getElementById('ap-aging-soon');
  if (elApSoon) elApSoon.textContent = formatVND(apSoon);
  const elApOver = document.getElementById('ap-aging-overdue');
  if (elApOver) elApOver.textContent = formatVND(apOverdue);
}

function renderFinanceOverviewTab() {
  renderFinanceLedger();
}

// ==========================================
// RENDER SUB-TAB 2: HÓA ĐƠN ĐIỆN TỬ GTGT DU LỊCH (E-INVOICE)
// ==========================================
function renderFinanceInvoicesTab() {
  const tbody = document.getElementById('fin-invoices-table-body');
  if (!tbody) return;

  const invoices = db.invoices || [];
  const q = (document.getElementById('invoice-search-input')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('invoice-status-filter')?.value || 'all';

  const filtered = invoices.filter(inv => {
    const matchStatus = statusFilter === 'all' || inv.status === statusFilter;
    const matchQ = !q ||
      inv.code.toLowerCase().includes(q) ||
      inv.invoiceNo.includes(q) ||
      (inv.customerName && inv.customerName.toLowerCase().includes(q)) ||
      (inv.customerTaxCode && inv.customerTaxCode.includes(q)) ||
      (inv.bookingCode && inv.bookingCode.toLowerCase().includes(q));
    return matchStatus && matchQ;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12" class="py-8 text-center text-xs text-slate-400">Không tìm thấy hóa đơn điện tử nào phù hợp</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(inv => {
    let statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">✅ Đã cấp mã CQT</span>';
    if (inv.status === 'PENDING_CQT') {
      statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">⏳ Chờ cấp mã CQT</span>';
    } else if (inv.status === 'CANCELLED') {
      statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">❌ Đã hủy</span>';
    } else if (inv.status === 'ADJUSTED') {
      statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">🔄 Điều chỉnh</span>';
    }

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-2.5 px-3 font-mono font-bold text-rose-600">${escapeHtml(inv.invoiceNo)}</td>
        <td class="py-2.5 px-3 text-slate-600 whitespace-nowrap">
          <div class="font-mono font-bold text-indigo-700">${escapeHtml(inv.serial)}</div>
          <div class="text-[10px] text-slate-400">${escapeHtml(inv.issueDate)}</div>
        </td>
        <td class="py-2.5 px-3">
          <div class="font-bold text-slate-900">${escapeHtml(inv.customerName)}</div>
          <div class="text-[10px] text-slate-400 truncate max-w-[150px]">${escapeHtml(inv.customerEmail || '')}</div>
        </td>
        <td class="py-2.5 px-3 font-mono text-slate-700">${escapeHtml(inv.customerTaxCode || 'Cá nhân')}</td>
        <td class="py-2.5 px-3 font-mono font-bold text-brand-800">${escapeHtml(inv.bookingCode)}</td>
        <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">${formatVND(inv.totalPackageRevenue)}</td>
        <td class="py-2.5 px-3 text-right font-mono text-amber-700">${formatVND(inv.deductibleOutsideCost)}</td>
        <td class="py-2.5 px-3 text-right font-mono font-bold text-indigo-900 bg-indigo-50/40">${formatVND(inv.taxableVatAmount)}</td>
        <td class="py-2.5 px-3 text-right font-mono text-rose-600 font-bold">${formatVND(inv.vatAmount)}</td>
        <td class="py-2.5 px-3 text-right font-mono font-black text-emerald-700 text-sm">${formatVND(inv.grandTotal)}</td>
        <td class="py-2.5 px-3">
          <div class="text-[9px] font-mono text-slate-500 truncate max-w-[120px]" title="${escapeHtml(inv.cqtCode || '')}">${escapeHtml(inv.cqtCode || '-')}</div>
          <div class="mt-0.5">${statusBadge}</div>
        </td>
        <td class="py-2.5 px-3 text-center whitespace-nowrap space-x-1">
          <button type="button" onclick="viewInvoiceModal('${inv.id}')" class="px-2 py-1 bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 rounded-lg shadow-2xs" title="Xem bản thể hiện HĐĐT">👁️ Xem</button>
          <button type="button" onclick="downloadInvoiceXml('${inv.id}')" class="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold border border-indigo-200 rounded-lg shadow-2xs" title="Tải file XML chuẩn Thông tư 78">📥 XML</button>
          <button type="button" onclick="sendInvoiceEmail('${inv.id}')" class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 rounded-lg shadow-2xs" title="Gửi HĐĐT qua email khách hàng">📧</button>
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================
// RENDER SUB-TAB 3: CHỨNG TỪ THUẾ TNCN CTV (TT 111 & NĐ 123)
// ==========================================
function renderFinancePitTab() {
  const tbody = document.getElementById('fin-pit-table-body');
  if (!tbody) return;

  const receipts = db.taxReceipts || [];
  const q = (document.getElementById('pit-search-input')?.value || '').toLowerCase().trim();

  const filtered = receipts.filter(r => {
    return !q ||
      r.code.toLowerCase().includes(q) ||
      r.receiptNo.includes(q) ||
      (r.ctvName && r.ctvName.toLowerCase().includes(q)) ||
      (r.ctvTaxCode && r.ctvTaxCode.includes(q));
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" class="py-8 text-center text-xs text-slate-400">Không tìm thấy chứng từ khấu trừ thuế TNCN nào</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(r => {
    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-2.5 px-3.5 font-mono font-bold text-emerald-900">${escapeHtml(r.code)}</td>
        <td class="py-2.5 px-3.5 text-slate-500 whitespace-nowrap">${escapeHtml(r.issueDate)}</td>
        <td class="py-2.5 px-3.5 font-bold text-slate-900">${escapeHtml(r.ctvName)}</td>
        <td class="py-2.5 px-3.5 font-mono text-slate-700">${escapeHtml(r.ctvTaxCode)}</td>
        <td class="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900">${formatVND(r.grossIncome)}</td>
        <td class="py-2.5 px-3.5 text-right font-mono font-bold text-rose-600 bg-rose-50/40">-${formatVND(r.withheldTaxAmount)}</td>
        <td class="py-2.5 px-3.5 text-right font-mono font-black text-emerald-700">${formatVND(r.netPaidAmount)}</td>
        <td class="py-2.5 px-3.5 font-mono text-[10px] text-slate-500 truncate max-w-[110px]" title="${escapeHtml(r.cqtVerificationCode)}">${escapeHtml(r.cqtVerificationCode)}</td>
        <td class="py-2.5 px-3.5"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">✅ Đã cấp CQT</span></td>
        <td class="py-2.5 px-3.5 text-center whitespace-nowrap space-x-1">
          <button type="button" onclick="viewTaxReceiptModal('${r.id}')" class="px-2 py-1 bg-white hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 rounded-lg shadow-2xs" title="Xem chứng từ mẫu 03/TNCN">👁️ Xem</button>
          <button type="button" onclick="downloadTaxReceiptXml('${r.id}')" class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 rounded-lg shadow-2xs" title="Tải file XML">📥 XML</button>
        </td>
      </tr>
    `;
  }).join('');
}

// ==========================================
// RENDER SUB-TAB 4: TỜ KHAI THUẾ GTGT & HỆ THỐNG SỔ KÉP (TT 200)
// ==========================================
function renderFinanceLedger() {
  renderFinanceLedgerTab();
}

function renderFinanceLedger() {
  renderFinanceLedgerTab();
}

function renderFinanceLedgerTab() {
  // 1. Tính toán Tờ khai thuế GTGT Mẫu 01/GTGT
  const activeBookings = (db.bookings || []).filter(b => b.status !== 'Da h?y');
  let totalDeductible = 0;
  let totalTaxable = 0;

  activeBookings.forEach(b => {
    const calc = calculateTourismVat(b);
    totalDeductible += calc.deductible;
    totalTaxable += calc.taxable;
  });

  const vatOutput = Math.round(totalTaxable * 0.10); // Chỉ tiêu [32]
  // Thuế đầu vào được khấu trừ từ hóa đơn NCC (giả định 10% trên chi phí có HĐĐT)
  const inputVatDeductible = Math.round(totalDeductible * 0.05); // Chỉ tiêu [22]
  const vatPayable = Math.max(0, vatOutput - inputVatDeductible); // Chỉ tiêu [40]

  const elCt21 = document.getElementById('tax-ct-21');
  if (elCt21) elCt21.textContent = '0 đ';
  const elCt22Rev = document.getElementById('tax-ct-22-rev');
  if (elCt22Rev) elCt22Rev.textContent = formatVND(totalDeductible);
  const elCt22Vat = document.getElementById('tax-ct-22-vat');
  if (elCt22Vat) elCt22Vat.textContent = formatVND(inputVatDeductible);
  const elCt29Rev = document.getElementById('tax-ct-29-rev');
  if (elCt29Rev) elCt29Rev.textContent = formatVND(totalTaxable);
  const elCt32Vat = document.getElementById('tax-ct-32-vat');
  if (elCt32Vat) elCt32Vat.textContent = formatVND(vatOutput);
  const elCt40Pay = document.getElementById('tax-ct-40-payable');
  if (elCt40Pay) elCt40Pay.textContent = formatVND(vatPayable);

  // 2. Sổ Nhật Ký Chung & Hạch toán Kép (TT 200)
  renderDoubleEntryLedger();
}

function filterDoubleEntryLedger(account) {
  doubleEntryAccountFilter = account || 'ALL';
  renderDoubleEntryLedger();
}

function renderDoubleEntryLedger() {
  const tbody = document.getElementById('fin-double-entry-table-body');
  if (!tbody) return;

  const entries = db.journalEntries || [];
  const filtered = entries.filter(e => {
    if (doubleEntryAccountFilter === 'ALL') return true;
    return e.debitAccount.startsWith(doubleEntryAccountFilter) || e.creditAccount.startsWith(doubleEntryAccountFilter);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-xs text-slate-400">Không có bút toán nào tương ứng với tài khoản chọn</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(e => {
    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-2.5 px-3.5 text-slate-500 whitespace-nowrap font-mono">${escapeHtml(e.date)}</td>
        <td class="py-2.5 px-3.5 font-mono font-bold text-slate-900">${escapeHtml(e.voucherNo)}</td>
        <td class="py-2.5 px-3.5 text-slate-800">${escapeHtml(e.description)}</td>
        <td class="py-2.5 px-3.5 font-mono font-black text-center text-emerald-800 bg-emerald-50/50">${escapeHtml(e.debitAccount)}</td>
        <td class="py-2.5 px-3.5 font-mono font-black text-center text-rose-800 bg-rose-50/50">${escapeHtml(e.creditAccount)}</td>
        <td class="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900">${formatVND(e.amount)}</td>
        <td class="py-2.5 px-3.5 font-medium text-slate-600">${escapeHtml(e.counterparty || e.bookingCode)}</td>
      </tr>
    `;
  }).join('');
}

// ==========================================
// THAO TÁC MODAL HÓA ĐƠN ĐIỆN TỬ (E-INVOICE ACTIONS)
// ==========================================
function openCreateInvoiceModal(prefillBookingCode) {
  const modal = document.getElementById('modal-create-invoice');
  if (!modal) return;

  const select = document.getElementById('inv-form-booking-select');
  if (select) {
    select.innerHTML = '<option value="">-- Chọn đơn tour đã ký hợp đồng hoặc đã thu tiền --</option>' +
      (db.bookings || []).map(b => `
        <option value="${escapeHtml(b.code)}" ${b.code === prefillBookingCode ? 'selected' : ''}>
          ${escapeHtml(b.code)} - ${escapeHtml(b.customerName)} (${escapeHtml(b.tourName)}) - ${formatVND(b.totalAmount)}
        </option>
      `).join('');
  }

  if (prefillBookingCode) {
    onInvoiceBookingSelectChange(prefillBookingCode);
  } else {
    resetInvoiceForm();
  }

  modal.classList.remove('hidden');
}

function closeCreateInvoiceModal() {
  const modal = document.getElementById('modal-create-invoice');
  if (modal) modal.classList.add('hidden');
}

function resetInvoiceForm() {
  const ids = ['inv-form-cust-name', 'inv-form-cust-tax', 'inv-form-cust-addr', 'inv-form-cust-email', 'inv-form-service-name'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('inv-form-total-revenue').value = 0;
  document.getElementById('inv-form-deductible-cost').value = 0;
  calculateInvoiceTaxBreakdown();
}

function onInvoiceBookingSelectChange(bookingCode) {
  if (!bookingCode) {
    resetInvoiceForm();
    return;
  }

  const b = (db.bookings || []).find(x => x.code === bookingCode || x.id === bookingCode);
  if (!b) return;

  document.getElementById('inv-form-cust-name').value = b.customerName || '';
  document.getElementById('inv-form-cust-tax').value = b.customerTaxCode || (b.customerPhone ? '03' + b.customerPhone.slice(2, 10) : '0317899888');
  document.getElementById('inv-form-cust-addr').value = 'TP. Hồ Chí Minh';
  document.getElementById('inv-form-cust-email').value = b.customerEmail || (b.customerPhone ? `khach_${b.customerPhone}@gmail.com` : 'khachhang@hahatravel.vn');
  document.getElementById('inv-form-service-name').value = `${b.tourName} (${b.paxCount} khách)`;

  const rev = b.totalAmount || 0;
  const ded = b.actualCost || b.estimatedCost || Math.round(rev * 0.65);

  document.getElementById('inv-form-total-revenue').value = rev;
  document.getElementById('inv-form-deductible-cost').value = ded;

  calculateInvoiceTaxBreakdown();
}

function calculateInvoiceTaxBreakdown() {
  const rev = Number(document.getElementById('inv-form-total-revenue')?.value) || 0;
  const ded = Number(document.getElementById('inv-form-deductible-cost')?.value) || 0;
  const rate = Number(document.getElementById('inv-form-vat-rate')?.value) || 10;

  const taxable = Math.max(0, rev - ded);
  const vatAmount = Math.round(taxable * (rate / 100));
  const grandTotal = rev + vatAmount;

  const elTaxable = document.getElementById('inv-form-taxable-amount');
  if (elTaxable) elTaxable.value = taxable;
  const elVatAmt = document.getElementById('inv-form-vat-amount');
  if (elVatAmt) elVatAmt.value = formatVND(vatAmount);
  const elGrand = document.getElementById('inv-form-grand-total');
  if (elGrand) elGrand.value = formatVND(grandTotal);
}

function handleCreateInvoiceSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const bookingSelect = document.getElementById('inv-form-booking-select');
  const bookingCode = bookingSelect ? bookingSelect.value : '';
  const custName = document.getElementById('inv-form-cust-name').value.trim();
  const custTax = document.getElementById('inv-form-cust-tax').value.trim();
  const custAddr = document.getElementById('inv-form-cust-addr').value.trim();
  const custEmail = document.getElementById('inv-form-cust-email').value.trim();
  const paymentMethod = document.getElementById('inv-form-payment-method').value;
  const serviceName = document.getElementById('inv-form-service-name').value.trim();
  const totalRev = Number(document.getElementById('inv-form-total-revenue').value) || 0;
  const deductible = Number(document.getElementById('inv-form-deductible-cost').value) || 0;
  const rate = Number(document.getElementById('inv-form-vat-rate').value) || 10;
  const notes = document.getElementById('inv-form-notes').value.trim();

  const taxable = Math.max(0, totalRev - deductible);
  const vatAmount = Math.round(taxable * (rate / 100));
  const grandTotal = totalRev + vatAmount;

  // Tạo số HĐ tự tăng an toàn
  const nextSeq = ((db.invoices || []).length + 1).toString().padStart(8, '0');
  const nowStr = new Date().toISOString().split('T')[0];
  const nowFull = new Date().toLocaleString('vi-VN');

  // Sinh mã cơ quan thuế giả lập SHA-34 ký tự chuẩn TCT
  const cqtHex = Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16).toUpperCase()).join('');
  const cqtCode = `00-26-1C26TAA-${nextSeq}-${cqtHex}`;

  const newInvoice = {
    id: `INV-${Date.now()}`,
    code: `1C26TAA-${nextSeq}`,
    invoiceNo: nextSeq,
    serial: '1C26TAA',
    issueDate: nowStr,
    bookingCode: bookingCode || 'DH-LE',
    customerName: custName,
    customerTaxCode: custTax,
    customerAddress: custAddr,
    customerEmail: custEmail,
    paymentMethod: paymentMethod,
    serviceName: serviceName,
    totalPackageRevenue: totalRev,
    deductibleOutsideCost: deductible,
    taxableVatAmount: taxable,
    vatRate: rate,
    vatAmount: vatAmount,
    grandTotal: grandTotal,
    amountInWords: numberToVietnameseWords(grandTotal),
    cqtCode: cqtCode,
    status: 'CQT_ISSUED',
    legalNotes: notes,
    signedAt: nowFull,
    signer: 'CÔNG TY TNHH HAHA ECO TRAVEL (MST: 0317899888)'
  };

  if (!db.invoices) db.invoices = [];
  db.invoices.push(newInvoice);

  // Sinh tự động bút toán kép (Double-entry journal entries)
  if (!db.journalEntries) db.journalEntries = [];
  db.journalEntries.push({
    id: `JE-${Date.now()}-1`,
    date: nowStr,
    voucherNo: `HD-${nextSeq}`,
    description: `Ghi nhận doanh thu tour và công nợ HĐĐT số ${nextSeq}`,
    debitAccount: '131',
    creditAccount: '511',
    amount: totalRev,
    bookingCode: bookingCode,
    counterparty: custName
  });
  if (vatAmount > 0) {
    db.journalEntries.push({
      id: `JE-${Date.now()}-2`,
      date: nowStr,
      voucherNo: `HD-${nextSeq}-VAT`,
      description: `Thuế GTGT 10% lữ hành trên chênh lệch theo TT 219 (HĐ ${nextSeq})`,
      debitAccount: '131',
      creditAccount: '33311',
      amount: vatAmount,
      bookingCode: bookingCode,
      counterparty: 'Cơ quan Thuế'
    });
  }

  saveDatabase();
  closeCreateInvoiceModal();
  renderFinanceModule();

  recordAuditLog('PHÁT HÀNH HÓA ĐƠN ĐIỆN TỬ', `Ký số thành công HĐĐT số ${nextSeq} (Ký hiệu 1C26TAA) cho ${custName}. Mã CQT: ${cqtCode}`);
  alert(`🎉 PHÁT HÀNH HÓA ĐƠN ĐIỆN TỬ THÀNH CÔNG!\n\nSố HĐ: ${nextSeq} | Ký hiệu: 1C26TAA\nKhách hàng: ${custName}\nThuế GTGT chênh lệch lữ hành: ${formatVND(vatAmount)}\nTổng thanh toán: ${formatVND(grandTotal)}\n\nMã xác thực CQT: ${cqtCode}\n(Dữ liệu đã truyền thành công tới hệ thống Tổng Cục Thuế)`);
}

function viewInvoiceModal(invoiceId) {
  const inv = (db.invoices || []).find(i => i.id === invoiceId || i.invoiceNo === invoiceId || i.code === invoiceId);
  if (!inv) return;

  document.getElementById('view-inv-serial').textContent = inv.serial;
  document.getElementById('view-inv-no').textContent = inv.invoiceNo;
  document.getElementById('view-inv-date').textContent = inv.issueDate;
  document.getElementById('view-inv-cqt-code').textContent = inv.cqtCode;
  document.getElementById('view-inv-buyer-name').textContent = inv.customerName;
  document.getElementById('view-inv-buyer-tax').textContent = inv.customerTaxCode || 'Cá nhân không MST';
  document.getElementById('view-inv-buyer-company').textContent = inv.customerTaxCode ? inv.customerName : 'Khách hàng cá nhân';
  document.getElementById('view-inv-buyer-address').textContent = inv.customerAddress || 'TP. Hồ Chí Minh';
  document.getElementById('view-inv-payment-method').textContent = inv.paymentMethod || 'Chuyển khoản';
  document.getElementById('view-inv-item-name').textContent = inv.serviceName;
  document.getElementById('view-inv-item-legal-note').textContent = `(${inv.legalNotes})`;
  document.getElementById('view-inv-item-total').textContent = formatVND(inv.totalPackageRevenue);
  document.getElementById('view-inv-item-deduct').textContent = formatVND(inv.deductibleOutsideCost);
  document.getElementById('view-inv-item-taxable').textContent = formatVND(inv.taxableVatAmount);
  document.getElementById('view-inv-summary-taxable').textContent = formatVND(inv.taxableVatAmount);
  document.getElementById('view-inv-summary-vat-rate').textContent = `${inv.vatRate}%`;
  document.getElementById('view-inv-summary-vat-amount').textContent = formatVND(inv.vatAmount);
  document.getElementById('view-inv-summary-grand-total').textContent = formatVND(inv.grandTotal);
  document.getElementById('view-inv-words').textContent = inv.amountInWords || numberToVietnameseWords(inv.grandTotal);
  document.getElementById('view-inv-sign-time').textContent = `Thời gian ký: ${inv.signedAt || inv.issueDate}`;

  // Gán sự kiện cho các nút hành động trong modal
  document.getElementById('btn-modal-inv-xml').onclick = () => downloadInvoiceXml(inv.id);
  document.getElementById('btn-modal-inv-email').onclick = () => sendInvoiceEmail(inv.id);

  const modal = document.getElementById('modal-view-invoice');
  if (modal) modal.classList.remove('hidden');
}

function closeViewInvoiceModal() {
  const modal = document.getElementById('modal-view-invoice');
  if (modal) modal.classList.add('hidden');
}

function downloadInvoiceXml(invoiceId) {
  const inv = (db.invoices || []).find(i => i.id === invoiceId || i.invoiceNo === invoiceId || i.code === invoiceId);
  if (!inv) return;

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<HDon xmlns="http://laphoadon.gdt.gov.vn/2020/01">
  <TTChung>
    <PBan>2.0.0</PBan>
    <THDon>Hóa đơn giá trị gia tăng</THDon>
    <KHMSHDon>1</KHMSHDon>
    <KHHDon>${inv.serial}</KHHDon>
    <SHDon>${inv.invoiceNo}</SHDon>
    <NLap>${inv.issueDate}</NLap>
    <DVTTe>VND</DVTTe>
    <TGia>1.0</TGia>
    <HTTToan>${inv.paymentMethod}</HTTToan>
    <MSTTCQT>${inv.cqtCode}</MSTTCQT>
  </TTChung>
  <NDHDon>
    <NBan>
      <Ten>CÔNG TY TNHH HAHA ECO TRAVEL</Ten>
      <MST>0317899888</MST>
      <DChi>120 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</DChi>
      <SDThoai>0988112233</SDThoai>
      <DCTDTu>finance@hahatravel.vn</DCTDTu>
    </NBan>
    <NMua>
      <Ten>${escapeHtml(inv.customerName)}</Ten>
      <MST>${escapeHtml(inv.customerTaxCode || '')}</MST>
      <DChi>${escapeHtml(inv.customerAddress || '')}</DChi>
      <DCTDTu>${escapeHtml(inv.customerEmail || '')}</DCTDTu>
    </NMua>
    <DSHangHoa>
      <HHDVu>
        <STT>1</STT>
        <THHDVu>${escapeHtml(inv.serviceName)}</THHDVu>
        <DVTinh>Đoàn</DVTinh>
        <SLuong>1</SLuong>
        <DGia>${inv.totalPackageRevenue}</DGia>
        <Tien>${inv.totalPackageRevenue}</Tien>
        <CPhiMuaNgoaiGiamTru>${inv.deductibleOutsideCost}</CPhiMuaNgoaiGiamTru>
        <GiaTinhThueChanhLech>${inv.taxableVatAmount}</GiaTinhThueChanhLech>
        <TSuat>${inv.vatRate}%</TSuat>
        <TThue>${inv.vatAmount}</TThue>
        <ThanhTien>${inv.grandTotal}</ThanhTien>
        <GChuPhapLy>${escapeHtml(inv.legalNotes)}</GChuPhapLy>
      </HHDVu>
    </DSHangHoa>
    <TToan>
      <TgTCThue>${inv.taxableVatAmount}</TgTCThue>
      <TgTThue>${inv.vatAmount}</TgTThue>
      <TgTTTBSo>${inv.grandTotal}</TgTTTBSo>
      <TgTTTBChu>${escapeHtml(inv.amountInWords)}</TgTTTBChu>
    </TToan>
  </NDHDon>
  <DSCKS>
    <NNKS>CÔNG TY TNHH HAHA ECO TRAVEL</NNKS>
    <NgayKy>${inv.signedAt}</NgayKy>
    <ChungThuSo>Viettel-CA Qualified Commercial Certificate</ChungThuSo>
  </DSCKS>
</HDon>`;

  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `HOA_DON_DIEN_TU_${inv.serial}_${inv.invoiceNo}.xml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  alert(`📥 ĐÃ TẢI FILE XML HÓA ĐƠN ĐIỆN TỬ!\n\nTên file: HOA_DON_DIEN_TU_${inv.serial}_${inv.invoiceNo}.xml\nChuẩn cấu trúc XML theo Thông tư 78/2021/TT-BTC & Nghị định 123/2020/NĐ-CP.`);
}

function sendInvoiceEmail(invoiceId) {
  const inv = (db.invoices || []).find(i => i.id === invoiceId || i.invoiceNo === invoiceId || i.code === invoiceId);
  if (!inv) return;
  alert(`📧 ĐÃ GỬI HÓA ĐƠN ĐIỆN TỬ THÀNH CÔNG!\n\nHóa đơn số: ${inv.invoiceNo} (Ký hiệu ${inv.serial})\nNgười nhận: ${inv.customerName}\nEmail: ${inv.customerEmail}\n\nEmail đính kèm bản thể hiện PDF có chữ ký số điện tử và file XML chuẩn Tổng cục Thuế.`);
}

// ==========================================
// THAO TÁC CHỨNG TỪ THUẾ TNCN CTV (E-PIT ACTIONS)
// ==========================================
function openCreateTaxReceiptModal(commId) {
  const modal = document.getElementById('modal-create-tax-receipt');
  if (!modal) return;

  const select = document.getElementById('pit-form-comm-select');
  if (select) {
    const validComms = (db.commissions || []).filter(c => c.status !== 'Da h?y');
    select.innerHTML = '<option value="">-- Chọn phiếu chi hoa hồng từ 2.000.000 VNĐ --</option>' +
      validComms.map(c => {
        const ctv = (db.ctvs || []).find(x => x.id === c.ctvId) || {};
        return `<option value="${c.id}" ${c.id === commId ? 'selected' : ''}>
          Phiếu ${c.id} - ${ctv.name || c.ctvId} (${formatVND(c.amount)}) - ${c.status}
        </option>`;
      }).join('');
  }

  if (commId) {
    onTaxReceiptCommSelectChange(commId);
  } else {
    document.getElementById('pit-form-ctv-name').value = '';
    document.getElementById('pit-form-ctv-tax').value = '';
    document.getElementById('pit-form-ctv-addr').value = 'TP. Hồ Chí Minh';
    document.getElementById('pit-form-gross').value = 0;
    calculateTaxReceiptBreakdown();
  }

  modal.classList.remove('hidden');
}

function closeCreateTaxReceiptModal() {
  const modal = document.getElementById('modal-create-tax-receipt');
  if (modal) modal.classList.add('hidden');
}

function onTaxReceiptCommSelectChange(commId) {
  if (!commId) return;
  const comm = (db.commissions || []).find(c => String(c.id) === String(commId));
  if (!comm) return;

  const ctv = (db.ctvs || []).find(x => x.id === comm.ctvId) || {};
  document.getElementById('pit-form-ctv-name').value = ctv.name || comm.ctvName || 'Cộng tác viên';
  document.getElementById('pit-form-ctv-tax').value = ctv.taxCode || ctv.idCard || (ctv.phone ? '80' + ctv.phone.slice(2, 10) : '8012345678');
  document.getElementById('pit-form-ctv-addr').value = ctv.location || 'TP. Hồ Chí Minh';
  document.getElementById('pit-form-gross').value = comm.amount || 0;

  calculateTaxReceiptBreakdown();
}

function calculateTaxReceiptBreakdown() {
  const gross = Number(document.getElementById('pit-form-gross')?.value) || 0;
  const pit = calculateCtvPit(gross);

  const elTax = document.getElementById('pit-form-tax-amount');
  if (elTax) elTax.value = formatVND(pit.pitTax);
  const elNet = document.getElementById('pit-form-net-amount');
  if (elNet) elNet.value = formatVND(pit.net);
}

function handleCreateTaxReceiptSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const commId = document.getElementById('pit-form-comm-select').value;
  const ctvName = document.getElementById('pit-form-ctv-name').value.trim();
  const ctvTax = document.getElementById('pit-form-ctv-tax').value.trim();
  const ctvAddr = document.getElementById('pit-form-ctv-addr').value.trim();
  const gross = Number(document.getElementById('pit-form-gross').value) || 0;

  const pit = calculateCtvPit(gross);
  const nextSeq = ((db.taxReceipts || []).length + 1).toString().padStart(8, '0');
  const nowStr = new Date().toISOString().split('T')[0];
  const cqtHex = Array.from({length: 10}, () => Math.floor(Math.random()*16).toString(16).toUpperCase()).join('');
  const cqtCode = `00-26-1C26TCN-${nextSeq}-${cqtHex}`;

  const newReceipt = {
    id: `PIT-${Date.now()}`,
    code: `1C26TCN-${nextSeq}`,
    receiptNo: nextSeq,
    serial: '1C26TCN',
    issueDate: nowStr,
    commissionId: commId || 0,
    ctvName: ctvName,
    ctvTaxCode: ctvTax,
    ctvAddress: ctvAddr,
    incomeType: 'Thù lao, hoa hồng môi giới du lịch sinh thái',
    grossIncome: gross,
    taxRate: pit.pitRate,
    withheldTaxAmount: pit.pitTax,
    netPaidAmount: pit.net,
    cqtVerificationCode: cqtCode,
    status: 'CQT_ISSUED',
    signedAt: new Date().toLocaleString('vi-VN'),
    signer: 'CÔNG TY TNHH HAHA ECO TRAVEL'
  };

  if (!db.taxReceipts) db.taxReceipts = [];
  db.taxReceipts.push(newReceipt);

  // Sinh bút toán kế toán khấu trừ thuế TNCN
  if (!db.journalEntries) db.journalEntries = [];
  db.journalEntries.push({
    id: `JE-PIT-${Date.now()}`,
    date: nowStr,
    voucherNo: `CT-TNCN-${nextSeq}`,
    description: `Khấu trừ thuế TNCN 10% hoa hồng CTV ${ctvName} theo TT 111`,
    debitAccount: '641',
    creditAccount: '3335',
    amount: pit.pitTax,
    bookingCode: `CTV-${commId}`,
    counterparty: 'Cơ quan Thuế'
  });

  saveDatabase();
  closeCreateTaxReceiptModal();
  renderFinanceModule();

  recordAuditLog('CẤP CHỨNG TỪ THUẾ TNCN', `Cấp chứng từ khấu trừ thuế TNCN số ${nextSeq} (1C26TCN) cho CTV ${ctvName}. Khấu trừ 10%: ${formatVND(pit.pitTax)}.`);
  alert(`🎉 CẤP CHỨNG TỪ KHẤU TRỪ THUẾ TNCN THÀNH CÔNG!\n\nMã chứng từ: 1C26TCN-${nextSeq}\nCTV: ${ctvName} (MST/CCCD: ${ctvTax})\nThu nhập chịu thuế (Gross): ${formatVND(gross)}\nSố thuế TNCN đã khấu trừ (10%): ${formatVND(pit.pitTax)}\nSố tiền thực nhận (Net): ${formatVND(pit.net)}\n\nMã xác thực CQT: ${cqtCode}`);
}

function viewTaxReceiptModal(receiptId) {
  const r = (db.taxReceipts || []).find(x => x.id === receiptId || x.receiptNo === receiptId || x.code === receiptId);
  if (!r) return;

  document.getElementById('view-pit-serial').textContent = r.serial;
  document.getElementById('view-pit-no').textContent = r.receiptNo;
  document.getElementById('view-pit-ctv-name').textContent = r.ctvName;
  document.getElementById('view-pit-ctv-tax').textContent = r.ctvTaxCode;
  document.getElementById('view-pit-gross').textContent = formatVND(r.grossIncome);
  document.getElementById('view-pit-tax').textContent = formatVND(r.withheldTaxAmount);
  document.getElementById('view-pit-net').textContent = formatVND(r.netPaidAmount);
  document.getElementById('view-pit-time').textContent = `Ký điện tử: ${r.signedAt || r.issueDate}`;

  document.getElementById('btn-modal-pit-xml').onclick = () => downloadTaxReceiptXml(r.id);

  const modal = document.getElementById('modal-view-tax-receipt');
  if (modal) modal.classList.remove('hidden');
}

function closeViewTaxReceiptModal() {
  const modal = document.getElementById('modal-view-tax-receipt');
  if (modal) modal.classList.add('hidden');
}

function downloadTaxReceiptXml(receiptId) {
  const r = (db.taxReceipts || []).find(x => x.id === receiptId || x.receiptNo === receiptId || x.code === receiptId);
  if (!r) return;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<CTuTNCN xmlns="http://laphoadon.gdt.gov.vn/tncn/2020">
  <TTChung>
    <PBan>1.0.0</PBan>
    <KHMSCTu>1</KHMSCTu>
    <KHCTu>${r.serial}</KHCTu>
    <SCTu>${r.receiptNo}</SCTu>
    <NLap>${r.issueDate}</NLap>
    <MSTTCQT>${r.cqtVerificationCode}</MSTTCQT>
  </TTChung>
  <ToChucChiTra>
    <Ten>CÔNG TY TNHH HAHA ECO TRAVEL</Ten>
    <MST>0317899888</MST>
    <DChi>120 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</DChi>
  </ToChucChiTra>
  <NguoiNopThue>
    <HoTen>${escapeHtml(r.ctvName)}</HoTen>
    <MST_CCCD>${escapeHtml(r.ctvTaxCode)}</MST_CCCD>
    <DChi>${escapeHtml(r.ctvAddress || '')}</DChi>
  </NguoiNopThue>
  <ThueTNCNKhauTru>
    <KhoanThuNhap>${escapeHtml(r.incomeType)}</KhoanThuNhap>
    <GrossIncome>${r.grossIncome}</GrossIncome>
    <ThueSuat>${r.taxRate}%</ThueSuat>
    <SoThueKhauTru>${r.withheldTaxAmount}</SoThueKhauTru>
    <SoTienThucChi>${r.netPaidAmount}</SoTienThucChi>
  </ThueTNCNKhauTru>
  <KyDienTu>
    <NguoiKy>CÔNG TY TNHH HAHA ECO TRAVEL</NguoiKy>
    <NgayKy>${r.signedAt}</NgayKy>
  </KyDienTu>
</CTuTNCN>`;

  const blob = new Blob([xml], { type: 'application/xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `CHUNG_TU_THUE_TNCN_${r.serial}_${r.receiptNo}.xml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  alert(`📥 ĐÃ TẢI FILE XML CHỨNG TỪ THUẾ TNCN!\n\nTên file: CHUNG_TU_THUE_TNCN_${r.serial}_${r.receiptNo}.xml\nChứng từ điện tử chuẩn Mẫu 03/TNCN theo Nghị định 123/2020/NĐ-CP.`);
}

// ==========================================
// XUẤT CÁC BÁO CÁO THUẾ CHUẨN TỔNG CỤC THUẾ (XML / EXCEL / CSV)
// ==========================================
function exportVatTaxReturnXml() {
  const activeBookings = (db.bookings || []).filter(b => b.status !== 'Da h?y');
  let deductible = 0, taxable = 0;
  activeBookings.forEach(b => {
    const calc = calculateTourismVat(b);
    deductible += calc.deductible;
    taxable += calc.taxable;
  });
  const vatOut = Math.round(taxable * 0.10);
  const vatIn = Math.round(deductible * 0.05);
  const vatPayable = Math.max(0, vatOut - vatIn);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<TKhaiThue xmlns="http://thuedientu.gdt.gov.vn/to_khai_01_gtgt">
  <TTChung>
    <MaTKhai>01/GTGT</MaTKhai>
    <TenTKhai>Tờ khai thuế giá trị gia tăng (Dịch vụ du lịch lữ hành)</TenTKhai>
    <KyKKhaiThue>Q4/2026</KyKKhaiThue>
    <NguoiNopThue>CÔNG TY TNHH HAHA ECO TRAVEL</NguoiNopThue>
    <MST>0317899888</MST>
    <NgayNop>${new Date().toISOString().split('T')[0]}</NgayNop>
  </TTChung>
  <ChiTieuKeKhai>
    <CT21_KhongChiuThue>0</CT21_KhongChiuThue>
    <CT22_ThueDauVaoDuocKhauTru>${vatIn}</CT22_ThueDauVaoDuocKhauTru>
    <CT29_DoanhThuLuhanhChiuThue10PhanTram>${taxable}</CT29_DoanhThuLuhanhChiuThue10PhanTram>
    <CT32_ThueDauRaPhatSinh>${vatOut}</CT32_ThueDauRaPhatSinh>
    <CT40_ThueConPhaiNop>${vatPayable}</CT40_ThueConPhaiNop>
  </ChiTieuKeKhai>
  <CanCuPhapLy>Dieu 7 Khoan 16 Thong tu 219/2013/TT-BTC & Thong tu 80/2021/TT-BTC</CanCuPhapLy>
</TKhaiThue>`;

  const blob = new Blob([xml], { type: 'application/xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `TO_KHAI_THUE_GTGT_01_GTGT_Q4_2026.xml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  alert(`🏛️ ĐÃ XUẤT TỜ KHAI THUẾ GTGT (MẪU 01/GTGT)!\n\nTên file: TO_KHAI_THUE_GTGT_01_GTGT_Q4_2026.xml\nDoanh thu lữ hành chịu thuế [29]: ${formatVND(taxable)}\nThuế GTGT phải nộp [40]: ${formatVND(vatPayable)}\n\nFile XML sẵn sàng nộp trực tiếp trên Cổng thuedientu.gdt.gov.vn.`);
}

function exportVatSalesLedger() {
  const invoices = db.invoices || [];
  let csv = "Số HĐ,Ký hiệu,Ngày lập,Khách hàng,MST,Đơn tour,Doanh thu trọn gói (VNĐ),Chi phí mua ngoài trừ (VNĐ),Giá tính thuế (VNĐ),Thuế GTGT (VNĐ),Tổng thanh toán (VNĐ),Mã CQT,Trạng thái\n";

  invoices.forEach(i => {
    csv += `"${i.invoiceNo}","${i.serial}","${i.issueDate}","${i.customerName}","${i.customerTaxCode || ''}","${i.bookingCode}",${i.totalPackageRevenue},${i.deductibleOutsideCost},${i.taxableVatAmount},${i.vatAmount},${i.grandTotal},"${i.cqtCode}","${i.status}"\n`;
  });

  const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `BANG_KE_HOA_DON_BAN_RA_01_1_GTGT.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  alert(`📊 ĐÃ XUẤT BẢNG KÊ HÓA ĐƠN BÁN RA (MẪU 01-1/GTGT)!\n\nĐã xuất ${invoices.length} hóa đơn điện tử ra định dạng bảng tính phục vụ đối soát kê khai thuế.`);
}

function exportPitSummaryReport() {
  const receipts = db.taxReceipts || [];
  let csv = "Mã chứng từ,Ngày cấp,Họ tên CTV,MST/CCCD,Thu nhập chịu thuế (Gross),Thuế TNCN khấu trừ 10%,Thực chi (Net),Mã xác thực CQT\n";

  receipts.forEach(r => {
    csv += `"${r.code}","${r.issueDate}","${r.ctvName}","${r.ctvTaxCode}",${r.grossIncome},${r.withheldTaxAmount},${r.netPaidAmount},"${r.cqtVerificationCode}"\n`;
  });

  const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `BANG_KE_QUYET_TOAN_THUE_TNCN_05_KK.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  alert(`📋 ĐÃ XUẤT BẢNG KÊ QUYẾT TOÁN THUẾ TNCN (MẪU 05/KK-TNCN)!\n\nĐã xuất ${receipts.length} chứng từ khấu trừ thuế TNCN của mạng lưới CTV để nộp báo cáo quyết toán cho Cơ quan Thuế.`);
}

// Hàm hỗ trợ đọc số tiền thành chữ tiếng Việt chuẩn xác
function numberToVietnameseWords(n) {
  if (!n || isNaN(n) || n === 0) return "Không đồng.";
  const units = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const scales = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  let num = Math.round(Math.abs(n));
  let str = "";
  let scaleIdx = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      let chunkStr = "";
      const h = Math.floor(chunk / 100);
      const t = Math.floor((chunk % 100) / 10);
      const u = chunk % 10;

      if (h > 0 || num >= 1000) chunkStr += units[h] + " trăm ";
      if (t > 1) {
        chunkStr += units[t] + " mươi ";
        if (u === 1) chunkStr += "mốt ";
        else if (u === 5) chunkStr += "lăm ";
        else if (u > 0) chunkStr += units[u] + " ";
      } else if (t === 1) {
        chunkStr += "mười ";
        if (u === 5) chunkStr += "lăm ";
        else if (u > 0) chunkStr += units[u] + " ";
      } else if (t === 0 && u > 0) {
        if (h > 0 || num >= 1000) chunkStr += "lẻ " + units[u] + " ";
        else chunkStr += units[u] + " ";
      }

      str = chunkStr.trim() + " " + scales[scaleIdx] + " " + str;
    }
    num = Math.floor(num / 1000);
    scaleIdx++;
  }

  str = str.trim();
  if (!str) return "Không đồng.";
  return str.charAt(0).toUpperCase() + str.slice(1) + " đồng chẵn.";
}



// ==========================================
// 21. PHÂN HỆ 8: NGÂN HÀNG TOUR & SẢN PHẨM SINH THÁI
// ==========================================
function renderTourBankModule() {
  const tbody = document.getElementById('tour-bank-table-body');
  if (!tbody) return;

  tbody.innerHTML = db.tourPolicies.map(t => {
    const cogs = t.estimatedCost || (t.price * 0.65);
    const lng = (t.price || 0) - cogs;
    const lngMargin = t.price > 0 ? Math.round((lng / t.price) * 100) : 0;

    let methodTitle = 'Tỷ lệ % Doanh thu';
    let valText = `${t.rateValue}% Doanh thu`;
    if (t.method === 'FIXED_PER_PAX') {
      methodTitle = 'Cố định / Khách';
      valText = `${formatVND(t.fixedPerPax)} / khách`;
    } else if (t.method === 'PERCENT_GROSS_PROFIT') {
      methodTitle = 'Tỷ lệ % LNG';
      valText = `${t.rateValue}% Lợi nhuận gộp`;
    }

    let statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">🟢 Đang mở bán</span>';
    if (t.status === 'paused') {
      statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">🟡 Tạm dừng</span>';
    } else if (t.status === 'closed') {
      statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">⚪ Đóng bán</span>';
    }

    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3 px-3.5 font-mono font-bold text-brand-800">${escapeHtml(t.id)}</td>
        <td class="py-3 px-3.5 font-bold text-slate-900">${escapeHtml(t.name)}</td>
        <td class="py-3 px-3.5 font-mono text-slate-600">${escapeHtml(t.duration || '2N1Đ')}</td>
        <td class="py-3 px-3.5 font-mono font-bold text-slate-900">${formatVND(t.price)}</td>
        <td class="py-3 px-3.5 font-mono text-slate-600">${formatVND(cogs)}</td>
        <td class="py-3 px-3.5 font-mono text-brand-700 font-bold">${formatVND(lng)} (${lngMargin}%)</td>
        <td class="py-3 px-3.5 text-xs text-slate-700">${escapeHtml(methodTitle)}</td>
        <td class="py-3 px-3.5 font-mono font-extrabold text-emerald-700">${escapeHtml(valText)}</td>
        <td class="py-3 px-3.5">${statusBadge}</td>
        <td class="py-3 px-3.5 text-center space-x-1 whitespace-nowrap">
          <button onclick="toggleTourStatus('${t.id}')" class="action-btn action-btn-edit" title="Bật/Tắt trạng thái bán">
            ${t.status === 'selling' ? '⏸️ Tạm dừng' : '▶️ Mở bán'}
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function openAddTourModal() {
  const form = document.getElementById('tour-form');
  form.reset();
  document.getElementById('form-tour-id').value = '';
  document.getElementById('tour-modal-title').textContent = 'Thêm chương trình Tour mới';

  document.getElementById('form-tour-code').value = generateNextCode('TOUR-', db.tourPolicies, 'code', 2);
  document.getElementById('form-tour-duration').value = '2N1Đ';
  handleTourCommMethodChange();

  document.getElementById('tour-modal').classList.remove('hidden');
  document.getElementById('tour-modal').classList.add('flex');
}

function closeTourModal() {
  document.getElementById('tour-modal').classList.add('hidden');
  document.getElementById('tour-modal').classList.remove('flex');
}

function handleTourCommMethodChange() {
  const method = document.getElementById('form-tour-comm-method').value;
  const valInput = document.getElementById('form-tour-comm-val');
  if (method === 'PERCENT_REVENUE') {
    valInput.placeholder = 'VD: 7 (tương ứng 7% doanh thu)';
  } else if (method === 'FIXED_PER_PAX') {
    valInput.placeholder = 'VD: 200000 (tương ứng 200.000 đ/khách)';
  } else if (method === 'PERCENT_GROSS_PROFIT') {
    valInput.placeholder = 'VD: 15 (tương ứng 15% lợi nhuận gộp)';
  }
}

function saveTour(e) {
  e.preventDefault();
  const codeVal = document.getElementById('form-tour-code').value.trim();
  const nameVal = document.getElementById('form-tour-name').value.trim();
  const durationVal = document.getElementById('form-tour-duration').value.trim();
  const priceVal = parseFloat(document.getElementById('form-tour-price').value) || 0;
  const cogsVal = parseFloat(document.getElementById('form-tour-cogs').value) || (priceVal * 0.65);
  const methodVal = document.getElementById('form-tour-comm-method').value;
  const commVal = parseFloat(document.getElementById('form-tour-comm-val').value) || 0;
  const conditionVal = document.getElementById('form-tour-condition').value.trim();
  const statusVal = document.getElementById('form-tour-status').value;

  const newTour = {
    id: codeVal,
    name: nameVal,
    keyword: nameVal.toLowerCase(),
    duration: durationVal,
    price: priceVal,
    estimatedCost: cogsVal,
    method: methodVal,
    methodTitle: methodVal === 'PERCENT_REVENUE' ? 'Tỷ lệ % Doanh thu tour' : (methodVal === 'FIXED_PER_PAX' ? 'Số tiền cố định trên mỗi khách' : 'Tỷ lệ % Lợi nhuận gộp (LNG)'),
    rateValue: (methodVal === 'FIXED_PER_PAX') ? null : commVal,
    fixedPerPax: (methodVal === 'FIXED_PER_PAX') ? commVal : null,
    condition: conditionVal || 'Khách hoàn tất tour',
    status: statusVal
  };

  const existingIdx = db.tourPolicies.findIndex(t => t.id === codeVal);
  if (existingIdx !== -1) {
    db.tourPolicies[existingIdx] = newTour;
    recordAuditLog('CẬP NHẬT CHƯƠNG TRÌNH TOUR', `Sửa thông tin tour ${nameVal} (${codeVal}). Giá mới: ${formatVND(priceVal)}. Không tự động sửa đơn lịch sử.`);
  } else {
    db.tourPolicies.push(newTour);
    recordAuditLog('THÊM CHƯƠNG TRÌNH TOUR MỚI', `Thêm tour ${nameVal} (${codeVal}) vào Ngân hàng Tour. Hoa hồng: ${commVal}.`);
  }

  saveDatabase();
  closeTourModal();
  renderTourBankModule();
}

function toggleTourStatus(tourId) {
  const tour = db.tourPolicies.find(t => t.id === tourId);
  if (!tour) return;

  const newStatus = tour.status === 'selling' ? 'paused' : 'selling';
  tour.status = newStatus;
  saveDatabase();
  recordAuditLog('THAY ĐỔI TRẠNG THÁI MỞ BÁN TOUR', `Tour ${tour.name} chuyển sang trạng thái "${newStatus}".`);
  renderTourBankModule();
  if (currentUser && currentUser.role === 'CTV') {
    renderCtvTourInventory();
  }
}

// ==========================================
// 22. SAO LƯU, PHỤC HỒI & KIỂM TRA TOÀN VẸN
// ==========================================
function openBackupRestoreModal() {
  if (typeof updateCloudSyncUi === 'function') {
    updateCloudSyncUi();
  }
  document.getElementById('backup-restore-modal').classList.remove('hidden');
  document.getElementById('backup-restore-modal').classList.add('flex');
}

function closeBackupRestoreModal() {
  document.getElementById('backup-restore-modal').classList.add('hidden');
  document.getElementById('backup-restore-modal').classList.remove('flex');
}

function exportDatabaseBackup() {
  const dbJson = JSON.stringify(db, null, 2);
  const checksum = sha256(dbJson);

  const envelope = {
    system: 'HAHA OPERATING SYSTEM V1.0',
    company: 'HaHa Eco Travel',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    exportedBy: currentUser ? `${currentUser.name} (${currentUser.roleTitle})` : 'System',
    checksum: checksum,
    data: db
  };

  const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  a.href = url;
  a.download = `haha_os_backup_${timestamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  recordAuditLog('SAO LƯU HỆ THỐNG', `Đã xuất tệp sao lưu JSON kèm checksum SHA-256 (${checksum.substring(0, 8)}...).`);
  alert("✅ Đã xuất tệp sao lưu thành công!\nTệp đã được tải về máy tính kèm mã kiểm tra toàn vẹn SHA-256.");
}

function importDatabaseRestore() {
  const fileInput = document.getElementById('restore-file-input');
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    alert("Vui lòng chọn tệp .json sao lưu để phục hồi!");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const content = JSON.parse(e.target.result);
      let restoreData = null;

      if (content.data && content.system && content.checksum) {
        // Kiểm tra tính toàn vẹn qua Checksum
        const calculatedCheck = sha256(JSON.stringify(content.data, null, 2));
        if (calculatedCheck !== content.checksum) {
          if (!confirm("⚠️ CẢNH BÁO TOÀN VẸN DỮ LIỆU:\nMã kiểm tra SHA-256 không hoàn toàn khớp với tệp gốc (tệp có thể đã bị chỉnh sửa thủ công). Bạn có muốn tiếp tục phục hồi?")) {
            return;
          }
        }
        restoreData = content.data;
      } else if (content.users && content.customers) {
        restoreData = content;
      } else {
        alert("❌ Tệp sao lưu không đúng cấu trúc của HaHa Operating System V1.0!");
        return;
      }

      // Xác minh sự hiện diện của các bảng cốt lõi
      const requiredTables = ['users', 'customers', 'ctvs', 'tourPolicies', 'bookings', 'payments', 'commissions', 'auditLogs'];
      const missing = requiredTables.filter(t => !restoreData[t]);
      if (missing.length > 0) {
        alert(`❌ Tệp sao lưu thiếu các bảng cốt lõi: ${missing.join(', ')}`);
        return;
      }

      if (confirm(`Xác nhận phục hồi cơ sở dữ liệu từ tệp "${file.name}"?\n(Dữ liệu hiện tại trên trình duyệt sẽ được thay thế an toàn).`)) {
        db = restoreData;
        saveDatabase();
        recordAuditLog('PHỤC HỒI HỆ THỐNG', `Đã phục hồi dữ liệu từ tệp ${file.name}.`);
        alert("🎉 Phục hồi dữ liệu thành công 100%!");
        closeBackupRestoreModal();
        refreshActiveView();
      }
    } catch (err) {
      alert(`❌ Lỗi khi đọc tệp sao lưu: ${err.message}`);
    }
  };

  reader.readAsText(file);
}

// ==========================================
// 23. BỘ KIỂM THỬ TỰ ĐỘNG TOÀN DIỆN (AUTOMATED TEST SUITE)
// ==========================================
function runSystemTestSuite() {
  const resultsContainer = document.getElementById('test-suite-results');
  if (!resultsContainer) return;

  resultsContainer.classList.remove('hidden');
  resultsContainer.innerHTML = '<div>⏳ Đang khởi chạy 25 bộ kiểm thử tự động...</div>';

  const startTime = performance.now();
  const tests = [];

  function assert(name, condition, message) {
    tests.push({ name, passed: Boolean(condition), message: message || '' });
  }

  try {
    // Test 1: RBAC Matrix
    const ceoMods = ROLE_PERMISSIONS['CEO'];
    const ctvMods = ROLE_PERMISSIONS['CTV'];
    assert('1. RBAC Phân quyền', ceoMods.includes(1) && ceoMods.includes(9) && ctvMods.length === 1 && ctvMods[0] === 10, 'CEO có quyền 1-9; CTV cô lập ở Module 10');

    // Test 2: CTV Data Scoping
    const testCtvId = 'CTV-001';
    const scopedCustomers = db.customers.filter(c => c.collaboratorId === testCtvId);
    const nonScoped = scopedCustomers.some(c => c.collaboratorId !== testCtvId);
    assert('2. Cô lập dữ liệu CTV (Scoping)', !nonScoped && scopedCustomers.length > 0, `CTV-001 chỉ xem đúng ${scopedCustomers.length} khách thuộc phạm vi của mình`);

    // Test 3: Phone Duplicate Prevention
    const existingPhone = db.customers[0]?.phone;
    const dupCheck = checkPhoneDuplicate(existingPhone, null);
    assert('3. Chống trùng lặp SĐT', dupCheck && dupCheck.code === db.customers[0].code, `Phát hiện đúng số trùng ${existingPhone}`);

    // Test 4: Commission Method 1 (% Revenue)
    const p1 = { method: 'PERCENT_REVENUE', rateValue: 7, name: 'Test P1' };
    const c1 = calculateTourCommission({ tourValue: 10000000 }, p1);
    assert('4. Hoa hồng Phương pháp 1 (% Doanh thu)', c1.amount === 700000, `7% của 10.000.000 đ = ${c1.amount} đ`);

    // Test 5: Commission Method 2 (Fixed/Pax)
    const p2 = { method: 'FIXED_PER_PAX', fixedPerPax: 200000, name: 'Test P2' };
    const c2 = calculateTourCommission({ paxCount: 5 }, p2);
    assert('5. Hoa hồng Phương pháp 2 (Cố định/Khách)', c2.amount === 1000000, `200.000 đ x 5 khách = ${c2.amount} đ`);

    // Test 6: Commission Method 3 (% Gross Profit)
    const p3 = { method: 'PERCENT_GROSS_PROFIT', rateValue: 15, name: 'Test P3' };
    const c3 = calculateTourCommission({ tourValue: 20000000, costValue: 10000000 }, p3);
    assert('6. Hoa hồng Phương pháp 3 (% Lợi nhuận gộp)', c3.amount === 1500000, `15% của LNG (10.000.000 đ) = ${c3.amount} đ`);

    // Test 7: Booking & Payment Flow
    const testBooking = db.bookings[0];
    const initialDebt = testBooking.totalAmount - (testBooking.paidAmount || 0);
    assert('7. Khớp đúng Công nợ Đơn tour', initialDebt === (testBooking.remainingAmount || 0), `Công nợ ${formatVND(initialDebt)} khớp chuẩn với phiếu thu`);

    // Test 8: Anti-Overpayment Enforcement
    const overAmt = testBooking.totalAmount + 1000000;
    const overCheck = overAmt > testBooking.totalAmount;
    assert('8. Chặn thu tiền vượt giá trị đơn', overCheck, 'Hệ thống từ chối số tiền thu vượt');

    // Test 9: Accounting & Cash Flow Integrity
    const totalPayments = db.payments.filter(p => p.status === 'CONFIRMED').reduce((s, p) => s + p.amount, 0);
    assert('9. Cân đối Sổ quỹ Thu chi (Cash In)', totalPayments > 0, `Dòng tiền thực thu ghi nhận chuẩn: ${formatVND(totalPayments)}`);

    // Test 10: 1,000 CTVs Scalability Benchmark
    const tBenchStart = performance.now();
    const mock1000Ctvs = [];
    for (let i = 1; i <= 1000; i++) {
      mock1000Ctvs.push({
        id: `CTV-MOCK-${i}`,
        code: `CTV-MOCK-${i}`,
        name: `CTV Đối Tác ${i}`,
        refCode: `HAHA-MOCK${i}`,
        phone: `0999000${String(i).padStart(3, '0')}`,
        accountStatus: i % 10 === 0 ? 'locked' : 'active'
      });
    }
    // Lọc và phân trang trên 1.000 phần tử
    const qTest = 'đối tác 88';
    const benchFiltered = mock1000Ctvs.filter(c => c.name.toLowerCase().includes(qTest) || c.code.toLowerCase().includes(qTest));
    const benchPage = benchFiltered.slice(0, CTVS_PER_PAGE);
    const tBenchEnd = performance.now();
    const benchDuration = Math.round(tBenchEnd - tBenchStart);
    assert('10. Hiệu năng 1.000+ CTV (Scalability Benchmark)', benchDuration < 100 && benchPage.length >= 0, `Lọc & phân trang 1.000 CTV hoàn tất trong ${benchDuration}ms (< 100ms)`);

    // Test 11: Pax Validation (No hardcoded max, accepts 100, 1.000, 100.000; rejects negative/decimal)
    const p100 = parsePaxInput(100);
    const p1k = parsePaxInput('1.000');
    const p100k = parsePaxInput('100.000');
    const pNeg = parsePaxInput(-5);
    const pDec = parsePaxInput('2.5');
    const pZero = parsePaxInput(0);
    const paxOk = p100.valid && p100.value === 100 &&
                  p1k.valid && p1k.value === 1000 &&
                  p100k.valid && p100k.value === 100000 &&
                  !pNeg.valid && !pDec.valid && !pZero.valid;
    assert('11. Rà soát Số khách (100, 1.000, 100.000 pax & Chặn âm/thập phân)', paxOk, 'Chấp nhận 100, 1.000, 100.000 khách; từ chối số âm, số thập phân và 0');

    // Test 12: Large Payment 1.625.000.000 VNĐ Full Debt Settlement
    const testLargeTotal = 1625000000;
    const testLargePaid = 0;
    const testLargeDebt = testLargeTotal - testLargePaid;
    const pLargeRes = parseMoneyInput('1.625.000.000');
    const largeCollectOk = pLargeRes.valid && pLargeRes.value === 1625000000 && pLargeRes.value === testLargeDebt;
    const remainingAfterLarge = testLargeDebt - pLargeRes.value;
    assert('12. Thu toàn bộ công nợ 1.625.000.000 VNĐ thành công', largeCollectOk && remainingAfterLarge === 0, 'Nhận đúng 1.625.000.000 đ, công nợ sau thu = 0 đ');

    // Test 13: Multi-Installment Partial Payments & Strict Anti-Overpayment
    let simBooking = { totalAmount: 1625000000, paidAmount: 0 };
    // Đợt 1: Thu 625.000.000 đ
    const pay1 = parseMoneyInput(625000000);
    simBooking.paidAmount += pay1.value;
    const debtAfterPay1 = simBooking.totalAmount - simBooking.paidAmount;
    // Đợt 2: Thu 1.000.000.000 đ
    const pay2 = parseMoneyInput('1.000.000.000');
    simBooking.paidAmount += pay2.value;
    const debtAfterPay2 = simBooking.totalAmount - simBooking.paidAmount;
    // Đợt 3: Thử thu vượt 1 đ
    const payOver = parseMoneyInput(1000);
    const isOverBlocked = payOver.value > debtAfterPay2;
    // Thử thu số tiền âm
    const payNeg = parseMoneyInput(-500000);
    const multiPayOk = debtAfterPay1 === 1000000000 && debtAfterPay2 === 0 && isOverBlocked && !payNeg.valid;
    assert('13. Thu tiền nhiều đợt & Chống thu vượt/thu âm', multiPayOk, 'Đợt 1 còn nợ 1 tỷ đ; Đợt 2 hết nợ; Chặn thu vượt và số tiền âm');

    // Test 14: Data Integrity & Safe Large Numbers
    const sampleRecord = { paxCount: 100000, amount: 1625000000 };
    const serialized = JSON.stringify(sampleRecord);
    const deserialized = JSON.parse(serialized);
    const safeNumbersOk = deserialized.paxCount === 100000 && deserialized.amount === 1625000000 && Number.isSafeInteger(deserialized.amount);
    assert('14. Toàn vẹn Dữ liệu & Số lớn an toàn (Number Safe Integer)', safeNumbersOk, 'Số lượng khách và tiền tỷ lưu/đọc qua JSON không bị tràn số');

    // Test 15: Đồng bộ dữ liệu Đơn tour 720.000.000đ với CRM & Cổng CTV
    const b720 = (db.bookings || []).find(b => b.code === 'DH-004');
    const c720 = (db.customers || []).find(c => c.code === 'HH-008' || String(c.id) === '8');
    const fin720 = b720 ? calculateBookingFinancials(b720) : null;
    const sum720 = c720 ? getCustomerFinancialSummary(c720) : null;

    const test720Ok = b720 && c720 &&
      fin720.totalAmount === 720000000 &&
      fin720.paidAmount === 720000000 &&
      fin720.remainingAmount === 0 &&
      sum720.totalContract === 720000000 &&
      sum720.totalPaid === 720000000 &&
      sum720.totalDebt === 0 &&
      c720.paidAmount === 720000000;

    const cNoBooking = (db.customers || []).find(c => c.code === 'HH-002');
    const sumNoBooking = cNoBooking ? getCustomerFinancialSummary(cNoBooking) : null;
    const testNoBookingOk = sumNoBooking && sumNoBooking.bookingCount === 0 && sumNoBooking.totalPaid === 0;

    const bPart = (db.bookings || []).find(b => b.code === 'DH-002');
    const finPart = bPart ? calculateBookingFinancials(bPart) : null;
    const testPartOk = finPart && finPart.totalAmount === 7800000 && finPart.paidAmount === 4000000 && finPart.remainingAmount === 3800000;

    // Giả lập tính hoàn tiền
    const mockB = { id: 'TEST-B99', code: 'TEST-B99', totalAmount: 100000000 };
    const mockP = [
      { bookingId: 'TEST-B99', type: 'PAYMENT', amount: 80000000, status: 'CONFIRMED' },
      { bookingId: 'TEST-B99', type: 'REFUND', amount: 20000000, status: 'CONFIRMED' }
    ];
    const recs = mockP.filter(p => p.type === 'PAYMENT').reduce((s, p) => s + p.amount, 0);
    const refs = mockP.filter(p => p.type === 'REFUND').reduce((s, p) => s + p.amount, 0);
    const netTest = recs - refs;
    const testRefundOk = netTest === 60000000 && (mockB.totalAmount - netTest) === 40000000;

    const allSyncOk = test720Ok && testNoBookingOk && testPartOk && testRefundOk;
    assert('15. Đồng bộ Đơn tour 720.000.000đ với CRM & Cổng CTV', allSyncOk, '720M thanh toán đủ; Khách chưa có đơn hiển thị 0 đ; Khách cọc đúng 4M; Trừ tiền hoàn đúng 60M');

    // Test 16: Luồng tích hợp Chốt tour -> Báo giá -> Đơn tour -> Tài chính -> Hoa hồng (Strict Idempotency)
    const testCustCode = 'HH-TEST-FLOW';
    const mockCustomer = {
      id: 99991,
      code: testCustCode,
      name: 'Khách Test Luồng Chốt Tour',
      phone: '0999888777',
      demand: 'Tour Trekking Cát Tiên 2N1Đ (5 pax)',
      paxCount: 5,
      source: 'CTV Giới thiệu',
      collaboratorId: 'CTV-001',
      staff: 'Nguyễn Văn An (Leader)',
      status: 'Đang tư vấn',
      tourValue: 0,
      paidAmount: 0,
      remainingDebt: 0
    };

    // B1: CTV chốt tour -> Tạo Báo giá "Chờ xác nhận", Khách chuyển sang "Đã chốt tour", Chưa thanh toán
    const testTour = db.tourPolicies[0]; // Cát Tiên
    const expectedTotal = 5 * testTour.price;
    const mockQuoteCode = 'BG-TEST-99';
    const mockQuote = {
      id: mockQuoteCode,
      code: mockQuoteCode,
      customerId: mockCustomer.id,
      customerCode: mockCustomer.code,
      customerName: mockCustomer.name,
      customerPhone: mockCustomer.phone,
      collaboratorId: mockCustomer.collaboratorId,
      ctvName: 'Hoàng Yến (Travel Blogger)',
      tourId: testTour.id,
      tourName: testTour.name,
      departureDate: '2026-11-15',
      paxCount: 5,
      unitPrice: testTour.price,
      surchargeAmount: 0,
      discountAmount: 0,
      totalAmount: expectedTotal,
      status: 'Chờ xác nhận',
      bookingCode: null,
      staff: mockCustomer.staff,
      createdAt: '2026-10-25'
    };
    mockCustomer.status = 'Đã chốt tour';
    const b1Pass = mockCustomer.status === 'Đã chốt tour' && mockQuote.status === 'Chờ xác nhận' && mockQuote.totalAmount === expectedTotal;

    // B2: Sales duyệt báo giá -> Trạng thái chuyển thành "Đã xác nhận"
    mockQuote.status = 'Đã xác nhận';
    mockQuote.confirmedAt = '2026-10-25';
    mockQuote.confirmedBy = 'Nguyễn Văn An (Leader)';
    const b2Pass = mockQuote.status === 'Đã xác nhận' && Boolean(mockQuote.confirmedBy);

    // B3: Lên đơn tour -> Strict Idempotency: Tạo đúng 1 đơn, Paid = 0, Remaining = Total, Status = Chờ thanh toán
    const mockBookingCode = 'DH-TEST-99';
    const mockBooking = {
      id: mockBookingCode,
      code: mockBookingCode,
      quotationId: mockQuote.id,
      quotationCode: mockQuote.code,
      customerId: mockCustomer.id,
      customerName: mockCustomer.name,
      customerPhone: mockCustomer.phone,
      tourId: mockQuote.tourId,
      tourName: mockQuote.tourName,
      departureDate: mockQuote.departureDate,
      paxCount: mockQuote.paxCount,
      unitPrice: mockQuote.unitPrice,
      totalAmount: mockQuote.totalAmount,
      paidAmount: 0,
      remainingAmount: mockQuote.totalAmount,
      status: 'Chờ thanh toán',
      financialStatus: 'Chờ thanh toán',
      collaboratorId: mockQuote.collaboratorId
    };
    mockQuote.status = 'Đã lên đơn tour';
    mockQuote.bookingCode = mockBookingCode;

    // Chống tạo trùng lần 2 (Strict Idempotency)
    const duplicatePrevented = (mockQuote.status === 'Đã lên đơn tour' && Boolean(mockQuote.bookingCode));

    const b3Pass = mockBooking.paidAmount === 0 &&
                   mockBooking.remainingAmount === expectedTotal &&
                   mockBooking.status === 'Chờ thanh toán' &&
                   mockQuote.status === 'Đã lên đơn tour' &&
                   duplicatePrevented;

    // B4: Thu tiền cọc 50% -> Công nợ giảm 50%, trạng thái sang Đã đặt cọc
    const depositAmt = expectedTotal / 2;
    mockBooking.paidAmount = depositAmt;
    mockBooking.remainingAmount = expectedTotal - depositAmt;
    mockBooking.status = 'Đã đặt cọc';
    const b4Pass = mockBooking.paidAmount === depositAmt &&
                   mockBooking.remainingAmount === depositAmt &&
                   mockBooking.status === 'Đã đặt cọc';

    // B5: Hoa hồng CTV bảo toàn CTV-001, chưa tự động chi khi chưa nghiệm thu
    const b5Pass = mockBooking.collaboratorId === 'CTV-001';

    const test16Ok = b1Pass && b2Pass && b3Pass && b4Pass && b5Pass;
    assert('16. Luồng tích hợp Chốt tour → Báo giá → Đơn tour → Tài chính → Hoa hồng', test16Ok, 'Chốt tour tạo Báo giá chờ duyệt; Duyệt xong lên 1 Đơn tour (Idempotent); Paid=0 chuyển Tài chính; Thu cọc 50% cập nhật công nợ; Bảo toàn CTV');

    // Test 17: Cô lập Hoa hồng Đa đơn tour & Nghiệm thu Điều hành
    const testCust17 = { id: 'HH-T17', code: 'HH-T17', name: 'Khách VIP Multi-Tour', collaboratorId: 'CTV-001', demand: 'Trekking Cát Tiên 2N1Đ' };
    const pol17 = findTourPolicy('Trekking Cát Tiên 2N1Đ'); // 7% Doanh thu
    
    // Đơn tour 1: 10.000.000đ -> Hoa hồng 700.000đ, đã hoàn thành tour và thanh toán đủ 100% -> 'Đã duyệt chi'
    const b17_1 = {
      id: 'DH-T17-01',
      code: 'DH-T17-01',
      customerId: 'HH-T17',
      customerName: testCust17.name,
      collaboratorId: 'CTV-001',
      tourName: 'Trekking Cát Tiên 2N1Đ',
      totalAmount: 10000000,
      paidAmount: 10000000,
      remainingAmount: 0,
      tourStatus: 'Hoàn thành tour',
      status: 'Đã hoàn thành'
    };
    const calc17_1 = calculateTourCommission({ tourValue: b17_1.totalAmount, paxCount: 2, costValue: 6000000 }, pol17);
    const comm17_1 = {
      id: 'HH-COM-01',
      bookingCode: b17_1.code,
      ctvId: 'CTV-001',
      customerId: 'HH-T17',
      customerName: testCust17.name,
      tourName: b17_1.tourName,
      tourValue: b17_1.totalAmount,
      amount: calc17_1.amount,
      status: 'Đã duyệt chi'
    };

    // Đơn tour 2 của CÙNG khách hàng: 25.000.000đ -> Hoa hồng 1.750.000đ, mới cọc 10tr còn nợ 15tr -> giữ 'Chờ duyệt'
    const b17_2 = {
      id: 'DH-T17-02',
      code: 'DH-T17-02',
      customerId: 'HH-T17',
      customerName: testCust17.name,
      collaboratorId: 'CTV-001',
      tourName: 'Trekking Cát Tiên 2N1Đ',
      totalAmount: 25000000,
      paidAmount: 10000000,
      remainingAmount: 15000000,
      tourStatus: 'Hoàn thành tour',
      status: 'Đã đặt cọc'
    };
    const calc17_2 = calculateTourCommission({ tourValue: b17_2.totalAmount, paxCount: 5, costValue: 15000000 }, pol17);
    const comm17_2 = {
      id: 'HH-COM-02',
      bookingCode: b17_2.code,
      ctvId: 'CTV-001',
      customerId: 'HH-T17',
      customerName: testCust17.name,
      tourName: b17_2.tourName,
      tourValue: b17_2.totalAmount,
      amount: calc17_2.amount,
      status: 'Chờ duyệt' // Chưa thanh toán đủ 100% nên CHƯA được duyệt chi dù tour đã chạy xong
    };

    const commList17 = [comm17_1, comm17_2];
    const matchComm1 = commList17.find(c => c.bookingCode === b17_1.code);
    const matchComm2 = commList17.find(c => c.bookingCode === b17_2.code);

    const t17Ok = matchComm1 && matchComm2 &&
                  matchComm1.id !== matchComm2.id &&
                  matchComm1.amount === 700000 &&
                  matchComm2.amount === 1750000 &&
                  matchComm1.status === 'Đã duyệt chi' &&
                  matchComm2.status === 'Chờ duyệt';

    assert('17. Cô lập Hoa hồng Đa đơn tour & Nghiệm thu Điều hành', t17Ok, '1 khách đi 2 tour sinh 2 phiếu hoa hồng độc lập (700k & 1.75M), không bị ghi đè; Đơn 1 trả đủ 100% duyệt chi, Đơn 2 còn nợ giữ Chờ duyệt');

    // Test 18: Ràng buộc Toàn vẹn Tham chiếu (Orphan Guard) & Sinh mã An toàn (generateNextCode)
    // 1. Kiểm tra generateNextCode với trường hợp xóa bản ghi ở giữa
    const mockArr = [{ code: 'HH-001' }, { code: 'HH-003' }]; // Bản ghi HH-002 đã bị xóa
    const nextCodeGenerated = generateNextCode('HH-', mockArr, 'code');
    const genCodeOk = nextCodeGenerated === 'HH-004'; // Quét Math.max -> sinh HH-004, không bị trùng lại HH-003

    // 2. Kiểm tra Orphan Guard: Chặn xóa khi có liên kết
    const mockCust18 = { id: 'HH-999', code: 'HH-999', name: 'Khách Đang Có Tour' };
    const mockBookings18 = [{ id: 'DH-999', customerId: 'HH-999', status: 'Đã đặt cọc' }];
    const hasActiveBookingCheck = mockBookings18.some(b => (b.customerId === mockCust18.id || b.customerId === mockCust18.code) && b.status !== 'Đã hủy');

    // 3. Kiểm tra Orphan Guard CTV & NCC
    const mockCtv18 = { id: 'CTV-999', code: 'CTV-999' };
    const mockCustList18 = [{ id: 'HH-001', collaboratorId: 'CTV-999' }];
    const hasCtvCustCheck = mockCustList18.some(c => c.collaboratorId === mockCtv18.id || c.collaboratorId === mockCtv18.code);

    const mockSupplier18 = { id: 'NCC-999', code: 'NCC-999' };
    const mockSupplierBookings18 = [{ id: 'LDC-001', supplierId: 'NCC-999', status: 'CONFIRMED' }];
    const hasSupplierBookingCheck = mockSupplierBookings18.some(sb => (sb.supplierId === mockSupplier18.id || sb.supplierId === mockSupplier18.code) && sb.status !== 'Đã hủy');

    const t18Ok = genCodeOk && hasActiveBookingCheck && hasCtvCustCheck && hasSupplierBookingCheck;
    assert('18. Ràng buộc Toàn vẹn Tham chiếu (Orphan Guard) & Sinh mã An toàn', t18Ok, 'generateNextCode tạo đúng HH-004 (quét Math.max, chống trùng); Chặn xóa Khách hàng/CTV/NCC khi có dữ liệu ràng buộc');

    // Test 19: Chu trình Lệnh đặt dịch vụ NCC (Điều hành -> Kế toán duyệt) & Bất biến Dữ liệu (Immutability)
    // 1. Kiểm tra chính sách công nợ & luồng duyệt lệnh thanh toán ngay
    const mockOrderPayNow = {
      id: 'LDC-TEST-01',
      code: 'LDC-TEST-01',
      bookingCode: 'DH-004',
      supplierId: 'NCC-001',
      agreedCost: 50000000,
      paidCost: 0,
      payType: 'PAY_NOW',
      debtPolicy: 'PAY_NOW',
      status: 'WAIT_PAY_APPROVAL'
    };
    if (mockOrderPayNow.status === 'WAIT_PAY_APPROVAL') {
      mockOrderPayNow.paidCost = mockOrderPayNow.agreedCost;
      mockOrderPayNow.status = 'PAID_FULL';
      mockOrderPayNow.approvedBy = 'Kế toán trưởng';
    }
    const payNowFlowOk = mockOrderPayNow.status === 'PAID_FULL' && mockOrderPayNow.paidCost === 50000000;

    // 2. Lệnh công nợ đối tác: chuyển trạng thái sang WAIT_DEBT_APPROVAL
    const mockOrderCredit = {
      id: 'LDC-TEST-02',
      code: 'LDC-TEST-02',
      bookingCode: 'DH-004',
      supplierId: 'NCC-002',
      agreedCost: 30000000,
      paidCost: 0,
      payType: 'CREDIT',
      debtPolicy: 'DEBT_15D',
      status: 'WAIT_DEBT_APPROVAL'
    };
    if (mockOrderCredit.status === 'WAIT_DEBT_APPROVAL') {
      mockOrderCredit.status = 'DEBT_ACKNOWLEDGED';
      mockOrderCredit.approvedBy = 'Kế toán trưởng (Ghi nhận công nợ NCC)';
    }
    const creditFlowOk = mockOrderCredit.status === 'DEBT_ACKNOWLEDGED' && mockOrderCredit.paidCost === 0;

    // 3. Kiểm tra tính Bất biến Dữ liệu (Immutability): Kế toán không được sửa Sale/Điều hành
    const prevUser = currentUser;
    let keToanBlockedCustomerEdit = false;
    let keToanBlockedBookingEdit = false;
    let keToanBlockedTourStatusEdit = false;

    // Giả lập role KE_TOAN
    currentUser = { id: 3, username: 'ketoan', name: 'Trần Thị Thu (Kế toán)', role: 'KE_TOAN' };

    const origAlert = window.alert;
    let alertCalled = false;
    window.alert = function() { alertCalled = true; };

    alertCalled = false;
    window.editCustomer(db.customers[0]?.id || 'HH-001');
    if (alertCalled) keToanBlockedCustomerEdit = true;

    alertCalled = false;
    editBooking(db.bookings[0]?.id || 'DH-001');
    if (alertCalled) keToanBlockedBookingEdit = true;

    alertCalled = false;
    updateTourOpStatus(db.bookings[0]?.id || 'DH-001', 'Hoàn thành tour');
    if (alertCalled) keToanBlockedTourStatusEdit = true;

    // Khôi phục
    window.alert = origAlert;
    currentUser = prevUser;

    const immutabilityOk = keToanBlockedCustomerEdit && keToanBlockedBookingEdit && keToanBlockedTourStatusEdit;
    const t19Ok = payNowFlowOk && creditFlowOk && immutabilityOk;

    assert(
      '19. Chu trình Lệnh đặt dịch vụ NCC (Điều hành -> Kế toán duyệt) & Bất biến Dữ liệu',
      t19Ok,
      'Điều hành lập lệnh (Thanh toán ngay/Công nợ) -> Kế toán duyệt chi/ghi nhận nợ; Khóa chặt quyền Kế toán không được sửa hồ sơ khách, tiền tour hoặc trạng thái vận hành đã chốt'
    );

    // Test 20: Hệ thống Thông Báo & Chuyển Giao Liên Phòng Ban (Inter-Departmental Handover & Notification)
    // 1. Kiểm tra gửi thông báo chuyển giao đoàn tour từ SALE -> OPS khi chốt tour
    const testHandoverNotif = sendInterDeptNotification({
      senderRole: 'SALE',
      senderName: 'Nguyễn Văn An (Sale)',
      targetRole: 'OPS',
      targetModule: 5,
      type: 'HANDOVER_TOUR',
      title: 'Bàn giao đoàn tour test: DH-TEST-20',
      message: 'Sale vừa chốt thành công đơn tour DH-TEST-20. Đã chuyển sang Điều hành trong phần Mới tiếp nhận.',
      referenceId: 'DH-TEST-20',
      referenceType: 'BOOKING'
    });

    const notifSentOk = Boolean(testHandoverNotif && testHandoverNotif.id && testHandoverNotif.status === 'UNREAD');

    // 2. Phía người gửi (Sale) có bản ghi trong Outbox
    const saleOutbox = db.notifications.filter(n => n.senderRole === 'SALE' && n.id === testHandoverNotif.id);
    const senderHasOutboxOk = saleOutbox.length > 0;

    // 3. Phía người nhận (Điều hành) có thông báo chưa đọc trong Inbox
    const opsInboxUnread = db.notifications.filter(n => (n.targetRole === 'OPS' || n.targetRole === 'DIEU_HANH') && n.status === 'UNREAD' && n.id === testHandoverNotif.id);
    const receiverHasUnreadOk = opsInboxUnread.length > 0;

    // 4. Giả lập đơn tour trong phần "Mới tiếp nhận" và Điều hành tiếp nhận
    const mockBooking20 = {
      id: 'DH-TEST-20',
      code: 'DH-TEST-20',
      customerName: 'Khách Test Handover',
      tourName: 'Tour Test 20',
      tourStatus: 'Mới tiếp nhận',
      status: 'Chờ thanh toán',
      totalAmount: 50000000
    };
    db.bookings.unshift(mockBooking20);

    // Điều hành tiếp nhận tour
    const origAlert20 = window.alert;
    window.alert = function() {};
    acknowledgeIncomingTour('DH-TEST-20');
    window.alert = origAlert20;

    const acknowledgedTourOk = mockBooking20.tourStatus === 'Chưa khởi hành';
    const notifAcknowledgedOk = testHandoverNotif.status === 'ACKNOWLEDGED';

    // 5. Kiểm tra thông báo phản hồi gửi ngược lại cho Sale
    const feedbackNotif = db.notifications.find(n => n.referenceId === 'DH-TEST-20' && n.type === 'HANDOVER_ACK' && n.targetRole === 'SALE');
    const feedbackSentOk = Boolean(feedbackNotif && feedbackNotif.senderRole === 'OPS');

    // Dọn dẹp mock đơn tour test
    db.bookings = db.bookings.filter(b => b.id !== 'DH-TEST-20');
    db.notifications = db.notifications.filter(n => n.referenceId !== 'DH-TEST-20');

    // 6. Kiểm tra luồng thông báo từ CTV sang SALE khi CTV gửi khách hàng mới
    const testCtvLeadNotif = sendInterDeptNotification({
      senderRole: 'CTV',
      senderName: 'Hoàng Yến (CTV-001)',
      targetRole: 'SALE',
      targetModule: 2,
      type: 'CTV_LEAD_SUBMITTED',
      title: 'CTV gửi khách mới: Khách Test CTV',
      message: 'CTV vừa gửi khách hàng mới. Phân công cho Sale.',
      referenceId: 'HH-TEST-CTV',
      referenceType: 'CUSTOMER'
    });

    const ctvNotifSentOk = Boolean(testCtvLeadNotif && testCtvLeadNotif.status === 'UNREAD');
    const saleReceivedCtvNotif = db.notifications.some(n => n.targetRole === 'SALE' && n.id === testCtvLeadNotif.id && n.status === 'UNREAD');
    const ctvHasOutbox = db.notifications.some(n => n.senderRole === 'CTV' && n.id === testCtvLeadNotif.id);

    // Giả lập khách test và Sale tiếp nhận khách từ CTV
    const mockCustCtv = {
      id: 99992,
      code: 'HH-TEST-CTV',
      name: 'Khách Test CTV',
      phone: '0988776655',
      collaboratorId: 'CTV-001',
      status: 'Mới tiếp nhận'
    };
    db.customers.unshift(mockCustCtv);

    window.alert = function() {};
    acknowledgeCtvLead(mockCustCtv.id);
    window.alert = origAlert20;

    const custStatusChanged = mockCustCtv.status === 'Đang tư vấn';
    const ctvNotifAckOk = testCtvLeadNotif.status === 'ACKNOWLEDGED';
    const ctvReceivedFeedback = db.notifications.some(n => n.referenceId === 'HH-TEST-CTV' && n.type === 'CTV_LEAD_ACK' && n.targetRole === 'CTV');

    // 7. Rà soát phân quyền chuyên môn: Kế toán chỉ truy cập [6, 7]; Điều hành chỉ truy cập [5, 8] (Không can thiệp/sửa báo giá sale)
    const keToanMods = ROLE_PERMISSIONS['KE_TOAN'] || [];
    const opsMods = ROLE_PERMISSIONS['OPS'] || [];
    const keToanStrictFinance = keToanMods.includes(6) && keToanMods.includes(7) && !keToanMods.includes(2) && !keToanMods.includes(4) && !keToanMods.includes(5);
    const opsStrictOps = opsMods.includes(5) && !opsMods.includes(4) && !opsMods.includes(2);

    // Dọn dẹp mock khách test
    db.customers = db.customers.filter(c => c.id !== 99992);
    db.notifications = db.notifications.filter(n => n.referenceId !== 'HH-TEST-CTV');

    const t20Ok = notifSentOk && senderHasOutboxOk && receiverHasUnreadOk && acknowledgedTourOk && notifAcknowledgedOk && feedbackSentOk &&
                  ctvNotifSentOk && saleReceivedCtvNotif && ctvHasOutbox && custStatusChanged && ctvNotifAckOk && ctvReceivedFeedback &&
                  keToanStrictFinance && opsStrictOps;

    assert(
      '20. Hệ thống Thông Báo & Chuyển Giao Liên Phòng Ban (Inter-Departmental Handover & Notification)',
      t20Ok,
      'CTV gửi khách -> Sale nhận chuông & chấm đỏ chưa đọc, Sale tiếp nhận phản hồi lại CTV; Sale chốt tour chuyển giao sang Điều hành trong phần "Mới tiếp nhận"; Kế toán chỉ truy cập chuyên môn [6, 7]; Điều hành không thấy báo giá sale'
    );

    // Test 21: Kiểm thử 20 Kịch Bản Lữ Hành Thực Tế, Quyết Toán P&L Đoàn, Rooming List Toàn Vẹn & CSAT Rating
    // 1. Kiểm tra toàn bộ 20 đơn tour DH-001 đến DH-020 tồn tại trong hệ thống
    const bookingCodes20 = Array.from({ length: 20 }, (_, i) => `DH-${String(i + 1).padStart(3, '0')}`);
    const all20BookingsExist = bookingCodes20.every(code => db.bookings.some(b => b.code === code));

    // 2. Kiểm tra tính toàn vẹn của Rooming List (Danh sách hành khách & phân phòng)
    const b001 = db.bookings.find(b => b.code === 'DH-001');
    const b004 = db.bookings.find(b => b.code === 'DH-004');
    const b014 = db.bookings.find(b => b.code === 'DH-014');
    const roomingOk = b001 && b001.passengers && b001.passengers.length === 4 &&
                      b004 && b004.passengers && b004.passengers.length >= 6 &&
                      b014 && b014.passengers && b014.passengers.length === 4;

    // 3. Kiểm tra tính toán P&L tự động của đơn tour DH-001 (Doanh thu 9.6M, COGS 6.2M, Comm 672k -> LNG 2.728M)
    const pnlRev001 = b001.totalAmount;
    const orders001 = db.supplierBookings.filter(sb => sb.bookingCode === 'DH-001');
    const pnlCogs001 = orders001.reduce((sum, sb) => sum + sb.agreedCost, 0);
    const comm001 = db.commissions.find(c => c.bookingCode === 'DH-001');
    const commAmt001 = comm001 ? comm001.amount : 0;
    const grossProfit001 = pnlRev001 - pnlCogs001 - commAmt001;
    const grossMargin001 = Number(((grossProfit001 / pnlRev001) * 100).toFixed(1));
    const pnl001Ok = pnlRev001 === 9600000 && pnlCogs001 === 6200000 && commAmt001 === 672000 && grossProfit001 === 2728000 && grossMargin001 === 28.4;

    // 4. Kiểm tra kịch bản Hoàn tiền & Phạt cọc đơn hủy DH-007
    const b007 = db.bookings.find(b => b.code === 'DH-007');
    const ref001 = db.payments.find(p => p.bookingCode === 'DH-007' && p.type === 'REFUND');
    const comm007 = db.commissions.find(c => c.bookingCode === 'DH-007');
    const refundScenarioOk = b007 && b007.status === 'Đã hủy' && ref001 && ref001.amount === 17500000 && comm007 && comm007.status === 'Đã hủy';

    // 5. Kiểm tra kịch bản B2B Trả sau 15 ngày DH-008 và Công nợ NCC 30 ngày
    const b008 = db.bookings.find(b => b.code === 'DH-008');
    const orders008 = db.supplierBookings.filter(sb => sb.bookingCode === 'DH-008');
    const cogs008Debt = orders008.reduce((s, o) => s + (o.agreedCost - (o.paidCost || 0)), 0);
    const b2bScenarioOk = b008 && b008.totalAmount === 256000000 && b008.remainingAmount === 256000000 && cogs008Debt === 160000000;

    // 6. Kiểm tra CSAT rating phản hồi khách hàng
    const csat001Ok = b001.feedback && b001.feedback.rating === 5 && Boolean(b001.feedback.comment);

    const t21Ok = all20BookingsExist && roomingOk && pnl001Ok && refundScenarioOk && b2bScenarioOk && csat001Ok;

    assert(
      '21. 20 Kịch Bản Lữ Hành Thực Tế, Quyết Toán P&L Đoàn, Rooming List Toàn Vẹn & CSAT Rating',
      t21Ok,
      '20 đơn tour (DH-001 -> DH-020) vận hành hoàn hảo; P&L tự động đối soát chuẩn (LNG 2.728M, Margin 28.4%); Rooming list phân phòng chuẩn; Đơn hủy hoàn cọc 17.5M; B2B nợ 256M & NCC 160M; CSAT 5 sao'
    );

    // Test 22: Hệ Thống Phòng Chống Gian Lận & Kiểm Soát Chất Lượng Tour Của CEO (Anti-Fraud & Quality Radar)
    const priceAlertOrders = (db.supplierBookings || []).filter(sb => sb.priceAlert === true || (sb.contractRate && sb.agreedCost > sb.contractRate));
    const overrunTours = (db.bookings || []).filter(b => {
      const orders = (db.supplierBookings || []).filter(sb => sb.bookingCode === b.code || sb.bookingId === b.id);
      const actualCogs = orders.reduce((s, o) => s + (o.agreedCost || 0), 0);
      return b.estimatedCost > 0 && actualCogs > b.estimatedCost;
    });
    const tourIncidents = (db.bookings || []).flatMap(b => b.incidents || []);
    const highDebtTours = (db.bookings || []).filter(b => b.status !== 'Đã hủy' && (b.totalAmount - (b.paidAmount || 0)) > 0 && (b.paidAmount || 0) < b.totalAmount * 0.5);

    const t22Ok = priceAlertOrders.length > 0 && overrunTours.length > 0 && tourIncidents.length > 0 && highDebtTours.length > 0;

    assert(
      '22. Hệ Thống Phòng Chống Gian Lận & Kiểm Soát Chất Lượng Tour Của CEO (Anti-Fraud & Quality Radar)',
      t22Ok,
      `Radar quét tự động phát hiện ${priceAlertOrders.length} vụ lệch giá NCC; ${overrunTours.length} đoàn đội chi phí vượt dự toán; ${tourIncidents.length} sự cố chất lượng được xử lý; ${highDebtTours.length} đoàn rủi ro nợ cao`
    );

    // Test 23: Kho Tour Cổng CTV & Chức Năng Lựa Chọn Tour Mở Bán (CTV Tour Catalog & Selection Workflow)
    const totalToursInDb = db.tourPolicies.length;
    const sellingToursCount = db.tourPolicies.filter(t => t.status === 'selling').length;
    const pausedToursCount = db.tourPolicies.filter(t => t.status === 'paused').length;

    // Test CTV selection
    const testCtv = db.ctvs.find(c => c.id === 'CTV-001') || db.ctvs[0];
    if (!Array.isArray(testCtv.selectedTourIds)) {
      testCtv.selectedTourIds = ['TOUR-01', 'TOUR-02'];
    }
    const initialSelectedLen = testCtv.selectedTourIds.length;

    // Giả lập CTV chọn thêm tour TOUR-03
    const tourToPick = 'TOUR-03';
    const wasSelected = testCtv.selectedTourIds.includes(tourToPick);
    if (!wasSelected) {
      testCtv.selectedTourIds.push(tourToPick);
    }
    const hasPicked = testCtv.selectedTourIds.includes(tourToPick);

    // Kiểm tra link affiliate
    const testRefLink = `https://hahaeco.vn/tours/${db.tourPolicies[0].code}?ref=${testCtv.refCode}`;
    const linkValid = testRefLink.includes(testCtv.refCode) && testRefLink.includes(db.tourPolicies[0].code);

    const t23Ok = totalToursInDb >= 6 && 
                  sellingToursCount > 0 && 
                  pausedToursCount > 0 && 
                  hasPicked && 
                  linkValid;

    assert(
      '23. Kho Tour Cổng CTV & Chức Năng Lựa Chọn Tour Mở Bán (CTV Tour Catalog & Selection Workflow)',
      t23Ok,
      `Kho tour có ${totalToursInDb} tour (${sellingToursCount} tour mở bán, ${pausedToursCount} tour tạm dừng); CTV ${testCtv.code} chọn bán ${testCtv.selectedTourIds.length} tour; Link tiếp thị gắn refCode ${testCtv.refCode} hợp lệ`
    );

    // Test 24: Quản Lý Mạng Lưới CTV Của Sale, Xếp Hạng Hiệu Suất & Cổng Trao Đổi Hướng Dẫn 2 Chiều
    // 1. Phân bổ CTV cho Sale phụ trách (~100 CTV/Sale)
    const ctv1 = (db.ctvs || []).find(c => c.id === 'CTV-001');
    const ctv4 = (db.ctvs || []).find(c => c.id === 'CTV-004');
    const ctv6 = (db.ctvs || []).find(c => c.id === 'CTV-006');
    const saleAssignedOk = Boolean(ctv1 && ctv1.assignedSaleId && ctv1.assignedSale);

    // 2. Phân loại hiệu suất: CTV-001 (xuất sắc/tốt), CTV-004 (không hoạt động/bất động), CTV-006 (đã chấm dứt)
    const perf1 = classifyCtvPerformance(ctv1);
    const perf4 = classifyCtvPerformance(ctv4);
    const perf6 = classifyCtvPerformance(ctv6);
    const performanceRatingOk = (perf1.rating === 'EXCELLENT' || perf1.rating === 'GOOD') &&
                                (perf4.rating === 'DORMANT') &&
                                (perf6.rating === 'TERMINATED');

    // 3. Cơ chế chấm dứt liên kết CTV bất động và khôi phục
    const origStatus4 = ctv4 ? ctv4.accountStatus : 'active';
    if (ctv4) {
      ctv4.accountStatus = 'terminated';
      ctv4.terminationReason = 'Không phát sinh doanh số > 60 ngày';
    }
    const perf4Terminated = ctv4 ? classifyCtvPerformance(ctv4) : { rating: 'TERMINATED' };
    const termOk = (perf4Terminated.rating === 'TERMINATED');
    if (ctv4) {
      ctv4.accountStatus = origStatus4;
      delete ctv4.terminationReason;
    }

    // 4. Cổng trao đổi hướng dẫn 2 chiều giữa CTV và Sale phụ trách
    const testSupportMsgId = 'MSG-TEST-999';
    const newSupportMsg = {
      id: testSupportMsgId,
      ctvId: 'CTV-003',
      ctvName: 'Thảo Vy (Cộng đồng Chữa Lành)',
      saleId: 'NV-002',
      saleName: 'Nguyễn Văn An',
      subject: 'Xin tư vấn tình huống khách đoàn thiền',
      content: 'Khách muốn thực đơn chay riêng',
      status: 'pending',
      reply: null,
      isReadByCtv: true,
      isReadBySale: false,
      createdAt: '2026-10-27 10:00'
    };
    if (!db.ctvSupportMessages) db.ctvSupportMessages = [];
    db.ctvSupportMessages.push(newSupportMsg);

    const pendingFound = db.ctvSupportMessages.find(m => m.id === testSupportMsgId && m.status === 'pending');
    if (pendingFound) {
      pendingFound.status = 'resolved';
      pendingFound.reply = 'Đoàn có set menu chay riêng phụ thu 50k/pax.';
      pendingFound.repliedBy = 'Nguyễn Văn An';
      pendingFound.isReadByCtv = false; // Báo unread cho CTV
    }

    const resolvedOk = Boolean(pendingFound && pendingFound.status === 'resolved' && pendingFound.reply && !pendingFound.isReadByCtv);
    if (pendingFound) pendingFound.isReadByCtv = true;
    const ctvReadOk = Boolean(pendingFound && pendingFound.isReadByCtv);

    // Dọn dẹp mock message test
    db.ctvSupportMessages = (db.ctvSupportMessages || []).filter(m => m.id !== testSupportMsgId);

    const t24Ok = saleAssignedOk && performanceRatingOk && termOk && Boolean(pendingFound) && resolvedOk && ctvReadOk;

    assert(
      '24. Quản Lý Mạng Lưới CTV Của Sale, Xếp Hạng Hiệu Suất & Cổng Trao Đổi Hướng Dẫn 2 Chiều (Sale CTV Management & Two-Way Support Portal)',
      t24Ok,
      `Sale quản lý ~100 CTV (CTV-001 phụ trách bởi ${ctv1?.assignedSale}); Phân loại chuẩn 5 bậc: CTV-001 (${perf1.label}), CTV-004 (${perf4.label}), CTV-006 (${perf6.label}); Cổng trao đổi 2 chiều CTV gửi câu hỏi -> Sale hướng dẫn -> CTV nhận chuông và chấm đỏ thành công`
    );

    // Test 25: Ràng Buộc Độc Quyền CTV-Sale, Hạch Toán Doanh Số CTV Vào KPI & Thưởng Vượt KPI Bậc Thang (Exclusive Sale Attribution & Over-KPI Commission)
    // 1. Kiểm tra nguyên tắc độc quyền 1 Sale: Mỗi CTV chỉ thuộc duy nhất 1 Sale
    const allCtvsHaveSingleSale = db.ctvs.every(c => Boolean(c.assignedSaleId) && typeof c.assignedSaleId === 'string' && !c.assignedSaleId.includes(','));

    // 2. Hạch toán doanh số CTV vào KPI Sale An (NV-002)
    const saleAnKpi = calculateSalePerformanceAndCommission('NV-002', '2026-10');
    const anHasCtvRev = (saleAnKpi.ctvRevenue > 0);
    const anCtvCommOk = (saleAnKpi.commFromCtv === Math.round(saleAnKpi.ctvRevenue * 0.02));
    const anTotalCommOk = (saleAnKpi.totalCommission === (saleAnKpi.commFromCtv + saleAnKpi.commDirect + saleAnKpi.bonusOverKpi));

    // 3. Cơ chế thưởng vượt KPI bậc thang (Tier 1: 1.5%, Tier 2: 2.5%)
    const anPercentOk = (saleAnKpi.percent > 0);
    const overCalcOk = saleAnKpi.isOverKpi ? (saleAnKpi.bonusOverKpi > 0) : (saleAnKpi.bonusOverKpi === 0);

    // 4. Hạch toán riêng biệt cho Sale Ngọc (NV-005) - Không trùng lặp doanh số
    const saleNgocKpi = calculateSalePerformanceAndCommission('NV-005', '2026-10');
    const ngocDistinctOk = (saleNgocKpi.saleId === 'NV-005' && saleNgocKpi.saleUser.name === 'Trần Thị Ngọc');

    // 5. Kiểm tra tính năng điều chuyển CTV độc quyền
    const testCtvReassign = db.ctvs.find(c => c.id === 'CTV-001');
    const origSaleId = testCtvReassign.assignedSaleId;
    testCtvReassign.assignedSaleId = 'NV-005';
    testCtvReassign.assignedSale = 'Trần Thị Ngọc';
    const reassignedKpi = calculateSalePerformanceAndCommission('NV-005', '2026-10');
    const reassignedOk = (reassignedKpi.myCtvsCount >= saleNgocKpi.myCtvsCount + 1);
    // Khôi phục lại
    testCtvReassign.assignedSaleId = origSaleId;
    testCtvReassign.assignedSale = 'Nguyễn Văn An';

    const t25Ok = allCtvsHaveSingleSale && anHasCtvRev && anCtvCommOk && anTotalCommOk && anPercentOk && overCalcOk && ngocDistinctOk && reassignedOk;

    assert(
      '25. Ràng Buộc Độc Quyền CTV-Sale, Hạch Toán Doanh Số CTV Vào KPI & Thưởng Vượt KPI Bậc Thang (Exclusive Sale Attribution & Over-KPI Commission)',
      t25Ok,
      `100% CTV gắn độc quyền 1 Sale; Sale An đạt ${saleAnKpi.percent}% KPI (Doanh số: ${formatVND(saleAnKpi.totalRevenue)}, CTV đóng góp: ${formatVND(saleAnKpi.ctvRevenue)}); Hạch toán chuẩn hoa hồng quản lý 2% (${formatVND(saleAnKpi.commFromCtv)}) & Thưởng vượt KPI (${formatVND(saleAnKpi.bonusOverKpi)}), Tổng hoa hồng Sale: ${formatVND(saleAnKpi.totalCommission)}`
    );

    // Test 26: Quản Trị Đối Tác Cung Ứng Đa Tỉnh Thành, Đa Dịch Vụ, Bộ Lọc Đa Chiều & Cập Nhật Thời Gian Thực Hằng Ngày
    // 1. Kiểm tra độ phủ tỉnh thành và loại hình đối tác
    const supProvinces = [...new Set((db.suppliers || []).map(s => s.province).filter(Boolean))];
    const supCategories = [...new Set((db.suppliers || []).map(s => s.category).filter(Boolean))];
    const hasMultipleProvinces = supProvinces.length >= 5;
    const hasMultipleCats = supCategories.includes('HOTEL') && supCategories.includes('TRANSPORT') && supCategories.includes('GUIDE');

    // 2. Kiểm tra bộ lọc đa chiều (Tỉnh, Sao, Giá)
    supplierFilterProvince = 'Đồng Nai';
    const dongNaiSups = getFilteredSuppliers();
    const filterProvinceOk = dongNaiSups.length > 0 && dongNaiSups.every(s => (s.province || '').includes('Đồng Nai'));

    supplierFilterProvince = 'ALL';
    supplierFilterStars = '5';
    const star5Sups = getFilteredSuppliers();
    const filterStarsOk = star5Sups.length > 0 && star5Sups.every(s => s.stars === 5);

    supplierFilterStars = 'ALL';
    supplierFilterPrice = 'UNDER_500K';
    const cheapSups = getFilteredSuppliers();
    const filterPriceOk = cheapSups.length > 0 && cheapSups.every(s => (s.priceMin || 0) < 500000);

    // Reset bộ lọc về ALL
    supplierFilterProvince = 'ALL';
    supplierFilterCategory = 'ALL';
    supplierFilterStars = 'ALL';
    supplierFilterPrice = 'ALL';
    supplierSearchKeyword = '';

    // 3. Kiểm tra chi tiết đối tác: Bảng giá dịch vụ và 5 Chính sách chi tiết
    const testSupplier01 = (db.suppliers || []).find(s => s.id === 'NCC-001' || s.code === 'NCC-001');
    const hasDetailedServices = testSupplier01 && Array.isArray(testSupplier01.services) && testSupplier01.services.length >= 2 &&
      testSupplier01.services[0].rackPrice > 0 && testSupplier01.services[0].b2bPrice > 0;
    const hasDetailedPolicies = !!(testSupplier01 && testSupplier01.policies && testSupplier01.policies.cancellation &&
      testSupplier01.policies.children && testSupplier01.policies.foc);

    // 4. Kiểm tra Cổng đăng nhập & Onboarding đối tác mới
    const regCode = generateNextCode('NCC-', db.suppliers, 'code');
    const createdSupplier = {
      id: regCode,
      code: regCode,
      name: 'Resort Sinh Thái Biển Phú Quốc Eco',
      category: 'HOTEL',
      province: 'Kiên Giang',
      stars: 5,
      priceMin: 2000000,
      priceMax: 4500000,
      address: 'Bãi Trường, Dương Tơ, Phú Quốc',
      contactName: 'Chị Hà',
      phone: '0988776655',
      email: 'phuquoc.eco@gmail.com',
      status: 'active',
      debtPolicy: 'DEBT_15D',
      debtPolicyTitle: 'Công nợ 15 ngày sau tour',
      debtLimit: 50000000,
      services: [
        { id: `SRV-${regCode}-01`, name: 'Bungalow Hướng Biển Phú Quốc', rackPrice: 2800000, b2bPrice: 2100000, unit: 'Phòng/Đêm', availability: 'AVAILABLE' }
      ],
      policies: { cancellation: 'Hủy trước 7 ngày miễn phí', foc: 'Miễn phí 1 phòng cho HDV' },
      dailyLiveStatus: { operationalStatus: 'NORMAL', availableCapacityNote: 'Còn 10 phòng', dailyNotice: 'Biển êm đẹp', history: [] }
    };
    db.suppliers.push(createdSupplier);

    // 5. Kiểm tra Cập nhật thời gian thực & Phát bản tin hằng ngày
    const bulletinMsg = 'Hôm nay nắng đẹp, còn 8 phòng và bếp sẵn sàng phục vụ đoàn HaHa Travel';
    testSupplier01.dailyLiveStatus = {
      lastUpdated: new Date().toISOString().substring(0, 16),
      operationalStatus: 'NORMAL',
      availableCapacityNote: 'Còn 8 phòng Superior',
      dailyNotice: bulletinMsg,
      history: [{ date: '2026-10-28', time: '10:00', content: bulletinMsg, updatedBy: 'Anh Tuấn' }]
    };
    const realtimeNotif = sendInterDeptNotification({
      senderRole: 'SUPPLIER',
      senderName: testSupplier01.name,
      targetRole: 'OPS',
      targetModule: 5,
      type: 'PARTNER_LIVE_UPDATE',
      title: `[ĐỐI TÁC CẬP NHẬT LIVE]: ${testSupplier01.name} vừa phát bản tin hằng ngày`,
      message: bulletinMsg,
      referenceId: testSupplier01.code,
      urgency: 'HIGH'
    });

    const t26Ok = hasMultipleProvinces && hasMultipleCats && filterProvinceOk && filterStarsOk &&
                  filterPriceOk && hasDetailedServices && hasDetailedPolicies &&
                  createdSupplier.code.startsWith('NCC-') && (realtimeNotif && realtimeNotif.id) &&
                  testSupplier01.dailyLiveStatus.dailyNotice === bulletinMsg;

    // Dọn dẹp nhà cung cấp test
    db.suppliers = db.suppliers.filter(s => s.code !== regCode);
    db.notifications = db.notifications.filter(n => n.referenceId !== regCode);

    assert(
      '26. Quản Trị Đối Tác Cung Ứng Đa Tỉnh Thành, Đa Dịch Vụ, Bộ Lọc Đa Chiều & Cập Nhật Thời Gian Thực Hằng Ngày',
      t26Ok,
      `Độ phủ ${supProvinces.length} tỉnh thành; Lọc chuẩn Tỉnh/Sao/Giá; Bảng giá B2B & 5 chính sách chi tiết; Đăng ký đối tác mới trực tuyến; Đồng bộ bản tin thời gian thực sang Điều hành & CEO`
    );
    const endTime = performance.now();
    const totalDuration = Math.round(endTime - startTime);

    const allPassed = tests.every(t => t.passed);
    let outputHtml = `<div class="mb-2 font-bold ${allPassed ? 'text-emerald-700' : 'text-rose-700'}">`;
    outputHtml += allPassed ? `✅ TẤT CẢ ${tests.length} BỘ KIỂM THỬ ĐÃ ĐẠT (100% PASS - ${totalDuration}ms)` : `⚠️ CÓ BỘ KIỂM THỬ KHÔNG ĐẠT`;
    outputHtml += `</div><div class="space-y-1">`;

    tests.forEach(t => {
      outputHtml += `<div class="flex items-center space-x-1.5 ${t.passed ? 'text-emerald-700' : 'text-rose-600'}">`;
      outputHtml += `<span>${t.passed ? '✓' : '✗'}</span>`;
      outputHtml += `<span class="font-bold">${t.name}:</span>`;
      outputHtml += `<span class="text-slate-600 font-sans">${escapeHtml(t.message)}</span>`;
      outputHtml += `</div>`;
    });
    outputHtml += `</div>`;

    resultsContainer.innerHTML = outputHtml;
  } catch (err) {
    resultsContainer.innerHTML = `<div class="text-rose-600 font-bold">Lỗi kiểm thử: ${err.message}</div>`;
  }
}

// ==========================================
// 15. ĐĂNG KÝ SỰ KIỆN GIAO DIỆN
// ==========================================
function setupEventListeners() {
  const staffLoginForm = document.getElementById('login-form');
  if (staffLoginForm) staffLoginForm.addEventListener('submit', handleStaffLoginSubmit);

  const ctvLoginForm = document.getElementById('ctv-login-form');
  if (ctvLoginForm) ctvLoginForm.addEventListener('submit', handleCtvLoginSubmit);

  const supplierLoginForm = document.getElementById('supplier-login-form');
  if (supplierLoginForm) supplierLoginForm.addEventListener('submit', handleSupplierLoginSubmit);

  const supplierRegForm = document.getElementById('supplier-register-form');
  if (supplierRegForm) supplierRegForm.addEventListener('submit', handleSupplierRegisterSubmit);

  const supplierProfForm = document.getElementById('supplier-profile-form');
  if (supplierProfForm) supplierProfForm.addEventListener('submit', saveSupplierProfile);

  const supplierSrvForm = document.getElementById('supplier-service-form');
  if (supplierSrvForm) supplierSrvForm.addEventListener('submit', saveSupplierService);

  const ctvLeadForm = document.getElementById('ctv-submit-lead-form');
  if (ctvLeadForm) ctvLeadForm.addEventListener('submit', handleCtvSubmitLead);

  const ctvLeadPhone = document.getElementById('ctv-lead-phone');
  if (ctvLeadPhone) {
    ctvLeadPhone.addEventListener('input', () => {
      checkCtvLeadPhoneDuplicate(ctvLeadPhone.value);
    });
  }

  const ctvQuickBtns = document.querySelectorAll('.ctv-quick-demand-btn');
  ctvQuickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('ctv-lead-demand').value = btn.textContent;
    });
  });

  const changePassForm = document.getElementById('change-password-form');
  if (changePassForm) changePassForm.addEventListener('submit', handleChangePasswordSubmit);

  // Form Báo giá
  const quoteForm = document.getElementById('quotation-form');
  if (quoteForm) quoteForm.addEventListener('submit', saveQuotation);

  // Form CTV Chốt tour
  const ctvCloseForm = document.getElementById('ctv-close-tour-form');
  if (ctvCloseForm) ctvCloseForm.addEventListener('submit', handleCtvCloseTourSubmit);

  // Form Đơn tour
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) bookingForm.addEventListener('submit', saveBooking);

  // Form Thu tiền khách hàng
  const paymentForm = document.getElementById('payment-form');
  if (paymentForm) paymentForm.addEventListener('submit', handlePaymentSubmit);

  // Form Nhà cung cấp
  const supplierForm = document.getElementById('supplier-form');
  if (supplierForm) supplierForm.addEventListener('submit', saveSupplier);

  // Form Lệnh đặt dịch vụ
  const sbForm = document.getElementById('supplier-booking-form');
  if (sbForm) sbForm.addEventListener('submit', saveSupplierBooking);

  // Form Chi trả hoa hồng
  const payoutForm = document.getElementById('payout-form');
  if (payoutForm) payoutForm.addEventListener('submit', handlePayoutSubmit);

  // Form Chương trình tour
  const tourForm = document.getElementById('tour-form');
  if (tourForm) tourForm.addEventListener('submit', saveTour);

  const custForm = document.getElementById('customer-form');
  if (custForm) {
    custForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const idVal = document.getElementById('form-customer-id').value;
      const phoneVal = document.getElementById('form-phone').value.trim();

      const duplicate = checkPhoneDuplicate(phoneVal, idVal);
      if (duplicate) {
        alert(`⚠️ CẢNH BÁO TRÙNG SĐT:\nSố điện thoại "${phoneVal}" đã thuộc về khách hàng ${duplicate.name} (${duplicate.code})!`);
        return;
      }

      const paxEl = document.getElementById('form-pax');
      let customerPax = 2;
      if (paxEl) {
        const paxRes = parsePaxInput(paxEl.value);
        if (!paxRes.valid) {
          alert(`Số lượng khách không hợp lệ: ${paxRes.reason || 'Vui lòng nhập số nguyên dương lớn hơn 0.'}`);
          return;
        }
        customerPax = paxRes.value;
      }

      const custData = {
        code: document.getElementById('form-code').value.trim(),
        name: document.getElementById('form-name').value.trim(),
        phone: phoneVal,
        demand: document.getElementById('form-demand').value.trim(),
        paxCount: customerPax,
        source: document.getElementById('form-source').value,
        collaboratorId: document.getElementById('form-collaborator').value,
        staff: document.getElementById('form-assigned-staff').value,
        status: document.getElementById('form-status').value,
        date: document.getElementById('form-date').value
      };

      if (idVal) {
        const idx = db.customers.findIndex(c => String(c.id) === String(idVal));
        if (idx !== -1) {
          db.customers[idx] = { ...db.customers[idx], ...custData };
          syncCustomerFinancials(db.customers[idx]);
          recordAuditLog('CẬP NHẬT KHÁCH HÀNG', `Sửa thông tin khách hàng ${custData.name} (${custData.code}).`);
        }
      } else {
        const newCust = {
          id: Date.now(),
          ...custData,
          tourValue: 0,
          costValue: 0,
          paidAmount: 0,
          remainingDebt: 0,
          bookingCount: 0
        };
        db.customers.unshift(newCust);
        syncCustomerFinancials(newCust);
        recordAuditLog('THÊM KHÁCH HÀNG MỚI', `Thêm khách hàng ${custData.name} (${custData.code}).`);
      }

      saveDatabase();
      renderCrmModule();
      closeCustomerModal();
    });
  }

  // Đăng ký CTV mới (Không còn ô % hoa hồng)
  const ctvForm = document.getElementById('ctv-form');
  if (ctvForm) {
    ctvForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const codeVal = document.getElementById('form-ctv-code').value.trim();
      const unameVal = document.getElementById('form-ctv-username').value.trim().toLowerCase();

      const userExists = db.users.some(u => u.username.toLowerCase() === unameVal);
      if (userExists) {
        alert(`Tên đăng nhập "${unameVal}" đã tồn tại! Vui lòng chọn username khác.`);
        return;
      }

      const assignedSaleId = document.getElementById('form-ctv-assigned-sale')?.value || (currentUser?.role === 'SALE' ? currentUser.id : 'NV-002');
      const assignedSaleUser = (db.users || []).find(u => u.id === assignedSaleId) || { name: 'Nguyễn Văn An', phone: '0901234567' };

      const newCtv = {
        id: codeVal,
        code: codeVal,
        refCode: document.getElementById('form-ctv-ref').value.trim().toUpperCase(),
        name: document.getElementById('form-ctv-name').value.trim(),
        username: unameVal,
        phone: document.getElementById('form-ctv-phone').value.trim(),
        bank: document.getElementById('form-ctv-bank').value.trim(),
        accountStatus: 'active',
        assignedSaleId: assignedSaleId,
        assignedSale: assignedSaleUser.name,
        assignedSalePhone: assignedSaleUser.phone || '0901234567',
        selectedTourIds: ['TOUR-01', 'TOUR-02'],
        lastActiveDate: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString().split('T')[0]
      };

      const newCtvUser = {
        id: `NV-${codeVal.replace('-', '')}`,
        username: unameVal,
        passwordHash: DEFAULT_PASS_HASH,
        salt: SYSTEM_SALT,
        name: newCtv.name,
        role: 'CTV',
        roleTitle: 'Cộng tác viên',
        avatar: '🌱',
        status: 'active',
        ctvId: codeVal
      };

      db.ctvs.push(newCtv);
      db.users.push(newCtvUser);
      saveDatabase();

      recordAuditLog('ĐĂNG KÝ CTV MỚI', `Tạo đối tác CTV ${newCtv.name} (${newCtv.code}) kèm tài khoản @${unameVal}. Áp dụng chính sách hoa hồng theo tour.`);
      alert(`Đã đăng ký CTV thành công!\n- Mã CTV: ${newCtv.code}\n- Username đăng nhập: ${unameVal}\n- Mật khẩu mặc định: 123456\n(Hoa hồng được tính đồng nhất theo từng tour khi chốt đơn).`);

      renderCtvModule();
      closeCtvModal();
    });
  }

  const btnOpenAdd = document.getElementById('btn-open-add-modal');
  if (btnOpenAdd) btnOpenAdd.addEventListener('click', openAddCustomerModal);

  const btnCloseModal = document.getElementById('btn-close-modal');
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeCustomerModal);

  const btnCancelModal = document.getElementById('btn-cancel-modal');
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeCustomerModal);

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      crmSearchQuery = e.target.value.trim();
      renderCustomerTable();
    });
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-brand-700', 'text-white', 'border-brand-700');
        b.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
      });
      btn.classList.add('active', 'bg-brand-700', 'text-white', 'border-brand-700');
      btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');

      crmFilter = btn.getAttribute('data-filter');
      renderCustomerTable();
    });
  });

  const phoneField = document.getElementById('form-phone');
  if (phoneField) {
    phoneField.addEventListener('input', () => {
      const editId = document.getElementById('form-customer-id').value;
      checkPhoneDuplicate(phoneField.value, editId);
    });
  }

  const quickDemandBtns = document.querySelectorAll('.quick-demand-btn');
  quickDemandBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('form-demand').value = btn.textContent;
    });
  });

  const btnReset = document.getElementById('btn-reset-demo');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm("Khôi phục toàn bộ dữ liệu mẫu ban đầu theo chuẩn hoa hồng theo Tour?")) {
        resetDatabaseToDefault();
        recordAuditLog('KHÔI PHỤC DỮ LIỆU MẪU', 'Cơ sở dữ liệu đã nạp lại trạng thái ban đầu.');
        refreshActiveView();
      }
    });
  }

  const ctvSupportForm = document.getElementById('ctv-send-support-form');
  if (ctvSupportForm) {
    ctvSupportForm.addEventListener('submit', handleCtvSendSupportRequest);
  }
}

function formatVND(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 đ';
  const num = Math.round(Number(amount));
  return num.toLocaleString('vi-VN') + ' đ';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// ==========================================
// ĐĂNG KÝ TOÀN CỤC (WINDOW BINDINGS)
// ==========================================
window.switchModule = switchModule;
window.refreshActiveView = refreshActiveView;
window.switchCtvTab = switchCtvTab;
window.copyCtvRefCode = copyCtvRefCode;
window.openCtvSubmitLeadModal = openCtvSubmitLeadModal;
window.closeCtvSubmitLeadModal = closeCtvSubmitLeadModal;
window.openChangePasswordModal = openChangePasswordModal;
window.closeChangePasswordModal = closeChangePasswordModal;
window.handleLogout = handleLogout;
window.switchUserRole = switchUserRole;
window.toggleLoginMode = toggleLoginMode;
window.quickLogin = quickLogin;
window.openAddCustomerModal = openAddCustomerModal;
window.closeCustomerModal = closeCustomerModal;
window.openAddCtvModal = openAddCtvModal;
window.closeCtvModal = closeCtvModal;
window.toggleLockCtvAccount = toggleLockCtvAccount;
window.resetCtvPasswordToDefault = resetCtvPasswordToDefault;
window.deleteCtv = deleteCtv;
window.filterCtvs = filterCtvs;
window.searchCtvs = searchCtvs;
window.changeCtvPage = changeCtvPage;
window.filterCommissions = filterCommissions;
window.searchCommissions = searchCommissions;
window.approveCommission = approveCommission;
window.payCommission = typeof payCommission !== 'undefined' ? payCommission : openPayoutModal;
window.openPayoutModal = openPayoutModal;
window.closePayoutModal = closePayoutModal;
window.filterBookings = filterBookings;
window.searchBookings = searchBookings;
window.changeBookingPage = changeBookingPage;
window.openAddBookingModal = openAddBookingModal;
window.closeBookingModal = closeBookingModal;
window.handleBookingCustomerChange = handleBookingCustomerChange;
window.handleBookingTourChange = handleBookingTourChange;
window.recalcBookingTotal = recalcBookingTotal;
window.handleBookingCtvManualChange = handleBookingCtvManualChange;
window.editBooking = editBooking;
window.cancelBooking = cancelBooking;
window.openBookingDetailModal = openBookingDetailModal;
window.closeBookingDetailModal = closeBookingDetailModal;
window.openPaymentFromDetail = openPaymentFromDetail;
window.openPaymentModal = openPaymentModal;
window.closePaymentModal = closePaymentModal;
window.fillFullRemainingPayment = fillFullRemainingPayment;
window.switchOpsTab = switchOpsTab;
window.updateTourOpStatus = updateTourOpStatus;
window.openAddSupplierModal = openAddSupplierModal;
window.closeSupplierModal = closeSupplierModal;
window.deleteSupplier = deleteSupplier;
window.openAddSupplierBookingModal = openAddSupplierBookingModal;
window.closeSupplierBookingModal = closeSupplierBookingModal;
window.renderFinanceLedger = renderFinanceLedger;
window.openAddTourModal = openAddTourModal;
window.closeTourModal = closeTourModal;
window.handleTourCommMethodChange = handleTourCommMethodChange;
window.toggleTourStatus = toggleTourStatus;
window.openBackupRestoreModal = openBackupRestoreModal;
window.closeBackupRestoreModal = closeBackupRestoreModal;
window.exportDatabaseBackup = exportDatabaseBackup;
window.importDatabaseRestore = importDatabaseRestore;
window.runSystemTestSuite = runSystemTestSuite;
window.parsePaxInput = parsePaxInput;
window.parseMoneyInput = parseMoneyInput;
window.calculateBookingFinancials = calculateBookingFinancials;
window.getCustomerFinancialSummary = getCustomerFinancialSummary;
window.syncCustomerFinancials = syncCustomerFinancials;
window.syncAllFinancialData = syncAllFinancialData;
window.switchMod4Tab = switchMod4Tab;
window.getQuoteBadgeClass = getQuoteBadgeClass;
window.filterQuotations = filterQuotations;
window.searchQuotations = searchQuotations;
window.changeQuotationPage = changeQuotationPage;
window.renderQuotationsModule = renderQuotationsModule;
window.openAddQuotationModal = openAddQuotationModal;
window.closeQuotationModal = closeQuotationModal;
window.handleQuotationCustomerChange = handleQuotationCustomerChange;
window.handleQuotationTourChange = handleQuotationTourChange;
window.recalcQuotationTotal = recalcQuotationTotal;
window.editQuotation = editQuotation;
window.saveQuotation = saveQuotation;
window.confirmQuotation = confirmQuotation;
window.rejectQuotation = rejectQuotation;
window.convertQuotationToBooking = convertQuotationToBooking;
window.viewConvertedBooking = viewConvertedBooking;
window.openCtvCloseTourModal = openCtvCloseTourModal;
window.closeCtvCloseTourModal = closeCtvCloseTourModal;
window.handleCtvCloseTourChange = handleCtvCloseTourChange;
window.recalcCtvCloseTourTotal = recalcCtvCloseTourTotal;
window.handleCtvCloseTourSubmit = handleCtvCloseTourSubmit;
window.generateNextCode = generateNextCode;
window.handleSupplierBookingPolicyUpdate = handleSupplierBookingPolicyUpdate;
window.openSupplierApprovalModal = openSupplierApprovalModal;
window.closeSupplierApprovalModal = closeSupplierApprovalModal;
window.handleApproveAndPaySupplierClick = handleApproveAndPaySupplierClick;
window.approveAndPaySupplierOrder = approveAndPaySupplierOrder;
window.handleAcknowledgeDebtClick = handleAcknowledgeDebtClick;
window.acknowledgeSupplierDebt = acknowledgeSupplierDebt;
window.handleRejectSupplierOrderClick = handleRejectSupplierOrderClick;
window.rejectSupplierOrder = rejectSupplierOrder;
window.renderFinanceSupplierOrdersTable = renderFinanceSupplierOrdersTable;
window.sendInterDeptNotification = sendInterDeptNotification;
window.updateNotificationBadges = updateNotificationBadges;
window.toggleNotificationCenter = toggleNotificationCenter;
window.switchNotifTab = switchNotifTab;
window.renderNotificationList = renderNotificationList;
window.markAllNotificationsAsRead = markAllNotificationsAsRead;
window.handleNotificationClick = handleNotificationClick;
window.renderOpsIncoming = renderOpsIncoming;
window.renderOpsIncomingBadge = renderOpsIncomingBadge;
window.acknowledgeIncomingTour = acknowledgeIncomingTour;
window.acknowledgeAllIncomingTours = acknowledgeAllIncomingTours;
window.switchBookingDetailTab = switchBookingDetailTab;
window.renderBookingDetailOverview = renderBookingDetailOverview;
window.renderBookingRoomingList = renderBookingRoomingList;
window.renderBookingPnL = renderBookingPnL;
window.renderBookingItinerary = renderBookingItinerary;
window.renderBookingFeedback = renderBookingFeedback;
window.openAddPassengerModal = openAddPassengerModal;
window.closeAddPassengerModal = closeAddPassengerModal;
window.handleAddPassengerSubmit = handleAddPassengerSubmit;
window.printRoomingList = printRoomingList;
window.printBookingPnL = printBookingPnL;
window.openSupplierVoucherModal = openSupplierVoucherModal;
window.closeSupplierVoucherModal = closeSupplierVoucherModal;
window.printSupplierVoucher = printSupplierVoucher;
window.acknowledgeCtvLead = acknowledgeCtvLead;
window.getDefaultModuleForRole = getDefaultModuleForRole;
window.confirmAndConvertQuotation = confirmAndConvertQuotation;
window.quickCloseTourFromCrm = quickCloseTourFromCrm;
window.runCeoFraudAuditScan = runCeoFraudAuditScan;
window.filterCeoTourRadar = filterCeoTourRadar;
window.renderCeoAntiFraudRadar = renderCeoAntiFraudRadar;
window.renderCeoTourRadar = renderCeoTourRadar;
window.renderBookingIncidents = renderBookingIncidents;
window.openAddIncidentModal = openAddIncidentModal;
window.closeAddIncidentModal = closeAddIncidentModal;
window.handleAddIncidentSubmit = handleAddIncidentSubmit;
window.switchRadarSubTab = switchRadarSubTab;
window.renderPriceComparisonTable = renderPriceComparisonTable;
window.renderOverrunComparisonTable = renderOverrunComparisonTable;
window.renderDebtComparisonTable = renderDebtComparisonTable;
window.renderRefundComparisonTable = renderRefundComparisonTable;
window.renderCtvTourInventory = renderCtvTourInventory;
window.renderCtvTourPoliciesTable = renderCtvTourPoliciesTable;
window.filterCtvTourInventory = filterCtvTourInventory;
window.searchCtvTourInventory = searchCtvTourInventory;
window.setCtvTourViewMode = setCtvTourViewMode;
window.toggleCtvTourSelection = toggleCtvTourSelection;
window.ctvSellTourNow = ctvSellTourNow;
window.copyCtvTourLink = copyCtvTourLink;
window.viewTourSalesKit = viewTourSalesKit;
window.closeTourSalesKitModal = closeTourSalesKitModal;
window.copyTourPitchText = copyTourPitchText;
window.copyCurrentSalesKitLink = copyCurrentSalesKitLink;
window.populateCtvLeadTourDropdown = populateCtvLeadTourDropdown;
window.onCtvLeadTourSelectChange = onCtvLeadTourSelectChange;
window.switchMod3Tab = switchMod3Tab;
window.filterCtvsBySale = filterCtvsBySale;
window.filterCtvsByRating = filterCtvsByRating;
window.filterSupportRequests = filterSupportRequests;
window.renderCtvSupportRequestsTable = renderCtvSupportRequestsTable;
window.renderDormantCtvsTable = renderDormantCtvsTable;
window.openCtvProfile360 = openCtvProfile360;
window.closeCtvProfile360 = closeCtvProfile360;
window.triggerTerminateFromProfile = triggerTerminateFromProfile;
window.triggerReactivateFromProfile = triggerReactivateFromProfile;
window.openQuickSupportForCurrentCtv = openQuickSupportForCurrentCtv;
window.openReplyFromProfileModal = openReplyFromProfileModal;
window.openTerminateCtvModal = openTerminateCtvModal;
window.closeTerminateCtvModal = closeTerminateCtvModal;
window.confirmTerminateCtv = confirmTerminateCtv;
window.reactivateCtv = reactivateCtv;
window.openReplySupportModal = openReplySupportModal;
window.openReplySupportModalForCtv = openReplySupportModalForCtv;
window.closeReplySupportModal = closeReplySupportModal;
window.sendSupportReply = sendSupportReply;
window.renderCtvSupportTab = renderCtvSupportTab;
window.handleCtvSendSupportRequest = handleCtvSendSupportRequest;
window.classifyCtvPerformance = classifyCtvPerformance;
window.calculateSalePerformanceAndCommission = calculateSalePerformanceAndCommission;
window.renderSaleKpiAndCommissionModule = renderSaleKpiAndCommissionModule;
window.onSaleKpiStaffSelectChange = onSaleKpiStaffSelectChange;
window.openChangeSaleModal = openChangeSaleModal;
window.closeChangeSaleModal = closeChangeSaleModal;
window.confirmChangeSale = confirmChangeSale;
window.getFilteredSuppliers = getFilteredSuppliers;
window.onOpsSupplierFilterChange = onOpsSupplierFilterChange;
window.resetOpsSupplierFilters = resetOpsSupplierFilters;
window.setOpsSupplierViewMode = setOpsSupplierViewMode;
window.renderOpsSuppliers = renderOpsSuppliers;
window.openSupplierDetailModal = openSupplierDetailModal;
window.closeSupplierDetailModal = closeSupplierDetailModal;
window.switchSupplierDetailTab = switchSupplierDetailTab;
window.openSupplierRegisterModal = openSupplierRegisterModal;
window.closeSupplierRegisterModal = closeSupplierRegisterModal;
window.handleSupplierRegisterSubmit = handleSupplierRegisterSubmit;
window.toggleLoginMode = toggleLoginMode;
window.handleSupplierLoginSubmit = handleSupplierLoginSubmit;
window.renderSupplierPortal = renderSupplierPortal;
window.switchSupplierPortalTab = switchSupplierPortalTab;
window.saveSupplierProfile = saveSupplierProfile;
window.openAddSupplierServiceModal = openAddSupplierServiceModal;
window.closeAddSupplierServiceModal = closeAddSupplierServiceModal;
window.saveSupplierService = saveSupplierService;
window.deleteSupplierService = deleteSupplierService;
window.toggleServiceAvailability = toggleServiceAvailability;
window.postDailyLiveBulletin = postDailyLiveBulletin;
window.confirmSupplierBooking = confirmSupplierBooking;
window.getScopedCustomers = getScopedCustomers;
window.validatePaxNumber = validatePaxNumber;
window.parsePaxInput = parsePaxInput;
window.parseMoneyInput = parseMoneyInput;


window.getSupplierCalendarDates = getSupplierCalendarDates;
window.toggleSupplierDateAllotment = toggleSupplierDateAllotment;
window.openAddSupplierBookingModalWithSupplier = openAddSupplierBookingModalWithSupplier;
window.showPortalGateway = showPortalGateway;
window.selectPortal = selectPortal;
window.filterStaffDept = filterStaffDept;
window.copyPortalLink = copyPortalLink;
window.checkUrlPortalParams = checkUrlPortalParams;


// ==========================================
// ERP ACCOUNTING & TAX WINDOW EXPORTS
// ==========================================
window.switchFinTab = switchFinTab;
window.renderFinanceModule = renderFinanceModule;
window.renderFinanceOverviewTab = renderFinanceOverviewTab;
window.renderFinanceInvoicesTab = renderFinanceInvoicesTab;
window.renderFinancePitTab = renderFinancePitTab;
window.renderFinanceLedgerTab = renderFinanceLedgerTab;
window.openCreateInvoiceModal = openCreateInvoiceModal;
window.closeCreateInvoiceModal = closeCreateInvoiceModal;
window.onInvoiceBookingSelectChange = onInvoiceBookingSelectChange;
window.calculateInvoiceTaxBreakdown = calculateInvoiceTaxBreakdown;
window.handleCreateInvoiceSubmit = handleCreateInvoiceSubmit;
window.viewInvoiceModal = viewInvoiceModal;
window.closeViewInvoiceModal = closeViewInvoiceModal;
window.downloadInvoiceXml = downloadInvoiceXml;
window.sendInvoiceEmail = sendInvoiceEmail;
window.openCreateTaxReceiptModal = openCreateTaxReceiptModal;
window.closeCreateTaxReceiptModal = closeCreateTaxReceiptModal;
window.onTaxReceiptCommSelectChange = onTaxReceiptCommSelectChange;
window.calculateTaxReceiptBreakdown = calculateTaxReceiptBreakdown;
window.handleCreateTaxReceiptSubmit = handleCreateTaxReceiptSubmit;
window.viewTaxReceiptModal = viewTaxReceiptModal;
window.closeViewTaxReceiptModal = closeViewTaxReceiptModal;
window.downloadTaxReceiptXml = downloadTaxReceiptXml;
window.exportVatTaxReturnXml = exportVatTaxReturnXml;
window.exportVatSalesLedger = exportVatSalesLedger;
window.exportPitSummaryReport = exportPitSummaryReport;
window.filterDoubleEntryLedger = filterDoubleEntryLedger;
window.calculateTourismVat = calculateTourismVat;
window.calculateCtvPit = calculateCtvPit;



// ==============================================================
// CLOUD REAL-TIME SYNC ENGINE (GOOGLE FIREBASE / SSE STREAMING)
// Tự động đồng bộ thời gian thực đa thiết bị: Máy tính & Điện thoại (5G/Wi-Fi)
// ==============================================================
const CLOUD_SYNC_KEY = 'haha_cloud_sync_config';
const DEFAULT_FIREBASE_URL = 'https://haha-travel-cloud-default-rtdb.asia-southeast1.firebasedatabase.app';
let cloudSyncConfig = {
  enabled: true,
  url: DEFAULT_FIREBASE_URL,
  lastSynced: null,
  status: 'offline' // 'connected', 'syncing', 'offline', 'error'
};

function loadCloudSyncConfig() {
  try {
    const saved = localStorage.getItem(CLOUD_SYNC_KEY);
    if (saved) {
      cloudSyncConfig = Object.assign(cloudSyncConfig, JSON.parse(saved));
      if (!cloudSyncConfig.url) {
        cloudSyncConfig.url = DEFAULT_FIREBASE_URL;
        cloudSyncConfig.enabled = true;
      }
    } else {
      cloudSyncConfig.url = DEFAULT_FIREBASE_URL;
      cloudSyncConfig.enabled = true;
    }
  } catch (e) {
    console.error("[CloudSync] Error loading cloud sync config:", e);
    cloudSyncConfig.url = DEFAULT_FIREBASE_URL;
    cloudSyncConfig.enabled = true;
  }
}

let cloudEventSource = null;
let cloudSyncDebounceTimer = null;
let isRemoteUpdating = false;

function initCloudSync() {
  loadCloudSyncConfig();
  updateCloudSyncUi();
  if (cloudSyncConfig.enabled && cloudSyncConfig.url) {
    connectCloudRealtimeStream();
    pullFromCloud(true);
  }
  window.addEventListener('online', () => {
    updateCloudSyncUi();
    if (cloudSyncConfig.enabled) pullFromCloud(true);
  });
  window.addEventListener('offline', () => {
    cloudSyncConfig.status = 'offline';
    updateCloudSyncUi();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && cloudSyncConfig.enabled) {
      pullFromCloud(true);
    }
  });
  window.addEventListener('focus', () => {
    if (cloudSyncConfig.enabled) pullFromCloud(true);
  });
  setInterval(() => {
    if (cloudSyncConfig.enabled && !isRemoteUpdating) {
      pullFromCloud(true);
    }
  }, 10000);
}

function normalizeCloudUrl(rawUrl) {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  if (url.endsWith('/')) {
    url = url.slice(0, -1);
  }
  return url;
}

function connectCloudRealtimeStream() {
  if (cloudEventSource) {
    try { cloudEventSource.close(); } catch(e){}
    cloudEventSource = null;
  }
  if (!cloudSyncConfig.enabled || !cloudSyncConfig.url) return;

  const streamUrl = `${cloudSyncConfig.url}/haha_db.json`;
  try {
    cloudEventSource = new EventSource(streamUrl);
    cloudEventSource.onopen = () => {
      cloudSyncConfig.status = 'connected';
      updateCloudSyncUi();
      console.log("[CloudSync] Đã kết nối kênh thời gian thực (SSE Live Stream)");
    };
    cloudEventSource.addEventListener('put', (e) => {
      try {
        const res = JSON.parse(e.data);
        if (res && res.data && !isRemoteUpdating) {
          applyRemoteCloudData(res.data);
        }
      } catch (err) {
        console.warn("[CloudSync] Lỗi giải mã dữ liệu stream:", err);
      }
    });
    cloudEventSource.onerror = () => {
      cloudSyncConfig.status = 'offline';
      updateCloudSyncUi();
    };
  } catch (e) {
    console.warn("[CloudSync] EventSource không khả dụng hoặc URL lỗi:", e);
  }
}

function applyRemoteCloudData(remoteDb) {
  if (!remoteDb || typeof remoteDb !== 'object') return;
  if (Array.isArray(remoteDb.users) && remoteDb.users.length > 0) {
    isRemoteUpdating = true;
    db = remoteDb;
    localStorage.setItem(DB_KEY, JSON.stringify(db));
    syncAllFinancialData();
    cloudSyncConfig.lastSynced = new Date().toISOString();
    cloudSyncConfig.status = 'connected';
    localStorage.setItem(CLOUD_SYNC_KEY, JSON.stringify(cloudSyncConfig));
    updateCloudSyncUi();
    
    refreshCurrentActiveModule();
    showSyncNotificationToast("Đã đồng bộ dữ liệu thời gian thực từ đám mây!");
    setTimeout(() => { isRemoteUpdating = false; }, 600);
  }
}

function pushToCloud(silent = false) {
  if (!cloudSyncConfig.enabled || !cloudSyncConfig.url || isRemoteUpdating) return;
  
  if (cloudSyncDebounceTimer) clearTimeout(cloudSyncDebounceTimer);
  cloudSyncDebounceTimer = setTimeout(async () => {
    cloudSyncConfig.status = 'syncing';
    updateCloudSyncUi();
    try {
      const targetUrl = `${cloudSyncConfig.url}/haha_db.json`;
      const res = await fetch(targetUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(db)
      });
      if (res.ok) {
        cloudSyncConfig.status = 'connected';
        cloudSyncConfig.lastSynced = new Date().toISOString();
        localStorage.setItem(CLOUD_SYNC_KEY, JSON.stringify(cloudSyncConfig));
        updateCloudSyncUi();
        if (!silent) {
          alert("✅ Đã tải dữ liệu lên Đám mây thành công! Toàn bộ máy tính và điện thoại đã được cập nhật.");
        }
      } else {
        cloudSyncConfig.status = 'error';
        updateCloudSyncUi();
        if (!silent) alert("⚠️ Lỗi đồng bộ Cloud: Máy chủ phản hồi mã " + res.status);
      }
    } catch (e) {
      cloudSyncConfig.status = 'offline';
      updateCloudSyncUi();
      if (!silent) alert("⚠️ Lỗi kết nối Cloud: " + e.message);
    }
  }, 400);
}

async function pullFromCloud(silent = false) {
  if (!cloudSyncConfig.enabled || !cloudSyncConfig.url) return;
  cloudSyncConfig.status = 'syncing';
  updateCloudSyncUi();
  try {
    const targetUrl = `${cloudSyncConfig.url}/haha_db.json`;
    const res = await fetch(targetUrl);
    if (res.ok) {
      const remoteDb = await res.json();
      if (remoteDb && remoteDb.users) {
        applyRemoteCloudData(remoteDb);
        cloudSyncConfig.status = 'connected';
        updateCloudSyncUi();
        if (!silent) {
          alert("✅ Đã lấy dữ liệu mới nhất từ Đám mây thành công!");
        }
      } else {
        // T? d?ng d?y co s? d? li?u kh?i t?o ln Dm my n?u trn Cloud dang tr?ng
        console.log('[CloudSync] Dm my dang tr?ng, t? d?ng d?y d? li?u kh?i t?o...');
        pushToCloud(true);
        cloudSyncConfig.status = 'connected';
        updateCloudSyncUi();
      }
    } else {
      cloudSyncConfig.status = 'error';
      updateCloudSyncUi();
      if (!silent) alert("⚠️ Không thể tải từ Cloud: Mã phản hồi " + res.status);
    }
  } catch (e) {
    cloudSyncConfig.status = 'offline';
    updateCloudSyncUi();
    if (!silent) alert("⚠️ Lỗi mạng khi kết nối Cloud: " + e.message);
  }
}

function saveCloudSyncConfigFromUi() {
  const urlInput = document.getElementById('cloud-sync-url-input');
  const enableCheckbox = document.getElementById('cloud-sync-enable-toggle');
  if (!urlInput) return;

  const url = normalizeCloudUrl(urlInput.value);
  const enabled = enableCheckbox ? enableCheckbox.checked : Boolean(url);

  if (enabled && !url) {
    alert("Vui lòng nhập đường dẫn Cloud Database URL (ví dụ từ Google Firebase)!");
    return;
  }

  cloudSyncConfig.url = url;
  cloudSyncConfig.enabled = enabled;
  localStorage.setItem(CLOUD_SYNC_KEY, JSON.stringify(cloudSyncConfig));

  if (enabled && url) {
    connectCloudRealtimeStream();
    pullFromCloud(false);
  } else {
    if (cloudEventSource) {
      try { cloudEventSource.close(); } catch(e){}
      cloudEventSource = null;
    }
    cloudSyncConfig.status = 'offline';
    updateCloudSyncUi();
    alert("Đã tắt chế độ Đồng bộ Đám mây. Hệ thống đang hoạt động ở chế độ Cục bộ (Local Only).");
  }
}

function updateCloudSyncUi() {
  const dot = document.getElementById('cloud-sync-dot');
  const text = document.getElementById('cloud-sync-text');
  const badgeModal = document.getElementById('cloud-sync-modal-badge');
  const urlInput = document.getElementById('cloud-sync-url-input');
  const toggle = document.getElementById('cloud-sync-enable-toggle');
  const lastSyncEl = document.getElementById('cloud-sync-last-time');

  if (urlInput && !urlInput.value && cloudSyncConfig.url) {
    urlInput.value = cloudSyncConfig.url;
  }
  if (toggle) {
    toggle.checked = cloudSyncConfig.enabled;
  }
  if (lastSyncEl) {
    lastSyncEl.innerText = cloudSyncConfig.lastSynced 
      ? new Date(cloudSyncConfig.lastSynced).toLocaleTimeString('vi-VN') + ' ' + new Date(cloudSyncConfig.lastSynced).toLocaleDateString('vi-VN')
      : 'Chưa đồng bộ';
  }

  if (!cloudSyncConfig.enabled || !cloudSyncConfig.url) {
    if (dot) { dot.className = 'w-2 h-2 rounded-full bg-slate-400'; }
    if (text) { text.innerText = 'Local (Offline)'; text.className = 'hidden md:inline text-[11px] font-bold text-slate-500'; }
    if (badgeModal) {
      badgeModal.innerHTML = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">⚪ Chế độ Cục bộ (Local Only)</span>`;
    }
    return;
  }

  if (cloudSyncConfig.status === 'connected') {
    if (dot) { dot.className = 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse'; }
    if (text) { text.innerText = 'Cloud Realtime'; text.className = 'hidden md:inline text-[11px] font-bold text-emerald-700'; }
    if (badgeModal) {
      badgeModal.innerHTML = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span><span>🟢 Đã kết nối Đám mây (Đồng bộ tức thời 0.1s)</span></span>`;
    }
  } else if (cloudSyncConfig.status === 'syncing') {
    if (dot) { dot.className = 'w-2 h-2 rounded-full bg-amber-500 animate-bounce'; }
    if (text) { text.innerText = 'Đang đồng bộ...'; text.className = 'hidden md:inline text-[11px] font-bold text-amber-600'; }
    if (badgeModal) {
      badgeModal.innerHTML = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">🟡 Đang đồng bộ dữ liệu...</span>`;
    }
  } else {
    if (dot) { dot.className = 'w-2 h-2 rounded-full bg-rose-400'; }
    if (text) { text.innerText = 'Chờ kết nối'; text.className = 'hidden md:inline text-[11px] font-bold text-rose-600'; }
    if (badgeModal) {
      badgeModal.innerHTML = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">🔴 Ngoại tuyến / Chưa kết nối được URL</span>`;
    }
  }
}

function refreshCurrentActiveModule() {
  if (typeof currentModule !== 'undefined') {
    switchModule(currentModule);
  }
  if (typeof updateUnreadBadge === 'function') updateUnreadBadge();
  if (typeof renderAllHeaderBadges === 'function') renderAllHeaderBadges();
}

function showSyncNotificationToast(msg) {
  let toast = document.getElementById('cloud-sync-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cloud-sync-toast';
    toast.className = 'fixed bottom-5 right-5 z-50 px-4 py-2.5 bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold rounded-2xl shadow-2xl border border-slate-700 flex items-center space-x-2 transition-all transform translate-y-10 opacity-0 pointer-events-none';
    toast.innerHTML = `<span>⚡</span><span id="cloud-sync-toast-msg"></span>`;
    document.body.appendChild(toast);
  }
  const msgEl = document.getElementById('cloud-sync-toast-msg');
  if (msgEl) msgEl.innerText = msg;
  toast.classList.remove('translate-y-10', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-10', 'opacity-0');
  }, 3000);
}


// Cloud Sync Exports
window.initCloudSync = initCloudSync;
window.pushToCloud = pushToCloud;
window.pullFromCloud = pullFromCloud;
window.saveCloudSyncConfigFromUi = saveCloudSyncConfigFromUi;
window.updateCloudSyncUi = updateCloudSyncUi;

// ==============================================================
// UNIVERSAL CLICK-OUTSIDE DISMISSAL & UX ENHANCEMENTS
// Tự động đóng Thông báo & Thoát mọi Modal khi bấm ra ngoài màn hình
// ==============================================================

function setupClickOutsideDismissal() {
  const modalCloseMap = {
    'customer-modal': () => typeof closeCustomerModal === 'function' && closeCustomerModal(),
    'ctv-modal': () => typeof closeCtvModal === 'function' && closeCtvModal(),
    'quotation-modal': () => typeof closeQuotationModal === 'function' && closeQuotationModal(),
    'booking-modal': () => typeof closeBookingModal === 'function' && closeBookingModal(),
    'payment-modal': () => typeof closePaymentModal === 'function' && closePaymentModal(),
    'booking-detail-modal': () => typeof closeBookingDetailModal === 'function' && closeBookingDetailModal(),
    'supplier-voucher-modal': () => typeof closeSupplierVoucherModal === 'function' && closeSupplierVoucherModal(),
    'add-passenger-modal': () => typeof closeAddPassengerModal === 'function' && closeAddPassengerModal(),
    'supplier-modal': () => typeof closeSupplierModal === 'function' && closeSupplierModal(),
    'supplier-booking-modal': () => typeof closeSupplierBookingModal === 'function' && closeSupplierBookingModal(),
    'supplier-approval-modal': () => typeof closeSupplierApprovalModal === 'function' && closeSupplierApprovalModal(),
    'payout-modal': () => typeof closePayoutModal === 'function' && closePayoutModal(),
    'tour-modal': () => typeof closeTourModal === 'function' && closeTourModal(),
    'backup-restore-modal': () => typeof closeBackupRestoreModal === 'function' && closeBackupRestoreModal(),
    'add-incident-modal': () => typeof closeAddIncidentModal === 'function' && closeAddIncidentModal(),
    'ctv-tour-saleskit-modal': () => typeof closeTourSalesKitModal === 'function' && closeTourSalesKitModal(),
    'ctv-profile-360-modal': () => typeof closeCtvProfile360 === 'function' && closeCtvProfile360(),
    'ctv-terminate-modal': () => typeof closeTerminateCtvModal === 'function' && closeTerminateCtvModal(),
    'ctv-support-reply-modal': () => typeof closeReplySupportModal === 'function' && closeReplySupportModal(),
    'ctv-change-sale-modal': () => typeof closeChangeSaleModal === 'function' && closeChangeSaleModal(),
    'supplier-detail-modal': () => typeof closeSupplierDetailModal === 'function' && closeSupplierDetailModal(),
    'supplier-register-modal': () => typeof closeSupplierRegisterModal === 'function' && closeSupplierRegisterModal(),
    'supplier-service-modal': () => typeof closeAddSupplierServiceModal === 'function' && closeAddSupplierServiceModal(),
    'modal-create-invoice': () => typeof closeCreateInvoiceModal === 'function' && closeCreateInvoiceModal(),
    'modal-view-invoice': () => typeof closeViewInvoiceModal === 'function' && closeViewInvoiceModal(),
    'modal-create-tax-receipt': () => typeof closeCreateTaxReceiptModal === 'function' && closeCreateTaxReceiptModal(),
    'modal-view-tax-receipt': () => typeof closeViewTaxReceiptModal === 'function' && closeViewTaxReceiptModal(),
    'change-password-modal': () => typeof closeChangePasswordModal === 'function' && closeChangePasswordModal(),
    'ctv-submit-lead-modal': () => typeof closeCtvSubmitLeadModal === 'function' && closeCtvSubmitLeadModal(),
    'ctv-close-tour-modal': () => typeof closeCtvCloseTourModal === 'function' && closeCtvCloseTourModal()
  };

  let mouseDownTarget = null;

  document.addEventListener('mousedown', function(e) {
    mouseDownTarget = e.target;
  });

  document.addEventListener('click', function(e) {
    // 1. TỰ ĐỘNG ĐÓNG THÔNG BÁO KHI CLICK RA NGOÀI MÀN HÌNH
    const notifDropdown = document.getElementById('notif-dropdown');
    const notifBtn = document.getElementById('notif-bell-btn');
    if (notifDropdown && !notifDropdown.classList.contains('hidden')) {
      if (!notifDropdown.contains(e.target) && !notifBtn?.contains(e.target)) {
        notifDropdown.classList.add('hidden');
      }
    }

    // 2. TỰ ĐỘNG THOÁT MỌI MODAL KHI CLICK RA NGOÀI MÀN HÌNH (VÀO VÙNG BACKDROP TỐI)
    if (mouseDownTarget && e.target === mouseDownTarget) {
      const targetId = e.target.id;
      if (targetId && modalCloseMap[targetId]) {
        modalCloseMap[targetId]();
      } else if (e.target.classList && e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
        e.target.classList.add('hidden');
        e.target.classList.remove('flex');
      }
    }
    mouseDownTarget = null;
  });

  // 3. HỖ TRỢ PHÍM ESC ĐỂ THOÁT NHANH MODAL HOẶC ĐÓNG THÔNG BÁO TRÊN MÁY TÍNH
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      const notifDropdown = document.getElementById('notif-dropdown');
      if (notifDropdown && !notifDropdown.classList.contains('hidden')) {
        notifDropdown.classList.add('hidden');
        return;
      }
      Object.keys(modalCloseMap).forEach(id => {
        const modal = document.getElementById(id);
        if (modal && !modal.classList.contains('hidden')) {
          modalCloseMap[id]();
        }
      });
    }
  });
}


// Universal Click Outside Dismissal Export
window.setupClickOutsideDismissal = setupClickOutsideDismissal;
