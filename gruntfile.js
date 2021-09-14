module.exports = function (grunt) {
	var name = "<%= pkg.name %>",
		banner ="/*"+name + "-<%= pkg.version%> - " +
			"<%= grunt.template.today('yyyy-mm-dd') %> \n" +
			"* License: <%= pkg.license %> */\n",
		devRelease = "dist/" + name + ".js",
		minRelease = "dist/" + name + ".min.js",
		sourceMapMin = "dist/" + name + ".min.js.map",
		sourceMapUrl = name + ".min.js.map";

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
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks('grunt-jsdoc');

	grunt.registerTask("default", ["browserify", "uglify"]);

	grunt.registerTask("minify", ["browserify", "uglify"]);
	grunt.registerTask("doc", ["jsdoc"]);
};
