import { Card } from '@/components/ui/card';

export default function PricingLoading() {
  return (
    <main className="min-h-screen bg-background px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <div className="mx-auto h-8 w-64 animate-pulse rounded bg-muted/40" />
          <div className="mx-auto mt-4 h-4 w-96 animate-pulse rounded bg-muted/40" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-white/10 p-6">
              <div className="space-y-4">
                <div className="h-6 w-24 animate-pulse rounded bg-muted/40" />
                <div className="h-10 w-32 animate-pulse rounded bg-muted/40" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-3 w-full animate-pulse rounded bg-muted/40" />
                  ))}
                </div>
                <div className="h-10 w-full animate-pulse rounded bg-muted/40" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
