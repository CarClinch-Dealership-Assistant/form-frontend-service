# Use the lightweight Nginx Alpine image
FROM nginx:alpine

# Copy your HTML file into the Nginx public directory
# Nginx looks for 'index.html' in this specific folder by default
COPY index.html /usr/share/nginx/html/index.html

# this nginx.conf file will be used to configure nginx to serve the html file
# w/o needing to hardcode the endpoint in the index.html file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]