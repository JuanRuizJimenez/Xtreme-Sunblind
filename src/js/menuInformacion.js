'use strict';

var men = require('./menu.js');

var buttonInfoD; var buttonInfoI; var buttonInfoM;
var fondo;
var cont;
var juego;
var click; var back;
var video1; var video2;

var menuInformacion = {

	create: function(){
	juego = this.game;
	//Cargamos las imágenes del menú
	fondo = juego.add.sprite(0,0,'Potenciadores');

	//Añadimos sonidos
    click = juego.add.audio('click');
    back = juego.add.audio('back');

	cont = 0;

	cambiaImagenes();
	}
};


function vuelveAMenu(){

	//Para volver al estado de menú principal
	back.play();
	juego.state.start('menu');
}


function cambiainfoD(){
	//Pasamos a la pestaña dela derecha
	click.play();
	cont++;

	if (cont >= 5)
		cont = 0;

	cambiaImagenes(); //Llamamos al método que cambia las pestañas
}

function cambiainfoI(){
	//Pasamos a la pestaña de la izquierda
	back.play();
	cont--;

	if (cont < 0)
		cont = 4;

	cambiaImagenes(); //Llamamos al método que cambia las pestañas
}

function cambiaImagenes(){

	//En cada una de las diferentes pestañas tenemos que generar las imagenes y los botones de nuevo, 
	//así como en la pestaña del pis crear los vídeos, ponerlos al principio y reproducirlos.
	//Esto se debe a que no hemos encontrado ningún método para ocultar los vídeos (como .visible para los sprites)
	// y no hemos encontrado ninguna mejor forma de hacerlo.

	if(cont === 0){
		juego.add.sprite(0,0,'Potenciadores');
		creaBotones();
	}
	else if (cont === 1){
		juego.add.sprite(0,0,'Enemigos');
		creaBotones();		
	}

	else if(cont === 2){
		juego.add.sprite(0,0,'Plataformas');
		creaBotones();	
	}

	else if(cont === 3){
		juego.add.sprite(0,0,'Pis');
		creaBotones();
		video1 = juego.add.video('pis1');
		video2 = juego.add.video('pis2');
		video1.currentTime = 0;
		video2.currentTime = 0;
		video1.addToWorld(320, 400, 0.5, 0.5, 0.4, 0.4);
		video2.addToWorld(960, 400, 0.5, 0.5, 0.4, 0.4);
    	video1.play(true);
    	video2.play(true);

	}

	else if(cont === 4){
		juego.add.sprite(0,0,'Controles');
		creaBotones();		
	}


}

function creaBotones(){

	//Boton para cambiar entre la info Derecha
    buttonInfoD = juego.add.button(juego.world.centerX + 500, 650, 'button', cambiainfoD, this, 2,1,0);
    buttonInfoD.animations.add('button');
    buttonInfoD.animations.play('button', 4, true );
    buttonInfoD.width = 100;
    buttonInfoD.height = 50;

    //Boton para cambiar entre la info Izquierda
    buttonInfoI = juego.add.button(juego.world.centerX - 600, 650, 'button', cambiainfoI, this, 2,1,0);
    buttonInfoI.animations.add('button');
    buttonInfoI.animations.play('button', 4, true );
    buttonInfoI.width = 100;
    buttonInfoI.height = 50;

    //Boton para volver atrás desde la info
    buttonInfoM = juego.add.button(juego.world.centerX - 600 , 25, 'button2', vuelveAMenu, this, 2,1,0);
    buttonInfoM.animations.add('button2');
    buttonInfoM.animations.play('button2', 4, true );
    buttonInfoM.width = 100;
    buttonInfoM.height = 50;

}

module.exports = menuInformacion;