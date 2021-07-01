var helpers = {};

/**
 * return inner width of container tag
 * @param {HTMLElement} [container=document.body]
 * @returns {Number}
 */
 helpers.getContainerWidth = function (container=document.body) {
  var cs = window.getComputedStyle(container);
  return (
    parseInt(cs.width) -
    parseInt(cs.marginLeft) -
    parseInt(cs.marginRight) -
    parseInt(cs.paddingRight) -
    parseInt(cs.paddingLeft)
  );
};

/**
 * set width and height attribute of canvas element to the given values in `configs`
 * and scales CSS width and height to DPR
 *
 * values needed in `configs`:
 *
 *   width: <Number> width in pixels
 *
 *   height: <Number> height in pixels
 *
 *   dpr: <Number> dpr
 * @param {HTMLCanvasElement} cvs
 * @param {Object} configs
 */
helpers.getResizedCanvas = function (cvs, configs) {
  var width = configs.width;
  var height = configs.height;
  var dpr = configs.dpr;
  cvs.style.width = width + "px";
  cvs.style.height = height + "px";
  cvs.width = dpr * width;
  cvs.height = dpr * height;
};

/**
 * returns a canvas element with given params
 *
 * @param {Object} configs
 * @returns {HTMLCanvasElement}
 */
helpers.makeCanvas = function (configs) {
  var cvs = document.createElement("canvas");
  this.getResizedCanvas(cvs, configs);
  return cvs;
};

defineProperties(helpers);
