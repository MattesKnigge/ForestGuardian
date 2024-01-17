const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/sensorknoten-vogelhaus',
        createProxyMiddleware({
            target: 'http://django:8000',
            changeOrigin: true,
        })
    );
};