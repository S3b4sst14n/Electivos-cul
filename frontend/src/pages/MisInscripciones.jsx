import { useEffect, useState } from 'react';
import { Calendar, MapPin, User, BookOpen, ClipboardList } from 'lucide-react';
import { myEnrollments, cancelEnrollment } from '../api/enrollments';
import EstadoBadge from '../components/EstadoBadge';
import ModalidadBadge from '../components/ModalidadBadge';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { useToast } from '../components/Toast';

export default function MisInscripciones() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const res = await myEnrollments();
      setData(res.inscripciones || []);
    } catch {
      toast.error('No se pudieron cargar tus inscripciones');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCancel() {
    if (!confirming) return;
    try {
      await cancelEnrollment(confirming.id);
      toast.success('Inscripción cancelada');
      setConfirming(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al cancelar');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Mis inscripciones</h1>
      <p className="text-sm text-neutral-600 mb-6">
        {data.length} {data.length === 1 ? 'curso inscrito' : 'cursos inscritos'}
      </p>

      {loading ? (
        <div className="text-center py-12 text-sm text-neutral-600">Cargando...</div>
      ) : data.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Aún no tienes inscripciones"
          message="Explora el catálogo de electivas y encuentra una que te interese."
        />
      ) : (
        <div className="space-y-3">
          {data.map((ins) => {
            const off = ins.course_offerings || {};
            const course = off.elective_courses || {};
            const teacher = off.teacher;
            return (
              <div key={ins.id} className="card p-5 flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <EstadoBadge status={ins.status} />
                    <ModalidadBadge modality={course.modality} />
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600">
                      <BookOpen size={12} /> {course.credits} créditos
                    </span>
                  </div>
                  <h3 className="text-base font-semibold">{course.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600 mt-2">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {off.schedule}</span>
                    <span className="flex items-center gap-1"><MapPin size={12} /> {off.classroom || 'Aula por asignar'}</span>
                    {teacher && (
                      <span className="flex items-center gap-1">
                        <User size={12} /> {teacher.first_name} {teacher.last_name}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setConfirming(ins)}
                  className="btn-ghost text-danger border-red-200 hover:bg-red-50"
                >
                  Cancelar
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={!!confirming}
        title="¿Cancelar inscripción?"
        message={`Vas a cancelar tu inscripción en "${confirming?.course_offerings?.elective_courses?.name}". Esta acción liberará el cupo.`}
        confirmText="Sí, cancelar"
        cancelText="Volver"
        danger
        onConfirm={handleCancel}
        onCancel={() => setConfirming(null)}
      />
    </div>
  );
}
