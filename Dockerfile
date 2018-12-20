FROM kthse/kth-nodejs:10.14.0

RUN apk update && apk add --no-cache fontconfig freetype-dev libfontenc-dev libstdc++  curl wget

# Add phantomjs
RUN wget -qO- "https://github.com/dustinblackman/phantomized/releases/download/2.1.1a/dockerized-phantomjs.tar.gz" | tar xz -C / \
    && npm config set user 0 \
    && npm install -g phantomjs-prebuilt
    
# Add fonts required by phantomjs to render html correctly
RUN apk add --update ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family && rm -rf /var/cache/apk/*

COPY ["package.json", "package.json"]
#COPY ["package-lock.json", "package-lock.json"]

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
RUN npm install phantomjs-prebuilt@2.1.13
RUN cat /etc/fonts/fonts.conf 
RUN export FONTCONFIG_PATH=/etc/fonts
CMD ["node", "app.js","/usr/bin/phantomjs"]