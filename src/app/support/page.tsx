'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { MessageSquare, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FadeIn, ScaleIn } from '@/components/ui/animations';
import { useApp } from '@/components/providers/app-provider';

export default function SupportPage() {
  const { locale } = useApp();
  const id = locale === 'id';

  const [email, setEmail] = useState('');
  const [type, setType] = useState<'support' | 'feedback' | 'complaint'>('support');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, type, subject, message })
    });
    setLoading(false);
    if (!res.ok) {
      toast.error(id ? 'Gagal mengirim tiket' : 'Failed to submit ticket');
      return;
    }
    toast.success(id ? 'Tiket berhasil dikirim! Kami akan segera merespons.' : 'Ticket submitted! We will respond soon.');
    setEmail('');
    setSubject('');
    setMessage('');
  }

  return (
    <main className="min-h-screen bg-background px-6 py-20">
      <div className="absolute inset-0 -z-10 grain opacity-30" />
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <h1 className="text-5xl font-black tracking-tight">{id ? 'Dukungan' : 'Support'}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {id ? 'Punya pertanyaan, masukan, atau keluhan? Kirim tiket dan kami akan merespons secepatnya.' : 'Have a question, feedback, or complaint? Submit a ticket and we will respond as soon as possible.'}
          </p>
        </FadeIn>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <ScaleIn delay={0.1}>
            <Card className="border-white/10">
              <CardContent className="p-6">
                <MessageSquare className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{id ? 'Dukungan Teknis' : 'Technical Support'}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{id ? 'Masalah teknis, bug, atau masalah akun' : 'Technical issues, bugs, or account problems'}</p>
              </CardContent>
            </Card>
          </ScaleIn>
          <ScaleIn delay={0.2}>
            <Card className="border-white/10">
              <CardContent className="p-6">
                <Mail className="h-8 w-8 text-secondary" />
                <h3 className="mt-4 text-lg font-semibold">{id ? 'Masukan' : 'Feedback'}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{id ? 'Permintaan fitur dan ide perbaikan' : 'Feature requests and improvement ideas'}</p>
              </CardContent>
            </Card>
          </ScaleIn>
          <ScaleIn delay={0.3}>
            <Card className="border-white/10">
              <CardContent className="p-6">
                <Send className="h-8 w-8 text-amber-500" />
                <h3 className="mt-4 text-lg font-semibold">{id ? 'Keluhan' : 'Complaint'}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{id ? 'Laporkan penyalahgunaan, spam, atau pelanggaran kebijakan' : 'Report abuse, spam, or policy violations'}</p>
              </CardContent>
            </Card>
          </ScaleIn>
        </div>

        <FadeIn delay={0.4} className="mt-12">
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle>{id ? 'Kirim Tiket' : 'Submit a Ticket'}</CardTitle>
              <CardDescription>{id ? 'Isi formulir di bawah dan kami akan merespons secepatnya' : 'Fill out the form below and we will respond as soon as possible'}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{id ? 'Alamat Email' : 'Email Address'}</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={id ? 'email@anda.com' : 'your@email.com'}
                    required
                  />
                  <p className="text-xs text-muted-foreground">{id ? 'Kami akan menggunakan ini untuk merespons tiket Anda' : 'We will use this to respond to your ticket'}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{id ? 'Jenis Tiket' : 'Ticket Type'}</label>
                  <div className="flex gap-3">
                    {(['support', 'feedback', 'complaint'] as const).map((t) => {
                      const labels: Record<string, string> = {
                        support: id ? 'Dukungan' : 'Support',
                        feedback: id ? 'Masukan' : 'Feedback',
                        complaint: id ? 'Keluhan' : 'Complaint'
                      };
                      return (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                            type === t
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-white/10 text-muted-foreground hover:border-white/20'
                          }`}
                        >
                          {labels[t]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{id ? 'Subjek' : 'Subject'}</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={id ? 'Deskripsi singkat masalah atau ide Anda' : 'Brief description of your issue or idea'}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{id ? 'Pesan' : 'Message'}</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={id ? 'Berikan detail sebanyak mungkin...' : 'Provide as much detail as possible...'}
                    rows={6}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (id ? 'Mengirim...' : 'Submitting...') : (id ? 'Kirim Tiket' : 'Submit Ticket')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.5} className="mt-12">
          <Card className="border-white/10 bg-primary/5">
            <CardContent className="p-6">
              <h3 className="font-semibold">{id ? 'Waktu Respons' : 'Response Time'}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {id ? 'Kami berusaha merespons semua tiket dalam 24 jam pada hari kerja. Untuk masalah mendesak, email langsung ke ' : 'We aim to respond to all tickets within 24 hours during business days. For urgent issues, email us directly at '}<a href="mailto:hello@godencreative.com" className="text-primary hover:underline">hello@godencreative.com</a>
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </main>
  );
}