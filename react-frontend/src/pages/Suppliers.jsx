import React, { useEffect, useMemo, useState } from 'react';
import { suppliersApi } from '../api';
import {
  Edit2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Trash2,
  Building2,
  UserRound,
  X,
} from 'lucide-react';
import Swal from 'sweetalert2';

const emptySupplier = {
  company_name: '',
  contact_name: '',
  email: '',
  ruc: '',
  phone: '',
  address: '',
};

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await suppliersApi.getAll();
      setSuppliers(response.data);
    } catch (error) {
      Swal.fire('Error', 'No se pudo cargar la lista de proveedores', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return suppliers;
    return suppliers.filter((supplier) =>
      [supplier.company_name, supplier.contact_name, supplier.ruc, supplier.phone, supplier.email]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [suppliers, search]);

  const openForm = (supplier = null) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    setSaving(true);
    try {
      let response;
      if (editingSupplier) {
        formData.append('action', 'update');
        formData.append('id', editingSupplier.id);
        response = await suppliersApi.update(formData);
      } else {
        formData.append('action', 'add');
        response = await suppliersApi.add(formData);
      }

      if (response.data.status !== 'success') {
        Swal.fire('Error', response.data.message, 'error');
        return;
      }

      setIsFormOpen(false);
      setEditingSupplier(null);
      await fetchSuppliers();
      Swal.fire('Listo', response.data.message, 'success');
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'No se pudo guardar el proveedor', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (supplier) => {
    const result = await Swal.fire({
      title: 'Eliminar proveedor',
      text: `Se eliminará a ${supplier.company_name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    const formData = new FormData();
    formData.append('action', 'delete');
    formData.append('id', supplier.id);
    const response = await suppliersApi.delete(formData);
    if (response.data.status === 'success') {
      setSuppliers((current) => current.filter((item) => item.id !== supplier.id));
      Swal.fire('Eliminado', response.data.message, 'success');
    } else {
      Swal.fire('No se pudo eliminar', response.data.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Gestion de Proveedores</h1>
          <p className="text-sm text-gray-500 mt-1">Administra los datos de tus proveedores</p>
        </div>
        <button
          onClick={() => openForm()}
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase flex items-center justify-center gap-2 shadow-lg shadow-primary-100"
        >
          <Plus className="h-4 w-4" />
          Nuevo proveedor
        </button>
      </div>

      <div className="relative mb-5 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por empresa, contacto, RUC o celular"
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="h-9 w-9 animate-spin text-primary-600" />
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase">Proveedor</th>
                  <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase">Contacto</th>
                  <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase">RUC</th>
                  <th className="px-5 py-4 text-[10px] font-black text-gray-400 uppercase">Telefono</th>
                  <th className="px-5 py-4 text-right text-[10px] font-black text-gray-400 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary-50 text-primary-700 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">{supplier.company_name}</p>
                          <p className="text-xs text-gray-500">{supplier.email || 'Sin correo'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <UserRound className="h-4 w-4 text-gray-400" />
                        {supplier.contact_name || 'Sin contacto'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        {supplier.ruc || 'Sin RUC'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {supplier.phone || 'Sin teléfono'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openForm(supplier)} title="Editar" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(supplier)} title="Eliminar" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-4 md:px-6 py-4 md:py-5 border-b flex justify-between items-center bg-gray-50 shrink-0">
              <h2 className="font-black text-lg">{editingSupplier ? 'Editar proveedor' : 'Registrar proveedor'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-gray-200 rounded-lg"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
              {Object.entries({
                company_name: ['Nombre de empresa', 'text'],
                contact_name: ['Contacto', 'text'],
                email: ['Correo electronico', 'email'],
                ruc: ['RUC', 'text'],
                phone: ['Telefono', 'text'],
              }).map(([name, [label, type]]) => (
                <label key={name} className="space-y-1">
                  <span className="text-xs font-bold text-gray-500 uppercase">{label}</span>
                  <input
                    name={name}
                    type={type}
                    required={name === 'company_name'}
                    defaultValue={editingSupplier?.[name] ?? emptySupplier[name]}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </label>
              ))}
              <label className="md:col-span-2 space-y-1">
                <span className="text-xs font-bold text-gray-500 uppercase">Direccion</span>
                <textarea
                  name="address"
                  rows="3"
                  defaultValue={editingSupplier?.address || ''}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </label>
              <div className="md:col-span-2 flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-3 bg-gray-100 rounded-xl font-bold">Cancelar</button>
                <button disabled={saving} className="px-5 py-3 bg-primary-600 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-60">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Guardar proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;