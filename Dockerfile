FROM kthse/kth-nodejs:10.14.0

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
CMD ["node", "app.js"]