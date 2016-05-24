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