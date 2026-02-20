# Use the lightweight Nginx Alpine image
FROM nginx:alpine

# Copy your HTML file into the Nginx public directory
# Nginx looks for 'index.html' in this specific folder by default
COPY index.html /usr/share/nginx/html/index.html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]