import { Card } from '@/components/ui/card';

export default function DashboardLoading() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} className="border-white/10 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 space-y-3">
              <div className="h-4 w-48 animate-pulse rounded bg-muted/40" />
              <div className="h-3 w-72 animate-pulse rounded bg-muted/40" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted/40" />
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-8 w-8 animate-pulse rounded bg-muted/40" />
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
