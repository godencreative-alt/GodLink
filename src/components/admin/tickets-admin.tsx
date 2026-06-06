'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { useApp } from '@/components/providers/app-provider';

const statusColors: Record<string, string> = {
  OPEN: 'bg-yellow-500/20 text-yellow-400',
  REPLIED: 'bg-blue-500/20 text-blue-400',
  CLOSED: 'bg-green-500/20 text-green-400'
};

const typeColors: Record<string, string> = {
  support: 'bg-blue-500/20 text-blue-400',
  feedback: 'bg-purple-500/20 text-purple-400',
  complaint: 'bg-red-500/20 text-red-400'
};

export function TicketsAdmin({ tickets: initialTickets }: { tickets: any[] }) {
  const { locale } = useApp();
  const id = locale === 'id';
  const [tickets, setTickets] = useState(initialTickets);
  const [replying, setReplying] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [saving, setSaving] = useState(false);

  const statusLabel: Record<string, string> = id
    ? { OPEN: 'TERBUKA', REPLIED: 'DIBALAS', CLOSED: 'DITUTUP' }
    : { OPEN: 'OPEN', REPLIED: 'REPLIED', CLOSED: 'CLOSED' };

  const typeLabel: Record<string, string> = id
    ? { support: 'dukungan', feedback: 'masukan', complaint: 'keluhan' }
    : { support: 'support', feedback: 'feedback', complaint: 'complaint' };

  async function sendReply(ticketId: string, status: string) {
    setSaving(true);
    const res = await fetch(`/api/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: replyText, status })
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      toast.error(data.error || (id ? 'Gagal membalas' : 'Failed to reply'));
      return;
    }

    toast.success(id ? 'Balasan terkirim' : 'Reply sent');
    setTickets(tickets.map((t) => (t.id === ticketId ? { ...t, reply: replyText, status } : t)));
    setReplying(null);
    setReplyText('');
  }

  function getContactInfo(ticket: any) {
    if (ticket.user?.name) return `${ticket.user.name} (${ticket.user.email || ticket.email})`;
    if (ticket.user?.email) return ticket.user.email;
    if (ticket.email) return ticket.email;
    return id ? 'Tidak diketahui' : 'Unknown';
  }

  return (
    <div className="space-y-4">
      {tickets.length === 0 && (
        <Card className="border-white/10 p-10 text-center text-muted-foreground">{id ? 'Belum ada tiket.' : 'No tickets yet.'}</Card>
      )}

      {tickets.map((ticket) => (
        <Card key={ticket.id} className="border-white/10">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{ticket.subject}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {id ? 'Dari' : 'From'} {getContactInfo(ticket)} • {formatDate(ticket.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${typeColors[ticket.type] || typeColors.support}`}>
                  {typeLabel[ticket.type] || typeLabel.support}
                </span>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[ticket.status]}`}>
                  {statusLabel[ticket.status] || ticket.status}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm leading-6">{ticket.message}</p>

            {ticket.reply && (
              <div className="rounded-lg bg-primary/10 p-3">
                <p className="text-xs font-medium text-primary">{id ? 'Balasan admin:' : 'Admin reply:'}</p>
                <p className="mt-1 text-sm">{ticket.reply}</p>
              </div>
            )}

            {replying === ticket.id ? (
              <div className="space-y-3">
                <Input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={id ? 'Tulis balasan Anda...' : 'Type your reply...'}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => sendReply(ticket.id, 'REPLIED')} disabled={saving || !replyText}>
                    {saving ? (id ? 'Mengirim...' : 'Sending...') : (id ? 'Kirim balasan' : 'Send reply')}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => sendReply(ticket.id, 'CLOSED')} disabled={saving}>
                    {id ? 'Tutup tiket' : 'Close ticket'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { setReplying(null); setReplyText(''); }}>
                    {id ? 'Batal' : 'Cancel'}
                  </Button>
                </div>
              </div>
            ) : (
              <Button size="sm" variant="ghost" onClick={() => { setReplying(ticket.id); setReplyText(ticket.reply || ''); }}>
                <MessageSquare className="mr-2 h-4 w-4" /> {id ? 'Balas' : 'Reply'}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}