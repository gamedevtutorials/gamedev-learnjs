/*:
 * @plugindesc v1.4 - Gives your Partymembers the possibility to level their elemental levels.
 * You can use notetags to learn skills when an element is leveled up
 * @author Gilles Meyer <admin[at]gamedev-tutorials.com>
 *
 * @param - General -
 *
 * @param Level Up Text
 * @desc The Text which is shown when a player levels up an element
 * @default %1s Level for Element %2 is now on %3
 *
 * @param Level Curve
 * @desc The XP needed for each level
 * @default 15,40,85,120,160,200,250,300,350,400,500,600,690,830,1000
 *
 * @param Extra Damage Curve
 * @desc The extra damage the skills do each element level
 * @default 0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150
 *
 * @param Element Exp Outside Of Battle
 * @desc Should the Player get Elemental Exp when outside of a battle (example: Heal Skill)
 * @default 0
 *
 * @param - Status Window (Yanfly Status)-
 *
 * @param Status Menu Text
 * @desc Name of the Sub-Status Menu inside the Status Menu
 * @default Elements Level
 *
 * @param Element Level Column 1
 * @desc Ids of the Elements in the first Column
 * @default 2 3 4 5 6 7 8 9
 *
 * @param Element Level Column 2
 * @desc Ids of the Elements in the second Column
 *
 * @param Show Icons
 * @desc Show Icons for Elements
 * @default 1
 *
 * @param Icon List
 * @desc Icon Ids for each Element (0 for no icon)
 * @default 77,64,65,66,67,68,69,70,71,72,73
 *
 * @help
 * Note  Tags for Skills:
 * <elementxp:*ANY_NUMBER*>  #Replace *ANY_NUMBER* with an element xp count the player should get for using this skill
 *
 * Class:
 * <elementSkill:*ELEMENT_ID(S)*,*ELEMENT_LEVEL(S)*,*SKILL_TO_LEARN*>
 *   # ELEMENT_ID: The Id(s) of the Element which needs a specific level (id can be found in Database -> Types) (Levels are seperated by ;)
 *   # ELEMENT_LEVEL: Which level has/have the element(s) to be, that the skill will be learned (levels are sperated by ;)
 *   # SKILL_TO_LEARN: Id of the skill which will be learned (id can be found in Database->Skills)
 *
 *
 */

(function() {

  var parameters = PluginManager.parameters('GDT_ElementsLeveling');
  var LEVEL_UP_TEXT = String(parameters['Level Up Text'] || "%1s Level for Element %2 is now on %3");
  var EXP_OUTSIDE_BATTLE = !!parameters['Element Exp Outside Of Battle'];
  var LEVEL_CURVE = String(parameters['Level Curve'] || "15,40,85,120,160,200,250,300,350,400,500,600,690,830,1000").split(",");
  var DAMAGE_CURVE = String(parameters['Extra Damage Curve'] || "0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150").split(",");


  // LEVEL_CURVE NEEDS NUMBERS
  for(var i=0; i  < LEVEL_CURVE.length; i++) {
    LEVEL_CURVE[i] = parseInt(LEVEL_CURVE[i].trim());
  }

  for(var i=0; i  < DAMAGE_CURVE.length; i++) {
    DAMAGE_CURVE[i] = parseInt(DAMAGE_CURVE[i].trim());
  }


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

  Game_Actor.prototype.updateElementExp = function() {
    var elements = $dataSystem.elements;
    for(var i=1; i < elements.length; i++) {
      this.gainElementExp(i, 0);
    }
  };


  BattleManager.gainRewards = function() {
    this.gainExp();
    this.gainElementExp();
    this.gainGold();
    this.gainDropItems();
  };

  BattleManager.gainElementExp = function() {
    $gameParty.allMembers().forEach(function(actor) {
      actor.updateElementExp();
    });
  };




  var _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
  Game_Action.prototype.makeDamageValue = function(target, critical) {
    var value = _Game_Action_makeDamageValue.call(this,target,critical);
    var subject = this.subject();
    if(subject.getElementLevel && this.item().damage.elementId > 0) {
      var elementId = this.item().damage.elementId;
      var elemLevel = subject.getElementLevel(elementId);

      var multiplyFactor = (100 + subject.getElementDamageExtraDamage(elemLevel, elementId)) / 100;
      value *= multiplyFactor;
    }

    return value;
  };




  Game_Actor.prototype.clearElementParams = function() {
    this._elementParams = [];
    this._elementLevel = [];
    for(var i=0; i < $dataSystem.elements.length; i++) {
      this._elementParams[i] = 0;
      this._elementLevel[i] = 0;
    }
  };

    Game_Actor.prototype.calcElementExp = function(item, forceExp) {
    var elementId = item.damage.elementId;
    var xp = (item.meta.elementxp !== undefined) ? parseFloat(item.meta.elementxp) : 1;
    if(elementId > 0) {
      if($gameParty.inBattle()){
        this.addElementExp(elementId, xp);
      } else {
        if(EXP_OUTSIDE_BATTLE || forceExp) {
          this.gainElementExp(elementId, xp);
        }
      }

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
     if(this.shouldDisplayLevelUp() && this.calculateElementLevel(elementId, true)) {
       this.displayElementLevelUp(elementId,this.findNewSkills(lastSkills));
     }
  };

  Game_Actor.prototype.addElementExp = function(elementId, xp) {
    if(elementId < 1) return false;
    this._elementParams[elementId] += xp;
  };

  Game_Actor.prototype.displayElementLevelUp = function(elementId, newSkills) {
    var text = LEVEL_UP_TEXT.format(this._name, this.getElementName(elementId), this.getElementLevel(elementId));
    $gameMessage.newPage();
    $gameMessage.add(text);
    newSkills.forEach(function(skill) {
      $gameMessage.add(TextManager.obtainSkill.format(skill.name));
    });
  };



  Game_Actor.prototype.getNeededElementXPForNextLevel = function(elementId) {
    this.calculateElementLevel(elementId);

    var curve = this.getElementLevelCurve(elementId);
    var level = this.getElementLevel(elementId);
    var currentXp = this.getElementExp(elementId);

    var expForNextLevel = parseInt(curve[level]);

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
    return this.hasNeededElementSkillLevel(skill.element, skill.level);
  };

  Game_Actor.prototype.hasNeededElementSkillLevel = function(element,level) {
    var levels = (""+level).split(";");
    var elements = (""+element).split(";");
    for (var i = 0; i < elements.length; i++) {
      var elem = parseInt(elements[i].trim());
      var level = (levels.length > 1) ? parseInt(levels[i].trim()) : parseInt(levels[0].trim());
      var charElementLevel = this.getElementLevel(elem);
      if(charElementLevel < level) return false;
    }
    return true;
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
      var skillString = skillIds[i];
      if(typeof skillString != "string") {
        continue;
      }
      var skill = skillString.split(",");
      if(skill.length < 3) {
        continue;
      }

      skill = {
        "element" : skill[0].trim(),
        "level" : skill[1].trim(),
        "skillId" : skill[2].trim(),
        "obj" : $dataSkills[skill[2].trim()]
      };
      if(elementId && this.hasSkillElement(skill,elementId)) {
        skills.push(skill);
      } else if(typeof elementId == "undefined") {
        skills.push(skill);
      }



    }
    return skills;
  };

  Game_Actor.prototype.hasSkillElement = function(skill, element) {
    var elements = (""+element).split(";");
    for (var i = 0; i < elements.length; i++) {
      var elem = parseInt(elements[i].trim());
      if(elem == element) return true;
    }
    return false;
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
    return LEVEL_CURVE;
  };

  Game_Actor.prototype.getElementDamageExtraDamage = function(elementLevel, elementId) {
    var table = DAMAGE_CURVE;
    return parseFloat(table[elementLevel]);
  };

})();
/**
 * Created by Gilles on 05.07.2016.
 */
(function() {

  if(typeof GDT == "undefined") {
    GDT = {};
  }
  if(typeof GDT.Param == "undefined") {
    GDT.Param = {};
  }

  var parameters = PluginManager.parameters('GDT_ElementsLeveling');
  GDT.Param.StatusElementsLevel = String(parameters['Status Menu Text'] || "Elements Level");
  GDT.Param.StatusEleLCol1 = String(parameters['Element Level Column 1']);
  GDT.Param.StatusEleLCol1 = GDT.Param.StatusEleLCol1.split(' ');
  GDT.Param.StatusEleLCol2 = String(parameters['Element Level Column 2']);
  GDT.Param.StatusEleLCol2 = GDT.Param.StatusEleLCol2.split(' ');
  GDT.Param.ShowIcons = (parameters['Show Icons'] == "1");
  GDT.Param.IconList = String(parameters['Icon List']);
  GDT.Param.IconList = GDT.Param.IconList.split(",");


  if (typeof Window_StatusCommand != "undefined") {

    var _Window_StatusCommand_createCommand = Window_StatusCommand.prototype.createCommand;
    Window_StatusCommand.prototype.createCommand = function (command) {
      _Window_StatusCommand_createCommand.call(this, command);
      command = command.toUpperCase();
      if (['ELEMENTLEVEL', 'ELEMENTSLEVEL'].contains(command)) {
        var text = GDT.Param.StatusElementsLevel;
        this.addCommand(text, 'elementslevel', true);
      }
    };



    var _Window_StatusInfo_drawInfoContents = Window_StatusInfo.prototype.drawInfoContents;
    Window_StatusInfo.prototype.drawInfoContents = function(symbol) {
      this.resetFontSettings();
      if (!symbol) return;
      switch (symbol.toLowerCase()) {
        case 'elementslevel':
          this.drawElementsLevel();
          return;
          break;
      }
      _Window_StatusInfo_drawInfoContents.call(this, symbol);
    };


    Window_StatusInfo.prototype.drawElementsLevel = function() {
      this.drawElementLevelColumnRects();
      this.drawElementLevelInfo();
    };


    Window_StatusInfo.prototype.drawElementLevelColumnRects = function() {
      var maxCols = this.getMaxArrayCols(this.elementLevelArray());
      var maxRows = this.getMaxArrayRows(this.elementLevelArray());
      if (maxCols <= 0) return;
      var dx = this.getArrayX();
      var dy = this.getArrayY();
      var dw = this.getArrayDW(maxCols);
      if(GDT.Param.ShowIcons) {
        dw += Window_Base._iconWidth;
        dx -= Window_Base._iconWidth;
      }
      for (var i = 0; i < maxCols; ++i) {
        for (var j = 0; j < maxRows; ++j) {
          this.drawDarkRect(dx, dy, dw, this.lineHeight());
          dy += this.lineHeight();
        }
        dx += dw;
        dx += (maxCols > 1) ? this.standardPadding() : 0;
        dy = 0;
      }
    };


    Window_StatusInfo.prototype.elementLevelArray = function() {
      var array = [
        GDT.Param.StatusEleLCol1,
        GDT.Param.StatusEleLCol2
      ];
      return array;
    };


    Window_StatusInfo.prototype.drawElementLevelInfo = function() {
      var maxCols = this.getMaxArrayCols(this.elementLevelArray());
      var maxRows = this.getMaxArrayRows(this.elementLevelArray());
      if (maxCols <= 0) return;
      var infoArray = this.elementLevelArray();
      var dx = this.getArrayX();
      var dy = this.getArrayY();
      var dw = this.getArrayDW(maxCols);
      if(GDT.Param.ShowIcons) {
        dw += Window_Base._iconWidth;
        dx -= Window_Base._iconWidth;
      }

      for (var i = 0; i < maxCols; ++i) {
        for (var j = 0; j < infoArray[i].length; ++j) {
          var eleId = infoArray[i][j];
          this.drawElementLevelData(eleId, dx, dy, dw)
          dy += this.lineHeight();
        }
        dx += dw;
        dx += (maxCols > 1) ? this.standardPadding() : 0;
        dy = 0;
      }
    };


    Window_StatusInfo.prototype.drawElementLevelData = function(eleId, dx, dy, dw) {
      eleId = parseInt(eleId);
      var actor = $gameParty.members()[this._actor.index()];
      var currentElemXP = actor.getElementExp(eleId);
      var currentElemLevel = actor.getElementLevel(eleId);
      var nextLevelXP = actor.getElementLevelCurve(eleId)[currentElemLevel];
      var nextLevelText;
      if(typeof nextLevelXP == "number") {
        nextLevelText = currentElemXP+"/"+nextLevelXP;
      } else {
        nextLevelText = "MAX";
      }
      dx += this.textPadding();

      var extraPadding = (GDT.Param.ShowIcons) ? Window_Base._iconWidth : 0;

      if(GDT.Param.ShowIcons) {
        var iconNr = parseInt(GDT.Param.IconList[eleId-1]);
        if(!isNaN(iconNr)) {
          this.drawIcon(iconNr, dx, dy);
        }
      }





      var eleName = $dataSystem.elements[eleId];
      dx += this.textPadding() + extraPadding;
      dw -= this.textPadding() * 2;
      this._bypassResetTextColor = true;
      this.changeTextColor(this.systemColor());
      this.drawTextEx(eleName+ " Lv."+currentElemLevel, dx, dy);

      this._bypassResetTextColor = false;
      this.changeTextColor("#FFFFFF");

      dw -= this.textPadding();
      this.drawText(nextLevelText, dx-extraPadding, dy, dw, 'right');
    };

  }

})();