var PU = require('./class_powerUp');	
var sound;

var bebidaEnergetica = function(game, entradasprite){
	sound = game.add.audio('energ');
	this.orina = 3;
	PU.call(this, game, entradasprite, this.orina);
	this.reescala_imagen(0.9,0.9);
	
}

bebidaEnergetica.prototype = Object.create(PU.prototype);
bebidaEnergetica.prototype.constructor = bebidaEnergetica;

bebidaEnergetica.prototype.efecto = function(jug){
	sound.play();
	jug.corriendo = true;
	setTimeout(function(){jug.corriendo = false}, 5000);

}

module.exports = bebidaEnergetica;