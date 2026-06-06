import { getAdsContext } from '@/lib/ads';
import { AdSlot } from './ad-slot';

type AdSlotName = 'topBanner' | 'sidebar' | 'bottomBanner' | 'popup';

interface AdsBannerProps {
  slot: AdSlotName;
  className?: string;
}

export async function AdsBanner({ slot, className }: AdsBannerProps) {
  const ads = await getAdsContext();
  if (!ads.shouldShow) return null;
  const script = ads.scripts[slot];
  if (!script) return null;
  return <AdSlot script={script} className={className} />;
}

export async function AdsHeaderScript() {
  const ads = await getAdsContext();
  if (!ads.shouldShow || !ads.scripts.header) return null;
  return <AdSlot script={ads.scripts.header} />;
}
