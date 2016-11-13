/**
 * Created by Gilles on 13.11.2016.
 */
GDT._itemusages = {};
GDT.multiItemUseage = function(target, item, numuse) {
  console.log(arguments, this);
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
  } else {
    $gameParty.gainItem(item, 1);
  }

};