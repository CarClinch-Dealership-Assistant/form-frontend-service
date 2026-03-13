#!/bin/sh
set -x

cat <<EOF > /usr/share/nginx/html/env.js
window.ENV = {
  BACKEND_URL: "${BACKEND_URL}"
};
EOF

# Only add proxy block for local dev (when backend is on same Docker network)
if [ -n "$PROXY_BACKEND_HOST" ]; then
  cat <<EOF > /etc/nginx/conf.d/proxy.conf
server {
    listen 80;
    location /api/ {
        proxy_pass http://${PROXY_BACKEND_HOST}/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
  rm /etc/nginx/conf.d/default.conf
fi

nginx -g "daemon off;"