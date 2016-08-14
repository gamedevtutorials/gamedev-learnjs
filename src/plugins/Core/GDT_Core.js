/**
 * Created by Gilles on 05.07.2016.
 */
GDTCORE = true;
if(typeof GDT == "undefined") {
  GDT = {};
}
if(typeof GDT.Param == "undefined") {
  GDT.Param = {};
}

if(typeof GDT.Util == "undefined") {
  GDT.Util = {};
}


DataManager.extractMetadata = function(data) {
  var re = /<([^<>:]+)(:?)([^>]*)>/g;
  data.meta = {};
  for (;;) {
    var match = re.exec(data.note);
    if (match) {
      if (match[2] === ':') {
        if(data.meta[match[1]] !== undefined) {
          if(!(data.meta[match[1]] instanceof Array)) {
            data.meta[match[1]] = [data.meta[match[1]]]
          }
          data.meta[match[1]].push(match[3]);
        } else {
          data.meta[match[1]] = match[3];
        }

      } else {
        data.meta[match[1]] = true;
      }
    } else {
      break;
    }
  }
};

GDT.Util.LunaticTags = function(note, tag, alwaysAsArray) {
  if(typeof note != "string" || typeof tag != "string") return [];
  var dataArray = [];

  var finished = false;

  while(!finished) {
    var start = note.indexOf("<"+tag+">");
    if(start == -1) {
      finished = true;
      continue;
    }

    var end = note.substr(start).indexOf("</"+tag+">");
    if(end == -1) {
      finished = true;
      continue;
    }
    var stringWithTags = note.substr(start, end+(tag.length+3));


    var stringWithoutStartTag = stringWithTags.substr(tag.length+2).trim();
    var stringCommand = stringWithoutStartTag.substr(0, stringWithoutStartTag.length - (tag.length+3)).trim();
    dataArray.push(stringCommand);

    note = note.substr(start+end+(tag.length+3));
  }

  return (alwaysAsArray && dataArray.length == 1) ? dataArray[0] : dataArray;

};

GDT.Util.setSelfSwitch = function(evtId, switchname, value) {
  if(evtId && evtId > 0 && switchname) {
    var mapId = $gameMap.mapId();
    var key = [mapId, evtId, switchname];
    $gameSelfSwitches.setValue(key, !!value);
  }
  return true;
};

