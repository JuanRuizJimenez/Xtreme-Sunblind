'use strict'

var plat = require('./class_platform');
	
var plataforma = {};
var platforms;
var platformsIni;
var level;
var fug;

plataforma.creaPlataforma = function(juego, nivel) {

  level = nivel;
  var anchorx;
  var anchory;  
  var anchoPlat = 500;
  var largoPlat = 50;

  platforms = juego.add.physicsGroup();
  platformsIni = juego.add.physicsGroup();

  //Determinamos de forma aleatoria si nos encontramos ante un nivel de fuego o hielo
  var aleatorio = juego.rnd.integerInRange(0,1);
  if (aleatorio === 0)
    fug = false;
  else fug = true;


  //conjuntos de plataformas

  anchorx = 0; anchory = 0;
  for (var a = -1; a < 26; a++){
    plataforma.creaPlat(a, anchorx, anchory, juego, true, false);
  }
  anchorx = 0; anchory = 200;
  for (var a = 0; a < 8; a++){
    plataforma.creaPlat(a, anchorx, anchory, juego, false, false);
  }
  anchorx = 1280-anchoPlat; anchory = 200;
  for (var a = 0; a < 8; a++){
    plataforma.creaPlat(a, anchorx, anchory, juego, false, false);
  }
  anchorx = 350; anchory = 375;
  for (var a = 1; a < 8; a++){
    plataforma.creaPlat(a, anchorx, anchory, juego, false, false);
  }
  anchorx = 0; anchory = 400;
  for (var a = 0; a < 4; a++){
    plataforma.creaPlat(a, anchorx, anchory, juego, false, false);
  }
  anchorx = 1280 - 250; anchory = 400;
  for (var a = 0; a < 4; a++){
    plataforma.creaPlat(a, anchorx, anchory, juego, false, false);
  }
  anchorx = 0; anchory = 550;
  for (var a = 0; a < 8; a++){
    plataforma.creaPlat(a, anchorx, anchory, juego, false, false);
  }
  anchorx = 1280-anchoPlat; anchory = 550;
  for (var a = 0; a < 8; a++){
    plataforma.creaPlat(a, anchorx, anchory, juego, false, false);
  }
  anchorx = 0; anchory = 700;
  for (var a = -1; a < 26; a++){
    plataforma.creaPlat(a, anchorx, anchory, juego, false, false);
  }

  //Plataformas para cuando muera el jugador
   var anchorx = 510; var anchory = 100;
    for (var a = 0; a < 4; a++){
    plataforma.creaPlat(a, anchorx, anchory, juego, false, true);
  }   
    platformsIni.visible = false;
        
} 

    plataforma.creaPlat = function(a, anchorx, anchory, juego, superior, ini){

      var fuego = false; var hielo = false;

      //En cada nivel las plataformas son destruidas y vueltas a crear para que, a partir del nivel 6, podamos decidir qué tipo
      //de plataforma tenemos

    if(level >= 6 && !superior && !ini){
      var aleatorio = juego.rnd.integerInRange(0,100); //porcentaje para que una plataforma pueda ser de fuego o hielo
    

        if (aleatorio <= 95){ //Sólo será de fuegoo o hielo la plataforma si entra en el 5%

           var sprite = 'plat2';}

         else {

          if(!fug){

           var sprite = 'plat0';
           hielo = true;
           }

          else{
           var sprite = 'plat1';
           fuego = true;
          }
       }
  }
  

   else {
      var sprite = 'plat2';
    }
    
    var p = (new plat(juego, 0, 0, sprite, fuego, hielo));
    if(superior)
      p.reescala_imagen(1, 0.1);
    p.cambia_pos(anchorx + (a*p.width), anchory);
    if(!ini)
    platforms.add(p);
    else
    platformsIni.add(p);

  }

  plataforma.devuelvePlat = function(){

    return platforms;
  }

  plataforma.devuelveIni = function(){
    return platformsIni;
  }
  

module.exports = plataforma;