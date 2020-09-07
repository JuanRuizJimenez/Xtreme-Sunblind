'use strict';

var Menu = require('./menu.js');

var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    //Aqui se cargaran las imagenes en el gh-pages
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {

  	//Carga de la imagen de la barra de carga
    this.loadingBar = this.game.add.sprite(0, 500, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 5);
    this.load.setPreloadSprite(this.loadingBar);

	//Carga de imagenes para el juego

    //Fondo
    this.game.stage.backgroundColor = '#220A29'; 
    this.game.load.spritesheet('fondo', 'images/spacerun.png', 1280, 720, 9);
    this.game.load.spritesheet('fondocourse', 'images/spacecourse.png', 1280, 720, 7);
    this.game.load.image('Punct', 'images/Menus/fondoPuntuaciones.png');

	//Logo y jugador
    this.game.load.image('logo', 'images/phaser.png');
    this.game.load.image('escudo', 'images/Escudo.png');
    this.game.load.spritesheet('play', 'images/alientotal.png', 60, 57, 15);
    this.game.load.spritesheet('player', 'images/alientotal5.png', 64, 57, 29);
	  this.game.load.spritesheet('borracho', 'images/Borracho.png', 1280, 720, 4);

    //Plataformas
    this.game.load.spritesheet('plat0', 'images/plat0.png', 64, 64, 3);
    this.game.load.spritesheet('plat1', 'images/plat4.png', 64, 64, 3);
    this.game.load.spritesheet('plat2', 'images/plat2.png', 64, 64, 3);
    this.game.load.spritesheet('omitir', 'images/Menus/Omitir.png', 64, 64, 3);
    this.game.load.spritesheet('mute', 'images/Menus/mute.png', 64, 64, 3);
    this.game.load.spritesheet('PCompleta', 'images/PCompleta.png', 64,64,3);

    //HUD
    this.game.load.image('perder', 'images/lose.png');
    this.game.load.spritesheet('numeros', 'images/Numeros.png', 98.1,200,10);
    this.game.load.image('nivel', 'images/Nivel.png');
    this.game.load.image('interiorPis', 'images/InteriorPis.png');
    this.game.load.image('exteriorPis', 'images/ExteriorPis.png');
    this.game.load.spritesheet('vidas', 'images/Vidas.png');
    this.game.load.image('Pausa', 'images/Menus/pause.png');
    this.game.load.spritesheet('medPis', 'images/Pis.png', 64,64, 12);
    this.game.load.image('fondoRetrete', 'images/FondoRetrete.png');
    this.game.load.image('vidaExtra', 'images/vidaExtra.png');
    this.game.load.image('barraAgarrador', 'images/barraAgarrador.png');
    this.game.load.image('movilHUD', 'images/Menus/movilHUD.png');

    //Enemigos
    this.game.load.spritesheet('tortuguita', 'images/tortuguita.png', 64,64, 3);
    this.game.load.spritesheet('enemigo', 'images/Grabber.png', 64,64,16);
    this.game.load.spritesheet('crabby', 'images/crabby.png', 64, 57, 4);
    this.game.load.spritesheet('fly', 'images/fly.png', 64,64, 6);
    this.game.load.spritesheet('fireball', 'images/fireball.png', 64, 32, 2);
    this.game.load.spritesheet('greenfireball', 'images/greenfireball.png', 64, 64, 6);

    //Bebidas
    this.game.load.image('energetica', 'images/Energetica.png');
    this.game.load.image('agua', 'images/agua.png');
    this.game.load.image('alcohol', 'images/alcohol.png');
    this.game.load.image('proteinas', 'images/proteinas.png');

    //Monedas
    this.game.load.image('coin', 'images/coin.png');

    //Imagenes de fondo  de menu
    this.game.load.image('Potenciadores', 'images/Menus/Potenciadores.png');
    this.game.load.image('Enemigos', 'images/Menus/Enemigos.png');
    this.game.load.image('Plataformas', 'images/Menus/Plataformas.png');
    this.game.load.image('Menu', 'images/Menus/MenuPrincipal.png');
    this.game.load.image('Pis', 'images/Menus/Pis.png');
    this.game.load.image('Controles', 'images/Menus/Controles.png');
    this.game.load.spritesheet('button', 'images/Menus/boton.png', 64, 64, 3);
    this.game.load.spritesheet('button2', 'images/Menus/boton2.png', 64, 64, 3);
    this.game.load.image('fVideo', 'images/Menus/FondoVideo.png');

    //Carga de vídeos
    this.game.load.video('tuto', 'images/Menus/Tutorial.mp4');
    this.game.load.image('aux', 'images/FondoIndex.png');
    this.game.load.video('pis1', 'images/Menus/Pis1.mp4');
    this.game.load.video('pis2', 'images/Menus/Pis2.mp4');

    //Carda de los sfx
    this.game.load.audio('death', 'sfx/death.mp3');
    this.game.load.audio('jumpa1', 'sfx/jump1.mp3');
    this.game.load.audio('jumpa2', 'sfx/jump2.mp3');
    this.game.load.audio('hurt1', 'sfx/hurt1.mp3');
    this.game.load.audio('hurt2', 'sfx/hurt2.mp3');
    this.game.load.audio('hurt3', 'sfx/hurt3.mp3');
    this.game.load.audio('coin', 'sfx/coin2.mp3');
    this.game.load.audio('water', 'sfx/pu1.mp3');
    this.game.load.audio('energ', 'sfx/pu2.mp3');
    this.game.load.audio('beer', 'sfx/pu3.mp3');
    this.game.load.audio('prot', 'sfx/pu4.mp3');
    this.game.load.audio('drop', 'sfx/puDrop.mp3');
    this.game.load.audio('pause', 'sfx/pause.mp3');
    this.game.load.audio('click', 'sfx/click.mp3');
    this.game.load.audio('back', 'sfx/back.mp3');
    this.game.load.audio('pis', 'sfx/pis.mp3');
    this.game.load.audio('victory', 'sfx/victory.mp3');
    this.game.load.audio('game', 'sfx/Juego.mp3');
    this.game.load.audio('course', 'sfx/course.mp3');
    this.game.load.audio('menu', 'sfx/Menu.mp3');
  },

  create: function () {
  	var menuSound;
  	menuSound = this.game.add.audio('menu');
    menuSound.loopFull();
    this.game.state.start('menu');
  }
};


window.onload = function () {
    //Creamos el juego
  var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game');

  game.movil = false;

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('menu', Menu);

  game.state.start('boot');
};
