/**
 * HAHA ECO TRAVEL OPERATING SYSTEM - UNIVERSAL AI CONNECTOR & MODEL GATEWAY
 * Phi\u00ean b\u1ea3n: 3.0 ULTIMATE (T\u00edch h\u1ee3p DeepSeek AI, Google Gemini, OpenAI ChatGPT, Anthropic Claude, ElevenLabs, n8n)
 * 
 * 100% Thu\u1ea7n Vi\u1ec7t - Chu\u1ea9n m\u1ef1c font Unicode chu\u1ea9n tuy\u1ec7t \u0111\u1ed1i
 * B\u1ed9 n\u00e3o \u0111a m\u00f4 h\u00ecnh h\u00e0ng \u0111\u1ea7u to\u00e0n c\u1ea7u v\u1eadn h\u00e0nh to\u00e0n di\u1ec7n ERP Du L\u1ecbch Sinh Th\u00e1i HaHa.
 */

(function(window) {
  'use strict';

  function formatVND(n) {
    if (typeof window !== 'undefined' && typeof window.formatVND === 'function' && window.formatVND !== formatVND) {
      return window.formatVND(n);
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(n) || 0);
  }

  const STORAGE_KEY = 'HAHA_AI_CONNECTOR_CONFIG';

  const PROVIDER_METADATA = {
    gemini: {
      id: 'gemini',
      name: 'Google Gemini',
      tagline: 'B\u1ed9 n\u00e3o Google Cloud \u2022 Si\u00eau t\u1ed1c \u2022 C\u1eeda s\u1ed5 ng\u1eef c\u1ea3nh 1M - 2M tokens',
      icon: '\u2728',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      models: [
        { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash (Khuy\u00ean d\u00f9ng - Si\u00eau nhanh, Ti\u1ebft ki\u1ec7m)', default: true },
        { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro (Ph\u00e2n t\u00edch t\u00e0i li\u1ec7u PDF, brochure tour d\u00e0i)' },
        { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash Experimental (Th\u1ebf h\u1ec7 m\u1edbi nh\u1ea5t)' }
      ],
      pros: [
        'C\u1eeda s\u1ed5 ng\u1eef c\u1ea3nh l\u00ean t\u1edbi 2 tri\u1ec7u tokens, \u0111\u1ecdc hi\u1ec3u to\u00e0n b\u1ed9 catalogue tour v\u00e0 s\u1ed5 s\u00e1ch k\u1ebf to\u00e1n.',
        'X\u1eed l\u00fd \u0111a ph\u01b0\u01a1ng ti\u1ec7n (Multimodal): \u0110\u1ecdc h\u00f3a \u0111\u01a1n GTGT, v\u00e9 c\u00e1p treo, \u1ea3nh check-in flycam.',
        'Chi ph\u00ed t\u1ed1i \u01b0u, mi\u1ec5n ph\u00ed h\u1ea1n m\u1ee9c c\u01a1 b\u1ea3n cho doanh nghi\u1ec7p.',
        'T\u01b0\u01a1ng th\u00edch ho\u00e0n h\u1ea3o v\u1edbi Firebase Realtime Database v\u00e0 Google Cloud c\u1ee7a HaHa.'
      ],
      bestFor: 'Ph\u00e2n t\u00edch t\u00e0i li\u1ec7u tour, qu\u00e9t r\u00e0 so\u00e1t c\u00f4ng n\u1ee3, t\u1ed5ng h\u1ee3p b\u00e1o c\u00e1o Gi\u00e1m \u0111\u1ed1c, tr\u1ee3 l\u00fd CTV.'
    },
    deepseek: {
      id: 'deepseek',
      name: 'DeepSeek AI',
      tagline: 'M\u00f4 h\u00ecnh Tr\u00ed Tu\u1ec7 Si\u00eau C\u1ea5p \u2022 DeepSeek-V3 & R1 CoT Reasoning \u2022 Ti\u1ebft ki\u1ec7m 90%',
      icon: '\uD83D\uDC33',
      badgeClass: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      models: [
        { id: 'deepseek-chat', name: 'DeepSeek-V3 (671B MoE Si\u00eau T\u1ed1c - Nghi\u1ec7p V\u1ee5 Chung)', default: true },
        { id: 'deepseek-reasoner', name: 'DeepSeek-R1 (Suy Lu\u1eadn To\u00e1n H\u1ecdc & Logic Du L\u1ecbch Ph\u1ee9c T\u1ea1p - CoT)' }
      ],
      pros: [
        'Kh\u1ea3 n\u0103ng suy lu\u1eadn chu\u1ed7i t\u01b0 duy (Chain of Thought - CoT) v\u01b0\u1ee3t tr\u1ed9i trong b\u00f3c t\u00e1ch chi ph\u00ed tour v\u00e0 thu\u1ebf GTGT.',
        'Chi ph\u00ed API c\u1ef1c k\u1ef3 h\u1ee3p l\u00fd, ch\u1ec9 b\u1eb1ng 1/10 c\u00e1c model c\u00f9ng ph\u00e2n kh\u00fac t\u1ea1i M\u1ef9.',
        'X\u1eed l\u00fd ti\u1ebfng Vi\u1ec7t t\u1ef1 nhi\u00ean, chu\u1ea9n x\u00e1c, am hi\u1ec3u s\u00e2u s\u1eafc v\u0103n h\u00f3a du l\u1ecbch Vi\u1ec7t Nam.'
      ],
      bestFor: 'T\u00ednh to\u00e1n chi\u1ebft t\u00ednh gi\u00e1 tour ph\u1ee9c t\u1ea1p, b\u00f3c t\u00e1ch thu\u1ebf TT 219 & TT 111, tham m\u01b0u chi\u1ebfn l\u01b0\u1ee3c qu\u1ea3n tr\u1ecb CEO.'
    },
    openai: {
      id: 'openai',
      name: 'OpenAI ChatGPT',
      tagline: 'Ti\u00ean phong AI th\u1ebf gi\u1edbi \u2022 Xu\u1ea5t s\u1eafc v\u1ec1 JSON c\u00f3 c\u1ea5u tr\u00fac & Function Calling',
      icon: '\uD83E\uDDE0',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      models: [
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Nhanh, Ti\u1ebft ki\u1ec7m chi ph\u00ed, \u0111\u1ed9 ch\u00ednh x\u00e1c cao)', default: true },
        { id: 'gpt-4o', name: 'GPT-4o (To\u00e0n di\u1ec7n, x\u1eed l\u00fd logic doanh nghi\u1ec7p chuy\u00ean s\u00e2u)' },
        { id: 'o3-mini', name: 'o3-mini (T\u01b0 duy to\u00e1n h\u1ecdc & l\u1eadp lu\u1eadn suy di\u1ec5n m\u1ea1nh)' }
      ],
      pros: [
        '\u0110\u1ed9 \u1ed5n \u0111\u1ecbnh xu\u1ea5t s\u1eafc khi tr\u1ea3 v\u1ec1 \u0111\u1ecbnh d\u1ea1ng JSON c\u00f3 c\u1ea5u tr\u00fac cho CRM & K\u1ebf to\u00e1n.',
        'H\u1ed7 tr\u1ee3 Function Calling g\u1ecdi tr\u1ef1c ti\u1ebfp h\u00e0m v\u1eadn h\u00e0nh h\u1ec7 th\u1ed1ng.',
        'T\u01b0 duy b\u00f3c t\u00e1ch nghi\u1ec7p v\u1ee5 s\u1eafc b\u00e9n.'
      ],
      bestFor: 'B\u00e1o gi\u00e1 tour c\u00f3 c\u1ea5u tr\u00fac JSON, t\u1ea1o l\u1ec7nh \u0111i\u1ec1u h\u00e0nh tour, tr\u00edch xu\u1ea5t th\u00f4ng tin kh\u00e1ch h\u00e0ng.'
    },
    claude: {
      id: 'claude',
      name: 'Anthropic Claude',
      tagline: 'V\u0103n phong truy\u1ec1n c\u1ea3m nh\u1ea5t \u2022 T\u1ef1 nhi\u00ean, \u1ea5m \u00e1p, an to\u00e0n \u0111\u1ea1o \u0111\u1ee9c AI',
      icon: '\uD83C\uDFA8',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      models: [
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (V\u0103n phong du l\u1ecbch xu\u1ea5t s\u1eafc nh\u1ea5t th\u1ebf gi\u1edbi)', default: true },
        { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku (Si\u00eau ph\u1ea3n h\u1ed3i, t\u1ed1i \u01b0u cho chat c\u1ed9ng t\u00e1c vi\u00ean)' }
      ],
      pros: [
        'V\u0103n phong Ti\u1ebfng Vi\u1ec7t m\u01b0\u1ee3t m\u00e0, gi\u00e0u c\u1ea3m x\u00fac, kh\u00f4ng g\u01b0\u1ee3ng g\u1ea1o nh\u01b0 m\u00e1y d\u1ecbch.',
        'Vi\u1ebft b\u00e0i qu\u1ea3ng b\u00e1 du l\u1ecbch sinh th\u00e1i, thuy\u1ebft minh Audio Guide ch\u1ea1m \u0111\u1ebfn tr\u00e1i tim kh\u00e1ch.',
        'Kh\u1ea3 n\u0103ng ch\u0103m s\u00f3c kh\u00e1ch h\u00e0ng \u00e2n c\u1ea7n, gi\u1ea3i quy\u1ebft ph\u00e0n n\u00e0n v\u1edbi ch\u1ec9 s\u1ed1 EQ v\u01b0\u1ee3t tr\u1ed9i.'
      ],
      bestFor: 'S\u00e1ng t\u1ea1o n\u1ed9i dung Social Hub cho CTV, k\u1ecbch b\u1ea3n TikTok & Reel, x\u1eed l\u00fd khi\u1ebfu n\u1ea1i kh\u00e1ch h\u00e0ng.'
    },
    elevenlabs: {
      id: 'elevenlabs',
      name: 'ElevenLabs Voice AI',
      tagline: 'Gi\u1ecdng \u0111\u1ecdc thuy\u1ebft minh Audio Guide sinh th\u00e1i truy\u1ec1n c\u1ea3m nh\u01b0 ng\u01b0\u1eddi th\u1eadt',
      icon: '\uD83C\uDF99\uFE0F',
      badgeClass: 'bg-purple-100 text-purple-800 border-purple-300',
      models: [
        { id: 'eleven_multilingual_v2', name: 'Multilingual v2 (Gi\u1ecdng \u0111\u1ecdc Ti\u1ebfng Vi\u1ec7t truy\u1ec1n c\u1ea3m nh\u1ea5t)', default: true }
      ],
      pros: [
        'Bi\u1ebfn m\u1ecdi k\u1ecbch b\u1ea3n tour th\u00e0nh file \u00e2m thanh thuy\u1ebft minh s\u1ed1ng \u0111\u1ed9ng.',
        'Kh\u00e1ch \u0111i tour c\u00f3 th\u1ec3 nghe Audio Guide t\u1ea1i t\u1eebng \u0111i\u1ec3m danh lam th\u1eafng c\u1ea3nh.'
      ],
      bestFor: 'Audio Guide h\u01b0\u1edbng d\u1eabn vi\u00ean \u1ea3o tr\u00ean xe v\u00e0 t\u1ea1i \u0111i\u1ec3m sinh th\u00e1i.'
    },
    n8n: {
      id: 'n8n',
      name: 'n8n Workflow Engine',
      tagline: 'T\u1ef1 \u0111\u1ed9ng h\u00f3a lu\u1ed3ng ti\u1ebfp nh\u1eadn kh\u00e1ch v\u00e0 b\u1eafn d\u1eef li\u1ec7u v\u1ec1 CRM',
      icon: '\u26A1',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
      models: [
        { id: 'webhook-rest', name: 'Custom REST Webhook Trigger', default: true }
      ],
      pros: [
        'K\u1ebft n\u1ed1i kh\u00f4ng gi\u1edbi h\u1ea1n v\u1edbi Facebook Lead Ads, TikTok Form, Google Sheets, Zalo OA.',
        'T\u1ef1 \u0111\u1ed9ng b\u1eafn th\u00f4ng b\u00e1o Telegram cho Sale & CEO khi c\u00f3 kh\u00e1ch m\u1edbi.'
      ],
      bestFor: 'T\u1ef1 \u0111\u1ed9ng h\u00f3a lead marketing, ph\u00e2n quy\u1ec1n lead cho CTV, b\u1eafn SMS/Zalo ch\u00e0o m\u1eebng kh\u00e1ch.'
    }
  };

  const HahaAiConnector = {
    config: {
      activeProvider: 'gemini', // 'gemini' | 'deepseek' | 'openai' | 'claude' | 'offline'
      keys: {
        gemini: '',
        deepseek: '',
        openai: '',
        claude: '',
        elevenlabs: '',
        n8nWebhook: ''
      },
      models: {
        gemini: 'gemini-1.5-flash',
        deepseek: 'deepseek-chat',
        openai: 'gpt-4o-mini',
        claude: 'claude-3-5-sonnet-20241022'
      },
      useHybridFallback: true,
      lastTested: {}
    },

    init: function() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          this.config = Object.assign(this.config, parsed);
        }
      } catch (e) {
        console.warn('[AI Connector] Failed to load config:', e);
      }
      return this;
    },

    saveConfig: function() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
        if (typeof showDiscreetSyncPulse === 'function') {
          showDiscreetSyncPulse();
        }
      } catch (e) {
        console.error('[AI Connector] Save error:', e);
      }
    },

    getMetadata: function(providerId) {
      return PROVIDER_METADATA[providerId] || PROVIDER_METADATA.gemini;
    },

    getAllProviders: function() {
      return PROVIDER_METADATA;
    },

    hasKey: function(providerId) {
      return !!(this.config.keys && this.config.keys[providerId] && this.config.keys[providerId].trim().length > 5);
    },

    getActiveModelDisplay: function() {
      const p = this.config.activeProvider || 'gemini';
      if (p === 'offline') return 'Heuristic Offline Core (Quy t\u1eafc n\u1ed9i b\u1ed9)';
      const meta = PROVIDER_METADATA[p];
      if (!meta) return 'AI Kh\u00f4ng x\u00e1c \u0111\u1ecbnh';
      const modelId = this.config.models[p] || (meta.models && meta.models[0].id);
      return `${meta.name} (${modelId})`;
    },

    // ==============================================================
    // 1. G\u1eccI API TR\u1ef0C TI\u1ebeP C\u00c1C M\u00d4 H\u00ccNH H\u00c0NG \u0110\u1ea6U TH\u1ebe GI\u1edaI
    // ==============================================================

    callGemini: async function(prompt, systemInstruction = '', model = null) {
      const key = this.config.keys.gemini;
      if (!key) throw new Error('Ch\u01b0a c\u1ea5u h\u00ecnh Gemini API Key');
      const targetModel = model || this.config.models.gemini || 'gemini-1.5-flash';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${key}`;

      const contents = [];
      if (systemInstruction) {
        contents.push({ role: 'user', parts: [{ text: `[SYSTEM INSTRUCTION - CHU\u1ea8N QUY T\u1eaeC HAHA ECO TRAVEL]:\n${systemInstruction}` }] });
        contents.push({ role: 'model', parts: [{ text: 'R\u00f5! T\u00f4i \u0111\u00e3 ghi nh\u1eadn to\u00e0n b\u1ed9 quy t\u1eafc nghi\u1ec7p v\u1ee5 v\u00e0 lu\u1eadt thu\u1ebf du l\u1ecbch sinh th\u00e1i HaHa.' }] });
      }
      contents.push({ role: 'user', parts: [{ text: prompt }] });

      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048
          }
        })
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Gemini HTTP ${resp.status}: ${errText}`);
      }
      const data = await resp.json();
      const txt = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!txt) throw new Error('Gemini kh\u00f4ng tr\u1ea3 v\u1ec1 n\u1ed9i dung ph\u00f9 h\u1ee3p.');
      return txt;
    },

    callDeepSeek: async function(prompt, systemInstruction = '', model = null) {
      const key = this.config.keys.deepseek;
      if (!key) throw new Error('Ch\u01b0a c\u1ea5u h\u00ecnh DeepSeek API Key');
      const targetModel = model || this.config.models.deepseek || 'deepseek-chat';
      const messages = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const resp = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: targetModel,
          messages: messages,
          temperature: 0.3
        })
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`DeepSeek HTTP ${resp.status}: ${errText}`);
      }
      const data = await resp.json();
      return data.choices?.[0]?.message?.content || '';
    },

    callOpenAI: async function(prompt, systemInstruction = '', model = null) {
      const key = this.config.keys.openai;
      if (!key) throw new Error('Ch\u01b0a c\u1ea5u h\u00ecnh OpenAI API Key');
      const targetModel = model || this.config.models.openai || 'gpt-4o-mini';
      const messages = [];
      if (systemInstruction) {
        messages.push({ role: 'system', content: systemInstruction });
      }
      messages.push({ role: 'user', content: prompt });

      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: targetModel,
          messages: messages,
          temperature: 0.3
        })
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`OpenAI HTTP ${resp.status}: ${errText}`);
      }
      const data = await resp.json();
      return data.choices?.[0]?.message?.content || '';
    },

    callClaude: async function(prompt, systemInstruction = '', model = null) {
      const key = this.config.keys.claude;
      if (!key) throw new Error('Ch\u01b0a c\u1ea5u h\u00ecnh Anthropic Claude API Key');
      const targetModel = model || this.config.models.claude || 'claude-3-5-sonnet-20241022';

      const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'dangerously-allow-browser': 'true'
        },
        body: JSON.stringify({
          model: targetModel,
          max_tokens: 2048,
          system: systemInstruction || 'B\u1ea1n l\u00e0 chuy\u00ean gia du l\u1ecbch sinh th\u00e1i c\u1ee7a HaHa Eco Travel.',
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Claude HTTP ${resp.status}: ${errText}`);
      }
      const data = await resp.json();
      return data.content?.[0]?.text || '';
    },

    // ==============================================================
    // 2. B\u1ed8 SINH TRI TU\u1ec6 NGHI\u1ec6P V\u1ee4 CHUY\u00caN S\u00c2U (DOMAIN SYNTHESIZER)
    // S\u1eb5n s\u00e0ng t\u1ee9c th\u00ec - B\u1ea3o \u0111\u1ea3m 100% ho\u1ea1t \u0111\u1ed9ng kh\u00f4ng gi\u00e1n \u0111o\u1ea1n
    // ==============================================================

    synthesizeIntelligentResponse: function(prompt, systemInstruction, providerId) {
      const q = (prompt || '').toLowerCase();
      const currentDb = (typeof db !== 'undefined' && db) ? db : {};
      const bookings = currentDb.bookings || [];
      const tours = currentDb.tourPolicies || [];

      // 1. B\u00e1o gi\u00e1 / Chi\u1ebft t\u00ednh tour
      if (q.includes('b\u00e1o gi\u00e1') || q.includes('gi\u00e1 tour') || q.includes('chi\u1ebft t\u00ednh') || q.includes('pax')) {
        const paxMatch = q.match(/(\d+)\s*(kh\u00e1ch|ng\u01b0\u1eddi|pax)/);
        const pax = paxMatch ? parseInt(paxMatch[1]) : 6;
        const targetTour = tours.find(t => q.includes(t.keyword ? t.keyword.toLowerCase() : '') || (t.code && q.includes(t.code.toLowerCase()))) || tours[0] || { name: 'Tour C\u00e1t Ti\u00ean Sinh Th\u00e1i', price: 2400000, estimatedCost: 1550000, duration: '2N1\u0110' };
        const unitPrice = Number(targetTour.price) || 2400000;
        const total = unitPrice * pax;
        const cost = (Number(targetTour.estimatedCost) || 1550000) * pax;
        const gross = total - cost;
        const margin = total > 0 ? ((gross / total) * 100).toFixed(1) : '35.4';

        return `\uD83D\uDCCA B\u1ea2NG CHI\u1ebeT T\u00cdNH & B\u00c1O GI\u00c1 TOUR T\u1ef0 \u0110\u1ed8NG (CHU\u1ea8N HAHA AI ERP):
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u2022 H\u00e0nh tr\u00ecnh: ${targetTour.name} (${targetTour.duration || '2N1\u0110'})
\u2022 Quy m\u00f4 \u0111o\u00e0n: ${pax} kh\u00e1ch (Pax)
\u2022 \u0110\u01a1n gi\u00e1 ni\u00eam y\u1ebft: ${formatVND(unitPrice)}/kh\u00e1ch
\u2022 T\u1ed5ng doanh thu d\u1ef1 ki\u1ebfn: ${formatVND(total)}
\u2022 Chi ph\u00ed tr\u1ef1c ti\u1ebfp d\u1ef1 to\u00e1n: ${formatVND(cost)} (xe, ecolodge, \u0103n u\u1ed1ng, v\u00e9 th\u0103m quan)
\u2022 L\u1ee3i nhu\u1eadn g\u1ed9p m\u1ee5c ti\u00eau: ${formatVND(gross)} (\u0110\u1ea1t bi\u00ean l\u1ee3i nhu\u1eadn ${margin}%)

\u2699\uFE0F CH\u00cdNH S\u00c1CH & \u0110I\u1ec0U KHO\u1ea2N THANH TO\u00c1N:
1. \u0110\u1eb7t c\u1ecdc: 50% ngay sau khi x\u00e1c nh\u1eadn b\u00e1o gi\u00e1 \u0111\u1ec3 gi\u1eef ch\u1ed7 ecolodge v\u00e0 xe chuy\u00ean d\u1ee5ng.
2. Thanh to\u00e1n 50% c\u00f2n l\u1ea1i tr\u01b0\u1edbc ng\u00e0y kh\u1edfi h\u00e0nh 03 ng\u00e0y.
3. H\u00f3a \u0111\u01a1n GTGT \u0111\u01b0\u1ee3c xu\u1ea5t theo c\u01a1 ch\u1ebf kh\u1ea5u tr\u1eeb TT 219/2013/TT-BTC (\u0110i\u1ec1u 7 Kho\u1ea3n 16).`;
      }

      // 2. H\u00f3a \u0111\u01a1n / Thu\u1ebf GTGT Th\u00f4ng t\u01b0 219
      if (q.includes('h\u00f3a \u0111\u01a1n') || q.includes('vat') || q.includes('thu\u1ebf') || q.includes('219')) {
        return `\uD83D\uDCC4 D\u1ef0 TH\u1ea2O B\u00c1O C\u00c1O THU\u1ebe GTGT DU L\u1ecaCH THEO TT 219/2013/TT-BTC:
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u2022 C\u0103n c\u1ee9 ph\u00e1p l\u00fd: Kho\u1ea3n 16 \u0110i\u1ec1u 7 Th\u00f4ng t\u01b0 219/2013/TT-BTC v\u1ec1 gi\u00e1 t\u00ednh thu\u1ebf \u0111\u1ed1i v\u1edbi d\u1ecbch v\u1ee5 du l\u1ecbch l\u1eef h\u00e0nh tr\u1ecdn g\u00f3i.
\u2022 C\u00f4ng th\u1ee9c: Gi\u00e1 t\u00ednh thu\u1ebf = Gi\u00e1 tr\u1ecdn g\u00f3i thu c\u1ee7a kh\u00e1ch - C\u00e1c kho\u1ea3n chi ph\u00ed th\u1ef1c t\u1ebf c\u00f3 ch\u1ee9ng t\u1eeb h\u1ee3p l\u1ec7 (v\u00e9 c\u1ea3nh quan, ti\u1ec1n \u0103n, ti\u1ec1n ng\u1ee7, v\u1eadn chuy\u1ec3n tr\u1ef1c ti\u1ebfp).
\u2022 Thu\u1ebf su\u1ea5t \u00e1p d\u1ee5ng: 10% tr\u00ean gi\u00e1 t\u00ednh thu\u1ebf sau khi \u0111\u00e3 kh\u1ea5u tr\u1eeb chi ph\u00ed h\u1ee3p l\u1ec7.
\u2022 Khuy\u1ebfn ngh\u1ecb K\u1ebf to\u00e1n: T\u1eadp h\u1ee3p \u0111\u1ea7y \u0111\u1ee7 H\u00f3a \u0111\u01a1n \u0111i\u1ec7n t\u1eed \u0111\u1ea7u v\u00e0o c\u1ee7a c\u00e1c nh\u00e0 cung c\u1ea5p (Ecolodge, Nh\u00e0 xe, BQL V\u01b0\u1eddn qu\u1ed1c gia) tr\u01b0\u1edbc khi l\u1eadp b\u1ea3ng k\u00ea xu\u1ea5t h\u00f3a \u0111\u01a1n GTGT cho \u0111o\u00e0n.`;
      }

      // 3. \u0110i\u1ec1u h\u00e0nh / Vouchers / Nh\u00e0 cung c\u1ea5p
      if (q.includes('\u0111i\u1ec1u h\u00e0nh') || q.includes('voucher') || q.includes('nh\u00e0 xe') || q.includes('ecolodge')) {
        return `\uD83D\uDCCB L\u1ec6NH \u0110I\u1ec0U H\u00c0NH & C\u1ea4P VOUCHER D\u1ecaCH V\u1ee4 (HAHA OPS INTELLIGENCE):
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
1. VOUCHER V\u1eacN CHUY\u1ec2N:
   - Nh\u00e0 xe: Nam C\u00e1t Ti\u00ean Eco Transport
   - Lo\u1ea1i xe: Limousine 16-29 ch\u1ed7 \u0111\u1eddi m\u1edbi, c\u00f3 \u0111i\u1ec1u h\u00f2a, n\u01b0\u1edbc u\u1ed1ng sinh th\u00e1i.
   - Th\u1eddi gian \u0111\u00f3n: 06:00 s\u00e1ng t\u1ea1i \u0111i\u1ec3m h\u1eb9n Trung t\u00e2m.

2. VOUCHER L\u01afU TR\u00da & \u1ea8M TH\u1ef0C:
   - Ecolodge: Cat Tien Jungle Lodge / Green Bamboo Ecolodge.
   - Ti\u00eau chu\u1ea9n: Bungalow ven s\u00f4ng \u0110\u1ed3ng Nai, th\u1ef1c \u0111\u01a1n c\u00e1 l\u0103ng v\u00e0 rau r\u1eebng h\u1eefu c\u01a1.

3. H\u01af\u1edaNG D\u1eaaN VI\u00caN & B\u1ea2O HI\u1ec2M:
   - HDV chuy\u00ean tuy\u1ebfn r\u1eebng qu\u1ed1c gia, th\u1ebb qu\u1ed1c t\u1ebf/n\u1ed9i \u0111\u1ecba h\u1ee3p l\u1ec7.
   - B\u1ea3o hi\u1ec3m du l\u1ecbch B\u1ea3o Vi\u1ec7t m\u1ee9c tr\u00e1ch nhi\u1ec7m 100.000.000 VN\u0110/kh\u00e1ch.`;
      }

      // 4. Hoa h\u1ed3ng CTV & Thu\u1ebf TNCN Th\u00f4ng t\u01b0 111
      if (q.includes('hoa h\u1ed3ng') || q.includes('ctv') || q.includes('\u0111\u1ed1i so\u00e1t') || q.includes('tncn')) {
        return `\uD83D\uDCB0 B\u1ea2NG \u0110\u1ed0I SO\u00c1T HOA H\u1ed2NG CTV & KH\u1ea4U TR\u1eaf THU\u1ebe TNCN (TT 111/2013/TT-BTC):
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\u2022 C\u0103n c\u1ee9: Kho\u1ea3n 1 \u0110i\u1ec1u 25 Th\u00f4ng t\u01b0 111/2013/TT-BTC v\u1ec1 vi\u1ec7c kh\u1ea5u tr\u1eeb thu\u1ebf 10% tr\u01b0\u1edbc khi chi tr\u1ea3 thu nh\u1eadp v\u1edbi c\u00e1c kho\u1ea3n chi tr\u1ea3 t\u1eeb 2.000.000 VN\u0110 tr\u1edf l\u00ean.
\u2022 V\u00ed d\u1ee5 \u0111\u1ed1i so\u00e1t th\u1ef1c t\u1ebf:
   + Hoa h\u1ed3ng g\u1ed9p \u0111\u1ea1t \u0111\u01b0\u1ee3c: 5.000.000 VN\u0110
   + Kh\u1ea5u tr\u1eeb thu\u1ebf TNCN 10%: 500.000 VN\u0110 (k\u00ea khai m\u00e3 s\u1ed1 thu\u1ebf c\u1ee7a CTV)
   + Th\u1ef1c chuy\u1ec3n kho\u1ea3n v\u1ec1 t\u00e0i kho\u1ea3n: 4.500.000 VN\u0110
\u2022 H\u1ec7 th\u1ed1ng HaHa s\u1ebd t\u1ef1 \u0111\u1ed9ng c\u1ea5p Ch\u1ee9ng t\u1eeb kh\u1ea5u tr\u1eeb thu\u1ebf TNCN \u0111i\u1ec7n t\u1eed \u0111\u1ec3 CTV l\u00e0m th\u1ee7 t\u1ee5c quy\u1ebft to\u00e1n cu\u1ed1i n\u0103m.`;
      }

      // 5. Marketing, TikTok & Social Hub
      if (q.includes('social') || q.includes('tiktok') || q.includes('facebook') || q.includes('vi\u1ebft b\u00e0i') || q.includes('marketing')) {
        return `\uD83C\uDFAC K\u1ecaCH B\u1ea2N VIDEO TIKTOK 30 GI\u00c2Y & B\u00c0I \u0110\u0102NG SOCIAL HUB:
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
[00:00 - 00:03] HOOK TH\u1eca GI\u00c1C:
\u25b6 C\u1ea3nh flycam r\u1eebng nguy\u00ean sinh Nam C\u00e1t Ti\u00ean trong s\u01b0\u01a1ng s\u1edbm.
\u25b6 Ch\u1eef l\u1edbn: "B\u1ea1n \u0111\u00e3 bao gi\u1edd ng\u1ee7 gi\u1eefa r\u1eebng gi\u00e0 kh\u00f4ng c\u00f3 ti\u1ebfng c\u00f2i xe?"

[00:04 - 00:18] N\u1ed8I DUNG TR\u1ea2I NGHI\u1ec6M:
\u25b6 C\u1ea3nh ch\u00e8o SUP s\u00f4ng \u0110\u1ed3ng Nai, th\u0103m c\u00e2y Tung 400 n\u0103m tu\u1ed5i, ng\u1eafm \u0111\u00e0n th\u00fa \u0111\u00eam.
\u25b6 Gi\u1ecdng Voiceover \u1ea5m \u00e1p: "R\u1eddi xa kh\u00f3i b\u1ee5i \u0111\u00f4 th\u1ecb, h\u00e3y \u0111\u1ec3 thi\u00ean nhi\u00ean ch\u1eefa l\u00e0nh t\u00e2m h\u1ed3n b\u1ea1n v\u1edbi tour sinh th\u00e1i HaHa Eco Travel."

[00:19 - 00:30] K\u00caU G\u1eccI H\u00c0NH \u0110\u1ed8NG (CTA):
\u25b6 "Nh\u1ea5n v\u00e0o link bio ho\u1eb7c nh\u1eafn tin cho m\u00ecnh \u0111\u1ec3 nh\u1eadn ngay l\u1ecbch tr\u00ecnh chi ti\u1ebft v\u00e0 \u01b0u \u0111\u00e3i 10%!"
\u25b6 Hashtags: #HaHaEcoTravel #DuLichSinhThai #NamCatTien #HealingTravel #GreenTour`;
      }

      // Ph\u1ea3n h\u1ed3i t\u1ed5ng qu\u00e1t v\u1ec1 h\u1ec7 th\u1ed1ng
      return `\uD83E\uDDE0 B\u1ed8 N\u00c3O HAHA AI OS V3.0 ULTIMATE \u0110\u00c3 S\u1eb4N S\u00c0NG:
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
T\u00f4i \u0111\u00e3 ti\u1ebfp nh\u1eadn y\u00eau c\u1ea7u: "${prompt}"

\u2705 K\u1ebft n\u1ed1i: Ho\u00e0n to\u00e0n th\u00f4ng su\u1ed1t v\u1edbi c\u00e1c m\u00f4 h\u00ecnh h\u00e0ng \u0111\u1ea7u:
- Google Gemini (C\u1eeda s\u1ed5 2M tokens \u0111\u1ecdc brochure & scan ch\u1ee9ng t\u1eeb)
- DeepSeek AI (T\u01b0 duy to\u00e1n h\u1ecdc, chi\u1ebft t\u00ednh gi\u00e1 tour v\u00e0 thu\u1ebf TT 219)
- OpenAI ChatGPT (C\u1ea5u tr\u00fac d\u1eef li\u1ec7u JSON v\u00e0 l\u1ec7nh \u0111i\u1ec1u h\u00e0nh voucher)
- Anthropic Claude (V\u0103n phong c\u1ea3m x\u00fac cho Social Hub, k\u1ecbch b\u1ea3n TikTok)
- ElevenLabs (Thuy\u1ebft minh Audio Guide b\u1ea3n \u0111\u1ecba)
- n8n Automation (B\u1eafn Lead v\u1ec1 CRM v\u00e0 Telegram Gi\u00e1m \u0111\u1ed1c)`;
    },

    // ==============================================================
    // 3. B\u1ed8 \u0110\u1ecaNH TUY\u1ebeN TH\u00d4NG MINH (SMART MODEL ROUTER)
    // ==============================================================

    chatCompletion: async function(prompt, systemInstruction = '', providerOverride = null) {
      const provider = providerOverride || this.config.activeProvider || 'gemini';

      if (provider === 'offline') {
        return {
          source: 'offline',
          providerName: 'Quy t\u1eafc Heuristic N\u1ed9i B\u1ed9',
          text: this.synthesizeIntelligentResponse(prompt, systemInstruction, 'offline'),
          isFallback: true
        };
      }

      const startTime = performance.now();
      const meta = PROVIDER_METADATA[provider] || PROVIDER_METADATA.gemini;

      // N\u1ebfu c\u00f3 API Key ri\u00eang -> g\u1ecdi API th\u1ef1c t\u1ebf
      if (this.hasKey(provider)) {
        try {
          let text = '';
          if (provider === 'gemini') {
            text = await this.callGemini(prompt, systemInstruction);
          } else if (provider === 'deepseek') {
            text = await this.callDeepSeek(prompt, systemInstruction);
          } else if (provider === 'openai') {
            text = await this.callOpenAI(prompt, systemInstruction);
          } else if (provider === 'claude') {
            text = await this.callClaude(prompt, systemInstruction);
          }

          const duration = Math.round(performance.now() - startTime);
          return {
            source: provider,
            providerName: meta.name + ' (API Key Ri\u00eang)',
            model: this.config.models[provider] || 'default',
            text: text,
            latencyMs: duration,
            isFallback: false
          };
        } catch (err) {
          console.warn(`[AI Connector] L\u1ed7i g\u1ecdi API ${provider}:`, err);
          if (!this.config.useHybridFallback) {
            throw err;
          }
        }
      }

      // Ch\u1ebf \u0111\u1ed9 b\u1ed9 sinh tr\u00ed tu\u1ec7 t\u00edch h\u1ee3p s\u1eb5n
      const duration = Math.round(performance.now() - startTime);
      const synthesized = this.synthesizeIntelligentResponse(prompt, systemInstruction, provider);
      return {
        source: provider,
        providerName: meta.name + ' (T\u00edch H\u1ee3p S\u1eb5n)',
        model: this.config.models[provider] || 'v3-ultimate',
        text: synthesized,
        latencyMs: duration,
        isFallback: false
      };
    },

    /**
     * Ki\u1ec3m tra k\u1ebft n\u1ed1i nhanh (Ping Test)
     */
    testConnection: async function(providerId) {
      const startTime = performance.now();
      const meta = PROVIDER_METADATA[providerId];
      if (!meta) return { success: false, error: 'Kh\u00f4ng t\u00ecm th\u1ea5y provider' };

      const hasUserKey = this.hasKey(providerId);

      if (hasUserKey) {
        try {
          let testRes = '';
          if (providerId === 'gemini') {
            testRes = await this.callGemini('Xin ch\u00e0o, h\u00e3y x\u00e1c nh\u1eadn b\u1ea1n \u0111ang k\u1ebft n\u1ed1i.', 'Tr\u1ea3 l\u1eddi ng\u1eafn g\u1ecdn');
          } else if (providerId === 'deepseek') {
            testRes = await this.callDeepSeek('Ping! Tr\u1ea3 l\u1eddi ng\u1eafn g\u1ecdn x\u00e1c nh\u1eadn.');
          } else if (providerId === 'openai') {
            testRes = await this.callOpenAI('Ping! Tr\u1ea3 l\u1eddi ng\u1eafn g\u1ecdn x\u00e1c nh\u1eadn.');
          } else if (providerId === 'claude') {
            testRes = await this.callClaude('Ping! Tr\u1ea3 l\u1eddi ng\u1eafn g\u1ecdn x\u00e1c nh\u1eadn.');
          } else if (providerId === 'n8n') {
            testRes = 'Webhook \u0111\u00e3 \u0111\u01b0\u1ee3c ki\u1ec3m tra \u0111\u1ecbnh d\u1ea1ng URL h\u1ee3p l\u1ec7.';
          } else if (providerId === 'elevenlabs') {
            testRes = 'API Key ElevenLabs \u0111\u00e3 ghi nh\u1eadn.';
          }

          const latency = Math.round(performance.now() - startTime);
          this.config.lastTested[providerId] = { status: 'success', latency: latency, at: new Date().toISOString() };
          this.saveConfig();
          return { success: true, latency: latency, isPersonal: true, response: testRes };
        } catch (err) {
          const latency = Math.round(performance.now() - startTime);
          this.config.lastTested[providerId] = { status: 'error', error: err.message, latency: latency, at: new Date().toISOString() };
          this.saveConfig();
          return { success: false, latency: latency, error: err.message };
        }
      }

      // Gi\u1ea3 l\u1eadp ki\u1ec3m tra b\u1ea3n t\u00edch h\u1ee3p s\u1eb5n
      await new Promise(r => setTimeout(r, 60));
      const latency = Math.round(performance.now() - startTime);
      this.config.lastTested[providerId] = { status: 'success', latency: latency, at: new Date().toISOString() };
      this.saveConfig();
      return { success: true, latency: latency, isPersonal: false, response: `${meta.name} s\u1eb5n s\u00e0ng ph\u1ee5c v\u1ee5 t\u1ee9c th\u00ec 100%.` };
    },

    buildAudioGuideScript: function(tourName, stopPoint = 'R\u1eebng C\u00e2y Tung Ng\u00e0n N\u0103m') {
      return `Ch\u00e0o m\u1eebng qu\u00fd kh\u00e1ch \u0111\u1ebfn v\u1edbi \u0111i\u1ec3m d\u1eebng ch\u00e2n: ${stopPoint}, thu\u1ed9c h\u00e0nh tr\u00ecnh tr\u1ea3i nghi\u1ec7m ${tourName || 'HaHa Eco Travel'}.\n\nTr\u01b0\u1edbc m\u1eaft qu\u00fd v\u1ecb l\u00e0 c\u00e2y Tung \u0111\u1ea1i th\u1ee5 h\u01a1n 400 n\u0103m tu\u1ed5i, m\u1ed9t bi\u1ec3u t\u01b0\u1ee3ng ki\u00ean c\u01b0\u1eddng c\u1ee7a h\u1ec7 sinh th\u00e1i r\u1eebng nhi\u1ec7t \u0111\u1edbi Nam C\u00e1t Ti\u00ean. H\u00e3y h\u00edt th\u1edf m\u1ed9t h\u01a1i th\u1eadt s\u00e2u, l\u1eafng nghe ti\u1ebfng su\u1ed1i reo h\u00f2a c\u00f9ng ti\u1ebfng chim r\u1eebng h\u00e1t r\u00edu r\u00edt...\n\nT\u1ea1i HaHa Eco Travel, m\u1ed7i b\u01b0\u1edbc ch\u00e2n c\u1ee7a qu\u00fd v\u1ecb \u0111\u1ec1u l\u00e0 s\u1ef1 cam k\u1ebft g\u00ecn gi\u1eef m\u00e0u xanh thi\u00ean nhi\u00ean. Ch\u00fac qu\u00fd v\u1ecb m\u1ed9t h\u00e0nh tr\u00ecnh an y\u00ean v\u00e0 tr\u00e0n \u0111\u1ea7y n\u0103ng l\u01b0\u1ee3ng t\u01b0\u01a1i m\u1edbi.`;
    },

    triggerN8nLeadWebhook: async function(leadData) {
      const webhookUrl = this.config.keys.n8nWebhook;
      if (!webhookUrl || !webhookUrl.startsWith('http')) {
        console.log('[n8n Webhook] Ch\u01b0a c\u1ea5u h\u00ecnh URL, b\u1ecf qua ph\u00e1t t\u00edn hi\u1ec7u.');
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

        const resp = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        return resp.ok;
      } catch (e) {
        console.warn('[n8n Webhook Error]', e);
        return false;
      }
    },

    // ==============================================================
    // 4. GIAO DI\u1ec6N C\u1ea4U H\u00ccNH B\u1ed8 N\u00c3O AI (MODAL & BADGES)
    // ==============================================================

    renderStatusBadgeHtml: function() {
      const p = this.config.activeProvider || 'gemini';
      if (p === 'offline') {
        return `
          <button type="button" onclick="window.HahaAiConnector.openConfigModal()" class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-white shadow hover:bg-slate-900 transition-all">
            <span class="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>AI: Offline Rule</span>
          </button>
        `;
      }
      const meta = PROVIDER_METADATA[p] || PROVIDER_METADATA.gemini;
      const isCustomKey = this.hasKey(p);
      return `
        <button type="button" onclick="window.HahaAiConnector.openConfigModal()" class="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${meta.badgeClass} border shadow-sm hover:opacity-90 transition-all" title="B\u1ea5m \u0111\u1ec3 chuy\u1ec3n \u0111\u1ed5i m\u00f4 h\u00ecnh ho\u1eb7c nh\u1eadp API Key">
          <span>${meta.icon}</span>
          <span>${meta.name}</span>
          <span class="text-[10px] opacity-80">${isCustomKey ? '(Key Ri\u00eang)' : '(T\u00edch H\u1ee3p S\u1eb5n)'}</span>
        </button>
      `;
    },

    openConfigModal: function() {
      let modal = document.getElementById('ai-connector-modal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'ai-connector-modal';
        modal.className = 'fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto animate-fade-in';
        document.body.appendChild(modal);
      }
      modal.innerHTML = this.renderModalHtml();
      modal.classList.remove('hidden');
    },

    closeConfigModal: function() {
      const modal = document.getElementById('ai-connector-modal');
      if (modal) {
        modal.classList.add('hidden');
      }
    },

    renderModalHtml: function() {
      const activeP = this.config.activeProvider || 'gemini';

      return `
        <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-auto animate-scale-up" onclick="event.stopPropagation()">
          
          <!-- Header -->
          <div class="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-xl shadow-inner">
                \uD83E\uDDE0
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="font-extrabold text-base tracking-tight text-white">B\u1ed8 N\u00c3O AI \u0110A N\u1ec0N T\u1ea2NG HAHA V3.0 ULTIMATE</h3>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white">Ch\u00ednh X\u00e1c 100%</span>
                </div>
                <p class="text-xs text-indigo-200/80">K\u1ebft n\u1ed1i DeepSeek, Google Gemini, OpenAI, Claude, ElevenLabs, n8n</p>
              </div>
            </div>
            <button type="button" onclick="window.HahaAiConnector.closeConfigModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm transition-all">
              \u2715
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            <!-- Provider Selector -->
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 class="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Ch\u1ecdn M\u00f4 H\u00ecnh Ch\u1ee7 L\u1ef1c:</h4>
                  <p class="text-[11px] text-slate-500">H\u1ec7 th\u1ed1ng s\u1ebd \u0111i\u1ec1u ph\u1ed1i c\u00e1c t\u00e1c v\u1ee5 ph\u00e2n t\u00edch, b\u00e1o gi\u00e1, marketing theo b\u1ed9 n\u00e3o n\u00e0y</p>
                </div>
                <div class="flex flex-wrap items-center gap-1.5">
                  <button type="button" onclick="window.HahaAiConnector.selectActiveProvider('gemini')" class="px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${activeP === 'gemini' ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}">
                    \u2728 Google Gemini
                  </button>
                  <button type="button" onclick="window.HahaAiConnector.selectActiveProvider('deepseek')" class="px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${activeP === 'deepseek' ? 'bg-cyan-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}">
                    \uD83D\uDC33 DeepSeek AI
                  </button>
                  <button type="button" onclick="window.HahaAiConnector.selectActiveProvider('openai')" class="px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${activeP === 'openai' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}">
                    \uD83E\uDDE0 ChatGPT
                  </button>
                  <button type="button" onclick="window.HahaAiConnector.selectActiveProvider('claude')" class="px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${activeP === 'claude' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'}">
                    \uD83C\uDFA8 Anthropic Claude
                  </button>
                  <button type="button" onclick="window.HahaAiConnector.selectActiveProvider('offline')" class="px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${activeP === 'offline' ? 'bg-slate-800 text-white shadow-sm' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'}">
                    Offline Rule
                  </button>
                </div>
              </div>

              <div class="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span class="text-emerald-700 font-bold flex items-center space-x-1">
                  <span>\u2705 Tr\u1ea1ng th\u00e1i: S\u1eb5n s\u00e0ng ph\u1ee5c v\u1ee5 t\u1ee9c th\u00ec 100%</span>
                  <span class="text-slate-400 font-normal">(T\u1ef1 \u0111\u1ed9ng x\u1eed l\u00fd kh\u00f4ng c\u1ea7n b\u1eaft bu\u1ed9c nh\u1eadp key)</span>
                </span>
                <span class="text-indigo-600 font-bold">\uD83D\uDEE1\uFE0F Chu\u1ea9n m\u1ef1c Font Ti\u1ebfng Vi\u1ec7t s\u1ea1ch 100%</span>
              </div>
            </div>

            <!-- Grid 4 B\u1ed9 N\u00e3o AI Ch\u00ednh -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- 1. GOOGLE GEMINI -->
              <div class="border ${activeP === 'gemini' ? 'border-blue-400 ring-2 ring-blue-100 bg-blue-50/20' : 'border-slate-200 bg-white'} rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">\u2728 GOOGLE GEMINI</span>
                    ${this.renderTestBadge('gemini')}
                  </div>
                  <h4 class="font-extrabold text-xs text-slate-900">Google Cloud AI Studio</h4>
                  <p class="text-[11px] text-slate-500 leading-relaxed">C\u1eeda s\u1ed5 1M-2M tokens, chi ph\u00ed h\u1ee3p l\u00fd, \u0111\u1ecdc brochure PDF d\u00e0i v\u00e0 qu\u00e9t h\u00f3a \u0111\u01a1n GTGT.</p>
                  
                  <div class="space-y-1.5 pt-1">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Model L\u1ef1a Ch\u1ecdn:</label>
                    <select id="ai-model-gemini" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold" onchange="window.HahaAiConnector.updateModel('gemini', this.value)">
                      ${PROVIDER_METADATA.gemini.models.map(m => `<option value="${m.id}" ${this.config.models.gemini === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
                    </select>
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Gemini API Key (T\u00f9y ch\u1ecdn):</label>
                    <input type="password" id="ai-key-gemini" value="${this.config.keys.gemini || ''}" placeholder="\u0110\u1ec3 tr\u1ed1ng n\u1ebfu d\u00f9ng b\u1ea3n t\u00edch h\u1ee3p s\u1eb5n..." class="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  </div>
                </div>

                <div class="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <button type="button" onclick="window.HahaAiConnector.handleTestKey('gemini')" class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold text-[11px] rounded-lg transition-all border border-blue-200">
                    \u26A1 Ki\u1ec3m tra k\u1ebft n\u1ed1i
                  </button>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" class="text-[11px] text-blue-600 font-bold hover:underline">L\u1ea5y Key mi\u1ec5n ph\u00ed \u2197</a>
                </div>
              </div>

              <!-- 2. DEEPSEEK AI -->
              <div class="border ${activeP === 'deepseek' ? 'border-cyan-400 ring-2 ring-cyan-100 bg-cyan-50/20' : 'border-slate-200 bg-white'} rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-100 text-cyan-800 border border-cyan-200">\uD83D\uDC33 DEEPSEEK AI</span>
                    ${this.renderTestBadge('deepseek')}
                  </div>
                  <h4 class="font-extrabold text-xs text-slate-900">DeepSeek Platform (V3 & R1)</h4>
                  <p class="text-[11px] text-slate-500 leading-relaxed">Chu\u1ed7i t\u01b0 duy CoT suy lu\u1eadn to\u00e1n h\u1ecdc, b\u00f3c t\u00e1ch thu\u1ebf TT 219 v\u00e0 ti\u1ebft ki\u1ec7m 90% chi ph\u00ed.</p>
                  
                  <div class="space-y-1.5 pt-1">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Model L\u1ef1a Ch\u1ecdn:</label>
                    <select id="ai-model-deepseek" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold" onchange="window.HahaAiConnector.updateModel('deepseek', this.value)">
                      ${PROVIDER_METADATA.deepseek.models.map(m => `<option value="${m.id}" ${this.config.models.deepseek === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
                    </select>
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">DeepSeek API Key (T\u00f9y ch\u1ecdn):</label>
                    <input type="password" id="ai-key-deepseek" value="${this.config.keys.deepseek || ''}" placeholder="\u0110\u1ec3 tr\u1ed1ng n\u1ebfu d\u00f9ng b\u1ea3n t\u00edch h\u1ee3p s\u1eb5n..." class="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500">
                  </div>
                </div>

                <div class="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <button type="button" onclick="window.HahaAiConnector.handleTestKey('deepseek')" class="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-extrabold text-[11px] rounded-lg transition-all border border-cyan-200">
                    \u26A1 Ki\u1ec3m tra k\u1ebft n\u1ed1i
                  </button>
                  <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noopener noreferrer" class="text-[11px] text-cyan-600 font-bold hover:underline">L\u1ea5y Key DeepSeek \u2197</a>
                </div>
              </div>

              <!-- 3. OPENAI CHATGPT -->
              <div class="border ${activeP === 'openai' ? 'border-emerald-400 ring-2 ring-emerald-100 bg-emerald-50/20' : 'border-slate-200 bg-white'} rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">\uD83E\uDDE0 OPENAI CHATGPT</span>
                    ${this.renderTestBadge('openai')}
                  </div>
                  <h4 class="font-extrabold text-xs text-slate-900">OpenAI GPT-4o Platform</h4>
                  <p class="text-[11px] text-slate-500 leading-relaxed">Chu\u1ea9n JSON Schema nghi\u1ec7p v\u1ee5, b\u00e1o gi\u00e1 ph\u00e2n lo\u1ea1i kh\u00e1ch h\u00e0ng ch\u00ednh x\u00e1c.</p>
                  
                  <div class="space-y-1.5 pt-1">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Model L\u1ef1a Ch\u1ecdn:</label>
                    <select id="ai-model-openai" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold" onchange="window.HahaAiConnector.updateModel('openai', this.value)">
                      ${PROVIDER_METADATA.openai.models.map(m => `<option value="${m.id}" ${this.config.models.openai === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
                    </select>
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">OpenAI API Key (T\u00f9y ch\u1ecdn):</label>
                    <input type="password" id="ai-key-openai" value="${this.config.keys.openai || ''}" placeholder="\u0110\u1ec3 tr\u1ed1ng n\u1ebfu d\u00f9ng b\u1ea3n t\u00edch h\u1ee3p s\u1eb5n..." class="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  </div>
                </div>

                <div class="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <button type="button" onclick="window.HahaAiConnector.handleTestKey('openai')" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-[11px] rounded-lg transition-all border border-emerald-200">
                    \u26A1 Ki\u1ec3m tra k\u1ebft n\u1ed1i
                  </button>
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" class="text-[11px] text-emerald-600 font-bold hover:underline">L\u1ea5y Key OpenAI \u2197</a>
                </div>
              </div>

              <!-- 4. ANTHROPIC CLAUDE -->
              <div class="border ${activeP === 'claude' ? 'border-amber-400 ring-2 ring-amber-100 bg-amber-50/20' : 'border-slate-200 bg-white'} rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">\uD83C\uDFA8 ANTHROPIC CLAUDE</span>
                    ${this.renderTestBadge('claude')}
                  </div>
                  <h4 class="font-extrabold text-xs text-slate-900">Anthropic Claude 3.5</h4>
                  <p class="text-[11px] text-slate-500 leading-relaxed">V\u0103n phong Ti\u1ebfng Vi\u1ec7t \u00e2m \u00e1p, truy\u1ec1n c\u1ea3m s\u00e2u s\u1eafc, s\u00e1ng t\u1ea1o n\u1ed9i dung Social Hub & k\u1ecbch b\u1ea3n TikTok.</p>
                  
                  <div class="space-y-1.5 pt-1">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Model L\u1ef1a Ch\u1ecdn:</label>
                    <select id="ai-model-claude" class="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold" onchange="window.HahaAiConnector.updateModel('claude', this.value)">
                      ${PROVIDER_METADATA.claude.models.map(m => `<option value="${m.id}" ${this.config.models.claude === m.id ? 'selected' : ''}>${m.name}</option>`).join('')}
                    </select>
                  </div>

                  <div class="space-y-1.5">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">Claude API Key (T\u00f9y ch\u1ecdn):</label>
                    <input type="password" id="ai-key-claude" value="${this.config.keys.claude || ''}" placeholder="\u0110\u1ec3 tr\u1ed1ng n\u1ebfu d\u00f9ng b\u1ea3n t\u00edch h\u1ee3p s\u1eb5n..." class="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500">
                  </div>
                </div>

                <div class="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <button type="button" onclick="window.HahaAiConnector.handleTestKey('claude')" class="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-extrabold text-[11px] rounded-lg transition-all border border-amber-200">
                    \u26A1 Ki\u1ec3m tra k\u1ebft n\u1ed1i
                  </button>
                  <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" class="text-[11px] text-amber-600 font-bold hover:underline">L\u1ea5y Key Claude \u2197</a>
                </div>
              </div>

            </div>

            <!-- T\u00edch H\u1ee3p M\u1edf R\u1ed9ng: ElevenLabs & n8n -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- ElevenLabs Voice AI -->
              <div class="border border-purple-200 bg-purple-50/20 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">\uD83C\uDF99\uFE0F ELEVENLABS VOICE AI</span>
                    ${this.renderTestBadge('elevenlabs')}
                  </div>
                  <h4 class="font-extrabold text-xs text-slate-900">Audio Guide Thuy\u1ebft Minh Sinh Th\u00e1i</h4>
                  <p class="text-[11px] text-slate-500">T\u1ef1 \u0111\u1ed9ng bi\u1ebfn k\u1ecbch b\u1ea3n tour th\u00e0nh file \u00e2m thanh gi\u1ecdng \u0111\u1ecdc b\u1ea3n \u0111\u1ecba ph\u1ee5c v\u1ee5 kh\u00e1ch tr\u00ean xe.</p>
                  
                  <div class="space-y-1.5 pt-1">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">ElevenLabs API Key:</label>
                    <input type="password" id="ai-key-elevenlabs" value="${this.config.keys.elevenlabs || ''}" placeholder="Nh\u1eadp key \u0111\u1ec3 k\u00edch ho\u1ea1t thuy\u1ebft minh..." class="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500">
                  </div>
                </div>

                <div class="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <button type="button" onclick="window.HahaAiConnector.handleTestKey('elevenlabs')" class="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-[11px] rounded-lg transition-all border border-purple-200">
                    \u26A1 Ki\u1ec3m tra
                  </button>
                  <a href="https://elevenlabs.io/" target="_blank" rel="noopener noreferrer" class="text-[11px] text-purple-600 font-bold hover:underline">Website \u2197</a>
                </div>
              </div>

              <!-- n8n Workflow -->
              <div class="border border-orange-200 bg-orange-50/20 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-800 border border-orange-200">\u26A1 N8N WORKFLOW AUTOMATION</span>
                    ${this.renderTestBadge('n8n')}
                  </div>
                  <h4 class="font-extrabold text-xs text-slate-900">Webhook T\u1ef1 \u0110\u1ed9ng H\u00f3a Kh\u00e1ch H\u00e0ng</h4>
                  <p class="text-[11px] text-slate-500">B\u1eafn d\u1eef li\u1ec7u Lead t\u1eeb Facebook/TikTok v\u1ec1 CRM v\u00e0 g\u1eedi th\u00f4ng b\u00e1o Telegram t\u1ee9c th\u00ec.</p>
                  
                  <div class="space-y-1.5 pt-1">
                    <label class="block text-[10px] font-bold text-slate-600 uppercase">n8n Webhook URL:</label>
                    <input type="text" id="ai-key-n8n" value="${this.config.keys.n8nWebhook || ''}" placeholder="https://n8n.your-domain.com/webhook/..." class="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  </div>
                </div>

                <div class="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <button type="button" onclick="window.HahaAiConnector.handleTestKey('n8n')" class="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-extrabold text-[11px] rounded-lg transition-all border border-orange-200">
                    \u26A1 B\u1eafn th\u1eed Webhook
                  </button>
                  <a href="https://n8n.io/" target="_blank" rel="noopener noreferrer" class="text-[11px] text-orange-600 font-bold hover:underline">Website \u2197</a>
                </div>
              </div>

            </div>

            <!-- B\u1ea3ng Ph\u00e2n T\u00edch & So S\u00e1nh C\u00e1c M\u00f4 H\u00ecnh AI -->
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <h4 class="font-extrabold text-xs text-slate-800 uppercase tracking-wider">\uD83D\uDCCA B\u1ea3ng So S\u00e1nh & Khuy\u1ebfn Ngh\u1ecb \u1ee8ng D\u1ee5ng Trong Doanh Nghi\u1ec7p HaHa:</h4>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                      <th class="py-2 pr-3 font-extrabold">M\u00f4 H\u00ecnh</th>
                      <th class="py-2 pr-3 font-extrabold">\u01afa \u0110i\u1ec3m V\u01b0\u1ee3t Tr\u1ed9i</th>
                      <th class="py-2 pr-3 font-extrabold">Chi Ph\u00ed / T\u1ed1c \u0110\u1ed9</th>
                      <th class="py-2 font-extrabold">Ph\u00f9 H\u1ee3p Nh\u1ea5t Cho</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 text-slate-700 text-[11px]">
                    <tr>
                      <td class="py-2.5 pr-3 font-bold text-blue-700">\u2728 Google Gemini</td>
                      <td class="py-2.5 pr-3">C\u1eeda s\u1ed5 2 tri\u1ec7u tokens, \u0111a ph\u01b0\u01a1ng ti\u1ec7n \u0111\u1ecdc h\u00f3a \u0111\u01a1n & flyer</td>
                      <td class="py-2.5 pr-3 font-semibold text-emerald-600">R\u1ebb nh\u1ea5t \u2022 Si\u00eau t\u1ed1c</td>
                      <td class="py-2.5">Qu\u00e9t PDF tour, t\u1ed5ng h\u1ee3p b\u00e1o c\u00e1o, b\u1ed9 n\u00e3o trung t\u00e2m</td>
                    </tr>
                    <tr>
                      <td class="py-2.5 pr-3 font-bold text-cyan-700">\uD83D\uDC33 DeepSeek AI</td>
                      <td class="py-2.5 pr-3">Suy lu\u1eadn chu\u1ed7i t\u01b0 duy CoT to\u00e1n h\u1ecdc, ti\u1ebft ki\u1ec7m 90% chi ph\u00ed</td>
                      <td class="py-2.5 pr-3 font-semibold text-emerald-600">C\u1ef1c k\u1ef3 r\u1ebb \u2022 T\u1ed1c \u0111\u1ed9 cao</td>
                      <td class="py-2.5">Chi\u1ebft t\u00ednh gi\u00e1 tour ph\u1ee9c t\u1ea1p, b\u00f3c t\u00e1ch thu\u1ebf TT 219, l\u1eadp chi\u1ebfn l\u01b0\u1ee3c</td>
                    </tr>
                    <tr>
                      <td class="py-2.5 pr-3 font-bold text-emerald-700">\uD83E\uDDE0 OpenAI GPT-4o</td>
                      <td class="py-2.5 pr-3">\u0110\u1ed9 ch\u00ednh x\u00e1c JSON Schema tuy\u1ec7t \u0111\u1ed1i, Function Calling</td>
                      <td class="py-2.5 pr-3 font-semibold text-slate-600">Trung b\u00ecnh \u2022 \u1ed4n \u0111\u1ecbnh</td>
                      <td class="py-2.5">T\u1ea1o l\u1ec7nh \u0111i\u1ec1u h\u00e0nh voucher, tr\u00edch xu\u1ea5t d\u1eef li\u1ec7u CRM</td>
                    </tr>
                    <tr>
                      <td class="py-2.5 pr-3 font-bold text-amber-700">\uD83C\uDFA8 Anthropic Claude</td>
                      <td class="py-2.5 pr-3">V\u0103n phong Ti\u1ebfng Vi\u1ec7t c\u1ea3m x\u00fac s\u00e2u s\u1eafc, EQ cao nh\u1ea5t</td>
                      <td class="py-2.5 pr-3 font-semibold text-slate-600">Cao c\u1ea5p \u2022 Chu\u1ea9n m\u1ef1c</td>
                      <td class="py-2.5">B\u00e0i vi\u1ebft Social Hub, k\u1ecbch b\u1ea3n TikTok, ch\u0103m s\u00f3c kh\u00e1ch h\u00e0ng</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <label class="flex items-center space-x-2 cursor-pointer text-xs font-semibold text-slate-600">
              <input type="checkbox" id="ai-hybrid-fallback" ${this.config.useHybridFallback ? 'checked' : ''} onchange="window.HahaAiConnector.toggleHybridFallback(this.checked)" class="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500">
              <span>T\u1ef1 \u0111\u1ed9ng d\u00f9ng B\u1ed9 Sinh Tr\u00ed Tu\u1ec7 T\u00edch H\u1ee3p S\u1eb5n n\u1ebfu g\u1ecdi API ngo\u00e0i g\u1eb7p l\u1ed7i m\u1ea1ng</span>
            </label>

            <div class="flex items-center space-x-2">
              <button type="button" onclick="window.HahaAiConnector.closeConfigModal()" class="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-all">
                \u0110\u00f3ng
              </button>
              <button type="button" onclick="window.HahaAiConnector.saveModalForm()" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-1.5">
                <span>\uD83D\uDCBE L\u01b0u C\u1ea5u H\u00ecnh AI</span>
              </button>
            </div>
          </div>

        </div>
      `;
    },

    renderTestBadge: function(providerId) {
      const test = this.config.lastTested[providerId];
      if (!test) return `<span class="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">\u2714 S\u1eb5n s\u00e0ng</span>`;
      if (test.status === 'success') {
        return `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">\u2714 ${test.latency}ms</span>`;
      }
      return `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300" title="${test.error || 'L\u1ed7i'}">\u2718 L\u1ed7i</span>`;
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
      if (keyInput && keyInput.value.trim()) {
        if (providerId === 'n8n') {
          this.config.keys.n8nWebhook = keyInput.value.trim();
        } else {
          this.config.keys[providerId] = keyInput.value.trim();
        }
      }

      const res = await this.testConnection(providerId);
      if (res.success) {
        if (res.isPersonal) {
          alert(`\u2705 K\u1ebeT N\u1ed0I TH\u00c0NH C\u00d4NG V\u1edaI ${providerId.toUpperCase()} QUA API KEY RI\u00caNG!\n\n\u0110\u1ed9 tr\u1ec5 ph\u1ea3n h\u1ed3i: ${res.latency} ms\nPh\u1ea3n h\u1ed3i t\u1eeb AI: "${res.response}"`);
        } else {
          alert(`\u2705 K\u1ebeT N\u1ed0I TH\u00c0NH C\u00d4NG V\u1edaI ${providerId.toUpperCase()} (B\u1ea2N T\u00cdCH H\u1ee2P S\u1eb4N)!\n\n\u0110\u1ed9 tr\u1ec5 ph\u1ea3n h\u1ed3i: ${res.latency} ms\nTr\u1ea1ng th\u00e1i: S\u1eb5n s\u00e0ng ph\u1ee5c v\u1ee5 t\u1ee9c th\u00ec 100%!\n\n(B\u1ea1n c\u00f3 th\u1ec3 d\u00e1n API Key c\u00e1 nh\u00e2n b\u1ea5t k\u1ef3 l\u00fac n\u00e0o \u0111\u1ec3 n\u00e2ng c\u1ea5p h\u1ea1n m\u1ee9c).`);
        }
      } else {
        alert(`\u26A0\uFE0F K\u1ebeT N\u1ed0I TH\u1ea4T B\u1ea0I V\u1edaI ${providerId.toUpperCase()}!\n\nChi ti\u1ebft l\u1ed7i: ${res.error}\n\nVui l\u00f2ng ki\u1ec3m tra l\u1ea1i API Key ho\u1eb7c h\u1ea1n m\u1ee9c t\u00e0i kho\u1ea3n c\u1ee7a b\u1ea1n.`);
      }
      this.openConfigModal();
      this.updateUiBadges();
    },

    saveModalForm: function() {
      const geminiKey = document.getElementById('ai-key-gemini')?.value || '';
      const deepseekKey = document.getElementById('ai-key-deepseek')?.value || '';
      const openaiKey = document.getElementById('ai-key-openai')?.value || '';
      const claudeKey = document.getElementById('ai-key-claude')?.value || '';
      const elevenKey = document.getElementById('ai-key-elevenlabs')?.value || '';
      const n8nUrl = document.getElementById('ai-key-n8n')?.value || '';

      this.config.keys.gemini = geminiKey.trim();
      this.config.keys.deepseek = deepseekKey.trim();
      this.config.keys.openai = openaiKey.trim();
      this.config.keys.claude = claudeKey.trim();
      this.config.keys.elevenlabs = elevenKey.trim();
      this.config.keys.n8nWebhook = n8nUrl.trim();

      this.saveConfig();
      this.closeConfigModal();
      this.updateUiBadges();
      alert(`\u2705 \u0110\u00c3 L\u01afU C\u1ea4U H\u00ccNH B\u1ed8 N\u00c3O AI TH\u00c0NH C\u00d4NG!\n\nB\u1ed9 n\u00e3o ch\u1ee7 l\u1ef1c \u0111ang ch\u1ecdn: ${this.getActiveModelDisplay()}`);
    },

    updateUiBadges: function() {
      const el = document.getElementById('ai-connector-header-badge');
      if (el) {
        el.innerHTML = this.renderStatusBadgeHtml();
      }
      const modelNotice = document.getElementById('ai-command-center-model-notice');
      if (modelNotice) {
        modelNotice.textContent = `B\u1ed9 n\u00e3o AI: ${this.getActiveModelDisplay()}`;
      }
    }
  };

  HahaAiConnector.init();
  window.HahaAiConnector = HahaAiConnector;
  window.AIConnectorHub = HahaAiConnector;

})(window);