/*:
@plugindesc Allows to show Item Information in the Message Windows
@author Gilles Meyer

@help In MessageWindow:  \Item[itemId, itemproperty]
 Example: \Item[1,price]  or \Item[1,name]
 You can show Icons too: \I[\Item[1, iconIndex]

 Properties ($dataItems[1] in console):
 "id", "animationId", "consumable", "damage",
 "description", "effects", "hitType", "iconIndex",
 "itypeId", "name", "note", "occasion", "price",
 "repeats", "scope", "speed", "successRate", "tpGain", "meta"

 */

(function() {

  var _Window_Base_convertEscapeCharacters  = Window_Base.prototype.convertEscapeCharacters;
  Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = _Window_Base_convertEscapeCharacters.call(this, text);
    text = text.replace(/\x1bItem\[(\d+),(\w+)\]/gi, function() {
      try {
        var item = $dataItems[arguments[1]];
        return item[arguments[2]];
      } catch(e) {
        return "";
      }
    }.bind(this));
    return text;
  };
})();