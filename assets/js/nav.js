// nav.js — Shared sidebar & breadcrumb injection
(function () {
  // Compute base path relative to current HTML file
  // Root-level pages: basePath = ''
  // Subdirectory pages (e.g. nutrition/): basePath = '../'
  var depth = (function () {
    var path = window.location.pathname.replace(/\/[^\/]*$/, '');
    // For file:// protocol, calculate depth from known structure
    var parts = path.split('/').filter(Boolean);
    // Find 'Body' directory in path to determine depth within project
    var bodyIdx = parts.lastIndexOf('Body');
    if (bodyIdx >= 0) {
      return parts.length - bodyIdx - 1;
    }
    // For server, use path depth (root = 0)
    return parts.length;
  })();
  var basePath = depth > 0 ? '../'.repeat(depth) : '';

  var sections = [
    { title: 'Home', icon: '🏠', href: basePath + 'index.html' },
    {
      title: 'Workouts', icon: '🏋️', href: basePath + 'workouts/index.html',
      children: [
        { title: 'Phase 1 — Bulking 1', href: basePath + 'workouts/phase1-bulking1-workout.html' },
        { title: 'Phase 2 — Mini Cut', href: basePath + 'workouts/phase2-mini-cut-workout.html' },
        { title: 'Phase 3 — Bulking 2', href: basePath + 'workouts/phase3-bulking2-workout.html' },
        { title: 'Phase 4 — Shredding', href: basePath + 'workouts/phase4-shredding-workout.html' },
        { title: 'Phase 5 — Maintain', href: basePath + 'workouts/phase5-maintain-workout.html' },
      ]
    },
    {
      title: 'Nutrition', icon: '🍽️', href: basePath + 'nutrition/index.html',
      children: [
        { title: 'Phase 1 — Bulking 1', href: basePath + 'nutrition/phase1-bulking1-nutrition.html' },
        { title: 'Phase 2 — Mini Cut', href: basePath + 'nutrition/phase2-mini-cut-nutrition.html' },
        { title: 'Phase 3 — Bulking 2', href: basePath + 'nutrition/phase3-bulking2-nutrition.html' },
        { title: 'Phase 4 — Shredding', href: basePath + 'nutrition/phase4-shredding-nutrition.html' },
        { title: 'Phase 5 — Maintain', href: basePath + 'nutrition/phase5-maintain-nutrition.html' },
      ]
    },
    {
      title: 'Hormones & Supps', icon: '🧬', href: basePath + 'hormones-and-supplements/index.html',
      children: [
        { title: 'Hormones', href: basePath + 'hormones-and-supplements/hormones.html' },
        { title: 'Supplements', href: basePath + 'hormones-and-supplements/supplements.html' },
      ]
    },
    { title: 'Progress Tracking', icon: '📈', href: basePath + 'progress-tracking.html' },
    { title: 'Research', icon: '📚', href: basePath + 'research.html' },
    { title: '1RM Calculator', icon: '🔢', href: basePath + 'tools/one-rep-max.html' },
  ];

  function normalizePath(p) {
    return p.replace(/\/index\.html$/, '/').replace(/\.html$/, '').replace(/\/$/, '') || '/';
  }

  function isActive(href) {
    var current = normalizePath(window.location.pathname);
    var target = normalizePath(new URL(href, window.location.href).pathname);
    return current === target;
  }

  function isSectionActive(section) {
    if (isActive(section.href)) return true;
    if (section.children) return section.children.some(function (c) { return isActive(c.href); });
    return false;
  }

  // Build sidebar HTML
  function renderSidebar() {
    var sidebar = document.getElementById('sidebar');
    if (!sidebar) return;

    var html = '\n' +
      '      <div class="sidebar-header">\n' +
      '        <div class="sidebar-logo">💪 Body Plan</div>\n' +
      '        <div class="sidebar-subtitle">1-Year Transformation</div>\n' +
      '      </div>\n' +
      '      <nav class="sidebar-nav">';

    sections.forEach(function (s) {
      var active = isActive(s.href) ? ' active' : '';
      html += '<a class="nav-link' + active + '" href="' + s.href + '">' +
        '<span class="nav-icon">' + s.icon + '</span>' + s.title + '</a>';
      if (s.children) {
        html += '<div class="nav-children">';
        s.children.forEach(function (c) {
          var cActive = isActive(c.href) ? ' active' : '';
          html += '<a class="nav-link' + cActive + '" href="' + c.href + '">' + c.title + '</a>';
        });
        html += '</div>';
      }
    });

    html += '</nav>';
    sidebar.innerHTML = html;
  }

  // Build breadcrumb
  function renderBreadcrumb() {
    var bc = document.getElementById('breadcrumb');
    if (!bc) return;

    var path = window.location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
    var parts = path.split('/').filter(Boolean);

    // For file:// protocol, trim to parts after 'Body'
    var bodyIdx = parts.lastIndexOf('Body');
    if (bodyIdx >= 0) {
      parts = parts.slice(bodyIdx + 1);
    }

    var html = '<a href="' + basePath + 'index.html">Home</a>';

    var sectionMap = {
      'workouts': 'Workouts',
      'nutrition': 'Nutrition',
      'hormones-and-supplements': 'Hormones & Supplements',
      'tools': 'Tools'
    };

    if (parts.length > 0) {
      var section = parts[0];
      if (sectionMap[section]) {
        html += '<span class="breadcrumb-sep">›</span>';
        if (parts.length > 1) {
          html += '<a href="' + basePath + section + '/index.html">' + sectionMap[section] + '</a>';
          html += '<span class="breadcrumb-sep">›</span>';
          var pageName = document.title.replace(' — Body Plan', '');
          html += '<span>' + pageName + '</span>';
        } else {
          html += '<span>' + sectionMap[section] + '</span>';
        }
      } else {
        var pageName = document.title.replace(' — Body Plan', '');
        html += '<span class="breadcrumb-sep">›</span><span>' + pageName + '</span>';
      }
    }

    bc.innerHTML = html;
  }

  // Mobile menu toggle
  function setupMobile() {
    var toggle = document.createElement('button');
    toggle.className = 'mobile-toggle';
    toggle.setAttribute('aria-label', 'Toggle menu');
    toggle.innerHTML = '☰';
    document.body.appendChild(toggle);

    var overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    var sidebar = document.getElementById('sidebar');

    function open() { sidebar.classList.add('open'); overlay.classList.add('open'); }
    function close() { sidebar.classList.remove('open'); overlay.classList.remove('open'); }

    toggle.addEventListener('click', function () { sidebar.classList.contains('open') ? close() : open(); });
    overlay.addEventListener('click', close);
  }

  // Init
  renderSidebar();
  renderBreadcrumb();
  setupMobile();
})();
