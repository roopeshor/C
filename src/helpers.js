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

  getResizedCanvas : function (cvs, cfgs) {
    var width = cfgs.width;
    var height = cfgs.height;
    var dpr = cfgs.dpr;
    cvs.style.width = width + "px";
    cvs.style.height = height + "px";
    cvs.width = dpr * width;
    cvs.height = dpr * height;
  },
  makeCanvas: function (cfgs) {
    /** 
     * create canvas with given parameters
     */
    var cvs = document.createElement("canvas");
    this.getResizedCanvas(cvs, cfgs);
    return cvs;
  }
}

defineProperties(helpers);