import { useEffect, useMemo, useState } from 'react';
import { Search, BookOpen } from 'lucide-react';
import { listOfferings } from '../api/courses';
import { enroll } from '../api/enrollments';
import CourseCard from '../components/CourseCard';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';

const FILTERS = [
  { key: 'todas', label: 'Todas' },
  { key: 'presencial', label: 'Presencial' },
  { key: 'virtual', label: 'Virtual' },
  { key: 'mixta', label: 'Mixta' },
  { key: 'disponibles', label: 'Con cupos' }
];

export default function Catalogo() {
  const toast = useToast();
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('todas');
  const [enrollingId, setEnrollingId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await listOfferings();
      setOfferings(data);
    } catch {
      toast.error('No se pudieron cargar las electivas');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return offerings.filter((o) => {
      const course = o.elective_courses || {};
      const matchesQuery = !q || course.name?.toLowerCase().includes(q.toLowerCase());
      if (!matchesQuery) return false;
      if (filter === 'todas') return true;
      if (filter === 'disponibles') return o.available_spots > 0;
      return course.modality === filter;
    });
  }, [offerings, q, filter]);

  async function handleEnroll(offering) {
    setEnrollingId(offering.id);
    try {
      await enroll(offering.id);
      toast.success(`Te inscribiste en ${offering.elective_courses?.name}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al inscribirse');
    } finally {
      setEnrollingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Electivas disponibles</h1>
          <p className="text-sm text-neutral-600 mt-0.5">
            {filtered.length} {filtered.length === 1 ? 'curso' : 'cursos'}
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
          <input
            className="input pl-9 w-64"
            placeholder="Buscar electiva..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
              filter === f.key
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-sm text-neutral-600">Cargando electivas...</div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Sin resultados"
          message="No encontramos electivas con esos criterios. Prueba cambiando los filtros o la búsqueda."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((o) => (
            <CourseCard
              key={o.id}
              offering={o}
              onEnroll={handleEnroll}
              enrolling={enrollingId === o.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
