"use strict";

var enemigo = require('./class_enemy');
var tortuguita =  function(game, entradax, entraday, entradasprite, dir, velx, grabber){
  enemigo.call(this, game, entradax, entraday, entradasprite, dir, velx, grabber, 2);
  this.create();
}
tortuguita.prototype = Object.create(enemigo.prototype);
tortuguita.prototype.constructor = tortuguita;

tortuguita.prototype.create = function () {
	this.reescala_imagen(1.2,1);
	this.body.gravity.y = 2000;
	this.animations.add('mueve',[0,1,2], 5, true);
	this.animations.play('mueve');
}

tortuguita.prototype.update = function (){
if (this.golpeado){
	this.stunt = true;
}
	
else
	this.stunt = false;

if(!this.stunt)
	this.actualiza_pos(this.velocidad * this.cont);
else 
	this.actualiza_pos(0);
	if( this.body.velocity.x != 0 ||  this.body.velocity.y != 0){
         this.cambia_pos(this.x, this.y);
       }
}



module.exports = tortuguita;