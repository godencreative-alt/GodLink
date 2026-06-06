'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/components/providers/app-provider';

function FeaturesEditor({ value, onChange, id }: { value: string; onChange: (v: string) => void; id: boolean }) {
  const [items, setItems] = useState(() => value ? value.split(',').map(f => f.trim()).filter(Boolean) : []);
  const [newItem, setNewItem] = useState('');

  function addItem() {
    if (!newItem.trim()) return;
    const updated = [...items, newItem.trim()];
    setItems(updated);
    onChange(updated.join(','));
    setNewItem('');
  }

  function removeItem(i: number) {
    const updated = items.filter((_, idx) => idx !== i);
    setItems(updated);
    onChange(updated.join(','));
  }

  return (
    <div className="space-y-2">
      <div className="space-y-2 bg-black/10 p-3 rounded-md border border-white/5">
        {items.length === 0 && <p className="text-xs text-muted-foreground">{id ? 'Belum ada fitur' : 'No features added'}</p>}
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 bg-background/50 p-1.5 pl-3 rounded text-sm">
            <Check className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="flex-1">{item}</span>
            <Button type="button" size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeItem(i)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder={id ? 'Tambah fitur...' : 'Add feature...'} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())} />
        <Button type="button" onClick={addItem}><Plus className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

export function PlansAdmin({ plans: initialPlans }: { plans: any[] }) {
  const { locale } = useApp();
  const id = locale === 'id';
  const [plans, setPlans] = useState(initialPlans);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  async function savePlan(plan: any) {
    setSaving(true);
    const isNew = !plan.id;
    const url = isNew ? '/api/admin/plans' : `/api/admin/plans/${plan.id}`;
    const method = isNew ? 'POST' : 'PATCH';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      toast.error(data.error || (id ? 'Gagal menyimpan paket' : 'Failed to save plan'));
      return;
    }

    toast.success(isNew ? (id ? 'Paket dibuat' : 'Plan created') : (id ? 'Paket diperbarui' : 'Plan updated'));
    if (isNew) setPlans([...plans, data]);
    else setPlans(plans.map((p) => (p.id === data.id ? data : p)));
    setEditing(null);
  }

  async function deletePlan(planId: string) {
    const res = await fetch(`/api/admin/plans/${planId}`, { method: 'DELETE' });
    if (!res.ok) { toast.error(id ? 'Gagal menghapus' : 'Failed to delete'); return; }
    setPlans(plans.filter((p) => p.id !== planId));
    toast.success(id ? 'Paket dihapus' : 'Plan deleted');
  }

  function newPlan() {
    setEditing({ name: '', price: 0, currency: 'IDR', interval: 'month', maxLinks: 50, maxClicks: 1000, maxDomains: 0, description: '', features: '', sortOrder: plans.length, active: true });
  }

  function formatPrice(plan: any) {
    if (plan.currency === 'USD') return `$${Number(plan.price).toLocaleString('en-US')}`;
    if (plan.currency === 'IDR') return `Rp${Number(plan.price).toLocaleString('id-ID')}`;
    return `${plan.currency || 'USD'} ${plan.price}`;
  }

  return (
    <div className="space-y-4">
      <Button onClick={newPlan} size="sm"><Plus className="mr-2 h-4 w-4" /> {id ? 'Tambah paket' : 'Add plan'}</Button>

      {editing && (
        <Card className="border-primary/30">
          <CardHeader><CardTitle className="text-lg">{editing.id ? (id ? 'Edit paket' : 'Edit plan') : (id ? 'Paket baru' : 'New plan')}</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2"><label className="text-sm font-medium">{id ? 'Nama' : 'Name'}</label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">{id ? 'Harga' : 'Price'}</label><Input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })} /></div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{id ? 'Mata uang' : 'Currency'}</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editing.currency || 'IDR'}
                onChange={(e) => setEditing({ ...editing, currency: e.target.value })}
              >
                <option value="IDR">IDR (Rupiah)</option>
                <option value="USD">USD (Dollar)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{id ? 'Interval' : 'Interval'}</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={editing.interval || 'month'}
                onChange={(e) => setEditing({ ...editing, interval: e.target.value })}
              >
                <option value="month">{id ? 'Bulan' : 'Month'}</option>
                <option value="year">{id ? 'Tahun' : 'Year'}</option>
              </select>
            </div>
            <div className="space-y-2"><label className="text-sm font-medium">{id ? 'Maks tautan' : 'Max links'}</label><Input type="number" value={editing.maxLinks} onChange={(e) => setEditing({ ...editing, maxLinks: e.target.value })} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">{id ? 'Maks klik/bulan' : 'Max clicks/mo'}</label><Input type="number" value={editing.maxClicks} onChange={(e) => setEditing({ ...editing, maxClicks: e.target.value })} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">{id ? 'Maks domain' : 'Max domains'}</label><Input type="number" value={editing.maxDomains} onChange={(e) => setEditing({ ...editing, maxDomains: e.target.value })} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">{id ? 'Urutan' : 'Sort order'}</label><Input type="number" value={editing.sortOrder} onChange={(e) => setEditing({ ...editing, sortOrder: e.target.value })} /></div>
            <div className="col-span-full space-y-2"><label className="text-sm font-medium">{id ? 'Deskripsi' : 'Description'}</label><Input value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
            <div className="col-span-full space-y-2">
              <label className="text-sm font-medium">{id ? 'Fitur (checklist)' : 'Features (checklist)'}</label>
              <FeaturesEditor value={editing.features || ''} onChange={(v) => setEditing({ ...editing, features: v })} id={id} />
            </div>
            <div className="col-span-full flex gap-3">
              <Button onClick={() => savePlan(editing)} disabled={saving}>{saving ? (id ? 'Menyimpan...' : 'Saving...') : (id ? 'Simpan' : 'Save')}</Button>
              <Button variant="ghost" onClick={() => setEditing(null)}>{id ? 'Batal' : 'Cancel'}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {plans.map((plan) => (
          <Card key={plan.id} className="border-white/10">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{plan.name} <span className="text-primary">{formatPrice(plan)}/{plan.interval || 'mo'}</span></p>
                <p className="text-sm text-muted-foreground">{plan.maxLinks} {id ? 'tautan' : 'links'}, {plan.maxClicks} {id ? 'klik' : 'clicks'}, {plan.maxDomains} {id ? 'domain' : 'domains'}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setEditing(plan)}>{id ? 'Edit' : 'Edit'}</Button>
                <Button size="sm" variant="ghost" onClick={() => deletePlan(plan.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}