const validator = require("validator");
const { PROPS } = require("../DataAccess/DBInfo");
const { makeError } = require("../ErrorHandling/Helper.EH.MakeError");

function checkLength(str, minLen, maxLen) {
  return validator.isLength(str, {
    min: minLen,
    max: maxLen,
  });
}

function isMongoId(id) {
  return validator.isMongoId(id);
}

//take number as value
function isInt(value) {
  var x;
  if (isNaN(value)) {
    return false;
  }
  x = parseFloat(value);
  return (x | 0) === x;
}

function trim(str) {
  if(str==undefined) return "";
  return validator.trim(str);
}

function isInRange(number, min, max) {
  if (number >= min && number <= max) return true;
  else return false;
}

module.exports = {
  isMongoId,
  isInt,
  trim,
  checkLength,
  isInRange,
};
