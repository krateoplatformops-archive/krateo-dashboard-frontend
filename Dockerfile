FROM bitnami/nginx

WORKDIR /app_src
COPY . ./

USER 0
RUN mv /app_src/docker-entrypoint.sh /app/docker-entrypoint.sh
# RUN install_packages yarn && yarn

RUN apt-get update
RUN apt-get install -y apt-utils
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs git util-linux
RUN apt remove cmdtest
RUN apt remove yarn
RUN npm install -g yarn
RUN yarn config set network-timeout 300000 && yarn

RUN ["chmod", "+x", "/app/docker-entrypoint.sh"]
RUN ["chown", "1001", "-R", "/.config"]
RUN ["chown", "1001", "-R", "/app_src"]
RUN ["chown", "1001", "-R", "/app"]
USER 1001

CMD ["/app/docker-entrypoint.sh"]