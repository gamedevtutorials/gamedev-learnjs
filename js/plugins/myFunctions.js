function gainExp(currentXP, monster) {
  var plusXP = 0;
  if(monster == "slime") {
    plusXP = 10;
  } else if(monster == "bat") {
    plusXP = 25;
  }
  currentXP = currentXP + plusXP;
  return currentXP;
}

function doLevelUp(xp, name) {
  if(xp >= 100) {
    alert(name + " ist ein Level aufgestiegen");
    xp = xp-100;
  }
  return xp;
}

var myXP = gainExp(85, "slime");
myXP = doLevelUp(myXP, "Alex");
alert("Aktuelle XP ist "+myXP);
