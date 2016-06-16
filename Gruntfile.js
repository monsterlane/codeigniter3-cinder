
module.exports = function( grunt ) {
	'use strict';

	grunt.initConfig({
		concurrent: {
			lint: [ 'jshint', 'csslint' ],
			minify: [ 'cssmin', 'newer:imagemin' ]
		},
		clean: {
			deploy: [
				'public/files/cache/build.txt',
				'public/files/cache/system/css/bootstrap.min..css',
				'public/files/cache/system/css/bootstrap.theme.min.css',
				'public/files/cache/system/css/sprite.css',
				'public/files/cache/system/css/loaded.css',
				'public/files/cache/system/css/loading.css',
				'public/files/cache/system/js/*.js',
				'!public/files/cache/system/js/app.js',
				'!public/files/cache/system/js/module.js',
				'!public/files/cache/system/js/timer.js',
				'!public/files/cache/system/js/upload.js',
				'!public/files/cache/system/js/require.config.js',
				'!public/files/cache/system/js/require.js.min.js',
				'!public/files/cache/system/js/require.css.min.js',
				'!public/files/cache/system/js/require.domready.min.js',
				'public/files/cache/plugin/js/jquery.hotkeys.min.js'
			]
		},
		copy: {
			images: {
				files: grunt.file.expandMapping( [ 'private/application/controllers/**/img/*' ], 'public/files/cache/', {
					rename: function( aBase, aPath ) {
						return aPath.replace( 'private/application/controllers/', aBase );
					}
				})
			},
			fonts: {
				files: grunt.file.expandMapping( [ 'private/application/controllers/**/font/*' ], 'public/files/cache/', {
					rename: function( aBase, aPath ) {
						return aPath.replace( 'private/application/controllers/', aBase );
					}
				})
			}
		},
		csslint: {
			modules: {
				options: {
					'import': false,
					'universal-selector': false,
					'ids': false,
					'adjoining-classes': false,
					'unqualified-attributes': false,
					'overqualified-elements': false,
					'duplicate-background-images': false,
					'zero-units': false,
					'box-sizing': false,
					'box-model': false,
					'important': false
				},
				src: [
					'private/application/controllers/**/css/*.css',
					'!private/application/controllers/system/css/*.min.css'
				]
			}
		},
		cssmin: {
			all: {
				files: grunt.file.expandMapping( [ 'public/files/cache/**/css/*.css' ], '', {
					rename: function( aBase, aPath ) {
						return aPath;
					}
				})
			}
		},
		imagemin: {
			all: {
				files: grunt.file.expandMapping( [ 'private/application/controllers/**/img/*.*' ], 'public/files/cache/', {
					rename: function( aBase, aPath ) {
						return aPath.replace( 'private/application/controllers/', aBase );
					}
				})
			}
		},
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
				ignores: [
					'private/application/controllers/**/js/*.min.js',
					'private/application/controllers/system/js/require.webfont.js'
				]
			},
			all: [
				'Gruntfile.js',
				'private/application/controllers/**/js/*.js'
			]
		},
		postcss: {
			options: {
				map: {
					inline: false
				},
				processors: [
					require( 'autoprefixer' )({
						browsers: [
							'last 2 versions',
							'> 5%'
						]
					})
				]
			},
			cache: {
				files: grunt.file.expandMapping( [ 'public/files/cache/**/css/*.css', '!public/files/cache/**/css/*.min.css' ], '', {
					rename: function( aBase, aPath ) {
						return aPath;
					}
				})
			}
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
					fileExclusionRegExp: /^(\.|views)|(\.php)$/,
					paths: {
						'requirejs': 'system/js/require.js.min'
					},
					modules: [
						{
							name: 'system/js/app'
						},
						{
							name: 'system/js/module',
							exclude: [ 'system/js/app' ]
						},
						{
							name: 'system/js/upload',
							exclude: [ 'system/js/app' ]
						},
						{
							name: 'system/js/timer',
							exclude: [ 'system/js/app' ]
						},
						{
							name: 'debug/js/module',
							exclude: [ 'system/js/app', 'system/js/module' ]
						},
						{
							name: 'dragdrop/js/module',
							exclude: [ 'system/js/app', 'system/js/module', 'system/js/upload' ]
						},
						{
							name: 'plugin/js/module',
							exclude: [ 'system/js/app', 'system/js/module' ]
						},
						{
							name: 'search/js/module',
							exclude: [ 'system/js/app', 'system/js/module' ]
						}
					]
				}
			}
		},
		sprite: {
			sheet: {
				src: 'private/application/controllers/system/img/sprite/*.png',
				dest: 'private/application/controllers/system/img/sprite.png',
				destCss: 'private/application/controllers/system/css/sprite.css',
				padding: 2,
				cssOpts: {
					cssSelector: function( item ) {
						return '.' + item.image.substring( item.image.lastIndexOf( '/' ) + 1, item.image.lastIndexOf( '.' ) ) + '-' + item.name;
					}
				}
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-concurrent' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-csslint' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
	grunt.loadNpmTasks( 'grunt-newer' );
	grunt.loadNpmTasks( 'grunt-postcss' );
	grunt.loadNpmTasks( 'grunt-spritesmith' );

	grunt.registerTask( 'default', [ 'concurrent:lint' ] );
	grunt.registerTask( 'dev', [ 'concurrent:lint', 'sprite', 'newer:copy' ] );
	grunt.registerTask( 'deploy', [ 'concurrent:lint', 'sprite', 'requirejs', 'clean:deploy', 'postcss', 'concurrent:minify' ] );
};
