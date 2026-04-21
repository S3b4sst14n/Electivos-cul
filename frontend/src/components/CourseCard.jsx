import { Calendar, MapPin, User, BookOpen } from 'lucide-react';
import ModalidadBadge from './ModalidadBadge';
import CuposBar from './CuposBar';

export default function CourseCard({ offering, onEnroll, enrolling }) {
  const course = offering.elective_courses || {};
  const teacher = offering.teacher;
  const total = course.max_capacity || offering.available_spots;
  const noSpots = offering.available_spots <= 0;

  return (
    <div className="card p-5 flex flex-col hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <ModalidadBadge modality={course.modality} />
        <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600">
          <BookOpen size={12} />
          {course.credits} créditos
        </span>
      </div>

      <h3 className="text-base font-semibold text-neutral-900 leading-tight">{course.name}</h3>
      {course.description && (
        <p className="text-sm text-neutral-600 mt-1 line-clamp-2">{course.description}</p>
      )}

      <div className="border-t border-neutral-200 my-4" />

      <div className="space-y-1.5 text-xs text-neutral-600 mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} /> {offering.schedule || 'Por definir'}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={12} /> {offering.classroom || 'Aula por asignar'}
        </div>
        {teacher && (
          <div className="flex items-center gap-1.5">
            <User size={12} /> {teacher.first_name} {teacher.last_name}
          </div>
        )}
      </div>

      <div className="mt-auto">
        <CuposBar available={offering.available_spots} total={total} />
        <button
          onClick={() => onEnroll?.(offering)}
          disabled={noSpots || enrolling}
          className={`mt-4 w-full ${noSpots ? 'btn-ghost' : 'btn-success'}`}
        >
          {enrolling ? 'Inscribiendo...' : noSpots ? 'Sin cupos' : 'Inscribirme'}
        </button>
      </div>
    </div>
  );
}
