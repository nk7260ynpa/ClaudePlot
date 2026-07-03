/**
 * ClaudePlot 圖表圖鑑 — 圖表資料目錄。
 *
 * 本檔定義：
 *   1. CATEGORIES：8 大分類的中文名與代表色（取自 dataviz 驗證過的類別色盤）。
 *   2. CATALOG：約 32 種圖表，每筆含中英標題、適用場景、使用提示，
 *      以及一份內建合成示範資料的 ECharts option。
 *
 * 說明：
 *   - 各 option 刻意「不」寫死系列顏色與文字色，改由 app.js 依明暗主題
 *     注入色盤與 ECharts 主題，確保切換主題時全站一致且對比達標。
 *   - 熱力/地圖等「連續量級」圖採單一藍色漸層（sequential ramp），符合
 *     dataviz「sequential = 單一色相、淺→深」的規範。
 */

/* 分類中繼資料：key -> { name（中文）, color（chip 代表色） } */
const CATEGORIES = {
  comparison:   { name: '比較',      color: '#2a78d6' },
  trend:        { name: '趨勢',      color: '#1baf7a' },
  distribution: { name: '分佈',      color: '#eda100' },
  composition:  { name: '組成',      color: '#eb6834' },
  relationship: { name: '關聯',      color: '#4a3aa7' },
  hierarchy:    { name: '階層',      color: '#e87ba4' },
  flowProgress: { name: '流程/進度', color: '#e34948' },
  geo:          { name: '地理',      color: '#008300' },
};

/* 單一藍色漸層（sequential）：供熱力圖、日曆、區域地圖等連續量級使用 */
const SEQ_BLUE = ['#cde2fb', '#9ec5f4', '#5598e7', '#2a78d6', '#184f95'];

/* 圖鑑主資料。id 依序 1..N，作為 Pokédex 風格編號。 */
const CATALOG = [
  /* ============ 比較 comparison ============ */
  {
    id: 1,
    category: 'comparison',
    titleZh: '長條圖',
    titleEn: 'Bar Chart',
    scenario: '比較不同類別之間的數值大小，例如各產品銷售額。',
    tips: '類別數量建議少於 12；Y 軸務必從 0 起算，避免誇大差距。',
    option: {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '12%', containLabel: true },
      xAxis: { type: 'category', data: ['產品A', '產品B', '產品C', '產品D', '產品E'] },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: [120, 200, 150, 80, 170],
        itemStyle: { borderRadius: [4, 4, 0, 0] },
      }],
    },
  },
  {
    id: 2,
    category: 'comparison',
    titleZh: '橫向長條圖',
    titleEn: 'Horizontal Bar Chart',
    scenario: '類別名稱較長或做排行榜時，橫放更易閱讀。',
    tips: '常依數值排序成排行榜；標籤長時橫向可完整顯示不重疊。',
    option: {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '6%', bottom: '3%', top: '8%', containLabel: true },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: ['台南', '桃園', '台中', '高雄', '台北'] },
      series: [{
        type: 'bar',
        data: [190, 210, 240, 280, 320],
        itemStyle: { borderRadius: [0, 4, 4, 0] },
      }],
    },
  },
  {
    id: 3,
    category: 'comparison',
    titleZh: '分組長條圖',
    titleEn: 'Grouped Bar Chart',
    scenario: '在各類別下同時比較多個系列，例如各季不同年度營收。',
    tips: '系列數建議 2–4 個；過多會擁擠，可改用小倍數（small multiples）。',
    option: {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { top: 0 },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '14%', containLabel: true },
      xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
      yAxis: { type: 'value' },
      series: [
        { name: '2023', type: 'bar', data: [120, 132, 101, 134] },
        { name: '2024', type: 'bar', data: [150, 160, 141, 175] },
      ],
    },
  },
  {
    id: 4,
    category: 'comparison',
    titleZh: '象形長條圖',
    titleEn: 'Pictorial Bar Chart',
    scenario: '以重複圖示強化比較，適合資訊圖表與簡報。',
    tips: '圖示需語意清楚且大小一致；重視覺傳達，不宜用於精密比較。',
    option: {
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '12%', containLabel: true },
      xAxis: { type: 'category', data: ['金', '木', '水', '火', '土'], axisTick: { show: false } },
      yAxis: { type: 'value', splitLine: { show: false } },
      series: [{
        type: 'pictorialBar',
        symbol: 'circle',
        symbolRepeat: true,
        symbolSize: [14, 14],
        symbolMargin: 3,
        data: [5, 8, 6, 9, 4],
      }],
    },
  },
  {
    id: 5,
    category: 'comparison',
    titleZh: '雷達圖',
    titleEn: 'Radar Chart',
    scenario: '在多個維度上比較少數對象，例如角色能力值、產品評分。',
    tips: '維度建議 3–8 個並各自標明量級；系列過多會相互遮蓋。',
    option: {
      tooltip: {},
      legend: { top: 0 },
      radar: {
        indicator: [
          { name: '攻擊', max: 100 },
          { name: '防禦', max: 100 },
          { name: '速度', max: 100 },
          { name: '魔力', max: 100 },
          { name: '體力', max: 100 },
        ],
        radius: '62%',
        center: ['50%', '56%'],
      },
      series: [{
        type: 'radar',
        areaStyle: { opacity: 0.12 },
        data: [
          { value: [90, 70, 85, 60, 80], name: '角色 A' },
          { value: [60, 85, 70, 90, 65], name: '角色 B' },
        ],
      }],
    },
  },

  /* ============ 趨勢 trend ============ */
  {
    id: 6,
    category: 'trend',
    titleZh: '折線圖',
    titleEn: 'Line Chart',
    scenario: '呈現數值隨時間的連續變化與趨勢走向。',
    tips: '適合連續型時間軸；系列過多時用直接標籤取代圖例找線。',
    option: {
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: { type: 'value' },
      series: [{ type: 'line', data: [820, 932, 901, 934, 1290, 1330], smooth: true }],
    },
  },
  {
    id: 7,
    category: 'trend',
    titleZh: '面積圖',
    titleEn: 'Area Chart',
    scenario: '強調趨勢的同時凸顯累積量或量體大小。',
    tips: '單一系列適合；多系列重疊會互相遮蓋，改用堆疊面積。',
    option: {
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'] },
      yAxis: { type: 'value' },
      series: [{ type: 'line', data: [120, 200, 150, 80, 170, 220, 190], areaStyle: { opacity: 0.25 }, smooth: true }],
    },
  },
  {
    id: 8,
    category: 'trend',
    titleZh: '堆疊面積圖',
    titleEn: 'Stacked Area Chart',
    scenario: '呈現多系列隨時間的總量與組成變化。',
    tips: '僅適合「部分合計為整體」的資料；系列排序由穩定到波動較易讀。',
    option: {
      tooltip: { trigger: 'axis' },
      legend: { top: 0 },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '14%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: { type: 'value' },
      series: [
        { name: '行動', type: 'line', stack: '合計', areaStyle: { opacity: 0.35 }, data: [120, 132, 101, 134, 90, 230] },
        { name: '桌機', type: 'line', stack: '合計', areaStyle: { opacity: 0.35 }, data: [220, 182, 191, 234, 290, 330] },
        { name: '平板', type: 'line', stack: '合計', areaStyle: { opacity: 0.35 }, data: [150, 232, 201, 154, 190, 330] },
      ],
    },
  },
  {
    id: 9,
    category: 'trend',
    titleZh: '階梯圖',
    titleEn: 'Step Line Chart',
    scenario: '表達階段性、跳躍式變動，例如費率調整、庫存位階。',
    tips: '值在兩點間維持不變時，階梯比斜線更真實。',
    option: {
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
      xAxis: { type: 'category', data: ['00', '04', '08', '12', '16', '20', '24'] },
      yAxis: { type: 'value' },
      series: [{ type: 'line', step: 'end', data: [3, 3, 5, 5, 8, 6, 6] }],
    },
  },
  {
    id: 10,
    category: 'trend',
    titleZh: 'K 線圖',
    titleEn: 'Candlestick Chart',
    scenario: '金融時序中呈現開盤、收盤、最高、最低價。',
    tips: '資料格式為 [開,收,低,高]；常搭配成交量與均線一同觀察。',
    option: {
      tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
      xAxis: { type: 'category', data: ['05-01', '05-02', '05-03', '05-04', '05-05', '05-06'] },
      yAxis: { type: 'value', scale: true },
      series: [{
        type: 'candlestick',
        data: [
          [20, 34, 18, 36],
          [34, 28, 26, 38],
          [28, 40, 25, 42],
          [40, 38, 34, 45],
          [38, 50, 36, 52],
          [50, 46, 44, 55],
        ],
      }],
    },
  },
  {
    id: 11,
    category: 'trend',
    titleZh: '河流圖',
    titleEn: 'ThemeRiver',
    scenario: '同時觀察多個主題隨時間的消長與相對佔比。',
    tips: '主題數不宜太多；著重「趨勢感」而非精確讀值。',
    option: {
      tooltip: { trigger: 'axis', axisPointer: { type: 'line' } },
      legend: { top: 0 },
      singleAxis: { type: 'time', top: 40, bottom: 20, axisPointer: { label: { show: true } } },
      series: [{
        type: 'themeRiver',
        emphasis: { itemStyle: { shadowBlur: 8 } },
        data: [
          ['2024-01-01', 10, '搜尋'], ['2024-02-01', 15, '搜尋'], ['2024-03-01', 12, '搜尋'], ['2024-04-01', 18, '搜尋'],
          ['2024-01-01', 8, '社群'], ['2024-02-01', 12, '社群'], ['2024-03-01', 20, '社群'], ['2024-04-01', 16, '社群'],
          ['2024-01-01', 5, '直接'], ['2024-02-01', 9, '直接'], ['2024-03-01', 7, '直接'], ['2024-04-01', 14, '直接'],
        ],
      }],
    },
  },

  /* ============ 分佈 distribution ============ */
  {
    id: 12,
    category: 'distribution',
    titleZh: '散佈圖',
    titleEn: 'Scatter Chart',
    scenario: '觀察兩個數值變數之間的相關性或群聚。',
    tips: '點過多時降低不透明度看密度；可加趨勢線輔助判讀。',
    option: {
      tooltip: { trigger: 'item' },
      grid: { left: '3%', right: '6%', bottom: '3%', top: '8%', containLabel: true },
      xAxis: { type: 'value', scale: true },
      yAxis: { type: 'value', scale: true },
      series: [{
        type: 'scatter',
        symbolSize: 12,
        data: [[10, 8], [12, 10], [15, 14], [18, 15], [21, 20], [24, 22], [27, 25], [30, 31], [33, 30], [36, 38]],
      }],
    },
  },
  {
    id: 13,
    category: 'distribution',
    titleZh: '氣泡圖',
    titleEn: 'Bubble Chart',
    scenario: '在散佈圖上以泡泡大小加入第三個變數。',
    tips: '面積（非半徑）應正比於數值，否則會誤導量級。',
    option: {
      tooltip: { trigger: 'item' },
      grid: { left: '3%', right: '6%', bottom: '3%', top: '8%', containLabel: true },
      xAxis: { type: 'value', scale: true },
      yAxis: { type: 'value', scale: true },
      series: [{
        type: 'scatter',
        data: [[10, 8, 30], [15, 20, 60], [22, 14, 45], [28, 30, 90], [35, 22, 50], [40, 38, 75]],
        symbolSize: function (d) { return Math.sqrt(d[2]) * 4; },
        itemStyle: { opacity: 0.7 },
      }],
    },
  },
  {
    id: 14,
    category: 'distribution',
    titleZh: '直方圖',
    titleEn: 'Histogram',
    scenario: '呈現單一連續變數的分佈形狀（需先分箱）。',
    tips: 'ECharts 無原生直方圖，以「無間隙長條」表現預先分箱後的次數。',
    option: {
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
      xAxis: { type: 'category', data: ['0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70'] },
      yAxis: { type: 'value', name: '次數' },
      series: [{ type: 'bar', barCategoryGap: '1%', data: [2, 8, 18, 32, 25, 12, 5] }],
    },
  },
  {
    id: 15,
    category: 'distribution',
    titleZh: '箱形圖',
    titleEn: 'Box Plot',
    scenario: '比較多組資料的中位數、四分位距與離群值。',
    tips: '資料格式為 [最小,Q1,中位,Q3,最大]；適合對照多組分佈。',
    option: {
      tooltip: { trigger: 'item' },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '8%', containLabel: true },
      xAxis: { type: 'category', data: ['A 班', 'B 班', 'C 班', 'D 班'] },
      yAxis: { type: 'value' },
      series: [{
        type: 'boxplot',
        data: [
          [60, 70, 78, 85, 95],
          [55, 65, 72, 80, 90],
          [50, 68, 75, 88, 98],
          [62, 72, 80, 86, 92],
        ],
      }],
    },
  },
  {
    id: 16,
    category: 'distribution',
    titleZh: '熱力圖',
    titleEn: 'Heatmap',
    scenario: '以顏色深淺呈現二維矩陣的密度或相關程度。',
    tips: '採單一色相由淺到深；顏色是量級，勿用彩虹色階。',
    option: {
      tooltip: { position: 'top' },
      grid: { left: '3%', right: '8%', bottom: '12%', top: '8%', containLabel: true },
      xAxis: { type: 'category', data: ['週一', '週二', '週三', '週四', '週五'], splitArea: { show: true } },
      yAxis: { type: 'category', data: ['早', '午', '晚'], splitArea: { show: true } },
      visualMap: { min: 0, max: 10, calculable: true, orient: 'horizontal', left: 'center', bottom: '0%', inRange: { color: SEQ_BLUE } },
      series: [{
        type: 'heatmap',
        data: [[0, 0, 3], [0, 1, 5], [0, 2, 7], [1, 0, 4], [1, 1, 8], [1, 2, 6], [2, 0, 2], [2, 1, 9], [2, 2, 5], [3, 0, 6], [3, 1, 7], [3, 2, 10], [4, 0, 8], [4, 1, 4], [4, 2, 3]],
        label: { show: true },
      }],
    },
  },

  /* ============ 組成 composition ============ */
  {
    id: 17,
    category: 'composition',
    titleZh: '圓餅圖',
    titleEn: 'Pie Chart',
    scenario: '呈現少數幾個部分佔整體的比例。',
    tips: '分類建議 ≤ 5 且合計為 100%；細項多請改長條圖比較。',
    option: {
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { top: 0 },
      series: [{
        type: 'pie',
        radius: '62%',
        center: ['50%', '58%'],
        data: [
          { value: 1048, name: '搜尋引擎' },
          { value: 735, name: '直接進入' },
          { value: 580, name: '電子郵件' },
          { value: 484, name: '聯播網' },
          { value: 300, name: '影音廣告' },
        ],
      }],
    },
  },
  {
    id: 18,
    category: 'composition',
    titleZh: '環圈圖',
    titleEn: 'Doughnut Chart',
    scenario: '呈現佔比，並可於中心留白放置總計或標題。',
    tips: '與圓餅同理，分類宜少；中心空白可放關鍵數字。',
    option: {
      tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
      legend: { top: 0 },
      series: [{
        type: 'pie',
        radius: ['42%', '66%'],
        center: ['50%', '58%'],
        avoidLabelOverlap: false,
        label: { show: true, formatter: '{b}\n{d}%' },
        data: [
          { value: 40, name: 'iOS' },
          { value: 38, name: 'Android' },
          { value: 12, name: 'Windows' },
          { value: 10, name: '其他' },
        ],
      }],
    },
  },
  {
    id: 19,
    category: 'composition',
    titleZh: '玫瑰圖',
    titleEn: 'Rose / Nightingale Chart',
    scenario: '類別佔比且以扇形半徑同時表達數量高低。',
    tips: '半徑放大差異、易誇大；適合強調而非精確讀值。',
    option: {
      tooltip: { trigger: 'item', formatter: '{b}: {c}' },
      legend: { top: 0 },
      series: [{
        type: 'pie',
        radius: ['15%', '72%'],
        center: ['50%', '58%'],
        roseType: 'area',
        data: [
          { value: 30, name: '一月' },
          { value: 28, name: '二月' },
          { value: 26, name: '三月' },
          { value: 24, name: '四月' },
          { value: 22, name: '五月' },
          { value: 20, name: '六月' },
        ],
      }],
    },
  },
  {
    id: 20,
    category: 'composition',
    titleZh: '堆疊長條圖',
    titleEn: 'Stacked Bar Chart',
    scenario: '比較各類別總量，同時看內部組成佔比。',
    tips: '最底層系列基線一致最好比；段與段之間留白區隔更清楚。',
    option: {
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      legend: { top: 0 },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '14%', containLabel: true },
      xAxis: { type: 'category', data: ['台北', '台中', '高雄', '台南'] },
      yAxis: { type: 'value' },
      series: [
        { name: '食品', type: 'bar', stack: '合計', data: [120, 132, 101, 134] },
        { name: '服飾', type: 'bar', stack: '合計', data: [220, 182, 191, 154] },
        { name: '3C', type: 'bar', stack: '合計', data: [150, 212, 201, 194] },
      ],
    },
  },
  {
    id: 21,
    category: 'composition',
    titleZh: '漏斗圖',
    titleEn: 'Funnel Chart',
    scenario: '呈現多階段流程逐層留存或轉換率。',
    tips: '階段需具先後順序且數量遞減；標出各段轉換率更有洞見。',
    option: {
      tooltip: { trigger: 'item', formatter: '{b}: {c}' },
      legend: { top: 0 },
      series: [{
        type: 'funnel',
        left: '10%',
        right: '10%',
        top: 40,
        bottom: 10,
        label: { show: true, position: 'inside' },
        data: [
          { value: 100, name: '瀏覽' },
          { value: 80, name: '加入購物車' },
          { value: 60, name: '結帳' },
          { value: 40, name: '付款' },
          { value: 25, name: '完成' },
        ],
      }],
    },
  },

  /* ============ 關聯 relationship ============ */
  {
    id: 22,
    category: 'relationship',
    titleZh: '關係圖',
    titleEn: 'Graph / Network',
    scenario: '呈現節點之間的連結關係，例如社群網路、依賴圖。',
    tips: '節點過多會糾結；可用力導向佈局並突顯重點節點。',
    option: {
      tooltip: {},
      series: [{
        type: 'graph',
        layout: 'force',
        roam: true,
        label: { show: true },
        force: { repulsion: 140, edgeLength: 70 },
        data: [
          { name: '核心', symbolSize: 42 },
          { name: '模組A', symbolSize: 26 },
          { name: '模組B', symbolSize: 26 },
          { name: '模組C', symbolSize: 26 },
          { name: '工具1', symbolSize: 16 },
          { name: '工具2', symbolSize: 16 },
        ],
        links: [
          { source: '核心', target: '模組A' },
          { source: '核心', target: '模組B' },
          { source: '核心', target: '模組C' },
          { source: '模組A', target: '工具1' },
          { source: '模組B', target: '工具2' },
          { source: '模組C', target: '工具1' },
        ],
      }],
    },
  },
  {
    id: 23,
    category: 'relationship',
    titleZh: '桑基圖',
    titleEn: 'Sankey Diagram',
    scenario: '呈現流量在各節點間的流向與量體大小。',
    tips: '連結寬度即流量；適合能源流、預算流、使用者路徑。',
    option: {
      tooltip: { trigger: 'item', triggerOn: 'mousemove' },
      series: [{
        type: 'sankey',
        emphasis: { focus: 'adjacency' },
        data: [
          { name: '能源輸入' }, { name: '發電' }, { name: '工業' }, { name: '住宅' }, { name: '損耗' },
        ],
        links: [
          { source: '能源輸入', target: '發電', value: 100 },
          { source: '發電', target: '工業', value: 45 },
          { source: '發電', target: '住宅', value: 35 },
          { source: '發電', target: '損耗', value: 20 },
        ],
      }],
    },
  },
  {
    id: 24,
    category: 'relationship',
    titleZh: '平行座標',
    titleEn: 'Parallel Coordinates',
    scenario: '在多個維度上同時比較多筆高維資料。',
    tips: '軸序會影響觀感；可調整軸序或刷選（brushing）找出型態。',
    option: {
      tooltip: {},
      parallelAxis: [
        { dim: 0, name: '價格' },
        { dim: 1, name: '重量' },
        { dim: 2, name: '續航' },
        { dim: 3, name: '評分' },
      ],
      parallel: { top: '12%', left: '6%', right: '10%', bottom: '10%' },
      series: [{
        type: 'parallel',
        lineStyle: { width: 2, opacity: 0.6 },
        data: [
          [12000, 180, 12, 4.5],
          [8000, 210, 10, 4.0],
          [15000, 160, 14, 4.8],
          [6000, 230, 8, 3.6],
          [10000, 190, 11, 4.2],
        ],
      }],
    },
  },

  /* ============ 階層 hierarchy ============ */
  {
    id: 25,
    category: 'hierarchy',
    titleZh: '樹狀圖',
    titleEn: 'Tree',
    scenario: '呈現階層／父子結構，例如組織圖、檔案樹。',
    tips: '層數深時可摺疊展開；橫向佈局對長標籤較友善。',
    option: {
      tooltip: { trigger: 'item', triggerOn: 'mousemove' },
      series: [{
        type: 'tree',
        data: [{
          name: '根',
          children: [
            { name: 'A', children: [{ name: 'A1' }, { name: 'A2' }] },
            { name: 'B', children: [{ name: 'B1' }, { name: 'B2' }, { name: 'B3' }] },
          ],
        }],
        top: '6%',
        left: '8%',
        bottom: '6%',
        right: '20%',
        symbolSize: 10,
        label: { position: 'left', verticalAlign: 'middle', align: 'right' },
        leaves: { label: { position: 'right', verticalAlign: 'middle', align: 'left' } },
        expandAndCollapse: true,
      }],
    },
  },
  {
    id: 26,
    category: 'hierarchy',
    titleZh: '矩形樹狀圖',
    titleEn: 'Treemap',
    scenario: '以巢狀矩形面積表達階層資料的佔比。',
    tips: '面積代表數量；適合空間有限又要看層級佔比時。',
    option: {
      tooltip: { formatter: '{b}: {c}' },
      series: [{
        type: 'treemap',
        roam: false,
        data: [
          { name: '前端', children: [{ name: 'React', value: 20 }, { name: 'Vue', value: 12 }, { name: '其他', value: 8 }] },
          { name: '後端', children: [{ name: 'Node', value: 15 }, { name: 'Python', value: 12 }, { name: 'Go', value: 8 }] },
          { name: '資料庫', children: [{ name: 'MySQL', value: 12 }, { name: 'Mongo', value: 8 }, { name: 'Redis', value: 5 }] },
        ],
      }],
    },
  },
  {
    id: 27,
    category: 'hierarchy',
    titleZh: '旭日圖',
    titleEn: 'Sunburst',
    scenario: '以環形層層呈現多層階層與各層佔比。',
    tips: '內圈為上層、外圈為下層；層數過多外圈會過細。',
    option: {
      tooltip: { formatter: '{b}: {c}' },
      series: [{
        type: 'sunburst',
        radius: ['12%', '92%'],
        center: ['50%', '52%'],
        data: [
          { name: '亞洲', children: [{ name: '台灣', value: 10 }, { name: '日本', value: 12 }, { name: '韓國', value: 8 }] },
          { name: '歐洲', children: [{ name: '德國', value: 9 }, { name: '法國', value: 7 }, { name: '英國', value: 8 }] },
          { name: '美洲', children: [{ name: '美國', value: 14 }, { name: '加拿大', value: 6 }] },
        ],
        label: { rotate: 'radial' },
      }],
    },
  },

  /* ============ 流程/進度 flowProgress ============ */
  {
    id: 28,
    category: 'flowProgress',
    titleZh: '儀表板',
    titleEn: 'Gauge Chart',
    scenario: '呈現單一 KPI 相對目標的達成程度。',
    tips: '一次只放一個關鍵指標；標明區間門檻更有意義。',
    option: {
      tooltip: { formatter: '{b}: {c}%' },
      series: [{
        type: 'gauge',
        progress: { show: true, width: 14 },
        axisLine: { lineStyle: { width: 14 } },
        axisTick: { show: false },
        splitLine: { length: 12 },
        detail: { valueAnimation: true, formatter: '{value}%', fontSize: 22, offsetCenter: [0, '60%'] },
        data: [{ value: 72, name: '完成率' }],
      }],
    },
  },
  {
    id: 29,
    category: 'flowProgress',
    titleZh: '甘特圖',
    titleEn: 'Gantt Chart',
    scenario: '呈現專案各任務的時間區段與排程重疊。',
    tips: '以 ECharts custom 系列繪製；長條起訖對應時間軸。',
    option: (function () {
      const tasks = [
        { name: '需求分析', cat: 0, start: 0, end: 3 },
        { name: '設計', cat: 1, start: 2, end: 6 },
        { name: '開發', cat: 2, start: 5, end: 12 },
        { name: '測試', cat: 3, start: 10, end: 15 },
        { name: '上線', cat: 4, start: 14, end: 16 },
      ];
      const cats = ['需求分析', '設計', '開發', '測試', '上線'];
      const colors = ['#2a78d6', '#1baf7a', '#eda100', '#eb6834', '#e34948'];
      return {
        tooltip: {
          formatter: function (p) {
            return p.name + '：第 ' + p.value[1] + ' ~ ' + p.value[2] + ' 週';
          },
        },
        grid: { left: '14%', right: '5%', top: '8%', bottom: '10%' },
        xAxis: { type: 'value', name: '週', min: 0, max: 16 },
        yAxis: { type: 'category', data: cats, inverse: true },
        series: [{
          type: 'custom',
          renderItem: function (params, api) {
            const cat = api.value(0);
            const start = api.coord([api.value(1), cat]);
            const end = api.coord([api.value(2), cat]);
            const height = api.size([0, 1])[1] * 0.5;
            const rect = {
              x: start[0],
              y: start[1] - height / 2,
              width: end[0] - start[0],
              height: height,
            };
            return {
              type: 'rect',
              shape: rect,
              style: { fill: colors[cat % colors.length] },
            };
          },
          encode: { x: [1, 2], y: 0 },
          data: tasks.map(function (t) {
            return { name: t.name, value: [t.cat, t.start, t.end] };
          }),
        }],
      };
    })(),
  },
  {
    id: 30,
    category: 'flowProgress',
    titleZh: '日曆熱力圖',
    titleEn: 'Calendar Heatmap',
    scenario: '以日曆格子呈現每日數值，如提交次數、活躍度。',
    tips: '直覺看出週期與熱區；顏色為量級採單一色相漸層。',
    option: {
      tooltip: {
        formatter: function (p) { return p.value[0] + '：' + p.value[1]; },
      },
      visualMap: { min: 0, max: 20, orient: 'horizontal', left: 'center', top: 0, calculable: true, inRange: { color: SEQ_BLUE } },
      calendar: { range: '2024-03', cellSize: ['auto', 18], top: 60, left: 30, right: 20 },
      series: [{
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: (function () {
          const arr = [];
          for (let i = 1; i <= 31; i++) {
            const d = '2024-03-' + String(i).padStart(2, '0');
            arr.push([d, (i * 7) % 20]);
          }
          return arr;
        })(),
      }],
    },
  },

  /* ============ 地理 geo（需註冊 world 地圖）============ */
  {
    id: 31,
    category: 'geo',
    titleZh: '區域地圖',
    titleEn: 'Choropleth Map',
    scenario: '以顏色深淺呈現各地區的數值分佈。',
    tips: '顏色為量級採單一色相；大面積地區易被視覺放大，注意解讀。',
    needsMap: true,
    option: {
      tooltip: { trigger: 'item', formatter: '{b}: {c}' },
      visualMap: { min: 0, max: 100, left: 'left', bottom: '5%', calculable: true, inRange: { color: SEQ_BLUE } },
      series: [{
        type: 'map',
        map: 'world',
        roam: true,
        emphasis: { label: { show: false } },
        data: [
          { name: 'China', value: 95 },
          { name: 'United States', value: 88 },
          { name: 'Japan', value: 70 },
          { name: 'Germany', value: 65 },
          { name: 'Brazil', value: 50 },
          { name: 'India', value: 80 },
          { name: 'Australia', value: 40 },
        ],
      }],
    },
  },
  {
    id: 32,
    category: 'geo',
    titleZh: '散點地圖',
    titleEn: 'Scatter on Map',
    scenario: '在地圖上標示地理座標點位，如城市、事件。',
    tips: '點大小可再編一個變數；點位密集時降低不透明度看疊合。',
    needsMap: true,
    option: {
      tooltip: { trigger: 'item', formatter: function (p) { return p.name; } },
      geo: { map: 'world', roam: true, itemStyle: { areaColor: '#e6e6e2', borderColor: '#b4b3ad' } },
      series: [{
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: 12,
        data: [
          { name: '台北', value: [121.5, 25.0, 90] },
          { name: '東京', value: [139.7, 35.7, 85] },
          { name: '紐約', value: [-74.0, 40.7, 95] },
          { name: '倫敦', value: [-0.1, 51.5, 80] },
          { name: '雪梨', value: [151.2, -33.9, 60] },
          { name: '新加坡', value: [103.8, 1.35, 70] },
        ],
      }],
    },
  },
];
