/**
 * Created by Gilles on 14.08.2016.
 */
GDT.CodeCracker = {};

GDT.CodeCracker._switches = [1,2,3,4];
GDT.CodeCracker._guessNumber = 0;
GDT.CodeCracker._count = 4;
GDT.CodeCracker._winSwitch = 1;

GDT.CodeCracker.setEvtSwitches = function(switches) {
  GDT.CodeCracker._switches = switches;
};
GDT.CodeCracker.setGuessNumber = function(guessnumber) {
  GDT.CodeCracker._guessNumber = guessnumber;
};

GDT.CodeCracker.setWinSwitch = function(winSwitch) {
  GDT.CodeCracker._winSwitch = winSwitch;
};

GDT.CodeCracker.setGuessCount = function(nrCount) {
  GDT.CodeCracker._count = nrCount;
};

GDT.CodeCracker.guess = function(number) {
  var playerNumber = GDT.CodeCracker.leadingZeros(number);
  var guessNumber = GDT.CodeCracker.leadingZeros(GDT.CodeCracker._guessNumber);

  var won = 0;

  for(var i=0; i < playerNumber.length; i++) {
    var playerDigit = playerNumber[i];
    var guessDigit = guessNumber[i];

    var currentSwitchId = GDT.CodeCracker._switches[i];

    if(playerDigit == guessDigit) {
      GDT.Util.setSelfSwitch(currentSwitchId,"A",true);
      won++;
    } else {
      GDT.Util.setSelfSwitch(currentSwitchId,"A",false);
    }

    if(won == playerNumber.length) {
      $gameSwitches.setValue(GDT.CodeCracker._winSwitch, true);
    } else {
      $gameSwitches.setValue(GDT.CodeCracker._winSwitch, false);
    }
  }

};

GDT.CodeCracker.leadingZeros = function(num) {
  var s = num+"";
  while (s.length < GDT.CodeCracker._count) s = "0" + s;
  return s;
};
