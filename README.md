# C

JavaScript library for drawing figures & diagrams and also animation. You could save the canvas as image.

## Installation

### Choose specific version

see [releases](https://github.com/Roopesh2/C/releases) for files

### Choose latest version

Use [production](dist/c.min.js) or [developer](dist/c.js) version

### Google closure compiled

[c.gcc.js](dist/c.gcc.js) is a recompiled verion of library using [google-closure-compiler](https://www.npmjs.com/package/google-closure-compiler). This is even smaller file and it's structure is entirely different from other builds. But still provides the same functionality and performace


## Using

 ```js
C (
	drawFunction,
	containerElement,
	[configs] // optional
);
```

## Argumets
### drawFunction

Most Important one. Here in this function you will add all codes to draw something on the canvas.

### containerElement

The element name in which the canvas (HTML5 Canvas Element) is added.
You'd better not to add any HTML to this container.
But you acn apply styles to this.

### configs (optionl)

Configuration object which contains all about canvas and can be used to manipulate canvas
contains:

* ```width``` width of canvas. Default: width of screen (default= 200).
* ```height``` height of canvas (default= 200).
* ```dpr``` device pixel ratio. This can be a custom scalar (default= ⌈dpr of device⌉).
* ```doFill``` set whether to fill inside the shape (default= true).
* ```doStroke``` set whether to stroke shape (default= true).
* ```fillStyle```  set fill style. This can be a gradient or any valid css color (default= WHITE).
* ```strokeStyle``` set stroke style. This can be a gradient or any valid css color (default= BLACK).
* ```fontSize``` font size of text going to draw (default= "20px").
* ```fontfamily``` font family of text going to draw (default= "sans-serif").
* ```colorMode``` color system being used (default= "rgba").

## Inside drawFunction (Documentation)

Documentation are comming soon.

## Extensions

### Creating an extension

Wrap your all functions in a object and pass it to ```C.addExtension``` function, like this:

```js
 C.addExtension({
	 extFunction1: function (args) {...},
	 extFunction2: function (args) {...},
	 extFunction3: function (args) {...},
	 //...
 })
 ```
 Or like this: 
```js
const ext = {
	fx1: function () {},
	fx2: function () {},
	fx3: function () {},
	//...
}
C.addExtension(ext)
 ```
Once extension is registered it is accessible via
```window```, ```C.extensions``` or by calling name of function/constant
### Using extensions

Call function/variable direcly from anywhere in the declared scope.
eg. :
```js
C (
	function () {
		extFunction1(args);
	},
	container,
	{ /* configs */ }
);
```
