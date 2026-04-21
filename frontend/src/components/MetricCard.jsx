export default function MetricCard({ label, value, icon: Icon, tone = 'primary' }) {
  const toneMap = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-green-50 text-success',
    warning: 'bg-amber-50 text-warning',
    danger: 'bg-red-50 text-danger'
  };
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-neutral-600 uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-neutral-900 mt-2">{value}</p>
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${toneMap[tone]}`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
