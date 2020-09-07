'use strict'

var escena = require('./play_scene');
var plat = require('./crea_Plataformas');
var HUD = require('./HUD');
var colisiones = {};
var enemigosEnPantalla;
var juego ;
var coin;

colisiones.create = function(game){

  juego = game;
  coin = juego.add.audio('coin');
}

//Las siguientes clases manejan las colisiones detectadas en el playScene.

//Maneja colisiones entre jugador y PowerUp
colisiones.collisionHandlerPower = function(jug, pw){
  escena.puntos.suma(-3); //Restamos los puntos de los PU (todos restan 3, no como los enemigos)
	jug.incrementaOrina(pw.orina); //Incrementamos la orina del jugador con la que nos de cada PU
	pw.efecto(jug); //Aplicamos el efecto del PU al jugador
  escena.PU.eliminado(pw); //En la escena, manejamos el evento de eliminar PU's
}

//Maneja colisiones entre el jugador y las bolas de fuego
colisiones.collisionHandlerFireBall = function(jug, fb){

  //Si el jugador es invencible, destruimos la bola, sino, matamos al jugador
	if (jug.invencible){
		fb.kill();
		jug.invencible = false;
	}

	else{
		escena.estadosJugador.jugadorMuerte();
	}

}

//Colisiones entre jugador y monedas de niveles extra
colisiones.collisionHandlerMonedas = function(jug, mon){
  escena.puntos.suma(2); //Sumamos puntos por moneda
  coin.play(); //Emitimos un sonido al cogerla
  mon.kill(); //Eliminamos la moneda
  escena.stateMoneda.reduceMoneda(); //Reducimos el número de monedas de la escena

}

//Manejamso colisiones entre el pis del jugador y los enemigos
colisiones.collisionHandlerEnemPis = function(jug, enem){

  //Lo primero que vemos es si el enemigo contra el que chocamos es de tipo agarrador, para sacarlo de la escena.
    if(enem.grabber){
      escena.agarrador.False();      
    }
    //Después sumamos los puntos del enemigo en concreto, lo destruimos, reducimos el número de enemigos por pantalla de ese momento y el número
    //de enemigos totales del nivel
    escena.puntos.suma(enem.devuelvePuntos());
    enem.kill();
    escena.enemigos.reducePantalla();
    escena.enemigos.reduceNumero();
}

//Colisiones entre el jugador y todos los enemigos
colisiones.collisionHandlerEnem = function(jug, enem){

  //En este método detectamos varios casos, principalmente si el enemigo está stuneado (aturdido) o no lo está

  //Si el enemigo NO está aturdido:
	if(!enem.stunt){
    //Si el jugador no es invencible...
		if(!jug.invencible){

      //Si el enemigo es agarrador y el jugador no está agarrado, este lo agarrará
			if(enem.agarra != undefined && !jug.agarrado)
				  enem.agarra(jug);

        //Si no es agarrador y el jugador no está siendo agarrado, en la escena llamaremos al método que elimina al jugador
			else if(!jug.agarrado) escena.estadosJugador.jugadorMuerte();

  		}
      //Si el jugador SI es invencible
  		else if (jug.invencible) {
          //Si el enemigo es del tipo agarrador, lo sacamos de la escena
          if(enem.grabber){
            escena.agarrador.False();      
        }
          //Sea o no agarrador, sumamos la puntuacion que da el enemigo, lo eliminamos y hacemos que el jugador comience su animación de ataque definida en su clase
  				enem.kill();
  				colisiones.reduceEnem();
  				jug.invencible = false;
  			}

      }

      //Si el enemigo SI está aturdido
  else {

    //Si el enemigo es del tipo agarrador, lo sacamos de la escena
    if(enem.grabber){
      escena.agarrador.False();      
    }
    //Sea o no agarrador, sumamos la puntuacion que da el enemigo, lo eliminamos y hacemos que el jugador comience su animación de ataque definida en su clase
    escena.puntos.suma(enem.devuelvePuntos());
  	enem.kill();
    jug.atacando = true;
  	
  }
  }

  //Metodo para reducir el numero de enemigos por pantalla y el numero de enemigos total
  colisiones.reduceEnem = function(){
    escena.enemigos.reducePantalla();
    escena.enemigos.reduceNumero();
  }

  //Se encarga de controlar las colisiones entre el jugador y las plataformas
  colisiones.collisionHandlerJug = function(jug, plat){
    //Si toca la plataforma con la cabeza, esta cambiará su estado, explicado en la clase plataforma
  	if(jug.body.touching.up){
   		plat.cambia_tocada();
   		plat.jump();
  	}

    //Si la plataforma es de fuego y la toca con otra parte que no sea la cabeza, y el jugador no es invencible, morirá
    //(Que no la toque con la cabeza sirve para que no muera al saltar)
  	if(plat.fuego &&  !jug.body.touching.up && !jug.invencible){
      escena.estadosJugador.jugadorMuerte();
  		
    }
    //Igual que con las de fuego pasa con las de hielo
    else if (plat.hielo && !jug.body.touching.up){
      if(!jug.corriendo)
        jug.corriendo = true;
      //Tras un tiempo, el jugador dejará de "resbalarse"
      setTimeout(function(){jug.corriendo = false;}, 300);
    }

    //Si el jugador orina sobre una plat de fuego, cambiaremos el sprite y la "actitud" de esa plataforma (la apagaremos)
    if(jug.orinando && plat.fuego){
       plat.fuego = false;
           plat.cambiaSprite();
    }

  }

  //Controla colisiones entre los enemigos y las plataformas
  colisiones.collisionHandlerPlat = function(enem, plat){

    //Si el jugador toca la plataforma, esta estará en "tocada"
  	if(plat.tocada){
  		plat.cambia_tocada(); //Si es así, cambiará ella misma su estado a tocada
  		if (!enem.golpeado){ //Si el enemigo no ha sido previamente golpeado por una plataforma, se pondrá en golpeado
  			enem.golpeado = true;
  			enem.cont = enem.cont + 0.25;
  			if (enem.cont > 2) 
  				enem.cont = 2;
        //Si el enemigo es grabber, tardará 6 segundos en dejará de estar golpeado, mientras que los otros enemigos tardarán 3
        if(enem.grabber)
            setTimeout(function(){ enem.golpeado = false;}, 6000);
          else
  			   setTimeout(function(){ enem.golpeado = false;}, 3000);
  		}
  		else {
  			enem.golpeado = false;
  			enem.cont = enem.cont - 0.25;
  			if (enem.cont < 1) 
  				enem.cont = 1;
  		}
  	}
  }

  //Controla la colision entre el pis del jugador y las plataformas
  colisiones.collisionHandlerPis = function(jug, plat){
    //Si la plataforma es de fuego y el pis está activo, la cambiará 
       if(plat.fuego){
           plat.fuego = false;
           plat.cambiaSprite();
       }
  }

    //Las dead zones son lugares colocados para que o bien los enemigos al llegar, vuelvan a aparecer
    //o bien para destruir las bolas de fuego cuando salen de la pantalla.

    colisiones.DeadZone1 = function(dead, enem){
  	enem.kill();
  	setTimeout(function(){
  		enem.reset(1200,90);
  	},1000);
  }

  colisiones.DeadZone2 = function(dead, enem){
  	enem.kill();
  	setTimeout(function(){
  		enem.reset(0,90);
  	},100);
  }

  colisiones.DeadZoneF = function(dead, fb){
  	fb.kill();
  }



  module.exports = colisiones;
