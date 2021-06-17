// main file; defines C function
const defaultConfig = {
  width: 200, // width of canvas multiplied by dpr
  height: 200, // height of canvas  multiplied by dpr
  dpr: window.devicePixelRatio || 1, // device pixel ratio for clear drawings
  W: 200, // actual width of canvas
  H: 200, // actual height of canvas
  _doFill: true, 
  _doStroke: true,
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

  // finds a name for canvas that already don't exist
  while (document.getElementById("canvas-" + C.data.recentId) != undefined) {
    C.data.recentId++;
  }

  var canvasName = "canvas-" + C.data.recentId;
  // set canvas's id and class to `canvasName 
  canvas.id = canvasName;
  canvas.classList.add(canvasName);

  // add additional information to rendererContext
  canvas.context = Object.assign(canvas.getContext("2d"), configs);

  // add canvas to 
  C.data.canvasList.push(canvas);
  container.appendChild(canvas);

  fx();
}

C.data = {
  canvasList: [],
  recentId: 0,
  workingCanvas: 0 // index of current working canvas in `canvasList`
};
