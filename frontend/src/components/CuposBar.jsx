export default function CuposBar({ available, total }) {
  const pct = total > 0 ? Math.max(0, Math.min(100, (available / total) * 100)) : 0;
  let color = 'bg-success';
  let label = 'Disponible';
  if (available === 0) {
    color = 'bg-danger';
    label = 'Sin cupos';
  } else if (pct <= 30) {
    color = 'bg-warning';
    label = 'Pocos cupos';
  }

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-medium text-neutral-900">{label}</span>
        <span className="text-neutral-600">{available}/{total}</span>
      </div>
      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
