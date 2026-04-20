export const CATEGORIES = [
  'SKINCARE', 'MAKEUP', 'HAIRCARE', 'FRAGRANCE', 'BODYCARE',
  'NAILCARE', 'SUNCARE', 'MENCARE', 'BABYCARE', 'WELLNESS'
]

export const CATEGORY_LABELS = {
  SKINCARE: '🧴 Skincare',
  MAKEUP: '💄 Makeup',
  HAIRCARE: '💆 Haircare',
  FRAGRANCE: '🌸 Fragrance',
  BODYCARE: '🛁 Body Care',
  NAILCARE: '💅 Nail Care',
  SUNCARE: '☀️ Sun Care',
  MENCARE: '🧔 Men\'s Care',
  BABYCARE: '🍼 Baby Care',
  WELLNESS: '🌿 Wellness',
}

export const CATEGORY_COLORS = {
  SKINCARE: 'bg-pink-100 text-pink-700',
  MAKEUP: 'bg-rose-100 text-rose-700',
  HAIRCARE: 'bg-purple-100 text-purple-700',
  FRAGRANCE: 'bg-violet-100 text-violet-700',
  BODYCARE: 'bg-blue-100 text-blue-700',
  NAILCARE: 'bg-fuchsia-100 text-fuchsia-700',
  SUNCARE: 'bg-amber-100 text-amber-700',
  MENCARE: 'bg-slate-100 text-slate-700',
  BABYCARE: 'bg-sky-100 text-sky-700',
  WELLNESS: 'bg-emerald-100 text-emerald-700',
}

export const STATUS_LABELS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  DISCONTINUED: 'Discontinued',
}

export function getStockBadgeClass(product) {
  if (product.stockQuantity === 0) return 'badge-out-stock'
  if (product.lowStock) return 'badge-low-stock'
  return 'badge-ok'
}

export function getStockLabel(product) {
  if (product.stockQuantity === 0) return 'Out of Stock'
  if (product.lowStock) return 'Low Stock'
  return 'In Stock'
}

export function buildImageSrc(product) {
  if (!product?.imageBase64) return null
  return `data:${product.imageContentType || 'image/jpeg'};base64,${product.imageBase64}`
}

/* -------- Currency Format (Rs.) -------- */
export function formatCurrency(val) {
  if (val == null) return '—'
  return "Rs. " + Number(val).toLocaleString('en-LK')
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-LK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function buildFormData(data, imageFile, removeImage = false) {
  const fd = new FormData()

  Object.entries(data).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== '') {
      fd.append(k, v)
    }
  })

  if (imageFile) fd.append('image', imageFile)
  if (removeImage) fd.append('removeImage', 'true')

  return fd
}