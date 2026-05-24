// md-loader.js — Fetches .md file specified in body[data-md] and renders via marked.js
(function () {
  const mdPath = document.body.getAttribute('data-md');
  const container = document.getElementById('content');
  if (!mdPath || !container) return;

  // Show loading spinner
  container.innerHTML = '<div class="loading-spinner">Loading content…</div>';

  fetch('/' + mdPath)
    .then(res => {
      if (!res.ok) throw new Error('Failed to load ' + mdPath);
      return res.text();
    })
    .then(md => {
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
      container.querySelectorAll('a[href]').forEach(a => {
        const href = a.getAttribute('href');
        if (href && href.endsWith('.md') && !href.startsWith('http')) {
          a.setAttribute('href', href.replace(/\.md$/, ''));
        }
      });
    })
    .catch(err => {
      container.innerHTML = `<div style="color:#ff8787;padding:40px 0;">
        <h2>⚠️ Content not found</h2>
        <p>${err.message}</p>
      </div>`;
    });
})();
