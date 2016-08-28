/*:
 * @plugindesc v1.0 - Timeevents allows you to control Timer on your Events and switch your Self Switches on or off
 * Requires GDT_Core
 * @author Gilles Meyer <admin[at]gamedev-tutorials.com>
 *
 * @help
 * timeevent %timeToPass% %selfSwitchToSetOn% %useGameTime%
 *
 * - timeToPass: How much time in seconds should pass before the switch status is changed
 * - selfSwitchToSetOn: Which Switch should be switched to ON (A,B,C,D): default is A
 * - useGameTime: compare against the already played gametime. If not the real time is taken: default is gametime
 *
 * timeeventoff %timeToPass% %selfSwitchToSetOff% %useGameTime%
 *
 * - timeToPass: How much time in seconds should pass before the switch status is changed
 * - selfSwitchToSetOff: Which Switch should be switched to OFF (A,B,C,D): default is A
 * - useGameTime: compare against the already played gametime. If not the real time is taken: default is gametime
 *
 */
(function() {

  var _Game_Event_update = Game_Event.prototype.update;
  Game_Event.prototype.update = function() {
    _Game_Event_update.call(this);
    this.checkTimers();
  };

  var _Game_Event_initialize = Game_Event.prototype.initialize;
  Game_Event.prototype.initialize = function(mapId, eventId) {
    _Game_Event_initialize.call(this, mapId, eventId);
    this._timers = [];
  };

  Game_Event.prototype.checkTimers = function() {
    for(var i=0; i < this._timers.length; i++) {
      if(this.checkTimer(this._timers[i])) {
        this._timers.splice(i,1);
      }
    }
  };

  Game_Event.prototype.checkTimer = function(timer) {
    var nowTime = (timer.isGameTime) ? $gameSystem.playtime() : (Math.round(new Date().getTime()/1000));
    if(timer.time <= nowTime) {
      GDT.Util.setSelfSwitch(this.eventId(), timer.selfSwitch, timer.status);
      return true;
    }
    return false;
  };

  Game_Event.prototype.setTimer = function(time, selfSwitch, isGameTime, status) {
    //debugger;
    var timer;
    if(isGameTime) {
      timer = $gameSystem.playtime()+parseInt(time);
    } else {
      timer = Math.round((new Date().getTime()/1000))+(parseInt(time));
    }

    var timerObj = {
      "time" : timer,
      "selfSwitch" : selfSwitch,
      "isGameTime" : isGameTime,
      "status" : (typeof status == "boolean") ? status : true
    };
    console.log(timerObj);
    this._timers.push(timerObj);
  };


  var _Game_Interpreter_pluginCommand =
    Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'timeevent') {
      setTimer.call(this,args, true);
    }
    if(command === 'timeeventoff') {
      setTimer.call(this,args, false);
    }
  };

  var setTimer = function(args, status) {
    var event = $gameMap.event(this.eventId());
    var time = args[0];
    var selfSwitch = (typeof args[1] == "string") ? args[1] : "A";
    var isGameTime = (args[2] == "false") ? false : true;
    if(time && selfSwitch) {
      event.setTimer(time, selfSwitch, isGameTime, status);
    }
  }


})();