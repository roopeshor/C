# C.js 
 JavaScript library for drawing figures and diagrams in blog or articles
## Get started
 ### Boilerplate
 Cjs is simple.
 ```javascript
C (
  containerElement,
  drawFunction,
  [configs]
);
```
 ### Argumets
 Well it's not noting more than 3.
 #### 1<sup>st</sup>: containerElement
   The element name in which the canvas (HTML5 Canvas Element) is added.
   You'd better not to add any HTML to this container.
   But you acn apply styles to this.
 #### 2<sup>nd</sup>: drawFunction
   Most Important one. Here in this function you will add all codes to draw something on the canvas.
 #### 3<sup>rd</sup>: configs
   Configuration object which contains all about canvas and can be used to manipulate canvas
   contains:
* ```width``` width of canvas
* ```height``` height of canvas
* ```aspectRatio``` array representing ratio between width and height. Only works when height is not defined. Default value : ```[16:9]```.
