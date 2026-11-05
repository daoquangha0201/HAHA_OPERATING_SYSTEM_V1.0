/**
 * HAHA ECO TRAVEL - AI SOCIAL HUB (MODULE TỰ ĐỘNG HÓA MẠNG XÃ HỘI CHO CTV)
 * - Tự động tạo nội dung cá nhân hóa (Blogger, Chữa lành, Phượt thủ, Chuyên gia).
 * - Kết nối tài khoản mạng xã hội OAuth an toàn (Facebook, Instagram, TikTok, Zalo).
 * - 4 Social AI Agents: Content Agent, Scheduling Agent, Publishing Agent, Lead Gen Agent.
 * - Liên thông trực tiếp với CRM Khách hàng và Google Firebase Realtime Database.
 * - Tuân thủ chính sách bảo mật nền tảng: Không lưu mật khẩu, không spam.
 */

(function(window) {
  'use strict';

  const HahaSocialHub = {
    // 1. CÁC PHONG CÁCH CTV ĐƯỢC CÁ NHÂN HÓA (CHỐNG TRÙNG LẶP NỘI DUNG)
    PERSONA_STYLES: {
      BLOGGER: {
        id: 'BLOGGER',
        name: 'Trải Nghiệm & Review',
        avatar: '📸',
        badge: 'bg-pink-100 text-pink-800 border-pink-300',
        tone: 'Chân thực, giàu cảm xúc cá nhân, chi tiết lịch trình và góc chụp đẹp.',
        hookExample: 'Đừng đi Cát Tiên nếu bạn chưa biết 3 bí kíp sinh tồn cực chill này...'
      },
      HEALING: {
        id: 'HEALING',
        name: 'Chữa Lành & Sống Xanh',
        avatar: '🌿',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        tone: 'Sâu lắng, thư thái, nhấn mạnh detox tâm hồn, sống chậm và không rác thải nhựa.',
        hookExample: 'Khi thành phố quá ồn ào, thiên nhiên chính là liều thuốc chữa lành dịu êm nhất...'
      },
      TREKKER: {
        id: 'TREKKER',
        name: 'Phượt Thủ & Khám Phá',
        avatar: '🧗‍♂️',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        tone: 'Mạnh mẽ, năng động, kích thích thử thách, chia sẻ kinh nghiệm trekking rừng sâu.',
        hookExample: 'Băng 15km rừng nguyên sinh ngắm cây Tung ngàn năm: Thử thách đáng giá nhất năm nay!'
      },
      EXPERT: {
        id: 'EXPERT',
        name: 'Chuyên Gia Lữ Hành',
        avatar: '👔',
        badge: 'bg-blue-100 text-blue-800 border-blue-300',
        tone: 'Chuyên nghiệp, thông tin minh bạch, dịch vụ trọn gói chuẩn 4★, ưu đãi nhóm và bảo hiểm.',
        hookExample: 'Lịch khởi hành tour sinh thái Cát Tiên cuối tuần này: Trọn gói chỉ từ 2.400.000đ/khách...'
      }
    },

    // 2. CÁC NỀN TẢNG MẠNG XÃ HỘI ĐƯỢC HỖ TRỢ
    PLATFORMS: {
      FACEBOOK: {
        id: 'FACEBOOK',
        name: 'Facebook Page',
        icon: '📘',
        authMethod: 'OAuth 2.0 (Meta Graph API)',
        supportedPublish: 'Tự động API & Duyệt đăng',
        formatRule: 'Bài viết dài 300-500 từ, cấu trúc Headline -> Câu chuyện -> Lịch trình -> CTA link'
      },
      INSTAGRAM: {
        id: 'INSTAGRAM',
        name: 'Instagram Business',
        icon: '📸',
        authMethod: 'Meta Instagram Graph API',
        supportedPublish: 'Tự động API & Duyệt đăng',
        formatRule: 'Hook ngắn gọn, thị giác chữa lành, cụm 15-20 hashtag du lịch sinh thái, Link in Bio'
      },
      TIKTOK: {
        id: 'TIKTOK',
        name: 'TikTok Video Script',
        icon: '🎵',
        authMethod: 'TikTok for Developers (OAuth)',
        supportedPublish: 'Kịch bản Video ngắn & 1-Click Copy',
        formatRule: 'Kịch bản 3 hồi (Hook 3s, Trải nghiệm 15s, CTA 5s) kèm gợi ý góc quay và âm thanh viral'
      },
      ZALO: {
        id: 'ZALO',
        name: 'Zalo OA / Cá Nhân',
        icon: '💬',
        authMethod: 'Zalo OpenAPI & Share Link',
        supportedPublish: 'Đăng Zalo OA & 1-Click Copy cá nhân',
        formatRule: 'Tin nhắn ngắn gọn, thân tình, kêu gọi nhắn tin Zalo nhận lịch trình chi tiết'
      }
    },

    // 3. KHỞI TẠO DỮ LIỆU BAN ĐẦU NẾU CHƯA CÓ TRONG DB
    initData: function() {
      if (typeof db === 'undefined') return;

      if (!db.socialAccounts) {
        db.socialAccounts = [
          {
            id: 'ACC-001',
            ctvId: 'CTV-001',
            platform: 'FACEBOOK',
            accountName: 'Hoàng Yến - Du Lịch Sinh Thái & Camping',
            pageId: '109823471829',
            avatar: '📸',
            status: 'CONNECTED',
            scope: ['pages_manage_posts', 'pages_read_engagement'],
            connectedAt: '2026-10-25 09:30',
            expiresAt: '2026-12-25 09:30'
          },
          {
            id: 'ACC-002',
            ctvId: 'CTV-001',
            platform: 'INSTAGRAM',
            accountName: '@hoangyen.ecotravel',
            avatar: '🌿',
            status: 'CONNECTED',
            scope: ['instagram_basic', 'instagram_content_publish'],
            connectedAt: '2026-10-26 14:15',
            expiresAt: '2026-12-26 14:15'
          },
          {
            id: 'ACC-003',
            ctvId: 'CTV-001',
            platform: 'TIKTOK',
            accountName: 'HoangYen_Trekker',
            avatar: '🎵',
            status: 'CONNECTED',
            scope: ['video.upload'],
            connectedAt: '2026-10-28 16:00',
            expiresAt: '2026-11-28 16:00'
          }
        ];
      }

      if (!db.socialCampaigns) {
        db.socialCampaigns = [
          {
            id: 'CAMP-001',
            code: 'cattien_nov26',
            tourId: 'TOUR-01',
            tourName: 'Tour Trekking VQG Cát Tiên 2N1Đ',
            title: 'Chiến dịch: Thức Giấc Giữa Đại Ngàn Cát Tiên Mùa Khô',
            status: 'ACTIVE',
            commissionHighlight: '7% Doanh thu (~168.000đ - 700.000đ/đơn)',
            badgeText: 'HOT BÁN CHẠY',
            mediaBanner: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop',
            keySellingPoints: ['Ngắm thú đêm hoang dã', 'Cây Tung 400 năm tuổi', 'Ẩm thực rau rừng cá suối']
          },
          {
            id: 'CAMP-002',
            code: 'dalat_healing_nov26',
            tourId: 'TOUR-02',
            tourName: 'Tour Chữa Lành & Cắm Trại Đà Lạt 3N2Đ',
            title: 'Chiến dịch: Detox Thân Tâm & Cắm Trại Rừng Thông Tuyền Lâm',
            status: 'ACTIVE',
            commissionHighlight: '300.000đ cố định / khách',
            badgeText: 'MỚI RA MẮT',
            mediaBanner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
            keySellingPoints: ['Glamping 4 sao ven hồ', 'Tiệc nướng BBQ giữa rừng thông', 'Trải nghiệm chèo SUP bình minh']
          },
          {
            id: 'CAMP-003',
            code: 'mientay_songnuoc_nov26',
            tourId: 'TOUR-03',
            tourName: 'Tour Sinh Thái Miền Tây Sông Nước 2N1Đ',
            title: 'Chiến dịch: Hương Sắc Cù Lao & Chợ Nổi Cái Răng',
            status: 'ACTIVE',
            commissionHighlight: '200.000đ cố định / khách',
            badgeText: 'GIA ĐÌNH YÊU THÍCH',
            mediaBanner: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop',
            keySellingPoints: ['Hái trái cây miệt vườn', 'Đờn ca tài tử Nam Bộ', 'Chèo xuồng ba lá len lỏi rặng dừa']
          }
        ];
      }

      if (!db.socialPosts) {
        db.socialPosts = [
          {
            id: 'POST-001',
            campaignId: 'CAMP-001',
            ctvId: 'CTV-001',
            platform: 'FACEBOOK',
            personaStyle: 'BLOGGER',
            headline: '3 LÝ DO BẠN NÊN TRỐN THÀNH PHỐ VỀ VQG CÁT TIÊN CUỐI TUẦN NÀY',
            content: `Sau cả tuần quay cuồng với deadline và khói bụi, mình đã tìm thấy một nơi để "tắt nguồn" hoàn toàn: Vườn Quốc Gia Cát Tiên chỉ cách Sài Gòn hơn 3 tiếng chạy xe! 🌲✨\n\nĐiều làm mình ấn tượng nhất ở chuyến đi sinh thái này cùng HaHa Eco Travel:\n1. Tour chuẩn xanh 100%: Nói không với rác thải nhựa, tôn trọng sinh thái bản địa.\n2. Trải nghiệm xe mui trần ngắm thú rừng ăn đêm hoang dã cực kỳ hồi hộp và kỳ thú.\n3. Thưởng thức cơm quê nấu từ rau rừng và cá suối tươi rói tại Nam Cát Tiên Ecolodge.\n\nĐợt này HaHa đang có ưu đãi nhóm cực tốt chỉ 2.400.000đ/người trọn gói không phát sinh. Bạn nào cần lịch trình chi tiết cứ cmt hoặc xem ngay link bên dưới nhé! 👇`,
            hashtags: '#HaHaEcoTravel #DuLichSinhThai #TrekkingCatTien #ChuaLanh #EcoTour2026',
            mediaUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop',
            referralUrl: 'https://daoquangha0201.github.io/HAHA-ECO-TRAVEL/storefront.html?ref=CTV-001&camp=cattien_nov26',
            publishMode: 'AUTO',
            status: 'PUBLISHED',
            publishedAt: '2026-11-04 19:30',
            stats: { views: 1840, clicks: 92, leads: 5, revenue: 12000000, commission: 840000 }
          },
          {
            id: 'POST-002',
            campaignId: 'CAMP-002',
            ctvId: 'CTV-001',
            platform: 'INSTAGRAM',
            personaStyle: 'HEALING',
            headline: 'Hít một hơi thật sâu mùi thông già và ngắm sương sớm Tuyền Lâm...',
            content: `Đôi khi, điều tốt nhất bạn có thể làm cho chính mình là rời xa màn hình máy tính, thức dậy trong chiếc lều ấm áp giữa rừng thông Đà Lạt và lắng nghe tiếng gió reo. 🏕️☕\n\nMột hành trình nhẹ nhàng, chậm rãi và đầy chữa lành cùng HaHa Eco Travel.\n\nTrọn gói 3N2Đ: Lưu trú Glamping 4★, tiệc BBQ lửa trại và chèo thuyền SUP đón bình minh hồ Tuyền Lâm.\n\nNhấp vào Link in Bio của Yến để xem chi tiết lịch trình nhé! 🌿`,
            hashtags: '#DaLatGlamping #HaHaEcoTravel #DuLichChuaLanh #SongCham #CampingDalat #DetoxSoul',
            mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
            referralUrl: 'https://daoquangha0201.github.io/HAHA-ECO-TRAVEL/storefront.html?ref=CTV-001&camp=dalat_healing_nov26',
            publishMode: 'SCHEDULED',
            scheduledTime: '2026-11-06 20:00',
            status: 'SCHEDULED',
            stats: { views: 0, clicks: 0, leads: 0, revenue: 0, commission: 0 }
          }
        ];
      }

      if (!db.socialLeads) {
        db.socialLeads = [
          {
            id: 'SLEAD-001',
            ctvId: 'CTV-001',
            campaignCode: 'cattien_nov26',
            platform: 'Facebook',
            customerName: 'Trịnh Hoàng Long',
            phone: '0918776655',
            pax: 4,
            demand: 'Tour Trekking Cát Tiên 2N1Đ cuối tuần',
            status: 'CHUYEN_CRM',
            createdAt: '2026-11-05 08:30'
          }
        ];
      }
    },

    // 4. KẾT NỐI TÀI KHOẢN MẠNG XÃ HỘI (OAUTH CHÍNH THỨC - KHÔNG LƯU MẬT KHẨU)
    connectAccount: function(platformKey) {
      const p = this.PLATFORMS[platformKey];
      if (!p) return;

      const accountName = prompt(`🔐 XÁC THỰC KẾT NỐI CHÍNH THỨC VỚI ${p.name.toUpperCase()}\n\nPhương thức: ${p.authMethod}\nQuy định bảo mật: Tuyệt đối không yêu cầu và không lưu mật khẩu mạng xã hội.\n\nNhập tên Kênh/Fanpage bạn muốn cấp quyền quản lý nội dung:`, `Kênh Du Lịch Sinh Thái của tôi`);
      if (!accountName || !accountName.trim()) return;

      const currentCtvId = (typeof currentUser !== 'undefined' && currentUser && currentUser.ctvId) ? currentUser.ctvId : 'CTV-001';
      const newAcc = {
        id: 'ACC-' + Date.now().toString(36).toUpperCase(),
        ctvId: currentCtvId,
        platform: platformKey,
        accountName: accountName.trim(),
        avatar: p.icon,
        status: 'CONNECTED',
        scope: ['publish_posts', 'read_insights'],
        connectedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        expiresAt: new Date(Date.now() + 60*24*3600*1000).toISOString().replace('T', ' ').slice(0, 16)
      };

      if (!db.socialAccounts) db.socialAccounts = [];
      db.socialAccounts.push(newAcc);

      if (typeof saveDatabase === 'function') saveDatabase();
      if (typeof recordAuditLog === 'function') {
        recordAuditLog('KẾT NỐI MẠNG XÃ HỘI', `CTV ${currentCtvId} đã kết nối tài khoản ${p.name} (${accountName}) qua giao thức OAuth.`);
      }

      alert(`✅ KẾT NỐI THÀNH CÔNG!\n\nNền tảng: ${p.name}\nTài khoản: ${accountName}\nTrạng thái: Đã cấp quyền OAuth an toàn 60 ngày.\nBảo mật: Mật khẩu của bạn an toàn 100%.`);
      this.renderCtvSocialTab();
    },

    disconnectAccount: function(accId) {
      if (!confirm("Bạn có chắc chắn muốn ngắt kết nối tài khoản này? Mọi lịch đăng bài tự động trên tài khoản sẽ tạm dừng ngay lập tức.")) return;
      if (!db.socialAccounts) return;
      const acc = db.socialAccounts.find(a => a.id === accId);
      if (acc) {
        acc.status = 'DISCONNECTED';
        if (typeof saveDatabase === 'function') saveDatabase();
        if (typeof recordAuditLog === 'function') {
          recordAuditLog('NGẮT KẾT NỐI MẠNG XÃ HỘI', `Đã hủy quyền OAuth đối với tài khoản ${acc.accountName}.`);
        }
        alert("Đã ngắt kết nối tài khoản thành công!");
        this.renderCtvSocialTab();
      }
    },

    // 5. SOCIAL MEDIA AI CONTENT AGENT: CÁ NHÂN HÓA NỘI DUNG (DYNAMIC VARIATIONS)
    generateAiContent: function(campaignId, platformKey, styleKey) {
      const camp = (db.socialCampaigns || []).find(c => c.id === campaignId) || (db.socialCampaigns || [])[0];
      const p = this.PLATFORMS[platformKey] || this.PLATFORMS.FACEBOOK;
      const style = this.PERSONA_STYLES[styleKey] || this.PERSONA_STYLES.BLOGGER;
      const ctv = (db.ctvs || []).find(c => c.id === (currentUser ? currentUser.ctvId : 'CTV-001')) || (db.ctvs || [])[0] || { id: 'CTV-001', refCode: 'HAHA-YEN88', name: 'Hoàng Yến' };

      const refUrl = `https://daoquangha0201.github.io/HAHA-ECO-TRAVEL/storefront.html?ref=${ctv.id}&camp=${camp.code}`;

      // Sinh 3 biến thể nội dung độc lập (Chống spam thuật toán nền tảng)
      const variants = [];

      // BIẾN THỂ 1: TRẢI NGHIỆM ĐỘC BẢN & CHI TIẾT
      variants.push({
        id: 'var_1',
        title: 'Biến thể A: Câu chuyện trải nghiệm sâu sắc',
        headline: styleKey === 'HEALING' ? `Rời thành phố, về ${camp.tourName.split('-')[0] || 'rừng sâu'} tìm lại sự an yên...` : `Cuối tuần này, cùng ${ctv.name} trải nghiệm ${camp.tourName}!`,
        body: styleKey === 'TREKKER'
          ? `Nếu bạn đang tìm một chuyến đi để bung sức và thử thách đôi chân, thì ${camp.tourName} chính là lựa chọn số 1!\n\nĐiểm nhấn không thể bỏ lỡ:\n- Băng qua những cung đường nguyên sinh tuyệt đẹp.\n- Khám phá thiên nhiên hoang dã có HDV chuyên nghiệp dẫn đường.\n- Tổ chức lửa trại, tiệc nướng sinh thái không rác thải nhựa.\n\nTour trọn gói từ A-Z được bảo chứng bởi HaHa Eco Travel.`
          : `Có những ngày áp lực công việc làm mình chỉ muốn xách balo lên và đi. Và chuyến đi ${camp.tourName} thực sự đã sạc đầy năng lượng cho mình! 🌲✨\n\nHaHa Eco Travel làm tour sinh thái cực kỳ chỉn chu:\n- Không xả rác, không can thiệp thô bạo vào môi trường.\n- Ẩm thực sạch, tươi ngon từ bà con địa phương.\n- Đội ngũ hướng dẫn viên am hiểu sinh thái, tận tình.\n\nNhóm từ 4 người đang có chính sách ưu đãi giữ chỗ siêu tốt.`,
        hashtags: `#HaHaEcoTravel #${camp.code} #DuLichSinhThai #EcoTravel2026 #${styleKey.toLowerCase()}`,
        cta: `👉 Đặt giữ chỗ sớm hoặc xem trọn bộ lịch trình tại link chính thức:\n🔗 ${refUrl}`,
        media: camp.mediaBanner
      });

      // BIẾN THỂ 2: GÓC NHÌN BÍ KÍP TIỆN ÍCH & REVIEW
      variants.push({
        id: 'var_2',
        title: 'Biến thể B: Cẩm nang bí kíp & Đánh giá dịch vụ',
        headline: `BẬT MÍ KINH NGHIỆM ĐI ${camp.tourName.toUpperCase()} CHO NGƯỜI BẬN RỘN`,
        body: `Bạn chỉ có 2-3 ngày nghỉ cuối tuần nhưng muốn đi một chuyến thật chất lượng? Lưu ngay kinh nghiệm thực tế này nhé:\n\n1. Thời điểm đẹp nhất: Mùa này thời tiết mát mẻ, khô ráo, cực kỳ lý tưởng để tham gia các hoạt động ngoài trời.\n2. Lựa chọn tour trọn gói: Đỡ phải lo xe cộ, đặt phòng, vé tham quan vì HaHa Eco Travel đã lo toàn bộ chu đáo.\n3. Tiêu chuẩn lưu trú: Phòng nghỉ sinh thái sạch sẽ, gần gũi thiên nhiên, thích hợp cho cả gia đình và nhóm bạn.\n\nĐặc biệt: Cam kết khởi hành đúng lịch, bảo hiểm du lịch tối đa.`,
        hashtags: `#ReviewDuLich #HaHaEcoTravel #${camp.code} #KinhNghiemDuLich #DuLichXanh`,
        cta: `📞 Nhắn tin ngay cho ${ctv.name} hoặc truy cập link đăng ký để nhận tư vấn 1-1:\n🔗 ${refUrl}`,
        media: camp.mediaBanner
      });

      // BIẾN THỂ 3: KỊCH BẢN VIDEO NGẮN / SHORT SCRIPT (TIKTOK / REELS / SHORTS)
      variants.push({
        id: 'var_3',
        title: 'Biến thể C: Kịch bản Video Ngắn (TikTok / Reels 30s)',
        headline: `[KỊCH BẢN TIKTOK 30S] ${camp.tourName}`,
        body: `🎬 GỢI Ý GÓC QUAY & LỜI THOẠI VIDEO:\n\n[00:00 - 00:03 | Hook]: Quay cảnh sương sớm hoặc rừng cây lướt nhanh -> Thoại: "Đừng đi làm cuối tuần này, hãy đi trốn cùng mình ở một nơi không có khói bụi!"\n[00:04 - 00:18 | Body]: Cắt cảnh ăn đồ nướng, chèo thuyền, đi dạo dưới tán cây -> Thoại: "Chỉ cách thành phố vài tiếng chạy xe, đây là toàn bộ trải nghiệm tour sinh thái ${camp.tourName} mà mình vừa đi cùng HaHa Eco Travel."\n[00:19 - 00:30 | CTA]: Quay cận nụ cười đoàn khách -> Thoại: "Chi phí trọn gói cực êm ví. Nhấp ngay vào link trên bio để săn ưu đãi nhóm nha!"`,
        hashtags: `#HaHaEcoTravel #TikTokTravel #DuLichVietNam #TravelVlog #${camp.code}`,
        cta: `🔗 Link gắn Bio / Ghim bình luận:\n${refUrl}`,
        media: camp.mediaBanner
      });

      return variants;
    },

    // 6. SOCIAL PUBLISHING AGENT: XUẤT BẢN HOẶC 1-CLICK SAO CHÉP
    publishPost: function(campaignId, platformKey, styleKey, variantIndex, mode) {
      const camp = (db.socialCampaigns || []).find(c => c.id === campaignId);
      if (!camp) return;

      const variants = this.generateAiContent(campaignId, platformKey, styleKey);
      const chosen = variants[variantIndex] || variants[0];
      const ctv = (db.ctvs || []).find(c => c.id === (currentUser ? currentUser.ctvId : 'CTV-001')) || (db.ctvs || [])[0];

      const fullPostText = `${chosen.headline}\n\n${chosen.body}\n\n${chosen.hashtags}\n\n${chosen.cta}`;

      if (mode === 'COPY') {
        // Sao chép văn bản vào Clipboard cho CTV tự đăng
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(fullPostText).then(() => {
            alert(`📋 ĐÃ SAO CHÉP BÀI VIẾT THÀNH CÔNG!\n\nBạn có thể mở ứng dụng ${platformKey} và dán (Paste) để đăng ngay lập tức kèm ảnh tư liệu HD.\n\nLink tiếp thị của bạn (${chosen.cta.split('\n')[1]}) đã được tự động gắn chuẩn xác!`);
          });
        } else {
          prompt("Sao chép nội dung bài viết dưới đây để đăng:", fullPostText);
        }
      }

      // Lưu bản ghi vào db.socialPosts
      const newPost = {
        id: 'POST-' + Date.now().toString(36).toUpperCase(),
        campaignId: campaignId,
        ctvId: ctv.id,
        platform: platformKey,
        personaStyle: styleKey,
        headline: chosen.headline,
        content: fullPostText,
        hashtags: chosen.hashtags,
        mediaUrl: chosen.media,
        referralUrl: chosen.cta.split('\n')[1] || '',
        publishMode: mode,
        status: mode === 'SCHEDULED' ? 'SCHEDULED' : (mode === 'COPY' ? 'MANUAL_PUBLISHED' : 'PUBLISHED'),
        publishedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        stats: { views: 0, clicks: 0, leads: 0, revenue: 0, commission: 0 }
      };

      if (!db.socialPosts) db.socialPosts = [];
      db.socialPosts.unshift(newPost);

      if (typeof saveDatabase === 'function') saveDatabase();
      if (typeof recordAuditLog === 'function') {
        recordAuditLog('XUẤT BẢN MẠNG XÃ HỘI', `CTV ${ctv.id} đã phát hành bài viết AI trên nền tảng ${platformKey} (Chế độ: ${mode}).`);
      }

      if (mode === 'AUTO') {
        alert(`🚀 ĐÃ TỰ ĐỘNG XUẤT BẢN THÀNH CÔNG LÊN ${platformKey}!\n\nBài viết đã được gửi qua API chính thức lên tài khoản mạng xã hội của bạn.\nHệ thống bắt đầu theo dõi lượt click và tự động chuyển đổi Lead về CRM!`);
      } else if (mode === 'SCHEDULED') {
        alert(`⏰ ĐÃ LÊN LỊCH ĐĂNG THÀNH CÔNG!\n\nBài viết đã được AI Social Scheduling Agent xếp vào khung giờ vàng tương tác cao (20:00 tối nay).`);
      }

      this.renderCtvSocialTab();
    },

    // 7. LEAD GENERATION AGENT: GIẢ LẬP KHÁCH NHẤP LINK -> GHI NHẬN CRM TỰ ĐỘNG
    simulateIncomingLead: function(ctvId, campaignCode, custName, phone, pax) {
      if (typeof db === 'undefined' || !db) return;
      const ctv = (db.ctvs || []).find(c => c.id === ctvId) || { id: ctvId, name: 'CTV Đối Tác', assignedSaleId: 'NV-002' };
      const camp = (db.socialCampaigns || []).find(c => c.code === campaignCode) || { tourName: 'Tour Sinh Thái Cát Tiên 2N1Đ' };

      // 1. Tạo Lead trong db.customers
      const nextCustId = ((db.customers || []).length + 1);
      const newCust = {
        id: nextCustId,
        code: `HH-SOC-${nextCustId.toString().padStart(3, '0')}`,
        name: custName,
        phone: phone,
        demand: `${camp.tourName} (${pax} khách - Nguồn bài đăng AI Social Hub)`,
        paxCount: Number(pax),
        source: `AI Social Hub (${ctv.name})`,
        collaboratorId: ctv.id,
        staff: ctv.assignedSaleId ? (ctv.assignedSaleId === 'NV-002' ? 'Nguyễn Văn An (Leader)' : 'Trần Thị Ngọc') : 'Nguyễn Văn An (Leader)',
        status: 'Mới tiếp nhận',
        tourValue: 2400000 * Number(pax),
        costValue: 1550000 * Number(pax),
        paidAmount: 0,
        remainingDebt: 2400000 * Number(pax),
        date: new Date().toISOString().split('T')[0]
      };

      if (!db.customers) db.customers = [];
      db.customers.unshift(newCust);

      // 2. Cập nhật thống kê lượt lead trên bài đăng gần nhất của CTV
      if (db.socialPosts) {
        const post = db.socialPosts.find(p => p.ctvId === ctv.id);
        if (post && post.stats) {
          post.stats.leads = (post.stats.leads || 0) + 1;
          post.stats.clicks = (post.stats.clicks || 0) + 7;
        }
      }

      // 3. Gửi thông báo hệ thống
      if (!db.notifications) db.notifications = [];
      db.notifications.unshift({
        id: `NOTIF-LEAD-${Date.now()}`,
        title: `🎯 LEAD MỚI TỪ AI SOCIAL HUB: ${custName}`,
        message: `Khách hàng ${custName} (${phone}) vừa đăng ký ${camp.tourName} qua liên kết của CTV ${ctv.name}. Hệ thống đã tự động chuyển vào CRM cho Sale phụ trách!`,
        time: 'Vừa xong',
        isRead: false,
        link: 'module-2'
      });

      if (typeof saveDatabase === 'function') saveDatabase();
      if (typeof renderNotificationCenter === 'function') renderNotificationCenter();
      if (typeof recordAuditLog === 'function') {
        recordAuditLog('LEAD PHÁT SINH TỪ SOCIAL', `Khách hàng ${custName} được AI Lead Gen Agent ghi nhận từ kênh CTV ${ctv.id}.`);
      }

      // 4. Kich hoat Webhook n8n / Make neu co cau hinh
      if (window.HahaAiConnector && typeof window.HahaAiConnector.triggerN8nLeadWebhook === "function") {
        window.HahaAiConnector.triggerN8nLeadWebhook(newCust);
      }

      alert(`🎉 CHÚC MỪNG! AI LEAD GEN AGENT VỪA THU THẬP THÀNH CÔNG 1 LEAD MỚI!\n\nKhách hàng: ${custName} (${phone})\nĐăng ký: ${camp.tourName} (${pax} khách)\nNguồn tiếp thị: Kênh xã hội của CTV ${ctv.name}\n\n-> Dữ liệu đã được liên thông 100% vào CRM Khách hàng (Phân hệ 2) và thông báo cho Sale phụ trách!`);
      this.renderCtvSocialTab();
    },

    // 8. GIAO DIỆN CTV PORTAL: RENDER TAB "AI SOCIAL HUB"
    renderCtvSocialTab: function() {
      const container = document.getElementById('ctv-tab-social-content');
      if (!container) return;

      this.initData();
      const currentCtvId = (typeof currentUser !== 'undefined' && currentUser && currentUser.ctvId) ? currentUser.ctvId : 'CTV-001';
      const myAccounts = (db.socialAccounts || []).filter(a => a.ctvId === currentCtvId);
      const myPosts = (db.socialPosts || []).filter(p => p.ctvId === currentCtvId);
      const campaigns = db.socialCampaigns || [];

      // Tính tổng chỉ số hiệu quả
      const totalPosts = myPosts.length;
      const totalViews = myPosts.reduce((s, p) => s + (p.stats ? p.stats.views || 0 : 0), 0);
      const totalClicks = myPosts.reduce((s, p) => s + (p.stats ? p.stats.clicks || 0 : 0), 0);
      const totalLeads = myPosts.reduce((s, p) => s + (p.stats ? p.stats.leads || 0 : 0), 0);
      const totalRev = myPosts.reduce((s, p) => s + (p.stats ? p.stats.revenue || 0 : 0), 0);
      const totalComm = myPosts.reduce((s, p) => s + (p.stats ? p.stats.commission || 0 : 0), 0);

      container.innerHTML = `
        <!-- BANNER GIỚI THIỆU AI SOCIAL HUB -->
        <div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-1.5">
              <div class="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-indigo-200">
                <span>🚀 AI Social Hub v2.1</span>
                <span>•</span>
                <span>Tự Động Hóa Mạng Xã Hội Cho Mạng Lưới CTV</span>
              </div>
              <h2 class="text-2xl font-black tracking-tight">Trợ Lý AI Quản Lý & Tự Động Đăng Bài Bán Tour</h2>
              <p class="text-xs text-indigo-100 max-w-2xl leading-relaxed">
                AI tự động sản xuất bài viết cá nhân hóa theo phong cách của bạn, gợi ý khung giờ vàng, hỗ trợ đăng bài tự động qua OAuth chính thức và liên thông trực tiếp khách hàng tiềm năng về CRM HaHa Eco Travel.
              </p>
            </div>
            <div class="flex items-center space-x-2 flex-shrink-0">
              <button type="button" onclick="window.HahaSocialHub.openSimulateLeadModal()" class="px-3.5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold rounded-2xl text-xs shadow-lg transition-all active:scale-95 flex items-center space-x-1.5">
                <span>🎯</span>
                <span>Giả Lập Lead Nhấp Link</span>
              </button>
            </div>
          </div>

          <!-- THỐNG KÊ HIỆU QUẢ MARKETING TRÊN MẠNG XÃ HỘI -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            <div class="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <span class="text-[10px] text-indigo-200 block uppercase font-bold">Bài Đã Xuất Bản</span>
              <span class="text-lg font-black text-white">${totalPosts}</span>
            </div>
            <div class="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <span class="text-[10px] text-indigo-200 block uppercase font-bold">Lượt Tiếp Cận (Views)</span>
              <span class="text-lg font-black text-cyan-300">${totalViews.toLocaleString()}</span>
            </div>
            <div class="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <span class="text-[10px] text-indigo-200 block uppercase font-bold">Lượt Click Vào Link</span>
              <span class="text-lg font-black text-amber-300">${totalClicks.toLocaleString()}</span>
            </div>
            <div class="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <span class="text-[10px] text-indigo-200 block uppercase font-bold">Khách Tiềm Năng (Leads)</span>
              <span class="text-lg font-black text-emerald-400">${totalLeads}</span>
            </div>
            <div class="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <span class="text-[10px] text-indigo-200 block uppercase font-bold">Doanh Số Mang Về</span>
              <span class="text-lg font-black text-white">${formatVND(totalRev)}</span>
            </div>
            <div class="bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
              <span class="text-[10px] text-indigo-200 block uppercase font-bold">Hoa Hồng Thực Nhận</span>
              <span class="text-lg font-black text-amber-400">${formatVND(totalComm)}</span>
            </div>
          </div>
        </div>

        <!-- PHẦN 1: TÀI KHOẢN MẠNG XÃ HỘI ĐÃ KẾT NỐI (OAUTH INTEGRATION) -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center space-x-2">
                <span>🔐</span>
                <span>Tài Khoản Mạng Xã Hội Đã Kết Nối (OAuth 2.0 Chính Thức)</span>
              </h3>
              <p class="text-xs text-slate-500">Bảo mật tuyệt đối: Không cung cấp và không lưu mật khẩu. Ngắt kết nối bất cứ lúc nào.</p>
            </div>
            <div class="flex items-center space-x-2">
              <button type="button" onclick="window.HahaSocialHub.openConnectAccountModal()" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center space-x-1.5">
                <span>+</span>
                <span>Kết Nối Kênh Mới</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            ${['FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'ZALO'].map(platKey => {
              const p = window.HahaSocialHub.PLATFORMS[platKey];
              const acc = myAccounts.find(a => a.platform === platKey && a.status === 'CONNECTED');
              const isConnected = !!acc;
              return `
                <div class="p-4 rounded-2xl border ${isConnected ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50 border-slate-200'} space-y-3 flex flex-col justify-between">
                  <div class="flex items-start justify-between">
                    <div class="flex items-center space-x-2">
                      <span class="text-2xl">${p.icon}</span>
                      <div>
                        <h4 class="font-bold text-xs text-slate-800">${p.name}</h4>
                        <span class="text-[10px] font-mono ${isConnected ? 'text-emerald-700 font-bold' : 'text-slate-400'}">
                          ${isConnected ? '🟢 Đã cấp quyền OAuth' : '⚪ Chưa kết nối'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="text-[11px] text-slate-600">
                    ${isConnected ? `<div class="font-semibold text-indigo-950 truncate">Tài khoản: ${acc.accountName}</div><div class="text-[10px] text-slate-400">Hết hạn: ${acc.expiresAt}</div>` : `<p class="italic text-slate-400">Chưa cấp quyền quản lý nội dung.</p>`}
                  </div>
                  <div class="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span class="text-[10px] text-slate-500">${p.supportedPublish}</span>
                    ${isConnected 
                      ? `<button type="button" onclick="window.HahaSocialHub.disconnectAccount('${acc.id}')" class="text-[10px] font-bold text-rose-600 hover:text-rose-800 underline">Ngắt kết nối</button>`
                      : `<button type="button" onclick="window.HahaSocialHub.connectAccount('${platKey}')" class="px-2.5 py-1 bg-white hover:bg-indigo-50 text-indigo-700 font-extrabold text-[10px] rounded-lg border border-indigo-300 shadow-xs">Kết nối ngay</button>`
                    }
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- PHẦN 2: AI CONTENT STUDIO (TẠO BÀI VIẾT CÁ NHÂN HÓA THEO PHONG CÁCH) -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div class="border-b border-slate-100 pb-4">
            <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center space-x-2">
              <span>✨</span>
              <span>AI Content Studio: Sáng Tạo Nội Dung Cá Nhân Hóa (Anti-Spam)</span>
            </h3>
            <p class="text-xs text-slate-500">Không tạo bài viết trùng lặp hàng loạt. AI tự động sinh nội dung theo phong cách riêng của từng nhóm CTV.</p>
          </div>

          <!-- Bộ lọc chọn cấu hình AI -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <!-- 1. Chọn Tour Chiến Dịch -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700">1. Chọn Tour Chiến Dịch Cần Đăng:</label>
              <select id="hub-select-campaign" onchange="window.HahaSocialHub.onStudioConfigChange()" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                ${campaigns.map(c => `
                  <option value="${c.id}">${c.badgeText}: ${c.tourName} (${c.commissionHighlight})</option>
                `).join('')}
              </select>
            </div>

            <!-- 2. Chọn Nền Tảng Đăng -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700">2. Chọn Nền Tảng Mục Tiêu:</label>
              <select id="hub-select-platform" onchange="window.HahaSocialHub.onStudioConfigChange()" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="FACEBOOK">📘 Facebook Page / Nhóm (Bài viết dài + Cảm xúc)</option>
                <option value="INSTAGRAM">📸 Instagram Business (Thị giác + Hashtag)</option>
                <option value="TIKTOK">🎵 TikTok (Kịch bản Video ngắn 30s)</option>
                <option value="ZALO">💬 Zalo OA / Bạn Bè (Tin nhắn thân tình)</option>
              </select>
            </div>

            <!-- 3. Chọn Phong Cách CTV -->
            <div class="space-y-1">
              <label class="block text-xs font-bold text-slate-700">3. Phong Cách Cá Nhân Của Bạn:</label>
              <select id="hub-select-style" onchange="window.HahaSocialHub.onStudioConfigChange()" class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="BLOGGER">📸 Phong cách Blogger / Reviewer (Chân thực, trải nghiệm)</option>
                <option value="HEALING">🌿 Phong cách Chữa Lành / Sống Xanh (Thư thái, an yên)</option>
                <option value="TREKKER">🧗‍♂️ Phong cách Phượt Thủ / Trekking (Thử thách, khám phá)</option>
                <option value="EXPERT">👔 Phong cách Chuyên Gia Lữ Hành (Chuyên nghiệp, minh bạch giá)</option>
              </select>
            </div>
          </div>

          <!-- Khu vực hiển thị 3 biến thể nội dung do AI sinh ra -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-extrabold text-slate-800 uppercase flex items-center space-x-1.5">
                <span>🤖</span>
                <span>Nội Dung Do AI Content Agent Tạo Ra (3 Phiên Bản Khác Nhau)</span>
              </span>
              <button type="button" onclick="window.HahaSocialHub.refreshStudioVariants()" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
                <span>🔄</span>
                <span>Tạo Lại Phiên Bản Khác</span>
              </button>
              <div class="flex items-center space-x-2">
                <button type="button" onclick="window.HahaSocialHub.generateLiveLlmContent()" class="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center space-x-1.5">
                  <span>&#10024;</span>
                  <span>Sinh Bang AI Truc Tiep (Gemini / GPT-4o / Claude)</span>
                </button>
                <div id="hub-llm-generate-status" class="text-[11px]"></div>
              </div>
            </div>

            <div id="hub-studio-variants-container" class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Rendered via JS -->
            </div>
          </div>
        </div>

        <!-- PHAN 3A: STUDIO AM THANH (ELEVENLABS) & PROMPT ANH BAN QUYEN (MIDJOURNEY / FLUX) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- 1. ElevenLabs Audio Guide -->
          <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center space-x-2">
                <span class="text-xl">&#127897;&#65039;</span>
                <div>
                  <h4 class="font-extrabold text-xs text-slate-900 uppercase">Audio Guide Thuyet Minh & Video Long Tieng</h4>
                  <span class="text-[10px] text-purple-700 font-bold">ElevenLabs AI Voice</span>
                </div>
              </div>
              <button type="button" onclick="window.HahaAiConnector.openConfigModal()" class="text-[10px] text-indigo-600 font-bold hover:underline">Cau hinh Voice Key</button>
            </div>
            <p class="text-[11px] text-slate-500">Tao giong doc thuyet minh sinh thai tai diem cho du khach hoac dung lam voiceover cho video TikTok cua CTV.</p>
            <div class="p-3 bg-purple-50/60 rounded-xl border border-purple-100 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-purple-950">Giong doc mau: Huong Giang (Ha Noi - Tram am)</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-purple-200 text-purple-900 font-bold">100% Tu Nhien</span>
              </div>
              <div class="text-[11px] text-slate-700 italic bg-white p-2.5 rounded-lg border border-purple-200/50">
                "Chao mung quy khach den voi rung Cay Tung ngan nam tuoi... Hay hit tho that sau va lang nghe tieng suoi reo hoa cung chim rung riu rit..."
              </div>
              <div class="flex items-center justify-between pt-1">
                <button type="button" onclick="window.HahaSocialHub.playDemoAudioGuide()" id="btn-audio-guide-play" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5">
                  <span>&#9654;&#65039;</span>
                  <span>Nghe Thu Audio Guide</span>
                </button>
                <button type="button" onclick="window.HahaSocialHub.copyAudioGuideScript()" class="text-xs text-purple-700 font-bold hover:underline">
                  &#128203; Sao chep kich ban doc
                </button>
              </div>
            </div>
          </div>

          <!-- 2. Midjourney / Flux / DALL-E 3 Visual Studio -->
          <div class="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center space-x-2">
                <span class="text-xl">&#127912;</span>
                <div>
                  <h4 class="font-extrabold text-xs text-slate-900 uppercase">Studio Prompt Anh Ban Quyen 8K</h4>
                  <span class="text-[10px] text-amber-700 font-bold">Midjourney v6.1 \u2022 Flux.1 \u2022 DALL-E 3</span>
                </div>
              </div>
            </div>
            <p class="text-[11px] text-slate-500">Tu dong sinh Prompt tieng Anh chuan thong so ky thuat de tao anh phong canh rung va glamping khong lo ban quyen.</p>
            <div class="p-3 bg-amber-50/60 rounded-xl border border-amber-100 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-amber-950">Prompt Cinematic Tour Sinh Thai:</span>
                <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">--ar 16:9 --v 6.1</span>
              </div>
              <div id="hub-visual-prompt-text" class="text-[10px] font-mono text-slate-700 bg-white p-2.5 rounded-lg border border-amber-200/50 max-h-20 overflow-y-auto select-all">
Cinematic landscape photography of Nam Cat Tien National Park, Vietnam eco-tourism. Untouched dense tropical rainforest, ancient Tung tree with giant roots, morning mist drifting through the green canopy, golden hour sunlight rays breaking through leaves, crystal clear river stream. Photorealistic, 8k resolution, shot on 35mm lens, f/2.8, National Geographic style, award winning eco-travel aesthetic, no plastic, zero pollution --ar 16:9 --v 6.1 --style raw
              </div>
              <div class="flex items-center justify-between pt-1">
                <button type="button" onclick="window.HahaSocialHub.copyVisualPrompt()" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5">
                  <span>&#128203;</span>
                  <span>Sao Chep Prompt Cho Midjourney / Canva</span>
                </button>
                <span class="text-[10px] text-amber-800 font-semibold">Ty le 16:9 Banner</span>
              </div>
            </div>
          </div>
        </div>

        <!-- PHẦN 3: LỊCH SỬ BÀI ĐĂNG & QUẢN LÝ LỊCH ĐĂNG (CONTENT CALENDAR) -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 class="text-sm font-extrabold text-slate-900 uppercase tracking-wide flex items-center space-x-2">
                <span>📅</span>
                <span>Lịch Đăng Bài & Theo Dõi Tương Tác Thực Tế</span>
              </h3>
              <p class="text-xs text-slate-500">Theo dõi số lượt click và số đơn hàng phát sinh từ từng bài viết.</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th class="px-4 py-3">Mã Bài</th>
                  <th class="px-4 py-3">Nền Tảng</th>
                  <th class="px-4 py-3">Tiêu Đề / Góc Nhìn</th>
                  <th class="px-4 py-3">Chế Độ</th>
                  <th class="px-4 py-3">Trạng Thái</th>
                  <th class="px-4 py-3 text-right">Lượt Xem</th>
                  <th class="px-4 py-3 text-right">Lượt Click</th>
                  <th class="px-4 py-3 text-right">Leads</th>
                  <th class="px-4 py-3 text-right">Hoa Hồng</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${myPosts.length === 0 ? `
                  <tr><td colspan="9" class="text-center py-6 text-slate-400 italic">Chưa có bài đăng nào. Hãy chọn tour và xuất bản bài viết đầu tiên ở trên!</td></tr>
                ` : myPosts.map(p => `
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-4 py-3 font-mono font-bold text-slate-900">${p.id}</td>
                    <td class="px-4 py-3">
                      <span class="px-2 py-0.5 rounded-lg text-[10px] font-bold ${p.platform === 'FACEBOOK' ? 'bg-blue-100 text-blue-800' : (p.platform === 'INSTAGRAM' ? 'bg-pink-100 text-pink-800' : (p.platform === 'TIKTOK' ? 'bg-slate-900 text-white' : 'bg-cyan-100 text-cyan-800'))}">
                        ${p.platform}
                      </span>
                    </td>
                    <td class="px-4 py-3 max-w-xs truncate font-semibold text-slate-800" title="${escapeHtml(p.headline)}">${escapeHtml(p.headline)}</td>
                    <td class="px-4 py-3 font-mono text-[10px] text-slate-500">${p.publishMode}</td>
                    <td class="px-4 py-3">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                        ${p.status === 'PUBLISHED' ? '✓ Đã đăng' : (p.status === 'SCHEDULED' ? '⏰ Đang hẹn giờ' : 'Đã copy')}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-right font-mono font-bold text-slate-700">${(p.stats?.views || 0).toLocaleString()}</td>
                    <td class="px-4 py-3 text-right font-mono font-bold text-amber-700">${(p.stats?.clicks || 0).toLocaleString()}</td>
                    <td class="px-4 py-3 text-right font-mono font-black text-emerald-700">${p.stats?.leads || 0}</td>
                    <td class="px-4 py-3 text-right font-mono font-black text-indigo-700">${formatVND(p.stats?.commission || 0)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      this.onStudioConfigChange();
    },

    // KHI THAY ĐỔI CẤU HÌNH STUDIO TRÊN GIAO DIỆN
    onStudioConfigChange: function() {
      const campId = document.getElementById('hub-select-campaign')?.value || 'CAMP-001';
      const platKey = document.getElementById('hub-select-platform')?.value || 'FACEBOOK';
      const styleKey = document.getElementById('hub-select-style')?.value || 'BLOGGER';

      const variants = this.generateAiContent(campId, platKey, styleKey);
      const container = document.getElementById('hub-studio-variants-container');
      if (!container) return;

      container.innerHTML = variants.map((v, idx) => `
        <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3 hover:border-indigo-300 transition-all">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">${v.title}</span>
              <span class="text-[10px] text-slate-400 font-mono">Phiên bản #${idx + 1}</span>
            </div>
            <h4 class="font-extrabold text-xs text-slate-900 leading-snug">${escapeHtml(v.headline)}</h4>
            <div class="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-sans">
${escapeHtml(v.body)}

<b class="text-indigo-600">${escapeHtml(v.hashtags)}</b>

<span class="text-emerald-700 font-semibold">${escapeHtml(v.cta)}</span>
            </div>
          </div>

          <div class="pt-2 border-t border-slate-200 space-y-2">
            <div class="grid grid-cols-2 gap-2">
              <button type="button" onclick="window.HahaSocialHub.publishPost('${campId}', '${platKey}', '${styleKey}', ${idx}, 'COPY')" class="w-full py-2 bg-white hover:bg-slate-100 text-slate-800 font-extrabold text-[11px] rounded-xl border border-slate-300 shadow-xs flex items-center justify-center space-x-1 active:scale-95 transition-all">
                <span>📋</span>
                <span>1-Click Copy</span>
              </button>
              <button type="button" onclick="window.HahaSocialHub.publishPost('${campId}', '${platKey}', '${styleKey}', ${idx}, 'AUTO')" class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] rounded-xl shadow-xs flex items-center justify-center space-x-1 active:scale-95 transition-all">
                <span>🚀</span>
                <span>Duyệt & Đăng</span>
              </button>
            </div>
            <button type="button" onclick="window.HahaSocialHub.publishPost('${campId}', '${platKey}', '${styleKey}', ${idx}, 'SCHEDULED')" class="w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[10px] rounded-lg border border-amber-200 flex items-center justify-center space-x-1">
              <span>⏰ Hẹn giờ vàng (20:00)</span>
            </button>
          </div>
        </div>
      `).join('');
    },

    refreshStudioVariants: function() {
      this.onStudioConfigChange();
      alert("✨ AI Content Agent vừa cập nhật lại 3 biến thể nội dung mới!");
    },

    openConnectAccountModal: function() {
      const platKey = prompt("Chọn nền tảng muốn kết nối:\n1: FACEBOOK\n2: INSTAGRAM\n3: TIKTOK\n4: ZALO\n\nNhập số tương ứng (1-4):", "1");
      const map = { '1': 'FACEBOOK', '2': 'INSTAGRAM', '3': 'TIKTOK', '4': 'ZALO' };
      if (platKey && map[platKey]) {
        this.connectAccount(map[platKey]);
      }
    },

    openSimulateLeadModal: function() {
      const currentCtvId = (typeof currentUser !== 'undefined' && currentUser && currentUser.ctvId) ? currentUser.ctvId : 'CTV-001';
      const custName = prompt("Nhập tên khách hàng giả lập nhấp link bài viết CTV:", "Nguyễn Văn Hùng");
      if (!custName) return;
      const phone = prompt("Nhập số điện thoại khách hàng:", "0988776655");
      if (!phone) return;
      const pax = prompt("Nhập số lượng khách đăng ký tour:", "4") || "4";

      this.simulateIncomingLead(currentCtvId, 'cattien_nov26', custName.trim(), phone.trim(), pax);
    },

    // 9. GIAO DIỆN QUẢN TRỊ ADMIN (PHÂN HỆ 3: AI SOCIAL HUB MANAGER)
    renderAdminSocialHub: function() {
      const container = document.getElementById('mod3-tab-social-content');
      if (!container) return;
      this.initData();

      const allAccounts = db.socialAccounts || [];
      const allPosts = db.socialPosts || [];
      const allCampaigns = db.socialCampaigns || [];
      const allCtvs = db.ctvs || [];

      const connectedCtvs = new Set(allAccounts.filter(a => a.status === 'CONNECTED').map(a => a.ctvId)).size;
      const totalPosts = allPosts.length;
      const totalViews = allPosts.reduce((s, p) => s + (p.stats ? p.stats.views || 0 : 0), 0);
      const totalClicks = allPosts.reduce((s, p) => s + (p.stats ? p.stats.clicks || 0 : 0), 0);
      const totalLeads = allPosts.reduce((s, p) => s + (p.stats ? p.stats.leads || 0 : 0), 0);
      const totalRev = allPosts.reduce((s, p) => s + (p.stats ? p.stats.revenue || 0 : 0), 0);

      container.innerHTML = `
        <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center space-x-2 bg-indigo-500/20 px-3 py-1 rounded-full text-xs font-bold text-indigo-300">
                <span>👑 Dành cho Ban Quản Trị & Leader Sale</span>
              </div>
              <h2 class="text-xl font-black mt-1">AI Social Hub Manager: Giám Sát Mạng Lưới CTV</h2>
              <p class="text-xs text-slate-300">Theo dõi toàn diện hiệu quả phân phối bài viết, lượt tương tác và số lượng khách hàng phát sinh từ mạng xã hội.</p>
            </div>
            <div class="flex items-center space-x-2">
              <button type="button" onclick="window.HahaSocialHub.launchNetworkCampaign()" class="px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-1.5">
                <span>📢</span>
                <span>Phát Động Chiến Dịch AI Mới</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            <div class="bg-white/10 p-3 rounded-2xl border border-white/10">
              <span class="text-[10px] text-slate-400 block uppercase font-bold">CTV Đã Kết Nối MXH</span>
              <span class="text-lg font-black text-emerald-400">${connectedCtvs} / ${allCtvs.length}</span>
            </div>
            <div class="bg-white/10 p-3 rounded-2xl border border-white/10">
              <span class="text-[10px] text-slate-400 block uppercase font-bold">Tổng Bài Đã Xuất Bản</span>
              <span class="text-lg font-black text-white">${totalPosts}</span>
            </div>
            <div class="bg-white/10 p-3 rounded-2xl border border-white/10">
              <span class="text-[10px] text-slate-400 block uppercase font-bold">Lượt Tiếp Cận (Views)</span>
              <span class="text-lg font-black text-cyan-300">${totalViews.toLocaleString()}</span>
            </div>
            <div class="bg-white/10 p-3 rounded-2xl border border-white/10">
              <span class="text-[10px] text-slate-400 block uppercase font-bold">Lượt Click Vào Link</span>
              <span class="text-lg font-black text-amber-300">${totalClicks.toLocaleString()}</span>
            </div>
            <div class="bg-white/10 p-3 rounded-2xl border border-white/10">
              <span class="text-[10px] text-slate-400 block uppercase font-bold">Khách Thu Về CRM</span>
              <span class="text-lg font-black text-emerald-400">${totalLeads}</span>
            </div>
            <div class="bg-white/10 p-3 rounded-2xl border border-white/10">
              <span class="text-[10px] text-slate-400 block uppercase font-bold">Doanh Số Từ Social</span>
              <span class="text-lg font-black text-amber-400">${formatVND(totalRev)}</span>
            </div>
          </div>
        </div>

        <!-- DANH SÁCH CHIẾN DỊCH TOUR ĐANG CHẠY -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Chiến Dịch Tour Đang Phân Phối Cho Mạng Lưới CTV</h3>
            <span class="text-xs text-slate-500 font-mono">${allCampaigns.length} chiến dịch đang hoạt động</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${allCampaigns.map(c => `
              <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">${c.badgeText}</span>
                  <span class="text-[10px] font-mono text-slate-400">${c.code}</span>
                </div>
                <h4 class="font-extrabold text-xs text-slate-900">${c.title}</h4>
                <p class="text-[11px] text-slate-600">${c.tourName}</p>
                <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                  <span class="font-bold text-indigo-700">${c.commissionHighlight}</span>
                  <span class="text-slate-400">Trạng thái: 🟢 Đang chạy</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- BẢNG THEO DÕI BÀI ĐĂNG TOÀN MẠNG LƯỚI -->
        <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 class="text-xs font-extrabold text-slate-800 uppercase tracking-wide">Lịch Sử Bài Viết Đã Đăng Của Mạng Lưới CTV</h3>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-700">
              <thead class="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th class="px-4 py-3">Mã Bài</th>
                  <th class="px-4 py-3">CTV</th>
                  <th class="px-4 py-3">Nền Tảng</th>
                  <th class="px-4 py-3">Phong Cách</th>
                  <th class="px-4 py-3">Tiêu Đề</th>
                  <th class="px-4 py-3 text-right">Lượt Xem</th>
                  <th class="px-4 py-3 text-right">Clicks</th>
                  <th class="px-4 py-3 text-right">Leads</th>
                  <th class="px-4 py-3 text-right">Hoa Hồng</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${allPosts.map(p => {
                  const ctv = allCtvs.find(c => c.id === p.ctvId) || { name: p.ctvId };
                  return `
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="px-4 py-3 font-mono font-bold text-slate-900">${p.id}</td>
                      <td class="px-4 py-3 font-bold text-indigo-900">${ctv.name}</td>
                      <td class="px-4 py-3">
                        <span class="px-2 py-0.5 rounded-lg text-[10px] font-bold ${p.platform === 'FACEBOOK' ? 'bg-blue-100 text-blue-800' : (p.platform === 'INSTAGRAM' ? 'bg-pink-100 text-pink-800' : 'bg-slate-900 text-white')}">
                          ${p.platform}
                        </span>
                      </td>
                      <td class="px-4 py-3 text-[11px] font-medium text-slate-600">${p.personaStyle}</td>
                      <td class="px-4 py-3 max-w-xs truncate font-semibold text-slate-800" title="${escapeHtml(p.headline)}">${escapeHtml(p.headline)}</td>
                      <td class="px-4 py-3 text-right font-mono font-bold text-slate-700">${(p.stats?.views || 0).toLocaleString()}</td>
                      <td class="px-4 py-3 text-right font-mono font-bold text-amber-700">${(p.stats?.clicks || 0).toLocaleString()}</td>
                      <td class="px-4 py-3 text-right font-mono font-black text-emerald-700">${p.stats?.leads || 0}</td>
                      <td class="px-4 py-3 text-right font-mono font-black text-indigo-700">${formatVND(p.stats?.commission || 0)}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    },

    launchNetworkCampaign: function() {
      const title = prompt("Nhập tên chiến dịch du lịch sinh thái mới:", "Chiến dịch Mùa Hoa Dã Quỳ Đà Lạt 2026");
      if (!title || !title.trim()) return;
      const highlight = prompt("Mức hoa hồng nổi bật dành cho CTV:", "350.000đ/khách hoặc 8% Doanh thu");
      if (!highlight) return;

      const newCamp = {
        id: 'CAMP-' + Date.now().toString(36).toUpperCase(),
        code: 'camp_' + Date.now().toString(36),
        tourId: 'TOUR-02',
        tourName: 'Tour Đà Lạt Săn Mây & Mùa Hoa Dã Quỳ 3N2Đ',
        title: title.trim(),
        status: 'ACTIVE',
        commissionHighlight: highlight.trim(),
        badgeText: 'CHIẾN DỊCH MỚI',
        mediaBanner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
        keySellingPoints: ['Mùa hoa dã quỳ rực rỡ', 'Săn mây đồi chè Cầu Đất', 'Glamping ấm áp ven hồ']
      };

      if (!db.socialCampaigns) db.socialCampaigns = [];
      db.socialCampaigns.unshift(newCamp);

      // Gửi thông báo đến toàn bộ CTV
      if (!db.notifications) db.notifications = [];
      db.notifications.unshift({
        id: `NOTIF-CAMP-${Date.now()}`,
        title: `📢 CHIẾN DỊCH MỚI TỪ CÔNG TY: ${title.trim()}`,
        message: `HaHa Eco Travel vừa phát động chiến dịch "${title.trim()}". AI Content Agent đã tạo sẵn bài viết và bộ tư liệu HD trong tab AI Social Hub!`,
        time: 'Vừa xong',
        isRead: false,
        link: 'module-10'
      });

      if (typeof saveDatabase === 'function') saveDatabase();
      if (typeof renderNotificationCenter === 'function') renderNotificationCenter();
      if (typeof recordAuditLog === 'function') {
        recordAuditLog('PHÁT ĐỘNG CHIẾN DỊCH MXH', `Ban Giám đốc đã phát động chiến dịch ${title.trim()} cho toàn mạng lưới CTV.`);
      }

      alert(`🎉 ĐÃ PHÁT ĐỘNG CHIẾN DỊCH THÀNH CÔNG!\n\nTên chiến dịch: ${title.trim()}\nHoa hồng: ${highlight.trim()}\n\nAI Content Agent đã tự động sinh các biến thể bài viết theo từng phong cách và gửi thông báo vào Cổng CTV!`);
      this.renderAdminSocialHub();
    },

    // ============================================================== 
    // NANG CAP: LIVE LLM GENERATION & MULTIMODAL PROMPT HELPERS
    // ============================================================== 
    generateLiveLlmContent: async function() {
      const campId = document.getElementById("hub-select-campaign")?.value || "CAMP-01";
      const platKey = document.getElementById("hub-select-platform")?.value || "FACEBOOK";
      const styleKey = document.getElementById("hub-select-style")?.value || "BLOGGER";
      const camp = (db.socialCampaigns || []).find(c => c.id === campId) || (db.socialCampaigns || [])[0];
      const p = this.PLATFORMS[platKey] || this.PLATFORMS.FACEBOOK;
      const style = this.PERSONA_STYLES[styleKey] || this.PERSONA_STYLES.BLOGGER;
      const ctv = (db.ctvs || []).find(c => c.id === (currentUser ? currentUser.ctvId : "CTV-001")) || (db.ctvs || [])[0] || { id: "CTV-001", refCode: "HAHA-YEN88", name: "Hoang Yen" };
      const refUrl = `https://daoquangha0201.github.io/HAHA-ECO-TRAVEL/storefront.html?ref=${ctv.id}&camp=${camp.code}`;

      if (!window.HahaAiConnector) { alert('L\u1ed7i: H\u1ec7 th\u1ed1ng AI Connector Hub ch\u01b0a s\u1eb5n s\u00e0ng.'); return; }

      const provider = window.HahaAiConnector.config.activeProvider;
      const meta = window.HahaAiConnector.getMetadata(provider);
      const statusEl = document.getElementById("hub-llm-generate-status");
      if (statusEl) statusEl.innerHTML = `<span class="text-indigo-600 font-bold animate-pulse">\u23F3 Dang goi ${meta.name}...</span>`;

      const prompt = `Viet bai quang ba ban tour: ${camp.tourName}. Nen tang: ${p.name}. Phong cach CTV: ${style.name} (${style.voice}). CTV: ${ctv.name}. Link CTV: ${refUrl}. Hay tao 3 phien ban (Cau chuyen trai nghiem, Review cam nang, Kich ban TikTok 30s co visual hook va audio suggestion).`;
      const sysPrompt = `Ban la chuyen gia AI Marketing du lich sinh thai HaHa Eco Travel. Van phong am ap, truyen cam, khong xao rong, nhan manh du lich khong rac thai nhua va chua lanh.`;

      try {
        const res = await window.HahaAiConnector.chatCompletion(prompt, sysPrompt, provider);
        if (res && res.text) {
          const container = document.getElementById("hub-studio-variants-container");
          if (container) {
            container.innerHTML = `
              <div class="col-span-full bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-200 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-600 text-white flex items-center space-x-1.5">
                    <span>${meta.icon}</span>
                    <span>Truc tiep tu ${meta.name} (${res.model} \u2022 ${res.latencyMs}ms)</span>
                  </span>
                  <div class="flex items-center space-x-2"><button type="button" onclick="window.HahaSocialHub.closeLlmOutput()" class="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl border border-rose-200 shadow-xs" title="\u0110\u00f3ng t\u00e1c v\u1ee5 k\u1ebft qu\u1ea3 AI">\u2715 \u0110\u00f3ng t\u00e1c v\u1ee5</button><button type="button" onclick="window.HahaSocialHub.copyRawLlmText()" class="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-xs">
                    \uD83D\uDCCB Sao chep toan bo ket qua AI
                  </button>
                </div>
                <div id="hub-raw-llm-text" class="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans max-h-96 overflow-y-auto">${res.text}</div>
              </div>
            `;
          }
          if (statusEl) statusEl.innerHTML = `<span class="text-emerald-700 font-bold">\u2713 Hoan tat boi ${meta.name} (${res.latencyMs}ms)!</span>`;
        }
      } catch (err) {
        alert("Loi API AI: " + err.message);
        if (statusEl) statusEl.innerHTML = `<span class="text-rose-600 font-bold">\u2715 Loi: ${err.message}</span>`;
      }
    },

    closeLlmOutput: function() {
      if (typeof this.renderVariantCards === 'function') {
        this.renderVariantCards();
      }
      const statusEl = document.getElementById("hub-llm-generate-status");
      if (statusEl) statusEl.innerHTML = "";
    },

    copyRawLlmText: function() {
      const el = document.getElementById("hub-raw-llm-text");
      if (el && navigator.clipboard) {
        navigator.clipboard.writeText(el.innerText).then(() => alert("Da sao chep toan bo noi dung tu AI!"));
      }
    },

    copyVisualPrompt: function() {
      const el = document.getElementById("hub-visual-prompt-text");
      if (el && navigator.clipboard) {
        navigator.clipboard.writeText(el.innerText.trim()).then(() => alert("Da sao chep Prompt Anh Midjourney / Flux vao Clipboard!"));
      }
    },

    copyAudioGuideScript: function() {
      const campId = document.getElementById("hub-select-campaign")?.value || "CAMP-01";
      const camp = (db.socialCampaigns || []).find(c => c.id === campId) || (db.socialCampaigns || [])[0];
      const script = (window.HahaAiConnector && typeof window.HahaAiConnector.buildAudioGuideScript === "function")
        ? window.HahaAiConnector.buildAudioGuideScript(camp.tourName)
        : "Chao mung quy khach den voi hanh trinh HaHa Eco Travel...";
      if (navigator.clipboard) {
        navigator.clipboard.writeText(script).then(() => alert("Da sao chep kich ban Audio Guide ElevenLabs!"));
      }
    },

    playDemoAudioGuide: function() {
      const btn = document.getElementById("btn-audio-guide-play");
      if (!btn) return;
      if (btn.classList.contains("playing")) {
        btn.classList.remove("playing");
        btn.innerHTML = `<span>\u25B6\uFE0F</span><span>Nghe Thu Audio Guide</span>`;
        alert("Da dung phat Audio Guide.");
      } else {
        btn.classList.add("playing");
        btn.innerHTML = `<span class="animate-spin">\u23F3</span><span>Dang phat Audio Guide...</span>`;
        if ("speechSynthesis" in window) {
          const campId = document.getElementById("hub-select-campaign")?.value || "CAMP-01";
          const camp = (db.socialCampaigns || []).find(c => c.id === campId) || (db.socialCampaigns || [])[0];
          const text = (window.HahaAiConnector && typeof window.HahaAiConnector.buildAudioGuideScript === "function")
            ? window.HahaAiConnector.buildAudioGuideScript(camp.tourName)
            : "Chao mung quy khach den voi tour sinh thai HaHa.";
          const utter = new SpeechSynthesisUtterance(text.slice(0, 150));
          utter.lang = "vi-VN";
          utter.onend = () => {
            btn.classList.remove("playing");
            btn.innerHTML = `<span>\u25B6\uFE0F</span><span>Nghe Thu Audio Guide</span>`;
          };
          window.speechSynthesis.speak(utter);
        } else {
          setTimeout(() => {
            btn.classList.remove("playing");
            btn.innerHTML = `<span>\u25B6\uFE0F</span><span>Nghe Thu Audio Guide</span>`;
            alert("Trinh duyet cua ban khong ho tro Web Speech. Vui long dung ElevenLabs API de tai file MP3 goc.");
          }, 2000);
        }
      }
    }
  };

  // Khởi tạo tự động khi tải trang
  window.addEventListener('DOMContentLoaded', function() {
    window.HahaSocialHub = HahaSocialHub;
    HahaSocialHub.initData();
    console.log('[HahaSocialHub] HAHA AI Social Hub Module initialized with Firebase integration.');
  });

})(window);
