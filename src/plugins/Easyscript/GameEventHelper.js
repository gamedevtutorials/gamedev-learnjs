/**
 * Created by Gilles on 07.05.2016.
 */

(function() {

  Game_Interpreter.prototype.getEvent = function() {
    return $gameMap.event(this.eventId());
  };

  Game_Event.prototype.data = function(key, value) {
    if(typeof value == "undefined") {
      return this.data && this.data[key];
    } else {
      if(!this.data) {
        this.data = {};
      }
      this.data[key] = value;
    }
  };

})();