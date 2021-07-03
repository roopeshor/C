var __definedColors__ = Object.keys(COLORLIST);

// color randomizers
function _randomColor() {
  var color = "#";
  for (var i = 0; i < 3; i++) {
    var randNum = randomInt(255).toString(16);
    randNum = randNum.length == 1 ? 0 + randNum : randNum;
    color += randNum;
  }
  return color;
}

function _randomDefinedColor() {
  return COLORLIST[__definedColors__[randomInt(__definedColors__.length - 1)]];
}

// color conversions
function hue2RGB(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes values of red, green, and blue are between 0 & 255 and
 * returns hue in range 0 to 360, saturation and lightness in range 0 to 1
 *
 * @param {number} red The red color value
 * @param {number} green The green color value
 * @param {number} blue The blue color value
 * @return {array} The HSL representation
 */
function _RGBToHSL(red, green, blue) {
  var r = red / 255,
    g = green / 255,
    b = blue / 255;
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var hue,
    saturation,
    lightness = (max + min) / 2;

  if (max == min) {
    hue = saturation = 0; // achromatic
  } else {
    var d = max - min;
    saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        hue = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / d + 2;
        break;
      case b:
        hue = (r - g) / d + 4;
        break;
    }
    hue /= 6;
  }

  return [hue * 360, saturation, lightness];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes values of hue is between 0 and 360, saturation and lightness are between 0 & 1 and
 * returns red, green, and blue values between 0 & 255
 *
 * @param {number} hue The hue
 * @param {number} saturation The saturation
 * @param {number} lightness The lightness
 * @return {array} The RGB representation
 */
function _HSLToRGB(hue, saturation, lightness) {
  var r, g, b;
  hue /= 360;
  if (saturation == 0) {
    r = g = b = lightness; // achromatic
  } else {
    var q =
      lightness < 0.5
        ? lightness * (1 + saturation)
        : lightness + saturation - lightness * saturation;
    var p = 2 * lightness - q;
    r = hue2RGB(p, q, hue + 1 / 3);
    g = hue2RGB(p, q, hue);
    b = hue2RGB(p, q, hue - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes values of red, green, and blue are between 0 & 255 and
 * returns hue in range 0 to 360, saturation and value in range 0 to 1
 *
 * @param {number} red The red color value
 * @param {number} green The green color value
 * @param {number} blue The blue color value
 * @return {array} The HSV representation
 */
function _RGBToHSV(red, green, blue) {
  var r = red / 255,
    g = green / 255,
    b = blue / 255;
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var hue,
    saturation,
    value = max;

  var d = max - min;
  saturation = max == 0 ? 0 : d / max;

  if (max == min) {
    hue = 0; // achromatic
  } else {
    switch (max) {
      case r:
        hue = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / d + 2;
        break;
      case b:
        hue = (r - g) / d + 4;
        break;
    }
    hue /= 6;
  }

  return [hue * 360, saturation, value];
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes values of hue is between 0 to 360, saturation, and value are between 0 & 1 and
 * returns red, green, and blue in range 0 to 255
 *
 * @param {number} hue The hue
 * @param {number} saturation The saturation
 * @param {number} value The value
 * @return {array} The RGB representation
 */
function _HSVToRGB(hue, saturation, value) {
  var r, g, b;
  var i = Math.floor(hue / 60);
  var f = hue / 60 - i;
  var p = value * (1 - saturation);
  var q = value * (1 - f * saturation);
  var t = value * (1 - (1 - f) * saturation);

  switch (i % 6) {
    case 0:
      r = value;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = value;
      b = p;
      break;
    case 2:
      r = p;
      g = value;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = value;
      break;
    case 4:
      r = t;
      g = p;
      b = value;
      break;
    case 5:
      r = value;
      g = p;
      b = q;
      break;
  }

  return [r * 255, g * 255, b * 255];
}

defineProperties({
  // randomizers
  randomColor: _randomColor,
  randomDefinedColor: _randomDefinedColor,

  // color conversion algorithems
  RGBToHSL: _RGBToHSL,
  HSLToRGB: _HSLToRGB,
  RGBToHSV: _RGBToHSV,
  HSVToRGB: _HSVToRGB,
});
