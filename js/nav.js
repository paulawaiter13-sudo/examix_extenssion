// js/nav.js
(function () {
  const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const map = {
    'index.html': 'index',
    'upload.html': 'upload',
    'screen3.html': 'screen3',
    'screen4.html': 'screen4',
    'screen5.html': 'screen5',
    'screen6.html': 'screen6',
    'screen7.html': 'screen7',
  };

  const key = map[file] || 'index';
  const activeLink = document.querySelector(`[data-nav="${key}"]`);
  if (activeLink) activeLink.classList.add('nav-active');
})();
