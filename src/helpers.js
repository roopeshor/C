/**
 * return inner width of body tag
 * @returns {Number}
 */
function _getContentWidth() {
  var cs = window.getComputedStyle(document.body);
  return window.innerWidth - parseInt(cs.marginLeft) - parseInt(cs.marginRight);
}

/**
 * add extension to window and CData
 *
 * @param {Object} extObj
 */
function _addExtension(extObj, editable) {
  defineProperties(extObj, window, !editable);
  defineProperties(extObj, CData.extensions, !editable);
}

function _getResizedCanvas(cvs, cfgs) {
  var width = cfgs.width;
  var height = cfgs.height;
  var dpr = cfgs.dpr;
  cvs.style.width = width + "px";
  cvs.style.height = height + "px";
  cvs.width = dpr * width;
  cvs.height = dpr * height;
}
function _makeCanvas(cfgs) {
  /**
   * create canvas with given parameters
   */
  var cvs = document.createElement("canvas");
  _getResizedCanvas(cvs, cfgs);
  return cvs;
}

defineProperties({
  getContentWidth: _getContentWidth,
  addExtension: _addExtension,
  getResizedCanvas: _getResizedCanvas,
  makeCanvas: _makeCanvas,
});
