'use strict';

Date.prototype.format = (fmt) => {
  let innerFmt = fmt;
  const o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds(),
  };
  if (/(y+)/.test(innerFmt)) {
    innerFmt = innerFmt.replace(RegExp.$1, (`${this.getFullYear()}`).substr(4 - RegExp.$1.length));
  }

  o.forEach((k) => {
    if (new RegExp(`(${k})`).test(innerFmt)) {
      innerFmt = innerFmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    }
  });

  return innerFmt;
};
