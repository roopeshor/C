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
};

/**
 *
 * @param {function} fx codes to exeecute
 * @param {HTMLElement} container container for the drawings [default:body element]
 * @param {object} [configs={}] configurations
 */
function C(fx, container = document.body, configs = {}) {
  // assign configs
  configs = Object.assign(defaultConfig, configs);
  var W = configs.W,
    H = configs.H;

  /* because both canvas.width and canvas.height are multipiled by dpr
     original width and height should be stored as other variables */
  configs.W = typeof W == "number" && W == configs.width ? W : configs.width;
  configs.H = typeof H == "number" && H == configs.height ? H : configs.height;

  // initialize canvas
  var canvas = makeCanvas(configs);

  var canvasName;
  if (configs.name != undefined) {
    canvasName = configs.name;
    var cvs = document.getElementById(canvasName);
    if (cvs != undefined) {
      // if already exist 
      canvas = cvs;
      prepareCanvas();
      fx()
      return;
    }
  } else {
  // finds a name for canvas that already don't exist
    while (document.getElementById("canvas-" + C.nameID) != undefined) {
      C.nameID++;
    }

    canvasName = "canvas-" + C.nameID;
  }
  function prepareCanvas() {

    // add additional information to rendererContext
    getResizedCanvas(canvas, configs);
    canvas.context = Object.assign(canvas.getContext("2d"), configs);
    canvas.context.setTransform(configs.dpr,0,0, configs.dpr,0,0);
    C.workingCanvas = canvas.context
  }
  // set canvas's id and class to its name
  canvas.id = canvasName;
  canvas.classList.add(canvasName);
  // add canvas to container
  container.appendChild(canvas);
  prepareCanvas()
  C.canvasList[canvasName] = canvas.context;
  fx()
}

C.canvasList = {};
C.nameID = 0;
C.workingCanvas = undefined; // index of current working canvas in `canvasList`