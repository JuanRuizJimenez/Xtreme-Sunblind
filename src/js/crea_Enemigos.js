'use strict'

var tort = require('./class_turtle');
var crab = require('./class_crab');
var fly = require('./class_fly');
var agarra = require('./class_agarrador');
var escena = require('./play_scene');

	
var enemigoRandom = {};
var enemies;

enemigoRandom.creaGrupo = function(juego){
	//Creamos un grupo de enemigos. Este será llamado en el create del playscene, por lo tanto sólo una vez por partida
  enemies = juego.add.physicsGroup();
}

enemigoRandom.creaEnemigoRandom = function(juego, nivel, auxRn, jugador) {

    //Vamos a esperar x tiempo antes de crear un nuevo enemigo para que no se generen 2 en el mismo punto
    setTimeout(function(){

    var aleatorioEnem = 0; 

    //Dependiendo del nivel, generaremos un tipo concreto de enemigo, por eso el aleatorio enem tiene unos valores concretos para algunos niveles
    if(nivel < 3) aleatorioEnem = 0;
    else if(nivel >= 3 && nivel < 5) aleatorioEnem = 1;
    else if(nivel === 5) aleatorioEnem = 2;
    else if(nivel === 6)
    {
      var p = juego.rnd.integerInRange(0,1);
      if(p === 0)
        aleatorioEnem = 0;
      else
        aleatorioEnem = 2; 
    }
    //después de esos niveles, será completamente aleatorio los enemigos que nos salgan
    else if(nivel >= 7) aleatorioEnem = juego.rnd.integerInRange(0,3);
      
    var x = 0;
    var y = 0;
    var xFly;
    var yFly;
    var xAG;
    var yAG;

    y = juego.rnd.integerInRange(0, 600);
    var ctrl = juego.rnd.integerInRange(0,2); //Variable para determinar la posición de salida de determiandos enemigos

    if(ctrl === 0){
      yFly = 0;
      yAG = 300;
      
    }
    else if( ctrl === 1){
      yFly = 300;
      yAG = 350;
      
    }
    else{
      yFly = 450;
      yAG = 350;
    
    }

    if(!auxRn){
      auxRn = true;
      x = juego.rnd.integerInRange(100,250);
      xFly = 100;
      xAG = 50;
    }
    else {
      auxRn = false;
      x = juego.rnd.integerInRange(950,1100);
      xFly = 1100;
      xAG = 1150;
    }

    //Dependiendo del aleatorioEnem, crearemos un tipo de enemigo u otro
    if (aleatorioEnem === 0){
      var enemigo = new tort(juego, x, 0, 'tortuguita', 1, 150, false);
    }

    else if (aleatorioEnem === 1){
      var enemigo = new fly(juego, xFly, yFly, 'fly', 1, 100, false);
      
    }
    else if (aleatorioEnem === 2){
      var enemigo = new crab(juego, x, 0, 'crabby', 1, 150, false);
    }

    else if(aleatorioEnem === 3 && escena.agarrador.devuelve() === false){
      var enemigo = new agarra(juego, xAG, yAG, 'enemigo', jugador, true);
      escena.agarrador.True();
    }

    else //Para curarnos de espanto, porque hay veces que las otras condiciones no se cumplen
      var enemigo = new tort(juego, x, 0, 'tortuguita', 1, 150);

    enemies.add(enemigo); //Añadimos el enemigo al grupo de enemigos

    if (x >= 950)
      enemigo.cambia_dir(); //Cambiamos la dirección del enemigo si este es creado en la parte derecha de la pantalla

    enemigo.velocidad = nivel * 3 + enemigo.velocidad; //Cada nivel los enemigos irán más rápido

     }, 1000);         
} 

  enemigoRandom.devuelveGrupo = function(){
  	
    return enemies;
  }


module.exports = enemigoRandom;