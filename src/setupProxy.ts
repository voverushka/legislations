const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app: any) => {
  app.use(
    "/api",
    createProxyMiddleware ({
      target:  "https://api.oireachtas.ie",
      changeOrigin: true
    })
  );
};