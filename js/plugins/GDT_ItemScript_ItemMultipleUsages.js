/*:
 * @plugindesc v0.6 Allows Multiple Usage of an item
 * @author Gilles Meyer <admin@gamedev-tutorials.com>
 *
 * @help
 * Example call:
 * <callscript:GDT.multiItemUseage(5,15)> <-- Usage in ItemMenu
 * <callscriptUse:GDT.multiItemUseageUse(5,15)> <-- Usage for $gameParty.consumeItem
 *
 */
if(typeof GDT == "undefined" || typeof GDT.ItemScripts == "undefined") {
  throw "ItemScript_ItemMultipleUsages needs ItemScripts Plugin to work";
}

GDT._itemusages = {};
GDT.multiItemUseage = function(target, item, numuse, replaceId) {
  GDT.usemultiItem(target, item, numuse, replaceId);
};

GDT.multiItemUseageUse = function(item, numuse, replaceId) {
  GDT.usemultiItem(null, item, numuse, replaceId);
};

GDT.usemultiItem = function(target, item, numuse, replaceId) {
  if(typeof numuse != "number") {
    return false;
  }

  if(typeof GDT._itemusages[item.id] == "undefined") {
    GDT._itemusages[item.id] = 1;
  } else {
    GDT._itemusages[item.id] += 1;
  }

  if(GDT._itemusages[item.id] >= numuse) {
    GDT._itemusages[item.id] = 0;
    if(replaceId) {
      var replaceItem = $dataItems[replaceId];
      $gameParty.gainItem(replaceItem, 1);

    }
  } else {
    $gameParty.gainItem(item, 1);
  }
};

