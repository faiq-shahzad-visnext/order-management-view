import { useEffect, useState } from 'react';
import './App.css';
import AddIcon from './assets/Add.svg?react';
import EditIcon from './assets/Edit.svg?react';
import DeleteIcon from './assets/Delete.svg?react';
import UpdateIcon from './assets/Update.svg?react';
import CancelIcon from './assets/Cancel.svg?react';

interface Order {
  id: number;
  customerName: string;
  freight: number;
  shipName: string;
  shipCountry: string;
}

const API_URL = 'http://localhost:3001/orders';

const icons = {
  add: AddIcon,
  edit: EditIcon,
  delete: DeleteIcon,
  update: UpdateIcon,
  cancel: CancelIcon,
};

function Toolbar({
  onAdd, onEdit, onDelete, onUpdate, onCancel,
  canEdit, canDelete, canUpdate, canCancel
}: any) {
  return (
    <div className="flex items-center border-b border-gray-200 bg-gray-50 px-4 py-2 space-x-6">
      <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600" onClick={onAdd}>
        <icons.add className="w-5 h-5" /> <span>Add</span>
      </button>
      <button className={`flex items-center space-x-1 ${canEdit ? 'text-gray-700 hover:text-blue-600' : 'text-gray-400 cursor-not-allowed'}`} onClick={canEdit ? onEdit : undefined} disabled={!canEdit}>
        <icons.edit className="w-5 h-5" /> <span>Edit</span>
      </button>
      <button className={`flex items-center space-x-1 ${canDelete ? 'text-gray-700 hover:text-blue-600' : 'text-gray-400 cursor-not-allowed'}`} onClick={canDelete ? onDelete : undefined} disabled={!canDelete}>
        <icons.delete className="w-5 h-5" /> <span>Delete</span>
      </button>
      <button className={`flex items-center space-x-1 ${canUpdate ? 'text-gray-700 hover:text-blue-600' : 'text-gray-400 cursor-not-allowed'}`} onClick={canUpdate ? onUpdate : undefined} disabled={!canUpdate}>
        <icons.update className="w-5 h-5" /> <span>Update</span>
      </button>
      <button className={`flex items-center space-x-1 ${canCancel ? 'text-gray-700 hover:text-blue-600' : 'text-gray-400 cursor-not-allowed'}`} onClick={canCancel ? onCancel : undefined} disabled={!canCancel}>
        <icons.cancel className="w-5 h-5" /> <span>Cancel</span>
      </button>
    </div>
  );
}

function OrderForm({ initial, onSave, onCancel, countries }: any) {
  const [form, setForm] = useState<Order>(initial);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">{initial.id ? 'Edit Order' : 'Add Order'}</h2>
        <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-3">
          <input type="text" className="w-full border rounded px-2 py-1" placeholder="Customer Name" value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} required />
          <input type="number" className="w-full border rounded px-2 py-1" placeholder="Freight" value={form.freight} onChange={e => setForm(f => ({ ...f, freight: parseFloat(e.target.value) }))} required />
          <input type="text" className="w-full border rounded px-2 py-1" placeholder="Ship Name" value={form.shipName} onChange={e => setForm(f => ({ ...f, shipName: e.target.value }))} required />
          <select className="w-full border rounded px-2 py-1" value={form.shipCountry} onChange={e => setForm(f => ({ ...f, shipCountry: e.target.value }))} required>
            <option value="" disabled>Select Country</option>
            {countries.map((country: string) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300" onClick={onCancel}>Cancel</button>
            <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<number|null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Order|null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formInitial, setFormInitial] = useState<Order|null>(null);
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      });
    fetch('http://localhost:3001/countries')
      .then(res => res.json())
      .then(setCountries);
  }, []);

  const handleAdd = () => {
    setFormInitial({ id: 0, customerName: '', freight: 0, shipName: '', shipCountry: '' });
    setShowForm(true);
  };
  const handleEdit = () => {
    if (selected == null) return;
    const order = orders.find(o => o.id === selected);
    if (order) {
      setEditForm(order);
      setEditing(true);
    }
  };
  const handleDelete = () => {
    if (selected == null) return;
    if (!window.confirm('Delete this order?')) return;
    fetch(`${API_URL}/${selected}`, { method: 'DELETE' })
      .then(res => res.ok && setOrders(orders => orders.filter(o => o.id !== selected)));
    setSelected(null);
  };
  const handleUpdate = () => {
    if (!editForm) return;
    fetch(`${API_URL}/${editForm.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    })
      .then(res => res.json())
      .then(updated => {
        setOrders(orders => orders.map(o => o.id === updated.id ? updated : o));
        setEditing(false);
        setEditForm(null);
      });
  };
  const handleCancel = () => {
    setEditing(false);
    setEditForm(null);
  };
  const handleSave = (order: Order) => {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    })
      .then(res => res.json())
      .then(newOrder => {
        setOrders(orders => [...orders, newOrder]);
        setShowForm(false);
        setFormInitial(null);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded shadow border w-[900px]">
        <Toolbar
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
          canEdit={selected != null && !editing}
          canDelete={selected != null && !editing}
          canUpdate={editing}
          canCancel={editing}
        />
        <div className="overflow-y-auto max-h-[420px]">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="font-semibold px-4 py-2 border-r border-gray-200">Order ID</th>
                <th className="font-semibold px-4 py-2 border-r border-gray-200">Customer Name</th>
                <th className="font-semibold px-4 py-2 border-r border-gray-200">Freight</th>
                <th className="font-semibold px-4 py-2 border-r border-gray-200">Ship Name</th>
                <th className="font-semibold px-4 py-2">Ship Country</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center p-4">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-4">No orders found.</td></tr>
              ) : (
                orders.map((order, idx) => (
                  <tr
                    key={order.id}
                    className={`cursor-pointer ${selected === order.id ? 'bg-blue-100' : idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    onClick={() => !editing && setSelected(order.id)}
                  >
                    <td className="px-4 py-2 border-r border-gray-200 font-medium">{order.id}</td>
                    {editing && selected === order.id ? (
                      <>
                        <td className="px-4 py-2 border-r border-gray-200">
                          <input type="text" className="w-full border rounded px-2 py-1" value={editForm?.customerName || ''} onChange={e => setEditForm(f => f ? { ...f, customerName: e.target.value } : f)} />
                        </td>
                        <td className="px-4 py-2 border-r border-gray-200">
                          <input type="number" className="w-full border rounded px-2 py-1" value={editForm?.freight || 0} onChange={e => setEditForm(f => f ? { ...f, freight: parseFloat(e.target.value) } : f)} />
                        </td>
                        <td className="px-4 py-2 border-r border-gray-200">
                          <input type="text" className="w-full border rounded px-2 py-1" value={editForm?.shipName || ''} onChange={e => setEditForm(f => f ? { ...f, shipName: e.target.value } : f)} />
                        </td>
                        <td className="px-4 py-2">
                          <select className="w-full border rounded px-2 py-1" value={editForm?.shipCountry || ''} onChange={e => setEditForm(f => f ? { ...f, shipCountry: e.target.value } : f)} required>
                            <option value="" disabled>Select Country</option>
                            {countries.map((country: string) => (
                              <option key={country} value={country}>{country}</option>
                            ))}
                          </select>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2 border-r border-gray-200">{order.customerName}</td>
                        <td className="px-4 py-2 border-r border-gray-200">${order.freight.toFixed(2)}</td>
                        <td className="px-4 py-2 border-r border-gray-200">{order.shipName}</td>
                        <td className="px-4 py-2">{order.shipCountry}</td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <OrderForm
          initial={formInitial}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          countries={countries}
        />
      )}
    </div>
  );
}

export default App;
