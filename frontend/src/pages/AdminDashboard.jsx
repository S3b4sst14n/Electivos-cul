import { useEffect, useMemo, useState } from 'react';
import { Library, CalendarDays, Users, AlertTriangle } from 'lucide-react';
import { listElectives, listOfferings } from '../api/courses';
import MetricCard from '../components/MetricCard';
import ModalidadBadge from '../components/ModalidadBadge';
import CuposBar from '../components/CuposBar';

export default function AdminDashboard() {
  const [electives, setElectives] = useState([]);
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [e, o] = await Promise.all([listElectives(), listOfferings()]);
        setElectives(e);
        setOfferings(o);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const metrics = useMemo(() => {
    const totalCupos = offerings.reduce((s, o) => s + (o.available_spots || 0), 0);
    const maxTotal = offerings.reduce((s, o) => s + (o.elective_courses?.max_capacity || 0), 0);
    const inscritos = Math.max(0, maxTotal - totalCupos);
    const sinCupos = offerings.filter((o) => o.available_spots === 0).length;
    return { electivas: electives.length, ofertas: offerings.length, inscritos, sinCupos };
  }, [electives, offerings]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-sm text-neutral-600 mb-6">Vista general del sistema</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Electivas activas" value={metrics.electivas} icon={Library} tone="primary" />
        <MetricCard label="Ofertas abiertas" value={metrics.ofertas} icon={CalendarDays} tone="primary" />
        <MetricCard label="Estudiantes inscritos" value={metrics.inscritos} icon={Users} tone="success" />
        <MetricCard label="Ofertas sin cupos" value={metrics.sinCupos} icon={AlertTriangle} tone={metrics.sinCupos > 0 ? 'danger' : 'success'} />
      </div>

      <div className="card p-5">
        <h2 className="text-lg font-semibold mb-4">Estado de ofertas</h2>
        {loading ? (
          <p className="text-sm text-neutral-600">Cargando...</p>
        ) : offerings.length === 0 ? (
          <p className="text-sm text-neutral-600">Aún no hay ofertas creadas.</p>
        ) : (
          <div className="space-y-3">
            {offerings.slice(0, 8).map((o) => {
              const c = o.elective_courses || {};
              return (
                <div key={o.id} className="flex items-center gap-4 py-2 border-b border-neutral-200 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{c.name}</p>
                      <ModalidadBadge modality={c.modality} />
                    </div>
                    <p className="text-xs text-neutral-600">{o.schedule}</p>
                  </div>
                  <div className="w-48">
                    <CuposBar available={o.available_spots} total={c.max_capacity || o.available_spots} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
