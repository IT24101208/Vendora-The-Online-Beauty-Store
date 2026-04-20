import { useNavigate } from 'react-router-dom'
import { Package, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'
import {
  buildImageSrc, formatCurrency,
  getStockBadgeClass, getStockLabel,
  CATEGORY_COLORS, CATEGORY_LABELS
} from '../utils/helpers'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const imgSrc = buildImageSrc(product)

  return (
    <div
      className="overflow-hidden product-card animate-fade-in"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Image */}
      <div className="relative flex items-center justify-center h-48 overflow-hidden bg-gradient-to-br from-rose-50 to-pink-100">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <Package size={48} className="text-rose-200" />
        )}

        {/* Category badge */}
        <span className={clsx(
          'absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold',
          CATEGORY_COLORS[product.category]
        )}>
          {CATEGORY_LABELS[product.category]?.replace(/^[^\w]+/, '') || product.category}
        </span>

        {/* Low stock warning overlay */}
        {product.lowStock && product.stockQuantity > 0 && (
          <div className="absolute flex items-center justify-center rounded-full shadow-lg top-3 right-3 w-7 h-7 bg-amber-500 animate-pulse-slow">
            <AlertTriangle size={14} className="text-white" />
          </div>
        )}
        {product.stockQuantity === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wide uppercase">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-rose-400 font-medium uppercase tracking-wider mb-0.5">{product.brand}</p>
        <h3 className="mb-2 text-lg font-semibold leading-tight text-gray-800 font-display line-clamp-1">
          {product.name}
        </h3>

        {product.sku && (
          <p className="mb-2 font-mono text-xs text-gray-400">SKU: {product.sku}</p>
        )}

        {product.shade && (
          <p className="mb-2 text-xs text-gray-500">Shade: <span className="font-medium">{product.shade}</span></p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold font-display text-rose-700">{formatCurrency(product.price)}</span>
          <span className={getStockBadgeClass(product)}>
            {product.stockQuantity === 0 ? '⚠️' : product.lowStock ? '⚡' : '✓'} {getStockLabel(product)}
          </span>
        </div>

        <div className="mt-2 text-xs text-gray-400">
          Stock: <span className={clsx(
            'font-bold',
            product.stockQuantity === 0 ? 'text-red-500' : product.lowStock ? 'text-amber-500' : 'text-emerald-600'
          )}>
            {product.stockQuantity} {product.unit || 'units'}
          </span>
          <span className="mx-1 text-gray-300">/</span>
          <span className="text-gray-400">Threshold: {product.lowStockThreshold}</span>
        </div>
      </div>
    </div>
  )
}
