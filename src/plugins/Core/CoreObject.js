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

