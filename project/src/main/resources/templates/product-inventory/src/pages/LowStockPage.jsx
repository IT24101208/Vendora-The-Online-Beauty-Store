import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Package, ArrowRight } from 'lucide-react'
import { useLowStockProducts } from '../hooks/useProducts'
import { buildImageSrc, formatCurrency, CATEGORY_LABELS } from '../utils/helpers'
import clsx from 'clsx'

export default function LowStockPage() {
  const navigate = useNavigate()
  const { products, loading } = useLowStockProducts()

  const outOfStock = products.filter(p => p.stockQuantity === 0)
  const lowStock = products.filter(p => p.stockQuantity > 0)

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
            <AlertTriangle size={22} className="text-amber-600" />
          </div>
          <h1 className="font-display text-4xl font-bold text-gray-800">Stock Alerts</h1>
        </div>
        <p className="text-gray-500">Products that require immediate attention</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-white rounded-2xl border border-rose-50 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-2xl border border-emerald-100">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
            <Package size={32} className="text-emerald-400" />
          </div>
          <h3 className="font-display text-2xl font-bold text-gray-700 mb-2">All stocked up!</h3>
          <p className="text-gray-400">No products are running low on stock. Great job!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Out of Stock */}
          {outOfStock.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <h2 className="font-display font-bold text-lg text-gray-800">Out of Stock</h2>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">{outOfStock.length}</span>
              </div>
              <div className="space-y-2">
                {outOfStock.map(p => <AlertCard key={p.id} product={p} navigate={navigate} urgent />)}
              </div>
            </div>
          )}

          {/* Low Stock */}
          {lowStock.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <h2 className="font-display font-bold text-lg text-gray-800">Low Stock</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{lowStock.length}</span>
              </div>
              <div className="space-y-2">
                {lowStock.map(p => <AlertCard key={p.id} product={p} navigate={navigate} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function AlertCard({ product: p, navigate, urgent }) {
  const imgSrc = buildImageSrc(p)
  const percentage = p.lowStockThreshold > 0
    ? Math.min(100, (p.stockQuantity / (p.lowStockThreshold * 2)) * 100)
    : 0

  return (
    <div
      onClick={() => navigate(`/products/${p.id}`)}
      className={clsx(
        'bg-white rounded-2xl border p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all group',
        urgent ? 'border-red-200 hover:border-red-300' : 'border-amber-200 hover:border-amber-300'
      )}
    >
      <div className={clsx(
        'w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0',
        urgent ? 'bg-red-50' : 'bg-amber-50'
      )}>
        {imgSrc
          ? <img src={imgSrc} alt={p.name} className="w-full h-full object-cover" />
          : <Package size={24} className={urgent ? 'text-red-300' : 'text-amber-300'} />
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
            <p className="text-xs text-gray-500">{p.brand} · {CATEGORY_LABELS[p.category]}</p>
          </div>
          <span className={clsx(
            'text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0',
            urgent ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
          )}>
            {urgent ? '❌ Out of Stock' : '⚠️ Low Stock'}
          </span>
        </div>

        {/* Stock bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{p.stockQuantity} {p.unit || 'units'} remaining</span>
            <span>Threshold: {p.lowStockThreshold}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={clsx('h-full rounded-full transition-all', urgent ? 'bg-red-500' : 'bg-amber-400')}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="font-bold text-rose-700">{formatCurrency(p.price)}</p>
          <p className="text-xs text-gray-400">per unit</p>
        </div>
        <ArrowRight size={18} className="text-gray-300 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  )
}
