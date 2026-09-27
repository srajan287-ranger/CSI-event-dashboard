import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: string;
  trendUp?: boolean;
  color: 'blue' | 'amber' | 'emerald' | 'rose' | 'violet' | 'cyan';
}

const colorMap: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', ring: 'ring-blue-600/10' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', ring: 'ring-amber-600/10' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', ring: 'ring-emerald-600/10' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', ring: 'ring-rose-600/10' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', ring: 'ring-violet-600/10' },
  cyan: { bg: 'bg-cyan-50 dark:bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', ring: 'ring-cyan-600/10' },
};

export default function StatCard({ icon: Icon, label, value, trend, trendUp, color }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ring-1 ring-inset ${c.bg} ${c.text} ${c.ring}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {trend && (
        <p className={`mt-3 flex items-center gap-1 text-xs font-medium ${trendUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
          {trendUp ? '▲' : '■'} {trend}
        </p>
      )}
    </div>
  );
}
