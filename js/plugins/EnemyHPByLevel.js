/**
 * Created by Gilles on 01.05.2016.
 */
/*:
 * @plugindesc Added dem Gegner zusätzliche HP hinzu, je nachdem wie hoch dieser ist
 * @author Gilles Meyer (Gamedev-Tutorials)
 *
 * @param Actor Id
 * @desc Id des Hauptcharacters der massgeblich für den HP Anstieg ist
 * @default 1
 *
 * @param Factor
 * @desc Faktor um den die HP erhoeht werden soll. Die Standard Formel ist: HPEnemy = HPEnemy + (HPEnemy/100 * PlayerLevel * Factor);
 * @default 1.3
 */
if(typeof GDT == "undefined") {
  GDT = {};
}
(function() {

  var parameters = PluginManager.parameters('EnemyHPByLevel');
  var actorId = parseInt(parameters['Actor Id'] || 1);
  var factor = parseFloat(parameters['Factor'] || 1.3);

  Game_Troop.prototype.addStatsByLevel = function (level) {
    this.members().forEach(function (member) {
      member.mhp = Math.floor(member._hp + ((member._hp / 100) * level * factor));
      member.hp = Math.floor(member._hp + ((member._hp / 100) * level * factor));
      member._hp = Math.floor(member._hp + ((member._hp / 100) * level * factor));
      //return member;
    });
  };

  GDT.enemyhp = {};
  GDT.enemyhp.getOptions = function() {
    return {
      "actorId" : actorId,
      "factor" : factor
    };
  };
  GDT.enemyhp.getLevel = function() {
    var level = 0;
    $gameParty.members().forEach(function(member) {
      if(member.actorId() == actorId) {
        level = member.level;
        return false;
      }
    });
    return level;
  };

  var _BattleManager_startBattle = BattleManager.startBattle;
  BattleManager.startBattle = function() {
    this._phase = 'start';
    var level = GDT.enemyhp.getLevel();
    $gameTroop.addStatsByLevel(level);
    _BattleManager_startBattle.call(this);
  };

})();