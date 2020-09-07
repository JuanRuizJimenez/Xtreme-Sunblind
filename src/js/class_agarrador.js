"use strict";

var enemy = require('./class_enemy');
var escena = require('./play_scene');
var HUD = require('./HUD');

var agarrador =  function(game, entradax, entraday, entradasprite, jugador, grabber){
  enemy.call(this, game, entradax, entraday, entradasprite, 1, 1, grabber, 1);

  this.agarrando = false;
  this.medAgarro = 50;
  this.jug = jugador;
  this.juego = game;
  this.espacio = this.juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.reescala_imagen(1.5,1.5);
  this.aleatorio = 0;
  this.animations.add('mueve',[0,1,2,3,4,5,6,7], 3, true);
  this.animations.add('stuned', [8,9,10,11,12,13,14,15], 3, true);
  this.animations.play('mueve');

}

agarrador.prototype = Object.create(enemy.prototype);
agarrador.prototype.constructor = agarrador;


agarrador.prototype.update = function(){
	//En el update el agarrador comprobará si está golpead, para estar de un color o de otro
	if (this.golpeado){
		this.stunt = true;
		this.animations.play('stuned');
		}
	
	else{
	this.stunt = false;
	this.animations.play('mueve');
	}

	//En el update registramos el input del espacio por si el jugador está agarrado e incrementamos el medidor de agarre.
	if(this.jug.agarrado === true && this.espacio.isDown && this.espacio.downDuration(50)){
		this.medAgarro += 10 / 4;
		HUD.cambiaGrabber(this.medAgarro);

	}

	//Si el medidor es mayor o igual a 100, agarrador soltará al jugador, si no, lo matará.
	if(this.medAgarro >= 100){
		this.aleatorio = this.juego.rnd.integerInRange(0,1);
		if(this.aleatorio === 0)
			this.aleatorio = -1;

		this.jug.cambia_pos(this.x + 200 * this.aleatorio, this.y);
		this.jug.agarrado = false;
		this.agarrando = false;
		this.medAgarro = 50;
		HUD.GrabberInvisible();
	}

	else if (this.medAgarro < 0 && this.jug.agarrado === true){
		this.jug.agarrado = false;
		this.agarrando = false;
		this.medAgarro = 50;
		HUD.GrabberInvisible();
		escena.estadosJugador.jugadorMuerte();
	}	
}

agarrador.prototype.agarra = function(jug){
	//Cuando el jugador es agarrado, llamamos a este método para que se muestre la barra de agarre
	var ag = this; 
	ag.medAgarro = 50;
	ag.agarrando = true;
	jug.agarrado = true;
	HUD.GrabberVisible(this.x, this.y);
	
	agarrador.prototype.cambiaAgarre(ag, jug);
}

agarrador.prototype.cambiaAgarre = function(ag, jug){

	//En este otro método, la barra de agarre se irá decrementando tras un tiempo (350 en este caso)
	HUD.cambiaGrabber(ag.medAgarro);
	ag.medAgarro -= 10;
	if(ag.jug.agarrado)
		setTimeout(function(){agarrador.prototype.cambiaAgarre(ag, jug);}, 350);

}

module.exports = agarrador;