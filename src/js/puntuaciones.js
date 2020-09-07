'use strict';

var men = require('./menu.js');
var handle = require('./handleRequest.js');

var juego;
var respuesta;
var buttonInfoM;
var back;

var puntuaciones = {

	create: function(){
	 juego = this.game;
  	 juego.add.sprite(0,0,'Punct');

  	//Boton para volver atrás desde la puntuaciones
    buttonInfoM = juego.add.button(juego.world.centerX - 600 , 25, 'button2', puntuaciones.vuelveAMenu, this, 2,1,0);
    buttonInfoM.animations.add('button2');
    buttonInfoM.animations.play('button2', 4, true );
    buttonInfoM.width = 100;
    buttonInfoM.height = 50;

    back = juego.add.audio('back');

    puntuaciones.ActualizaTabla(); //Actualizamos la tabla de puntuaciones nada más entrar
	}
}

puntuaciones.ActualizaTabla = function () {
	
	handle.Peticion(juego, true, false, null); //Llamamos a handle rquest con los parámetros de Pintar = true, MandaInfo = False y Datos = null
}

puntuaciones.mandaDatos = function(datos){
  
  //Este método será llamado desde fuera para mandar los datos al servidor a través de handleRequest
  handle.Peticion(juego, false, true, datos); //Lo llamaremos con Pintar = false, mandaInfo = true y Datos = datos
}

//Para volver al menú principal
puntuaciones.vuelveAMenu = function(){
  back.play();
	juego.state.start('menu');
}

module.exports = puntuaciones;