#!/usr/bin/env sh

cd /app/packages/app
CUR_DIR=$(pwd)
yarn build
cp -r /app/packages/app/dist/* /usr/share/nginx/html
envsubst '\$PORT' < /etc/nginx/conf.d/configfile.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'