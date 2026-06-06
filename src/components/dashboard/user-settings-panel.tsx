'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Copy, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { useApp } from '@/components/providers/app-provider';

export function UserSettingsPanel({ user, plans }: { user: any; plans: any[] }) {
  const { locale } = useApp();
  const id = locale === 'id';
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [apiKey, setApiKey] = useState(user?.apiKey || '');
  const [saving, setSaving] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [sendingTicket, setSendingTicket] = useState(false);

  async function saveProfile() {
    setSaving(true);
    const res = await fetch('/api/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    setSaving(false);
    if (!res.ok) { toast.error(id ? 'Gagal memperbarui profil' : 'Failed to update profile'); return; }
    toast.success(id ? 'Profil diperbarui' : 'Profile updated');
  }

  async function changePassword() {
    if (newPassword !== confirmPassword) {
      toast.error(id ? 'Password tidak cocok' : 'Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error(id ? 'Password minimal 8 karakter' : 'Password must be at least 8 characters');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { toast.error(data.error || (id ? 'Gagal mengubah password' : 'Failed to change password')); return; }
    toast.success(id ? 'Password diubah' : 'Password changed');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }

  async function rotateApiKey() {
    if (!confirm(id ? 'Rotasi API key? Key saat ini akan langsung berhenti bekerja.' : 'Rotate API key? Your current key will stop working immediately.')) return;
    setRotating(true);
    const res = await fetch('/api/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rotateApiKey: true })
    });
    const data = await res.json();
    setRotating(false);
    if (!res.ok) { toast.error(id ? 'Gagal merotasi key' : 'Failed to rotate key'); return; }
    setApiKey(data.apiKey);
    toast.success(id ? 'API key dirotasi' : 'API key rotated');
  }

  async function copyApiKey() {
    await navigator.clipboard.writeText(apiKey);
    toast.success(id ? 'API key disalin' : 'API key copied');
  }

  async function submitTicket() {
    if (!ticketSubject || !ticketMessage) {
      toast.error(id ? 'Isi subjek dan pesan' : 'Please fill in subject and message');
      return;
    }
    setSendingTicket(true);
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject: ticketSubject, message: ticketMessage })
    });
    const data = await res.json();
    setSendingTicket(false);
    if (!res.ok) { toast.error(data.error || (id ? 'Gagal mengirim tiket' : 'Failed to submit ticket')); return; }
    toast.success(id ? 'Tiket dikirim. Kami akan segera membalas.' : 'Ticket submitted. We will reply soon.');
    setTicketSubject('');
    setTicketMessage('');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-white/10">
        <CardHeader><CardTitle className="text-lg">{id ? 'Profil' : 'Profile'}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{id ? 'Nama' : 'Name'}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={id ? 'Nama Anda' : 'Your name'} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{id ? 'Email' : 'Email'}</label>
            <Input value={user?.email} disabled className="opacity-60" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{id ? 'Anggota sejak' : 'Member since'}</label>
            <p className="text-sm text-muted-foreground">{user?.createdAt ? formatDate(user.createdAt) : '-'}</p>
          </div>
          <Button onClick={saveProfile} disabled={saving}>{saving ? (id ? 'Menyimpan...' : 'Saving...') : (id ? 'Simpan profil' : 'Save profile')}</Button>
        </CardContent>
      </Card>

      <Card className="border-white/10">
        <CardHeader><CardTitle className="text-lg">{id ? 'Ubah password' : 'Change password'}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{id ? 'Password saat ini' : 'Current password'}</label>
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{id ? 'Password baru' : 'New password'}</label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{id ? 'Konfirmasi password baru' : 'Confirm new password'}</label>
            <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" />
          </div>
          <Button onClick={changePassword} disabled={saving}>{saving ? (id ? 'Menyimpan...' : 'Saving...') : (id ? 'Ubah password' : 'Change password')}</Button>
        </CardContent>
      </Card>

      <Card className="border-white/10">
        <CardHeader><CardTitle className="text-lg">{id ? 'Kunci API' : 'API key'}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <code className="flex-1 truncate text-sm text-primary">{apiKey || (id ? 'Tidak ada API key' : 'No API key')}</code>
            <Button size="icon" variant="ghost" onClick={copyApiKey}><Copy className="h-4 w-4" /></Button>
          </div>
          <p className="text-sm text-muted-foreground">{id ? 'Gunakan key ini di header Authorization: ' : 'Use this key in the Authorization header: '}<code className="text-primary">Bearer YOUR_KEY</code></p>
          <Button variant="outline" onClick={rotateApiKey} disabled={rotating}>
            <RefreshCw className={`mr-2 h-4 w-4 ${rotating ? 'animate-spin' : ''}`} />
            {rotating ? (id ? 'Merotasi...' : 'Rotating...') : (id ? 'Rotasi API key' : 'Rotate API key')}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/10">
        <CardHeader><CardTitle className="text-lg">{id ? 'Paket saat ini' : 'Current plan'}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-primary/20 bg-primary/10 p-4">
            <p className="text-sm text-muted-foreground">{id ? 'Paket aktif' : 'Active plan'}</p>
            <p className="mt-1 text-2xl font-bold">{user?.plan?.name || 'Starter (Free)'}</p>
            {user?.plan?.description && <p className="mt-1 text-sm text-muted-foreground">{user.plan.description}</p>}
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              {id
                ? 'Free plan: maksimal 3 link aktif, tanpa slug kustom, dan link berlaku 90 hari. Upgrade untuk slug kustom dan limit lebih besar.'
                : 'Free plan: maximum 3 active links, no custom slug, and links stay valid for 90 days. Upgrade for custom slugs and higher limits.'}
            </p>
          </div>
          {plans.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">{id ? 'Paket tersedia' : 'Available plans'}</p>
              <div className="space-y-2">
                {plans.map((plan) => (
                  <div key={plan.id} className={`flex items-center justify-between rounded-xl border p-3 text-sm ${user?.planId === plan.id ? 'border-primary/40 bg-primary/10' : 'border-white/10'}`}>
                    <div>
                      <p className="font-medium">{plan.name} — ${plan.price}/{plan.interval}</p>
                      <p className="text-xs text-muted-foreground">{plan.maxLinks} {id ? 'tautan' : 'links'}, {plan.maxDomains} {id ? 'domain' : 'domains'}</p>
                    </div>
                    {user?.planId === plan.id && <span className="text-xs text-primary">{id ? 'Saat ini' : 'Current'}</span>}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{id ? 'Hubungi dukungan untuk upgrade paket.' : 'Contact support to upgrade your plan.'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-white/10 lg:col-span-2">
        <CardHeader><CardTitle className="text-lg">{id ? 'Kirim tiket dukungan' : 'Submit a support ticket'}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{id ? 'Subjek' : 'Subject'}</label>
            <Input value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} placeholder={id ? 'Deskripsi singkat masalah Anda' : 'Brief description of your issue'} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{id ? 'Pesan' : 'Message'}</label>
            <textarea
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder={id ? 'Jelaskan masalah Anda secara detail...' : 'Describe your issue in detail...'}
              rows={5}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Button onClick={submitTicket} disabled={sendingTicket}>
            <Plus className="mr-2 h-4 w-4" />
            {sendingTicket ? (id ? 'Mengirim...' : 'Submitting...') : (id ? 'Kirim tiket' : 'Submit ticket')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

