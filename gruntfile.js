module.exports = function (grunt) {
	var banner =
		"/*" +
		"C" +
		"-<%= pkg.version%> - " +
		"<%= grunt.template.today('yyyy-mm-dd') %> \n" +
		"* License: <%= pkg.license %> */\n";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		browserify: {
			options: {
				plugin: [[require("esmify"), {}]],
			},
			main: {
				src: "src/app.js",
				dest: "dist/c.js",
			},
			core: {
				src: "src/core.js",
				dest: "dist/c.core.js",
			},
		},
		uglify: {
			options: {
				banner: banner,
				sourceMapRoot: "../",
				sourceMap: "dist/c.min.js.map",
			},
			main: {
				src: "dist/c.js",
				dest: "dist/c.min.js",
			},
			core: {
				src: "dist/c.core.js",
				dest: "dist/c.core.min.js",
			},
		},
	});

	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-browserify");
	grunt.registerTask("default", [
		"browserify:main",
		"uglify:main",
		"browserify:core",
		"uglify:core",
	]);
};
