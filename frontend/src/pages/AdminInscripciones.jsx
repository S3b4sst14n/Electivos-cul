import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { listOfferings } from '../api/courses';
import { enrollmentsByOffering } from '../api/enrollments';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';

export default function AdminInscripciones() {
  const toast = useToast();
  const [offerings, setOfferings] = useState([]);
  const [selected, setSelected] = useState('');
  const [orden, setOrden] = useState('nombre');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await listOfferings();
        setOfferings(data);
        if (data.length) setSelected(String(data[0].id));
      } catch {
        toast.error('Error al cargar ofertas');
      }
    })();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    enrollmentsByOffering(selected, orden)
      .then(setResult)
      .catch(() => toast.error('Error al cargar inscritos'))
      .finally(() => setLoading(false));
  }, [selected, orden]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Inscripciones por oferta</h1>
      <p className="text-sm text-neutral-600 mb-6">Consulta el listado de estudiantes inscritos en cada oferta</p>

      <div className="card p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[240px]">
            <label className="label">Oferta</label>
            <select className="input" value={selected} onChange={(e) => setSelected(e.target.value)}>
              {offerings.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.elective_courses?.name} — {o.schedule}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Ordenar por</label>
            <select className="input" value={orden} onChange={(e) => setOrden(e.target.value)}>
              <option value="nombre">Nombre</option>
              <option value="identificacion">Identificación</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-neutral-600">Cargando inscritos...</div>
      ) : !result ? null : result.estudiantes.length === 0 ? (
        <EmptyState icon={Users} title="Sin inscritos" message="Aún no hay estudiantes inscritos en esta oferta." />
      ) : (
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-neutral-200">
            <h2 className="font-semibold">{result.curso}</h2>
            <p className="text-sm text-neutral-600">{result.total_inscritos} estudiantes inscritos</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-xs uppercase text-neutral-600">
              <tr>
                <th className="px-4 py-3 text-left font-medium">#</th>
                <th className="px-4 py-3 text-left font-medium">Identificación</th>
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Correo</th>
              </tr>
            </thead>
            <tbody>
              {result.estudiantes.map((e, i) => (
                <tr key={e.id} className="border-t border-neutral-200">
                  <td className="px-4 py-3 text-neutral-600">{i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs">{e.student.identification_number}</td>
                  <td className="px-4 py-3 font-medium">
                    {e.student.first_name} {e.student.last_name} {e.student.second_last_name}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{e.student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
