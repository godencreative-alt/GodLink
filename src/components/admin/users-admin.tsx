'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { useApp } from '@/components/providers/app-provider';

export function UsersAdmin({ users: initialUsers, plans }: { users: any[]; plans: any[] }) {
  const { locale } = useApp();
  const id = locale === 'id';
  const [users, setUsers] = useState(initialUsers);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  async function saveUser() {
    if (!editing) return;
    setSaving(true);
    const res = await fetch(`/api/admin/users/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editing.name,
        email: editing.email,
        role: editing.role,
        planId: editing.planId,
        password: editing.newPassword || undefined
      })
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      toast.error(data.error || (id ? 'Gagal memperbarui pengguna' : 'Failed to update user'));
      return;
    }

    toast.success(id ? 'Pengguna diperbarui' : 'User updated');
    setUsers(users.map((u) => (u.id === editing.id ? { ...u, ...editing, newPassword: undefined } : u)));
    setEditing(null);
  }

  async function deleteUser(userId: string) {
    if (!confirm(id ? 'Hapus pengguna ini? Ini tidak dapat dibatalkan.' : 'Delete this user? This cannot be undone.')) return;
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    if (!res.ok) { toast.error(id ? 'Gagal menghapus' : 'Failed to delete'); return; }
    setUsers(users.filter((u) => u.id !== userId));
    toast.success(id ? 'Pengguna dihapus' : 'User deleted');
  }

  return (
    <div className="space-y-4">
      {editing && (
        <Card className="border-primary/30">
          <CardHeader><CardTitle className="text-lg">{id ? 'Edit pengguna' : 'Edit user'}</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">{id ? 'Nama' : 'Name'}</label>
              <Input value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{id ? 'Email' : 'Email'}</label>
              <Input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{id ? 'Role' : 'Role'}</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editing.role}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
              >
                <option value="USER">{id ? 'PENGGUNA' : 'USER'}</option>
                <option value="ADMIN">{id ? 'ADMIN' : 'ADMIN'}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{id ? 'Paket' : 'Plan'}</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editing.planId || ''}
                onChange={(e) => setEditing({ ...editing, planId: e.target.value || null })}
              >
                <option value="">{id ? 'Tidak ada paket' : 'No plan'}</option>
                {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="col-span-full space-y-2">
              <label className="text-sm font-medium">{id ? 'Password baru (kosongkan untuk tetap saat ini)' : 'New password (leave blank to keep current)'}</label>
              <Input type="password" value={editing.newPassword || ''} onChange={(e) => setEditing({ ...editing, newPassword: e.target.value })} placeholder="••••••••" />
            </div>
            <div className="col-span-full flex gap-3">
              <Button onClick={saveUser} disabled={saving}>{saving ? (id ? 'Menyimpan...' : 'Saving...') : (id ? 'Simpan' : 'Save')}</Button>
              <Button variant="ghost" onClick={() => setEditing(null)}>{id ? 'Batal' : 'Cancel'}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {users.map((user) => (
          <Card key={user.id} className="border-white/10">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{user.name || (id ? 'Tanpa nama' : 'Unnamed')} <span className="text-xs text-muted-foreground">({user.role})</span></p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">{id ? 'Paket' : 'Plan'}: {user.plan?.name || (id ? 'Tidak ada' : 'None')} • {id ? 'Bergabung' : 'Joined'} {formatDate(user.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setEditing(user)}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => deleteUser(user.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}