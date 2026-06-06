'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/components/providers/app-provider';

interface SiteSettingsFormProps {
  settings: Record<string, string>;
}

function ImageUploadField({ label, fieldKey, value, onChange, id }: { label: string; fieldKey: string; value: string; onChange: (v: string) => void; id: boolean }) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('type', fieldKey);
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
    const data = await res.json();
    setUploading(false);
    if (res.ok) {
      onChange(data.url);
      toast.success(id ? 'Gambar diunggah' : 'Image uploaded');
    } else {
      toast.error(data.error || (id ? 'Gagal mengunggah' : 'Upload failed'));
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {value && (
        <div className="relative h-16 w-32 overflow-hidden rounded border border-white/10 bg-white/5">
          <img src={value} alt="" className="h-full w-full object-contain" />
        </div>
      )}
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://..." />
        <label className="cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          <Button type="button" variant="outline" size="sm" disabled={uploading} asChild>
            <span>{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}</span>
          </Button>
        </label>
      </div>
    </div>
  );
}

export function SiteSettingsForm({ settings }: SiteSettingsFormProps) {
  const { locale } = useApp();
  const id = locale === 'id';
  const [values, setValues] = useState<Record<string, string>>(settings);
  const [saving, setSaving] = useState(false);

  const groups = useMemo(() => [
    {
      title: id ? 'Branding' : 'Branding',
      fields: [
        { key: 'siteName', label: id ? 'Nama situs' : 'Site name', placeholder: 'godl.ink', type: 'text' },
        { key: 'siteTagline', label: id ? 'Tagline' : 'Tagline', placeholder: 'by Goden Creative', type: 'text' },
        { key: 'logoUrl', label: id ? 'Logo' : 'Logo', placeholder: 'https://...', type: 'image' },
        { key: 'faviconUrl', label: id ? 'Favicon' : 'Favicon', placeholder: 'https://...', type: 'image' },
        { key: 'primaryColor', label: id ? 'Warna utama' : 'Primary color', placeholder: '#F5B544', type: 'text' },
        { key: 'secondaryColor', label: id ? 'Warna kedua' : 'Secondary color', placeholder: '#8B5CF6', type: 'text' }
      ]
    },
    {
      title: id ? 'Homepage' : 'Homepage',
      fields: [
        { key: 'homeBannerUrl', label: id ? 'Gambar banner' : 'Banner image', placeholder: 'https://...', type: 'image' },
        { key: 'homeTitle', label: id ? 'Judul hero' : 'Hero title', placeholder: 'Short links that feel premium...', type: 'text' },
        { key: 'homeSubtitle', label: id ? 'Subtitle hero' : 'Hero subtitle', placeholder: 'Create, protect, analyze...', type: 'text' },
        { key: 'homeBadgeText', label: id ? 'Teks badge' : 'Badge text', placeholder: 'Powered by Goden Creative', type: 'text' }
      ]
    },
    {
      title: id ? 'Halaman login' : 'Login page',
      fields: [
        { key: 'loginBannerUrl', label: id ? 'Banner login' : 'Login banner', placeholder: 'https://...', type: 'image' },
        { key: 'loginTitle', label: id ? 'Judul login' : 'Login title', placeholder: 'Links with signal.', type: 'text' },
        { key: 'loginSubtitle', label: id ? 'Subtitle login' : 'Login subtitle', placeholder: 'Access your campaigns...', type: 'text' }
      ]
    },
    {
      title: 'SEO',
      fields: [
        { key: 'metaTitle', label: id ? 'Meta title' : 'Meta title', placeholder: 'godl.ink - Modern URL shortener', type: 'text' },
        { key: 'metaDescription', label: id ? 'Meta description' : 'Meta description', placeholder: 'Short, branded...', type: 'text' },
        { key: 'metaKeywords', label: id ? 'Meta keywords' : 'Meta keywords', placeholder: 'url shortener, short links...', type: 'text' },
        { key: 'ogImage', label: id ? 'Gambar OG' : 'OG image', placeholder: 'https://...', type: 'image' },
        { key: 'twitterHandle', label: id ? 'Twitter handle' : 'Twitter handle', placeholder: '@godencreative', type: 'text' }
      ]
    },
    {
      title: id ? 'Footer & Kontak' : 'Footer & Contact',
      fields: [
        { key: 'footerText', label: id ? 'Teks footer' : 'Footer text', placeholder: '© {year} Goden Creative...', type: 'text' },
        { key: 'footerLinks', label: id ? 'Link footer (satu per baris: Label|URL)' : 'Footer links (one per line: Label|URL)', placeholder: 'Privacy|/privacy\nTerms|/terms', type: 'textarea' },
        { key: 'contactEmail', label: id ? 'Email kontak' : 'Contact email', placeholder: 'hello@godencreative.com', type: 'text' },
        { key: 'contactPhone', label: id ? 'Telepon' : 'Phone', placeholder: '+62 xxx xxx xxx', type: 'text' },
        { key: 'contactWhatsapp', label: id ? 'WhatsApp' : 'WhatsApp', placeholder: '+62 xxx xxx xxx', type: 'text' },
        { key: 'contactAddress', label: id ? 'Alamat' : 'Address', placeholder: 'Jakarta, Indonesia', type: 'text' }
      ]
    },
    {
      title: id ? 'Media sosial' : 'Social media',
      fields: [
        { key: 'socialInstagram', label: 'Instagram', placeholder: 'https://instagram.com/...', type: 'text' },
        { key: 'socialFacebook', label: 'Facebook', placeholder: 'https://facebook.com/...', type: 'text' },
        { key: 'socialYoutube', label: 'YouTube', placeholder: 'https://youtube.com/...', type: 'text' },
        { key: 'socialLinkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/...', type: 'text' }
      ]
    },
    {
      title: id ? 'Manajemen Iklan' : 'Ads Management',
      fields: [
        { key: 'adsEnabled', label: id ? 'Aktifkan iklan (true/false)' : 'Enable ads (true/false)', placeholder: 'true', type: 'text' },
        { key: 'adsHeaderScript', label: id ? 'Skrip header (Google AdSense, dll)' : 'Header script (Google AdSense, etc.)', placeholder: '<script async src="..."></script>', type: 'textarea' },
        { key: 'adsTopBanner', label: id ? 'Iklan banner atas' : 'Top banner ad', placeholder: '<a href="..."><img src="..." /></a>', type: 'textarea' },
        { key: 'adsSidebar', label: id ? 'Iklan sidebar' : 'Sidebar ad', placeholder: '...', type: 'textarea' },
        { key: 'adsBottomBanner', label: id ? 'Iklan banner bawah' : 'Bottom banner ad', placeholder: '...', type: 'textarea' },
        { key: 'adsPopup', label: id ? 'Iklan popup/interstitial' : 'Popup/interstitial ad', placeholder: '...', type: 'textarea' }
      ]
    }
  ], [id]);

  function update(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    setSaving(false);
    if (!res.ok) {
      toast.error(id ? 'Gagal menyimpan pengaturan' : 'Failed to save settings');
      return;
    }
    toast.success(id ? 'Pengaturan disimpan' : 'Settings saved');
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <Card key={group.title} className="border-white/10">
          <CardHeader>
            <CardTitle className="text-lg">{group.title}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {group.fields.map((field) => (
              <div key={field.key} className={field.type === 'textarea' || field.key === 'homeSubtitle' || field.key === 'loginSubtitle' || field.key === 'metaDescription' ? 'col-span-full space-y-2' : 'space-y-2'}>
                {field.type === 'image' ? (
                  <ImageUploadField
                    label={field.label}
                    fieldKey={field.key}
                    value={values[field.key] || ''}
                    onChange={(v) => update(field.key, v)}
                    id={id}
                  />
                ) : field.type === 'textarea' ? (
                  <>
                    <label className="text-sm font-medium">{field.label}</label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={values[field.key] || ''}
                      onChange={(e) => update(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={4}
                    />
                  </>
                ) : (
                  <>
                    <label className="text-sm font-medium">{field.label}</label>
                    <Input
                      value={values[field.key] || ''}
                      onChange={(e) => update(field.key, e.target.value)}
                      placeholder={field.placeholder}
                    />
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      <Button onClick={save} disabled={saving} className="w-full md:w-auto">
        {saving ? (id ? 'Menyimpan...' : 'Saving...') : (id ? 'Simpan semua pengaturan' : 'Save all settings')}
      </Button>
    </div>
  );
}