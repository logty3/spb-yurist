module.exports = (valiadtion = {}) => (str, key) => {
  const errors = [];
  if (!str) {
    if (valiadtion.exists) {
      errors.push({ key, message: "required" });
      return errors;
    }
  }

  if (valiadtion.isNum) {
    if (!Number.isFinite(+str)) {
      errors.push({ key, message: "NaN" });
    }
    if (valiadtion.min) {
      if (+str < valiadtion.min) {
        errors.push({ key, message: "too min" });
      }
    }
    if (valiadtion.max) {
      if (+str > valiadtion.max) {
        errors.push({ key, message: "too max" });
      }
    }
    if (valiadtion.isPositive) {
      if (+str < 0) {
        errors.push({ key, message: "is negative" });
      }
    }
    if (valiadtion.isNegative) {
      if (+str > 0) {
        errors.push({ key, message: "is positive" });
      }
    }
  } else {
    if (!str) return errors;
    if (valiadtion.min) {
      if (str.length < valiadtion.min) {
        errors.push({ key, message: "too short" });
      }
    }
    if (valiadtion.max) {
      if (str.length > valiadtion.max) {
        errors.push({ key, message: "too long" });
      }
    }
    if (valiadtion.regEx) {
      if (!str.match(valiadtion.regEx)) {
        errors.push({ key, message: "no mutch" });
      }
    }
  }
  return errors;
};
