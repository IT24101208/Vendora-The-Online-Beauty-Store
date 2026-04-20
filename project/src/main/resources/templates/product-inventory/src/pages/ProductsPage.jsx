import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Package, Grid, List, SlidersHorizontal } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, CATEGORY_LABELS, formatCurrency, buildImageSrc, getStockBadgeClass, getStockLabel } from '../utils/helpers'
import clsx from 'clsx'

export default function ProductsPage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [search, setSearch] = useState({})

  const { products, loading, error } = useProducts(search)

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch({ keyword, category, status })
  }

  const handleReset = () => {
    setKeyword(''); setCategory(''); setStatus('')
    setSearch({})
  }

  return (
    <div className="page-enter max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 mt-1">{loading ? '...' : `${products.length} products`}</p>
        </div>
        <button onClick={() => navigate('/products/new')} className="btn-primary">
          + Add Product
        </button>
      </div>

      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 border border-rose-100 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-300" />
            <input
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="Search by name, brand or SKU..."
              className="input-rose pl-10"
            />
          </div>

          {/* Category filter */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="input-rose sm:w-48"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
          </select>

          {/* Status filter */}
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="input-rose sm:w-36"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DISCONTINUED">Discontinued</option>
          </select>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              <Filter size={16} /> Filter
            </button>
            <button type="button" onClick={handleReset} className="btn-secondary">
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading ? 'Loading...' : `Showing ${products.length} result${products.length !== 1 ? 's' : ''}`}
        </p>
        <div className="flex gap-1 bg-rose-50 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx('p-2 rounded-lg transition-all', viewMode === 'grid' ? 'bg-white shadow text-rose-600' : 'text-rose-300 hover:text-rose-500')}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx('p-2 rounded-lg transition-all', viewMode === 'list' ? 'bg-white shadow text-rose-600' : 'text-rose-300 hover:text-rose-500')}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-rose-50 overflow-hidden animate-pulse">
              <div className="h-48 bg-rose-100" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-rose-100 rounded w-1/2" />
                <div className="h-5 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div className="text-center py-24">
          <Package size={56} className="mx-auto text-rose-200 mb-4" />
          <h3 className="font-display text-2xl font-bold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your filters or add a new product.</p>
          <button onClick={() => navigate('/products/new')} className="btn-primary mx-auto">
            + Add First Product
          </button>
        </div>
      )}

      {/* Grid View */}
      {!loading && products.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* List View */}
      {!loading && products.length > 0 && viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-rose-50 text-rose-700 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-semibold">Product</th>
                <th className="text-left px-4 py-3 font-semibold">Brand</th>
                <th className="text-left px-4 py-3 font-semibold">Category</th>
                <th className="text-left px-4 py-3 font-semibold">Price</th>
                <th className="text-left px-4 py-3 font-semibold">Stock</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {products.map(p => {
                const imgSrc = buildImageSrc(p)
                return (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/products/${p.id}`)}
                    className="hover:bg-rose-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {imgSrc
                            ? <img src={imgSrc} alt={p.name} className="w-full h-full object-cover" />
                            : <Package size={16} className="text-rose-300" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-800">{p.name}</p>
                          {p.sku && <p className="text-xs text-gray-400 font-mono">SKU: {p.sku}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.brand}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-rose-100 text-rose-600 font-medium">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-rose-700 text-sm">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3">
                      <div>
                        <span className={getStockBadgeClass(p)}>{getStockLabel(p)}</span>
                        <p className="text-xs text-gray-400 mt-0.5">{p.stockQuantity} {p.unit || 'units'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
