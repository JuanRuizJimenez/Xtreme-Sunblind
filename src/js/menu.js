'use strict';

var tuto = require('./Tutorial.js');
var menuInformacion = require('./menuInformacion');
var Put = require('./puntuaciones');

var buttonJuego; var buttonInfo; var pantalla; var punt; var muteb;
var juego;
var click; var back; var gameSound;
var movil;

var menu = {

  create: function () {
    juego = this.game;

    juego.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT; //para que la pantalla completa se ajuste a los bordes
    //Añadimos estados al juego
    juego.state.add('info', menuInformacion);

    juego.state.add('tutorial', tuto); 

    juego.state.add('puntuation', Put);

    //Añadimos audios
    click = juego.add.audio('click');
    back = juego.add.audio('back');
    gameSound = juego.add.audio('game');

   juego.add.sprite(0,0,'Menu');

    //Boton que nos lleva al juego
    buttonJuego = juego.add.button(juego.world.centerX - 75, 275, 'button', actionOnClickJuego, this, 2,1,0);
    buttonJuego.animations.add('button');
    buttonJuego.animations.play('button', 4, true );
    buttonJuego.width = 150;
    buttonJuego.height = 60;

    //Boton para el menú de información
    buttonInfo = juego.add.button(juego.world.centerX - 75, 475, 'button', actionOnClickInfo, this, 2,1,0);
    buttonInfo.animations.add('button');
    buttonInfo.animations.play('button', 4, true );
    buttonInfo.width = 150;
    buttonInfo.height = 60;

    //Boton para fullscreen
    pantalla = juego.add.button(juego.world.centerX - 600, 600, 'PCompleta', fullscreen, this, 2,1,0);
    pantalla.animations.add('PCompleta');
    pantalla.animations.play('PCompleta', 4, true);
    pantalla.width = 150;
    pantalla.height = 80;

    //Boton para mutear audio
    muteb = juego.add.button(juego.world.centerX - 400, 600, 'mute', muteSound, this, 2,1,0);
    muteb.animations.add('static' [1]);
    muteb.animations.play('static', 4, true);
    muteb.width = 150;
    muteb.height = 80;

    //Boton para puntuaciones
    punt = juego.add.button(juego.world.centerX - 535, 300, 'button', actionOnClickPunt, this, 2,1,0);
    punt.animations.add('button');
    punt.animations.play('button', 4, true );
    punt.width = 150;
    punt.height = 60;

    //Boton para movil
    movil = juego.add.button(juego.world.centerX + 400, 300, 'button', movilClick, this, 2,1,0);
    movil.animations.add('button');
    movil.animations.play('button', 4, true );
    movil.width = 150;
    movil.height = 60;
 },
};

function movilClick(){
    juego.movil = true;
    movil.visible = false;
}

function actionOnClickPunt (){
    //Abrimos la ventana de puntuaciones (ranking) cambiando de estado
    click.play();
    juego.state.start('puntuation');
}

function actionOnClickJuego () {
    //Paramos el sonido de la musica del menú y arrancamos el estado de tutorial antes que el juego en sí
    juego.sound.stopAll();
    gameSound.loopFull();
    click.play();
    juego.state.start('tutorial');
}

function actionOnClickInfo(){
    //Estado de información
    click.play();
    juego.state.start('info');
}

function fullscreen(){
    //Botón para la pantalla completa
    if (this.game.scale.isFullScreen)
    {
        back.play();
        this.game.scale.stopFullScreen();
    }
    else
    {
        click.play();
        this.game.scale.startFullScreen(false);
    }
}

function muteSound(){
    //Boton para silenciar audio.
  this.game.sound.mute = !this.game.sound.mute;
  click.play();
}



module.exports = menu; 