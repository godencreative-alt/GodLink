'use client';

import { FadeIn } from '@/components/ui/animations';
import { useApp } from '@/components/providers/app-provider';

export default function PrivacyPage() {
  const { locale } = useApp();
  const id = locale === 'id';

  return (
    <main className="min-h-screen bg-background px-6 py-20">
      <div className="absolute inset-0 -z-10 grain opacity-30" />
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <h1 className="text-5xl font-black tracking-tight">{id ? 'Kebijakan Privasi' : 'Privacy Policy'}</h1>
          <p className="mt-4 text-sm text-muted-foreground">{id ? 'Terakhir diperbarui: 17 Mei 2026' : 'Last updated: May 17, 2026'}</p>
        </FadeIn>

        <FadeIn delay={0.15} className="prose prose-invert mt-10 max-w-none">
          <h2 className="text-2xl font-bold">{id ? 'Pendahuluan' : 'Introduction'}</h2>
          <p className="text-muted-foreground">
            {id ? 'godl.ink berkomitmen untuk melindungi privasi Anda. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan menjaga informasi saat Anda memakai layanan shortlink.' : 'godl.ink is committed to protecting your privacy. This policy explains how we collect, use, disclose, and safeguard your information when you use our URL shortening service.'}
          </p>

          <h2 className="mt-8 text-2xl font-bold">{id ? 'Informasi yang Kami Kumpulkan' : 'Information We Collect'}</h2>
          <h3 className="mt-4 text-xl font-semibold">{id ? 'Informasi Akun' : 'Account Information'}</h3>
          <p className="text-muted-foreground">
            {id ? 'Saat mendaftar, kami mengumpulkan nama, alamat email, dan password terenkripsi Anda.' : 'When you register, we collect your name, email address, and encrypted password.'}
          </p>

          <h3 className="mt-4 text-xl font-semibold">{id ? 'Data Tautan' : 'Link Data'}</h3>
          <p className="text-muted-foreground">
            {id ? 'Kami menyimpan URL tujuan, slug kustom, deskripsi, tanggal kedaluwarsa, dan pengaturan proteksi password.' : 'We store destination URLs, custom slugs, descriptions, expiration dates, and password protection settings.'}
          </p>

          <h3 className="mt-4 text-xl font-semibold">{id ? 'Data Analitik' : 'Analytics Data'}</h3>
          <p className="text-muted-foreground">
            {id ? 'Saat shortlink diklik, kami mencatat IP, negara, perangkat, browser, sistem operasi, dan referrer untuk membantu analisis performa.' : 'When someone clicks your short link, we collect IP address, country, device type, browser, operating system, and referrer to help analyze performance.'}
          </p>

          <h2 className="mt-8 text-2xl font-bold">{id ? 'Cara Kami Menggunakan Informasi' : 'How We Use Your Information'}</h2>
          <ul className="list-disc pl-6 text-muted-foreground">
            {(id ? ['Menyediakan dan menjaga layanan shortlink', 'Membuat analitik dan insight tautan', 'Mengirim email layanan seperti verifikasi dan dukungan', 'Mencegah penyalahgunaan, fraud, dan spam', 'Meningkatkan layanan dan fitur baru'] : ['Provide and maintain the URL shortening service', 'Generate analytics and insights for your links', 'Send service-related emails such as verification and support', 'Prevent abuse, fraud, and spam', 'Improve our service and develop new features']).map((item) => <li key={item}>{item}</li>)}
          </ul>

          <h2 className="mt-8 text-2xl font-bold">{id ? 'Keamanan' : 'Security'}</h2>
          <p className="text-muted-foreground">
            {id ? 'Kami menggunakan password terenkripsi, HTTPS, dan manajemen sesi yang aman. Namun, tidak ada metode transmisi internet yang sepenuhnya bebas risiko.' : 'We use encrypted passwords, HTTPS, and secure session management. However, no internet transmission method is completely risk-free.'}
          </p>

          <h2 className="mt-8 text-2xl font-bold">{id ? 'Hubungi Kami' : 'Contact Us'}</h2>
          <p className="text-muted-foreground">
            {id ? 'Untuk pertanyaan privasi, hubungi kami di ' : 'For privacy questions, contact us at '}<a href="mailto:hello@godencreative.com" className="text-primary hover:underline">hello@godencreative.com</a>
          </p>
        </FadeIn>
      </div>
    </main>
  );
}
