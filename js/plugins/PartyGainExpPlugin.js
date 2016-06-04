/**
 * Created by Gilles on 29.05.2016.
 */
function partyGainExp(exp) {

  var members = $gameParty.members();
  for(var memberIndex=0; memberIndex < members.length; memberIndex++) {
    var member = members[memberIndex];

    member.gainExp(exp);
  }

}