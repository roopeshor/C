module.exports = function (grunt) {
	var name = "<%= pkg.name %>",
		nameWithVersion = name + "-<%= pkg.version%>",
		banner ="/*"+nameWithVersion+" - " +
			"<%= grunt.template.today('yyyy-mm-dd') %> \n" +
			"* License: <%= pkg.license %> */\n",
		devRelease = "dist/" + nameWithVersion + ".js",
		minRelease = "dist/" + nameWithVersion + ".min.js",
		sourceMapMin = "dist/" + nameWithVersion + ".min.js.map",
		sourceMapUrl = nameWithVersion + ".min.js.map",
		latestDevRelease = "dist/" + name + ".js",
		latestMinRelease = "dist/" + name + ".min.js",
		latestSourceMapMin = "dist/" + name + ".min.js.map";

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		browserify: {
			options: {
				plugin: [[require("esmify"), {}]],
			},
			target: {
				src: ["src/app.js"],
				dest: devRelease,
			},
		},
		uglify: {
			options: {
				banner: banner,
				sourceMapRoot: "../",
				sourceMap: sourceMapMin,
				sourceMappingURL: sourceMapUrl,
			},
			target: {
				src: [devRelease],
				dest: minRelease,
			},
		},
		copy: {
			development: {
				// copy non-minified release file
				src: devRelease,
				dest: latestDevRelease,
			},
			minified: {
				// copy minified release file
				src: minRelease,
				dest: latestMinRelease,
			},
			sourceMap: {
				// source map of minified release file
				src: sourceMapMin,
				dest: latestSourceMapMin,
			}
		},
		jsdoc : {
			dist : {
				src: ['src/**.js'],
				options: {
					destination: 'doc',
				},
			},
    },
	});

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask("default", ["browserify", "uglify", "copy"]);

	grunt.registerTask("minify", ["browserify", "uglify"]);
	grunt.registerTask("doc", ["jsdoc"]);
};
