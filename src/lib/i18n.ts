export const translations = {
  en: {
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      login: 'Login',
      register: 'Start free',
      dashboard: 'Dashboard',
      links: 'Links',
      analytics: 'Analytics',
      domains: 'Domains',
      settings: 'Settings',
      admin: 'Admin',
      logout: 'Logout',
      language: 'Language',
      theme: 'Theme',
      light: 'Light',
      dark: 'Dark'
    },
    home: {
      badge: 'Powered by Goden Creative',
      title: 'Short links that feel premium, not disposable.',
      subtitle: 'Create, protect, analyze, and share every campaign link from one refined dashboard.',
      placeholder: 'Paste a long URL...',
      createLink: 'Create link',
      copy: 'Copy',
      features: 'Features',
      pricing: 'Pricing'
    },
    auth: {
      login: 'Sign in',
      register: 'Create account',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      forgotPassword: 'Forgot password?',
      noAccount: 'No account?',
      hasAccount: 'Already have an account?',
      createOne: 'Create one',
      signIn: 'Sign in'
    },
    footer: {
      copyright: '© {year} Goden Creative. Built for godl.ink.',
      contact: 'Contact us',
      privacy: 'Privacy',
      terms: 'Terms',
      links: 'Links',
      company: 'Company',
      resources: 'Resources',
      docs: 'API Docs',
      support: 'Support'
    },
    dashboard: {
      welcome: 'Welcome back',
      newLink: 'New link',
      yourLinks: 'Your links',
      noLinks: 'No links yet. Create your first one to get started.',
      clicks: 'clicks',
      created: 'Created'
    },
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirm: 'Confirm',
      success: 'Success',
      error: 'Error'
    }
  },
  id: {
    nav: {
      features: 'Fitur',
      pricing: 'Harga',
      login: 'Masuk',
      register: 'Mulai gratis',
      dashboard: 'Dasbor',
      links: 'Tautan',
      analytics: 'Analitik',
      domains: 'Domain',
      settings: 'Pengaturan',
      admin: 'Admin',
      logout: 'Keluar',
      language: 'Bahasa',
      theme: 'Tema',
      light: 'Terang',
      dark: 'Gelap'
    },
    home: {
      badge: 'Didukung oleh Goden Creative',
      title: 'Tautan pendek yang terasa premium, bukan sekali pakai.',
      subtitle: 'Buat, lindungi, analisis, dan bagikan setiap tautan kampanye dari satu dasbor yang elegan.',
      placeholder: 'Tempel URL panjang...',
      createLink: 'Buat tautan',
      copy: 'Salin',
      features: 'Fitur',
      pricing: 'Harga'
    },
    auth: {
      login: 'Masuk',
      register: 'Buat akun',
      email: 'Email',
      password: 'Kata sandi',
      name: 'Nama',
      forgotPassword: 'Lupa kata sandi?',
      noAccount: 'Belum punya akun?',
      hasAccount: 'Sudah punya akun?',
      createOne: 'Buat akun',
      signIn: 'Masuk'
    },
    footer: {
      copyright: '© {year} Goden Creative. Dibuat untuk godl.ink.',
      contact: 'Hubungi kami',
      privacy: 'Privasi',
      terms: 'Ketentuan',
      links: 'Tautan',
      company: 'Perusahaan',
      resources: 'Sumber Daya',
      docs: 'Dokumentasi API',
      support: 'Dukungan'
    },
    dashboard: {
      welcome: 'Selamat datang kembali',
      newLink: 'Tautan baru',
      yourLinks: 'Tautan Anda',
      noLinks: 'Belum ada tautan. Buat yang pertama untuk memulai.',
      clicks: 'klik',
      created: 'Dibuat'
    },
    common: {
      loading: 'Memuat...',
      save: 'Simpan',
      cancel: 'Batal',
      delete: 'Hapus',
      edit: 'Edit',
      confirm: 'Konfirmasi',
      success: 'Berhasil',
      error: 'Kesalahan'
    }
  }
} as const;

export type Locale = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export function t(locale: Locale, section: TranslationKey, key: string): string {
  return (translations[locale]?.[section] as any)?.[key]
    ?? (translations.en[section] as any)?.[key]
    ?? key;
}

export function getLocale(locale?: string | null): Locale {
  if (locale === 'id') return 'id';
  return 'en';
}