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
