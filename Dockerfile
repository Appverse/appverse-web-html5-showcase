FROM nginx

RUN rm -rf /usr/share/nginx/html/appverse-web-html5-showcase
COPY dist/web /usr/share/nginx/html/appverse-web-html5-showcase