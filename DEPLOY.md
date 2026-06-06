# Deploying godl.ink

Complete deployment guides for two of the most common Linux/Windows control panels:

- **[Part A — aaPanel](#part-a--aapanel-deployment)** (recommended for VPS, full root access)
- **[Part B — cPanel](#part-b--cpanel-deployment)** (shared/managed hosting with Node.js App Manager)
- **[Part C — FAQ](#part-c--frequently-asked-questions)**

godl.ink is a Next.js 15 + Prisma + MySQL application. It needs:

- Node.js 22+
- MySQL 8.0+ or MariaDB 10.6+
- A reverse proxy in front of the Node process (Nginx, Apache, or LiteSpeed)
- A long-running process manager (PM2, systemd, or the panel's own Application Manager)
- Optional: SSL certificate (Let's Encrypt or AutoSSL)

The two parts of the guide land at the same end state — a production app reachable on your domain with HTTPS and an admin account.

---

# Part A — aaPanel Deployment

A VPS-style flow with PM2 + Nginx + Let's Encrypt.

## Requirements

- VPS: Ubuntu 22.04+ or Debian 11+ (1 vCPU, 1 GB RAM minimum; 2 GB recommended)
- Domain pointed to your server IP (A record at the apex, plus a CNAME or A for `www`)
- SSH root access

---

## Step 1 — Install aaPanel

```bash
wget -O install.sh https://www.aapanel.com/script/install-ubuntu_6.0_en.sh
sudo bash install.sh aapanel
```

Save the panel URL, username, and password printed at the end. Open the panel in your browser and complete the first-run wizard.

---

## Step 2 — Install Required Software

In the aaPanel App Store, install:

1. **Nginx** (1.24 or latest)
2. **MySQL 8.0**
3. **PM2 Manager** (provides a UI for the PM2 daemon)

### Install Node.js 22

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v   # should print v22.x.x
npm -v    # should print 10.x.x
```

If you already have an older Node, remove it first: `sudo apt-get purge nodejs`.

---

## Step 3 — Create the MySQL Database

In aaPanel go to **Databases → MySQL → Add Database**:

- Database name: `godlink`
- Username: `godlink_user`
- Password: generate a strong one and save it
- Host: `localhost`

Test the connection:

```bash
mysql -u godlink_user -p -h localhost godlink
# type \q to exit
```

---

## Step 4 — Add the Website in aaPanel

**Websites → Add site**:

- Domain: `godl.ink` (your domain)
- Root directory: `/www/wwwroot/godl.ink`
- PHP: **Pure static** (none — Node serves the app, not PHP)

---

## Step 5 — Upload the Project

### Option A — Git (recommended)

```bash
cd /www/wwwroot
rm -rf godl.ink
git clone YOUR_REPO_URL godl.ink
cd godl.ink
```

### Option B — aaPanel File Manager

Upload the project ZIP into `/www/wwwroot/godl.ink` and extract.

---

## Step 6 — Configure `.env`

```bash
cd /www/wwwroot/godl.ink
cp .env.example .env
nano .env
```

Fill in:

```env
DATABASE_URL="mysql://godlink_user:YOUR_PASSWORD@localhost:3306/godlink"
NEXTAUTH_URL="https://godl.ink"
NEXTAUTH_SECRET="GENERATE_64_CHAR_RANDOM_STRING"
NEXT_PUBLIC_APP_URL="https://godl.ink"
NEXT_PUBLIC_SHORT_DOMAIN="godl.ink"
NODE_ENV="production"

# Optional
RESEND_API_KEY=""
EMAIL_FROM="godl.ink <noreply@godl.ink>"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
```

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 48
```

Save: `Ctrl+X`, `Y`, `Enter`.

---

## Step 7 — Install Dependencies and Build

```bash
cd /www/wwwroot/godl.ink
npm install
npx prisma generate
npx prisma db push
npm run build
```

The build should end with `Generating static pages` and no errors.

---

## Step 8 — PM2 Process Manager

Install PM2 globally if it isn't already:

```bash
npm install -g pm2
```

Create `ecosystem.config.js`:

```bash
nano /www/wwwroot/godl.ink/ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'godlink',
    script: 'npm',
    args: 'start',
    cwd: '/www/wwwroot/godl.ink',
    env: {
      NODE_ENV: 'production',
      PORT: 3006
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    error_file: '/www/wwwroot/godl.ink/logs/error.log',
    out_file: '/www/wwwroot/godl.ink/logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
};
```

Start it:

```bash
mkdir -p /www/wwwroot/godl.ink/logs
pm2 start /www/wwwroot/godl.ink/ecosystem.config.js
pm2 save
pm2 startup     # follow the printed command to enable on boot
```

Verify:

```bash
pm2 status              # godlink should be "online"
pm2 logs godlink        # should show "Ready on http://localhost:3006"
```

---

## Step 9 — Nginx Reverse Proxy

In aaPanel: **Websites → godl.ink → Settings → Reverse Proxy → Add**

- Name: `nextjs`
- Target URL: `http://127.0.0.1:3006`
- Enable: Yes

For production, replace the auto-generated config with this. **Settings → Config**:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name godl.ink www.godl.ink;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name godl.ink www.godl.ink;

    ssl_certificate /www/server/panel/vhost/cert/godl.ink/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/godl.ink/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json image/svg+xml;

    location /_next/static {
        proxy_pass http://127.0.0.1:3006;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:3006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    access_log /www/wwwlogs/godl.ink.log;
    error_log /www/wwwlogs/godl.ink.error.log;
}
```

Reload Nginx after saving.

---

## Step 10 — SSL Certificate

**Websites → godl.ink → Settings → SSL**:

1. Choose **Let's Encrypt**
2. Enter your email
3. Select `godl.ink` and `www.godl.ink`
4. Click **Apply**
5. Enable **Force HTTPS**

---

## Step 11 — Create the Admin Account

Register at `https://yourdomain.com/auth/register`, then promote yourself:

```bash
mysql -u godlink_user -p godlink \
  -e "UPDATE users SET role='ADMIN' WHERE email='your@email.com';"
```

Or use Prisma Studio: `npx prisma studio` and edit the row in the **users** table.

The admin panel lives at `/dashboard/admin`.

---

## Step 12 — Configure the CMS

After logging in as admin, go to `/dashboard/admin/settings` to configure:

- Site name, tagline, logo URL, favicon URL
- Homepage hero title, subtitle, badge text
- Login page title, subtitle, banner image
- SEO meta title, description, keywords, OG image, Twitter handle
- Footer text and contact email

Then `/dashboard/admin/plans` to create your pricing tiers.

---

## Step 13 — Resend Email (Optional)

For email verification on signup:

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Create an API key
4. Update `.env`:

```env
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="godl.ink <noreply@yourdomain.com>"
```

5. Restart: `pm2 restart godlink`

If you skip this step, registration auto-verifies users — perfect for staging or single-tenant deploys.

---

## Maintenance — aaPanel

```bash
# Update from git
cd /www/wwwroot/godl.ink
git pull origin main
npm install
npx prisma generate
npx prisma db push
npm run build
pm2 restart godlink

# Database backup
mysqldump -u godlink_user -p godlink > /root/backup_$(date +%Y%m%d_%H%M).sql

# Logs
pm2 logs godlink --lines 200
pm2 logs godlink --err
```

<!-- CHUNK_2_INSERT_HERE -->

---

# Part B — cPanel Deployment

cPanel hosts that expose **Setup Node.js App** (CloudLinux's Node.js Selector) or **Application Manager** can run godl.ink. You won't have root access, but you can do everything through the panel UI plus the **Terminal** feature (or SSH if your host enabled it).

If your host does **not** offer "Setup Node.js App", you cannot deploy a Next.js app there. Ask support, or move to a host that does (most cPanel hosts now ship the CloudLinux Node Selector).

## Requirements

- cPanel with **Setup Node.js App** enabled
- MySQL or MariaDB through **MySQL Databases** in cPanel
- Domain or subdomain pointed at the account
- SSH or **Terminal** access (preferred — a few commands are easier from the shell)

---

## Step 1 — Create the Database

cPanel → **MySQL Databases**:

1. Create database: `cpaneluser_godlink` (cPanel always prefixes with your account name)
2. Create user: `cpaneluser_godlink_u` with a strong password
3. Add the user to the database with **ALL PRIVILEGES**

Note the full database name, full username, and the password — you'll need them in the `.env` file.

---

## Step 2 — Upload the Project

### Option A — Git Version Control (preferred)

cPanel → **Git Version Control → Create**:

- Clone URL: `https://github.com/your/repo.git`
- Repository path: `/home/cpaneluser/apps/godlink`
- Repository name: `godlink`

After cloning, click **Manage → Pull or Deploy** to fetch updates.

### Option B — File Manager

Upload the project ZIP to `/home/cpaneluser/apps/godlink` and extract it there.

> Do **not** put it in `public_html` — Node apps live outside the web root and Apache forwards traffic to them via the panel.

---

## Step 3 — Setup Node.js App

cPanel → **Setup Node.js App → Create Application**:

| Field                   | Value                                          |
|-------------------------|------------------------------------------------|
| Node.js version         | **22.x** (newest available; 20 works as fallback) |
| Application mode        | Production                                     |
| Application root        | `apps/godlink`                                 |
| Application URL         | `https://godl.ink` (or `https://yourdomain/`)  |
| Application startup file| `node_modules/.bin/next`                       |
| Passenger log file      | leave default                                  |

Click **Create**.

The panel creates a virtual env. **Don't fill in the start command yet** — we'll override it after the build step.

---

## Step 4 — Activate the Virtualenv and Install

Open cPanel → **Terminal**, then run the activation command shown in the Node.js App page (it looks like `source /home/cpaneluser/nodevenv/apps/godlink/22/bin/activate && cd /home/cpaneluser/apps/godlink`).

Then:

```bash
npm install
```

If `npm install` fails with `EACCES` or `EPERM`, your host may have set strict file permissions. Run:

```bash
chmod -R u+rw /home/cpaneluser/apps/godlink
```

and retry.

---

## Step 5 — Configure `.env`

In **File Manager**, edit `/home/cpaneluser/apps/godlink/.env`:

```env
DATABASE_URL="mysql://cpaneluser_godlink_u:YOUR_PASSWORD@localhost:3306/cpaneluser_godlink"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="GENERATE_64_CHAR_RANDOM_STRING"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_SHORT_DOMAIN="yourdomain.com"
NODE_ENV="production"

RESEND_API_KEY=""
EMAIL_FROM="godl.ink <noreply@yourdomain.com>"
```

Generate the secret in the Terminal:

```bash
openssl rand -base64 48
```

> Some shared hosts run MySQL on a non-default port or socket. If `localhost:3306` doesn't connect, check **MySQL Databases** for the host the panel suggests.

---

## Step 6 — Push the Schema and Build

Still in the activated Terminal:

```bash
npx prisma generate
npx prisma db push
npm run build
```

If `npm run build` runs out of memory (common on shared hosts capped at 1 GB), build with a memory limit:

```bash
NODE_OPTIONS="--max-old-space-size=768" npm run build
```

If the host kills the build entirely, build locally and upload the `.next/` directory + `package.json` + `package-lock.json` + `prisma/` + `public/` + `node_modules/` (or run `npm ci --production` after upload).

---

## Step 7 — Start Command

Back in **Setup Node.js App**, edit the application:

- **Application startup file**: `node_modules/.bin/next`
- Add an environment variable: `NEXT_TELEMETRY_DISABLED=1`
- Set **Startup arguments** (if your panel has a separate field): `start -p 3006`

Some panels use a single **Startup file** field. In that case, create a small launcher:

```bash
nano /home/cpaneluser/apps/godlink/server.js
```

```javascript
require('next/dist/server/lib/start-server').startServer({
  dir: __dirname,
  hostname: '127.0.0.1',
  port: process.env.PORT || 3006,
  isDev: false
});
```

…and set the **Application startup file** to `server.js`.

Click **Restart** in the Node.js App page. Watch the Passenger log file for "Ready on http://...".

---

## Step 8 — Bind the Domain

In **Setup Node.js App**, the **Application URL** field already maps the domain to the Node app. cPanel writes a `.htaccess` like this in the document root:

```apache
PassengerAppRoot "/home/cpaneluser/apps/godlink"
PassengerBaseURI "/"
PassengerNodejs "/home/cpaneluser/nodevenv/apps/godlink/22/bin/node"
PassengerAppType node
PassengerStartupFile "node_modules/.bin/next"
```

If you used a subdomain (e.g. `links.yourdomain.com`), make sure the subdomain points to the same document root.

---

## Step 9 — SSL Certificate

cPanel → **SSL/TLS Status** → check your domain → **Run AutoSSL**.

Most cPanel installs ship Let's Encrypt-backed AutoSSL. After it succeeds you should see green padlocks for `yourdomain.com` and `www.yourdomain.com`.

If AutoSSL is unavailable, install a paid certificate via **SSL/TLS → Manage SSL Sites**.

---

## Step 10 — Force HTTPS

In **Domains**, find your domain and toggle **Force HTTPS Redirect**.

Or add to `public_html/.htaccess` (above the Passenger block):

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
```

---

## Step 11 — Create the Admin Account

Register at `https://yourdomain.com/auth/register`, then in cPanel → **phpMyAdmin** → open the `cpaneluser_godlink` database → **users** table → edit your row and set `role` to `ADMIN`.

Or via SQL:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

Admin panel: `https://yourdomain.com/dashboard/admin`.

---

## Maintenance — cPanel

**Pull updates from git**:

cPanel → **Git Version Control → Manage → Pull or Deploy**.

After pull, open **Terminal**, activate the venv, then:

```bash
npm install
npx prisma generate
npx prisma db push
npm run build
```

Then click **Restart** in the Node.js App page.

**Database backup**: cPanel → **Backup → Download a MySQL Database Backup**.

**Logs**: tail the Passenger log path shown in the Node.js App page.

```bash
tail -n 200 /home/cpaneluser/logs/godlink.log
```

<!-- CHUNK_3_INSERT_HERE -->

---

# Part C — Frequently Asked Questions

## General

**Q: What are the minimum server requirements?**
A: 1 vCPU, 1 GB RAM, 10 GB disk. 2 GB RAM recommended for comfortable builds. MySQL needs ~300 MB on its own.

**Q: Can I use MariaDB instead of MySQL?**
A: Yes. MariaDB 10.6+ is fully compatible. Prisma treats it the same as MySQL 8.

**Q: Can I use PostgreSQL or SQLite?**
A: Not without changing the Prisma schema. The `datasource` is set to `mysql`. Switching to PostgreSQL requires changing `provider = "postgresql"` in `schema.prisma` and adjusting any MySQL-specific column types.

**Q: Does it work on Windows Server?**
A: Yes. Install Node.js 22, MySQL 8, and run `npm run build && npm start`. Use IIS with `iisnode` or run PM2 on Windows. The app itself is platform-agnostic.

**Q: What port does the app use?**
A: Port 3006 by default (set in `package.json` scripts). Override with the `PORT` environment variable.

---

## Domain and DNS

**Q: How do I point my domain to the server?**
A: Create an A record pointing your domain (e.g. `godl.ink`) to your server's IP address. Add a CNAME for `www` pointing to the apex domain. TTL of 300–3600 is fine.

**Q: Can I use a subdomain like `links.mysite.com`?**
A: Yes. Set `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SHORT_DOMAIN` to the subdomain. Update `NEXTAUTH_URL` too.

**Q: How do custom domains work for users?**
A: Users add a domain in the dashboard, then point a CNAME to your primary short domain. The app checks the `Host` header on incoming requests and matches it to verified domains in the database.

---

## Authentication

**Q: Login says "wrong email and password" but I'm sure they're correct.**
A: Check if `emailVerified` is `null` in the database. If `RESEND_API_KEY` is not set, new registrations are auto-verified, but accounts created before that fix need manual verification:

```sql
UPDATE users SET emailVerified = NOW() WHERE email = 'your@email.com';
```

**Q: OAuth (Google/GitHub) login isn't working.**
A: Ensure `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (or GitHub equivalents) are set in `.env`. The OAuth redirect URI must be `https://yourdomain.com/api/auth/callback/google` (or `/callback/github`). Add this exact URL in the Google Cloud Console / GitHub OAuth App settings.

**Q: How do I reset a user's password?**
A: As admin, go to `/dashboard/admin/users`, find the user, and set a new password. Or via SQL:

```bash
node -e "const{hash}=require('bcryptjs');hash('newpassword',12).then(h=>console.log(h))"
```

Then: `UPDATE users SET password='HASH_OUTPUT' WHERE email='user@email.com';`

**Q: Can I disable registration?**
A: There's no built-in toggle yet. Quickest workaround: add a rate limit of `max: 0` on the register endpoint, or return a 403 at the top of `src/app/api/auth/register/route.ts`.

---

## Links and QR

**Q: How many characters are in the auto-generated slug?**
A: Exactly 4 characters, alphanumeric (a-z, A-Z, 0-9). That gives 62^4 = ~14.7 million unique combinations.

**Q: What happens when 4-char slugs run out?**
A: The generator retries up to 20 times. If all attempts collide, it returns an error. At scale, increase the length in `src/lib/slug.ts` (change `customAlphabet(alphabet, 4)` to `5` or `6`).

**Q: Can guests create links without signing up?**
A: Yes. Guests get 2 links per IP, valid for 30 days, with auto-generated slugs and QR codes. No custom slugs or custom domains.

**Q: How do I change the guest link limit?**
A: Edit `GUEST_LINK_LIMIT_PER_IP` in `src/app/api/links/route.ts`. Restart after changing.

**Q: QR codes look broken or don't load.**
A: The QR endpoint is at `/api/qr?slug=XXXX`. It returns SVG. If it 404s, the link doesn't exist or is banned. If it 410s, the link expired.

---

## Plans and Billing

**Q: How do I create plans?**
A: Log in as admin → `/dashboard/admin/plans` → Add Plan. Set name, price, limits (maxLinks, maxClicks, maxDomains), features text, and sort order.

**Q: Is there built-in payment processing?**
A: No. Plan assignment is manual (admin assigns plans to users). Integrate Stripe/Midtrans/Xendit by adding a webhook that calls `PATCH /api/admin/users/[id]` with the new `planId` after payment confirmation.

**Q: What happens when a plan expires?**
A: Plans don't expire — links do. Free members get 90-day TTL per link. Paid plans can set custom expiry or leave links permanent.

---

## Build and Performance

**Q: Build fails with "JavaScript heap out of memory".**
A: Increase the Node memory limit:

```bash
NODE_OPTIONS="--max-old-space-size=1536" npm run build
```

On shared hosts with <1 GB available, build locally and upload the `.next/` folder.

**Q: The app is slow on first request after deploy.**
A: Next.js compiles pages on first hit when using `force-dynamic`. After the first request, subsequent ones are fast. Consider removing `export const dynamic = 'force-dynamic'` from `layout.tsx` if you don't need real-time CMS settings on every page load.

**Q: How do I enable caching for better performance?**
A: Remove `force-dynamic` from the root layout and use `revalidate = 60` (ISR) on pages that read site settings. The trade-off: CMS changes take up to 60 seconds to appear.

**Q: Rate limiting doesn't work across multiple instances.**
A: The rate limiter is in-memory (per-process). If you run multiple PM2 instances, use Redis-backed rate limiting instead. Replace `src/lib/rate-limit.ts` with an `ioredis`-based implementation.

---

## Deployment Issues

**Q: 502 Bad Gateway after deploy.**
A: The Node process isn't running or crashed. Check:

```bash
pm2 status                    # is it "online"?
pm2 logs godlink --err        # what's the error?
netstat -tlnp | grep 3006    # is the port listening?
```

Common causes: missing `.env` vars, MySQL not running, port conflict.

**Q: "EACCES: permission denied" during npm install.**
A: Don't run npm as root with `--unsafe-perm`. Instead:

```bash
chown -R $(whoami) /www/wwwroot/godl.ink
npm install
```

**Q: Prisma can't connect to the database.**
A: Verify `DATABASE_URL` in `.env`. Test manually:

```bash
mysql -u YOUR_USER -p -h localhost YOUR_DB
```

If it works in the shell but not in Prisma, check for socket vs TCP issues. Try `127.0.0.1` instead of `localhost` in the connection string.

**Q: "Module not found" errors after deploy.**
A: Run `npx prisma generate` before `npm run build`. The Prisma client is generated into `node_modules` and must exist before the build step.

**Q: How do I deploy updates without downtime?**
A: Use PM2's reload:

```bash
git pull origin main
npm install
npx prisma generate
npx prisma db push
npm run build
pm2 reload godlink    # graceful reload, no downtime
```

---

## Security

**Q: Should I change the default port?**
A: The port is internal (behind Nginx/Apache). Changing it doesn't add security. Just ensure the port isn't exposed to the public internet via firewall rules.

**Q: How do I rotate the NEXTAUTH_SECRET?**
A: Change it in `.env` and restart. All existing sessions will be invalidated — users must log in again.

**Q: Are API keys stored securely?**
A: API keys are stored as plaintext in the database (generated via `randomBytes`). For higher security, hash them (like passwords) and only show the key once on creation. This requires a code change.

**Q: How do I block abusive links?**
A: As admin, go to `/dashboard/admin` or use the database directly:

```sql
UPDATE links SET banned = 1 WHERE slug = 'abusive-slug';
```

Banned links return 404 on redirect and are hidden from QR generation.

---

## Backup and Recovery

**Q: How do I back up the database?**
A:

```bash
# aaPanel
mysqldump -u godlink_user -p godlink > backup_$(date +%Y%m%d).sql

# cPanel
# Use cPanel → Backup → Download MySQL Database Backup
```

**Q: How do I restore from a backup?**
A:

```bash
mysql -u godlink_user -p godlink < backup_20260519.sql
```

**Q: What files should I back up besides the database?**
A: The `.env` file and any uploaded assets. The code itself should live in git. The `.next/` build folder can be regenerated from source.
