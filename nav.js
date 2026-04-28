/* ─────────────────────────────────────────────────────
   ServiceNow BDR Command Center — Shared Navigation
   Drop this in /nav/nav.js and link from every page.
   This file injects the global top nav, sidebar, and
   tab strip into any page that includes it.
   ───────────────────────────────────────────────────── */

(function() {

  // ─── ROUTE MAP ───
  // Maps view keys to their files and metadata.
  // Keep this in sync with your repo's file structure.
  const VIEW_DEFS = {
    home:           {label:'Today',           icon:'⌂', url:'index.html'},
    prospecting:    {label:'Prospecting',     icon:'📣', url:'campaigns.html',         count:5},
    buyinggroups:   {label:'Buying Groups',   icon:'🎯', url:'buying-groups.html',     count:12},
    leads:          {label:'Leads',           icon:'👤', url:'leads.html',             count:39, countR:true},
    territoryleads: {label:'Territory Leads', icon:'🗺',  url:'territory-leads.html',   count:200},
    accounts:       {label:'Accounts',        icon:'🏢', url:'accounts.html',          count:340},
    opportunities:  {label:'Opportunities',   icon:'💼', url:'opportunities.html',     count:5},
    bookofbusiness: {label:'Book of Business',icon:'📖', url:'book-of-business.html'},
    aealignment:    {label:'AE Alignment',    icon:'🤝', url:'ae-alignment.html'},
    activitiestab:  {label:'Activities',      icon:'⚡', url:'activities.html',        count:100},
    outreachcenter: {label:'Outreach Center', icon:'✉️',  url:'outreach-center.html'},
  };

  // Reverse map: filename → view key (for matching the current page)
  const FILE_TO_VIEW = {};
  Object.entries(VIEW_DEFS).forEach(([key, def]) => { FILE_TO_VIEW[def.url] = key; });

  // ─── DETECT CURRENT PAGE ───
  function getCurrentFile() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path;
  }
  function getCurrentView() {
    const file = getCurrentFile();
    return FILE_TO_VIEW[file] || 'home';
  }

  // ─── TAB STATE (persisted in localStorage) ───
  const STORAGE_KEY = 'bdr_open_tabs_v1';

  function loadTabs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [{ id: 'home', view: 'home' }];
  }

  function saveTabs(tabs) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs)); } catch (e) {}
  }

  let TABS = loadTabs();
  let TAB_SEQ = TABS.reduce((max, t) => {
    const num = parseInt((t.id || '').replace('tab-', '')) || 0;
    return Math.max(max, num);
  }, 1);

  // Make sure Home is always present
  if (!TABS.find(t => t.view === 'home')) {
    TABS.unshift({ id: 'home', view: 'home' });
  }

  // Make sure the current page has a tab; if not, add one
  const currentView = getCurrentView();
  if (!TABS.find(t => t.view === currentView)) {
    TABS.push({ id: 'tab-' + (++TAB_SEQ), view: currentView });
  }
  saveTabs(TABS);

  // ─── RENDER TAB STRIP ───
  function renderTabs() {
    const el = document.getElementById('ptabs');
    if (!el) return;

    const items = TABS.map(t => {
      const def = VIEW_DEFS[t.view];
      if (!def) return '';
      const active = t.view === currentView;
      const ctBadge = (def.count !== undefined)
        ? `<span class="ptab-ct${def.countR ? ' r' : ''}">${def.count}</span>`
        : '';
      const closeBtn = t.view === 'home'
        ? ''
        : `<button class="ptab-x" onclick="event.stopPropagation();window.__navCloseTab('${t.id}')" title="Close">×</button>`;
      return `<a class="ptab ${active ? 'on' : ''}" href="${def.url}" onclick="window.__navActivateTab(event,'${t.id}','${t.view}')">
        <span class="ptab-ic">${def.icon}</span>
        <span>${def.label}</span>
        ${ctBadge}
        ${closeBtn}
      </a>`;
    }).join('');

    el.innerHTML = items + `<button class="ptab-add" onclick="event.stopPropagation();window.__navToggleMenu()" title="Open new tab">+</button><div class="ptab-menu" id="ptabMenu"></div>`;
  }

  // ─── TAB ACTIONS (exposed globally for inline handlers) ───
  window.__navActivateTab = function(event, tabId, view) {
    // Just let the link navigate normally to the file
    // (no preventDefault — browser handles it)
  };

  window.__navCloseTab = function(tabId) {
    const tab = TABS.find(t => t.id === tabId);
    if (!tab) return;
    const wasActive = tab.view === currentView;

    TABS = TABS.filter(t => t.id !== tabId);
    if (!TABS.find(t => t.view === 'home')) TABS.unshift({ id: 'home', view: 'home' });
    saveTabs(TABS);

    if (wasActive) {
      // Navigate to the previous tab in the list
      const idx = Math.max(0, TABS.findIndex(t => t.view === 'home'));
      const next = TABS[idx];
      if (next && VIEW_DEFS[next.view]) {
        window.location.href = VIEW_DEFS[next.view].url;
        return;
      }
    }
    renderTabs();
  };

  window.__navToggleMenu = function() {
    const menu = document.getElementById('ptabMenu');
    if (!menu) return;
    if (menu.classList.contains('open')) { menu.classList.remove('open'); return; }
    const sections = [
      { lbl: 'CRM views', items: [
        'prospecting','buyinggroups','leads','territoryleads','accounts',
        'opportunities','bookofbusiness','aealignment','activitiestab','outreachcenter'
      ]}
    ];
    let html = '';
    sections.forEach((s, i) => {
      if (i > 0) html += `<div class="ptab-menu-divider"></div>`;
      html += `<div class="ptab-menu-lbl">${s.lbl}</div>`;
      s.items.forEach(viewKey => {
        const def = VIEW_DEFS[viewKey];
        if (!def) return;
        const ct = (def.count !== undefined)
          ? `<span class="ct${def.countR ? ' r' : ''}">${def.count}</span>`
          : '';
        html += `<div class="ptab-menu-item" onclick="window.__navOpenTab('${viewKey}')"><span class="ic">${def.icon}</span><span>${def.label}</span>${ct}</div>`;
      });
    });
    menu.innerHTML = html;
    const addBtn = document.querySelector('.ptab-add');
    if (addBtn) {
      const r = addBtn.getBoundingClientRect();
      menu.style.top = (r.bottom + 4) + 'px';
      menu.style.left = Math.max(r.right - 240, 8) + 'px';
    }
    menu.classList.add('open');
  };

  window.__navOpenTab = function(viewKey) {
    const def = VIEW_DEFS[viewKey];
    if (!def) return;
    // Add tab if not already open
    if (!TABS.find(t => t.view === viewKey)) {
      TABS.push({ id: 'tab-' + (++TAB_SEQ), view: viewKey });
      saveTabs(TABS);
    }
    window.location.href = def.url;
  };

  // Close menu on outside click
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.ptab-add') && !e.target.closest('.ptab-menu')) {
      const menu = document.getElementById('ptabMenu');
      if (menu) menu.classList.remove('open');
    }
  });

  // ─── INJECT GLOBAL NAV + SIDEBAR + TAB STRIP ───
  function injectShell() {
    // Top global nav
    if (!document.querySelector('.gnav')) {
      const gnav = document.createElement('nav');
      gnav.className = 'gnav';
      gnav.innerHTML = `
        <div class="gnav-logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="108" height="17" viewBox="0 0 132 20">
            <path d="M32.022,6.391a5.626,5.626,0,0,0-3.61,1.3V6.523H25.119V19.35h3.425v-8.2a4.073,4.073,0,0,1,3.109-1.588,3.494,3.494,0,0,1,1.374.206V6.479a5.851,5.851,0,0,0-1.005-.088" fill="#fff" fill-rule="evenodd"/>
            <path d="M2.16,15.436a5.369,5.369,0,0,0,3.5,1.269c.922,0,1.633-.45,1.633-1.084,0-1.931-6.191-1.243-6.191-5.369,0-2.459,2.371-3.993,4.9-3.993a7.9,7.9,0,0,1,4.32,1.3L8.72,10.04a4.3,4.3,0,0,0-2.45-.872c-.948,0-1.739.37-1.739,1.031,0,1.666,6.192,1.005,6.192,5.448,0,2.46-2.4,3.967-5.085,3.967A8.815,8.815,0,0,1,.5,17.9Z" fill="#fff" fill-rule="evenodd"/>
            <path d="M23.657,12.817c0-3.57-2.5-6.558-6.034-6.558-3.794,0-6.218,3.12-6.218,6.691A6.4,6.4,0,0,0,18.1,19.614a6.919,6.919,0,0,0,5.243-2.3l-1.95-1.957a4.515,4.515,0,0,1-3.214,1.481A3.36,3.36,0,0,1,14.725,13.8h8.853A5.735,5.735,0,0,0,23.657,12.817Zm-8.774-1.533a2.775,2.775,0,0,1,2.74-2.248,2.552,2.552,0,0,1,2.53,2.248Z" fill="#fff" fill-rule="evenodd"/>
            <polygon points="41.19 14.351 44.694 6.523 48.252 6.523 42.376 19.35 40.005 19.35 34.129 6.523 37.686 6.523 41.19 14.351" fill="#fff" fill-rule="evenodd"/>
            <path d="M51.128.5A2.2,2.2,0,1,1,48.888,2.7,2.2,2.2,0,0,1,51.128.5" fill="#fff" fill-rule="evenodd"/>
            <rect x="49.415" y="6.523" width="3.425" height="12.827" fill="#fff"/>
            <path d="M67,16.731a6.766,6.766,0,0,1-5.8,2.883,6.68,6.68,0,1,1,.026-13.355,6.808,6.808,0,0,1,5.375,2.565l-2.424,2.142a3.7,3.7,0,0,0-2.951-1.534A3.433,3.433,0,0,0,57.78,12.95a3.383,3.383,0,0,0,3.531,3.49,3.741,3.741,0,0,0,3.056-1.692Z" fill="#fff" fill-rule="evenodd"/>
            <path d="M79.442,17.313a6.918,6.918,0,0,1-5.243,2.3,6.4,6.4,0,0,1-6.692-6.664c0-3.571,2.424-6.691,6.218-6.691,3.53,0,6.033,2.988,6.033,6.558a5.635,5.635,0,0,1-.079.979H70.826a3.36,3.36,0,0,0,3.452,3.041,4.52,4.52,0,0,0,3.215-1.481Zm-3.188-6.029a2.551,2.551,0,0,0-2.529-2.248,2.774,2.774,0,0,0-2.74,2.248Z" fill="#fff" fill-rule="evenodd"/>
            <path d="M81.12,19.35V6.523h3.293V7.554a5.625,5.625,0,0,1,3.609-1.295,5.747,5.747,0,0,1,4.427,2.063,6.482,6.482,0,0,1,1.317,4.5V19.35H90.341v-6.8a3.11,3.11,0,0,0-.764-2.407,2.69,2.69,0,0,0-1.923-.714,4.076,4.076,0,0,0-3.109,1.587V19.35Z" fill="#fff" fill-rule="evenodd"/>
            <path d="M102.586,6.259A7.5,7.5,0,0,0,97.419,19.21a1.481,1.481,0,0,0,1.926.1,5.355,5.355,0,0,1,6.394,0,1.485,1.485,0,0,0,1.937-.113,7.5,7.5,0,0,0-5.09-12.94M102.542,17.5a3.637,3.637,0,0,1-3.734-3.733,3.734,3.734,0,1,1,7.468,0,3.637,3.637,0,0,1-3.734,3.733" fill="#62d84e" fill-rule="evenodd"/>
            <polygon points="116.788 19.35 114.237 19.35 109.15 6.523 112.57 6.523 115.359 13.853 118.094 6.523 120.952 6.523 123.662 13.853 126.475 6.523 129.896 6.523 124.809 19.35 122.258 19.35 119.523 12.046 116.788 19.35" fill="#fff" fill-rule="evenodd"/>
          </svg>
        </div>
        <div class="gnav-tabs">
          <span class="gnav-tab">Favorites</span>
          <span class="gnav-tab">History</span>
          <span class="gnav-tab">Workspaces</span>
        </div>
        <div class="gnav-pill-wrap">
          <div class="gnav-pill"><div class="gnav-pill-dot"></div>Sales CRM · BDR Command Center ⌄</div>
        </div>
        <div class="gnav-r">
          <button class="gnav-btn">＋</button>
          <button class="gnav-btn">🔔</button>
          <div class="gnav-av">JR</div>
        </div>
      `;
      document.body.insertBefore(gnav, document.body.firstChild);
    }

    // Sidebar
    if (!document.querySelector('.sbar')) {
      const sbar = document.createElement('aside');
      sbar.className = 'sbar';
      const sbItems = [
        { view: 'home',           label: 'Command Center', ic: '⌂' },
        { view: 'prospecting',    label: 'Prospecting',    ic: '📣' },
        { view: 'buyinggroups',   label: 'Buying Groups',  ic: '🎯' },
        { view: 'leads',          label: 'Leads',          ic: '👤' },
        { view: 'territoryleads', label: 'Territory Leads',ic: '🗺' },
        { view: 'accounts',       label: 'Accounts',       ic: '🏢' },
        { view: 'opportunities',  label: 'Opportunities',  ic: '💼' },
        { view: 'bookofbusiness', label: 'Book of Business',ic: '📖' },
        { view: 'aealignment',    label: 'AE Alignment',   ic: '🤝' },
        { view: 'activitiestab',  label: 'Activities',     ic: '⚡' },
      ];
      const itemsHtml = sbItems.map(it => {
        const def = VIEW_DEFS[it.view];
        if (!def) return '';
        const active = it.view === currentView ? 'on' : '';
        const badge = (def.count !== undefined)
          ? `<span class="sb${def.countR ? ' r' : ''}">${def.count}</span>`
          : '';
        return `<a class="sbar-item ${active}" href="${def.url}"><span class="sbar-ic">${it.ic}</span>${it.label}${badge}</a>`;
      }).join('');
      sbar.innerHTML = `
        <div class="sbar-sec">${itemsHtml}</div>
        <div class="sdivider"></div>
        <div class="sbar-sec">
          <a class="sbar-item aicoach" onclick="if(window.openPanel)openPanel()"><span class="sbar-ic">✦</span>AI Sales Coach</a>
        </div>
      `;
      document.body.insertBefore(sbar, document.body.firstChild.nextSibling);
    }

    // Tab strip — placed inside the page's app-shell wrapper, at the top
    if (!document.getElementById('ptabs')) {
      const shell = document.querySelector('.app-shell');
      if (shell) {
        const ptabs = document.createElement('div');
        ptabs.className = 'ptabs';
        ptabs.id = 'ptabs';
        shell.insertBefore(ptabs, shell.firstChild);
      }
    }
    renderTabs();
  }

  // Init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectShell);
  } else {
    injectShell();
  }

})();
