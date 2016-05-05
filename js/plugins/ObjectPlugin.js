/*
Attribut/Eigenschaft:
name
fellfarbe

Funktionen:
bellen
revierMarkieren
*/

function Dog(name) {
  this.name = name;
}

Dog.fellfarbe = "braun";

Dog.prototype.bellen = function() {
  console.log("wuff! Ich bin "+this.name);
};

Dog.prototype.fellFärben = function(fellfarbe) {
  this.fellfarbe = fellfarbe;
};

var lassDas = new Dog("Lass das");
lassDas.fellFärben("rot");
