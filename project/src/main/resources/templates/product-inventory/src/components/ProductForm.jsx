import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Upload, X, Image, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import clsx from 'clsx'
import { CATEGORIES, CATEGORY_LABELS, buildImageSrc } from '../utils/helpers'

const SECTIONS = {
  basic: 'Basic Info',
  pricing: 'Pricing & Stock',
  details: 'Product Details',
  ingredients: 'Ingredients & Usage',
  supplier: 'Supplier / Vendor',
  dates: 'Dates & Origin',
}

export default function ProductForm({ defaultValues, onSubmit, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: defaultValues || { lowStockThreshold: 10, status: 'ACTIVE' }
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(
    defaultValues ? buildImageSrc(defaultValues) : null
  )
  const [removeImage, setRemoveImage] = useState(false)
  const [openSection, setOpenSection] = useState('basic')
  const fileRef = useRef()

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { toast.error('Image must be under 10MB'); return }
    setImageFile(file)
    setRemoveImage(false)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setRemoveImage(true)
    fileRef.current.value = ''
  }

  const onFormSubmit = (data) => {
    onSubmit(data, imageFile, removeImage)
  }

  const Section = ({ id, children }) => (
    <div className="border border-rose-100 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpenSection(openSection === id ? null : id)}
        className={clsx(
          'w-full flex items-center justify-between px-5 py-4 text-left font-semibold transition-all',
          openSection === id ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
        )}
      >
        <span className="font-display">{SECTIONS[id]}</span>
        <ChevronDown size={18} className={clsx('transition-transform', openSection === id && 'rotate-180')} />
      </button>
      {openSection === id && (
        <div className="p-5 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4">
          {children}
        </div>
      )}
    </div>
  )

  const Field = ({ label, name, type = 'text', required, placeholder, options, colSpan, ...rest }) => (
    <div className={clsx(colSpan === 2 && 'sm:col-span-2')}>
      <label className="label-rose">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {options ? (
        <select className="input-rose" {...register(name, required ? { required: `${label} is required` } : {})} {...rest}>
          <option value="">Select {label}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          rows={3}
          placeholder={placeholder}
          className="input-rose resize-none"
          {...register(name, required ? { required: `${label} is required` } : {})}
          {...rest}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="input-rose"
          {...register(name, {
            ...(required ? { required: `${label} is required` } : {}),
            ...(type === 'number' ? { valueAsNumber: true } : {})
          })}
          {...rest}
        />
      )}
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Image Upload */}
      <div className="border border-rose-100 rounded-2xl p-5 bg-white">
        <p className="label-rose mb-3">Product Image</p>
        <div className="flex items-start gap-5">
          <div className="w-32 h-32 rounded-2xl bg-rose-50 border-2 border-dashed border-rose-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <Image size={32} className="text-rose-200" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="btn-secondary text-sm"
            >
              <Upload size={16} /> Upload Image
            </button>
            {imagePreview && (
              <button type="button" onClick={handleRemoveImage} className="btn-danger text-sm">
                <X size={16} /> Remove
              </button>
            )}
            <p className="text-xs text-gray-400">PNG, JPG, WEBP — max 10MB</p>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
      </div>

      {/* Basic Info */}
      <Section id="basic">
        <Field label="Product Name" name="name" required placeholder="e.g. Hydrating Face Serum" />
        <Field label="Brand" name="brand" required placeholder="e.g. The Ordinary" />
        <Field label="SKU" name="sku" placeholder="e.g. SKN-001" />
        <Field label="Barcode" name="barcode" placeholder="e.g. 1234567890123" />
        <Field label="Category" name="category" required options={CATEGORIES.map(c => ({ value: c, label: CATEGORY_LABELS[c] }))} />
        <Field label="Status" name="status" options={[
          { value: 'ACTIVE', label: 'Active' },
          { value: 'INACTIVE', label: 'Inactive' },
          { value: 'DISCONTINUED', label: 'Discontinued' },
        ]} />
        <Field label="Description" name="description" type="textarea" placeholder="Brief product description..." colSpan={2} />
        <Field label="Tags" name="tags" placeholder="e.g. moisturizing, anti-aging, vegan" colSpan={2} />
      </Section>

      {/* Pricing & Stock */}
      <Section id="pricing">
        <Field label="Selling Price (USD)" name="price" type="number" required placeholder="0.00" />
        <Field label="Cost Price (USD)" name="costPrice" type="number" placeholder="0.00" />
        <Field label="Stock Quantity" name="stockQuantity" type="number" required placeholder="0" />
        <Field label="Low Stock Threshold" name="lowStockThreshold" type="number" required placeholder="10" />
        <Field label="Unit" name="unit" placeholder="e.g. pcs, ml, g" />
        <Field label="Volume / Weight" name="volume" placeholder="e.g. 200ml, 50g" />
      </Section>

      {/* Product Details */}
      <Section id="details">
        <Field label="Shade / Color" name="shade" placeholder="e.g. #001 Nude Beige" />
        <Field label="Skin Type" name="skinType" placeholder="e.g. Oily, Dry, Combination, All" />
        <Field label="Country of Origin" name="countryOfOrigin" placeholder="e.g. France, South Korea" />
      </Section>

      {/* Ingredients & Usage */}
      <Section id="ingredients">
        <Field label="Ingredients" name="ingredients" type="textarea" placeholder="List all ingredients..." colSpan={2} />
        <Field label="Usage Instructions" name="usageInstructions" type="textarea" placeholder="How to use this product..." colSpan={2} />
      </Section>

      {/* Supplier */}
      <Section id="supplier">
        <Field label="Supplier / Vendor Name" name="supplierName" placeholder="e.g. Beauty Wholesale Co." />
        <Field label="Supplier Contact" name="supplierContact" placeholder="e.g. +1-800-123-4567" />
        <Field label="Supplier Email" name="supplierEmail" type="email" placeholder="supplier@example.com" />
        <Field label="Supplier Address" name="supplierAddress" placeholder="123 Beauty St, New York" colSpan={2} />
      </Section>

      {/* Dates */}
      <Section id="dates">
        <Field label="Manufacture Date" name="manufactureDate" type="date" />
        <Field label="Expiry Date" name="expiryDate" type="date" />
      </Section>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Saving...
            </span>
          ) : (defaultValues ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  )
}
