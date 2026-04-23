
import { initPage } from '../common.js';
import { productApi } from '../api.js';
import { qs, buildImageSrc, formatCurrency, formatDate, CATEGORY_LABELS, getStockClass, getStockLabel, escapeHtml } from '../helpers.js';
import { infoRow } from '../renderers.js';
import { setError, setLoading } from '../ui.js';

async function load() {
  const root = document.getElementById('user-detail-root');
  const id = qs('id');
  if (!id) { setError(root, 'Missing product id'); return; }
  setLoading(root, 'Loading product...');
  try {
    const p = await productApi.getById(id);
    const img = buildImageSrc(p);
    root.innerHTML = `
      <div class="detail-layout">
        <section class="grid gap-16">
          <div class="card" style="overflow:hidden;">
            <div class="hero-image">${img ? `<img src="${img}" alt="${escapeHtml(p.name)}" />` : '<div class="muted">No image</div>'}</div>
            <div class="product-content">
              <div class="flex gap-8" style="flex-wrap:wrap; margin-bottom:14px;">
                <span class="badge cat-badge">${CATEGORY_LABELS[p.category] || p.category || 'Category'}</span>
                <span class="${getStockClass(p)}">${getStockLabel(p)}</span>
              </div>
              <div class="gradient-rose" style="border-radius:18px; padding:18px; color:white;">
                <div class="help" style="color:rgba(255,255,255,.75); font-size:13px;">Price</div>
                <div style="font-size:32px; font-weight:800; margin-top:4px;">${formatCurrency(p.price)}</div>
              </div>
            </div>
          </div>
          ${p.stockQuantity === 0 ? '<div class="alert alert-danger">Currently unavailable.</div>' : p.lowStock ? `<div class="alert alert-warning">Only ${p.stockQuantity} ${escapeHtml(p.unit || 'units')} left.</div>` : ''}
        </section>
        <section class="grid gap-16">
          <div class="card pad">
            <div class="product-brand">${escapeHtml(p.brand || '')}</div>
            <h1 class="page-title" style="font-size:34px; margin-bottom:12px;">${escapeHtml(p.name)}</h1>
            ${p.description ? `<p class="muted" style="line-height:1.7;">${escapeHtml(p.description)}</p>` : ''}
            ${p.tags ? `<div class="flex gap-8" style="margin-top:14px; flex-wrap:wrap;">${p.tags.split(',').map(t => `<span class="badge cat-badge">#${escapeHtml(t.trim())}</span>`).join('')}</div>` : ''}
          </div>
          <div class="card pad"><h2 class="section-title">Product Details</h2><div class="info-list">${
            [
              infoRow('SKU', p.sku),
              infoRow('Shade / Color', p.shade),
              infoRow('Skin Type', p.skinType),
              infoRow('Volume / Weight', p.volume),
              infoRow('Country of Origin', p.countryOfOrigin),
              infoRow('Availability', getStockLabel(p)),
              infoRow('Expiry Date', formatDate(p.expiryDate))
            ].join('')
          }</div></div>
          ${(p.ingredients || p.usageInstructions) ? `<div class="card pad"><h2 class="section-title">Ingredients & Usage</h2>${
            p.ingredients ? `<div style="margin-bottom:14px;"><div class="label">Ingredients</div><div class="alert" style="background:#fff1f5;border-color:#fbcfe8;color:#4b5563;">${escapeHtml(p.ingredients)}</div></div>` : ''
          }${
            p.usageInstructions ? `<div><div class="label">Usage Instructions</div><div class="alert" style="background:#fff1f5;border-color:#fbcfe8;color:#4b5563;">${escapeHtml(p.usageInstructions)}</div></div>` : ''
          }</div>` : ''}
        </section>
      </div>`;
  } catch (e) {
    setError(root, e.message);
  }
}

initPage('catalog', load);
