/**
 * Created by Gilles on 20.08.2016.
 */
(function() {

  /*
  Example for LunaticTags Parser.
  It returns Awesome as Nickname if the actors level is higher than 6
  Put this code in one of your actors notetag and let him/her level up until he/she is level 7:

  <levelnickname>
    return (level > 6) ? "Awesome " : "";
  </levelnickname>

   */
  var Game_Actor_levelUp = Game_Actor.prototype.levelUp;
  Game_Actor.prototype.levelUp = function() {
    Game_Actor_levelUp.call(this);
    saveRealName(this);

    // You need the note of any object (actor, skill, class etc.)
    var actorNote = $dataActors[this.actorId()].note;

    // Use GDT.Util.LunaticTags with the note and the tag you want to parse
    var levelnickname = GDT.Util.LunaticTags(actorNote,"levelnickname");

    GDT.Util.useTag(levelnickname,function(levelnick) {
      // If the inside of your tag is a function you need to create a function
      var levelnickFunction = Function("level",levelnick);

      // Then call the created function
      var nickname = levelnickFunction(this._level)||"";
      this._name = nickname+this._realName;
    });
  };

  var saveRealName = function(actor) {
    if(!actor._realName) {
      actor._realName = actor._name;
    }
  };

})();