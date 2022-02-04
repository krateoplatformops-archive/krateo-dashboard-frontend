#!/usr/bin/env sh

cd /app_src/packages/app
CUR_DIR=$(pwd)
yarn build
cp -r /app_src/packages/app/dist/* /app
# rm -rf /app_src
# envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
# runuser -l 1001 -c "nginx -g 'daemon off;'"