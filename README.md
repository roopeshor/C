# C

JavaScript library for drawing figures & diagrams and also animation. You could save the canvas as image.

## Installation

### Choose specific version

see [releases](https://github.com/Roopesh2/C/releases) for files

### Choose latest version

Use C.latest.min.js or C.latest.js

### Start using

 ```js
C (
  drawFunction,
  containerElement,
  [configs]
);
```

### Argumets

#### 1st: containerElement

The element name in which the canvas (HTML5 Canvas Element) is added.
You'd better not to add any HTML to this container.
But you acn apply styles to this.

#### 2nd: drawFunction

Most Important one. Here in this function you will add all codes to draw something on the canvas.

#### 3rd: configs

Configuration object which contains all about canvas and can be used to manipulate canvas
contains:

* ```width``` width of canvas. Default: width of screen.
* ```height``` height of canvas
* ```dpr``` device pixel ratio. This can be a custom scalar

## Inside drawFunction (Documentation)

Documentation are comming soon.

## Extensions

You can add extension and use it easly.

### Creating an extension

Wrap your all functions in a object and pass it to ```C.addExtension``` function, like this:

```js
 C.addExtension({
   myExtFunction1: function (args) {...},
   myExtFunction2: function (args) {...},
   myExtFunction3: function (args) {...},
   ...
 })
 ```

### Using extensions

To use extensions call it inside your ```drawFunction```.
eg. :

```js
    C (function () {
        myExtFunction1(...);
      },container,
      {...}
    );
  ```
