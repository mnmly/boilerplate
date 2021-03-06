/**
 * Module depedencies
 */

var fs = require('fs');
var koa = require('koa');
var co = require('co');
var app = module.exports = koa();
var port = process.env.PORT || 3000;
var mini = require('mini-livereload')();
var serve = require('koa-static');
var mount = require('koa-mount');
var route = require('koa-route');
var mnmlBuild = require('mnml-build');
var build = mnmlBuild.middleware({dev: true});
var livereload = require('koa-livereload');
var debounce = require('debounce');
var PreviewServer = require('instant-preview-server');

if('development' === app.env){

  app.use(build);
  app.use(livereload());
  mini.listen(35729);
  app.use(serve(__dirname + '/lib'));
  var previewApp = new PreviewServer();
  previewApp.listen();

  previewApp.on('preview', debounce(function(preview) {
    var _build = mnmlBuild({ dev: true, preview: preview });
    co(function *(){
      yield _build;
      mini.changed({body: {files: [preview.filename]}});
    })();
  }), 100);
}

/**
 * Expose some public dirs
 */

app.use(mount('/build', serve(__dirname + '/build')));
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
