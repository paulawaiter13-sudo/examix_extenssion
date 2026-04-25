(function () {
  const toastEl = document.getElementById('analyticsToast');
  const kpiGrid = document.getElementById('kpiGrid');
  const trendList = document.getElementById('trendList');
  const heatGrid = document.getElementById('heatGrid');
  const heatStatus = document.getElementById('heatStatus');
  const insightsList = document.getElementById('insightsList');

  const demoData = [
    { subject: 'מתמטיקה', avg: 82, improve: 12, versions: 4 },
    { subject: 'היסטוריה', avg: 76, improve: 18, versions: 5 },
    { subject: 'אנגלית', avg: 88, improve: 7, versions: 3 },
    { subject: 'מדעים', avg: 80, improve: 10, versions: 4 }
  ];

  const gradeHeat = [
    { grade: "ז'", risk: 28 },
    { grade: "ח'", risk: 40 },
    { grade: "ט'", risk: 34 },
    { grade: "י'", risk: 49 },
    { grade: "יא'", risk: 44 },
    { grade: "יב'", risk: 31 }
  ];

  function showToast(msg){
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    toastEl.classList.add('toast-show');
    setTimeout(() => {
      toastEl.classList.remove('toast-show');
      toastEl.hidden = true;
    }, 2200);
  }

  function renderKpis(items){
    const exams = items.reduce((sum, x) => sum + x.versions, 0);
    const avgScore = Math.round(items.reduce((sum, x) => sum + x.avg, 0) / items.length);
    const best = items.slice().sort((a, b) => b.avg - a.avg)[0];
    const growth = Math.round(items.reduce((sum, x) => sum + x.improve, 0) / items.length);

    const kpis = [
      { value: exams, label: 'סה"כ גרסאות פעילות' },
      { value: `${avgScore}%`, label: 'ציון ממוצע כללי' },
      { value: best.subject, label: 'מקצוע מוביל' },
      { value: `+${growth}%`, label: 'מגמת שיפור רבעונית' }
    ];

    kpiGrid.innerHTML = kpis.map((kpi) => `
      <article class="kpi-card">
        <p class="kpi-value">${kpi.value}</p>
        <p class="kpi-label">${kpi.label}</p>
      </article>
    `).join('');
  }

  function renderTrends(metric){
    const labels = metric === 'avg' ? { title: 'ציון ממוצע', suffix: '%' } : { title: 'שיעור שיפור', suffix: '%' };
    trendList.innerHTML = demoData.map((item) => {
      const value = item[metric];
      return `
        <article class="trend-item">
          <strong>${item.subject}</strong>
          <p class="muted small m-0">${labels.title}: ${value}${labels.suffix}</p>
          <div class="bar-track">
            <div class="bar-fill" style="width:${value}%;"></div>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderHeatmap(){
    heatGrid.innerHTML = gradeHeat.map((x) => `
      <button class="heat-cell" type="button" data-grade="${x.grade}" data-risk="${x.risk}">
        <strong>${x.risk}%</strong>
        <span>כיתה ${x.grade}</span>
      </button>
    `).join('');
  }

  function renderInsights(){
    const topRisk = gradeHeat.slice().sort((a, b) => b.risk - a.risk)[0];
    insightsList.innerHTML = [
      `הכיתה עם סיכון ההעתקה הגבוה ביותר: ${topRisk.grade} (${topRisk.risk}%).`,
      'מקצוע היסטוריה מציג את השיפור הגדול ביותר בתקופה האחרונה.',
      'מומלץ להגדיל מגוון גרסאות במבחני כיתה י\' כדי להקטין חזרתיות.'
    ].map((text) => `<li>${text}</li>`).join('');
  }

  if (window.jQuery){
    $('.chart-btn').on('click', function(){
      const metric = $(this).attr('data-metric') || 'avg';
      $('.chart-btn').removeClass('vtab-active');
      $(this).addClass('vtab-active');
      renderTrends(metric);
      showToast(`הגרף עודכן: ${metric === 'avg' ? 'ציון ממוצע' : 'שיעור שיפור'} ✅`);
    });

    $(document).on('click', '.heat-cell', function () {
      $('.heat-cell').removeClass('highlight-cell');
      $(this).addClass('highlight-cell');
      const grade = $(this).attr('data-grade');
      const risk = $(this).attr('data-risk');
      heatStatus.textContent = `כיתה ${grade} נבחרה. רמת סיכון מחושבת: ${risk}%.`;
      showToast(`נטענה תובנה עבור כיתה ${grade}`);
    });

    $('.not-implemented').on('click', function (e) {
      e.preventDefault();
      showToast('הפעולה עדיין לא מומשה 🙂');
    });
  }

  renderKpis(demoData);
  renderTrends('avg');
  renderHeatmap();
  renderInsights();
})();
