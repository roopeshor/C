# C

> A p5.js like library that brings some of the powers of Manim in to the web.

This library can be used for drawing figures & diagrams and also animation. You could later save the canvas as image.

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

* `width`: Width of canvas in pixels. (default=`200`)
* `height`: Width of canvas in pixels. (default=`200`)
* `dpr`: device pixel ratio of canvas (default=`window.devicePixelRatio`).
* `doFill`: Whether to fill (default=`true`)
* `doStroke`: Whether to stroke (default=`true`)
* `pathStarted`: Whether a shape has begun to draw (default=`false`)
* `yAxisInverted`: Whether y axis of canvas was inverted (default=`false`)

* `textAlign` : textv align property of canvas (default=`"start"`)
* `textBaseline` : textv baseline property of canvas (default=`"alphabetic"`)

* `fillStyle`: color to fill (default=`"#ffffff"`)
* `strokeStyle`: color to stroke (default=`"#000000"`)
* `colorMode`: mode of color (default=`"rgba"`)
* `lineWidth`: width of line (default=`1`)

* `fontSize`: font size (default=`"20px"`)
* `fontFamily`: font family (default=`"serif"`)
* `fontStyle`: font style (default=`"normal"`)
* `fontVariant`: font variant (default=`"normal"`)
* `fontWeight`: font weight (default=`"normal"`)
* `fontStretch`: font stretch (default=`"normal"`)
* `lineHeight`: line height (default=`"1.2"`)
* `font`: explict font of canvas (default=`"20px serif"`)

## Inside drawFunction (Documentation)

Documentation are comming soon.

## Bundling

Because the entire `c.js` file is relatively large, it can delay the loading of site. You can make a bundled file that only include your drawing functions and c functions that are used to draw things. Use google-closure-compiler. Use [gcc-custom.conf](./gcc-custom.conf) as a template compile the files. Edit it and save it. Run `npx google-closure-compiler --flagfile <your-custom-gcc-conf>.conf` or `npm run gcc-custom` and include the output as delayed script.

## Extensions

### Creating an extension

Wrap your all functions in a object and pass it to `C.addExtension` function, like this:

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
`window`, `C.extensions` or by calling name of function/constant directly
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
