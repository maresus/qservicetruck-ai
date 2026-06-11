(function() {
  'use strict';

  const CONFIG = {
    apiUrl: 'https://q-service-truck-ai-production.up.railway.app/chat',
    joinUrl: 'https://q-service-truck-ai-production.up.railway.app/chat/join',
    logoUrl: 'https://q-service-truck-ai-production.up.railway.app/static/logo.png',
    brandColor: '#002B6E',
    brandColorHover: '#001A4E',
    accentColor: '#7DC242',
    title: 'Q-Service Truck',
    subtitle: 'Vaš virtualni asistent',
    placeholder: 'Vprašajte o servisu, delavnicah...',
    welcomeMessage: 'Pozdravljeni! Sem virtualni asistent Q-Service Truck — največje mreže servisov za gospodarska vozila v Sloveniji. Pomagam vam najti delavnico, odgovarjam na vprašanja o storitvah in mreži. Kako vam lahko pomagam?',
    mobileBreakpoint: 768,
    autoOpenDelay: 3000,
    maxStoredMessages: 50
  };

  const styles = `
    #kv-widget-container * {
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    #kv-widget-panel p,
    #kv-widget-panel li,
    #kv-widget-panel h1,
    #kv-widget-panel h2,
    #kv-widget-panel h3 {
      color: inherit;
      text-shadow: none;
      font-size: inherit;
      margin: 0;
    }

    .kv-bot .kv-message-bubble,
    .kv-bot .kv-message-bubble p,
    .kv-bot .kv-message-bubble li,
    .kv-bot .kv-message-bubble span {
      color: #1a1a1a !important;
    }

    .kv-user .kv-message-bubble,
    .kv-user .kv-message-bubble p,
    .kv-user .kv-message-bubble li,
    .kv-user .kv-message-bubble span {
      color: #ffffff !important;
    }

    #kv-launcher {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
      pointer-events: none;
    }
    #kv-launcher > * {
      pointer-events: all;
    }

    #kv-widget-bubble {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${CONFIG.brandColor};
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
      border: none;
      padding: 0;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
      flex-shrink: 0;
      position: relative;
    }

    #kv-widget-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 24px rgba(0,0,0,0.25);
    }

    #kv-widget-bubble svg {
      width: 28px;
      height: 28px;
      fill: white;
    }

    #kv-widget-panel {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 380px;
      height: 520px;
      max-height: calc(100vh - 120px);
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 999998;
      opacity: 0;
      visibility: hidden;
      transform: translateY(8px);
      transition: opacity 0.15s ease, transform 0.15s ease, visibility 0.15s;
    }

    #kv-widget-panel.kv-open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    #kv-widget-panel.kv-minimized {
      height: auto !important;
      min-height: 0 !important;
    }

    #kv-widget-panel.kv-minimized #kv-widget-messages,
    #kv-widget-panel.kv-minimized #kv-widget-input-area,
    #kv-widget-panel.kv-minimized #kv-widget-disclaimer,
    #kv-widget-panel.kv-minimized #kv-widget-powered,
    #kv-widget-panel.kv-minimized #kv-scroll-down {
      display: none !important;
    }

    #kv-widget-panel.kv-minimized #kv-widget-header {
      border-radius: 16px !important;
    }

    #kv-widget-panel.kv-minimized #kv-widget-header::before {
      border-radius: 16px !important;
    }

    @media (max-width: ${CONFIG.mobileBreakpoint}px) {
      #kv-widget-panel {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        height: auto !important;
        max-height: none !important;
        border-radius: 0 !important;
        margin: 0 !important;
      }

      #kv-widget-panel.kv-open {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateY(0) !important;
      }

      #kv-widget-header {
        padding-top: max(16px, env(safe-area-inset-top)) !important;
        padding-left: max(16px, env(safe-area-inset-left)) !important;
        padding-right: max(16px, env(safe-area-inset-right)) !important;
        border-radius: 0 !important;
      }

      #kv-widget-header::before {
        border-radius: 0 !important;
      }

      #kv-widget-messages {
        flex: 1 1 0 !important;
        min-height: 0 !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch;
        padding-left: max(16px, env(safe-area-inset-left));
        padding-right: max(16px, env(safe-area-inset-right));
      }

      #kv-widget-input-area {
        padding-bottom: max(16px, env(safe-area-inset-bottom)) !important;
        padding-left: max(16px, env(safe-area-inset-left)) !important;
        padding-right: max(16px, env(safe-area-inset-right)) !important;
        flex-shrink: 0 !important;
      }

      #kv-widget-disclaimer,
      #kv-widget-powered {
        flex-shrink: 0;
      }

      #kv-widget-input {
        font-size: 16px !important;
      }

      #kv-widget-minimize { display: none !important; }
    }

    #kv-widget-header {
      background: linear-gradient(135deg, #002B6E 0%, #001A4E 100%);
      color: #ffffff;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
      border-bottom: none;
      min-height: 80px;
      position: relative;
      border-radius: 16px 16px 0 0;
    }

    #kv-widget-header-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #kv-widget-header-icon img {
      width: 48px;
      height: 48px;
      object-fit: contain;
    }

    #kv-widget-header-text {
      flex: 1;
    }

    #kv-widget-header-text h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #ffffff;
    }

    #kv-widget-header-text p {
      margin: 2px 0 0;
      font-size: 12px;
      color: rgba(255,255,255,0.88);
    }

    .kv-header-btn {
      background: none;
      border: none;
      color: #ffffff;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      transition: background 0.15s;
    }

    .kv-header-btn:hover {
      background: rgba(255,255,255,0.18);
    }

    .kv-header-btn svg {
      width: 18px;
      height: 18px;
      fill: #ffffff;
    }

    #kv-widget-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #f9f7f5;
      position: relative;
    }

    .kv-message {
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
    }

    .kv-message.kv-bot {
      align-items: flex-start;
    }

    .kv-message.kv-user {
      align-items: flex-end;
    }

    .kv-message-bubble {
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.5;
      word-wrap: break-word;
    }

    .kv-bot .kv-message-bubble {
      background: white;
      color: #1a1a1a;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }

    .kv-user .kv-message-bubble {
      background: ${CONFIG.brandColor};
      color: white;
      border-bottom-right-radius: 4px;
    }

    .kv-typing {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
    }

    .kv-typing span {
      width: 8px;
      height: 8px;
      background: #999;
      border-radius: 50%;
      animation: kv-bounce 1.2s infinite;
    }

    .kv-typing span:nth-child(2) { animation-delay: 0.2s; }
    .kv-typing span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes kv-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    #kv-widget-input-area {
      padding: 12px 16px;
      background: white;
      border-top: 1px solid #eee;
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    }

    #kv-widget-disclaimer {
      font-size: 11px;
      color: #999;
      line-height: 1.4;
      padding: 6px 14px 2px;
      background: white;
      text-align: center;
    }
    #kv-widget-disclaimer a {
      color: ${CONFIG.brandColor};
      text-decoration: none;
    }
    #kv-widget-powered {
      text-align: center;
      font-size: 11px;
      color: #ccc;
      padding: 2px 0 6px;
      background: white;
    }
    #kv-widget-powered a {
      color: #bbb;
      text-decoration: none;
    }
    #kv-widget-powered a:hover {
      color: ${CONFIG.brandColor};
    }

    #kv-widget-input {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 24px;
      padding: 12px 18px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.15s;
    }

    #kv-widget-input:focus {
      border-color: ${CONFIG.brandColor};
    }

    #kv-widget-send {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: ${CONFIG.brandColor};
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      flex-shrink: 0;
    }

    #kv-widget-send:hover {
      background: ${CONFIG.brandColorHover};
    }

    #kv-widget-send:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    #kv-widget-send svg {
      width: 20px;
      height: 20px;
      fill: white !important;
    }

    #kv-widget-send svg path {
      fill: white !important;
    }

    #kv-scroll-down {
      position: sticky;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      margin-left: auto;
      margin-right: auto;
      width: 36px;
      height: 36px;
      background: ${CONFIG.brandColor};
      border-radius: 50%;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 10;
    }

    #kv-scroll-down.kv-visible {
      display: flex;
    }

    #kv-scroll-down svg {
      width: 20px;
      height: 20px;
      fill: white !important;
    }

    #kv-scroll-down svg path {
      fill: white !important;
    }

    /* ── JOIN FORM ─────────────────────────────────── */
    #kv-join-btn-bar {
      padding: 10px 16px 6px;
      background: white;
      border-top: 1px solid #e8f0e0;
      flex-shrink: 0;
    }

    #kv-join-btn {
      width: 100%;
      background: ${CONFIG.accentColor};
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 11px 16px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.3px;
      transition: background 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    #kv-join-btn:hover { background: #5DA030; }

    #kv-join-form-view {
      display: none;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    #kv-join-form-view.kv-visible {
      display: flex;
    }

    #kv-join-form-header {
      background: ${CONFIG.accentColor};
      color: #fff;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    #kv-join-form-header span {
      font-size: 14px;
      font-weight: 700;
    }

    #kv-join-back {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      font-size: 13px;
      padding: 4px 8px;
      border-radius: 6px;
      opacity: 0.9;
    }

    #kv-join-back:hover { background: rgba(255,255,255,0.2); }

    #kv-join-form-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 14px 16px;
      background: #f9f9f9;
    }

    .kv-field {
      margin-bottom: 11px;
    }

    .kv-field label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: #444;
      margin-bottom: 4px;
    }

    .kv-field label span { color: #e53; }

    .kv-field input,
    .kv-field textarea {
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 9px 12px;
      font-size: 13px;
      outline: none;
      transition: border-color 0.15s;
      background: #fff;
      font-family: inherit;
    }

    .kv-field input:focus,
    .kv-field textarea:focus {
      border-color: ${CONFIG.accentColor};
    }

    .kv-field textarea {
      resize: vertical;
      min-height: 60px;
    }

    .kv-checkboxes {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
      margin-top: 4px;
    }

    .kv-checkbox-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: #333;
      cursor: pointer;
    }

    .kv-checkbox-item input[type=checkbox] {
      width: 16px;
      height: 16px;
      accent-color: ${CONFIG.accentColor};
      flex-shrink: 0;
    }

    #kv-join-submit {
      width: 100%;
      background: ${CONFIG.brandColor};
      color: #fff;
      border: none;
      border-radius: 10px;
      padding: 12px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 4px;
      transition: background 0.15s;
    }

    #kv-join-submit:hover { background: ${CONFIG.brandColorHover}; }
    #kv-join-submit:disabled { background: #aaa; cursor: not-allowed; }

    #kv-join-success {
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      padding: 32px 24px;
      text-align: center;
      background: #f9f9f9;
    }

    #kv-join-success.kv-visible { display: flex; }

    #kv-join-success .kv-success-icon {
      width: 56px;
      height: 56px;
      background: ${CONFIG.accentColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    #kv-join-success .kv-success-icon svg {
      width: 28px;
      height: 28px;
      fill: white;
    }

    #kv-join-success h4 {
      color: ${CONFIG.brandColor};
      font-size: 16px;
      margin: 0 0 8px;
    }

    #kv-join-success p {
      color: #666;
      font-size: 13px;
      line-height: 1.5;
      margin: 0;
    }
  `;

  const icons = {
    chat: '<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h10v2H7zm0-3h10v2H7z"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>',
    refresh: '<svg viewBox="0 0 24 24"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
    minimize: '<svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/></svg>',
    restore: '<svg viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>',
    arrowDown: '<svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>'
  };

  let sessionId = localStorage.getItem('qst_widget_session') || generateSessionId();
  localStorage.setItem('qst_widget_session', sessionId);

  let storedMessages = [];
  try {
    const stored = localStorage.getItem('qst_widget_messages');
    if (stored) storedMessages = JSON.parse(stored);
  } catch (e) {
    storedMessages = [];
  }

  function generateSessionId() {
    return 'qst_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  function saveMessages() {
    const toSave = storedMessages.slice(-CONFIG.maxStoredMessages);
    localStorage.setItem('qst_widget_messages', JSON.stringify(toSave));
  }

  function clearConversation() {
    storedMessages = [];
    localStorage.removeItem('qst_widget_messages');
    sessionId = generateSessionId();
    localStorage.setItem('qst_widget_session', sessionId);
    const messages = document.getElementById('kv-widget-messages');
    messages.innerHTML = '';
    addMessage(CONFIG.welcomeMessage, 'bot', false);
  }

  function createWidget() {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    const launcher = document.createElement('div');
    launcher.id = 'kv-launcher';

    var cardStyle = [
      'display:block',
      'background:#ffffff',
      'color:#002B6E',
      'font-size:14px',
      'font-family:-apple-system,BlinkMacSystemFont,sans-serif',
      'font-weight:600',
      'padding:10px 16px',
      'border-radius:18px 18px 4px 18px',
      'box-shadow:0 2px 12px rgba(0,0,0,0.13)',
      'cursor:pointer',
      'border:1px solid rgba(0,43,110,0.18)',
      'max-width:240px',
      'text-align:right',
      'touch-action:manipulation',
      '-webkit-tap-highlight-color:transparent',
      'margin-bottom:8px',
      'line-height:1.4',
    ].join(';');

    var closeStyle = [
      'display:block',
      'background:#fff',
      'color:#002B6E',
      'border:1px solid rgba(0,43,110,0.2)',
      'border-radius:50%',
      'width:24px',
      'height:24px',
      'font-size:13px',
      'cursor:pointer',
      'touch-action:manipulation',
      '-webkit-tap-highlight-color:transparent',
      'margin-bottom:6px',
      'margin-left:auto',
      'line-height:22px',
      'text-align:center',
      'padding:0',
    ].join(';');

    const greetingCards = document.createElement('div');
    greetingCards.id = 'kv-greeting-cards';
    greetingCards.setAttribute('style', [
      'position:fixed',
      'bottom:90px',
      'right:0',
      'z-index:2147483647',
      'display:none',
      'flex-direction:column',
      'align-items:flex-end',
      'padding-right:0',
    ].join(';'));

    var xBtn = document.createElement('button');
    xBtn.setAttribute('style', closeStyle + ';margin-right:6px');
    xBtn.textContent = '✕';
    xBtn.onclick = function(e) { e.stopPropagation(); e.preventDefault(); hideCards(); };
    greetingCards.appendChild(xBtn);

    ['Pozdravljeni 👋', 'Iščete servis za vaše vozilo?', 'Pomagam vam najti delavnico!'].forEach(function(text) {
      var btn = document.createElement('button');
      btn.setAttribute('style', cardStyle);
      btn.textContent = text;
      btn.onclick = function(e) { e.stopPropagation(); e.preventDefault(); setTimeout(openPanel, 0); };
      greetingCards.appendChild(btn);
    });

    const bubble = document.createElement('button');
    bubble.id = 'kv-widget-bubble';
    bubble.innerHTML = CONFIG.logoUrl
      ? `<img src="${CONFIG.logoUrl}" alt="Q-Service Truck" style="width:44px;height:44px;object-fit:contain;border-radius:8px;">`
      : icons.chat;
    bubble.onclick = function(e) {
      e.stopPropagation();
      e.preventDefault();
      setTimeout(togglePanel, 0);
    };

    const panel = document.createElement('div');
    panel.id = 'kv-widget-panel';
    panel.innerHTML = `
      <div id="kv-widget-header">
        <div id="kv-widget-header-icon"><img src="${CONFIG.logoUrl}" alt="Q-Service Truck" style="width:48px;height:48px;object-fit:contain;border-radius:8px;background:white;padding:4px;" onerror="this.style.display='none'"></div>
        <div id="kv-widget-header-text">
          <h3>${CONFIG.title}</h3>
          <p>${CONFIG.subtitle}</p>
        </div>
        <button class="kv-header-btn" id="kv-widget-refresh" title="Nov pogovor">${icons.refresh}</button>
        <button class="kv-header-btn" id="kv-widget-minimize" title="Minimiziraj">${icons.minimize}</button>
        <button class="kv-header-btn" id="kv-widget-close" title="Zapri">${icons.close}</button>
      </div>

      <!-- CHAT VIEW -->
      <div id="kv-chat-view" style="display:flex;flex-direction:column;flex:1;overflow:hidden;min-height:0;">
        <div id="kv-widget-messages">
          <div id="kv-scroll-down" title="Scroll dol">${icons.arrowDown}</div>
        </div>
        <div id="kv-join-btn-bar">
          <button id="kv-join-btn">
            <svg viewBox="0 0 24 24" style="width:16px;height:16px;fill:white;flex-shrink:0;"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            PRIDRUŽI SE MREŽI Q-SERVICE TRUCK
          </button>
        </div>
        <div id="kv-widget-input-area">
          <input type="text" id="kv-widget-input" placeholder="${CONFIG.placeholder}">
          <button id="kv-widget-send">${icons.send}</button>
        </div>
        <div id="kv-widget-disclaimer">Odgovori so informativne narave. Za servis pokličite <a href="tel:+38641413393">+386 41 413 393</a>.</div>
        <div id="kv-widget-powered">built by: <a href="https://spoznaj-ai.si" target="_blank">spoznaj-ai.si</a></div>
      </div>

      <!-- JOIN FORM VIEW -->
      <div id="kv-join-form-view">
        <div id="kv-join-form-header">
          <span>Prijava v mrežo Q-Service Truck</span>
          <button id="kv-join-back">← Nazaj</button>
        </div>
        <div id="kv-join-form-scroll">
          <div class="kv-field">
            <label>Ime delavnice <span>*</span></label>
            <input type="text" id="jf-delavnica" placeholder="npr. Servis Novak d.o.o.">
          </div>
          <div class="kv-field">
            <label>Kontaktna oseba <span>*</span></label>
            <input type="text" id="jf-kontakt" placeholder="Ime in priimek">
          </div>
          <div class="kv-field">
            <label>Telefon <span>*</span></label>
            <input type="tel" id="jf-telefon" placeholder="+386 ...">
          </div>
          <div class="kv-field">
            <label>E-pošta <span>*</span></label>
            <input type="email" id="jf-email" placeholder="servis@...">
          </div>
          <div class="kv-field">
            <label>Naslov delavnice <span>*</span></label>
            <input type="text" id="jf-naslov" placeholder="Ulica, kraj">
          </div>
          <div class="kv-field">
            <label>Davčna številka</label>
            <input type="text" id="jf-davcna" placeholder="SI ...">
          </div>
          <div class="kv-field">
            <label>Katera vozila servisiramo?</label>
            <div class="kv-checkboxes">
              <label class="kv-checkbox-item"><input type="checkbox" value="Tovornjaki"> Tovornjaki</label>
              <label class="kv-checkbox-item"><input type="checkbox" value="Avtobusi"> Avtobusi</label>
              <label class="kv-checkbox-item"><input type="checkbox" value="Kmetijska mehanizacija"> Kmetijska meh.</label>
              <label class="kv-checkbox-item"><input type="checkbox" value="Gradbena mehanizacija"> Gradbena meh.</label>
            </div>
          </div>
          <div class="kv-field">
            <label>Sporočilo / opombe</label>
            <textarea id="jf-sporocilo" placeholder="Dodatne informacije, vprašanja..."></textarea>
          </div>
          <button id="kv-join-submit">POŠLJI PRIJAVO</button>
        </div>
        <div id="kv-join-success">
          <div class="kv-success-icon">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </div>
          <h4>Prijava uspešno poslana!</h4>
          <p>Hari Ljutić vas bo kontaktiral v najkrajšem možnem času.<br><br>
          📞 +386 41 413 393</p>
        </div>
      </div>
    `;

    launcher.appendChild(bubble);
    document.body.appendChild(launcher);
    document.body.appendChild(greetingCards);
    document.body.appendChild(panel);

    panel.addEventListener('click', function(e) { e.stopPropagation(); });
    greetingCards.addEventListener('click', function(e) { e.stopPropagation(); });
    launcher.addEventListener('click', function(e) { e.stopPropagation(); });

    document.getElementById('kv-widget-close').onclick = closePanel;
    document.getElementById('kv-widget-refresh').onclick = clearConversation;
    document.getElementById('kv-widget-minimize').onclick = toggleMinimize;
    document.getElementById('kv-widget-send').onclick = sendMessage;
    document.getElementById('kv-widget-input').onkeypress = function(e) {
      if (e.key === 'Enter') sendMessage();
    };
    document.getElementById('kv-join-btn').onclick = openJoinForm;
    document.getElementById('kv-join-back').onclick = closeJoinForm;
    document.getElementById('kv-join-submit').onclick = submitJoinForm;

    document.getElementById('kv-widget-input').addEventListener('focus', function() {
      var msgs = document.getElementById('kv-widget-messages');
      if (!msgs) return;
      setTimeout(function() { msgs.scrollTop = msgs.scrollHeight; }, 350);
    });

    const messagesEl = document.getElementById('kv-widget-messages');
    const scrollArrow = document.getElementById('kv-scroll-down');

    scrollArrow.onclick = function() {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    };

    messagesEl.onscroll = function() {
      const isNearBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 50;
      if (isNearBottom) scrollArrow.classList.remove('kv-visible');
    };

    if (storedMessages.length > 0) {
      storedMessages.forEach(function(msg) {
        addMessageToUI(msg.text, msg.sender, false);
      });
    } else {
      addMessageToUI(CONFIG.welcomeMessage, 'bot', false);
    }

    setTimeout(function() {
      if (!panelOpen) showCards();
    }, CONFIG.autoOpenDelay);
  }

  var panelOpen = false;
  var panelMinimized = false;

  function toggleMinimize() {
    var panel = document.getElementById('kv-widget-panel');
    var btn = document.getElementById('kv-widget-minimize');
    panelMinimized = !panelMinimized;
    if (panelMinimized) {
      panel.classList.add('kv-minimized');
      btn.innerHTML = icons.restore;
      btn.title = 'Razpri';
    } else {
      panel.classList.remove('kv-minimized');
      btn.innerHTML = icons.minimize;
      btn.title = 'Minimiziraj';
    }
  }

  function showCards() {
    var c = document.getElementById('kv-greeting-cards');
    if (c) c.style.display = 'flex';
  }

  function hideCards() {
    var c = document.getElementById('kv-greeting-cards');
    if (c) c.style.display = 'none';
  }

  function togglePanel() {
    if (panelOpen) closePanel(); else openPanel();
  }

  function onViewportResize() {
    if (!panelOpen || window.innerWidth > CONFIG.mobileBreakpoint) return;
    var vv = window.visualViewport;
    if (!vv) return;
    var panel = document.getElementById('kv-widget-panel');
    panel.style.top = vv.offsetTop + 'px';
    panel.style.height = vv.height + 'px';
    panel.style.bottom = 'auto';
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', onViewportResize);
    window.visualViewport.addEventListener('scroll', onViewportResize);
  }

  function openPanel() {
    if (panelOpen) return;
    panelOpen = true;
    var panel = document.getElementById('kv-widget-panel');
    panel.classList.add('kv-open');
    panel.style.opacity = '1';
    panel.style.visibility = 'visible';
    panel.style.transform = 'translateY(0)';
    if (window.innerWidth <= CONFIG.mobileBreakpoint) {
      panel.style.position = 'fixed';
      panel.style.top = '0';
      panel.style.left = '0';
      panel.style.right = '0';
      panel.style.bottom = '0';
      panel.style.width = '100%';
      panel.style.height = 'auto';
      panel.style.maxHeight = 'none';
      panel.style.borderRadius = '0';
      document.body.style.overflow = 'hidden';
      document.getElementById('kv-launcher').style.display = 'none';
      if (window.visualViewport) onViewportResize();
    }
    hideCards();
    document.getElementById('kv-widget-input').focus();
    localStorage.setItem('qst_widget_open', 'true');
    var messages = document.getElementById('kv-widget-messages');
    var scrollArrow = document.getElementById('kv-scroll-down');
    if (messages.scrollHeight > messages.clientHeight) {
      scrollArrow.classList.add('kv-visible');
    }
  }

  function closePanel() {
    if (!panelOpen) return;
    panelOpen = false;
    panelMinimized = false;
    var panel = document.getElementById('kv-widget-panel');
    panel.classList.remove('kv-open', 'kv-minimized');
    panel.style.opacity = '0';
    panel.style.visibility = 'hidden';
    panel.style.transform = 'translateY(8px)';
    panel.style.top = '';
    panel.style.height = '';
    panel.style.bottom = '';
    document.body.style.overflow = '';
    document.getElementById('kv-launcher').style.display = 'flex';
    var btn = document.getElementById('kv-widget-minimize');
    if (btn) { btn.innerHTML = icons.minimize; btn.title = 'Minimiziraj'; }
    localStorage.setItem('qst_widget_open', 'false');
    showCards();
  }

  function addMessageToUI(text, sender, autoScroll) {
    if (autoScroll === undefined) autoScroll = true;
    const messages = document.getElementById('kv-widget-messages');
    const scrollArrow = document.getElementById('kv-scroll-down');

    const msg = document.createElement('div');
    msg.className = 'kv-message kv-' + sender;
    if (sender === 'bot') {
      msg.innerHTML = '<div class="kv-message-bubble">' + renderMarkdown(text) + '</div>';
    } else {
      msg.innerHTML = '<div class="kv-message-bubble">' + escapeHtml(text) + '</div>';
    }
    messages.appendChild(msg);

    if (!autoScroll) return;

    if (sender === 'user') {
      msg.scrollIntoView({ block: 'start', behavior: 'smooth' });
      if (scrollArrow) scrollArrow.classList.remove('kv-visible');
    } else {
      var userMsgs = messages.querySelectorAll('.kv-user');
      var lastUser = userMsgs[userMsgs.length - 1];
      if (lastUser) lastUser.scrollIntoView({ block: 'start', behavior: 'smooth' });
      setTimeout(function() {
        var notAtBottom = messages.scrollHeight - messages.scrollTop - messages.clientHeight > 40;
        if (notAtBottom && scrollArrow) scrollArrow.classList.add('kv-visible');
      }, 350);
    }
  }

  function addMessage(text, sender, save) {
    if (save === undefined) save = true;
    addMessageToUI(text, sender);
    if (save) {
      storedMessages.push({ text: text, sender: sender, time: Date.now() });
      saveMessages();
    }
  }

  function showTyping() {
    const messages = document.getElementById('kv-widget-messages');
    const typing = document.createElement('div');
    typing.id = 'kv-typing-indicator';
    typing.className = 'kv-message kv-bot';
    typing.innerHTML = '<div class="kv-message-bubble kv-typing"><span></span><span></span><span></span></div>';
    messages.appendChild(typing);
    var userMsgs = messages.querySelectorAll('.kv-user');
    var lastUser = userMsgs[userMsgs.length - 1];
    if (lastUser) lastUser.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function hideTyping() {
    const typing = document.getElementById('kv-typing-indicator');
    if (typing) typing.remove();
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
  }

  function renderMarkdown(text) {
    var escaped = (function(t) {
      var d = document.createElement('div');
      d.textContent = t;
      return d.innerHTML;
    })(text);

    escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    escaped = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener" style="color:#002B6E;text-decoration:underline;">$1</a>');

    escaped = escaped.replace(/(?<!=["'])(https?:\/\/[^\s<>"')\]]+)/g,
      '<a href="$1" target="_blank" rel="noopener" style="color:#002B6E;text-decoration:underline;">$1</a>');

    escaped = escaped.replace(/(?<![/"'=])(www\.[a-zA-Z0-9][^\s<>"')\]]+)/g,
      '<a href="https://$1" target="_blank" rel="noopener" style="color:#002B6E;text-decoration:underline;">$1</a>');

    escaped = escaped.replace(/((?:^|\n)- [^\n]+)+/g, function(block) {
      var items = block.trim().split(/\n/).map(function(line) {
        return '<li>' + line.replace(/^- /, '') + '</li>';
      }).join('');
      return '<ul style="margin:6px 0 6px 16px;padding:0;">' + items + '</ul>';
    });

    escaped = escaped.replace(/\n\n+/g, '</p><p style="margin:6px 0;">');
    escaped = escaped.replace(/\n/g, '<br>');
    escaped = '<p style="margin:0;">' + escaped + '</p>';

    return escaped;
  }

  async function sendMessage() {
    const input = document.getElementById('kv-widget-input');
    const sendBtn = document.getElementById('kv-widget-send');
    const text = input.value.trim();

    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    sendBtn.disabled = true;
    showTyping();

    try {
      const response = await fetch(CONFIG.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: sessionId })
      });

      hideTyping();

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      const reply = data.reply || data.response || data.message || 'Oprostite, prišlo je do napake.';
      addMessage(reply, 'bot');

    } catch (err) {
      hideTyping();
      addMessage('Oprostite, trenutno ni mogoče vzpostaviti povezave. Pokličite nas: +386 41 413 393.', 'bot');
      console.error('[QST Widget] Error:', err);
    }

    sendBtn.disabled = false;
    input.focus();
  }

  function openJoinForm() {
    document.getElementById('kv-chat-view').style.display = 'none';
    document.getElementById('kv-join-form-view').classList.add('kv-visible');
    document.getElementById('kv-join-success').classList.remove('kv-visible');
    document.getElementById('kv-join-form-scroll').style.display = 'block';
  }

  function closeJoinForm() {
    document.getElementById('kv-chat-view').style.display = 'flex';
    document.getElementById('kv-join-form-view').classList.remove('kv-visible');
  }

  async function submitJoinForm() {
    var delavnica = document.getElementById('jf-delavnica').value.trim();
    var kontakt = document.getElementById('jf-kontakt').value.trim();
    var telefon = document.getElementById('jf-telefon').value.trim();
    var email = document.getElementById('jf-email').value.trim();
    var naslov = document.getElementById('jf-naslov').value.trim();

    if (!delavnica || !kontakt || !telefon || !email || !naslov) {
      alert('Prosimo, izpolnite vsa obvezna polja (*).');
      return;
    }

    var vozila = [];
    document.querySelectorAll('.kv-checkboxes input[type=checkbox]:checked').forEach(function(cb) {
      vozila.push(cb.value);
    });

    var payload = {
      delavnica: delavnica,
      kontakt: kontakt,
      telefon: telefon,
      email: email,
      naslov: naslov,
      davcna: document.getElementById('jf-davcna').value.trim() || null,
      vozila: vozila,
      sporocilo: document.getElementById('jf-sporocilo').value.trim() || null
    };

    var btn = document.getElementById('kv-join-submit');
    btn.disabled = true;
    btn.textContent = 'Pošiljam...';

    try {
      var res = await fetch(CONFIG.joinUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('server error');
      document.getElementById('kv-join-form-scroll').style.display = 'none';
      document.getElementById('kv-join-success').classList.add('kv-visible');
    } catch (e) {
      alert('Napaka pri pošiljanju. Pokličite: +386 41 413 393');
      btn.disabled = false;
      btn.textContent = 'POŠLJI PRIJAVO';
    }
  }

  function initWidget() {
    if (document.getElementById('kv-greeting-cards')) return;
    createWidget();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    requestAnimationFrame(initWidget);
  }
})();
