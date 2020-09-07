'use strict';

var entorno = require('./class_environment');



var plataforma = function(game, entradax, entraday, entradasprite, fuego, hielo){
	entorno.call(this, game, entradax, entraday, entradasprite);
	this.reescala_imagen(1, 0.3);
	this.tocada = false;
	this.arriba = false;
	this.iniPointY = entraday;
	this.temporizador = this.game.time.create(false);
	this.create();
	this.tipo;
	this.fuego = fuego;
	this.hielo = hielo;
	
}

plataforma.prototype = Object.create(entorno.prototype);
plataforma.prototype.constructor = plataforma;

plataforma.prototype.create = function (){
    this.animations.add('plat');
  	this.animations.play('plat', 4, true );

}

plataforma.prototype.cambia_tocada = function (){
	this.tocada = !this.tocada;
}

plataforma.prototype.jump = function(){
	if(this.arriba === false)
	{
	this.iniPointY = this.y;
	this.arriba = true;
	this.immovable = false;
	this.body.gravity.y = 400;
	this.body.velocity.y = -100

	//Utilizamos un temporizador de phaser para devolver la plataforma a su sitio original después de que esta caiga, 
	//ya que no siempre vuelve a quedarse en la posición original.
	this.temporizador.loop(500, vuelve, this);
  	this.temporizador.start();
}
	
}

//Sirve para apagar una plataforma de fuego
plataforma.prototype.cambiaSprite = function(){

	this.loadTexture('plat2', 0);

    this.animations.add('pla2');

    this.animations.play('plat2', 4, true);
}

function vuelve(){
	this.body.gravity.y = 0;
	this.body.velocity.y = 0;
	this.y = this.iniPointY;
	this.immovable = true;
	this.tocada = false;
	this.temporizador.stop();
	this.arriba = false;

}


module.exports = plataforma;