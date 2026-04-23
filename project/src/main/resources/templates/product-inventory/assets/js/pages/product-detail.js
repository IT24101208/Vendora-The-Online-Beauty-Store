
import { initPage } from '../common.js';
import { productApi } from '../api.js';
import { qs, buildImageSrc, formatCurrency, formatDate, CATEGORY_LABELS, getStockClass, getStockLabel, getStatusClass, escapeHtml } from '../helpers.js';
import { infoRow } from '../renderers.js';
import { toast, setError, setLoading, openModal, closeModal, bindModalClose } from '../ui.js';

let product = null;

function render() {
  const root = document.getElementById('detail-root');
  const img = buildImageSrc(product);
  const warning = product.stockQuantity === 0
    ? `<div class="alert alert-danger">This product is currently out of stock and should be restocked immediately.</div>`
    : product.lowStock
      ? `<div class="alert alert-warning">Only ${product.stockQuantity} ${escapeHtml(product.unit || 'units')} left. Threshold: ${product.lowStockThreshold}.</div>`
      : '';

  root.innerHTML = `
    <div class="detail-layout">
      <section class="grid gap-16">
        <div class="card" style="overflow:hidden;">
          <div class="hero-image">${img ? `<img src="${img}" alt="${escapeHtml(product.name)}" />` : '<div class="muted">No image</div>'}</div>
          <div class="product-content">
            <div class="flex gap-8" style="flex-wrap:wrap; margin-bottom:14px;">
              <span class="badge cat-badge">${CATEGORY_LABELS[product.category] || product.category || 'Category'}</span>
              <span class="${getStockClass(product)}">${getStockLabel(product)}</span>
              <span class="${getStatusClass(product.status)}">${escapeHtml(product.status || '')}</span>
            </div>
            <div class="gradient-rose" style="border-radius:18px; padding:18px; color:white;">
              <div class="help" style="color:rgba(255,255,255,.75); font-size:13px;">Selling Price</div>
              <div style="font-size:32px; font-weight:800; margin-top:4px;">${formatCurrency(product.price)}</div>
              ${product.costPrice ? `<div class="help" style="color:rgba(255,255,255,.75)">Cost: ${formatCurrency(product.costPrice)}</div>` : ''}
              <div style="margin-top:16px; background:rgba(255,255,255,.18); padding:14px; border-radius:14px;">
                <div class="flex justify-between"><span>Stock</span><strong>${product.stockQuantity} ${escapeHtml(product.unit || 'units')}</strong></div>
              </div>
            </div>
          </div>
        </div>
        ${warning}
        <div class="grid gap-12">
          <button class="btn btn-primary" id="open-stock">Manage Stock</button>
          <a class="btn btn-secondary" href="edit-product.html?id=${product.id}">Edit Product</a>
          <button class="btn btn-danger" id="open-delete">Delete Product</button>
        </div>
      </section>
      <section class="grid gap-16">
        <div class="card pad">
          <div class="product-brand">${escapeHtml(product.brand || '')}</div>
          <h1 class="page-title" style="font-size:34px; margin-bottom:12px;">${escapeHtml(product.name)}</h1>
          ${product.description ? `<p class="muted" style="line-height:1.7;">${escapeHtml(product.description)}</p>` : ''}
          ${product.tags ? `<div class="flex gap-8" style="margin-top:14px; flex-wrap:wrap;">${product.tags.split(',').map(t => `<span class="badge cat-badge">#${escapeHtml(t.trim())}</span>`).join('')}</div>` : ''}
        </div>
        <div class="card pad"><h2 class="section-title">Product Identifiers</h2><div class="info-list">${
          [
            infoRow('SKU', product.sku),
            infoRow('Barcode', product.barcode),
            infoRow('Country of Origin', product.countryOfOrigin),
            infoRow('Shade / Color', product.shade),
            infoRow('Skin Type', product.skinType),
            infoRow('Volume / Weight', product.volume)
          ].join('')
        }</div></div>
        ${(product.ingredients || product.usageInstructions) ? `<div class="card pad"><h2 class="section-title">Ingredients & Usage</h2>${
          product.ingredients ? `<div style="margin-bottom:14px;"><div class="label">Ingredients</div><div class="alert" style="background:#fff1f5;border-color:#fbcfe8;color:#4b5563;">${escapeHtml(product.ingredients)}</div></div>` : ''
        }${
          product.usageInstructions ? `<div><div class="label">Usage Instructions</div><div class="alert" style="background:#fff1f5;border-color:#fbcfe8;color:#4b5563;">${escapeHtml(product.usageInstructions)}</div></div>` : ''
        }</div>` : ''}
        ${(product.supplierName || product.supplierContact || product.supplierEmail || product.supplierAddress) ? `<div class="card pad"><h2 class="section-title">Supplier / Vendor</h2><div class="info-list">${
          [
            infoRow('Supplier Name', product.supplierName),
            infoRow('Contact', product.supplierContact),
            infoRow('Email', product.supplierEmail),
            infoRow('Address', product.supplierAddress)
          ].join('')
        }</div></div>` : ''}
        <div class="card pad"><h2 class="section-title">Dates & Record Info</h2><div class="info-list">${
          [
            infoRow('Manufacture Date', formatDate(product.manufactureDate)),
            infoRow('Expiry Date', formatDate(product.expiryDate)),
            infoRow('Created At', formatDate(product.createdAt)),
            infoRow('Last Updated', formatDate(product.updatedAt))
          ].join('')
        }</div></div>
      </section>
    </div>`;
  bindActions();
}

function bindActions() {
  document.getElementById('open-stock')?.addEventListener('click', () => { renderStockModal(); openModal('stock-modal'); });
  document.getElementById('open-delete')?.addEventListener('click', () => { renderDeleteModal(); openModal('delete-modal'); });
}

function renderStockModal() {
  const el = document.getElementById('stock-modal');
  el.innerHTML = `<div class="modal"><h2 style="margin-top:0;">Update Stock</h2>
    <p class="muted">${escapeHtml(product.name)} · Current stock: <strong>${product.stockQuantity}</strong></p>
    <div class="grid grid-3" style="margin-top:14px;">
      <button class="btn btn-secondary stock-op active" data-op="ADD">Add</button>
      <button class="btn btn-secondary stock-op" data-op="SUBTRACT">Remove</button>
      <button class="btn btn-secondary stock-op" data-op="SET">Set</button>
    </div>
    <div style="margin-top:16px;">
      <label class="label">Quantity</label><input class="input" type="number" min="1" id="stock-quantity" value="1" />
    </div>
    <div class="actions"><button class="btn btn-secondary" data-close-modal>Cancel</button><button class="btn btn-primary" id="submit-stock">Update Stock</button></div></div>`;
  bindModalClose('stock-modal');
  let op = 'ADD';
  el.querySelectorAll('.stock-op').forEach(btn => btn.addEventListener('click', () => {
    op = btn.dataset.op;
    el.querySelectorAll('.stock-op').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }));
  el.querySelector('#submit-stock').addEventListener('click', async () => {
    const quantity = Number(el.querySelector('#stock-quantity').value || 0);
    if (!quantity || quantity < 1) { toast('Enter a valid quantity', 'error'); return; }
    try {
      product = await productApi.updateStock(product.id, { quantity, operation: op });
      toast('Stock updated successfully');
      closeModal('stock-modal');
      render();
    } catch (e) {
      toast(e.message, 'error');
    }
  });
}

function renderDeleteModal() {
  const el = document.getElementById('delete-modal');
  el.innerHTML = `<div class="modal"><h2 style="margin-top:0; color:#991b1b;">Delete Product</h2>
    <p class="muted">Are you sure you want to delete <strong>${escapeHtml(product.name)}</strong>? This action cannot be undone.</p>
    <div class="actions"><button class="btn btn-secondary" data-close-modal>Cancel</button><button class="btn btn-danger" id="confirm-delete">Delete</button></div></div>`;
  bindModalClose('delete-modal');
  el.querySelector('#confirm-delete').addEventListener('click', async () => {
    try {
      await productApi.delete(product.id);
      toast('Product deleted successfully');
      location.href = 'products.html';
    } catch (e) {
      toast(e.message, 'error');
    }
  });
}

async function load() {
  const root = document.getElementById('detail-root');
  const id = qs('id');
  if (!id) { setError(root, 'Missing product id'); return; }
  setLoading(root, 'Loading product...');
  try {
    product = await productApi.getById(id);
    render();
  } catch (e) {
    setError(root, e.message);
  }
}

initPage('inventory', load);
