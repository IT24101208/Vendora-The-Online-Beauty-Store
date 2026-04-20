import { useNavigate } from 'react-router-dom'
import { Package, AlertTriangle, TrendingDown, DollarSign, LayoutGrid, Activity } from 'lucide-react'
import { useDashboardStats, useLowStockProducts } from '../hooks/useProducts'
import { formatCurrency, buildImageSrc, CATEGORY_LABELS } from '../utils/helpers'

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-75 mb-1">{label}</p>
          <p className="text-3xl font-display font-bold">{value}</p>
          {sub && <p className="text-xs opacity-60 mt-1">{sub}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/30 flex items-center justify-center">
          <Icon size={20} />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { stats, loading } = useDashboardStats()
  const { products: lowStockProducts } = useLowStockProducts()
  const navigate = useNavigate()

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-gray-800 mb-1">Dashboard</h1>
        <p className="text-gray-500">Overview of your cosmetic inventory</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={Package}
          label="Total Products"
          value={loading ? '—' : stats?.totalProducts ?? 0}
          color="bg-gradient-to-br from-rose-500 to-pink-600 text-white"
          sub="All catalog items"
        />
        <StatCard
          icon={Activity}
          label="Active Products"
          value={loading ? '—' : stats?.activeProducts ?? 0}
          color="bg-gradient-to-br from-emerald-500 to-teal-600 text-white"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock Alerts"
          value={loading ? '—' : stats?.lowStockCount ?? 0}
          color="bg-gradient-to-br from-amber-400 to-orange-500 text-white"
          sub="Needs restock"
        />
        <StatCard
          icon={TrendingDown}
          label="Out of Stock"
          value={loading ? '—' : stats?.outOfStockCount ?? 0}
          color="bg-gradient-to-br from-red-500 to-rose-600 text-white"
        />
        <StatCard
          icon={DollarSign}
          label="Total Stock Value"
          value={loading ? '—' : formatCurrency(stats?.totalStockValue ?? 0)}
          color="bg-gradient-to-br from-violet-500 to-purple-600 text-white"
          sub="At selling price"
        />
        <StatCard
          icon={LayoutGrid}
          label="Categories"
          value={loading ? '—' : stats?.categoryCount ?? 0}
          color="bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
          sub="Active categories"
        />
      </div>

      {/* Low Stock Alert Section */}
      {lowStockProducts.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="font-display text-xl font-bold text-gray-800">Low Stock Alerts</h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{lowStockProducts.length}</span>
            </div>
            <button
              onClick={() => navigate('/low-stock')}
              className="text-sm text-rose-600 hover:text-rose-700 font-medium"
            >
              View all →
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl divide-y divide-amber-100">
            {lowStockProducts.slice(0, 5).map(product => {
              const imgSrc = buildImageSrc(product)
              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="flex items-center gap-4 p-4 hover:bg-amber-100/50 transition-colors cursor-pointer rounded-2xl"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-amber-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {imgSrc
                      ? <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
                      : <Package size={20} className="text-amber-300" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.brand} · {CATEGORY_LABELS[product.category]}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${product.stockQuantity === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                      {product.stockQuantity} {product.unit || 'units'}
                    </p>
                    <p className="text-xs text-gray-400">Threshold: {product.lowStockThreshold}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle size={18} className="text-amber-600" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="font-display text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/products/new')}
            className="p-6 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-left transition-all active:scale-95 shadow-md shadow-rose-200"
          >
            <Package size={28} className="mb-3 opacity-80" />
            <p className="font-display font-bold text-lg">Add Product</p>
            <p className="text-sm opacity-75 mt-1">Create a new cosmetic listing</p>
          </button>
          <button
            onClick={() => navigate('/products')}
            className="p-6 bg-white hover:bg-rose-50 text-rose-700 rounded-2xl text-left border border-rose-100 transition-all active:scale-95"
          >
            <LayoutGrid size={28} className="mb-3 text-rose-400" />
            <p className="font-display font-bold text-lg">Browse Products</p>
            <p className="text-sm text-gray-500 mt-1">View and manage all products</p>
          </button>
          <button
            onClick={() => navigate('/low-stock')}
            className="p-6 bg-white hover:bg-amber-50 text-amber-700 rounded-2xl text-left border border-amber-100 transition-all active:scale-95"
          >
            <AlertTriangle size={28} className="mb-3 text-amber-400" />
            <p className="font-display font-bold text-lg">Stock Alerts</p>
            <p className="text-sm text-gray-500 mt-1">Check items needing restock</p>
          </button>
        </div>
      </div>
    </div>
  )
}
