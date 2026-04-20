import { useState, useEffect, useCallback } from 'react'
import { productApi } from '../services/api'
import toast from 'react-hot-toast'

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await productApi.getAll(filters)
      setProducts(res.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => { fetch() }, [fetch])

  return { products, loading, error, refetch: fetch }
}

export function useDashboardStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productApi.getDashboardStats()
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { stats, loading }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    productApi.getById(id)
      .then(res => setProduct(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  return { product, loading, error }
}

export function useLowStockProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productApi.getLowStock()
      .then(res => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return { products, loading }
}
