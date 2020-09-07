'use strict';

var PlayScene = require('./play_scene.js');

var buttonJuego;  var juego; var video; var timer;
var click;

var Tutorial = {

  create: function () {
    juego = this.game;

    click = juego.add.audio('click');

    juego.state.add('play', PlayScene); 

    //Aquí insertamos el vídeo de cómo jugar
   
    //Primero el fondo
    juego.add.sprite(0,0, 'fVideo');
    var aux = juego.add.sprite(100,0, 'aux');
    aux.width = 1100;
    aux.height = 615;

    //Después el vídeo
    video = juego.add.video('tuto');
    video.play(false);
    video.addToWorld(650, 300, 0.5, 0.5, 0.8, 0.8);

    //Temporizador para cuando termine el vídeo ir directamente al estado del juego
    timer = setTimeout(function(){video.currentTime = 0;
	video.stop(); juego.state.start('play');}, 51000);

    //Boton que nos lleva al juego
    buttonJuego = juego.add.button(juego.world.centerX + 400, 600, 'omitir', actionOnClickJuego, this, 2,1,0);
    buttonJuego.animations.add('omitir');
    buttonJuego.animations.play('omitir', 4, true );
    buttonJuego.width = 150;
    buttonJuego.height = 60;

 },
};


function actionOnClickJuego () {
    //Ponemos el vídeo a 0 por si el jugador sale al menú principal y vuelve a entrar al juego
    //Paramos el temporizador que controla cuando se ha terminado el vídeo tutorial para empezar 
    // el juego automáticamente
    //Iniciamos el estado Juego
	click.play();
	video.currentTime = 0;
	video.stop();
    clearTimeout(timer);
    juego.state.start('play');
}

module.exports = Tutorial; 

