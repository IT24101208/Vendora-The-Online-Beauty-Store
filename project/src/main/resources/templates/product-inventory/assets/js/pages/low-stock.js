
import { initPage } from '../common.js';
import { productApi } from '../api.js';
import { buildImageSrc, CATEGORY_LABELS, formatCurrency } from '../helpers.js';
import { setError, setLoading, setEmpty } from '../ui.js';

function renderItem(p) {
  const img = buildImageSrc(p);
  const kind = p.stockQuantity === 0 ? 'danger' : 'warning';
  return `<a class="list-item ${kind}" href="product-detail.html?id=${p.id}">
    ${img ? `<img class="small-thumb" src="${img}" alt="${p.name}" />` : '<div class="small-thumb"></div>'}
    <div style="flex:1;min-width:0;">
      <div style="font-weight:800;">${p.name}</div>
      <div class="muted" style="font-size:13px;">${p.brand || ''} · ${CATEGORY_LABELS[p.category] || p.category || ''}</div>
    </div>
    <div class="text-right">
      <div style="font-weight:800; color:${p.stockQuantity === 0 ? '#991b1b' : '#b45309'};">${p.stockQuantity} ${p.unit || 'units'}</div>
      <div class="help">Threshold: ${p.lowStockThreshold}</div>
      <div class="help">${formatCurrency(p.price)}</div>
    </div>
  </a>`;
}

async function load() {
  const rootEl = document.getElementById('low-stock-root');
  setLoading(rootEl, 'Loading stock alerts...');
  try {
    const products = await productApi.getLowStock();
    if (!products.length) {
      setEmpty(rootEl, 'All stocked up. No products are currently low on stock.');
      return;
    }
    const out = products.filter(p => p.stockQuantity === 0);
    const low = products.filter(p => p.stockQuantity > 0);
    rootEl.innerHTML = [
      out.length ? `<section class="card pad" style="margin-bottom:16px;"><h2 class="section-title">Out of Stock (${out.length})</h2><div class="list-group">${out.map(renderItem).join('')}</div></section>` : '',
      low.length ? `<section class="card pad"><h2 class="section-title">Low Stock (${low.length})</h2><div class="list-group">${low.map(renderItem).join('')}</div></section>` : ''
    ].join('');
  } catch (e) {
    setError(rootEl, e.message);
  }
}

initPage('low-stock', load);
