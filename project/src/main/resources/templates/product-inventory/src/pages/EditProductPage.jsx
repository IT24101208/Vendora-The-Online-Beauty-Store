import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import ProductForm from '../components/ProductForm'
import { useProduct } from '../hooks/useProducts'
import { productApi } from '../services/api'
import { buildFormData } from '../utils/helpers'

export default function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { product, loading, error } = useProduct(id)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (data, imageFile, removeImage) => {
    setSaving(true)
    try {
      const fd = buildFormData(data, imageFile, removeImage)
      await productApi.update(id, fd)
      toast.success('Product updated successfully!')
      navigate(`/products/${id}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">Loading...</div>
  )

  if (error || !product) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <p className="text-red-500">{error || 'Product not found'}</p>
      <button onClick={() => navigate('/products')} className="btn-secondary mx-auto mt-4">← Back</button>
    </div>
  )

  // Map product to form defaults
  const defaultValues = {
    name: product.name,
    brand: product.brand,
    sku: product.sku || '',
    barcode: product.barcode || '',
    category: product.category,
    description: product.description || '',
    ingredients: product.ingredients || '',
    usageInstructions: product.usageInstructions || '',
    price: product.price,
    costPrice: product.costPrice || '',
    stockQuantity: product.stockQuantity,
    lowStockThreshold: product.lowStockThreshold,
    unit: product.unit || '',
    shade: product.shade || '',
    skinType: product.skinType || '',
    volume: product.volume || '',
    supplierName: product.supplierName || '',
    supplierContact: product.supplierContact || '',
    supplierEmail: product.supplierEmail || '',
    supplierAddress: product.supplierAddress || '',
    manufactureDate: product.manufactureDate || '',
    expiryDate: product.expiryDate || '',
    status: product.status,
    countryOfOrigin: product.countryOfOrigin || '',
    tags: product.tags || '',
    // pass image for preview
    imageBase64: product.imageBase64,
    imageContentType: product.imageContentType,
  }

  return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium text-sm mb-6 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-gray-800">Edit Product</h1>
        <p className="text-gray-500 mt-1">Update the details for <span className="font-semibold text-rose-600">{product.name}</span></p>
      </div>

      <ProductForm defaultValues={defaultValues} onSubmit={handleSubmit} isLoading={saving} />
    </div>
  )
}
