'use strict';

/* Somos plenamente conscientes de que mucho de los métodos y módulos que se encuentran al final de este archivo deberían ir
en otras clases, como el que crea un nivel o el que hace perder al jugador. Hemos decidido dejar estos módulos en esta
clase por dos razones principales. 

La primera es falta de tiempo para moverlos todo, ya que supondría una restructuración bastante importante de código
y debido a otros exámenes y asignaturas nos encontraos sin tiempo para realizarlo.

La segunda es que son módulos que tienen bastante relación con esta clase principal (como la creación de bolas de fuego) y son, por lo general
bastante cortos. Otros módulos que antes se encontraban en esta clase, como el crea_plataformas, fueron movidos a una clase distinta ya que 
tenían bastante menos relacíón con esta y eran métodos de un tamaño mucho mayor.*/


var go = require('./class_object');
var mov = require('./class_movibl');
var player = require('./class_player');
var plat = require('./crea_Plataformas');
var enem = require('./crea_Enemigos');
var env = require('./class_environment');
var ener = require('./class_bebidaEnergetica');
var alc = require('./class_alcohol');
var wat = require('./class_water');
var prot = require('./class_batidoDeProteinas');
var fireball = require('./class_fireball');
var greenfireball = require('./class_greenFireBall');
var cols = require('./handleCollisions');
var HUD = require('./HUD');
var coins = require('./crea_Monedas');
var Put = require('./puntuaciones');

var jugador; var nivel;
var platforms; var platformsIni;
var enemies; var numeroEnemigos; var enemigosPorNivel; var enemigosEnPantalla;
var monedas;
var auxMute;
var deadZone1; var deadZone2; var deadZones;
var fireballs; var bolaCreada = false; var bolaGreenCreada = false;
var juego;
var perder;
var powerUps; var PUcreado; var po; var inMenu;
var auxRn;
var agarrador = {};
var agarro;
var course = false; var endCourse = false; var numMonedas = 0; 
var time = 0;
var pausa; var menu; var fullS; var mute;
var fondo; var fondocourse;
var datos; var puntuation; var punt;
var pause; var drop; var back;
var style; var letras;
var menuSound; var courseSound; var gameSound;
var victory; var tempExtra;
var menuP;
var muerte;
var debug = false;


var PlayScene = {

  create: function () {

  juego = this.game;
  inMenu = false;
  //Activamos la física del juego
  juego.physics.startSystem(Phaser.Physics.ARCADE);
  puntuation = 0;
  punt = 0;

  //Imagen de fondo
  fondo = juego.add.sprite(0,0,'fondo');
  fondo.width = 1280;
  fondo.height = 720;
  fondo.animations.add('run', [0,1,2,3,4,5,6,7,8], 2, true);
  fondo.animations.play('run');

  //Fondo del nivel extra
  fondocourse = juego.add.sprite(0,0,'fondocourse');
  fondocourse.width = 1280;
  fondocourse.height = 720;
  fondocourse.animations.add('runcourse', [0,1,2,3,4,5,6], 5, true);
  fondocourse.visible = false;

  //Imagen de perder
  perder = new go(juego, 500,0, 'perder');
  perder.reescala_imagen(0.2,0.2);
  perder.visible = false;

  //Creamos primer PowerUp
  powerUps = juego.add.physicsGroup();
  PUcreado = false;
  //Creamos enemigos
  enem.creaGrupo(juego);
  auxRn = false;
  agarro = false;

  //Creamos monedas
  var numMonedas = 0;
  monedas = coins.creaGrupo(juego);

  //Creamos las deadzones 
  deadZones = juego.add.physicsGroup();
  creaDeadZone();
  
  //Creamos bolas de fuego
  fireballs = juego.add.physicsGroup();

  //Creamos al jugador
  jugador = new player(juego, 200, 600, 'player', 1, 350 , 3);
  jugador.body.setSize(25, 60, 15,-3);

  //Creamos el hud
  HUD.create(juego);
  cols.create(juego);

  //variables de audio
  muerte = juego.add.audio('death');
  pause = juego.add.audio('pause');
  drop = juego.add.audio('drop');
  back = juego.add.audio('back');
  menuSound = juego.add.audio('menu');
  courseSound = juego.add.audio('course');
  gameSound = juego.add.audio('game');
  victory = juego.add.audio('victory');

  //Finalmente, creamos el nivel
  nivel = 0; //Para el nivel 1
  nuevoNivel();

  //LISTENER PARA LA PAUSA
  pausa = juego.input.keyboard.addKey(Phaser.Keyboard.P);

  pausa.onDown.add(function () {

    if(juego.paused){
      juego.paused = false
      HUD.quitaPausa();
    };
    pause.play();
  },this);


  //LISTENER PARA EL MENU 
  menu = juego.input.keyboard.addKey(Phaser.Keyboard.M);
  menuP = false;

  menu.onDown.add(function () {
    back.play();
    if(juego.paused){
      juego.paused = false;
      HUD.Pausa();        
      juego.sound.stopAll();
      menuSound.loopFull();
      menuP = true;
      inMenu = true;
      juego.state.start('menu');
    }
  },this);

  //LISTENER PARA MUTE
  mute = juego.input.keyboard.addKey(Phaser.Keyboard.S);

  mute.onDown.add(function () { 
    if (juego.paused)
      juego.sound.mute = !juego.sound.mute;;
  },this);

  juego.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT; //Para que la pantalla completa se ajuste a los bordes

  //LISTENER PARA PANTALLA COMPLETA
  fullS = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  fullS.onDown.add(function () {

    if(juego.paused){

        HUD.fullscreen()}
      
  },this);

    style = { font: "bold 32px Arial", fill: "#F7FE2E", boundsAlignH: "center", boundsAlignV: "middle"}; //Tipogragía para la puntiación
    letras = juego.add.text(300, 20, "PUNTUACION:  " + puntos.daPuntos(), style);  //Puntuación	
 },

  update: function (){

    //Para el menú de pausa
    if(pausa.isDown && !juego.paused){
      auxMute = juego.sound.mute; //necesario guardar en una variable auxiliar el estado del muteo porque el pausa lo cambia
      juego.paused = true;
      HUD.Pausa();
      juego.sound.mute = auxMute;
    }
    
    //Actualizamos la puntuación a cada vuelta de bucle ya que hay varias cosas que afectan a la misma
    letras.setText("PUNTUACIÓN:  " + puntos.daPuntos());

    //////COLISIONES\\\\\\\

    //Para que choque el personaje con las plataformas
    juego.physics.arcade.collide(jugador, platforms, cols.collisionHandlerJug);

    //Si el jugador está orinando, hay que detectar las colisiones del pis con las plataformas y los enemigos
    if(jugador.orinando){
      juego.physics.arcade.collide(jugador.pis, platforms, cols.collisionHandlerPis);
      juego.physics.arcade.collide(enem.devuelveGrupo(), jugador.pis, cols.collisionHandlerEnemPis);
    }

    //Si el jugador está reviviendo, hay que ver sus colisiones con las plataformas de comienzo de nivel
    if(jugador.revive)
    	juego.physics.arcade.collide(jugador, platformsIni);

    //Colisiones de los enemigos con las plataformas
    juego.physics.arcade.collide(enem.devuelveGrupo(), platforms, cols.collisionHandlerPlat);

    //Si el jugador no está ni agarrado ni atacando, se comprueba si choca con algún enemigo
    if(!jugador.agarrado && !jugador.atacando){
        	juego.physics.arcade.overlap(enem.devuelveGrupo(), jugador, cols.collisionHandlerEnem);
    }
    //Bolas de fuego con el jugador
    juego.physics.arcade.overlap(fireballs, jugador, cols.collisionHandlerFireBall);

    //Enemigos con las deadZones y bolas de fuego con las deadZones
    juego.physics.arcade.overlap(enem.devuelveGrupo(), deadZone1, cols.DeadZone1);
    juego.physics.arcade.overlap(enem.devuelveGrupo(), deadZone2, cols.DeadZone2);
    juego.physics.arcade.overlap(fireballs, deadZones, cols.DeadZoneF);

    //Colisiones de los PU con las plataformas y el jugador
    juego.physics.arcade.collide(powerUps, platforms);
    juego.physics.arcade.overlap(powerUps, jugador, cols.collisionHandlerPower); 

    //Colisiones de las monedas con el jugador
    juego.physics.arcade.overlap(monedas, jugador, cols.collisionHandlerMonedas);   

      //Si en cada nivel, los enemigos que hay en pantalla son menor de los que debería haber y quedan enemigos en total en el nivel, se creará uno nuevo
    	if(enemigosEnPantalla < enemigosPorNivel && numeroEnemigos > 0 && enemigosEnPantalla != numeroEnemigos){
    		enem.creaEnemigoRandom(juego, nivel, auxRn, jugador);
    		auxRn = !auxRn; //Esta variable auxiliar es para determinar si el enemigo ha salido en la parte izquierda o derecha de la pantalla
    		enemigosEnPantalla++; //Tras crearlo, aumentaremos el número de enemigos que tenemos en la pantalla
    	}

      //Si el número de enemigos es 0, es que hemos completado el nivel, por lo que pasamos al siguiente
    	if(numeroEnemigos <= 0 && !course){
    		jugador.kill();
    		nuevoNivel();
    	}

      //Creamos las bolas de fuego si estamos en el nivel 7 o superior y se quedan 2 o 4 enemigos en el nivel, como aviso de final de nivel
    	if (nivel >= 7 && numeroEnemigos === 2 && !bolaCreada && !course)
    		creaFireballs();
      
    	if (nivel >= 7 && !bolaGreenCreada && numeroEnemigos === 4 && !course)
    		creaGreenFireballs();

      //Si en un nivel extra el número de monedas es 0, es que hemos completado el nivel extra
    	if (numMonedas <= 0 && course){
    		course = false;

        if(jugador.vidas < 8){ //Si las vidas son menores que 8, sumaremos una nueva vida al jugador
    		 jugador.vidas++;
         HUD.cambiaExtra();
         HUD.actualizaVida(jugador);
         setTimeout(function(){HUD.cambiaExtra()}, 2000); //Quitamos después de 2 segundos el mensaje de vida extra
         }
    		
    		endCourse = false;
    	}

      //Si el tiempo es menor que 0, es que no hemos completado el nivel extra
      if (time <= 0 && course){
        course = false;
        endCourse = false;
      }

      if (endCourse)
    		course = false;

    	if (!course)
    	{
    		fondocourse.animations.stop(null,true);
    		fondocourse.visible = false;
        //eliminamos todas las monedas si no estamos en un nivel extra
    		for (var i = 0 ; i < monedas.children.length; i++){
  				monedas.children[i].kill();}
    	}

  },

  render: function(){
    //Renders auxiliares para el debug
  	if(debug){
    juego.debug.body(jugador);
  	juego.debug.text('VIDAS: ' + jugador.vidas, 32, 50);
  	juego.debug.text('ORINA: ' + jugador.orina, 32, 30);
  	juego.debug.text('NUM ENEMIGOS: ' + numeroEnemigos, 32, 70);
  	juego.debug.text('NIVEL: ' + nivel, 232, 30);
  	juego.debug.text('ENEMIGOS EN PANTALLA: ' + enemigosPorNivel, 232, 50);
  	juego.debug.text('INVENCIBLE: ' + jugador.invencible, 232, 70);
  	juego.debug.text('BORRACHO: ' + jugador.borracho, 500, 30);
  	if(nivel % 5 === 0)
  		juego.debug.text('TIME: ' + time, 500, 70);
      juego.debug.text('agarro: ' + agarro, 500, 30);
  }
  }
};

//Función para quitar el menú de pausa
function vuelvePausa(event){

  if(game.paused)
   game.paused = false;
}

var puntos = {}
//metodo para sumar puntos
puntos.suma = function (numero) {
  punt += numero;
}

puntos.daPuntos = function(){

  return punt
}

module.exports.puntos = puntos;


//Método para crear un nuevo nivel 
function nuevoNivel(){

  nivel++; //Sumamos 1 al nivel
  puntos.suma(10); //10 puntos solamente por cambiar de nivel. Si es que somos un amor
  HUD.nivel(nivel); //Actualizamos el HUD para mostrar el nivel en el que estamos

  //Ponemos a 0 y reiniciamos todas las variables necesarias
  enemigosEnPantalla = 0; 
  bolaCreada = false;
  bolaGreenCreada = false;
  agarro = false;

 
  PU.creaPower(); //Creamos un nuevo PU

  //Si el nivel es mayor que 7, el número de enemigos por nivel crece, sino será el mismo que el del nivel
  if(nivel >= 7)
	 numeroEnemigos = nivel + juego.rnd.integerInRange(0,2);
  else
	numeroEnemigos = nivel;

  //Quitamos todos los efectos que pueda tener el jugador del nivel anterior
  jugador.borracho = false;
  HUD.noBorracho();
  jugador.orinando = false;
  jugador.invencible = false;
  jugador.corriendo = false;

	
	//Cada vez que pasamos de nivel, tenemos que eliminar las plataformas y después volver a crearlas, ya que a partir de x nivel
	//tendremos varios tipos de plataformas y hay que cambiarlas	
	if(nivel != 1){
 			 for (var i = 0 ; i < platforms.children.length; i++){
  				platforms.children[i].kill();}

 			 for (var i = 0 ; i < platformsIni.children.length; i++){
  				platformsIni.children[i].kill(); }
}	

  //Creamos grupo de plataformas
  plat.creaPlataforma(juego, nivel);
  platforms = plat.devuelvePlat();
  platformsIni = plat.devuelveIni();

  //Para el número de enemigos que salen por pantalla. A más nivel, más enemigos en pantalla
	var porcentaje = juego.rnd.integerInRange(0,100);
	
  if(nivel > 25)
    enemigosPorNivel = 4;
  else if(nivel > 10)
    enemigosPorNivel = 3;
	else if(nivel > 2)
		enemigosPorNivel = 2;
	else
		enemigosPorNivel = 1;

  //En el nivel 1, el jugador sale abajo a la izquierda. En los niveles posteriores saldrá arriba en el centro sobre unas plataformas
  if(nivel != 1){
	jugador.reset(640,0); //Posición donde revive el jugador después de ser eliminado para pasar de nivel
	jugador.revive = true;
	platformsIni.visible = true;
    setTimeout(function(){ platformsIni.visible = false; jugador.revive = false;}, 3000);
}

if (nivel % 5 === 0) //Cada 5 niveles, tenemos una pantalla de bonificacion
  {
    //Cambiamos los sonidos, el fondo y comenzamos un contador de tiempo para terminar el nivel, así como creamos las monedas
    juego.sound.stopAll();
    courseSound.loopFull();
  	fondocourse.animations.play('runcourse');
  	fondocourse.visible = true;
  	time = 15;
    HUD.muestraTempLevel();
    actualizaCont(time);
  	course = true;
  	endCourse = false;
  	numeroEnemigos = 0;
  	enemigosEnPantalla = 0;
  	numMonedas = 10;
  	monedas = coins.devuelveGrupo(juego, numMonedas);
  }

  else {
    //Si no, creamos el nivel normal
    juego.sound.stopAll();
    victory.play();
    gameSound.loopFull();
    HUD.ocultaTempLevel();
  }
}


//Metodos para devolver y cambiar la cualidad de agarrador, para controlar que solo haya uno por pantalla
agarrador.devuelve= function (){

  return agarro;
}

agarrador.True = function(){

  agarro = true;
}

agarrador.False = function(){

agarro = false;
}

module.exports.agarrador = agarrador;


//Metodos para reducir el número total de enemigos y los que estén en pantalla
var enemigos = {}

enemigos.reduceNumero = function () {
  numeroEnemigos--;
}

enemigos.reducePantalla = function(){
  enemigosEnPantalla--;
}

module.exports.enemigos = enemigos;


//Módulo para cuando el jugador se quede sin vidas y pierda la partida
var perd = {};

perd.Perder = function(){

	puntuation = puntos.daPuntos(); //guardamos la puntuacion que ha sacado el jugador

	perder.visible = true; //Texto de perder en visible

    setTimeout(function(){
      var nombre = "abcdefsgufjslh" //Nombre aleatorio con más de 12 caracteres para forzar la entrada al bucle
      var cont = 0;

      while(nombre.length > 12){
        if(cont < 3) //Avisamos, de buena manera, que el tamaño del nombre tiene que ser menor de 12
    	nombre = prompt("Introduce tu nombre para el ranking: \n (no introduzcas nada si no quieres guardar la puntuación,\nMáximo 12 caracteres <3)");
       else //Si hay alguien muy cabezota se lo recordamos después de tres intentos (una bromita hombre, no va a ser todo serio)
        nombre = prompt("Introduce tu nombre para el ranking: \n (¡MÁXIMO 12 CARACTERES!)");
      cont++;
    } 

    if(nombre != undefined && nombre != null) //Si el nombre no es vacío, básicamente. Hay métodos de javascript que detectan si el 
      //nombre está compuesto por espacios o vacío ('   '), pero no he podido hacer que funcionen
      
    if  (nombre.length != 0){ //Otra comprobación para ver que el nombre no es vacío
        
		datos = [nombre, puntuation.toString(), nivel.toString()]; //asignamos al array de datos las variables que hemos conseguido en la partida, 
    //y las parseamos a string ya que al hacer la petición necesitamos un string

		if(puntuation <= 0) //Comprobamos que la puntuación de la persona no es 0 ya que puede ser hasta negativa por los PowerUps
			alert("¡" + nombre + " Tu puntuación es 0!"  +"\n" + "(Mejor vuelve a intentarlo, que queda feo poner un 0)");
    
    	else
   		Put.mandaDatos(datos);} //Mandamos los datos al servidor
        }, 3000);

    //Si el nombre es vacío, nulo, blanco... o simplemente se le ha dado al botón de cancelar, 
    //pasamos directamente al menú principal
    //Cabe destacar que este temporizador de 6 segundos ha estado corriendo mientras el prompt estaba activo, por eso nos llevará casi
    //directamente al menú principal, sin esperar 6 segundos
    setTimeout(function(){ 
      juego.sound.stopAll();
      menuSound.loopFull();
      inMenu = true;
    juego.state.start('menu');
  }, 6000);
}

module.exports.perd = perd;

//Para los niveles extra, actualizaremos cada segundo el contador decreciente de tiempo
function actualizaCont(tiempo){

    time = tiempo;
     HUD.tempLevel(tiempo); 
     tiempo--;
     if(time >= 0 && !endCourse) {
      tempExtra = setTimeout(function(){actualizaCont(tiempo);}, 1000);
    }
}

//Este PU sirve para ser llamado desde la clase PowerUp. Creará un nuevo PU aleatorio
var PUcreado;
var PU = {};

PU.creaPower = function() {
			var aleatorio = juego.rnd.integerInRange(0, 3);
    		 
    		if(!PU.devuelve()){ //Si el PU no ha sido ya creado(es decir, si no hay uno ya en escena).
    			PU.creado();
setTimeout(function(){ 

			if(aleatorio === 0) po = new ener(juego,'energetica');

  			else if(aleatorio === 1) po = new alc(juego, 'alcohol');

  			else if(aleatorio === 2) po = new wat(juego, 'agua');

  			else if(aleatorio === 3) po = new prot(juego, 'proteinas');

        powerUps.add(po);
        drop.play();

        if(menuP === false)
          po.temp = setTimeout(function(){PU.eliminado(po); }, 6000); //Destruiremos el PU a los 6 segundos para crear uno nuevo

		}, 2000);
	 }
    		
}

PU.creado = function () {
  PUcreado = true;
}

PU.devuelve = function(){

  return PUcreado;
}

//Cuando eliminamos el PU, creamos uno nuevo si no estamos en el menú Principal
PU.eliminado = function(po){

  clearTimeout(po.temp); //Limpiaremos el temporizador
  po.kill(); //Destruiremos el PU
  powerUps.remove(po); //Lo eliminaremos del grupo
  PUcreado = false;
  if (!inMenu)
    PU.creaPower(); //Crearemos uno nuevo
}

module.exports.PU = PU;


//Diferentes estados en los que se puede encontrar el jugador. 
//esta es una de las clases de las que hablabamos en el "header" de esta clase. Debería ir en la clase player y somos conscientes de ello,
//pero al suponer una reestructuración bastante importante del código, no tener tiempo para ello y estar bastante relacionada con la escena, 
//hemos decidido dejarla aquí. Con más tiempo sería cambiada sin dificultad aparente a la clase player.
var estadosJugador = {};
  
  //Cuando el jugador muere
  estadosJugador.jugadorMuerte = function(jug){

        muerte.play(); //Sonido de muerte
        jugador.kill(); //eliminamos al jugador
        jugador.vidas--;  //le restamos una vida
        HUD.actualizaVida(jugador); //Actualizamos su HUD

        //Restauramos sus atributos
        jugador.vel = jugador.origVel;
        jugador.borracho = false;
        jugador.invencible = false;
        jugador.orinando = false;
        HUD.noBorracho();
        jugador.orina = 0;
        HUD.cambiaPis(jugador.orina);

        if(jugador.vidas > 0) //Si su vida es mayor que 0, revivimos al jugador con métodos ya vistos, si no perderá la partida
            setTimeout(function(){ estadosJugador.revive(jug); platformsIni.visible = true;}, 1000);
          else 
            {
              perd.Perder();
            }

  }

   estadosJugador.revive = function(jug, game){
    
    //Acabamos de eliminar al jugador y lo restablecemos en el centro de la pantalla arriba
    //Eliminamos las plataformas auxiliares de arriba a los 2 segundos
    jugador.muerto = true;
    jugador.revive = true;
    jugador.reset(640,0); 
    setTimeout(function(){ jugador.revive = false; platformsIni.visible = false; jugador.muerto = false;}, 2000);

   }

  module.exports.estadosJugador = estadosJugador;


//Creamos las bolas de fuego, tanto las rojas como las verdes
  function creaFireballs (){
  	var x; var y; var r; var time;
  	bolaCreada = true;
  	x = 1210; y = 320;
  	var fb = new fireball (juego, x, y, 'fireball', 1, 400);
  	if (x >= 550)
  		fb.cambia_dir();
  	fireballs.add(fb);

  	x = 20; y = 290;
  	var fb2 = new fireball (juego, x, y, 'fireball', 1, 400);
  	if (x >= 550)
  		fb2.cambia_dir();
  	fireballs.add(fb2);
  }

    function creaGreenFireballs (){
  	var x; var y; var r; var time;
  	bolaGreenCreada = true;
  	x = 1210; y = 450;
  	var fb = new greenfireball (juego, x, y, 'greenfireball', 1, 200, 400);
  	if (x >= 550)
  		fb.cambia_dir();
  	fireballs.add(fb);

  	x = 20; y = 450;
  	var fb2 = new greenfireball (juego, x, y, 'greenfireball', 1, 200, 400);
  	if (x >= 550)
  		fb2.cambia_dir();
  	fireballs.add(fb2);
  }

  //Creamos las deadZones para los personajes como para las bolas de fuego
  function creaDeadZone(){
      //Para los enemigos
  deadZone1 = new env(juego, -50, 640, 'fondo');
  deadZone1.reescala_imagen(0.05,0.08);
  deadZone1.visible = false;

  deadZone2 = new env(juego, 1260, 640, 'fondo');
  deadZone2.reescala_imagen(0.05,0.08);
  deadZone2.visible = false;

  //Para las fireballs
  var deadZone3 = new env(juego, -40, 0, 'fondo');
  deadZone3.reescala_imagen(0.03,1);
  deadZone3.visible = false;
  deadZones.add(deadZone3);

  var deadZone4 = new env(juego, 1260, 0, 'fondo');
  deadZone4.reescala_imagen(0.03,1);
  deadZone4.visible = false;
  deadZones.add(deadZone4);
  }

  //Metodos para contabilizar las monedas
  var stateMoneda = {};
  stateMoneda.reduceMoneda = function(){
  	numMonedas--;
  }
  module.exports.stateMoneda = stateMoneda;

  function endedCourse(){
  	endCourse=true;
  }

module.exports = PlayScene;
