/**
 * ClaudePlot 圖表圖鑑 — 前端互動邏輯。
 *
 * 功能：
 *   - 註冊明暗兩套 ECharts 主題（類別色盤 + 文字/軸線色），切換主題全站一致。
 *   - 以 IntersectionObserver 延遲初始化圖表，避免一次渲染 30+ 個實例卡頓。
 *   - 分類篩選 + 關鍵字搜尋（比對中文、英文、適用場景）。
 *   - 點卡片開啟詳情彈窗（大圖 + 完整適用場景與使用提示）。
 *   - 地理類圖表待 world geoJSON 註冊完成後才渲染；載入失敗顯示友善提示。
 */

(function () {
  'use strict';

  /* ---------- ECharts 主題（色彩取自 dataviz 驗證色盤）---------- */
  const THEME_LIGHT = {
    color: ['#2a78d6', '#1baf7a', '#eda100', '#008300', '#4a3aa7', '#e34948', '#e87ba4', '#eb6834'],
    backgroundColor: 'transparent',
    textStyle: { color: '#52514e' },
    title: { textStyle: { color: '#0b0b0b' }, subtextStyle: { color: '#52514e' } },
    legend: { textStyle: { color: '#52514e' } },
    categoryAxis: {
      axisLine: { lineStyle: { color: '#c3c2b7' } },
      axisTick: { lineStyle: { color: '#c3c2b7' } },
      axisLabel: { color: '#52514e' },
      splitLine: { show: false },
    },
    valueAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#52514e' },
      splitLine: { lineStyle: { color: ['#e1e0d9'] } },
    },
    timeAxis: { axisLabel: { color: '#52514e' }, splitLine: { lineStyle: { color: ['#e1e0d9'] } } },
    tooltip: { backgroundColor: '#ffffff', borderColor: '#e1e0d9', textStyle: { color: '#0b0b0b' } },
  };

  const THEME_DARK = {
    color: ['#3987e5', '#199e70', '#c98500', '#008300', '#9085e9', '#e66767', '#d55181', '#d95926'],
    backgroundColor: 'transparent',
    textStyle: { color: '#c3c2b7' },
    title: { textStyle: { color: '#ffffff' }, subtextStyle: { color: '#c3c2b7' } },
    legend: { textStyle: { color: '#c3c2b7' } },
    categoryAxis: {
      axisLine: { lineStyle: { color: '#383835' } },
      axisTick: { lineStyle: { color: '#383835' } },
      axisLabel: { color: '#c3c2b7' },
      splitLine: { show: false },
    },
    valueAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#c3c2b7' },
      splitLine: { lineStyle: { color: ['#2c2c2a'] } },
    },
    timeAxis: { axisLabel: { color: '#c3c2b7' }, splitLine: { lineStyle: { color: ['#2c2c2a'] } } },
    tooltip: { backgroundColor: '#232321', borderColor: '#2c2c2a', textStyle: { color: '#ffffff' } },
  };

  echarts.registerTheme('cp-light', THEME_LIGHT);
  echarts.registerTheme('cp-dark', THEME_DARK);

  /* ---------- world geoJSON 註冊（供地理類圖表）---------- */
  const mapReady = fetch('vendor/world.json')
    .then(function (res) {
      if (!res.ok) { throw new Error('world.json HTTP ' + res.status); }
      return res.json();
    })
    .then(function (geoJson) {
      echarts.registerMap('world', geoJson);
      return true;
    })
    .catch(function (err) {
      console.warn('[ClaudePlot] world.json 載入失敗，地理類圖表將顯示提示：', err);
      return false;
    });

  const MAP_FALLBACK = {
    graphic: {
      type: 'text',
      left: 'center',
      top: 'middle',
      style: { text: '世界地圖資源載入失敗\n請確認 vendor/world.json', fill: '#898781', fontSize: 13, align: 'center' },
    },
  };

  /* ---------- 狀態與 DOM 參照 ---------- */
  const byId = new Map(CATALOG.map(function (d) { return [d.id, d]; }));
  const renderedCharts = new Map(); // id -> { instance, el, def }
  let activeCat = 'all';
  let modalChart = null;
  let currentModalDef = null;

  const grid = document.getElementById('grid');
  const emptyEl = document.getElementById('empty');
  const filtersEl = document.getElementById('filters');
  const searchInput = document.getElementById('search');
  const themeToggle = document.getElementById('themeToggle');
  const modal = document.getElementById('modal');
  const mChartEl = document.getElementById('mChart');

  /* ---------- 主題工具 ---------- */
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function themeName() {
    return currentTheme() === 'dark' ? 'cp-dark' : 'cp-light';
  }

  /* ---------- 依 option 是否需要地圖決定渲染時機 ---------- */
  function applyOption(instance, def) {
    if (def.needsMap) {
      mapReady.then(function (ok) {
        if (!instance || instance.isDisposed()) { return; }
        instance.setOption(ok ? def.option : MAP_FALLBACK);
      });
    } else {
      instance.setOption(def.option);
    }
  }

  /* ---------- 卡片圖表（延遲初始化）---------- */
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) { return; }
      const card = entry.target;
      const id = Number(card.dataset.id);
      if (!renderedCharts.has(id)) {
        const def = byId.get(id);
        const el = card.querySelector('.card-chart');
        const inst = echarts.init(el, themeName());
        renderedCharts.set(id, { instance: inst, el: el, def: def });
        applyOption(inst, def);
      }
      observer.unobserve(card);
    });
  }, { rootMargin: '160px' });

  /* ---------- 卡片 DOM ---------- */
  function buildCard(def) {
    const cat = CATEGORIES[def.category];
    const card = document.createElement('article');
    card.className = 'card';
    card.style.setProperty('--chip-color', cat.color);
    card.dataset.id = String(def.id);
    card.innerHTML =
      '<div class="card-top">' +
        '<span class="card-num">#' + String(def.id).padStart(3, '0') + '</span>' +
        '<span class="tag"><span class="dot"></span>' + cat.name + '</span>' +
      '</div>' +
      '<div class="card-chart"></div>' +
      '<div class="card-title">' +
        '<div class="card-title-zh">' + def.titleZh + '</div>' +
        '<div class="card-title-en">' + def.titleEn + '</div>' +
      '</div>' +
      '<div class="card-scenario">' + def.scenario + '</div>';
    card.addEventListener('click', function () { openModal(def); });
    return card;
  }

  /* ---------- 過濾 ---------- */
  function filterCatalog() {
    const q = searchInput.value.trim().toLowerCase();
    return CATALOG.filter(function (def) {
      if (activeCat !== 'all' && def.category !== activeCat) { return false; }
      if (!q) { return true; }
      const hay = (def.titleZh + ' ' + def.titleEn + ' ' + def.scenario).toLowerCase();
      return hay.indexOf(q) !== -1;
    });
  }

  function renderGrid() {
    renderedCharts.forEach(function (c) { c.instance.dispose(); });
    renderedCharts.clear();
    observer.disconnect();
    grid.innerHTML = '';

    const list = filterCatalog();
    emptyEl.hidden = list.length !== 0;
    list.forEach(function (def) {
      const card = buildCard(def);
      grid.appendChild(card);
      observer.observe(card);
    });
  }

  /* ---------- 分類篩選列 ---------- */
  function buildFilters() {
    const counts = {};
    CATALOG.forEach(function (d) { counts[d.category] = (counts[d.category] || 0) + 1; });

    filtersEl.appendChild(makeChip('all', '全部', CATALOG.length, null));
    Object.keys(CATEGORIES).forEach(function (key) {
      filtersEl.appendChild(makeChip(key, CATEGORIES[key].name, counts[key] || 0, CATEGORIES[key].color));
    });
    updateChipSelection();
  }

  function makeChip(key, name, count, color) {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.type = 'button';
    chip.dataset.cat = key;
    chip.setAttribute('role', 'tab');
    if (color) { chip.style.setProperty('--chip-color', color); }
    chip.innerHTML =
      (color ? '<span class="dot"></span>' : '') +
      name + ' <span class="count">' + count + '</span>';
    chip.addEventListener('click', function () {
      activeCat = key;
      updateChipSelection();
      renderGrid();
    });
    return chip;
  }

  function updateChipSelection() {
    filtersEl.querySelectorAll('.chip').forEach(function (chip) {
      chip.setAttribute('aria-selected', chip.dataset.cat === activeCat ? 'true' : 'false');
    });
  }

  /* ---------- 詳情彈窗 ---------- */
  function openModal(def) {
    currentModalDef = def;
    const cat = CATEGORIES[def.category];
    document.getElementById('mNum').textContent = '#' + String(def.id).padStart(3, '0');
    const mCat = document.getElementById('mCat');
    mCat.innerHTML = '<span class="dot"></span>' + cat.name;
    mCat.style.setProperty('--chip-color', cat.color);
    document.getElementById('mTitleZh').textContent = def.titleZh;
    document.getElementById('mTitleEn').textContent = def.titleEn;
    document.getElementById('mScenario').textContent = def.scenario;
    document.getElementById('mTips').textContent = def.tips;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalChart = echarts.init(mChartEl, themeName());
    applyOption(modalChart, def);
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    if (modalChart) { modalChart.dispose(); modalChart = null; }
    currentModalDef = null;
  }

  /* ---------- 主題切換 ---------- */
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('cp-theme', theme); } catch (e) { /* 忽略 */ }
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';

    // 重新以新主題初始化已渲染的圖表
    renderedCharts.forEach(function (c) {
      c.instance.dispose();
      c.instance = echarts.init(c.el, themeName());
      applyOption(c.instance, c.def);
    });
    if (!modal.hidden && currentModalDef) {
      if (modalChart) { modalChart.dispose(); }
      modalChart = echarts.init(mChartEl, themeName());
      applyOption(modalChart, currentModalDef);
    }
  }

  /* ---------- 工具：debounce ---------- */
  function debounce(fn, wait) {
    let t = null;
    return function () {
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(null, args); }, wait);
    };
  }

  /* ---------- 事件綁定 ---------- */
  function wireEvents() {
    searchInput.addEventListener('input', debounce(renderGrid, 180));

    themeToggle.addEventListener('click', function () {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });

    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) { closeModal(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hidden) { closeModal(); }
    });

    window.addEventListener('resize', debounce(function () {
      renderedCharts.forEach(function (c) { c.instance.resize(); });
      if (modalChart) { modalChart.resize(); }
    }, 150));
  }

  /* ---------- 啟動 ---------- */
  function init() {
    themeToggle.textContent = currentTheme() === 'dark' ? '☀️' : '🌙';
    buildFilters();
    renderGrid();
    wireEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
