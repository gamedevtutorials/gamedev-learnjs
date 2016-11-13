(function() {
  var _Game_Action_prototype_executeDamage = Game_Action.prototype.executeDamage;
  Game_Action.prototype.executeDamage = function(target, value) {
    if(this.isHpEffect() && (value >= 0 && value < minDmg)) {
      value = minDmg;
    }
    _Game_Action_prototype_executeDamage.call(this, target, value);
  };
})();