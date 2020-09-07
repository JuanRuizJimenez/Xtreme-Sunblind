'use strict';

var movible = require('./class_movibl');	

var enemigo = function(game, entradax, entraday, entradasprite, dir, velx, grabber, puntos){
	movible.call(this, game, entradax, entraday, entradasprite, dir, velx);
	this.juego = game;
	this.create();
	this.velocidad = velx;
	this.stunt = false;
	this.golpeado = false;
	this.cont = 1;
	this.grabber = grabber;
	this.puntos = puntos;
}

enemigo.prototype = Object.create(movible.prototype);
enemigo.prototype.constructor = enemigo;

enemigo.prototype.create = function (){
	this.juego.physics.arcade.enable(this);
 	this.body.gravity.y = 4000;
}

//Devolvemos los puntos que da cada enemigo por ser eliminado
enemigo.prototype.devuelvePuntos = function(){

	return this.puntos;
}
module.exports = enemigo;

