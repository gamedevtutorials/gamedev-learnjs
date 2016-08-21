/**
 * Created by Gilles on 20.08.2016.
 */
(function() {

  var Game_Actor_levelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
  Game_Actor_levelUp.call(this);
  saveRealName(this);

  var actorNote = $dataActors[this.actorId()].note;
  var levelnickname = GDT.Util.LunaticTags(actorNote,"levelnickname");

  if(levelnickname && levelnickname instanceof Array) {
    var nickname = "";
    for(var i=0; i < levelnickname; i++) {
      var nickscript = levelnickname[i];
      var levelnickFunction = Function("level","currentnickname",nickscript);
      nickname = levelnickFunction(this._level, nickname)||"";
    }
    this._name = nickname+this._realName;
  } else if(levelnickname) {
    var levelnickFunction = Function("level",levelnickname);
    var nickname = levelnickFunction(this._level)||"";
    this._name = nickname+this._realName;
  }
};

var saveRealName = function(actor) {
  if(!actor._realName) {
    actor._realName = actor._name;
  }
};

})();