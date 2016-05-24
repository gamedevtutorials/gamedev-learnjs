/**
 * Created by Gilles on 22.05.2016.
 */
(function() {
  Game_Party.prototype.weapons = function() {
    var list = [];
    for (var id in this._weapons) {
      if(this._weapons[id] instanceof Array) {
        var weapons = this._weapons[id];
        for(var i=0; i < weapons.length; i++) {
          list.push(weapons[i]);
        }
      } else {
        list.push(new Game_Item($dataWeapons[id]));
      }
    }
    return list;
  };



  Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
    var container = this.itemContainer(item);
    var tempItem = new Game_Item(item);
    if (container) {
      if(tempItem.isStackable()) {
        var lastNumber = this.numItems(item);
        var newNumber = lastNumber + amount;
        container[item.id] = newNumber.clamp(0, this.maxItems(item));
      } else {
        if(!(container[item.id] instanceof Array)) {
          container[item.id] = [];
        }
        container[item.id].push(new Game_Item(item));
      }
      if (container[item.id] === 0) {
        delete container[item.id];
      }
      if (includeEquip && newNumber < 0) {
        this.discardMembersEquip(item, -newNumber);
      }
      $gameMap.requestRefresh();
    }
  };


  Game_Party.prototype.numItems = function(item) {
    var container = this.itemContainer(item);
    return container ? (container[item.id] instanceof Array) ? 1 : container[item.id]  || 0 : 0;
  };


  /*
  Game_Actor.prototype.changeEquip = function(slotId, item) {
    if (this.tradeItemWithParty(item, this.equips()[slotId]) &&
      (!item || this.equipSlots()[slotId] === item.etypeId)) {
      this._equips[slotId].setObject(item);
      this.refresh();
    }
  };


 Game_Actor.prototype.traitObjects = function() {
    console.log("call traitObjects");
    var objects = Game_Battler.prototype.traitObjects.call(this);
    objects = objects.concat([this.actor(), this.currentClass()]);
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
      var item = equips[i];
      if(item instanceof Game_Item) {
        continue;
        item = item.realObject();
      }
      if (item) {
        objects.push(item);
      }
    }
    return objects;
  };*/



 /* Game_Actor.prototype.forceChangeEquip = function(slotId, item) {
    this._equips[slotId].setObject(item);
    this.releaseUnequippableItems(true);
    this.refresh();
  };

  Game_Actor.prototype.tradeItemWithParty = function(newItem, oldItem) {
    if (newItem && !$gameParty.hasItem(newItem)) {
      return false;
    } else {
      $gameParty.gainItem(oldItem, 1);
      $gameParty.loseItem(newItem, 1);
      return true;
    }
  };*/


  Game_Actor.prototype.equips = function() {
    return this._equips.map(function(item) {
      return item;
    });
  };

  Game_Actor.prototype.weapons = function() {
    return this.equips().filter(function(item) {
      return item && DataManager.isWeapon(item.realObject());
    });
  };

  Game_Actor.prototype.armors = function() {
    return this.equips().filter(function(item) {
      return item && DataManager.isArmor(item.realObject());
    });
  };

})();
/**
 * Created by Gilles on 22.05.2016.
 */
(function(){

  Window_EquipItem.prototype.includes = function(itemObj) {

    if (itemObj === null) {
      return true;
    }
    var item = itemObj.object();
    if (this._slotId < 0 || item.etypeId !== this._actor.equipSlots()[this._slotId]) {
      return false;
    }
    return this._actor.canEquip(item);
  };


  Window_ItemList.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item && (item.realObject ? item.realObject() : item)) {
      item = (item.realObject) ? item : new Game_Item(item);
      var numberWidth = this.numberWidth();
      var rect = this.itemRect(index);
      rect.width -= this.textPadding();
      this.changePaintOpacity(this.isEnabled(item.object()));
      this.drawItemName(item.realObject(), rect.x, rect.y, rect.width - numberWidth);
      if(item.isStackable()) {
        this.drawItemNumber(item.object(), rect.x, rect.y, rect.width);
      }
      this.changePaintOpacity(1);
    }
  };

})();
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




