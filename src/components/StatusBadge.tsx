import { STATUS_STYLES, type Status } from '@/constants';

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{
          backgroundColor:
            status === 'Upcoming'
              ? '#3b82f6'
              : status === 'Ongoing'
              ? '#f59e0b'
              : status === 'Completed'
              ? '#10b981'
              : '#ef4444',
        }}
      />
      {status}
    </span>
  );
}
