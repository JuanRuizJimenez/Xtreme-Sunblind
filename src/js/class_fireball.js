'use strict';

var movible = require('./class_movibl');	

var fireball = function(game, entradax, entraday, entradasprite, dir, velx){
	movible.call(this, game, entradax, entraday, entradasprite, dir, velx);
	this.juego = game;
	this.sale = false;
	this.escala = 1.1;
	this.create();
}

fireball.prototype = Object.create(movible.prototype);
fireball.prototype.constructor = fireball;

fireball.prototype.create = function (){
	this.juego.physics.arcade.enable(this);
 	this.body.gravity.y = 0;
 	this.reescala_imagen(this.escala, this.escala);
 	var bola = this;
  	setTimeout(function(){bola.sale = true;}, 250);
  	this.animations.add('mueve',[0,1], 5, true);
	this.animations.play('mueve');
}

fireball.prototype.update = function (){
	if (this.sale){
		this.actualiza_pos(this.velocidad);
	}
}

module.exports = fireball;