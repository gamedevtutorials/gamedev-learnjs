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