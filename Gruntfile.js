
module.exports = function( grunt ) {
	'use strict';

	var browsers = [ 'last 2 versions', '> 5%' ],
		version = grunt.file.read( 'private/application/config/app.php' ),
		controllers = grunt.file.expand( 'private/application/controllers/**/js' ),
		new_version, cur_version,
		modules = [ ], module,
		i, len1, j, len2,
		t, m, a;

	new_version = version.match( /\['version'] = '([0-9.]*)'/ );
	new_version = new_version[ 1 ];
	cur_version = new_version;

	new_version = new_version.split( '.' );
	new_version[ 2 ] = parseInt( new_version[ 2 ], 10 ) + 1;
	new_version = new_version.join( '.' );

	modules.push({
		name: 'system/js/app'
	});

	for ( i = 0, len1 = controllers.length; i < len1; i++ ) {
		if ( controllers[ i ].indexOf( 'system/js' ) !== -1 ) {
			modules.push({
				name: 'system/js/module',
				exclude: [ 'system/js/app' ]
			});

			modules.push( {
				name: 'system/js/upload',
				exclude: [ 'system/js/app' ]
			});

			modules.push( {
				name: 'system/js/timer',
				exclude: [ 'system/js/app' ]
			});
		}
		else {
			module = {
				name: controllers[ i ].replace( 'private/application/controllers/', '' ) + '/module',
				exclude: [ 'system/js/app' ]
			};

			t = grunt.file.read( controllers[ i ] + '/module.js' );
			m = t.match( /define\((.*)],/g );

			if ( m !== null ) {
				m[ 0 ] = m[ 0 ].replace( ']', '' );
				a = m[ 0 ].split( ',' );

				for ( j = 0, len2 = a.length; j < len2; j++ ) {
					a[ j ] = a[ j ].replace( /'/g, '' ).trim( );

					if ( a[ j ].indexOf( 'system/js/' ) !== -1 ) {
						module.exclude.push( a[ j ] );
					}
				}
			}

			modules.push( module );
		}
	}

	grunt.initConfig({
		awsebtdeploy: {
			staging: {
				options: {
					region: 'us-east-1',
					applicationName: 'Cinder',
					environmentCNAME: 'cinder-staging.us-east-1.elasticbeanstalk.com',
					environmentName: 'cr-staging',
					sourceBundle: 'dist/' + cur_version + '.zip',
					versionLabel: cur_version + '-staging-' + Date.now( ),
					healthPage: '/health',
					healthPageContents: new RegExp( 'Cinder is healthy.', 'ig' ),
					s3: {
						bucket: 'cr-versions'
					},
					accessKeyId: '',
					secretAccessKey: ''
				}
			},
			production: {
				options: {
					region: 'us-east-1',
					applicationName: 'Cinder',
					environmentCNAME: 'cinder-production.us-east-1.elasticbeanstalk.com',
					environmentName: 'cr-production',
					sourceBundle: 'dist/' + cur_version + '.zip',
					versionLabel: cur_version + '-production-' + Date.now( ),
					healthPage: '/health',
					healthPageContents: new RegExp( 'Cinder is healthy.', 'ig' ),
					s3: {
						bucket: 'cr-versions'
					},
					accessKeyId: '',
					secretAccessKey: ''
				}
			}
		},
		compress: {
			app: {
				options: {
					archive: 'dist/' + cur_version + '.zip',
					mode: 'zip',
					pretty: true
				},
				files: [
					{
						src: [
							'.ebextensions/**',
							'private/**',
							'!private/application/logs/*.php',
							'!private/schema/**',
							'!private/session/**',
							'public/**',
							'public/.htaccess',
							'!public/.htaccess.example',
							'public/.htpasswd',
							'!public/NetBoot/**'
						]
					}
				]
			}
		},
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
				'public/files/cache/system/css/svg.css',
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
					'adjoining-classes': false,
					'box-model': false,
					'box-sizing': false,
					'duplicate-background-images': false,
					'empty-rules': false,
					'ids': false,
					'import': false,
					'important': false,
					'overqualified-elements': false,
					'qualified-headings': false,
					'unique-headings': false,
					'universal-selector': false,
					'unqualified-attributes': false,
					'zero-units': false
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
		gitadd: {
			repo: {
				options: {
					force: true
				},
				files: {
					src: [
						'www/assets/fonts/*.eot',
						'www/assets/fonts/*.ttf',
						'www/assets/fonts/*.woff',
						'www/files/cache/rss_*'
					]
				}
			}
		},
		gitcommit: {
			repo: {
				options: {
					message: 'built application version ' + new_version + ' [grunt]'
				},
				files: [
					{
						src: '.gitignore'
					},
					{
						src: 'Gruntfile.js'
					},
					{
						src: 'license.txt'
					},
					{
						src: 'package.json'
					},
					{
						src: 'private',
						expand: true
					},
					{
						src: 'public',
						expand: true
					},
					{
						src: 'readme.md'
					}
				]
			}
		},
		githash: {
			current: {
				options: { }
			}
		},
		gitpull: {
			current: {
				options: {
					branch: '<%= githash.current.branch %>'
				}
			}
		},
		gitpush: {
			current: {
				options: {
					branch: '<%= githash.current.branch %>'
				}
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
				browser: true,
				curly: true,
				eqeqeq: true,
				loopfunc: false,
				plusplus: false,
				strict: true,
				undef: true,
				unused: 'vars',
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
						browsers: browsers
					})
				]
			},
			cache: {
				files: grunt.file.expandMapping( [ 'public/files/cache/**/css/*.css', '!public/files/cache/**/css/*.min.css' ] )
			}
		},
		replace: {
			patch: {
				src: [
					'package.json',
					'readme.md',
					'private/application/config/app.php'
				],
				overwrite: true,
				replacements: [{
						from: /"version": "([0-9.]*)",/,
						to: function( match ) {
							var p = match.split( '"' ),
								v = p[ 3 ].split( '.' );

							v[ 2 ] = parseInt( v[ 2 ], 10 ) + 1;

							p[ 3 ] = v.join( '.' );

							return p.join( '"' );
						}
					},
					{
						from: /([0-9.]*) beta/,
						to: function( match ) {
							var v = match.split( '.' );

							v[ 2 ] = parseInt( v[ 2 ], 10 ) + 1;

							return v.join( '.' ) + ' beta';
						}
					},
					{
						from: /\['version'] = '([0-9.]*)'/,
						to: function( match ) {
							var p = match.split( '\'' ),
								v = p[ 3 ].split( '.' );

							v[ 2 ] = parseInt( v[ 2 ], 10 ) + 1;

							p[ 3 ] = v.join( '.' );

							return p.join( '\'' );
						}
					}
				]
			},
			minor: {
				src: [
					'package.json',
					'readme.md',
					'private/application/config/app.php'
				],
				overwrite: true,
				replacements: [{
						from: /"version": "([0-9.]*)",/,
						to: function( match ) {
							var p = match.split( '"' ),
								v = p[ 3 ].split( '.' );

							v[ 1 ] = parseInt( v[ 1 ], 10 ) + 1;
							v[ 2 ] = 0;

							p[ 3 ] = v.join( '.' );

							return p.join( '"' );
						}
					},
					{
						from: /([0-9.]*) /,
						to: function( match ) {
							var v = match.split( '.' );

							v[ 1 ] = parseInt( v[ 1 ], 10 ) + 1;
							v[ 2 ] = 0;

							return v.join( '.' ) + ' beta';
						}
					},
					{
						from: /\['version'] = '([0-9.]*)'/,
						to: function( match ) {
							var p = match.split( '\'' ),
								v = p[ 3 ].split( '.' );

							v[ 1 ] = parseInt( v[ 1 ], 10 ) + 1;
							v[ 2 ] = 0;

							return v.join( '\'' );
						}
					}
				]
			},
			major: {
				src: [
					'package.json',
					'readme.md',
					'private/application/config/app.php'
				],
				overwrite: true,
				replacements: [{
						from: /"version": "([0-9.]*)",/,
						to: function( match ) {
							var p = match.split( '"' ),
								v = p[ 3 ].split( '.' );

							v[ 1 ] = parseInt( v[ 1 ], 10 ) + 1;
							v[ 2 ] = 0;

							p[ 3 ] = v.join( '.' );

							return p.join( '"' );
						}
					},
					{
						from: /([0-9.]*) /,
						to: function( match ) {
							var v = match.split( '.' );

							v[ 1 ] = parseInt( v[ 1 ], 10 ) + 1;
							v[ 2 ] = 0;

							return p.join( '.' ) + ' beta';
						}
					},
					{
						from: /\['version'] = '([0-9.]*)'/,
						to: function( match ) {
							var p = match.split( '\'' ),
								v = p[ 3 ].split( '.' );

							v[ 1 ] = parseInt( v[ 1 ], 10 ) + 1;
							v[ 2 ] = 0;

							p[ 3 ] = v.join( '.' );

							return p.join( '\'' );
						}
					}
				]
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
					modules: modules
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
			svg: {
				src: 'private/application/controllers/system/font/svg/*.svg',
				dest: 'private/application/controllers/system/font',
				destCss: 'private/application/controllers/system/css',
				options: {
					font: 'svg',
					fontFilename: 'system-{hash}',
					relativeFontPath: '/files/cache/system/font',
					engine: 'node',
					types: 'eot,woff,ttf',
					styles: 'font,icon,bootstrap',
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

	grunt.loadNpmTasks( 'grunt-awsebtdeploy' );
	grunt.loadNpmTasks( 'grunt-concurrent' );
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-compress' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-csslint' );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
	grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-requirejs' );
	grunt.loadNpmTasks( 'grunt-git' );
	grunt.loadNpmTasks( 'grunt-githash' );
	grunt.loadNpmTasks( 'grunt-newer' );
	grunt.loadNpmTasks( 'grunt-postcss' );
	grunt.loadNpmTasks( 'grunt-spritesmith' );
	grunt.loadNpmTasks( 'grunt-text-replace' );
	grunt.loadNpmTasks( 'grunt-webfont' );

	grunt.registerTask( 'default', [ 'concurrent:lint' ] );
	grunt.registerTask( 'assets', [ 'sprite', 'newer:copy' ] );
	grunt.registerTask( 'build', [ 'concurrent:lint', 'githash', 'gitpull', 'replace:patch', 'sprite', 'clean:fonts', 'webfont', 'requirejs', 'clean:build', 'postcss', 'concurrent:minify', 'gitadd', 'gitcommit', 'gitpush' ] );
	grunt.registerTask( 'deploy', [ 'clean:dist', 'compress:app' ] );

	grunt.registerTask( 'bump', [ 'replace:patch' ] );
	grunt.registerTask( 'patch', [ 'replace:patch' ] );
	grunt.registerTask( 'minor', [ 'replace:minor' ] );
	grunt.registerTask( 'major', [ 'replace:major' ] );
};
