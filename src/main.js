// main file; defines C function
const defaultConfig = {
  width: 200, // width of canvas multiplied by dpr
  height: 200, // height of canvas  multiplied by dpr
  dpr: ceil(devicePixelRatio || 1), // device pixel ratio for clear drawings
  W: 200, // actual width of canvas
  H: 200, // actual height of canvas
  _doFill: true,
  _doStroke: true,
  fillStyle: WHITE,
  strokeStyle: BLACK,
  fontSize: "20px",
  fontfamily: "sans-serif",
  _ColorMode: "rgba",
};

function assignDefaultConfigs(cfgs) {
  for (
    var i = 0, properties = Object.keys(defaultConfig);
    i < properties.length;
    i++
  ) {
    var property = properties[i];
    if (cfgs[property] == undefined) cfgs[property] = defaultConfig[property];
  }
}

/**
 * Main Function
 * @param {function} fx codes to exeecute
 * @param {HTMLElement} container container for the drawings [default:body element]
 * @param {object} [configs={}] configurations
 */
function C(fx, container = document.body, configs = {}) {
  // assign configs
  assignDefaultConfigs(configs);
  var W = configs.W,
    H = configs.H;

  /* because both canvas.width and canvas.height are multipiled by dpr
     original width and height should be stored as other variables */
  configs.W = typeof W == "number" && W == configs.width ? W : configs.width;
  configs.H = typeof H == "number" && H == configs.height ? H : configs.height;

  // initialize canvas
  var canvas = makeCanvas(configs);

  if (typeof container == "string")
    container = document.querySelector(container);
  var canvasName;
  if (configs.name != undefined) {
    canvasName = configs.name;
    var cvs = document.getElementById(canvasName);
    if (cvs != undefined) {
      // if already exist
      canvas = cvs;
      prepareCanvas();
      fx();
      return;
    }
  } else {
    // finds a name for canvas that already don't exist
    while (document.getElementById("canvas-" + C.nameID) != undefined) {
      C.nameID++;
    }

    canvasName = "canvas-" + C.nameID;
    configs.name = canvasName;
  }
  function prepareCanvas() {
    // add additional information to rendererContext
    getResizedCanvas(canvas, configs);
    canvas.context = Object.assign(canvas.getContext("2d"), configs);
    canvas.context.setTransform(configs.dpr, 0, 0, configs.dpr, 0, 0);
    C.workingCanvas = canvas.context;
  }
  // set canvas's id and class to its name
  canvas.id = canvasName;
  canvas.classList.add(canvasName);
  // add canvas to container
  container.appendChild(canvas);
  prepareCanvas();
  C.canvasList[canvasName] = canvas.context;
  fx();
}

C.canvasList = {};
C.nameID = 0;
C.workingCanvas = undefined; // index of current working canvas in `canvasList`

// more helpers

/**
 * add extension to window and C
 *
 * @param {Object} extObj
 */
C.addExtension = function (extObj, editable) {
  defineProperties(extObj, window, !editable);
  defineProperties(extObj, C.extensions, !editable);
};
