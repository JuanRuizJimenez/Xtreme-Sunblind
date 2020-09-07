'use strict';

var fireball = require('./class_fireball');	

var greenfireball = function(game, entradax, entraday, entradasprite, dir, velx, vely){
	fireball.call(this, game, entradax, entraday, entradasprite, dir, velx);
	this.juego = game;
	this.velocidadY = vely;
	this.cont = 0;
	this.animations.add('mueve',[0,1,2,3,4,5], 7, true);
	this.animations.play('mueve');
}

greenfireball.prototype = Object.create(fireball.prototype);
greenfireball.prototype.constructor = greenfireball;

greenfireball.prototype.update = function (){
	if (this.sale){
		this.actualiza_pos(this.velocidad);
		this.y += ((Math.sin (this.cont))*6);
		this.cont += 0.25;
	}
}

module.exports = greenfireball;