FROM nginx:alpine

WORKDIR /app
COPY . ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

RUN apk add --no-cache nodejs yarn git && yarn

RUN chmod -c 777 /app/packages/app/dist

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
