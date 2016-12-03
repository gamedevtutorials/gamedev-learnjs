/**
 * Created by Gilles on 03.12.2016.
 */
(function() {
  if(!GDT.AdditionalPlugins) {
    GDT.AdditionalPlugins = {};
  }

  var Game_Actor_skills = Game_Actor.prototype.skills;
  Game_Actor.prototype.skills = function() {
    var list = Game_Actor_skills.call(this);
    list = getItemsSkills(this, list);
    return list;
  };

  function getItemsSkills(actor, list) {

    actor.equips().forEach(function(item) {
      if(item == null) return false;

      var tag = getTagForItem(item);
      if(GDT.AdditionalPlugins.isForCharacter(actor, tag)) {
        if(tag.skills) {
          list = addSkillsToList(list, getSkillsFromTag(tag));
        }
      }
    });

    return list;
  }

  function addSkillsToList(list, skills) {
    skills.forEach(function(skill) {
      skill = $dataSkills[skill];
      if(!skill) return false;

      if (!list.contains(skill)) {
        list.push(skill);
      }
    });
    return list;
  }

  function getSkillsFromTag(tag) {
    if(typeof tag.skills == "string") {
      return tag.skills.split(",");
    }
    return [];
  }

  function getTagForItem(item) {
    try {
      var tag = JSON.parse(GDT.Util.LunaticTags(item.note, "extrastats"));
      if(tag) {
        return tag;
      }
    } catch(e) {
      // Nichts machen wenn fehler
    }
    return {};
  }

})();