import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CreateProductPage from './pages/CreateProductPage'
import EditProductPage from './pages/EditProductPage'
import LowStockPage from './pages/LowStockPage'
import { useLowStockProducts } from './hooks/useProducts'

import UserProductsPage from "./pages/UserProductsPage";
import UserProductDetailPage from "./pages/UserProductDetailPage";

export default function App() {
  const { products: lowStockProducts } = useLowStockProducts()

  return (
    <div className="min-h-screen bg-[#fdf9f7]">
      <Navbar lowStockCount={lowStockProducts.length} />

      <main>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/new" element={<CreateProductPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products/:id/edit" element={<EditProductPage />} />
          <Route path="/low-stock" element={<LowStockPage />} />

          <Route path="/user-products" element={<UserProductsPage />} />
          <Route path="/user-products/:id" element={<UserProductDetailPage />} />
        </Routes>
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            fontFamily: "DM Sans, sans-serif",
            fontSize: "14px",
          },
          success: {
            iconTheme: { primary: "#e11d48", secondary: "#fff" },
          },
        }}
      />
    </div>
  );
}
