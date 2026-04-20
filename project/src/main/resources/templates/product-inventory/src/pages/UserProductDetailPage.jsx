import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Edit, Trash2, Package, AlertTriangle,
  Tag, Barcode, Building2, Phone, Mail, MapPin,
  Calendar, Globe, FlaskConical, BookOpen, Layers3,
  ShoppingCart, Zap
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useProduct } from '../hooks/useProducts'
import { productApi } from '../services/api'
import StockModal from '../components/StockModal'
import DeleteModal from '../components/DeleteModal'
import {
  buildImageSrc, formatCurrency, formatDate,
  getStockBadgeClass, getStockLabel,
  CATEGORY_LABELS, CATEGORY_COLORS
} from '../utils/helpers'
import clsx from 'clsx'

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-rose-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={15} className="text-rose-500" />
      </div>
      <div>
        <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">{label}</p>
        <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{value}</p>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="p-5 bg-white border shadow-sm rounded-2xl border-rose-50">
      <h3 className="pb-2 mb-3 text-base font-bold text-gray-700 border-b font-display border-rose-50">{title}</h3>
      {children}
    </div>
  )
}

export default function UserProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product: initialProduct, loading, error } = useProduct(id)
  const [product, setProduct] = useState(null)
  const [showStock, setShowStock] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const p = product || initialProduct

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await productApi.delete(id)
      toast.success('Product deleted')
      navigate('/user-products')
    } catch (err) {
      toast.error(err.message)
      setDeleteLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center max-w-5xl px-4 py-16 mx-auto">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-100 animate-pulse">
          <Package size={24} className="text-rose-400" />
        </div>
        <p className="text-gray-400">Loading product...</p>
      </div>
    </div>
  )

  if (error || !p) return (
    <div className="max-w-5xl px-4 py-16 mx-auto text-center">
      <p className="mb-4 text-red-500">{error || 'Product not found'}</p>
      <button onClick={() => navigate('/user-products')} className="mx-auto btn-secondary">
        ← Back to Products
      </button>
    </div>
  )

  const imgSrc = buildImageSrc(p)

  return (
    <div className="max-w-5xl px-4 py-8 mx-auto page-enter sm:px-6">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-6 text-sm font-medium text-rose-600 hover:text-rose-700 group">
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        Back
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT: Image + quick info */}
        <div className="space-y-4 lg:col-span-1">
          {/* Image */}
          <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-rose-50">
            <div className="flex items-center justify-center h-72 bg-gradient-to-br from-rose-50 to-pink-100">
              {imgSrc
                ? <img src={imgSrc} alt={p.name} className="object-cover w-full h-full" />
                : <Package size={64} className="text-rose-200" />
              }
            </div>

            {/* Status badges */}
            <div className="flex flex-wrap gap-2 p-4">
              <span className={clsx('px-3 py-1 rounded-full text-xs font-semibold', CATEGORY_COLORS[p.category])}>
                {CATEGORY_LABELS[p.category]}
              </span>
              <span className={getStockBadgeClass(p)}>
                {p.lowStock || p.stockQuantity === 0 ? <AlertTriangle size={12} /> : null}
                {getStockLabel(p)}
              </span>
              <span className={clsx(
                'px-2 py-0.5 rounded-full text-xs font-semibold',
                p.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
              )}>
                {p.status}
              </span>
            </div>

            {/* Add to Cart & Buy Now buttons */}
            <div className="flex gap-3 px-4 pb-4">
              <button
                type="button"
                className="flex items-center justify-center flex-1 gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 bg-white border-2 border-rose-300 rounded-xl hover:bg-rose-50 transition-colors"
              >
                <ShoppingCart size={16} /> Add to Cart
              </button>
              <button
                type="button"
                className="flex items-center justify-center flex-1 gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors"
              >
                <Zap size={16} /> Buy Now
              </button>
            </div>
          </div>

          {/* Price & Stock card */}
          <div className="p-5 text-white shadow-md bg-gradient-to-br from-rose-600 to-pink-700 rounded-2xl shadow-rose-200">
            <p className="mb-1 text-sm text-white/70">Selling Price</p>
            <p className="mb-3 text-3xl font-bold font-display">{formatCurrency(p.price)}</p>
            {p.costPrice && (
              <p className="mb-3 text-xs text-white/60">Cost: {formatCurrency(p.costPrice)}</p>
            )}
            <div className="p-3 bg-white/20 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Stock</span>
                <span className="text-lg font-bold">{p.stockQuantity} {p.unit || 'units'}</span>
              </div>
              <div className="h-2 mt-2 rounded-full bg-white/20">
                <div
                  className={clsx('h-2 rounded-full transition-all', p.stockQuantity === 0 ? 'bg-red-400' : p.lowStock ? 'bg-amber-400' : 'bg-emerald-400')}
                  style={{ width: `${Math.min(100, (p.stockQuantity / (p.lowStockThreshold * 3)) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-white/50">0</span>
                <span className="text-xs text-white/50">Threshold: {p.lowStockThreshold}</span>
              </div>
            </div>
          </div>

          {/* Low stock warning */}
          {(p.lowStock || p.stockQuantity === 0) && (
            <div className={clsx(
              'rounded-2xl p-4 border flex items-start gap-3',
              p.stockQuantity === 0 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
            )}>
              <AlertTriangle size={20} className={p.stockQuantity === 0 ? 'text-red-500' : 'text-amber-500'} />
              <div>
                <p className={clsx('font-semibold text-sm', p.stockQuantity === 0 ? 'text-red-700' : 'text-amber-700')}>
                  {p.stockQuantity === 0 ? 'Out of Stock!' : 'Low Stock Warning!'}
                </p>
                <p className={clsx('text-xs mt-0.5', p.stockQuantity === 0 ? 'text-red-500' : 'text-amber-500')}>
                  {p.stockQuantity === 0
                    ? 'This product is unavailable. Restock immediately.'
                    : `Only ${p.stockQuantity} units left (threshold: ${p.lowStockThreshold}).`
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Details */}
        <div className="space-y-4 lg:col-span-2">
          {/* Title */}
          <div className="p-5 bg-white border shadow-sm rounded-2xl border-rose-50">
            <p className="mb-1 text-sm font-semibold text-rose-400">{p.brand}</p>
            <h1 className="mb-3 text-3xl font-bold text-gray-800 font-display">{p.name}</h1>
            {p.description && <p className="text-sm leading-relaxed text-gray-500">{p.description}</p>}
            {p.tags && (
              <div className="flex flex-wrap gap-1 mt-3">
                {p.tags.split(',').map(t => (
                  <span key={t} className="px-2 py-0.5 bg-rose-50 text-rose-600 rounded-full text-xs font-medium">#{t.trim()}</span>
                ))}
              </div>
            )}
          </div>

          {/* Product Identifiers */}
          <Section title="Product Identifiers">
            <InfoRow icon={Tag} label="SKU" value={p.sku} />
            <InfoRow icon={Barcode} label="Barcode" value={p.barcode} />
            <InfoRow icon={Globe} label="Country of Origin" value={p.countryOfOrigin} />
            <InfoRow icon={Package} label="Shade / Color" value={p.shade} />
            <InfoRow icon={Package} label="Skin Type" value={p.skinType} />
            <InfoRow icon={Package} label="Volume / Weight" value={p.volume} />
          </Section>

          {/* Ingredients */}
          {(p.ingredients || p.usageInstructions) && (
            <Section title="Ingredients & Usage">
              {p.ingredients && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FlaskConical size={16} className="text-rose-500" />
                    <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Ingredients</span>
                  </div>
                  <p className="p-3 text-sm leading-relaxed text-gray-600 bg-rose-50 rounded-xl">{p.ingredients}</p>
                </div>
              )}
              {p.usageInstructions && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-rose-500" />
                    <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Usage Instructions</span>
                  </div>
                  <p className="p-3 text-sm leading-relaxed text-gray-600 bg-rose-50 rounded-xl">{p.usageInstructions}</p>
                </div>
              )}
            </Section>
          )}

          {/* Supplier */}
          {(p.supplierName || p.supplierContact || p.supplierEmail || p.supplierAddress) && (
            <Section title="Supplier / Vendor">
              <InfoRow icon={Building2} label="Supplier Name" value={p.supplierName} />
              <InfoRow icon={Phone} label="Contact" value={p.supplierContact} />
              <InfoRow icon={Mail} label="Email" value={p.supplierEmail} />
              <InfoRow icon={MapPin} label="Address" value={p.supplierAddress} />
            </Section>
          )}

          {/* Dates */}
          {(p.manufactureDate || p.expiryDate) && (
            <Section title="Dates">
              <InfoRow icon={Calendar} label="Manufacture Date" value={formatDate(p.manufactureDate)} />
              <InfoRow icon={Calendar} label="Expiry Date" value={formatDate(p.expiryDate)} />
            </Section>
          )}

          {/* Meta */}
          <Section title="Record Info">
            <InfoRow icon={Calendar} label="Created At" value={formatDate(p.createdAt)} />
            <InfoRow icon={Calendar} label="Last Updated" value={formatDate(p.updatedAt)} />
          </Section>
        </div>
      </div>

      {/* Modals */}
      {showStock && (
        <StockModal
          product={p}
          onClose={() => setShowStock(false)}
          onUpdated={(updated) => setProduct(updated)}
        />
      )}
      {showDelete && (
        <DeleteModal
          product={p}
          onClose={() => setShowDelete(false)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  )
}