/**
 * Module depedencies
 */

var fs = require('fs');
var koa = require('koa');
var app = module.exports = koa();
var port = process.env.PORT || 3000;
var mini = require('mini-livereload')();
var serve = require('koa-static');
var route = require('koa-route');
var build = require('mnml-build').middleware({dev: true});
var livereload = require('koa-livereload');


if('development' === app.env){
  app.use(build);
  app.use(livereload());
  mini.listen(35729);

  app.use(serve(__dirname + '/lib'));
}

/**
 * Expose some public dirs
 */

app.use(serve(__dirname + '/build'));
app.use(serve(__dirname + '/public'));

/**
 * Returns old and plain `index.html`
 */

app.use(route.get('/', function *(){
  var index = fs.readFileSync(__dirname + '/index.html', 'utf-8');
  this.body = index;
}));

/**
 * Listen the portj
 */

app.listen(port);

console.log('Listening to %s', port);
