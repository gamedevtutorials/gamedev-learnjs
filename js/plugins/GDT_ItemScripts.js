/*:
 * @plugindesc v1.0 Allows Scripts to call on Item Use
 * @author Gilles Meyer <admin@gamedev-tutorials.com>
 *
 * @param noteTag
 * @desc Name of the note tag to use scripts
 * @default callscript
 *
 *
 * @help
 * You can call scripts after using an item.
 * The only thing you have to do is simply put a notetag in the item.
 *
 * Examples:
 *
 *   Example1: Standard Call for Item Menu
 *   -------------------------
 *
 *   <callscript:myFunctionName>
 *
 *   This would call the function myFunctionName with parameters:
 *   - targets(array of group members)
 *   - item
 *
 *  -------------------------
 *
 *
 *  Example2: Standard Call For Item Menu
 *  -------------------------
 *
 *  <callscript:awesomeFunction(2,true)>
 *
 *
 *  This would call the function awesomeFunction with parameters:
 *   - targets(array of group members)
 *   - item
 *   - 2
 *   - true
 *  -------------------------
 *
 *  Example3: Standard Call for $gameParty.consumeItem
 *  -------------------------
 *
 *  <callscriptUse:awesomeFunction(2,true)>
 *
 *
 *  This would call the function awesomeFunction with parameters:
 *   - item
 *   - 2
 *   - true
 *  -------------------------
 *
 *  I added some Example Scripts in this file. Just search for "Example Scripts"
 *
 */

if(typeof GDT == "undefined") {
  GDT = {};
}
GDT.ItemScripts = {};
(function() {


  var parameters = PluginManager.parameters('GDT_ItemScripts');
  var callScriptTag = String(parameters['noteTag'] || 'callscript');

  var _Game_Party_consumeItem = Game_Party.prototype.consumeItem;
  Game_Party.prototype.consumeItem = function(item) {
    _Game_Party_consumeItem.call(this, item);
    GDT.ItemScripts.callScript(item);
  };


  var _Scene_ItemBase_applyItem = Scene_ItemBase.prototype.applyItem;
  Scene_ItemBase.prototype.applyItem = function() {
    _Scene_ItemBase_applyItem.call(this);
    GDT.ItemScripts.callScript(this.item(), this.itemTargetActors());
  };


  GDT.ItemScripts.callScript = function(item, actors) {
    try {
      var CSString = callScriptTag;
      if(!actors) {
        CSString += "Use";
      }
      var CS = item.meta[CSString];
      if(!CS) {
        return false;
      }

      var func = GDT.ItemScripts.extractFunctionName(CS);
      var staticArgs = GDT.ItemScripts.extractStaticParameters(CS);

      var actorsVar = (actors) ? "actors, " : "";

      if(staticArgs) {
        func += "("+actorsVar+"item,"+staticArgs+")";
      } else {
        func += "("+actorsVar+"item)";
      }

      eval(func);
    }catch(e) { console.log("Something went wrong: "+e);}
  }

  GDT.ItemScripts.extractStaticParameters = function(callScript) {
    var reg = new RegExp("(.*)\\((.*)\\)");
    reg = callScript.match(reg);
    if(reg == null || reg.length < 2) return null;

    return reg[2];
  };

  GDT.ItemScripts.extractFunctionName = function(callScript) {
    var reg = new RegExp("(.*)\\((.*)\\)");
    reg = callScript.match(reg);
    if(reg == null || reg.length < 1) return callScript;
    return reg[1];
  };

  var _Game_Action_hasItemAnyValidEffects = Game_Action.prototype.hasItemAnyValidEffects;
  Game_Action.prototype.hasItemAnyValidEffects = function(target) {
    return _Game_Action_hasItemAnyValidEffects.call(this,target) || !!this.item().meta[callScriptTag];
  };

})();


// Example Scripts
if(typeof GDT == "undefined") { GDT = {};}


GDT.changeClassToWarrior = function(targets, item) {
  if(!targets instanceof Array) return false;
  for(var i=0; i < targets.length; i++) {
    var target = targets[i];
    target.changeClass(2, true); // 2 is Warrior Class Id
  }
};

GDT.partyUp = function(targets, item) {
  if(!targets instanceof Array) return false;
  for(var i=0; i < targets.length; i++) {
    var target = targets[i];
    target.levelUp();
  }
  SceneManager.goto(Scene_Map);

  $gamePlayer.requestBalloon(1);
  $gameMap._interpreter.setWaitMode("balloon");

};

GDT.ohno = function(targets, item) {
  if(!targets instanceof Array) return false;
  for(var i=0; i < targets.length; i++) {
    var target = targets[i];
    target.revive();
    target.refresh();
  }
  SoundManager.playSystemSound(5);
};