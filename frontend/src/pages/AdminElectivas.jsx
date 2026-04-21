import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { listElectives, createElective, updateElective, deleteElective } from '../api/courses';
import ModalidadBadge from '../components/ModalidadBadge';
import Drawer from '../components/Drawer';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';

const empty = { name: '', description: '', credits: 3, max_capacity: 25, modality: 'presencial' };

export default function AdminElectivas() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setItems(await listElectives());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm(empty);
    setDrawerOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      name: item.name || '',
      description: item.description || '',
      credits: item.credits || 3,
      max_capacity: item.max_capacity || 25,
      modality: item.modality || 'presencial'
    });
    setDrawerOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editing) {
        await updateElective(editing.id, form);
        toast.success('Electiva actualizada');
      } else {
        await createElective(form);
        toast.success('Electiva creada');
      }
      setDrawerOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    try {
      await deleteElective(deleting.id);
      toast.success('Electiva eliminada');
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al eliminar');
    }
  }

  const filtered = items.filter((i) => !q || i.name?.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Electivas</h1>
          <p className="text-sm text-neutral-600 mt-0.5">{items.length} electivas registradas</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus size={16} /> Nueva electiva
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="p-4 border-b border-neutral-200">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input className="input pl-9" placeholder="Buscar electiva..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-neutral-600">Cargando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState title="Sin electivas" message="Crea tu primera electiva con el botón de arriba." />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-xs uppercase text-neutral-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Modalidad</th>
                <th className="px-4 py-3 text-left font-medium">Créditos</th>
                <th className="px-4 py-3 text-left font-medium">Cupo máx.</th>
                <th className="px-4 py-3 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-neutral-200">
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3"><ModalidadBadge modality={item.modality} /></td>
                  <td className="px-4 py-3">{item.credits}</td>
                  <td className="px-4 py-3">{item.max_capacity}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="p-2 hover:bg-neutral-100 rounded" title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleting(item)} className="p-2 hover:bg-red-50 text-danger rounded" title="Eliminar">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Drawer
        open={drawerOpen}
        title={editing ? 'Editar electiva' : 'Nueva electiva'}
        onClose={() => setDrawerOpen(false)}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setDrawerOpen(false)}>Cancelar</button>
            <button className="btn-primary" onClick={handleSave} disabled={saving || !form.name}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label">Nombre *</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Descripción</label>
            <textarea className="input min-h-[80px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Créditos *</label>
              <input type="number" min="1" className="input" value={form.credits} onChange={(e) => setForm({ ...form, credits: +e.target.value })} />
            </div>
            <div>
              <label className="label">Cupo máximo *</label>
              <input type="number" min="1" className="input" value={form.max_capacity} onChange={(e) => setForm({ ...form, max_capacity: +e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Modalidad *</label>
            <select className="input" value={form.modality} onChange={(e) => setForm({ ...form, modality: e.target.value })}>
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual</option>
              <option value="mixta">Mixta</option>
            </select>
          </div>
        </div>
      </Drawer>

      <ConfirmModal
        open={!!deleting}
        title="¿Eliminar electiva?"
        message={`La electiva "${deleting?.name}" se eliminará. No se puede eliminar si tiene inscripciones activas.`}
        confirmText="Eliminar"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
