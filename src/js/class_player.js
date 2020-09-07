'use strict';

var movible = require('./class_movibl');
var HUD = require('./HUD');	
var cols = require('./handleCollisions');
var cursors;
var jumpButton;
var escudo;
var daVida;
var facingRight;
var salta1; var salta2;
var hurt1; var hurt2; var hurt3; var pisSpound;

var Protagonista = function(game, entradax, entraday, entradasprite, dir, velx, vidas){
	movible.call(this, game, entradax, entraday, entradasprite, dir, velx);
	this.vidas = vidas;
	this.juego = game;
  //Todos los boleanos y variables de control que necesitamos para saber qué está haciendo el player en cada momento
  this.revive = false;
  this.muerto = false;
  this.orina = 0;
  this.orinando = false;
  this.escala = 1.4;
  this.origVel = velx;
  this.vel = velx;
  this.corriendo = false;
  this.borracho = false;
  this.invencible = false;
  this.saltando = false;
  this.agarrado = false;
  this.atacando = false;
  this.haAtacado = false;
  this.pis;
  this.derecha = false;
  this.izquierda = false;
  this.salta = false;
  this.create();
}

Protagonista.prototype = Object.create(movible.prototype);
Protagonista.prototype.constructor = Protagonista;

Protagonista.prototype.create = function (){
 	this.body.gravity.y = 2000;
 	cursors = this.juego.input.keyboard.createCursorKeys();
  jumpButton = this.juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.anchor.x = 0.5;
  this.anchor.y = 0.5;
  this.reescala_imagen(1.4, 1.2);

  //Añadimos todas las animaciones del jugador
  this.animations.add('walk', [0,1,2,3]);
  this.animations.add('stay', [4,5], 6, true);
  this.animations.add('jump', [6,7,8,9,10,11,12,13,14]);
  this.animations.add('peeing', [15,16,17,18,19,20,21,22,23,24,25]);
  this.animations.add('attack1', [26]);
  this.animations.add('attack2', [27]);
  this.animations.add('attack3', [28, 29],2);
  this.animations.play('stay');

  //añadimos sonidos del player
  salta1 = this.juego.add.audio('jumpa1');
  salta2 = this.juego.add.audio('jumpa2');
  hurt1 = this.juego.add.audio('hurt1');
  hurt2 = this.juego.add.audio('hurt2');
  hurt3 = this.juego.add.audio('hurt3');
  pisSpound = this.juego.add.audio('pis');

  //Creamos el escudo del jugador, que siempre lo acompañará pero sólo estará activo cuando este beba batido de proteinas
  escudo = this.game.add.sprite(this.x ,this.y,'escudo');
  escudo.visible = false;
  escudo.width = 250;
  escudo.height = 250;

  //Hemos creado una nueva colisión invisible para la mecánica del pis.
  //Esta va con el jugador y se activa cuando este hace pis. 
  //Sirve para no utilizar el mismo collider del jugador ya que daba muchos fallos con las plataformas 
  //de los bordes y las de fuego.
  this.pis = this.game.add.sprite(this.x, this.y, 'enemigo');
  this.juego.physics.arcade.enable(this.pis);
  this.pis.visible = false;

}


Protagonista.prototype.update = function (){

if(this.juego.movil){
  
  if(this.juego.input.pointer1.isDown || this.juego.input.pointer2.isDown){

    if(this.game.input.pointer1.positionDown.x >= this.game.width / 5 * 4 &&
      this.game.input.pointer1.positionDown.y > this.game.height / 1.3){
      this.derecha = true;
    }
   else if(this.game.input.pointer1.positionDown.x < this.game.width / 5 &&
      this.game.input.pointer1.positionDown.y > this.game.height / 1.3){
      this.izquierda = true;
    }
    
    if((this.game.input.pointer1.position.y > this.game.height / 1.3 &&  (this.game.input.pointer1.position.x  > this.game.width / 5 * 2 && this.game.input.pointer1.position.x  < (this.game.width / 5 * 3) + 30 )) || 
      (this.game.input.pointer2.position.y > this.game.height / 1.3 &&  (this.game.input.pointer1.position.x  > this.game.width / 5 * 2 && this.game.input.pointer1.position.x  < (this.game.width / 5 * 3) + 30 ))){
      this.salta = true;
    }

  }
  else{
    this.derecha = false;
    this.izquierda = false;
    this.salta = false;
  }
}
  //Si no hay inputs consideramos que el jugador está parado
	 this.body.velocity.x = 0;
   this.vel = this.origVel - (this.orina * 10);
   
	 if (this.corriendo)
	 	this.vel = 2*this.vel;

	 if (this.borracho){
	 	this.vel = -this.vel;
   }

   if(this.invencible){
    this.borracho = false;

    HUD.noBorracho();
    if(!this.atacando)
    	escudo.visible = true;
    escudo.x = this.x - 125;
    escudo.y = this.y - 120;
  }
   else 
    escudo.visible = false;

   if(this.orinando){
    this.vel = 0;
    this.body.touching.down = true;
  } 


  if(this.agarrado)
    this.vel = 0;

  if(!this.atacando){ //Si el protagonista no está atacando, puede moverse y saltar

    if (cursors.left.isDown || this.izquierda)
    {
        facingRight = false; //Servriá para saber a dónde está mirando el protagonista a la hora de hacer pis
        this.body.velocity.x = -this.vel;
        if(!this.borracho)
          this.scale.x = -this.escala;
        else this.scale.x = this.escala;
        if (this.body.touching.down && !this.orinando && !this.atacando)
           this.animations.play('walk', 6, true);
         if(this.orinando)
           this.pis.body.setSize(10,60, this.x - 270, this. y -620);
    }
    else if (cursors.right.isDown || this.derecha)
    {
        facingRight = true;
        this.body.velocity.x = this.vel;
        if(!this.borracho)
        this.scale.x = this.escala;
        else this.scale.x = -this.escala;
        if (this.body.touching.down && !this.orinando && !this.atacando)
           this.animations.play('walk', 6, true);
         if(this.orinando)
           this.pis.body.setSize(10,60, this.x - 150, this. y -620);

    }

    if ((jumpButton.isDown || this.salta) && !this.agarrado && !this.orinando &&(this.body.onFloor() 
      || this.body.touching.down))

    {
      this.animations.play('jump', 10 , true);
      var n = this.juego.rnd.integerInRange(0,1); //Aleatorio para los dos sonidos distintos de salto
      if (n === 0)
        salta1.play();
      else
        salta2.play();

        this.body.velocity.y = -1000;
    }
}

    if(!this.body.touching.down) //Si no toca el suelo, está saltando. Servirá para hacer pis
             this.saltando = true;
    else this.saltando = false;

    if(cursors.up.isDown && !this.saltando && !this.atacando && this.orina >= 10)
        {
          this.borracho = false;
          HUD.noBorracho();
          this.animations.play('peeing', 6, false);
          pisSpound.play();
          this.orina = 0;
          HUD.cambiaPis(this.orina);
          this.orinando = true;

          //Primero apagamos la plataforma en la que estamos por si acaso estuviesemos en una
          //Esto se puede dar si el jugador está en invencible encima de una plataforma
          this.pis.body.setSize(10,60, this.x - 200, this.y - 620);
          //Después ya depende del movimiento del jugador apagar la de dercha o izda
          if(facingRight)
           this.pis.body.setSize(10,60, this.x - 150, this. y -620);
         else 
           this.pis.body.setSize(10,60, this.x - 270, this. y -620);
          var prota = this;
          
          setTimeout(function(){prota.orinando = false; prota.invencible = false;}, 
              2000);
        }
        
     //Aquí actualizamos la posición del objeto jugador en su clase si es que se ha movido
      if( this.body.velocity.x != 0 ||  this.body.velocity.y != 0){
         this.cambia_pos(this.x, this.y);
       }

       else if (this.body.velocity.x === 0 && !this.orinando && !this.atacando)
       	this.animations.play('stay');

       if (this.atacando){
        this.vel = 0;
        this.invencible = true;
    	this.body.touching.down = true;
       if (!this.haAtacado){
        //Seleccionamos un aleatorio para las 3 animaciones de ataque distintas que tenemos
        var num = this.juego.rnd.integerInRange(1,3);
        var prota = this;
        if (num === 1)
          hurt1.play();
        else if (num === 2)
          hurt2.play();
        else
          hurt3.play();
        prota.haAtacado = true;

        //Tras el tiempo de ataque, volvemos a poner al jugador en su estado anterior
       setTimeout(function(){prota.atacando = false;cols.reduceEnem(); prota.haAtacado = false; prota.invencible = false;}, 700);
     }
     this.animations.play('attack'+num,4,false); //finalmente hacemos la animación
      }
}

Protagonista.prototype.incrementaOrina = function (orina){

//Método que es llamado cuando el jugador toma una bebida para incrementar su orina
  this.orina = this.orina + orina;
  if(this.orina>10)
    this.orina = 10; 
  //actualizamos en el HUD el medidor de pis
  HUD.cambiaPis(this.orina);

}

function dejaDeAtacar(){


}
module.exports = Protagonista;