#!/bin/sh
cat <<EOF > /usr/share/nginx/html/env.js
window.ENV = {
  BACKEND_URL: "${BACKEND_URL}"
};
EOF

nginx -g "daemon off;"