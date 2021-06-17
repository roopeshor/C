const helpers = {
  getContentWidth: function () {
    /** 
     * return inner width of body tag
     * @returns {Number} 
     */
    var cs = window.getComputedStyle(document.body);
    return window.innerWidth - parseInt(cs.marginLeft) - parseInt(cs.marginRight);
  },
  
  /**
   * add extension to window and CData
   *
   * @param {Object} extObj
   */
  addExtension: function (extObj) {
    defineProperties(extObj)
    defineProperties(extObj, CData.extensions)
  },
  makeCanvas: function (cfgs) {
    /** 
     * create canvas with given parameters
     */
    var width = cfgs.width;
    var height = cfgs.height;
    var dpr = cfgs.dpr;
    var cvs = document.createElement("canvas");
    cvs.style.width = width + "px";
    cvs.style.height = height + "px";
    cvs.width = dpr * width;
    cvs.height = dpr * height;
    return cvs;
  }
}

defineProperties(helpers);