
"use strict";

var GO = require('./class_object');
var escena = require('./play_scene');

var powerUp = function(game, entradasprite, orina){
	this.Rx = game.rnd.integerInRange(0, 1200);
 	this.Ry = game.rnd.integerInRange(0, 500);
 	this.timer;
 	
  GO.call(this, game, this.Rx, this.Ry, entradasprite);
  this.orina = orina;
  game.physics.arcade.enable(this);
  this.body.gravity.y = 4000;
}

powerUp.prototype = Object.create(GO.prototype);
powerUp.prototype.constructor = powerUp;

module.exports = powerUp;