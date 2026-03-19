function join(separator) {
  const sep = separator === undefined ? "," : String(separator);
  const len = this.length >>> 0;

  if (len === 0) return "";

  let result = "";

  for (let i = 0; i < len; i++) {
    if (i > 0) result += sep;

    if (i in this) {
      const value = this[i];
      if (value !== null && value !== undefined) {
        result += String(value);
      }
    }
  }

  return result;
}

Array.prototype.join = join;

module.exports = join;
