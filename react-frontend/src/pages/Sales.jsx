import React, { useState, useEffect } from 'react';
import { productsApi } from '../api';
import { Search, Filter, ShoppingCart, Loader2, Package, Check, Plus, Minus, ArrowRight, XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProductCard = ({ product, addToCart, getItemCountInCart }) => {
  const [quantity, setQuantity] = useState(1);
  const inCartCount = getItemCountInCart(product.id);
  const outOfStock = parseInt(product.stock) <= 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col ${outOfStock ? 'opacity-60 grayscale' : ''}`}
    >
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {inCartCount > 0 && (
          <div className="absolute top-3 right-3 bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black shadow-lg border-2 border-white animate-in zoom-in">
            {inCartCount}
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Agotado</span>
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-black text-primary-600 uppercase tracking-wider bg-primary-50 px-2 py-0.5 rounded-md">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-gray-400">
            <Package className="h-3 w-3" />
            <span className="text-[10px] font-bold">{product.stock}</span>
          </div>
        </div>
        <h3 className="font-bold text-gray-900 line-clamp-1 mb-4">{product.name}</h3>
        
        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xl font-black text-gray-900">${parseFloat(product.price).toFixed(2)}</span>
            {!outOfStock && (
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden scale-90">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="p-2 hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center text-xs font-black text-gray-700">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="p-2 hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => !outOfStock && addToCart(product, quantity)}
            disabled={outOfStock}
            className={`w-full py-3 rounded-2xl transition-all active:scale-95 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 ${
              inCartCount > 0 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-100' 
                : 'bg-gray-900 text-white hover:bg-primary-600'
            }`}
          >
            {inCartCount > 0 ? (
              <>
                <Check className="h-4 w-4" />
                Añadido ({inCartCount})
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Añadir a venta
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Sales = () => {
  const { addToCart, cart, cartCount, totalWithIva, clearCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');

  const handleCancelSale = async () => {
    const result = await Swal.fire({
      title: '¿Cancelar venta?',
      text: "Se borrarán todos los productos de la venta actual",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Continuar'
    });

    if (result.isConfirmed) {
      await clearCart();
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: 'Venta cancelada',
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        productsApi.getAll(),
        productsApi.getCategories()
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'todas' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getItemCountInCart = (id) => {
    const item = cart.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Punto de Venta</h1>
          <p className="text-gray-500 font-medium">Selecciona los productos para la venta actual</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 sticky top-20 z-30">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de producto..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="h-5 w-5 text-gray-400 shrink-0 ml-2" />
          <button
            onClick={() => setSelectedCategory('todas')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'todas'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-100'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-100'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                addToCart={addToCart} 
                getItemCountInCart={getItemCountInCart} 
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Checkout Bar (Floating) */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-40"
          >
            <div className="bg-gray-900 text-white rounded-3xl p-4 shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl bg-gray-900/95">
              <div className="flex items-center gap-6 px-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Productos</span>
                  <span className="text-xl font-black">{cartCount} items</span>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-primary-400 tracking-widest">Total (IVA Incl.)</span>
                  <span className="text-2xl font-black text-primary-400">${totalWithIva.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancelSale}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-black transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-red-900/20"
                  title="Cancelar Venta Actual"
                >
                  <XCircle className="h-6 w-6" />
                  <span className="hidden sm:inline text-xs uppercase tracking-widest">Cancelar</span>
                </button>

                <Link
                  to="/checkout"
                  className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-primary-900/20"
                >
                  PAGAR AHORA
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-20">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No se encontraron productos</h3>
          <p className="text-gray-500">Intenta con otros filtros o términos de búsqueda</p>
        </div>
      )}
    </div>
  );
};

export default Sales;
