import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatNumber } from '@/lib/utils';

export function AdminOverview({ users, links, clicks, recentUsers }: { users: number; links: number; clicks: number; recentUsers: any[] }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/10"><CardContent className="p-6"><p className="text-sm text-muted-foreground">Users</p><p className="mt-2 text-3xl font-bold">{formatNumber(users)}</p></CardContent></Card>
        <Card className="border-white/10"><CardContent className="p-6"><p className="text-sm text-muted-foreground">Links</p><p className="mt-2 text-3xl font-bold">{formatNumber(links)}</p></CardContent></Card>
        <Card className="border-white/10"><CardContent className="p-6"><p className="text-sm text-muted-foreground">Clicks</p><p className="mt-2 text-3xl font-bold">{formatNumber(clicks)}</p></CardContent></Card>
      </div>
      <Card className="border-white/10">
        <CardHeader><CardTitle className="text-lg">Recent users</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-sm">
                <div>
                  <p className="font-medium">{user.name || 'Unnamed user'}</p>
                  <p className="text-muted-foreground">{user.email}</p>
                </div>
                <span className="text-muted-foreground">{formatDate(user.createdAt)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}