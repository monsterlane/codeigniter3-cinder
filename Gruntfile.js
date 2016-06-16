
module.exports = function( grunt ) {
	'use strict';

	grunt.initConfig({
		concurrent: {
			lint: [ 'jshint', 'csslint' ],
			minify: [ 'cssmin', 'newer:imagemin' ]
		},
		clean: {
			build: [
				'public/files/cache/build.txt',
				'public/files/cache/system/css/bootstrap.min..css',
				'public/files/cache/system/css/bootstrap.theme.min.css',
				'public/files/cache/system/css/loaded.css',
				'public/files/cache/system/css/loading.css',
				'public/files/cache/system/css/sprite.css',
				'public/files/cache/system/css/icons.css',
				'public/files/cache/system/js/*.js',
				'!public/files/cache/system/js/app.js',
				'!public/files/cache/system/js/module.js',
				'!public/files/cache/system/js/timer.js',
				'!public/files/cache/system/js/upload.js',
				'!public/files/cache/system/js/require.config.js',
				'!public/files/cache/system/js/require.js.min.js',
				'!public/files/cache/system/js/require.css.min.js',
				'!public/files/cache/system/js/require.domready.min.js',
				'public/files/cache/plugin/js/jquery.hotkeys.min.js',
				'public/files/cache/system/font/*/',
				'public/files/cache/system/img/*/'
			],
			dist: [
				'dist/*.zip',
				'dist/*.tar.gz'
			],
			fonts: [
				'private/application/controllers/system/font/system*.*',
				'public/files/cache/system/font/system*.*'
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
				files: grunt.file.expandMapping( [ 'public/files/cache/**/css/*.css' ] )
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
				files: grunt.file.expandMapping( [ 'public/files/cache/**/css/*.css', '!public/files/cache/**/css/*.min.css' ] )
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
		},
		webfont: {
			icons: {
				src: 'private/application/controllers/system/font/svg/*.svg',
				dest: 'private/application/controllers/system/font',
				destCss: 'private/application/controllers/system/css',
				options: {
					fontFilename: 'system-{hash}',
					relativeFontPath: '/files/cache/system/font',
					engine: 'node',
					types: 'eot,woff,ttf',
					hashes: true,
					templateOptions: {
						baseClass: 'svg',
						classPrefix: 'svg-',
						mixinPrefix: 'svg-',
						htmlDemo: false
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
	grunt.loadNpmTasks( 'grunt-webfont' );

	grunt.registerTask( 'default', [ 'concurrent:lint' ] );
	grunt.registerTask( 'assets', [ 'sprite', 'newer:copy' ] );
	grunt.registerTask( 'deploy', [ 'clean:dist', 'concurrent:lint', 'sprite', 'clean:fonts', 'webfont', 'requirejs', 'clean:build', 'postcss', 'concurrent:minify' ] );
};
