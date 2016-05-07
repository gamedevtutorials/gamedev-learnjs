/**
 * Created by Gilles on 07.05.2016.
 */
if(typeof GDT == "undefined") {
  GDT = {};
}

GDT.Newsloader = {};

GDT.Newsloader.load = function(url, crossdomain, callback) {
  try {
    var loader = new PIXI.JsonLoader(url, crossdomain);

    loader.on("loaded", function() {
      callback(loader.json);
    });
    loader.load();
  } catch (e) {
    callback({
      "error" : e
    })
  }
};

GDT.Newsloader.showNews = function(url, crossdomain, switchNumber, varNumberTitle, varNumberContent) {
  GDT.Newsloader.load(url, crossdomain, function(json) {
    if(!json.error) {
      $gameVariables.setValue(varNumberTitle, json.title);
      $gameVariables.setValue(varNumberContent,json.description );
      $gameSwitches.setValue(switchNumber, true);
    } else {
      console.warn("Problem while loading from "+url+". Error: "+e);
    }

  });
};