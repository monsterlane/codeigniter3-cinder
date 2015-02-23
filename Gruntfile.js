
module.exports = function( grunt ) {
	'use strict';

	grunt.initConfig({
		autoprefixer: {
			options: {
				browsers: [ 'last 2 versions', '> 5%' ],
				cascade: false
			},
			all: {
				cwd: 'public/files/cache/',
				src: '**/css/*.css'
			}
		},
		concurrent: {
			lint: [ 'jshint', 'csslint' ],
			minify: [ 'cssmin', 'imagemin' ]
		},
		clean: {
			deploy: [
				'public/files/cache/build.txt',
				'public/files/cache/system/css/reset.css',
				'public/files/cache/system/js/*.js',
				'!public/files/cache/system/js/app.js',
				'!public/files/cache/system/js/module.js',
				'!public/files/cache/system/js/upload.js',
				'!public/files/cache/system/js/require.config.js',
				'!public/files/cache/system/js/require.js.min.js',
				'!public/files/cache/system/js/require.css.min.js',
				'!public/files/cache/system/js/require.domready.min.js'
			]
		},
		copy: {
			images: {
				files: grunt.file.expandMapping( [ 'private/application/controllers/**/img/*' ], 'public/files/cache/', {
					rename: function( aBase, aPath ) {
						return aPath.replace( 'private/application/controllers/', aBase );
					}
				})
			}
		},
		csslint: {
			modules: {
				options: {
					'adjoining-classes': false,
					'import': false,
					'universal-selector': false,
					'unqualified-attributes': false
				},
				src: [
					'private/application/controllers/**/css/*.css',
					'!private/application/controllers/system/css/reset.css'
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
							name: 'main/js/module',
							exclude: [ 'system/js/app', 'system/js/module' ]
						},
						{
							name: 'search/js/module',
							exclude: [ 'system/js/app', 'system/js/module' ]
						},
						{
							name: 'dragdrop/js/module',
							exclude: [ 'system/js/app', 'system/js/module', 'system/js/upload' ]
						}
					]
				}
			}
		},
		sprite: {
			sheet: {
				src: 'private/application/controllers/system/img/sprite/*',
				dest: 'public/files/cache/system/img/sprite.png',
				destCss: 'public/files/cache/system/css/sprite.css'
			}
		}
	});

	grunt.loadNpmTasks( 'grunt-autoprefixer' );
	grunt.loadNpmTasks( 'grunt-concurrent' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-csslint' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
	grunt.loadNpmTasks( 'grunt-spritesmith' );

	grunt.registerTask( 'default', [ 'concurrent:lint' ] );
	grunt.registerTask( 'deploy', [ 'concurrent:lint', 'requirejs', 'clean', 'concurrent:minify' ] );

	grunt.registerTask( 'build', [ 'concurrent:lint', 'copy' ] );
	grunt.registerTask( 'buildall', [ 'concurrent:lint', 'requirejs', 'clean', 'cssmin' ] );
	grunt.registerTask( 'img', [ 'imagemin' ] );
};
