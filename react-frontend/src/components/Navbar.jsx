import React from 'react';
import { ShoppingCart, User, LogOut, Menu, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartCount, setIsOpen } = useCart();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-black text-primary-600 tracking-tighter flex items-center gap-1">
              <span className="bg-primary-600 text-white px-2 py-0.5 rounded-lg">3</span>
              <span className="text-gray-900 uppercase">Hermanos</span>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="hidden md:block text-sm font-semibold text-gray-500 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/sales" className="hidden md:block text-sm font-semibold text-gray-500 hover:text-primary-600 transition-colors">
                  Vender
                </Link>
                <Link to="/inventory" className="hidden md:block text-sm font-semibold text-gray-500 hover:text-primary-600 transition-colors">
                  Inventario
                </Link>
                {user.role === 'admin' && (
                  <Link to="/users" className="hidden md:block text-sm font-semibold text-gray-500 hover:text-primary-600 transition-colors">
                    Usuarios
                  </Link>
                )}
                <span className="hidden md:block text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                  {user.role === 'admin' ? 'Admin' : 'Trabajador'}
                </span>
                <button
                  onClick={() => setIsOpen(true)}
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors relative"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-[10px] font-black leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full border-2 border-white">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-primary-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-700 transition-all"
              >
                Acceso Personal
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
