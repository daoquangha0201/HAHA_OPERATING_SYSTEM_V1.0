/**
 * HAHA ECO TRAVEL - AI SOCIAL HUB & MARKETING SYNDICATION ENGINE
 * Phi\u00ean b\u1ea3n: 3.0 ULTIMATE (T\u00edch h\u1ee3p B\u1ed9 ph\u1eadn Marketing L\u1eef H\u00e0nh & \u0110i\u1ec1u ph\u1ed1i MXH CTV)
 * 
 * 1. Social Content Agent: Sinh b\u00e0i vi\u1ebft & k\u1ecbch b\u1ea3n TikTok 30s c\u00e1 nh\u00e2n h\u00f3a cho CTV.
 * 2. CTV Social Accounts Integration: Qu\u1ea3n l\u00fd k\u1ebft n\u1ed1i OAuth Facebook, Instagram, TikTok.
 * 3. Marketing Department Hub: B\u1ed9 ph\u1eadn Marketing l\u1eef h\u00e0nh t\u1ea1o chi\u1ebfn d\u1ecbch, ph\u00e2n ph\u1ed1i b\u00e0i \u0111\u0103ng
 *    t\u1ef1 \u0111\u1ed9ng ho\u1eb7c g\u1eedi H\u00f2m th\u01b0 cho CTV ph\u00ea duy\u1ec7t tr\u01b0\u1edbc khi xu\u1ea5t b\u1ea3n.
 * 4. Lead Attribution & CRM Integration: B\u1eafn Lead ti\u1ebfp th\u1ecb v\u1ec1 CRM cho ph\u00f2ng Sale & t\u00ednh hoa h\u1ed3ng CTV.
 * 
 * 100% Chu\u1ea9n M\u1ef1c Font Unicode ASCII Escape - Kh\u00f4ng bao gi\u1edd l\u1ed7i ph\u00f4ng ch\u1eef.
 */

(function(window) {
  'use strict';

  function formatVND(n) {
    if (typeof window !== 'undefined' && typeof window.formatVND === 'function' && window.formatVND !== formatVND) {
      return window.formatVND(n);
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(n) || 0);
  }

  const HahaSocialHub = {
    // 1. C\u00c1C PHONG C\u00c1CH CTV \u0110\u01af\u1ee2C C\u00c1 NH\u00c2N H\u00d3A (CH\u1ed0NG TR\u00d9NG L\u1eb6P N\u1ed8I DUNG)
    PERSONA_STYLES: {
      BLOGGER: {
        id: 'BLOGGER',
        name: 'Tr\u1ea3i Nghi\u1ec7m & Review',
        avatar: '\uD83C\uDFDE\uFE0F',
        badge: 'bg-pink-100 text-pink-800 border-pink-300',
        tone: 'Ch\u00e2n th\u1ef1c, gi\u00e0u c\u1ea3m x\u00fac c\u00e1 nh\u00e2n, chi ti\u1ebft l\u1ecbch tr\u00ecnh v\u00e0 g\u00f3c ch\u1ee5p \u0111\u1eb9p.',
        hookExample: '\u0110\u1eebng \u0111i C\u00e1t Ti\u00ean n\u1ebfu b\u1ea1n ch\u01b0a bi\u1ebft 3 b\u00ed k\u00edp sinh t\u1ed3n c\u1ef1c chill n\u00e0y...'
      },
      HEALING: {
        id: 'HEALING',
        name: 'Ch\u1eefa L\u00e0nh & S\u1ed1ng Xanh',
        avatar: '\uD83C\uDF3F',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        tone: 'S\u00e2u l\u1eafng, th\u01b0 th\u00e1i, nh\u1ea5n m\u1ea1nh detox t\u00e2m h\u1ed3n, s\u1ed1ng ch\u1eadm v\u00e0 kh\u00f4ng r\u00e1c th\u1ea3i nh\u1ef1a.',
        hookExample: 'Khi th\u00e0nh ph\u1ed1 qu\u00e1 \u1ed3n \u00e0o, thi\u00ean nhi\u00ean ch\u00ednh l\u00e0 li\u1ec1u thu\u1ed1c ch\u1eefa l\u00e0nh d\u1ecbu \u00eam nh\u1ea5t...'
      },
      TREKKER: {
        id: 'TREKKER',
        name: 'Ph\u01b0\u1ee3t Th\u1ee7 & Kh\u00e1m Ph\u00e1',
        avatar: '\uD83E\uDD7E',
        badge: 'bg-amber-100 text-amber-800 border-amber-300',
        tone: 'M\u1ea1nh m\u1ebd, n\u0103ng \u0111\u1ed9ng, k\u00edch th\u00edch th\u1eed th\u00e1ch, chia s\u1ebb kinh nghi\u1ec7m trekking r\u1eebng s\u00e2u.',
        hookExample: 'B\u0103ng 15km r\u1eebng nguy\u00ean sinh ng\u1eafm c\u00e2y Tung ng\u00e0n n\u0103m: Th\u1eed th\u00e1ch \u0111\u00e1ng gi\u00e1 nh\u1ea5t n\u0103m nay!'
      },
      EXPERT: {
        id: 'EXPERT',
        name: 'Chuy\u00ean Gia L\u1eef H\u00e0nh',
        avatar: '\uD83C\uDF93',
        badge: 'bg-blue-100 text-blue-800 border-blue-300',
        tone: 'Chuy\u00ean nghi\u1ec7p, th\u00f4ng tin minh b\u1ea1ch, d\u1ecbch v\u1ee5 tr\u1ecdn g\u00f3i chu\u1ea9n 4 sao, \u01b0u \u0111\u00e3i nh\u00f3m v\u00e0 b\u1ea3o hi\u1ec3m.',
        hookExample: 'L\u1ecbch kh\u1edfi h\u00e0nh tour sinh th\u00e1i C\u00e1t Ti\u00ean cu\u1ed1i tu\u1ea7n n\u00e0y: Tr\u1ecdn g\u00f3i ch\u1ec9 t\u1eeb 2.400.000\u0111/kh\u00e1ch...'
      }
    },

    // 2. C\u00c1C N\u1ec0N T\u1ea2NG M\u1ea0NG X\u00c3 H\u1ed8I \u0110\u01af\u1ee2C H\u1ed6 TR\u1ee2
    PLATFORMS: {
      FACEBOOK: {
        id: 'FACEBOOK',
        name: 'Facebook Page & Group',
        icon: '\uD83D\uDCD8',
        authMethod: 'OAuth 2.0 (Meta Graph API)',
        supportedPublish: 'T\u1ef1 \u0111\u1ed9ng API & CTV Ph\u00ea Duy\u1ec7t',
        formatRule: 'B\u00e0i vi\u1ebft 300-500 t\u1eeb, c\u1ea5u tr\u00fac Headline -> C\u00e2u chuy\u1ec7n -> L\u1ecbch tr\u00ecnh -> CTA link bio'
      },
      INSTAGRAM: {
        id: 'INSTAGRAM',
        name: 'Instagram Reels & Post',
        icon: '\uD83D\uDCF8',
        authMethod: 'Meta Instagram Graph API',
        supportedPublish: 'T\u1ef1 \u0111\u1ed9ng API & CTV Ph\u00ea Duy\u1ec7t',
        formatRule: 'Hook ng\u1eafn g\u1ecdn, th\u1ecb gi\u00e1c ch\u1eefa l\u00e0nh, 15-20 hashtag sinh th\u00e1i, Link in Bio'
      },
      TIKTOK: {
        id: 'TIKTOK',
        name: 'TikTok Video Script 30s',
        icon: '\uD83C\uDFAC',
        authMethod: 'TikTok for Developers (OAuth)',
        supportedPublish: 'K\u1ecbch b\u1ea3n Video ng\u1eafn & 1-Click Sao ch\u00e9p',
        formatRule: 'K\u1ecbch b\u1ea3n 3 h\u1ed3i (Hook 3s, Tr\u1ea3i nghi\u1ec7m 15s, CTA 5s) k\u00e8m g\u1ee3i \u00fd g\u00f3c quay & \u00e2m thanh'
      },
      ZALO: {
        id: 'ZALO',
        name: 'Zalo OA / C\u00e1 Nh\u00e2n',
        icon: '\uD83D\uDCAC',
        authMethod: 'Zalo OpenAPI & Share Link',
        supportedPublish: '\u0110\u0103ng Zalo OA & 1-Click Sao ch\u00e9p c\u00e1 nh\u00e2n',
        formatRule: 'Tin nh\u1eafn ng\u1eafn g\u1ecdn, th\u00e2n t\u00ecnh, k\u00eau g\u1ecdi nh\u1eafn tin Zalo nh\u1eadn l\u1ecbch tr\u00ecnh'
      }
    },

    // 3. KH\u1edeI T\u1ea0O D\u1eee LI\u1ec6U BAN \u0110\u1ea6U
    initData: function() {
      if (typeof db === 'undefined') return false;
      let changed = false;

      // Danh m\u1ee5c t\u00e0i kho\u1ea3n MXH li\u00ean k\u1ebft c\u1ee7a CTV
      if (!db.socialAccounts || !Array.isArray(db.socialAccounts) || db.socialAccounts.length === 0) {
        db.socialAccounts = [
          {
            id: 'ACC-001',
            ctvId: 'CTV-001',
            platform: 'FACEBOOK',
            accountName: 'Ho\u00e0ng Y\u1ebfn - Du L\u1ecbch Sinh Th\u00e1i & Camping',
            pageId: '109823471829',
            avatar: '\uD83D\uDCD8',
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
            avatar: '\uD83D\uDCF8',
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
            avatar: '\uD83C\uDFAC',
            status: 'CONNECTED',
            scope: ['user.info.basic', 'video.upload'],
            connectedAt: '2026-10-27 11:00',
            expiresAt: '2026-12-27 11:00'
          },
          {
            id: 'ACC-004',
            ctvId: 'CTV-002',
            platform: 'FACEBOOK',
            accountName: 'Minh Tu\u1ea5n Camping & Outdoor',
            pageId: '209384712391',
            avatar: '\uD83D\uDCD8',
            status: 'CONNECTED',
            scope: ['pages_manage_posts'],
            connectedAt: '2026-10-28 10:00',
            expiresAt: '2026-12-28 10:00'
          }
        ];
        changed = true;
      }

      // Danh m\u1ee5c chi\u1ebfn d\u1ecbch ti\u1ebfp th\u1ecb l\u1eef h\u00e0nh (Marketing Campaigns)
      if (!db.socialCampaigns || !Array.isArray(db.socialCampaigns) || db.socialCampaigns.length === 0) {
        db.socialCampaigns = [
          {
            id: 'CAMP-01',
            code: 'cattien_nov26',
            name: 'Chi\u1ebfn D\u1ecbch Th\u1ee9c Gi\u1ea5c Gi\u1eefa R\u1eebng Gi\u00e0 C\u00e1t Ti\u00ean',
            tourId: 'TOUR-01',
            tourName: 'Tour Nam C\u00e1t Ti\u00ean Sinh Th\u00e1i 2N1\u0110',
            targetPax: 100,
            status: 'ACTIVE',
            keyMessage: 'Th\u1ee9c gi\u1ea5c gi\u1eefa ti\u1ebfng chim r\u1eebng h\u00f3t, detox t\u00e2m h\u1ed3n kh\u00f4ng c\u00f2i xe.',
            perks: 'T\u1eb7ng v\u00e9 ch\u00e8o SUP s\u00f4ng \u0110\u1ed3ng Nai & B\u1ea3o hi\u1ec3m 100M/kh\u00e1ch',
            mediaBanner: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop',
            startDate: '2026-11-01',
            endDate: '2026-11-30'
          },
          {
            id: 'CAMP-02',
            code: 'dalat_healing_nov26',
            name: 'Chi\u1ebfn D\u1ecbch \u0110\u00e0 L\u1ea1t Ch\u1eefa L\u00e0nh & Glamping R\u1eebng Th\u00f4ng',
            tourId: 'TOUR-02',
            tourName: 'Tour \u0110\u00e0 L\u1ea1t Ch\u1eefa L\u00e0nh & Tr\u1ed3ng R\u1eebng 3N2\u0110',
            targetPax: 80,
            status: 'ACTIVE',
            keyMessage: 'M\u1ed7i b\u01b0\u1edbc ch\u00e2n g\u00f3p 1 c\u00e2y xanh cho cao nguy\u00ean L\u00e2m Vi\u00ean.',
            perks: 'Ti\u1ec7c BBQ th\u1ea3o m\u1ed9c sinh th\u00e1i & Thuy\u1ebft minh Audio Guide b\u1ea3n \u0111\u1ecba',
            mediaBanner: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
            startDate: '2026-11-05',
            endDate: '2026-12-05'
          },
          {
            id: 'CAMP-03',
            code: 'trekking_deep_forest',
            name: 'Chi\u1ebfn D\u1ecbch B\u0103ng R\u1eebng Th\u00e1m Hi\u1ec3m C\u00e2y Tung Ng\u00e0n N\u0103m',
            tourId: 'TOUR-03',
            tourName: 'Trekking R\u1eebng S\u00e2u & B\u00e0u S\u1ea5u Hoang D\u00e3 2N1\u0110',
            targetPax: 60,
            status: 'ACTIVE',
            keyMessage: 'Th\u1eed th\u00e1ch \u0111\u00f4i ch\u00e2n, chi\u00eam ng\u01b0\u1ee1ng \u0111\u1ea1i th\u1ee5 400 n\u0103m tu\u1ed5i v\u00e0 c\u00e1 s\u1ea5u xi\u00eam b\u1ea3o t\u1ed3n.',
            perks: 'Trang b\u1ecb g\u1eady trekking chuy\u00ean d\u1ee5ng & HDV d\u1eabn \u0111\u01b0\u1eddng b\u1ea3n \u0111\u1ecba',
            mediaBanner: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&auto=format&fit=crop',
            startDate: '2026-11-10',
            endDate: '2026-12-10'
          }
        ];
        changed = true;
      }

      // H\u00f2m th\u01b0 b\u00e0i \u0111\u0103ng Marketing ph\u00e2n ph\u1ed1i xu\u1ed1ng cho CTV duy\u1ec7t ho\u1eb7c \u0111\u0103ng t\u1ef1 \u0111\u1ed9ng
      if (!db.ctvPendingPosts || !Array.isArray(db.ctvPendingPosts)) {
        db.ctvPendingPosts = [
          {
            id: 'MKT-POST-001',
            campaignId: 'CAMP-01',
            campaignName: 'Chi\u1ebfn D\u1ecbch Th\u1ee9c Gi\u1ea5c Gi\u1eefa R\u1eebng Gi\u00e0 C\u00e1t Ti\u00ean',
            platform: 'FACEBOOK',
            mode: 'REQUIRE_APPROVAL', // Ch\u1edd CTV duy\u1ec7t
            targetCtvIds: ['ALL'],
            headline: '\uD83C\uDFDE\uFE0F Cu\u1ed1i tu\u1ea7n n\u00e0y, r\u1eddi xa kh\u00f3i b\u1ee5i \u0111\u00f4 th\u1ecb c\u00f9ng Tour Sinh Th\u00e1i Nam C\u00e1t Ti\u00ean!',
            content: 'B\u1ea1n \u0111\u00e3 bao gi\u1edd ng\u1ee7 gi\u1eefa r\u1eebng gi\u00e0 m\u00e0 kh\u00f4ng c\u00f3 ti\u1ebfng c\u00f2i xe?\n\nChuy\u1ebfn \u0111i 2N1\u0110 c\u00f9ng HaHa Eco Travel s\u1ebd \u0111\u01b0a b\u1ea1n v\u1ec1 v\u1edbi v\u1ebb \u0111\u1eb9p nguy\u00ean s\u01a1 c\u1ee7a r\u1eebng Nam C\u00e1t Ti\u00ean:\n\u2714\uFE0F Ch\u00e8o SUP ng\u1eafm ho\u00e0ng h\u00f4n tr\u00ean s\u00f4ng \u0110\u1ed3ng Nai.\n\u2714\uFE0F Chi\u00eam ng\u01b0\u1ee1ng c\u00e2y Tung \u0111\u1ea1i th\u1ee5 h\u01a1n 400 n\u0103m tu\u1ed5i.\n\u2714\uFE0F Th\u1eed th\u00e1ch xem th\u00fa \u0111\u00eam tr\u00ean xe chuy\u00ean d\u1ee5ng.\n\u2714\uFE0F L\u01b0u tr\u00fa Ecolodge ven s\u00f4ng chu\u1ea9n 4 sao, th\u1ef1c ph\u1ea9m h\u1eefu c\u01a1 b\u1ea3n \u0111\u1ecba.\n\nNh\u00f3m t\u1eeb 4 kh\u00e1ch \u0111\u01b0\u1ee3c gi\u1ea3m ngay 10%!',
            hashtags: '#HaHaEcoTravel #NamCatTien #DuLichSinhThai #Healing #GreenTour',
            mediaUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop',
            createdAt: '2026-11-06 08:30',
            status: 'PENDING_APPROVAL',
            ctvActions: {}
          },
          {
            id: 'MKT-POST-002',
            campaignId: 'CAMP-02',
            campaignName: 'Chi\u1ebfn D\u1ecbch \u0110\u00e0 L\u1ea1t Ch\u1eefa L\u00e0nh & Glamping R\u1eebng Th\u00f4ng',
            platform: 'TIKTOK',
            mode: 'AUTO_PUBLISH', // \u0110\u0103ng t\u1ef1 \u0111\u1ed9ng cho CTV \u0111\u00e3 c\u1ea5p quy\u1ec7n
            targetCtvIds: ['CTV-001'],
            headline: '[K\u1ecaCH B\u1ea2N TIKTOK 30S] \u0110i tr\u1ed1n kh\u00f3i b\u1ee5i t\u1ea1i \u0110\u00e0 L\u1ea1t',
            content: '[00:00 - 00:03]: Hook flycam r\u1eebng th\u00f4ng trong s\u01b0\u01a1ng s\u1edbm -> "Cu\u1ed1i tu\u1ea7n n\u00e0y b\u1ea1n ch\u1ecdn deadline hay ch\u1ecdn r\u1eebng th\u00f4ng?"\n[00:04 - 00:18]: C\u1ea3nh n\u1ea5u tr\u00e0 b\u00ean l\u1ec1u glamping, tr\u1ed3ng c\u00e2y con -> "Tr\u1ea3i nghi\u1ec7m tour sinh th\u00e1i c\u00f9ng HaHa Eco Travel, v\u1eeba ch\u1eefa l\u00e0nh v\u1eeba g\u00f3p xanh cho \u0111\u1ea5t n\u01b0\u1edbc."\n[00:19 - 00:30]: CTA nh\u1ea5n link bio \u0111\u1ec3 gi\u1eef ch\u1ed7 s\u1edbm!',
            hashtags: '#TikTokTravel #DaLatHealing #HaHaEcoTravel #Glamping',
            mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
            createdAt: '2026-11-06 08:00',
            status: 'AUTO_PUBLISHED',
            ctvActions: {
              'CTV-001': { status: 'AUTO_PUBLISHED', at: '2026-11-06 08:05', platformPostId: 'TT-9847123' }
            }
          }
        ];
        changed = true;
      }

      if (!db.socialPosts) {
        db.socialPosts = [];
        changed = true;
      }

      if (!db.socialLeads) {
        db.socialLeads = [];
        changed = true;
      }

      return changed;
    },

    // 4. K\u1ebeT N\u1ed0I & NG\u1eaeT K\u1ebeT N\u1ed0I T\u00c0I KHO\u1ea2N MXH OAUTH C\u1ee6A CTV
    connectAccount: function(platformKey) {
      const p = this.PLATFORMS[platformKey];
      if (!p) return;

      const currentCtvId = (typeof currentUser !== 'undefined' && currentUser && currentUser.ctvId) ? currentUser.ctvId : 'CTV-001';
      const ctv = (db.ctvs || []).find(c => c.id === currentCtvId) || { id: currentCtvId, name: 'C\u1ed9ng t\u00e1c vi\u00ean' };

      const defaultAccountName = `${ctv.name} - ${p.name}`;
      const inputName = prompt(`K\u1ebeT N\u1ed0I T\u00c0I KHO\u1ea2N ${p.name.toUpperCase()} (CHU\u1ea8N OAUTH):\n\nNh\u1eadp t\u00ean Fanpage ho\u1eb7c t\u00e0i kho\u1ea3n CTV \u0111\u01b0\u1ee3c ph\u00e9p qu\u1ea3n l\u00fd n\u1ed9i dung:`, defaultAccountName);
      if (!inputName || !inputName.trim()) return;

      if (!db.socialAccounts) db.socialAccounts = [];
      const existing = db.socialAccounts.find(a => a.ctvId === currentCtvId && a.platform === platformKey);

      const expDate = new Date();
      expDate.setDate(expDate.getDate() + 60);

      if (existing) {
        existing.status = 'CONNECTED';
        existing.accountName = inputName.trim();
        existing.connectedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);
        existing.expiresAt = expDate.toISOString().replace('T', ' ').slice(0, 16);
      } else {
        db.socialAccounts.push({
          id: 'ACC-' + Date.now().toString(36).toUpperCase(),
          ctvId: currentCtvId,
          platform: platformKey,
          accountName: inputName.trim(),
          avatar: p.icon,
          status: 'CONNECTED',
          scope: platformKey === 'FACEBOOK' ? ['pages_manage_posts', 'pages_read_engagement'] : ['content_publish'],
          connectedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
          expiresAt: expDate.toISOString().replace('T', ' ').slice(0, 16)
        });
      }

      if (typeof saveDatabase === 'function') saveDatabase();
      if (typeof recordAuditLog === 'function') {
        recordAuditLog('K\u1ebeT N\u1ed0I M\u1ea0NG X\u00c3 H\u1ed8I', `CTV ${ctv.id} \u0111\u00e3 c\u1ea5p quy\u1ec7n k\u1ebft n\u1ed1i OAuth cho t\u00e0i kho\u1ea3n ${inputName.trim()} tr\u00ean ${p.name}.`);
      }

      alert(`\u2705 K\u1ebeT N\u1ed0I TH\u00c0NH C\u00d4NG V\u1edaI ${p.name.toUpperCase()}!\n\nT\u00e0i kho\u1ea3n: "${inputName.trim()}" \u0111\u00e3 s\u1eb5n s\u00e0ng \u0111\u0103ng b\u00e0i qu\u1ea3ng b\u00e1 tour sinh th\u00e1i.`);
      this.renderCtvSocialTab();
    },

    disconnectAccount: function(accId) {
      if (!confirm("B\u1ea1n c\u00f3 ch\u1eafc ch\u1eafn mu\u1ed1n ng\u1eaft k\u1ebft n\u1ed1i t\u00e0i kho\u1ea3n n\u00e0y? M\u1ecdi l\u1ecbch \u0111\u0103ng b\u00e0i t\u1ef1 \u0111\u1ed9ng tr\u00ean t\u00e0i kho\u1ea3n s\u1ebd t\u1ea1m d\u1eebng ngay l\u1eadp t\u1ee9c.")) return;
      if (!db.socialAccounts) return;
      const acc = db.socialAccounts.find(a => a.id === accId);
      if (acc) {
        acc.status = 'DISCONNECTED';
        if (typeof saveDatabase === 'function') saveDatabase();
        if (typeof recordAuditLog === 'function') {
          recordAuditLog('NG\u1eaeT K\u1ebeT N\u1ed0I M\u1ea0NG X\u00c3 H\u1ed8I', `\u0110\u00e3 h\u1ee7y quy\u1ec7n OAuth \u0111\u1ed1i v\u1edbi t\u00e0i kho\u1ea3n ${acc.accountName}.`);
        }
        alert("\u0110\u00e3 ng\u1eaft k\u1ebft n\u1ed1i t\u00e0i kho\u1ea3n th\u00e0nh c\u00f4ng!");
        this.renderCtvSocialTab();
      }
    },

    // 5. SOCIAL MEDIA AI CONTENT AGENT: C\u00c1 NH\u00c2N H\u00d3A N\u1ed8I DUNG CHO CTV
    generateAiContent: function(campaignId, platformKey, styleKey, ctvIdOverride = null) {
      const camp = (db.socialCampaigns || []).find(c => c.id === campaignId) || (db.socialCampaigns || [])[0];
      const p = this.PLATFORMS[platformKey] || this.PLATFORMS.FACEBOOK;
      const style = this.PERSONA_STYLES[styleKey] || this.PERSONA_STYLES.BLOGGER;

      const currentCtvId = ctvIdOverride || ((typeof currentUser !== 'undefined' && currentUser && currentUser.ctvId) ? currentUser.ctvId : 'CTV-001');
      const ctv = (db.ctvs || []).find(c => c.id === currentCtvId) || (db.ctvs || [])[0] || { id: 'CTV-001', refCode: 'HAHA-YEN88', name: 'Ho\u00e0ng Y\u1ebfn' };

      const refUrl = `https://daoquangha0201.github.io/HAHA-ECO-TRAVEL/storefront.html?ref=${ctv.id}&camp=${camp.code}`;

      // Sinh 3 bi\u1ebfn th\u1ec3 n\u1ed9i dung \u0111\u1ed9c l\u1eadp chu\u1ea9n Vi\u1ec7t Nam
      const variants = [];

      // BI\u1ebeN TH\u1ec2 1: TR\u1ea2I NGHI\u1ec6M \u0110\u1ed8C B\u1ea2N & CH\u1eeeA L\u00c0NH
      variants.push({
        id: 'var_1',
        title: 'Bi\u1ebfn th\u1ec3 A: C\u00e2u chuy\u1ec7n tr\u1ea3i nghi\u1ec7m s\u00e2u s\u1eafc',
        headline: styleKey === 'HEALING'
          ? `R\u1eddi th\u00e0nh ph\u1ed1, v\u1ec1 r\u1eebng nguy\u00ean sinh Nam C\u00e1t Ti\u00ean t\u00ecm l\u1ea1i s\u1ef1 an y\u00ean...`
          : `Cu\u1ed1i tu\u1ea7n n\u00e0y, c\u00f9ng ${ctv.name} tr\u1ea3i nghi\u1ec7m ${camp.tourName}!`,
        body: styleKey === 'TREKKER'
          ? `N\u1ebfu b\u1ea1n \u0111ang t\u00ecm m\u1ed9t chuy\u1ebfn \u0111i \u0111\u1ec3 bung s\u1ee9c v\u00e0 th\u1eed th\u00e1ch \u0111\u00f4i ch\u00e2n, th\u00ec ${camp.tourName} ch\u00ednh l\u00e0 l\u1ef1a ch\u1ecdn s\u1ed1 1!\n\n\u0110i\u1ec3m nh\u1ea5n kh\u00f4ng th\u1ec3 b\u1ecf l\u1ee1:\n- B\u0103ng qua nh\u1eefng cung \u0111\u01b0\u1eddng nguy\u00ean sinh tuy\u1ec7t \u0111\u1eb9p.\n- Kh\u00e1m ph\u00e1 thi\u00ean nhi\u00ean hoang d\u00e3 c\u00f3 HDV chuy\u00ean nghi\u1ec7p d\u1eabn \u0111\u01b0\u1eddng.\n- T\u1ed5 ch\u1ee9c l\u1eeda tr\u1ea1i, ti\u1ec7c n\u01b0\u1edbng sinh th\u00e1i kh\u00f4ng r\u00e1c th\u1ea3i nh\u1ef1a.\n\nTour tr\u1ecdn g\u00f3i t\u1eeb A-Z \u0111\u01b0\u1ee3c b\u1ea3o ch\u1ee9ng b\u1edfi HaHa Eco Travel.`
          : `C\u00f3 nh\u1eefng ng\u00e0y \u00e1p l\u1ef1c c\u00f4ng vi\u1ec7c l\u00e0m m\u00ecnh ch\u1ec9 mu\u1ed1n x\u00e1ch balo l\u00ean v\u00e0 \u0111i. V\u00e0 chuy\u1ebfn \u0111i ${camp.tourName} th\u1ef1c s\u1ef1 \u0111\u00e3 s\u1ea1c \u0111\u1ea7y n\u0103ng l\u01b0\u1ee3ng cho m\u00ecnh! \uD83C\uDF3F\n\nHaHa Eco Travel l\u00e0m tour sinh th\u00e1i c\u1ef1c k\u1ef3 ch\u1ec9n chu:\n- Kh\u00f4ng x\u1ea3 r\u00e1c, kh\u00f4ng can thi\u1ec7p th\u00f4 b\u1ea1o v\u00e0o m\u00f4i tr\u01b0\u1eddng.\n- \u1ea8m th\u1ef1c s\u1ea1ch, t\u01b0\u01a1i ngon t\u1eeb b\u00e0 con \u0111\u1ecba ph\u01b0\u01a1ng.\n- \u0110\u1ed9i ng\u0169 h\u01b0\u1edbng d\u1eabn vi\u00ean am hi\u1ec3u sinh th\u00e1i, t\u1eadn t\u00ecnh.\n\nNh\u00f3m t\u1eeb 4 ng\u01b0\u1eddi \u0111ang c\u00f3 ch\u00ednh s\u00e1ch \u01b0u \u0111\u00e3i gi\u1eef ch\u1ed7 si\u00eau t\u1ed1t.`,
        hashtags: `#HaHaEcoTravel #${camp.code} #DuLichSinhThai #EcoTravel2026 #${styleKey.toLowerCase()}`,
        cta: `\uD83D\uDC49 \u0110\u1eb7t gi\u1eef ch\u1ed7 s\u1edbm ho\u1eb7c xem tr\u1ecdn b\u1ed9 l\u1ecbch tr\u00ecnh t\u1ea1i link ch\u00ednh th\u1ee9c:\n\uD83D\uDD17 ${refUrl}`,
        media: camp.mediaBanner
      });

      // BI\u1ebeN TH\u1ec2 2: C\u1ea8M NANG B\u00cd K\u00cdP & REVIEW TOUR TR\u1eccN G\u00d3I
      variants.push({
        id: 'var_2',
        title: 'Bi\u1ebfn th\u1ec3 B: C\u1ea9m nang b\u00ed k\u00edp & \u0110\u00e1nh gi\u00e1 d\u1ecbch v\u1ee5',
        headline: `B\u1eacT M\u00cd KINH NGHI\u1ec6M \u0110I ${camp.tourName.toUpperCase()} CHO NG\u01af\u1edcI B\u1eacN R\u1ed8N`,
        body: `B\u1ea1n ch\u1ec9 c\u00f3 2-3 ng\u00e0y ngh\u1ec9 cu\u1ed1i tu\u1ea7n nh\u01b0ng mu\u1ed1n \u0111i m\u1ed9t chuy\u1ebfn th\u1ef1c s\u1ef1 ch\u1ea5t l\u01b0\u1ee3ng? L\u01b0u ngay kinh nghi\u1ec7m th\u1ef1c t\u1ebf n\u00e0y nh\u00e9:\n\n1. Th\u1eddi \u0111i\u1ec3m \u0111\u1eb9p nh\u1ea5t: M\u00f9a n\u00e0y th\u1eddi ti\u1ebft m\u00e1t m\u1ebb, kh\u00f4 r\u00e1o, c\u1ef1c k\u1ef3 l\u00fd t\u01b0\u1edfng \u0111\u1ec3 tham gia c\u00e1c ho\u1ea1t \u0111\u1ed9ng ngo\u00e0i tr\u1eddi.\n2. L\u1ef1a ch\u1ecdn tour tr\u1ecdn g\u00f3i: \u0110\u1ee1 ph\u1ea3i lo xe c\u1ed9, \u0111\u1eb7t ph\u00f2ng, v\u00e9 tham quan v\u00ec HaHa Eco Travel \u0111\u00e3 lo to\u00e0n b\u1ed9 chu \u0111\u00e1o.\n3. Ti\u00eau chu\u1ea9n l\u01b0u tr\u00fa: Ph\u00f2ng ngh\u1ec9 sinh th\u00e1i s\u1ea1ch s\u1ebd, g\u1ea7n g\u0169i thi\u00ean nhi\u00ean, th\u00edch h\u1ee3p cho c\u1ea3 gia \u0111\u00ecnh v\u00e0 nh\u00f3m b\u1ea1n.\n\n\u0110\u1eb7c bi\u1ec7t: Cam k\u1ebft kh\u1edfi h\u00e0nh \u0111\u00fang l\u1ecbch, b\u1ea3o hi\u1ec3m du l\u1ecbch t\u1ed1i \u0111a.`,
        hashtags: `#ReviewDuLich #HaHaEcoTravel #${camp.code} #KinhNghiemDuLich #DuLichXanh`,
        cta: `\uD83D\uDC49 Nh\u1eafn tin ngay cho ${ctv.name} ho\u1eb7c truy c\u1eadp link \u0111\u0103ng k\u00fd \u0111\u1ec3 nh\u1eadn t\u01b0 v\u1ea5n 1-1:\n\uD83D\uDD17 ${refUrl}`,
        media: camp.mediaBanner
      });

      // BI\u1ebeN TH\u1ec2 3: K\u1ecaCH B\u1ea2N VIDEO TIKTOK / REELS 30 GI\u00c2Y
      variants.push({
        id: 'var_3',
        title: 'Bi\u1ebfn th\u1ec3 C: K\u1ecbch b\u1ea3n Video Ng\u1eafn (TikTok / Reels 30s)',
        headline: `[K\u1ecaCH B\u1ea2N TIKTOK 30S] ${camp.tourName}`,
        body: `\uD83C\uDFAC G\u1ee2I \u00dd G\u00d3C QUAY & L\u1edcI THO\u1ea0I VIDEO 30S:\n\n[00:00 - 00:03 | Hook th\u1ecb gi\u00e1c]: Quay c\u1ea3nh s\u01b0\u01a1ng s\u1edbm ho\u1eb7c r\u1eebng c\u00e2y l\u01b0\u1edbt nhanh -> Tho\u1ea1i: "\u0110\u1eebng \u0111i l\u00e0m cu\u1ed1i tu\u1ea7n n\u00e0y, h\u00e3y \u0111i tr\u1ed1n c\u00f9ng m\u00ecnh \u1edf m\u1ed9t n\u01a1i kh\u00f4ng c\u00f3 kh\u00f3i b\u1ee5i!"\n[00:04 - 00:18 | Tr\u1ea3i nghi\u1ec7m th\u1ef1c t\u1ebf]: C\u1eaft c\u1ea3nh \u0103n \u0111\u1ed3 n\u01b0\u1edbng, ch\u00e8o thuy\u1ec1n, \u0111i d\u1ea1o d\u01b0\u1edbi t\u00e1n c\u00e2y -> Tho\u1ea1i: "Ch\u1ec9 c\u00e1ch th\u00e0nh ph\u1ed1 v\u00e0i ti\u1ebfng ch\u1ea1y xe, \u0111\u00e2y l\u00e0 to\u00e0n b\u1ed9 tr\u1ea3i nghi\u1ec7m tour sinh th\u00e1i ${camp.tourName} m\u00e0 m\u00ecnh v\u1eeba \u0111i c\u00f9ng HaHa Eco Travel."\n[00:19 - 00:30 | CTA ch\u1ed1t kh\u00e1ch]: Quay c\u1eadn n\u1ee5 c\u01b0\u1eddi \u0111o\u00e0n kh\u00e1ch -> Tho\u1ea1i: "Chi ph\u00ed tr\u1ecdn g\u00f3i c\u1ef1c \u00eam v\u00ed. Nh\u1ea5p ngay v\u00e0o link tr\u00ean bio \u0111\u1ec3 s\u0103n \u01b0u \u0111\u00e3i nh\u00f3m nha!"`,
        hashtags: `#HaHaEcoTravel #TikTokTravel #DuLichVietNam #TravelVlog #${camp.code}`,
        cta: `\uD83D\uDD17 Link g\u1eafn Bio / Ghim b\u00ecnh lu\u1eadn:\n${refUrl}`,
        media: camp.mediaBanner
      });

      return variants;
    },

    // 6. XU\u1ea4T B\u1ea2N HO\u1eb6C SAO CH\u00c9P B\u00c0I VI\u1ebeT CHO CTV
    publishPost: function(campaignId, platformKey, styleKey, variantIndex, mode) {
      const camp = (db.socialCampaigns || []).find(c => c.id === campaignId) || (db.socialCampaigns || [])[0];
      if (!camp) return;

      const currentCtvId = (typeof currentUser !== 'undefined' && currentUser && currentUser.ctvId) ? currentUser.ctvId : 'CTV-001';
      const ctv = (db.ctvs || []).find(c => c.id === currentCtvId) || (db.ctvs || [])[0] || { id: 'CTV-001', name: 'C\u1ed9ng t\u00e1c vi\u00ean' };

      const variants = this.generateAiContent(campaignId, platformKey, styleKey, ctv.id);
      const chosen = variants[variantIndex] || variants[0];
      const fullPostText = `${chosen.headline}\n\n${chosen.body}\n\n${chosen.hashtags}\n\n${chosen.cta}`;

      if (mode === 'COPY') {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(fullPostText).then(() => {
            alert(`\u2705 \u0110\u00c3 SAO CH\u00c9P B\u00c0I VI\u1ebeT TH\u00c0NH C\u00d4NG!\n\nB\u1ea1n c\u00f3 th\u1ec3 m\u1edf \u1ee9ng d\u1ee5ng ${platformKey} v\u00e0 d\u00e1n (Paste) \u0111\u1ec3 \u0111\u0103ng ngay l\u1eadp t\u1ee9c.\n\nLink ti\u1ebfp th\u1ecb c\u00e1 nh\u00e2n h\u00f3a c\u1ee7a b\u1ea1n \u0111\u00e3 \u0111\u01b0\u1ee3c t\u1ef1 \u0111\u1ed9ng g\u1eafn ch\u00ednh x\u00e1c!`);
          });
        } else {
          prompt("Sao ch\u00e9p n\u1ed9i dung b\u00e0i vi\u1ebft \u0111\u1ec3 \u0111\u0103ng:", fullPostText);
        }
      }

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
        recordAuditLog('XU\u1ea5T B\u1ea2N M\u1ea0NG X\u00c3 H\u1ed8I', `CTV ${ctv.id} \u0111\u00e3 ph\u00e1t h\u00e0nh b\u00e0i vi\u1ebft AI tr\u00ean n\u1ec1n t\u1ea3ng ${platformKey} (Ch\u1ebf \u0111\u1ed9: ${mode}).`);
      }

      this.renderCtvSocialTab();
    },

    // 7. B\u1ed8 PH\u1eacN MARKETING: \u0110I\u1ec0U PH\u1ed0I B\u00c0I \u0110\u0102NG XU\u1ed0NG M\u1ea0NG L\u01af\u1edaI CTV
    dispatchMarketingPost: function(campaignId, platformKey, headline, content, hashtags, mediaUrl, mode, targetCtvScope) {
      if (!headline || !content) {
        alert("Vui l\u00f2ng nh\u1eadp \u0111\u1ea7y \u0111\u1ee7 Ti\u00eau \u0111\u1ec1 v\u00e0 N\u1ed9i dung b\u00e0i vi\u1ebft!");
        return false;
      }

      const camp = (db.socialCampaigns || []).find(c => c.id === campaignId) || (db.socialCampaigns || [])[0];
      const ctvs = db.ctvs || [];
      const targetIds = (targetCtvScope === 'ALL' || !targetCtvScope) ? ['ALL'] : [targetCtvScope];

      const newPending = {
        id: 'MKT-POST-' + Date.now().toString(36).toUpperCase(),
        campaignId: camp.id,
        campaignName: camp.name,
        platform: platformKey,
        mode: mode, // 'AUTO_PUBLISH' | 'REQUIRE_APPROVAL'
        targetCtvIds: targetIds,
        headline: headline.trim(),
        content: content.trim(),
        hashtags: hashtags ? hashtags.trim() : '#HaHaEcoTravel #DuLichSinhThai',
        mediaUrl: mediaUrl || camp.mediaBanner,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        status: mode === 'AUTO_PUBLISH' ? 'AUTO_PUBLISHED' : 'PENDING_APPROVAL',
        ctvActions: {}
      };

      // N\u1ebfu ch\u1ebf \u0111\u1ed9 AUTO_PUBLISH: \u0110\u0103ng ngay tr\u00ean c\u00e1c t\u00e0i kho\u1ea3n \u0111\u00e3 k\u1ebft n\u1ed1i
      if (mode === 'AUTO_PUBLISH') {
        const connectedAccounts = (db.socialAccounts || []).filter(a => a.platform === platformKey && a.status === 'CONNECTED');
        connectedAccounts.forEach(acc => {
          newPending.ctvActions[acc.ctvId] = {
            status: 'AUTO_PUBLISHED',
            at: new Date().toISOString().replace('T', ' ').slice(0, 16),
            platformPostId: 'API-' + Math.random().toString(36).substring(2, 9).toUpperCase()
          };
        });
      }

      if (!db.ctvPendingPosts) db.ctvPendingPosts = [];
      db.ctvPendingPosts.unshift(newPending);

      if (typeof saveDatabase === 'function') saveDatabase();
      if (typeof recordAuditLog === 'function') {
        recordAuditLog('MARKETING \u0110I\u1ec0U PH\u1ed0I B\u00c0I \u0110\u0102NG', `Ph\u00f2ng Marketing \u0111\u00e3 ph\u00e2n ph\u1ed1i b\u00e0i \u0111\u0103ng "${headline}" \u0111\u1ebfn m\u1ea1ng l\u01b0\u1edbi CTV (Ch\u1ebf \u0111\u1ed9: ${mode}).`);
      }

      alert(`\u2705 \u0110\u00c3 PH\u00c2N PH\u1ed0I B\u00c0I \u0110\u0102NG TH\u00c0NH C\u00d4NG!\n\nCh\u1ebf \u0111\u1ed9: ${mode === 'AUTO_PUBLISH' ? '\u0110\u0103ng t\u1ef1 \u0111\u1ed9ng l\u00ean t\u00e0i kho\u1ea3n CTV \u0111\u00e3 c\u1ea5p quy\u1ec7n' : 'G\u1eedi v\u00e0o H\u00f2m th\u01b0 CTV ph\u00ea duy\u1ec7t tr\u01b0\u1edbc khi \u0111\u0103ng'}.\nPh\u1ea1m vi: ${targetIds.includes('ALL') ? 'To\u00e0n b\u1ed9 ' + ctvs.length + ' CTV' : 'CTV ' + targetCtvScope}`);
      this.renderMarketingDepartmentModule();
      return true;
    },

    // 8. H\u00c0NH \u0110\u1ed8NG CTV TR\u00caN B\u00c0I MARKETING (DUY\u1ec6T, COPY, T\u1eea CH\u1ed0I, S\u1eecA)
    ctvApprovePost: function(postId) {
      const currentCtvId = (typeof currentUser !== 'undefined' && currentUser && currentUser.ctvId) ? currentUser.ctvId : 'CTV-001';
      const ctv = (db.ctvs || []).find(c => c.id === currentCtvId) || { id: currentCtvId, name: 'C\u1ed9ng t\u00e1c vi\u00ean' };
      const post = (db.ctvPendingPosts || []).find(p => p.id === postId);
      if (!post) return;

      const acc = (db.socialAccounts || []).find(a => a.ctvId === currentCtvId && a.platform === post.platform && a.status === 'CONNECTED');

      if (!post.ctvActions) post.ctvActions = {};
      post.ctvActions[currentCtvId] = {
        status: 'CTV_APPROVED',
        at: new Date().toISOString().replace('T', ' ').slice(0, 16),
        platformPostId: acc ? 'OAUTH-API-' + Math.random().toString(36).substring(2, 9).toUpperCase() : 'MANUAL-POST'
      };

      // T\u1ea1o b\u1ea3n ghi b\u00e0i \u0111\u0103ng trong db.socialPosts
      const refUrl = `https://daoquangha0201.github.io/HAHA-ECO-TRAVEL/storefront.html?ref=${ctv.id}&camp=${post.campaignId}`;
      const publishedText = `${post.headline}\n\n${post.content}\n\n${post.hashtags}\n\n\uD83D\uDC49 \u0110\u1eb7t tour ngay t\u1ea1i: ${refUrl}`;

      if (!db.socialPosts) db.socialPosts = [];
      db.socialPosts.unshift({
        id: 'POST-' + Date.now().toString(36).toUpperCase(),
        campaignId: post.campaignId,
        ctvId: ctv.id,
        platform: post.platform,
        personaStyle: 'MARKETING_SYNDICATED',
        headline: post.headline,
        content: publishedText,
        hashtags: post.hashtags,
        mediaUrl: post.mediaUrl,
        referralUrl: refUrl,
        publishMode: acc ? 'AUTO_API' : 'MANUAL_APPROVED',
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        stats: { views: 1, clicks: 0, leads: 0, revenue: 0, commission: 0 }
      });

      if (typeof saveDatabase === 'function') saveDatabase();
      if (typeof recordAuditLog === 'function') {
        recordAuditLog('CTV PH\u00ca DUY\u1ec6T B\u00c0I \u0110\u0102NG', `CTV ${ctv.id} \u0111\u00e3 ph\u00ea duy\u1ec7t v\u00e0 ph\u00e1t h\u00e0nh b\u00e0i vi\u1ebft "${post.headline}" l\u00ean ${post.platform}.`);
      }

      if (acc) {
        alert(`\u2705 \u0110\u00c3 DUY\u1ec6T & XU\u1ea5T B\u1ea2N L\u00caN ${post.platform.toUpperCase()}!\n\nB\u00e0i vi\u1ebft \u0111\u00e3 \u0111\u01b0\u1ee3c \u0111\u0103ng th\u00e0nh c\u00f4ng l\u00ean t\u00e0i kho\u1ea3n "${acc.accountName}".\nLink gi\u1edbi thi\u1ec7u ri\u00eang c\u1ee7a b\u1ea1n \u0111\u00e3 \u0111\u01b0\u1ee3c g\u1eafn t\u1ef1 \u0111\u1ed9ng.`);
      } else {
        if (navigator.clipboard) navigator.clipboard.writeText(publishedText);
        alert(`\u2705 \u0110\u00c3 DUY\u1ec6T B\u00c0I VI\u1ebeT!\n\nDo b\u1ea1n ch\u01b0a k\u1ebft n\u1ed1i t\u00e0i kho\u1ea3n ${post.platform}, h\u1ec7 th\u1ed1ng \u0111\u00e3 t\u1ef1 \u0111\u1ed9ng SAO CH\u00c9P to\u00e0n b\u1ed9 b\u00e0i vi\u1ebft v\u00e0o Clipboard \u0111\u1ec3 b\u1ea1n d\u00e1n v\u00e0o ${post.platform} \u0111\u0103ng ngay!`);
      }
      this.renderCtvSocialTab();
    },

    ctvCopyPost: function(postId) {
      const currentCtvId = (typeof currentUser !== 'undefined' && currentUser && currentUser.ctvId) ? currentUser.ctvId : 'CTV-001';
      const ctv = (db.ctvs || []).find(c => c.id === currentCtvId) || { id: currentCtvId, name: 'C\u1ed9ng t\u00e1c vi\u00ean' };
      const post = (db.ctvPendingPosts || []).find(p => p.id === postId);
      if (!post) return;

      const refUrl = `https://daoquangha0201.github.io/HAHA-ECO-TRAVEL/storefront.html?ref=${ctv.id}&camp=${post.campaignId}`;
      const publishedText = `${post.headline}\n\n${post.content}\n\n${post.hashtags}\n\n\uD83D\uDC49 \u0110\u1eb7t tour ngay t\u1ea1i: ${refUrl}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(publishedText).then(() => {
          alert(`\u2705 \u0110\u00c3 SAO CH\u00c9P B\u00c0I VI\u1ebeT K\u00c8M LINK TI\u1ebeP TH\u1eca RI\u00caNG!\n\nB\u1ea1n c\u00f3 th\u1ec3 d\u00e1n (Paste) l\u00ean Facebook, Zalo, Story c\u00e1 nh\u00e2n \u0111\u1ec3 b\u1eaft \u0111\u1ea7u thu h\u00fat kh\u00e1ch.`);
        });
      } else {
        prompt("Sao ch\u00e9p b\u00e0i vi\u1ebft:", publishedText);
      }
    },

    ctvRejectPost: function(postId) {
      if (!confirm("B\u1ea1n c\u00f3 ch\u1eafc ch\u1eafn mu\u1ed1n t\u1eeb ch\u1ed1i / b\u1ecf qua b\u00e0i vi\u1ebft n\u00e0y kh\u00f4ng?")) return;
      const currentCtvId = (typeof currentUser !== 'undefined' && currentUser && currentUser.ctvId) ? currentUser.ctvId : 'CTV-001';
      const post = (db.ctvPendingPosts || []).find(p => p.id === postId);
      if (post) {
        if (!post.ctvActions) post.ctvActions = {};
        post.ctvActions[currentCtvId] = {
          status: 'CTV_REJECTED',
          at: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
        if (typeof saveDatabase === 'function') saveDatabase();
        this.renderCtvSocialTab();
      }
    },

        openEditPostModal: function(postId) {
      const currentCtvId = (typeof currentUser !== 'undefined' && currentUser && currentUser.ctvId) ? currentUser.ctvId : 'CTV-001';
      const ctv = (db.ctvs || []).find(c => c.id === currentCtvId) || { id: currentCtvId, name: 'C\u1ed9ng t\u00e1c vi\u00ean' };
      const post = (db.ctvPendingPosts || []).find(p => p.id === postId);
      if (!post) return;

      const camp = (db.socialCampaigns || []).find(c => c.id === post.campaignId) || { name: 'Chi\u1ebfn D\u1ecbch Du L\u1ecbch HaHa', tourName: 'Tour Sinh Th\u00e1i HaHa' };
      const refUrl = `https://daoquangha0201.github.io/HAHA-ECO-TRAVEL/storefront.html?ref=${ctv.id}&camp=${post.campaignId}`;

      const existing = document.getElementById('ctv-edit-post-modal');
      if (existing) existing.remove();

      const safeHeadline = (post.headline || '').replace(/"/g, '&quot;');
      const safeHashtags = (post.hashtags || '#HaHaEcoTravel #DuLichSinhThai').replace(/"/g, '&quot;');

      const modalHtml = `
        <div id="ctv-edit-post-modal" class="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
          <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 my-auto">
            
            <!-- HEADER MODAL -->
            <div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-5 rounded-t-3xl flex items-center justify-between">
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-400 text-slate-950 uppercase">Ph\u00f2ng Marketing \u2192 ${ctv.name}</span>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">${post.platform}</span>
                </div>
                <h3 class="text-base sm:text-lg font-extrabold tracking-tight">\u270F\uFE0F Ch\u1ec9nh S\u1eeda B\u00e0i Vi\u1ebft Theo Phong C\u00e1ch Ri\u00eang C\u1ee7a B\u1ea1n</h3>
                <p class="text-xs text-indigo-200">T\u00f9y bi\u1ebfn ti\u00eau \u0111\u1ec1, l\u1eddi d\u1eabn v\u00e0 c\u1ea3m nh\u1eadn c\u00e1 nh\u00e2n tr\u01b0\u1edbc khi ph\u00ea duy\u1ec7t xu\u1ea5t b\u1ea3n.</p>
              </div>
              <button type="button" onclick="window.HahaSocialHub.closeEditPostModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-all">\u2715</button>
            </div>

            <!-- BODY 2 C\u1ed8T -->
            <div class="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <!-- C\u1ed8T TR\u00c1I: FORM SO\u1ea0N TH\u1ea2O (7/12) -->
              <div class="lg:col-span-7 space-y-4">
                
                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">1. Ti\u00eau \u0111\u1ec1 b\u00e0i vi\u1ebft (Headline):</label>
                  <input type="text" id="ctv-edit-headline" value="${safeHeadline}" oninput="window.HahaSocialHub.updateEditPreview()" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 font-sans shadow-inner">
                </div>

                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">2. N\u1ed9i dung b\u00e0i vi\u1ebft (Content Body):</label>
                    <span class="text-[10px] text-slate-400">T\u1ef1 do vi\u1ebft theo c\u1ea3m x\u00fac c\u00e1 nh\u00e2n</span>
                  </div>
                  <textarea id="ctv-edit-content" rows="8" oninput="window.HahaSocialHub.updateEditPreview()" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 leading-relaxed font-sans shadow-inner">${post.content}</textarea>
                </div>

                <div class="space-y-1.5">
                  <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">3. Th\u1ebb Hashtags:</label>
                  <input type="text" id="ctv-edit-hashtags" value="${safeHashtags}" oninput="window.HahaSocialHub.updateEditPreview()" class="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-indigo-700 focus:bg-white focus:ring-2 focus:ring-indigo-500">
                </div>

                <!-- B\u1ea3o to\u00e0n Link Ref CTV -->
                <div class="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5">
                  <div class="flex items-center space-x-2 text-xs font-extrabold text-emerald-900">
                    <span>\uD83D\uDD17</span>
                    <span>Link Ti\u1ebfp Th\u1ecb \u0110\u1ed9c Quy\u1ec1n C\u1ee7a B\u1ea1n (T\u1ef1 \u0111\u1ed9ng b\u1ea3o to\u00e0n 100%):</span>
                  </div>
                  <div class="font-mono text-[11px] text-emerald-800 bg-white/80 p-2 rounded-xl border border-emerald-200 break-all select-all">
                    ${refUrl}
                  </div>
                  <p class="text-[10px] text-emerald-700 leading-relaxed">
                    \u2714 Khi b\u1ea1n b\u1ea5m xu\u1ea5t b\u1ea3n ho\u1eb7c sao ch\u00e9p, h\u1ec7 th\u1ed1ng lu\u00f4n t\u1ef1 \u0111\u1ed9ng \u0111\u00ednh k\u00e8m link ref n\u00e0y v\u00e0o cu\u1ed1i b\u00e0i vi\u1ebft \u0111\u1ec3 \u0111\u1ea3m b\u1ea3o ghi nh\u1eadn doanh s\u1ed1 & hoa h\u1ed3ng ch\u00ednh x\u00e1c cho b\u1ea1n.
                  </p>
                </div>
              </div>

              <!-- C\u1ed8T PH\u1ea2I: XEM TR\u01af\u1edaC TH\u1ef0C T\u1ebe M\u1ea0NG X\u00c3 H\u1ed8I (5/12) -->
              <div class="lg:col-span-5 space-y-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">\uD83D\uDC41\uFE0F Xem tr\u01b0\u1edbc b\u00e0i \u0111\u0103ng MXH:</label>
                
                <div class="bg-white rounded-2xl border border-slate-300 shadow-sm p-4 space-y-3 font-sans">
                  <!-- Post Header -->
                  <div class="flex items-center space-x-2.5">
                    <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      ${ctv.name ? ctv.name.slice(0, 1) : 'C'}
                    </div>
                    <div>
                      <div class="font-bold text-xs text-slate-900">${ctv.name}</div>
                      <div class="text-[10px] text-slate-400 flex items-center space-x-1">
                        <span>V\u1eeba xong</span>
                        <span>&bull;</span>
                        <span>\uD83C\uDF10 C\u00f4ng khai</span>
                      </div>
                    </div>
                  </div>

                  <!-- Post Content Preview -->
                  <div class="space-y-2">
                    <h4 id="ctv-preview-headline" class="font-bold text-xs text-slate-900 leading-snug"></h4>
                    <div id="ctv-preview-body" class="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto"></div>
                    <div id="ctv-preview-hashtags" class="text-[11px] font-mono text-indigo-600"></div>
                  </div>

                  <!-- Media Banner -->
                  ${post.mediaUrl ? `
                    <div class="rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img src="${post.mediaUrl}" alt="Tour Banner" class="w-full h-36 object-cover">
                    </div>
                  ` : ''}

                  <!-- Call To Action Card -->
                  <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <div class="font-bold text-slate-800 text-[11px] truncate">${camp.tourName || 'Tour Sinh Th\u00e1i HaHa'}</div>
                      <div class="text-[10px] text-emerald-700 font-semibold">\u2714 Cam k\u1ebft sinh th\u00e1i &bull; \u01afu \u0111\u00e3i nh\u00f3m</div>
                    </div>
                    <span class="px-2 py-1 bg-indigo-600 text-white font-extrabold text-[10px] rounded-lg shadow-xs flex-shrink-0">\u0110\u1eb7t Ngay</span>
                  </div>
                </div>
              </div>

            </div>

            <!-- FOOTER MODAL -->
            <div class="p-5 bg-slate-50 rounded-b-3xl border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button type="button" onclick="window.HahaSocialHub.closeEditPostModal()" class="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-300 rounded-xl transition-all">
                \u2715 H\u1ee7y b\u1ecf
              </button>
              
              <div class="flex items-center space-x-2">
                <button type="button" onclick="window.HahaSocialHub.saveEditedPost('${post.id}', false)" class="px-4 py-2.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-xs transition-all">
                  \uD83D\uDCBE L\u01b0u B\u1ea3n Nh\u00e1p \u0110\u00e3 S\u1eeda
                </button>
                <button type="button" onclick="window.HahaSocialHub.saveEditedPost('${post.id}', true)" class="px-5 py-2.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-1.5">
                  <span>\uD83D\uDE80</span>
                  <span>L\u01b0u & Duy\u1ec7t \u0110\u0103ng Ngay</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);
      this.updateEditPreview();
    },

    updateEditPreview: function() {
      const hEl = document.getElementById('ctv-edit-headline');
      const bEl = document.getElementById('ctv-edit-content');
      const tEl = document.getElementById('ctv-edit-hashtags');

      const prevH = document.getElementById('ctv-preview-headline');
      const prevB = document.getElementById('ctv-preview-body');
      const prevT = document.getElementById('ctv-preview-hashtags');

      if (prevH && hEl) prevH.textContent = hEl.value;
      if (prevB && bEl) prevB.textContent = bEl.value;
      if (prevT && tEl) prevT.textContent = tEl.value;
    },

    closeEditPostModal: function() {
      const modal = document.getElementById('ctv-edit-post-modal');
      if (modal) modal.remove();
    },

    saveEditedPost: function(postId, shouldPublishImmediately) {
      const post = (db.ctvPendingPosts || []).find(p => p.id === postId);
      if (!post) return;

      const hEl = document.getElementById('ctv-edit-headline');
      const bEl = document.getElementById('ctv-edit-content');
      const tEl = document.getElementById('ctv-edit-hashtags');

      const newHeadline = hEl ? hEl.value.trim() : post.headline;
      const newContent = bEl ? bEl.value.trim() : post.content;
      const newHashtags = tEl ? tEl.value.trim() : post.hashtags;

      if (!newContent || newContent.length < 5) {
        alert("Vui l\u00f2ng nh\u1eadp n\u1ed9i dung b\u00e0i vi\u1ebft!");
        return;
      }

      post.headline = newHeadline;
      post.content = newContent;
      post.hashtags = newHashtags;
      post.lastEditedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

      const currentCtvId = (typeof currentUser !== 'undefined' && currentUser && currentUser.ctvId) ? currentUser.ctvId : 'CTV-001';
      if (!post.ctvActions) post.ctvActions = {};
      if (!shouldPublishImmediately) {
        post.ctvActions[currentCtvId] = {
          status: 'CTV_DRAFT_EDITED',
          at: post.lastEditedAt
        };
      }

      if (typeof saveDatabase === 'function') saveDatabase();
      this.closeEditPostModal();

      if (shouldPublishImmediately) {
        this.ctvApprovePost(postId);
      } else {
        alert("\u2705 \u0110\u00c3 L\u01afU N\u1ed8I DUNG \u0110\u00c3 CH\u1ec8NH S\u1eecA!\n\nB\u1ea3n nh\u00e1p \u0111\u00e3 \u0111\u01b0\u1ee3c c\u1eadp nh\u1eadt th\u00e0nh c\u00f4ng. B\u1ea1n c\u00f3 th\u1ec3 b\u1ea5m [Duy\u1ec7t & \u0110\u0103ng] b\u1ea5t c\u1ee9 l\u00fac n\u00e0o.");
        this.renderCtvSocialTab();
      }
    },

    // 9. GIAO DI\u1ec6N CTV SOCIAL HUB (TAB 6 TRONG C\u1ed4NG CTV)
    renderCtvSocialTab: function() {
      const container = document.getElementById('ctv-tab-social-content');
      if (!container) return;

      const currentCtvId = (typeof currentUser !== 'undefined' && currentUser && currentUser.ctvId) ? currentUser.ctvId : 'CTV-001';
      const ctv = (db.ctvs || []).find(c => c.id === currentCtvId) || (db.ctvs || [])[0] || { id: 'CTV-001', name: 'Ho\u00e0ng Y\u1ebfn', refCode: 'HAHA-YEN88' };

      const myAccounts = (db.socialAccounts || []).filter(a => a.ctvId === ctv.id);
      const myPosts = (db.socialPosts || []).filter(p => p.ctvId === ctv.id);
      const campaigns = db.socialCampaigns || [];

      // L\u1ecdc c\u00e1c b\u00e0i \u0111\u0103ng do Marketing ph\u00e2n ph\u1ed1i xu\u1ed1ng cho CTV n\u00e0y
      const pendingPosts = (db.ctvPendingPosts || []).filter(p => {
        const isTargeted = p.targetCtvIds.includes('ALL') || p.targetCtvIds.includes(ctv.id);
        const action = p.ctvActions ? p.ctvActions[ctv.id] : null;
        return isTargeted && (!action || action.status !== 'CTV_REJECTED');
      });

      const totalViews = myPosts.reduce((s, p) => s + (p.stats ? p.stats.views || 0 : 0), 0);
      const totalClicks = myPosts.reduce((s, p) => s + (p.stats ? p.stats.clicks || 0 : 0), 0);
      const totalLeads = myPosts.reduce((s, p) => s + (p.stats ? p.stats.leads || 0 : 0), 0);
      const totalRev = myPosts.reduce((s, p) => s + (p.stats ? p.stats.revenue || 0 : 0), 0);
      const totalComm = myPosts.reduce((s, p) => s + (p.stats ? p.stats.commission || 0 : 0), 0);

      container.innerHTML = `
        <div class="space-y-6 animate-fade-in">

          <!-- 1. HEADER CH\u00c0O M\u1ee8NG & TH\u1ed0NG K\u00ca HI\u1ec6U QU\u1ea2 -->
          <div class="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500 text-white uppercase tracking-wider">AI Social Hub</span>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white">OAuth 2.0 B\u1ea3o M\u1eadt</span>
                </div>
                <h2 class="text-xl font-extrabold tracking-tight">Trung T\u00e2m T\u1ef1 \u0110\u1ed9ng H\u00f3a M\u1ea1ng X\u00e3 H\u1ed9i Cho CTV</h2>
                <p class="text-xs text-indigo-200">C\u1ed9ng t\u00e1c vi\u00ean: <span class="font-bold text-white">${ctv.name}</span> (${ctv.id}) &bull; M\u00e3 Ti\u1ebfp Th\u1ecb: <span class="font-mono font-bold text-amber-300">${ctv.refCode}</span></p>
              </div>

              <div class="flex items-center gap-2">
                <button type="button" onclick="window.HahaSocialHub.openSimulateLeadModal()" class="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md transition-all active:scale-95 flex items-center space-x-1.5">
                  <span>\u26A1</span>
                  <span>Th\u1eed Nghi\u1ec7m Kh\u00e1ch \u0110\u1eb7t Tour</span>
                </button>
              </div>
            </div>

            <!-- Stats 5 ch\u1ec9 s\u1ed1 -->
            <div class="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-indigo-700/50">
              <div class="bg-white/10 rounded-2xl p-3 border border-white/10">
                <div class="text-[10px] text-indigo-200 font-semibold uppercase">L\u01b0\u1ee3t xem (Views)</div>
                <div class="text-lg font-mono font-black text-white">${totalViews.toLocaleString()}</div>
              </div>
              <div class="bg-white/10 rounded-2xl p-3 border border-white/10">
                <div class="text-[10px] text-indigo-200 font-semibold uppercase">L\u01b0\u1ee3t click Link Bio</div>
                <div class="text-lg font-mono font-black text-amber-300">${totalClicks.toLocaleString()}</div>
              </div>
              <div class="bg-white/10 rounded-2xl p-3 border border-white/10">
                <div class="text-[10px] text-indigo-200 font-semibold uppercase">Kh\u00e1ch ti\u1ec1m n\u0103ng (Leads)</div>
                <div class="text-lg font-mono font-black text-emerald-400">${totalLeads}</div>
              </div>
              <div class="bg-white/10 rounded-2xl p-3 border border-white/10">
                <div class="text-[10px] text-indigo-200 font-semibold uppercase">Doanh thu ph\u00e1t sinh</div>
                <div class="text-sm font-mono font-black text-cyan-300 truncate">${formatVND(totalRev)}</div>
              </div>
              <div class="bg-white/10 rounded-2xl p-3 border border-white/10 col-span-2 sm:col-span-1">
                <div class="text-[10px] text-indigo-200 font-semibold uppercase">Hoa h\u1ed3ng t\u1ea1m t\u00ednh</div>
                <div class="text-sm font-mono font-black text-yellow-300 truncate">${formatVND(totalComm)}</div>
              </div>
            </div>
          </div>

          <!-- 2. H\u00d2M TH\u01af N\u1ed8I DUNG MARKETING PH\u00c2N PH\u1ed0I CH\u1edc CTV PH\u00ca DUY\u1ec6T -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div class="flex items-center space-x-2">
                <span class="text-xl">\uD83D\uDCE8</span>
                <div>
                  <h3 class="font-extrabold text-base text-slate-900">H\u00f2m Th\u01b0 N\u1ed9i Dung Ti\u1ebfp Th\u1ecb T\u1eeb Ph\u00f2ng Marketing (${pendingPosts.length})</h3>
                  <p class="text-xs text-slate-500">Ph\u00f2ng Marketing \u0111\u00e3 so\u1ea1n s\u1eb5n n\u1ed9i dung k\u00e8m link ti\u1ebfp th\u1ecb ri\u00eang c\u1ee7a b\u1ea1n. Duy\u1ec7t \u0111\u1ec3 xu\u1ea5t b\u1ea3n ngay.</p>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs font-bold ${pendingPosts.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}">
                ${pendingPosts.length > 0 ? `\u23F3 ${pendingPosts.length} b\u00e0i ch\u1edd duy\u1ec7t` : '\u2714 \u0110\u00e3 x\u1eed l\u00fd h\u1ebft'}
              </span>
            </div>

            ${pendingPosts.length === 0 ? `
              <div class="py-8 text-center text-slate-400 space-y-2">
                <div class="text-3xl">\uD83D\uDCE6</div>
                <p class="text-xs">Ch\u01b0a c\u00f3 b\u00e0i vi\u1ebft n\u00e0o m\u1edbi t\u1eeb Ph\u00f2ng Marketing. B\u1ea1n c\u00f3 th\u1ec3 t\u1ef1 sinh b\u00e0i b\u1eb1ng AI Studio b\u00ean d\u01b0\u1edbi!</p>
              </div>
            ` : `
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${pendingPosts.map(p => {
                  const act = p.ctvActions ? p.ctvActions[ctv.id] : null;
                  const isApproved = act && act.status === 'CTV_APPROVED';
                  const isAutoPublished = act && act.status === 'AUTO_PUBLISHED';
                  return `
                    <div class="border rounded-2xl p-4 flex flex-col justify-between space-y-3 ${isApproved || isAutoPublished ? 'bg-emerald-50/40 border-emerald-300' : 'bg-slate-50/70 border-slate-200 hover:border-indigo-300'} transition-all">
                      <div class="space-y-2.5">
                        <div class="flex items-center justify-between">
                          <span class="px-2 py-0.5 rounded-lg text-[10px] font-extrabold ${p.platform === 'FACEBOOK' ? 'bg-blue-100 text-blue-800' : (p.platform === 'INSTAGRAM' ? 'bg-pink-100 text-pink-800' : 'bg-slate-900 text-white')}">
                            ${p.platform}
                          </span>
                          <span class="text-[10px] font-semibold text-slate-400">${p.createdAt}</span>
                        </div>

                        <h4 class="font-bold text-xs text-slate-900 leading-snug">${p.headline}</h4>

                        ${p.mediaUrl ? `
                          <div class="w-full h-32 rounded-xl overflow-hidden bg-slate-200">
                            <img src="${p.mediaUrl}" alt="Media" class="w-full h-full object-cover">
                          </div>
                        ` : ''}

                        <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap font-sans">
                          ${p.content}
                        </div>

                        <div class="text-[11px] text-indigo-700 font-bold truncate">
                          \uD83D\uDD17 Link ref CTV: https://.../storefront.html?ref=${ctv.id}&camp=${p.campaignId}
                        </div>
                      </div>

                      <div class="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                        ${isApproved || isAutoPublished ? `
                          <span class="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                            <span>\u2714\uFE0F \u0110\u00e3 xu\u1ea5t b\u1ea3n l\u00ean ${p.platform}</span>
                          </span>
                          <button type="button" onclick="window.HahaSocialHub.ctvCopyPost('${p.id}')" class="px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                            \uD83D\uDCCB Sao ch\u00e9p l\u1ea1i
                          </button>
                        ` : `
                          <div class="flex items-center space-x-1.5">
                            <button type="button" onclick="window.HahaSocialHub.ctvApprovePost('${p.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all active:scale-95 flex items-center space-x-1">
                              <span>\u2705</span>
                              <span>Duy\u1ec7t & \u0110\u0103ng</span>
                            </button>
                            <button type="button" onclick="window.HahaSocialHub.ctvCopyPost('${p.id}')" class="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-all flex items-center space-x-1">
                              <span>\uD83D\uDCCB</span>
                              <span>T\u1ef1 \u0111\u0103ng</span>
                            </button>
                          </div>
                          <div class="flex items-center space-x-1">
                            <button type="button" onclick="window.HahaSocialHub.ctvEditPostModal('${p.id}')" class="px-2 py-1 text-slate-500 hover:text-slate-800 text-xs font-semibold" title="S\u1eeda c\u00e2u ch\u1eef">
                              \u270F\uFE0F S\u1eeda
                            </button>
                            <button type="button" onclick="window.HahaSocialHub.ctvRejectPost('${p.id}')" class="px-2 py-1 text-rose-500 hover:text-rose-800 text-xs font-semibold" title="B\u1ecf qua b\u00e0i n\u00e0y">
                              \u2715
                            </button>
                          </div>
                        `}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <!-- 3. QU\u1ea2N L\u00dd K\u1ebeT N\u1ed0I T\u00c0I KHO\u1ea2N M\u1ea0NG X\u00c3 H\u1ed8I OAUTH -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 class="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                  <span>\uD83D\uDD17 K\u1ebft N\u1ed1i T\u00e0i Kho\u1ea3n M\u1ea1ng X\u00e3 H\u1ed9i (OAuth 2.0 Ch\u00ednh Th\u1ee9c)</span>
                </h3>
                <p class="text-xs text-slate-500">C\u1ea5p quy\u1ec7n cho AI t\u1ef1 \u0111\u1ed9ng \u0111\u0103ng b\u00e0i ho\u1eb7c nh\u1eadn b\u00e0i t\u1eeb Marketing. Kh\u00f4ng l\u01b0u m\u1eadt kh\u1ea9u, ng\u1eaft k\u1ebft n\u1ed1i b\u1ea5t k\u1ef3 l\u00fac n\u00e0o.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              ${Object.keys(this.PLATFORMS).map(key => {
                const plat = this.PLATFORMS[key];
                const acc = myAccounts.find(a => a.platform === key && a.status === 'CONNECTED');
                const isConn = !!acc;
                return `
                  <div class="border rounded-2xl p-4 flex flex-col justify-between space-y-3 ${isConn ? 'bg-indigo-50/40 border-indigo-200' : 'bg-slate-50 border-slate-200'}">
                    <div class="space-y-1.5">
                      <div class="flex items-center justify-between">
                        <span class="text-xl">${plat.icon}</span>
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isConn ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}">
                          ${isConn ? '\u2714 \u0110\u00e3 k\u1ebft n\u1ed1i' : 'Ch\u01b0a li\u00ean k\u1ebft'}
                        </span>
                      </div>
                      <h4 class="font-extrabold text-xs text-slate-900">${plat.name}</h4>
                      <p class="text-[11px] text-slate-500 leading-snug">${plat.supportedPublish}</p>
                      ${isConn ? `
                        <div class="pt-1 text-[11px] text-indigo-900 font-bold truncate">\uD83D\uDC64 ${acc.accountName}</div>
                      ` : ''}
                    </div>

                    <div class="pt-2 border-t border-slate-200 flex items-center justify-between">
                      ${isConn ? `
                        <button type="button" onclick="window.HahaSocialHub.disconnectAccount('${acc.id}')" class="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline">
                          Ng\u1eaft k\u1ebft n\u1ed1i
                        </button>
                      ` : `
                        <button type="button" onclick="window.HahaSocialHub.connectAccount('${key}')" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95">
                          + K\u1ebft n\u1ed1i OAuth
                        </button>
                      `}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 4. AI CONTENT STUDIO: SINH B\u00c0I VI\u1ebeT T\u1ef0 \u0110\u1ed8NG & PH\u00c2N PH\u1ed0I -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 class="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                  <span>\u2728 AI Content Generator Studio (T\u1ea1o B\u00e0i Vi\u1ebft T\u1ef1 \u0110\u1ed9ng)</span>
                </h3>
                <p class="text-xs text-slate-500">T\u1ef1 \u0111\u1ed9ng t\u1ea1o 3 phi\u00ean b\u1ea3n b\u00e0i vi\u1ebft kh\u00f4ng tr\u00f9ng l\u1eb7p, g\u1eafn link bio c\u00e1 nh\u00e2n c\u1ee7a b\u1ea1n.</p>
              </div>

              <!-- N\u00fat sinh b\u1eb1ng LLM tr\u1ef1c ti\u1ebfp -->
              <div class="flex items-center space-x-2">
                <button type="button" onclick="window.HahaSocialHub.generateLiveLlmContent()" class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-1.5">
                  <span>\uD83E\uDDE0</span>
                  <span>Sinh B\u1eb1ng AI Tr\u1ef1c Ti\u1ebfp</span>
                </button>
                <div id="hub-llm-generate-status" class="text-xs"></div>
              </div>
            </div>

            <!-- B\u1ed9 l\u1ecdc tham s\u1ed1 -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div class="space-y-1">
                <label class="block text-[11px] font-bold text-slate-600 uppercase">1. Ch\u1ecdn Chi\u1ebfn D\u1ecbch Tour:</label>
                <select id="hub-select-campaign" onchange="window.HahaSocialHub.onStudioConfigChange()" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold">
                  ${campaigns.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
              </div>
              <div class="space-y-1">
                <label class="block text-[11px] font-bold text-slate-600 uppercase">2. N\u1ec1n T\u1ea3ng Xu\u1ea5t B\u1ea3n:</label>
                <select id="hub-select-platform" onchange="window.HahaSocialHub.onStudioConfigChange()" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold">
                  ${Object.keys(this.PLATFORMS).map(k => `<option value="${k}">${this.PLATFORMS[k].icon} ${this.PLATFORMS[k].name}</option>`).join('')}
                </select>
              </div>
              <div class="space-y-1">
                <label class="block text-[11px] font-bold text-slate-600 uppercase">3. Phong C\u00e1ch CTV:</label>
                <select id="hub-select-style" onchange="window.HahaSocialHub.onStudioConfigChange()" class="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold">
                  ${Object.keys(this.PERSONA_STYLES).map(k => `<option value="${k}">${this.PERSONA_STYLES[k].avatar} ${this.PERSONA_STYLES[k].name}</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Container 3 bi\u1ebfn th\u1ec3 n\u1ed9i dung -->
            <div id="hub-studio-variants-container" class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <!-- Rendered dynamically by onStudioConfigChange -->
            </div>
          </div>

          <!-- 5. B\u1ea2NG THEO D\u00d5I B\u00c0I VI\u1ebeT \u0110\u00c3 \u0110\u0102NG C\u1ee6A B\u1ea0N -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="font-extrabold text-base text-slate-900">\uD83D\uDCCA L\u1ecbch S\u1eed B\u00e0i Vi\u1ebft & Hi\u1ec7u Qu\u1ea3 Chuy\u1ec3n \u0110\u1ed5i C\u1ee7a B\u1ea1n (${myPosts.length})</h3>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                    <th class="py-2.5 px-3 font-extrabold">Th\u1eddi Gian</th>
                    <th class="py-2.5 px-3 font-extrabold">K\u00eanh</th>
                    <th class="py-2.5 px-3 font-extrabold">Ti\u00eau \u0110\u1ec1 / B\u00e0i Vi\u1ebft</th>
                    <th class="py-2.5 px-3 font-extrabold text-right">L\u01b0\u1ee3t Xem</th>
                    <th class="py-2.5 px-3 font-extrabold text-right">L\u01b0\u1ee3t Click</th>
                    <th class="py-2.5 px-3 font-extrabold text-right">Leads</th>
                    <th class="py-2.5 px-3 font-extrabold text-right">Hoa H\u1ed3ng</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  ${myPosts.length === 0 ? `
                    <tr>
                      <td colspan="7" class="py-8 text-center text-slate-400 italic">Ch\u01b0a c\u00f3 b\u00e0i \u0111\u0103ng n\u00e0o \u0111\u01b0\u1ee3c xu\u1ea5t b\u1ea3n. H\u00e3y d\u00f9ng AI Studio ho\u1eb7c duy\u1ec7t b\u00e0i Marketing \u1edf tr\u00ean \u0111\u1ec3 b\u1eaft \u0111\u1ea7u!</td>
                    </tr>
                  ` : myPosts.map(p => `
                    <tr class="hover:bg-slate-50 transition-colors">
                      <td class="py-2.5 px-3 font-mono text-[11px] text-slate-500">${p.publishedAt || 'G\u1ea7n \u0111\u00e2y'}</td>
                      <td class="py-2.5 px-3">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${p.platform === 'FACEBOOK' ? 'bg-blue-100 text-blue-800' : (p.platform === 'INSTAGRAM' ? 'bg-pink-100 text-pink-800' : 'bg-slate-900 text-white')}">
                          ${p.platform}
                        </span>
                      </td>
                      <td class="py-2.5 px-3 font-semibold text-slate-900 max-w-xs truncate" title="${p.headline}">
                        ${p.headline}
                      </td>
                      <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-600">${(p.stats?.views || 0).toLocaleString()}</td>
                      <td class="py-2.5 px-3 text-right font-mono font-bold text-amber-600">${(p.stats?.clicks || 0).toLocaleString()}</td>
                      <td class="py-2.5 px-3 text-right font-mono font-extrabold text-emerald-600">${p.stats?.leads || 0}</td>
                      <td class="py-2.5 px-3 text-right font-mono font-extrabold text-indigo-600">${formatVND(p.stats?.commission || 0)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      `;

      this.onStudioConfigChange();
    },

    onStudioConfigChange: function() {
      const campId = document.getElementById('hub-select-campaign')?.value || 'CAMP-01';
      const platKey = document.getElementById('hub-select-platform')?.value || 'FACEBOOK';
      const styleKey = document.getElementById('hub-select-style')?.value || 'BLOGGER';

      const container = document.getElementById('hub-studio-variants-container');
      if (!container) return;

      const currentCtvId = (typeof currentUser !== 'undefined' && currentUser && currentUser.ctvId) ? currentUser.ctvId : 'CTV-001';
      const variants = this.generateAiContent(campId, platKey, styleKey, currentCtvId);

      container.innerHTML = variants.map((v, idx) => `
        <div class="border border-slate-200 rounded-2xl p-4 bg-white hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between space-y-3">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 text-indigo-800">${v.title}</span>
              <span class="text-[10px] text-slate-400">#${idx + 1}</span>
            </div>
            <h4 class="font-extrabold text-xs text-slate-900 leading-snug">${v.headline}</h4>
            <div class="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap font-sans border border-slate-100">
              ${v.body}
            </div>
            <div class="text-[10px] font-semibold text-slate-400 truncate">${v.hashtags}</div>
          </div>

          <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
            <button type="button" onclick="window.HahaSocialHub.publishPost('${campId}', '${platKey}', '${styleKey}', ${idx}, 'COPY')" class="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1">
              <span>\uD83D\uDCCB</span>
              <span>1-Click Copy</span>
            </button>
            <button type="button" onclick="window.HahaSocialHub.publishPost('${campId}', '${platKey}', '${styleKey}', ${idx}, 'DIRECT_API')" class="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center space-x-1">
              <span>\uD83D\uDE80</span>
              <span>\u0110\u0103ng Ngay</span>
            </button>
          </div>
        </div>
      `).join('');
    },

    // 10. GIAO DI\u1ec6N MODULE 12: B\u1ed8 PH\u1eacN MARKETING L\u1eee H\u00c0NH & \u0110I\u1ec0U PH\u1ed0I MXH CTV
    renderMarketingDepartmentModule: function() {
      const container = document.getElementById('view-module-12');
      if (!container) return;

      const campaigns = db.socialCampaigns || [];
      const ctvs = db.ctvs || [];
      const accounts = db.socialAccounts || [];
      const pendingPosts = db.ctvPendingPosts || [];
      const allPosts = db.socialPosts || [];
      const leads = db.socialLeads || [];

      const totalReach = allPosts.reduce((s, p) => s + (p.stats?.views || 0), 0);
      const totalClicks = allPosts.reduce((s, p) => s + (p.stats?.clicks || 0), 0);
      const totalLeads = leads.length + allPosts.reduce((s, p) => s + (p.stats?.leads || 0), 0);
      const connectedCount = accounts.filter(a => a.status === 'CONNECTED').length;

      container.innerHTML = `
        <div class="space-y-6 animate-fade-in">
          
          <!-- HEADER PH\u00d2NG MARKETING -->
          <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center space-x-2">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500 text-white uppercase tracking-wider">Ph\u00e2n H\u1ec7 12</span>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-400 text-slate-950 font-bold">Marketing & \u0110i\u1ec1u Ph\u1ed1i CTV</span>
                </div>
                <h2 class="text-xl font-extrabold tracking-tight">Ph\u00f2ng Marketing & Truy\u1ec1n Th\u00f4ng Du L\u1ecbch Sinh Th\u00e1i</h2>
                <p class="text-xs text-indigo-200">Qu\u1ea3n l\u00fd chi\u1ebfn d\u1ecbch ti\u1ebfp th\u1ecb l\u1eef h\u00e0nh &bull; \u0110i\u1ec1u ph\u1ed1i b\u00e0i \u0111\u0103ng t\u1ef1 \u0111\u1ed9ng / ph\u00ea duy\u1ec7t tr\u00ean trang c\u1ee7a ${ctvs.length} CTV</p>
              </div>

              <div class="flex items-center gap-2">
                <button type="button" onclick="window.HahaAiConnector && window.HahaAiConnector.openConfigModal()" class="px-3.5 py-2 rounded-xl text-xs font-extrabold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all">
                  \u2699\uFE0F C\u1ea5u H\u00ecnh AI Marketing
                </button>
              </div>
            </div>

            <!-- Stats KPI Cards -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-700/60">
              <div class="bg-white/5 rounded-2xl p-3 border border-white/10">
                <div class="text-[10px] text-slate-300 font-semibold uppercase">Chi\u1ebfn D\u1ecbch \u0110ang Ch\u1ea1y</div>
                <div class="text-xl font-mono font-black text-cyan-400">${campaigns.filter(c => c.status === 'ACTIVE').length} / ${campaigns.length}</div>
              </div>
              <div class="bg-white/5 rounded-2xl p-3 border border-white/10">
                <div class="text-[10px] text-slate-300 font-semibold uppercase">T\u00e0i Kho\u1ea3n CTV \u0110\u00e3 K\u1ebft N\u1ed1i</div>
                <div class="text-xl font-mono font-black text-emerald-400">${connectedCount} t\u00e0i kho\u1ea3n</div>
              </div>
              <div class="bg-white/5 rounded-2xl p-3 border border-white/10">
                <div class="text-[10px] text-slate-300 font-semibold uppercase">L\u01b0\u1ee3t Ti\u1ebfp C\u1eadn (Reach/Views)</div>
                <div class="text-xl font-mono font-black text-amber-300">${totalReach.toLocaleString()}</div>
              </div>
              <div class="bg-white/5 rounded-2xl p-3 border border-white/10">
                <div class="text-[10px] text-slate-300 font-semibold uppercase">Leads \u0110\u1ed5 V\u1ec1 CRM</div>
                <div class="text-xl font-mono font-black text-yellow-300">${totalLeads} kh\u00e1ch</div>
              </div>
            </div>
          </div>

          <!-- B\u1ed8 C\u00d4NG C\u1ee4 1: TR\u00ccNH SO\u1ea0N TH\u1ea2O & PH\u00c2N PH\u1ed0I B\u00c0I \u0110\u0102NG \u0110\u1ebeN CTV -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 class="font-extrabold text-base text-slate-900 flex items-center space-x-2">
                  <span>\uD83D\uDCE2 So\u1ea1n Th\u1ea3o & Ph\u00e2n Ph\u1ed1i N\u1ed9i Dung \u0110\u1ebfn M\u1ea1ng L\u01b0\u1edbi CTV</span>
                </h3>
                <p class="text-xs text-slate-500">Marketing ph\u00e1t h\u00e0nh b\u00e0i vi\u1ebft -> T\u1ef1 \u0111\u1ed9ng \u0111\u0103ng ho\u1eb7c g\u1eedi H\u00f2m th\u01b0 CTV ph\u00ea duy\u1ec7t.</p>
              </div>
              <button type="button" onclick="window.HahaSocialHub.fillAiDraftForMarketing()" class="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-extrabold rounded-xl border border-indigo-200 transition-all flex items-center space-x-1">
                <span>\uD83E\uDDE0</span>
                <span>AI So\u1ea1n B\u00e0i M\u1eabu</span>
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- C\u1ed9t tr\u00e1i: C\u1ea5u h\u00ecnh ph\u00e2n ph\u1ed1i -->
              <div class="space-y-3">
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Chi\u1ebfn D\u1ecbch Tour:</label>
                    <select id="mkt-dispatch-camp" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold">
                      ${campaigns.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">N\u1ec1n T\u1ea3ng MXH:</label>
                    <select id="mkt-dispatch-plat" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold">
                      <option value="FACEBOOK">\uD83D\uDCD8 Facebook Page / Group</option>
                      <option value="TIKTOK">\uD83C\uDFAC TikTok Video Script 30s</option>
                      <option value="INSTAGRAM">\uD83D\uDCF8 Instagram Post / Reels</option>
                      <option value="ZALO">\uD83D\uDCAC Zalo OA / Tin Nh\u1eafn</option>
                    </select>
                  </div>
                </div>

                <!-- Ch\u1ebf \u0111\u1ed9 ph\u00e2n ph\u1ed1i -->
                <div class="p-3 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-2">
                  <label class="block text-[10px] font-extrabold text-indigo-900 uppercase">Ch\u1ebf \u0110\u1ed9 Xu\u1ea5t B\u1ea3n L\u00ean K\u00eanh CTV:</label>
                  <div class="space-y-1.5 text-xs">
                    <label class="flex items-center space-x-2 cursor-pointer font-semibold text-slate-800">
                      <input type="radio" name="mkt-dispatch-mode" value="REQUIRE_APPROVAL" checked class="text-indigo-600 focus:ring-indigo-500">
                      <span>\uD83D\uDCE8 G\u1eedi H\u00f2m th\u01b0 CTV ph\u00ea duy\u1ec7t tr\u01b0\u1edbc khi \u0111\u0103ng (Khuy\u00ean d\u00f9ng)</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer font-semibold text-slate-800">
                      <input type="radio" name="mkt-dispatch-mode" value="AUTO_PUBLISH" class="text-indigo-600 focus:ring-indigo-500">
                      <span>\u26A1 T\u1ef1 \u0111\u1ed9ng \u0111\u0103ng ngay l\u00ean t\u00e0i kho\u1ea3n CTV \u0111\u00e3 c\u1ea5p quy\u1ec7n OAuth</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] font-bold text-slate-600 uppercase">Ph\u1ea1m Vi CTV Nh\u1eadn B\u00e0i:</label>
                  <select id="mkt-dispatch-ctv-scope" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold">
                    <option value="ALL">\uD83C\uDF10 To\u00e0n b\u1ed9 m\u1ea1ng l\u01b0\u1edbi CTV (${ctvs.length} c\u1ed9ng t\u00e1c vi\u00ean)</option>
                    ${ctvs.map(c => `<option value="${c.id}">${c.name} (${c.id})</option>`).join('')}
                  </select>
                </div>

                <div>
                  <label class="block text-[10px] font-bold text-slate-600 uppercase">URL \u1ea2nh / Video Media HD:</label>
                  <input type="text" id="mkt-dispatch-media" value="https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono">
                </div>
              </div>

              <!-- C\u1ed9t ph\u1ea3i: So\u1ea1n th\u1ea3o n\u1ed9i dung -->
              <div class="space-y-3 flex flex-col justify-between">
                <div class="space-y-2">
                  <div>
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Ti\u00eau \u0110\u1ec1 B\u00e0i Vi\u1ebft / Hook TikTok:</label>
                    <input type="text" id="mkt-dispatch-headline" placeholder="Nh\u1eadp ti\u00eau \u0111\u1ec1 thu h\u00fat..." class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900">
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">N\u1ed9i Dung B\u00e0i Vi\u1ebft (T\u1ef1 \u0111\u1ed9ng ch\u00e8n t\u00ean & link CTV):</label>
                    <textarea id="mkt-dispatch-content" rows="6" placeholder="So\u1ea1n n\u1ed9i dung ti\u1ebfp th\u1ecb..." class="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 leading-relaxed font-sans"></textarea>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Hashtags:</label>
                    <input type="text" id="mkt-dispatch-hashtags" value="#HaHaEcoTravel #DuLichSinhThai #NamCatTien #Tour2N1D" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono">
                  </div>
                </div>

                <button type="button" onclick="window.HahaSocialHub.handleMarketingSubmit()" class="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2">
                  <span>\uD83D\uDE80</span>
                  <span>Ph\u00e1t H\u00e0nh & Ph\u00e2n Ph\u1ed1i \u0110\u1ebfn M\u1ea1ng L\u01b0\u1edbi CTV</span>
                </button>
              </div>
            </div>
          </div>

          <!-- B\u1ed8 C\u00d4NG C\u1ee4 2: B\u1ea2NG GI\u00c1M S\u00c1T T\u00c0I KHO\u1ea2N MXH CTV \u0110\u00c3 C\u1ea4P QUY\u1ec0N -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 class="font-extrabold text-base text-slate-900">\uD83D\uDC65 Gi\u00e1m S\u00e1t K\u1ebft N\u1ed1i M\u1ea1ng X\u00e3 H\u1ed9i M\u1ea1ng L\u01b0\u1edbi CTV (${accounts.length} t\u00e0i kho\u1ea3n)</h3>
                <p class="text-xs text-slate-500">Ki\u1ec3m so\u00e1t t\u00ecnh tr\u1ea1ng k\u1ebft n\u1ed1i OAuth, ph\u1ea1m vi quy\u1ec1n v\u00e0 m\u1ee9c \u0111\u1ed9 s\u1eb5n s\u00e0ng \u0111\u0103ng b\u00e0i c\u1ee7a t\u1eebng CTV.</p>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                    <th class="py-2.5 px-3 font-extrabold">M\u00e3 CTV</th>
                    <th class="py-2.5 px-3 font-extrabold">H\u1ecd T\u00ean CTV</th>
                    <th class="py-2.5 px-3 font-extrabold">N\u1ec1n T\u1ea3ng</th>
                    <th class="py-2.5 px-3 font-extrabold">T\u00ean T\u00e0i Kho\u1ea3n / Page</th>
                    <th class="py-2.5 px-3 font-extrabold">Tr\u1ea1ng Th\u00e1i</th>
                    <th class="py-2.5 px-3 font-extrabold">H\u1ea1n Token</th>
                    <th class="py-2.5 px-3 font-extrabold text-right">B\u00e0i \u0110\u00e3 \u0110\u0103ng</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                  ${ctvs.map(c => {
                    const ctvAccs = accounts.filter(a => a.ctvId === c.id);
                    const postsCount = allPosts.filter(p => p.ctvId === c.id).length;
                    if (ctvAccs.length === 0) {
                      return `
                        <tr class="hover:bg-slate-50">
                          <td class="py-2.5 px-3 font-mono font-bold text-slate-500">${c.id}</td>
                          <td class="py-2.5 px-3 font-semibold text-slate-800">${c.name}</td>
                          <td colspan="4" class="py-2.5 px-3 italic text-slate-400">Ch\u01b0a k\u1ebft n\u1ed1i OAuth (S\u1eed d\u1ee5ng ch\u1ebf \u0111\u1ed9 g\u1eedi H\u00f2m th\u01b0 duy\u1ec7t)</td>
                          <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-600">${postsCount}</td>
                        </tr>
                      `;
                    }
                    return ctvAccs.map((a, i) => `
                      <tr class="hover:bg-slate-50">
                        ${i === 0 ? `<td rowspan="${ctvAccs.length}" class="py-2.5 px-3 font-mono font-bold text-indigo-700 align-top">${c.id}</td><td rowspan="${ctvAccs.length}" class="py-2.5 px-3 font-semibold text-slate-900 align-top">${c.name}</td>` : ''}
                        <td class="py-2.5 px-3">
                          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${a.platform === 'FACEBOOK' ? 'bg-blue-100 text-blue-800' : (a.platform === 'INSTAGRAM' ? 'bg-pink-100 text-pink-800' : 'bg-slate-900 text-white')}">
                            ${a.platform}
                          </span>
                        </td>
                        <td class="py-2.5 px-3 font-semibold text-slate-800">${a.accountName}</td>
                        <td class="py-2.5 px-3">
                          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${a.status === 'CONNECTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
                            ${a.status === 'CONNECTED' ? '\u2714 \u0110\u00e3 C\u1ea5p Quy\u1ec1n' : '\u2715 Ng\u1eaft k\u1ebft n\u1ed1i'}
                          </span>
                        </td>
                        <td class="py-2.5 px-3 text-[11px] font-mono text-slate-500">${a.expiresAt || 'D\u00e0i h\u1ea1n'}</td>
                        <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-600">${postsCount}</td>
                      </tr>
                    `).join('');
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- B\u1ed8 C\u00d4NG C\u1ee4 3: DANH S\u00c1CH B\u00c0I \u0110\u00c3 PH\u00c2N PH\u1ed0I G\u1ea6N \u0110\u00c2Y -->
          <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 class="font-extrabold text-base text-slate-900">\uD83D\uDCDD L\u1ecbch S\u1eed \u0110i\u1ec1u Ph\u1ed1i N\u1ed9i Dung Marketing (${pendingPosts.length})</h3>
            </div>

            <div class="space-y-3">
              ${pendingPosts.map(p => `
                <div class="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div class="space-y-1">
                    <div class="flex items-center space-x-2">
                      <span class="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 text-indigo-800">${p.id}</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold ${p.platform === 'FACEBOOK' ? 'bg-blue-100 text-blue-800' : 'bg-slate-900 text-white'}">${p.platform}</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold ${p.mode === 'AUTO_PUBLISH' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                        ${p.mode === 'AUTO_PUBLISH' ? '\u26A1 T\u1ef1 \u0111\u1ed9ng \u0111\u0103ng' : '\uD83D\uDCE8 Ch\u1edd CTV duy\u1ec7t'}
                      </span>
                      <span class="text-[10px] text-slate-400 font-mono">${p.createdAt}</span>
                    </div>
                    <h4 class="font-bold text-xs text-slate-900">${p.headline}</h4>
                    <p class="text-[11px] text-slate-600 line-clamp-2">${p.content.slice(0, 150)}...</p>
                  </div>

                  <div class="flex items-center space-x-2 flex-shrink-0">
                    <button type="button" onclick="alert('${p.headline.replace(/'/g, "\\'")}\\n\\n${p.content.replace(/'/g, "\\'").replace(/\n/g, '\\n')}')" class="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-100">
                      Xem Chi Ti\u1ebft
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      `;
    },

    fillAiDraftForMarketing: function() {
      const campId = document.getElementById('mkt-dispatch-camp')?.value || 'CAMP-01';
      const camp = (db.socialCampaigns || []).find(c => c.id === campId) || (db.socialCampaigns || [])[0];

      const headlineEl = document.getElementById('mkt-dispatch-headline');
      const contentEl = document.getElementById('mkt-dispatch-content');
      const tagsEl = document.getElementById('mkt-dispatch-hashtags');

      if (headlineEl) headlineEl.value = `\uD83C\uDFDE\uFE0F ${camp.name}: H\u00e0nh tr\u00ecnh ch\u1eefa l\u00e0nh gi\u1eefa r\u1eebng nguy\u00ean sinh tuy\u1ec7t \u0111\u1eb9p`;
      if (contentEl) contentEl.value = `Ch\u00e0o c\u1ea3 nh\u00e0! N\u1ebfu cu\u1ed1i tu\u1ea7n n\u00e0y b\u1ea1n \u0111ang t\u00ecm m\u1ed9t n\u01a1i th\u1eadt b\u00ecnh y\u00ean \u0111\u1ec3 s\u1ea1c l\u1ea1i n\u0103ng l\u01b0\u1ee3ng, h\u00e3y c\u00f9ng m\u00ecnh tham gia ${camp.tourName}!\n\n\u2714\uFE0F L\u1ecbch tr\u00ecnh thi\u00ean nhi\u00ean nguy\u00ean b\u1ea3n, kh\u00f4ng r\u00e1c th\u1ea3i nh\u1ef1a.\n\u2714\uFE0F ${camp.perks}.\n\u2714\uFE0F Cam k\u1ebft d\u1ecbch v\u1ee5 tr\u1ecdn g\u00f3i chu\u1ea9n 4 sao t\u1eeb HaHa Eco Travel.\n\nNh\u1ea5n v\u00e0o link b\u00ean d\u01b0\u1edbi ho\u1eb7c nh\u1eafn tin cho m\u00ecnh \u0111\u1ec3 nh\u1eadn ngay \u01b0u \u0111\u00e3i 10% cho nh\u00f3m t\u1eeb 4 kh\u00e1ch!`;
      if (tagsEl) tagsEl.value = `#HaHaEcoTravel #${camp.code} #DuLichSinhThai #GreenTravel #HealingTour`;

      alert("\uD83E\uDDE0 \u0110\u00e3 \u0111i\u1ec1n n\u1ed9i dung g\u1ee3i \u00fd t\u1eeb B\u1ed9 N\u00e3o AI cho chi\u1ebfn d\u1ecbch!");
    },

    handleMarketingSubmit: function() {
      const campId = document.getElementById('mkt-dispatch-camp')?.value || 'CAMP-01';
      const plat = document.getElementById('mkt-dispatch-plat')?.value || 'FACEBOOK';
      const headline = document.getElementById('mkt-dispatch-headline')?.value || '';
      const content = document.getElementById('mkt-dispatch-content')?.value || '';
      const hashtags = document.getElementById('mkt-dispatch-hashtags')?.value || '';
      const media = document.getElementById('mkt-dispatch-media')?.value || '';
      const scope = document.getElementById('mkt-dispatch-ctv-scope')?.value || 'ALL';

      const modeInput = document.querySelector('input[name="mkt-dispatch-mode"]:checked');
      const mode = modeInput ? modeInput.value : 'REQUIRE_APPROVAL';

      this.dispatchMarketingPost(campId, plat, headline, content, hashtags, media, mode, scope);
    },

    // 11. GI\u1ea2 L\u1eacP KH\u00c1CH TI\u1ec0M N\u0102NG T\u1eea MXH CTV \u0110\u1ed4 V\u1ec0 CRM
    simulateIncomingLead: function(ctvId, campaignCode, custName, phone, pax) {
      if (!custName || !phone) {
        alert("Vui l\u00f2ng nh\u1eadp T\u00ean kh\u00e1ch v\u00e0 S\u1ed1 \u0111i\u1ec7n tho\u1ea1i!");
        return;
      }

      const currentCtvId = ctvId || ((typeof currentUser !== 'undefined' && currentUser && currentUser.ctvId) ? currentUser.ctvId : 'CTV-001');
      const ctv = (db.ctvs || []).find(c => c.id === currentCtvId) || { id: currentCtvId, name: 'C\u1ed9ng t\u00e1c vi\u00ean' };
      const camp = (db.socialCampaigns || []).find(c => c.code === campaignCode) || (db.socialCampaigns || [])[0];

      const newLead = {
        id: 'LEAD-' + Date.now().toString(36).toUpperCase(),
        name: custName.trim(),
        phone: phone.trim(),
        source: 'AI_SOCIAL_HUB',
        ctvId: ctv.id,
        campaignCode: camp.code,
        tourInterest: camp.tourName,
        pax: parseInt(pax) || 2,
        status: 'TIEM_NANG',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };

      if (!db.socialLeads) db.socialLeads = [];
      db.socialLeads.unshift(newLead);

      // Th\u00eam kh\u00e1ch v\u00e0o db.customers \u0111\u1ec3 ph\u00f2ng Sale ch\u0103m s\u00f3c
      if (!db.customers) db.customers = [];
      const newCust = {
        id: Date.now(),
        code: 'KH-' + Math.floor(1000 + Math.random() * 9000),
        name: custName.trim(),
        phone: phone.trim(),
        email: `${phone.trim()}@lead.hahaecotravel.com`,
        source: 'AI_SOCIAL_HUB',
        leadStage: 'TIEM_NANG',
        ctvId: ctv.id,
        assignedTo: 'sale01',
        notes: `Kh\u00e1ch \u0111\u0103ng k\u00fd qua link ti\u1ebfp th\u1ecb MXH c\u1ee7a CTV ${ctv.name} (${ctv.id}) - Chi\u1ebfn d\u1ecbch: ${camp.name}`,
        createdAt: new Date().toISOString()
      };
      db.customers.unshift(newCust);

      // T\u0103ng th\u1ed1ng k\u00ea cho b\u00e0i vi\u1ebft g\u1ea7n nh\u1ea5t c\u1ee7a CTV
      const recentPost = (db.socialPosts || []).find(p => p.ctvId === ctv.id);
      if (recentPost && recentPost.stats) {
        recentPost.stats.clicks = (recentPost.stats.clicks || 0) + 1;
        recentPost.stats.leads = (recentPost.stats.leads || 0) + 1;
      }

      if (typeof saveDatabase === 'function') saveDatabase();
      if (typeof recordAuditLog === 'function') {
        recordAuditLog('LEAD M\u1ea0NG X\u00c3 H\u1ed8I M\u1edaI', `Kh\u00e1ch ${custName} (${phone}) \u0111\u00e3 \u0111\u0103ng k\u00fd qua link CTV ${ctv.id}. T\u1ef1 \u0111\u1ed9ng chuy\u1ec3n v\u1ec1 CRM Sale.`);
      }

      // N\u1ebfu c\u00f3 n8n webhook th\u00ec g\u1eedi th\u00f4ng b\u00e1o
      if (window.HahaAiConnector && typeof window.HahaAiConnector.triggerN8nLeadWebhook === 'function') {
        window.HahaAiConnector.triggerN8nLeadWebhook(newLead);
      }

      alert(`\u2705 \u0110\u00c3 THU TH\u1eacP KH\u00c1CH TI\u1ec0M N\u0102NG M\u1edaI!\n\nKh\u00e1ch: ${custName} (${phone})\nNgu\u1ed3n: MXH CTV ${ctv.name} (${ctv.id})\nChi\u1ebfn d\u1ecbch: ${camp.name}\n\n\u2714\uFE0F \u0110\u00e3 t\u1ef1 \u0111\u1ed9ng \u0111\u1ed3ng b\u1ed9 v\u00e0o Ph\u00e2n h\u1ec7 2 (CRM Kh\u00e1ch H\u00e0ng) cho ph\u00f2ng Sale g\u1ecdi t\u01b0 v\u1ea5n!`);
      this.renderCtvSocialTab();
    },

    openSimulateLeadModal: function() {
      const name = prompt("Nh\u1eadp T\u00ean kh\u00e1ch h\u00e0ng ti\u1ec1m n\u0103ng th\u1eed nghi\u1ec7m:", "Tr\u1ea7n V\u0103n Minh");
      if (!name) return;
      const phone = prompt("Nh\u1eadp S\u1ed1 \u0111i\u1ec7n tho\u1ea1i kh\u00e1ch h\u00e0ng:", "0918765432");
      if (!phone) return;
      this.simulateIncomingLead(null, 'cattien_nov26', name, phone, 4);
    },

    // 12. T\u00c1C V\u1ee4 LLM TR\u1ef0C TI\u1ebeP T\u1eea B\u1ed8 N\u00c3O AI CHO CTV (100% TI\u1ebeNG VI\u1ec6T S\u1ea0CH)
    generateLiveLlmContent: async function() {
      const campId = document.getElementById("hub-select-campaign")?.value || "CAMP-01";
      const platKey = document.getElementById("hub-select-platform")?.value || "FACEBOOK";
      const styleKey = document.getElementById("hub-select-style")?.value || "BLOGGER";
      const camp = (db.socialCampaigns || []).find(c => c.id === campId) || (db.socialCampaigns || [])[0];
      const p = this.PLATFORMS[platKey] || this.PLATFORMS.FACEBOOK;
      const style = this.PERSONA_STYLES[styleKey] || this.PERSONA_STYLES.BLOGGER;

      const currentCtvId = (typeof currentUser !== 'undefined' && currentUser && currentUser.ctvId) ? currentUser.ctvId : 'CTV-001';
      const ctv = (db.ctvs || []).find(c => c.id === currentCtvId) || (db.ctvs || [])[0] || { id: "CTV-001", refCode: "HAHA-YEN88", name: "Ho\u00e0ng Y\u1ebfn" };
      const refUrl = `https://daoquangha0201.github.io/HAHA-ECO-TRAVEL/storefront.html?ref=${ctv.id}&camp=${camp.code}`;

      if (!window.HahaAiConnector) {
        alert('L\u1ed7i: H\u1ec7 th\u1ed1ng AI Connector ch\u01b0a s\u1eb5n s\u00e0ng.');
        return;
      }

      const provider = window.HahaAiConnector.config.activeProvider || 'gemini';
      const meta = window.HahaAiConnector.getMetadata(provider);
      const statusEl = document.getElementById("hub-llm-generate-status");
      if (statusEl) {
        statusEl.innerHTML = `<span class="text-indigo-600 font-bold animate-pulse">\u23F3 \u0110ang g\u1ecdi ${meta.name}...</span>`;
      }

      const prompt = `Vi\u1ebft b\u00e0i qu\u1ea3ng b\u00e1 b\u00e1n tour du l\u1ecbch: ${camp.tourName}. N\u1ec1n t\u1ea3ng: ${p.name}. Phong c\u00e1ch CTV: ${style.name}. CTV: ${ctv.name}. Link ref: ${refUrl}. H\u00e3y t\u1ea1o \u0111\u1ea7y \u0111\u1ee7 3 phi\u00ean b\u1ea3n (C\u00e2u chuy\u1ec7n tr\u1ea3i nghi\u1ec7m ch\u1eefa l\u00e0nh, Review c\u1ea9m nang b\u00ed k\u00edp, K\u1ecbch b\u1ea3n TikTok 30s c\u00f3 g\u1ee3i \u00fd g\u00f3c quay).`;
      const sysPrompt = `B\u1ea1n l\u00e0 chuy\u00ean gia AI Marketing du l\u1ecbch sinh th\u00e1i c\u1ee7a HaHa Eco Travel. V\u0103n phong Ti\u1ebfng Vi\u1ec7t \u1ea5m \u00e1p, truy\u1ec1n c\u1ea3m, kh\u00f4ng s\u00e1o r\u1ed7ng, nh\u1ea5n m\u1ea1nh du l\u1ecbch kh\u00f4ng r\u00e1c th\u1ea3i nh\u1ef1a v\u00e0 tr\u1ea3i nghi\u1ec7m ch\u1eefa l\u00e0nh.`;

      try {
        const res = await window.HahaAiConnector.chatCompletion(prompt, sysPrompt, provider);
        if (res && res.text) {
          const container = document.getElementById("hub-studio-variants-container");
          if (container) {
            container.innerHTML = `
              <div class="col-span-full bg-gradient-to-r from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-200 space-y-3 animate-scale-up">
                <div class="flex items-center justify-between">
                  <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-600 text-white flex items-center space-x-1.5 shadow-sm">
                    <span>${meta.icon}</span>
                    <span>K\u1ebft qu\u1ea3 tr\u1ef1c ti\u1ebfp t\u1eeb ${meta.name} (${res.model} \u2022 ${res.latencyMs}ms)</span>
                  </span>
                  <div class="flex items-center space-x-2">
                    <button type="button" onclick="window.HahaSocialHub.closeLlmOutput()" class="px-2.5 py-1.5 bg-white hover:bg-rose-50 text-rose-600 font-bold text-xs rounded-xl border border-rose-200 shadow-xs transition-all" title="\u0110\u00f3ng k\u1ebft qu\u1ea3 AI">
                      \u2715 \u0110\u00f3ng
                    </button>
                    <button type="button" onclick="window.HahaSocialHub.copyRawLlmText()" class="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-xs transition-all">
                      \uD83D\uDCCB Sao ch\u00e9p to\u00e0n b\u1ed9
                    </button>
                  </div>
                </div>
                <div id="hub-raw-llm-text" class="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans max-h-96 overflow-y-auto shadow-inner">
                  ${res.text}
                </div>
              </div>
            `;
          }
          if (statusEl) statusEl.innerHTML = `<span class="text-emerald-700 font-bold">\u2714 Ho\u00e0n t\u1ea5t b\u1edfi ${meta.name} (${res.latencyMs}ms)!</span>`;
        }
      } catch (err) {
        alert("L\u1ed7i g\u1ecdi AI: " + err.message);
        if (statusEl) statusEl.innerHTML = `<span class="text-rose-600 font-bold">\u2715 L\u1ed7i: ${err.message}</span>`;
      }
    },

    closeLlmOutput: function() {
      this.onStudioConfigChange();
      const statusEl = document.getElementById("hub-llm-generate-status");
      if (statusEl) statusEl.innerHTML = "";
    },

    copyRawLlmText: function() {
      const el = document.getElementById("hub-raw-llm-text");
      if (el && navigator.clipboard) {
        navigator.clipboard.writeText(el.innerText).then(() => alert("\u2705 \u0110\u00e3 sao ch\u00e9p to\u00e0n b\u1ed9 n\u1ed9i dung t\u1eeb AI v\u00e0o Clipboard!"));
      }
    }
  };

  HahaSocialHub.initData();
  window.HahaSocialHub = HahaSocialHub;

  window.addEventListener('DOMContentLoaded', function() {
    HahaSocialHub.initData();
  });

})(window);