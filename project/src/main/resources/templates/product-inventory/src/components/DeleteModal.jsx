import { X, Trash2 } from 'lucide-react'

export default function DeleteModal({ product, onClose, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
            <Trash2 size={24} className="text-red-600" />
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X size={16} className="text-gray-600" />
          </button>
        </div>
        <h2 className="font-display text-xl font-bold text-gray-800 mb-2">Delete Product</h2>
        <p className="text-gray-500 text-sm mb-6">
          Are you sure you want to delete <span className="font-semibold text-gray-800">"{product?.name}"</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl px-5 py-2.5 transition-all active:scale-95 inline-flex items-center justify-center gap-2"
          >
            {loading ? 'Deleting...' : <><Trash2 size={16} /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  )
}
