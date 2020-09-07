var PU = require('./class_powerUp');
var HUD = require('./HUD');	
var sound;

var alcohol = function(game, entradasprite){
	sound = game.add.audio('beer');
	this.orina = 5;
	PU.call(this, game, entradasprite, this.orina);
	this.reescala_imagen(0.9,0.9);	
}

alcohol.prototype = Object.create(PU.prototype);
alcohol.prototype.constructor = alcohol;

alcohol.prototype.efecto = function(jug){
	sound.play();
	jug.borracho = true;
	HUD.borracho();
	setTimeout(function(){jug.borracho = false; HUD.noBorracho();}, 5000);
}

module.exports = alcohol;