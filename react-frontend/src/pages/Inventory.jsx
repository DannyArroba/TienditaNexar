import React, { useState, useEffect } from 'react';
import { productsApi } from '../api';
import { Plus, Edit2, Trash2, X, Upload, Loader2, Package, TrendingUp, ShoppingCart } from 'lucide-react';
import Swal from 'sweetalert2';
import { useCart } from '../context/CartContext';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [purchaseProduct, setPurchaseProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showOtherCategory, setShowOtherCategory] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsApi.getAll();
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await productsApi.getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (editingProduct) {
      setSelectedCategory(editingProduct.category);
      setShowOtherCategory(false);
    } else {
      setSelectedCategory('');
      setShowOtherCategory(false);
    }
  }, [editingProduct, isModalOpen]);

  const handlePurchase = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.target);
    const quantity = parseInt(formData.get('quantity'));
    
    // In a real app, this would call a stock_purchases API
    // For now, we update the product stock via the existing update API
    const updatedProduct = { ...purchaseProduct, stock: parseInt(purchaseProduct.stock) + quantity };
    const updateData = new FormData();
    updateData.append('action', 'update');
    updateData.append('id', updatedProduct.id);
    updateData.append('name', updatedProduct.name);
    updateData.append('price', updatedProduct.price);
    updateData.append('stock', updatedProduct.stock);
    updateData.append('category', updatedProduct.category);
    updateData.append('description', updatedProduct.description);

    try {
      const res = await productsApi.update(updateData);
      if (res.data.status === 'success') {
        Swal.fire('Stock Actualizado', `Se agregaron ${quantity} unidades a ${purchaseProduct.name}`, 'success');
        setIsPurchaseModalOpen(false);
        fetchProducts();
      }
    } catch (err) {
      Swal.fire('Error', 'No se pudo actualizar el stock', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await productsApi.delete(id);
        setProducts(products.filter(p => p.id !== id));
        Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
      } catch (err) {
        Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.target);
    
    if (editingProduct) {
      formData.append('action', 'update');
      formData.append('id', editingProduct.id);
    } else {
      formData.append('action', 'add');
    }

    try {
      const res = await productsApi.update(formData);
      if (res.data.status === 'success') {
        Swal.fire('Éxito', res.data.message, 'success');
        setIsModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
        fetchCategories(); // Actualizar lista de categorías por si se agregó una nueva
      } else {
        Swal.fire('Error', res.data.message, 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Ocurrió un error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter">Panel de Control - Alimentos</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Administra el stock de productos frescos y abarrotes</p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-primary-100"
        >
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Producto</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoría</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Precio</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-100">
                        <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="font-bold text-gray-900 text-sm">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-black uppercase rounded-lg">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-black text-gray-900 text-sm">
                    ${parseFloat(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-3.5 w-3.5 text-gray-400" />
                      <span className="font-bold text-sm">{product.stock}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setPurchaseProduct(product); setIsPurchaseModalOpen(true); }}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        title="Abastecer stock"
                      >
                        <TrendingUp className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Purchase Modal (Abastecimiento) */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-green-50">
              <h2 className="text-xl font-bold text-green-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Abastecer Producto
              </h2>
              <button onClick={() => setIsPurchaseModalOpen(false)} className="p-2 hover:bg-green-100 rounded-full transition-colors text-green-800">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handlePurchase} className="p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <div className="h-12 w-12 rounded-xl overflow-hidden border border-gray-100 bg-white">
                  <img src={purchaseProduct?.image_url} alt={purchaseProduct?.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{purchaseProduct?.name}</p>
                  <p className="text-xs text-gray-500">Stock actual: {purchaseProduct?.stock} unidades</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Cantidad a Ingresar</label>
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  required
                  autoFocus
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-xl font-bold text-center"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-green-100 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="h-5 w-5 animate-spin" />}
                Confirmar Ingreso de Stock
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nombre</label>
                <input
                  name="name"
                  required
                  defaultValue={editingProduct?.name}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Precio</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  defaultValue={editingProduct?.price}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Stock</label>
                <input
                  name="stock"
                  type="number"
                  required
                  defaultValue={editingProduct?.stock}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Categoría</label>
                <div className="relative">
                  <input
                    name="category"
                    list="categories-list"
                    required
                    defaultValue={editingProduct?.category}
                    placeholder="Escribe o selecciona una categoría..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                  <datalist id="categories-list">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Imagen</label>
                <div className="relative">
                  <input
                    name="image"
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-2 text-gray-500">
                    <Upload className="h-5 w-5" />
                    <span className="text-sm">Subir imagen...</span>
                  </div>
                </div>
              </div>

              <div className="col-span-2 flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-primary-100 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="h-5 w-5 animate-spin" />}
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
