import Link from 'next/link';
import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { getSiteSettings } from '@/lib/site-settings';

export default async function LoginPage() {
  const settings = await getSiteSettings();

  return (
    <main className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-background lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 -z-10 grain opacity-30" />
        <div className="absolute left-24 top-24 h-72 w-72 rounded-full bg-primary/20 blur-[120px]" />
        <div className="max-w-xl">
          <p className="font-serif text-6xl italic leading-none text-primary">{settings.loginTitle}</p>
          <p className="mt-6 text-lg text-muted-foreground">{settings.loginSubtitle}</p>
        </div>
        {settings.loginBannerUrl ? (
          <div className="relative mt-8 h-64 w-full overflow-hidden rounded-3xl">
            <Image src={settings.loginBannerUrl} alt="Login banner" fill className="object-cover" />
          </div>
        ) : null}
        <div className="text-sm text-muted-foreground">Secure sign-in for the Goden ecosystem.</div>
      </section>
      <section className="flex items-center justify-center px-6 py-16">
        <LoginForm />
      </section>
    </main>
  );
}