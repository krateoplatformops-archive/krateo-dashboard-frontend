FROM nginx:alpine

WORKDIR /app
COPY . ./
COPY nginx.conf /etc/nginx/conf.d/configfile.template

ENV PORT 8080
EXPOSE 8080

CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf"

RUN apk add --no-cache nodejs yarn git util-linux && yarn

RUN chown 1001:1001 -R /app
RUN chown 1001:1001 -R /var/cache/nginx
RUN adduser -D -u 1001 -g 1001 -s /bin/sh -G 1001 nginx
USER 1001

RUN ["chmod", "+x", "/app/docker-entrypoint.sh"]
ENTRYPOINT [ "/app/docker-entrypoint.sh" ]
