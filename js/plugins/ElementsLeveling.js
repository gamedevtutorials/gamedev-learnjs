/**
 * Created by Gilles on 11.06.2016.
 */

(function() {
  var _Game_Action_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function(target) {
    _Game_Action_apply.call(this, target);

    if(target.result().isHit()) {
      this.subject().calcElementExp(this.item());
    }
  };

  var _Game_Actor_setup = Game_Actor.prototype.setup;
  Game_Actor.prototype.setup = function(actorId) {
    _Game_Actor_setup.call(this, actorId);
    this.clearElementParams();
  };


  /*Game_Action.prototype.makeDamageValue = function(target, critical) {
    var item = this.item();
    var baseValue = this.evalDamageFormula(target);
    var value = baseValue * this.calcElementRate(target);
    if (this.isPhysical()) {
      value *= target.pdr;
    }
    if (this.isMagical()) {
      value *= target.mdr;
    }
    if (baseValue < 0) {
      value *= target.rec;
    }
    if (critical) {
      value = this.applyCritical(value);
    }
    value = this.applyVariance(value, item.damage.variance);
    value = this.applyGuard(value, target);
    value = Math.round(value);
    return value;
  };*/


  Game_Actor.prototype.clearElementParams = function() {
    this._elementParams = [];
    this._elementLevel = [];
    for(var i=0; i < $dataSystem.elements.length; i++) {
      this._elementParams[i] = 0;
      this._elementLevel[i] = 0;
    }
  };



  Game_Actor.prototype.calcElementExp = function(item) {
    var elementId = item.damage.elementId;
    var xp = (item.meta.xp !== undefined) ? item.meta.xp : 1;
    if(elementId > 0) {
      this.addElementExp(elementId, xp);
    }
  };

  Game_Actor.prototype.levelUpElement = function(elementId) {
    var xp = this.getNeededElementXPForNextLevel(elementId);
    this.gainElementExp(elementId, xp);
  };

  Game_Actor.prototype.gainElementExp = function(elementId, xp) {
     this._elementParams[elementId] += xp;
     var lastSkills = this.skills();
     if(this.shouldDisplayLevelUp() && this.calculateElementLevel(elementId)) {

     }
  };

  Game_Actor.prototype

  Game_Actor.prototype.getNeededElementXPForNextLevel = function(elementId) {
    this.calcElementLevel(elementId);

    var curve = this.getElementLevelCurve(elementId);
    var level = this.getElementLevel(elementId);
    var currentXp = this.getElementExp(elementId);

    var expForNextLevel = curve[level+1];

    return expForNextLevel-currentXp;

  };

  Game_Actor.prototype.calculateElementLevel = function(elementId) {
     var currentLevel = this._elementLevel[elementId];
     var levelWithXp = this.getElementLevelByXp(elementId);
     if(levelWithXp > currentLevel) {
       this._elementLevel[elementId] = levelWithXp;
       this.learnSkillsforElement(elementId);
       return true;
     }

    return false;
  };

  Game_Actor.prototype.learnSkillsforElement = function(elementId) {
    var skills = this.skills();

  };

  Game_Actor.prototype.getAllSkillsToLearn = function() {
    return this.currentClass().meta.elementSkill;
  };

  Game_Actor.prototype.getElementLevelByXp = function(elementId) {
    var xp = this._elementParams[elementId];
    var level =0;
    var curve = this.getElementLevelCurve(elementId);
    for(var i=0; i < curve.length; i++) {
      var neededXp = curve[i];
      if(xp >= neededXp) {
        level++;
      } else {
        break;
      }
    }
    return level;
  };

  Game_Actor.prototype.getElementLevel = function(elementId) {
    return this._elementLevel[elementId];
  };

  Game_Actor.prototype.getElementExp = function(elementId) {
    return this._elementParams[elementId];
  };

  Game_Actor.prototype.getElementLevelCurve = function(elementId) {
    return [5,20,40,65,90,120,160,200,260,330,400,500,650,830,1000];
  };

})();