"use strict";

const { createProxyMiddleware } = require("http-proxy-middleware");

function pathRewrite(path) {
  const pathRegEx = /(\/student\/kurser\/kurs\/kursplan\/)(.*)-(.*).pdf(.*)/g;
  const langRegEx = /\?(lang|l)=(.*)/g;
  const pathArgs = pathRegEx.exec(path);
  const langArg = langRegEx.exec(pathArgs[4]);
  const lang = langArg ? langArg[2] : "sv";
  return `/api/kursplan/v1/syllabus/${pathArgs[2]}/${pathArgs[3]}/${
    lang || "sv"
  }`;
}

function setApiKey(key) {
  return function onProxyReq(proxyReq) {
    proxyReq.setHeader("api_key", key);
  };
}

function logProvider() {
  return require("kth-node-log");
}

function getPdfProxy(config, key) {
  const { https, host, port } = config;
  const target = `${https ? "https" : "http"}://${host}${
    port ? ":" + port : ""
  }`;
  const options = {
    target,
    changeOrigin: true,
    pathRewrite,
    onProxyReq: setApiKey(key),
    logProvider,
  };
  return createProxyMiddleware(options);
}

module.exports = {
  getPdfProxy,
};
