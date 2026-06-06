'use client';

import { Copy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/animations';
import { toast } from 'sonner';

interface ApiDocsContentProps {
  apiKey: string | null;
}

const endpoints = [
  {
    method: 'POST',
    path: '/api/links',
    description: 'Create a new short link',
    body: { target: 'https://example.com/long-url', slug: 'my-link', description: 'My campaign', password: 'secret', expiresAt: '2026-12-31T23:59:59Z' },
    response: { id: 'abc123', slug: 'my-link', shortUrl: 'https://godl.ink/my-link' }
  },
  {
    method: 'GET',
    path: '/api/links',
    description: 'Get all your short links',
    response: [{ id: 'abc123', slug: 'my-link', target: 'https://example.com', clicks: 42 }]
  },
  {
    method: 'GET',
    path: '/api/links/[id]/stats',
    description: 'Get analytics for a specific link',
    response: { totalClicks: 42, byCountry: { US: 20, ID: 15 }, byDevice: { mobile: 30, desktop: 12 } }
  },
  {
    method: 'DELETE',
    path: '/api/links/[id]',
    description: 'Delete a short link',
    response: { success: true }
  }
];

function CodeBlock({ code }: { code: string }) {
  function copy() {
    navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard');
  }

  return (
    <div className="relative rounded-lg border border-white/10 bg-black/30 p-4">
      <pre className="overflow-x-auto text-sm text-muted-foreground"><code>{code}</code></pre>
      <button onClick={copy} className="absolute right-3 top-3 rounded-lg border border-white/10 p-2 hover:bg-white/5">
        <Copy className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ApiDocsContent({ apiKey }: ApiDocsContentProps) {
  const key = apiKey || 'YOUR_API_KEY';

  return (
    <div className="space-y-10">
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold">API Documentation</h1>
          <p className="mt-2 text-muted-foreground">Integrate godl.ink into your apps using the REST API. All requests require your API key.</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader><CardTitle className="text-lg">Authentication</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Include your API key in every request header:</p>
            <CodeBlock code={`Authorization: Bearer ${key}`} />
            {!apiKey && (
              <p className="text-sm text-yellow-400">Go to <a href="/dashboard/settings" className="underline">Settings</a> to find or rotate your API key.</p>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.2}>
        <h2 className="text-2xl font-bold">Endpoints</h2>
        <StaggerContainer className="mt-6 space-y-6" staggerDelay={0.1}>
          {endpoints.map((ep, idx) => (
            <StaggerItem key={idx}>
              <Card className="border-white/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-lg px-3 py-1 text-xs font-semibold ${ep.method === 'POST' ? 'bg-green-500/20 text-green-400' : ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                      {ep.method}
                    </span>
                    <code className="font-mono text-sm font-semibold">{ep.path}</code>
                  </div>
                  <CardDescription className="mt-2">{ep.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ep.body && <div><p className="mb-2 text-sm font-semibold">Request Body:</p><CodeBlock code={JSON.stringify(ep.body, null, 2)} /></div>}
                  <div><p className="mb-2 text-sm font-semibold">Response:</p><CodeBlock code={JSON.stringify(ep.response, null, 2)} /></div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </FadeIn>

      <FadeIn delay={0.3}>
        <h2 className="text-2xl font-bold">Examples</h2>
        <Card className="mt-6 border-white/10">
          <CardContent className="space-y-6 p-6">
            <div>
              <p className="mb-2 text-sm font-semibold">cURL</p>
              <CodeBlock code={`curl -X POST https://godl.ink/api/links \\\n  -H "Authorization: Bearer ${key}" \\\n  -H "Content-Type: application/json" \\\n  -d '{"target":"https://example.com","slug":"my-link"}'`} />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">JavaScript</p>
              <CodeBlock code={`const res = await fetch('https://godl.ink/api/links', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer ${key}',\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({ target: 'https://example.com', slug: 'my-link' })\n});\nconst data = await res.json();\nconsole.log(data.shortUrl);`} />
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">Python</p>
              <CodeBlock code={`import requests\n\nres = requests.post(\n  'https://godl.ink/api/links',\n  headers={'Authorization': 'Bearer ${key}'},\n  json={'target': 'https://example.com', 'slug': 'my-link'}\n)\nprint(res.json()['shortUrl'])`} />
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.4}>
        <h2 className="text-2xl font-bold">Rate Limits</h2>
        <Card className="mt-4 border-white/10">
          <CardContent className="space-y-2 p-6 text-sm text-muted-foreground">
            <p>Free: 5 requests/min &nbsp;|&nbsp; Pro: 30 requests/min &nbsp;|&nbsp; Team: 100 requests/min</p>
            <CodeBlock code={`X-RateLimit-Remaining: 4\nX-RateLimit-Reset: 1684329600`} />
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.5}>
        <h2 className="text-2xl font-bold">Error Codes</h2>
        <Card className="mt-4 border-white/10">
          <CardContent className="p-6">
            <CodeBlock code={`{ "error": "Slug already taken", "status": 409 }`} />
            <ul className="mt-4 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
              <li>400 — Bad request (invalid parameters)</li>
              <li>401 — Unauthorized (missing or invalid API key)</li>
              <li>409 — Conflict (slug already exists)</li>
              <li>429 — Too many requests (rate limit exceeded)</li>
              <li>500 — Server error</li>
            </ul>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}