
module.exports = function( grunt ) {
	'use strict';

	grunt.initConfig({
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				undef: true,
				unused: 'vars',
				loopfunc: false,
				plusplus: false,
				strict: true,
				browser: true,
				globals: {
					alert: true,
					console: true,
					module: true,
					require: true,
					requirejs: true,
					define: true,
					jQuery: true
				},
				ignores: [ 'private/application/controllers/**/js/*.min.js' ]
			},
			all: [ 'Gruntfile.js', 'private/application/controllers/**/js/*.js' ]
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: 'private/application/controllers/',
					dir: 'public/files/cache/',
					mainConfigFile: 'private/application/controllers/system/js/require.config.js',
					optimize: 'uglify2',
					skipDirOptimize: true,
					generateSourceMaps: true,
					preserveLicenseComments: false,
					separateCSS: true,
					fileExclusionRegExp: /^(\.|error|views|controller\.php)/,
					paths: {
						'requirejs': 'private/application/controllers/system/js/require.js.min'
					},
					modules: [
						{
							name: 'system/js/app',
							include: [
								'system/js/require.js.min',
								'system/js/require.css.min',
								'system/js/require.domready.min',
								'system/js/jquery.min',
								'system/js/jclass.min',
								'system/js/dot.min',
								'system/js/cache',
								'system/js/conduit',
								'system/js/model',
								'system/js/view',
								'system/js/module',
								'system/js/app'
							]
						},
						{
							name: 'search/js/module',
							exclude: [ 'system/js/app' ]
						}
					]
				}
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-requirejs' );

	grunt.registerTask( 'default', [ 'jshint' ] );
	grunt.registerTask( 'release', [ 'jshint', 'requirejs' ] );
};
