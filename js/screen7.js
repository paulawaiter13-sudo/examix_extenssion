(function () {
  const toastEl = document.getElementById('compareToast');
  const versionA = document.getElementById('versionA');
  const versionB = document.getElementById('versionB');
  const runCompareBtn = document.getElementById('runCompareBtn');
  const compareStatus = document.getElementById('compareStatus');

  const metaA = document.getElementById('metaA');
  const metaB = document.getElementById('metaB');
  const listA = document.getElementById('listA');
  const listB = document.getElementById('listB');
  const timelineList = document.getElementById('timelineList');
  const timelineText = document.getElementById('timelineText');

  const versions = [
    {
      id: 'A',
      title: 'גרסה A',
      createdAt: '2026-04-10T09:10:00',
      subject: 'היסטוריה',
      checks: ['סדר שאלות בסיסי', 'זמן פתרון 45 דק', '2 שאלות פתוחות']
    },
    {
      id: 'B',
      title: 'גרסה B',
      createdAt: '2026-04-15T10:20:00',
      subject: 'היסטוריה',
      checks: ['ערבול שאלות 1-8', 'זמן פתרון 50 דק', '3 שאלות פתוחות']
    },
    {
      id: 'C',
      title: 'גרסה C',
      createdAt: '2026-04-18T12:05:00',
      subject: 'היסטוריה',
      checks: ['ערבול שאלות + תשובות', 'זמן פתרון 50 דק', 'הוספת סעיף בונוס']
    }
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

  function formatDate(iso){
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString('he-IL');
  }

  function renderSelects(){
    const options = versions.map((v) => `<option value="${v.id}">${v.title}</option>`).join('');
    versionA.innerHTML = options;
    versionB.innerHTML = options;
    versionA.value = 'A';
    versionB.value = 'B';
  }

  function renderVersion(targetMeta, targetList, version, compareTo){
    targetMeta.textContent = `${version.subject} • נוצר: ${formatDate(version.createdAt)}`;
    targetList.innerHTML = version.checks.map((text) => {
      const changed = compareTo && !compareTo.checks.includes(text) ? ' changed' : '';
      return `<li class="checkpoint-item${changed}">${text}</li>`;
    }).join('');
  }

  function runComparison(){
    const a = versions.find((v) => v.id === versionA.value);
    const b = versions.find((v) => v.id === versionB.value);
    if (!a || !b) return;
    if (a.id === b.id) {
      compareStatus.textContent = 'יש לבחור שתי גרסאות שונות להשוואה.';
      showToast('בחר/י גרסה שונה בכל צד');
      return;
    }

    renderVersion(metaA, listA, a, b);
    renderVersion(metaB, listB, b, a);

    const diffCount = a.checks.filter((x) => !b.checks.includes(x)).length
      + b.checks.filter((x) => !a.checks.includes(x)).length;
    compareStatus.textContent = `השוואה הושלמה: נמצאו ${diffCount} הבדלים בין ${a.title} ל-${b.title}.`;
    showToast('בוצעה השוואה בין גרסאות ✅');
  }

  function renderTimeline(){
    timelineList.innerHTML = versions.map((v) => `
      <article class="history-item">
        <div class="history-top">
          <div>
            <h3 class="history-title">${v.title}</h3>
            <p class="muted small m-0">${v.subject} • ${formatDate(v.createdAt)}</p>
          </div>
          <div class="history-actions">
            <button class="btn btn-ghost btn-sm timeline-btn" type="button" data-id="${v.id}">פרטים</button>
          </div>
        </div>
      </article>
    `).join('');
  }

  if (window.jQuery){
    $(runCompareBtn).on('click', runComparison);

    $(document).on('click', '.timeline-btn', function(){
      const id = $(this).attr('data-id');
      const item = versions.find((v) => v.id === id);
      if (!item) return;
      timelineText.textContent = `${item.title}: ${item.checks.join(' | ')}`;
      $('.timeline-btn').removeClass('vtab-active');
      $(this).addClass('vtab-active');
      showToast(`נטענו פרטי ${item.title}`);
    });

    $('.not-implemented').on('click', function (e) {
      e.preventDefault();
      showToast('הפעולה עדיין לא מומשה 🙂');
    });
  }

  renderSelects();
  renderTimeline();
  runComparison();
})();
