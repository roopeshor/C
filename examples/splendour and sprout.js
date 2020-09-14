var c = document.querySelector(".container");
function drawAll () {

	var radius = Math.round(this.H/2.02);
	var ds = radius / 50;
	this.stroke = "#ff0";
	this.fill = NONE;
	this.strokeWidth = 0.4;
	
	this.background("#000")
	this.translate(this.W/2, this.H/2);
	this.invertYAxis();
	this.circle (0, 0, radius);
	var dots = [];
	var t = 0;
	var ratio = ds / radius;
	
	// sprout
	for (var i = 0;i <= radius / ds; i++) dots.push([0, i * ds]);
	for (var i = 0; i <= Math.PI / ratio / 2; i++) {
		var x = -Math.sin(t) * radius,
		y = Math.cos(t)* radius;
		t += ratio;
		dots.push([x, y]);
	}
	// splendour
 	for (var i = -radius / ds;i <= -1; i++) dots.push([i * ds, 0]);
	
	var colors = [
		"#9CDCEB",
		"#76DDC0",
		"#5CD0B3",
		"#55C1A7",
		"#49A88F",
		"#58C4DD",
		"#29ABCA",
		"#236B8E",
		"#1C758A",
		"#A6CF8C",
		"#83C167",
		"#77B05D",
		"#699C52",
		"#FFEA94",
		"#F4D345",
		"#E8C11C",
		"#FFFF00",
		"#F9B775",
		"#F0AC5F",
		"#E1A158",
		"#C78D46",
		"#CD853F",
		"#8B4513",
		"#FF8080",
		"#FC6255",
		"#E65A4C",
		"#CF5044",
		"#FF862F",
		"#C55F73",
		"#A24D61",
		"#94424F",
		"#B189C6",
		"#9A72AC",
		"#715582",
		"#644172",
		"#FFFFFF",
		"#888888",
		"#736357",
		"#D147BD",
		"#DC75CD",
		"#00FF00",
	];
	var i = 0;
	var ii = radius / ds;
	var ln = this.line;
	var s = setInterval(function () {
		this.stroke = colors[i % colors.length];
		ln (
			dots[(i) % dots.length][0],
			dots[(i) % dots.length][1],
			dots[ii % dots.length][0],
			dots[ii % dots.length][1],
		);
		ln (
			-dots[(i) % dots.length][0],
			dots[(i) % dots.length][1],
			-dots[ii % dots.length][0],
			dots[ii % dots.length][1],
		);
		ln (
			dots[(i) % dots.length][0],
			-dots[(i) % dots.length][1],
			dots[ii % dots.length][0],
			-dots[ii % dots.length][1],
		);
		ln (
			-dots[(i) % dots.length][0],
			-dots[(i) % dots.length][1],
			-dots[ii % dots.length][0],
			-dots[ii % dots.length][1],
		);
		if (i >= dots.length) clearInterval(s);
		i++;
		ii++;
	},50);
}
C (c, drawAll, {
	width: window.innerWidth,
	aspectRatio: [16, 11]
})
