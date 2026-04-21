import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title, message, action }) {
  return (
    <div className="card p-12 flex flex-col items-center justify-center text-center">
      <div className="p-3 bg-neutral-100 rounded-full mb-4">
        <Icon size={28} className="text-neutral-400" />
      </div>
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      {message && <p className="text-sm text-neutral-600 mt-1 max-w-sm">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
