// nav.js — Shared sidebar & breadcrumb injection
(function () {
  const sections = [
    { title: 'Home', icon: '🏠', href: '/' },
    {
      title: 'Workouts', icon: '🏋️', href: '/workouts/',
      children: [
        { title: 'Phase 1 — Bulking 1', href: '/workouts/phase1-bulking1-workout' },
        { title: 'Phase 2 — Mini Cut', href: '/workouts/phase2-mini-cut-workout' },
        { title: 'Phase 3 — Bulking 2', href: '/workouts/phase3-bulking2-workout' },
        { title: 'Phase 4 — Shredding', href: '/workouts/phase4-shredding-workout' },
        { title: 'Phase 5 — Maintain', href: '/workouts/phase5-maintain-workout' },
      ]
    },
    {
      title: 'Nutrition', icon: '🍽️', href: '/nutrition/',
      children: [
        { title: 'Phase 1 — Bulking 1', href: '/nutrition/phase1-bulking1-nutrition' },
        { title: 'Phase 2 — Mini Cut', href: '/nutrition/phase2-mini-cut-nutrition' },
        { title: 'Phase 3 — Bulking 2', href: '/nutrition/phase3-bulking2-nutrition' },
        { title: 'Phase 4 — Shredding', href: '/nutrition/phase4-shredding-nutrition' },
        { title: 'Phase 5 — Maintain', href: '/nutrition/phase5-maintain-nutrition' },
      ]
    },
    {
      title: 'Hormones & Supps', icon: '🧬', href: '/hormones-and-supplements/',
      children: [
        { title: 'Hormones', href: '/hormones-and-supplements/hormones' },
        { title: 'Supplements', href: '/hormones-and-supplements/supplements' },
      ]
    },
    { title: 'Progress Tracking', icon: '📈', href: '/progress-tracking' },
    { title: 'Research', icon: '📚', href: '/research' },
    { title: '1RM Calculator', icon: '🔢', href: '/tools/one-rep-max' },
  ];

  function isActive(href) {
    const path = window.location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/\/$/, '') || '/';
    const target = href.replace(/\/$/, '') || '/';
    return path === target;
  }

  function isSectionActive(section) {
    if (isActive(section.href)) return true;
    if (section.children) return section.children.some(c => isActive(c.href));
    return false;
  }

  // Build sidebar HTML
  function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    let html = `
      <div class="sidebar-header">
        <div class="sidebar-logo">💪 Body Plan</div>
        <div class="sidebar-subtitle">1-Year Transformation</div>
      </div>
      <nav class="sidebar-nav">`;

    sections.forEach(s => {
      const active = isActive(s.href) ? ' active' : '';
      html += `<a class="nav-link${active}" href="${s.href}">
        <span class="nav-icon">${s.icon}</span>${s.title}</a>`;
      if (s.children) {
        html += '<div class="nav-children">';
        s.children.forEach(c => {
          const cActive = isActive(c.href) ? ' active' : '';
          html += `<a class="nav-link${cActive}" href="${c.href}">${c.title}</a>`;
        });
        html += '</div>';
      }
    });

    html += '</nav>';
    sidebar.innerHTML = html;
  }

  // Build breadcrumb
  function renderBreadcrumb() {
    const bc = document.getElementById('breadcrumb');
    if (!bc) return;

    const path = window.location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
    const parts = path.split('/').filter(Boolean);

    let html = '<a href="/">Home</a>';

    const sectionMap = {
      'workouts': 'Workouts',
      'nutrition': 'Nutrition',
      'hormones-and-supplements': 'Hormones & Supplements',
      'tools': 'Tools'
    };

    if (parts.length > 0) {
      const section = parts[0];
      if (sectionMap[section]) {
        html += `<span class="breadcrumb-sep">›</span>`;
        if (parts.length > 1) {
          html += `<a href="/${section}/">${sectionMap[section]}</a>`;
          html += `<span class="breadcrumb-sep">›</span>`;
          const pageName = document.title.replace(' — Body Plan', '');
          html += `<span>${pageName}</span>`;
        } else {
          html += `<span>${sectionMap[section]}</span>`;
        }
      } else {
        const pageName = document.title.replace(' — Body Plan', '');
        html += `<span class="breadcrumb-sep">›</span><span>${pageName}</span>`;
      }
    }

    bc.innerHTML = html;
  }

  // Mobile menu toggle
  function setupMobile() {
    const toggle = document.createElement('button');
    toggle.className = 'mobile-toggle';
    toggle.setAttribute('aria-label', 'Toggle menu');
    toggle.innerHTML = '☰';
    document.body.appendChild(toggle);

    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    const sidebar = document.getElementById('sidebar');

    function open() { sidebar.classList.add('open'); overlay.classList.add('open'); }
    function close() { sidebar.classList.remove('open'); overlay.classList.remove('open'); }

    toggle.addEventListener('click', () => sidebar.classList.contains('open') ? close() : open());
    overlay.addEventListener('click', close);
  }

  // Init
  renderSidebar();
  renderBreadcrumb();
  setupMobile();
})();
