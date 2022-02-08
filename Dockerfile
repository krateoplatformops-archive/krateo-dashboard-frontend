FROM nginx:alpine

WORKDIR /app
COPY . ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

RUN apk add --no-cache nodejs yarn git && yarn

RUN mkdir /app/packages/app/dist && chmod -c 777 /app/packages/app/dist
RUN chown -R nginx:nginx /app && chmod -R 755 /app && \
        chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d
RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid

USER nginx

RUN ["chmod", "+x", "/app/docker-entrypoint.sh"]
ENTRYPOINT [ "/app/docker-entrypoint.sh" ]


# FROM nginx:alpine

# WORKDIR /app
# COPY . ./
# COPY nginx.conf /etc/nginx/conf.d/configfile.template

# RUN apk add --no-cache nodejs yarn git && yarn
# # COPY node_modules/@backstage/plugin-search ./node_modules/@backstage/plugin-search

# ENV PORT 8080
# EXPOSE 8080

# RUN ["chmod", "+x", "/app/docker-entrypoint.sh"]
# ENTRYPOINT [ "/app/docker-entrypoint.sh" ]
