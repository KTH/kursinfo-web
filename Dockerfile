FROM kthse/kth-nodejs:16.0.0
LABEL maintainer="KTH-studadm studadm.developers@kth.se"

WORKDIR /application
ENV NODE_PATH /application

ENV TZ Europe/Stockholm

COPY ["config", "config"]
COPY ["i18n", "i18n"]
COPY ["public", "public"]
COPY ["server", "server"]

COPY [".babelrc", ".babelrc"]
COPY ["app.js", "app.js"]
COPY ["build.sh", "build.sh"]
COPY ["package.json", "package.json"]
COPY ["package-lock.json", "package-lock.json"]
COPY ["webpack.config.js", "webpack.config.js"]
# Config for jest tester
COPY ["babel.config.js", "babel.config.js"]
COPY ["jest.config.js", "jest.config.js"]

RUN chmod a+rx build.sh && \
    chown -R node:node /application

USER node

RUN npm pkg delete scripts.prepare && \
    npm ci --unsafe-perm && \
    npm run build && \
    npm prune --production 

EXPOSE 3000

ENV TZ Europe/Stockholm

CMD ["npm", "start"]
