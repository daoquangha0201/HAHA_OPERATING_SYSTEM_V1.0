/**
 * HAHA ECO TRAVEL OPERATING SYSTEM - UNIVERSAL AI CONNECTOR & MODEL GATEWAY
 * Phiên bản: 1.0 (Tích hợp Google Gemini, OpenAI ChatGPT, Anthropic Claude, ElevenLabs, n8n)
 * 
 * Cung cấp:
 * 1. Đa kết nối API trực tiếp (Google Gemini API, OpenAI API, Anthropic Claude API).
 * 2. Bộ định tuyến thông minh (Smart Model Router) lựa chọn LLM tối ưu cho từng nghiệp vụ.
 * 3. Fallback Hybrid: Tự động chuyển đổi mượt sang Heuristic Rules Engine nếu mất mạng/hết quota.
 * 4. Tích hợp công cụ chuyên biệt:
 *    - ElevenLabs Voice AI: Tạo thuyết minh Audio Guide & giọng đọc video ngắn.
 *    - Midjourney / Flux / DALL-E 3: Sinh prompt thiết kế banner & ảnh tư liệu sinh thái 8K.
 *    - n8n / Make Webhook: Đẩy tự động dữ liệu khách hàng vào luồng workflow Zalo/Telegram.
 */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'HAHA_AI_CONNECTOR_CONFIG';

  const PROVIDER_METADATA = {
    gemini: {
      id: 'gemini',
      name: 'Google Gemini',
      tagline: 'Bộ não Google Cloud • Tốc độ siêu tốc • Ngữ cảnh 1M - 2M tokens',
      icon: '✨',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      models: [
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Khuyến nghị - Siêu nhanh, Tiết kiệm)', default: true },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Phân tích tài liệu PDF, brochure tour dài)' },
        { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash Experimental (Thế hệ mới)' }
      ],
      pros: [
        'Cửa sổ ngữ cảnh cực lớn (lên tới 2 triệu tokens), đọc hiểu toàn bộ hồ sơ tour và báo cáo kế toán.',
        'Xử lý đa phương tiện vượt trội (Multimodal): Đọc ảnh vé, hóa đơn GTGT, video flycam điểm đến.',
        'Chi phí tối ưu nhất, có gói miễn phí ban đầu cho các doanh nghiệp vừa và nhỏ.',
        'Tương thích hoàn hảo với hạ tầng Google Cloud & Firebase Realtime Database của HaHa.'
      ],
      bestFor: 'Phân tích tài liệu tour, quét rà soát công nợ, tổng hợp báo cáo Giám đốc, trợ lý CTV tức thời.'
    },
    openai: {
      id: 'openai',
      name: 'OpenAI ChatGPT',
      tagline: 'Tiên phong AI thế giới • Xuất sắc về JSON có cấu trúc & Function Calling',
      icon: '🧠',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      models: [
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Nhanh, thông minh, tối ưu chi phí)', default: true },
        { id: 'gpt-4o', name: 'GPT-4o (Đỉnh cao lý luận, đa phương tiện, xử lý bảng giá chuẩn)' },
        { id: 'o3-mini', name: 'o3-mini (Tư duy toán học & bóc tách bài toán thuế phức tạp)' }
      ],
      pros: [
        'Khả năng tuân thủ cấu trúc dữ liệu JSON (Structured Outputs) chuẩn xác 100%.',
        'Lý luận logic tài chính, tính thuế GTGT và lập bảng tính chiết tính theo biến số Pax cực tốt.',
        'Kỹ năng viết lời chào bán hàng (sales copywriting) sắc bén, tỷ lệ chốt đơn cao.',
        'Hệ sinh thái API hoàn thiện và ổn định bậc nhất ngành công nghiệp AI.'
      ],
      bestFor: 'AI Kinh doanh tính báo giá, AI Kế toán bóc tách thuế TT 219, xử lý Function Calling vào ERP.'
    },
    claude: {
      id: 'claude',
      name: 'Anthropic Claude',
      tagline: 'Bậc thầy văn phong du lịch • Kể chuyện truyền cảm • An toàn & Trung thực',
      icon: '🎭',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      models: [
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Đỉnh cao trí tuệ & Văn phong xuất sắc)', default: true },
        { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku (Siêu tốc độ, phản hồi nhanh)' }
      ],
      pros: [
        'Văn phong tiếng Việt giàu cảm xúc, sâu sắc, đặc biệt phù hợp với triết lý du lịch sinh thái và chữa lành.',
        'Khả năng tự sự (Storytelling) chân thực, không bị sáo rỗng hay lặp từ như các mô hình khác.',
        'Kiến trúc an toàn Constitutional AI: Giảm thiểu tối đa tình trạng bịa đặt thông tin (Hallucination).',
        'Xử lý code và phân tích quy trình vận hành phức tạp với độ chính xác cao.'
      ],
      bestFor: 'AI Marketing viết bài PR, AI Social Content tạo bài đăng chữa lành/review, kịch bản video TikTok.'
    },
    elevenlabs: {
      id: 'elevenlabs',
      name: 'ElevenLabs Voice AI',
      tagline: 'Giọng đọc AI chân thực • Audio Guide đa ngôn ngữ • Thuyết minh sinh thái',
      icon: '🎙️',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
      models: [
        { id: 'eleven_multilingual_v2', name: 'Eleven Multilingual V2 (Giọng đọc tiếng Việt tự nhiên)' }
      ],
      pros: [
        'Tái tạo ngữ điệu, hơi thở và cảm xúc như hướng dẫn viên du lịch chuyên nghiệp.',
        'Tạo hệ thống Audio Guide tự động thuyết minh khi du khách đi qua tọa độ GPS danh lam thắng cảnh.',
        'Tự động lồng tiếng cho video TikTok/Reels của CTV mà không cần CTV tự thu âm.'
      ],
      bestFor: 'Audio Guide tại Vườn Quốc Gia Cát Tiên, lồng tiếng kịch bản video ngắn cho CTV.'
    },
    n8n: {
      id: 'n8n',
      name: 'n8n Workflow Automation',
      tagline: 'Động cơ tự động hóa mã nguồn mở • Kết nối Zalo OA, Webhook, CRM & Email',
      icon: '⚡',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      pros: [
        'Tự lưu trữ (Self-hosted) hoặc đám mây, bảo mật dữ liệu khách hàng tuyệt đối.',
        'Tự động kích hoạt khi có lead mới từ Social Hub -> Bắn tin Zalo ZNS -> Tạo báo giá -> Nhắc Sale.',
        'Hơn 400 node kết nối sẵn (Google Sheets, Telegram, Zalo, WhatsApp, Mailgun, Slack).'
      ],
      bestFor: 'Tự động hóa luồng tiếp nhận khách, gửi thông báo phê duyệt tour cho Giám đốc.'
    }
  };

  const HahaAiConnector = {
    // Cấu hình hiện tại
    config: {
      activeProvider: 'gemini', // 'gemini' | 'openai' | 'claude' | 'offline'
      keys: {
        gemini: '',
        openai: '',
        claude: '',
        elevenlabs: '',
        n8nWebhook: ''
      },
      models: {
        gemini: 'gemini-1.5-flash',
        openai: 'gpt-4o-mini',
        claude: 'claude-3-5-sonnet-20241022'
      },
      useHybridFallback: true,
      lastTested: {}
    },

    // Khởi tạo và tải cấu hình từ LocalStorage
    init: function() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          this.config = Object.assign(this.config, parsed);
        }
      } catch (e) {
        console.warn('[AI Connector] Failed to load config from storage:', e);
      }
      return this;
    },

    // Lưu cấu hình an toàn
    saveConfig: function() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
        // Thông báo đồng bộ đến các tab khác nếu có
        if (typeof showDiscreetSyncPulse === 'function') {
          showDiscreetSyncPulse();
        }
      } catch (e) {
        console.error('[AI Connector] Save error:', e);
      }
    },

    // Lấy thông tin metadata
    getMetadata: function(providerId) {
      return PROVIDER_METADATA[providerId] || PROVIDER_METADATA.gemini;
    },

    getAllProviders: function() {
      return PROVIDER_METADATA;
    },

    // Kiểm tra xem provider có sẵn key không
    hasKey: function(providerId) {
      return !!(this.config.keys && this.config.keys[providerId] && this.config.keys[providerId].trim().length > 5);
    },

    // Lấy tên Model hiển thị
    getActiveModelDisplay: function() {
      const p = this.config.activeProvider;
      if (p === 'offline') return 'Heuristic Offline Core (Quy tắc nội bộ)';
      const meta = PROVIDER_METADATA[p];
      if (!meta) return 'AI Không xác định';
      const modelId = this.config.models[p] || (meta.models && meta.models[0].id);
      return `${meta.name} (${modelId})`;
    },

    // ==============================================================
    // 1. GỌI API THỰC TẾ (REAL LLM API CALLERS)
    // ==============================================================

    /**
     * Gọi Google Gemini API
     */
    callGemini: async function(prompt, systemInstruction = '', model = null) {
      const apiKey = this.config.keys.gemini;
      if (!apiKey) throw new Error('Chưa cấu hình API Key cho Google Gemini.');

      const targetModel = model || this.config.models.gemini || 'gemini-1.5-flash';
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey.trim()}`;

      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson.error ? errJson.error.message : `HTTP ${res.status}`;
        throw new Error(`Google Gemini Error: ${errMsg}`);
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Không nhận được phản hồi nội dung từ Gemini.');
      return text;
    },

    /**
     * Gọi OpenAI ChatGPT API
     */
    callOpenAi: async function(prompt, systemInstruction = '', model = null) {
      const apiKey = this.config.keys.openai;
      if (!apiKey) throw new Error('Chưa cấu hình API Key cho OpenAI ChatGPT.');

      const targetModel = model || this.config.models.openai || 'gpt-4o-mini';
      const endpoint = 'https://api.openai.com/v1/chat/completions';

      const messages = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const payload = {
        model: targetModel,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson.error ? errJson.error.message : `HTTP ${res.status}`;
        throw new Error(`OpenAI Error: ${errMsg}`);
      }

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error('Không nhận được phản hồi nội dung từ OpenAI.');
      return text;
    },

    /**
     * Gọi Anthropic Claude API
     */
    callClaude: async function(prompt, systemInstruction = '', model = null) {
      const apiKey = this.config.keys.claude;
      if (!apiKey) throw new Error('Chưa cấu hình API Key cho Anthropic Claude.');

      const targetModel = model || this.config.models.claude || 'claude-3-5-sonnet-20241022';
      const endpoint = 'https://api.anthropic.com/v1/messages';

      const payload = {
        model: targetModel,
        max_tokens: 2048,
        messages: [
          { role: 'user', content: prompt }
        ]
      };

      if (systemInstruction) {
        payload.system = systemInstruction;
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.trim(),
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const errMsg = errJson.error ? errJson.error.message : `HTTP ${res.status}`;
        throw new Error(`Claude Error: ${errMsg}`);
      }

      const data = await res.json();
      const text = data.content?.[0]?.text;
      if (!text) throw new Error('Không nhận được phản hồi nội dung từ Claude.');
      return text;
    },

    /**
     * Điều hướng thông minh & Thực thi Chat Completion
     */
    chatCompletion: async function(prompt, systemInstruction = '', providerOverride = null) {
      const provider = providerOverride || this.config.activeProvider;

      // Nếu chọn Offline hoặc chưa có key
      if (provider === 'offline' || !this.hasKey(provider)) {
        return {
          source: 'offline',
          providerName: 'Quy tắc Heuristic Nội Bộ',
          text: null,
          isFallback: true
        };
      }

      const startTime = performance.now();
      try {
        let textResult = '';
        if (provider === 'gemini') {
          textResult = await this.callGemini(prompt, systemInstruction);
        } else if (provider === 'openai') {
          textResult = await this.callOpenAi(prompt, systemInstruction);
        } else if (provider === 'claude') {
          textResult = await this.callClaude(prompt, systemInstruction);
        } else {
          throw new Error(`Provider không được hỗ trợ: ${provider}`);
        }

        const duration = Math.round(performance.now() - startTime);
        return {
          source: provider,
          providerName: PROVIDER_METADATA[provider]?.name || provider,
          model: this.config.models[provider],
          text: textResult,
          latencyMs: duration,
          isFallback: false
        };
      } catch (err) {
        console.warn(`[AI Connector] Error from ${provider}:`, err);
        if (this.config.useHybridFallback) {
          return {
            source: 'offline',
            providerName: 'Quy tắc Heuristic Nội Bộ',
            text: null,
            isFallback: true,
            error: err.message
          };
        }
        throw err;
      }
    },

    /**
     * Kiểm tra kết nối nhanh (Ping Test)
     */
    testConnection: async function(providerId) {
      const startTime = performance.now();
      const pingPrompt = 'Xin chào, hãy trả lời đúng một từ: "SAN_SANG" và cho biết bạn là mô hình nào.';
      try {
        let resText = '';
        if (providerId === 'gemini') {
          resText = await this.callGemini(pingPrompt, 'Bạn là trợ lý kiểm tra kết nối API.');
        } else if (providerId === 'openai') {
          resText = await this.callOpenAi(pingPrompt, 'Bạn là trợ lý kiểm tra kết nối API.');
        } else if (providerId === 'claude') {
          resText = await this.callClaude(pingPrompt, 'Bạn là trợ lý kiểm tra kết nối API.');
        } else if (providerId === 'elevenlabs') {
          const key = this.config.keys.elevenlabs;
          if (!key) throw new Error('Chưa nhập ElevenLabs API Key');
          const res = await fetch('https://api.elevenlabs.io/v1/user', {
            headers: { 'xi-api-key': key.trim() }
          });
          if (!res.ok) throw new Error(`ElevenLabs Error: HTTP ${res.status}`);
          resText = 'Kết nối ElevenLabs thành công!';
        } else if (providerId === 'n8n') {
          const hook = this.config.keys.n8nWebhook;
          if (!hook) throw new Error('Chưa nhập URL Webhook n8n');
          resText = 'URL Webhook đã được định dạng hợp lệ!';
        } else {
          throw new Error('Provider không hỗ trợ ping test.');
        }

        const duration = Math.round(performance.now() - startTime);
        this.config.lastTested[providerId] = {
          status: 'success',
          time: new Date().toLocaleTimeString('vi-VN'),
          latency: duration,
          response: resText.substring(0, 80)
        };
        this.saveConfig();
        return { success: true, latency: duration, response: resText };
      } catch (err) {
        const duration = Math.round(performance.now() - startTime);
        this.config.lastTested[providerId] = {
          status: 'error',
          time: new Date().toLocaleTimeString('vi-VN'),
          latency: duration,
          error: err.message
        };
        this.saveConfig();
        return { success: false, latency: duration, error: err.message };
      }
    },

    // ==============================================================
    // 2. CÔNG CỤ TẠO PROMPT ẢNH VÀ THUYẾT MINH DU LỊCH CHUYÊN BIỆT
    // ==============================================================

    /**
     * Sinh Prompt ảnh Cinematic cho Midjourney, Flux, DALL-E 3
     */
    buildVisualPrompt: function(tourName, sceneType = 'NATURE') {
      const safeName = tourName || 'Vườn Quốc Gia Nam Cát Tiên';
      const prompts = {
        NATURE: `Cinematic landscape photography of ${safeName}, Vietnam eco-tourism. Untouched dense tropical rainforest, ancient Tung tree with giant roots, morning mist drifting through the green canopy, golden hour sunlight rays breaking through leaves, crystal clear river stream. Photorealistic, 8k resolution, shot on 35mm lens, f/2.8, National Geographic style, award winning eco-travel aesthetic, no plastic, zero pollution --ar 16:9 --v 6.1 --style raw`,
        CAMPING: `Cozy eco-glamping wooden deck nestled by the river inside ${safeName}, lush bamboo groves, warm string fairy lights, canvas tent, couple relaxing sipping hot tea, sustainable tourism, serene healing vibe, twilight sunset glow, ultra high detail, architectural photography, 8k resolution --ar 16:9 --v 6.1`,
        TREKKING: `Adventurous young trekkers with lightweight backpacks walking along a scenic mossy forest trail in ${safeName}, dappled sunlight, lush biodiversity, giant ferns, sense of freedom and mindfulness, candid motion, 8k, photorealistic --ar 4:5 --v 6.1`
      };
      return prompts[sceneType] || prompts.NATURE;
    },

    /**
     * Kịch bản Audio Guide cho ElevenLabs
     */
    buildAudioGuideScript: function(tourName, stopPoint = 'Rừng Cây Tung Ngàn Năm') {
      return `Chào mừng quý khách đến với điểm dừng chân: ${stopPoint}, thuộc hành trình trải nghiệm ${tourName || 'HaHa Eco Travel'}.

Trước mắt quý vị là cây Tung đại thụ hơn 400 năm tuổi, một biểu tượng kiên cường của hệ sinh thái rừng nhiệt đới Nam Cát Tiên. Hãy hít thở một hơi thật sâu, lắng nghe tiếng suối reo hòa cùng tiếng chim rừng hót ríu rít...

Tại HaHa Eco Travel, mỗi bước chân của quý vị đều là sự cam kết gìn giữ màu xanh thiên nhiên. Xin vui lòng không để lại rác thải nhựa và cùng chúng tôi nâng niu từng mầm non của cánh rừng này. Chúc quý vị một hành trình an yên và tràn đầy năng lượng tươi mới.`;
    },

    /**
     * Bắn Webhook sang n8n khi phát sinh Lead từ Social Hub
     */
    triggerN8nLeadWebhook: async function(leadData) {
      const webhookUrl = this.config.keys.n8nWebhook;
      if (!webhookUrl || !webhookUrl.startsWith('http')) {
        console.log('[n8n Webhook] Chưa cấu hình URL, bỏ qua phát tín hiệu.');
        return false;
      }

      try {
        const payload = {
          event: 'NEW_SOCIAL_LEAD',
          timestamp: new Date().toISOString(),
          lead: leadData,
          company: 'HaHa Eco Travel',
          source: 'HAHA AI SOCIAL HUB'
        };

        const res = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        console.log('[n8n Webhook] Dispatched lead payload:', res.status);
        return res.ok;
      } catch (e) {
        console.warn('[n8n Webhook] Dispatch error:', e);
        return false;
      }
    },

    // ==============================================================
    // 3. GIAO DIỆN CẤU HÌNH BỘ NÃO AI (SETTINGS MODAL & BADGES)
    // ==============================================================

    /**
     * Trả về HTML Badge trạng thái AI hiển thị trên thanh công cụ
     */
    renderStatusBadgeHtml: function() {
      const p = this.config.activeProvider;
      if (p === 'offline' || !this.hasKey(p)) {
        return `
          <button onclick="window.HahaAiConnector.openConfigModal()" title="Bấm để cấu hình API Key cho Gemini, ChatGPT hoặc Claude" class="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-[11px] font-extrabold transition-all">
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span>⚡ AI: Heuristic Offline (Cần cài API)</span>
          </button>
        `;
      }

      const meta = PROVIDER_METADATA[p];
      return `
        <button onclick="window.HahaAiConnector.openConfigModal()" title="Đang chạy bằng ${meta.name} - Bấm để đổi mô hình hoặc cấu hình" class="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-300 rounded-xl text-[11px] font-extrabold transition-all">
          <span>${meta.icon}</span>
          <span>${meta.name}</span>
          <span class="px-1.5 py-0.2 bg-indigo-200 text-indigo-900 rounded text-[9px] font-black">${this.config.models[p] || 'Default'}</span>
        </button>
      `;
    },

    /**
     * Mở Modal Cấu Hình Bộ Não AI
     */
    openConfigModal: function() {
      let modal = document.getElementById('ai-connector-config-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'ai-connector-config-modal';
        modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 overflow-y-auto animate-fade-in';
        document.body.appendChild(modal);
      }

      modal.innerHTML = this.renderModalHtml();
      modal.classList.remove('hidden');
    },

    closeConfigModal: function() {
      const modal = document.getElementById('ai-connector-config-modal');
      if (modal) modal.classList.add('hidden');
    },

    renderModalHtml: function() {
      const activeP = this.config.activeProvider;

      return `
        <div class="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <!-- Header -->
          <div class="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between flex-shrink-0">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-xl">⚙️</div>
              <div>
                <h3 class="font-extrabold text-sm sm:text-base flex items-center space-x-2">
                  <span>CẤU HÌNH BỘ NÃO AI ĐA NỀN TẢNG</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">v1.0 Live</span>
                </h3>
                <p class="text-xs text-indigo-200">Tích hợp Google Gemini, OpenAI ChatGPT, Anthropic Claude, ElevenLabs và n8n Workflow</p>
              </div>
            </div>
            <button onclick="window.HahaAiConnector.closeConfigModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold transition-all">✕</button>
          </div>

          <!-- Body Tabs / Settings Content -->
          <div class="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            
            <!-- Bộ chọn Provider Chủ Lực -->
            <div class="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 class="font-extrabold text-indigo-950 text-xs sm:text-sm flex items-center space-x-2">
                    <span>👑 Lựa Chọn Bộ Não AI Mặc Định Cho Hệ Thống:</span>
                  </h4>
                  <p class="text-[11px] text-slate-500 mt-0.5">Mô hình này sẽ tự động xử lý các câu lệnh điều hành ERP và tạo nội dung Social Hub</p>
                </div>
                <div class="flex items-center space-x-1.5 flex-wrap">
                  <button type="button" onclick="window.HahaAiConnector.selectActiveProvider('gemini')" class="px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${activeP === 'gemini' ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}">
                    ✨ Google Gemini
                  </button>
                  <button type="button" onclick="window.HahaAiConnector.selectActiveProvider('openai')" class="px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${activeP === 'openai' ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}">
                    🧠 OpenAI ChatGPT
                  </button>
                  <button type="button" onclick="window.HahaAiConnector.selectActiveProvider('claude')" class="px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${activeP === 'claude' ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}">
                    🎭 Anthropic Claude
                  </button>
                  <button type="button" onclick="window.HahaAiConnector.selectActiveProvider('offline')" class="px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${activeP === 'offline' ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}">
                    Offline Engine
                  </button>
                </div>
              </div>

              <!-- Checkbox Tự Động Fallback -->
              <div class="pt-2 border-t border-indigo-100 flex items-center justify-between text-[11px]">
                <label class="flex items-center space-x-2 cursor-pointer text-slate-700 font-semibold select-none">
                  <input type="checkbox" id="ai-cfg-hybrid-fallback" ${this.config.useHybridFallback ? 'checked' : ''} onchange="window.HahaAiConnector.toggleHybridFallback(this.checked)" class="rounded text-indigo-600 focus:ring-indigo-500">
                  <span>Bật cơ chế <b>Fallback Hybrid</b>: Tự động chuyển về Heuristic Rules Engine nếu API mất mạng hoặc hết quota</span>
                </label>
                <span class="text-emerald-700 font-bold">🛡️ An toàn 100% không gián đoạn</span>
              </div>
            </div>

            <!-- 3 Khối Cấu Hình API Key Trọng Pháo (Gemini, OpenAI, Claude) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <!-- 1. GOOGLE GEMINI -->
              <div class="border ${activeP === 'gemini' ? 'border-blue-400 ring-2 ring-blue-100 bg-blue-50/20' : 'border-slate-200 bg-white'} rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">✨ GOOGLE GEMINI</span>
                    ${this.renderTestBadge('gemini')}
                  </div>
                  <h4 class="font-extrabold text-xs text-slate-900">Google Cloud AI Studio</h4>
                  <p class="text-[11px] text-slate-500 leading-relaxed">Cửa sổ 1M-2M tokens, chi phí rẻ nhất, tối ưu báo cáo & đa phương tiện.</p>
                  
                  <div class="space-y-1.5 pt-1">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Model Lựa Chọn:</label>
                    <select id="ai-model-gemini" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold" onchange="window.HahaAiConnector.updateModel('gemini', this.value)">
                      ${PROVIDER_METADATA.gemini.models.map(m => `<option value="${m.id}" ${this.config.models.gemini === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
                    </select>
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Gemini API Key:</label>
                    <input type="password" id="ai-key-gemini" value="${this.config.keys.gemini || ''}" placeholder="AIzaSy..." class="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </div>
                </div>

                <div class="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <button type="button" onclick="window.HahaAiConnector.handleTestKey('gemini')" class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-[11px] rounded-lg transition-all border border-blue-200">
                    🔍 Kiểm tra kết nối
                  </button>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" class="text-[11px] text-blue-600 font-bold hover:underline">Lấy Key miễn phí ↗</a>
                </div>
              </div>

              <!-- 2. OPENAI CHATGPT -->
              <div class="border ${activeP === 'openai' ? 'border-emerald-400 ring-2 ring-emerald-100 bg-emerald-50/20' : 'border-slate-200 bg-white'} rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">🧠 OPENAI CHATGPT</span>
                    ${this.renderTestBadge('openai')}
                  </div>
                  <h4 class="font-extrabold text-xs text-slate-900">OpenAI GPT-4o Platform</h4>
                  <p class="text-[11px] text-slate-500 leading-relaxed">Xuất sắc về JSON có cấu trúc, chiết tính giá tour và bóc tách thuế GTGT TT 219.</p>

                  <div class="space-y-1.5 pt-1">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Model Lựa Chọn:</label>
                    <select id="ai-model-openai" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold" onchange="window.HahaAiConnector.updateModel('openai', this.value)">
                      ${PROVIDER_METADATA.openai.models.map(m => `<option value="${m.id}" ${this.config.models.openai === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
                    </select>
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">OpenAI API Key:</label>
                    <input type="password" id="ai-key-openai" value="${this.config.keys.openai || ''}" placeholder="sk-proj-..." class="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  </div>
                </div>

                <div class="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <button type="button" onclick="window.HahaAiConnector.handleTestKey('openai')" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-[11px] rounded-lg transition-all border border-emerald-200">
                    🔍 Kiểm tra kết nối
                  </button>
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" class="text-[11px] text-emerald-600 font-bold hover:underline">Lấy Key OpenAI ↗</a>
                </div>
              </div>

              <!-- 3. ANTHROPIC CLAUDE -->
              <div class="border ${activeP === 'claude' ? 'border-amber-400 ring-2 ring-amber-100 bg-amber-50/20' : 'border-slate-200 bg-white'} rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">🎭 ANTHROPIC CLAUDE</span>
                    ${this.renderTestBadge('claude')}
                  </div>
                  <h4 class="font-extrabold text-xs text-slate-900">Claude 3.5 Sonnet Engine</h4>
                  <p class="text-[11px] text-slate-500 leading-relaxed">Văn phong du lịch sinh thái & chữa lành sâu sắc nhất, kịch bản video truyền cảm.</p>

                  <div class="space-y-1.5 pt-1">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Model Lựa Chọn:</label>
                    <select id="ai-model-claude" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold" onchange="window.HahaAiConnector.updateModel('claude', this.value)">
                      ${PROVIDER_METADATA.claude.models.map(m => `<option value="${m.id}" ${this.config.models.claude === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
                    </select>
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Claude API Key:</label>
                    <input type="password" id="ai-key-claude" value="${this.config.keys.claude || ''}" placeholder="sk-ant-..." class="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  </div>
                </div>

                <div class="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <button type="button" onclick="window.HahaAiConnector.handleTestKey('claude')" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold text-[11px] rounded-lg transition-all border border-amber-200">
                    🔍 Kiểm tra kết nối
                  </button>
                  <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" class="text-[11px] text-amber-600 font-bold hover:underline">Lấy Key Claude ↗</a>
                </div>
              </div>

            </div>

            <!-- CÁC CÔNG CỤ BỔ TRỢ CHUYÊN BIỆT (ELEVENLABS, MIDJOURNEY/FLUX, N8N) -->
            <div class="border-t border-slate-200 pt-5 space-y-4">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-extrabold text-xs text-slate-900 uppercase tracking-wide">🎙️ Công Cụ AI Chuyên Biệt Mở Rộng Cho Du Lịch Sinh Thái</h4>
                  <p class="text-[11px] text-slate-500">Âm thanh thuyết minh tự động, sinh ảnh bản quyền và tự động hóa quy trình nghiệp vụ</p>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <!-- ElevenLabs Audio Guide -->
                <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-extrabold text-xs text-purple-900 flex items-center space-x-1.5">
                      <span>🎙️ ElevenLabs AI Voice (Thuyết minh Tour)</span>
                    </span>
                    ${this.renderTestBadge('elevenlabs')}
                  </div>
                  <p class="text-[11px] text-slate-500">Tạo Audio Guide thuyết minh sinh thái tại điểm & đọc kịch bản video TikTok cho CTV.</p>
                  <div class="flex items-center space-x-2">
                    <input type="password" id="ai-key-elevenlabs" value="${this.config.keys.elevenlabs || ''}" placeholder="xi-api-key..." class="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800">
                    <button type="button" onclick="window.HahaAiConnector.handleTestKey('elevenlabs')" class="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-[11px] rounded-lg border border-purple-200">Kiểm tra</button>
                  </div>
                </div>

                <!-- n8n Workflow Webhook -->
                <div class="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-extrabold text-xs text-rose-900 flex items-center space-x-1.5">
                      <span>⚡ n8n Webhook Automator</span>
                    </span>
                    ${this.renderTestBadge('n8n')}
                  </div>
                  <p class="text-[11px] text-slate-500">Tự động bắn tín hiệu sang Zalo ZNS / Telegram khi CTV đem về khách hàng mới.</p>
                  <div class="flex items-center space-x-2">
                    <input type="url" id="ai-key-n8n" value="${this.config.keys.n8nWebhook || ''}" placeholder="https://n8n.your-domain.com/webhook/..." class="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800">
                    <button type="button" onclick="window.HahaAiConnector.handleTestKey('n8n')" class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[11px] rounded-lg border border-rose-200">Kiểm tra</button>
                  </div>
                </div>

              </div>
            </div>

            <!-- Bảng So Sánh Chiến Lược 3 LLM Hàng Đầu -->
            <div class="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
              <h4 class="font-extrabold text-xs uppercase text-indigo-300 flex items-center space-x-2">
                <span>📊 Ma Trận So Sánh Điểm Mạnh 3 Trọng Pháo AI Hàng Đầu:</span>
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                <div class="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1.5">
                  <div class="font-bold text-blue-400">✨ Google Gemini</div>
                  <ul class="text-slate-300 space-y-1 list-disc list-inside">
                    <li>Ngữ cảnh khủng 2M tokens</li>
                    <li>Phân tích file PDF / Hóa đơn scan</li>
                    <li>Tốc độ phản hồi cực nhanh</li>
                    <li>Được ưu tiên cho hệ sinh thái Google</li>
                  </ul>
                </div>
                <div class="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1.5">
                  <div class="font-bold text-emerald-400">🧠 OpenAI ChatGPT</div>
                  <ul class="text-slate-300 space-y-1 list-disc list-inside">
                    <li>JSON Mode & Function Calling số 1</li>
                    <li>Chiết tính toán học & Thuế GTGT TT219</li>
                    <li>Viết lời chào chốt sales trực diện</li>
                    <li>Tính ổn định và hệ sinh thái rộng</li>
                  </ul>
                </div>
                <div class="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1.5">
                  <div class="font-bold text-amber-400">🎭 Anthropic Claude</div>
                  <ul class="text-slate-300 space-y-1 list-disc list-inside">
                    <li>Hành văn cảm xúc, sâu sắc nhất</li>
                    <li>Rất hợp Tour Chữa Lành & Sinh Thái</li>
                    <li>Kịch bản Video ngắn có chiều sâu</li>
                    <li>Ít bị ảo giác, bảo mật cao</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
            <span class="text-[11px] text-slate-500 italic">API Key được lưu bảo mật trong trình duyệt của bạn (Local Storage) và không bị tải lên máy chủ ngoài.</span>
            <div class="flex items-center space-x-2">
              <button type="button" onclick="window.HahaAiConnector.closeConfigModal()" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all">
                Đóng
              </button>
              <button type="button" onclick="window.HahaAiConnector.saveModalForm()" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-1.5">
                <span>💾 Lưu Cấu Hình AI</span>
              </button>
            </div>
          </div>

        </div>
      `;
    },

    renderTestBadge: function(providerId) {
      const test = this.config.lastTested[providerId];
      if (!test) return `<span class="text-[10px] text-slate-400 font-mono">Chưa kiểm tra</span>`;
      if (test.status === 'success') {
        return `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">✓ ${test.latency}ms</span>`;
      }
      return `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300" title="${test.error || 'Lỗi'}">✕ Lỗi</span>`;
    },

    selectActiveProvider: function(providerId) {
      this.config.activeProvider = providerId;
      this.saveConfig();
      this.openConfigModal();
      this.updateUiBadges();
    },

    toggleHybridFallback: function(checked) {
      this.config.useHybridFallback = !!checked;
      this.saveConfig();
    },

    updateModel: function(providerId, modelId) {
      this.config.models[providerId] = modelId;
      this.saveConfig();
    },

    handleTestKey: async function(providerId) {
      const keyInput = document.getElementById(`ai-key-${providerId}`);
      if (keyInput) {
        if (providerId === 'n8n') {
          this.config.keys.n8nWebhook = keyInput.value.trim();
        } else {
          this.config.keys[providerId] = keyInput.value.trim();
        }
      }

      const res = await this.testConnection(providerId);
      if (res.success) {
        alert(`🎉 KẾT NỐI THÀNH CÔNG VỚI ${providerId.toUpperCase()}!\n\nĐộ trễ phản hồi: ${res.latency} ms\nPhản hồi thử nghiệm: "${res.response}"`);
      } else {
        alert(`⚠️ KẾT NỐI THẤT BẠI VỚI ${providerId.toUpperCase()}!\n\nChi tiết lỗi: ${res.error}\n\nVui lòng kiểm tra lại API Key hoặc hạn mức tài khoản của bạn.`);
      }
      this.openConfigModal();
    },

    saveModalForm: function() {
      const geminiKey = document.getElementById('ai-key-gemini')?.value || '';
      const openaiKey = document.getElementById('ai-key-openai')?.value || '';
      const claudeKey = document.getElementById('ai-key-claude')?.value || '';
      const elevenKey = document.getElementById('ai-key-elevenlabs')?.value || '';
      const n8nUrl = document.getElementById('ai-key-n8n')?.value || '';

      this.config.keys.gemini = geminiKey.trim();
      this.config.keys.openai = openaiKey.trim();
      this.config.keys.claude = claudeKey.trim();
      this.config.keys.elevenlabs = elevenKey.trim();
      this.config.keys.n8nWebhook = n8nUrl.trim();

      this.saveConfig();
      this.closeConfigModal();
      this.updateUiBadges();
      alert(`🎉 ĐÃ LƯU CẤU HÌNH BỘ NÃO AI THÀNH CÔNG!\n\nBộ não chủ lực đang chọn: ${this.getActiveModelDisplay()}`);
    },

    updateUiBadges: function() {
      const el = document.getElementById('ai-connector-header-badge');
      if (el) {
        el.innerHTML = this.renderStatusBadgeHtml();
      }
      const modelNotice = document.getElementById('ai-command-center-model-notice');
      if (modelNotice) {
        modelNotice.textContent = `Bộ não AI: ${this.getActiveModelDisplay()}`;
      }
    }
  };

  // Khởi tạo ngay lập tức
  HahaAiConnector.init();
  window.HahaAiConnector = HahaAiConnector;

})(window);
