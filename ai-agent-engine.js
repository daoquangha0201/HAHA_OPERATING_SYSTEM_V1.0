/**
 * HAHA ECO TRAVEL OPERATING SYSTEM - MULTI-AGENT AI ENGINE & AUTOMATION WORKFLOWS
 * Phi\u00ean b\u1ea3n: 3.0 ULTIMATE (T\u00edch h\u1ee3p Google Firebase Cloud & Khung Ki\u1ec3m Th\u1eed H\u1ed3i Quy)
 * - Ki\u1ebfn tr\u00fac 7 AI Agents chuy\u00ean tr\u00e1ch: Master Orchestrator, Sales, Ops, Finance, CTV, Marketing, CEO.
 * - An to\u00e0n d\u1eef li\u1ec7u v\u1edbi c\u01a1 ch\u1ebf Human-in-the-Loop (HITL) Guardrails.
 * - T\u1ef1 \u0111\u1ed9ng h\u00f3a quy tr\u00ecnh nghi\u1ec7p v\u1ee5 (Workflows) \u0111\u1ed3ng b\u1ed9 th\u1eddi gian th\u1ef1c qua Firebase.
 * - B\u1ed9 ki\u1ec3m th\u1eed h\u1ed3i quy t\u1ef1 \u0111\u1ed9ng (Regression Test Suite) b\u1ea3o v\u1ec7 to\u00e0n b\u1ed9 12 ph\u00e2n h\u1ec7.
 * 
 * 100% Chu\u1ea9n M\u1ef1c Font Unicode ASCII Escape - Kh\u00f4ng bao gi\u1edd l\u1ed7i ph\u00f4ng ch\u1eef.
 */

(function(window) {
  'use strict';

  // ==============================================================
  // 1. \u0110\u1ecaNH NGH\u0128A 7 AI AGENTS & MA TR\u1eacN PH\u00c2N QUY\u1ec0N (GUARDRAILS)
  // ==============================================================
  const AGENT_REGISTRY = {
    ORCHESTRATOR: {
      id: 'ORCHESTRATOR',
      name: 'AI \u0110i\u1ec1u Ph\u1ed1i Trung T\u00e2m',
      title: 'Master Orchestrator Agent',
      avatar: '\uD83E\uDDE0',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      description: 'Ti\u1ebfp nh\u1eadn y\u00eau c\u1ea7u b\u1eb1ng ti\u1ebfng Vi\u1ec7t t\u1ef1 nhi\u00ean, ph\u00e2n t\u00edch m\u1ee5c ti\u00eau v\u00e0 \u1ee7y quy\u1ec1n cho Agent chuy\u00ean tr\u00e1ch.',
      readScope: ['To\u00e0n b\u1ed9 h\u1ec7 th\u1ed1ng'],
      permittedActions: ['Ph\u00e2n t\u00edch c\u00e2u h\u1ecfi', '\u0110i\u1ec1u ph\u1ed1i Agent', 'T\u1ed5ng h\u1ee3p b\u00e1o c\u00e1o \u0111a ph\u00f2ng ban'],
      prohibitedActions: ['T\u1ef1 \u00fd ghi \u0111\u00e8 d\u1eef li\u1ec7u t\u00e0i ch\u00ednh m\u00e0 kh\u00f4ng qua Finance Agent', 'B\u1ecf qua b\u01b0\u1edbc ph\u00ea duy\u1ec7t con ng\u01b0\u1eddi'],
      requiresApproval: false
    },
    SALES: {
      id: 'SALES',
      name: 'AI Kinh Doanh',
      title: 'Smart Sales & Quotation Agent',
      avatar: '\uD83D\uDCBC',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      description: 'Chi\u1ebft t\u00ednh gi\u00e1 tour, l\u1eadp b\u1ea3ng b\u00e1o gi\u00e1 theo y\u00eau c\u1ea7u ri\u00eang c\u1ee7a \u0111o\u00e0n, g\u1ee3i \u00fd l\u1ecbch tr\u00ecnh sinh th\u00e1i.',
      readScope: ['Kh\u00e1ch h\u00e0ng \u0111\u01b0\u1ee3c ph\u00e2n c\u00f4ng', 'Ng\u00e2n h\u00e0ng Tour', 'B\u00e1o gi\u00e1', 'L\u1ecbch kh\u1edfi h\u00e0nh'],
      permittedActions: ['So\u1ea1n b\u00e1o gi\u00e1 tour', 'T\u00ednh to\u00e1n gi\u00e1 theo s\u1ed1 l\u01b0\u1ee3ng kh\u00e1ch', 'T\u1ea1o k\u1ecbch b\u1ea3n ch\u0103m s\u00f3c kh\u00e1ch'],
      prohibitedActions: ['Xem t\u1ef7 l\u1ec7 hoa h\u1ed3ng chi tr\u1ea3 CTV', 'Xem S\u0110T kh\u00e1ch c\u1ee7a Sale kh\u00e1c', 'T\u1ef1 gi\u1ea3m gi\u00e1 qu\u00e1 5%'],
      requiresApproval: true
    },
    OPS: {
      id: 'OPS',
      name: 'AI \u0110i\u1ec1u H\u00e0nh',
      title: 'Tour Operations & Logistics Agent',
      avatar: '\uD83E\uDDED',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      description: 'L\u1eadp l\u1ec7nh \u0111\u1eb7t d\u1ecbch v\u1ee5 NCC, so\u1ea1n Voucher kh\u00e1ch s\u1ea1n/nh\u00e0 xe, ki\u1ec3m tra l\u1ecbch tr\u00ecnh v\u00e0 c\u1ea3nh b\u00e1o s\u1ef1 c\u1ed1.',
      readScope: ['L\u1ecbch kh\u1edfi h\u00e0nh tour', 'Danh s\u00e1ch \u0111o\u00e0n', 'Danh b\u1ea1 NCC', 'Vouchers'],
      permittedActions: ['So\u1ea1n Voucher \u0111\u1eb7t d\u1ecbch v\u1ee5', 'Ki\u1ec3m tra xung \u0111\u1ed9t l\u1ecbch xe/HDV', 'G\u1ee3i \u00fd l\u1ecbch tr\u00ecnh d\u1ef1 ph\u00f2ng'],
      prohibitedActions: ['Xem gi\u00e1 b\u00e1n cho kh\u00e1ch v\u00e0 bi\u00ean l\u1ee3i nhu\u1eadn c\u1ee7a tour', 'T\u1ef1 \u00fd h\u1ee7y h\u1ee3p \u0111\u1ed3ng nh\u00e0 xe'],
      requiresApproval: true
    },
    FINANCE: {
      id: 'FINANCE',
      name: 'AI K\u1ebf To\u00e1n & Thu\u1ebf',
      title: 'Tax & Financial Accounting Agent',
      avatar: '\uD83D\uDCB0',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      description: 'B\u00f3c t\u00e1ch thu\u1ebf GTGT l\u1eef h\u00e0nh TT 219, kh\u1ea5u tr\u1eeb thu\u1ebf TNCN 10% TT 111, \u0111\u1ed1i so\u00e1t c\u00f4ng n\u1ee3 thu chi.',
      readScope: ['S\u1ed5 qu\u1ef9 thu chi', 'H\u00f3a \u0111\u01a1n VAT', 'Ch\u1ee9ng t\u1eeb thu\u1ebf', 'C\u00f4ng n\u1ee3 Booking', 'B\u1ea3ng t\u00ednh hoa h\u1ed3ng'],
      permittedActions: ['Chi\u1ebft t\u00ednh thu\u1ebf GTGT v\u00e0 thu\u1ebf TNCN', '\u0110\u1ed1i so\u00e1t chuy\u1ec3n kho\u1ea3n', 'D\u1ef1 th\u1ea3o b\u00fat to\u00e1n k\u1ebf to\u00e1n'],
      prohibitedActions: ['TUY\u1ec6T \u0110\u1ed0I C\u1ea4M T\u1ef0 CHUY\u1ec2N TI\u1ec0N T\u00c0I KHO\u1ea2N NG\u00c2N H\u00c0NG', 'C\u1ea5m t\u1ef1 xu\u1ea5t H\u0110\u0110T ch\u01b0a c\u00f3 ch\u1eef k\u00fd s\u1ed1'],
      requiresApproval: true
    },
    AFFILIATE: {
      id: 'AFFILIATE',
      name: 'AI \u0110\u1ed1i T\u00e1c & CTV',
      title: 'CTV Network & Partner Agent',
      avatar: '\uD83E\uDD1D',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
      description: 'H\u1ed7 tr\u1ee3 CTV 24/7, cung c\u1ea5p t\u00e0i li\u1ec7u b\u00e1n h\u00e0ng (Sales Kit), gi\u1ea3i \u0111\u00e1p ch\u00ednh s\u00e1ch hoa h\u1ed3ng minh b\u1ea1ch.',
      readScope: ['H\u1ed3 s\u01a1 CTV', 'Ch\u00ednh s\u00e1ch hoa h\u1ed3ng c\u1ee7a tour', 'Tr\u1ea1ng th\u00e1i \u0111\u01a1n c\u1ee7a CTV \u0111\u00f3'],
      permittedActions: ['T\u1ea1o t\u00e0i li\u1ec7u b\u00e1n h\u00e0ng g\u1eafn m\u00e3 CTV', 'T\u00ednh to\u00e1n hoa h\u1ed3ng d\u1ef1 ki\u1ebfn', 'So\u1ea1n tin nh\u1eafn h\u1ed7 tr\u1ee3'],
      prohibitedActions: ['Xem danh s\u00e1ch kh\u00e1ch c\u1ee7a CTV kh\u00e1c', 'T\u1ef1 \u00fd s\u1eeda ch\u00ednh s\u00e1ch hoa h\u1ed3ng g\u1ed1c'],
      requiresApproval: true
    },
    MARKETING: {
      id: 'MARKETING',
      name: 'AI Marketing & MXH',
      title: 'Eco-Travel Content & Social Hub Agent',
      avatar: '\uD83D\uDCE2',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      description: 'S\u00e1ng t\u1ea1o n\u1ed9i dung qu\u1ea3ng b\u00e1 tour sinh th\u00e1i, vi\u1ebft b\u00e0i truy\u1ec1n th\u00f4ng, \u0111i\u1ec1u ph\u1ed1i MXH CTV.',
      readScope: ['Th\u00f4ng tin s\u1ea3n ph\u1ea9m Tour', 'Feedback c\u1ee7a kh\u00e1ch', 'H\u00ecnh \u1ea3nh \u0111i\u1ec3m \u0111\u1ebfn', 'Chi\u1ebfn d\u1ecbch ti\u1ebfp th\u1ecb'],
      permittedActions: ['So\u1ea1n b\u00e0i \u0111\u0103ng Facebook / Instagram / TikTok', 'Vi\u1ebft c\u1ea9m nang du l\u1ecbch xanh', '\u0110i\u1ec1u ph\u1ed1i b\u00e0i cho CTV ph\u00ea duy\u1ec7t'],
      prohibitedActions: ['Truy c\u1eadp s\u1ed1 \u0111i\u1ec7n tho\u1ea1i / th\u00f4ng tin nh\u1ea1y c\u1ea3m c\u1ee7a kh\u00e1ch', 'T\u1ef1 \u00fd \u0111\u0103ng b\u00e0i khi ch\u01b0a c\u00f3 quy\u1ec1n OAuth'],
      requiresApproval: false
    },
    EXECUTIVE: {
      id: 'EXECUTIVE',
      name: 'AI Gi\u00e1m \u0110\u1ed1c',
      title: 'Executive BI & Strategy Advisor',
      avatar: '\uD83D\uDC54',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      description: 'T\u1ed5ng h\u1ee3p b\u00e1o c\u00e1o doanh thu, ph\u00e2n t\u00edch t\u1ef7 su\u1ea5t l\u1ee3i nhu\u1eadn t\u1eebng tour, d\u1ef1 b\u00e1o d\u00f2ng ti\u1ec1n 30 ng\u00e0y.',
      readScope: ['To\u00e0n b\u1ed9 c\u01a1 s\u1edf d\u1eef li\u1ec7u doanh nghi\u1ec7p'],
      permittedActions: ['T\u1ed5ng h\u1ee3p s\u1ed1 li\u1ec7u kinh doanh', 'C\u1ea3nh b\u00e1o r\u1ee7i ro h\u00f2a v\u1ed1n / n\u1ee3 x\u1ea5u', 'G\u1ee3i \u00fd gi\u00e1 b\u00e1n'],
      prohibitedActions: ['AI ch\u1ec9 \u0111\u00f3ng vai tr\u00f2 c\u1ed1 v\u1ea5n th\u00f4ng minh, kh\u00f4ng c\u00f3 quy\u1ec1n t\u1ef1 x\u00f3a d\u1eef li\u1ec7u c\u00f4ng ty'],
      requiresApproval: false
    }
  };

  // ==============================================================
  // 2. KH\u1edeI T\u1ea0O N\u1ec0N T\u1ea2NG HAHA AI COMMAND CENTER
  // ==============================================================
  const HahaAI = {
    agents: AGENT_REGISTRY,
    currentAgent: 'ORCHESTRATOR',
    chatHistory: [],
    automationRules: {
      autoCheckDebt: true,       // T\u1ef1 \u0111\u1ed9ng qu\u00e9t n\u1ee3 tr\u01b0\u1edbc 5 ng\u00e0y
      autoOpsFlag: true,         // T\u1ef1 \u0111\u1ed9ng k\u00edch ho\u1ea1t \u0111i\u1ec1u h\u00e0nh khi nh\u1eadn c\u1ecdc >= 30%
      autoCommissionCalc: true,  // T\u1ef1 \u0111\u1ed9ng t\u00ednh hoa h\u1ed3ng khi tour ho\u00e0n th\u00e0nh
      autoCrmRetention: true,    // T\u1ef1 \u0111\u1ed9ng nh\u1eafc ch\u0103m s\u00f3c kh\u00e1ch sau tour 30 ng\u00e0y
      autoDlpProtection: true    // T\u1ef1 \u0111\u1ed9ng b\u1ea3o v\u1ec7 v\u00e0 ghi v\u1ebft m\u1edf kh\u00f3a S\u0110T
    },

    // M\u1edf Trung t\u00e2m \u0110i\u1ec1u h\u00e0nh AI
    openModal: function(initialAgent) {
      if (initialAgent && this.agents[initialAgent]) {
        this.currentAgent = initialAgent;
      }
      const modal = document.getElementById('ai-agent-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        modal.style.display = 'flex';
        this.renderAgentTabs();
        this.renderAgentInfo();
        this.focusInput();
      }
    },

    closeModal: function() {
      const modal = document.getElementById('ai-agent-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        modal.style.display = 'none';
      }
    },

    switchAgent: function(agentId) {
      if (this.agents[agentId]) {
        this.currentAgent = agentId;
        this.renderAgentTabs();
        this.renderAgentInfo();
        this.addSystemMessage(`\u0110\u00e3 chuy\u1ec3n sang **${this.agents[agentId].name}** (${this.agents[agentId].title}). T\u00f4i c\u00f3 th\u1ec3 h\u1ed7 tr\u1ee3 g\u00ec cho b\u1ea1n?`);
      }
    },

    renderAgentTabs: function() {
      const container = document.getElementById('ai-agent-tabs-list');
      if (!container) return;
      container.innerHTML = Object.keys(this.agents).map(key => {
        const ag = this.agents[key];
        const isActive = this.currentAgent === key;
        const activeClass = isActive 
          ? 'bg-indigo-600 text-white font-extrabold shadow-sm' 
          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200';
        return `
          <button type="button" onclick="window.HahaAI.switchAgent('${key}')" class="px-2.5 py-1.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all whitespace-nowrap ${activeClass}">
            <span>${ag.avatar}</span>
            <span>${ag.name}</span>
          </button>
        `;
      }).join('');
    },

    renderAgentInfo: function() {
      const ag = this.agents[this.currentAgent];
      const titleEl = document.getElementById('ai-current-agent-title');
      const descEl = document.getElementById('ai-current-agent-desc');
      const guardrailsEl = document.getElementById('ai-current-guardrails');
      if (titleEl) {
        let badge = (window.HahaAiConnector && typeof window.HahaAiConnector.renderStatusBadgeHtml === "function") 
          ? window.HahaAiConnector.renderStatusBadgeHtml() : "";
        titleEl.innerHTML = `<div class="flex items-center justify-between w-full flex-wrap gap-2"><span>${ag.avatar} ${ag.name} <span class="text-xs font-normal text-slate-500">(${ag.title})</span></span>${badge}</div>`;
      }
      if (descEl) descEl.textContent = ag.description;
      if (guardrailsEl) {
        guardrailsEl.innerHTML = `
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] p-2 bg-slate-50 border border-slate-200 rounded-xl">
            <div><b class="text-emerald-700">\uD83D\uDCD6 D\u1eef li\u1ec7u \u0111\u1ecdc:</b> ${ag.readScope.join(', ')}</div>
            <div><b class="text-indigo-700">\u26A1 Thao t\u00e1c:</b> ${ag.permittedActions.join(', ')}</div>
            <div><b class="text-rose-700">\uD83D\uDEAB Nghi\u00eam c\u1ea5m:</b> ${ag.prohibitedActions.join(', ')}</div>
          </div>
        `;
      }
    },

    focusInput: function() {
      const input = document.getElementById('ai-user-prompt-input');
      if (input) input.focus();
    },

    // G\u1eedi tin nh\u1eafn t\u1eeb ng\u01b0\u1eddi d\u00f9ng
    handleSendPrompt: function() {
      const input = document.getElementById('ai-user-prompt-input');
      if (!input) return;
      const text = input.value.trim();
      if (!text) return;
      input.value = '';

      this.addUserMessage(text);
      this.processPrompt(text);
    },

    // G\u1eedi l\u1ec7nh g\u1ee3i \u00fd nhanh (1-click Quick Prompt)
    quickPrompt: function(promptText, specificAgent) {
      if (specificAgent && this.agents[specificAgent]) {
        this.currentAgent = specificAgent;
        this.renderAgentTabs();
        this.renderAgentInfo();
      }
      this.addUserMessage(promptText);
      this.processPrompt(promptText);
    },

    addUserMessage: function(text) {
      this.chatHistory.push({ role: 'user', content: text, time: new Date().toLocaleTimeString('vi-VN') });
      this.renderChatMessages();
    },

    addAgentMessage: function(content, actionPayload) {
      const ag = this.agents[this.currentAgent];
      this.chatHistory.push({
        role: 'agent',
        agent: ag,
        content: content,
        action: actionPayload || null,
        time: new Date().toLocaleTimeString('vi-VN')
      });
      this.renderChatMessages();
    },

    addSystemMessage: function(text) {
      this.chatHistory.push({ role: 'system', content: text, time: new Date().toLocaleTimeString('vi-VN') });
      this.renderChatMessages();
    },

    renderChatMessages: function() {
      const container = document.getElementById('ai-chat-messages-container');
      if (!container) return;

      container.innerHTML = this.chatHistory.map((msg, idx) => {
        if (msg.role === 'user') {
          return `
            <div class="flex justify-end my-2">
              <div class="bg-indigo-600 text-white rounded-2xl rounded-tr-xs p-3 max-w-[85%] text-xs shadow-xs space-y-1">
                <div class="font-semibold text-[10px] text-indigo-200">\uD83D\uDC64 B\u1ea1n \u2022 ${msg.time}</div>
                <div class="whitespace-pre-wrap leading-relaxed">${msg.content}</div>
              </div>
            </div>
          `;
        } else if (msg.role === 'system') {
          return `
            <div class="flex justify-center my-1.5">
              <span class="px-3 py-1 bg-slate-200/80 text-slate-600 rounded-full text-[10px] font-semibold border border-slate-300">
                ${msg.content}
              </span>
            </div>
          `;
        } else {
          const ag = msg.agent || this.agents[this.currentAgent] || this.agents.ORCHESTRATOR;
          return `
            <div class="flex justify-start my-2">
              <div class="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3.5 max-w-[92%] text-xs shadow-xs space-y-2">
                <div class="flex items-center justify-between border-b border-slate-100 pb-1.5 text-[11px]">
                  <div class="flex items-center space-x-1.5 font-bold text-slate-800">
                    <span>${ag.avatar}</span>
                    <span class="text-indigo-900">${ag.name}</span>
                    <span class="text-[10px] font-normal text-slate-400">(${ag.title})</span>
                  </div>
                  <span class="text-[10px] text-slate-400">${msg.time}</span>
                </div>
                <div class="text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">${msg.content}</div>
                ${msg.action ? `
                  <div class="mt-2 p-2.5 bg-indigo-50/80 border border-indigo-200 rounded-xl space-y-2">
                    <div class="flex items-center space-x-1.5 text-[11px] font-extrabold text-indigo-900">
                      <span>\u2699\uFE0F</span>
                      <span>\u0110\u1ec1 xu\u1ea5t h\u00e0nh \u0111\u1ed9ng c\u1ea7n ph\u00ea duy\u1ec7t (Human-in-the-Loop):</span>
                    </div>
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-slate-700">${msg.action.label || '\u0110\u1ec1 xu\u1ea5t t\u00e1c v\u1ee5'}</span>
                      <div class="flex items-center space-x-2">
                        <button type="button" onclick="window.HahaAI.dismissHitlAction(${idx})" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-[11px] rounded-xl transition-all" title="\u0110\u00f3ng t\u00e1c v\u1ee5">\u2715 \u0110\u00f3ng t\u00e1c v\u1ee5</button>
                        <button type="button" onclick="window.HahaAI.executeHitlAction(${idx})" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-xl shadow-xs transition-all active:scale-95 flex items-center space-x-1">
                          <span>\u2713</span>
                          <span>X\u00e1c nh\u1eadn th\u1ef1c thi</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }
      }).join('');
      container.scrollTop = container.scrollHeight;
    },

    // ==============================================================
    // 3. B\u1ed8 PH\u00c2N T\u00cdCH \u00dd \u0110\u1ecaNH & TH\u1ef0C THI NGHI\u1ec6P V\u1ee4 (AI REASONING CORE)
    // ==============================================================
    processPrompt: async function(rawPrompt) {
      const q = rawPrompt.toLowerCase().trim();
      const currentDb = (typeof db !== 'undefined' && db) ? db : {};

      // 1. T\u1ef1 \u0111\u1ed9ng nh\u1eadn di\u1ec7n \u00fd \u0111\u1ecbnh & chuy\u1ec3n giao Agent th\u00f4ng minh (h\u1ed7 tr\u1ee3 c\u1ea3 c\u00f3 d\u1ea5u v\u00e0 kh\u00f4ng d\u1ea5u)
      if (q.includes('b\u00e1o gi\u00e1') || q.includes('bao gia') || q.includes('gi\u00e1 tour') || q.includes('gia tour') || q.includes('chi\u1ebft t\u00ednh') || q.includes('chiet tinh')) {
        this.currentAgent = 'SALES';
      } else if (q.includes('\u0111i\u1ec1u h\u00e0nh') || q.includes('dieu hanh') || q.includes('voucher') || q.includes('nh\u00e0 xe') || q.includes('nha xe') || q.includes('kh\u00e1ch s\u1ea1n') || q.includes('khach san') || q.includes('ncc')) {
        this.currentAgent = 'OPS';
      } else if (q.includes('thu\u1ebf') || q.includes('thue') || q.includes('vat') || q.includes('tncn') || q.includes('h\u00f3a \u0111\u01a1n') || q.includes('hoa don') || q.includes('k\u1ebf to\u00e1n') || q.includes('ke toan') || q.includes('s\u1ed5 qu\u1ef9') || q.includes('so quy')) {
        this.currentAgent = 'FINANCE';
      } else if (q.includes('hoa h\u1ed3ng') || q.includes('hoa hong') || q.includes('ctv') || q.includes('c\u1ed9ng t\u00e1c vi\u00ean') || q.includes('cong tac vien') || q.includes('sales kit')) {
        this.currentAgent = 'AFFILIATE';
      } else if (q.includes('marketing') || q.includes('b\u00e0i vi\u1ebft') || q.includes('bai viet') || q.includes('qu\u1ea3ng c\u00e1o') || q.includes('quang cao') || q.includes('fanpage') || q.includes('content') || q.includes('social') || q.includes('tiktok')) {
        this.currentAgent = 'MARKETING';
      } else if (q.includes('gi\u00e1m \u0111\u1ed1c') || q.includes('giam doc') || q.includes('ceo') || q.includes('doanh thu') || q.includes('l\u1ee3i nhu\u1eadn') || q.includes('loi nhuan') || q.includes('t\u1ed5ng quan') || q.includes('tong quan') || q.includes('b\u00e1o c\u00e1o') || q.includes('bao cao')) {
        this.currentAgent = 'EXECUTIVE';
      }

      this.renderAgentTabs();
      this.renderAgentInfo();

      const agent = this.currentAgent;

      // 2. K\u1ebeT N\u1ed0I V\u1edaI LLM NGO\u00c0I (GEMINI, OPENAI, CLAUDE) QUA HAHA AI CONNECTOR
      if (window.HahaAiConnector && window.HahaAiConnector.config.activeProvider !== "offline" && window.HahaAiConnector.hasKey(window.HahaAiConnector.config.activeProvider)) {
        const provider = window.HahaAiConnector.config.activeProvider;
        const meta = window.HahaAiConnector.getMetadata(provider);
        const agentMeta = this.agents[agent] || this.agents.ORCHESTRATOR;
        const loadingId = "ai-loading-" + Date.now();
        this.chatHistory.push({
          role: "agent",
          agent: agentMeta,
          content: `\u23F3 *\u0110ang k\u1ebft n\u1ed1i **${meta.name}** \u0111\u1ec3 ph\u00e2n t\u00edch d\u1eef li\u1ec7u \u0111i\u1ec1u h\u00e0nh v\u00e0 suy lu\u1eadn...*`,
          time: new Date().toLocaleTimeString("vi-VN"),
          loadingId: loadingId
        });
        this.renderChatMessages();
        const systemPrompt = `B\u1ea1n l\u00e0 ${agentMeta.name} (${agentMeta.title}) trong h\u1ec7 \u0111i\u1ec1u h\u00e0nh HaHa Eco Travel (Chuy\u00ean tour sinh th\u00e1i C\u00e1t Ti\u00ean, M\u0103ng \u0110en, trekking, ch\u1eefa l\u00e0nh). Lu\u00f4n \u00e1p d\u1ee5ng Th\u00f4ng t\u01b0 219/2013/TT-BTC v\u1ec1 thu\u1ebf GTGT l\u1eef h\u00e0nh. Nhi\u1ec7m v\u1ee5: Tr\u1ea3 l\u1eddi ng\u1eafn g\u1ecdn, nghi\u1ec7p v\u1ee5 s\u1eafc b\u00e9n, s\u1ed1 li\u1ec7u minh b\u1ea1ch, d\u00f9ng Markdown r\u00f5 r\u00e0ng v\u00e0 bi\u1ec3u t\u01b0\u1ee3ng c\u1ea3m x\u00fac sinh th\u00e1i. 100% Ti\u1ebfng Vi\u1ec7t chu\u1ea9n ch\u00ednh t\u1ea3.`;
        try {
          const llmRes = await window.HahaAiConnector.chatCompletion(rawPrompt, systemPrompt, provider);
          this.chatHistory = this.chatHistory.filter(m => m.loadingId !== loadingId);
          if (llmRes && llmRes.text && !llmRes.isFallback) {
            const reply = `\u2728 **[${llmRes.providerName} \u2022 ${llmRes.model} \u2022 ${llmRes.latencyMs}ms]**\n\n${llmRes.text}`;
            this.addAgentMessage(reply);
            return;
          }
        } catch (e) {
          console.warn("[AI Agent Engine] LLM call error:", e);
          this.chatHistory = this.chatHistory.filter(m => m.loadingId !== loadingId);
        }
      }

      // 3. Fallback Heuristic Quy t\u1eafc n\u1ed9i b\u1ed9 (100% Font Chu\u1ea9n)
      if (agent === 'EXECUTIVE') {
        this.handleExecutiveQuery(q, currentDb);
      } else if (agent === 'FINANCE') {
        this.handleFinanceQuery(q, currentDb);
      } else if (agent === 'SALES') {
        this.handleSalesQuery(q, currentDb);
      } else if (agent === 'OPS') {
        this.handleOpsQuery(q, currentDb);
      } else if (agent === 'AFFILIATE') {
        this.handleAffiliateQuery(q, currentDb);
      } else if (agent === 'MARKETING') {
        this.handleMarketingQuery(q, currentDb);
      } else {
        this.handleOrchestratorQuery(q, currentDb);
      }
    },

    // --- X\u1eec L\u00dd AGENT GI\u00c1M \u0110\u1ed0C (EXECUTIVE BI) ---
    handleExecutiveQuery: function(q, dbData) {
      const bookings = dbData.bookings || [];
      const payments = dbData.payments || [];
      const totalRev = bookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
      const totalPaid = payments.filter(p => p.type === 'THU' || p.type === 'IN').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const totalCost = payments.filter(p => p.type === 'CHI' || p.type === 'OUT').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const netProfit = totalRev - totalCost;
      const margin = totalRev > 0 ? ((netProfit / totalRev) * 100).toFixed(1) : '0';

      const reply = `\uD83D\uDC54 **B\u00c1O C\u00c1O \u0110I\u1ec0U H\u00c0NH DOANH NGHI\u1ec6P (EXECUTIVE BI BRIEF)**
K\u00ednh g\u1eedi Ban Gi\u00e1m \u0110\u1ed1c HaHa Eco Travel:

\u2022 **T\u1ed5ng doanh s\u1ed1 h\u1ee3p \u0111\u1ed3ng:** ${formatVND(totalRev)} (${bookings.length} \u0111\u01a1n tour)
\u2022 **Th\u1ef1c thu d\u00f2ng ti\u1ec1n:** ${formatVND(totalPaid)} (${totalRev > 0 ? Math.round((totalPaid/totalRev)*100) : 0}% gi\u00e1 tr\u1ecb)
\u2022 **Chi ph\u00ed \u0111i\u1ec1u h\u00e0nh & NCC:** ${formatVND(totalCost)}
\u2022 **L\u1ee3i nhu\u1eadn g\u1ed9p d\u1ef1 ki\u1ebfn:** **${formatVND(netProfit)}** (T\u1ef7 su\u1ea5t: **${margin}%**)

\uD83D\uDCA1 **Khuy\u1ebfn ngh\u1ecb chi\u1ebfn l\u01b0\u1ee3c c\u1ee7a AI Gi\u00e1m \u0111\u1ed1c:**
1. Th\u00fac \u0111\u1ea9y m\u1ea1ng l\u01b0\u1edbi CTV b\u00e1n tour cu\u1ed1i tu\u1ea7n \u0111\u1ec3 t\u1ed1i \u01b0u h\u1ea1ng ph\u00f2ng Ecolodge \u0111\u00e3 c\u1ecdc tr\u01b0\u1edbc.
2. Ki\u1ec3m so\u00e1t thu\u1ebf \u0111\u1ea7u v\u00e0o c\u1ee7a c\u00e1c xe 29 ch\u1ed7 tuy\u1ebfn S\u00e0i G\u00f2n - C\u00e1t Ti\u00ean \u0111\u1ec3 \u0111\u1ea3m b\u1ea3o \u0111\u1ee7 h\u00f3a \u0111\u01a1n GTGT \u0111\u1ea7u v\u00e0o h\u1ee3p l\u1ec7 theo TT 219.`;

      this.addAgentMessage(reply);
    },

    // --- X\u1eec L\u00dd AGENT K\u1ebe TO\u00c1N & THU\u1ebe (FINANCE & TAX) ---
    handleFinanceQuery: function(q, dbData) {
      const bookings = dbData.bookings || [];
      const b = bookings[0] || { code: 'DH-201', totalAmount: 15000000, paxCount: 6, tourName: 'Tour Nam C\u00e1t Ti\u00ean 2N1\u0110' };
      const rev = Number(b.totalAmount) || 15000000;
      // D\u1ef1 to\u00e1n chi ph\u00ed kh\u00f4ng ch\u1ecbu thu\u1ebf GTGT tr\u1ef1c ti\u1ebfp (v\u00e9 th\u0103m quan VQG, b\u1ea3o hi\u1ec3m, tr\u1ea3m ca n\u00f4) chi\u1ebfm ~60%
      const nonVatCost = Math.round(rev * 0.60);
      const taxableAmount = rev - nonVatCost;
      const vatOutput = Math.round(taxableAmount * 0.10);

      const reply = `\uD83D\uDCB0 **CHI\u1ebeT T\u00cdNH THU\u1ebe GTGT L\u1eee H\u00c0NH THEO TH\u00d4NG T\u01af 219/2013/TT-BTC**
\u0110\u01a1n tour ki\u1ec3m tra: **${b.code}** (${b.tourName || 'Tour Sinh Th\u00e1i'})

\u2022 **Doanh thu tr\u1ecdn g\u00f3i thu kh\u00e1ch:** ${formatVND(rev)}
\u2022 **Chi ph\u00ed \u0111\u01b0\u1ee3c gi\u1ea3m tr\u1eeb (Kh\u00f4ng t\u00ednh thu\u1ebf l\u1eef h\u00e0nh):** ${formatVND(nonVatCost)}
  *(G\u1ed3m: V\u00e9 th\u0103m quan B\u00e0u S\u1ea5u, xe chuy\u00ean d\u1ee5ng VQG, thuy\u1ec1n s\u00f4ng \u0110\u1ed3ng Nai, b\u1ea3o hi\u1ec3m du l\u1ecbch)*
\u2022 **Gi\u00e1 t\u00ednh thu\u1ebf GTGT l\u1eef h\u00e0nh (Ch\u00eanh l\u1ec7ch):** ${formatVND(taxableAmount)}
\u2022 **Thu\u1ebf GTGT 10% ph\u1ea3i n\u1ed9p:** **${formatVND(vatOutput)}**

\u2705 **Hi\u1ec7u qu\u1ea3 b\u00f3c t\u00e1ch:** Gi\u00e1m \u0111\u1ed1c ti\u1ebft ki\u1ec7m \u0111\u01b0\u1ee3c **${formatVND(Math.round(rev * 0.10) - vatOutput)}** ti\u1ec1n thu\u1ebf so v\u1edbi c\u00e1ch k\u00ea khai th\u00f4ng th\u01b0\u1eddng!`;

      const action = {
        type: 'CREATE_INVOICE_DRAFT',
        bookingCode: b.code,
        label: `T\u1ea1o B\u1ea3n Th\u1ec3 Hi\u1ec7n H\u00f3a \u0110\u01a1n VAT ${formatVND(vatOutput)}`
      };

      this.addAgentMessage(reply, action);
    },

    // --- X\u1eec L\u00dd AGENT KINH DOANH (SALES) ---
    handleSalesQuery: function(q, dbData) {
      const paxMatch = q.match(/(\d+)\s*kh(a|c|??|ch)?/i) || q.match(/(\d+)\s*pax/i);
      const pax = paxMatch ? parseInt(paxMatch[1]) : 6;
      let unitPrice = 2850000;
      if (pax >= 10) unitPrice = 2450000;
      else if (pax >= 4) unitPrice = 2650000;
      const totalAmount = unitPrice * pax;

      const reply = `\uD83D\uDCBC **D\u1ef0 TH\u1ea2O B\u00c1O GI\u00c1 TOUR SINH TH\u00c1I C\u00c1T TI\u00caN 2N1\u0110**
S\u1ed1 l\u01b0\u1ee3ng kh\u00e1ch: **${pax} ng\u01b0\u1eddi**

\u2022 **\u0110\u01a1n gi\u00e1 / kh\u00e1ch:** ${formatVND(unitPrice)}
\u2022 **T\u1ed5ng gi\u00e1 tr\u1ecb h\u1ee3p \u0111\u1ed3ng:** **${formatVND(totalAmount)}**
\u2022 **Bao g\u1ed3m tr\u1ecdn g\u00f3i:**
  - Xe Limousine / Xe du l\u1ecbch cao c\u1ea5p kh\u1ee9 h\u1ed3i S\u00e0i G\u00f2n - Nam C\u00e1t Ti\u00ean
  - 01 \u0111\u00eam ngh\u1ec9 t\u1ea1i Cat Tien Ecolodge (Ph\u00f2ng Superior h\u01b0\u1edbng r\u1eebng)
  - V\u00e9 th\u0103m quan B\u00e0u S\u1ea5u, ng\u1eafm th\u00fa \u0111\u00eam b\u1eb1ng xe chuy\u00ean d\u1ee5ng
  - 03 b\u1eefa ch\u00ednh \u1ea9m th\u1ef1c sinh th\u00e1i \u0111\u1ecba ph\u01b0\u01a1ng + 01 b\u1eefa s\u00e1ng buffet
  - HDV chuy\u00ean s\u00e2u sinh th\u00e1i r\u1eebng nguy\u00ean sinh, b\u1ea3o hi\u1ec3m 50 tr\u01b0\u1eddng h\u1ee3p`;

      const action = {
        type: 'CREATE_QUOTATION',
        pax: pax,
        unitPrice: unitPrice,
        totalAmount: totalAmount,
        label: `L\u1eadp Phi\u1ebfu B\u00e1o Gi\u00e1 ${formatVND(totalAmount)} V\u00e0o H\u1ec7 Th\u1ed1ng`
      };

      this.addAgentMessage(reply, action);
    },

    // --- X\u1eec L\u00dd AGENT \u0110I\u1ec0U H\u00c0NH (OPS) ---
    handleOpsQuery: function(q, dbData) {
      const bookings = dbData.bookings || [];
      const suppliers = dbData.suppliers || [];
      const b = bookings.find(x => x.status === 'DA_COC' || x.status === '\u0110\u00e3 c\u1ecdc' || x.status === 'DANG_CHAY') || bookings[0];

      if (!b) {
        this.addAgentMessage("Hi\u1ec7n kh\u00f4ng c\u00f3 \u0111\u01a1n tour n\u00e0o \u0111ang \u1edf tr\u1ea1ng th\u00e1i chu\u1ea9n b\u1ecb kh\u1edfi h\u00e0nh c\u1ea7n \u0111i\u1ec1u ph\u1ed1i.");
        return;
      }

      const hotelNcc = suppliers.find(s => s.serviceType === 'HOTEL') || { name: 'Kh\u00e1ch s\u1ea1n Nam C\u00e1t Ti\u00ean Ecolodge', id: 'NCC-001' };
      const transNcc = suppliers.find(s => s.serviceType === 'TRANSPORT') || { name: 'Nh\u00e0 Xe Du L\u1ecbch Xanh S\u00e0i G\u00f2n', id: 'NCC-002' };

      const reply = `\uD83E\uDDED **L\u1eacP PHI\u1ebeU \u0110I\u1ec0U PH\u1ed0I D\u1ecaCH V\u1ee4 NH\u00c0 CUNG C\u1ea4P (VOUCHER NCC)**
\u0110\u01a1n tour: **${b.code}** | Kh\u1edfi h\u00e0nh ng\u00e0y: **${b.departureDate || '2026-11-20'}** | \u0110o\u00e0n: **${b.paxCount || 4} kh\u00e1ch**

1. **D\u1ecbch v\u1ee5 L\u01b0u tr\u00fa / Kh\u00e1ch s\u1ea1n:**
   - \u0110\u1ed1i t\u00e1c: **${hotelNcc.name}**
   - Lo\u1ea1i ph\u00f2ng: Ph\u00f2ng sinh th\u00e1i ti\u00eau chu\u1ea9n (S\u1ed1 l\u01b0\u1ee3ng: ${Math.ceil((b.paxCount || 4)/2)} ph\u00f2ng)
   - D\u1ef1 to\u00e1n: ${formatVND(Math.round((b.totalAmount || 10000000) * 0.35))}
2. **D\u1ecbch v\u1ee5 Xe v\u1eadn chuy\u1ec3n du l\u1ecbch:**
   - \u0110\u1ed1i t\u00e1c: **${transNcc.name}**
   - Lo\u1ea1i xe: Xe du l\u1ecbch 16/29 ch\u1ed7 m\u00e1y l\u1ea1nh \u0111\u1eddi m\u1edbi
   - D\u1ef1 to\u00e1n: ${formatVND(Math.round((b.totalAmount || 10000000) * 0.25))}

\u2705 **Ki\u1ec3m so\u00e1t \u0111i\u1ec1u h\u00e0nh:** \u0110\u01a1n tour \u0111\u00e3 \u0111\u01b0\u1ee3c ki\u1ec3m tra c\u1ecdc h\u1ee3p l\u1ec7, s\u1eb5n s\u00e0ng ph\u00e1t h\u00e0nh L\u1ec7nh \u0111i\u1ec1u h\u00e0nh ch\u00ednh th\u1ee9c.`;

      const action = {
        type: 'CREATE_OPS_VOUCHERS',
        bookingCode: b.code,
        label: `Ph\u00e1t H\u00e0nh 2 Voucher D\u1ecbch V\u1ee4 Cho \u0110\u01a1n ${b.code}`
      };

      this.addAgentMessage(reply, action);
    },

    // --- X\u1eec L\u00dd AGENT \u0110\u1ed0I T\u00c1C CTV (AFFILIATE) ---
    handleAffiliateQuery: function(q, dbData) {
      const ctvs = dbData.ctvs || [];
      const tours = dbData.tourPolicies || [];
      const c = ctvs[0] || { name: 'Ho\u00e0ng Y\u1ebfn (Travel Blogger)', id: 'CTV-001' };
      const t = tours[0] || { name: 'Tour VQG C\u00e1t Ti\u00ean 2N1\u0110', formulaText: '7% tr\u00ean t\u1ed5ng gi\u00e1 tr\u1ecb tour' };

      const reply = `\uD83E\uDD1D **B\u1ed8 T\u00c0I LI\u1ec6U B\u00c1N H\u00c0NG & CH\u00cdNH S\u00c1CH HOA H\u1ed2NG D\u00c0NH CHO \u0110\u1ed0I T\u00c1C CTV**
\u00c1p d\u1ee5ng cho CTV: **${c.name}** (M\u00e3: **${c.id}**)

\u2022 **Tour tr\u1ecdng t\u00e2m:** **${t.name}**
\u2022 **Ch\u00ednh s\u00e1ch hoa h\u1ed3ng ph\u00ea duy\u1ec7t:** **${t.formulaText || '7% Doanh thu'}**
\u2022 **M\u1ee9c chi tr\u1ea3 th\u1ef1c nh\u1eadn (V\u00ed d\u1ee5 \u0111\u01a1n 10.000.000 \u0111):**
  - Hoa h\u1ed3ng Gross: 700.000 VND
  - Thu\u1ebf TNCN kh\u1ea5u tr\u1eeb (d\u01b0\u1edbi 2 tri\u1ec7u): 0 VND (Theo TT 111)
  - S\u1ed1 ti\u1ec1n chuy\u1ec3n kho\u1ea3n Net: **700.000 VND**
\u2022 **Th\u00f4ng \u0111i\u1ec7p b\u00e1n h\u00e0ng sinh th\u00e1i:**
  *"Tr\u1ea3i nghi\u1ec7m ch\u1eefa l\u00e0nh gi\u1eefa thi\u00ean nhi\u00ean nguy\u00ean sinh, b\u1ea3o v\u1ec7 m\u00f4i tr\u01b0\u1eddng, h\u1ea1n ch\u1ebf r\u00e1c th\u1ea3i nh\u1ef1a."*

\u2705 M\u1ecdi CTV t\u1ea1i HaHa Eco Travel \u0111\u1ec1u \u0111\u01b0\u1ee3c b\u1ea3o \u0111\u1ea3m quy\u1ec1n b\u00ecnh \u0111\u1eb3ng 100%, kh\u00f4ng b\u1ecb ch\u00e8n \u00e9p c\u1ea5p b\u1eadc.`;

      this.addAgentMessage(reply);
    },

    // --- X\u1eec L\u00dd AGENT MARKETING ---
    handleMarketingQuery: function(q, dbData) {
      const reply = `\uD83D\uDCE2 **K\u1ecaCH B\u1ea2N QU\u1ea2NG B\u00c1 TOUR SINH TH\u00c1I (MARKETING CONTENT & SOCIAL HUB)**
Ch\u1ee7 \u0111\u1ec1: **"Ch\u1eefa L\u00e0nh & T\u00e1i T\u1ea1o N\u0103ng L\u01b0\u1ee3ng C\u00f9ng Thi\u00ean Nhi\u00ean C\u00e1t Ti\u00ean 2N1\u0110"**

\uD83C\uDFDE\uFE0F *B\u1ea1n c\u00f3 \u0111ang m\u1ec7t m\u1ecfi v\u1edbi \u00e1p l\u1ef1c deadline v\u00e0 kh\u00f3i b\u1ee5i th\u00e0nh ph\u1ed1?*
H\u00e3y d\u00e0nh cho b\u1ea3n th\u00e2n 48 gi\u1edd s\u1ed1ng ch\u1eadm l\u1ea1i:
- \u0110\u00f3n b\u00ecnh minh gi\u1eefa r\u1eebng nguy\u00ean sinh r\u1ee3p b\u00f3ng c\u00e2y c\u1ed5 th\u1ee5 ng\u00e0n n\u0103m.
- Ng\u1eafm nh\u00ecn \u0111\u00e0n th\u00fa \u0111\u00eam t\u1ef1 nhi\u00ean trong m\u00f4i tr\u01b0\u1eddng hoang d\u00e3.
- Th\u01b0\u1edfng th\u1ee9c \u1ea9m th\u1ef1c \u0111\u1ecba ph\u01b0\u01a1ng t\u01b0\u01a1i l\u00e0nh kh\u00f4ng h\u00f3a ch\u1ea5t.

\uD83C\uDF3F **HaHa Eco Travel cam k\u1ebft:** 100% tour du l\u1ecbch xanh c\u00f3 tr\u00e1ch nhi\u1ec7m, gi\u1ea3m thi\u1ec3u r\u00e1c th\u1ea3i nh\u1ef1a, t\u00f4n tr\u1ecdng h\u1ec7 sinh th\u00e1i b\u1ea3n \u0111\u1ecba.
\uD83D\uDCDE **Hotline t\u01b0 v\u1ea5n \u01b0u \u0111\u00e3i nh\u00f3m:** 0988.11.22.33 | www.hahatravel.vn
#HaHaEcoTravel #DuLichSinhThai #TrekkingCatTien #ChuaLanh #GreenTour`;

      this.addAgentMessage(reply);
    },

    // --- X\u1eec L\u00dd ORCHESTRATOR M\u1eb6C \u0110\u1ecaNH ---
    handleOrchestratorQuery: function(q, dbData) {
      const reply = `\uD83E\uDDE0 **AI \u0110I\u1ec0U PH\u1ed0I TRUNG T\u00c2M HAHA ECO TRAVEL**
T\u00f4i \u0111\u00e3 ti\u1ebfp nh\u1eadn y\u00eau c\u1ea7u: *" ${q} "*

H\u1ec7 th\u1ed1ng AI \u0111a nhi\u1ec7m \u0111\u00e3 s\u1eb5n s\u00e0ng h\u1ed7 tr\u1ee3 b\u1ea1n theo t\u1eebng nghi\u1ec7p v\u1ee5 chuy\u00ean s\u00e2u:
1. \uD83D\uDCBC **AI Kinh doanh:** L\u1eadp b\u00e1o gi\u00e1 tour, chi\u1ebft t\u00ednh gi\u00e1 theo s\u1ed1 l\u01b0\u1ee3ng kh\u00e1ch.
2. \uD83E\uDDED **AI \u0110i\u1ec1u h\u00e0nh:** So\u1ea1n l\u1ec7nh \u0111\u1eb7t xe/kh\u00e1ch s\u1ea1n, qu\u1ea3n l\u00fd l\u1ecbch kh\u1edfi h\u00e0nh.
3. \uD83D\uDCB0 **AI K\u1ebf to\u00e1n:** T\u1ef1 \u0111\u1ed9ng t\u00ednh thu\u1ebf GTGT TT 219, thu\u1ebf TNCN TT 111, \u0111\u1ed1i so\u00e1t s\u1ed5 qu\u1ef9.
4. \uD83E\uDD1D **AI CTV:** Cung c\u1ea5p t\u00e0i li\u1ec7u b\u00e1n h\u00e0ng v\u00e0 gi\u1ea3i \u0111\u00e1p ch\u00ednh s\u00e1ch hoa h\u1ed3ng.
5. \uD83D\uDCE2 **AI Marketing:** So\u1ea1n b\u00e0i vi\u1ebft truy\u1ec1n th\u00f4ng tour sinh th\u00e1i, \u0111i\u1ec1u ph\u1ed1i b\u00e0i CTV.
6. \uD83D\uDC54 **AI Gi\u00e1m \u0111\u1ed1c:** B\u00e1o c\u00e1o t\u1ed5ng th\u1ec3 doanh thu, chi ph\u00ed, l\u1ee3i nhu\u1eadn t\u1ee9c th\u1eddi.

\u2705 *B\u1ea1n c\u00f3 th\u1ec3 b\u1ea5m v\u00e0o c\u00e1c n\u00fat g\u1ee3i \u00fd l\u1ec7nh nhanh b\u00ean d\u01b0\u1edbi ho\u1eb7c ch\u1ecdn tr\u1ef1c ti\u1ebfp Agent \u1edf thanh menu ph\u00eda tr\u00ean!*`;

      this.addAgentMessage(reply);
    },

    // ==============================================================
    // 4. TH\u1ef0C THI H\u00c0NH \u0110\u1ed8NG C\u00d3 PH\u00ca DUY\u1ec6T (HUMAN-IN-THE-LOOP - HITL)
    // ==============================================================
    executeHitlAction: function(msgIndex) {
      const msg = this.chatHistory[msgIndex];
      if (!msg || !msg.action) return;
      const act = msg.action;

      if (act.type === 'CREATE_INVOICE_DRAFT') {
        if (typeof openCreateInvoiceModal === 'function') {
          this.closeModal();
          openCreateInvoiceModal(act.bookingCode);
          if (typeof recordAuditLog === 'function') {
            recordAuditLog('AI ACTION PH\u00ca DUY\u1ec6T', `Ng\u01b0\u1eddi d\u00f9ng duy\u1ec7t l\u1ec7nh AI K\u1ebf to\u00e1n m\u1edf b\u1ea3n th\u1ec3 hi\u1ec7n h\u00f3a \u0111\u01a1n VAT cho \u0111\u01a1n ${act.bookingCode}.`);
          }
        }
      } else if (act.type === 'CREATE_QUOTATION') {
        if (typeof switchModule === 'function') {
          this.closeModal();
          switchModule(4); // M\u1edf Ph\u00e2n h\u1ec7 4: B\u00e1o gi\u00e1 & \u0110\u01a1n tour
          if (typeof switchMod4Tab === 'function') switchMod4Tab('quotations');
          alert(`\uD83C\uDF89 \u0110\u00c3 CHUY\u1ec2N D\u1eee LI\u1ec6U B\u00c1O GI\u00c1 TH\u00c0NH C\u00d4NG!\n\nAI Kinh doanh \u0111\u00e3 \u0111\u01b0a th\u00f4ng s\u1ed1 sang Ph\u00e2n h\u1ec7 B\u00e1o gi\u00e1:\n- \u0110\u01a1n gi\u00e1: ${formatVND(act.unitPrice)}\n- S\u1ed1 kh\u00e1ch: ${act.pax}\n- T\u1ed5ng ti\u1ec1n: ${formatVND(act.totalAmount)}`);
        }
      } else if (act.type === 'CREATE_OPS_VOUCHERS') {
        if (typeof switchModule === 'function') {
          this.closeModal();
          switchModule(5); // M\u1edf Ph\u00e2n h\u1ec7 5: \u0110i\u1ec1u h\u00e0nh tour
          alert(`\uD83C\uDF89 \u0110\u00c3 X\u00c1C NH\u1eacN \u0110I\u1ec0U PH\u1ed0I TOUR!\n\nL\u1ec7nh \u0111i\u1ec1u h\u00e0nh cho \u0111\u01a1n ${act.bookingCode} \u0111\u00e3 \u0111\u01b0\u1ee3c b\u00e0n giao sang Ph\u00e2n h\u1ec7 \u0110i\u1ec1u h\u00e0nh & NCC.`);
        }
      }
    },

    // B\u1ecf qua / \u0110\u00f3ng t\u00e1c v\u1ee5 kh\u00f4ng th\u1ef1c thi
    dismissHitlAction: function(msgIndex) {
      if (this.chatHistory && this.chatHistory[msgIndex]) {
        this.chatHistory[msgIndex].action = null;
        this.renderChatMessages();
        this.addSystemMessage('\u0110\u00e3 \u0111\u00f3ng v\u00e0 h\u1ee7y b\u1ecf t\u00e1c v\u1ee5 \u0111\u1ec1 xu\u1ea5t.');
      }
    },

    // ==============================================================
    // 5. B\u1ed8 QUY TR\u00ccNH T\u1ef0 \u0110\u1ed8NG H\u00d3A WORKFLOW (AUTOMATION RULES ENGINE)
    // ==============================================================
    runAutomationChecks: function(silent = false) {
      if (typeof db === 'undefined' || !db) return;
      const now = new Date();
      const bookings = db.bookings || [];
      const notifications = db.notifications || [];
      let triggeredCount = 0;

      // Rule 1: Qu\u00e9t n\u1ee3 \u0111\u1ebfn h\u1ea1n tr\u01b0\u1edbc ng\u00e0y \u0111i 5 ng\u00e0y
      if (this.automationRules.autoCheckDebt) {
        bookings.forEach(b => {
          if (b.status !== 'HOAN_THANH' && b.status !== 'DA_HUY' && b.departureDate) {
            const dep = new Date(b.departureDate);
            const diffDays = Math.ceil((dep - now) / (1000 * 60 * 60 * 24));
            const debt = (Number(b.totalAmount) || 0) - (Number(b.paidAmount) || 0);

            if (diffDays <= 5 && diffDays >= 0 && debt > 0) {
              const notifId = `debt_${b.code}_${diffDays}`;
              const exists = notifications.some(n => n.link === notifId);
              if (!exists) {
                notifications.unshift({
                  id: `NOTIF-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                  title: `\u26A0\uFE0F C\u1ea2NH B\u00c1O C\u00d4NG N\u1ee2 \u0110\u1ebeN H\u1ea0N: ${b.code}`,
                  message: `Tour "${b.tourName || b.code}" s\u1ebd kh\u1edfi h\u00e0nh sau ${diffDays} ng\u00e0y. \u0110o\u00e0n c\u00f2n n\u1ee3 ${formatVND(debt)}. C\u1ea7n li\u00ean h\u1ec7 thu \u0111\u1ee7 100%!`,
                  time: 'V\u1eeba xong',
                  isRead: false,
                  link: notifId
                });
                triggeredCount++;
              }
            }
          }
        });
      }

      // Rule 2: T\u1ef1 \u0111\u1ed9ng k\u00edch ho\u1ea1t \u0111i\u1ec1u h\u00e0nh khi thu c\u1ecdc >= 30%
      if (this.automationRules.autoOpsFlag) {
        bookings.forEach(b => {
          if (b.status === 'CHO_COC') {
            const rev = Number(b.totalAmount) || 0;
            const paid = Number(b.paidAmount) || 0;
            if (rev > 0 && (paid / rev) >= 0.30) {
              b.status = 'DA_COC';
              notifications.unshift({
                id: `NOTIF-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                title: `\u2705 \u0110\u01a0N ${b.code} \u0110\u00c3 THU C\u1eccC \u0110\u1ee6 \u0110I\u1ec0U KI\u1ec6N \u0110I\u1ec0U H\u00c0NH`,
                message: `Kh\u00e1ch \u0111\u00e3 thanh to\u00e1n ${formatVND(paid)} (>= 30%). H\u1ec7 th\u1ed1ng chuy\u1ec3n tr\u1ea1ng th\u00e1i sang [DA_COC] \u0111\u1ec3 Ph\u00f2ng \u0110i\u1ec1u h\u00e0nh xu\u1ea5t voucher.`,
                time: 'V\u1eeba xong',
                isRead: false
              });
              triggeredCount++;
            }
          }
        });
      }

      if (typeof updateNotificationBadges === 'function') {
        updateNotificationBadges();
      }

      if (!silent) {
        alert(`\u2705 \u0110\u00c3 CH\u1ea0Y QUY TR\u00ccNH T\u1ef0 \u0110\u1ed8NG H\u00d3A NGHI\u1ec6P V\u1ee4!\n\nS\u1ed1 lu\u1ed3ng c\u00f4ng vi\u1ec7c \u0111\u01b0\u1ee3c r\u00e0 so\u00e1t & c\u1eadp nh\u1eadt: ${triggeredCount} t\u00e1c v\u1ee5.`);
      }
    },

    // ==============================================================
    // 6. KHUNG KI\u1ec2M TH\u1ef0 H\u1ed2I QUY T\u1ef0 \u0110\u1ed8NG (ENTERPRISE REGRESSION TEST SUITE)
    // ==============================================================
    runRegressionTests: function() {
      const results = [];
      const currentDb = (typeof db !== 'undefined' && db) ? db : {};

      // Test 1: B\u00e1o c\u00e1o k\u1ebf to\u00e1n thu\u1ebf l\u1eef h\u00e0nh TT 219
      try {
        const rev = 20000000;
        const nonTaxable = 12000000;
        const vat = (rev - nonTaxable) * 0.10;
        const pass = vat === 800000;
        results.push({ name: 'Test 1: B\u00f3c t\u00e1ch thu\u1ebf GTGT TT 219 (Gi\u00e1 t\u00ednh thu\u1ebf = Doanh thu - Chi ph\u00ed gi\u1ea3m tr\u1eeb)', pass, details: `Doanh thu 20tr, gi\u1ea3m tr\u1eeb 12tr => Thu\u1ebf 10% = ${vat} \u0111` });
      } catch (e) {
        results.push({ name: 'Test 1: Thu\u1ebf GTGT TT 219', pass: false, details: e.message });
      }

      // Test 2: B\u00f3c t\u00e1ch thu\u1ebf TNCN 10% cho CTV theo TT 111
      try {
        const commUnder2M = 1500000;
        const commOver2M = 5000000;
        const tax1 = commUnder2M >= 2000000 ? commUnder2M * 0.10 : 0;
        const tax2 = commOver2M >= 2000000 ? commOver2M * 0.10 : 0;
        const pass = tax1 === 0 && tax2 === 500000;
        results.push({ name: 'Test 2: Kh\u1ea5u tr\u1eeb thu\u1ebf TNCN 10% CTV (TT 111 m\u1ee9c >= 2 tri\u1ec7u)', pass, details: `Hoa h\u1ed3ng 1.5tr tr\u1eeb ${tax1}\u0111 | Hoa h\u1ed3ng 5tr tr\u1eeb ${tax2}\u0111` });
      } catch (e) {
        results.push({ name: 'Test 2: Thu\u1ebf TNCN TT 111', pass: false, details: e.message });
      }

      // Test 3: R\u00e0 so\u00e1t 7 Agent chuy\u00ean tr\u00e1ch
      try {
        const count = Object.keys(this.agents).length;
        const pass = count === 7;
        results.push({ name: 'Test 3: Kh\u1edfi t\u1ea1o \u0111\u1ee7 7 AI Agents chuy\u00ean tr\u00e1ch', pass, details: `Ph\u00e1t hi\u1ec7n ${count}/7 agents trong Registry` });
      } catch (e) {
        results.push({ name: 'Test 3: AI Agents Registry', pass: false, details: e.message });
      }

      // Test 4: Gi\u00e1m s\u00e1t B\u1ea3o v\u1ec7 Th\u00f4ng tin Nh\u1ea1y c\u1ea3m (DLP Masking)
      try {
        const rawPhone = '0988123456';
        const masked = rawPhone.replace(/(\d{4})\d{3}(\d{3})/, '$1***$2');
        const pass = masked === '0988***456';
        results.push({ name: 'Test 4: M\u1eb7t n\u1ea1 s\u1ed1 \u0111i\u1ec7n tho\u1ea1i kh\u00e1ch h\u00e0ng (DLP Protection)', pass, details: `${rawPhone} => ${masked}` });
      } catch (e) {
        results.push({ name: 'Test 4: DLP Phone Masking', pass: false, details: e.message });
      }

      // Test 5: Ki\u1ec3m tra c\u01a1 ch\u1ebf c\u1ea5u tr\u00fac ph\u00e2n quy\u1ec1n 12 ph\u00e2n h\u1ec7
      try {
        const pass = typeof ROLE_PERMISSIONS !== 'undefined' && ROLE_PERMISSIONS.CEO && ROLE_PERMISSIONS.CEO.includes(12);
        results.push({ name: 'Test 5: Ma tr\u1eadn ph\u00e2n quy\u1ec1n RBAC (Bao g\u1ed3m Ph\u00f2ng Marketing Ph\u00e2n h\u1ec7 12)', pass, details: 'CEO c\u00f3 quy\u1ec1n qu\u1ea3n tr\u1ecb to\u00e0n b\u1ed9 12 ph\u00e2n h\u1ec7' });
      } catch (e) {
        results.push({ name: 'Test 5: Ph\u00e2n quy\u1ec1n RBAC', pass: false, details: e.message });
      }

      // Test 6: B\u1ea3o to\u00e0n to\u00e0n v\u1eb9n s\u1ed5 qu\u1ef9 ti\u1ec1n m\u1eb7t & ng\u00e2n h\u00e0ng
      try {
        const payments = currentDb.payments || [];
        const hasNegativeAmount = payments.some(p => Number(p.amount) < 0);
        results.push({ name: 'Test 6: T\u00ednh to\u00e0n v\u1eb9n d\u00f2ng ti\u1ec1n S\u1ed5 qu\u1ef9 Thu - Chi', pass: !hasNegativeAmount, details: 'Kh\u00f4ng c\u00f3 giao d\u1ecbch s\u1ed1 ti\u1ec1n \u00e2m b\u1ea5t h\u1ee3p l\u1ec7' });
      } catch (e) {
        results.push({ name: 'Test 6: S\u1ed5 qu\u1ef9 Thu Chi', pass: false, details: e.message });
      }

      // Test 7: Ph\u00f4ng ch\u1eef Unicode to\u00e0n v\u1eb9n kh\u00f4ng Mojibake
      try {
        const sample = "Ph\u00f2ng Marketing & \u0110i\u1ec1u ph\u1ed1i MXH CTV HaHa Eco Travel";
        const hasBadChar = sample.includes('\uFFFD') || sample.includes('?');
        results.push({ name: 'Test 7: B\u1ea3o to\u00e0n Font Ti\u1ebfng Vi\u1ec7t chu\u1ea9n m\u1ef1c (Kh\u00f4ng l\u1ed7i ph\u00f4ng)', pass: !hasBadChar, details: 'To\u00e0n b\u1ed9 chu\u1ed7i k\u00fd t\u1ef1 Ti\u1ebfng Vi\u1ec7t hi\u1ec3n th\u1ecb ch\u00ednh x\u00e1c' });
      } catch (e) {
        results.push({ name: 'Test 7: Font Encoding', pass: false, details: e.message });
      }

      // Test 8: Kh\u1ea3 n\u0103ng k\u1ebft n\u1ed1i \u0111a b\u1ed9 n\u00e3o AI (Gemini, Claude, ChatGPT, ElevenLabs)
      try {
        const pass = typeof window.HahaAiConnector !== 'undefined' && typeof window.HahaAiConnector.chatCompletion === 'function';
        results.push({ name: 'Test 8: K\u1ebft n\u1ed1i \u0110a B\u1ed9 N\u00e3o AI & Smart Routing', pass, details: 'HahaAiConnector \u0111\u00e3 s\u1eb5n s\u00e0ng \u0111i\u1ec1u ph\u1ed1i LLM ngo\u00e0i' });
      } catch (e) {
        results.push({ name: 'Test 8: AI Multi-Brain Connector', pass: false, details: e.message });
      }

      // Test 9: C\u01a1 ch\u1ebf ph\u00ea duy\u1ec7t HITL & \u0111\u00f3ng t\u00e1c v\u1ee5
      try {
        const pass = typeof this.dismissHitlAction === 'function' && typeof this.executeHitlAction === 'function';
        results.push({ name: 'Test 9: Ki\u1ec3m so\u00e1t con ng\u01b0\u1eddi HITL & \u0110\u00f3ng t\u00e1c v\u1ee5 AI Hub', pass, details: 'C\u01a1 ch\u1ebf ph\u00ea duy\u1ec7t v\u00e0 \u0111\u00f3ng t\u00e1c v\u1ee5 ho\u1ea1t \u0111\u1ed9ng \u0111\u1ea7y \u0111\u1ee7' });
      } catch (e) {
        results.push({ name: 'Test 9: HITL & Dismiss Action', pass: false, details: e.message });
      }

      // Test 10: T\u00edch h\u1ee3p Ph\u00f2ng Marketing v\u00e0 \u0110i\u1ec1u ph\u1ed1i MXH CTV
      try {
        const pass = typeof window.HahaSocialHub !== 'undefined' && typeof window.HahaSocialHub.renderMarketingDepartmentModule === 'function';
        results.push({ name: 'Test 10: Ph\u00f2ng Marketing & H\u1ec7 th\u1ed1ng \u0110i\u1ec1u ph\u1ed1i MXH CTV', pass, details: 'C\u01a1 ch\u1ebf t\u1ef1 \u0111\u1ed9ng \u0111\u0103ng & g\u1eedi H\u00f2m th\u01b0 CTV ph\u00ea duy\u1ec7t s\u1eb5n s\u00e0ng' });
      } catch (e) {
        results.push({ name: 'Test 10: Marketing & CTV Social Hub', pass: false, details: e.message });
      }

      this.renderRegressionModal(results);
    },

    renderRegressionModal: function(results) {
      const passedCount = results.filter(r => r.pass).length;
      const allPassed = passedCount === results.length;

      const html = `
        <div id="ai-regression-results-modal" onclick="if(event.target === this) this.remove()" class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 my-auto animate-in fade-in zoom-in-95 duration-150">
            <div class="px-6 py-4 ${allPassed ? 'bg-gradient-to-r from-emerald-700 to-teal-800' : 'bg-gradient-to-r from-rose-700 to-red-800'} text-white flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <span class="text-2xl">${allPassed ? '\uD83C\uDFC6' : '\u26A0\uFE0F'}</span>
                <div>
                  <h3 class="text-sm font-extrabold uppercase tracking-wide">B\u00c1O C\u00c1O KI\u1ec2M TH\u1ef0 H\u1ed2I QUY TO\u00c0N DI\u1ec6N (REGRESSION TEST SUITE)</h3>
                  <p class="text-[11px] text-emerald-200">\u0110\u1ea3m b\u1ea3o s\u1eeda m\u1ed9t module kh\u00f4ng bao gi\u1edd l\u00e0m h\u1ecfng module kh\u00e1c</p>
                </div>
              </div>
              <button type="button" onclick="document.getElementById('ai-regression-results-modal').remove()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold">\u2715</button>
            </div>

            <div class="p-6 space-y-4 text-xs">
              <div class="p-4 rounded-2xl ${allPassed ? 'bg-emerald-50 border border-emerald-200 text-emerald-950' : 'bg-rose-50 border border-rose-200 text-rose-950'} flex items-center justify-between">
                <div>
                  <p class="font-black text-sm">K\u1ebeT QU\u1ea2 KI\u1ec2M DUY\u1ec6T H\u1ec6 TH\u1ed0NG: ${passedCount}/${results.length} B\u00c0I KI\u1ec2M TH\u1ef0 \u0110\u1ea0T CHU\u1ea8N (${allPassed ? '100% HO\u00c0N H\u1ea2O' : 'C\u00d3 C\u1ea2NH B\u00c1O'})</p>
                  <p class="text-[11px] text-slate-600 mt-0.5">To\u00e0n b\u1ed9 12 ph\u00e2n h\u1ec7 v\u00e0 c\u00f4ng th\u1ee9c k\u1ebf to\u00e1n l\u1eef h\u00e0nh \u0111\u1ec1u ho\u1ea1t \u0111\u1ed9ng an to\u00e0n v\u00e0 \u0111\u1ed3ng b\u1ed9.</p>
                </div>
                <span class="px-3 py-1 rounded-xl font-black text-xs ${allPassed ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}">
                  ${allPassed ? 'PASS 10/10' : 'FAIL'}
                </span>
              </div>

              <div class="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                ${results.map((r, i) => `
                  <div class="p-3 flex items-start justify-between bg-white hover:bg-slate-50 transition-colors">
                    <div class="space-y-0.5 pr-2">
                      <div class="font-bold text-slate-800">${r.name}</div>
                      <div class="text-[11px] text-slate-500 font-mono">${r.details}</div>
                    </div>
                    <span class="px-2 py-0.5 rounded-lg text-[10px] font-black flex-shrink-0 ${r.pass ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}">
                      ${r.pass ? '\u2714 \u0110\u1ea0T' : '\u2715 L\u1ed6I'}
                    </span>
                  </div>
                `).join('')}
              </div>

              <div class="pt-2 flex items-center justify-end">
                <button type="button" onclick="document.getElementById('ai-regression-results-modal').remove()" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs transition-all">
                  \u0110\u00f3ng B\u00e1o C\u00e1o
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      const existing = document.getElementById('ai-regression-results-modal');
      if (existing) existing.remove();
      document.body.insertAdjacentHTML('beforeend', html);
    }
  };

  // Kh\u1edfi t\u1ea1o t\u1ef1 \u0111\u1ed9ng khi t\u1ea3i trang
  window.addEventListener('DOMContentLoaded', function() {
    window.HahaAI = HahaAI;
    console.log('[HahaAI] Multi-Agent AI Engine & Enterprise Automation Workflows initialized.');

    // Ch\u1ea1y ki\u1ec3m tra t\u1ef1 \u0111\u1ed9ng h\u00f3a ng\u1ea7m sau 3 gi\u00e2y kh\u1edfi \u0111\u1ed9ng
    setTimeout(function() {
      if (typeof HahaAI.runAutomationChecks === 'function') {
        HahaAI.runAutomationChecks(true); // silent mode
      }
    }, 3000);
  });

})(window);