// Shared navigation injected into every page
(function() {
  function buildNav(activePage) {
    const nav = document.createElement('nav');
    nav.className = 'duke-nav';
    nav.innerHTML = `
      <a href="index.html" class="duke-nav-brand">⚡ THE VAULT</a>
      <div class="duke-nav-links">
        <a href="index.html" class="duke-nav-link${activePage==='home'?' active':''}">HOME</a>
        <a href="vault.html" class="duke-nav-link${activePage==='vault'?' active':''}">LIBRARY</a>
        <a href="forge.html" class="duke-nav-link${activePage==='forge'?' active':''}">VOICE FORGE</a>
        <a href="punch.html" class="duke-nav-link${activePage==='punch'?' active':''}">PUNCH</a>
        <a href="api.html" class="duke-nav-link${activePage==='api'?' active':''}">API</a>
      </div>
    `;
    document.body.insertBefore(nav, document.body.firstChild);
  }
  // Page sets window.__DUKE_PAGE__ before loading this script
  document.addEventListener('DOMContentLoaded', () => {
    buildNav(window.__DUKE_PAGE__ || 'home');
  });
})();
