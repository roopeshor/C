(function(){
    function int (a, b) { return isNaN(a) ? b: a; }
    function bool (a, b) { return a == undefined ? b : a; }
    
    function gW () {
      var cs = window.getComputedStyle(document.body);
      return window.innerWidth - parseInt(cs.marginLeft) * 2;
    }
    
    function ACE (extObj) {
      window.CJS_Extensions = Object.assign(window.CJS_Extensions, extObj);
    }

    assignPropsToWind({
      int: int,
      bool: bool,
      getWidth: gW,
      addCJSExtension: ACE
    });
  })();
