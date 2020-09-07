'use strict';

var HUD = {};
var vida1; var vida2; var vida3;
var punct1; var punct2; var nivel;
var pisDentro; var pisFuera; var medPis; var fondoRet;
var ebrio;
var Temp1; var Temp2; 
var AG; 
var PA;
var juego;
var fullscreen;
var vidaExtra;
var vidas = [];

HUD.create = function(game){

	juego = game;

 	//VidasPlayer (el jugador siempre comienza con 3 vidas)
 	//Hacemos 2 bucles para colocar las vidas del jugador en la posición que deben tener
 	//Como máximo el jugador podrá tener 8 vidas
	for(var i = 0; i < 4; i++){
			vidas[i] = game.add.sprite(10 + 64 * i , 10,'vidas');
		}

		vidas[3].visible = false; //Recordamos que solo tienes 3 vidas al comenzar, por lo que ocultamos la cuarta

	for(var i = 0; i < 4; i++){

		vidas[i + 4] = game.add.sprite(10 + 64 * i , 70,'vidas');
		vidas[i + 4].visible = false;
		}	


	//Nivel

	//Letras "Nivel"
 	nivel = game.add.sprite(300,100, 'nivel');
 	nivel.width = 100;
 	nivel.height = 50;

 	//Número izda
	punct1 = game.add.sprite(400, 80, 'numeros');
 	punct1.width = 50;
 	punct1.height = 80;

 	//Número dcha
 	punct2 = game.add.sprite(450,80, 'numeros');
 	punct2.width = 50;
 	punct2.height = 80;

 	//Temporizador para los niveles extra

 	//Número izquierda
 	Temp1 = game.add.sprite(300, 80, 'numeros');
 	Temp1.width = 50;
 	Temp1.height = 80;
 	Temp1.visible = false;
 	Temp1.x = 600; Temp1.y = 20;

 	//Número derecha
 	Temp2 = game.add.sprite(350,80, 'numeros');
 	Temp2.width = 50;
 	Temp2.height = 80;
 	Temp2.visible = false;
	Temp2.x = 645; Temp2.y = 20;


 	//Medidor de Pis
 	//Para el retrete
 	fondoRet = game.add.sprite(870, 25, 'fondoRetrete');
 	fondoRet.height = 60;
 	fondoRet.width = 400;

 	//Barra de pis interior
 	pisDentro = game.add.sprite(950,50, 'interiorPis');
 	pisDentro.height = 10;
 	pisDentro.width = 0;

 	//Barra de pis exterior
 	pisFuera = game.add.sprite(950,50, 'exteriorPis');
 	pisFuera.height = 10;
 	pisFuera.width = 300; 	

 	//medidor de pis del retrete
 	medPis = game.add.sprite(890,20, 'medPis');
 	medPis.width = 50;
 	medPis.height = 50;
 	medPis.animations.add('maximo', [10,11]);
 	medPis.frame = 0;

 	//Jugador ebrio
 	 ebrio = game.add.sprite(0 ,0,'borracho');
 	 ebrio.visible = false;
 	 ebrio.animations.add('drunk', [0,1,2,3], 6, true);
 	 ebrio.play('drunk');

 	 //Medidor de agarre
 	 AG = game.add.sprite(950, 100, 'barraAgarrador');
 	 AG.height = 20;
 	 AG.width = 0;
 	 AG.visible = false;

 	 //Para nivel extra
 	vidaExtra = game.add.sprite(350,400, 'vidaExtra');
 	vidaExtra.width = 1000;
 	vidaExtra.height = 500;
 	vidaExtra.visible = false;

 	 //Pausa
 	 PA = game.add.sprite(0,0, 'Pausa');
 	 PA.visible = false;

 	 
 	 if(juego.movil){
 	 	var mov = game.add.sprite(0,0, 'movilHUD');
 	 }
}

HUD.actualizaVida = function(jug){

	//Hacemos visibles las vidas que tenga el jugador
	for(var i = 0; i < jug.vidas; i++){
		vidas[i].visible = true;
	}
	//Y hacemos invisibles las que haya perdido
	for(var j = jug.vidas; j < 8; j++){
		vidas[i].visible = false;
	}
}

HUD.nivel = function(lvl){

	//Hacemos visibles los números
  punct1.visible = true; punct2.visible = true; nivel.visible = true;

  	//Cálculo para los dos números de nivel
  punct1.frame = Math.floor(lvl / 10);
  punct2.frame = lvl % 10;

	//Ocultamos los números y las letras de nivel
  setTimeout(function(){punct1.visible = false; punct2.visible = false; nivel.visible = false;}, 3000);
}

HUD.tempLevel = function(temp){

	//Para los números del temporizador igual que para los de nivel
 Temp1.frame = Math.floor(temp / 10);
 Temp2.frame = temp % 10;

}

HUD.ocultaTempLevel = function(){

	//Ocultamos el temporizador
 Temp1.visible = false; Temp2.visible = false;

}

HUD.muestraTempLevel = function(){

	//Mostramos el temporizador
	Temp1.visible = true; Temp2.visible = true;
}

HUD.cambiaPis = function(pis){

	 	pisDentro.width = pis * 30;
	 	
	 	//Para la animación del retrete, si el pis está a 0 la paramos y ponemos el medidor a cero
	 	if(pis === 0){
	 		medPis.animations.stop(null, true);
	 		medPis.frame = 0;
	 	}
	 	//Si está a 10, reproducimos la animación
	 	else if(pis >= 10){
	 		medPis.animations.play('maximo', 2, true);
	 		
	 	}
	 	//Sino, actualizamos el retrete
	 	else {	
	 		medPis.frame = pis - 1;
	 	}
	 	
}

HUD.borracho = function(){

	 ebrio.visible = true;
}

HUD.noBorracho = function(){

	ebrio.visible = false;
}

HUD.cambiaGrabber = function(llega){
	//Método para cambiar la barra del grabber
	AG.width = llega * 1.5;

}

HUD.GrabberVisible = function(x,y){

	AG.visible = true;
	AG.x = x - 20;
	AG.y = y + 70;
}

HUD.GrabberInvisible = function(){

	AG.visible = false;
}

HUD.Pausa = function(){

juego.world.bringToTop(PA); //Para que se vea por delante de todo el menú de pausa
PA.visible = true;

}

HUD.quitaPausa = function(){

	PA.visible = false;
}

HUD.fullscreen = function(){
	//Método para poner el juego en modo pantalla completa

    if (juego.scale.isFullScreen)
    {
        juego.scale.stopFullScreen();
    }
    else
    {
        juego.scale.startFullScreen(false);
    }
}

HUD.cambiaExtra = function(){

	//Cuando ganas una vida en los niveles extra, aparece un mensaje que te lo dice
	vidaExtra.visible = !vidaExtra.visible;
}

module.exports = HUD;