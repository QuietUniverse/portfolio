export const hexToRGB = function (hex) {
  return {
    r: "0x" + hex[1] + hex[1],
    g: "0x" + hex[2] + hex[2],
    b: "0x" + hex[3] + hex[3],
  };
};

export const promisifiedTimeout = function (secs) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, secs * 1000);
  });
};
