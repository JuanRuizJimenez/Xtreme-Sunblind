//clase para los elementos del entorno (Plataformas sobre todo)

"use strict"; 
var GO = require('./class_object');

var entorno =  function(game, entradax, entraday, entradasprite){
  GO.call(this, game, entradax, entraday, entradasprite);
  game.physics.arcade.enable(this);
  this.body.immovable = true;
}
entorno.prototype = Object.create(GO.prototype);
entorno.prototype.constructor = entorno;

module.exports = entorno;