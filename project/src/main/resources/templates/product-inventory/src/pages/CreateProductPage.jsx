import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import ProductForm from '../components/ProductForm'
import { productApi } from '../services/api'
import { buildFormData } from '../utils/helpers'

export default function CreateProductPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data, imageFile, removeImage) => {
    setLoading(true)
    try {
      const fd = buildFormData(data, imageFile, removeImage)
      const res = await productApi.create(fd)
      toast.success('Product created successfully! 🎉')
      navigate(`/products/${res.data.id}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium text-sm mb-6 group">
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back
      </button>

      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-gray-800">Add New Product</h1>
        <p className="text-gray-500 mt-1">Fill in the details below to add a new cosmetic product</p>
      </div>

      <ProductForm onSubmit={handleSubmit} isLoading={loading} />
    </div>
  )
}
