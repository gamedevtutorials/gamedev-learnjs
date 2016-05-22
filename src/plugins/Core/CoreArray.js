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