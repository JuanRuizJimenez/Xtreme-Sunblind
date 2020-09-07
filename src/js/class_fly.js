"use strict";

var enemigo = require('./class_enemy');

var fly =  function(game, entradax, entraday, entradasprite, dir, velx, grabber){
  enemigo.call(this, game, entradax, entraday, entradasprite, dir, velx, grabber,5);
  this.body.gravity.y = 1000;
  this.reescala_imagen(0.9,0.9);
  this.animations.add('mueve',[0,1,2,3, 4, 5], 5, true);
  this.animations.play('mueve');
}
fly.prototype = Object.create(enemigo.prototype);
fly.prototype.constructor = fly;

fly.prototype.update = function (){
if (this.golpeado){
	this.stunt = true;
}
else
	this.stunt = false;

if(!this.stunt){
	this.actualiza_pos(this.velocidad * (this.cont));
	if (this.body.onFloor() || this.body.touching.down){
		this.body.velocity.y = -250;
	}
}
else 
	this.actualiza_pos(0);
	if( this.body.velocity.x != 0 ||  this.body.velocity.y != 0){
         this.cambia_pos(this.x, this.y);
       }
}

module.exports = fly;