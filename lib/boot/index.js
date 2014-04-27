/**
 * Module dependencies
 */

var Emitter = require('emitter');

/**
 * Expose `Boot`
 */

module.exports = Boot;

/**
 * Initialize boot
 */

function Boot() {

  var self = this;
  this.heartbeat = setInterval(function(){
    self.emit('heartbeat');
  }, 100);

}

/**
 * Install emitter
 */

Emitter(Boot.prototype);
