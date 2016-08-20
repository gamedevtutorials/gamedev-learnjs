/**
 * Created by Gilles on 20.08.2016.
 */
Game_Actor.prototype.getElementLevelCurve = function(elementId) {
  var actorClass = $dataClasses[this._classId];
  var elementCurveNote = GDT.Util.LunaticTags(actorClass.note, "elementCurve");
  var elementCurve = GDT.ElementsLeveling.options.LEVEL_CURVE.slice(0);
  if(elementCurveNote) {

    var elementCurveNoteFunction = Function("options","test2",elementCurveNote);
    var opts =  {
      "elementId" : elementId,
      "actor" : this,
      "levelcurve" : elementCurve
    };
    elementCurveNoteFunction(opts);
    elementCurve = opts.levelcurve;
  }
  return elementCurve;
};
