import logo from '../assets/vendora-logo.jpeg'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, LayoutDashboard, Package, AlertTriangle, Plus } from 'lucide-react'
import clsx from 'clsx'

export default function Navbar({ lowStockCount = 0 }) {
  const { pathname } = useLocation()

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/user-products', label: 'Products', icon: Package },
    { to: '/low-stock', label: 'Low Stock', icon: AlertTriangle, badge: lowStockCount },
  ]

  return (
    <header className="sticky top-0 z-50 border-b shadow-sm bg-white/90 backdrop-blur-md border-rose-100">
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
        <img 
  src={logo}
  alt="Vendora Logo"
  className="w-12 h-12 object-contain"
/>
          <span className="text-xl font-bold tracking-tight font-display text-rose-800">Vendora</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon, badge }) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all relative',
                pathname === to
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                  : 'text-rose-700 hover:bg-rose-50'
              )}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
              {badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
