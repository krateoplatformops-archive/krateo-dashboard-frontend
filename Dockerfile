FROM bitnami/nginx

USER 0
WORKDIR /app_src
COPY . ./

RUN mv /app_src/docker-entrypoint.sh /app/docker-entrypoint.sh
# RUN install_packages yarn && yarn

RUN apt-get update
RUN apt-get install -y apt-utils
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs
RUN apt remove cmdtest
RUN apt remove yarn
RUN npm install -g yarn
RUN yarn config set network-timeout 300000 && yarn

RUN ["chmod", "+x", "/app/docker-entrypoint.sh"]
USER 1001

ENTRYPOINT ["/opt/bitnami/scripts/nginx/entrypoint.sh"]
CMD ["/app/docker-entrypoint.sh && /opt/bitnami/scripts/nginx/run.sh"]
