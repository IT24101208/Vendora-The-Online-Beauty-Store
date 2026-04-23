
import { initPage } from '../common.js';
import { productApi } from '../api.js';
import { CATEGORIES, CATEGORY_LABELS } from '../helpers.js';
import { renderProductCard } from '../renderers.js';
import { setError, setLoading, setEmpty } from '../ui.js';

function fillFilters() {
  document.getElementById('user-filter-category').innerHTML =
    `<option value="">All Categories</option>${CATEGORIES.map(c => `<option value="${c}">${CATEGORY_LABELS[c]}</option>`).join('')}`;
}

async function loadCatalog(filters = {}) {
  const grid = document.getElementById('user-products-grid');
  const summary = document.getElementById('user-products-summary');
  setLoading(grid, 'Loading catalog...');
  try {
    const products = await productApi.getAll({ ...filters, status: 'ACTIVE' });
    summary.textContent = `${products.length} active product${products.length === 1 ? '' : 's'} available`;
    if (!products.length) {
      setEmpty(grid, 'No active products found.');
      return;
    }
    grid.innerHTML = products.map(p => renderProductCard(p, { hrefBase:'user-product-detail.html', user:true })).join('');
  } catch (e) {
    setError(grid, e.message);
  }
}

function bind() {
  const form = document.getElementById('user-products-filter-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    loadCatalog({ keyword: fd.get('keyword')?.trim() || '', category: fd.get('category') || '' });
  });
}

initPage('catalog', async () => {
  fillFilters();
  bind();
  await loadCatalog({});
});
