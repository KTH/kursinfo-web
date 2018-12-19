FROM kthse/kth-nodejs:9.11.0

RUN apk update && apk add --no-cache fontconfig curl curl-dev && \
  mkdir -p /usr/share && \
  cd /usr/share \
  && curl -L https://github.com/Overbryd/docker-phantomjs-alpine/releases/download/2.11/phantomjs-alpine-x86_64.tar.bz2 | tar xj \
  && ln -s /usr/share/phantomjs/phantomjs /usr/bin/phantomjs \
  && phantomjs --version

COPY ["package.json", "package.json"]
COPY ["package-lock.json", "package-lock.json"]


RUN npm install --production --no-optional


# Copy files used by Gulp.
COPY ["config", "config"]
COPY ["public", "public"]
COPY ["i18n", "i18n"]
COPY ["gulpfile.js", "gulpfile.js"]
COPY ["package.json", "package.json"]
RUN npm run docker

# Copy source files, so changes does not trigger gulp.
COPY ["app.js", "app.js"]
COPY ["server", "server"]

ENV NODE_PATH /

EXPOSE 3000

CMD ["node", "app.js","/usr/bin/phantomjs"]