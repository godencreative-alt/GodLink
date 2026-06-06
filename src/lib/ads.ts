import { auth } from './auth';
import { prisma } from './prisma';
import { getSiteSettings } from './site-settings';

export type AdsContext = {
  enabled: boolean;
  shouldShow: boolean;
  scripts: {
    header: string;
    topBanner: string;
    sidebar: string;
    bottomBanner: string;
    popup: string;
  };
};

const PAID_PLAN_PATTERNS = /pro|enterprise|premium|business|plus|paid/i;

function isFreePlan(plan: { name?: string | null; price?: number | null } | null): boolean {
  if (!plan) return true;
  if (plan.price !== null && plan.price !== undefined && plan.price > 0) return false;
  if (plan.name && PAID_PLAN_PATTERNS.test(plan.name)) return false;
  return true;
}

export async function getAdsContext(): Promise<AdsContext> {
  const settings = await getSiteSettings();
  const enabled = String(settings.adsEnabled).toLowerCase() === 'true';

  const scripts = {
    header: settings.adsHeaderScript || '',
    topBanner: settings.adsTopBanner || '',
    sidebar: settings.adsSidebar || '',
    bottomBanner: settings.adsBottomBanner || '',
    popup: settings.adsPopup || ''
  };

  if (!enabled) {
    return { enabled: false, shouldShow: false, scripts };
  }

  let shouldShow = true;

  try {
    const session = await auth();
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { plan: true }
      });
      if (user && !isFreePlan(user.plan)) {
        shouldShow = false;
      }
    }
  } catch {
    shouldShow = true;
  }

  return { enabled, shouldShow, scripts };
}
