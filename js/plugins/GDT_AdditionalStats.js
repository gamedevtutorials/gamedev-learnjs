/*:
 * @author Gilles <admin[at]gamedev-tutorials.com>
 *
 * @plugindesc v1.0 Adds additional stats for an actor when using the correct equipment
 *
 * @help
 *
 * <extrastats>
   {
   "for" : "class",
   "forid" : "1",
   "stats" : "10,0,0,0,0,1,0,0",
   "skills" : "13,12,5,10,16"
   }
   </extrastats>
 *
 */

(function() {
  if(!GDT.AdditionalPlugins) {
    GDT.AdditionalPlugins = {};
  }


  Game_Actor.prototype.paramPlus = function(paramId) {
    var value = Game_Battler.prototype.paramPlus.call(this, paramId);
    var equips = this.equips();
    for (var i = 0; i < equips.length; i++) {
      var item = equips[i];
      if (item) {
        var addition = item.params[paramId];

        try {
          var tag = JSON.parse(GDT.Util.LunaticTags(item.note, "extrastats"));
          if(tag) {
            // Ist das Item fuer den Character gedacht?
            if(isForCharacter(this, tag)) {
              // zusätzliche Stats für parametertyp hinzufügen
              addition += getAdditionalStats(tag, paramId);
            }
          }
        } catch(e) {
          // Nichts machen wenn fehler
        }
        value += addition;
      }
    }
    return value;
  };

  GDT.AdditionalPlugins.isForCharacter = function(actor, tag) {
    if(!tag || !tag["for"] || !tag["forid"]) return false;
    if(tag["for"] == "class") {
      return actor._classId === parseInt(tag["forid"]);
    } else {
      return actor._actorId === parseInt(tag["forid"]);
    }
  }

  function getAdditionalStats(tag, paramId) {
    if(!tag.stats || typeof tag.stats != "string") return 0;

    paramId -= 2;
    if(paramId < 0) {
      paramId+=8;
    }

    var stat = parseInt(tag.stats.split(",")[paramId]);
    if(isNaN(stat)) {
      return 0;
    }

    return stat;
  }



})();