import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

export function SettingsPanel({ user }: { user: any }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">{user?.name || '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Role</p>
            <p className="font-medium">{user?.role}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Member since</p>
            <p className="font-medium">{user?.createdAt ? formatDate(user.createdAt) : '—'}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">API key</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl bg-white/[0.03] p-4 font-mono text-sm text-primary break-all">
            {user?.apiKey || 'No API key available'}
          </div>
          <p className="text-sm text-muted-foreground">Use this key for API requests from scripts, apps, or automations.</p>
          <Button disabled>Rotate key (coming soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}