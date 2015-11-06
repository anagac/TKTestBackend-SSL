var loopback = require('loopback');
var boot = require('loopback-boot');

var http = require('http');
var https = require('https');

var sslConfig = require('./ssl-config');

var app = module.exports = loopback();

app.start = function(httpOnly) {
  // start the web server
  if(httpOnly === undefined) {
    httpOnly = process.env.HTTP;
  }
  var server = null;
  if(!httpOnly) {
    var options = {
      key: sslConfig.privateKey,
      cert: sslConfig.certificate
    };
    server = https.createServer(options, app);
  } else {
    server = http.createServer(app);
  }
  return server.listen(app.get('port'), function() {
    var baseUrl = (httpOnly? 'http://' : 'https://') + app.get('host') + ':' + app.get('port');
    console.log(httpOnly);
    console.log(baseUrl);
    console.log('Web server listening at: %s', app.get('url'));
    app.emit('started', baseUrl);
    
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
