'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Globe2, Link2, MousePointerClick, Monitor, Smartphone, Tablet } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { useApp } from '@/components/providers/app-provider';

interface AnalyticsOverviewProps {
  totalLinks: number;
  totalClicks: number;
  byCountry: Record<string, number>;
  byDevice: Record<string, number>;
  byBrowser: Record<string, number>;
  byDay: Record<string, number>;
}

export function AnalyticsOverview({ totalLinks, totalClicks, byCountry, byDevice, byBrowser, byDay }: AnalyticsOverviewProps) {
  const { locale } = useApp();
  const id = locale === 'id';

  const sortedCountries = Object.entries(byCountry).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const sortedBrowsers = Object.entries(byBrowser).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const sortedDays = Object.entries(byDay)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-14);
  const maxDayClicks = Math.max(...sortedDays.map(([, v]) => v), 1);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/10">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <Link2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{id ? 'Total tautan' : 'Total links'}</p>
              <p className="text-3xl font-bold">{formatNumber(totalLinks)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10">
              <MousePointerClick className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{id ? 'Total klik' : 'Total clicks'}</p>
              <p className="text-3xl font-bold">{formatNumber(totalClicks)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-white/10">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{id ? 'Rata-rata klik/tautan' : 'Avg clicks/link'}</p>
              <p className="text-3xl font-bold">{totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : '0'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10">
        <CardHeader>
          <CardTitle className="text-lg">{id ? 'Klik (14 hari terakhir)' : 'Clicks (last 14 days)'}</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedDays.length === 0 ? (
            <p className="text-sm text-muted-foreground">{id ? 'Belum ada data klik' : 'No click data yet'}</p>
          ) : (
            <div className="flex items-end gap-1 h-40">
              {sortedDays.map(([day, count]) => (
                <div key={day} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t bg-primary/80 transition-all"
                    style={{ height: `${(count / maxDayClicks) * 100}%`, minHeight: '4px' }}
                  />
                  <span className="text-[10px] text-muted-foreground">{day.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe2 className="h-4 w-4" /> {id ? 'Negara teratas' : 'Top countries'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sortedCountries.length === 0 ? (
              <p className="text-sm text-muted-foreground">{id ? 'Belum ada data' : 'No data yet'}</p>
            ) : (
              <div className="space-y-2">
                {sortedCountries.map(([country, count]) => (
                  <div key={country} className="flex items-center justify-between text-sm">
                    <span>{country}</span>
                    <span className="font-medium text-primary">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Monitor className="h-4 w-4" /> {id ? 'Perangkat & Browser' : 'Devices & Browsers'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">{id ? 'Perangkat' : 'Devices'}</p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-primary" />
                    <span className="text-sm">{byDevice.desktop || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-secondary" />
                    <span className="text-sm">{byDevice.mobile || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tablet className="h-4 w-4 text-primary" />
                    <span className="text-sm">{byDevice.tablet || 0}</span>
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">{id ? 'Browser' : 'Browsers'}</p>
                {sortedBrowsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{id ? 'Belum ada data' : 'No data yet'}</p>
                ) : (
                  <div className="space-y-1">
                    {sortedBrowsers.map(([browser, count]) => (
                      <div key={browser} className="flex items-center justify-between text-sm">
                        <span>{browser}</span>
                        <span className="font-medium text-primary">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}