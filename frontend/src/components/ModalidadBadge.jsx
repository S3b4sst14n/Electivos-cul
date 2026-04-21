import { Monitor, Building2, Shuffle } from 'lucide-react';

const config = {
  virtual: { label: 'Virtual', Icon: Monitor, cls: 'bg-blue-50 text-blue-700 border-blue-100' },
  presencial: { label: 'Presencial', Icon: Building2, cls: 'bg-purple-50 text-purple-700 border-purple-100' },
  mixta: { label: 'Mixta', Icon: Shuffle, cls: 'bg-amber-50 text-amber-700 border-amber-100' }
};

export default function ModalidadBadge({ modality }) {
  const c = config[modality] || config.presencial;
  const Icon = c.Icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs font-medium ${c.cls}`}>
      <Icon size={12} />
      {c.label}
    </span>
  );
}
