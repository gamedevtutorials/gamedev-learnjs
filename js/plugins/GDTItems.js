/**
 * Created by Gilles on 22.05.2016.
 */
//-----------------------------------------------------------------------------
// Game_Item
//
// The game object class for handling skills, items, weapons, and armor. It is
// required because save data should not include the database object itself.
(function(){

  var _Game_Item_initialize = Game_Item.prototype.initialize;
  Game_Item.prototype.initialize = function(item) {
    _Game_Item_initialize.call(this,item);
    this._uniqueItem = this.createEmptyItem();
  };

  Game_Item.prototype.createEmptyItem = function() {
    return {
      "atypeId" : null,
      "description" : null,
      "etypeId" : null,
      "iconIndex" : null,
      "name" : null,
      "price" : null,
      "params" : [0,0,0,0,0,0,0,0,0]
    };
  };


  Game_Item.prototype.object = function() {
    if (this.isSkill()) {
      return $dataSkills[this._itemId];
    } else if (this.isItem()) {
      return $dataItems[this._itemId];
    } else if (this.isWeapon()) {
      return $dataWeapons[this._itemId];
    } else if (this.isArmor()) {
      return this.mergeWithUniqueStats($dataArmors[this._itemId]);
      //return $dataArmors[this._itemId];
    } else {
      return null;
    }
  };

  Game_Item.prototype.mergeWithUniqueStats = function(item) {
    if(item == null) return null;
    var realItem = {};
    for(var key in item) {
      if(key == "params") {
        if(typeof this._uniqueItem[key] == "object") {
          realItem[key] = this.sumParams(item[key], this._uniqueItem[key]);
        } else {
          realItem[key] = item[key];
        }
        continue;
      }

      var uniqueStat = (this._uniqueItem[key]);
      var useUnique = (typeof uniqueStat !== "undefined" && uniqueStat != null);
      realItem[key] = (useUnique) ? this._uniqueItem[key] : item[key];
    }

    return realItem;
  };

  Game_Item.prototype.sumParams = function(params1, params2) {
    var newParams = [];
    for(var i=0; i < params1.length; i++) {
      newParams.push(params1[i] + ((typeof params2[i] === "number") ? params2[i] : 0));
    }
    return newParams;
  };

})();




