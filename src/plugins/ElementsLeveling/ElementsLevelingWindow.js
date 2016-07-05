/**
 * Created by Gilles on 05.07.2016.
 */
(function() {

  if(typeof GDT == "undefined") {
    GDT = {};
  }
  if(typeof GDT.Param == "undefined") {
    GDT.Param = {};
  }

  var parameters = PluginManager.parameters('GDT_ElementsLeveling');
  GDT.Param.StatusElementsLevel = String(parameters['Status Menu Text'] || "Elements Level");
  GDT.Param.StatusEleLCol1 = String(parameters['Element Level Column 1']);
  GDT.Param.StatusEleLCol1 = GDT.Param.StatusEleLCol1.split(' ');
  GDT.Param.StatusEleLCol2 = String(parameters['Element Level Column 2']);
  GDT.Param.StatusEleLCol2 = GDT.Param.StatusEleLCol2.split(' ');


  if (typeof Window_StatusCommand != "undefined") {

    var _Window_StatusCommand_createCommand = Window_StatusCommand.prototype.createCommand;
    Window_StatusCommand.prototype.createCommand = function (command) {
      _Window_StatusCommand_createCommand.call(this, command);
      command = command.toUpperCase();
      if (['ELEMENTLEVEL', 'ELEMENTSLEVEL'].contains(command)) {
        var text = GDT.Param.StatusElementsLevel;
        this.addCommand(text, 'elementslevel', true);
      }
    };



    var _Window_StatusInfo_drawInfoContents = Window_StatusInfo.prototype.drawInfoContents;
    Window_StatusInfo.prototype.drawInfoContents = function(symbol) {
      this.resetFontSettings();
      if (!symbol) return;
      switch (symbol.toLowerCase()) {
        case 'elementslevel':
          this.drawElementsLevel();
          return;
          break;
      }
      _Window_StatusInfo_drawInfoContents.call(this, symbol);
    };


    Window_StatusInfo.prototype.drawElementsLevel = function() {
      this.drawElementLevelColumnRects();
      this.drawElementLevelInfo();
    };


    Window_StatusInfo.prototype.drawElementLevelColumnRects = function() {
      var maxCols = this.getMaxArrayCols(this.elementLevelArray());
      var maxRows = this.getMaxArrayRows(this.elementLevelArray());
      if (maxCols <= 0) return;
      var dx = this.getArrayX();
      var dy = this.getArrayY();
      var dw = this.getArrayDW(maxCols);
      for (var i = 0; i < maxCols; ++i) {
        for (var j = 0; j < maxRows; ++j) {
          this.drawDarkRect(dx, dy, dw, this.lineHeight());
          dy += this.lineHeight();
        }
        dx += dw;
        dx += (maxCols > 1) ? this.standardPadding() : 0;
        dy = 0;
      }
    };


    Window_StatusInfo.prototype.elementLevelArray = function() {
      var array = [
        GDT.Param.StatusEleLCol1,
        GDT.Param.StatusEleLCol2
      ];
      return array;
    };


    Window_StatusInfo.prototype.drawElementLevelInfo = function() {
      var maxCols = this.getMaxArrayCols(this.elementLevelArray());
      var maxRows = this.getMaxArrayRows(this.elementLevelArray());
      if (maxCols <= 0) return;
      var infoArray = this.elementLevelArray();
      var dx = this.getArrayX();
      var dy = this.getArrayY();
      var dw = this.getArrayDW(maxCols);
      for (var i = 0; i < maxCols; ++i) {
        for (var j = 0; j < infoArray[i].length; ++j) {
          var eleId = infoArray[i][j];
          this.drawElementLevelData(eleId, dx, dy, dw)
          dy += this.lineHeight();
        }
        dx += dw;
        dx += (maxCols > 1) ? this.standardPadding() : 0;
        dy = 0;
      }
    };


    Window_StatusInfo.prototype.drawElementLevelData = function(eleId, dx, dy, dw) {
      eleId = parseInt(eleId);
      var actor = $gameParty.members()[this._actor.index()];
      var currentElemXP = actor.getElementExp(eleId);
      var currentElemLevel = actor.getElementLevel(eleId);
      var nextLevelXP = actor.getElementLevelCurve(eleId)[currentElemLevel];
      var nextLevelText;
      if(typeof nextLevelXP == "number") {
        nextLevelText = currentElemXP+" / "+nextLevelXP;
      } else {
        nextLevelText = "MAX";
      }




      var eleName = $dataSystem.elements[eleId];
      dx += this.textPadding();
      dw -= this.textPadding() * 2;
      this._bypassResetTextColor = true;
      this.changeTextColor(this.systemColor());
      this.drawTextEx(eleName+ " Lv."+currentElemLevel, dx, dy);

      this._bypassResetTextColor = false;
      this.changeTextColor("#FFFFFF");

      this.drawText(nextLevelText, dx, dy, dw, 'right');
    };

  }

})();