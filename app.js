'use strict';

var SwaggerExpress = require('swagger-express-mw');
var express = require('express');
var app = express();

var config = {
  appRoot: __dirname
};

//serve public folder
app.use(express.static('public'));

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  //install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 8080;
  app.listen(port);
});
