import { useState } from 'react'
import { X, Plus, Minus, Edit3 } from 'lucide-react'
import toast from 'react-hot-toast'
import { productApi } from '../services/api'

export default function StockModal({ product, onClose, onUpdated }) {
  const [operation, setOperation] = useState('ADD')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!quantity || quantity < 1) { toast.error('Enter a valid quantity'); return }
    setLoading(true)
    try {
      const res = await productApi.updateStock(product.id, { quantity: Number(quantity), operation })
      toast.success('Stock updated successfully!')
      onUpdated(res.data)
      onClose()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-gray-800">Update Stock</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-colors">
            <X size={16} className="text-rose-600" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-rose-50 rounded-xl">
          <p className="text-sm font-medium text-gray-700">{product.name}</p>
          <p className="text-xs text-gray-500">{product.brand}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-gray-500">Current Stock:</span>
            <span className={`font-bold text-sm ${product.stockQuantity === 0 ? 'text-red-500' : product.lowStock ? 'text-amber-500' : 'text-emerald-600'}`}>
              {product.stockQuantity} {product.unit || 'units'}
            </span>
          </div>
        </div>

        {/* Operation selector */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { op: 'ADD', icon: Plus, label: 'Add', color: 'emerald' },
            { op: 'SUBTRACT', icon: Minus, label: 'Remove', color: 'amber' },
            { op: 'SET', icon: Edit3, label: 'Set', color: 'blue' },
          ].map(({ op, icon: Icon, label, color }) => (
            <button
              key={op}
              type="button"
              onClick={() => setOperation(op)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all text-sm font-semibold
                ${operation === op
                  ? color === 'emerald' ? 'bg-emerald-600 border-emerald-600 text-white'
                    : color === 'amber' ? 'bg-amber-500 border-amber-500 text-white'
                    : 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'}`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Quantity input */}
        <div className="mb-5">
          <label className="label-rose">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            className="input-rose text-center text-xl font-bold"
          />
        </div>

        {/* Preview */}
        {operation !== 'SET' && (
          <div className="mb-4 p-3 bg-gray-50 rounded-xl text-sm text-center text-gray-600">
            {product.stockQuantity} {operation === 'ADD' ? '+' : '−'} {quantity || 0} ={' '}
            <span className="font-bold text-gray-800">
              {operation === 'ADD'
                ? product.stockQuantity + (Number(quantity) || 0)
                : Math.max(0, product.stockQuantity - (Number(quantity) || 0))
              } {product.unit || 'units'}
            </span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? 'Updating...' : 'Update Stock'}
        </button>
      </div>
    </div>
  )
}
