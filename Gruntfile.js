
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
					fileExclusionRegExp: /^(\.|error|views|controller\.php)/,
					paths: {
						'requirejs': 'system/js/require.js.min'
					},
					modules: [
						{
							name: 'system/js/app'
						},
						{
							name: 'search/js/module',
							exclude: [ 'system/js/module' ]
						}
					]
				}
			}
		},
		cssmin: {
			target: {
				files: [
					{
						cwd: 'public/files/cache/system/css',
						dest: 'public/files/cache/system/css',
						src: [ '*.css' ],
						expand: true
					},
					{
						cwd: 'public/files/cache/maintenance/css',
						dest: 'public/files/cache/maintenance/css',
						src: [ '*.css' ],
						expand: true
					},
					{
						cwd: 'public/files/cache/main/css',
						dest: 'public/files/cache/main/css',
						src: [ '*.css' ],
						expand: true
					},
					{
						cwd: 'public/files/cache/search/css',
						dest: 'public/files/cache/search/css',
						src: [ '*.css' ],
						expand: true
					}
				]
			}
		},
		clean: {
			system: [
				'public/files/cache/system/css/reset.css',
				'public/files/cache/system/js/*.js',
				'!public/files/cache/system/js/app.js',
				'!public/files/cache/system/js/require.config.js',
				'!public/files/cache/system/js/require.js.min.js',
				'!public/files/cache/system/js/require.css.min.js',
				'!public/files/cache/system/js/require.domready.min.js'
			]
		}
	});

	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );

	grunt.registerTask( 'default', [ 'jshint' ] );
	grunt.registerTask( 'deploy', [ 'jshint', 'requirejs', 'clean', 'cssmin' ] );
};
