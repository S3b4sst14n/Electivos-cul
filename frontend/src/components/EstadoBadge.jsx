import { CheckCircle2, XCircle } from 'lucide-react';

export default function EstadoBadge({ status }) {
  const inscrito = status === 'inscrito';
  const Icon = inscrito ? CheckCircle2 : XCircle;
  const cls = inscrito
    ? 'bg-green-50 text-success border-green-100'
    : 'bg-red-50 text-danger border-red-100';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${cls}`}>
      <Icon size={12} />
      {inscrito ? 'Inscrito' : 'Cancelado'}
    </span>
  );
}
