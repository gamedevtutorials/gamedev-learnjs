/*:
 * @plugindesc v0.9 Allows Scripts to call on Item Use
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
 *   Example1: Standard Call
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
 *  Example2: Standard Call
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
 *  I added some Example Scripts in this file. Just search for "Example Scripts"
 *
 */

if(typeof GDT == "undefined") {
  GDT = {};
}
GDT.ItemScripts = {};
(function() {


  var parameters = PluginManager.parameters('ItemScripts');
  var callScriptTag = String(parameters['noteTag'] || 'callscript');

  var _Scene_ItemBase_applyItem = Scene_ItemBase.prototype.applyItem;
  Scene_ItemBase.prototype.applyItem = function() {
    _Scene_ItemBase_applyItem.call(this);
    try {
      var CS = this.item().meta[callScriptTag];
      var func = GDT.ItemScripts.extractFunctionName(CS);
      var staticArgs = GDT.ItemScripts.extractStaticParameters(CS);
      if(staticArgs) {
        func += "(this.itemTargetActors(),this.item(),"+staticArgs+")";
      } else {
        func += "(this.itemTargetActors(),this.item())";
      }

      eval(func);
    }catch(e) { console.log("Something went wrong: "+e);}
  };


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