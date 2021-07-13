module.exports = function (grunt) {
	var latest = "<%= pkg.name %>",
		name = "<%= pkg.name %>-v<%= pkg.version%>",
		bannerContent =
			"/*! <%= pkg.name %> v<%= pkg.version %> - " +
			"<%= grunt.template.today('yyyy-mm-dd') %> \n" +
			" *  License: <%= pkg.license %> */\n",
		devRelease = "dist/" + name + ".js",
		minRelease = "dist/" + name + ".min.js",
		sourceMapMin = "dist/" + name + ".min.js.map",
		sourceMapUrl = name + ".min.js.map",
		newDevRelease = "dist/" + latest + ".js",
		newMinRelease = "dist/" + latest + ".min.js",
		newSourceMapMin = "dist/" + latest + ".min.js.map";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		browserify: {
			options: {
				plugin: [[require("esmify"), {}]],
			},
			target: {
				src: ["src/index.js"],
				dest: devRelease,
			},
		},
		uglify: {
			options: {
				banner: bannerContent,
				sourceMapRoot: "../",
				sourceMap: sourceMapMin,
				sourceMappingURL: sourceMapUrl,
			},
			target: {
				src: [devRelease],
				dest: minRelease,
			},
		},
		jshint: {
			options: {
				trailing: true,
				eqeqeq: false,
				esversion: 6,
			},
			target: {
				src: ["src/**/*.js"],
			},
		},
	});

	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-browserify");

	grunt.registerTask("default", ["jshint", "browserify", "uglify"]);
};
