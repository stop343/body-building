// md-loader.js — Fetches .md file specified in body[data-md] and renders via marked.js
(function () {
  var mdPath = document.body.getAttribute('data-md');
  var container = document.getElementById('content');
  if (!mdPath || !container) return;

  // Show loading spinner
  container.innerHTML = '<div class="loading-spinner">Loading content…</div>';

  // Compute base path to project root relative to current HTML file
  var depth = (function () {
    var path = window.location.pathname.replace(/\/[^\/]*$/, '');
    var parts = path.split('/').filter(Boolean);
    var bodyIdx = parts.lastIndexOf('Body');
    if (bodyIdx >= 0) {
      return parts.length - bodyIdx - 1;
    }
    return parts.length;
  })();
  var basePath = depth > 0 ? '../'.repeat(depth) : '';

  fetch(basePath + mdPath)
    .then(function (res) {
      if (!res.ok) throw new Error('Failed to load ' + mdPath);
      return res.text();
    })
    .then(function (md) {
      // Configure marked
      if (typeof marked !== 'undefined') {
        marked.setOptions({
          breaks: true,
          gfm: true
        });
        container.innerHTML = marked.parse(md);
      } else {
        container.innerHTML = '<p style="color:#ff8787;">Error: marked.js not loaded.</p>';
      }

      // Rewrite .md links to .html links for in-site navigation
      container.querySelectorAll('a[href]').forEach(function (a) {
        var href = a.getAttribute('href');
        if (href && href.endsWith('.md') && !href.startsWith('http')) {
          a.setAttribute('href', href.replace(/\.md$/, '.html'));
        }
      });
    })
    .catch(function (err) {
      container.innerHTML = '<div style="color:#ff8787;padding:40px 0;">' +
        '<h2>⚠️ Content not found</h2>' +
        '<p>' + err.message + '</p>' +
        '</div>';
    });
})();
