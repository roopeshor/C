# C

> A p5.js like library that brings some of the powers of Manim in to the web.

This library can be used for drawing figures & diagrams and also for animating them. You could later save the canvas as image.

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

Configuration object which contains all about canvas and can be used to manipulate canvas.  
Possible configurations [with default values]

* `width[=200]`: Width of canvas in pixels.
* `height[=200]`: Width of canvas in pixels.
* `dpr[=window.devicePixelRatio]`: device pixel ratio of canvas.
* `doFill[=true]`: Whether to fill.
* `doStroke[=true]`: Whether to stroke.
* `pathStarted[=false]`: Whether a shape has begun to draw.
* `yAxisInverted[=false]`: Whether y axis of canvas was inverted.

<br>

* `textAlign[="start"]` : textv align property of canvas.
* `textBaseline[="alphabetic"]` : textv baseline property of canvas.

<br>

* `fillStyle[="#ffffff"]`: color to fill.
* `strokeStyle[="#000000"]`: color to stroke.
* `colorMode[="rgba"]`: mode of color.
* `lineWidth[=1]`: width of line.

<br>

* `fontSize[="20px"]`: font size.
* `fontFamily[="serif"]`: font family.
* `fontStyle[="normal"]`: font style.
* `fontVariant[="normal"]`: font variant.
* `fontWeight[="normal"]`: font weight.
* `fontStretch[="normal"]`: font stretch.
* `lineHeight[="1.2"]`: line height.
* `font[="20px serif"]`: explict font of canvas.

## Inside drawFunction (Documentation)

External documentation not yet generated

## Bundling

All source files are compiled to [dist/c.js](./dist/c.js) with minified version [dist/c.min.js](./dist/c.min.js). You can make a custom bundle that only include your imported functions. You can use google-closure-compiler wtih template config file [gcc-custom.conf](./gcc-custom.conf).

Run 
```bash
npx google-closure-compiler --flagfile <your-custom-gcc-conf>.conf
```
or run (it will use [./gcc-custom.conf](./gcc-custom.conf)) 
```bash
npm run gcc-custom
```



## Extensions

### Creating an extension

Wrap your all functions in a object and pass it to `C.addExtension` function

```js
const Ext = {
	fx1: function () {},
	fx2: function () {},
	fx3: function () {},
	//...
}
C.addExtension(Ext)
 ```

Once extension is added it is accessible via
`window`, `C.extensions` or by calling name of function/constant directly

### Using extensions

Extension functions are globally scoped. So can be accessed from anywhere.

```js
C (
	function () {
		extFunction1(args);
	},
	container,
	{ /* configs */ }
);
```
