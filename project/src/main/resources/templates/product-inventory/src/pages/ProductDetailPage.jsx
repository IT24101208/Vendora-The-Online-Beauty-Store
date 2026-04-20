import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Edit, Trash2, Package, AlertTriangle,
  Tag, Barcode, Building2, Phone, Mail, MapPin,
  Calendar, Globe, FlaskConical, BookOpen, Layers3
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
        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{value}</p>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-rose-50 shadow-sm p-5">
      <h3 className="font-display font-bold text-gray-700 text-base mb-3 pb-2 border-b border-rose-50">{title}</h3>
      {children}
    </div>
  )
}

export default function ProductDetailPage() {
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
      navigate('/products')
    } catch (err) {
      toast.error(err.message)
      setDeleteLoading(false)
    }
  }

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-16 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center animate-pulse">
          <Package size={24} className="text-rose-400" />
        </div>
        <p className="text-gray-400">Loading product...</p>
      </div>
    </div>
  )

  if (error || !p) return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-center">
      <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
      <button onClick={() => navigate('/products')} className="btn-secondary mx-auto">
        ← Back to Products
      </button>
    </div>
  )

  const imgSrc = buildImageSrc(p)

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium text-sm mb-6 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Image + quick info */}
        <div className="lg:col-span-1 space-y-4">
          {/* Image */}
          <div className="bg-white rounded-2xl border border-rose-50 shadow-sm overflow-hidden">
            <div className="h-72 bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center">
              {imgSrc
                ? <img src={imgSrc} alt={p.name} className="w-full h-full object-cover" />
                : <Package size={64} className="text-rose-200" />
              }
            </div>

            {/* Status badges */}
            <div className="p-4 flex flex-wrap gap-2">
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
          </div>

          {/* Price & Stock card */}
          <div className="bg-gradient-to-br from-rose-600 to-pink-700 text-white rounded-2xl p-5 shadow-md shadow-rose-200">
            <p className="text-white/70 text-sm mb-1">Selling Price</p>
            <p className="font-display text-3xl font-bold mb-3">{formatCurrency(p.price)}</p>
            {p.costPrice && (
              <p className="text-white/60 text-xs mb-3">Cost: {formatCurrency(p.costPrice)}</p>
            )}
            <div className="bg-white/20 rounded-xl p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80">Stock</span>
                <span className="font-bold text-lg">{p.stockQuantity} {p.unit || 'units'}</span>
              </div>
              <div className="mt-2 bg-white/20 rounded-full h-2">
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

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button onClick={() => setShowStock(true)} className="btn-primary w-full justify-center">
              <Layers3 size={16} /> Manage Stock
            </button>
            <button onClick={() => navigate(`/products/${p.id}/edit`)} className="btn-secondary w-full justify-center">
              <Edit size={16} /> Edit Product
            </button>
            <button onClick={() => setShowDelete(true)} className="btn-danger w-full justify-center">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Title */}
          <div className="bg-white rounded-2xl border border-rose-50 shadow-sm p-5">
            <p className="text-rose-400 font-semibold text-sm mb-1">{p.brand}</p>
            <h1 className="font-display text-3xl font-bold text-gray-800 mb-3">{p.name}</h1>
            {p.description && <p className="text-gray-500 leading-relaxed text-sm">{p.description}</p>}
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
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ingredients</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed bg-rose-50 rounded-xl p-3">{p.ingredients}</p>
                </div>
              )}
              {p.usageInstructions && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-rose-500" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Usage Instructions</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed bg-rose-50 rounded-xl p-3">{p.usageInstructions}</p>
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
