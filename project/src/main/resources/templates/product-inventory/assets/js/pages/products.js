
import { initPage } from '../common.js';
import { productApi } from '../api.js';
import { CATEGORIES, CATEGORY_LABELS } from '../helpers.js';
import { renderProductCard, renderProductRow } from '../renderers.js';
import { setError, setLoading, setEmpty } from '../ui.js';

let view = 'grid';

function fillFilters() {
  document.getElementById('filter-category').innerHTML =
    `<option value="">All Categories</option>${CATEGORIES.map(c => `<option value="${c}">${CATEGORY_LABELS[c]}</option>`).join('')}`;
  document.getElementById('filter-status').innerHTML = `
    <option value="">All Status</option>
    <option value="ACTIVE">Active</option>
    <option value="INACTIVE">Inactive</option>
    <option value="DISCONTINUED">Discontinued</option>`;
}

async function loadProducts(filters = {}) {
  const grid = document.getElementById('products-grid');
  const table = document.getElementById('products-table-body');
  const summary = document.getElementById('products-summary');
  setLoading(view === 'grid' ? grid : table, 'Loading products...');
  try {
    const products = await productApi.getAll(filters);
    summary.textContent = `${products.length} product${products.length === 1 ? '' : 's'} found`;
    if (!products.length) {
      if (view === 'grid') setEmpty(grid, 'No products match the selected filters.');
      else setEmpty(table, 'No products match the selected filters.');
      return;
    }
    grid.innerHTML = products.map(p => renderProductCard(p)).join('');
    table.innerHTML = products.map(p => renderProductRow(p)).join('');
  } catch (e) {
    if (view === 'grid') setError(grid, e.message);
    else setError(table, e.message);
  }
}

function bind() {
  const form = document.getElementById('products-filter-form');
  const gridWrap = document.getElementById('products-grid');
  const tableWrap = document.getElementById('products-table');
  document.getElementById('view-grid').addEventListener('click', () => {
    view = 'grid';
    gridWrap.classList.remove('hidden');
    tableWrap.classList.add('hidden');
    document.getElementById('view-grid').classList.add('active');
    document.getElementById('view-list').classList.remove('active');
    form.requestSubmit();
  });
  document.getElementById('view-list').addEventListener('click', () => {
    view = 'list';
    tableWrap.classList.remove('hidden');
    gridWrap.classList.add('hidden');
    document.getElementById('view-list').classList.add('active');
    document.getElementById('view-grid').classList.remove('active');
    form.requestSubmit();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    loadProducts({
      keyword: fd.get('keyword')?.trim() || '',
      category: fd.get('category') || '',
      status: fd.get('status') || ''
    });
  });
  document.getElementById('reset-filters').addEventListener('click', () => {
    form.reset();
    loadProducts({});
  });
}

initPage('inventory', async () => {
  fillFilters();
  bind();
  await loadProducts({});
});
