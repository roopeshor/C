(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.m3 = void 0;
const m3 = {
  multiply: function (a, b) {
    return [b[0] * a[0] + b[1] * a[3] + b[2] * a[6], b[0] * a[1] + b[1] * a[4] + b[2] * a[7], b[0] * a[2] + b[1] * a[5] + b[2] * a[8], b[3] * a[0] + b[4] * a[3] + b[5] * a[6], b[3] * a[1] + b[4] * a[4] + b[5] * a[7], b[3] * a[2] + b[4] * a[5] + b[5] * a[8], b[6] * a[0] + b[7] * a[3] + b[8] * a[6], b[6] * a[1] + b[7] * a[4] + b[8] * a[7], b[6] * a[2] + b[7] * a[5] + b[8] * a[8]];
  },
  translation: function (tx, ty) {
    // prettier-ignore
    return [1, 0, 0, 0, 1, 0, tx, ty, 1];
  },
  translate: function (m, tx, ty) {
    let mat = this.multiply(m, this.translation(tx, ty));

    for (let i = 0; i < mat.length; i++) m[i] = mat[i];
  },
  rotation: function (ang) {
    var c = Math.cos(ang);
    var s = Math.sin(ang); // prettier-ignore

    return [c, -s, 0, s, c, 0, 0, 0, 1];
  },
  rotate: function (m, ang) {
    let mat = this.multiply(m, this.rotation(ang));

    for (let i = 0; i < mat.length; i++) m[i] = mat[i];
  },
  scaling: function (sx, sy) {
    // prettier-ignore
    return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
  },
  scale: function (m, sx, sy) {
    let mat = this.multiply(m, this.scaling(sx, sy));

    for (let i = 0; i < mat.length; i++) m[i] = mat[i];
  }
};
exports.m3 = m3;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebGL = void 0;
exports.createWebGL = createWebGL;

var _main = require("../main.js");

var _utils = require("../utils.js");

var _m = require("./m3.js");

/**
 * Creates a WebGL instance thati include useful methods to work with WebGL.
 * @param	{object} configs configuration for canvas. Follwoing properties are accepted:
 * @param	{boolean} [configs.deleteOld=false] whether to delete old canvas.
 * @returns {WebGL} WebGL instance
 */
function createWebGL(configs) {
  let c = _main.C.workingCanvas;
  configs = (0, _utils.applyDefault)({
    deleteOld: true,
    dpr: c.dpr,
    width: c.width,
    height: c.height
  }, configs);
  let container = c.container;
  if (configs.deleteOld) container.removeChild(c.canvas);

  let cvs = _main.C.makeCanvas(configs);

  container.append(cvs);
  return new WebGL(cvs);
}
/**
 * Creates a new instance for drawing in webgl
 */


class WebGL {
  constructor(canvas) {
    let gl = canvas.getContext("webgl");

    if (!gl) {
      gl = canvas.getContext("experimental-webgl");
    }

    if (!gl) {
      console.error("WebGL is not supported");
      return null;
    }

    gl.viewport(0, 0, canvas.width, canvas.height); // make it transparent so that standard canvas can be seen

    /** @type {WebGLRenderingContext} */

    this.gl = gl;
    /** @type {HTMLCanvasElement} */

    this.canvas = canvas;
    /** @type {number} */

    this.width = canvas.width;
    /** @type {number} */

    this.height = canvas.height;
    /** @type {number} */

    this.dpr = canvas.dpr;
    const sources = {
      default: {
        vertex: `attribute vec2 a_position;

uniform vec2 u_resolution;
uniform mat3 u_matrix;

void main() {
  // Multiply the position by the matrix.
  vec2 position = (u_matrix * vec3(a_position, 1)).xy;

  // convert from pixels to -1->+1 (clipspace)
  vec2 clipSpace = position / u_resolution * 2.0 - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}`,
        fragment: `precision mediump float;
uniform vec4 u_color;
void main() {
   gl_FragColor = u_color;
}`,
        uniforms: {
          resolution: "u_resolution",
          matrix: "u_matrix",
          color: "u_color"
        },
        attribs: {
          position: "a_position"
        }
      }
    };

    for (let source in sources) {
      let src = sources[source];
      src.program = this.createProgramFromSource(src.vertex, src.fragment);
      let obj = {};

      for (let attr in src.attribs) {
        let nameInProgram = src.attribs[attr];
        obj[attr] = this.gl.getAttribLocation(src.program, nameInProgram); // enable vertex attrib array

        this.gl.enableVertexAttribArray(obj[attr]);
      }

      src.attribs = obj;
      obj = {};

      for (let uniform in src.uniforms) {
        let nameInProgram = src.uniforms[uniform];
        obj[uniform] = this.gl.getUniformLocation(src.program, nameInProgram);
      }

      src.uniforms = obj;
    }
    /**
     * Current using program
     * @type {WebGLProgram}
     */


    this.program = sources.default;
    gl.useProgram(this.program.program);
    /**
     * Projection matrix used for drawing
     * @type {number[]}
     */
    // prettier-ignore

    this.projectionMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    /**
     * Color to fill inside the shape
     * @type {number[]}
     */

    this.fillColor = [0, 0, 0, 1]; // set the resolution

    this.gl.uniform2f(this.program.uniforms.resolution, canvas.width, canvas.height);
  }
  /**
   * Returns a shader from given source and type
   * @param {number} type either gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
   * @param {string} source source code of shader
   * @returns {WebGLShader} shader
   */


  createShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }
  /**
   * creates a program from given shaders
   * @param {WebGLShader} vertexShader
   * @param {WebGLShader} fragmentShader
   * @returns {WebGLProgram}
   */


  createProgram(vertexShader, fragmentShader) {
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error(this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      return null;
    }

    return program;
  }
  /**
   * Creates program from given vertex and fragment shader source
   * @param {string} vertexShaderSource
   * @param {string} fragmentShaderSource
   * @returns {WebGLProgram}
   */


  createProgramFromSource(vertexShaderSource, fragmentShaderSource) {
    const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    return this.createProgram(vertexShader, fragmentShader);
  }

  resizeCanvas(width = 300, height = 300) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const dpr = window.devicePixelRatio;
    const displayWidth = Math.round(width * dpr);
    const displayHeight = Math.round(height * dpr); // Make the canvas the same size

    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";
    this.canvas.width = displayWidth;
    this.canvas.height = displayHeight;
  }

}
/**
 * clears the canvas using given color
 * @param {number} r red value
 * @param {number} g green value
 * @param {number} b blue value
 * @param {number} a alpha value
 */


exports.WebGL = WebGL;

WebGL.prototype.background = function (r, g, b, a) {
  this.gl.clearColor(r, g, b, a);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  return this;
};
/**
 * clears canvas
 * @returns {this}
 */


WebGL.prototype.clear = function () {
  this.background(0, 0, 0, 0);
  return this;
};

WebGL.prototype.bindNewBuffer = function (type = this.gl.ARRAY_BUFFER) {
  // Create a buffer to put stuffs in
  var buffer = this.gl.createBuffer();
  this.gl.bindBuffer(type, buffer);
  return buffer;
};
/**
 * sets geometry of a objevt in buffer
 * @param {number[]} data data of positions to set
 * @param {*} target
 * @param {*} usage
 * @returns {this}
 */


WebGL.prototype.setGeometry = function (data, target = this.gl.ARRAY_BUFFER, usage = this.gl.STATIC_DRAW) {
  let gl = this.gl,
      program = this.program; // Create and bind a buffer to put positions of points in

  this.bindNewBuffer();
  gl.bufferData(target, new Float32Array(data), usage); // Set the matrix.

  gl.uniformMatrix3fv(program.uniforms.matrix, false, this.projectionMatrix); // set the color

  gl.uniform4fv(program.uniforms.color, this.fillColor); // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)

  gl.vertexAttribPointer(program.attribs.position, // position of position attribute
  2, // pull 2 components per iteration
  gl.FLOAT, // type of the data is 32bit floats
  false, // don't normalize the data
  0, // 0 = move forward size * sizeof(type) each iteration to get the next position
  0 // start at the beginning of the buffer
  ); // Draw the geometry.

  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 18; // 6 triangles in the 'F', 3 points per triangle

  gl.drawArrays(primitiveType, offset, count);
  return this;
};
/**
 * rotates canvas by a given angle.
 * Multiplies current matrix by a rotation matrix
 * @param {number} angle angle to rotate by
 * @returns {this}
 */


WebGL.prototype.rotate = function (angle) {
  _m.m3.rotate(this.projectionMatrix, angle);

  return this;
};
/**
 * Translate canvas by a given vector by multiplying current matrix by a translation matrix
 * @param {number} x x value of vector
 * @param {number} y y value of vector
 * @returns {this}
 */


WebGL.prototype.translate = function (x, y) {
  _m.m3.translate(this.projectionMatrix, x, y);

  return this;
};
/**
 * Scales canvas by given x, y factors
 */


WebGL.prototype.scale = function (x, y) {
  _m.m3.scale(this.projectionMatrix, x, y);

  return this;
};

WebGL.prototype.fill = function (r, g, b, a) {
  this.fillColor = [r, g, b, a];
};

},{"../main.js":17,"../utils.js":33,"./m3.js":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Arc = Arc;
exports.Circle = Circle;
exports.Line = Line;
exports.animateFill = animateFill;

var _color_reader = require("../color/color_reader.js");

var _main = require("../main.js");

var _rate_functions = require("../math/rate_functions.js");

var _geometry = require("../objects/geometry.js");

var _settings = require("../settings.js");

var _utils = require("../utils.js");

const counters = {
  Circle: 1,
  Line: 1,
  animateFill: 1,
  Arc: 1
};
/**
 * Animates a line from point p1 to point p2.
 *
 * @param {array<number>} p1 The first point.
 * @param {array<number>} p2 The second point.
 * @param {number} [dt=10] The duration of one frame in milliseconds.
 * @param {function} [next=() => {}] The function to call after the animation.
 */

function Line(args) {
  let defaults = {
    name: "line-" + counters.Line++,
    dur: 1000,
    dTime: 10,
    next: null,
    rateFunction: _rate_functions.smooth
  };
  let {
    p1,
    p2,
    name,
    dur,
    canvas,
    dTime,
    rateFunction,
    next,
    syncWithTime
  } = (0, _utils.applyDefault)(defaults, args);
  canvas = canvas || _main.C.workingCanvas.name;
  let ctx = _main.C.canvasList[canvas];
  let angle = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
  let points = [];
  let xDiff = p2[0] - p1[0];
  let yDiff = p2[1] - p1[1];
  let dt = Math.abs(Math.cos(angle) / xDiff);

  if (Math.abs(Math.PI / 2 - Math.abs(angle)) < 1e-6) {
    dt = 1 / Math.abs(yDiff);
  }

  for (let t = 0; t <= 1 + 1e-6; t += dt) {
    points.push([p1[0] * (1 - t) + p2[0] * t, p1[1] * (1 - t) + p2[1] * t]);
  }

  return {
    points: points,
    // list of computed points
    dur: dur,
    dTime: dTime,
    canvas: ctx,
    rateFunction: rateFunction,
    name: name,
    closed: false,
    smoothen: false,
    fill: false,
    next: next,
    syncWithTime: syncWithTime
  };
}

function Arc(args) {
  const defaults = {
    center: [0, 0],
    name: "arc-" + counters.Arc++,
    radiusX: 100,
    radiusY: 100,
    dur: 1000,
    dTime: 16,
    fill: false,
    fillTime: 500,
    next: null,
    rateFunction: _rate_functions.smooth,
    closed: false,
    startAngle: 0,
    angle: Math.PI / 2,
    clockwise: false
  };
  let {
    name,
    dur,
    center,
    canvas,
    dTime,
    fill: fillColor,
    fillTime,
    next,
    closed,
    rateFunction,
    startAngle,
    angle,
    radiusX,
    radiusY,
    clockwise
  } = Object.assign(defaults, args);
  canvas = canvas || _main.C.workingCanvas.name;
  let ctx = _main.C.canvasList[canvas];
  let points = [];

  if (args.radius) {
    radiusX = args.radius;
    radiusY = args.radius;
  }

  let dt = 2 / (ctx.dpr * (radiusX + radiusY));
  let start = startAngle;
  let end = angle + startAngle + 1e-6;

  function pushPoint(t) {
    const x1 = Math.cos(t) * radiusX + center[0];
    const y1 = Math.sin(t) * radiusY + center[1];
    points.push([x1, y1]);
  }

  if (clockwise) for (let t = end; t >= start; t -= dt) pushPoint(t);else for (let t = start; t <= end; t += dt) pushPoint(t);
  let rx = radiusX;
  let ry = radiusY;

  if (ctx.doStroke) {
    rx -= (0, _settings.getStrokeWidth)() / 2;
    ry -= (0, _settings.getStrokeWidth)() / 2;
  }

  console.log(points);
  return {
    points: points,
    // list of computed points
    dur: dur,
    dTime: dTime,
    canvas: ctx,
    rateFunction: rateFunction,
    name: name,
    closed: closed,
    smoothen: true,
    tension: 1,
    fill: fillColor,
    fillTime: fillTime,
    next: next,
    rx: rx,
    ry: ry,
    filler: function () {
      (0, _geometry.ellipse)(center[0], center[1], rx, ry, 0, startAngle, angle);
    }
  };
}
/**
 * animate filling of a given shape
 * ! Has some flaws !
 * @param {string} id ID of canvas
 * @param {string} FILL color of canvas
 * @param {function} f funciton that draws the shape
 * @param {number} [dur=1000] dur to run
 * @param {number} [dt=10] dur for each frame
 * @param {function} [next=null] function to run after filling
 */


function animateFill(name, canvasName, FILL, f, dur = 1000, dt = 10, next = null) {
  let _fill = (0, _color_reader.readColor)(FILL, true);

  const ctx = _main.C.canvasList[canvasName];
  let previousT = -dur / dt;
  (0, _settings.loop)("filling " + name, t => {
    if (t >= dur) {
      (0, _settings.noLoop)(canvasName, t);
      if (typeof next == "function") next();
    }

    ctx.fillStyle = (0, _color_reader.readColor)(_fill[0], _fill[1], _fill[2], _fill[3] / (t - previousT));
    f();
    previousT = t;
  }, canvasName, dt, 1000, {}, dur);
}
/**
 * Animates drawing of a point.
 * @param {object} args object containing configs
 *
 * @param {string} [args.name = "point-" + counters.Circle] Name of the animation
 * @param {number} [args.radius = 3] radius of circle
 * @param {number} [args.dur = 1000] duration of animation
 * @param {number} [args.dTime = 1] duration of each frame
 * @param {boolean|string} [args.fill = false] if false, no fill. Else a color to fill with.
 * @param {number} [args.fillTime = 500] time to fill inside circle.
 * @param {funciton} [args.next = null] function to run after animation ends.
 * @param {funciton} [args.rateFunction = smooth] function to use for rate.
 * @param {array<number>} args.center center of the circle
 * @param {string} args.canvas name of canvas in which the animation is rendered
 */


function Circle(args) {
  let defaults = {
    name: "point-" + counters.Circle++,
    radius: 100,
    dur: 1000,
    dTime: 16,
    fill: false,
    fillTime: 500,
    next: null,
    rateFunction: _rate_functions.smooth,
    startAngle: 0,
    angle: Math.PI * 2
  };
  args = Object.assign(defaults, args);
  let center = args.center,
      {
    points,
    dur,
    dTime,
    canvas,
    rateFunction,
    fill: fillColor,
    fillTime,
    next,
    rx
  } = Arc(args);
  return {
    points: points,
    // list of computed points
    dur: dur,
    dTime: dTime,
    canvas: canvas,
    rateFunction: rateFunction,
    name: args.name,
    closed: true,
    smoothen: true,
    tension: 1,
    fill: fillColor,
    fillTime: fillTime,
    next: next,
    filler: function () {
      (0, _geometry.point)(center[0], center[1], rx * 2, false);
    }
  };
}

},{"../color/color_reader.js":6,"../main.js":17,"../math/rate_functions.js":22,"../objects/geometry.js":28,"../settings.js":32,"../utils.js":33}],4:[function(require,module,exports){
"use strict";

var _utils = require("./utils.js");

var MathConsts = _interopRequireWildcard(require("./constants/math.js"));

var COLORLIST = _interopRequireWildcard(require("./constants/colors.js"));

var DrawingConstants = _interopRequireWildcard(require("./constants/drawing.js"));

var ColorPalettes = _interopRequireWildcard(require("./constants/color_palettes.js"));

var Gradients = _interopRequireWildcard(require("./color/gradients.js"));

var Color_Random = _interopRequireWildcard(require("./color/random.js"));

var Color_Reader = _interopRequireWildcard(require("./color/color_reader.js"));

var Interpolation = _interopRequireWildcard(require("./color/interpolation.js"));

var Color_Converters = _interopRequireWildcard(require("./color/color_converters.js"));

var ImageDrawings = _interopRequireWildcard(require("./image/image.js"));

var ImageProcessing = _interopRequireWildcard(require("./image/processing.js"));

var Tex = _interopRequireWildcard(require("./objects/tex.js"));

var Settings = _interopRequireWildcard(require("./settings.js"));

var Text = _interopRequireWildcard(require("./objects/text.js"));

var Braces = _interopRequireWildcard(require("./objects/braces.js"));

var Arrows = _interopRequireWildcard(require("./objects/arrows.js"));

var Geometry = _interopRequireWildcard(require("./objects/geometry.js"));

var Functions = _interopRequireWildcard(require("./objects/functions.js"));

var CoordinateSystems = _interopRequireWildcard(require("./objects/coordinate_systems.js"));

var MoreShapes = _interopRequireWildcard(require("./objects/more_shapes.js"));

var CreateAnimation = _interopRequireWildcard(require("./animations/create.js"));

var Basic = _interopRequireWildcard(require("./math/basic.js"));

var Points = _interopRequireWildcard(require("./math/points.js"));

var Math_Random = _interopRequireWildcard(require("./math/random.js"));

var Arithmeics = _interopRequireWildcard(require("./math/aritmetics.js"));

var RateFunctions = _interopRequireWildcard(require("./math/rate_functions.js"));

var _main = require("./main.js");

var WebGL = _interopRequireWildcard(require("./WebGL/webgl.js"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

(0, _utils.defineProperties)(COLORLIST);
(0, _utils.defineProperties)(DrawingConstants);
(0, _utils.defineProperties)(MathConsts);
(0, _utils.defineProperties)(ColorPalettes);
(0, _utils.defineProperties)(Color_Converters);
(0, _utils.defineProperties)(Color_Reader);
(0, _utils.defineProperties)(Gradients);
(0, _utils.defineProperties)(Color_Random);
(0, _utils.defineProperties)(Interpolation);
(0, _utils.defineProperties)(ImageProcessing);
(0, _utils.defineProperties)(ImageDrawings);
(0, _utils.defineProperties)(Geometry);
(0, _utils.defineProperties)(Settings);
(0, _utils.defineProperties)(Text);
(0, _utils.defineProperties)(Tex);
(0, _utils.defineProperties)(CoordinateSystems);
(0, _utils.defineProperties)(Braces);
(0, _utils.defineProperties)(Arrows);
(0, _utils.defineProperties)(Functions);
(0, _utils.defineProperties)(MoreShapes);
(0, _utils.defineProperties)(CreateAnimation);
(0, _utils.defineProperties)(Arithmeics);
(0, _utils.defineProperties)(Basic);
(0, _utils.defineProperties)(Points);
(0, _utils.defineProperties)(Math_Random);
(0, _utils.defineProperties)(RateFunctions);
(0, _utils.defineProperties)(MathConsts);
(0, _utils.defineProperties)(_utils.defineProperties);
(0, _utils.defineProperties)(COLORLIST, _main.C.COLORLIST); //! Experimental features

(0, _utils.defineProperties)(WebGL);

},{"./WebGL/webgl.js":2,"./animations/create.js":3,"./color/color_converters.js":5,"./color/color_reader.js":6,"./color/gradients.js":7,"./color/interpolation.js":8,"./color/random.js":9,"./constants/color_palettes.js":10,"./constants/colors.js":11,"./constants/drawing.js":12,"./constants/math.js":13,"./image/image.js":15,"./image/processing.js":16,"./main.js":17,"./math/aritmetics.js":18,"./math/basic.js":19,"./math/points.js":20,"./math/random.js":21,"./math/rate_functions.js":22,"./objects/arrows.js":24,"./objects/braces.js":25,"./objects/coordinate_systems.js":26,"./objects/functions.js":27,"./objects/geometry.js":28,"./objects/more_shapes.js":29,"./objects/tex.js":30,"./objects/text.js":31,"./settings.js":32,"./utils.js":33}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HSLToRGB = HSLToRGB;
exports.HSVToRGB = HSVToRGB;
exports.RGBToHSL = RGBToHSL;
exports.RGBToHSV = RGBToHSV;

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
 * Assumes values of red, green, and blue are between 0 & 1 and
 * returns hue, saturation and lightness in range 0 to 1
 * @method RGBToHSL
 * @global
 * @param {number} red The red color value
 * @param {number} green The green color value
 * @param {number} blue The blue color value
 * @return {array<number>} The HSL representation
 */


function RGBToHSL(r, g, b) {
  let max = Math.max(r, g, b),
      min = Math.min(r, g, b),
      hue,
      saturation,
      lightness = (max + min) / 2;

  if (max === min) {
    hue = saturation = 0; // achromatic
  } else {
    let d = max - min;
    saturation = lightness > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max == r) hue = (g - b) / d + (g < b ? 6 : 0);else if (max == g) hue = (b - r) / d + 2;else if (max == b) hue = (r - g) / d + 4;
    hue /= 6;
  }

  return [hue, saturation, lightness];
}
/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes values of hue is between 0 and 360, saturation and lightness are between 0 & 1 and
 * returns red, green, and blue values between 0 & 1
 *
 * @param {number} hue The hue
 * @param {number} saturation The saturation
 * @param {number} lightness The lightness
 * @return {array<number>} The RGB representation
 */


function HSLToRGB(hue, saturation, lightness) {
  let r, g, b;
  hue /= 360;

  if (saturation === 0) {
    r = g = b = lightness; // achromatic
  } else {
    let q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    let p = 2 * lightness - q;
    r = hue2RGB(p, q, hue + 1 / 3);
    g = hue2RGB(p, q, hue);
    b = hue2RGB(p, q, hue - 1 / 3);
  }

  return [r, g, b];
}
/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes values of red, green, and blue are between 0 & 1 and
 * returns hue, saturation and value in range 0 to 1
 *
 * @param {number} red The red color value
 * @param {number} green The green color value
 * @param {number} blue The blue color value
 * @return {array<number>} The HSV representation
 */


function RGBToHSV(r, g, b) {
  let max = Math.max(r, g, b),
      // val
  min = Math.min(r, g, b),
      // chroma
  hue,
      value = max,
      d = max - min,
      saturation = max === 0 ? 0 : d / max;

  if (max === min) {
    hue = 0; // achromatic
  } else {
    if (max == r) hue = (g - b) / d + (g < b ? 6 : 0);else if (max == g) hue = (b - r) / d + 2;else if (max == b) hue = (r - g) / d + 4;
    hue /= 6;
  }

  return [hue, saturation, value];
}
/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes values of hue is between 0 to 360, saturation, and value are between 0 & 1 and
 * returns red, green, and blue in range 0 to 1
 *
 * @param {number} hue The hue
 * @param {number} saturation The saturation
 * @param {number} value The value
 * @return {array<number>} The RGB representation
 */


function HSVToRGB(hue, saturation, value) {
  let r,
      g,
      b,
      i = Math.floor(hue / 60),
      f = hue / 60 - i,
      p = value * (1 - saturation),
      q = value * (1 - f * saturation),
      t = value * (1 - (1 - f) * saturation);
  i %= 6;
  if (i == 0) r = value, g = t, b = p;else if (i == 1) r = q, g = value, b = p;else if (i == 2) r = p, g = value, b = t;else if (i == 3) r = p, g = q, b = value;else if (i == 4) r = t, g = p, b = value;else if (i == 5) r = value, g = p, b = q;
  return [r, g, b];
}

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readColor = readColor;

var namedColors = _interopRequireWildcard(require("../constants/named_colors.js"));

var _main = require("../main.js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// adapeted from p5.js

/**
 * Full color string patterns. The capture groups are necessary.
 */
let // Matching format: #XXX
HEX3 = /^#([a-f0-9])([a-f0-9])([a-f0-9])$/i,
    // Matching format: #XXXX
HEX4 = /^#([a-f0-9])([a-f0-9])([a-f0-9])([a-f0-9])$/i,
    // Matching format: #xxxxxx
HEX6 = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,
    // Matching format: #XXXXXXXX
HEX8 = /^#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i,
    // Matching format: rgb(R, G, B)
RGB = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/i,
    // Matching format: rgb(R, G, B, A)
RGBA = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(?:(\d+(?:\.\d+)?)|(?:\.\d+))\)$/i;
/**
 * Reads the argument and returns color in the prefered colorMode.
 * If last argument is given true, it will return the colors as array.
 * Possible use cases (these assume colorModes to be 'rgba'):
 * Only accept valid css colors
 *
 * * readColor(100)                 // rgba(100, 100, 100, 1)
 * * readColor(255, 200)            // rgba(255, 200, 0, 1)
 * * readColor(255, 200, 100)       // rgba(255, 200, 100, 1)
 * * readColor(290, 134, 50, 0.6)   // rgba(290, 134, 50, 0.6)
 * * readColor("#f3d")              // rgba(255, 51, 221, 1)
 * * readColor("#fa054f")           // rgba(250, 5, 79, 1)
 * * readColor("#fa054fa0")         // rgba(250, 5, 79, 0.6274509803921569)
 * * readColor(255, 200, 100, true) // [255, 200, 100, 1]
 * * readColor("#f3da", true)       // [255, 51, 221, 0.0392156862745098]
 *
 * @return {string|array} color string/array
 */

function readColor() {
  let args = Array.prototype.slice.call(arguments),
      color,
      toArray,
      lastArg = args[args.length - 1],
      result;
  if (Array.isArray(args[0])) args = args[0];

  if (typeof lastArg == "boolean") {
    toArray = lastArg;
    color = args.slice(0, args.length - 1);
  } else {
    toArray = false;
    color = args.slice(0, args.length);
  }

  let c1 = color[0];

  if (typeof c1 === "number") {
    if (color.length === 1) {
      result = [c1, c1, c1, 1];
    } else if (color.length === 2) {
      result = [c1, color[1], 0, 1];
    } else if (color.length === 3) {
      result = [c1, color[1], color[2], 1];
    } else if (color.length === 4) {
      result = [c1, color[1], color[2], color[3] / 255];
    }
  } else if (typeof c1 == "string") {
    // Adapted from p5.js
    let str = c1.replace(/\s/g, "").toLowerCase(); // convert string to array if it is a named colour.

    if (namedColors[str]) result = readColor(namedColors[str], true);else if (HEX3.test(str)) {
      result = HEX3.exec(str).slice(1).map(color => parseInt(color + color, 16));
      result[3] = 1;
    } else if (HEX6.test(str)) {
      result = HEX6.exec(str).slice(1).map(color => parseInt(color, 16));
      result[3] = 1;
    } else if (HEX4.test(str)) {
      result = HEX4.exec(str).slice(1).map(color => parseInt(color + color, 16));
    } else if (HEX8.test(str)) {
      result = HEX8.exec(str).slice(1).map(color => parseInt(color, 16));
      result[3] /= 255;
    } else if (RGB.test(str)) {
      result = RGB.exec(str).slice(1).map(color => parseInt(color));
      result[3] = 1;
    } else if (RGBA.test(str)) {
      result = RGBA.exec(str).slice(1).map((color, index) => {
        if (index == 3) return parseFloat(color);
        return parseInt(color);
      });
    } else {
      console.log(str);
      throw new Error("Given color is not valid");
    }
  } else {
    return c1;
  }

  if (!toArray) {
    let mode = (_main.C.workingCanvas || {}).colorMode || "rgba";

    if (mode === "rgba") {
      result = `rgba(${result[0]}, ${result[1]}, ${result[2]}, ${result[3]})`;
    } else if (mode === "hsl" || mode === "rgb") {
      result = mode + `(${result[0]}, ${result[1]}, ${result[2]})`;
    } else if (mode == "hex6") {
      let r = "#";
      result.map((color, i) => {
        if (i < 3) {
          let hex = Math.round(color).toString(16);
          r += hex.length == 1 ? "0" + hex : hex;
        }
      });
      result = r;
    } else if (mode == "hex8") {
      let r = "#";
      result.map((color, i) => {
        if (i < 4) {
          let hex = Math.round(color).toString(16);
          r += hex.length == 1 ? "0" + hex : hex;
        }
      });
      result = r;
    }
  }

  return result;
}

},{"../constants/named_colors.js":14,"../main.js":17}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linearGradient = linearGradient;

var _main = require("../main.js");

/**
 * creates a linear gradient
 *
 * @param {array<number>} initialPoint initial point as [x, y]
 * @param {array<number>} finalPoint final point as [x, y]
 * @param {Object|array<any>} colorStops color stops
 @example
 ```js
let color = linearGradient(
	[0, 0], [200, 0],
	{
			0: "green",
			0.5: "cyan",
			1: "yellow"
	}
);
```,
```js
let color = linearGradient(
	[0, 0], [200, 0],
	[
		"green",
		"cyan",
		"yellow"
	]
);
```
 */
function linearGradient(initialPoint, finalPoint, colorStops) {
  const ctx = _main.C.workingCanvas;
  const gradient = ctx.createLinearGradient(initialPoint[0], initialPoint[1], finalPoint[0], finalPoint[1]);

  if (Array.isArray(colorStops)) {
    const stops = {};
    const step = 1 / colorStops.length;

    for (let i = 0; i < colorStops.length; i++) {
      stops[step * i] = colorStops[i];
    }

    colorStops = stops;
  }

  for (let stops = Object.keys(colorStops), i = 0; i < stops.length; i++) {
    const stop = stops[i];
    gradient.addColorStop(stop, colorStops[stop]);
  }

  return gradient;
}

},{"../main.js":17}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInterpolatedColorList = getInterpolatedColorList;
exports.lerpColor = lerpColor;
exports.lerpColorArray = lerpColorArray;
exports.lerpColorObject = lerpColorObject;

var _color_reader = require("./color_reader.js");

/**
 * gives an interpolated color.
 *
 * @param {string} color1 color
 * @param {string} color2 color
 * @param {number} v should be between 0 and 1.
 */
function lerpColor(color1, color2, v) {
  const c1 = (0, _color_reader.readColor)(color1, true);
  const c2 = (0, _color_reader.readColor)(color2, true);
  return (0, _color_reader.readColor)(Math.min(Math.max(0, (c2[0] - c1[0]) * v + c1[0]), 255), Math.min(Math.max(0, (c2[1] - c1[1]) * v + c1[1]), 255), Math.min(Math.max(0, (c2[2] - c1[2]) * v + c1[2]), 255), Math.min(Math.max(0, (c2[3] - c1[3]) * v + c1[3]), 255));
}
/**
 * Lerps across a color Object
 *
 * @param {object} colorObj
 * @param {number} v
 * @return {string}
 */


function lerpColorObject(colorObj, v) {
  const stopes = Object.keys(colorObj).sort();
  const min = Math.min(...stopes);
  const max = Math.max(...stopes);
  if (v >= max) return colorObj[max];
  if (v <= min) return colorObj[min];

  for (let i = 0; i < stopes.length - 1; i++) {
    let a = stopes[i];

    if (v > a) {
      return lerpColor(colorObj[a], colorObj[stopes[i + 1]], (v - a) / (stopes[i + 1] - a));
    } else if (v == a) {
      return colorObj[a];
    }
  }
}
/**
 * Lerps across a color Array
 * From <https://github.com/yuki-koyama/tinycolormap/blob/fe597277c782c583eb40362de98a08df62efc628/include/tinycolormap.hpp#L159>
 * @param {array<string>} colorArr array that contains color as string
 * @param {number} v value to interpolate
 * @param {number} [min = 0] minimum value of the range
 * @param {number} [max = 1] maximum value of the range
 * @return {string} lerped color
 */


function lerpColorArray(colorArr, v, min = 0, max = 1) {
  let len = colorArr.length - 1;
  if (v >= max) return colorArr[len];
  if (v <= min) return colorArr[0]; // map to [0, 1]

  v = (v - min) / (max - min);
  let a = v * len,
      // between 0 and len
  b = Math.floor(a);
  return lerpColor(colorArr[b], colorArr[b + 1], a - b);
}

function getInterpolatedColorList(colorPalatte, min = 0, max = 5, step = 1, alpha = 1) {
  const len = Math.round((max - min) / step) + 1;
  const list = Object.keys(colorPalatte),
        listMax = Math.max(...list);

  if (len > listMax) {// not implemented
  } else if (len < 3) {
    throw new Error("Number of colors to compute is less than 3");
  }

  const colorObj = {};
  const cp = colorPalatte[len];
  let k = 0;

  for (let i = min; i <= max; i += step) {
    const c = (0, _color_reader.readColor)(cp[k++], true);
    c[3] = alpha;
    colorObj[i] = (0, _color_reader.readColor)(...c);
  }

  return colorObj;
}

},{"./color_reader.js":6}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomColor = randomColor;
exports.randomDefinedColor = randomDefinedColor;

var COLORLIST = _interopRequireWildcard(require("../constants/colors.js"));

var _random = require("../math/random.js");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

let definedColorList = Object.keys(COLORLIST);
const TR_INDEX = definedColorList.indexOf("TRANSPARENT");
definedColorList = definedColorList.slice(0, TR_INDEX).concat(definedColorList.slice(TR_INDEX + 1));
/**
 * returns a random hex color
 *
 */

function randomColor() {
  let color = "#";

  for (let i = 0; i < 3; i++) {
    let randNum = (0, _random.randomInt)(255).toString(16);
    randNum = randNum.length === 1 ? 0 + randNum : randNum;
    color += randNum;
  }

  return color;
}
/**
 * picks a random color from defined ones
 *
 */


function randomDefinedColor() {
  return COLORLIST[definedColorList[(0, _random.randomInt)(definedColorList.length - 1)]];
}

},{"../constants/colors.js":11,"../math/random.js":21}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColorPalettes = void 0;
// prettier-ignore

/** @type {Object.<string, string[]>} ColorPalette */
let ColorPalettes = {
  // This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).
  // Please see license at http://colorbrewer.org/export/LICENSE.txt
  YlGn: "#ffffe5 #f7fcb9 #d9f0a3 #addd8e #78c679 #41ab5d #238443 #006837 #004529",
  GnBu: "#f7fcf0 #e0f3db #ccebc5 #a8ddb5 #7bccc4 #4eb3d3 #2b8cbe #0868ac #084081",
  BuGn: "#f7fcfd #e5f5f9 #ccece6 #99d8c9 #66c2a4 #41ae76 #238b45 #006d2c #00441b",
  PuBu: "#fff7fb #ece7f2 #d0d1e6 #a6bddb #74a9cf #3690c0 #0570b0 #045a8d #023858",
  BuPu: "#f7fcfd #e0ecf4 #bfd3e6 #9ebcda #8c96c6 #8c6bb1 #88419d #810f7c #4d004b",
  RdPu: "#fff7f3 #fde0dd #fcc5c0 #fa9fb5 #f768a1 #dd3497 #ae017e #7a0177 #49006a",
  PuRd: "#f7f4f9 #e7e1ef #d4b9da #c994c7 #df65b0 #e7298a #ce1256 #980043 #67001f",
  OrRd: "#fff7ec #fee8c8 #fdd49e #fdbb84 #fc8d59 #ef6548 #d7301f #b30000 #7f0000",
  Reds: "#fff5f0 #fee0d2 #fcbba1 #fc9272 #fb6a4a #ef3b2c #cb181d #a50f15 #67000d",
  Blues: "#f7fbff #deebf7 #c6dbef #9ecae1 #6baed6 #4292c6 #2171b5 #08519c #08306b",
  Greys: "#ffffff #f0f0f0 #d9d9d9 #bdbdbd #969696 #737373 #525252 #252525 #000000",
  YlGnBu: "#ffffd9 #edf8b1 #c7e9b4 #7fcdbb #41b6c4 #1d91c0 #225ea8 #253494 #081d58",
  PuBuGn: "#fff7fb #ece2f0 #d0d1e6 #a6bddb #67a9cf #3690c0 #02818a #016c59 #014636",
  YlOrRd: "#ffffcc #ffeda0 #fed976 #feb24c #fd8d3c #fc4e2a #e31a1c #bd0026 #800026",
  YlOrBr: "#ffffe5 #fff7bc #fee391 #fec44f #fe9929 #ec7014 #cc4c02 #993404 #662506",
  Greens: "#f7fcf5 #e5f5e0 #c7e9c0 #a1d99b #74c476 #41ab5d #238b45 #006d2c #00441b",
  Purples: "#fcfbfd #efedf5 #dadaeb #bcbddc #9e9ac8 #807dba #6a51a3 #54278f #3f007d",
  Oranges: "#fff5eb #fee6ce #fdd0a2 #fdae6b #fd8d3c #f16913 #d94801 #a63603 #7f2704",
  PuOr: "#7f3b08 #b35806 #e08214 #fdb863 #fee0b6 #f7f7f7 #d8daeb #b2abd2 #8073ac #542788 #2d004b",
  BrBG: "#543005 #8c510a #bf812d #dfc27d #f6e8c3 #f5f5f5 #c7eae5 #80cdc1 #35978f #01665e #003c30",
  PRGn: "#40004b #762a83 #9970ab #c2a5cf #e7d4e8 #f7f7f7 #d9f0d3 #a6dba0 #5aae61 #1b7837 #00441b",
  PiYG: "#8e0152 #c51b7d #de77ae #f1b6da #fde0ef #f7f7f7 #e6f5d0 #b8e186 #7fbc41 #4d9221 #276419",
  RdBu: "#67001f #b2182b #d6604d #f4a582 #fddbc7 #f7f7f7 #d1e5f0 #92c5de #4393c3 #2166ac #053061",
  RdGy: "#67001f #b2182b #d6604d #f4a582 #fddbc7 #ffffff #e0e0e0 #bababa #878787 #4d4d4d #1a1a1a",
  RdYlBu: "#a50026 #d73027 #f46d43 #fdae61 #fee090 #ffffbf #e0f3f8 #abd9e9 #74add1 #4575b4 #313695",
  RdYlGn: "#a50026 #d73027 #f46d43 #fdae61 #fee08b #ffffbf #d9ef8b #a6d96a #66bd63 #1a9850 #006837",
  Spectral: "#9e0142 #d53e4f #f46d43 #fdae61 #fee08b #ffffbf #e6f598 #abdda4 #66c2a5 #3288bd #5e4fa2",
  // From Matlab
  Heat: "#0000ff #00ffff #00ff00 #ffff00 #ff0000",
  Jet: "#000080 #0000ff #0080ff #00ffff #80ff80 #ffff00 #ff8000 #ff0000 #800000",
  Parula: "#352a87 #2450d0 #0a72de #128ad2 #06a4ca #1ab2b1 #51bd90 #92bf72 #c6bc5e #f6ba46 #f9d528 #f9fb0e",
  // From Matplotlib
  Magma: "#000004 #120d31 #331067 #5a167e #7e2482 #a3307e #c83e73 #e95462 #f97b5d #fea973 #fed395 #fcfdbf",
  // very close to CMRmap
  Inferno: "#000004 #140b34 #390963 #61136e #85216b #a92e5e #cb4149 #e65d2f #f78212 #fcae12 #f5db4c #fcffa4",
  Plasma: "#0d0887 #3e049c #6300a7 #8707a6 #a62098 #c03a83 #d5546e #e76f5a #f58c46 #fdae32 #fcd225 #f0f921",
  Viridis: "#440154 #482173 #433e85 #38598c #2d708e #25858e #1e9b8a #2ab07f #50c46a #86d549 #c2df23 #fde725",
  Cividis: "#00204d #00306f #2a406c #48526b #5e626e #727374 #878479 #9e9677 #b6a971 #d0be67 #ead357 #ffea46",
  // Other
  GitHub: "#eeeeee #c6e48b #7bc96f #239a3b #196127",
  Turbo: "#30123b #4454c3 #448ffe #1fc9dd #2aefa1 #7dff56 #c1f334 #f1cb3a #fe932a #ea4e0d #be2102 #7a0403",
  Grey: "#000000 #ffffff",
  Gray: "#000000 #ffffff"
};
exports.ColorPalettes = ColorPalettes;

for (var p in ColorPalettes) ColorPalettes[p] = ColorPalettes[p].split(" ");

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YELLOW_E = exports.YELLOW_D = exports.YELLOW_C = exports.YELLOW_B = exports.YELLOW_A = exports.YELLOW = exports.WHITE = exports.TRANSPARENT = exports.TEAL_E = exports.TEAL_D = exports.TEAL_C = exports.TEAL_B = exports.TEAL_A = exports.TEAL = exports.RED_E = exports.RED_D = exports.RED_C = exports.RED_B = exports.RED_A = exports.RED = exports.PURPLE_E = exports.PURPLE_D = exports.PURPLE_C = exports.PURPLE_B = exports.PURPLE_A = exports.PURPLE = exports.PINK = exports.ORANGE = exports.MAROON_E = exports.MAROON_D = exports.MAROON_C = exports.MAROON_B = exports.MAROON_A = exports.MAROON = exports.LIGHT_PINK = exports.LIGHT_GREY = exports.LIGHT_GRAY = exports.LIGHT_BROWN = exports.GREY_BROWN = exports.GREY = exports.GREEN_SCREEN = exports.GREEN_E = exports.GREEN_D = exports.GREEN_C = exports.GREEN_B = exports.GREEN_A = exports.GREEN = exports.GRAY = exports.GOLD_E = exports.GOLD_D = exports.GOLD_C = exports.GOLD_B = exports.GOLD_A = exports.GOLD = exports.DARK_GREY = exports.DARK_GRAY = exports.DARK_BROWN = exports.DARK_BLUE = exports.DARKER_GREY = exports.DARKER_GRAY = exports.BLUE_E = exports.BLUE_D = exports.BLUE_C = exports.BLUE_B = exports.BLUE_A = exports.BLUE = exports.BLACK = void 0;

/**
 * List of colors
 */
// from Manim
const DARK_BLUE = "#236b8e",
      DARK_BROWN = "#8b4513",
      LIGHT_BROWN = "#cd853f",
      BLUE_A = "#c7e9f1",
      BLUE_B = "#9cdceb",
      BLUE_C = "#58c4dd",
      BLUE_D = "#29abca",
      BLUE_E = "#1c758a",
      BLUE = "#58c4dd",
      TEAL_A = "#acead7",
      TEAL_B = "#76ddc0",
      TEAL_C = "#5cd0b3",
      TEAL_D = "#55c1a7",
      TEAL_E = "#49a88f",
      TEAL = "#5cd0b3",
      GREEN_A = "#c9e2ae",
      GREEN_B = "#a6cf8c",
      GREEN_C = "#83c167",
      GREEN_D = "#77b05d",
      GREEN_E = "#699c52",
      GREEN = "#83c167",
      YELLOW_A = "#fff1b6",
      YELLOW_B = "#ffea94",
      YELLOW_C = "#ffff00",
      YELLOW_D = "#f4d345",
      YELLOW_E = "#e8c11c",
      YELLOW = "#ffff00",
      GOLD_A = "#f7c797",
      GOLD_B = "#f9b775",
      GOLD_C = "#f0ac5f",
      GOLD_D = "#e1a158",
      GOLD_E = "#c78d46",
      GOLD = "#f0ac5f",
      RED_A = "#f7a1a3",
      RED_B = "#ff8080",
      RED_C = "#fc6255",
      RED_D = "#e65a4c",
      RED_E = "#cf5044",
      RED = "#fc6255",
      MAROON_A = "#ecabc1",
      MAROON_B = "#ec92ab",
      MAROON_C = "#c55f73",
      MAROON_D = "#a24d61",
      MAROON_E = "#94424f",
      MAROON = "#c55f73",
      PURPLE_A = "#caa3e8",
      PURPLE_B = "#b189c6",
      PURPLE_C = "#9a72ac",
      PURPLE_D = "#715582",
      PURPLE_E = "#644172",
      PURPLE = "#9a72ac",
      WHITE = "#ffffff",
      BLACK = "#000000",
      LIGHT_GRAY = "#bbbbbb",
      LIGHT_GREY = "#bbbbbb",
      GRAY = "#888888",
      GREY = "#888888",
      DARK_GREY = "#444444",
      DARK_GRAY = "#444444",
      DARKER_GREY = "#222222",
      DARKER_GRAY = "#222222",
      GREY_BROWN = "#736357",
      PINK = "#d147bd",
      LIGHT_PINK = "#dc75cd",
      GREEN_SCREEN = "#00ff00",
      ORANGE = "#ff862f",
      TRANSPARENT = "rgba(0,0,0,0)";
exports.TRANSPARENT = TRANSPARENT;
exports.ORANGE = ORANGE;
exports.GREEN_SCREEN = GREEN_SCREEN;
exports.LIGHT_PINK = LIGHT_PINK;
exports.PINK = PINK;
exports.GREY_BROWN = GREY_BROWN;
exports.DARKER_GRAY = DARKER_GRAY;
exports.DARKER_GREY = DARKER_GREY;
exports.DARK_GRAY = DARK_GRAY;
exports.DARK_GREY = DARK_GREY;
exports.GREY = GREY;
exports.GRAY = GRAY;
exports.LIGHT_GREY = LIGHT_GREY;
exports.LIGHT_GRAY = LIGHT_GRAY;
exports.BLACK = BLACK;
exports.WHITE = WHITE;
exports.PURPLE = PURPLE;
exports.PURPLE_E = PURPLE_E;
exports.PURPLE_D = PURPLE_D;
exports.PURPLE_C = PURPLE_C;
exports.PURPLE_B = PURPLE_B;
exports.PURPLE_A = PURPLE_A;
exports.MAROON = MAROON;
exports.MAROON_E = MAROON_E;
exports.MAROON_D = MAROON_D;
exports.MAROON_C = MAROON_C;
exports.MAROON_B = MAROON_B;
exports.MAROON_A = MAROON_A;
exports.RED = RED;
exports.RED_E = RED_E;
exports.RED_D = RED_D;
exports.RED_C = RED_C;
exports.RED_B = RED_B;
exports.RED_A = RED_A;
exports.GOLD = GOLD;
exports.GOLD_E = GOLD_E;
exports.GOLD_D = GOLD_D;
exports.GOLD_C = GOLD_C;
exports.GOLD_B = GOLD_B;
exports.GOLD_A = GOLD_A;
exports.YELLOW = YELLOW;
exports.YELLOW_E = YELLOW_E;
exports.YELLOW_D = YELLOW_D;
exports.YELLOW_C = YELLOW_C;
exports.YELLOW_B = YELLOW_B;
exports.YELLOW_A = YELLOW_A;
exports.GREEN = GREEN;
exports.GREEN_E = GREEN_E;
exports.GREEN_D = GREEN_D;
exports.GREEN_C = GREEN_C;
exports.GREEN_B = GREEN_B;
exports.GREEN_A = GREEN_A;
exports.TEAL = TEAL;
exports.TEAL_E = TEAL_E;
exports.TEAL_D = TEAL_D;
exports.TEAL_C = TEAL_C;
exports.TEAL_B = TEAL_B;
exports.TEAL_A = TEAL_A;
exports.BLUE = BLUE;
exports.BLUE_E = BLUE_E;
exports.BLUE_D = BLUE_D;
exports.BLUE_C = BLUE_C;
exports.BLUE_B = BLUE_B;
exports.BLUE_A = BLUE_A;
exports.LIGHT_BROWN = LIGHT_BROWN;
exports.DARK_BROWN = DARK_BROWN;
exports.DARK_BLUE = DARK_BLUE;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.X_SMALL = exports.X_LARGE = exports.XX_SMALL = exports.XX_LARGE = exports.XXX_LARGE = exports.ULTRA_EXPANDED = exports.ULTRA_CONDENSED = exports.TOP = exports.START = exports.SQUARE = exports.SMALLER = exports.SMALL = exports.SEMI_EXPANDED = exports.SEMI_CONDENSED = exports.ROUND = exports.RIGHT = exports.OBLIQUE = exports.NORMAL = exports.MITER = exports.MILTER = exports.MIDDLE = exports.MEDIUM = exports.LEFT = exports.LARGER = exports.LARGE = exports.ITALIC = exports.IDEOGRAPHIC = exports.HANGING = exports.EXTRA_EXPANDED = exports.EXTRA_CONDENSED = exports.EXPANDED = exports.END = exports.CONDENSED = exports.CENTER = exports.BUTT = exports.BOTTOM = exports.BEVEL = exports.ALPHABETIC = void 0;
const BUTT = "butt",
      SQUARE = "square",
      ROUND = "round",
      MILTER = "milter",
      BEVEL = "bevel",
      MITER = "miter",
      LEFT = "left",
      RIGHT = "right",
      CENTER = "center",
      START = "start",
      END = "end",
      TOP = "top",
      HANGING = "hanging",
      MIDDLE = "middle",
      ALPHABETIC = "alphabetic",
      IDEOGRAPHIC = "ideographic",
      BOTTOM = "bottom",
      // font stretch properties
ULTRA_CONDENSED = "ultra-condensed",
      // 50%
EXTRA_CONDENSED = "extra-condensed",
      // 62.5%
CONDENSED = "condensed",
      // 75%
SEMI_CONDENSED = "semi-condensed",
      // 87.5%
NORMAL = "normal",
      // 100%
SEMI_EXPANDED = "semi-expanded",
      // 112.5%
EXPANDED = "expanded",
      // 125%
EXTRA_EXPANDED = "extra-expanded",
      // 150%
ULTRA_EXPANDED = "ultra-expanded",
      // 200%
// font size properties
XX_SMALL = "xx-small",
      X_SMALL = "x-small",
      SMALL = "small",
      MEDIUM = "medium",
      LARGE = "large",
      X_LARGE = "x-large",
      XX_LARGE = "xx-large",
      XXX_LARGE = "xxx-large",
      LARGER = "larger",
      SMALLER = "smaller",
      // font style properties
ITALIC = "italic",
      OBLIQUE = "oblique";
exports.OBLIQUE = OBLIQUE;
exports.ITALIC = ITALIC;
exports.SMALLER = SMALLER;
exports.LARGER = LARGER;
exports.XXX_LARGE = XXX_LARGE;
exports.XX_LARGE = XX_LARGE;
exports.X_LARGE = X_LARGE;
exports.LARGE = LARGE;
exports.MEDIUM = MEDIUM;
exports.SMALL = SMALL;
exports.X_SMALL = X_SMALL;
exports.XX_SMALL = XX_SMALL;
exports.ULTRA_EXPANDED = ULTRA_EXPANDED;
exports.EXTRA_EXPANDED = EXTRA_EXPANDED;
exports.EXPANDED = EXPANDED;
exports.SEMI_EXPANDED = SEMI_EXPANDED;
exports.NORMAL = NORMAL;
exports.SEMI_CONDENSED = SEMI_CONDENSED;
exports.CONDENSED = CONDENSED;
exports.EXTRA_CONDENSED = EXTRA_CONDENSED;
exports.ULTRA_CONDENSED = ULTRA_CONDENSED;
exports.BOTTOM = BOTTOM;
exports.IDEOGRAPHIC = IDEOGRAPHIC;
exports.ALPHABETIC = ALPHABETIC;
exports.MIDDLE = MIDDLE;
exports.HANGING = HANGING;
exports.TOP = TOP;
exports.END = END;
exports.START = START;
exports.CENTER = CENTER;
exports.RIGHT = RIGHT;
exports.LEFT = LEFT;
exports.MITER = MITER;
exports.BEVEL = BEVEL;
exports.MILTER = MILTER;
exports.ROUND = ROUND;
exports.SQUARE = SQUARE;
exports.BUTT = BUTT;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TWO_PI = exports.TIERCE_PI = exports.TAU = exports.SQRT2 = exports.RAD = exports.QUATER_PI = exports.PI = exports.PHI = exports.LN2 = exports.LN10 = exports.HALF_PI = exports.E = exports.DEG = void 0;
const E = 2.71828182845904523,
      LN2 = 0.6931471805599453,
      LN10 = 2.30258509299404568,
      PI = 3.14159265358979323,
      HALF_PI = 1.57079632679489661,
      TIERCE_PI = 1.04719755119659774,
      QUATER_PI = 0.7853981633974483,
      TAU = 6.28318530717958647,
      TWO_PI = 6.28318530717958647,
      SQRT2 = 1.41421356237309504,
      PHI = 1.618033988749894,
      // conversion factors
DEG = Math.PI / 180,
      // degree to radian
RAD = 180 / Math.PI; // radian to degree

exports.RAD = RAD;
exports.DEG = DEG;
exports.PHI = PHI;
exports.SQRT2 = SQRT2;
exports.TWO_PI = TWO_PI;
exports.TAU = TAU;
exports.QUATER_PI = QUATER_PI;
exports.TIERCE_PI = TIERCE_PI;
exports.HALF_PI = HALF_PI;
exports.PI = PI;
exports.LN10 = LN10;
exports.LN2 = LN2;
exports.E = E;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moccasin = exports.mistyrose = exports.mintcream = exports.midnightblue = exports.mediumvioletred = exports.mediumturquoise = exports.mediumspringgreen = exports.mediumslateblue = exports.mediumseagreen = exports.mediumpurple = exports.mediumorchid = exports.mediumblue = exports.mediumaquamarine = exports.maroon = exports.magenta = exports.linen = exports.limegreen = exports.lime = exports.lightyellow = exports.lightsteelblue = exports.lightslategrey = exports.lightslategray = exports.lightskyblue = exports.lightseagreen = exports.lightsalmon = exports.lightpink = exports.lightgrey = exports.lightgreen = exports.lightgray = exports.lightgoldenrodyellow = exports.lightcyan = exports.lightcoral = exports.lightblue = exports.lemonchiffon = exports.lawngreen = exports.lavenderblush = exports.lavender = exports.khaki = exports.ivory = exports.indigo = exports.indianred = exports.hotpink = exports.honeydew = exports.grey = exports.greenyellow = exports.green = exports.gray = exports.goldenrod = exports.gold = exports.ghostwhite = exports.gainsboro = exports.fuchsia = exports.forestgreen = exports.floralwhite = exports.firebrick = exports.dodgerblue = exports.dimgrey = exports.dimgray = exports.deepskyblue = exports.deeppink = exports.darkviolet = exports.darkturquoise = exports.darkslategrey = exports.darkslategray = exports.darkslateblue = exports.darkseagreen = exports.darksalmon = exports.darkred = exports.darkorchid = exports.darkorange = exports.darkolivegreen = exports.darkmagenta = exports.darkkhaki = exports.darkgrey = exports.darkgreen = exports.darkgray = exports.darkgoldenrod = exports.darkcyan = exports.darkblue = exports.cyan = exports.crimson = exports.cornsilk = exports.cornflowerblue = exports.coral = exports.chocolate = exports.chartreuse = exports.cadetblue = exports.burlywood = exports.brown = exports.blueviolet = exports.blue = exports.blanchedalmond = exports.black = exports.bisque = exports.beige = exports.azure = exports.aquamarine = exports.aqua = exports.antiquewhite = exports.aliceblue = void 0;
exports.yellowgreen = exports.yellow = exports.whitesmoke = exports.white = exports.wheat = exports.violet = exports.turquoise = exports.tomato = exports.thistle = exports.teal = exports.tan = exports.steelblue = exports.springgreen = exports.snow = exports.slategrey = exports.slategray = exports.slateblue = exports.skyblue = exports.silver = exports.sienna = exports.seashell = exports.seagreen = exports.sandybrown = exports.salmon = exports.saddlebrown = exports.royalblue = exports.rosybrown = exports.red = exports.rebeccapurple = exports.purple = exports.powderblue = exports.plum = exports.pink = exports.peru = exports.peachpuff = exports.papayawhip = exports.palevioletred = exports.paleturquoise = exports.palegreen = exports.palegoldenrod = exports.orchid = exports.orangered = exports.orange = exports.olivedrab = exports.olive = exports.oldlace = exports.navy = exports.navajowhite = exports.moccasin = exports.mistyrose = exports.mintcream = exports.midnightblue = exports.mediumvioletred = exports.mediumturquoise = exports.mediumspringgreen = exports.mediumslateblue = exports.mediumseagreen = exports.mediumpurple = exports.mediumorchid = exports.mediumblue = exports.mediumaquamarine = exports.maroon = exports.magenta = exports.linen = exports.limegreen = exports.lime = exports.lightyellow = exports.lightsteelblue = exports.lightslategrey = exports.lightslategray = exports.lightskyblue = exports.lightseagreen = exports.lightsalmon = exports.lightpink = exports.lightgrey = exports.lightgreen = exports.lightgray = exports.lightgoldenrodyellow = exports.lightcyan = exports.lightcoral = exports.lightblue = exports.lemonchiffon = exports.lawngreen = exports.lavenderblush = exports.lavender = exports.khaki = exports.ivory = exports.indigo = exports.indianred = exports.hotpink = exports.honeydew = exports.grey = exports.greenyellow = exports.green = exports.gray = exports.goldenrod = exports.gold = exports.ghostwhite = exports.gainsboro = exports.fuchsia = exports.forestgreen = exports.floralwhite = exports.firebrick = exports.dodgerblue = exports.dimgrey = exports.dimgray = exports.deepskyblue = exports.deeppink = exports.darkviolet = exports.darkturquoise = exports.darkslategrey = exports.darkslategray = exports.darkslateblue = exports.darkseagreen = exports.darksalmon = exports.darkred = exports.darkorchid = exports.darkorange = exports.darkolivegreen = exports.darkmagenta = exports.darkkhaki = exports.darkgrey = exports.darkgreen = exports.darkgray = exports.darkgoldenrod = exports.darkcyan = exports.darkblue = exports.cyan = exports.crimson = exports.cornsilk = exports.cornflowerblue = exports.coral = exports.chocolate = exports.chartreuse = exports.cadetblue = exports.burlywood = exports.brown = exports.blueviolet = exports.blue = exports.blanchedalmond = exports.black = exports.bisque = exports.beige = exports.azure = exports.aquamarine = exports.aqua = exports.antiquewhite = exports.aliceblue = void 0;
// Named css colors
const aliceblue = "#f0f8ff",
      antiquewhite = "#faebd7",
      aqua = "#00ffff",
      aquamarine = "#7fffd4",
      azure = "#f0ffff",
      beige = "#f5f5dc",
      bisque = "#ffe4c4",
      black = "#000000",
      blanchedalmond = "#ffebcd",
      blue = "#0000ff",
      blueviolet = "#8a2be2",
      brown = "#a52a2a",
      burlywood = "#deb887",
      cadetblue = "#5f9ea0",
      chartreuse = "#7fff00",
      chocolate = "#d2691e",
      coral = "#ff7f50",
      cornflowerblue = "#6495ed",
      cornsilk = "#fff8dc",
      crimson = "#dc143c",
      cyan = "#00ffff",
      darkblue = "#00008b",
      darkcyan = "#008b8b",
      darkgoldenrod = "#b8860b",
      darkgray = "#a9a9a9",
      darkgreen = "#006400",
      darkgrey = "#a9a9a9",
      darkkhaki = "#bdb76b",
      darkmagenta = "#8b008b",
      darkolivegreen = "#556b2f",
      darkorange = "#ff8c00",
      darkorchid = "#9932cc",
      darkred = "#8b0000",
      darksalmon = "#e9967a",
      darkseagreen = "#8fbc8f",
      darkslateblue = "#483d8b",
      darkslategray = "#2f4f4f",
      darkslategrey = "#2f4f4f",
      darkturquoise = "#00ced1",
      darkviolet = "#9400d3",
      deeppink = "#ff1493",
      deepskyblue = "#00bfff",
      dimgray = "#696969",
      dimgrey = "#696969",
      dodgerblue = "#1e90ff",
      firebrick = "#b22222",
      floralwhite = "#fffaf0",
      forestgreen = "#228b22",
      fuchsia = "#ff00ff",
      gainsboro = "#dcdcdc",
      ghostwhite = "#f8f8ff",
      gold = "#ffd700",
      goldenrod = "#daa520",
      gray = "#808080",
      green = "#008000",
      greenyellow = "#adff2f",
      grey = "#808080",
      honeydew = "#f0fff0",
      hotpink = "#ff69b4",
      indianred = "#cd5c5c",
      indigo = "#4b0082",
      ivory = "#fffff0",
      khaki = "#f0e68c",
      lavender = "#e6e6fa",
      lavenderblush = "#fff0f5",
      lawngreen = "#7cfc00",
      lemonchiffon = "#fffacd",
      lightblue = "#add8e6",
      lightcoral = "#f08080",
      lightcyan = "#e0ffff",
      lightgoldenrodyellow = "#fafad2",
      lightgray = "#d3d3d3",
      lightgreen = "#90ee90",
      lightgrey = "#d3d3d3",
      lightpink = "#ffb6c1",
      lightsalmon = "#ffa07a",
      lightseagreen = "#20b2aa",
      lightskyblue = "#87cefa",
      lightslategray = "#778899",
      lightslategrey = "#778899",
      lightsteelblue = "#b0c4de",
      lightyellow = "#ffffe0",
      lime = "#00ff00",
      limegreen = "#32cd32",
      linen = "#faf0e6",
      magenta = "#ff00ff",
      maroon = "#800000",
      mediumaquamarine = "#66cdaa",
      mediumblue = "#0000cd",
      mediumorchid = "#ba55d3",
      mediumpurple = "#9370db",
      mediumseagreen = "#3cb371",
      mediumslateblue = "#7b68ee",
      mediumspringgreen = "#00fa9a",
      mediumturquoise = "#48d1cc",
      mediumvioletred = "#c71585",
      midnightblue = "#191970",
      mintcream = "#f5fffa",
      mistyrose = "#ffe4e1",
      moccasin = "#ffe4b5",
      navajowhite = "#ffdead",
      navy = "#000080",
      oldlace = "#fdf5e6",
      olive = "#808000",
      olivedrab = "#6b8e23",
      orange = "#ffa500",
      orangered = "#ff4500",
      orchid = "#da70d6",
      palegoldenrod = "#eee8aa",
      palegreen = "#98fb98",
      paleturquoise = "#afeeee",
      palevioletred = "#db7093",
      papayawhip = "#ffefd5",
      peachpuff = "#ffdab9",
      peru = "#cd853f",
      pink = "#ffc0cb",
      plum = "#dda0dd",
      powderblue = "#b0e0e6",
      purple = "#800080",
      rebeccapurple = "#663399",
      red = "#ff0000",
      rosybrown = "#bc8f8f",
      royalblue = "#4169e1",
      saddlebrown = "#8b4513",
      salmon = "#fa8072",
      sandybrown = "#f4a460",
      seagreen = "#2e8b57",
      seashell = "#fff5ee",
      sienna = "#a0522d",
      silver = "#c0c0c0",
      skyblue = "#87ceeb",
      slateblue = "#6a5acd",
      slategray = "#708090",
      slategrey = "#708090",
      snow = "#fffafa",
      springgreen = "#00ff7f",
      steelblue = "#4682b4",
      tan = "#d2b48c",
      teal = "#008080",
      thistle = "#d8bfd8",
      tomato = "#ff6347",
      turquoise = "#40e0d0",
      violet = "#ee82ee",
      wheat = "#f5deb3",
      white = "#ffffff",
      whitesmoke = "#f5f5f5",
      yellow = "#ffff00",
      yellowgreen = "#9acd32";
exports.yellowgreen = yellowgreen;
exports.yellow = yellow;
exports.whitesmoke = whitesmoke;
exports.white = white;
exports.wheat = wheat;
exports.violet = violet;
exports.turquoise = turquoise;
exports.tomato = tomato;
exports.thistle = thistle;
exports.teal = teal;
exports.tan = tan;
exports.steelblue = steelblue;
exports.springgreen = springgreen;
exports.snow = snow;
exports.slategrey = slategrey;
exports.slategray = slategray;
exports.slateblue = slateblue;
exports.skyblue = skyblue;
exports.silver = silver;
exports.sienna = sienna;
exports.seashell = seashell;
exports.seagreen = seagreen;
exports.sandybrown = sandybrown;
exports.salmon = salmon;
exports.saddlebrown = saddlebrown;
exports.royalblue = royalblue;
exports.rosybrown = rosybrown;
exports.red = red;
exports.rebeccapurple = rebeccapurple;
exports.purple = purple;
exports.powderblue = powderblue;
exports.plum = plum;
exports.pink = pink;
exports.peru = peru;
exports.peachpuff = peachpuff;
exports.papayawhip = papayawhip;
exports.palevioletred = palevioletred;
exports.paleturquoise = paleturquoise;
exports.palegreen = palegreen;
exports.palegoldenrod = palegoldenrod;
exports.orchid = orchid;
exports.orangered = orangered;
exports.orange = orange;
exports.olivedrab = olivedrab;
exports.olive = olive;
exports.oldlace = oldlace;
exports.navy = navy;
exports.navajowhite = navajowhite;
exports.moccasin = moccasin;
exports.mistyrose = mistyrose;
exports.mintcream = mintcream;
exports.midnightblue = midnightblue;
exports.mediumvioletred = mediumvioletred;
exports.mediumturquoise = mediumturquoise;
exports.mediumspringgreen = mediumspringgreen;
exports.mediumslateblue = mediumslateblue;
exports.mediumseagreen = mediumseagreen;
exports.mediumpurple = mediumpurple;
exports.mediumorchid = mediumorchid;
exports.mediumblue = mediumblue;
exports.mediumaquamarine = mediumaquamarine;
exports.maroon = maroon;
exports.magenta = magenta;
exports.linen = linen;
exports.limegreen = limegreen;
exports.lime = lime;
exports.lightyellow = lightyellow;
exports.lightsteelblue = lightsteelblue;
exports.lightslategrey = lightslategrey;
exports.lightslategray = lightslategray;
exports.lightskyblue = lightskyblue;
exports.lightseagreen = lightseagreen;
exports.lightsalmon = lightsalmon;
exports.lightpink = lightpink;
exports.lightgrey = lightgrey;
exports.lightgreen = lightgreen;
exports.lightgray = lightgray;
exports.lightgoldenrodyellow = lightgoldenrodyellow;
exports.lightcyan = lightcyan;
exports.lightcoral = lightcoral;
exports.lightblue = lightblue;
exports.lemonchiffon = lemonchiffon;
exports.lawngreen = lawngreen;
exports.lavenderblush = lavenderblush;
exports.lavender = lavender;
exports.khaki = khaki;
exports.ivory = ivory;
exports.indigo = indigo;
exports.indianred = indianred;
exports.hotpink = hotpink;
exports.honeydew = honeydew;
exports.grey = grey;
exports.greenyellow = greenyellow;
exports.green = green;
exports.gray = gray;
exports.goldenrod = goldenrod;
exports.gold = gold;
exports.ghostwhite = ghostwhite;
exports.gainsboro = gainsboro;
exports.fuchsia = fuchsia;
exports.forestgreen = forestgreen;
exports.floralwhite = floralwhite;
exports.firebrick = firebrick;
exports.dodgerblue = dodgerblue;
exports.dimgrey = dimgrey;
exports.dimgray = dimgray;
exports.deepskyblue = deepskyblue;
exports.deeppink = deeppink;
exports.darkviolet = darkviolet;
exports.darkturquoise = darkturquoise;
exports.darkslategrey = darkslategrey;
exports.darkslategray = darkslategray;
exports.darkslateblue = darkslateblue;
exports.darkseagreen = darkseagreen;
exports.darksalmon = darksalmon;
exports.darkred = darkred;
exports.darkorchid = darkorchid;
exports.darkorange = darkorange;
exports.darkolivegreen = darkolivegreen;
exports.darkmagenta = darkmagenta;
exports.darkkhaki = darkkhaki;
exports.darkgrey = darkgrey;
exports.darkgreen = darkgreen;
exports.darkgray = darkgray;
exports.darkgoldenrod = darkgoldenrod;
exports.darkcyan = darkcyan;
exports.darkblue = darkblue;
exports.cyan = cyan;
exports.crimson = crimson;
exports.cornsilk = cornsilk;
exports.cornflowerblue = cornflowerblue;
exports.coral = coral;
exports.chocolate = chocolate;
exports.chartreuse = chartreuse;
exports.cadetblue = cadetblue;
exports.burlywood = burlywood;
exports.brown = brown;
exports.blueviolet = blueviolet;
exports.blue = blue;
exports.blanchedalmond = blanchedalmond;
exports.black = black;
exports.bisque = bisque;
exports.beige = beige;
exports.azure = azure;
exports.aquamarine = aquamarine;
exports.aqua = aqua;
exports.antiquewhite = antiquewhite;
exports.aliceblue = aliceblue;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawImage = drawImage;
exports.loadImage = loadImage;
exports.loadImagePromise = loadImagePromise;
exports.pixel = pixel;

var _main = require("../main.js");

/**
 * This module contains function for image manipulation.
 * @module image
 */

/**
 * Draws a given image in canvas.
 * See more about the parameters : {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage}
 * @param {CanvasImageData} image image to draw
 */
function drawImage(img) {
  let ctx = _main.C.workingCanvas,
      x,
      y;

  if (arguments.length < 6) {
    x = arguments[1];
    y = arguments[2];
  } else {
    x = arguments[5];
    y = arguments[6];
  }

  if (ctx.yAxisInverted) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0, ...Array.prototype.slice.call(arguments, 3));
    ctx.restore();
  } else {
    ctx.drawImage(img, x, y, ...Array.prototype.slice.call(arguments, 3));
  }
}
/**
 * Draws a pixel
 *
 * @param {number} x x-coordinate of pixel
 * @param {number} y y-coordinate of pixel
 * @param {string} color color of pixel
 */


function pixel(x, y, color, size) {
  let ctx = _main.C.workingCanvas;
  if (color) ctx.fillStyle = color;
  if (!size) size = 1 / ctx.dpr;
  ctx.fillRect(x, y, size, size);
}
/**
 * Loads a image from given url. I
 * @param {string} url url of image
 * @param {function} [resolver] function to call when image is loaded
 * @param {function} [fallback] function to call when image fails to loaded
 * @returns {Image} image. This may not be loaded yet.
 */


function loadImage(url, resolver, fallback) {
  var img = new Image(); // Create new img element

  img.src = url;

  if (typeof resolver == "function") {
    img.addEventListener("load", () => resolver(img), false);
  }

  if (typeof fallback == "function") {
    img.addEventListener("error", evt => fallback(evt, img), false);
  }

  return img;
}
/**
 * loads a image from given url and returns a promise.
 * @param {string} url url of image
 * @returns {Promise} promise that resolves to image
 */


function loadImagePromise(url) {
  return new Promise((resolve, reject) => {
    loadImage(url, resolve, reject);
  });
}

},{"../main.js":17}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPixelColor = getPixelColor;
exports.hasNeighbourColor = hasNeighbourColor;
exports.imageDataToColorArray = imageDataToColorArray;
exports.imageToData = imageToData;
exports.replaceColorInImage = replaceColorInImage;

var _color_reader = require("../color/color_reader.js");

var _main = require("../main.js");

/**
 * returns color at a given point from ImageData
 *
 * @param {ImageData} pixels
 * @param {number} x x-coordinate of point
 * @param {number} y y-coordinate of point
 * @return {array <array<number>>} array of color components [r, g, b, a]
 */
function getPixelColor(pixels, x, y) {
  let index = pixels.width * y + x;
  return pixels.data.subarray(index, index + 4);
}
/**
 * Convert image data to 2d array of colors.
 *
 * @param {ImageData} pixels
 * @returns {array<array>} 2d array of colors
 */


function imageDataToColorArray(pixels) {
  let w = pixels.width,
      h = pixels.height,
      dat = Array.from(pixels.data),
      image2D = [];

  for (var y = 0; y < h; y++) {
    image2D.push([]);

    for (var x = 0; x < w; x++) {
      let i = h * y + x,
          r = dat[i],
          g = dat[i + 1],
          b = dat[i + 2],
          a = dat[i + 3];
      image2D[y].push([r, g, b, a]);
    }
  }

  return image2D;
}
/**
 * Returns if neighbor pixels have the same color as given.
 *
 * @param {array<number>} color color to compare with
 * @param {ImageData} pixels image data
 * @param {number} x x-coordinate of point
 * @param {number} y y-coordinate of point
 * @return {boolean}
 */


function hasNeighbourColor(color, pixels, x, y) {
  let dat = pixels.data,
      w = pixels.width;

  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i !== x || j !== y) {
        let index = w * y + x,
            neighbourColor = dat.subarray(index, index + 4);

        if (neighbourColor[0] === color[0] && neighbourColor[1] === color[1] && neighbourColor[2] === color[2] && neighbourColor[3] === color[3]) {
          return true;
        }
      }
    }
  }

  return false;
} // TODO: Under construction
//function createMapOfLetter(letter) {
//	let img = Image.new("RGB", (230, 230), "white"),
//		d = ImageDraw.Draw(img),
//		font = ImageFont.truetype("arial.ttf", 300);
//	d.text((15, -50), letter, (fill = (0, 0, 0)), (font = font));
//
//	let pixels = img.load(),
//		ans = [];
//
//	for (let x = 0; x < 230; x++) {
//		for (let y = 0; y < 230; y++) {
//			if (pixels[(x, y)] == (0, 0, 0)) {
//				if (
//					hasNeighbourColor((255, 255, 255), pixels, x, y) &&
//					!hasNeighbourColor((255, 0, 0), pixels, x, y)
//				) {
//					pixels[(x, y)] = (255, 0, 0);
//					ans.append([x, y]);
//				}
//			}
//		}
//	}
//
//	return ans;
//}

/**
 * Replaces a color by another color in given image.
 * @param {ImageData} image image to be processed
 * @param {*} toReplace color to be replaced
 * @param {*} replaced replaced color
 * @param {boolean} [matchAlpha = false] whether to check if alpha channel is same as that of toReplace.
 * @param {number} [tolerance = 0] minimum difference between each color channel
 */


function replaceColorInImage(image, toReplace, replaced, matchAlpha = false, tolerance = 0) {
  let data = image.data,
      newData = _main.C.workingCanvas.createImageData(image.width, image.height);

  const [r1, g1, b1, a1] = (0, _color_reader.readColor)(toReplace, true);
  const [r2, g2, b2, a2] = (0, _color_reader.readColor)(replaced, true);
  let nonOccurances = 0;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i],
        g = data[i + 1],
        b = data[i + 2],
        a = data[i + 3];

    if (Math.abs(r - r1) <= tolerance && Math.abs(g - g1) <= tolerance && Math.abs(b - b1) <= tolerance && (matchAlpha ? Math.abs(a - a1) <= tolerance : true)) {
      newData.data[i] = r2;
      newData.data[i + 1] = g2;
      newData.data[i + 2] = b2;
      if (matchAlpha) newData.data[i + 3] = a2;else newData.data[i + 3] = 255;
    } else {
      newData.data[i] = r;
      newData.data[i + 1] = g;
      newData.data[i + 2] = b;
      if (matchAlpha) newData.data[i + 3] = a;else newData.data[i + 3] = 255;
      nonOccurances++;
    }
  }

  console.log(nonOccurances);
  return newData;
}
/**
 * Converts a image to ImageData.
 * @param {CanvasImageData} image image
 * @param {number} x x-coordinate of starting point in image
 * @param {number} y y-coordinate of starting point in image
 * @param {number} [width = image.width] width of area to be covered
 * @param {number} [height = image.height] height of area to be covered
 * @param {boolean} [smoothen = false] whether to capture a smoothened the image
 */


function imageToData(image, x, y, width, height, smoothen = false) {
  let cvs = document.createElement("canvas");
  let ctx = cvs.getContext("2d");
  let dpr = _main.C.workingCanvas.dpr;
  x = x * dpr || 0;
  y = y * dpr || 0;
  cvs.width = width = (isNaN(width) ? image.width : width) * dpr;
  cvs.height = height = (isNaN(height) ? image.height : height) * dpr;
  ctx.imageSmoothingEnabled = smoothen;
  ctx.drawImage(image, 0, 0, width, height);
  return ctx.getImageData(x, y, width, height);
}

},{"../color/color_reader.js":6,"../main.js":17}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.C = C;

var _utils = require("./utils.js");

/**
 * Main Function
 *
 * @param {function} fx codes to exeecute
 * @param {HTMLElement} [container=document.body] container for the drawings
 * @param {object} [cfgs={}] configurations
 */
function C(fx, container, cfgs = {}) {
  const defaultConfigs = {
    width: 200,
    // width of canvas multiplied by dpr
    height: 200,
    // height of canvas  multiplied by dpr
    dpr: Math.ceil(window.devicePixelRatio || 1),
    // device pixel ratio for clear drawings
    // states
    doFill: true,
    doStroke: true,
    pathStarted: false,
    yAxisInverted: false,
    pauseAnimations: false,
    netRotation: 0,
    currentLoop: undefined,
    currentLoopName: undefined,
    textAlign: "start",
    textBaseline: "alphabetic",
    // color stuff
    fillStyle: "#ffffff",
    background: "#ffffff",
    strokeStyle: "#000000",
    colorMode: "rgba",
    lineWidth: 1,
    // font properties
    fontSize: "20px",
    fontFamily: "serif",
    fontStyle: "normal",
    fontVariant: "normal",
    fontWeight: "normal",
    fontStretch: "normal",
    lineHeight: 1.2,
    font: "20px serif",
    // event listeners
    // mouse
    onclick: undefined,
    onmousemove: undefined,
    onmouseout: undefined,
    onmousedown: undefined,
    onmouseup: undefined,
    onmousewheel: undefined,
    // key
    onkeydown: undefined,
    onkeyup: undefined,
    onkeypress: undefined,
    oncopy: undefined,
    onpaste: undefined,
    oncut: undefined,
    // touch
    ontouchstart: undefined,
    ontouchmove: undefined,
    ontouchend: undefined,
    ontouchcancel: undefined,
    // scale
    onresize: undefined,
    // dom
    onblur: undefined,
    onfocus: undefined,
    onchange: undefined,
    oninput: undefined,
    onload: undefined,
    onscroll: undefined,
    onwheel: undefined,
    onpointerdown: undefined,
    onpointermove: undefined,
    onpointerup: undefined,
    onpointercancel: undefined,
    onpointerover: undefined,
    onpointerout: undefined,
    onpointerenter: undefined,
    onpointerleave: undefined,
    onfullscreenchange: undefined
  }; // assign configs

  const configs = (0, _utils.applyDefault)(defaultConfigs, cfgs); // initialize canvas

  let canvas = C.makeCanvas(configs);

  if (typeof container === "string") {
    container = document.querySelector(container);
  } else if (!(container instanceof HTMLElement)) {
    container = document.body;
  }

  if (typeof container.CID !== "number") {
    container.CID = 1;
  }

  let parentCID = container.CID,
      parentName = container.id || container.classList.item(0),
      canvasName = configs.name;

  if (typeof canvasName == "string") {
    const cvs = container.querySelector("#" + canvasName);

    if (cvs instanceof HTMLElement) {
      // if already exist
      canvas = cvs;
      prepareCanvas();
      fx();
      return;
    }
  } else {
    canvasName = parentName + "-C-" + parentCID;
    configs.name = canvasName;
  }

  function prepareCanvas() {
    // add additional information to rendererContext
    C.resizeCanvas(canvas, configs);
    canvas.context = Object.assign(canvas.getContext("2d"), configs);
    canvas.context.setTransform(configs.dpr, 0, 0, configs.dpr, 0, 0);
    C.workingCanvas = canvas.context;
    C.workingCanvas.container = container;
    C.workingCanvas.savedStates = defaultConfigs;
    C.workingCanvas.delayedAnimations = [];
  } // set canvas's id and class to its name


  canvas.id = canvasName;
  canvas.classList.add(canvasName); // add canvas to container

  container.appendChild(canvas);
  prepareCanvas();
  C.canvasList[canvasName] = canvas.context;
  fx();
}
/**
 * List of available canvases
 * @type {Object}
 */


C.canvasList = {}; // C.delayedAnimations = [];

/**
 * Number of canvases
 * @type {Number}
 */

C.nameID = 0;
/**
 * Current working canvas
 * @type {CanvasRenderingContext2D}
 */

C.workingCanvas = {}; // index of current working canvas in `C.canvasList`

/**
 * Current working canvas
 * @type {HTMLElement}
 */

C.workingCanvas.container = {}; //container of canvas

/**
 * Default configurations
 */

/**
 * return inner width of container tag
 * @param {HTMLElement} [container=document.body]
 * @returns {Number}
 */

C.getWindowWidth = function (container = document.body) {
  const cs = window.getComputedStyle(container);
  return parseInt(cs.width) - parseInt(cs.paddingRight) - parseInt(cs.paddingLeft);
};
/**
 * Set width and height attribute of canvas element to the given values in `configs`
 * and scales CSS width and height to DPR
 *
 * @param {HTMLCanvasElement} cvs
 * @param {Object} configs configurations. Values needed :
 * @param {number} configs.dpr Device pixel ratio
 * @param {number} configs.width Width in pixels
 * @param {number} configs.height Height in pixels
 */


C.resizeCanvas = function (cvs, configs) {
  const width = configs.width;
  const height = configs.height;
  const dpr = configs.dpr || window.devicePixelRatio;
  cvs.style.width = width + "px";
  cvs.style.height = height + "px";
  cvs.width = dpr * width;
  cvs.height = dpr * height;
};
/**
 * Returns a canvas element with given params
 *
 * @param {Object} configs
 * @returns {HTMLCanvasElement}
 */


C.makeCanvas = function (configs) {
  const cvs = document.createElement("canvas");
  this.resizeCanvas(cvs, configs);
  return cvs;
};
/**
 * Add extension to window and C extension list
 *
 * @param {Object} extObj
 * @param {boolean} editable warn the edit of functions
 */


C.addExtension = function (extObj) {
  (0, _utils.defineProperties)(extObj, window);
  (0, _utils.defineProperties)(extObj, C.extensions, false);
};
/**
 * @type {boolean}
 */


C.debugAnimations = false; // whther to debug animations

/**
 * Whehter to debug animations
 *
 * @param {boolean} bool boolean
 */

C.debug = function (bool) {
  if (typeof bool !== "boolean") C.debugAnimations = true;else C.debugAnimations = bool;
};
/**
 * Returns the current working canvas or the canvas with given name.
 * With this you can access native JS canvas functions for better performance
 * @param {string} name Name of canvas
 * @returns {CanvasRenderingContext2D} Canvas context
 */


C.getCanvas = function (name) {
  return C.canvasList[name] || C.workingCanvas;
};
/**
 * Log of animations
 * @type {array<object>}
 */


C._ANIMATIONLOG_ = [];
/**
 * Set of functions
 * @type {object}
 */

C.functions = {};
C.COLORLIST = {}; //list of colors
// register to window

window["C"] = C;

},{"./utils.js":33}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gcd = gcd;
exports.gcdArray = gcdArray;
exports.lcm = lcm;
exports.lcmArray = lcmArray;

/**
 * Computes GCD (Greatest Common Divisor) or HCF (Highest Common Factor) of two numbers
 *
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
function gcd(a, b) {
  while (b != 0) {
    let ra = b;
    b = a % b;
    a = ra;
  }

  return a;
}
/**
 * Returns greatest common divisor of a list of integers.
 *
 * @return {number}
 */


function gcdArray(list) {
  let array = Array.isArray(list) ? list : arguments,
      n = array[0];

  for (let i = 1; i < array.length; ++i) n = gcd(array[i], n);

  return n;
}
/**
 * Computes LCM (Least Common Multiple) of two numbers
 *
 * @param {number} a
 * @param {number} b
 * @return {number}
 */


function lcm(a, b) {
  return a * b / gcd(a, b);
}
/**
 * Returns least common multiple of a list of integers given explictly or as array.
 * @return {number}
 */


function lcmArray(list) {
  let n = 1,
      array = Array.isArray(list) ? list : arguments;

  for (let i = 0; i < array.length; ++i) n = lcm(array[i], n);

  return n;
}

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tanh = exports.tan = exports.sqrt = exports.sin = exports.sgn = exports.round = exports.random = exports.pow = exports.min = exports.max = exports.log2 = exports.log10 = exports.log = exports.floor = exports.exp = exports.cosh = exports.cos = exports.ceil = exports.cbrt = exports.atan2 = exports.atan = exports.asin = exports.acos = exports.abs = void 0;
const {
  abs,
  acos,
  asin,
  atan,
  atan2,
  cbrt,
  ceil,
  cos,
  cosh,
  exp,
  floor,
  log,
  log2,
  log10,
  max,
  min,
  pow,
  random,
  round,
  sign: sgn,
  sin,
  sqrt,
  tan,
  tanh
} = Math;
exports.tanh = tanh;
exports.tan = tan;
exports.sqrt = sqrt;
exports.sin = sin;
exports.sgn = sgn;
exports.round = round;
exports.random = random;
exports.pow = pow;
exports.min = min;
exports.max = max;
exports.log10 = log10;
exports.log2 = log2;
exports.log = log;
exports.floor = floor;
exports.exp = exp;
exports.cosh = cosh;
exports.cos = cos;
exports.ceil = ceil;
exports.cbrt = cbrt;
exports.atan2 = atan2;
exports.atan = atan;
exports.asin = asin;
exports.acos = acos;
exports.abs = abs;

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.circleIntersection = circleIntersection;
exports.dist = dist;
exports.extendFromOrigin = extendFromOrigin;
exports.extendFromPoint = extendFromPoint;
exports.lineIntersection = lineIntersection;
exports.rotateAroundOrigin = rotateAroundOrigin;
exports.rotateAroundPoint = rotateAroundPoint;

/**
 * return distance between two points
 *
 * @param {array<number>} p1
 * @param {array<number>} p2
 * @return {number} distance between p1 and p2
 */
function dist(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}
/**
 * Returns a point rotated around a point by certain angle, exetened by a certain length
 *
 * @param {number|array<number>} x center x or center as array of coords [x, y]
 * @param {number} y center y
 * @param {number} angle angle of rotation
 * @param {number} len length to extend the point
 * @returns {array<number>} array of two points
 */


function rotateAroundPoint(x, y, angle, len = 10) {
  if (Array.isArray(x) && x.length === 2) {
    y = x[1];
    x = x[0];
  }

  return [Math.cos(angle) * len + x, Math.sin(angle) * len + y];
}
/**
 * Returns a point rotated around origin by certain angle, exetened by a certain length
 *
 * @param {number} angle angle of rotation
 * @param {number} len length to extend the point
 * @returns {array<number>} array of two points
 */


function rotateAroundOrigin(angle, len = 10) {
  return rotateAroundPoint(0, 0, angle, len);
}
/**
 * Returns the point of intersection of two lines.
 *
 * @param {array<number>} p1 start point of first line as [x, y]
 * @param {array<number>} p2 end point of first line as [x, y]
 * @param {array<number>} p3 start point of second line as [x, y]
 * @param {array<number>} p4 end point of second line as [x, y]
 * @return {array<number>} intersection point of lines as [x, y]
 */


function lineIntersection(p1, p2, p3, p4) {
  const m1 = (p2[1] - p1[1]) / (p2[0] - p1[0]);
  const m2 = (p4[1] - p3[1]) / (p4[0] - p3[0]);
  const c1 = p1[1] - p1[0] * m1;
  const c2 = p3[1] - p3[0] * m2;
  const x = (c2 - c1) / (m1 - m2);
  const y = m1 * x + c1;
  return [x, y];
}
/**
 * Finds intersection of two circles.
 * Adapted from {@link https://stackoverflow.com/a/14146166}
 *
 * @param {array<number>} c1 center of first circle as [x, y]
 * @param {number} r1 radius of first circle
 * @param {array<number>} c2 center of second circle as [x, y]
 * @param {number} r2 radius of second circle
 * @return {array<number>} array of two points as [x, y]
 */


function circleIntersection(c1, r1, c2, r2) {
  const d = dist(c1, c2);
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(r1 * r1 - a * a);
  const s = a / d;
  const p2 = [(c2[0] - c1[0]) * s + c1[0], (c2[1] - c1[1]) * s + c1[1]];
  return [[p2[0] + h * (c2[1] - c1[1]) / d, p2[1] - h * (c2[0] - c1[0]) / d], [p2[0] - h * (c2[1] - c1[1]) / d, p2[1] + h * (c2[0] - c1[0]) / d]];
}
/**
 * Extend a point by given length from a given center
 * @param {array<number>} center center from the point to be extended
 * @param {array<number>} point point to be extended
 * @param {number} len length to extend the point
 * @returns {array<number>}
 */


function extendFromPoint(center, point, len = 10) {
  let dx = point[0] - center[0],
      dy = point[1] - center[1],
      angle = Math.atan2(dy, dx),
      distance = Math.sqrt(dx * dx + dy * dy) + len; // total extended length

  return [center[0] + Math.cos(angle) * distance, center[1] + Math.sin(angle) * distance];
}
/**
 * Extend a point by given length from origin (0, 0)
 * @param {array<number>} point point to be extended
 * @param {number} len length to extend the point
 * @returns {array<number>}
 */


function extendFromOrigin(point, len = 10) {
  return extendFromPoint([0, 0], point, len);
}

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomInt = randomInt;

/**
 * Returns a random integer between given range.
 *
 * @param {number} [max=10] maximum range
 * @param {number} [min=0] minimum range
 * @return {number}
 */
function randomInt(max = 10, min = 0) {
  return Math.round(Math.random() * (max - min) + min);
}

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doubleSmooth = doubleSmooth;
exports.easeInBack = easeInBack;
exports.easeInBounce = easeInBounce;
exports.easeInCirc = easeInCirc;
exports.easeInCubic = easeInCubic;
exports.easeInElastic = easeInElastic;
exports.easeInExpo = easeInExpo;
exports.easeInOutBack = easeInOutBack;
exports.easeInOutBounce = easeInOutBounce;
exports.easeInOutCirc = easeInOutCirc;
exports.easeInOutCubic = easeInOutCubic;
exports.easeInOutElastic = easeInOutElastic;
exports.easeInOutExpo = easeInOutExpo;
exports.easeInOutQuad = easeInOutQuad;
exports.easeInOutQuart = easeInOutQuart;
exports.easeInOutQuint = easeInOutQuint;
exports.easeInOutSine = easeInOutSine;
exports.easeInQuad = easeInQuad;
exports.easeInQuart = easeInQuart;
exports.easeInQuint = easeInQuint;
exports.easeInSine = easeInSine;
exports.easeOutBack = easeOutBack;
exports.easeOutBounce = easeOutBounce;
exports.easeOutCirc = easeOutCirc;
exports.easeOutCubic = easeOutCubic;
exports.easeOutElastic = easeOutElastic;
exports.easeOutExpo = easeOutExpo;
exports.easeOutQuad = easeOutQuad;
exports.easeOutQuart = easeOutQuart;
exports.easeOutQuint = easeOutQuint;
exports.easeOutSine = easeOutSine;
exports.exponentialDecay = exponentialDecay;
exports.linear = linear;
exports.lingering = lingering;
exports.notQuiteThere = notQuiteThere;
exports.rushFrom = rushFrom;
exports.rushInto = rushInto;
exports.slowInto = slowInto;
exports.smooth = smooth;
exports.squishRateFunc = squishRateFunc;
exports.thereAndBack = thereAndBack;
exports.thereAndBackWithPause = thereAndBackWithPause;
exports.wiggle = wiggle;

var _simple_functions = require("./simple_functions.js");

/**
 * Rate functions. From https://easings.net .
 * All Functions accept input from 0 to 1 and return output between 0 to 1
 */
const c1 = 1.70158;
const c2 = c1 * 1.525;
const c3 = c1 + 1;
const c4 = 2 * Math.PI / 3;
const c5 = 2 * Math.PI / 4.5;

function easeOutBounce(t) {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;else return n1 * (t -= 2.625 / d1) * t + 0.984375;
}

function linear(t) {
  return t;
}

function easeInQuad(t) {
  return t ** 2;
}

function easeOutQuad(t) {
  return 1 - (1 - t) ** 2;
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t ** 2 : 1 - Math.pow(2 - 2 * t, 2) / 2;
}

function easeInCubic(t) {
  return t ** 3;
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(2 - 2 * t, 3) / 2;
}

function easeInQuart(t) {
  return t ** 4;
}

function easeOutQuart(t) {
  return 1 - (1 - t) ** 4;
}

function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t ** 4 : 1 - Math.pow(2 - 2 * t, 4) / 2;
}

function easeInQuint(t) {
  return t ** 5;
}

function easeOutQuint(t) {
  return 1 - (1 - t) ** 5;
}

function easeInOutQuint(t) {
  return t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(2 - 2 * t, 5) / 2;
}

function easeInSine(t) {
  return 1 - Math.cos(t * Math.PI / 2);
}

function easeOutSine(t) {
  return Math.sin(t * Math.PI / 2);
}

function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function easeInExpo(t) {
  return t == 0 ? 0 : Math.pow(2, 10 * t - 10);
}

function easeOutExpo(t) {
  return t == 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function easeInOutExpo(t) {
  if (t == 0) return 0;else if (t == 1) return 1;else if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;else return (2 - Math.pow(2, 10 - 20 * t)) / 2;
}

function easeInCirc(t) {
  return 1 - Math.sqrt(1 - t ** 2);
}

function easeOutCirc(t) {
  return Math.sqrt(1 - (t - 1) ** 2);
}

function easeInOutCirc(t) {
  if (t < 0.5) return (1 - Math.sqrt(1 - (2 * t) ** 2)) / 2;else return (Math.sqrt(1 - (2 - 2 * t) ** 2) + 1) / 2;
}

function easeInBack(t) {
  return c3 * t ** 3 - c1 * t ** 2;
}

function easeOutBack(t) {
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}

function easeInOutBack(t) {
  if (t < 0.5) return (2 * t) ** 2 * ((c2 + 1) * 2 * t - c2) / 2;else return ((2 * t - 2) ** 2 * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
}

function easeInElastic(t) {
  if (t === 0) return 0;else if (t === 1) return 1;else return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
}

function easeOutElastic(t) {
  if (t === 0) return 0;else if (t === 1) return 1;else return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

function easeInOutElastic(t) {
  if (t == 0) return 0;else if (t == 1) return 1;else if (t < 0.5) return -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2;else return Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5) / 2 + 1;
}

function easeInBounce(t) {
  return 1 - easeOutBounce(1 - t);
}

function easeInOutBounce(t) {
  if (t < 0.5) return (1 - easeOutBounce(1 - 2 * t)) / 2;else return (1 + easeOutBounce(2 * t - 1)) / 2;
} // manim rate funcitons


function smooth(t, inflection = 10.0) {
  let error = (0, _simple_functions.sigmoid)(-inflection / 2);
  return Math.min(Math.max(((0, _simple_functions.sigmoid)(inflection * (t - 0.5)) - error) / (1 - 2 * error), 0), 1);
}

function rushInto(t, inflection = 10.0) {
  return 2 * smooth(t / 2.0, inflection);
}

function rushFrom(t, inflection = 10.0) {
  return 2 * smooth(t / 2.0 + 0.5, inflection) - 1;
}

function slowInto(t) {
  return Math.sqrt(1 - (1 - t) * (1 - t));
}

function doubleSmooth(t) {
  if (t < 0.5) return 0.5 * smooth(2 * t);else return 0.5 * (1 + smooth(2 * t - 1));
}

function thereAndBack(t, inflection = 10.0) {
  return smooth(t < 0.5 ? 2 * t : 2 * (1 - t), inflection);
}

function thereAndBackWithPause(t, pauseRatio = 1.0 / 3) {
  let a = 1.0 / pauseRatio;
  if (t < 0.5 - pauseRatio / 2) return smooth(a * t);else if (t < 0.5 + pauseRatio / 2) return 1;else return smooth(a - a * t);
}

function notQuiteThere(func = smooth, proportion = 0.7) {
  return t => proportion * func(t);
}

function wiggle(t, wiggles = 2) {
  return thereAndBack(t) * Math.sin(wiggles * Math.PI * t);
}

function squishRateFunc(func, a = 0.4, b = 0.6) {
  return function result(t) {
    if (a == b) return a;
    if (t < a) return func(0);else if (t > b) return func(1);else return func((t - a) / (b - a));
  };
}

function lingering(t) {
  return squishRateFunc(t => t, 0, 0.8)(t);
}

function exponentialDecay(t, halfLife = 0.1) {
  return 1 - Math.exp(-t / halfLife);
} // function runningStart(t, pullFactor = -0.5) {
// 	return bezier([0, 0, pullFactor, pullFactor, 1, 1, 1])(t);
// }

},{"./simple_functions.js":23}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sigmoid = sigmoid;

function sigmoid(t) {
  return 1.0 / (1 + Math.exp(-t));
}

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrow = arrow;
exports.arrowTip = arrowTip;
exports.curvedArrow = curvedArrow;
exports.curvedArrowBetweenPoints = curvedArrowBetweenPoints;
exports.curvedDoubleArrow = curvedDoubleArrow;
exports.curvedDoubleArrowBetweenPoints = curvedDoubleArrowBetweenPoints;
exports.doubleArrow = doubleArrow;
exports.measurement = measurement;

var _colors = require("../constants/colors.js");

var _drawing = require("../constants/drawing.js");

var _main = require("../main.js");

var _points = require("../math/points.js");

var _settings = require("../settings.js");

var _utils = require("../utils.js");

var _text = require("./text.js");

const DEFAULT_TIP_WIDTH = 15;
/**
 * Draws a arrow tip
 *
 * @param {number} x1 x position of start point
 * @param {number} y1 y position of start point
 * @param {number} x2 x position of end point
 * @param {number} y2 y position of end point
 * @param {number} width width of tip
 * @param {number} height height of tip
 */

function arrowTip(x1, y1, x2, y2, width, height) {
  let ctx = _main.C.workingCanvas;
  let thickness = ctx.lineWidth;
  let distance = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  if (isNaN(width)) width = distance;
  height = height || width / 1.2;
  let w = width - distance;
  let r = Math.sqrt(w ** 2 + (height / 2) ** 2);
  let t = Math.atan(height / (w * 2));
  if (distance > width) t = t + Math.PI;
  let angleFromXAxis = Math.atan2(y2 - y1, x2 - x1);
  let A = [x1 - Math.cos(t + angleFromXAxis) * r, y1 - Math.sin(t + angleFromXAxis) * r];
  let B = [x1 - Math.cos(-t + angleFromXAxis) * r, y1 - Math.sin(-t + angleFromXAxis) * r];

  if (ctx.doStroke && ctx.lineJoin != _drawing.BEVEL) {
    // correcting tip
    x2 -= Math.cos(angleFromXAxis) * thickness;
    y2 -= Math.sin(angleFromXAxis) * thickness;
  }

  ctx.save();
  if (!ctx.pathStarted) ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(A[0], A[1]);
  ctx.lineTo(x2, y2);
  ctx.lineTo(B[0], B[1]);
  ctx.lineTo(x1, y1);

  if (!ctx.pathStarted) {
    (0, _utils.doFillAndStroke)(ctx);
    ctx.closePath();
  }

  ctx.restore();
}
/**
 * draws a arrow
 *
 * @param {number} x1 starting x-axis coord
 * @param {number} y1 starting y-axis coord
 * @param {number} x2 ending x-axis coord
 * @param {number} y2 ending y-axis coord
 * @param {number} [tipWidth=DEFAULT_TIP_WIDTH] width of tip
 * @param {number} tipHeight height of tip. Default value is tipWidth / 1.2
 * @param {number} [arrowCurving = 0] worping of arrow
 * @param {number} [spacing = 0] padding from end to tip
 *
 */


function arrow(x1, y1, x2, y2, tipWidth = DEFAULT_TIP_WIDTH, tipHeight = tipWidth / 1.2, arrowCurving = 0, spacing = 0) {
  const angle = Math.atan2(y2 - y1, x2 - x1); // angle from plain

  const yDiff = Math.sin(angle) * spacing;
  const xDiff = Math.cos(angle) * spacing; // decrease the length of tip by `spacing`

  x2 -= xDiff;
  y2 -= yDiff;
  const xTipSpacing = Math.cos(angle) * (tipWidth - arrowCurving);
  const yTipSpacing = Math.sin(angle) * (tipWidth - arrowCurving);
  const ctx = _main.C.workingCanvas;
  const pathStarted = ctx.pathStarted;
  if (!pathStarted) (0, _settings.startShape)();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2 - xTipSpacing, y2 - yTipSpacing);
  ctx.stroke();
  arrowTip(x2 - xTipSpacing, y2 - yTipSpacing, x2, y2, tipWidth, tipHeight);

  if (!pathStarted) {
    (0, _utils.doFillAndStroke)(ctx);
    (0, _settings.endShape)();
  }
}
/**
 * Draws a double tipped arrow
 *
 * @param {number} x1
 * @param {number} y1
 * @param {number} x20]
 * @param {number} y2
 * @param {number} [tipWidth=DEFAULT_TIP_WIDTH] width of tip
 * @param {number} tipHeight height of tip. Default value is tipWidth / 1.2
 * @param {number} [arrowCurving = 0]
 * @param {number} [spacing=0]
 */


function doubleArrow(x1, y1, x2, y2, tipWidth = DEFAULT_TIP_WIDTH, tipHeight = tipWidth / 1.2, arrowCurving = 0, spacing = 0) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const xPadding = Math.cos(angle) * (tipWidth - arrowCurving);
  const yPadding = Math.sin(angle) * (tipWidth - arrowCurving);
  const ySpacing = Math.sin(angle) * spacing;
  const xSpacing = Math.cos(angle) * spacing;
  (0, _settings.startShape)();
  x1 += xPadding + xSpacing;
  y1 += yPadding + ySpacing;
  arrow(x1, y1, x2, y2, tipWidth, tipHeight, arrowCurving, spacing);
  arrowTip(x1, y1, x1 - xPadding, y1 - yPadding, tipWidth, tipHeight);
  (0, _utils.doFillAndStroke)(_main.C.workingCanvas);
  (0, _settings.endShape)();
}
/**
 * Draws a double tipped arrow with text in the middle
 *
 * @param {object} args parameters.
 * Possible values:
 * @param {string} args.text text
 * @param {array} args.p1 first point
 * @param {array} args.p2 second point
 * @param {number} [args.tipWidth = 15] tip width
 * @param {number} [args.tipHeight = 12.5] tip height
 * @param {number} [args.spacing = 0] spacing
 * @param {string|number} args.background background of text
 * @param {number} args.innerPadding padding of text
 * @param {number} args.outerPadding tip spacing
 * @param {number} args.textRotation rotatioin of text
 * @param {number} args.arrowCurving worping of arrow
 */


function measurement(args) {
  const ctx = _main.C.workingCanvas;
  const defaults = {
    background: _colors.TRANSPARENT,
    tipWidth: DEFAULT_TIP_WIDTH,
    tipHeight: DEFAULT_TIP_WIDTH / 1.2,
    innerPadding: 3,
    outerPadding: 0,
    textRotation: 0,
    arrowCurving: 0
  };
  args = (0, _utils.applyDefault)(defaults, args);
  const {
    p1,
    p2
  } = args;
  const angleFromXAxis = Math.atan2(p2[1] - p1[1], p2[0] - p1[0]);
  const {
    width
  } = ctx.measureText(args.text);
  const innerPadding = [Math.cos(angleFromXAxis) * (args.innerPadding + width / 2), Math.sin(angleFromXAxis) * (args.innerPadding + width / 2)];
  const center = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2]; // draw arrows

  arrow(center[0] - innerPadding[0], center[1] - innerPadding[1], p1[0], p1[1], args.tipWidth, args.tipHeight, args.arrowCurving, args.outerPadding);
  arrow(center[0] + innerPadding[0], center[1] + innerPadding[1], p2[0], p2[1], args.tipWidth, args.tipHeight, args.arrowCurving, args.outerPadding);
  (0, _settings.save)();
  ctx.translate(center[0], center[1]);
  ctx.textAlign = _drawing.CENTER;
  ctx.textBaseline = _drawing.MIDDLE;
  ctx.rotate(Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) + args.textRotation);
  (0, _text.fillText)(args.text, 0, 0);
  (0, _settings.restore)();
}
/**
 * Draws a curved arrow that wrap around a circle.
 *
 * @param {number} x x position of circle
 * @param {number} y y position of circle
 * @param {number} radius radius of circle
 * @param {number} [angle=Math.PI / 2] central angle of arc
 * @param {number} [startAngle=0] starting angle
 * @param {number} [tipWidth=DEFAULT_TIP_WIDTH] width of tip
 * @param {number} tipHeight height of tip. Default value is tipWidth / 1.2
 * @param {number} [arrowCurving=0] arrow curving constant
 * @param {number} [tipOffset=10] offset (padding) of tip from it's defined end
 * @param {boolean} [reverse=false] whether to reverse the direction of arrow
 */


function curvedArrow(x, y, radius, angle = Math.PI / 2, startAngle = 0, tipWidth = DEFAULT_TIP_WIDTH, tipHeight = tipWidth / 1.2, arrowCurving = 0, tipOffset = 0, reverse = false) {
  const ctx = _main.C.workingCanvas;
  const tipAngularDiameter = tipWidth / radius;
  ctx.save();
  arrowCurving /= radius;
  let padding = tipAngularDiameter - arrowCurving;
  ctx.beginPath();

  if (reverse) {
    padding += tipOffset;
    ctx.arc(x, y, radius, padding + startAngle, angle + startAngle);
    ctx.stroke();
    ctx.closePath();
    arrowTip(x + radius * Math.cos(startAngle + padding), y + radius * Math.sin(startAngle + padding), x + radius * Math.cos(startAngle + tipOffset), y + radius * Math.sin(startAngle + tipOffset), tipWidth, tipHeight);
  } else {
    angle -= tipOffset;
    ctx.arc(x, y, radius, startAngle, angle - padding + startAngle);
    ctx.stroke();
    ctx.closePath();
    arrowTip(x + radius * Math.cos(startAngle + angle - padding), y + radius * Math.sin(startAngle + angle - padding), x + radius * Math.cos(startAngle + angle), y + radius * Math.sin(startAngle + angle), tipWidth, tipHeight);
  }

  ctx.restore();
}
/**
 * Draws a curved arrow with two tips.
 *
 * @param {number} x x position of circle
 * @param {number} y y position of circle
 * @param {number} radius radius of circle
 * @param {number} [angle=Math.PI / 2] central angle of arrow in radians
 * @param {number} [startAngle=0] start angle of arrow in radians
 * @param {number} [tipWidth=DEFAULT_TIP_WIDTH] width of arrow tip
 * @param {number} tipHeight height of tip. Default value is tipWidth / 1.2
 * @param {number} [arrowCurving=0] curving of arrow
 * @param {number} [tipOffset=0] angular offset of arrow from radial boundaries in radians.
 */


function curvedDoubleArrow(x, y, radius, angle = Math.PI / 2, startAngle = 0, tipWidth = DEFAULT_TIP_WIDTH, tipHeight = tipWidth / 1.2, arrowCurving = 0, tipOffset = 0) {
  const ctx = _main.C.workingCanvas;
  ctx.save();
  const tipAngularDiameter = tipWidth / radius;
  const tangent = [-Math.cos(startAngle + tipAngularDiameter / 2 + Math.PI / 2), -Math.sin(startAngle + tipAngularDiameter / 2 + Math.PI / 2)];
  angle -= tipAngularDiameter;
  startAngle += tipAngularDiameter + tipOffset * 2;
  curvedArrow(x, y, radius, angle + arrowCurving / radius, startAngle - arrowCurving / radius, tipWidth, tipHeight, arrowCurving, tipOffset);
  arrowTip(Math.cos(startAngle - arrowCurving / radius) * radius, Math.sin(startAngle - arrowCurving / radius) * radius, Math.cos(startAngle) * radius + tipWidth * tangent[0], Math.sin(startAngle) * radius + tipWidth * tangent[1], tipWidth, tipHeight);
  ctx.restore();
}
/**
 * Draws a curved arrow between two points that wraps around a circle with a definite radius.
 *
 * @param {array<number>} p1 start point
 * @param {array<number>} p2 end point
 * @param {number} radius radius of circle
 * @param {number} [tipWidth=DEFAULT_TIP_WIDTH] width of tip
 * @param {number} tipHeight height of tip. Default value is tipWidth / 1.2
 * @param {number} [arrowCurving=0] arrow curving const. Expressed in pixels
 * @param {number} [tipOffset=0] offset (padding) of tip from it's defined end. Expressed in radians
 * @param {boolean} [otherArc=false] whether to use other arc
 * @param {boolean} [reverse=false] whether to reverse the direction of arrow.
 * @return {array} coordiante of the center of arc as [x, y]
 */


function curvedArrowBetweenPoints(p1, p2, radius, tipWidth = DEFAULT_TIP_WIDTH, tipHeight = tipWidth / 1.2, arrowCurving = 0, tipOffset = 0, otherArc = false, reverse = false) {
  const ctx = _main.C.workingCanvas;
  const pathStarted = ctx.pathStarted;
  ctx.save();
  if (!pathStarted) ctx.beginPath();
  const center = (0, _points.circleIntersection)(p1, radius, p2, radius)[0];
  p1[0] -= center[0];
  p1[1] -= center[1];
  p2[0] -= center[0];
  p2[1] -= center[1];
  const p1Angle = Math.atan2(p1[1], p1[0]);
  const p2Angle = Math.atan2(p2[1], p2[0]);
  let angleBetweenPoints, startAngle;

  if (otherArc) {
    startAngle = p1Angle;
    angleBetweenPoints = p2Angle - p1Angle;
  } else {
    startAngle = p2Angle;
    angleBetweenPoints = p1Angle - p2Angle;
  }

  curvedArrow(center[0], center[1], radius, angleBetweenPoints, startAngle, tipWidth, tipHeight, arrowCurving, tipOffset, reverse);
  if (!pathStarted) ctx.closePath();
  ctx.restore();
  return center;
}
/**
 * Draws a double tipped curved arrow between two points that wraps around a circle with a definite radius.
 *
 * @param {array<number>} p1 start point
 * @param {array<number>} p2 end point
 * @param {number} radius radius of circle
 * @param {number} [tipWidth=DEFAULT_TIP_WIDTH] width of tip
 * @param {number} tipHeight height of tip. Default value is tipWidth / 1.2
 * @param {number} [arrowCurving=0] arrow curving const. Expressed in pixels
 * @param {number} [tipOffset=0] offset (padding) of tip from it's defined. Expressed in radians
 * @param {boolean} [otherArc=false] whether to use other arc
 * @return {array} coordiante of the center of arc as [x, y]
 */


function curvedDoubleArrowBetweenPoints(p1, p2, radius, tipWidth = DEFAULT_TIP_WIDTH, tipHeight = tipWidth / 1.2, arrowCurving = 0, tipOffset = 0, otherArc = false) {
  const ctx = _main.C.workingCanvas;
  ctx.save();
  const center = (0, _points.circleIntersection)(p1, radius, p2, radius)[0];
  p1[0] -= center[0];
  p1[1] -= center[1];
  p2[0] -= center[0];
  p2[1] -= center[1];
  const tipAngularDiameter = tipWidth / radius;
  const p1Angle = Math.atan2(p1[1], p1[0]);
  const p2Angle = Math.atan2(p2[1], p2[0]) + tipAngularDiameter;
  let angleBetweenPoints, startAngle;

  if (otherArc) {
    startAngle = p1Angle;
    angleBetweenPoints = p2Angle - p1Angle;
  } else {
    startAngle = p2Angle;
    angleBetweenPoints = p1Angle - p2Angle;
  }

  arrowCurving /= radius;
  curvedArrow(center[0], center[1], radius, angleBetweenPoints + arrowCurving - tipOffset, startAngle - arrowCurving + tipOffset, tipWidth, tipHeight, arrowCurving * radius, tipOffset);
  let padding = tipAngularDiameter - arrowCurving + tipOffset;
  startAngle -= tipAngularDiameter;
  arrowTip(center[0] + radius * Math.cos(startAngle + padding), center[1] + radius * Math.sin(startAngle + padding), center[0] + radius * Math.cos(startAngle + tipOffset), center[1] + radius * Math.sin(startAngle + tipOffset), tipWidth, tipHeight);
  ctx.restore();
  return center;
}

},{"../constants/colors.js":11,"../constants/drawing.js":12,"../main.js":17,"../math/points.js":20,"../settings.js":32,"../utils.js":33,"./text.js":31}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arcBrace = arcBrace;
exports.curlyBrace = curlyBrace;

var _main = require("../main.js");

/**
 * Draws a curly brace
 * Code adapted from http://bl.ocks.org/alexhornbake/6005176
 *
 * @param {number} x1 x-axis coord of starting point
 * @param {number} y1 y-axis coord of starting point
 * @param {number} x2 x-axis coord of ending point
 * @param {number} y2 y-axis coord of ending point
 * @param {number} [size=30] outward size of brace
 * @param {number} [curviness=0.6] curviness of brace. '0' doesn't make flat brace
 * @param {number} [taleLength=0.8] length of tale proportional to size \ length
 */
function curlyBrace(x1, y1, x2, y2, size = 20, curviness = 0.6, taleLength = 0.8) {
  //Calculate unit vector
  let dx = x1 - x2;
  let dy = y1 - y2;
  let len = Math.sqrt(dx * dx + dy * dy);
  dx /= len;
  dy /= len; //Calculate Control Points of path,

  const cp1x = x1 + curviness * size * dy;
  const cp1y = y1 - curviness * size * dx;
  const cp2x = x1 - 0.25 * len * dx + (1 - curviness) * size * dy;
  const cp2y = y1 - 0.25 * len * dy - (1 - curviness) * size * dx;
  const middleTipX = x1 - 0.5 * len * dx + size * dy * taleLength;
  const middleTipY = y1 - 0.5 * len * dy - size * dx * taleLength;
  const cp3x = x2 + curviness * size * dy;
  const cp3y = y2 - curviness * size * dx;
  const cp4x = x1 - 0.75 * len * dx + (1 - curviness) * size * dy;
  const cp4y = y1 - 0.75 * len * dy - (1 - curviness) * size * dx;
  const path = `M ${x1} ${y1} ` + `Q ${cp1x} ${cp1y} ${cp2x} ${cp2y} ` + `T ${middleTipX} ${middleTipY} ` + `M ${x2} ${y2} ` + `Q ${cp3x} ${cp3y} ${cp4x} ${cp4y} ` + `T ${middleTipX} ${middleTipY}`;

  _main.C.workingCanvas.stroke(new Path2D(path));

  return [middleTipX, middleTipY];
}
/**
 * Draws a brace that wraps a circle. Returns the coordinate of middle tip extended by a certain amound.
 *
 * @param {number} x x-axis coord
 * @param {number} y y-axis coord
 * @param {number} [radius=100] radius of circle
 * @param {number} [startAngle=0] starting angle
 * @param {number} [angle=Math.PI / 2] central angle
 * @param {number} [smallerLineLength=10] length of small tips at the ends of brace
 * @param {number} [tipLineLength=smallerLineLength] length of middle tip
 * @param {number} [extender=5] how much the coordinate of middle tip should be extended.
 * @return {array} array of two numbers that are the coordinate of middle tip extended by a certain value.
 */


function arcBrace(x, y, radius = 100, angle = Math.PI / 2, startAngle = 0, smallerLineLength = 10, tipLineLength = smallerLineLength, extender = 10) {
  const ctx = _main.C.workingCanvas,
        smallerRadius = radius - smallerLineLength,
        largerRadius = radius + tipLineLength;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(startAngle);
  ctx.beginPath();
  ctx.moveTo(radius, 0); // first smaller line

  ctx.lineTo(smallerRadius, 0); // The arc

  ctx.arc(0, 0, radius, 0, angle); // second smaller line

  ctx.lineTo(smallerRadius * Math.cos(angle), smallerRadius * Math.sin(angle)); // tip line

  ctx.moveTo(radius * Math.cos(angle / 2), radius * Math.sin(angle / 2));
  ctx.lineTo(largerRadius * Math.cos(angle / 2), largerRadius * Math.sin(angle / 2));
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
  return [(largerRadius + extender) * Math.cos(angle / 2 + startAngle) + x, (largerRadius + extender) * Math.sin(angle / 2 + startAngle) + y];
}

},{"../main.js":17}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.axes = axes;
exports.numberLine = numberLine;
exports.numberPlane = numberPlane;

var _colors = require("../constants/colors.js");

var _main = require("../main.js");

var _settings = require("../settings.js");

var _utils = require("../utils.js");

var _arrows = require("./arrows.js");

var _functions = require("./functions.js");

var _geometry = require("./geometry.js");

var _text = require("./text.js");

function isArray(o) {
  return Array.isArray(o);
} // list of plotters


function getPlotterList(unitSpace, unitValue, cfgs = {}) {
  return {
    getParametricFunction: function (configs) {
      configs.unitSpace = unitSpace;
      configs.unitValue = unitValue;
      return (0, _functions.parametricFunction)(configs);
    },
    getFunctionGraph: function (configs) {
      configs.unitSpace = unitSpace;
      configs.unitValue = unitValue;
      return (0, _functions.functionGraph)(configs);
    },
    getHeatPlot: function (configs) {
      configs.unitSpace = unitSpace;
      configs.unitValue = unitValue;
      configs.min = configs.min || [cfgs.xAxis.range[0], cfgs.yAxis.range[0]];
      configs.max = configs.max || [cfgs.xAxis.range[1], cfgs.yAxis.range[1]];
      return (0, _functions.heatPlot)(configs);
    }
  };
}
/**
 * Creates a axes.
 * @param {Object} args
 * Possible configurations are:
 *
 * @param {object} xAxis Configurations for x axis. (See {@link numberLine} for more configurations)
 * @param {object} yAxis Configurations for y axis. (See {@link numberLine} for more configurations)
 * @param {array} [center = [0, 0]] center of axes
 *
 * @returns {object} object that contains following properties:
 * * xAxis                 <object>   : x axis confiurations from numberLine (See {@link numberLine} for those configurations).
 * * yAxis                 <object>   : y axis confiurations from numberLine (See {@link numberLine} for those configurations).
 * * unitValue             <array>    : How much a unit is in its value in x and y directions.
 * * unitSpace            <array>    : How much a unit is in px in x and y directions.
 * * getParametricFunction <function> : Draws a parametric function whose unit sizing are predefined by the axes. see {@link parametricFunction} to see possible configurations.
 * * getFunctionGraph      <function> : Draws a function graph whose unit sizing are predefined by the axes. see {@link functionGraph} to see possible configurations.
 */


function axes(args = {}) {
  const ctx = _main.C.workingCanvas; // default configurations

  const defaultConfigs = {
    xAxis: {
      length: ctx.width,
      includeTick: true,
      includeLeftTip: true,
      includeRightTip: true,
      excludeOriginTick: true,
      includeNumbers: false
    },
    yAxis: {
      length: ctx.height,
      rotation: Math.PI / 2,
      textRotation: -Math.PI / 2,
      textDirection: [0, 0.4],
      includeTick: true,
      includeLeftTip: true,
      includeRightTip: true,
      excludeOriginTick: true,
      includeNumbers: false
    },
    center: [0, 0]
  }; // configurations

  args = (0, _utils.applyDefault)(defaultConfigs, args);
  const {
    xAxis,
    yAxis
  } = args; // other configurations

  const center = args.center; // range of ticks in each axis

  const xRange = xAxis.range;
  const yRange = yAxis.range; // unit length of each axis
  // got by dividing length of axis by number of ticks

  const xDX = xAxis.length / ((xRange[1] - xRange[0]) / xRange[2]);
  const yDX = yAxis.length / ((yRange[1] - yRange[0]) / yRange[2]); // coordinates of bounding rectangle of the graph

  const xMin = xRange[0] / xRange[2] * xDX;
  const yMin = yRange[0] / yRange[2] * yDX; // variables to shift 0 ticks of axes to center

  const xShift = xAxis.length / 2 + xMin;
  const yShift = yAxis.length / 2 + yMin;
  ctx.save();
  ctx.beginPath(); // translate to center

  ctx.translate(center[0], center[1]); // draws axes
  // x-axis

  ctx.translate(xShift, 0);
  const xAxisLine = numberLine(xAxis); // draw x axis
  // reverse the effect of shift for drawing y-axis

  ctx.translate(-xShift, yShift); // y-axis

  const yAxisLine = numberLine(yAxis); // draw y axis
  // size of a unit cell

  const unitSpace = [xAxisLine.unitSpace, yAxisLine.unitSpace];
  const unitValue = [xAxisLine.unitValue, yAxisLine.unitValue]; // reverse the effect of overall shift

  ctx.translate(-center[0], -center[1] - yShift);
  ctx.closePath();
  ctx.restore();
  const ret = {
    center: center,
    // center of axis as [x, y] in px
    xAxis: xAxisLine,
    // x axis confiurations from numberLine
    yAxis: yAxisLine,
    // y axis confiurations from numberLine
    unitValue: unitValue,
    // how much a unit is as [x, y] in its value
    unitSpace: unitSpace // how much a unit is as [x, y] in px

  };
  return Object.assign(ret, getPlotterList(unitSpace, unitValue, ret));
}
/**
 * Creates a numberLine with parameters in a object
 * @param {object} args configuration object
 *
 * @param {array} [args.point1 = [-ctx.width / 2, 0]] starting point of line. Default value is [-ctx.width / 2, 0]
 * @param {array} [args.point2 = [ctx.width / 2, 0]] ending point of line
 * @param {array} [args.range = [-5, 5, 1]] range of numbers to draw ticks and numbers
 * @param {array} [args.numbersToInclude = []] list of numbers to be displayed
 * @param {array} [args.numbersToExclude = []] list of numbers that shouldn't be displayed
 * @param {array} [args.numbersWithElongatedTicks = []] list of numbers where tick line should be longer
 * @param {array} [args.textDirection = 0, -0.8] Direction of text relative to nearby tick
 *
 * @param {boolean} [args.includeLeftTip = false] whether to add an arrow tip at left
 * @param {boolean} [args.includeRightTip = false] whether to add an arrow tip at right
 * @param {boolean} [args.includeTick = true] Whether ticks should be added
 * @param {boolean} [args.excludeOriginTick = false] Whether exclude ticks at origin
 *
 * @param {number} [args.tipWidth = 20] width of arrow tip in px
 * @param {number} [args.tipHeight = 1] height/width of tip
 * @param {number} [args.lineWidth = 32] Width of lines in px
 * @param {number} [args.longerTickMultiple = 2] Factor to increase height of ticks at elongated ticks
 * @param {number} [args.tickHeight = 15] Height of ticks in px
 * @param {number} [args.textSize = 17] Font size of text
 * @param {number} [args.textRotation = 0] Amount to rotate text
 * @param {number} args.decimalPlaces Number of decimal places in text. By default value is number of decimals in step
 *
 * @param {string} [args.color = GREY] Color of axis and ticks
 * @param {string} [args.textColor = WHITE] Color of text
 *
 * @returns {object} configurations about the number line
 *
 * * center     {array} Center of the number line in px
 * * tickList   {array} List of tick inervals
 * * unitValue  {array} How much a unit is in its value in x and y directions.
 * * unitSpace {array} How much a unit is in px in x and y directions.
 */


function numberLine(args = {}) {
  const ctx = _main.C.workingCanvas;
  const defaultConfigs = {
    rotation: 0,
    lineWidth: 2,
    tipWidth: 13,
    textSize: 17,
    tipHeight: 10,
    tickHeight: 10,
    textRotation: 0,
    length: ctx.width,
    longerTickMultiple: 1.5,
    center: [0, 0],
    range: [-5, 5, 1],
    numbersToInclude: [],
    numbersToExclude: [],
    textDirection: [-0.3, -0.0],
    numbersWithElongatedTicks: [],
    includeTick: true,
    includeNumbers: true,
    includeLeftTip: false,
    includeRightTip: false,
    excludeOriginTick: false,
    color: _colors.GREY,
    textColor: _colors.WHITE
  };
  args = (0, _utils.applyDefault)(defaultConfigs, args);
  const {
    color,
    center,
    rotation,
    tipWidth,
    textSize,
    lineWidth,
    tipHeight,
    length: lineLength,
    tickHeight,
    textRotation,
    textDirection,
    includeLeftTip,
    includeRightTip,
    numbersToExclude,
    numbersToInclude,
    excludeOriginTick,
    longerTickMultiple,
    numbersWithElongatedTicks
  } = args;
  let {
    range,
    decimalPlaces
  } = args;

  if (Array.isArray(range) && range.length === 2) {
    range = [range[0], range[1], 1];
  } // if number of decimal places is not defined
  // find it using `step`


  if (isNaN(decimalPlaces)) {
    decimalPlaces = (range[2].toString().split(".")[1] || []).length || 0;
  }

  const min = range[0];
  const max = range[1];
  const step = range[2];
  const totalTicks = (max - min) / step;
  const ds = lineLength / totalTicks;
  const list = getTickList();
  ctx.beginPath();
  (0, _settings.save)();
  (0, _settings.translate)(center[0] * ds, center[1] * ds);
  (0, _settings.rotate)(rotation);
  (0, _settings.translate)(-lineLength / 2, 0);
  if (args.includeTick) drawTicks();
  if (args.includeNumbers) drawNumbers();
  (0, _settings.translate)(lineLength / 2, 0);
  drawAxis();
  ctx.closePath();

  function drawAxis() {
    (0, _settings.stroke)(color);
    ctx.lineWidth = lineWidth;
    (0, _settings.fill)(color);
    const r = Math.atan(tipHeight / 2);
    let x1 = -lineLength / 2;
    let x2 = lineLength / 2;

    if (includeLeftTip) {
      (0, _arrows.arrowTip)(x1 + tipWidth, 0, x1, 0, tipWidth, tipHeight);
      x1 += tipWidth * Math.cos(r);
    }

    if (includeRightTip) {
      (0, _arrows.arrowTip)(x2 - tipWidth, 0, x2, 0, tipWidth, tipHeight);
      x2 -= tipWidth * Math.cos(r) * 1;
    }

    (0, _geometry.line)(x1, 0, x2, 0);
  }

  function drawTicks() {
    (0, _settings.stroke)(color);
    ctx.lineWidth = lineWidth;
    const from = includeLeftTip ? 1 : 0;
    const to = includeRightTip ? list.length - 1 : list.length;

    for (let i = from; i < to && numbersToExclude.indexOf(list[0][i]) < 0; i++) {
      const tick = list[i];
      if (Number(tick) === 0 && excludeOriginTick) continue;
      let TH = tickHeight;

      if (numbersWithElongatedTicks.indexOf(tick) > -1) {
        TH *= longerTickMultiple;
      }

      (0, _geometry.line)(ds * i, -TH / 2, ds * i, TH / 2);
    }
  }

  function drawNumbers() {
    const numbers = numbersToInclude.length > 0 ? numbersToInclude : list;
    (0, _settings.fill)(args.textColor);
    (0, _settings.fontSize)(textSize);
    const yShift = -textSize / 3 * Math.cos(textRotation) + textDirection[1] * textSize;
    const from = includeLeftTip ? 1 : 0;
    const to = includeRightTip ? numbers.length - 1 : numbers.length;

    for (let i = from; i < to && numbersToExclude.indexOf(numbers[i]) < 0; i++) {
      const tick = typeof numbers[i] == "number" ? numbers[i].toFixed(decimalPlaces) : numbers[i];
      if (Number(tick) === 0 && excludeOriginTick) continue;
      const width = ctx.measureText(tick).width;
      const xShift = -width / 2 * Math.cos(textRotation) + textDirection[0] * textSize + textSize / 2 * Math.sin(textRotation);
      (0, _settings.translate)(ds * i + xShift, yShift - width * Math.sin(textRotation));
      (0, _settings.rotate)(textRotation);
      (0, _text.fillText)(tick, 0, 0);
      (0, _settings.rotate)(-textRotation);
      (0, _settings.translate)(-(ds * i + xShift), -(yShift - width * Math.sin(textRotation)));
    }
  }

  function getTickList() {
    return (0, _utils.arange)(min, max, step);
  }

  (0, _settings.restore)();
  return {
    range: range,
    center: center,
    tickList: list,
    unitValue: step,
    unitSpace: ds
  };
}
/**
 * Creates a numberPlane based on following parameters inside a Object
 * @param {Object} args
 * Possible parameters:
 *
 * @param {object} args.xAxis Configurations for x axis. See {@link numberLine} for possible configurations.
 * @param {object} args.yAxis Configurations for y axis. See {@link numberLine} for possible configurations.
 * @param {array} args.center Center of number plane as [x, y] in px.
 * @param {object} args.grid Set of styles to draw grid & subgrids. This can have following properties:
 *   @param {number} [args.grid.lineWidth = 1]  stroke width of grid lines
 *   @param {number} [args.grid.subgrids = 0]  number of sub-grid division to draw
 *   @param {number} [args.grid.subgridLineWidth = 0.7]  stroke width of sub-grid
 *   @param {string} [args.grid.color = "#58c4dda0"]  color of grid lines
 *   @param {string} [args.grid.subgridLineColor = "#888888a0"]  color of sub-grids
 * @returns {Object} configurations of number plane. Those are :
 *
 * * center                <array>   : Center of number plane as [x, y] in px.
 * * unitValue             <array>   : How much a unit is in its value in x and y directions.
 * * unitSpace            <array>   : How much a unit is in px in x and y directions.
 * * subgridUnit           <array>   : How much a sub-grid is in px in x and y directions.
 * * xAxis                 <object>  : x axis confiurations from numberLine (See {@link numberLine} for those configurations).
 * * yAxis                 <object>  : y axis confiurations from numberLine (See {@link numberLine} for those configurations).
 * * getParametricFunction <function>: Draws a parametric function whose unit sizing are predefined by the axes. see {@link parametricFunction} to see possible configurations.
 * * getFunctionGraph      <function>: Draws a function graph whose unit sizing are predefined by the axes. see {@link functionGraph} to see possible configurations.
 */


function numberPlane(args = {}) {
  const ctx = _main.C.workingCanvas; // default configurations

  const defaultConfigs = {
    xAxis: {
      length: ctx.width,
      includeTick: true,
      includeNumbers: true,
      includeLeftTip: false,
      includeRightTip: false,
      excludeOriginTick: true,
      unitSpace: 50
    },
    yAxis: {
      length: ctx.height,
      textRotation: -Math.PI / 2,
      unitSpace: 50,
      includeTick: true,
      includeNumbers: true,
      includeLeftTip: false,
      includeRightTip: false,
      excludeOriginTick: true
    },
    grid: {
      subgrids: 1,
      lineWidth: 1,
      subgridLineWidth: 0.7,
      color: _colors.BLUE + "a0",
      subgridLineColor: _colors.GREY + "50"
    },
    center: [0, 0]
  }; // configurations

  args = (0, _utils.applyDefault)(defaultConfigs, args);
  const {
    xAxis,
    yAxis,
    grid
  } = args; // other configurations

  const subgrids = grid.subgrids;
  const center = args.center;

  if (!isArray(xAxis.range)) {
    // find range from unitSpace
    let extrema = xAxis.length / xAxis.unitSpace / 2;
    xAxis.range = [-extrema, extrema, 1];
  } else {
    if (isNaN(xAxis.range[2])) xAxis.range[2] = 1;
    xAxis.unitSpace = xAxis.length / ((xAxis.range[1] - xAxis.range[0]) / xAxis.range[2]);
  }

  if (!isArray(yAxis.range)) {
    // find range from unitSpace
    let extrema = yAxis.length / yAxis.unitSpace / 2;
    yAxis.range = [-extrema, extrema, 1];
  } else {
    if (isNaN(yAxis.range[2])) yAxis.range[2] = 1;
    yAxis.unitSpace = yAxis.length / ((yAxis.range[1] - yAxis.range[0]) / yAxis.range[2]);
  } // range of ticks in each axis


  const xRange = xAxis.range;
  const yRange = yAxis.range; // number of ticks in each

  const xNums = (xRange[1] - xRange[0]) / xRange[2];
  const yNums = (yRange[1] - yRange[0]) / yRange[2]; // unit length of each axis

  const xDX = xAxis.unitSpace;
  const yDX = yAxis.unitSpace; // coordinates of bounding rectangle of the graph

  const xMin = xRange[0] / xRange[2] * xDX;
  const xMax = xRange[1] / xRange[2] * xDX;
  const yMin = yRange[0] / yRange[2] * yDX;
  const yMax = yRange[1] / yRange[2] * yDX; // size of a subgrid unit cell

  const subgridUnit = [xDX / subgrids, yDX / subgrids];
  (0, _settings.save)(); // translate to center

  center[0] *= xDX;
  center[1] *= yDX;
  (0, _settings.translate)(center[0], center[1]); // draw grids
  // draws axes

  const axesLines = axes({
    xAxis: xAxis,
    yAxis: yAxis
  });
  drawGridLines(); // size of a unit cell

  const unitSpace = axesLines.unitSpace;
  const unitValue = axesLines.unitValue;

  function drawGridLines() {
    // major grid lines
    (0, _settings.translate)(xMin, 0);
    const subgridxDX = subgridUnit[0];
    const subgridyDX = subgridUnit[1]; // horizontal grid lines

    for (let i = 0; i <= xNums; i++) {
      if (i == xAxis.center - xAxis.range[0]) continue; // draw major grid lines

      drawMajor(i * xDX, // x - shift
      0, // y - shift
      0, yMin, 0, yMax); // draw subgrid grid lines

      for (let k = 1; k <= subgrids && i < xNums; k++) {
        drawMinor(k * subgridxDX, yMin, k * subgridxDX, yMax);
      }

      (0, _settings.translate)(-i * xDX);
    }

    (0, _settings.translate)(-xMin, yMin); // vertical grid lines

    for (let i = 0; i <= yNums; i++) {
      if (i == yAxis.center - yAxis.range[0]) continue; // draw major grid lines

      drawMajor(0, // x - shift
      i * yDX, // y - shift
      xMin, 0, xMax, 0); // draw subgrid grid lines

      for (let k = 1; k <= subgrids && i < yNums; k++) {
        drawMinor(xMin, k * subgridyDX, xMax, k * subgridyDX);
      }

      (0, _settings.translate)(0, -i * yDX);
    }

    (0, _settings.translate)(0, -yMin);

    function drawMajor(shiftX, shiftY, x1, y1, x2, y2) {
      (0, _settings.translate)(shiftX, shiftY);
      (0, _settings.strokeWidth)(grid.lineWidth);
      (0, _settings.stroke)(grid.color);
      (0, _geometry.line)(x1, y1, x2, y2);
    }

    function drawMinor(x1, y1, x2, y2) {
      (0, _settings.strokeWidth)(grid.subgridLineWidth);
      (0, _settings.stroke)(grid.subgridLineColor);
      (0, _geometry.line)(x1, y1, x2, y2);
    }
  }

  (0, _settings.restore)();
  const ret = {
    center: center,
    // center of number plane
    unitValue: unitValue,
    // how much a unit is in its value
    unitSpace: unitSpace,
    // how much a unit is in px
    xAxis: axesLines.xAxis,
    // x axis confiurations from numberLine
    yAxis: axesLines.yAxis,
    // y axis confiurations from numberLine
    subgridUnit: subgridUnit // subgrid unit size

  };
  return Object.assign(ret, getPlotterList(unitSpace, unitValue, ret));
}

},{"../constants/colors.js":11,"../main.js":17,"../settings.js":32,"../utils.js":33,"./arrows.js":24,"./functions.js":27,"./geometry.js":28,"./text.js":31}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.functionGraph = functionGraph;
exports.heatPlot = heatPlot;
exports.parametricFunction = parametricFunction;

var _color_reader = require("../color/color_reader.js");

var _main = require("../main.js");

var _settings = require("../settings.js");

var _utils = require("../utils.js");

var _geometry = require("./geometry.js");

const animationEventChain = {
  then: function (f) {
    f();
    return animationEventChain;
  }
};
let counter = {
  parametricFunction: 1
};
/**
 * Draws a parametric functions
 * This accept parameters as object.
 * @param {object} args configuration object
 * It can have following properties:
 *
 * @param {function} args.paramFunction function to plot. Must recieve one argument and return a array of point as [x, y]
 * @param {number} [args.tension = 1] Smoothness tension.
 * @param {array} [args.range = [0, 10, 0.1]] Range as [min, max, dt]
 * @param {array} [args.discontinuities = []] Array of t where the curve discontinues.
 * @param {array} [args.unitValue = [1, 1]] Value of each unit space
 * @param {array} [args.unitLength = [1, 1]] Length of each unit in pixels
 * @param {boolean} [args.smoothen = true] Whether to smoothen the shape.
 * @param {boolean} [args.closed = false] Whether the function draws a closed shape.
 * @param {boolean} [args.draw = true] Wheteher to draw the function graph right now.
 *
 * @returns {object} object that contains following properties:
 *
 * * points  <array>    : Array of computed points in the function
 * * draw    <function> : Function that draws the plot
 * * animate <function> : Function that animates the drawing of the shape. Accept argument `duration` which is the duration of animation.
 */

function parametricFunction(args) {
  let defaultConfigs = {
    tension: 1,
    unitValue: [1, 1],
    unitLength: [1, 1],
    // length of each unit in pixels
    range: [0, 10, 0.1],
    discontinuities: [],
    smoothen: true,
    closed: false,
    draw: true,
    // for animation
    dur: 4000
  };
  args = (0, _utils.applyDefault)(defaultConfigs, args);
  let {
    paramFunction,
    range,
    smoothen,
    tension,
    discontinuities,
    closed
  } = args;
  if (Array.isArray(range) && range.length == 2) range.push((range[1] - range[0]) / 20);
  let points = [[]],
      min = range[0],
      max = range[1],
      step = range[2];
  if (!Array.isArray(discontinuities)) discontinuities = []; // generate points

  let epsilon = 1e-6,
      row = 0,
      noPoints = 0,
      unitX = args.unitLength[0] / args.unitValue[0],
      unitY = args.unitLength[1] / args.unitValue[1];
  if (step < epsilon) epsilon = step / 2;

  for (let t = min; t <= max + epsilon; t += step) {
    if ((0, _utils.approximateIndexInArray)(t, discontinuities, epsilon) > -1) {
      if ((0, _utils.approximateIndexInArray)(t + step, discontinuities, epsilon) > -1) {
        row++;
        points.push([]);
      }

      continue;
    }

    let ft = paramFunction(t);
    points[row].push([ft[0] * unitX, ft[1] * unitY]);
    noPoints++;
  } // draw the plot


  if (args.draw) plot();

  function plot() {
    let ctx = _main.C.workingCanvas;

    for (let i = 0; i < points.length; i++) {
      let p = points[i];

      if (smoothen) {
        (0, _geometry.smoothCurveThroughPoints)(p, tension, closed);
      } else {
        ctx.beginPath();
        ctx.moveTo(p[0][0], p[0][1]);

        for (let j = 1; j < p.length; j++) {
          ctx.lineTo(p[j][0], p[j][1]);
        }

        ctx.closePath();
        (0, _utils.doFillAndStroke)(ctx);
      }
    }
  }

  let ctx = _main.C.workingCanvas;
  return {
    points: points[0],
    dur: args.dur,
    name: "parametric-plot-" + counter.parametricFunction++,
    closed: args.closed,
    tension: args.tension || 1,
    smoothen: args.smoothen,
    rateFunction: args.rateFunction,
    syncWithTime: args.syncWithTime || false,
    draw: function (duration = 2000) {
      let dt = duration / noPoints;

      for (let i = 0; i < points.length; i++) {
        var p = points[i];
        let j = 0;

        if (smoothen) {
          (0, _settings.loop)("parametric-plot-" + counter.parametricFunction++, smoothed(j), _main.C.workingCanvas.name, dt);
        } else {
          (0, _settings.loop)("parametric-plot-" + counter.parametricFunction++, nonSmoothed(j), _main.C.workingCanvas.name, dt);
        }
      }

      function smoothed(j) {
        return function () {
          if (j >= p.length - 2) {
            (0, _settings.noLoop)();
            ctx.closePath();
            if (ctx.doFill) this.draw();
          }

          let recentPoint = j > 0 ? p[j - 1] : closed ? p[p.length - 2] : p[0],
              currentPoint = p[j],
              nextPoint = p[j + 1],
              secondNextPoint = j != p.length - 2 ? p[j + 2] : closed ? p[1] : nextPoint,
              cp = (0, _geometry.getBezierControlPoints)(recentPoint, currentPoint, nextPoint, secondNextPoint);
          j++;
          ctx.beginPath();
          ctx.moveTo(currentPoint[0], currentPoint[1]);
          ctx.bezierCurveTo(cp[0], cp[1], cp[2], cp[3], nextPoint[0], nextPoint[1]);
          ctx.stroke();
        };
      }

      function nonSmoothed(j) {
        return function () {
          if (j >= p.length - 2) {
            (0, _settings.noLoop)();
            if (ctx.doFill) this.draw();
          }

          let p1 = p[j],
              p2 = p[++j];
          (0, _geometry.line)(p1[0], p1[1], p2[0], p2[1]);
        };
      }

      return animationEventChain;
    }
  };
}
/**
 * Draws graph of funciton
 * See {@link parametricFunction} For arguments
 */


function functionGraph(args) {
  let paramFunction = args.paramFunction;

  args.paramFunction = x => [x, paramFunction(x)];

  return parametricFunction(args);
}
/**
 * Draws a heat plot of given function. The function must take atleast 2 arguments and return a number.
 * More precisely f: ℜ² → ℜ
 * All parameters should be enclosed in a object.
 * @param {object} args
 * Possible parameters are:
 *
 * @param {array} [args.min = [-4, -4]] minimum point
 * @param {array} [args.max = [4, 4]] maximum point
 * @param {object} args.colors object of color map
 * @param {array} [args.unitValue = [1, 1]] Value of each unit space
 * @param {array} [args.unitLength = [1, 1]] Length of each unit in pixels
 * @param {number} [args.resolution = 1] resolution of plot
 * @param {function} [args.interpolator = linear] function to interpolate color.
 * @return {object} metadatas
 */


function heatPlot(args) {
  let defaultConfigs = {
    min: [-4, -4],
    max: [4, 4],
    colors: {
      "-5": "#b36e38b0",
      "-3": "#ff9c52b0",
      "-1": "#ffcea9b0",
      0: "#dcdcddb0",
      1: "#9fcaedb0",
      3: "#3d96dab0",
      5: "#2b6b99b0"
    },
    unitLength: [1, 1],
    unitValue: [1, 1],
    resolution: 1,
    interpolator: x => x
  };
  args = (0, _utils.applyDefault)(defaultConfigs, args, false);
  let {
    min,
    max,
    colors,
    resolution,
    plotFunction,
    interpolator
  } = args,
      ctx = _main.C.workingCanvas,
      unitSizeX = args.unitLength[0] / args.unitValue[0],
      unitSizeY = args.unitLength[1] / args.unitValue[1],
      UVX = args.unitValue[0] / args.unitLength[0],
      UVY = args.unitValue[1] / args.unitLength[1],
      stopes = Object.keys(colors).sort(); // converting colors to rgba array

  for (let stop of stopes) colors[stop] = (0, _color_reader.readColor)(colors[stop], true);

  let minS = Math.min(...stopes),
      maxS = Math.max(...stopes);
  ctx.save();

  for (let x = min[0]; x <= max[0]; x += resolution * UVX) {
    for (let y = min[1]; y <= max[1]; y += resolution * UVY) {
      let c = lerpColorArray(plotFunction(x, y));
      ctx.fillStyle = c;
      ctx.fillRect(x * unitSizeX, y * unitSizeY, resolution, resolution);
    }
  }

  function lerpColorArray(v) {
    if (v >= maxS) return "rgba(" + colors[maxS].join() + ")";
    if (v <= minS) return "rgba(" + colors[minS].join() + ")";

    for (let i = 0; i < stopes.length - 1; i++) {
      let a = stopes[i],
          b = stopes[i + 1],
          c1 = colors[a],
          c2 = colors[b],
          k = interpolator((v - a) / (b - a));

      if (v >= a && v < b) {
        return "rgba(" + [(c2[0] - c1[0]) * k + c1[0], (c2[1] - c1[1]) * k + c1[1], (c2[2] - c1[2]) * k + c1[2], (c2[3] - c1[3]) * k + c1[3]].join() + ")";
      }
    }
  }

  ctx.restore();
  return {
    min: minS,
    max: maxS,
    colors: colors
  };
}

},{"../color/color_reader.js":6,"../main.js":17,"../settings.js":32,"../utils.js":33,"./geometry.js":28}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.angle = angle;
exports.annulus = annulus;
exports.annulusSector = annulusSector;
exports.arc = arc;
exports.arcBetweenPoints = arcBetweenPoints;
exports.bezier = bezier;
exports.circle = circle;
exports.circularSegment = circularSegment;
exports.ellipse = ellipse;
exports.equiTriangle = equiTriangle;
exports.getBezierControlPoints = getBezierControlPoints;
exports.line = line;
exports.point = point;
exports.polygon = polygon;
exports.quad = quad;
exports.quadraticCurve = quadraticCurve;
exports.rect = rect;
exports.regularPolygon = regularPolygon;
exports.regularPolygonWithRadius = regularPolygonWithRadius;
exports.sector = sector;
exports.smoothCurveThroughPoints = smoothCurveThroughPoints;
exports.smoothCurveThroughPointsTo = smoothCurveThroughPointsTo;
exports.square = square;
exports.triangle = triangle;

var _main = require("../main.js");

var _points = require("../math/points.js");

var _utils = require("../utils.js");

/**
 * Functions for drawing various shapes
 */

/**
 * Adds a circular arc to the current shape if {@link startShape} was called.
 * If not it will draw a new arc.
 *
 * @param {number} x The x-axis coordinate of the arc's center.
 * @param {number} y The y-axis coordinate of the arc's center.
 * @param {number} r arc's radius (must be positive)
 * @param {number} [angle=PI/2] central angle (use negative values to rotate arc clockwise)
 * @param {number} [startAngle=0] The angle at which the arc starts in radians, measured from the positive x-axis.
 */
function arc(x, y, r, angle = Math.PI / 2, startAngle = 0) {
  let ctx = _main.C.workingCanvas;
  if (!ctx.pathStarted) ctx.beginPath();
  ctx.arc(x, y, r, startAngle, startAngle + angle);
  if (!ctx.pathStarted) (0, _utils.doFillAndStroke)(ctx);
}
/**
 * Draws a point with given size in pixels
 *
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} [size=10] diameter of point in px
 * @param {boolean} [doStroke=false] whether to stroke or not
 */


function point(x, y, size = 10, doStroke = false) {
  let ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fill();
  if (doStroke) ctx.stroke();
  ctx.beginPath(); // close path don't work
}
/**
 * Draws a circular segment.
 *
 * @param {number} x x-axis coordinate of center of circular sector
 * @param {number} y y-axis coordinate of center of circular sector
 * @param {number} r radius of the circular sector
 * @param {number} [angle=Math.PI / 2] central angle
 * @param {number} [startAngle=0] The angle at which the arc starts in radians, measured from the positive x-axis.
 */


function circularSegment(x, y, r, angle = Math.PI / 2, startAngle = 0) {
  let ctx = _main.C.workingCanvas;
  if (!ctx.pathStarted) ctx.beginPath();
  ctx.arc(x, y, r, startAngle, startAngle + angle);
  if (!ctx.pathStarted) (0, _utils.doFillAndStroke)(ctx);
}
/**
 * Draws circle
 *
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} r radius
 */


function circle(x, y, r) {
  let ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  (0, _utils.doFillAndStroke)(ctx);
}
/**
 * Adds an elliptical arc to the current shape if {@link startShape} was called.
 * If not it will draw a new ellipse.
 *
 * @param {number} x x-axis coordinate of ellipse's center
 * @param {number} y y-axis coordinate of ellipse's center
 * @param {number} radius1 ellipse's major-axis radius. Must be non-negative.
 * @param {number} radius2 ellipse's minor-axis radius. Must be non-negative.
 * @param {number} [rotation=0] The rotation of the ellipse, expressed in radians.
 * @param {number} [startAngle=0] The angle at which the ellipse starts, measured clockwise from the positive x-axis and expressed in radians.
 * @param {number} [angle=Math.PI * 2] central angle of ellipse. Use negative values to rotate it anticlockwise
 */


function ellipse(x, y, radius1, radius2, rotation = 0, startAngle = 0, angle = Math.PI * 2) {
  let ctx = _main.C.workingCanvas;
  if (!ctx.pathStarted) ctx.beginPath();
  ctx.ellipse(x, y, radius1, radius2, rotation, startAngle, startAngle + angle);
  if (!ctx.pathStarted) (0, _utils.doFillAndStroke)(ctx);
}
/**
 * Adds a bézie curve to current shape if {@link startShape} was called.
 * If not it will draw a new bézie curve.
 *
 * @param {number} cpx1 x-axis coord of first control point
 * @param {number} cpy1 y-axis coord of first control point
 * @param {number} cpx2 x-axis coord of second control point
 * @param {number} cpy2 y-axis coord of second control point
 * @param {number} x3 x-axis coord of the end point
 * @param {number} y3 y-axis coord of the end point
 */


function bezier(cpx1, cpy1, cpx2, cpy2, x3, y3) {
  let ctx = _main.C.workingCanvas,
      pathStarted = ctx.pathStarted;
  if (!pathStarted) ctx.beginPath();
  ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x3, y3);
  if (!ctx.pathStarted) (0, _utils.doFillAndStroke)(ctx);
}
/**
 * Draws a sector
 *
 * @param {number} x center x
 * @param {number} y center y
 * @param {number} radius radius of sector
 * @param {number} [angle=PI/2] central angle (use negative angle to move sector clockwise)
 * @param {number} [startAngle=0] The angle at which the arc starts in radians, measured from the positive x-axis.
 */


function sector(x, y, radius, angle = Math.PI / 2, startAngle = 0) {
  let ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, radius, startAngle, startAngle + angle);
  ctx.lineTo(x, y);
  (0, _utils.doFillAndStroke)(ctx);
}
/**
 * Returns bēzier control points that passes smoothly through given points.
 *
 * @param {array} recentPoint previous point
 * @param {array} currentPoint
 * @param {array} nextPoint
 * @param {array} secondNextPoint
 * @param {number} [tension=1]
 * @return {array} two control points as [cp1x, cp1y, cp2x, cp2y]
 */


function getBezierControlPoints(recentPoint, currentPoint, nextPoint, secondNextPoint, tension = 1) {
  return [currentPoint[0] + (nextPoint[0] - recentPoint[0]) / 6 * tension, currentPoint[1] + (nextPoint[1] - recentPoint[1]) / 6 * tension, nextPoint[0] - (secondNextPoint[0] - currentPoint[0]) / 6 * tension, nextPoint[1] - (secondNextPoint[1] - currentPoint[1]) / 6 * tension];
}
/**
 * Adds a smooth curve passing through given points and tension using bézie curve to the current shape.
 * Taken from {@link https://stackoverflow.com/a/49371349}
 *
 * @param {array <array<number>>} points array of points as [x, y]
 * @param {number} tension tension of the curve
 */


function smoothCurveThroughPointsTo(points, tension = 1, closed = true) {
  for (let i = 0; i < points.length - 1; i++) {
    let recentPoint = i > 0 ? points[i - 1] : closed ? points[points.length - 2] : points[0],
        currentPoint = points[i],
        nextPoint = points[i + 1],
        secondNextPoint = i != points.length - 2 ? points[i + 2] : closed ? points[1] : nextPoint,
        cp = getBezierControlPoints(recentPoint, currentPoint, nextPoint, secondNextPoint, tension);

    _main.C.workingCanvas.bezierCurveTo(cp[0], cp[1], cp[2], cp[3], nextPoint[0], nextPoint[1]);
  }
}
/**
 * Draws smooth curve passing through given points and tension using bézie curve.
 *
 * @param {array <array<number>>} points array of points as [x, y]
 * @param {number} tension tension of the curve
 */


function smoothCurveThroughPoints(points, tension = 1, closed = true) {
  let ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  smoothCurveThroughPointsTo(points, tension, closed);
  if (ctx.doFill && closed) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}
/**
 * Adds a new quadratic curve to the current shape if the length of arguments is 4.
 * In that case
 * * 1st argument is x coordinate of the control point
 * * 2nd argument is y coordinate of the control point
 * * 3rd argument is x coordinate of the ending point
 * * 4th argument is y coordinate of the ending point
 *
 * If length of arguments is 6, it will draw a new curve.
 * * In that case
 * * 1st argument is x coordinate of starting point
 * * 2nd argument is y coordinate of starting point
 * * 3rd argument is x coordinate of the control point
 * * 4th argument is y coordinate of the control point
 * * 5th argument is x coordinate of the ending point
 * * 6th argument is y coordinate of the ending point
 * @global
 */


function quadraticCurve() {
  let ctx = _main.C.workingCanvas,
      args = arguments;

  if (args.length == 4) {
    ctx.quadraticCurveTo(args[0], args[1], args[2], args[3]);
  } else if (args.length == 6) {
    ctx.beginPath();
    ctx.moveTo(args[0], args[1]);
    ctx.quadraticCurveTo(args[2], args[3], args[4], args[5]);
    (0, _utils.doFillAndStroke)(ctx);
  }
}
/**
 * Draws a annulus (circle with hole in it).
 *
 * @param {number} x x-axis coord of center of the annulus.
 * @param {number} y y-axis coord of center of the annulus.
 * @param {number} innerRadius radius of the inner circle
 * @param {number} outerRadius radius of the outer circle
 */


function annulus(x, y, innerRadius, outerRadius) {
  let ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.arc(x, y, innerRadius, 0, 2 * Math.PI, false);
  ctx.moveTo(outerRadius, 0);
  ctx.arc(x, y, outerRadius, 0, 2 * Math.PI, true);
  (0, _utils.doFillAndStroke)(ctx);
}
/**
 * Draws a annulus sector.
 *
 * @param {number} x x-axis coord of center of the annulus sector.
 * @param {number} y y-axis coord of center of the annulus sector.
 * @param {number} innerRadius radius of the inner circle
 * @param {number} outerRadius radius of the outer circle
 * @param {number} angle central angle of the annulus sector
 * @param {number} startAngle The angle at which the sector starts in radians, measured from the positive x-axis.
 */


function annulusSector(x, y, innerRadius, outerRadius, angle, startAngle) {
  let ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.arc(x, y, innerRadius, startAngle, startAngle + angle, false);
  ctx.arc(x, y, outerRadius, startAngle + angle, startAngle, true);
  (0, _utils.doFillAndStroke)(ctx);
}
/**
 * Angle between two lines. And returns the coordinate of middle of angle
 *
 * @param {array<number>} p1 start point of first line array of point as [x, y]
 * @param {array<number>} p2 end point of first line array of point as [x, y]
 * @param {array<number>} p3 start point of second line array of point as [x, y]
 * @param {array<number>} p4 end point of second line array of point as [x, y]
 * @param {number} radius radius of angle
 * @param {number} extender extender of output point
 * @param {boolean} otherAngle whether to draw the other angle
 * @param {number} angleDir there can be four angle in a line intersection. Choose a number from 1 to 4.
 * @returns {array} coordinate of point in the middle of angle as array of point as [x, y]
 */


function angle(p1, p2, p3, p4, radius = 20, extender = 10, otherAngle = false, angleDir = 1) {
  let [x, y] = (0, _points.lineIntersection)(p1, p2, p3, p4);

  if (!(isNaN(x) || isNaN(y))) {
    let ang,
        startAngle,
        a1 = Math.atan2(p1[1] - y, p1[0] - x),
        a2 = Math.atan2(p2[1] - y, p2[0] - x),
        a3 = Math.atan2(p3[1] - y, p3[0] - x),
        a4 = Math.atan2(p4[1] - y, p4[0] - x),
        angleDirs = {
      1: [a2, a4],
      2: [a4, a1],
      3: [a1, a3],
      4: [a3, a2]
    },
        dir = angleDirs[angleDir],
        ctx = _main.C.workingCanvas;

    if (otherAngle) {
      startAngle = dir[1];
      ang = dir[0] - dir[1];
    } else {
      startAngle = dir[0];
      ang = dir[1] - dir[0];
    }

    if (ctx.doFill) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, radius, startAngle, ang + startAngle);
      ctx.fill();
      ctx.closePath();
    }

    if (ctx.doStroke) {
      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, ang + startAngle);
      ctx.stroke();
      ctx.closePath();
    }

    return {
      center: [x + (radius + extender) * Math.cos(startAngle + ang / 2), y + (radius + extender) * Math.sin(startAngle + ang / 2)],
      ang: ang
    };
  } else {
    // TODO: should it be `throw Error()`?
    console.error("No intersection point");
  }
}
/**
 * Creates a circular arc using the given control points and radius.
 * If a current path started it will add this to the end of path.
 * Returns the center of arc.
 *
 * @param {number} x1 x-coord of first point
 * @param {number} y1 y-coord of first point
 * @param {number} x2 x-coord of second point
 * @param {number} y2 y-coord of second point
 * @param {number} radius radius of arc
 * @param {boolean} otherArc specifies whether to use other arc of the circle.
 * @returns {array} returns the coordinate of center of the arc as [x, y]
 */


function arcBetweenPoints(x1, y1, x2, y2, radius, otherArc = false) {
  if (x1 == x2 && y1 == y2) // TODO: should it be `throw Error()`?
    console.error("Can't draw a arc between points. Given points are exactly same");
  let center = (0, _points.circleIntersection)([x1, y1], radius, [x2, y2], radius)[0],
      ctx = _main.C.workingCanvas,
      angleFromXAxis = Math.atan2(y1 - center[1], x1 - center[0]),
      centralAngle = Math.atan2(y2 - center[1], x2 - center[0]) - angleFromXAxis;

  if (!ctx.pathStarted) {
    ctx.save();
    ctx.beginPath();
  }

  ctx.arc(center[0], center[1], radius, angleFromXAxis, centralAngle + angleFromXAxis, !otherArc);

  if (!ctx.pathStarted) {
    (0, _utils.doFillAndStroke)(ctx);
    ctx.restore();
  }

  return center;
}
/**
 * Draws a line
 *
 * @param {number} x1 start x coord
 * @param {number} y1 start y coord
 * @param {number} x2 end x coord
 * @param {number} y2 end y coord
 */


function line(x1, y1, x2, y2) {
  let ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}
/**
 * Draws a rectangle
 *
 * @param {number} x x-coord
 * @param {number} y y-coord
 * @param {number} width widht
 * @param {number} height height
 */


function rect(x, y, width, height) {
  let ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}
/**
 * Draws polygon with given points
 * @example
 * ```
 * polygon(
 * 	[0, 0], // first point
 * 	[100, 200], // second point
 * 	[130, 230], // third point
 * 	//...
 * )
 * ```
 */


function polygon() {
  let args = arguments;

  if (args.length > 2) {
    let ctx = _main.C.workingCanvas,
        start = args[0];
    ctx.beginPath();
    ctx.moveTo(start[0], start[1]);

    for (let i = 1; i < args.length; i++) {
      ctx.lineTo(args[i][0], args[i][1]);
    }

    ctx.lineTo(start[0], start[1]);
    if (ctx.doFill) ctx.fill();
    if (ctx.doStroke) ctx.stroke();
    ctx.closePath();
  }
}
/**
 * Draws square
 *
 * @param {number} x x-coord
 * @param {number} y x-coord
 * @param {number} sideLength
 */


function square(x, y, sideLength) {
  rect(x, y, sideLength, sideLength);
}
/**
 * Draws quadrilateral with four points as array of coordinate as [x, y]
 *
 * @param {array<number>} p1 1st point
 * @param {array<number>} p2 2nd point
 * @param {array<number>} p3 3rd point
 * @param {array<number>} p4 4th point
 */


function quad(p1, p2, p3, p4) {
  let ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.lineTo(p3[0], p3[1]);
  ctx.lineTo(p4[0], p4[1]);
  ctx.lineTo(p1[0], p1[1]);
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}
/**
 * Draws triangle with three points as array of coordinate as [x, y]
 *
 * @param {array<number>} p1 first point
 * @param {array<number>} p2 second point
 * @param {array<number>} p3 third point
 */


function triangle(p1, p2, p3) {
  let ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.lineTo(p3[0], p3[1]);
  ctx.lineTo(p1[0], p1[1]);
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
  ctx.closePath();
}
/**
 * Draws equilateral triangle
 *
 * @param {number} x
 * @param {number} y
 * @param {number} sideLength length of side
 * @param {number} [rotation=0] amound to rotate the entire triangle
 */


function equiTriangle(x, y, sideLength, rotation = 0) {
  regularPolygon(x, y, 3, sideLength, rotation);
}
/**
 * Draws a regular polygon with centre position number of sides length of a side and rotation
 *
 * @param {number} x x position
 * @param {number} y y position
 * @param {number} sides number of sides
 * @param {number} sideLength length of a side
 * @param {number} [rotation=0] amound to rotate the entire polygon
 */


function regularPolygon(x, y, sides, sideLength, rotation = 0) {
  let radius = sideLength / (2 * Math.sin(Math.PI / sides)); // finds ex-radius

  regularPolygonWithRadius(x, y, sides, radius, rotation);
}
/**
 * Draws a regular polygon that is inside a circle
 *
 * @param {number} x x coord
 * @param {number} y y coord
 * @param {number} sides number of sides
 * @param {number} radius radius
 * @param {number} [rotation=0] amound to rotate the entire polygon
 */


function regularPolygonWithRadius(x, y, sides, radius, rotation = 0) {
  let i = 0,
      e = Math.PI * 2 / sides,
      ctx = _main.C.workingCanvas;
  rotation += e / 2;
  let initial = [Math.cos(rotation) * radius + x, Math.sin(rotation) * radius + y];
  ctx.beginPath();
  ctx.moveTo(initial[0], initial[1]);

  while (i++ < sides) {
    ctx.lineTo(Math.cos(i * e + rotation) * radius + x, Math.sin(i * e + rotation) * radius + y);
  }

  ctx.lineTo(initial[0], initial[1]);
  ctx.closePath();
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
}

},{"../main.js":17,"../math/points.js":20,"../utils.js":33}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lens = lens;
exports.polygonWithRatioOfCentralAngles = polygonWithRatioOfCentralAngles;

var _main = require("../main.js");

var _points = require("../math/points.js");

/**
 * Draws a polygon with ratio of central angles
 *
 * @param {number} x x coord of centre of polygon
 * @param {number} y y coord of centre of polygon
 * @param {number} radius radius of ex-circle of polygon
 * @param {array} ratios array of ratios of central angles. Must have atleast 3 elements.
 * @param {number} [rotation=0] amound to rotate the entire polygon.
 */
function polygonWithRatioOfCentralAngles(x, y, radius, ratios, rotation = 0) {
  if (!Array.isArray(ratios)) console.error("ratio provided is not array");
  let sumOfRatio = ratios.reduce((a, b) => a + b, 0),
      baseAngle = Math.PI * 2 / sumOfRatio,
      ctx = _main.C.workingCanvas;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(radius, 0);

  for (let i = 0; i < ratios.length; i++) {
    ctx.rotate(baseAngle * ratios[i]);
    ctx.lineTo(radius, 0);
  }

  if (ctx.doStroke) ctx.stroke();
  if (ctx.doFill) ctx.fill();
  ctx.closePath();
  ctx.restore();
}
/**
 * Creates a lens.
 * @param {array} c1 center coordinate as array [x, y]
 * @param {number} r1
 * @param {array} c2 center coordinate as array [x, y]
 * @param {number} r2
 */


function lens(c1, r1, c2, r2) {
  // find intersectionPoint
  let [pa, pb] = (0, _points.circleIntersection)(c1, r1, c2, r2); // angles to the points

  let c1a1 = Math.atan2(pa[1] - c1[1], pa[0] - c1[0]),
      c1a2 = Math.atan2(pb[1] - c1[1], pb[0] - c1[0]),
      c2a1 = Math.atan2(pa[1] - c2[1], pa[0] - c2[0]),
      c2a2 = Math.atan2(pb[1] - c2[1], pb[0] - c2[0]),
      ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.arc(c1[0], c1[1], r1, c1a1, c1a2);
  ctx.arc(c2[0], c2[1], r2, c2a2, c2a1);
  if (ctx.doStroke) ctx.stroke();
  if (ctx.doFill) ctx.fill();
  ctx.closePath();
}

},{"../main.js":17,"../math/points.js":20}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getImageFromTex = getImageFromTex;
exports.tex = tex;

var _drawing = require("../constants/drawing.js");

var _main = require("../main.js");

/**
 * Renders the input tex into a HTMLImageElement
 *
 * @param {string} input
 * @return {HTMLImageElement}
 */
function getImageFromTex(input) {
  if (typeof window.MathJax == "object" && typeof window.MathJax.tex2svg == "function") {
    let ctx = _main.C.workingCanvas,
        svgOutput = window.MathJax.tex2svg(input).getElementsByTagName("svg")[0],
        g = svgOutput.getElementsByTagName("g")[0];
    svgOutput.style.verticalAlign = "1ex";
    g.setAttribute("stroke", ctx.strokeStyle);
    g.setAttribute("fill", ctx.fillStyle);
    let outerHTML = svgOutput.outerHTML,
        blob = new Blob([outerHTML], {
      type: "image/svg+xml;charset=utf-8"
    }),
        URL = window.URL || window.webkitURL || window,
        blobURL = URL.createObjectURL(blob),
        image = new Image();
    image.src = blobURL;
    return image;
  } else {
    console.error("MathJax is not found. Please include it.");
  }
}
/**
 * Draws tex inputs
 *
 * @param {string} input
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @return {HTMLImageElement} image representation of tex
 */


function tex(input, x = 0, y = 0) {
  let image = getImageFromTex(input),
      ctx = _main.C.workingCanvas,
      text_align = ctx.textAlign,
      text_baseline = ctx.textBaseline;

  image.onload = function () {
    ctx.save();
    let {
      width,
      height
    } = image; // translating the image according to text-align and text-baseline

    switch (text_align) {
      case _drawing.CENTER:
        ctx.translate(-width / 2, 0);
        break;

      case _drawing.RIGHT:
        ctx.translate(-width, 0);
        break;

      default:
        break;
    }

    switch (text_baseline) {
      case "middle":
        ctx.translate(0, height / 2);
        break;

      case "bottom":
        ctx.translate(0, height);
        break;

      default:
        break;
    } // invert axis first


    if (ctx.yAxisInverted) {
      ctx.scale(1, -1);
      y *= -1;
    }

    ctx.drawImage(image, x, y);
    ctx.restore();
  };

  return image;
}

},{"../constants/drawing.js":12,"../main.js":17}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillText = fillText;
exports.strokeText = strokeText;
exports.text = text;

var _main = require("../main.js");

var _settings = require("../settings.js");

/**
 * This module contains functions for drawing different types of text.
 * @module text
 */

/**
 * Draws a filled & stroked text
 *
 * @param {string} text text to draw
 * @param {number} [x=0] x-coord
 * @param {number} [y=0] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */
function text(text, x = 0, y = 0, maxwidth = undefined) {
  let ctx = _main.C.workingCanvas;

  if (ctx.yAxisInverted) {
    // if inverted reverse it and invert y component
    (0, _settings.scale)(1, -1);
    y *= -1;
  }

  if (ctx.doFill) ctx.fillText(text, x, y, maxwidth);else if (ctx.doStroke) ctx.strokeText(text, x, y, maxwidth);
  if (ctx.yAxisInverted) (0, _settings.scale)(1, -1); // reverse y-invertion
}
/**
 * Draws a text without border
 *
 * @param {string} text text to draw
 * @param {number} x x-coord
 * @param {number} [y=x] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */


function fillText(text, x = 0, y = 0, maxwidth = undefined) {
  let ctx = _main.C.workingCanvas;

  if (ctx.yAxisInverted) {
    (0, _settings.scale)(1, -1);
    y *= -1;
  }

  ctx.fillText(text, x, y, maxwidth);
  if (ctx.yAxisInverted) (0, _settings.scale)(1, -1);
}
/**
 * Draws a stroked text
 *
 * @param {string} text text to draw
 * @param {number} x x-coord
 * @param {number} [y=x] y-coord
 * @param {number} [maxwidth=undefined] maximum width
 */


function strokeText(text, x = 0, y = 0, maxwidth = undefined) {
  let ctx = _main.C.workingCanvas;

  if (ctx.yAxisInverted) {
    (0, _settings.scale)(1, -1);
    y *= -1;
  }

  ctx.strokeText(text, x, y, maxwidth);
  if (ctx.yAxisInverted) (0, _settings.scale)(1, -1);
}

},{"../main.js":17,"../settings.js":32}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.background = background;
exports.cartasianPlain = cartasianPlain;
exports.centerdText = centerdText;
exports.centreCanvas = centreCanvas;
exports.clear = clear;
exports.clearAll = clearAll;
exports.endShape = endShape;
exports.fill = fill;
exports.fontFamily = fontFamily;
exports.fontSize = fontSize;
exports.fontStretch = fontStretch;
exports.fontStyle = fontStyle;
exports.fontVariant = fontVariant;
exports.fontWeight = fontWeight;
exports.getCanvasData = getCanvasData;
exports.getContextStates = getContextStates;
exports.getFill = getFill;
exports.getFont = getFont;
exports.getStroke = getStroke;
exports.getStrokeWidth = getStrokeWidth;
exports.getTransform = getTransform;
exports.initContrastedCanvas = initContrastedCanvas;
exports.invertYAxis = invertYAxis;
exports.lineCap = lineCap;
exports.lineDash = lineDash;
exports.lineHeight = lineHeight;
exports.lineJoin = lineJoin;
exports.lineTo = lineTo;
exports.loop = loop;
exports.measureText = measureText;
exports.moveTo = moveTo;
exports.noFill = noFill;
exports.noLoop = noLoop;
exports.noStroke = noStroke;
exports.permaBackground = permaBackground;
exports.putImageData = putImageData;
exports.rest = rest;
exports.restore = restore;
exports.rotate = rotate;
exports.save = save;
exports.saveCanvas = saveCanvas;
exports.scale = scale;
exports.setImageSmoothing = setImageSmoothing;
exports.setTransform = setTransform;
exports.showCreation = showCreation;
exports.startShape = startShape;
exports.stroke = stroke;
exports.strokeWidth = strokeWidth;
exports.textAlign = textAlign;
exports.textBaseline = textBaseline;
exports.transform = transform;
exports.translate = translate;
exports.wait = wait;

var _create = require("./animations/create.js");

var _color_reader = require("./color/color_reader.js");

var _colors = require("./constants/colors.js");

var _main = require("./main.js");

var _rate_functions = require("./math/rate_functions.js");

var _coordinate_systems = require("./objects/coordinate_systems.js");

var _geometry = require("./objects/geometry.js");

var _utils = require("./utils.js");

// for debuggingF
let counter = {
  wait: 1,
  loop: 1
},
    logStyles = {
  number: "color: #9afcad;",
  keyword: "color: #adacdf;",
  running: "color: yellow;",
  delayed: "color: orange;",
  finished: "color: #3aff5f;"
};
/**
 * Begins a new shape at the point specified by the given (x, y) coordinates.
 *
 * @param {number} x
 * @param {number} y
 */

function moveTo(x, y) {
  _main.C.workingCanvas.moveTo(x, y);
}
/**
 * Adda a straight line to the current shape by connecting the shape's last point to the specified (x, y) coordinates.
 *
 * @param {number} x
 * @param {number} y
 */


function lineTo(x, y) {
  _main.C.workingCanvas.lineTo(x, y);
}
/**
 * Sets background to a given value
 *
 * Accepted values:
 * * a hex string (#fff, #acf2dc)
 * * a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * * a array of numbers ([0, 244, 34])
 */


function background() {
  let col = (0, _color_reader.readColor)(...arguments),
      ctx = _main.C.workingCanvas;
  ctx.background = col;
  ctx.save();
  rest();
  ctx.fillStyle = col;
  ctx.fillRect(0, 0, ctx.width, ctx.height);
  ctx.restore();
}
/**
 * Erases the pixels in a rectangular area by setting them to transparent black
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch} for more info
 *
 * @param {number} x x-axis coordinate of the rectangle's starting point.
 * @param {number} y y-axis coordinate of the rectangle's starting point.
 * @param {number} width Rectangle's width. Positive values are to the right, and negative values to the left.
 * @param {number} height Rectangle's height. positive values are down, and negative are up.
 */


function clear(x, y, width, height) {
  let ctx = _main.C.workingCanvas;
  x = x || 0;
  y = y || 0;
  width = width || ctx.width;
  height = height || ctx.height;
  ctx.clearRect(x, y, width, height);
}
/**
 * Erases entire canvas area by setting them to transparent black
 *
 */


function clearAll() {
  let ctx = _main.C.workingCanvas,
      d = ctx.dpr;
  ctx.save();
  ctx.setTransform(d, 0, 0, d, 0, 0);
  ctx.clearRect(0, 0, ctx.width, ctx.height);
  ctx.restore();
}
/**
 * sets the given image data as css background. If not given it will set current canvas drawing as the background
 *
 */


function permaBackground(data) {
  if (typeof data != "string") data = getCanvasData();
  let canvasStyle = _main.C.workingCanvas.canvas.style;
  canvasStyle.background = "url('" + data + "')";
  canvasStyle.backgroundPosition = "center";
  canvasStyle.backgroundSize = "cover";
}
/**
 * Resets the current transformation to the identity matrix,
 * and then invokes a transformation described by given arguments.
 * Lets you scale, rotate, translate (move), and skew the canvas.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform} for more info
 *
 * @param {number|DOMMatrix} a Horizontal scaling. A value of 1 results in no scaling.
 *  this can be a `DOMMatrix` which can get by {@link getTransform} function
 * @param {number} b Vertical skewing
 * @param {number} c Horizontal skewing
 * @param {number} d Vertical scaling. A value of 1 results in no scaling
 * @param {number} e Horizontal translation
 * @param {number} f Vertical translation
 */


function setTransform(a, b, c, d, e, f) {
  let ctx = _main.C.workingCanvas;
  if (a instanceof DOMMatrix) ctx.setTransform(a);else ctx.setTransform(a, b, c, d, e, f);
  ctx.scale(ctx.dpr, ctx.dpr);
}
/**
 * Returns the current transform matrix
 *
 * @return {DOMMatrix}
 */


function getTransform() {
  return _main.C.workingCanvas.getTransform();
}
/**
 * multiplies the current transformation with the matrix described by the arguments
 * of this method. This lets you scale, rotate, translate (move), and skew the context.
 *
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform} for more info
 *
 * @param {number|DOMMatrix} a Horizontal scaling. A value of 1 results in no scaling.
 *  this can be a `DOMMatrix` which can get by {@link getTransform} function
 * @param {number} b Vertical skewing
 * @param {number} c Horizontal skewing
 * @param {number} d Vertical scaling. A value of 1 results in no scaling
 * @param {number} e Horizontal translation
 * @param {number} f Vertical translation
 */


function transform(a, b, c, d, e, f) {
  let ctx = _main.C.workingCanvas;
  if (a instanceof DOMMatrix) ctx.transform(a);else ctx.transform(a, b, c, d, e, f);
}
/**
 * Prevent filling inside shapes
 *
 */


function noFill() {
  _main.C.workingCanvas.doFill = false;
}
/**
 * Prevent drawing strokes of shapes
 *
 */


function noStroke() {
  _main.C.workingCanvas.doStroke = false;
}
/**
 * Translates (moves) canvas to a position
 *
 * @param {number} x amound to translate along x-axis
 * @param {number} [y=0] amound to translate along y-axis
 */


function translate(x, y = 0) {
  _main.C.workingCanvas.translate(x, y);
}
/**
 * Sets whether to enable image smoothening
 *
 * @param {boolean} bool
 */


function setImageSmoothing(bool) {
  _main.C.workingCanvas.imageSmoothingEnabled = !!bool;
}
/**
 * Sets the stroke width (line width/line thickness)
 *
 * @param {number} w
 */


function strokeWidth(w) {
  _main.C.workingCanvas.lineWidth = Number(w);
}
/**
 * Scales the canvas by a given amount
 *
 * @param {number} x Scaling factor in the horizontal direction. A negative value flips pixels across
 *  the vertical axis. A value of 1 results in no horizontal scaling.
 * @param {number} [y=x] Scaling factor in the vertical direction. A negative value flips pixels across
 *  the horizontal axis. A value of 1 results in no vertical scaling.
 */


function scale(x, y = x) {
  _main.C.workingCanvas.scale(x, y);
}
/**
 * Rotates the canvas
 *
 * @param {number} angle The rotation angle, clockwise in radians. You can use degree * DEG to calculate a radian from a degree.
 */


function rotate(angle) {
  let ctx = _main.C.workingCanvas;
  ctx.rotate(angle);
  ctx.netRotation = (ctx.netRotation + angle) % Math.PI * 2;
}
/**
 * Saves the current state of canvas

 */


function save() {
  _main.C.savedStates = getContextStates();

  _main.C.workingCanvas.save();
}
/**
 * Set the type of line end
 * Options: BUTT, ROUND, SQUARE
 *
 * @param {string} capType
 */


function lineCap(capType) {
  _main.C.workingCanvas.lineCap = capType;
}
/**
 * Sets type of line joining
 * Options: BEVEL, ROUND, MITER
 *
 * @param {string} joinType
 */


function lineJoin(joinType) {
  _main.C.workingCanvas.lineJoin = joinType;
}
/**
 * Restore the saved state of canvas
 *
 */


function restore() {
  Object.assign(_main.C.workingCanvas, _main.C.savedStates);

  _main.C.workingCanvas.restore();
}
/**
 * Returns fill color/gradient
 *
 * @returns {string|CanvasGradient}
 */


function getFill() {
  return _main.C.workingCanvas.fillStyle;
}
/**
 * Returns stroke color/gradient
 *
 * @returns {string|CanvasGradient}
 */


function getStroke() {
  return _main.C.workingCanvas.strokeStyle;
}
/**
 * Returns stroke width
 *
 * @returns {number}
 */


function getStrokeWidth() {
  return _main.C.workingCanvas.lineWidth;
}
/**
 * Reset the applied transform to idendity matrix and scales canvas by dpr
 *
 */


function rest() {
  let ctx = _main.C.workingCanvas;
  ctx.setTransform(ctx.dpr, 0, 0, ctx.dpr, 0, 0);
}
/**
 * Sets stroke color to a given value if value is given
 * else strokes the previous shape
 *
 * Accepted values:
 * * hex string (#fff, #acf2dc)
 * * number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * * array of numbers ([0, 244, 34]). This gets converted into css color by the colorMode property
 *
 */


function stroke() {
  let ctx = _main.C.workingCanvas;

  if (arguments.length > 0) {
    ctx.strokeStyle = (0, _color_reader.readColor)(...arguments);
    ctx.doStroke = true;
  } else {
    ctx.stroke();
  }
}
/**
 * Sets fill color to a given value if value is given
 * else fills the previous shape
 *
 * Accepted values:
 * * a hex string (#fff, #acf2dc)
 * * a number (0 for rgb(0,0,0), 233 for rgb(233,233,233))
 * * a array of numbers ([0, 244, 34]). This gets converted into css color by the colorMode property
 *
 */


function fill() {
  let ctx = _main.C.workingCanvas;

  if (arguments.length !== 0) {
    ctx.fillStyle = (0, _color_reader.readColor)(...arguments);
    ctx.doFill = true;
  } else {
    ctx.fill();
  }
}
/**
 * Returns variables in workingCanvas or given canvas
 *
 * @param {string} canvasID id of canvas to get the data.
 * @returns {Object}
 */


function getContextStates(canvasName) {
  let ctx = _main.C.canvasList[canvasName] || _main.C.workingCanvas;
  return {
    background: ctx.background,
    colorMode: ctx.colorMode,
    strokeStyle: ctx.strokeStyle,
    fillStyle: ctx.fillStyle,
    lineWidth: ctx.lineWidth,
    doStroke: ctx.doStroke,
    doFill: ctx.doFill,
    pathStarted: ctx.pathStarted,
    yAxisInverted: ctx.yAxisInverted,
    netRotation: ctx.netRotation,
    fontStyle: ctx.fontStyle,
    fontVariant: ctx.fontVariant,
    fontWeight: ctx.fontWeight,
    fontStretch: ctx.fontStretch,
    fontSize: ctx.fontSize,
    lineHeight: ctx.lineHeight,
    fontFamily: ctx.fontFamily,
    font: ctx.font,
    textAlign: ctx.textAlign,
    textBaseline: ctx.textBaseline,
    onclick: ctx.onclick,
    onmousemove: ctx.onmousemove,
    onmouseout: ctx.onmouseout,
    onmousedown: ctx.onmousedown,
    onmouseup: ctx.onmouseup,
    onmousewheel: ctx.onmousewheel,
    // key
    onkeydown: ctx.onkeydown,
    onkeyup: ctx.onkeyup,
    onkeypress: ctx.onkeypress,
    oncopy: ctx.oncopy,
    onpaste: ctx.onpaste,
    oncut: ctx.oncut,
    // touch
    ontouchstart: ctx.ontouchstart,
    ontouchmove: ctx.ontouchmove,
    ontouchend: ctx.ontouchend,
    ontouchcancel: ctx.ontouchcancel,
    // scale
    onresize: ctx.onresize,
    // dom
    onblur: ctx.onblur,
    onfocus: ctx.onfocus,
    onchange: ctx.onchange,
    oninput: ctx.oninput,
    onload: ctx.onload,
    onscroll: ctx.onscroll,
    onwheel: ctx.onwheel,
    onpointerdown: ctx.onpointerdown,
    onpointermove: ctx.onpointermove,
    onpointerup: ctx.onpointerup,
    onpointercancel: ctx.onpointercancel,
    onpointerover: ctx.onpointerover,
    onpointerout: ctx.onpointerout,
    onpointerenter: ctx.onpointerenter,
    onpointerleave: ctx.onpointerleave,
    onfullscreenchange: ctx.onfullscreenchange
  };
}
/**
 * Starts a new loop
 * ! Currently in progress with asynchronous animations.
 * @param {function} functionToRun function which contains code to run
 * @param {string} canvasName name of canvas. It must be unique if you're running multiple animation at once
 * @param {number} timeDelay time delay between 2 frames. If given loop will execute with setInterval function.
 *  If not provided the loop will be run with requestAnimationFrame (this keeps a consistant frame rate between 40 to 50 FPS).
 * @param {number} [timeDelaysToRemember=10] number of time delays to remember.
 */


function loop(name, functionToRun, canvasName, timeDelay, timeDelaysToRemember = 100, settings = {}, dur) {
  let ctx; // if name isn't given it will shift the arguments to right

  if (typeof name == "function") {
    // shift arguments
    name = counter.loop++;
    functionToRun = arguments[0];
    canvasName = arguments[1];
    timeDelay = arguments[2];
    settings = arguments[3];
    dur = arguments[4];
  }

  if (!canvasName) {
    ctx = _main.C.workingCanvas;
    canvasName = ctx.name;
  } else ctx = _main.C.canvasList[canvasName];

  ctx.timeDelayList = [];
  ctx.totalTimeCaptured = 0;
  let assignedSettings = Object.assign(getContextStates(canvasName), settings); // debugger;

  if (ctx.currentLoop != undefined) {
    // already a animation is running
    if (_main.C.debugAnimations) {
      console.log(canvasName + ": " + name + " %cdelayed", logStyles.delayed);

      _main.C._ANIMATIONLOG_.push({
        canvas: ctx,
        animationName: name,
        state: "delayed",
        settings: assignedSettings
      });
    }

    ctx.delayedAnimations.push({
      name: name,
      settings: assignedSettings,
      functionToRun: functionToRun,
      canvasName: canvasName,
      timeDelay: timeDelay,
      timeDelaysToRemember: timeDelaysToRemember,
      dur: dur
    });
  } else {
    if (_main.C.debugAnimations) {
      let toLog = `${canvasName}: ${name} %crunning`,
          styles = [logStyles.running];

      if (dur != undefined) {
        toLog += `%c for %c${dur}ms`;
        styles.push(logStyles.keyword, logStyles.number);
      }

      _main.C._ANIMATIONLOG_.push({
        canvas: ctx,
        animationName: name,
        state: "running",
        settings: assignedSettings,
        dur: dur
      });

      console.log(toLog, ...styles);
    }

    ctx.recentTimeStamp = window.performance.now();
    ctx.timeStart = window.performance.now();

    if (!isNaN(timeDelay)) {
      ctx.currentLoopName = name;
      ctx.currentLoop = setInterval(function () {
        _main.C.workingCanvas = ctx;
        let S = getContextStates(canvasName);
        Object.assign(_main.C.workingCanvas, assignedSettings);
        functionToRun(window.performance.now() - ctx.timeStart, getFPS());
        Object.assign(_main.C.workingCanvas, S);
      }, timeDelay);
    } else {
      run();
    }
  }

  function run() {
    ctx.currentLoop = window.requestAnimationFrame(run);
    _main.C.workingCanvas = ctx;
    let S = getContextStates(canvasName);
    if (settings) Object.assign(_main.C.workingCanvas, assignedSettings);
    functionToRun(window.performance.now() - ctx.timeStart, getFPS());
    if (settings) Object.assign(_main.C.workingCanvas, S);
  }

  function getFPS() {
    let now = window.performance.now(),
        timeDelay = now - ctx.recentTimeStamp; // time delays between frames

    ctx.recentTimeStamp = now;
    ctx.timeDelayList.push(timeDelay);
    ctx.totalTimeCaptured += timeDelay;
    if (ctx.timeDelayList.length > timeDelaysToRemember) ctx.totalTimeCaptured -= ctx.timeDelayList.shift();
    return ctx.timeDelayList.length / (ctx.totalTimeCaptured / 1000);
  }
}
/**
 * Stops current loop
 *
 * @param {string} canvasName name of the canvas given to {@link loop}
 */


function noLoop(canvasName, time) {
  let ctx = _main.C.workingCanvas;
  if (!canvasName) canvasName = ctx.name;else ctx = _main.C.canvasList[canvasName];
  clearInterval(ctx.currentLoop);
  window.cancelAnimationFrame(ctx.currentLoop);
  ctx.currentLoop = undefined;

  if (_main.C.debugAnimations) {
    let toLog = `${canvasName}: ${ctx.currentLoopName} %cfinished`,
        formatter = [logStyles.finished];

    if (time != undefined) {
      toLog += `%c in %c${time.toFixed(3)}ms`;
      formatter.push(logStyles.keyword, logStyles.number);
    }

    console.log(toLog, ...formatter);

    _main.C._ANIMATIONLOG_.push({
      canvas: ctx,
      animationName: ctx.currentLoopName,
      state: "finished",
      endTime: time
    });
  }

  if (ctx.delayedAnimations.length > 0) {
    let toWork = ctx.delayedAnimations.shift();
    loop(toWork.name, toWork.functionToRun, toWork.canvasName, toWork.timeDelay, toWork.timeDelaysToRememberm, toWork.settings, toWork.dur);
  }
}
/**
 * Starts a new Path
 *
 */


function startShape() {
  let ctx = _main.C.workingCanvas;
  ctx.beginPath();
  ctx.pathStarted = true;
}
/**
 * Ends current Path
 *
 */


function endShape() {
  let ctx = _main.C.workingCanvas;
  ctx.closePath();
  ctx.pathStarted = false;
}
/**
 * Return current font
 *
 * @param {boolean} detailed wheather to return a detailed font property
 * @returns {string}
 */


function getFont(detailed = false) {
  let ctx = _main.C.workingCanvas;

  if (detailed) {
    let {
      fontStyle,
      fontVariant,
      fontWeight,
      fontStretch,
      fontSize,
      lineHeight,
      fontFamily
    } = ctx;
    return `${fontStyle} ${fontVariant} ${fontWeight} ${fontStretch} ${fontSize}/${lineHeight} ${fontFamily}`;
  } else {
    return ctx.font;
  }
}
/**
 * Returns text metrics
 *
 * @param {string} text
 * @returns {TextMetrics}
 */


function measureText(text) {
  return _main.C.workingCanvas.measureText(text);
}
/**
 * Sets font size
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font} for more info.
 * @param {number|string} size
 * possible values:
 * * XX_SMALL
 * * X_SMALL
 * * SMALL
 * * MEDIUM
 * * LARGE
 * * X_LARGE
 * * XX_LARGE
 * * XXX_LARGE
 * * LARGER
 * * SMALLER
 */


function fontSize(size) {
  let ctx = _main.C.workingCanvas;
  size = typeof size === "number" ? size + "px" : size;
  ctx.fontSize = size;
  ctx.font = getFont(true);
}
/**
 * Sets font family
 *
 * @param {string} family
 */


function fontFamily(family) {
  let ctx = _main.C.workingCanvas;
  ctx.fontFamily = family;
  ctx.font = getFont(true);
}
/**
 * Sets font style
 *
 * @param {string} style
 * possible values:
 * * NORMAL
 * * ITALIC
 * * OBLIQUE [<angle>]
 */


function fontStyle(style) {
  let ctx = _main.C.workingCanvas;
  ctx.fontStyle = style;
  ctx.font = getFont(true);
}
/**
 * Sets font variant
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant} for more info.
 *
 * @param {string} variant
 */


function fontVariant(variant) {
  let ctx = _main.C.workingCanvas;
  ctx.fontVariant = variant;
  ctx.font = getFont(true);
}
/**
 * Sets font weight
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight} for more info.
 * @param {string} weight
 */


function fontWeight(weight) {
  let ctx = _main.C.workingCanvas;
  ctx.fontWeight = weight;
  ctx.font = getFont(true);
}
/**
 * Sets font stretch
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font} for more info.
 *
 *  @global
 * @param {string} stretch
 * possible values:
 * * ULTRA_CONDENSED
 * * EXTRA_CONDENSED
 * * CONDENSED
 * * SEMI_CONDENSED
 * * NORMAL
 * * SEMI_EXPANDED
 * * EXPANDED
 * * EXTRA_EXPANDED
 * * ULTRA_EXPANDED
 * * <percentage>
 */


function fontStretch(stretch) {
  let ctx = _main.C.workingCanvas;
  ctx.fontStretch = stretch;
  ctx.font = getFont(true);
}
/**
 * Sets line height
 * See {@link https://developer.mozilla.org/en-US/docs/Web/CSS/line-height} for more info.
 *
 * @param {string} height
 */


function lineHeight(height) {
  let ctx = _main.C.workingCanvas;
  ctx.lineHeight = height;
  ctx.font = getFont(true);
}
/**
 * Returns canvas image data as string
 *
 * @param {string} datURL
 * @returns {string}
 */


function getCanvasData(datURL = "image/png") {
  return _main.C.workingCanvas.canvas.toDataURL(datURL);
}
/**
 * puts a imageData to canvas
 * @param {ImageData} imageData
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 */


function putImageData() {
  _main.C.workingCanvas.putImageData(...arguments);
}
/**
 * Save the canvas as image
 *
 * @param {string} [name="drawing"] name of file
 * @param {string} [datURL="image/png"] type of file
 */


function saveCanvas(name = "drawing", datURL = "image/png") {
  let link = getCanvasData().replace(datURL, "image/octet-stream"),
      a = document.createElement("a");
  a.download = name + ".png";
  a.href = link;
  a.click();
}
/**
 * Sets the line dash
 * see {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setLineDash} for more info
 *
 */


function lineDash() {
  _main.C.workingCanvas.setLineDash([...arguments]);
}
/**
 * Specifies the current text alignment used when drawing text.
 * The alignment is relative to the x value of the fillText/strokeText/text method.
 *
 * @param {string} align alignment type.
 * possible values:
 *  * "left" : The text is left-aligned.
 *  * "right" : The text is right-aligned.
 *  * "center" : The text is centered.
 *  * "start" : The text is aligned at the normal start of the line (left-aligned for left-to-right locales, right-aligned for right-to-left locales).
 *  * "end": The text is aligned at the normal end of the line (right-aligned for left-to-right locales, left-aligned for right-to-left locales).
 * NOTE: You can use constants LEFT, RIGHT, CENTER, START, and END for aligning
 */


function textAlign(align) {
  _main.C.workingCanvas.textAlign = align;
}
/**
 * Specifies the current text baseline used when drawing text.
 * The alignment is relative to the x value of the fillText/strokeText/text method.
 *
 * @param {string} baseline baseline type.
 * possible values:
 * * "top": The text baseline is the top of the em square.
 * * "hanging": The text baseline is the hanging baseline. (Used by Tibetan and other Indic scripts.)
 * * "middle": The text baseline is the middle of the em square.
 * * "alphabetic": The text baseline is the normal alphabetic baseline. Default value.
 * * "ideographic": The text baseline is the ideographic baseline; this is the bottom of the body of the characters, if the main body of characters protrudes beneath the alphabetic baseline. (Used by Chinese, Japanese, and Korean scripts.)
 * * "bottom": The text baseline is the bottom of the bounding box. This differs from the ideographic baseline in that the ideographic baseline doesn't consider descenders.
 * NOTE: You can use constants TOP, HANGING, MIDDLE, ALPHABETIC, IDEOGRAPHIC, BOTTOM for baseline
 */


function textBaseline(baseline) {
  _main.C.workingCanvas.textBaseline = baseline;
}
/**
 * Sets the text alignment to centered in x and y axes.
 *
 */


function centerdText() {
  textAlign("center");
  textBaseline("middle");
}
/**
 * translates canvas to center
 */


function centreCanvas() {
  let ctx = _main.C.workingCanvas;
  ctx.translate(ctx.width / 2, ctx.height / 2);
}
/**
 * Inverts y-axis
 */


function invertYAxis() {
  let ctx = _main.C.workingCanvas;
  ctx.scale(1, -1);
  ctx.yAxisInverted = !ctx.yAxisInverted;
}
/**
 * Centers canvas to center, with black background, yellow stroke, no fill enabled and y axis inverted
 */


function initContrastedCanvas() {
  background(0);
  stroke(_colors.YELLOW);
  noFill();
}
/**
 * Wait for a given time in milliseconds.
 *
 * @param {number} time time in milliseconds
 * @param {string} canvasName canvas name
 */


function wait(time, canvasName, name) {
  canvasName = _main.C.workingCanvas.name || canvasName;
  loop(name || "wait-" + counter.wait++, elapsed => {
    if (elapsed >= time) noLoop(canvasName, elapsed);
  }, canvasName, time, 500, {}, time);
}

function showCreation() {
  let animations = Array.prototype.slice.call(arguments);

  for (let i = 0; i < animations.length; i++) {
    let animation = animations[i];

    if ((0, _utils.getType)(animation) == "Object") {
      let dur = animation.dur || 2000,
          ctx = animation.canvas || _main.C.workingCanvas,
          next = animation.next || null,
          name = animation.name,
          dTime = animation.dTime || 14,
          points = animation.points,
          closed = animation.closed || false,
          tension = animation.tension || 1,
          smoothen = animation.smoothen == undefined ? true : animation.smoothen,
          rateFunction = animation.rateFunction || _rate_functions.smooth,
          syncWithTime = animation.syncWithTime || false,
          t = 0,
          dt = dTime / dur,
          len = points.length - 1;

      if (ctx.lineWidth > 0 && ctx.doStroke) {
        if (typeof animation.draw != "function") {
          if (smoothen) {
            loop(name, elapsed => {
              if (t > 1) {
                noLoop(ctx.name, elapsed);
              }

              let i = Math.round(len * rateFunction(t)),
                  ip1 = Math.round(len * rateFunction(t + dt)),
                  ip2 = Math.round(len * rateFunction(t + dt * 2));

              if (closed) {
                i %= len;
                ip1 %= len;
                ip2 %= len;
              }

              let recentPoint = points[Math.round(len * rateFunction(t - dt))] || points[len - Math.abs(Math.round(len * rateFunction(t - dt)))],
                  currentPoint = points[i],
                  nextPoint = points[ip1],
                  secondNextPoint = points[ip2],
                  cp = (0, _geometry.getBezierControlPoints)(recentPoint, currentPoint, nextPoint, secondNextPoint, tension);
              ctx.beginPath();
              if (closed) ctx.moveTo(...points[Math.abs(Math.round(len * rateFunction(t)) % len)]);else ctx.moveTo(...points[Math.round(len * rateFunction(t))]);
              ctx.bezierCurveTo(cp[0], cp[1], cp[2], cp[3], nextPoint[0], nextPoint[1]);
              if (ctx.doStroke) ctx.stroke();
              ctx.closePath();
              if (!syncWithTime) t += dt;else t = elapsed / dur;
            }, ctx.name, dTime, 50, {}, dur);
          } else {
            loop(name, elapsed => {
              if (t > 1) {
                noLoop(ctx.name, elapsed);
              } else if (t == 0) {
                ctx.beginPath();
                ctx.moveTo(...points[Math.abs(Math.round(len * rateFunction(0)))]);
              }

              let currentPoint = points[Math.round(len * rateFunction(t)) % len];
              ctx.lineTo(currentPoint[0], currentPoint[1]);
              if (ctx.doStroke) ctx.stroke();
              if (!syncWithTime) t += dt;else t = elapsed / dur;
            }, ctx.name, dTime, 50, {}, dur);
          }
        } else {
          animation.draw();
        }
      }

      if (closed && animation.fill) {
        (0, _create.animateFill)(name, ctx.name, animation.fill, animation.filler, animation.fillTime, 10, next);
      }
    } else {
      throw new Error(i + 1 + (i == 0 ? "st" : i == 1 ? "nd" : i == 2 ? "rd" : "th") + " argument provided is not a object.");
    }
  }
}
/**
 * Draws a cartasian plain and moves canvas to center and inverts y-axis.
 * TODO: find a new name for this function
 * @param {object} cfg configurations for the plain.
 */


function cartasianPlain(cfg) {
  centreCanvas();
  invertYAxis();
  (0, _coordinate_systems.numberPlane)(cfg);
}

},{"./animations/create.js":3,"./color/color_reader.js":6,"./constants/colors.js":11,"./main.js":17,"./math/rate_functions.js":22,"./objects/coordinate_systems.js":26,"./objects/geometry.js":28,"./utils.js":33}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyDefault = applyDefault;
exports.approximateIndexInArray = approximateIndexInArray;
exports.arange = arange;
exports.defineProperties = defineProperties;
exports.doFillAndStroke = doFillAndStroke;
exports.getType = getType;

var _main = require("./main.js");

/**
 * Returns the type of object
 *
 * @param {*} stuff
 * @return {string}
 */
function getType(stuff) {
  return Object.prototype.toString.call(stuff).slice(8, -1);
}

Object.clone = Object.clone || function (toClone) {
  let newObj = {};

  for (let i = 0, keys = Object.keys(toClone); i < keys.length; i++) {
    let a = toClone[keys[i]];
    newObj[keys[i]] = a;
  }

  return newObj;
};
/**
 * defines new properties to a given Object
 *
 * @param {object} target source object
 * @param {object} [target=window] target object
 */


function defineProperties(source, target = window, assignToC = true) {
  Object.assign(target, source);
  if (assignToC) Object.assign(_main.C.functions, source);
}

function arange(start, end, step, rev = false) {
  let arr = [];
  if (rev) for (let i = end; i >= start; i -= step) arr.push(i);else for (let i = start; i <= end; i += step) arr.push(i);
  return arr;
}
/**
 * Applies default configurations to a given target object
 * Must be in the form of
 *
 * @param {object} _default default configurations
 * @param {object} [target={}] target object
 * @param {boolean} [deepApply=true] whether to apply defaults to deep nested objects
 * @return {object} applied object
 */


function applyDefault(_default, target = {}, deepApply = true) {
  target = Object.clone(target);

  for (let i = 0, keys = Object.keys(_default); i < keys.length; i++) {
    let prop = keys[i],
        defaultProp = _default[prop],
        targetProp = target[prop],
        defaultType = getType(defaultProp),
        targetType = getType(targetProp);

    if (defaultType == "Object" && deepApply) {
      target[prop] = applyDefault(defaultProp, targetProp, deepApply);
    }

    if (targetType !== defaultType) target[prop] = _default[prop];
  }

  return target;
}
/**
 * fills and strokes inside the current shape if to do so.
 *
 * @param {CanvasRenderingContext2D} ctx
 */


function doFillAndStroke(ctx) {
  if (ctx.doFill) ctx.fill();
  if (ctx.doStroke) ctx.stroke();
}

function approximateIndexInArray(val, array, epsilon = 1e-6) {
  for (let i = 0; i < array.length; i++) {
    let k = array[i];

    if (Math.abs(k - val) <= epsilon) {
      return i;
    }
  }

  return -1;
}

window.applyDefault = applyDefault;

},{"./main.js":17}]},{},[4]);
