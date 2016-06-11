/**
 * Created by Gilles on 11.06.2016.
 */

(function() {

  DataManager.extractMetadata = function(data) {
    var re = /<([^<>:]+)(:?)([^>]*)>/g;
    data.meta = {};
    for (;;) {
      var match = re.exec(data.note);
      if (match) {
        if (match[2] === ':') {
          if(data.meta[match[1]] !== undefined) {
            if(!(data.meta[match[1]] instanceof Array)) {
              data.meta[match[1]] = [data.meta[match[1]]]
            }
            data.meta[match[1]].push(match[3]);
          } else {
            data.meta[match[1]] = match[3];
          }

        } else {
          data.meta[match[1]] = true;
        }
      } else {
        break;
      }
    }
  };


  var _Game_Action_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function(target) {
    _Game_Action_apply.call(this, target);

    if(target.result().isHit()) {
      this.subject().calcElementExp && this.subject().calcElementExp(this.item());
    }
  };

  var _Game_Actor_setup = Game_Actor.prototype.setup;
  Game_Actor.prototype.setup = function(actorId) {
    _Game_Actor_setup.call(this, actorId);
    this.clearElementParams();
  };

  // TODO: Add Damage by Element Value
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
    var xp = (item.meta.xp !== undefined) ? parseFloat(item.meta.elementxp) : 1;
    if(elementId > 0) {
      this.gainElementExp(elementId, xp);
    }
  };

  Game_Actor.prototype.levelUpElement = function(elementId) {
    var xp = this.getNeededElementXPForNextLevel(elementId);
    this.gainElementExp(elementId, xp);
  };

  Game_Actor.prototype.getElementName = function(elementId) {
    return $dataSystem.elements[elementId];
  };

  Game_Actor.prototype.gainElementExp = function(elementId, xp) {
    if(elementId < 1) return false;
    this._elementParams[elementId] += xp;
     var lastSkills = this.skills();
     if(this.shouldDisplayLevelUp() && this.calculateElementLevel(elementId)) {
       this.displayElementLevelUp(elementId,this.findNewSkills(lastSkills));
     }
  };

  Game_Actor.prototype.displayElementLevelUp = function(elementId, newSkills) {
    var elementText = "%1 Level for Element %2 is now on %3 ";
    var text = elementText.format(this._name, this.getElementName(elementId), this.getElementLevel(elementId));
    $gameMessage.newPage();
    $gameMessage.add(text);
    newSkills.forEach(function(skill) {
      $gameMessage.add(TextManager.obtainSkill.format(skill.name));
    });
  };



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
    var elementSkills = this.getSkillsToLearn(elementId);
    for(var i=0; i < elementSkills.length; i++) {
      var elementSkill = elementSkills[i];
      if(this.canLearnElementSkill(elementSkill)) {
        this.learnSkill(elementSkill.skillId);
      }
    }
  };

  Game_Actor.prototype.canLearnElementSkill = function(skill) {
    var elementId = skill.element;
    var charElementLevel = this.getElementLevel(elementId);
    var neededElementLevel = skill.level;
    return charElementLevel >= neededElementLevel;
  };

  Game_Actor.prototype.getSkillObjects = function(elementId) {
    var skillObj = [];
    var skills = this.getSkillsToLearn(elementId);
    for(var i=0; i < skills.length; i++) {
      skillObj.push(skills[i].obj);
    }
    return skillObj;
  };

  Game_Actor.prototype.getSkillsToLearn = function(elementId) {
    var skills = [];
    var skillIds = this.currentClass().meta.elementSkill;
    skillIds = (skillIds instanceof Array) ? skillIds : [skillIds];
    for(var i=0; i < skillIds.length; i++) {
      var skill = skillIds[i].split(",");
      if(skill.length < 3) {
        continue;
      }

      skill = {
        "element" : skill[0],
        "level" : skill[1],
        "skillId" : skill[2],
        "obj" : $dataSkills[skill[2]]
      };
      if(elementId && skill.element == elementId) {
        skills.push(skill);
      } else {
        skills.push(skill);
      }



    }
    return skills;
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