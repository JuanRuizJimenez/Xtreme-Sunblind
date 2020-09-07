var PU = require('./class_powerUp');	
var sound;

var batidoDeProteinas = function(game, entradasprite){
	sound = game.add.audio('prot');
	this.orina = 3;
	PU.call(this, game, entradasprite, this.orina);
	this.reescala_imagen(0.9,0.9);	
}

batidoDeProteinas.prototype = Object.create(PU.prototype);
batidoDeProteinas.prototype.constructor = batidoDeProteinas;

batidoDeProteinas.prototype.efecto = function(jug){
	sound.play();
	jug.invencible = true;
	jug.borracho = false;
	setTimeout(function(){jug.invencible = false}, 5000);

}

module.exports = batidoDeProteinas;