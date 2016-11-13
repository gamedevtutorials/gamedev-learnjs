/*:
 * @plugindesc Gains Extra Stats after battle (hp, or mp or even revive) v1.3
 * @author Gilles Meyer
 *
 * @version 1.3
 *
 *
 * @param healHP
 * @desc Should the hp be healed? 1:yes 0:no
 * @default 0
 *
 * @param useMaxHp
 * @desc Use Max Hp for regain HP? Else current hp will be used 1:yes 0:no
 * @default 1
 *
 * @param percentageHp
 * @desc How many percent should be healed
 * @default 10
 *
 * @param healDead
 * @desc Heal also dead people
 * @default 0
 *
 * @param giveDeadOnlyXHp
 * @desc If healDead is on and this option is on the player will only get X hp back
 * @default 0
 *
 * @param healMP
 * @desc Should the mp be healed? 1:yes 0:no
 * @default 0
 *
 * @param useMaxMp
 * @desc Use Max Mp for regain MP? Else current mp will be used 1:yes 0:no
 * @default 1
 *
 * @param percentageMp
 * @desc How many percent should be healed
 * @default 10
 *
 * @param conditionalSwitchRegain
 * @desc Should there be a condition for the used regains (via Switch)
 * @default 0
 *
 * @param conditionalSwitchRegainSwitches
 * @desc (needs conditionalRegain to be active) Needs comma seperated format "actorId:switchId".
 * Each value is for one character and one switch. Read help for more details.
 * @default 1:150,2:151,3:152,4:153
 *
 * @param conditionalEquipRegain
 * @desc Should Regain with Equipment?
 * @default 0
 *
 * @param standardRegain
 * @desc Should Regain be standard be on on for all classes and actors? 1:yes 0:no
 * @default 0
 *
 * @help
 * #############################
 * ConditionalEquipRegain
 * #############################
 * If you want to use the conditionalEquipRegain you need to use the following Notes in your Equip:
 *
 * <ENC:healHp:10>    <-- This would heal 10% of your hp
 * <ENC:healMp:10>    <-- This would heal 10% of your mp
 *
 * If you have more than 1 equip that heals hp, the percentage will sum up. Example:
 *
 *  Hat
 *  <ENC:healHp:10>
 *
 *  Armor
 *  <ENC:healHp:10>
 *
 *  This Equip would heal 20% of the actors hp
 *
 * #############################
 * ConditionalSwitchRegainSwitches
 * #############################
 *
 * conditionalSwitchRegainSwitches:
 * If an actor will be healed depends if his/her switch is turned on. Each character gets a switch.
 * You need a comma seperated list in following style:
 *
 * 1:105,2:106,3:107
 *
 * The first 3 actors could get healing (the 4 is not listed, so no healing)
 * Actor with the id 1 will get a healing if switch 105 is set to true
 * Actor with the id 2 will get a healing if switch 106 is set to true
 * Actor with the id 3 will get a healing if switch 107 is set to true
 *
 * #############################
 * Actor/Class Regain Condition
 * #############################
 *
 *  If the option standardRegain is set to 0 you will need you tags on your character or classes.
 *  You can use the <ENC:regain:1> to activate the regain modus for this class/character.
 *  If you have standardRegain on 1 you can use the tag <ENC:noRegain:1> for deactive
 *  the options for this class/character
 *
 * ##########################
 * Credits
 * ##########################
 * Hope you like this plugin.
 * Best regards
 * Gilles
 *
 * If you need further help visit http://forums.rpgmakerweb.com/index.php?/topic/48977-heal-some-hp-after-each-battle-plugin
 * or write me on rpgmaker@encarnium.com
 *
 */
if(typeof ENC == "undefined") ENC = {};
if(typeof ENC.core == "undefined") ENC.core = {};
if(typeof ENC.params == "undefined") ENC.params = {};

ENC.afterBattleStatus = {};
ENC.afterBattleStatus.version = "1.2";


ENC.core.parseNote = function(note, tag, parseElement) {
  var searchString = "<ENC:"+tag+":";
  var start = note.indexOf(searchString);
  if(start < 0) return false; // Nothing found
  var subString = note.substr(start+searchString.length);
  end = subString.indexOf(">");
  if(end < 0) {
    console.error("Config for following object was not correct", parseElement, note, tag);
    return false;
  }

  return subString.substr(0,end).trim();
};


ENC.afterBattleStatus.conditionalRegain = function(actor, regain) {
  if(!regain) return true;
  var switchForActor = ENC.afterBattleStatus.getSwitchForActor(actor);
  if(switchForActor === false) return false;
  return $gameSwitches.value(switchForActor);
};

ENC.afterBattleStatus.getSwitchForActor = function(actor) {
  var actorId = actor.actorId();

  var splittedSwitches = ENC.params.conditionalSwitchRegainSwitches.split(",");
  for(var i=0; i < splittedSwitches.length; i++) {
    var splittedSwitch = splittedSwitches[i].split(":");
    if(splittedSwitch.length != 2) {
      console.error("ENC Plugin Error: Wrong conditionalSwitchRegainSwitches format: ",splittedSwitch, ENC.params.conditionalSwitchRegainSwitches );
      return false;
    }
    if(actorId == splittedSwitch[0]) return splittedSwitch[1];
  }
  return false;
};

ENC.afterBattleStatus.healWithEquip = function(tag, actor) {
  var heal = 0;

  function progressHeal(equip) {
    if(equip == null) return false;
    var note = equip.note;
    var value = ENC.core.parseNote(note, tag, equip);
    if(value !== false) {
      heal += parseInt(value,10);
    }
  }

  actor.equips().forEach(function(equip) {
    progressHeal(equip);
  });
  actor.weapons().forEach(function(equip) {
    progressHeal(equip);
  });
  return heal;
};


(function() {


  var parameters = PluginManager.parameters('GainExtrasAfterBattle');

  var healHP = Number(parameters['healHP'] || 0);
  var useMaxHp = Number(parameters['useMaxHp'] || 1);
  var percentageHp = Number(parameters['percentageHp'] || 10);

  var healDead = Number(parameters['healDead'] || 0);
  var giveDeadOnlyXHp = Number(parameters['giveDeadOnlyXHp'] || 0);

  var healMP = Number(parameters['healMP'] || 0);
  var useMaxMp = Number(parameters['useMaxMp'] || 1);
  var percentageMp = Number(parameters['percentageMp'] || 10);

  var conditionalSwitchRegain = Number(parameters['conditionalSwitchRegain'] || 0);
  ENC.params.conditionalSwitchRegainSwitches = String(parameters['conditionalSwitchRegainSwitches'] || "1:105,2:106,3:107,4:108");
  var conditionalEquipRegain = Number(parameters['conditionalEquipRegain'] || 0);

  var standardRegain = !!(Number(parameters['standardRegain'] || 0));


  Game_Battler.prototype.gainExtraStatus = function() {
    if(!ENC.afterBattleStatus.conditionalRegain(this, conditionalSwitchRegain)) return false;

    if(healHP) {
       this.gainExtraHP.call(this);
     }
     if(healMP) {
       this.gainExtraMP.call(this);
     }
  };

  Game_Battler.prototype.gainExtraHP = function() {
    if(!this.isDead() || this.isDead() && healDead ) {
      var regainHP = this.mhp;
      if(useMaxHp < 1) {
        regainHP = this.hp;
      }

      var onePercent = regainHP/100;

      if(healDead && giveDeadOnlyXHp && this.isDead()) {
        this.gainHp(giveDeadOnlyXHp);
      } else {
        var healValue = onePercent * percentageHp;

        if(conditionalEquipRegain) {
          healValue = onePercent * ENC.afterBattleStatus.healWithEquip("healHP", this);
        }

        this.gainHp(healValue);
      }

      //this.battler().update();
    }
  };

  Game_Battler.prototype.gainExtraMP = function() {
    if(!this.isDead()) {
      var regainMP = this.mmp;
      if(useMaxMp < 1) {
        regainMP = this.mp;
      }

      var onePercent = regainMP/100;
      var healValue = onePercent * percentageMp;

      if(conditionalEquipRegain) {
        healValue = onePercent * ENC.afterBattleStatus.healWithEquip("healMP", this);
      }

      this.gainMp(healValue);
      //this.battler().update();
    }
  };

  Game_Party.prototype.gainExtraStatus = function() {
    this.members().forEach(function(actor) {
      if(actor.isRegainAllowedForActor()) {
          actor.gainExtraStatus();
      }
    });
  };

  Game_Battler.prototype.isRegainAllowedForClass = function() {
    var classId = this._classId;
    var note = $dataClasses[classId].note;
    var regain = ENC.core.parseNote(note,"regain",$dataClasses[classId]);
    var noRegain = ENC.core.parseNote(note,"noRegain",$dataClasses[classId]);

    if(standardRegain && noRegain == 1) return false;
    if(!standardRegain && regain == 1) return true;
    return standardRegain;
  };



  Game_Battler.prototype.isRegainAllowedForActor= function() {

    var note = this.actor().note;
    var regain = ENC.core.parseNote(note,"regain",this.actor());
    var noRegain = ENC.core.parseNote(note,"noRegain",this.actor());

    if(standardRegain && noRegain == 1 || this.isRegainAllowedForClass() && noRegain == 1 || standardRegain && !this.isRegainAllowedForClass()) return false;
    if(!standardRegain && regain == 1 || !this.isRegainAllowedForClass() && regain == 1 || !standardRegain && this.isRegainAllowedForClass()) return true;
    return standardRegain;
  };

  var _BattleManager_processVictory = BattleManager.processVictory;

  BattleManager.processVictory = function() {
    $gameParty.gainExtraStatus();
    _BattleManager_processVictory.apply(this,arguments);
  };


})();