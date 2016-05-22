var _gdtRegisterOnClasses = true;

if(typeof GDT === "undefined") {
  GDT = {};
};
/**
 * Created by Gilles on 22.05.2016.
 */
GDT.CoreArray = {};

GDT.CoreArray.filterNullValues = function(arr, deepFilter) {
  if(!arr instanceof Array) return arr;

  var newArray = [];
  for(var i=0; i < arr.length; i++) {
    var value = arr[i];
    if(value !== null) {
      if(value instanceof Array && deepFilter) {
        newArray[i] = GDT.CoreArray.filterNullValues(value, deepFilter);
      } else if(typeof value == "object" && deepFilter) {
        newArray[i] = GDT.CoreObject.filterNullValues(value, deepFilter);
      } else {
        newArray[i] = value;
      }

    }
  }
  return newArray;
};
/**
 * Core Object
 */
GDT.CoreObject = {};

GDT.CoreObject.filterNullValues = function(obj, deepFilter) {
  if(typeof obj !== "object") return obj;

  var newObject = {};
  for(var key in obj) {
    var value = obj[key];
    if(value !== null) {
      if(value instanceof Array && deepFilter) {
        newObject[key] = GDT.CoreArray.filterNullValues(value, deepFilter);
      } else if(typeof value == "object" && deepFilter) {
        newObject[key] = GDT.CoreObject.filterNullValues(value, deepFilter);
      } else {
        newObject[key] = value;
      }
    }
  }

  return newObject;
};

if(_gdtRegisterOnClasses) {
  Object.prototype.filterNullValues = function(deepFilter) {
    return GDT.CoreObject.filterNullValues(this, deepFilter);
  };
}

