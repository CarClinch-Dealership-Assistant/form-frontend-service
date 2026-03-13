# Use the lightweight Nginx Alpine image
FROM nginx:alpine

# Copy custom nginx config
# replace your existing COPY for nginx.conf with:
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy all site static files into Nginx html directory
COPY . /usr/share/nginx/html/

# Expose port 80 to the outside world
EXPOSE 80

CMD ["/entrypoint.sh"]
