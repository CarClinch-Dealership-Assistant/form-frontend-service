#!/bin/sh
set -x

# always write env.js
cat <<EOF > /usr/share/nginx/html/env.js
window.ENV = {
  BACKEND_URL: "${BACKEND_URL}"
};
EOF

# base nginx config
BASE_CONF='
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}'

if [ -n "$PROXY_BACKEND_HOST" ]; then
  # add proxy block when running locally with Docker network
  cat <<EOF > /etc/nginx/conf.d/default.conf
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
else
  # no proxy needed (BACKEND_URL is absolute, called directly from browser)
  cat <<EOF > /etc/nginx/conf.d/default.conf
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
fi

nginx -g "daemon off;"