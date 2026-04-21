import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { listOfferings, deleteOffering } from '../api/courses';
import ModalidadBadge from '../components/ModalidadBadge';
import CuposBar from '../components/CuposBar';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';

export default function AdminOfertas() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  async function load() {
    setLoading(true);
    try {
      setItems(await listOfferings());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    try {
      await deleteOffering(deleting.id);
      toast.success('Oferta eliminada');
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al eliminar');
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ofertas de cursos</h1>
          <p className="text-sm text-neutral-600 mt-0.5">{items.length} ofertas activas</p>
        </div>
        <button className="btn-primary" disabled title="Crear oferta (requiere form avanzado)">
          <Plus size={16} /> Nueva oferta
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-neutral-600">Cargando...</div>
      ) : items.length === 0 ? (
        <EmptyState title="Sin ofertas" message="Aún no se han creado ofertas de cursos." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((o) => {
            const c = o.elective_courses || {};
            const teacher = o.teacher;
            const period = o.academic_periods;
            return (
              <div key={o.id} className="card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ModalidadBadge modality={c.modality} />
                    {period && (
                      <span className="text-xs text-neutral-600 font-medium">
                        {period.year}-{period.period}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-neutral-100 rounded" title="Editar">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleting(o)} className="p-1.5 hover:bg-red-50 text-danger rounded" title="Eliminar">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 className="font-semibold">{c.name}</h3>
                <div className="text-xs text-neutral-600 mt-1 space-y-0.5">
                  <p>📅 {o.schedule}</p>
                  <p>📍 {o.classroom || 'Aula por asignar'}</p>
                  {teacher && <p>👤 {teacher.first_name} {teacher.last_name}</p>}
                </div>
                <div className="mt-3">
                  <CuposBar available={o.available_spots} total={c.max_capacity || o.available_spots} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={!!deleting}
        title="¿Eliminar oferta?"
        message={`La oferta de "${deleting?.elective_courses?.name}" se eliminará. No se puede eliminar si tiene estudiantes inscritos.`}
        confirmText="Eliminar"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
