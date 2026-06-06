import { Suspense } from 'react';
import Image from 'next/image';
import { RegisterForm } from '@/components/auth/register-form';
import { getSiteSettings } from '@/lib/site-settings';

export default async function RegisterPage() {
  const settings = await getSiteSettings();

  return (
    <main className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-background lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 -z-10 grain opacity-30" />
        <div className="absolute right-24 top-24 h-72 w-72 rounded-full bg-secondary/20 blur-[120px]" />
        <div className="max-w-xl">
          <p className="font-serif text-6xl italic leading-none text-primary">Start shortening beautifully.</p>
          <p className="mt-6 text-lg text-muted-foreground">{settings.loginSubtitle}</p>
        </div>
        {settings.loginBannerUrl ? (
          <div className="relative mt-8 h-64 w-full overflow-hidden rounded-3xl">
            <Image src={settings.loginBannerUrl} alt="Register banner" fill className="object-cover" />
          </div>
        ) : null}
        <div className="text-sm text-muted-foreground">Free plan included. Upgrade later for teams and domains.</div>
      </section>
      <section className="flex items-center justify-center px-6 py-16">
        <Suspense fallback={null}>
          <RegisterForm />
        </Suspense>
      </section>
    </main>
  );
}