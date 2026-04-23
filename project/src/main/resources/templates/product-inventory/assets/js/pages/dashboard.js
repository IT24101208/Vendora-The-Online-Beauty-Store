
import { initPage } from '../common.js';
import { productApi } from '../api.js';
import { formatCurrency, buildImageSrc, CATEGORY_LABELS } from '../helpers.js';
import { setError, setLoading } from '../ui.js';

function statCard(label, value, klass, sub = '') {
  return `<div class="stat-card ${klass}"><h3>${label}</h3><p class="value">${value}</p>${sub ? `<div class="sub">${sub}</div>` : ''}</div>`;
}

async function loadDashboard() {
  const statsEl = document.getElementById('stats-grid');
  const alertsEl = document.getElementById('dashboard-low-stock');
  setLoading(statsEl, 'Loading dashboard stats...');
  setLoading(alertsEl, 'Loading low stock products...');
  try {
    const [stats, lowStock] = await Promise.all([productApi.getDashboardStats(), productApi.getLowStock()]);
    statsEl.innerHTML = [
      statCard('Total Products', stats?.totalProducts ?? 0, 'gradient-rose', 'All catalog items'),
      statCard('Active Products', stats?.activeProducts ?? 0, 'gradient-emerald'),
      statCard('Low Stock Alerts', stats?.lowStockCount ?? lowStock.length, 'gradient-amber', 'Needs restock'),
      statCard('Out of Stock', stats?.outOfStockCount ?? lowStock.filter(p => p.stockQuantity === 0).length, 'gradient-red'),
      statCard('Total Stock Value', formatCurrency(stats?.totalStockValue ?? 0), 'gradient-blue')
    ].join('');
    if (!lowStock.length) {
      alertsEl.innerHTML = '<div class="empty-state">All stocked up. No products are currently below the threshold.</div>';
      return;
    }
    alertsEl.innerHTML = `<div class="list-group">${lowStock.slice(0, 6).map(p => {
      const img = buildImageSrc(p);
      return `<a class="list-item ${p.stockQuantity === 0 ? 'danger' : 'warning'}" href="product-detail.html?id=${p.id}">
        ${img ? `<img class="small-thumb" src="${img}" alt="${p.name}" />` : '<div class="small-thumb"></div>'}
        <div style="flex:1;min-width:0;">
          <div style="font-weight:800;">${p.name}</div>
          <div class="muted" style="font-size:13px;">${p.brand || ''} · ${CATEGORY_LABELS[p.category] || p.category || ''}</div>
        </div>
        <div class="text-right">
          <div style="font-weight:800; color:${p.stockQuantity === 0 ? '#991b1b' : '#b45309'};">${p.stockQuantity} ${p.unit || 'units'}</div>
          <div class="help">Threshold: ${p.lowStockThreshold}</div>
        </div>
      </a>`;
    }).join('')}</div>`;
  } catch (e) {
    setError(statsEl, e.message);
    setError(alertsEl, e.message);
  }
}

initPage('dashboard', loadDashboard);
