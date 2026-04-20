import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Package,
  Grid,
  List,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import UserProductCard from "../components/UserProductCard";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  formatCurrency,
  buildImageSrc,
  getStockBadgeClass,
  getStockLabel,
} from "../utils/helpers";
import clsx from "clsx";

export default function UserProductsPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState({});

  const { products, loading, error } = useProducts(search);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch({ keyword, category, status });
  };

  const handleReset = () => {
    setKeyword("");
    setCategory("");
    setStatus("");
    setSearch({});
  };

  return (
    <div className="px-4 py-8 mx-auto page-enter max-w-7xl sm:px-6">
      {/* Search & Filter */}
      <form
        onSubmit={handleSearch}
        className="p-4 mb-6 bg-white border shadow-sm rounded-2xl border-rose-100"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute -translate-y-1/2 left-3 top-1/2 text-rose-300"
            />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by name, brand or SKU..."
              className="pl-10 input-rose"
            />
          </div>

          {/* Category filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-rose sm:w-48"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
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
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading
            ? "Loading..."
            : `Showing ${products.length} result${products.length !== 1 ? "s" : ""}`}
        </p>
        <div className="flex gap-1 p-1 bg-rose-50 rounded-xl">
          <button
            onClick={() => setViewMode("grid")}
            className={clsx(
              "p-2 rounded-lg transition-all",
              viewMode === "grid"
                ? "bg-white shadow text-rose-600"
                : "text-rose-300 hover:text-rose-500",
            )}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={clsx(
              "p-2 rounded-lg transition-all",
              viewMode === "list"
                ? "bg-white shadow text-rose-600"
                : "text-rose-300 hover:text-rose-500",
            )}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded-2xl">
          ⚠️ {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden bg-white border shadow-sm rounded-2xl border-rose-50 animate-pulse"
            >
              <div className="h-48 bg-rose-100" />
              <div className="p-4 space-y-2">
                <div className="w-1/2 h-3 rounded bg-rose-100" />
                <div className="w-3/4 h-5 bg-gray-100 rounded" />
                <div className="w-1/3 h-3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div className="py-24 text-center">
          <Package size={56} className="mx-auto mb-4 text-rose-200" />
          <h3 className="mb-2 text-2xl font-bold text-gray-700 font-display">
            No products found
          </h3>
          <p className="mb-6 text-gray-400">
            Try adjusting your filters or add a new product.
          </p>
        </div>
      )}

      {/* Grid View */}
      {!loading && products.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <div key={p.id} className="flex flex-col">
              <UserProductCard
                product={p}
                onClick={() => navigate(`/user-products/${p.id}`)}
              />
              <div className="flex gap-2 px-1 mt-2">
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center flex-1 gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 bg-white border border-rose-300 rounded-xl hover:bg-rose-50 transition-colors"
                >
                  <ShoppingCart size={13} /> Add to Cart
                </button>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center flex-1 gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors"
                >
                  <Zap size={13} /> Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && products.length > 0 && viewMode === "list" && (
        <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-rose-100">
          <table className="w-full">
            <thead>
              <tr className="text-xs tracking-wider uppercase bg-rose-50 text-rose-700">
                <th className="px-4 py-3 font-semibold text-left">Product</th>
                <th className="px-4 py-3 font-semibold text-left">Brand</th>
                <th className="px-4 py-3 font-semibold text-left">Category</th>
                <th className="px-4 py-3 font-semibold text-left">Price</th>
                <th className="px-4 py-3 font-semibold text-left">Stock</th>
                <th className="px-4 py-3 font-semibold text-left">Status</th>
                <th className="px-4 py-3 font-semibold text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-50">
              {products.map((p) => {
                const imgSrc = buildImageSrc(p);
                return (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/user-products/${p.id}`)}
                    className="transition-colors cursor-pointer hover:bg-rose-50/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 overflow-hidden rounded-xl bg-rose-100">
                          {imgSrc ? (
                            <img
                              src={imgSrc}
                              alt={p.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <Package size={16} className="text-rose-300" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {p.name}
                          </p>
                          {p.sku && (
                            <p className="font-mono text-xs text-gray-400">
                              SKU: {p.sku}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {p.brand}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-600">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-rose-700">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <span className={getStockBadgeClass(p)}>
                          {getStockLabel(p)}
                        </span>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {p.stockQuantity} {p.unit || "units"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${p.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 bg-white border border-rose-300 rounded-lg hover:bg-rose-50 transition-colors"
                        >
                          <ShoppingCart size={12} /> Add to Cart
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-white bg-rose-500 rounded-lg hover:bg-rose-600 transition-colors"
                        >
                          <Zap size={12} /> Buy Now
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}